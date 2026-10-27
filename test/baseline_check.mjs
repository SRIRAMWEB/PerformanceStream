import { createPrng } from '../src/lib/prng.js';
import { computeSha256, generateHmac, verifyHmac } from '../src/lib/crypto.js';
import { TokenBucketRateLimiter } from '../src/lib/rateLimiter.js';
import { createLedgerBlock, verifyLedgerChain, tamperLedgerRecord, GENESIS_HASH } from '../src/lib/chain.js';
import {
  REGISTERED_DEVICES,
  check1_whoSentIt,
  check2_wasItAltered,
  check3_isItFresh,
  check4_isInOrder,
  check5_doesItMakeSense,
} from '../src/lib/checks.js';
import { SCENARIO_LIST, generateScenarioPacket } from '../src/lib/scenarios.js';

async function simulateScenario(scenarioId, protectionOn, initialState = null) {
  const state = initialState ? { ...initialState } : {
    protectionOn,
    lastSeq: 100,
    lastHr: 148,
    registeredDevices: { ...REGISTERED_DEVICES },
    attackerKey: 'attacker-guess-key-32b',
    usedNonces: new Set(['n-replay-preused-001']),
    rollingBaseline: { mean: 148, std: 8 },
    counters: { trusted: 0, quarantined: 0, rejected: 0 },
    readings: [
      { seq: 96, hr: 145, outcome: 'TRUSTED', device_id: 'S-07', ts: 1700000000 },
      { seq: 97, hr: 146, outcome: 'TRUSTED', device_id: 'S-07', ts: 1700000005 },
      { seq: 98, hr: 147, outcome: 'TRUSTED', device_id: 'S-07', ts: 1700000010 },
      { seq: 99, hr: 148, outcome: 'TRUSTED', device_id: 'S-07', ts: 1700000015 },
      { seq: 100, hr: 148, outcome: 'TRUSTED', device_id: 'S-07', ts: 1700000020 },
    ],
    ledgerChain: [],
  };

  // Init ledger chain
  if (!state.ledgerChain || state.ledgerChain.length === 0) {
    let prev = GENESIS_HASH;
    state.ledgerChain = [];
    for (const r of state.readings) {
      const block = await createLedgerBlock(
        {
          device_id: r.device_id,
          metric: 'hr',
          value: r.hr,
          seq: r.seq,
          ts: r.ts,
          nonce: `n-init-${r.seq}`,
          sig: 'init-sig',
        },
        prev
      );
      state.ledgerChain.push(block);
      prev = block.hash;
    }
  }

  const packet = await generateScenarioPacket(scenarioId, state, {
    changedDelta: 88,
    floodBurst: 500,
  });

  const rateLimiter = new TokenBucketRateLimiter(20, 20);
  let firedCheck = 'None';
  let outcome = 'TRUSTED';

  if (packet.isFlood) {
    rateLimiter.tryConsume(packet.burstRate);
    if (!protectionOn) {
      outcome = 'UNAVAILABLE';
      firedCheck = 'Rate Limiter (Disabled -> Frozen)';
    } else {
      outcome = 'TRUSTED';
      firedCheck = 'Perimeter Rate Limiter (Shed burst)';
    }
  } else if (!protectionOn) {
    outcome = 'TRUSTED';
    firedCheck = 'None (Bypassed - Protection OFF)';
  } else {
    // Protection ON: sequential checks
    const c1 = check1_whoSentIt(packet, state);
    if (!c1.pass) {
      firedCheck = 'Check 1 (Who sent it?)';
      outcome = 'REJECTED';
    } else {
      const c2 = await check2_wasItAltered(packet, state);
      if (!c2.pass) {
        firedCheck = 'Check 2 (Was it altered?)';
        outcome = 'REJECTED';
      } else {
        const c3 = check3_isItFresh(packet, state, Math.floor(Date.now() / 1000));
        if (!c3.pass) {
          firedCheck = 'Check 3 (Is it fresh?)';
          outcome = 'REJECTED';
        } else {
          const c4 = check4_isInOrder(packet, state);
          if (!c4.pass) {
            firedCheck = 'Check 4 (Is it in order?)';
            outcome = 'QUARANTINED';
          } else {
            const c5 = check5_doesItMakeSense(packet, state);
            if (!c5.pass) {
              firedCheck = 'Check 5 (Does it make sense?)';
              outcome = 'QUARANTINED';
            } else {
              firedCheck = 'All 5 Passed';
              outcome = 'TRUSTED';
              const lastBlock = state.ledgerChain[state.ledgerChain.length - 1];
              const prevHash = lastBlock ? lastBlock.hash : GENESIS_HASH;
              const newBlock = await createLedgerBlock(packet, prevHash);
              state.ledgerChain.push(newBlock);
            }
          }
        }
      }
    }
  }

  // Update counters
  const counters = { ...state.counters };
  if (outcome === 'TRUSTED') counters.trusted += 1;
  else if (outcome === 'QUARANTINED') counters.quarantined += 1;
  else if (outcome === 'REJECTED') counters.rejected += 1;

  const total = counters.trusted + counters.quarantined + counters.rejected;
  const trustPercent = total > 0 ? Math.round((counters.trusted / total) * 100) : 100;
  const chainVerify = await verifyLedgerChain(state.ledgerChain);

  return {
    scenarioId,
    protectionOn,
    firedCheck,
    outcome,
    counters,
    trustPercent,
    ledgerStatus: chainVerify.valid ? `Valid (${state.ledgerChain.length} blocks)` : 'Invalid',
  };
}

async function runAll() {
  console.log('--- INDIVIDUAL SCENARIOS BASELINE (from clean initial state) ---');
  for (const prot of [true, false]) {
    console.log(`\n### Protection ${prot ? 'ON' : 'OFF'}:`);
    for (const sc of SCENARIO_LIST) {
      const res = await simulateScenario(sc.id, prot);
      console.log(
        `| ${sc.name.padEnd(18)} | ${res.firedCheck.padEnd(35)} | T:${res.counters.trusted} Q:${res.counters.quarantined} R:${res.counters.rejected} | ${res.trustPercent}% | ${res.ledgerStatus} |`
      );
    }
  }

  console.log('\n--- CUMULATIVE RUN BASELINE (7 scenarios executed in sequence) ---');
  for (const prot of [true, false]) {
    console.log(`\n### Protection ${prot ? 'ON' : 'OFF'} (Cumulative):`);
    let cumCounters = { trusted: 0, quarantined: 0, rejected: 0 };
    for (const sc of SCENARIO_LIST) {
      const res = await simulateScenario(sc.id, prot);
      if (res.outcome === 'TRUSTED') cumCounters.trusted += 1;
      else if (res.outcome === 'QUARANTINED') cumCounters.quarantined += 1;
      else if (res.outcome === 'REJECTED') cumCounters.rejected += 1;
      const total = cumCounters.trusted + cumCounters.quarantined + cumCounters.rejected;
      const trustPct = total > 0 ? Math.round((cumCounters.trusted / total) * 100) : 100;
      console.log(
        `| ${sc.name.padEnd(18)} | ${res.firedCheck.padEnd(35)} | T:${cumCounters.trusted} Q:${cumCounters.quarantined} R:${cumCounters.rejected} | ${trustPct}% | ${res.ledgerStatus} |`
      );
    }
  }
}

runAll().catch(console.error);
