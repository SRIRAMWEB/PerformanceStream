'use client';

import React, { createContext, useContext, useReducer, useRef, useEffect, useCallback } from 'react';
import { TokenBucketRateLimiter } from '../lib/rateLimiter.js';
import { createLedgerBlock, verifyLedgerChain, tamperLedgerRecord, GENESIS_HASH } from '../lib/chain.js';
import { REGISTERED_DEVICES, check1_whoSentIt, check2_wasItAltered, check3_isItFresh, check4_isInOrder, check5_doesItMakeSense } from '../lib/checks.js';
import { SCENARIO_LIST, generateScenarioPacket } from '../lib/scenarios.js';

const SimContext = createContext<any>(null);

const INITIAL_STATE: any = {
  protectionOn: true,
  speed: 'normal', // 'slow' (1000ms), 'normal' (400ms), 'fast' (150ms)
  stepThrough: false,
  waitingForStep: false,
  changedDelta: 88,
  floodBurst: 500,

  lastSeq: 100,
  lastHr: 148,
  registeredDevices: { ...REGISTERED_DEVICES },
  attackerKey: 'attacker-guess-key-32b',
  usedNonces: new Set(['n-replay-preused-001']),
  rollingBaseline: { mean: 148, std: 8 },

  counters: {
    trusted: 0,
    quarantined: 0,
    rejected: 0,
  },

  readings: [
    { seq: 96, hr: 145, outcome: 'TRUSTED', device_id: 'S-07', ts: Math.floor(Date.now() / 1000) - 20 },
    { seq: 97, hr: 146, outcome: 'TRUSTED', device_id: 'S-07', ts: Math.floor(Date.now() / 1000) - 15 },
    { seq: 98, hr: 147, outcome: 'TRUSTED', device_id: 'S-07', ts: Math.floor(Date.now() / 1000) - 10 },
    { seq: 99, hr: 148, outcome: 'TRUSTED', device_id: 'S-07', ts: Math.floor(Date.now() / 1000) - 5 },
    { seq: 100, hr: 148, outcome: 'TRUSTED', device_id: 'S-07', ts: Math.floor(Date.now() / 1000) },
  ],

  ledgerChain: [],
  securityLogs: [
    {
      id: 'init-log-0',
      time: '20:40:00',
      type: 'ALL',
      level: 'INFO',
      device_id: 'S-07',
      message: 'Telemetry gateway initialized. Device S-07 key loaded from vault.',
    },
  ],

  isRunning: false,
  activeScenarioId: null,
  currentPacket: null,
  verdict: 'IDLE', // 'IDLE', 'CHECKING', 'TRUSTED', 'QUARANTINED', 'REJECTED', 'UNAVAILABLE'
  verdictText: 'Standing by: select a scenario or run all attacks',
  activeCheckIndex: -1,
  checkStatuses: [
    { state: 'idle' },
    { state: 'idle' },
    { state: 'idle' },
    { state: 'idle' },
    { state: 'idle' },
  ],

  // Drawers
  logDrawerOpen: false,
  traceDrawerOpen: false,
  shortcutsModalOpen: false,
  selectedTraceReading: null,
  chainStatus: { valid: true, message: 'All ledger blocks verified (OK)' },
  availabilityMeter: 100,
};

