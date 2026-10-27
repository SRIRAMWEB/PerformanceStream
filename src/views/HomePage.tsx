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
import { BottomBar } from '../components/BottomBar';

export function HomePage() {
  const [impactTab, setImpactTab] = useState<'impact' | 'future'>('impact');

  // The 5 Sequential Checks per reading (visible row of cards, no carousel)
  const fiveChecks = [
    {
      num: '01',
      title: 'Who sent it?',
      tagline: 'Cryptographic identity at the edge',
      body: 'Every device has its own identity and secret key burned into hardware, verifying device registration at the gateway.',
      stops: 'Fake sensors and unauthorized devices.',
    },
    {
      num: '02',
      title: 'Was it altered?',
      tagline: 'HMAC-SHA256 payload integrity',
      body: 'Cryptographically verifies message payload against the shared secret key to ensure not a single bit was changed in transit.',
      stops: 'Altered readings and payload tampering.',
    },
    {
      num: '03',
      title: 'Is it fresh?',
      tagline: 'Strict freshness and nonce uniqueness',
      body: 'Validates timestamp freshness within a strict ±5s window and confirms the one-time nonce was never previously recorded.',
      stops: 'Replay attacks and stale session injection.',
    },
    {
      num: '04',
      title: 'Is it in order?',
      tagline: 'Monotonic sequence tracking',
      body: 'Strictly verifies sequence continuity (last + 1) to protect the heart-rate trendline from missing telemetry gaps.',
      stops: 'Missing readings and sequence manipulation.',
    },
    {
      num: '05',
      title: 'Does it make sense?',
      tagline: 'Physiological and statistical bounds',
      body: 'Checks physiological limits (30–220 bpm) and evaluates rolling per-athlete z-score against historical baseline.',
      stops: 'Impossible values and stolen key anomalies.',
    },
  ];

  const impactCards = [
    {
      title: 'Trusted decisions',
      desc: 'Coaches make critical pacing and substitution decisions with verified biometrics, free from telemetry poisoning.',
    },
    {
      title: 'Attack resistance',
      desc: 'Tested against spoofed hardware, altered packets, replayed sessions, and volumetric flood bursts.',
    },
    {
      title: 'Always available',
      desc: 'Gateway perimeter rate limiting sheds volumetric bursts while preserving capacity for legitimate athlete streams.',
    },
    {
      title: 'Full traceability',
      desc: 'Every single number on the coach dashboard links backward through an immutable SHA-256 hash ledger.',
    },
  ];

  const futureCards = [
    {
      title: 'Scale up',
      desc: 'Distributed MQTT and Apache Kafka broker clustering capable of handling 50,000+ simultaneous stadium sensors.',
    },
    {
      title: 'Smarter detection',
      desc: 'Adaptive ML baseline algorithms dynamically adjusting to individual athlete cardiovascular fatigue curves.',
    },
    {
      title: 'Stronger device trust',
      desc: 'Hardware Secure Elements (TPM / ATECC608), automated zero-touch key rotation, and cryptographically signed firmware.',
    },
    {
      title: 'Wider reach',
      desc: 'Interoperability across multi-sport leagues, combat venues, and medical-grade telemetry under strict privacy access.',
    },
  ];

  return (
    <div className="w-full bg-[#F6F1E7] text-[#1D1B16] font-sans pb-16">
      {/* 1. Hero Section */}
      <section className="py-12 lg:py-20 px-4 sm:px-8 relative border-b border-[#E3DCCB]">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Eyebrow + Headline + Heartbeat Line + Lead text + Single CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E3DCCB] text-[12px] font-mono font-medium text-[#1D1B16]">
              <span className="w-2 h-2 rounded-full bg-[#A63D2F]" aria-hidden="true" />
              <span>Fake sensor data can cost a team a match.</span>
            </div>

            <h1 className="text-[38px] sm:text-[52px] lg:text-[62px] font-semibold text-[#1D1B16] leading-[1.08] tracking-tight">
              Every reading verified. Every number traceable.
            </h1>

            <HeartbeatLine className="my-2" height={28} />

            <p className="text-[16px] sm:text-[18px] text-[#6B6559] leading-relaxed max-w-[56ch]">
              A secure real-time sports analytics pipeline that verifies every wearable sensor reading, quarantines suspicious data, and guarantees cryptographic lineage from athlete to coach.
            </p>

            {/* ONE Primary "Next" Action for Home: goes directly to Live demo */}
            <div className="pt-2">
              <Link
                href="/simulator"
                id="hero-cta-btn"
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#1D1B16] text-[#FFFFFF] font-semibold text-[15px] hover:bg-[#333027] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1B16] min-h-[48px]"
                aria-label="Run the attack demo in the simulator"
              >
                <span>Run the attack demo</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Mini-Animation of 3 Packets Passing Gate + 5 Checks Stat */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bento-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E3DCCB]">
                <span className="text-[12px] font-mono font-semibold uppercase text-[#6B6559]">
                  Gate Ingress Verification
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F6F1E7] border border-[#E3DCCB] text-[#6B6559]">
                  Illustrative
                </span>
              </div>

              {/* Looping 3-packet animation through a verification checkpoint */}
              <div className="w-full h-[140px] bg-[#F6F1E7] rounded-xl border border-[#E3DCCB] relative overflow-hidden flex items-center justify-center p-4">
                <style>{`
                  @keyframes packetPass1 {
                    0% { transform: translateX(-160px); opacity: 0; }
                    20% { opacity: 1; }
                    50% { transform: translateX(0px); }
                    80% { opacity: 1; }
                    100% { transform: translateX(160px); opacity: 0; }
                  }
                  @keyframes packetPass2 {
                    0% { transform: translateX(-160px); opacity: 0; }
                    20% { opacity: 1; }
                    50% { transform: translateX(0px); }
                    80% { opacity: 1; }
                    100% { transform: translateX(160px); opacity: 0; }
                  }
                  @keyframes packetPass3 {
                    0% { transform: translateX(-160px); opacity: 0; }
                    20% { opacity: 1; }
                    50% { transform: translateX(0px); }
                    80% { opacity: 1; }
                    100% { transform: translateX(160px); opacity: 0; }
                  }
                  .packet-dot-1 { animation: packetPass1 3.6s infinite cubic-bezier(0.4, 0, 0.2, 1); animation-delay: 0s; }
                  .packet-dot-2 { animation: packetPass2 3.6s infinite cubic-bezier(0.4, 0, 0.2, 1); animation-delay: 1.2s; }
                  .packet-dot-3 { animation: packetPass3 3.6s infinite cubic-bezier(0.4, 0, 0.2, 1); animation-delay: 2.4s; }
                  @media (prefers-reduced-motion: reduce) {
                    .packet-dot-1, .packet-dot-2, .packet-dot-3 {
                      animation: none !important;
                      transform: none !important;
                    }
                  }
                `}</style>

                {/* Gate checkpoint barrier */}
                <div className="absolute inset-y-4 left-1/2 -translate-x-1/2 w-[2px] bg-[#E3DCCB] border-r border-dashed border-[#1D1B16]/30 z-0" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 px-2.5 py-1 rounded-md bg-[#FFFFFF] border border-[#E3DCCB] text-[10px] font-mono text-[#2F6B3F] font-bold shadow-xs">
                  ✓ GATE
                </div>

                {/* Packet 1 */}
                <div className="packet-dot-1 absolute flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#2F6B3F] text-[11px] font-mono text-[#2F6B3F] shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#2F6B3F]" />
                  <span>S-07: 148</span>
                </div>

                {/* Packet 2 */}
                <div className="packet-dot-2 absolute flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#2F6B3F] text-[11px] font-mono text-[#2F6B3F] shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#2F6B3F]" />
                  <span>S-07: 150</span>
                </div>

                {/* Packet 3 */}
                <div className="packet-dot-3 absolute flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#2F6B3F] text-[11px] font-mono text-[#2F6B3F] shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#2F6B3F]" />
                  <span>S-07: 149</span>
                </div>
              </div>

              {/* Stat block */}
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <div className="text-[28px] font-mono font-bold text-[#1D1B16] leading-none">
                    5 checks
                  </div>
                  <div className="text-[12px] font-medium text-[#6B6559] mt-1">
                    Evaluated sequentially per reading
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[12px] font-mono font-semibold text-[#2F6B3F]">
                    HMAC-SHA256
                  </div>
                  <div className="text-[11px] text-[#6B6559]">
                    Cryptographic signature
                  </div>
                </div>
              </div>
            </div>

            {/* Consistent Line-Art Sensor Card */}
            <SensorIllustration />
          </div>
        </div>
      </section>

      {/* 2. Five Checks Row of Cards (Replacing 4-step carousel per specification) */}
      <section className="py-16 px-4 sm:px-8 max-w-[1300px] mx-auto space-y-8">
        <div>
          <span className="text-[12px] font-mono font-semibold uppercase tracking-wider text-[#6B6559]">
            Perimeter Security Protocol
          </span>
          <h2 className="text-[28px] sm:text-[34px] font-semibold text-[#1D1B16] mt-1">
            Five Checks Per Reading
          </h2>
          <p className="text-[14px] text-[#6B6559] max-w-[60ch] mt-1">
            Nothing unverified moves forward. Telemetry failing any checkpoint is immediately rejected or quarantined before analytics processing.
          </p>
        </div>

        {/* Visible 5-card row (no carousel, full keyboard and screen reader accessibility) */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {fiveChecks.map((chk) => (
            <div
              key={chk.num}
              className="bento-card p-5 flex flex-col justify-between space-y-4 hover:border-[#1D1B16] transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-full bg-[#F6F1E7] border border-[#E3DCCB] text-[#1D1B16] font-mono font-bold text-[12px] flex items-center justify-center">
                    {chk.num}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-[#6B6559]">Gate Step</span>
                </div>

                <div>
                  <h3 className="text-[16px] font-semibold text-[#1D1B16]">
                    {chk.title}
                  </h3>
                  <div className="text-[11px] font-mono text-[#2F6B3F] font-medium mt-0.5">
                    {chk.tagline}
                  </div>
                </div>

                <p className="text-[13px] text-[#6B6559] leading-relaxed">
                  {chk.body}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F6F1E7] border border-[#E3DCCB] text-[12px]">
                <strong className="text-[#1D1B16]">Stops: </strong>
                <span className="text-[#6B6559]">{chk.stops}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Four Core Pillars Line-Art Bento Row (Replacing stock photos) */}
      <section className="py-12 px-4 sm:px-8 max-w-[1300px] mx-auto border-t border-[#E3DCCB]">
        <div className="mb-8">
          <span className="text-[12px] font-mono font-semibold uppercase tracking-wider text-[#6B6559]">
            Architecture Principles
          </span>
          <h2 className="text-[28px] sm:text-[34px] font-semibold text-[#1D1B16] mt-1">
            Engineered for Sideline Resilience
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SensorIllustration />
          <ShieldIllustration />
          <LedgerIllustration />
          <DashboardIllustration />
        </div>
      </section>

      {/* 4. Impact and Future Scope Bento Tabs */}
      <section className="py-16 px-4 sm:px-8 border-t border-[#E3DCCB]">
        <div className="max-w-[1300px] mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[12px] font-mono font-semibold uppercase tracking-wider text-[#6B6559]">
                Strategic Outcomes
              </span>
              <h2 className="text-[28px] sm:text-[34px] font-semibold text-[#1D1B16] mt-1">
                Impact & Future Scope
              </h2>
            </div>

            {/* Two-Button Toggle */}
            <div className="inline-flex p-1 bg-[#FFFFFF] rounded-full border border-[#E3DCCB]" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={impactTab === 'impact'}
                onClick={() => setImpactTab('impact')}
                className={`px-5 py-2 rounded-full text-[13px] font-medium transition-colors ${
                  impactTab === 'impact'
                    ? 'bg-[#1D1B16] text-[#FFFFFF] font-semibold'
                    : 'text-[#6B6559] hover:text-[#1D1B16]'
                }`}
              >
                Impact
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={impactTab === 'future'}
                onClick={() => setImpactTab('future')}
                className={`px-5 py-2 rounded-full text-[13px] font-medium transition-colors ${
                  impactTab === 'future'
                    ? 'bg-[#1D1B16] text-[#FFFFFF] font-semibold'
                    : 'text-[#6B6559] hover:text-[#1D1B16]'
                }`}
              >
                Future scope
              </button>
            </div>
          </div>

          {/* 4 Impact Items shown as a clean Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(impactTab === 'impact' ? impactCards : futureCards).map((card, i) => (
              <div
                key={card.title}
                className="bento-card p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="w-8 h-8 rounded-full bg-[#F6F1E7] border border-[#E3DCCB] text-[#1D1B16] font-mono font-bold text-[12px] flex items-center justify-center mb-3">
                    0{i + 1}
                  </div>
                  <h3 className="text-[18px] font-semibold text-[#1D1B16] mb-2">
                    {card.title}
                  </h3>
                  <p className="text-[13px] text-[#6B6559] leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Closing Strip Quote */}
          <div className="pt-8 border-t border-[#E3DCCB] text-center">
            <p className="font-sans font-semibold text-[18px] sm:text-[22px] text-[#1D1B16]">
              “A trusted data backbone for sports, from sensor to decision.”
            </p>
          </div>
        </div>
      </section>

      {/* No second competing CTA at bottom of Home per specification */}
      <BottomBar />
    </div>
  );
}
