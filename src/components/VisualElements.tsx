'use client';

import React from 'react';

/**
 * Signature artistic element: a thin, continuous, hand-drawn-style heartbeat line
 * Inline SVG, 1.5px stroke, ink colour (#1D1B16).
 */
export function HeartbeatLine({ className = '', height = 32 }: { className?: string; height?: number }) {
  return (
    <div className={`w-full overflow-hidden flex items-center justify-center my-4 select-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 800 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full text-[#1D1B16]"
        style={{ height }}
        preserveAspectRatio="none"
      >
        <path
          d="M0 18 H320 C332 18, 335 17, 340 10 C345 3, 348 2, 352 28 C355 35, 359 34, 362 5 C366 -2, 370 2, 374 24 C378 33, 381 29, 385 14 C388 8, 391 18, 400 18 H800"
          stroke="#1D1B16"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/**
 * Accessible Status Badge: marker shape AND text label
 * Trusted = filled circle (●), Quarantined = triangle (▲), Rejected = cross (✕)
 */
export function StatusBadge({
  status,
  size = 'md',
  className = '',
}: {
  status: 'TRUSTED' | 'QUARANTINED' | 'REJECTED' | 'UNAVAILABLE' | 'IDLE';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const configs = {
    TRUSTED: {
      label: 'Trusted',
      icon: (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true" className="shrink-0">
          <circle cx="5" cy="5" r="4.5" />
        </svg>
      ),
      bg: 'bg-[#F0F6F2]',
      text: 'text-[#2F6B3F]',
      border: 'border-[#C1DEC8]',
    },
    QUARANTINED: {
      label: 'Quarantined',
      icon: (
        <svg width="11" height="10" viewBox="0 0 11 10" fill="currentColor" aria-hidden="true" className="shrink-0">
          <path d="M5.5 0.8L10.5 9.5H0.5L5.5 0.8Z" />
        </svg>
      ),
      bg: 'bg-[#FEF8EE]',
      text: 'text-[#B7791F]',
      border: 'border-[#F5DCB0]',
    },
    REJECTED: {
      label: 'Rejected',
      icon: (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="shrink-0">
          <line x1="1.5" y1="1.5" x2="8.5" y2="8.5" />
          <line x1="8.5" y1="1.5" x2="1.5" y2="8.5" />
        </svg>
      ),
      bg: 'bg-[#FDF2F0]',
      text: 'text-[#A63D2F]',
      border: 'border-[#F3C4BE]',
    },
    UNAVAILABLE: {
      label: 'Unavailable',
      icon: (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="shrink-0">
          <circle cx="5" cy="5" r="4" />
          <line x1="2" y1="2" x2="8" y2="8" />
        </svg>
      ),
      bg: 'bg-[#FDF2F0]',
      text: 'text-[#A63D2F]',
      border: 'border-[#F3C4BE]',
    },
    IDLE: {
      label: 'Standing by',
      icon: (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true" className="shrink-0">
          <circle cx="5" cy="5" r="3" />
        </svg>
      ),
      bg: 'bg-[#FFFFFF]',
      text: 'text-[#6B6559]',
      border: 'border-[#E3DCCB]',
    },
  };

  const c = configs[status] || configs.IDLE;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px] gap-1' : size === 'lg' ? 'px-3.5 py-1.5 text-[14px] gap-2' : 'px-2.5 py-1 text-[12px] gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-sans font-medium rounded-full border ${c.bg} ${c.text} ${c.border} ${sizeClasses} ${className}`}
    >
      {c.icon}
      <span>{c.label}</span>
    </span>
  );
}

/**
 * Trust percentage ring gauge
 */
export function TrustRing({
  trustedCount,
  totalCount,
  size = 110,
}: {
  trustedCount: number;
  totalCount: number;
  size?: number;
}) {
  const percentage = totalCount > 0 ? Math.round((trustedCount / totalCount) * 100) : 100;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E3DCCB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2F6B3F"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-mono font-bold text-[22px] text-[#1D1B16] leading-none">
          {percentage}%
        </span>
        <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-[#6B6559] mt-0.5">
          Trust
        </span>
      </div>
    </div>
  );
}

/**
 * Consistent Line-Art SVGs (replacing all stock photos)
 * Sensor, Shield, Ledger, Dashboard
 */
