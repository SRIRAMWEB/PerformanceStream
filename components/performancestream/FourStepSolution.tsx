'use client';

import React from 'react';
import { CardFooter } from './CardFooter';

export function FourStepSolution() {
  const steps = [
    {
      num: '01',
      title: 'Verify the source',
      subtitle: 'Stops fake sensors & tampered data',
      desc: 'Validates cryptographic identity and HMAC signatures at the gateway before any packet enters internal buffers.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#1D1A1A] dark:text-[#F5F0E8]">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      num: '02',
      title: 'Validate the reading',
      subtitle: 'Stops replay & impossible values',
      desc: 'Enforces strictly monotonically increasing sequence counters, timestamp freshness within 30s, and physiological biometric boundaries.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#23C45F]">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      num: '03',
      title: 'Separate the zones',
      subtitle: 'Prevents lateral spread of damage',
      desc: 'Quarantines unverified packets in isolated holding zones so faulty or spoofed sensors never corrupt downstream machine learning models.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#F87317]">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      num: '04',
      title: 'Detect and trace',
      subtitle: 'Stops silent decision tampering',
      desc: 'Provides coaches with verifiable cryptographic lineage from the live dashboard number back to the raw telemetry event.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#1D1A1A] dark:text-[#F5F0E8]">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M11 8v6M8 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-2">
      {steps.map((st) => (
        <div
          key={st.num}
          className="bg-white dark:bg-[#1C1917] rounded-[20px] border border-[#EBEAEB] dark:border-[#2E2A27] p-6 pb-5 flex flex-col justify-between overflow-hidden shadow-sm hover:border-[#D1D5DB] transition-colors"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="w-8 h-8 rounded-lg bg-[#F9F8F8] dark:bg-[#23201D] border border-[#F1F1F1] dark:border-[#2F2925] flex items-center justify-center text-[12px] font-mono font-[700] text-[var(--ps-ink,#1D1A1A)]">
                {st.num}
              </span>
              <div className="p-1.5 rounded-md bg-[#F9F8F8] dark:bg-[#23201D] border border-[#F1F1F1] dark:border-[#2F2925]">
                {st.icon}
              </div>
            </div>

            <h3 className="text-[17px] font-[600] text-[var(--ps-ink,#1D1A1A)] leading-snug">
              {st.title}
            </h3>
            <span className="block text-[12px] font-mono text-[#888888] dark:text-[#A8A29E] mt-0.5 mb-2 font-medium">
              {st.subtitle}
            </span>
            <p className="text-[14px] text-[#656565] dark:text-[#A8A29E] leading-relaxed">
              {st.desc}
            </p>
          </div>

          <CardFooter
            title={`Step ${st.num}`}
            description={st.subtitle}
            linkText="Details"
            className="mt-6 pt-3"
          />
        </div>
      ))}
    </div>
  );
}
