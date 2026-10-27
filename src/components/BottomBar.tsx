'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomBar() {
  const pathname = usePathname();

  // Home has NO competing bottom CTA per specification:
  // "Home: hero CTA 'Run the attack demo' goes to the Live demo. No second competing CTA at the bottom."
  if (pathname === '/') {
    return null;
  }

  // Live demo ends with "Next: See how it's built" -> /architecture
  if (pathname === '/simulator') {
    return (
      <div className="w-full py-12 border-t border-[#E3DCCB] mt-12 bg-[#F6F1E7]">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-[13px] text-[#6B6559]">
            Step 2 of 3 · Live verification gate demonstration
          </div>
          <Link
            href="/architecture"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1D1B16] text-[#FFFFFF] font-sans font-semibold text-[14px] hover:bg-[#333027] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1B16] min-h-[44px]"
            aria-label="Next: See how it's built in Architecture"
          >
            <span>Next: See how it's built</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    );
  }

  // Architecture has its dedicated wrap-up strip per specification
  return null;
}

export function Footer() {
  return (
    <footer className="w-full py-8 px-6 sm:px-12 border-t border-[#E3DCCB] bg-[#F6F1E7] text-[#6B6559] text-[13px] font-sans">
      <div className="max-w-[1300px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <span className="font-medium text-[#1D1B16]">Team Among Us</span>
          <span className="hidden sm:inline text-[#E3DCCB]">·</span>
          <span>Problem statement BRCX-SPT-03 · BreachX hackathon</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/SRIRAMWEB/PerformanceStream"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1D1B16] font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1B16] rounded"
          >
            GitHub Repository
          </a>
        </div>
      </div>
    </footer>
  );
}

