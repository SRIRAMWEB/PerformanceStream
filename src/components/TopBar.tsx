'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Home', shortLabel: 'Home' },
  { href: '/simulator', label: 'Live demo', shortLabel: 'Live demo' },
  { href: '/architecture', label: 'Architecture', shortLabel: 'Arch' },
];

export function TopBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F6F1E7] border-b border-[#E3DCCB]">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 h-[64px] flex items-center justify-between">
        {/* Wordmark Left */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1B16] rounded-md py-1 px-1.5"
          aria-label="PerformanceStream home"
        >
          {/* Hand-drawn style mini heartbeat mark */}
          <span className="w-7 h-7 rounded-lg bg-[#FFFFFF] border border-[#E3DCCB] flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D1B16" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 12h4l2.5-6 4 13 3-9 2.5 4H22" />
            </svg>
          </span>
          <span className="font-sans font-semibold text-[16px] sm:text-[17px] tracking-tight text-[#1D1B16]">
            PerformanceStream
          </span>
        </Link>

        {/* Navigation Items: Home, Live demo, Architecture */}
        <nav
          className="flex items-center gap-1 p-1 bg-[#FFFFFF] border border-[#E3DCCB] rounded-full"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[13px] sm:text-[14px] font-sans font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1B16] min-h-[36px] flex items-center justify-center ${
                  isActive
                    ? 'bg-[#F6F1E7] text-[#1D1B16] font-semibold border border-[#E3DCCB]'
                    : 'text-[#6B6559] hover:text-[#1D1B16]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.shortLabel}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

