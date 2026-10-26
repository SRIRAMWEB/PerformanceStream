'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  INITIAL_GATE_STATE,
  SCENARIO_PRESETS,
  check1_whoSentIt,
  check2_wasItAltered,
  check3_isItFresh,
  check4_isInOrder,
  check5_doesItMakeSense,
} from '../../src/lib/gate';
import { PipelineCard, CheckStatus, ReadingPoint } from './PipelineCard';
import { DashboardCard, DashboardReading } from './DashboardCard';
import { PacketCard, PacketData } from './PacketCard';
import { ScenarioCard } from './ScenarioCard';
import { LogCard, SecurityLogEntry } from './LogCard';
import { ZonesCard } from './ZonesCard';
import { FourStepSolution } from './FourStepSolution';
import { ClosingRow } from './ClosingRow';
import { EcgDivider } from './EcgDivider';

export function PerformanceStreamConsole() {
  // Theme state: dark / light
  const [isDark, setIsDark] = useState<boolean>(false);

  // Initialize theme from system preference on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  // Pipeline Engine State
  const [gateState, setGateState] = useState(() => ({
    ...INITIAL_GATE_STATE,
    usedNonces: new Set(INITIAL_GATE_STATE.usedNonces),
  }));

  // Execution status
  const [isRunning, setIsRunning] = useState(false);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<'IDLE' | 'CHECKING' | 'ACCEPTED' | 'QUARANTINED' | 'REJECTED'>('IDLE');
  const [verdictText, setVerdictText] = useState('Standby: awaiting telemetry ingress');
  const [activeCheckIndex, setActiveCheckIndex] = useState<number>(-1);

  // Current checks status
  const [checkStatuses, setCheckStatuses] = useState<CheckStatus[]>([
    { state: 'idle' },
    { state: 'idle' },
    { state: 'idle' },
    { state: 'idle' },
    { state: 'idle' },
  ]);

  // Current incoming packet
  const [currentPacket, setCurrentPacket] = useState<PacketData | null>(null);

  // Narration
  const [narration, setNarration] = useState<{
    actor: 'Sensor' | 'Attacker' | 'System';
    caption: string;
  } | null>(null);

  // Counters
  const [trustedCount, setTrustedCount] = useState<number>(5);
  const [quarantinedCount, setQuarantinedCount] = useState<number>(0);
  const [rejectedCount, setRejectedCount] = useState<number>(0);

  // Readings history for Dashboard & Graph
  const [readingsList, setReadingsList] = useState<DashboardReading[]>([
    {
      id: 'init-100',
      sensor: 'S-07',
      hr: 148,
      seq: 100,
      nonce: 'n-init100',
      ts: Math.floor(Date.now() / 1000) - 20,
      sig: '4a9b21f0c4...',
      outcome: 'TRUSTED',
      receivedAt: 'Baseline',
    },
    {
      id: 'init-99',
      sensor: 'S-07',
      hr: 148,
      seq: 99,
      nonce: 'n-init99',
      ts: Math.floor(Date.now() / 1000) - 25,
      sig: '3e1189ac02...',
      outcome: 'TRUSTED',
      receivedAt: 'Baseline',
    },
    {
      id: 'init-98',
      sensor: 'S-07',
      hr: 147,
      seq: 98,
      nonce: 'n-init98',
      ts: Math.floor(Date.now() / 1000) - 30,
      sig: '88fa2b109c...',
      outcome: 'TRUSTED',
      receivedAt: 'Baseline',
    },
  ]);

  const [graphPoints, setGraphPoints] = useState<ReadingPoint[]>([
    { seq: 96, hr: 145, outcome: 'TRUSTED' },
    { seq: 97, hr: 146, outcome: 'TRUSTED' },
    { seq: 98, hr: 147, outcome: 'TRUSTED' },
    { seq: 99, hr: 148, outcome: 'TRUSTED' },
    { seq: 100, hr: 148, outcome: 'TRUSTED' },
  ]);

  // Security Audit Log
  const [securityLogs, setSecurityLogs] = useState<SecurityLogEntry[]>([
    {
      id: 'log-0',
      time: '20:40:00',
      type: 'TRUST',
      sensor: 'S-07',
      message: 'Sensor initialized. Baseline sequence #100 synchronized with vault.',
    },
  ]);

  // Execution control ref
  const executionTokenRef = useRef<number>(0);

  const getFormatTime = () => {
    const d = new Date();
    return d.toTimeString().split(' ')[0];
  };

  /**
   * Helper sleep with execution abort checking
   */
  const sleep = (ms: number, token: number) => {
    return new Promise<boolean>((resolve) => {
      const timer = setTimeout(() => {
        if (executionTokenRef.current !== token) {
          resolve(false);
        } else {
          resolve(true);
        }
      }, ms);
    });
  };

  /**
   * Run a single scenario through the 5-step gate
   */
  const executeScenario = useCallback(
    async (scenarioId: string, token: number): Promise<boolean> => {
      const scenario = SCENARIO_PRESETS.find((s) => s.id === scenarioId);
      if (!scenario) return false;

      setActiveScenarioId(scenarioId);
      setNarration({
        actor: scenario.actor as 'Sensor' | 'Attacker' | 'System',
        caption: scenario.caption,
      });

      const now = Math.floor(Date.now() / 1000);
      const packet = await scenario.generatePacket(gateState, now);

      // Handle flood volumetric ramp
      if (scenario.isFlood) {
        setCurrentPacket({
          ...packet,
          isFlood: true,
          floodRate: 500,
          droppedCount: 480,
        });

        // Add rate limit log
        const timeStr = getFormatTime();
        setSecurityLogs((prev) => [
          {
            id: `log-flood-${Date.now()}`,
            time: timeStr,
            type: 'RATE-LIMIT',
            sensor: 'GATEWAY',
            message: 'Shed 480/500 req/s flood at perimeter. Token bucket preserved 20/s capacity.',
          },
          ...prev,
        ]);

        const cont = await sleep(900, token);
        if (!cont) return false;
      } else {
        setCurrentPacket(packet);
      }

      setVerdict('CHECKING');
      setVerdictText('Evaluating ingress packet across 5 security checkpoints...');

      // Reset checks
      setCheckStatuses([
        { state: 'idle' },
        { state: 'idle' },
        { state: 'idle' },
        { state: 'idle' },
        { state: 'idle' },
      ]);

      const updatedStatuses: CheckStatus[] = [
        { state: 'idle' },
        { state: 'idle' },
        { state: 'idle' },
        { state: 'idle' },
        { state: 'idle' },
      ];

      // Sequential checks (each ~750ms checking state)
      // Check 1: Who sent it?
      setActiveCheckIndex(0);
      updatedStatuses[0] = { state: 'checking' };
      setCheckStatuses([...updatedStatuses]);
      if (!(await sleep(750, token))) return false;

      const c1 = check1_whoSentIt(packet, gateState);
      if (!c1.pass) {
        updatedStatuses[0] = { state: 'fail', resultText: c1.resultText };
        for (let i = 1; i < 5; i++) updatedStatuses[i] = { state: 'skipped' };
        setCheckStatuses([...updatedStatuses]);
        setVerdict('REJECTED');
        setVerdictText(`Rejected: Unknown sensor “${packet.sensor}” dropped at security perimeter`);
        setRejectedCount((c) => c + 1);
        setSecurityLogs((prev) => [
          {
            id: `log-${Date.now()}`,
            time: getFormatTime(),
            type: 'REJECT',
            sensor: packet.sensor,
            message: `${c1.resultText} (Check 1 failed)`,
          },
          ...prev,
        ]);
        setGraphPoints((prev) => [...prev, { seq: packet.seq, hr: packet.hr, outcome: 'REJECTED' }]);
        setActiveCheckIndex(-1);
        return true;
      }
      updatedStatuses[0] = { state: 'pass', resultText: c1.resultText };
      setCheckStatuses([...updatedStatuses]);

      // Check 2: Was it altered?
      setActiveCheckIndex(1);
      updatedStatuses[1] = { state: 'checking' };
      setCheckStatuses([...updatedStatuses]);
      if (!(await sleep(750, token))) return false;

      const c2 = await check2_wasItAltered(packet, gateState);
      if (!c2.pass) {
        updatedStatuses[1] = { state: 'fail', resultText: c2.resultText };
        for (let i = 2; i < 5; i++) updatedStatuses[i] = { state: 'skipped' };
        setCheckStatuses([...updatedStatuses]);
        setVerdict('REJECTED');
        setVerdictText('Rejected: Invalid HMAC signature — packet altered in transit');
        setRejectedCount((c) => c + 1);
        setSecurityLogs((prev) => [
          {
            id: `log-${Date.now()}`,
            time: getFormatTime(),
            type: 'REJECT',
            sensor: packet.sensor,
            message: `${c2.resultText} (Check 2 failed)`,
          },
          ...prev,
        ]);
        setGraphPoints((prev) => [...prev, { seq: packet.seq, hr: packet.hr, outcome: 'REJECTED' }]);
        setActiveCheckIndex(-1);
        return true;
      }
      updatedStatuses[1] = { state: 'pass', resultText: c2.resultText };
      setCheckStatuses([...updatedStatuses]);

      // Check 3: Is it fresh?
      setActiveCheckIndex(2);
      updatedStatuses[2] = { state: 'checking' };
      setCheckStatuses([...updatedStatuses]);
      if (!(await sleep(750, token))) return false;

      const c3 = check3_isItFresh(packet, gateState, now);
      if (!c3.pass) {
        updatedStatuses[2] = { state: 'fail', resultText: c3.resultText };
        for (let i = 3; i < 5; i++) updatedStatuses[i] = { state: 'skipped' };
        setCheckStatuses([...updatedStatuses]);
        setVerdict('REJECTED');
        setVerdictText('Rejected: Replay attack detected — timestamp or nonce expired');
        setRejectedCount((c) => c + 1);
        setSecurityLogs((prev) => [
          {
            id: `log-${Date.now()}`,
            time: getFormatTime(),
            type: 'REJECT',
            sensor: packet.sensor,
            message: `${c3.resultText} (Check 3 failed)`,
          },
          ...prev,
        ]);
        setGraphPoints((prev) => [...prev, { seq: packet.seq, hr: packet.hr, outcome: 'REJECTED' }]);
        setActiveCheckIndex(-1);
        return true;
      }
      updatedStatuses[2] = { state: 'pass', resultText: c3.resultText };
      setCheckStatuses([...updatedStatuses]);

      // Check 4: Is it in order?
      setActiveCheckIndex(3);
      updatedStatuses[3] = { state: 'checking' };
      setCheckStatuses([...updatedStatuses]);
      if (!(await sleep(750, token))) return false;

      const c4 = check4_isInOrder(packet, gateState);
      if (!c4.pass) {
        updatedStatuses[3] = { state: 'flag', resultText: c4.resultText };
        updatedStatuses[4] = { state: 'skipped' };
        setCheckStatuses([...updatedStatuses]);
        setVerdict('QUARANTINED');
        setVerdictText(`Quarantined: Sequence jump detected (#${packet.seq} ≠ #${gateState.lastSeq + 1})`);
        setQuarantinedCount((c) => c + 1);
        // Store nonce in used set for quarantine
        setGateState((prev) => ({
          ...prev,
          usedNonces: new Set([...prev.usedNonces, packet.nonce]),
        }));
        setReadingsList((prev) => [
          {
            id: `dash-${Date.now()}`,
            sensor: packet.sensor,
            hr: packet.hr,
            seq: packet.seq,
            nonce: packet.nonce,
            ts: packet.ts,
            sig: packet.sig,
            outcome: 'QUARANTINED',
            receivedAt: getFormatTime(),
          },
          ...prev,
        ]);
        setSecurityLogs((prev) => [
          {
            id: `log-${Date.now()}`,
            time: getFormatTime(),
            type: 'QUARANTINE',
            sensor: packet.sensor,
            message: `${c4.resultText} (Check 4 flagged)`,
          },
          ...prev,
        ]);
        setGraphPoints((prev) => [...prev, { seq: packet.seq, hr: packet.hr, outcome: 'QUARANTINED' }]);
        setActiveCheckIndex(-1);
        return true;
      }
      updatedStatuses[3] = { state: 'pass', resultText: c4.resultText };
      setCheckStatuses([...updatedStatuses]);

      // Check 5: Does it make sense?
      setActiveCheckIndex(4);
      updatedStatuses[4] = { state: 'checking' };
      setCheckStatuses([...updatedStatuses]);
      if (!(await sleep(750, token))) return false;

      const c5 = check5_doesItMakeSense(packet, gateState);
      if (!c5.pass) {
        updatedStatuses[4] = { state: 'flag', resultText: c5.resultText };
        setCheckStatuses([...updatedStatuses]);
        setVerdict('QUARANTINED');
        setVerdictText(`Quarantined: Impossible physiological reading (${packet.hr} bpm)`);
        setQuarantinedCount((c) => c + 1);
        // Store nonce in used set
        setGateState((prev) => ({
          ...prev,
          usedNonces: new Set([...prev.usedNonces, packet.nonce]),
        }));
        setReadingsList((prev) => [
          {
            id: `dash-${Date.now()}`,
            sensor: packet.sensor,
            hr: packet.hr,
            seq: packet.seq,
            nonce: packet.nonce,
            ts: packet.ts,
            sig: packet.sig,
            outcome: 'QUARANTINED',
            receivedAt: getFormatTime(),
          },
          ...prev,
        ]);
        setSecurityLogs((prev) => [
          {
            id: `log-${Date.now()}`,
            time: getFormatTime(),
            type: 'QUARANTINE',
            sensor: packet.sensor,
            message: `${c5.resultText} (Check 5 flagged)`,
          },
          ...prev,
        ]);
        setGraphPoints((prev) => [...prev, { seq: packet.seq, hr: packet.hr, outcome: 'QUARANTINED' }]);
        setActiveCheckIndex(-1);
        return true;
      }
      updatedStatuses[4] = { state: 'pass', resultText: c5.resultText };
      setCheckStatuses([...updatedStatuses]);

      // ALL 5 CHECKS PASSED -> ACCEPTED / TRUSTED
      setVerdict('ACCEPTED');
      setVerdictText('Accepted: shown to the coach as trusted');
      setTrustedCount((c) => c + 1);

      // State updates for Accepted
      setGateState((prev) => ({
        ...prev,
        lastSeq: packet.seq,
        lastHr: packet.hr,
        usedNonces: new Set([...prev.usedNonces, packet.nonce]),
      }));

      setReadingsList((prev) => [
        {
          id: `dash-${Date.now()}`,
          sensor: packet.sensor,
          hr: packet.hr,
          seq: packet.seq,
          nonce: packet.nonce,
          ts: packet.ts,
          sig: packet.sig,
          outcome: 'TRUSTED',
          receivedAt: getFormatTime(),
        },
        ...prev,
      ]);

      setSecurityLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          time: getFormatTime(),
          type: 'TRUST',
          sensor: packet.sensor,
          message: `Verified 5/5 checks (${packet.hr} bpm, #${packet.seq})`,
        },
        ...prev,
      ]);

      setGraphPoints((prev) => [...prev, { seq: packet.seq, hr: packet.hr, outcome: 'TRUSTED' }]);
      setActiveCheckIndex(-1);
      return true;
    },
    [gateState]
  );

  /**
   * Run individual scenario on user click
   */
  const handleRunSingleScenario = async (scenarioId: string) => {
    if (isRunning) return;
    setIsRunning(true);
    executionTokenRef.current += 1;
    const token = executionTokenRef.current;

    await executeScenario(scenarioId, token);
    setIsRunning(false);
  };

  /**
   * Play All Scenarios in order with 3.2s gap
   */
  const handlePlayAll = async () => {
    if (isRunning) return;
    setIsRunning(true);
    executionTokenRef.current += 1;
    const token = executionTokenRef.current;

    for (let i = 0; i < SCENARIO_PRESETS.length; i++) {
      if (executionTokenRef.current !== token) break;
      const scenario = SCENARIO_PRESETS[i];
      const completed = await executeScenario(scenario.id, token);
      if (!completed || executionTokenRef.current !== token) break;

      // 3.2s gap between scenarios
      if (i < SCENARIO_PRESETS.length - 1) {
        const cont = await sleep(3200, token);
        if (!cont) break;
      }
    }

    if (executionTokenRef.current === token) {
      setIsRunning(false);
    }
  };

  /**
   * Reset simulation to clean initial state
   */
  const handleReset = () => {
    executionTokenRef.current += 1;
    setIsRunning(false);
    setActiveScenarioId(null);
    setVerdict('IDLE');
    setVerdictText('Standby: awaiting telemetry ingress');
    setActiveCheckIndex(-1);
    setCurrentPacket(null);
    setNarration(null);

    setGateState({
      ...INITIAL_GATE_STATE,
      usedNonces: new Set(INITIAL_GATE_STATE.usedNonces),
    });

    setCheckStatuses([
      { state: 'idle' },
      { state: 'idle' },
      { state: 'idle' },
      { state: 'idle' },
      { state: 'idle' },
    ]);

    setTrustedCount(5);
    setQuarantinedCount(0);
    setRejectedCount(0);

    setReadingsList([
      {
        id: 'init-100',
        sensor: 'S-07',
        hr: 148,
        seq: 100,
        nonce: 'n-init100',
        ts: Math.floor(Date.now() / 1000) - 20,
        sig: '4a9b21f0c4...',
        outcome: 'TRUSTED',
        receivedAt: 'Baseline',
      },
      {
        id: 'init-99',
        sensor: 'S-07',
        hr: 148,
        seq: 99,
        nonce: 'n-init99',
        ts: Math.floor(Date.now() / 1000) - 25,
        sig: '3e1189ac02...',
        outcome: 'TRUSTED',
        receivedAt: 'Baseline',
      },
    ]);

    setGraphPoints([
      { seq: 96, hr: 145, outcome: 'TRUSTED' },
      { seq: 97, hr: 146, outcome: 'TRUSTED' },
      { seq: 98, hr: 147, outcome: 'TRUSTED' },
      { seq: 99, hr: 148, outcome: 'TRUSTED' },
      { seq: 100, hr: 148, outcome: 'TRUSTED' },
    ]);

    setSecurityLogs([
      {
        id: `reset-${Date.now()}`,
        time: getFormatTime(),
        type: 'TRUST',
        sensor: 'SYSTEM',
        message: 'Engine reset. Baseline state initialized: S-07 key loaded, seq #100, last HR 148 bpm.',
      },
    ]);
  };

  const blockedCount = quarantinedCount + rejectedCount;

  return (
    <section
      id="performancestream"
      className={`relative w-full pt-[80px] pb-[140px] px-6 md:px-[48px] transition-colors duration-200 select-none ${
        isDark ? 'dark bg-[#14110F] text-[#F5F0E8]' : 'bg-[#FEF9F2] text-[#1D1A1A]'
      }`}
      style={{
        fontFamily: 'var(--font-geist, "Geist", system-ui, sans-serif)',
        // CSS tokens defined strictly per section root
        ['--ps-canvas' as any]: isDark ? '#14110F' : '#FEF9F2',
        ['--ps-card' as any]: isDark ? '#1C1917' : '#FEFFFF',
        ['--ps-card-border' as any]: isDark ? '#2E2A27' : '#EBEAEB',
        ['--ps-ink' as any]: isDark ? '#F5F0E8' : '#1D1A1A',
        ['--ps-muted' as any]: isDark ? '#A8A29E' : '#656565',
        ['--ps-inner-panel' as any]: isDark ? '#23201D' : '#F9F8F8',
        ['--ps-panel-border' as any]: isDark ? '#332D29' : '#F1F1F1',
        ['--ps-trusted' as any]: isDark ? '#2CD96B' : '#23C45F',
        ['--ps-trusted-text' as any]: isDark ? '#4ADE80' : '#16A24B',
        ['--ps-trusted-bg' as any]: isDark ? '#14291B' : '#F1FDF4',
        ['--ps-trusted-border' as any]: isDark ? '#1F472B' : '#BBF7D0',
        ['--ps-quarantine' as any]: isDark ? '#FB923C' : '#F87317',
        ['--ps-quarantine-text' as any]: isDark ? '#FDBA74' : '#C25E09',
        ['--ps-quarantine-bg' as any]: isDark ? '#2E1B0F' : '#FFF7ED',
        ['--ps-quarantine-border' as any]: isDark ? '#502C13' : '#FED7AA',
        ['--ps-reject' as any]: isDark ? '#F87171' : '#EF4544',
        ['--ps-reject-text' as any]: isDark ? '#FCA5A5' : '#DC2626',
        ['--ps-reject-bg' as any]: isDark ? '#2E1313' : '#FEF2F2',
        ['--ps-reject-border' as any]: isDark ? '#541C1C' : '#FECACA',
        ['--ps-skipped-bg' as any]: isDark ? '#26221F' : '#F3F4F6',
        ['--ps-skipped-text' as any]: isDark ? '#88827C' : '#6B7280',
        ['--ps-skipped-border' as any]: isDark ? '#38322D' : '#E5E7EB',
      }}
    >
      {/* Faint dotted grid texture on cream canvas */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: isDark
            ? 'radial-gradient(#F5F0E8 1px, transparent 1px)'
            : 'radial-gradient(#1D1A1A 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      {/* Main Inner Wrapper */}
      <div className="max-w-[1248px] mx-auto relative z-10">
        {/* Section 6.1 Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="block text-[11px] font-[600] font-mono tracking-wider uppercase text-[#888888] dark:text-[#A8A29E] mb-2">
              BRCX-SPT-03 · Sports / Cybersecurity
            </span>
            <h2 className="text-[36px] sm:text-[44px] font-[500] leading-[1.1] tracking-[-1.32px] max-w-[539px] text-[var(--ps-ink)]">
              How a fake reading gets stopped
            </h2>
            <p className="text-[#656565] dark:text-[#A8A29E] text-[15px] sm:text-[16px] leading-relaxed max-w-[64ch] mt-3">
              A sensor streams heart-rate readings to a coach’s dashboard. Every reading passes five checks before it can be trusted.
            </p>
          </div>

          {/* Action CTAs + Theme Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Play All Button (template ink style) */}
            <button
              type="button"
              disabled={isRunning}
              onClick={handlePlayAll}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-[14px] font-[600] transition-all ${
                isRunning
                  ? 'opacity-50 cursor-not-allowed bg-[var(--ps-inner-panel)] text-[var(--ps-muted)] border border-[var(--ps-card-border)]'
                  : 'bg-[var(--ps-ink)] text-[var(--ps-canvas)] hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] shadow-sm'
              }`}
            >
              <span>{isRunning ? 'Running pipeline...' : 'Play all attacks'}</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <path
                  d="M3.333 8h9.334M8 3.333L12.667 8 8 12.667"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Reset Button */}
            <button
              type="button"
              disabled={isRunning}
              onClick={handleReset}
              className="px-4 py-3 rounded-full text-[13px] font-[600] font-mono border border-[var(--ps-card-border)] bg-[var(--ps-card)] text-[var(--ps-ink)] hover:border-[var(--ps-ink)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Reset
            </button>

            {/* Theme Toggle (Sun/Moon SVG) */}
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              aria-label="Toggle dark mode"
              className="w-10 h-10 rounded-full border border-[var(--ps-card-border)] bg-[var(--ps-card)] text-[var(--ps-ink)] flex items-center justify-center hover:border-[var(--ps-ink)] transition-colors"
            >
              {isDark ? (
                // Sun icon
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                // Moon icon
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* 6.2 Bento Grid */}
        <div className="space-y-4">
          {/* Row 1: PipelineCard (744fr) + DashboardCard (440fr), each h-[443px] */}
          <div className="grid grid-cols-1 lg:grid-cols-[744fr_440fr] gap-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <PipelineCard
                verdict={verdict}
                verdictText={verdictText}
                activeCheckIndex={activeCheckIndex}
                checkStatuses={checkStatuses}
                readings={graphPoints}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            >
              <DashboardCard
                trustedCount={trustedCount}
                quarantinedCount={quarantinedCount}
                rejectedCount={rejectedCount}
                readingsList={readingsList}
              />
            </motion.div>
          </div>

          {/* Row 2 Nested: PacketCard (364fr) + ScenarioCard (364fr) + LogCard (440fr), each h-[443px] */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[364fr_364fr_440fr] gap-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <PacketCard packet={currentPacket} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            >
              <ScenarioCard
                activeScenarioId={activeScenarioId}
                isRunning={isRunning}
                narration={narration}
                onRunScenario={handleRunSingleScenario}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
              className="md:col-span-2 lg:col-span-1"
            >
              <LogCard blockedCount={blockedCount} logs={securityLogs} />
            </motion.div>
          </div>
        </div>

        {/* Thin ECG Divider */}
        <EcgDivider />

        {/* Row 3: 6.3 ZonesCard (Architecture, template styling) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="my-4"
        >
          <ZonesCard
            activeCheckIndex={activeCheckIndex}
            verdict={verdict}
          />
        </motion.div>

        {/* Thin ECG Divider */}
        <EcgDivider />

        {/* Row 4: 6.4 Four-Step Solution Row */}
        <div className="my-6">
          <div className="mb-4">
            <span className="text-[11px] font-[600] font-mono tracking-wider uppercase text-[#888888] dark:text-[#A8A29E]">
              Core Defense Methodology
            </span>
            <h3 className="text-[26px] font-[500] tracking-tight text-[var(--ps-ink)]">
              Four Pillars of Pipeline Integrity
            </h3>
          </div>
          <FourStepSolution />
        </div>

        {/* Thin ECG Divider */}
        <EcgDivider />

        {/* Row 5: 6.5 Closing Row (Impact, Future Scope, Footer Strip) */}
        <div className="my-6">
          <ClosingRow />
        </div>
      </div>
    </section>
  );
}
