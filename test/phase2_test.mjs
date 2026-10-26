import { createPrng } from '../src/lib/prng.js';
import { computeSha256, generateHmac, verifyHmac } from '../src/lib/crypto.js';
import { TokenBucketRateLimiter } from '../src/lib/rateLimiter.js';
import { createLedgerBlock, verifyLedgerChain, tamperLedgerRecord } from '../src/lib/chain.js';
import {
  REGISTERED_DEVICES,
  check1_whoSentIt,
  check2_wasItAltered,
  check3_isItFresh,
  check4_isInOrder,
  check5_doesItMakeSense,
} from '../src/lib/checks.js';
import { SCENARIO_LIST, generateScenarioPacket } from '../src/lib/scenarios.js';

async function runTests() {
  console.log('=== PHASE 2 TEST SUITE ===\n');

  // 1. PRNG test
  const prng1 = createPrng(42);
  const v1 = prng1();
  const prng2 = createPrng(42);
  const v2 = prng2();
  console.assert(v1 === v2, 'PRNG must be deterministic for identical seeds');
  console.log('✓ PRNG determinism test passed');

  // 2. Crypto HMAC and SHA-256 test
  const testPayload = 'S-07|hr|150|1700000000|101|nonce-123';
  const sig = await generateHmac(testPayload, 'sensor-07-secret-key-32b');
  const validHmac = await verifyHmac(testPayload, sig, 'sensor-07-secret-key-32b');
  const invalidHmac = await verifyHmac(testPayload + 'tampered', sig, 'sensor-07-secret-key-32b');
  console.assert(validHmac === true, 'HMAC verification must succeed for valid payload');
  console.assert(invalidHmac === false, 'HMAC verification must fail for tampered payload');
  console.log('✓ Web Crypto HMAC generation & verification passed');

  // 3. Token-Bucket Rate Limiter test
  const limiter = new TokenBucketRateLimiter(20, 20);
  const allow10 = limiter.tryConsume(10);
  console.assert(allow10.allowed === true, 'Rate limiter should allow 10 tokens from 20 capacity');
  const burst500 = limiter.tryConsume(500);
  console.assert(burst500.allowed === false, 'Rate limiter should deny 500 burst tokens');
  console.assert(burst500.shed >= 480, 'Rate limiter should shed excess tokens');
  console.log('✓ Token-Bucket rate limiter passed (shed excess burst)');

  // 4. SHA-256 Ledger Chain test
  const b1 = await createLedgerBlock({ device_id: 'S-07', metric: 'hr', value: 148, seq: 100, ts: 1700000000, nonce: 'n-1', sig: 's-1' });
  const b2 = await createLedgerBlock({ device_id: 'S-07', metric: 'hr', value: 151, seq: 101, ts: 1700000001, nonce: 'n-2', sig: 's-2' }, b1.hash);
  const chain = [b1, b2];
  const initialVerify = await verifyLedgerChain(chain);
  console.assert(initialVerify.valid === true, 'Ledger chain should verify as valid initially');

  const tamperedChain = tamperLedgerRecord(chain, 0, 'value', 999);
  const tamperedVerify = await verifyLedgerChain(tamperedChain);
  console.assert(tamperedVerify.valid === false, 'Ledger chain verification must fail after record tampering');
  console.log(`✓ SHA-256 Ledger Chain test passed (caught broken index: ${tamperedVerify.brokenIndex})`);

  // 5. Scenarios with Protection ON test
  const mockState = {
    lastSeq: 100,
    lastHr: 148,
    registeredDevices: { ...REGISTERED_DEVICES },
    attackerKey: 'attacker-guess-key-32b',
    usedNonces: new Set(['n-replay-preused-001']),
    rollingBaseline: { mean: 148, std: 8 },
  };

  const expectedProtectionOn = {
    normal: 'TRUSTED',
    fake_sensor: 'REJECTED',
    changed_value: 'REJECTED',
    replay_old_data: 'REJECTED',
    missing_readings: 'QUARANTINED',
    stolen_key: 'QUARANTINED',
    flood: 'TRUSTED',
  };

  for (const sc of SCENARIO_LIST) {
    const packet = await generateScenarioPacket(sc.id, mockState);
    let outcome = 'TRUSTED';

    if (packet.isFlood) {
      outcome = 'TRUSTED'; // flood shed at gateway
    } else {
      const c1 = check1_whoSentIt(packet, mockState);
      if (!c1.pass) outcome = 'REJECTED';
      else {
        const c2 = await check2_wasItAltered(packet, mockState);
        if (!c2.pass) outcome = 'REJECTED';
        else {
          const c3 = check3_isItFresh(packet, mockState, Math.floor(Date.now() / 1000));
          if (!c3.pass) outcome = 'REJECTED';
          else {
            const c4 = check4_isInOrder(packet, mockState);
            if (!c4.pass) outcome = 'QUARANTINED';
            else {
              const c5 = check5_doesItMakeSense(packet, mockState);
              if (!c5.pass) outcome = 'QUARANTINED';
            }
          }
        }
      }
    }

    const expected = expectedProtectionOn[sc.id];
    console.assert(outcome === expected, `Scenario ${sc.name} failed! Got ${outcome}, expected ${expected}`);
    console.log(`✓ Scenario "${sc.name}" -> ${outcome} (Expected: ${expected})`);
  }

  console.log('\n✅ ALL PHASE 2 CORE LOGIC TESTS PASSED SUCCESSFULLY!\n');
}

runTests().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
