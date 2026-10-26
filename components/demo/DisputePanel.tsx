'use client';

import React, { useState } from 'react';
import { DemoState, CheckId } from '@/lib/types';
import { REFEREE_CHECKS } from '@/lib/mockData';
import { formatINR } from '@/lib/format';
import { AlertTriangle, Clock, RefreshCw, CheckCircle2, ShieldCheck, Scale } from 'lucide-react';

interface DisputePanelProps {
  state: DemoState;
  onResolvePartial: () => void;
  onResolveReshoot: () => void;
  onProceedToPayout: () => void;
}

export function DisputePanel({
  state,
  onResolvePartial,
  onResolveReshoot,
  onProceedToPayout,
}: DisputePanelProps) {
  const [isReshooting, setIsReshooting] = useState(false);

  // Find failing checks
  const failingChecks = REFEREE_CHECKS.filter(
    (c) => state.checks[c.id] === 'fail'
  );

  const halfPayout = Math.round(state.agreedAmount / 2);

  const handleReshootClick = () => {
    setIsReshooting(true);
    setTimeout(() => {
      onResolveReshoot();
      setIsReshooting(false);
    }, 600);
  };

  return (
    <div className="bg-amber-50/60 rounded-3xl p-6 border border-amber-200 mt-6 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
            <Scale className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-base">
              Referee Dispute Protocol
            </h3>
            <div className="flex items-center gap-1.5 text-[13px] text-amber-800 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>48h automated arbitration window active</span>
            </div>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-[13px] font-semibold bg-amber-200/80 text-amber-900 border border-amber-300">
          Dispute Active
        </span>
      </div>

      {/* Audit Evidence Summary */}
      <div className="bg-white rounded-2xl p-4 border border-amber-200/80 mb-5">
        <h4 className="text-[13px] font-bold uppercase tracking-wider text-stone-500 mb-2">
          Audit Evidence Summary
        </h4>
        <div className="space-y-2">
          {failingChecks.length > 0 ? (
            failingChecks.map((check) => (
              <div
                key={check.id}
                className="flex items-start gap-2.5 text-sm p-2 rounded-lg bg-red-50/60 border border-red-100"
              >
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-900">{check.label}: </span>
                  <span className="text-red-700">{check.failReason}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-stone-600">
              Previous flags cleared through updated media submission.
            </p>
          )}
        </div>
      </div>

      {/* Resolution Actions */}
      {state.disputeOutcome === null ? (
        <div className="space-y-3">
          <p className="text-sm text-stone-700 font-medium">
            Select a resolution to settle escrow:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#024E46] transition-colors flex flex-col justify-between">
              <div>
                <h5 className="font-bold text-stone-900 text-sm mb-1">
                  Accept 50% Partial Payout
                </h5>
                <p className="text-[13px] text-stone-600 mb-3">
                  Releases {formatINR(halfPayout)} to creator and refunds {formatINR(halfPayout)} to brand immediately.
                </p>
              </div>
              <button
                type="button"
                onClick={onResolvePartial}
                className="btn-primary w-full py-2.5 text-[13px] justify-center rounded-xl bg-stone-800 hover:bg-stone-900"
              >
                Accept 50% Settlement
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#024E46] transition-colors flex flex-col justify-between">
              <div>
                <h5 className="font-bold text-stone-900 text-sm mb-1">
                  Request 24h Re-shoot
                </h5>
                <p className="text-[13px] text-stone-600 mb-3">
                  Allows creator 24 hours to re-shoot and correct the flagged deliverable criteria.
                </p>
              </div>
              <button
                type="button"
                disabled={isReshooting}
                onClick={handleReshootClick}
                className="btn-primary w-full py-2.5 text-[13px] justify-center rounded-xl"
              >
                {isReshooting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
                    Re-verifying post...
                  </>
                ) : (
                  'Request 24h Re-shoot'
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
            <div>
              <h5 className="font-bold text-stone-900 text-sm">
                Dispute Resolved ({state.disputeOutcome === 'partial' ? '50% Settlement' : 'Re-shoot Approved'})
              </h5>
              <p className="text-[13px] text-stone-600">
                {state.disputeOutcome === 'partial'
                  ? `Split payout calculated: Creator ${formatINR(state.payout.creator)}, Refund ${formatINR(state.payout.refund)}.`
                  : 'Re-shot media submitted and approved by automated referee.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onProceedToPayout}
            className="btn-primary py-2.5 px-5 text-sm shrink-0 rounded-xl"
          >
            Proceed to Payout
          </button>
        </div>
      )}
    </div>
  );
}