function simReducer(state, action) {
  switch (action.type) {
    case 'SET_PROTECTION':
      return { ...state, protectionOn: action.payload };
    case 'SET_SPEED':
      return { ...state, speed: action.payload };
    case 'SET_STEP_THROUGH':
      return { ...state, stepThrough: action.payload };
    case 'SET_WAITING_STEP':
      return { ...state, waitingForStep: action.payload };
    case 'SET_CHANGED_DELTA':
      return { ...state, changedDelta: action.payload };
    case 'SET_FLOOD_BURST':
      return { ...state, floodBurst: action.payload };

    case 'START_RUN':
      return {
        ...state,
        isRunning: true,
        activeScenarioId: action.scenarioId,
        currentPacket: action.packet,
        verdict: 'CHECKING',
        verdictText: 'Evaluating ingress packet across 5 checkpoints...',
        checkStatuses: [
          { state: 'idle' },
          { state: 'idle' },
          { state: 'idle' },
          { state: 'idle' },
          { state: 'idle' },
        ],
        activeCheckIndex: -1,
      };

    case 'UPDATE_CHECKS':
      return {
        ...state,
        activeCheckIndex: action.activeCheckIndex,
        checkStatuses: action.checkStatuses,
        verdictText: action.verdictText || state.verdictText,
      };

    case 'FINISH_EVALUATION': {
      const { outcome, verdictText, packet, alert } = action;

      // Update counters
      const newCounters = { ...state.counters };
      if (outcome === 'TRUSTED') newCounters.trusted += 1;
      else if (outcome === 'QUARANTINED') newCounters.quarantined += 1;
      else if (outcome === 'REJECTED') newCounters.rejected += 1;

      // Append to security logs
      const timeStr = new Date().toTimeString().split(' ')[0];
      const newLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        time: timeStr,
        type: outcome,
        level: outcome === 'REJECTED' ? 'REJECT' : outcome === 'QUARANTINED' ? 'QUARANTINE' : 'INFO',
        device_id: packet.device_id,
        message: verdictText + (alert ? ` [Alert: ${alert}]` : ''),
      };

      // State updates
      const updatedNonces = new Set(state.usedNonces);
      if (outcome === 'TRUSTED' || outcome === 'QUARANTINED') {
        updatedNonces.add(packet.nonce);
      }

      const newReadings = [...state.readings];
      if (outcome === 'TRUSTED') {
        newReadings.push({
          seq: packet.seq,
          hr: packet.value,
          outcome: 'TRUSTED',
          device_id: packet.device_id,
          ts: packet.ts,
          nonce: packet.nonce,
          sig: packet.sig,
        });
      } else if (outcome === 'QUARANTINED') {
        newReadings.push({
          seq: packet.seq,
          hr: packet.value,
          outcome: 'QUARANTINED',
          device_id: packet.device_id,
          ts: packet.ts,
          nonce: packet.nonce,
          sig: packet.sig,
        });
      }

      return {
        ...state,
        counters: newCounters,
        verdict: outcome,
        verdictText,
        lastSeq: outcome === 'TRUSTED' ? packet.seq : state.lastSeq,
        lastHr: outcome === 'TRUSTED' ? packet.value : state.lastHr,
        usedNonces: updatedNonces,
        readings: newReadings,
        securityLogs: [newLog, ...state.securityLogs],
        activeCheckIndex: -1,
      };
    }

    case 'APPEND_LEDGER_BLOCK':
      return {
        ...state,
        ledgerChain: [...state.ledgerChain, action.payload],
      };

    case 'SET_LEDGER_CHAIN':
      return {
        ...state,
        ledgerChain: action.payload,
      };

    case 'SET_CHAIN_STATUS':
      return {
        ...state,
        chainStatus: action.payload,
      };

    case 'SET_AVAILABILITY':
      return {
        ...state,
        availabilityMeter: action.payload,
      };

    case 'STOP_RUN':
      return {
        ...state,
        isRunning: false,
        activeScenarioId: null,
        activeCheckIndex: -1,
        waitingForStep: false,
      };

    case 'RESET_SIMULATOR':
      return {
        ...INITIAL_STATE,
        usedNonces: new Set(INITIAL_STATE.usedNonces),
      };

    case 'SET_DRAWER':
      return {
        ...state,
        [action.drawer]: action.value,
        selectedTraceReading: action.traceReading !== undefined ? action.traceReading : state.selectedTraceReading,
      };

    default:
      return state;
  }
}

