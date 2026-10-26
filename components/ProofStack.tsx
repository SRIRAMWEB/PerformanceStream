'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Coffee, Check, ShieldCheck } from 'lucide-react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';

const CHECKS = [
  { id: 'live', label: 'Post is live' },
  { id: 'product', label: 'Product visible' },
  { id: 'adlabel', label: '#ad label present' },
  { id: 'deadline', label: 'Posted before deadline' },
  { id: 'engagement', label: 'Engagement looks real' },
];

const TICK_INTERVAL = 600;
const PAUSE_AFTER = 2000;

function TrustRing({ pct, size = 80 }: { pct: number; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const filled = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`Trust Score ${pct}%`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(2,78,70,0.10)" strokeWidth={8} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#119C75"
        strokeWidth={8}
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 0.7s cubic-bezier(0.22,1,0.36,1)' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#024E46"
        fontSize="16"
        fontFamily="var(--font-inter)"
        fontWeight="600"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {pct}%
      </text>
    </svg>
  );
}

export default function ProofStack() {
  const reduced = useReducedMotion();
  const [tickedCount, setTickedCount] = useState(reduced ? 5 : 0);
  const [released, setReleased] = useState(reduced ? true : false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reduced) return;

    function runCycle(start: number) {
      let count = start;
      function tick() {
        if (count < CHECKS.length) {
          count++;
          setTickedCount(count);
          timerRef.current = setTimeout(tick, TICK_INTERVAL);
        } else {
          setReleased(true);
          timerRef.current = setTimeout(() => {
            setTickedCount(0);
            setReleased(false);
            timerRef.current = setTimeout(() => runCycle(0), 100);
          }, PAUSE_AFTER);
        }
      }
      tick();
    }

    runCycle(0);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [reduced]);

  const escrowLabel = released ? 'Released ✓' : '₹22,500 · Held in escrow';

  return (
    <div className="relative w-full max-w-[380px] mx-auto" style={{ height: 340 }} aria-label="Sample proof stack animation">
      {/* Radial glow behind the stack */}
      <div className="absolute inset-0 hero-glow rounded-panel" aria-hidden="true" />

      {/* Card 3 (back) – Trust Score */}
      <div
        className="absolute bg-[var(--white)] rounded-card shadow-md border border-[rgba(2,78,70,0.10)] p-4 flex flex-col items-center gap-2"
        style={{ bottom: 0, right: 0, width: 120, zIndex: 1 }}
      >
        <TrustRing pct={92} />
        <span className="text-[12px] font-medium text-[var(--text)] text-center leading-tight">Trust Score</span>
      </div>

      {/* Card 2 (middle) – Escrow chip */}
      <motion.div
        className="absolute bg-[var(--white)] rounded-card shadow-md border border-[rgba(2,78,70,0.10)] p-4 flex flex-col gap-1"
        style={{ bottom: 40, left: 0, width: 180, zIndex: 2 }}
        animate={reduced ? {} : { y: [0, -4, 0] }}
        transition={reduced ? {} : { duration: 5, ease: 'easeInOut', repeat: Infinity, delay: 1 }}
      >
        <span className="text-[11px] font-medium text-[var(--text)] uppercase tracking-wide" style={{ letterSpacing: '0.06em' }}>Escrow</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={escrowLabel}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="text-[13px] font-semibold tabular-nums"
            style={{ color: released ? 'var(--success)' : 'var(--green)' }}
          >
            {escrowLabel}
          </motion.span>
        </AnimatePresence>
        <span className="text-[11px]" style={{ color: 'var(--text)', opacity: 0.6 }}>
          {released ? 'Payout confirmed' : 'Releases on verified proof'}
        </span>
      </motion.div>

      {/* Card 1 (front) – Mock post + checklist */}
      <motion.div
        className="absolute bg-[var(--white)] rounded-card shadow-lg border border-[rgba(2,78,70,0.10)] overflow-hidden"
        style={{ top: 0, left: 16, right: 16, zIndex: 3 }}
        animate={reduced ? {} : { y: [0, -6, 0] }}
        transition={reduced ? {} : { duration: 6, ease: 'easeInOut', repeat: Infinity }}
      >
        {/* Mock post visual */}
        <div
          className="w-full flex items-center justify-center relative"
          style={{
            height: 100,
            background: 'linear-gradient(135deg, rgba(246,129,162,0.25) 0%, rgba(159,130,254,0.25) 100%)',
          }}
          aria-hidden="true"
        >
          <div
            className="w-14 h-14 rounded-card flex items-center justify-center"
            style={{ background: 'rgba(246,129,162,0.25)', backdropFilter: 'blur(4px)' }}
          >
            <Coffee size={28} color="#F681A2" strokeWidth={1.5} />
          </div>
        </div>

        {/* Caption */}
        <div className="px-4 pt-2 pb-1">
          <p className="text-[12px] leading-snug" style={{ color: 'var(--text)' }}>
            Mornings just got better with this cold brew ☕ <span className="font-semibold" style={{ color: 'var(--green)' }}>#ad</span>
          </p>
        </div>

        {/* Checklist */}
        <ul className="px-4 pb-3 flex flex-col gap-1" role="list" aria-label="AI Referee checks">
          {CHECKS.map((check, i) => {
            const ticked = i < tickedCount;
            return (
              <li key={check.id} className="flex items-center gap-2">
                <span
                  className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{
                    width: 18,
                    height: 18,
                    background: ticked ? 'var(--success-bg)' : 'rgba(2,78,70,0.07)',
                    transition: 'background 0.3s',
                  }}
                  aria-hidden="true"
                >
                  {ticked && <Check size={11} strokeWidth={3} color="var(--success)" />}
                </span>
                <span
                  className="text-[12px]"
                  style={{ color: ticked ? 'var(--success)' : 'var(--text)', transition: 'color 0.3s' }}
                >
                  {check.label}
                </span>
              </li>
            );
          })}
        </ul>
      </motion.div>

      {/* "Sample" label */}
      <div className="absolute bottom-[-24px] left-0 right-0 flex justify-center" aria-hidden="true">
        <span className="text-[11px] font-medium px-3 py-1 rounded-pill bg-[rgba(2,78,70,0.07)] text-[var(--text)]" style={{ opacity: 0.7 }}>
          Sample
        </span>
      </div>
    </div>
  );
}
