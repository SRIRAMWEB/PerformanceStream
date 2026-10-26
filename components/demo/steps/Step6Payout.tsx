'use client';

import React from 'react';
import { DemoState } from '@/lib/types';
import { CREATORS } from '@/lib/mockData';
import { formatINR } from '@/lib/format';
import { TrustCard } from '@/components/demo/TrustCard';
import { CheckCircle2, RotateCcw, TrendingUp } from 'lucide-react';

interface Step6PayoutProps {
  state: DemoState;
  onReset: () => void;
}

export function Step6Payout({ state, onReset }: Step6PayoutProps) {
  const creator = CREATORS.find((c) => c.id === state.creatorId) ?? CREATORS[0];

  const isPartial = state.escrow === 'partial';
  const deltaBadge =
    state.disputeOutcome === null
      ? '+2 for on-time verified delivery'
      : state.disputeOutcome === 'reshoot'
      ? '+1 after verified re-shoot'
      : '+0 on partial settlement';

  return (
    <div className="space-y-6">
      <div className="text-center max-w-lg mx-auto space-y-2">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          {isPartial ? 'Escrow Settlement Released' : 'Instant Payout Released'}
        </h2>
        <p className="text-stone-600 text-sm">
          Funds disbursed instantaneously upon automated verification clearance.
        </p>
      </div>

      {/* Payout Receipt Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <span className="text-[13px] font-bold text-stone-500 uppercase tracking-wider">
            Escrow Settlement Receipt
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[13px] font-semibold bg-emerald-100 text-emerald-800">
            Transfer Complete
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-stone-600">
              {state.userRole === 'creator'
                ? 'Your Verified Earnings'
                : `Disbursed to Creator (${creator.name})`}
            </span>
            <span className="text-xl font-bold text-[#024E46]">
              {formatINR(state.payout.creator)}
            </span>
          </div>

          {isPartial && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-stone-600">Refunded to Brand Vault</span>
              <span className="text-xl font-bold text-amber-700">
                {formatINR(state.payout.refund)}
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-stone-100 flex justify-between text-[13px] text-stone-500">
            <span>Settlement Mode</span>
            <span>Zero-Delay Direct Escrow Release</span>
          </div>
        </div>
      </div>

      {/* Trust Score Delta Banner */}
      <div className="bg-[#024E46]/10 rounded-2xl p-4 border border-[#024E46]/20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#024E46] text-[#FAFADC] flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-stone-900 text-sm">
              Updated Trust Score: {state.trustScore}%
            </div>
            <div className="text-[13px] text-[#024E46] font-medium">{deltaBadge}</div>
          </div>
        </div>
        <span className="text-xs sm:text-[13px] font-semibold px-3 py-1 bg-white rounded-xl border border-[#024E46]/20 text-[#024E46]">
          {state.verifiedDeliveries} Verified Deliveries
        </span>
      </div>

      {/* Shareable Verified Card */}
      <TrustCard
        creator={creator}
        trustScore={state.trustScore}
        verifiedDeliveries={state.verifiedDeliveries}
      />

      {/* Restart Demo CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onReset}
          className="btn-primary w-full py-3.5 text-base justify-center rounded-2xl shadow-md"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          <span>Restart Interactive Demo</span>
        </button>
      </div>
    </div>
  );
}
