'use client';

import React from 'react';
import { CardFooter } from './CardFooter';

export function ClosingRow() {
  return (
    <div className="space-y-4 my-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Impact Card */}
        <div className="bg-white dark:bg-[#1C1917] rounded-[20px] border border-[#EBEAEB] dark:border-[#2E2A27] p-6 pb-5 flex flex-col justify-between overflow-hidden shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#23C45F]" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#888888]">
                Proven Outcome
              </span>
            </div>
            <h3 className="text-[20px] font-[600] text-[var(--ps-ink,#1D1A1A)] mb-4">
              Operational Impact
            </h3>

            <div className="space-y-2.5 font-mono text-[12px] text-[#656565] dark:text-[#A8A29E]">
              <div className="flex items-start gap-2 bg-[#F9F8F8] dark:bg-[#23201D] p-2.5 rounded-xl border border-[#F1F1F1] dark:border-[#2F2925]">
                <span className="text-[#16A24B] font-bold">✓</span>
                <div>
                  <strong className="text-[var(--ps-ink,#1D1A1A)]">Trusted decisions:</strong> Coaches make high-stakes substitution and pacing calls with 100% verified biometrics.
                </div>
              </div>

              <div className="flex items-start gap-2 bg-[#F9F8F8] dark:bg-[#23201D] p-2.5 rounded-xl border border-[#F1F1F1] dark:border-[#2F2925]">
                <span className="text-[#16A24B] font-bold">✓</span>
                <div>
                  <strong className="text-[var(--ps-ink,#1D1A1A)]">Attack resistance:</strong> Zero unauthorized or tampered readings reach downstream coaching displays.
                </div>
              </div>

              <div className="flex items-start gap-2 bg-[#F9F8F8] dark:bg-[#23201D] p-2.5 rounded-xl border border-[#F1F1F1] dark:border-[#2F2925]">
                <span className="text-[#16A24B] font-bold">✓</span>
                <div>
                  <strong className="text-[var(--ps-ink,#1D1A1A)]">Always available:</strong> Token-bucket rate limiting absorbs heavy volumetric flood attacks at the perimeter.
                </div>
              </div>

              <div className="flex items-start gap-2 bg-[#F9F8F8] dark:bg-[#23201D] p-2.5 rounded-xl border border-[#F1F1F1] dark:border-[#2F2925]">
                <span className="text-[#16A24B] font-bold">✓</span>
                <div>
                  <strong className="text-[var(--ps-ink,#1D1A1A)]">Full traceability:</strong> Every displayed number has immutable cryptographic lineage to its raw event.
                </div>
              </div>
            </div>
          </div>

          <CardFooter
            title="Operational Impact"
            description="Verified trust from athlete skin to coach screen."
            linkText="Audit specs"
            className="mt-6 pt-3"
          />
        </div>

        {/* Future Scope Card */}
        <div className="bg-white dark:bg-[#1C1917] rounded-[20px] border border-[#EBEAEB] dark:border-[#2E2A27] p-6 pb-5 flex flex-col justify-between overflow-hidden shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[var(--ps-ink,#1D1A1A)]" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#888888]">
                Roadmap & Evolution
              </span>
            </div>
            <h3 className="text-[20px] font-[600] text-[var(--ps-ink,#1D1A1A)] mb-4">
              Future Scope
            </h3>

            <div className="space-y-2.5 font-mono text-[12px] text-[#656565] dark:text-[#A8A29E]">
              <div className="flex items-start gap-2 bg-[#F9F8F8] dark:bg-[#23201D] p-2.5 rounded-xl border border-[#F1F1F1] dark:border-[#2F2925]">
                <span className="text-[#888888] font-bold">→</span>
                <div>
                  <strong className="text-[var(--ps-ink,#1D1A1A)]">Scale up:</strong> Distributed MQTT/Kafka brokers for 50,000+ simultaneous athlete telemetry streams.
                </div>
              </div>

              <div className="flex items-start gap-2 bg-[#F9F8F8] dark:bg-[#23201D] p-2.5 rounded-xl border border-[#F1F1F1] dark:border-[#2F2925]">
                <span className="text-[#888888] font-bold">→</span>
                <div>
                  <strong className="text-[var(--ps-ink,#1D1A1A)]">Smarter detection:</strong> Dynamic ML baseline adaptive to individualized fatigue and exertion curves.
                </div>
              </div>

              <div className="flex items-start gap-2 bg-[#F9F8F8] dark:bg-[#23201D] p-2.5 rounded-xl border border-[#F1F1F1] dark:border-[#2F2925]">
                <span className="text-[#888888] font-bold">→</span>
                <div>
                  <strong className="text-[var(--ps-ink,#1D1A1A)]">Stronger device trust:</strong> Hardware secure elements (Ateg/TPM) and automated zero-touch key rotation.
                </div>
              </div>

              <div className="flex items-start gap-2 bg-[#F9F8F8] dark:bg-[#23201D] p-2.5 rounded-xl border border-[#F1F1F1] dark:border-[#2F2925]">
                <span className="text-[#888888] font-bold">→</span>
                <div>
                  <strong className="text-[var(--ps-ink,#1D1A1A)]">Wider reach:</strong> Interoperability with standard sports federations and medical wearable protocols.
                </div>
              </div>
            </div>
          </div>

          <CardFooter
            title="Next Horizons"
            description="Enterprise scalability and hardware root-of-trust."
            linkText="Roadmap"
            className="mt-6 pt-3"
          />
        </div>
      </div>

      {/* Footer Strip */}
      <div className="w-full bg-[#1D1A1A] text-[#F5F0E8] rounded-xl px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#23C45F]" />
          <span className="font-[700] tracking-wider text-white">PERFORMANCESTREAM CONSOLE</span>
          <span className="text-[#888888] hidden sm:inline">|</span>
          <span className="text-[#A8A29E]">Secure Real-Time Sensor Pipeline</span>
        </div>
        <div className="text-[#888888] text-[11px] text-center sm:text-right">
          PerformanceStream · Team Among Us · BreachX · BRCX-SPT-03
        </div>
      </div>
    </div>
  );
}
