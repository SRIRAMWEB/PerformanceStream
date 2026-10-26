'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSim } from '../context/SimContext';
import { SCENARIO_LIST } from '../lib/scenarios';
import { CHECK_METADATA } from '../lib/checks';
import { TrustRing, ImageCard } from '../components/VisualElements';
import { BottomBar } from '../components/BottomBar';
import { AttackButton } from '../components/Buttons';

export function SimulatorPage() {
  const {
    protectionOn,
    speed,
    stepThrough,
    waitingForStep,
    changedDelta,
    floodBurst,
    counters,
    readings,
    ledgerChain,
    securityLogs,
    isRunning,
    activeScenarioId,
    currentPacket,
    verdict,
    verdictText,
    checkStatuses,
    logDrawerOpen,
    traceDrawerOpen,
    shortcutsModalOpen,
    selectedTraceReading,
    chainStatus,
    availabilityMeter,
    dispatch,
    runSingleScenario,
    playAll,
    stopRun,
    nextStep,
    resetAll,
    verifyChain,
    tamperChain,
    downloadCsv,
  } = useSim();

  // Local filter for security log drawer
  const [logFilter, setLogFilter] = useState<'ALL' | 'REJECT' | 'QUARANTINE' | 'ALERTS'>('ALL');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (isRunning) stopRun();
        else playAll();
      } else if (e.key === '1') runSingleScenario('normal');
      else if (e.key === '2') runSingleScenario('fake_sensor');
      else if (e.key === '3') runSingleScenario('changed_value');
      else if (e.key === '4') runSingleScenario('replay_old_data');
      else if (e.key === '5') runSingleScenario('missing_readings');
      else if (e.key === '6') runSingleScenario('stolen_key');
      else if (e.key === '7') runSingleScenario('flood');
      else if (e.key === 'Escape') {
        dispatch({ type: 'SET_DRAWER', drawer: 'logDrawerOpen', value: false });
        dispatch({ type: 'SET_DRAWER', drawer: 'traceDrawerOpen', value: false, traceReading: null });
        dispatch({ type: 'SET_DRAWER', drawer: 'shortcutsModalOpen', value: false });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, playAll, stopRun, runSingleScenario, dispatch]);

  const totalEvaluations = counters.trusted + counters.quarantined + counters.rejected;

  // Filtered security logs
  const filteredLogs = securityLogs.filter((log) => {
    if (logFilter === 'ALL') return true;
    if (logFilter === 'REJECT') return log.level === 'REJECT';
    if (logFilter === 'QUARANTINE') return log.level === 'QUARANTINE';
    if (logFilter === 'ALERTS') return log.message.includes('[Alert:');
    return true;
  });

  // Chart coordinate calculations (clean line chart of heart rate)
  const chartW = 600;
  const chartH = 150;
  const padL = 36;
  const padR = 20;
  const padT = 16;
  const padB = 24;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  const windowReadings = readings.slice(-14);
  const yForHr = (hr: number) => {
    const clamped = Math.max(20, Math.min(260, hr));
    return padT + ((260 - clamped) / (260 - 20)) * plotH;
  };
  const xForIdx = (idx: number, count: number) => {
    if (count <= 1) return padL + plotW / 2;
    return padL + (idx / (count - 1)) * plotW;
  };

  const chartPoints = windowReadings.map((r, i) => ({
    ...r,
    x: xForIdx(i, windowReadings.length),
    y: yForHr(r.hr),
  }));

  const polylineStr = chartPoints
    .filter((pt) => pt.outcome === 'TRUSTED')
    .map((pt) => `${pt.x},${pt.y}`)
    .join(' L ');
  const polylinePath = polylineStr ? `M ${polylineStr}` : '';

  return (
    <div className="w-full bg-[#e9e4db] text-[#0F1F1B] font-['Manrope'] overflow-x-hidden min-h-screen">
      {/* 1. Header Strip with S1 image */}
      <section className="pt-8 pb-4 px-6 lg:px-[60px]">
        <div className="max-w-[1300px] mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#034F46]">
                Interactive Security Simulator
              </span>
              <h1 className="font-['Fraunces'] font-normal text-[36px] sm:text-[46px] leading-[1.08] text-[#0F1F1B] mt-1">
                The Gate in Action
              </h1>
              <p className="text-[15px] text-[#48504F] max-w-[56ch] mt-1">
                Trigger simulated adversary drills or normal athlete telemetry. Observe how each verification barrier isolates or admits data in real time.
              </p>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_DRAWER', drawer: 'logDrawerOpen', value: true })}
                className="px-3.5 py-1.5 rounded-full border border-[rgba(15,31,27,0.18)] bg-[#F4F0E8] text-[13px] font-semibold hover:border-[#0F1F1B] transition-colors min-h-[40px]"
              >
                Audit Log ({securityLogs.length})
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_DRAWER', drawer: 'shortcutsModalOpen', value: true })}
                className="px-3.5 py-1.5 rounded-full border border-[rgba(15,31,27,0.18)] bg-[#F4F0E8] text-[13px] font-semibold hover:border-[#0F1F1B] transition-colors min-h-[40px]"
              >
                Shortcuts ⌨
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Top Simulator Power Bar: Protection Toggle, Step Through, Speed */}
      <section className="py-2 px-6 lg:px-[60px]">
        <div className="max-w-[1300px] mx-auto">
          <div className="p-4 rounded-[24px] bg-[#F4F0E8] border border-[rgba(15,31,27,0.12)] flex flex-wrap items-center justify-between gap-4">
            {/* Protection ON / OFF Switch */}
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-semibold text-[#0F1F1B]">Protection:</span>
              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_PROTECTION', payload: !protectionOn })}
                className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#034F46] ${
                  protectionOn ? 'bg-[#034F46]' : 'bg-[#B5483A]'
                }`}
                role="switch"
                aria-checked={protectionOn}
                aria-label="Toggle pipeline protection"
              >
                <span
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    protectionOn ? 'translate-x-8' : 'translate-x-0'
                  }`}
                />
              </button>
              <span
                className={`text-[13px] font-bold ${
                  protectionOn ? 'text-[#034F46]' : 'text-[#B5483A]'
                }`}
              >
                {protectionOn ? 'ON (Secured)' : 'OFF (What an attacker could do)'}
              </span>
            </div>

            {/* Step Through Mode & Speed */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* Step Through Toggle */}
              <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-[#0F1F1B]">
                <input
                  type="checkbox"
                  checked={stepThrough}
                  onChange={(e) => dispatch({ type: 'SET_STEP_THROUGH', payload: e.target.checked })}
                  className="rounded text-[#034F46] focus:ring-[#034F46] w-4 h-4 cursor-pointer"
                />
                <span>Step through mode</span>
              </label>

              {waitingForStep && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-4 py-1.5 rounded-full bg-[#034F46] text-[#FCFDFD] text-[13px] font-bold animate-pulse"
                >
                  Next check →
                </button>
              )}

              {/* Speed Segmented Control */}
              <div className="flex items-center gap-1 p-1 bg-[#e9e4db] rounded-full border border-[rgba(15,31,27,0.12)]">
                {(['slow', 'normal', 'fast'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => dispatch({ type: 'SET_SPEED', payload: s })}
                    className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all ${
                      speed === s
                        ? 'bg-[#034F46] text-[#FCFDFD]'
                        : 'text-[#48504F] hover:text-[#0F1F1B]'
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Scenario Buttons Row */}
      <section className="py-3 px-6 lg:px-[60px]">
        <div className="max-w-[1300px] mx-auto">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Play All / Stop Button */}
            {isRunning ? (
              <button
                type="button"
                onClick={stopRun}
                className="px-5 py-2.5 rounded-full bg-[#B5483A] text-white text-[13px] font-bold shadow-xs hover:bg-[#963c2f] transition-all min-h-[44px]"
              >
                ■ Stop run
              </button>
            ) : (
              <button
                type="button"
                onClick={playAll}
                className="px-5 py-2.5 rounded-full bg-[#034F46] text-[#FCFDFD] text-[13px] font-bold shadow-xs hover:bg-[#023b34] transition-all min-h-[44px]"
              >
                ▶ Play all attacks
              </button>
            )}

            {/* Individual Scenario Buttons */}
            {SCENARIO_LIST.map((sc, i) => (
              <AttackButton
                key={sc.id}
                onClick={() => runSingleScenario(sc.id)}
                disabled={isRunning}
                dotColor={sc.type === 'normal' ? 'green' : i % 2 === 0 ? 'amber' : 'clay'}
                active={activeScenarioId === sc.id}
              >
                {sc.name}
              </AttackButton>
            ))}

            {/* Reset Button */}
            <button
              type="button"
              onClick={resetAll}
              disabled={isRunning}
              className="px-4 py-2 rounded-full border border-[rgba(15,31,27,0.2)] bg-[#F4F0E8] text-[13px] font-semibold text-[#0F1F1B] hover:border-[#0F1F1B] transition-colors disabled:opacity-30 min-h-[44px]"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* 4. Large Stage: Message Left, Checks Right, Verdict Header */}
      <section className="py-4 px-6 lg:px-[60px]">
        <div className="max-w-[1300px] mx-auto space-y-4">
          {/* Verdict Banner */}
          <div className="p-5 rounded-[24px] bg-[#F4F0E8] border border-[rgba(15,31,27,0.12)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full font-mono text-[12px] font-bold uppercase tracking-wider ${
                  verdict === 'TRUSTED'
                    ? 'bg-[#E4F1C6] text-[#034F46] border border-[#034F46]/20'
                    : verdict === 'QUARANTINED'
                    ? 'bg-[#FFF7ED] text-[#B7791F] border border-[#B7791F]/30'
                    : verdict === 'REJECTED' || verdict === 'UNAVAILABLE'
                    ? 'bg-[#FEF2F2] text-[#B5483A] border border-[#B5483A]/30'
                    : 'bg-[#e9e4db] text-[#48504F]'
                }`}
              >
                {verdict}
              </span>
              <p className="text-[15px] font-semibold text-[#0F1F1B]">
                {verdictText}
              </p>
            </div>

            {/* Trust Ring */}
            <div className="shrink-0">
              <TrustRing trustedCount={counters.trusted} totalCount={totalEvaluations} size={90} />
            </div>
          </div>

          {/* Main Stage Grid: Incoming JSON (left) + 5 Checks (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left: Incoming Message (5 cols) */}
            <div className="lg:col-span-5 bg-[#F4F0E8] rounded-[28px] border border-[rgba(15,31,27,0.12)] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[rgba(15,31,27,0.12)] mb-4">
                  <span className="text-[12px] font-mono uppercase tracking-wider text-[#48504F] font-bold">
                    Ingress Telemetry Payload
                  </span>
                  <span className="text-[11px] font-mono text-[#034F46] font-semibold">
                    {currentPacket ? currentPacket.device_id : 'S-07'}
                  </span>
                </div>

                {!currentPacket ? (
                  <div className="py-16 text-center text-[13px] font-mono text-[#48504F] italic">
                    Awaiting next packet transmission...
                  </div>
                ) : (
                  <div className="space-y-2 font-mono text-[12px]">
                    <div className="p-4 rounded-xl bg-[#e9e4db]/80 border border-[rgba(15,31,27,0.1)] space-y-1.5 overflow-x-auto">
                      <div className={currentPacket.tamperedField === 'device_id' ? 'bg-[#FFE9A8] p-1 rounded font-bold' : ''}>
                        <span className="text-[#48504F]">"device_id":</span> "{currentPacket.device_id}",
                      </div>
                      <div className={currentPacket.tamperedField === 'value' ? 'bg-[#FFE9A8] p-1 rounded font-bold' : ''}>
                        <span className="text-[#48504F]">"value":</span> {currentPacket.value} <span className="text-[10px] text-[#48504F]">// bpm</span>,
                      </div>
                      <div className={currentPacket.tamperedField === 'ts' ? 'bg-[#FFE9A8] p-1 rounded font-bold' : ''}>
                        <span className="text-[#48504F]">"timestamp":</span> {currentPacket.ts},
                      </div>
                      <div className={currentPacket.tamperedField === 'seq' ? 'bg-[#FFE9A8] p-1 rounded font-bold' : ''}>
                        <span className="text-[#48504F]">"seq":</span> {currentPacket.seq},
                      </div>
                      <div>
                        <span className="text-[#48504F]">"nonce":</span> "{currentPacket.nonce}",
                      </div>
                      <div className="truncate">
                        <span className="text-[#48504F]">"hmac_sha256":</span> "{currentPacket.sig ? currentPacket.sig.slice(0, 24) + '…' : '—'}"
                      </div>
                    </div>

                    {currentPacket.tamperedField && (
                      <div className="text-[11px] text-[#B7791F] font-semibold flex items-center gap-1.5 pt-1">
                        <span className="w-2 h-2 rounded-full bg-[#B7791F]" />
                        Adversary modified '{currentPacket.tamperedField}' field in transit
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Ingress Gateway Availability */}
              <div className="pt-4 border-t border-[rgba(15,31,27,0.12)] mt-6 text-[12px] font-mono flex items-center justify-between">
                <span className="text-[#48504F]">Gateway Availability:</span>
                <span className="font-bold text-[#034F46]">{availabilityMeter}%</span>
              </div>
            </div>

            {/* Right: Five Check Cards (7 cols) */}
            <div className="lg:col-span-7 bg-[#F4F0E8] rounded-[28px] border border-[rgba(15,31,27,0.12)] p-6 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-[rgba(15,31,27,0.12)]">
                <span className="text-[12px] font-mono uppercase tracking-wider text-[#48504F] font-bold">
                  Five Sequential Security Checks
                </span>
                <span className="text-[11px] font-mono text-[#48504F]">
                  350ms pipeline stagger
                </span>
              </div>

              <div className="space-y-2.5">
                {CHECK_METADATA.map((chk, idx) => {
                  const status = checkStatuses[idx] || { state: 'idle' };

                  let borderClass = 'border-[rgba(15,31,27,0.12)] bg-[#e9e4db]/40';
                  let icon = <span className="w-2 h-2 rounded-full bg-[rgba(15,31,27,0.2)]" />;
                  let textClass = 'text-[#48504F]';

                  if (status.state === 'checking') {
                    borderClass = 'border-[#034F46] bg-white ring-2 ring-[#034F46]/20';
                    icon = <span className="w-2.5 h-2.5 rounded-full bg-[#034F46] animate-pulse" />;
                    textClass = 'text-[#034F46] font-semibold';
                  } else if (status.state === 'pass') {
                    borderClass = 'border-[#034F46] bg-[#E4F1C6]/30';
                    icon = <span className="text-[#034F46] font-bold text-[12px]">✓</span>;
                    textClass = 'text-[#034F46] font-semibold';
                  } else if (status.state === 'fail') {
                    borderClass = 'border-[#B5483A] bg-[#FEF2F2]';
                    icon = <span className="text-[#B5483A] font-bold text-[12px]">✕</span>;
                    textClass = 'text-[#B5483A] font-semibold';
                  } else if (status.state === 'flag') {
                    borderClass = 'border-[#B7791F] bg-[#FFF7ED]';
                    icon = <span className="text-[#B7791F] font-bold text-[12px]">⚠</span>;
                    textClass = 'text-[#B7791F] font-semibold';
                  } else if (status.state === 'skipped') {
                    borderClass = 'border-[rgba(15,31,27,0.06)] bg-[#e9e4db]/20 opacity-50';
                    icon = <span className="text-[10px] text-[#48504F]">―</span>;
                  }

                  return (
                    <div
                      key={chk.id}
                      className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-between gap-3 ${borderClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#F4F0E8] flex items-center justify-center shrink-0">
                          {icon}
                        </div>
                        <div>
                          <div className={`text-[13px] font-['Fraunces'] ${textClass}`}>
                            {chk.name}
                          </div>
                          <div className="text-[11px] text-[#48504F]">
                            {chk.question}
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] font-mono text-right max-w-[240px] truncate">
                        {status.reason ? (
                          <span className={status.state === 'fail' ? 'text-[#B5483A]' : status.state === 'flag' ? 'text-[#B7791F]' : 'text-[#034F46]'}>
                            {status.reason}
                          </span>
                        ) : status.state === 'skipped' ? (
                          <span className="text-[#48504F]/60 italic">Skipped</span>
                        ) : status.state === 'checking' ? (
                          <span className="text-[#034F46] animate-pulse">evaluating...</span>
                        ) : (
                          <span className="text-[#48504F]/40">standby</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chain Status Bar */}
              <div className="pt-3 border-t border-[rgba(15,31,27,0.12)] flex items-center justify-between text-[12px] font-mono">
                <span className="text-[#48504F]">Ledger Integrity:</span>
                <span className={chainStatus.valid ? 'text-[#034F46] font-bold' : 'text-[#B5483A] font-bold'}>
                  {chainStatus.valid ? '✓ SHA-256 Ledger Verified (OK)' : `✕ ${chainStatus.message}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Result Row: Counters + Heart Rate Chart */}
      <section className="py-4 px-6 lg:px-[60px]">
        <div className="max-w-[1300px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left: Counters (4 cols) */}
            <div className="lg:col-span-4 grid grid-cols-3 gap-3">
              <div className="p-5 rounded-[24px] bg-[#F4F0E8] border border-[rgba(15,31,27,0.12)] flex flex-col justify-between text-center">
                <span className="text-[11px] font-mono uppercase text-[#48504F] font-bold">
                  Trusted
                </span>
                <span className="font-['Fraunces'] text-[38px] font-bold text-[#034F46] leading-none my-2">
                  {counters.trusted}
                </span>
                <span className="text-[10px] text-[#48504F]">Verified pass</span>
              </div>

              <div className="p-5 rounded-[24px] bg-[#F4F0E8] border border-[rgba(15,31,27,0.12)] flex flex-col justify-between text-center">
                <span className="text-[11px] font-mono uppercase text-[#48504F] font-bold">
                  Quarantine
                </span>
                <span className="font-['Fraunces'] text-[38px] font-bold text-[#B7791F] leading-none my-2">
                  {counters.quarantined}
                </span>
                <span className="text-[10px] text-[#48504F]">Isolated</span>
              </div>

              <div className="p-5 rounded-[24px] bg-[#F4F0E8] border border-[rgba(15,31,27,0.12)] flex flex-col justify-between text-center">
                <span className="text-[11px] font-mono uppercase text-[#48504F] font-bold">
                  Rejected
                </span>
                <span className="font-['Fraunces'] text-[38px] font-bold text-[#B5483A] leading-none my-2">
                  {counters.rejected}
                </span>
                <span className="text-[10px] text-[#48504F]">Dropped</span>
              </div>
            </div>

            {/* Right: Heart Rate Line Chart with Clickable Trace Points (8 cols) */}
            <div className="lg:col-span-8 p-6 rounded-[28px] bg-[#F4F0E8] border border-[rgba(15,31,27,0.12)] flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-[rgba(15,31,27,0.1)]">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-[#0F1F1B]">
                    Heart Rate Trendline
                  </span>
                  <span className="text-[11px] font-mono text-[#48504F]">
                    (Click any point to trace full provenance)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-[#48504F]">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#034F46]" /> Trusted
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full border border-[#B7791F]" /> Quarantined
                  </span>
                </div>
              </div>

              {/* SVG Chart */}
              <div className="w-full h-[140px] my-2 relative">
                <svg
                  viewBox={`0 0 ${chartW} ${chartH}`}
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  {/* Grid lines */}
                  {[220, 150, 60].map((bpm) => {
                    const y = yForHr(bpm);
                    return (
                      <g key={bpm}>
                        <line
                          x1={padL}
                          y1={y}
                          x2={chartW - padR}
                          y2={y}
                          stroke="rgba(15,31,27,0.1)"
                          strokeDasharray="2 2"
                        />
                        <text
                          x={padL - 6}
                          y={y + 3}
                          textAnchor="end"
                          className="fill-[#48504F] text-[9px] font-mono"
                        >
                          {bpm}
                        </text>
                      </g>
                    );
                  })}

                  {/* Polyline for continuous trendline */}
                  {polylinePath && (
                    <motion.path
                      d={polylinePath}
                      fill="none"
                      stroke="#034F46"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Clickable Points */}
                  {chartPoints.map((pt, idx) => {
                    const isTrusted = pt.outcome === 'TRUSTED';
                    return (
                      <circle
                        key={idx}
                        cx={pt.x}
                        cy={pt.y}
                        r={isTrusted ? 5 : 6}
                        fill={isTrusted ? '#034F46' : 'none'}
                        stroke={isTrusted ? '#FCFDFD' : '#B7791F'}
                        strokeWidth={isTrusted ? 1.5 : 2}
                        className="cursor-pointer hover:scale-150 transition-transform"
                        onClick={() => {
                          dispatch({
                            type: 'SET_DRAWER',
                            drawer: 'traceDrawerOpen',
                            value: true,
                            traceReading: pt,
                          });
                        }}
                      >
                        <title>
                          Seq #{pt.seq}: {pt.hr} bpm ({pt.outcome}) - Click to trace
                        </title>
                      </circle>
                    );
                  })}
                </svg>
              </div>

              {/* Power Controls Footer Bar */}
              <div className="pt-2 border-t border-[rgba(15,31,27,0.1)] flex flex-wrap items-center justify-between gap-3 text-[12px]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={verifyChain}
                    className="px-3 py-1 rounded-full border border-[rgba(15,31,27,0.2)] bg-[#e9e4db] text-[#0F1F1B] font-semibold hover:border-[#0F1F1B]"
                  >
                    Verify chain
                  </button>
                  <button
                    type="button"
                    onClick={() => tamperChain(0)}
                    className="px-3 py-1 rounded-full border border-[#B5483A]/30 bg-[#FEF2F2] text-[#B5483A] font-semibold hover:bg-[#B5483A]/10"
                  >
                    Tamper with a record
                  </button>
                </div>

                <div className="flex items-center gap-3 text-[#48504F] font-mono">
                  <span>Attack Delta: {changedDelta} bpm</span>
                  <span>·</span>
                  <span>Flood Burst: {floodBurst} req/s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Trace A Reading Drawer */}
      <AnimatePresence>
        {traceDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="w-full max-w-[500px] h-full bg-[#F4F0E8] border-l border-[rgba(15,31,27,0.15)] p-8 flex flex-col justify-between overflow-y-auto shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[rgba(15,31,27,0.12)] mb-6">
                  <div>
                    <span className="text-[11px] font-mono text-[#034F46] font-bold uppercase">
                      Provenance Proof
                    </span>
                    <h3 className="font-['Fraunces'] text-[24px] text-[#0F1F1B]">
                      Trace Reading #{selectedTraceReading?.seq || '101'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'SET_DRAWER', drawer: 'traceDrawerOpen', value: false, traceReading: null })}
                    className="w-8 h-8 rounded-full border border-[rgba(15,31,27,0.2)] flex items-center justify-center text-[14px] text-[#48504F] hover:text-[#0F1F1B]"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 text-[13px] font-mono">
                  <div className="p-4 rounded-xl bg-[#e9e4db] border border-[rgba(15,31,27,0.1)] space-y-1">
                    <span className="text-[11px] text-[#48504F] font-bold">1. DASHBOARD VALUE</span>
                    <div className="font-['Fraunces'] text-[28px] text-[#034F46] font-bold">
                      {selectedTraceReading?.hr || 151} bpm
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#e9e4db] border border-[rgba(15,31,27,0.1)] space-y-1">
                    <span className="text-[11px] text-[#48504F] font-bold">2. PROCESSED VALUE</span>
                    <div>Telemetry validated: sequence #{selectedTraceReading?.seq || 101}</div>
                    <div className="text-[11px] text-[#48504F]">Exertion zone: High Aerobic</div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#e9e4db] border border-[rgba(15,31,27,0.1)] space-y-1">
                    <span className="text-[11px] text-[#48504F] font-bold">3. RAW IMMUTABLE RECORD</span>
                    <div>Timestamp: {selectedTraceReading?.ts || 1700000000}s</div>
                    <div className="truncate">One-time Nonce: {selectedTraceReading?.nonce || 'n-sample'}</div>
                    <div className="text-[#034F46] text-[11px] font-semibold">
                      Stored unchanged in append-only Raw Zone
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#e9e4db] border border-[rgba(15,31,27,0.1)] space-y-1">
                    <span className="text-[11px] text-[#48504F] font-bold">4. SIGNED SOURCE EVENT</span>
                    <div>Device: {selectedTraceReading?.device_id || 'S-07'}</div>
                    <div className="truncate">HMAC-SHA256: {selectedTraceReading?.sig || '4a9b21f0c4...'}</div>
                    <div className="text-[#034F46] text-[11px]">Key: sensor-07-secret-key (Hardware Vault)</div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[rgba(15,31,27,0.12)]">
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'SET_DRAWER', drawer: 'traceDrawerOpen', value: false, traceReading: null })}
                  className="w-full py-2.5 rounded-full bg-[#034F46] text-[#FCFDFD] font-semibold text-[14px]"
                >
                  Close lineage trace
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. Security Log Drawer */}
      <AnimatePresence>
        {logDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="w-full max-w-[560px] h-full bg-[#F4F0E8] border-l border-[rgba(15,31,27,0.15)] p-8 flex flex-col justify-between overflow-y-auto shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[rgba(15,31,27,0.12)] mb-4">
                  <div>
                    <span className="text-[11px] font-mono text-[#034F46] font-bold uppercase">
                      WORM Audit Trail
                    </span>
                    <h3 className="font-['Fraunces'] text-[24px] text-[#0F1F1B]">
                      Security Event Log
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'SET_DRAWER', drawer: 'logDrawerOpen', value: false })}
                    className="w-8 h-8 rounded-full border border-[rgba(15,31,27,0.2)] flex items-center justify-center text-[14px] text-[#48504F] hover:text-[#0F1F1B]"
                  >
                    ✕
                  </button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-1.5 pb-4 border-b border-[rgba(15,31,27,0.1)] mb-4">
                  {(['ALL', 'REJECT', 'QUARANTINE', 'ALERTS'] as const).map((flt) => (
                    <button
                      key={flt}
                      type="button"
                      onClick={() => setLogFilter(flt)}
                      className={`px-3 py-1 rounded-full text-[12px] font-mono font-semibold transition-all ${
                        logFilter === flt
                          ? 'bg-[#034F46] text-[#FCFDFD]'
                          : 'bg-[#e9e4db] text-[#48504F] hover:text-[#0F1F1B]'
                      }`}
                    >
                      {flt}
                    </button>
                  ))}
                </div>

                {/* Log Stream */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto font-mono text-[12px] pr-2">
                  {filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-[#e9e4db]/80 border border-[rgba(15,31,27,0.1)] space-y-0.5"
                    >
                      <div className="flex items-center justify-between text-[10px] text-[#48504F]">
                        <span>{log.time}</span>
                        <span
                          className={`font-bold px-1.5 py-0.2 rounded uppercase ${
                            log.level === 'REJECT'
                              ? 'bg-[#FEF2F2] text-[#B5483A]'
                              : log.level === 'QUARANTINE'
                              ? 'bg-[#FFF7ED] text-[#B7791F]'
                              : 'bg-[#E4F1C6] text-[#034F46]'
                          }`}
                        >
                          {log.level}
                        </span>
                      </div>
                      <div className="text-[#0F1F1B] leading-relaxed">
                        <strong className="text-[#034F46]">{log.device_id}:</strong> {log.message}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download CSV */}
              <div className="pt-6 border-t border-[rgba(15,31,27,0.12)] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={downloadCsv}
                  className="px-5 py-2.5 rounded-full bg-[#E4F1C6] text-[#034F46] font-semibold text-[13px] hover:opacity-90 transition-opacity"
                >
                  Download log (CSV)
                </button>
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'SET_DRAWER', drawer: 'logDrawerOpen', value: false })}
                  className="px-5 py-2.5 rounded-full border border-[rgba(15,31,27,0.2)] text-[13px] font-semibold hover:border-[#0F1F1B]"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {shortcutsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-[440px] bg-[#F4F0E8] rounded-[28px] border border-[rgba(15,31,27,0.15)] p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[rgba(15,31,27,0.1)]">
                <h3 className="font-['Fraunces'] text-[20px] text-[#0F1F1B]">
                  Keyboard Shortcuts
                </h3>
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'SET_DRAWER', drawer: 'shortcutsModalOpen', value: false })}
                  className="text-[#48504F] hover:text-[#0F1F1B]"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-[13px] font-mono">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#e9e4db]">
                  <span>Space</span>
                  <span className="text-[#48504F]">Play or Stop simulator</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#e9e4db]">
                  <span>1</span>
                  <span className="text-[#48504F]">Normal reading</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#e9e4db]">
                  <span>2</span>
                  <span className="text-[#48504F]">Fake sensor</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#e9e4db]">
                  <span>3</span>
                  <span className="text-[#48504F]">Changed value</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#e9e4db]">
                  <span>4</span>
                  <span className="text-[#48504F]">Replay old data</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#e9e4db]">
                  <span>5</span>
                  <span className="text-[#48504F]">Missing readings</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#e9e4db]">
                  <span>6</span>
                  <span className="text-[#48504F]">Stolen key</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#e9e4db]">
                  <span>7</span>
                  <span className="text-[#48504F]">Flood</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#e9e4db]">
                  <span>Esc</span>
                  <span className="text-[#48504F]">Close all drawers</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9. Bottom Navigation Bar */}
      <BottomBar />
    </div>
  );
}
