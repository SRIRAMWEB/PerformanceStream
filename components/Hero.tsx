'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { FaInstagram, FaYoutube, FaLinkedin, FaXTwitter, FaFacebook } from 'react-icons/fa6';
import ProofStack from './ProofStack';

const EASING = [0.22, 1, 0.36, 1] as const;

const FACT_STRIP = [
  { value: '$2,000/mo', label: 'What enterprise tools cost', prefix: '' },
  { value: '0', label: 'Paid before proof', prefix: '' },
  { value: '5', label: 'AI checks per post', prefix: '' },
];

const PLATFORM_ICONS = [
  { Icon: FaInstagram, label: 'Instagram' },
  { Icon: FaYoutube, label: 'YouTube' },
  { Icon: FaLinkedin, label: 'LinkedIn' },
  { Icon: FaXTwitter, label: 'X (Twitter)' },
  { Icon: FaFacebook, label: 'Facebook' },
];

function AnimatedWord({ word, delay }: { word: string; delay: number }) {
  const reduced = useReducedMotion();
  return (
    <span style={{ overflow: 'hidden', display: 'inline-block', verticalAlign: 'bottom' }}>
      <motion.span
        style={{ display: 'inline-block' }}
        initial={reduced ? {} : { y: '110%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={reduced ? {} : { delay, duration: 0.55, ease: EASING }}
      >
        {word}
      </motion.span>
    </span>
  );
}

function H1() {
  const words = 'Pay creators only for proven results'.split(' ');
  return (
    <h1 style={{ display: 'flex', flexWrap: 'wrap', gap: '0 0.3em', lineHeight: 1.02 }}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <AnimatedWord word={word} delay={i * 0.04} />
        </React.Fragment>
      ))}
    </h1>
  );
}

function useCountUp(target: number | null, duration = 900) {
  const [val, setVal] = useState(0);
  const reduced = useReducedMotion();
  const ref = useRef<number>(0);

  useEffect(() => {
    if (target === null) return;
    if (reduced) { setVal(target); return; }
    const start = performance.now();
    function step(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      if (target !== null) setVal(Math.round(eased * target));
      if (t < 1) ref.current = requestAnimationFrame(step);
    }
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration, reduced]);

  return val;
}

function FactCard({ value, label, inView }: { value: string; label: string; inView: boolean }) {
  const isNumber = /^\d/.test(value);
  const num = isNumber ? parseInt(value.replace(/\D/g, ''), 10) : null;
  const counted = useCountUp(inView && num !== null ? num : null);

  const display = num !== null
    ? value.replace(/\d+/, String(inView ? counted : 0))
    : value;

  return (
    <div className="text-center">
      <div
        className="tabular-nums"
        style={{
          fontFamily: 'var(--font-instrument-serif)',
          fontSize: 'clamp(28px, 4vw, 40px)',
          color: 'var(--green)',
          lineHeight: 1.1,
          fontWeight: 400,
        }}
      >
        {display}
      </div>
      <p className="text-[13px] font-medium mt-1" style={{ color: 'var(--text)', opacity: 0.75 }}>
        {label}
      </p>
    </div>
  );
}

export default function Hero() {
  const reduced = useReducedMotion();
  const [factsVisible, setFactsVisible] = useState(false);
  const factsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!factsRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setFactsVisible(true); },
      { threshold: 0.3 }
    );
    obs.observe(factsRef.current);
    return () => obs.disconnect();
  }, []);

  const smoothScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <section
      id="home"
      className="w-full flex items-center"
      style={{
        minHeight: 'min(720px, calc(100svh - 64px))',
        paddingTop: 96,
        paddingBottom: 64,
      }}
    >
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Text column – 6 cols */}
          <motion.div
            className="lg:col-span-6 flex flex-col gap-6"
            initial={reduced ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? {} : { duration: 0.6, ease: EASING }}
          >
            <H1 />

            <p className="text-[17px] leading-relaxed max-w-[52ch]" style={{ color: 'var(--text)' }}>
              ProofReach matches brands with creators by real audience fit, holds payment in escrow, and releases it only after AI verifies the post.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                className="btn-primary"
                onClick={() => smoothScroll('demo')}
                aria-label="Try the Live Demo"
              >
                <span className="btn-icon">
                  <ArrowRight size={16} strokeWidth={2.5} />
                </span>
                Try the Live Demo
              </button>
              <button
                className="btn-ghost"
                onClick={() => smoothScroll('demo')}
                aria-label="See how it works"
              >
                See how it works
              </button>
            </div>

            {/* Fact strip */}
            <div
              ref={factsRef}
              className="grid grid-cols-3 gap-4 mt-4 pt-6"
              style={{ borderTop: '1px solid rgba(2,78,70,0.10)' }}
            >
              {FACT_STRIP.map(({ value, label }) => (
                <FactCard key={label} value={value} label={label} inView={factsVisible} />
              ))}
            </div>

            {/* Platform icons */}
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-center gap-4" role="list" aria-label="Supported platforms">
                {PLATFORM_ICONS.map(({ Icon, label }) => (
                  <span
                    key={label}
                    role="listitem"
                    aria-label={label}
                    style={{ color: 'var(--green)', opacity: 0.65, fontSize: 20 }}
                    title={label}
                  >
                    <Icon aria-hidden="true" />
                  </span>
                ))}
              </div>
              <p className="text-[13px] leading-snug" style={{ color: 'var(--text)', opacity: 0.65 }}>
                Built to integrate with Instagram Graph API, YouTube API, Stripe Connect and Razorpay (planned).
              </p>
            </div>
          </motion.div>

          {/* Visual column – 6 cols */}
          <motion.div
            className="lg:col-span-6 flex justify-center items-center pb-10"
            initial={reduced ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? {} : { duration: 0.7, delay: 0.15, ease: EASING }}
          >
            <ProofStack />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