export function SensorIllustration({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full aspect-[4/3] rounded-2xl bg-[#FFFFFF] border border-[#E3DCCB] p-6 flex flex-col items-center justify-center ${className}`}>
      <svg width="80" height="80" viewBox="0 0 64 64" fill="none" stroke="#1D1B16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-label="Sensor device illustration">
        {/* Smart sensor chassis */}
        <rect x="18" y="14" width="28" height="36" rx="8" fill="#F6F1E7" />
        <circle cx="32" cy="32" r="7" stroke="#1D1B16" strokeWidth="1.5" fill="#FFFFFF" />
        <path d="M28 32h2l1-3 2 6 1-3h2" stroke="#2F6B3F" strokeWidth="1.5" />
        {/* Watch straps */}
        <path d="M24 14V6h16v8" />
        <path d="M24 50v8h16v-8" />
        {/* RF Signal Waves */}
        <path d="M50 24a12 12 0 0 1 0 16" />
        <path d="M54 20a18 18 0 0 1 0 24" />
        <circle cx="32" cy="19" r="1.5" fill="#1D1B16" />
      </svg>
      <span className="text-[12px] font-mono font-medium text-[#6B6559] mt-3">Device S-07 · Secure Hardware Key</span>
    </div>
  );
}

export function ShieldIllustration({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full aspect-[4/3] rounded-2xl bg-[#FFFFFF] border border-[#E3DCCB] p-6 flex flex-col items-center justify-center ${className}`}>
      <svg width="80" height="80" viewBox="0 0 64 64" fill="none" stroke="#1D1B16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-label="Verification gate shield illustration">
        <path d="M32 8L16 16v16c0 14 16 22 16 22s16-8 16-22V16L32 8z" fill="#F6F1E7" />
        {/* 5-checkpoint lines */}
        <path d="M26 28l4 4 8-8" stroke="#2F6B3F" strokeWidth="2" />
        <line x1="24" y1="38" x2="40" y2="38" stroke="#E3DCCB" />
        <line x1="26" y1="42" x2="38" y2="42" stroke="#E3DCCB" />
      </svg>
      <span className="text-[12px] font-mono font-medium text-[#6B6559] mt-3">5 Sequential Perimeter Checkpoints</span>
    </div>
  );
}

export function LedgerIllustration({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full aspect-[4/3] rounded-2xl bg-[#FFFFFF] border border-[#E3DCCB] p-6 flex flex-col items-center justify-center ${className}`}>
      <svg width="80" height="80" viewBox="0 0 64 64" fill="none" stroke="#1D1B16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-label="Cryptographic hash chain ledger illustration">
        {/* Block 1 */}
        <rect x="8" y="20" width="20" height="24" rx="4" fill="#F6F1E7" />
        <line x1="12" y1="26" x2="24" y2="26" stroke="#6B6559" />
        <line x1="12" y1="31" x2="20" y2="31" stroke="#6B6559" />
        {/* Chain link */}
        <path d="M28 32h8" stroke="#1D1B16" strokeWidth="2" strokeDasharray="2 2" />
        {/* Block 2 */}
        <rect x="36" y="20" width="20" height="24" rx="4" fill="#F6F1E7" />
        <line x1="40" y1="26" x2="52" y2="26" stroke="#6B6559" />
        <line x1="40" y1="31" x2="48" y2="31" stroke="#6B6559" />
        {/* SHA-256 seal */}
        <circle cx="46" cy="38" r="3" fill="#2F6B3F" />
      </svg>
      <span className="text-[12px] font-mono font-medium text-[#6B6559] mt-3">Append-Only SHA-256 WORM Chain</span>
    </div>
  );
}

export function DashboardIllustration({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full aspect-[4/3] rounded-2xl bg-[#FFFFFF] border border-[#E3DCCB] p-6 flex flex-col items-center justify-center ${className}`}>
      <svg width="80" height="80" viewBox="0 0 64 64" fill="none" stroke="#1D1B16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-label="Coach sideline dashboard illustration">
        <rect x="10" y="12" width="44" height="32" rx="4" fill="#F6F1E7" />
        <line x1="16" y1="32" x2="22" y2="32" />
        <path d="M22 32l3-6 4 10 3-7 4 3h12" stroke="#2F6B3F" strokeWidth="1.5" />
        <line x1="10" y1="20" x2="54" y2="20" stroke="#E3DCCB" />
        <circle cx="15" cy="16" r="1.5" fill="#2F6B3F" />
        {/* Stand base */}
        <path d="M26 44l-4 8h20l-4-8" />
        <line x1="20" y1="52" x2="44" y2="52" strokeWidth="2" />
      </svg>
      <span className="text-[12px] font-mono font-medium text-[#6B6559] mt-3">Sideline Display with Full Traceability</span>
    </div>
  );
}

