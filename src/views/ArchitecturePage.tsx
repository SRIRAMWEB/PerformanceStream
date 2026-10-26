'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageCard } from '../components/VisualElements';
import { BottomBar } from '../components/BottomBar';
import { SecondaryButton } from '../components/Buttons';

export function ArchitecturePage() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [packetSimState, setPacketSimState] = useState<'idle' | 'good' | 'bad' | 'lineage'>('idle');
  const [userRole, setUserRole] = useState<'coach' | 'analyst'>('coach');
  const [deniedAnimation, setDeniedAnimation] = useState(false);

  const stages = [
    {
      num: '01',
      title: 'Sources',
      tag: 'Edge hardware',
      points: [
        'Wearables, cameras, and training beacons',
        'Device private keys burned into secure chips',
        'BLE / Cellular uplink transmission',
        'Uncontrolled stadium RF perimeter',
      ],
    },
    {
      num: '02',
      title: 'Gateway',
      tag: 'Perimeter defense',
      points: [
        'Device cryptographic identity verification',
        'Signed message payload inspection',
        'Token-bucket rate limiting (20/s threshold)',
        'Syntactic input structure validation',
      ],
    },
    {
      num: '03',
      title: 'Validation',
      tag: 'Integrity gate',
      points: [
        'Fresh timestamp check (±5s limit) & unique nonce',
        'Strictly monotonic sequence tracking',
        'Physiological biometric bounds (30–220 bpm)',
        'Per-athlete rolling baseline anomaly score',
      ],
    },
    {
      num: '04',
      title: 'Raw Zone',
      tag: 'Immutable WORM',
      points: [
        'Append-only Write-Once-Read-Many storage',
        'Original sensor telemetry kept completely unmodified',
        'Cryptographic evidentiary store with SHA-256 blocks',
        'Zero manual or programmatic edits permitted',
      ],
    },
    {
      num: '05',
      title: 'Processing',
      tag: 'Stream analytics',
      points: [
        'Stream aggregation with least-privilege service accounts',
        'Read-only access strictly enforced on raw zone',
        'Mathematical fatigue and exertion modeling',
        'Output integrity verification before publishing',
      ],
    },
    {
      num: '06',
      title: 'Reporting',
      tag: 'Coach dashboard',
      points: [
        'Real-time sideline dashboard displays',
        'Color-coded trust labels on every metric',
        'Cryptographic lineage trace to source event',
        'Role-scoped read-only access boundaries',
      ],
    },
  ];

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
    <div className="w-full bg-[#e9e4db] text-[#0F1F1B] font-['Manrope'] overflow-x-hidden">
      {/* 1. Header Band with Image A1 */}
      <section className="py-[72px] lg:py-[88px] px-6 lg:px-[60px]">
        <div className="max-w-[1300px] mx-auto space-y-8">
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#034F46]">
              Zero-Trust Architecture
            </span>
            <h1 className="font-['Fraunces'] font-normal text-[44px] sm:text-[56px] leading-[1.08] text-[#0F1F1B] mt-2 max-w-[24ch]">
              Six stages. Nothing unverified <em className="italic">moves forward</em>.
            </h1>
            <p className="text-[17px] text-[#48504F] max-w-[62ch] mt-4 leading-relaxed">
              Every reading must pass through an isolated six-stage defense-in-depth pipeline. Tampered or unauthenticated telemetry is isolated at the perimeter.
            </p>
          </div>

          <ImageCard
            src="/images/a1-server-architecture.jpg"
            alt="Data center server architecture and fiber network"
            width={1400}
            height={360}
            className="w-full h-[220px] sm:h-[300px]"
            priority={true}
          />
        </div>
      </section>

      {/* 2. Interactive 6-Stage Pipeline */}
      <section className="py-8 px-6 lg:px-[60px]">
        <div className="max-w-[1300px] mx-auto space-y-8">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#F4F0E8] border border-[rgba(15,31,27,0.12)]">
            <span className="text-[13px] font-semibold text-[#0F1F1B]">
              Pipeline Packet Simulator:
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleSendGoodPacket}
                className="px-4 py-2 rounded-full text-[13px] font-semibold bg-[#E4F1C6] text-[#034F46] hover:opacity-90 transition-opacity min-h-[40px]"
              >
                ✓ Send a good packet
              </button>
              <button
                type="button"
                onClick={handleSendBadPacket}
                className="px-4 py-2 rounded-full text-[13px] font-semibold bg-[#F4F0E8] border border-[#B5483A] text-[#B5483A] hover:bg-[#B5483A]/10 transition-colors min-h-[40px]"
              >
                ✕ Send a bad packet
              </button>
              <button
                type="button"
                onClick={handleShowLineage}
                className="px-4 py-2 rounded-full text-[13px] font-semibold bg-[#034F46] text-[#FCFDFD] hover:bg-[#023b34] transition-colors min-h-[40px]"
              >
                ⮐ Show lineage loop
              </button>
            </div>
          </div>

          {/* 6 Stage Buttons Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {stages.map((st, idx) => {
              const isSelected = activeStageIndex === idx;
              return (
                <button
                  key={st.num}
                  type="button"
                  onClick={() => setActiveStageIndex(idx)}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all min-h-[110px] relative ${
                    isSelected
                      ? 'bg-[#F4F0E8] border-[#034F46] ring-2 ring-[#034F46]/20'
                      : 'bg-[#F4F0E8]/70 border-[rgba(15,31,27,0.12)] hover:border-[rgba(15,31,27,0.3)]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] font-bold font-mono text-[#48504F]">
                      {st.num}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#034F46]" />
                  </div>
                  <div>
                    <h3 className="font-['Fraunces'] text-[18px] text-[#0F1F1B]">
                      {st.title}
                    </h3>
                    <span className="text-[11px] text-[#48504F] line-clamp-1">
                      {st.tag}
                    </span>
                  </div>

                  {/* Packet traveling animations */}
                  {packetSimState === 'good' && (
                    <motion.div
                      className="absolute bottom-1 left-2 right-2 h-1 bg-[#034F46] rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: idx * 0.4 }}
                    />
                  )}
                  {packetSimState === 'bad' && idx < 3 && (
                    <motion.div
                      className="absolute bottom-1 left-2 right-2 h-1 bg-[#B5483A] rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: idx * 0.4 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Reject / Quarantine Drop Box under stages 2 & 3 */}
          <div className="p-4 rounded-2xl bg-[#F4F0E8] border border-dashed border-[#B5483A]/50 flex items-center justify-between text-[13px] text-[#B5483A]">
            <div className="flex items-center gap-2">
              <span className="font-bold">⮑ REJECT OR QUARANTINE BRANCH:</span>
              <span>Packets failing identity, HMAC, freshness, sequence, or physiological bounds are dropped or isolated before reaching the Raw Zone.</span>
            </div>
            {packetSimState === 'bad' && (
              <span className="font-bold px-2.5 py-1 rounded-full bg-[#B5483A] text-white animate-pulse">
                Adversary packet trapped!
              </span>
            )}
          </div>

          {/* Detail Panel Below for Active Stage */}
          <div className="p-8 rounded-[28px] bg-[#F4F0E8] border border-[rgba(15,31,27,0.12)]">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(15,31,27,0.12)] mb-6">
              <div>
                <span className="text-[12px] font-bold text-[#034F46] font-mono">
                  STAGE {stages[activeStageIndex].num} DETAILS
                </span>
                <h3 className="font-['Fraunces'] text-[28px] text-[#0F1F1B] mt-0.5">
                  {stages[activeStageIndex].title} — {stages[activeStageIndex].tag}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stages[activeStageIndex].points.map((pt, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-[#e9e4db]/60 border border-[rgba(15,31,27,0.1)] flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-[#E4F1C6] text-[#034F46] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="text-[15px] text-[#0F1F1B]">{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lineage Visual Loop Indicator */}
          {packetSimState === 'lineage' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-[#034F46] text-[#FCFDFD] text-[13px] flex items-center justify-between"
            >
              <span>⮐ Cryptographic Lineage Loop Active: Reporting Zone value verifies against Raw Zone block #101 hash</span>
              <span className="font-mono text-[#E4F1C6] font-bold">SHA-256 MATCH VERIFIED</span>
            </motion.div>
          )}

          {/* One-Line Strip */}
          <div className="p-4 rounded-2xl bg-[#0F1F1B] text-[#F4F0E8] text-[13px] font-mono flex flex-wrap items-center justify-between gap-2">
            <span className="text-[#E4F1C6] font-semibold">CROSS-CUTTING ENCRYPTION:</span>
            <span>TLS everywhere</span>
            <span>·</span>
            <span>Keys in a secure vault</span>
            <span>·</span>
            <span>Central audit log</span>
            <span>·</span>
            <span>Real-time alerts</span>
          </div>
        </div>
      </section>

      {/* 3. Zones and Access: Three Isolated Panels + Coach/Analyst Toggle */}
      <section className="py-[72px] lg:py-[96px] px-6 lg:px-[60px] bg-[#F4F0E8]/50 border-t border-[rgba(15,31,27,0.1)]">
        <div className="max-w-[1300px] mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#48504F]">
                Access Governance
              </span>
              <h2 className="font-['Fraunces'] font-normal text-[36px] sm:text-[46px] text-[#0F1F1B] mt-1">
                Zones and Least-Privilege Access
              </h2>
            </div>

            {/* Coach vs Analyst Toggle */}
            <div className="inline-flex p-1 bg-[#e9e4db] rounded-full border border-[rgba(15,31,27,0.12)]">
              <button
                type="button"
                onClick={() => setUserRole('coach')}
                className={`px-5 py-2 rounded-full text-[14px] font-semibold transition-all min-h-[40px] ${
                  userRole === 'coach'
                    ? 'bg-[#034F46] text-[#FCFDFD] shadow-xs'
                    : 'text-[#48504F] hover:text-[#0F1F1B]'
                }`}
              >
                Coach View
              </button>
              <button
                type="button"
                onClick={() => setUserRole('analyst')}
                className={`px-5 py-2 rounded-full text-[14px] font-semibold transition-all min-h-[40px] ${
                  userRole === 'analyst'
                    ? 'bg-[#034F46] text-[#FCFDFD] shadow-xs'
                    : 'text-[#48504F] hover:text-[#0F1F1B]'
                }`}
              >
                Analyst View
              </button>
            </div>
          </div>

          {/* Three Zone Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Raw Zone */}
            <div className="p-8 rounded-[28px] bg-[#F4F0E8] border border-[rgba(15,31,27,0.12)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono font-bold text-[#034F46] px-2.5 py-1 rounded-full bg-[#E4F1C6]">
                    IMMUTABLE WORM
                  </span>
                  <span className="text-[12px] text-[#48504F]">Isolated Zone 1</span>
                </div>
                <h3 className="font-['Fraunces'] text-[24px] text-[#0F1F1B] mb-2">
                  Raw Zone
                </h3>
                <p className="text-[14px] text-[#48504F] leading-relaxed mb-4">
                  Append-only evidentiary store. Incoming telemetry is stamped and sealed. No modification is possible by any user role.
                </p>

                {/* Try to edit raw data button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleTryEditRaw}
                    className="w-full py-2.5 px-4 rounded-full border border-[rgba(15,31,27,0.2)] text-[13px] font-semibold hover:border-[#0F1F1B] transition-colors min-h-[44px]"
                  >
                    Try to edit raw data
                  </button>
                </div>

                {/* Denied animation alert */}
                <AnimatePresence>
                  {deniedAnimation && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1, x: [0, -3, 3, -2, 2, 0] }}
                      exit={{ opacity: 0 }}
                      className="mt-3 p-3 rounded-xl bg-[#B5483A] text-white text-[12px] font-semibold text-center"
                    >
                      Denied: Raw Zone is append-only. Modification prohibited.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-6 border-t border-[rgba(15,31,27,0.1)] text-[12px] text-[#48504F] font-mono mt-6">
                Status: Write-Once-Read-Many
              </div>
            </div>

            {/* Processing Zone */}
            <div className="p-8 rounded-[28px] bg-[#F4F0E8] border border-[rgba(15,31,27,0.12)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono font-bold text-[#0F1F1B] px-2.5 py-1 rounded-full bg-[#e9e4db]">
                    STREAM ENGINE
                  </span>
                  <span className="text-[12px] text-[#48504F]">Isolated Zone 2</span>
                </div>
                <h3 className="font-['Fraunces'] text-[24px] text-[#0F1F1B] mb-2">
                  Processing Zone
                </h3>
                <p className="text-[14px] text-[#48504F] leading-relaxed mb-4">
                  Stream processing engines calculate velocity, player load, and biometric zones under read-only access to raw blocks.
                </p>
                <div className="p-3.5 rounded-xl bg-[#e9e4db]/60 border border-[rgba(15,31,27,0.1)] text-[13px] text-[#48504F] space-y-1">
                  <div>• Reads: Raw Zone (read-only)</div>
                  <div>• Computes: ML exertion curves</div>
                  <div>• Publishes: Cryptographically sealed metrics</div>
                </div>
              </div>

              <div className="pt-6 border-t border-[rgba(15,31,27,0.1)] text-[12px] text-[#48504F] font-mono mt-6">
                Status: Least-privilege worker pool
              </div>
            </div>

            {/* Reporting Zone */}
            <div className="p-8 rounded-[28px] bg-[#F4F0E8] border border-[rgba(15,31,27,0.12)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono font-bold text-[#034F46] px-2.5 py-1 rounded-full bg-[#E4F1C6]">
                    VISUALIZATION
                  </span>
                  <span className="text-[12px] text-[#48504F]">Isolated Zone 3</span>
                </div>
                <h3 className="font-['Fraunces'] text-[24px] text-[#0F1F1B] mb-2">
                  Reporting Zone
                </h3>
                <p className="text-[14px] text-[#48504F] leading-relaxed mb-4">
                  {userRole === 'coach'
                    ? 'Coach view: Restricted to 100% verified Trusted telemetry for game pacing and tactical substitutions.'
                    : 'Analyst view: Full visibility into raw streams, quarantined anomaly buckets, and security event logs.'}
                </p>

                <div className="p-3.5 rounded-xl bg-[#e9e4db]/60 border border-[rgba(15,31,27,0.1)] text-[13px] space-y-1.5 font-mono">
                  <div className="text-[#034F46] font-semibold">
                    ✓ Trusted Metrics: VISIBLE
                  </div>
                  <div className={userRole === 'analyst' ? 'text-[#B7791F] font-semibold' : 'text-[#48504F]/40'}>
                    {userRole === 'analyst' ? '✓ Quarantined Data: VISIBLE' : '✕ Quarantined Data: HIDDEN'}
                  </div>
                  <div className={userRole === 'analyst' ? 'text-[#0F1F1B] font-semibold' : 'text-[#48504F]/40'}>
                    {userRole === 'analyst' ? '✓ WORM Audit Log: UNLOCKED' : '✕ WORM Audit Log: LOCKED'}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[rgba(15,31,27,0.1)] text-[12px] text-[#48504F] font-mono mt-6">
                Active role: <span className="text-[#034F46] font-bold uppercase">{userRole}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bottom Navigation Bar */}
      <BottomBar />
    </div>
  );
}
