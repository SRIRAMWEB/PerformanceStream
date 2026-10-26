'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function EcgDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden flex items-center justify-center my-6 py-2 ${className}`}>
      <svg
        viewBox="0 0 1200 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-8 opacity-40 text-[var(--ps-card-border,#EBEAEB)]"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0 20 H360 L380 20 L390 10 L400 30 L410 4 L420 34 L430 20 L450 20 H740 L760 20 L770 10 L780 30 L790 4 L800 34 L810 20 L830 20 H1200"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
    </div>
  );
}
