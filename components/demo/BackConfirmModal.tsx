'use client';

import React, { useEffect, useRef } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface BackConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function BackConfirmModal({ isOpen, onConfirm, onCancel }: BackConfirmModalProps) {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      confirmBtnRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onCancel();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="back-dialog-title"
        aria-describedby="back-dialog-desc"
        className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200"
      >
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#024E46]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
            <AlertCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 id="back-dialog-title" className="text-lg font-bold text-stone-900 leading-tight">
              Reset Escrow Lock?
            </h2>
            <span className="text-[13px] text-stone-500">Navigation confirmation</span>
          </div>
        </div>

        <p id="back-dialog-desc" className="text-stone-600 text-sm mb-6 leading-relaxed">
          Navigating back to early campaign parameters will cancel the current escrow status and reset in-flight verification checks.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            className="btn-primary w-full py-3 text-sm justify-center rounded-xl bg-amber-600 hover:bg-amber-700 text-white"
          >
            Confirm &amp; Go Back
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-3 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#024E46]"
          >
            Keep Working
          </button>
        </div>
      </div>
    </div>
  );
}
