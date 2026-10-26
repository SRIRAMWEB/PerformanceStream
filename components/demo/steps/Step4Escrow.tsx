'use client';

import React, { useState } from 'react';
import { DemoState } from '@/lib/types';
import { formatINR } from '@/lib/format';
import { Lock, ArrowRight, CheckCircle2, ShieldAlert, Loader2 } from 'lucide-react';

interface Step4EscrowProps {
  state: DemoState;
  onFundEscrow: () => void;
  onProceed: () => void;
}

export function Step4Escrow({ state, onFundEscrow, onProceed }: Step4EscrowProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFund = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onFundEscrow();
      setIsProcessing(false);
    }, 700);
  };

  const isHeld = state.escrow === 'held';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
          Secure Escrow Deposit
        </h2>
        <p className="text-stone-600 text-sm mt-1">
          Lock campaign funds safely. Money is held securely and only released when delivery criteria pass.
        </p>
      </div>

      {/* Escrow Deposit Summary Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#024E46]/10 text-[#024E46] flex items-center justify-center font-bold">
              <Lock className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Escrow Vault Deposit</h3>
              <p className="text-[13px] text-stone-500">Neutral third-party security</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[13px] font-semibold ${
              isHeld
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            {isHeld ? 'Held Securely' : 'Awaiting Deposit'}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm text-stone-600">
            <span>Agreed Deliverable Fee</span>
            <span className="font-semibold text-stone-900">{formatINR(state.agreedAmount)}</span>
          </div>
          <div className="flex justify-between text-sm text-stone-600">
            <span>Escrow Protection &amp; Arbitration</span>
            <span className="font-semibold text-emerald-700">Included (Free)</span>
          </div>
          <div className="pt-3 border-t border-stone-100 flex justify-between items-baseline">
            <span className="font-bold text-stone-900 text-base">Total Lock Amount</span>
            <span className="text-2xl font-bold text-[#024E46]">{formatINR(state.agreedAmount)}</span>
          </div>
        </div>

        {/* Payment Gateways & Mock notice */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[13px] font-semibold text-stone-700">Supported Rails:</span>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-800 text-[13px] font-bold">
                Razorpay
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-800 text-[13px] font-bold">
                Stripe Connect
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-stone-500">
            <ShieldAlert className="w-4 h-4 text-stone-400 shrink-0" />
            <span>Mock payment: no real money moves</span>
          </div>
        </div>

        {/* Action Button */}
        {!isHeld ? (
          <button
            type="button"
            onClick={handleFund}
            disabled={isProcessing}
            className="btn-primary w-full py-3.5 text-base justify-center rounded-2xl shadow-md"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                <span>Locking {formatINR(state.agreedAmount)} in Escrow...</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 mr-2" />
                <span>
                  {state.userRole === 'creator' ? 'Confirm Brand Escrow Deposit' : 'Fund Escrow'} (
                  {formatINR(state.agreedAmount)})
                </span>
              </>
            )}
          </button>
        ) : (
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-emerald-800 font-semibold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Funds locked in escrow vault: {formatINR(state.agreedAmount)}</span>
            </div>
            <span className="text-[13px] text-emerald-700 font-medium">Ready for post</span>
          </div>
        )}
      </div>

      {/* Proceed Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onProceed}
          disabled={!isHeld}
          title={!isHeld ? 'Fund escrow first' : undefined}
          className={`btn-primary w-full py-3.5 text-base justify-center rounded-2xl shadow-md ${
            !isHeld ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span>Proceed to Post Verification</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
        {!isHeld && (
          <p className="text-center text-[13px] text-stone-500 mt-2">
            Fund escrow first
          </p>
        )}
      </div>
    </div>
  );
}
