'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HeartbeatLine,
  SensorIllustration,
  ShieldIllustration,
  LedgerIllustration,
  DashboardIllustration,
} from '../components/VisualElements';

export function ArchitecturePage() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [packetSimState, setPacketSimState] = useState<'idle' | 'good' | 'bad' | 'lineage'>('idle');
  const [userRole, setUserRole] = useState<'coach' | 'analyst'>('coach');
  const [deniedAnimation, setDeniedAnimation] = useState(false);

  // Tooltip interactive state (accessible hover & focus)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const stages = [
    {
      num: '01',
      title: 'Sources',
      tag: 'Edge hardware',
      points: [
        'Wearables, biometric sensors, and athlete telemetry beacons',
        'Device private keys burned into secure hardware elements',
        'Direct BLE / Cellular encrypted uplink transmission',
        'Perimeter RF environment assumed hostile and untrusted',
      ],
    },
    {
      num: '02',
      title: 'Gateway',
      tag: 'Perimeter defense',
      points: [
        'Device cryptographic identity verification (Check 1: Who sent it?)',
        'Signed payload HMAC-SHA256 integrity inspection (Check 2: Was it altered?)',
        'Token-bucket rate limiting shedding volumetric bursts (20/s threshold)',
        'Syntactic input validation dropping malformed packets at perimeter',
      ],
    },
    {
      num: '03',
      title: 'Validation',
      tag: 'Integrity gate',
      points: [
        'Fresh timestamp check (±5s limit) & unique nonce (Check 3: Is it fresh?)',
        'Monotonic sequence counter continuity (Check 4: Is it in order?)',
        'Physiological biometric bounds 30–220 bpm (Check 5: Does it make sense?)',
        'Per-athlete rolling baseline statistical z-score evaluation',
      ],
    },
    {
      num: '04',
      title: 'Raw Zone',
      tag: 'Immutable WORM',
      points: [
        'Append-only Write-Once-Read-Many (WORM) storage architecture',
        'Original sensor telemetry kept completely unmodified in perpetuity',
        'Cryptographic evidentiary store with chained SHA-256 blocks',
        'Zero manual or programmatic edits permitted by any user role',
      ],
    },
    {
      num: '05',
      title: 'Processing',
      tag: 'Stream analytics',
      points: [
        'Stream aggregation engine with least-privilege service credentials',
        'Read-only access strictly enforced against the immutable Raw Zone',
        'Mathematical cardiovascular exertion and fatigue trend modeling',
        'Output integrity verification before publishing to reporting endpoints',
      ],
    },
    {
      num: '06',
      title: 'Reporting',
      tag: 'Coach dashboard',
      points: [
        'Real-time sideline dashboard displays for coaching decisions',
        'Unambiguous status labels on every metric: Trusted, Quarantined, Rejected',
        'Cryptographic lineage trace linking every number back to source event',
        'Role-scoped least-privilege access boundaries (Coach vs Analyst)',
      ],
    },
  ];

  // Plain-English Definitions for Core Cryptographic & Architectural Concepts
  const terms = {
    'HMAC-SHA256': {
      term: 'HMAC-SHA256',
      def: 'Hash-based Message Authentication Code using SHA-256: verifies both data authenticity and data integrity using a shared secret key.',
    },
    WORM: {
      term: 'WORM',
      def: 'Write Once, Read Many: an immutable storage architecture where records cannot be overwritten, modified, or deleted once written.',
    },
    nonce: {
      term: 'Nonce',
      def: 'Number used once: an unpredictable cryptographic token ensuring an intercepted packet cannot be re-injected in a replay attack.',
    },
    'z-score': {
      term: 'z-score',
      def: 'Statistical measure of how many standard deviations a reading is from the athlete’s rolling baseline mean; values above 3.0 flag extreme anomalies.',
    },
  };

  const handleSendGoodPacket = () => {
    setPacketSimState('good');
    setTimeout(() => setPacketSimState('idle'), 3200);
  };

  const handleSendBadPacket = () => {
    setPacketSimState('bad');
    setTimeout(() => setPacketSimState('idle'), 3200);
  };

  const handleShowLineage = () => {
    setPacketSimState('lineage');
    setTimeout(() => setPacketSimState('idle'), 3500);
  };

  const handleTryEditRaw = () => {
    setDeniedAnimation(true);
    setTimeout(() => setDeniedAnimation(false), 2400);
  };

  return (
    <div className="w-full bg-[#F6F1E7] text-[#1D1B16] font-sans pb-16">
      {/* 1. Header Section */}
      <section className="py-12 lg:py-16 px-4 sm:px-8 border-b border-[#E3DCCB] bg-[#FFFFFF]">
        <div className="max-w-[1300px] mx-auto space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-mono font-semibold uppercase tracking-wider text-[#6B6559]">
              Pipeline Architecture
            </span>
            <span className="text-[#E3DCCB]">·</span>
            <span className="text-[12px] font-mono text-[#6B6559]">6 stages · 5 checks per reading</span>
          </div>

          <h1 className="text-[34px] sm:text-[46px] font-semibold text-[#1D1B16] tracking-tight">
            Six stages. Nothing unverified moves forward.
          </h1>

          <p className="text-[16px] text-[#6B6559] max-w-[68ch] leading-relaxed">
            Every reading passes through an isolated six-stage defense-in-depth pipeline. Tampered or unauthenticated telemetry is isolated at the perimeter before it can pollute sideline analytics.
          </p>

          {/* Core Technical Glossary Tooltip Pills */}
          <div className="pt-2 flex flex-wrap items-center gap-2" role="region" aria-label="Cryptographic terms glossary">
            <span className="text-[12px] font-mono text-[#6B6559] mr-1">Glossary tooltips:</span>
            {Object.entries(terms).map(([key, item]) => {
              const isHovered = activeTooltip === key;
              return (
                <div key={key} className="relative inline-block">
                  <button
                    type="button"
                    onMouseEnter={() => setActiveTooltip(key)}
                    onMouseLeave={() => setActiveTooltip(null)}
                    onFocus={() => setActiveTooltip(key)}
                    onBlur={() => setActiveTooltip(null)}
                    aria-describedby={`tooltip-${key}`}
                    className="px-3 py-1 rounded-full bg-[#F6F1E7] border border-[#E3DCCB] text-[12px] font-mono font-semibold text-[#1D1B16] hover:border-[#1D1B16] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1B16] min-h-[32px]"
                  >
                    {item.term} ℹ
                  </button>

                  {isHovered && (
                    <div
                      id={`tooltip-${key}`}
                      role="tooltip"
                      className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-[#1D1B16] text-[#FFFFFF] rounded-xl text-[12px] leading-snug shadow-xl"
                    >
                      <strong className="block font-mono text-[#E3DCCB] mb-1">{item.term}</strong>
                      <span>{item.def}</span>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1D1B16]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Interactive 6-Stage Pipeline Diagram */}
      <section className="py-12 px-4 sm:px-8 max-w-[1300px] mx-auto space-y-6">
        <div className="bento-card space-y-6">
          {/* Quick Preview Header + Action Controls */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#E3DCCB]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-mono uppercase text-[#6B6559] font-semibold">
                  Quick preview
                </span>
                <span className="text-[#E3DCCB]">·</span>
                <Link
                  href="/simulator"
                  className="text-[12px] font-mono text-[#2F6B3F] hover:underline font-semibold"
                >
                  Try all 7 attacks in the live demo →
                </Link>
              </div>
              <h2 className="text-[20px] font-semibold text-[#1D1B16] mt-0.5">
                Horizontal Pipeline Flow
              </h2>
            </div>

            {/* Quick Preview Simulation Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                id="preview-good-btn"
                onClick={handleSendGoodPacket}
                className="px-4 py-2 rounded-full text-[13px] font-semibold bg-[#F0F6F2] border border-[#C1DEC8] text-[#2F6B3F] hover:bg-[#E4F1C6]/50 transition-colors min-h-[40px]"
              >
                ✓ Send a good packet
              </button>
              <button
                type="button"
                id="preview-bad-btn"
                onClick={handleSendBadPacket}
                className="px-4 py-2 rounded-full text-[13px] font-semibold bg-[#FDF2F0] border border-[#F3C4BE] text-[#A63D2F] hover:bg-[#FBE9E7] transition-colors min-h-[40px]"
              >
                ✕ Send a bad packet
              </button>
              <button
                type="button"
                id="preview-lineage-btn"
                onClick={handleShowLineage}
                className="px-4 py-2 rounded-full text-[13px] font-semibold bg-[#1D1B16] text-[#FFFFFF] hover:bg-[#333027] transition-colors min-h-[40px]"
              >
                ⮐ Show lineage loop
              </button>
            </div>
          </div>

          {/* 6 Stage Buttons Horizontal Diagram (Click and keyboard reachable, stage 1 open by default) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" role="tablist" aria-label="Pipeline stages">
            {stages.map((st, idx) => {
              const isSelected = activeStageIndex === idx;
              return (
                <button
                  key={st.num}
                  type="button"
                  role="tab"
                  id={`stage-tab-${idx}`}
                  aria-selected={isSelected}
                  aria-controls={`stage-panel-${idx}`}
                  onClick={() => setActiveStageIndex(idx)}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all min-h-[110px] relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1B16] ${
                    isSelected
                      ? 'bg-[#FFFFFF] border-[#1D1B16] ring-2 ring-[#1D1B16] shadow-xs'
                      : 'bg-[#F6F1E7] border-[#E3DCCB] hover:border-[#1D1B16] hover:bg-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] font-mono font-bold text-[#6B6559]">
                      Stage {st.num}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#1D1B16]' : 'bg-[#E3DCCB]'}`} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#1D1B16]">
                      {st.title}
                    </h3>
                    <span className="text-[11px] text-[#6B6559] block mt-0.5">
                      {st.tag}
                    </span>
                  </div>

                  {/* Packet traveling visual indicators */}
                  {packetSimState === 'good' && (
                    <div
                      className="absolute bottom-1 left-2 right-2 h-1 bg-[#2F6B3F] rounded-full transition-all duration-300"
                      style={{ opacity: idx <= 5 ? 1 : 0 }}
                    />
                  )}
                  {packetSimState === 'bad' && (
                    <div
                      className={`absolute bottom-1 left-2 right-2 h-1 rounded-full transition-all duration-300 ${
                        idx < 2 ? 'bg-[#A63D2F]' : 'opacity-0'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Reject / Quarantine Drop Branch Status */}
          <div className="p-4 rounded-xl bg-[#F6F1E7] border border-dashed border-[#E3DCCB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px]">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-[#A63D2F]">⮑ ISOLATION BRANCH:</span>
              <span className="text-[#6B6559]">
                Packets failing identity, HMAC, freshness, sequence, or physiological bounds are rejected or quarantined before reaching Raw Zone.
              </span>
            </div>
            {packetSimState === 'bad' && (
              <span className="font-mono font-bold px-3 py-1 rounded-full bg-[#FDF2F0] text-[#A63D2F] border border-[#F3C4BE] shrink-0 animate-pulse">
                ✕ Adversary packet dropped at Checkpoint!
              </span>
            )}
          </div>

          {/* Detail Card for Active Stage */}
          <div
            id={`stage-panel-${activeStageIndex}`}
            role="tabpanel"
            aria-labelledby={`stage-tab-${activeStageIndex}`}
            className="p-6 rounded-xl bg-[#F6F1E7] border border-[#E3DCCB] space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E3DCCB]">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#2F6B3F] uppercase">
                  Stage {stages[activeStageIndex].num} In-Depth Specification
                </span>
                <h3 className="text-[20px] font-semibold text-[#1D1B16] mt-0.5">
                  {stages[activeStageIndex].title} — {stages[activeStageIndex].tag}
                </h3>
              </div>
              <span className="text-[12px] font-mono text-[#6B6559]">
                Stage {activeStageIndex + 1} of 6
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stages[activeStageIndex].points.map((pt, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-lg bg-[#FFFFFF] border border-[#E3DCCB] flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-[#F0F6F2] border border-[#C1DEC8] text-[#2F6B3F] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="text-[13px] text-[#1D1B16] leading-relaxed">{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lineage Visual Loop Banner */}
          {packetSimState === 'lineage' && (
            <div className="p-4 rounded-xl bg-[#F0F6F2] border border-[#C1DEC8] text-[13px] flex items-center justify-between gap-4">
              <span className="text-[#2F6B3F] font-medium">
                ⮐ Cryptographic Lineage Loop Active: Reporting Zone value verifies backward against Raw Zone block #100 hash.
              </span>
              <span className="font-mono text-[#2F6B3F] font-bold shrink-0">SHA-256 MATCH VERIFIED</span>
            </div>
          )}
        </div>
      </section>

      {/* 3. Zones and Least-Privilege Access */}
      <section className="py-12 px-4 sm:px-8 max-w-[1300px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[12px] font-mono font-semibold uppercase tracking-wider text-[#6B6559]">
              Access Governance
            </span>
            <h2 className="text-[28px] sm:text-[34px] font-semibold text-[#1D1B16] mt-1">
              Zones and Least-Privilege Access
            </h2>
          </div>

          {/* Coach vs Analyst Toggle */}
          <div className="inline-flex p-1 bg-[#FFFFFF] rounded-full border border-[#E3DCCB]" role="group" aria-label="Role view switch">
            <button
              type="button"
              id="coach-view-btn"
              onClick={() => setUserRole('coach')}
              className={`px-5 py-2 rounded-full text-[13px] font-medium transition-colors ${
                userRole === 'coach'
                  ? 'bg-[#1D1B16] text-[#FFFFFF] font-semibold'
                  : 'text-[#6B6559] hover:text-[#1D1B16]'
              }`}
            >
              Coach View
            </button>
            <button
              type="button"
              id="analyst-view-btn"
              onClick={() => setUserRole('analyst')}
              className={`px-5 py-2 rounded-full text-[13px] font-medium transition-colors ${
                userRole === 'analyst'
                  ? 'bg-[#1D1B16] text-[#FFFFFF] font-semibold'
                  : 'text-[#6B6559] hover:text-[#1D1B16]'
              }`}
            >
              Analyst View
            </button>
          </div>
        </div>

        {/* Three Isolated Zone Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Raw Zone Card */}
          <div className="bento-card flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold text-[#2F6B3F] px-2.5 py-0.5 rounded-full bg-[#F0F6F2] border border-[#C1DEC8]">
                  IMMUTABLE WORM
                </span>
                <span className="text-[12px] font-mono text-[#6B6559]">Zone 1</span>
              </div>
              <h3 className="text-[20px] font-semibold text-[#1D1B16] mb-1">
                Raw Zone
              </h3>
              <p className="text-[13px] text-[#6B6559] leading-relaxed mb-4">
                Append-only evidentiary store. Incoming telemetry is stamped and sealed. No modification is possible by any user role.
              </p>

              {/* Try to Edit Raw Data Button */}
              <button
                type="button"
                id="try-edit-raw-btn"
                onClick={handleTryEditRaw}
                className="w-full py-2.5 px-4 rounded-full border border-[#E3DCCB] bg-[#F6F1E7] text-[13px] font-semibold text-[#1D1B16] hover:border-[#1D1B16] transition-colors min-h-[44px]"
              >
                Try to edit raw data
              </button>

              {/* Denied Alert */}
              {deniedAnimation && (
                <div
                  role="alert"
                  className="mt-3 p-3 rounded-xl bg-[#FDF2F0] border border-[#F3C4BE] text-[#A63D2F] text-[12px] font-semibold text-center"
                >
                  Denied: Raw Zone is append-only WORM. Modification prohibited.
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#E3DCCB] text-[12px] font-mono text-[#6B6559]">
              Policy: Write-Once-Read-Many
            </div>
          </div>

          {/* Processing Zone Card */}
          <div className="bento-card flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold text-[#1D1B16] px-2.5 py-0.5 rounded-full bg-[#F6F1E7] border border-[#E3DCCB]">
                  STREAM ENGINE
                </span>
                <span className="text-[12px] font-mono text-[#6B6559]">Zone 2</span>
              </div>
              <h3 className="text-[20px] font-semibold text-[#1D1B16] mb-1">
                Processing Zone
              </h3>
              <p className="text-[13px] text-[#6B6559] leading-relaxed mb-4">
                Stream processing engines calculate velocity, player load, and biometric zones under strictly read-only access to raw blocks.
              </p>
              <div className="p-3 rounded-xl bg-[#F6F1E7] border border-[#E3DCCB] text-[12px] text-[#6B6559] space-y-1 font-mono">
                <div>• Reads: Raw Zone (read-only)</div>
                <div>• Computes: ML exertion curves</div>
                <div>• Publishes: Cryptographically sealed metrics</div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E3DCCB] text-[12px] font-mono text-[#6B6559]">
              Policy: Least-privilege worker pool
            </div>
          </div>

          {/* Reporting Zone Card */}
          <div className="bento-card flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold text-[#2F6B3F] px-2.5 py-0.5 rounded-full bg-[#F0F6F2] border border-[#C1DEC8]">
                  VISUALIZATION
                </span>
                <span className="text-[12px] font-mono text-[#6B6559]">Zone 3</span>
              </div>
              <h3 className="text-[20px] font-semibold text-[#1D1B16] mb-1">
                Reporting Zone
              </h3>
              <p className="text-[13px] text-[#6B6559] leading-relaxed mb-4">
                {userRole === 'coach'
                  ? 'Coach view: Restricted strictly to 100% verified Trusted telemetry for sideline decisions.'
                  : 'Analyst view: Unlocked deep visibility into raw streams, quarantined anomaly buckets, and security event logs.'}
              </p>

                <div className="p-3.5 rounded-xl bg-[#F6F1E7] border border-[#E3DCCB] text-[12px] space-y-1.5 font-mono">
                  <div className="text-[#2F6B3F] font-semibold">
                    ✓ Trusted Metrics: VISIBLE
                  </div>
                  <div className={userRole === 'analyst' ? 'text-[#8C510A] font-semibold' : 'text-[#6B6559]'}>
                    {userRole === 'analyst' ? '✓ Quarantined Anomaly Bucket: VISIBLE' : '✕ Quarantined Data: HIDDEN'}
                  </div>
                  <div className={userRole === 'analyst' ? 'text-[#1D1B16] font-semibold' : 'text-[#6B6559]'}>
                    {userRole === 'analyst' ? '✓ WORM Security Audit Log: UNLOCKED' : '✕ Security Logs: LOCKED'}
                  </div>
                </div>
            </div>

            <div className="pt-4 border-t border-[#E3DCCB] text-[12px] font-mono text-[#6B6559]">
              Active role view: <strong className="text-[#1D1B16] uppercase">{userRole}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Architecture Wrap-Up Strip (Replacing all Next: Home loops per specification) */}
      <section className="py-12 px-4 sm:px-8 border-t border-[#E3DCCB] bg-[#FFFFFF]">
        <div className="max-w-[1300px] mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* 3-Line Takeaway */}
            <div className="lg:col-span-7 space-y-3">
              <span className="text-[12px] font-mono font-semibold uppercase tracking-wider text-[#6B6559]">
                Architectural Takeaways
              </span>
              <h2 className="text-[24px] font-semibold text-[#1D1B16]">
                Three Core Security Guarantees
              </h2>
              <ul className="space-y-2 text-[14px] text-[#6B6559] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#2F6B3F] font-bold">1.</span>
                  <span><strong>Zero-Trust Ingress:</strong> Telemetry cannot be trusted on faith; edge biometric data requires cryptographic proof of origin.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2F6B3F] font-bold">2.</span>
                  <span><strong>Sequential Validation:</strong> 5-check validation drops spoofed and altered packets at the perimeter while isolating statistical anomalies.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2F6B3F] font-bold">3.</span>
                  <span><strong>Immutable Lineage:</strong> Append-only SHA-256 ledgering guarantees every sideline number is traceable back to its signed source event.</span>
                </li>
              </ul>
            </div>

            {/* The 5 checks as small icons */}
            <div className="lg:col-span-5 bento-card p-5 space-y-3">
              <span className="text-[11px] font-mono font-semibold uppercase text-[#6B6559]">
                5 Checks Summary
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center">
                <div className="p-2 rounded-lg bg-[#F6F1E7] border border-[#E3DCCB]">
                  <div className="w-5 h-5 rounded-full bg-[#FFFFFF] mx-auto flex items-center justify-center text-[10px] font-mono font-bold">1</div>
                  <div className="text-[10px] font-mono font-medium mt-1">Who sent it?</div>
                </div>
                <div className="p-2 rounded-lg bg-[#F6F1E7] border border-[#E3DCCB]">
                  <div className="w-5 h-5 rounded-full bg-[#FFFFFF] mx-auto flex items-center justify-center text-[10px] font-mono font-bold">2</div>
                  <div className="text-[10px] font-mono font-medium mt-1">Was it altered?</div>
                </div>
                <div className="p-2 rounded-lg bg-[#F6F1E7] border border-[#E3DCCB]">
                  <div className="w-5 h-5 rounded-full bg-[#FFFFFF] mx-auto flex items-center justify-center text-[10px] font-mono font-bold">3</div>
                  <div className="text-[10px] font-mono font-medium mt-1">Is it fresh?</div>
                </div>
                <div className="p-2 rounded-lg bg-[#F6F1E7] border border-[#E3DCCB]">
                  <div className="w-5 h-5 rounded-full bg-[#FFFFFF] mx-auto flex items-center justify-center text-[10px] font-mono font-bold">4</div>
                  <div className="text-[10px] font-mono font-medium mt-1">Is it in order?</div>
                </div>
                <div className="p-2 rounded-lg bg-[#F6F1E7] border border-[#E3DCCB]">
                  <div className="w-5 h-5 rounded-full bg-[#FFFFFF] mx-auto flex items-center justify-center text-[10px] font-mono font-bold">5</div>
                  <div className="text-[10px] font-mono font-medium mt-1">Does it make sense?</div>
                </div>
              </div>

              {/* Links strip */}
              <div className="pt-3 border-t border-[#E3DCCB] flex flex-wrap items-center justify-between text-[12px] font-mono text-[#6B6559]">
                <a
                  href="https://github.com/SRIRAMWEB/PerformanceStream"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1D1B16] font-semibold hover:underline"
                >
                  GitHub Repository →
                </a>
                <span>Team Among Us · BRCX-SPT-03 · BreachX</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Heartbeat Divider */}
      <HeartbeatLine />
    </div>
  );
}
