'use client';

import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface RiskModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  onContinue: () => void;
}

export function RiskModal({ isOpen, onDismiss, onContinue }: RiskModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      primaryButtonRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onDismiss();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onDismiss]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="risk-dialog-title"
        aria-describedby="risk-dialog-desc"
        className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-amber-200"
      >
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#024E46]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 id="risk-dialog-title" className="text-lg font-bold text-stone-900 leading-tight">
              High risk: only 41% real followers
            </h2>
            <span className="text-[13px] text-amber-700 font-medium">Audience Quality Alert</span>
          </div>
        </div>

        <p id="risk-dialog-desc" className="text-stone-600 text-sm mb-6 leading-relaxed">
          Our audience scan flagged that 59% of this account&apos;s followers appear inactive or bot-like.
          Selecting this creator may trigger referee flags during post verification.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            ref={primaryButtonRef}
            type="button"
            onClick={onDismiss}
            className="btn-primary w-full py-3 text-sm justify-center rounded-xl"
          >
            Choose another
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="w-full py-3 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#024E46]"
          >
            Continue anyway
          </button>
        </div>
      </div>
    </div>
  );
}
