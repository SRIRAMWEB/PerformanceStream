'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer
      className="w-full border-t border-stone-200/80 bg-white py-12 px-4 sm:px-6 lg:px-8 mt-12"
      aria-label="ProofReach platform footer"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#024E46]/10 flex items-center justify-center text-[#024E46]">
            <svg
              className="w-5 h-5 text-[#024E46]"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2L2 12l10 10 10-10L12 2zm0 4.5l5.5 5.5L12 17.5 6.5 12 12 6.5z" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-stone-900 text-base tracking-tight">
              ProofReach
            </span>
            <span className="text-[13px] text-stone-500 block">
              Creator collaboration with verified proof
            </span>
          </div>
        </div>

        {/* Quick Nav Links */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap items-center justify-center gap-6 text-[13px] font-semibold text-stone-600">
            <li>
              <a
                href="#home"
                className="hover:text-[#024E46] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#024E46] rounded-md px-1 py-0.5"
              >
                Overview
              </a>
            </li>
            <li>
              <a
                href="#demo"
                className="hover:text-[#024E46] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#024E46] rounded-md px-1 py-0.5"
              >
                Live Demo
              </a>
            </li>
            <li>
              <a
                href="#why"
                className="hover:text-[#024E46] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#024E46] rounded-md px-1 py-0.5"
              >
                Why ProofReach
              </a>
            </li>
            <li>
              <a
                href="#pricing"
                className="hover:text-[#024E46] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#024E46] rounded-md px-1 py-0.5"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#faq"
                className="hover:text-[#024E46] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#024E46] rounded-md px-1 py-0.5"
              >
                FAQ
              </a>
            </li>
          </ul>
        </nav>

        {/* Team & Prototype Attribution */}
        <div className="text-center md:text-right text-[13px] text-stone-500 space-y-1">
          <div className="font-medium text-stone-700">Team Among Us &bull; CODEX 3.0</div>
          <div>Prototype with sample data.</div>
        </div>
      </div>
    </footer>
  );
}
