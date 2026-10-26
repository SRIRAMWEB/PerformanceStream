'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { PrimaryButton } from './Buttons';

const NAV_ITEMS = [
  { href: '/', label: 'Home', shortLabel: 'Home' },
  { href: '/architecture', label: 'Architecture', shortLabel: 'Arch' },
  { href: '/simulator', label: 'Live demo', shortLabel: 'Demo' },
  { href: '/video', label: 'Video demo', shortLabel: 'Video' },
];

export function TopBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#e9e4db]/85 border-b border-[rgba(15,31,27,0.12)] transition-colors">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 h-[76px] flex items-center justify-between gap-2">
        {/* Wordmark Left */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#034F46] rounded-lg py-1 px-1.5 shrink-0"
          aria-label="PerformanceStream home"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#034F46] animate-pulse" />
          <span className="font-['Fraunces'] font-semibold text-[20px] sm:text-[22px] tracking-tight text-[#0F1F1B]">
            PerformanceStream
          </span>
        </Link>

        {/* 3 Links Centered with Shared LayoutId Gliding Pill */}
        <nav
          className="flex items-center gap-1 sm:gap-2 p-1.5 bg-[#F4F0E8] border border-[rgba(15,31,27,0.12)] rounded-full relative"
          aria-label="Primary navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 sm:px-4 py-1.5 rounded-full text-[13px] sm:text-[14px] font-['Manrope'] font-medium transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#034F46] min-h-[36px] flex items-center justify-center ${
                  isActive ? 'text-[#0F1F1B] font-semibold' : 'text-[#48504F] hover:text-[#0F1F1B]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-glide-pill"
                    className="absolute inset-0 bg-[#e9e4db] border border-[rgba(15,31,27,0.15)] rounded-full shadow-xs -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.shortLabel}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="shrink-0">
          <PrimaryButton href="/simulator" aria-label="Run the demo simulator">
            Run the demo
          </PrimaryButton>
        </div>
      </div>
    </header>
  );
}
