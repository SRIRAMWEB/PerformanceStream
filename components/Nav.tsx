'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, X, Menu } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Live Demo', href: '#demo' },
  { label: 'Why ProofReach', href: '#why' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

function DiamondLogo() {
  return (
    <a
      href="#home"
      className="flex items-center gap-2 focus-visible:outline-none"
      onClick={(e) => {
        e.preventDefault();
        document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState(null, '', '#home');
      }}
      aria-label="ProofReach home"
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 1 L27 14 L14 27 L1 14 Z" fill="#024E46" />
        <path d="M14 7 L21 14 L14 21 L7 14 Z" fill="#FAFADC" />
      </svg>
      <span
        style={{ fontFamily: 'var(--font-inter)', fontWeight: 600, fontSize: '17px', color: 'var(--green)', letterSpacing: '-0.02em' }}
      >
        ProofReach
      </span>
    </a>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const ids = ['home', 'demo', 'why', 'pricing', 'faq'];
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
            window.history.replaceState(null, '', `#${id}`);
          }
        },
        { rootMargin: '-60px 0px -60% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      const firstLink = drawerRef.current?.querySelector('a') as HTMLElement | null;
      firstLink?.focus();
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
        hamburgerRef.current?.focus();
      }
      if (mobileOpen && e.key === 'Tab' && drawerRef.current) {
        const focusable = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])')
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [mobileOpen]);

  const smoothScroll = (href: string) => {
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    window.history.replaceState(null, '', href);
    setMobileOpen(false);
    hamburgerRef.current?.focus();
  };

  return (
    <>
      {/* Skip to content */}
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-pill focus:bg-[var(--green)] focus:text-[var(--cream)] focus:font-semibold"
        onClick={(e) => { e.preventDefault(); smoothScroll('#home'); }}
      >
        Skip to content
      </a>

      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[101] h-[3px]" aria-hidden="true">
        <motion.div
          className="h-full bg-[var(--g600)]"
          style={{ width: progressWidth }}
        />
      </div>

      <header
        className={`fixed top-0 left-0 right-0 z-[100] h-16 transition-all duration-300 ${
          scrolled
            ? 'bg-[var(--cream)]/90 backdrop-blur-md border-b border-[rgba(2,78,70,0.10)]'
            : 'bg-transparent'
        }`}
        role="banner"
      >
        <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between gap-6">
          <DiamondLogo />

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ label, href }) => {
              const id = href.replace('#', '');
              const isActive = activeSection === id;
              return (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => { e.preventDefault(); smoothScroll(href); }}
                  className={`text-[14px] font-medium transition-colors duration-150 ${
                    isActive
                      ? 'text-[var(--green)] font-semibold'
                      : 'text-[var(--text)] hover:text-[var(--green)]'
                  }`}
                  style={{ textDecoration: 'none' }}
                >
                  {label}
                </a>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <a
            href="#demo"
            onClick={(e) => { e.preventDefault(); smoothScroll('#demo'); }}
            className="hidden md:inline-flex btn-primary text-sm"
            style={{ height: '44px', fontSize: '14px' }}
          >
            <span className="btn-icon" style={{ width: '32px', height: '32px', minHeight: 'auto' }}>
              <ArrowRight size={14} strokeWidth={2.5} />
            </span>
            Try the Live Demo
          </a>

          {/* Mobile hamburger */}
          <button
            ref={hamburgerRef}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-drawer"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-card border border-[rgba(2,78,70,0.12)] bg-[var(--white)] text-[var(--green)]"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[98] bg-[var(--charcoal)]/30 md:hidden"
              aria-hidden="true"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              id="mobile-drawer"
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 z-[99] w-[280px] bg-[var(--cream)] shadow-lg flex flex-col p-8 md:hidden"
            >
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => { setMobileOpen(false); hamburgerRef.current?.focus(); }}
                  aria-label="Close menu"
                  className="w-11 h-11 flex items-center justify-center text-[var(--green)]"
                >
                  <X size={20} />
                </button>
              </div>
              <nav aria-label="Mobile navigation" className="flex flex-col gap-2">
                {NAV_LINKS.map(({ label, href }) => (
                  <a
                    key={href}
                    href={href}
                    onClick={(e) => { e.preventDefault(); smoothScroll(href); }}
                    className="text-[17px] font-medium text-[var(--green)] py-3 border-b border-[rgba(2,78,70,0.08)]"
                    style={{ textDecoration: 'none' }}
                  >
                    {label}
                  </a>
                ))}
              </nav>
              <div className="mt-8">
                <a
                  href="#demo"
                  onClick={(e) => { e.preventDefault(); smoothScroll('#demo'); }}
                  className="btn-primary w-full justify-center"
                >
                  <span className="btn-icon" style={{ width: '32px', height: '32px', minHeight: 'auto' }}>
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </span>
                  Try the Live Demo
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
