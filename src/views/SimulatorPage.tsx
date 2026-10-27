'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSim } from '../context/SimContext';
import { SCENARIO_LIST } from '../lib/scenarios';
import { CHECK_METADATA } from '../lib/checks';
import { StatusBadge, TrustRing, HeartbeatLine } from '../components/VisualElements';
import { BottomBar } from '../components/BottomBar';

// Display-only sample seed data for first-load state (12 normal readings)
// Does NOT touch or alter real simulator counters, trust %, or ledger state.
const SAMPLE_SEED_READINGS = [
  { seq: 89, hr: 146, outcome: 'TRUSTED', device_id: 'S-07', ts: 1700000000 },
  { seq: 90, hr: 147, outcome: 'TRUSTED', device_id: 'S-07', ts: 1700000005 },
  { seq: 91, hr: 145, outcome: 'TRUSTED', device_id: 'S-07', ts: 1700000010 },
  { seq: 92, hr: 148, outcome: 'TRUSTED', device_id: 'S-07', ts: 1700000015 },
  { seq: 93, hr: 149, outcome: 'TRUSTED', device_id: 'S-07', ts: 1700000020 },
  { seq: 94, hr: 147, outcome: 'TRUSTED', device_id: 'S-07', ts: 1700000025 },
  { seq: 95, hr: 148, outcome: 'TRUSTED', device_id: 'S-07', ts: 1700000030 },
  { seq: 96, hr: 145, outcome: 'TRUSTED', device_id: 'S-07', ts: 1700000035 },
  { seq: 97, hr: 146, outcome: 'TRUSTED', device_id: 'S-07', ts: 1700000040 },
  { seq: 98, hr: 147, outcome: 'TRUSTED', device_id: 'S-07', ts: 1700000045 },
  { seq: 99, hr: 148, outcome: 'TRUSTED', device_id: 'S-07', ts: 1700000050 },
  { seq: 100, hr: 148, outcome: 'TRUSTED', device_id: 'S-07', ts: 1700000055 },
];

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

  // Local filter for security log panel
  const [logFilter, setLogFilter] = useState<'ALL' | 'REJECT' | 'QUARANTINE' | 'ALERTS'>('ALL');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        dispatch({ type: 'SET_DRAWER', drawer: 'shortcutsModalOpen', value: true });
      } else if (e.key === 'Escape') {
        dispatch({ type: 'SET_DRAWER', drawer: 'logDrawerOpen', value: false });
        dispatch({ type: 'SET_DRAWER', drawer: 'traceDrawerOpen', value: false, traceReading: null });
        dispatch({ type: 'SET_DRAWER', drawer: 'shortcutsModalOpen', value: false });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, playAll, stopRun, runSingleScenario, dispatch]);

  const totalEvaluations = counters.trusted + counters.quarantined + counters.rejected;
  const isInitialFirstLoad = totalEvaluations === 0 && !isRunning;

  // Chart data source: pre-seeded 12 normal readings on first load (display-only),
  // which seamlessly transitions when live evaluation begins.
  const activeChartReadings = isInitialFirstLoad ? SAMPLE_SEED_READINGS : readings.slice(-14);

  // Compute Trust percentage strictly from real simulator state
  const trustPercent = totalEvaluations > 0
    ? Math.round((counters.trusted / totalEvaluations) * 100)
    : 100;

  // Dynamically compute attack results from actual security logs and counters
  const runSummary = useMemo(() => {
    if (totalEvaluations === 0) return null;

    let check1Caught = 0;
    let check2Caught = 0;
    let check3Caught = 0;
    let check4Caught = 0;
    let check5Caught = 0;
    let floodShed = 0;
    let badReadingsInTrusted = 0;

    securityLogs.forEach((log) => {
      const msg = log.message || '';
      if (msg.includes('Unknown device') || msg.includes('Check 1')) check1Caught++;
      if (msg.includes('Signature mismatch') || msg.includes('Check 2')) check2Caught++;
      if (msg.includes('Stale timestamp') || msg.includes('Replay') || msg.includes('Check 3')) check3Caught++;
      if (msg.includes('Missing readings') || msg.includes('gap from') || msg.includes('Check 4')) check4Caught++;
      if (msg.includes('physiological') || msg.includes('baseline') || msg.includes('z-score') || msg.includes('Check 5')) check5Caught++;
      if (msg.includes('Rate limiter shed') || msg.includes('Flood Stopped')) floodShed++;

      // When Protection OFF, attacks reach trusted zone
      if (msg.includes('[PROTECTION OFF]') || log.alert === 'uninspected attack') {
        badReadingsInTrusted++;
      }
    });

    const totalAttacksCaught = counters.quarantined + counters.rejected + (protectionOn && floodShed > 0 ? 1 : 0);

    return {
      totalEvaluations,
      totalAttacksCaught,
      badReadingsInTrusted,
      check1Caught,
      check2Caught,
      check3Caught,
      check4Caught,
      check5Caught,
      floodShed,
    };
  }, [totalEvaluations, securityLogs, counters, protectionOn]);

  // Filtered security logs
  const filteredLogs = securityLogs.filter((log) => {
    if (logFilter === 'ALL') return true;
    if (logFilter === 'REJECT') return log.level === 'REJECT';
    if (logFilter === 'QUARANTINE') return log.level === 'QUARANTINE';
    if (logFilter === 'ALERTS') return (log.message || '').includes('[Alert:');
    return true;
  });

  // SVG Chart coordinate calculations
  const chartW = 720;
  const chartH = 180;
  const padL = 44;
  const padR = 24;
  const padT = 20;
  const padB = 28;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  const yForHr = (hr: number) => {
    const clamped = Math.max(30, Math.min(240, hr));
    return padT + ((240 - clamped) / (240 - 30)) * plotH;
  };

  const xForIdx = (idx: number, count: number) => {
    if (count <= 1) return padL + plotW / 2;
    return padL + (idx / (count - 1)) * plotW;
  };

  const chartPoints = activeChartReadings.map((r, i) => ({
    ...r,
    x: xForIdx(i, activeChartReadings.length),
    y: yForHr(r.hr),
  }));

  const polylineStr = chartPoints
    .filter((pt) => pt.outcome === 'TRUSTED')
    .map((pt) => `${pt.x},${pt.y}`)
    .join(' L ');
  const polylinePath = polylineStr ? `M ${polylineStr}` : '';

  // Plain-English scenario descriptions
  const scenarioCaptions: Record<string, string> = {
    normal: 'Authentic sensor S-07 transmits genuine biometric data.',
    fake_sensor: 'Unregistered device S-99 attempts unauthorized data injection.',
    changed_value: 'Payload modified in transit after cryptographic signing.',
    replay_old_data: 'Intercepted packet from 120s ago re-injected into gateway.',
    missing_readings: 'Disruption causes sequence counter to skip (+27 gap).',
    stolen_key: 'Attacker has a real key but sends impossible values (400 bpm).',
    flood: 'Volumetric burst flooding gateway with 500 requests per second.',
  };

  return (
    <div className="w-full bg-[#F6F1E7] text-[#1D1B16] font-sans pb-16">
      {/* Page Title & Status Header */}
      <section className="py-6 px-4 sm:px-8 border-b border-[#E3DCCB] bg-[#FFFFFF]">
        <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[12px] font-mono font-semibold uppercase tracking-wider text-[#6B6559]">
                Live Gate Telemetry Simulator
              </span>
              <span className="text-[#E3DCCB]">·</span>
              <span className="text-[12px] font-mono text-[#6B6559]">BRCX-SPT-03 Main Proof</span>
            </div>
            <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#1D1B16] tracking-tight">
              Real-Time Verification Dashboard
            </h1>
          </div>

          {/* Quick Utility Actions: Shortcuts Popover & Audit Log Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="shortcuts-btn"
              onClick={() => dispatch({ type: 'SET_DRAWER', drawer: 'shortcutsModalOpen', value: true })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E3DCCB] bg-[#F6F1E7] text-[13px] font-medium text-[#1D1B16] hover:border-[#1D1B16] transition-colors min-h-[40px]"
              aria-label="Open keyboard shortcuts guide"
            >
              <span className="w-5 h-5 rounded-full bg-[#FFFFFF] border border-[#E3DCCB] inline-flex items-center justify-center text-[11px] font-mono">
                ?
              </span>
              <span>Shortcuts</span>
            </button>

            <button
              type="button"
              id="audit-log-toggle-btn"
              onClick={() => dispatch({ type: 'SET_DRAWER', drawer: 'logDrawerOpen', value: true })}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E3DCCB] bg-[#FFFFFF] text-[13px] font-medium text-[#1D1B16] hover:border-[#1D1B16] transition-colors min-h-[40px]"
              aria-label={`Open audit log drawer with ${securityLogs.length} events`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span>Audit Log ({securityLogs.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* Warning Banner when Protection is OFF */}
      {!protectionOn && (
        <aside
          role="alert"
          aria-live="assertive"
          className="w-full bg-[#FDF2F0] border-b border-[#F3C4BE] px-4 sm:px-8 py-3 text-[#A63D2F]"
        >
          <div className="max-w-[1300px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-[13px] font-medium">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="shrink-0">
                <path d="M8 1L15 14H1L8 1zM8 5v5M8 11.5v1" stroke="#A63D2F" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>
                <strong>Warning: Telemetry Protection is turned OFF.</strong> Ingress security checkpoints are bypassed. Malicious and manipulated packets enter the coach trendline uninspected.
              </span>
            </div>
            <button
              type="button"
              onClick={() => dispatch({ type: 'SET_PROTECTION', payload: true })}
              className="px-3 py-1 rounded-full bg-[#A63D2F] text-white text-[12px] font-semibold hover:bg-[#852E22] transition-colors shrink-0 min-h-[32px]"
            >
              Turn ON
            </button>
          </div>
        </aside>
      )}

      {/* Main Bento Grid Dashboard */}
      <main className="max-w-[1300px] mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Zone 1: Control Center & Scenario Cluster */}
        <section aria-labelledby="controls-heading" className="bento-card space-y-5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#E3DCCB]">
            {/* Protection Switch */}
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-semibold text-[#1D1B16]" id="protection-label">
                Pipeline Protection:
              </span>
              <button
                type="button"
                id="protection-switch"
                onClick={() => dispatch({ type: 'SET_PROTECTION', payload: !protectionOn })}
                className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1B16] ${
                  protectionOn ? 'bg-[#2F6B3F]' : 'bg-[#A63D2F]'
                }`}
                role="switch"
                aria-checked={protectionOn}
                aria-labelledby="protection-label"
              >
                <span
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    protectionOn ? 'translate-x-8' : 'translate-x-0'
                  }`}
                />
              </button>
              <div className="flex flex-col">
                <span className={`text-[13px] font-bold ${protectionOn ? 'text-[#2F6B3F]' : 'text-[#A63D2F]'}`}>
                  {protectionOn ? 'Protection ON (Secured)' : 'Protection OFF (Vulnerable)'}
                </span>
                <span className="text-[11px] text-[#6B6559]">
                  Turn protection OFF to see what an attack does to the numbers.
                </span>
              </div>
            </div>

            {/* Playback Controls & Proof Action Cluster */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Speed Segmented Control */}
              <div className="flex items-center p-0.5 bg-[#F6F1E7] rounded-full border border-[#E3DCCB]" role="group" aria-label="Simulator playback speed">
                <span className="text-[11px] font-mono text-[#6B6559] px-2.5">Speed:</span>
                {(['slow', 'normal', 'fast'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => dispatch({ type: 'SET_SPEED', payload: s })}
                    className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${
                      speed === s
                        ? 'bg-[#1D1B16] text-[#FFFFFF] font-semibold'
                        : 'text-[#6B6559] hover:text-[#1D1B16]'
                    }`}
                  >
                    {s === 'slow' ? 'Slow (1s)' : s === 'fast' ? 'Fast' : 'Normal'}
                  </button>
                ))}
              </div>

              {/* Step Through Mode Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#1D1B16] px-3 py-1.5 rounded-full border border-[#E3DCCB] bg-[#FFFFFF] hover:border-[#1D1B16] min-h-[40px]">
                <input
                  type="checkbox"
                  id="step-through-toggle"
                  checked={stepThrough}
                  onChange={(e) => dispatch({ type: 'SET_STEP_THROUGH', payload: e.target.checked })}
                  className="rounded text-[#1D1B16] focus:ring-[#1D1B16] w-4 h-4 cursor-pointer"
                />
                <span className="font-medium">Step-through</span>
              </label>

              {waitingForStep && (
                <button
                  type="button"
                  id="next-step-btn"
                  onClick={nextStep}
                  className="px-4 py-1.5 rounded-full bg-[#2F6B3F] text-white text-[13px] font-semibold shadow-xs animate-pulse min-h-[40px]"
                >
                  Next check →
                </button>
              )}

              {/* Reset Simulator Button */}
              {totalEvaluations > 0 && (
                <button
                  type="button"
                  onClick={resetAll}
                  className="px-3.5 py-1.5 rounded-full border border-[#E3DCCB] bg-[#FFFFFF] text-[13px] text-[#6B6559] hover:text-[#1D1B16] hover:border-[#1D1B16] min-h-[40px]"
                  title="Reset simulator counters and seed chart"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Primary Action Button & Scenario Clusters */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* "Play all attacks" is the ONE primary button */}
                {isRunning ? (
                  <button
                    type="button"
                    id="stop-run-btn"
                    onClick={stopRun}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#A63D2F] text-[#FFFFFF] font-sans font-semibold text-[14px] hover:bg-[#852E22] transition-colors min-h-[44px]"
                  >
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#FFFFFF]" aria-hidden="true" />
                    <span>Stop run</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    id="play-all-btn"
                    onClick={playAll}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1D1B16] text-[#FFFFFF] font-sans font-semibold text-[14px] hover:bg-[#333027] transition-colors min-h-[44px]"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                      <polygon points="2,1 11,6 2,11" />
                    </svg>
                    <span>Play all attacks</span>
                    <span className="text-[11px] font-mono text-[#E3DCCB] ml-1">(Space)</span>
                  </button>
                )}

                <span className="text-[12px] text-[#6B6559]">or trigger an individual test scenario:</span>
              </div>

              {/* Attack Configuration Chips */}
              <div className="flex items-center gap-2 text-[12px] font-mono text-[#6B6559]">
                <span className="px-2.5 py-1 rounded-md bg-[#F6F1E7] border border-[#E3DCCB]">
                  Attack Delta: <strong className="text-[#1D1B16]">{changedDelta} bpm</strong>
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#F6F1E7] border border-[#E3DCCB]">
                  Flood Burst: <strong className="text-[#1D1B16]">{floodBurst} req/s</strong>
                </span>
              </div>
            </div>

            {/* Seven Scenario Buttons: 2-column wrap at 375px */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {SCENARIO_LIST.map((sc, idx) => {
                const isNormal = sc.id === 'normal';
                const isActive = activeScenarioId === sc.id;
                const shortcut = String(idx + 1);

                return (
                  <button
                    key={sc.id}
                    type="button"
                    id={`scenario-btn-${sc.id}`}
                    onClick={() => runSingleScenario(sc.id)}
                    disabled={isRunning}
                    aria-label={`Trigger scenario ${sc.name}: ${scenarioCaptions[sc.id]}. Shortcut key: ${shortcut}`}
                    className={`flex flex-col text-left p-3.5 rounded-xl border transition-all min-h-[64px] ${
                      isActive
                        ? 'border-[#1D1B16] bg-[#FFFFFF] ring-2 ring-[#1D1B16]'
                        : 'border-[#E3DCCB] bg-[#FFFFFF] hover:border-[#1D1B16] hover:bg-[#FAF8F3]'
                    } ${isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between w-full gap-2">
                      <div className="flex items-center gap-2">
                        {isNormal ? (
                          <span className="w-2 h-2 rounded-full bg-[#2F6B3F] shrink-0" aria-hidden="true" />
                        ) : (
                          <span className="w-2 h-2 rounded-xs bg-[#B7791F] shrink-0" aria-hidden="true" />
                        )}
                        <span className="font-semibold text-[13px] text-[#1D1B16]">{sc.name}</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F6F1E7] border border-[#E3DCCB] text-[#6B6559]">
                        {shortcut}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#6B6559] mt-1 line-clamp-1">
                      {scenarioCaptions[sc.id]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Zone 2 & Zone 3: Live Ingress Packet, 5-Check Stepper & Real-Time Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Zone 2 Left: Live Ingress Packet Card (4 cols) */}
          <section aria-labelledby="packet-heading" className="lg:col-span-4 bento-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3DCCB]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1D1B16] animate-pulse" aria-hidden="true" />
                <h2 id="packet-heading" className="text-[14px] font-semibold text-[#1D1B16] uppercase tracking-wider font-mono">
                  Ingress Telemetry Packet
                </h2>
              </div>
              <span className="text-[11px] font-mono text-[#6B6559]">
                {currentPacket ? `#${currentPacket.seq}` : 'Awaiting packet'}
              </span>
            </div>

            {/* Live Packet Raw Attributes */}
            <div className="p-3.5 rounded-xl bg-[#F6F1E7] border border-[#E3DCCB] font-mono text-[12px] space-y-1.5">
              {!currentPacket ? (
                <div className="py-6 text-center text-[#6B6559]">
                  <p className="text-[13px] font-sans">Press <strong>Play all attacks</strong> to see the gate in action.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-[#6B6559]">device_id:</span>
                    <strong className={currentPacket.device_id === 'S-99' ? 'text-[#A63D2F]' : 'text-[#1D1B16]'}>
                      "{currentPacket.device_id}"
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B6559]">metric:</span>
                    <span className="text-[#1D1B16]">"{currentPacket.metric || 'hr'}"</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B6559]">value:</span>
                    <strong className={currentPacket.value > 220 ? 'text-[#B7791F]' : 'text-[#1D1B16]'}>
                      {currentPacket.value} bpm
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B6559]">sequence:</span>
                    <span className="text-[#1D1B16]">#{currentPacket.seq}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B6559]">timestamp:</span>
                    <span className="text-[#1D1B16]">{currentPacket.ts}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B6559]">nonce:</span>
                    <span className="text-[#1D1B16] truncate max-w-[140px]">{currentPacket.nonce}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#E3DCCB]">
                    <span className="text-[#6B6559]">hmac_sha256:</span>
                    <span className="text-[#1D1B16] truncate max-w-[140px]">
                      {currentPacket.sig ? currentPacket.sig.slice(0, 16) + '…' : '—'}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Ingress Gateway Perimeter Availability Meter */}
            <div className="pt-2 border-t border-[#E3DCCB] flex items-center justify-between text-[12px] font-mono">
              <span className="text-[#6B6559]">Gateway Availability:</span>
              <strong className={availabilityMeter > 50 ? 'text-[#2F6B3F]' : 'text-[#A63D2F]'}>
                {availabilityMeter}%
              </strong>
            </div>

            {/* Live Verdict Banner */}
            <div className="p-3 rounded-xl border border-[#E3DCCB] bg-[#FFFFFF] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#6B6559] uppercase">Verdict</span>
                <StatusBadge status={verdict} size="sm" />
              </div>
              <p className="text-[12px] text-[#1D1B16] leading-snug">
                {isInitialFirstLoad ? 'Press Play all attacks to see the gate in action.' : verdictText}
              </p>
            </div>
          </section>

          {/* Zone 2 Right: The 5-Check Stepper (8 cols) */}
          <section aria-labelledby="checks-heading" className="lg:col-span-8 bento-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3DCCB]">
              <div>
                <h2 id="checks-heading" className="text-[16px] font-semibold text-[#1D1B16]">
                  Five Sequential Security Checks
                </h2>
                <p className="text-[12px] text-[#6B6559]">
                  Every telemetry reading must pass all 5 checkpoints before reaching coach dashboards.
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#6B6559]">350ms pipeline stagger</span>
            </div>

            {/* Check Stepper Row */}
            <div className="space-y-2.5">
              {CHECK_METADATA.map((chk, idx) => {
                const status = checkStatuses[idx] || { state: 'idle' };

                let borderClass = 'border-[#E3DCCB] bg-[#FFFFFF]';
                let icon = <span className="w-2 h-2 rounded-full bg-[#E3DCCB]" aria-hidden="true" />;
                let textClass = 'text-[#6B6559]';
                let statusBadgeLabel = 'Standby';

                if (status.state === 'checking') {
                  borderClass = 'border-[#1D1B16] bg-[#FFFFFF] ring-2 ring-[#1D1B16]';
                  icon = <span className="w-2.5 h-2.5 rounded-full bg-[#1D1B16] animate-ping" aria-hidden="true" />;
                  textClass = 'text-[#1D1B16] font-semibold';
                  statusBadgeLabel = 'Evaluating…';
                } else if (status.state === 'pass') {
                  borderClass = 'border-[#C1DEC8] bg-[#F0F6F2]';
                  icon = (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#2F6B3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="2 6 5 9 10 3" />
                    </svg>
                  );
                  textClass = 'text-[#2F6B3F] font-semibold';
                  statusBadgeLabel = 'Pass';
                } else if (status.state === 'fail') {
                  borderClass = 'border-[#F3C4BE] bg-[#FDF2F0]';
                  icon = (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#A63D2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="2" y1="2" x2="10" y2="10" />
                      <line x1="10" y1="2" x2="2" y2="10" />
                    </svg>
                  );
                  textClass = 'text-[#A63D2F] font-semibold';
                  statusBadgeLabel = 'Fail';
                } else if (status.state === 'flag') {
                  borderClass = 'border-[#F5DCB0] bg-[#FEF8EE]';
                  icon = (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="#B7791F" aria-hidden="true">
                      <polygon points="6,1 11.5,11 0.5,11" />
                    </svg>
                  );
                  textClass = 'text-[#B7791F] font-semibold';
                  statusBadgeLabel = 'Flagged';
                } else if (status.state === 'skipped') {
                  borderClass = 'border-[#E3DCCB] bg-[#F6F1E7]/50 opacity-60';
                  icon = <span className="text-[11px] font-mono text-[#6B6559]">―</span>;
                  statusBadgeLabel = 'Skipped';
                }

                return (
                  <div
                    key={chk.id}
                    className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${borderClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#FFFFFF] border border-[#E3DCCB] flex items-center justify-center shrink-0">
                        {icon}
                      </div>
                      <div>
                        <div className={`text-[13px] ${textClass}`}>
                          {chk.id}. {chk.name}
                        </div>
                        <div className="text-[11px] text-[#6B6559]">
                          {chk.question}
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono sm:text-right">
                      {status.reason ? (
                        <span className={status.state === 'fail' ? 'text-[#A63D2F]' : status.state === 'flag' ? 'text-[#B7791F]' : 'text-[#2F6B3F]'}>
                          {status.reason}
                        </span>
                      ) : (
                        <span className="text-[#6B6559]">{statusBadgeLabel}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Zone 3 & Zone 4: Metrics Bento Row & Heart-Rate Trendline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Zone 3: Metrics Cards (4 cols) */}
          <section aria-labelledby="metrics-heading" className="lg:col-span-4 grid grid-cols-3 gap-3">
            {/* Trusted */}
            <div className="bento-card p-4 flex flex-col justify-between text-center border-[#C1DEC8] bg-[#F0F6F2]">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono uppercase text-[#2F6B3F] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#2F6B3F]" aria-hidden="true" />
                <span>Trusted</span>
              </div>
              <span className="font-mono text-[36px] font-bold text-[#2F6B3F] leading-none my-2">
                {counters.trusted}
              </span>
              <span className="text-[10px] text-[#2F6B3F]/80">Passed gate</span>
            </div>

            {/* Quarantined */}
            <div className="bento-card p-4 flex flex-col justify-between text-center border-[#F5DCB0] bg-[#FEF8EE]">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono uppercase text-[#B7791F] font-semibold">
                <span className="text-[10px]" aria-hidden="true">▲</span>
                <span>Quarantine</span>
              </div>
              <span className="font-mono text-[36px] font-bold text-[#B7791F] leading-none my-2">
                {counters.quarantined}
              </span>
              <span className="text-[10px] text-[#B7791F]/80">Isolated</span>
            </div>

            {/* Rejected */}
            <div className="bento-card p-4 flex flex-col justify-between text-center border-[#F3C4BE] bg-[#FDF2F0]">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono uppercase text-[#A63D2F] font-semibold">
                <span className="text-[11px] font-bold" aria-hidden="true">✕</span>
                <span>Rejected</span>
              </div>
              <span className="font-mono text-[36px] font-bold text-[#A63D2F] leading-none my-2">
                {counters.rejected}
              </span>
              <span className="text-[10px] text-[#A63D2F]/80">Dropped</span>
            </div>

            {/* Trust Ring Gauge & Chain Status in Bottom Span */}
            <div className="col-span-3 bento-card p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <TrustRing trustedCount={counters.trusted} totalCount={totalEvaluations} size={76} />
                <div>
                  <div className="text-[13px] font-semibold text-[#1D1B16]">
                    Integrity Rating
                  </div>
                  <div className="text-[11px] text-[#6B6559]">
                    {totalEvaluations === 0 ? 'Awaiting evaluations' : `${counters.trusted} of ${totalEvaluations} verified`}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[11px] font-mono text-[#6B6559] uppercase">Ledger Proof</div>
                <div className="text-[12px] font-mono font-bold text-[#2F6B3F]">
                  {chainStatus.valid ? '✓ SHA-256 Valid' : '✕ Tampered'}
                </div>
              </div>
            </div>
          </section>

          {/* Zone 4: Heart-Rate Trendline (8 cols) */}
          <section aria-labelledby="trendline-heading" className="lg:col-span-8 bento-card flex flex-col justify-between space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#E3DCCB] gap-2">
              <div className="flex items-center gap-2">
                <h2 id="trendline-heading" className="text-[15px] font-semibold text-[#1D1B16]">
                  Heart Rate Trendline
                </h2>
                {isInitialFirstLoad && (
                  <span className="px-2 py-0.5 rounded-full bg-[#F6F1E7] border border-[#E3DCCB] text-[11px] font-mono text-[#6B6559]">
                    Sample data
                  </span>
                )}
                <span className="text-[11px] font-mono text-[#6B6559] hidden sm:inline">
                  (Click point to trace provenance)
                </span>
              </div>

              {/* Marker Legend: filled circle for Trusted, triangle for Quarantined */}
              <div className="flex items-center gap-4 text-[11px] font-mono text-[#6B6559]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2F6B3F]" aria-hidden="true" />
                  <span>Trusted (circle)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#B7791F]" aria-hidden="true">▲</span>
                  <span>Quarantined (triangle)</span>
                </span>
              </div>
            </div>

            {/* SVG Trendline Chart with Scrollable Container on 375px */}
            <div className="w-full overflow-x-auto my-1 focus-visible:outline-none">
              <div className="min-w-[560px] h-[160px] relative">
                <svg
                  viewBox={`0 0 ${chartW} ${chartH}`}
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                  aria-label="Heart rate trendline chart"
                >
                  {/* Grid Lines & Y-Axis Labels (bpm) */}
                  {[220, 180, 150, 120, 60].map((bpm) => {
                    const y = yForHr(bpm);
                    return (
                      <g key={bpm}>
                        <line
                          x1={padL}
                          y1={y}
                          x2={chartW - padR}
                          y2={y}
                          stroke="#E3DCCB"
                          strokeDasharray="3 3"
                        />
                        <text
                          x={padL - 8}
                          y={y + 3}
                          textAnchor="end"
                          className="fill-[#6B6559] text-[10px] font-mono"
                        >
                          {bpm}
                        </text>
                      </g>
                    );
                  })}

                  {/* Axis Title */}
                  <text
                    x={padL - 32}
                    y={padT - 6}
                    className="fill-[#6B6559] text-[9px] font-mono font-semibold"
                  >
                    BPM
                  </text>

                  {/* Connected Polyline for Trusted Trendline */}
                  {polylinePath && (
                    <path
                      d={polylinePath}
                      fill="none"
                      stroke="#2F6B3F"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Clickable Data Markers: Circles for Trusted, Triangles for Quarantined */}
                  {chartPoints.map((pt, idx) => {
                    const isTrusted = pt.outcome === 'TRUSTED';
                    const titleText = `Seq #${pt.seq}: ${pt.hr} bpm (${pt.outcome}) - Click to trace provenance`;

                    if (isTrusted) {
                      return (
                        <circle
                          key={idx}
                          cx={pt.x}
                          cy={pt.y}
                          r={5}
                          fill="#2F6B3F"
                          stroke="#FFFFFF"
                          strokeWidth={1.5}
                          className="cursor-pointer hover:scale-150 transition-transform focus:outline-none"
                          tabIndex={0}
                          role="button"
                          aria-label={titleText}
                          onClick={() => {
                            dispatch({
                              type: 'SET_DRAWER',
                              drawer: 'traceDrawerOpen',
                              value: true,
                              traceReading: pt,
                            });
                          }}
                        >
                          <title>{titleText}</title>
                        </circle>
                      );
                    }

                    // Quarantined: distinct triangle marker
                    const trianglePoints = `${pt.x},${pt.y - 7} ${pt.x - 6},${pt.y + 5} ${pt.x + 6},${pt.y + 5}`;
                    return (
                      <polygon
                        key={idx}
                        points={trianglePoints}
                        fill="#B7791F"
                        stroke="#FFFFFF"
                        strokeWidth={1.5}
                        className="cursor-pointer hover:scale-150 transition-transform focus:outline-none"
                        tabIndex={0}
                        role="button"
                        aria-label={titleText}
                        onClick={() => {
                          dispatch({
                            type: 'SET_DRAWER',
                            drawer: 'traceDrawerOpen',
                            value: true,
                            traceReading: pt,
                          });
                        }}
                      >
                        <title>{titleText}</title>
                      </polygon>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Proof Cluster: Verify Chain & Tamper Record */}
            <div className="pt-3 border-t border-[#E3DCCB] flex flex-wrap items-center justify-between gap-3 text-[12px]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="verify-chain-btn"
                  onClick={verifyChain}
                  className="px-3.5 py-1.5 rounded-full border border-[#E3DCCB] bg-[#FFFFFF] text-[#1D1B16] font-medium hover:border-[#1D1B16] transition-colors min-h-[38px]"
                >
                  Verify chain
                </button>
                <button
                  type="button"
                  id="tamper-record-btn"
                  onClick={() => tamperChain(0)}
                  className="px-3.5 py-1.5 rounded-full border border-[#F3C4BE] bg-[#FDF2F0] text-[#A63D2F] font-medium hover:bg-[#FBE9E7] transition-colors min-h-[38px]"
                >
                  Tamper with a record
                </button>
              </div>

              <div className="text-[11px] font-mono text-[#6B6559]">
                Clicking any point above opens instant cryptographic lineage trace
              </div>
            </div>
          </section>
        </div>

        {/* Dynamic Post-Run Result Summary Card (Computed strictly from real simulator state) */}
        {runSummary && (
          <section aria-labelledby="summary-heading" className="bento-card bg-[#FFFFFF] border-2 border-[#1D1B16] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3DCCB]">
              <div>
                <span className="text-[11px] font-mono uppercase text-[#6B6559] font-bold">
                  Run Evaluation Report
                </span>
                <h3 id="summary-heading" className="text-[18px] font-semibold text-[#1D1B16]">
                  Adversary Drill Results
                </h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-[12px] font-mono font-semibold ${
                protectionOn ? 'bg-[#F0F6F2] text-[#2F6B3F] border border-[#C1DEC8]' : 'bg-[#FDF2F0] text-[#A63D2F] border border-[#F3C4BE]'
              }`}>
                {protectionOn ? 'Defense Active' : 'Protection Disabled'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-[#F6F1E7] border border-[#E3DCCB]">
                <div className="text-[11px] font-mono text-[#6B6559] uppercase">Evaluations Run</div>
                <div className="text-[24px] font-bold text-[#1D1B16] mt-0.5">{runSummary.totalEvaluations}</div>
                <div className="text-[11px] text-[#6B6559] mt-1">Total packets processed</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F6F1E7] border border-[#E3DCCB]">
                <div className="text-[11px] font-mono text-[#6B6559] uppercase">Attacks Stopped / Shed</div>
                <div className="text-[24px] font-bold text-[#2F6B3F] mt-0.5">
                  {protectionOn ? runSummary.totalAttacksCaught : 0}
                </div>
                <div className="text-[11px] text-[#6B6559] mt-1">
                  {protectionOn ? 'Intercepted at gate' : 'None stopped (bypassed)'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F6F1E7] border border-[#E3DCCB]">
                <div className="text-[11px] font-mono text-[#6B6559] uppercase">Bad Readings in Trusted Zone</div>
                <div className={`text-[24px] font-bold mt-0.5 ${runSummary.badReadingsInTrusted > 0 ? 'text-[#A63D2F]' : 'text-[#2F6B3F]'}`}>
                  {runSummary.badReadingsInTrusted}
                </div>
                <div className="text-[11px] text-[#6B6559] mt-1">
                  {protectionOn ? '0 compromised data reached coach' : 'Attacks polluted trendline!'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F6F1E7] border border-[#E3DCCB]">
                <div className="text-[11px] font-mono text-[#6B6559] uppercase">Checkpoint Breakdown</div>
                <div className="text-[11px] font-mono text-[#1D1B16] mt-1 space-y-0.5">
                  <div>Check 1 (ID): {runSummary.check1Caught}</div>
                  <div>Check 2 (HMAC): {runSummary.check2Caught}</div>
                  <div>Check 3 (Fresh): {runSummary.check3Caught}</div>
                  <div>Check 4 (Seq): {runSummary.check4Caught}</div>
                  <div>Check 5 (Biometric): {runSummary.check5Caught}</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Zone 5: Ledger and Proof Panel */}
        <section aria-labelledby="ledger-heading" className="bento-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E3DCCB] gap-2">
            <div>
              <h2 id="ledger-heading" className="text-[16px] font-semibold text-[#1D1B16]">
                Immutable SHA-256 Block Ledger
              </h2>
              <p className="text-[12px] text-[#6B6559]">
                Every accepted reading is permanently hashed into an append-only cryptographic chain.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-[12px] font-mono font-semibold ${
                chainStatus.valid ? 'bg-[#F0F6F2] text-[#2F6B3F] border border-[#C1DEC8]' : 'bg-[#FDF2F0] text-[#A63D2F] border border-[#F3C4BE]'
              }`}>
                {chainStatus.valid ? '✓ Chain Verified' : `✕ ${chainStatus.message}`}
              </span>
            </div>
          </div>

          {/* Ledger Blocks Horizontal Ribbon */}
          <div className="w-full overflow-x-auto pb-2">
            <div className="flex items-center gap-3 min-w-[700px]">
              {ledgerChain.slice(-5).map((block, i) => (
                <div
                  key={block.hash || i}
                  className="flex-1 p-3.5 rounded-xl border border-[#E3DCCB] bg-[#F6F1E7] font-mono text-[11px] space-y-1 min-w-[150px]"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-[#1D1B16]">Block #{block.index}</strong>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FFFFFF] text-[#2F6B3F] border border-[#C1DEC8]">
                      SHA-256
                    </span>
                  </div>
                  <div className="text-[12px] font-sans font-semibold text-[#1D1B16]">
                    {block.data.value} bpm ({block.data.device_id})
                  </div>
                  <div className="truncate text-[#6B6559]" title={`Hash: ${block.hash}`}>
                    hash: {block.hash ? block.hash.slice(0, 14) + '…' : '—'}
                  </div>
                  <div className="truncate text-[#6B6559]" title={`Prev: ${block.prevHash}`}>
                    prev: {block.prevHash ? block.prevHash.slice(0, 10) + '…' : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Signature Heartbeat Line Divider */}
      <HeartbeatLine />

      {/* Provenance Lineage Trace Drawer */}
      {traceDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs" role="dialog" aria-modal="true" aria-labelledby="trace-heading">
          <div className="w-full max-w-[500px] h-full bg-[#FFFFFF] border-l border-[#E3DCCB] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E3DCCB] mb-6">
                <div>
                  <span className="text-[11px] font-mono text-[#2F6B3F] font-bold uppercase">
                    Provenance Proof
                  </span>
                  <h3 id="trace-heading" className="text-[22px] font-semibold text-[#1D1B16]">
                    Trace Reading #{selectedTraceReading?.seq || '100'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'SET_DRAWER', drawer: 'traceDrawerOpen', value: false, traceReading: null })}
                  className="w-8 h-8 rounded-full border border-[#E3DCCB] flex items-center justify-center text-[14px] text-[#6B6559] hover:text-[#1D1B16] min-h-[32px]"
                  aria-label="Close lineage trace"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-[13px] font-mono">
                <div className="p-4 rounded-xl bg-[#F6F1E7] border border-[#E3DCCB] space-y-1">
                  <span className="text-[11px] text-[#6B6559] font-bold">1. DASHBOARD VALUE</span>
                  <div className="text-[28px] text-[#2F6B3F] font-bold">
                    {selectedTraceReading?.hr || 148} bpm
                  </div>
                  <div className="text-[11px] text-[#6B6559]">Displayed on coach sideline monitor</div>
                </div>

                <div className="p-4 rounded-xl bg-[#F6F1E7] border border-[#E3DCCB] space-y-1">
                  <span className="text-[11px] text-[#6B6559] font-bold">2. PROCESSED VALUE</span>
                  <div>Validated sequence: #{selectedTraceReading?.seq || 100}</div>
                  <div className="text-[11px] text-[#6B6559]">Status: {selectedTraceReading?.outcome || 'TRUSTED'}</div>
                </div>

                <div className="p-4 rounded-xl bg-[#F6F1E7] border border-[#E3DCCB] space-y-1">
                  <span className="text-[11px] text-[#6B6559] font-bold">3. RAW IMMUTABLE RECORD</span>
                  <div>Timestamp: {selectedTraceReading?.ts || 1700000000}s</div>
                  <div className="truncate">Nonce: {selectedTraceReading?.nonce || 'n-sample'}</div>
                  <div className="text-[#2F6B3F] text-[11px] font-semibold">
                    Stored unchanged in append-only WORM Raw Zone
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F6F1E7] border border-[#E3DCCB] space-y-1">
                  <span className="text-[11px] text-[#6B6559] font-bold">4. SIGNED SOURCE EVENT</span>
                  <div>Device ID: {selectedTraceReading?.device_id || 'S-07'}</div>
                  <div className="truncate">HMAC-SHA256: {selectedTraceReading?.sig || '4a9b21f0c4...'}</div>
                  <div className="text-[#2F6B3F] text-[11px]">Hardware Vault: sensor-07-secret-key</div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E3DCCB]">
              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_DRAWER', drawer: 'traceDrawerOpen', value: false, traceReading: null })}
                className="w-full py-2.5 rounded-full bg-[#1D1B16] text-[#FFFFFF] font-semibold text-[14px] hover:bg-[#333027] transition-colors min-h-[44px]"
              >
                Close lineage trace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collapsible Audit Log Side Panel with aria-live */}
      {logDrawerOpen && (
        <aside
          className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="audit-log-heading"
        >
          <div className="w-full max-w-[560px] h-full bg-[#FFFFFF] border-l border-[#E3DCCB] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E3DCCB] mb-4">
                <div>
                  <span className="text-[11px] font-mono text-[#2F6B3F] font-bold uppercase">
                    WORM Audit Trail
                  </span>
                  <h3 id="audit-log-heading" className="text-[22px] font-semibold text-[#1D1B16]">
                    Security Event Log
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'SET_DRAWER', drawer: 'logDrawerOpen', value: false })}
                  className="w-8 h-8 rounded-full border border-[#E3DCCB] flex items-center justify-center text-[14px] text-[#6B6559] hover:text-[#1D1B16] min-h-[32px]"
                  aria-label="Close security log drawer"
                >
                  ✕
                </button>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-1.5 pb-4 border-b border-[#E3DCCB] mb-4">
                {(['ALL', 'REJECT', 'QUARANTINE', 'ALERTS'] as const).map((flt) => (
                  <button
                    key={flt}
                    type="button"
                    onClick={() => setLogFilter(flt)}
                    className={`px-3 py-1 rounded-full text-[12px] font-mono font-medium transition-colors ${
                      logFilter === flt
                        ? 'bg-[#1D1B16] text-[#FFFFFF]'
                        : 'bg-[#F6F1E7] text-[#6B6559] hover:text-[#1D1B16]'
                    }`}
                  >
                    {flt}
                  </button>
                ))}
              </div>

              {/* Log Stream with aria-live */}
              <div
                className="space-y-2 max-h-[500px] overflow-y-auto font-mono text-[12px] pr-2"
                aria-live="polite"
                aria-relevant="additions"
              >
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-[#F6F1E7] border border-[#E3DCCB] space-y-0.5"
                  >
                    <div className="flex items-center justify-between text-[10px] text-[#6B6559]">
                      <span>{log.time}</span>
                      <span
                        className={`font-bold px-1.5 py-0.5 rounded uppercase ${
                          log.level === 'REJECT'
                            ? 'bg-[#FDF2F0] text-[#A63D2F] border border-[#F3C4BE]'
                            : log.level === 'QUARANTINE'
                            ? 'bg-[#FEF8EE] text-[#B7791F] border border-[#F5DCB0]'
                            : 'bg-[#F0F6F2] text-[#2F6B3F] border border-[#C1DEC8]'
                        }`}
                      >
                        {log.level}
                      </span>
                    </div>
                    <div className="text-[#1D1B16] leading-relaxed">
                      <strong className="text-[#1D1B16]">{log.device_id}:</strong> {log.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Download CSV & Close */}
            <div className="pt-6 border-t border-[#E3DCCB] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={downloadCsv}
                className="px-5 py-2.5 rounded-full bg-[#1D1B16] text-[#FFFFFF] font-semibold text-[13px] hover:bg-[#333027] transition-colors min-h-[44px]"
              >
                Download CSV
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_DRAWER', drawer: 'logDrawerOpen', value: false })}
                className="px-5 py-2.5 rounded-full border border-[#E3DCCB] bg-[#FFFFFF] text-[13px] font-semibold text-[#1D1B16] hover:border-[#1D1B16] min-h-[44px]"
              >
                Close
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Keyboard Shortcuts Popover Modal */}
      {shortcutsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-modal-heading"
        >
          <div className="w-full max-w-[440px] bg-[#FFFFFF] rounded-2xl border border-[#E3DCCB] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3DCCB]">
              <h3 id="shortcuts-modal-heading" className="text-[18px] font-semibold text-[#1D1B16]">
                Keyboard Shortcuts
              </h3>
              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_DRAWER', drawer: 'shortcutsModalOpen', value: false })}
                className="text-[#6B6559] hover:text-[#1D1B16]"
                aria-label="Close shortcuts modal"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-[13px] font-mono">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F6F1E7]">
                <span className="font-bold text-[#1D1B16]">Space</span>
                <span className="text-[#6B6559]">Play or Stop simulator</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F6F1E7]">
                <span className="font-bold text-[#1D1B16]">1</span>
                <span className="text-[#6B6559]">Normal reading</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F6F1E7]">
                <span className="font-bold text-[#1D1B16]">2</span>
                <span className="text-[#6B6559]">Fake sensor</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F6F1E7]">
                <span className="font-bold text-[#1D1B16]">3</span>
                <span className="text-[#6B6559]">Changed value</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F6F1E7]">
                <span className="font-bold text-[#1D1B16]">4</span>
                <span className="text-[#6B6559]">Replay old data</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F6F1E7]">
                <span className="font-bold text-[#1D1B16]">5</span>
                <span className="text-[#6B6559]">Missing readings</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F6F1E7]">
                <span className="font-bold text-[#1D1B16]">6</span>
                <span className="text-[#6B6559]">Stolen key</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F6F1E7]">
                <span className="font-bold text-[#1D1B16]">7</span>
                <span className="text-[#6B6559]">Flood</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F6F1E7]">
                <span className="font-bold text-[#1D1B16]">Esc</span>
                <span className="text-[#6B6559]">Close open drawer or modal</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation flow: Next: See how it's built -> /architecture */}
      <BottomBar />
    </div>
  );
}
