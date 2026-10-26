'use client';

import React from 'react';
import { CardFooter } from './CardFooter';

interface ZonesCardProps {
  activeCheckIndex: number; // 0 to 4
  verdict: 'IDLE' | 'CHECKING' | 'ACCEPTED' | 'QUARANTINED' | 'REJECTED';
  onLearnMore?: () => void;
}

export function ZonesCard({ activeCheckIndex, verdict, onLearnMore }: ZonesCardProps) {
  // Determine which zone is currently exercised
  // Check 0 & 1: Gateway
  // Check 2, 3, 4: Validation
  // If Accepted: Raw Zone, Processing, Reporting
  const isGatewayActive = activeCheckIndex === 0 || activeCheckIndex === 1;
  const isValidationActive = activeCheckIndex >= 2 && activeCheckIndex <= 4;
  const isTrustedZonesActive = verdict === 'ACCEPTED';

  const zones = [
    {
      id: 'sources',
      num: '01',
      title: 'Sources',
      tag: 'Untrusted',
      outline: 'border-[#EF4544] dark:border-[#EF4544]',
      badgeColor: 'text-[#DC2626] bg-[#FEF2F2] dark:bg-[#2A1515]',
      bullets: [
        'Hardware sensors',
        'BLE / Cellular uplink',
        'Device private keys',
        'Uncontrolled perimeter',
      ],
      isHighlighted: false,
    },
    {
      id: 'gateway',
      num: '02',
      title: 'Gateway',
      tag: 'Perimeter',
      outline: 'border-[var(--ps-ink,#1D1A1A)] dark:border-[#F5F0E8]',
      badgeColor: 'text-[var(--ps-ink,#1D1A1A)] bg-[#F3F4F6] dark:bg-[#2F2A26] dark:text-[#F5F0E8]',
      bullets: [
        'Device identity',
        'Signed messages',
        'Rate limiting (20/s)',
        'Input validation',
      ],
      isHighlighted: isGatewayActive,
    },
    {
      id: 'validation',
      num: '03',
      title: 'Validation',
      tag: 'Verification',
      outline: 'border-[var(--ps-ink,#1D1A1A)] dark:border-[#F5F0E8]',
      badgeColor: 'text-[var(--ps-ink,#1D1A1A)] bg-[#F3F4F6] dark:bg-[#2F2A26] dark:text-[#F5F0E8]',
      bullets: [
        'HMAC verification',
        'Nonce uniqueness',
        'Sequence tracking',
        'Range & delta checks',
      ],
      isHighlighted: isValidationActive,
    },
    {
      id: 'raw_zone',
      num: '04',
      title: 'Raw Zone',
      tag: 'Trusted Vault',
      outline: 'border-[#23C45F] dark:border-[#23C45F]',
      badgeColor: 'text-[#16A24B] bg-[#F1FDF4] dark:bg-[#14291B]',
      bullets: [
        'Immutable storage',
        'WORM append-only',
        'Cryptographic stamps',
        'Raw payload hashes',
      ],
      isHighlighted: isTrustedZonesActive,
    },
    {
      id: 'processing',
      num: '05',
      title: 'Processing',
      tag: 'Analytics',
      outline: 'border-[#23C45F] dark:border-[#23C45F]',
      badgeColor: 'text-[#16A24B] bg-[#F1FDF4] dark:bg-[#14291B]',
      bullets: [
        'Stream aggregation',
        'Fatigue anomaly scoring',
        'State memory cache',
        'Central audit log',
      ],
      isHighlighted: isTrustedZonesActive,
    },
    {
      id: 'reporting',
      num: '06',
      title: 'Reporting',
      tag: 'Coach Surface',
      outline: 'border-[#23C45F] dark:border-[#23C45F]',
      badgeColor: 'text-[#16A24B] bg-[#F1FDF4] dark:bg-[#14291B]',
      bullets: [
        'Coach live dashboard',
        'Trendline rendering',
        'Alert dispatching',
        'End-to-end lineage',
      ],
      isHighlighted: isTrustedZonesActive,
    },
  ];

  return (
    <div className="bg-white dark:bg-[#1C1917] rounded-[20px] border border-[#EBEAEB] dark:border-[#2E2A27] p-6 pb-5 flex flex-col overflow-hidden shadow-sm">
      {/* Top Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--ps-panel-border,#F1F1F1)]">
        <div>
          <span className="text-[11px] font-[600] font-mono uppercase tracking-wider text-[#888888]">
            Zero-Trust Architecture
          </span>
          <h3 className="text-[18px] font-[600] text-[var(--ps-ink,#1D1A1A)]">
            Six-Stage Defense-in-Depth Pipeline
          </h3>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-[#888888]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full border border-[#EF4544]" /> Untrusted
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full border border-[var(--ps-ink,#1D1A1A)]" /> Perimeter
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full border border-[#23C45F]" /> Trusted
          </span>
        </div>
      </div>

      {/* Six Connected Cards in a row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 my-4">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className={`p-3.5 rounded-xl border bg-[#F9F8F8] dark:bg-[#23201D] flex flex-col justify-between transition-all duration-300 ${
              zone.outline
            } ${
              zone.isHighlighted
                ? 'ring-2 ring-[var(--ps-ink,#1D1A1A)] dark:ring-white scale-[1.02] shadow-sm'
                : 'opacity-90'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono text-[#888888] font-bold">
                  {zone.num}
                </span>
                <span
                  className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded ${zone.badgeColor}`}
                >
                  {zone.tag}
                </span>
              </div>
              <h4 className="text-[14px] font-[600] text-[var(--ps-ink,#1D1A1A)] mb-2">
                {zone.title}
              </h4>
              <ul className="space-y-1 text-[11px] text-[#656565] dark:text-[#A8A29E] font-mono">
                {zone.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-[#888888] select-none">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Dashed connector indicator rows */}
      <div className="bg-[#F9F8F8] dark:bg-[#23201D] border border-[#F1F1F1] dark:border-[#2F2925] rounded-xl p-3 my-2 space-y-2 text-[11px] font-mono">
        <div className="flex items-center gap-2 text-[#EF4544] dark:text-[#F87171]">
          <span className="font-bold shrink-0">⮑ BRANCH [Gateway & Validation]:</span>
          <span className="border-b border-dashed border-[#EF4544] flex-1 pb-0.5">
            Failure triggers immediate REJECT (packet discarded) or QUARANTINE (isolated from coach dashboard)
          </span>
        </div>
        <div className="flex items-center gap-2 text-[#16A24B] dark:text-[#4ADE80]">
          <span className="font-bold shrink-0">⮐ LINEAGE [Reporting → Raw Zone]:</span>
          <span className="border-b border-dashed border-[#23C45F] flex-1 pb-0.5">
            Every metric on coach’s dashboard links backward through HMAC proof to the original raw event
          </span>
        </div>
      </div>

      {/* Bottom Cross-Cutting Security Strip */}
      <div className="bg-[#1D1A1A] text-[#F5F0E8] rounded-xl px-4 py-2.5 text-[11px] font-mono flex flex-wrap items-center justify-between gap-2 mt-1">
        <span className="text-[#A8A29E] font-semibold">CROSS-CUTTING SECURITY:</span>
        <span>TLS 1.3 everywhere</span>
        <span>·</span>
        <span>Keys in secure vault</span>
        <span>·</span>
        <span>Central audit log</span>
        <span>·</span>
        <span>Live alerts</span>
      </div>

      {/* Footer */}
      <CardFooter
        title="Zero-Trust Architecture"
        description="Isolation boundaries prevent sensor tampering from compromising coaching decisions."
        linkText="Learn more"
        onLinkClick={onLearnMore}
        className="mt-3"
      />
    </div>
  );
}
