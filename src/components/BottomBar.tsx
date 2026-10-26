'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PrimaryButton } from './Buttons';

const ROUTE_FLOW = [
  { href: '/', label: 'Home', prev: null, next: { href: '/architecture', name: 'Architecture' }, dotIndex: 0 },
  { href: '/architecture', label: 'Architecture', prev: { href: '/', name: 'Home' }, next: { href: '/simulator', name: 'Live demo' }, dotIndex: 1 },
  { href: '/simulator', label: 'Live demo', prev: { href: '/architecture', name: 'Architecture' }, next: { href: '/', name: 'Home' }, dotIndex: 2 },
];

export function BottomBar() {
  const pathname = usePathname();
  const current = ROUTE_FLOW.find((r) => r.href === pathname) || ROUTE_FLOW[0];

  return (
    <div className="w-full py-10 border-t border-[rgba(15,31,27,0.12)] my-8">
      <div className="max-w-[1300px] mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Back text button */}
        {current.prev ? (
          <Link
            href={current.prev.href}
            className="text-[14px] font-['Manrope'] font-semibold text-[#48504F] hover:text-[#0F1F1B] transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#034F46] rounded-md px-2 py-1 min-h-[44px]"
            aria-label={`Go back to ${current.prev.name}`}
          >
            <span aria-hidden="true">←</span>
            <span>Back to {current.prev.name}</span>
          </Link>
        ) : (
          <div className="min-h-[44px]" />
        )}

        {/* Three small progress dots */}
        <div className="flex items-center gap-2" aria-label={`Page ${current.dotIndex + 1} of 3`}>
          {[0, 1, 2].map((idx) => (
            <span
              key={idx}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                current.dotIndex === idx
                  ? 'bg-[#034F46] scale-125 ring-2 ring-[#034F46]/20'
                  : 'bg-[rgba(15,31,27,0.2)]'
              }`}
            />
          ))}
        </div>

        {/* Next Primary Pill */}
        {current.next && (
          <PrimaryButton href={current.next.href} aria-label={`Proceed to ${current.next.name}`}>
            Next: {current.next.name}
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="w-full py-6 px-6 sm:px-12 border-t border-[rgba(15,31,27,0.08)] bg-[#e9e4db] text-[#48504F] text-[13px] font-['Manrope']">
      <div className="max-w-[1300px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span>Team Among Us · BRCX-SPT-03 · BreachX</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://github.com/SRIRAMWEB/PerformanceStream"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#034F46] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#034F46] rounded"
          >
            GitHub Repository
          </a>
          <span>·</span>
          <span className="text-[#48504F]/80">Photos: Unsplash and Pexels contributors</span>
        </div>
      </div>
    </footer>
  );
}
