'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSim } from '../context/SimContext';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { EcgLine, TrackLanes, ImageCard } from '../components/VisualElements';
import { BottomBar } from '../components/BottomBar';

export function HomePage() {
  const { counters, readings } = useSim();
  const [activeStep, setActiveStep] = useState(0);
  const [impactTab, setImpactTab] = useState<'impact' | 'future'>('impact');

  const steps = [
    {
      num: '01',
      title: 'Verify the source',
      tagline: 'Cryptographic identity at the edge',
      body: 'Every device has its own identity and secret key, and cryptographically signs each message with HMAC-SHA256.',
      stops: 'Fake sensors, tampered data, unauthorized devices.',
    },
    {
      num: '02',
      title: 'Validate the reading',
      tagline: 'Strict freshness and sequence rules',
      body: 'Checks timestamp freshness within ±5s, one-time nonce uniqueness, strictly monotonic sequence counters, and believable boundaries.',
      stops: 'Replay attacks, timestamp manipulation, impossible sensor values.',
    },
    {
      num: '03',
      title: 'Separate the zones',
      tagline: 'Isolated trust boundaries',
      body: 'Raw, processed, and reporting data reside in isolated zones under least-privilege access controls. Raw zones are append-only WORM stores.',
      stops: 'A compromised peripheral or analytics node spreading lateral damage.',
    },
    {
      num: '04',
      title: 'Detect and trace',
      tagline: 'Verifiable audit lineage',
      body: 'Anomalies are immediately flagged. Every number displayed to coaches carries a Trusted status tag and links back to its signed source event.',
      stops: 'Silent manipulation of game decisions and athletic substitution calls.',
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

  // Total trusted count from context
  const trustedReadingsCount = counters.trusted;

  return (
    <div className="w-full bg-[#e9e4db] text-[#0F1F1B] font-['Manrope'] overflow-x-hidden">
      {/* 1. Hero Section (Halo Layout) */}
      <section className="py-[72px] lg:py-[96px] px-6 lg:px-[60px] relative">
        <TrackLanes />
        <div className="max-w-[1300px] mx-auto flex flex-col lg:flex-row items-end justify-between gap-[48px] lg:gap-[60px] relative z-10">
          {/* Left Column: Headline + ECG + Botanical Image (520px max) */}
          <div className="w-full lg:max-w-[520px] flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4F0E8] border border-[rgba(15,31,27,0.12)] text-[12px] font-semibold uppercase tracking-wider text-[#034F46] mb-6">
                <span className="w-2 h-2 rounded-full bg-[#034F46]" />
                BRCX-SPT-03 · Sports Security Backbone
              </div>

              <h1 className="font-['Fraunces'] font-normal text-[46px] sm:text-[60px] lg:text-[72px] leading-[1.04] tracking-[-0.03em] text-[#0F1F1B]">
                Every reading verified. Every number <em className="italic font-normal">traceable</em>.
              </h1>

              <EcgLine className="my-5 max-w-[420px]" color="#034F46" />

              <p className="text-[17px] sm:text-[18px] text-[#48504F] leading-relaxed max-w-[48ch]">
                A real-time sports analytics pipeline that verifies every wearable sensor reading, isolates suspicious data, and guarantees cryptographic lineage from athlete to coach.
              </p>
            </div>

            {/* Botanical Illustration (Halo spec) with gentle sway */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="mt-8 flex items-center justify-start"
            >
              <img
                src="https://cdn.jiro.build/Halo/image/state%2001.png"
                alt="Botanical illustration symbolizing organic athletic balance"
                width={360}
                height={340}
                referrerPolicy="no-referrer"
                className="w-[280px] sm:w-[340px] h-auto object-contain select-none pointer-events-none opacity-90"
              />
            </motion.div>
          </div>

          {/* Right Column: Two Stat Blocks with Left Hairline Border + Primary CTA Pill */}
          <div className="w-full lg:max-w-[540px] flex flex-col justify-end space-y-8">
            <div className="space-y-6">
              {/* Stat Block 1 */}
              <div className="border-l border-[rgba(15,31,27,0.2)] pl-6 py-2">
                <div className="font-['Fraunces'] font-bold text-[52px] sm:text-[64px] leading-none text-[#0F1F1B]">
                  5
                </div>
                <div className="text-[18px] font-semibold text-[#0F1F1B] mt-1">
                  Checks per reading
                </div>
                <div className="text-[14px] text-[#48504F] leading-relaxed mt-0.5">
                  Source, signature, freshness, order, and physiological sense.
                </div>
              </div>

              {/* Stat Block 2: Live Count of Trusted Readings from Context */}
              <div className="border-l border-[rgba(15,31,27,0.2)] pl-6 py-2">
                <div className="font-['Fraunces'] font-bold text-[52px] sm:text-[64px] leading-none text-[#034F46] flex items-baseline gap-2">
                  <span>{trustedReadingsCount}</span>
                  <span className="text-[16px] font-['Manrope'] font-semibold text-[#034F46] uppercase tracking-wider">
                    verified
                  </span>
                </div>
                <div className="text-[18px] font-semibold text-[#0F1F1B] mt-1">
                  Trusted readings logged
                </div>
                <div className="text-[14px] text-[#48504F] leading-relaxed mt-0.5">
                  Live synchronized counter with the interactive security simulator.
                </div>
              </div>
            </div>

            {/* CTA Pill */}
            <div className="pt-2">
              <PrimaryButton href="/simulator" aria-label="Run the attack demo simulator">
                Run the attack demo
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Photo Band (H1) with mask reveal and faint track lanes */}
      <section className="px-6 lg:px-[60px] py-8">
        <div className="max-w-[1300px] mx-auto">
          <ImageCard
            src="/images/h1-track-sprinter.jpg"
            alt="Sprinter accelerating on running track at sunrise"
            width={1400}
            height={480}
            className="w-full h-[280px] sm:h-[400px] lg:h-[480px]"
            priority={true}
          />
        </div>
      </section>

      {/* 3. How It Works Section: Image H2 Left, Step Viewer Right */}
      <section className="py-[72px] lg:py-[96px] px-6 lg:px-[60px]">
        <div className="max-w-[1300px] mx-auto">
          <div className="mb-12">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#48504F]">
              Step-by-Step Verification
            </span>
            <h2 className="font-['Fraunces'] font-normal text-[36px] sm:text-[48px] leading-[1.12] text-[#0F1F1B] mt-1">
              How the gate stops malicious telemetry
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Image H2: Wearable Smartwatch */}
            <div className="w-full">
              <ImageCard
                src="/images/h2-smartwatch-wearable.jpg"
                alt="Smartwatch measuring athletic biometrics"
                width={800}
                height={600}
                className="w-full h-[360px] sm:h-[480px]"
              />
            </div>

            {/* Step Viewer Right */}
            <div className="bg-[#F4F0E8] rounded-[28px] sm:rounded-[32px] border border-[rgba(15,31,27,0.12)] p-6 sm:p-10 flex flex-col justify-between min-h-[460px]">
              <div>
                {/* 4 Numbered Tabs */}
                <div className="flex items-center gap-2 pb-6 border-b border-[rgba(15,31,27,0.12)]">
                  {steps.map((st, idx) => (
                    <button
                      key={st.num}
                      type="button"
                      onClick={() => setActiveStep(idx)}
                      className={`px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all min-h-[36px] ${
                        activeStep === idx
                          ? 'bg-[#034F46] text-[#FCFDFD]'
                          : 'bg-[#e9e4db] text-[#48504F] hover:text-[#0F1F1B]'
                      }`}
                    >
                      {st.num}
                    </button>
                  ))}
                </div>

                {/* Step Body */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="py-6 space-y-4"
                  >
                    <div className="text-[13px] font-semibold text-[#034F46] uppercase tracking-wider">
                      {steps[activeStep].tagline}
                    </div>
                    <h3 className="font-['Fraunces'] text-[28px] sm:text-[34px] leading-snug text-[#0F1F1B]">
                      {steps[activeStep].title}
                    </h3>
                    <p className="text-[16px] text-[#48504F] leading-relaxed">
                      {steps[activeStep].body}
                    </p>
                    <div className="p-4 rounded-2xl bg-[#e9e4db]/70 border border-[rgba(15,31,27,0.1)] text-[14px]">
                      <strong className="text-[#034F46]">Stops: </strong>
                      <span className="text-[#48504F]">{steps[activeStep].stops}</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Prev and Next Step Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-[rgba(15,31,27,0.12)]">
                <button
                  type="button"
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                  className="text-[14px] font-semibold text-[#48504F] hover:text-[#0F1F1B] disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[44px] px-2 flex items-center gap-1"
                >
                  ← Previous step
                </button>
                <span className="text-[13px] text-[#48504F] font-mono">
                  {activeStep + 1} of 4
                </span>
                <button
                  type="button"
                  disabled={activeStep === steps.length - 1}
                  onClick={() => setActiveStep((s) => Math.min(steps.length - 1, s + 1))}
                  className="text-[14px] font-semibold text-[#034F46] hover:text-[#023b34] disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[44px] px-2 flex items-center gap-1"
                >
                  Next step →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Impact and Future Section: Image H3 Beside Two-Button Toggle */}
      <section className="py-[72px] lg:py-[96px] px-6 lg:px-[60px] bg-[#F4F0E8]/50 border-t border-b border-[rgba(15,31,27,0.1)]">
        <div className="max-w-[1300px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#48504F]">
                Strategic Outcomes
              </span>
              <h2 className="font-['Fraunces'] font-normal text-[36px] sm:text-[48px] leading-[1.12] text-[#0F1F1B] mt-1">
                Impact & Future Scope
              </h2>
            </div>

            {/* Two-Button Toggle */}
            <div className="inline-flex p-1 bg-[#e9e4db] rounded-full border border-[rgba(15,31,27,0.12)]">
              <button
                type="button"
                onClick={() => setImpactTab('impact')}
                className={`px-5 py-2 rounded-full text-[14px] font-semibold transition-all min-h-[40px] ${
                  impactTab === 'impact'
                    ? 'bg-[#034F46] text-[#FCFDFD] shadow-xs'
                    : 'text-[#48504F] hover:text-[#0F1F1B]'
                }`}
              >
                Impact
              </button>
              <button
                type="button"
                onClick={() => setImpactTab('future')}
                className={`px-5 py-2 rounded-full text-[14px] font-semibold transition-all min-h-[40px] ${
                  impactTab === 'future'
                    ? 'bg-[#034F46] text-[#FCFDFD] shadow-xs'
                    : 'text-[#48504F] hover:text-[#0F1F1B]'
                }`}
              >
                Future scope
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Image H3 (5 cols) */}
            <div className="lg:col-span-5">
              <ImageCard
                src="/images/h3-coach-analytics.jpg"
                alt="Coach analyzing real-time athlete biometrics on sidelines"
                width={800}
                height={700}
                className="w-full h-[380px] sm:h-[460px]"
              />
            </div>

            {/* Four Cards Grid (7 cols) */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={impactTab}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.35 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {(impactTab === 'impact' ? impactCards : futureCards).map((card, i) => (
                    <div
                      key={card.title}
                      className="p-6 rounded-[24px] bg-[#F4F0E8] border border-[rgba(15,31,27,0.12)] flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-8 h-8 rounded-full bg-[#E4F1C6] text-[#034F46] font-bold text-[13px] flex items-center justify-center mb-3">
                          0{i + 1}
                        </div>
                        <h4 className="font-['Fraunces'] text-[20px] text-[#0F1F1B] mb-2">
                          {card.title}
                        </h4>
                        <p className="text-[14px] text-[#48504F] leading-relaxed">
                          {card.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Closing Line */}
          <div className="mt-14 pt-8 border-t border-[rgba(15,31,27,0.12)] text-center">
            <p className="font-['Fraunces'] italic text-[22px] sm:text-[26px] text-[#034F46]">
              “A trusted data backbone for sports, from sensor to decision.”
            </p>
          </div>
        </div>
      </section>

      {/* 5. Bottom Navigation Bar */}
      <BottomBar />
    </div>
  );
}