export function SimProvider({ children }) {
  const [state, dispatch] = useReducer(simReducer, INITIAL_STATE);
  const rateLimiterRef = useRef(new TokenBucketRateLimiter(20, 20));
  const runTokenRef = useRef(0);
  const stepResolverRef = useRef<(() => void) | null>(null);

  // Initialize genesis hash chain
  useEffect(() => {
    async function initChain() {
      let prev = GENESIS_HASH;
      const initialBlocks: any[] = [];
      for (const r of INITIAL_STATE.readings) {
        const block = await createLedgerBlock(
          {
            device_id: r.device_id,
            metric: 'hr',
            value: r.hr,
            seq: r.seq,
            ts: r.ts,
            nonce: `n-init-${r.seq}`,
            sig: '4a9b21f0c4init...',
          },
          prev
        );
        initialBlocks.push(block);
        prev = block.hash;
      }
      dispatch({ type: 'SET_LEDGER_CHAIN', payload: initialBlocks });
    }
    initChain();
  }, []);

  const getDelay = (speed) => {
    if (speed === 'slow') return 1000;
    if (speed === 'fast') return 150;
    return 400; // normal
  };

  const sleep = (ms, token) =>
    new Promise((resolve) => {
      const t = setTimeout(() => {
        if (runTokenRef.current === token) resolve(true);
        else resolve(false);
      }, ms);
    });

  const waitForStep = (token) => {
    if (!state.stepThrough) return Promise.resolve(true);
    dispatch({ type: 'SET_WAITING_STEP', payload: true });
    return new Promise((resolve) => {
      stepResolverRef.current = () => {
        dispatch({ type: 'SET_WAITING_STEP', payload: false });
        if (runTokenRef.current === token) resolve(true);
        else resolve(false);
      };
    });
  };

  const executeScenario = useCallback(
    async (scenarioId, token) => {
      const scenario = SCENARIO_LIST.find((s) => s.id === scenarioId);
      if (!scenario) return false;

      const packet = await generateScenarioPacket(scenarioId, state, {
        changedDelta: state.changedDelta,
        floodBurst: state.floodBurst,
      });

      dispatch({ type: 'START_RUN', scenarioId, packet });

      // Handle flood behavior
      if (packet.isFlood) {
        const consumeRes = rateLimiterRef.current.tryConsume(packet.burstRate);
        const avail = rateLimiterRef.current.getAvailabilityMeter();
        dispatch({ type: 'SET_AVAILABILITY', payload: avail });

        if (!state.protectionOn) {
          // With protection OFF: Flood freezes dashboard ("unavailable")
          await sleep(600, token);
          dispatch({
            type: 'FINISH_EVALUATION',
            outcome: 'UNAVAILABLE',
            verdictText: 'System Unavailable: Ingress API saturated with 500 req/s. Dashboard frozen.',
            packet,
            alert: 'DDoS flood',
          });
          return true;
        }

        // With protection ON: Token-bucket rate limiter drops burst at gateway perimeter
        dispatch({
          type: 'FINISH_EVALUATION',
          outcome: 'TRUSTED',
          verdictText: `Flood Stopped: Rate limiter shed ${consumeRes.shed} burst requests at gateway. Legitimate telemetry passed.`,
          packet,
          alert: 'burst shed',
        });
        return true;
      }

      // Check if Protection is turned OFF:
      if (!state.protectionOn) {
        // With protection OFF: attacks bypass checks and reach coach dashboard!
        const delay = getDelay(state.speed);
        await sleep(delay, token);

        let attackOutcome = 'TRUSTED';
        let attackVerdict = `Accepted [PROTECTION OFF]: ${scenario.name} reached dashboard uninspected.`;

        if (scenarioId === 'changed_value') {
          attackVerdict = `Accepted [PROTECTION OFF]: Manipulated value (${packet.value} bpm) entered coach trendline!`;
        } else if (scenarioId === 'fake_sensor') {
          attackVerdict = `Accepted [PROTECTION OFF]: Unauthorized sensor ${packet.device_id} entered system!`;
        } else if (scenarioId === 'stolen_key') {
          attackVerdict = `Accepted [PROTECTION OFF]: Impossible 400 bpm reading displayed to coach!`;
        }

        dispatch({
          type: 'FINISH_EVALUATION',
          outcome: attackOutcome,
          verdictText: attackVerdict,
          packet,
          alert: 'uninspected attack',
        });
        return true;
      }

      // Protection is ON: Sequential 5-Check Gate
      const delay = getDelay(state.speed);
      const statuses: any[] = [
        { state: 'idle' },
        { state: 'idle' },
        { state: 'idle' },
        { state: 'idle' },
        { state: 'idle' },
      ];

      // Check 1: Who sent it?
      statuses[0] = { state: 'checking' };
      dispatch({ type: 'UPDATE_CHECKS', activeCheckIndex: 0, checkStatuses: [...statuses] });
      if (!(await sleep(delay, token))) return false;
      if (!(await waitForStep(token))) return false;

      const c1 = check1_whoSentIt(packet, state);
      if (!c1.pass) {
        statuses[0] = { state: 'fail', reason: c1.reason };
        for (let i = 1; i < 5; i++) statuses[i] = { state: 'skipped' };
        dispatch({ type: 'UPDATE_CHECKS', activeCheckIndex: -1, checkStatuses: [...statuses] });
        dispatch({
          type: 'FINISH_EVALUATION',
          outcome: 'REJECTED',
          verdictText: c1.reason,
          packet,
        });
        return true;
      }
      statuses[0] = { state: 'pass', reason: c1.reason };
      dispatch({ type: 'UPDATE_CHECKS', activeCheckIndex: -1, checkStatuses: [...statuses] });

      // Check 2: Was it altered?
      statuses[1] = { state: 'checking' };
      dispatch({ type: 'UPDATE_CHECKS', activeCheckIndex: 1, checkStatuses: [...statuses] });
      if (!(await sleep(delay, token))) return false;
      if (!(await waitForStep(token))) return false;

      const c2 = await check2_wasItAltered(packet, state);
      if (!c2.pass) {
        statuses[1] = { state: 'fail', reason: c2.reason };
        for (let i = 2; i < 5; i++) statuses[i] = { state: 'skipped' };
        dispatch({ type: 'UPDATE_CHECKS', activeCheckIndex: -1, checkStatuses: [...statuses] });
        dispatch({
          type: 'FINISH_EVALUATION',
          outcome: 'REJECTED',
          verdictText: c2.reason,
          packet,
        });
        return true;
      }
      statuses[1] = { state: 'pass', reason: c2.reason };
      dispatch({ type: 'UPDATE_CHECKS', activeCheckIndex: -1, checkStatuses: [...statuses] });

      // Check 3: Is it fresh?
      statuses[2] = { state: 'checking' };
      dispatch({ type: 'UPDATE_CHECKS', activeCheckIndex: 2, checkStatuses: [...statuses] });
      if (!(await sleep(delay, token))) return false;
      if (!(await waitForStep(token))) return false;

      const now = Math.floor(Date.now() / 1000);
      const c3 = check3_isItFresh(packet, state, now);
      if (!c3.pass) {
        statuses[2] = { state: 'fail', reason: c3.reason };
        for (let i = 3; i < 5; i++) statuses[i] = { state: 'skipped' };
        dispatch({ type: 'UPDATE_CHECKS', activeCheckIndex: -1, checkStatuses: [...statuses] });
        dispatch({
          type: 'FINISH_EVALUATION',
          outcome: 'REJECTED',
          verdictText: c3.reason,
          packet,
        });
        return true;
      }
      statuses[2] = { state: 'pass', reason: c3.reason };
      dispatch({ type: 'UPDATE_CHECKS', activeCheckIndex: -1, checkStatuses: [...statuses] });

      // Check 4: Is it in order?
      statuses[3] = { state: 'checking' };
      dispatch({ type: 'UPDATE_CHECKS', activeCheckIndex: 3, checkStatuses: [...statuses] });
      if (!(await sleep(delay, token))) return false;
      if (!(await waitForStep(token))) return false;

      const c4 = check4_isInOrder(packet, state);
      if (!c4.pass) {
        statuses[3] = { state: 'flag', reason: c4.reason };
        statuses[4] = { state: 'skipped' };
        dispatch({ type: 'UPDATE_CHECKS', activeCheckIndex: -1, checkStatuses: [...statuses] });
        dispatch({
          type: 'FINISH_EVALUATION',
          outcome: 'QUARANTINED',
          verdictText: c4.reason,
          packet,
          alert: c4.alert,
        });
        return true;
      }
      statuses[3] = { state: 'pass', reason: c4.reason };
      dispatch({ type: 'UPDATE_CHECKS', activeCheckIndex: -1, checkStatuses: [...statuses] });

      // Check 5: Does it make sense?
      statuses[4] = { state: 'checking' };
      dispatch({ type: 'UPDATE_CHECKS', activeCheckIndex: 4, checkStatuses: [...statuses] });
      if (!(await sleep(delay, token))) return false;
      if (!(await waitForStep(token))) return false;

      const c5 = check5_doesItMakeSense(packet, state);
      if (!c5.pass) {
        statuses[4] = { state: 'flag', reason: c5.reason };
        dispatch({ type: 'UPDATE_CHECKS', activeCheckIndex: -1, checkStatuses: [...statuses] });
        dispatch({
          type: 'FINISH_EVALUATION',
          outcome: 'QUARANTINED',
          verdictText: c5.reason,
          packet,
          alert: c5.alert,
        });
        return true;
      }
      statuses[4] = { state: 'pass', reason: c5.reason };
      dispatch({ type: 'UPDATE_CHECKS', activeCheckIndex: -1, checkStatuses: [...statuses] });

      // ALL 5 CHECKS PASSED -> TRUSTED
      const lastBlock = state.ledgerChain[state.ledgerChain.length - 1];
      const prevHash = lastBlock ? lastBlock.hash : GENESIS_HASH;
      const newBlock = await createLedgerBlock(packet, prevHash);
      dispatch({ type: 'APPEND_LEDGER_BLOCK', payload: newBlock });

      dispatch({
        type: 'FINISH_EVALUATION',
        outcome: 'TRUSTED',
        verdictText: `Verified 5/5 checks. Telemetry accepted and chained into immutable ledger block #${packet.seq}.`,
        packet,
      });
      return true;
    },
    [state]
  );

  const runSingleScenario = (scenarioId) => {
    if (state.isRunning) return;
    runTokenRef.current += 1;
    const token = runTokenRef.current;
    executeScenario(scenarioId, token).finally(() => {
      if (runTokenRef.current === token) {
        dispatch({ type: 'STOP_RUN' });
      }
    });
  };

  const playAll = async () => {
    if (state.isRunning) return;
    runTokenRef.current += 1;
    const token = runTokenRef.current;

    const playSequence = [
      'normal',
      'fake_sensor',
      'normal',
      'changed_value',
      'normal',
      'replay_old_data',
      'normal',
      'missing_readings',
      'normal',
      'stolen_key',
      'normal',
      'flood',
      'normal',
    ];

    for (let i = 0; i < playSequence.length; i++) {
      if (runTokenRef.current !== token) break;
      const scId = playSequence[i];
      const success = await executeScenario(scId, token);
      if (!success || runTokenRef.current !== token) break;
      const gap = getDelay(state.speed) * 2;
      const cont = await sleep(gap, token);
      if (!cont) break;
    }

    if (runTokenRef.current === token) {
      dispatch({ type: 'STOP_RUN' });
    }
  };

  const stopRun = () => {
    runTokenRef.current += 1;
    if (stepResolverRef.current) {
      stepResolverRef.current();
      stepResolverRef.current = null;
    }
    dispatch({ type: 'STOP_RUN' });
  };

  const nextStep = () => {
    if (stepResolverRef.current) {
      stepResolverRef.current();
      stepResolverRef.current = null;
    }
  };

  const resetAll = () => {
    stopRun();
    rateLimiterRef.current.reset();
    dispatch({ type: 'RESET_SIMULATOR' });
  };

  const verifyChain = async () => {
    const res = await verifyLedgerChain(state.ledgerChain);
    dispatch({ type: 'SET_CHAIN_STATUS', payload: res });
    return res;
  };

  const tamperChain = (index = 0) => {
    const tampered = tamperLedgerRecord(state.ledgerChain, index, 'value', 999);
    dispatch({ type: 'SET_LEDGER_CHAIN', payload: tampered });
    dispatch({
      type: 'SET_CHAIN_STATUS',
      payload: { valid: false, brokenIndex: index, message: `Record #${tampered[index].index} was manipulated in history!` },
    });
  };

  const downloadCsv = () => {
    const headers = ['Timestamp', 'Type', 'Device_ID', 'Message'];
    const rows = state.securityLogs.map((l) => [
      `"${l.time}"`,
      `"${l.type}"`,
      `"${l.device_id}"`,
      `"${l.message.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `performancestream-audit-log-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <SimContext.Provider
      value={{
        ...state,
        dispatch,
        runSingleScenario,
        playAll,
        stopRun,
        nextStep,
        resetAll,
        verifyChain,
        tamperChain,
        downloadCsv,
      }}
    >
      {children}
    </SimContext.Provider>
  );
}

export function useSim() {
  const ctx = useContext(SimContext);
  if (!ctx) {
    throw new Error('useSim must be used within a SimProvider');
  }
  return ctx;
}
