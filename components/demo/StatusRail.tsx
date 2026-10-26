'use client';

import React from 'react';
import { DemoState } from '@/lib/types';
import { REFEREE_CHECKS, CREATORS } from '@/lib/mockData';
import { formatINR } from '@/lib/format';
import { Shield, CheckCircle2, XCircle, Loader2, FileText, Lock, AlertTriangle } from 'lucide-react';

interface StatusRailProps {
  state: DemoState;
}

export function StatusRail({ state }: StatusRailProps) {
  const currentCreator = CREATORS.find((c) => c.id === state.creatorId) ?? CREATORS[0];

  // Trust score ring calculation
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (state.trustScore / 100) * circumference;
  const scoreColor =
    state.trustScore >= 80 ? '#024E46' : state.trustScore >= 60 ? '#D97706' : '#DC2626';

  return (
    <aside
      aria-label="Campaign live audit status"
      aria-live="polite"
      className="w-full space-y-4"
    >
      {/* Escrow Status Card */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#024E46]" />
            <h3 className="font-semibold text-stone-900 text-sm">Escrow Vault</h3>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[13px] font-medium capitalize ${
              state.escrow === 'held'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : state.escrow === 'released'
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : state.escrow === 'partial'
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-stone-100 text-stone-600 border border-stone-200'
            }`}
          >
            {state.escrow === 'held'
              ? 'Funds Locked'
              : state.escrow === 'released'
              ? 'Released'
              : state.escrow === 'partial'
              ? 'Partial Settlement'
              : 'Unfunded'}
          </span>
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[13px] text-stone-600">
            <span>Agreed Fee</span>
            <span className="font-semibold text-stone-900">
              {formatINR(state.agreedAmount)}
            </span>
          </div>
          {state.escrow === 'partial' ? (
            <>
              <div className="flex justify-between text-[13px] text-amber-700">
                <span>Creator Payout</span>
                <span className="font-semibold">{formatINR(state.payout.creator)}</span>
              </div>
              <div className="flex justify-between text-[13px] text-amber-700">
                <span>Brand Refund</span>
                <span className="font-semibold">{formatINR(state.payout.refund)}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between text-[13px] text-stone-500">
              <span>Security</span>
              <span>100% Protected</span>
            </div>
          )}
        </div>
      </div>

      {/* Trust Score Card */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#024E46]" />
            <h3 className="font-semibold text-stone-900 text-sm">Trust Score</h3>
          </div>
          <span className="text-[13px] text-stone-500">{currentCreator.name}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 76 76">
              <circle
                cx="38"
                cy="38"
                r={radius}
                stroke="#E5E7EB"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="38"
                cy="38"
                r={radius}
                stroke={scoreColor}
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <span className="absolute font-bold text-stone-900 text-sm">
              {state.trustScore}%
            </span>
          </div>
          <div className="text-[13px] space-y-1">
            <div className="text-stone-700">
              Audience Quality:{' '}
              <span className="font-medium text-stone-900">
                {currentCreator.realFollowerPct}% real
              </span>
            </div>
            <div className="text-stone-500">
              {state.verifiedDeliveries} verified deliveries
            </div>
          </div>
        </div>
      </div>

      {/* Smart Contract Clauses */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#024E46]" />
            <h3 className="font-semibold text-stone-900 text-sm">Agreement</h3>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[13px] font-medium ${
              state.contract === 'signed'
                ? 'bg-emerald-100 text-emerald-800'
                : state.contract === 'brand_signed'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            {state.contract === 'signed'
              ? 'Signed (Both)'
              : state.contract === 'brand_signed'
              ? 'Brand Signed'
              : 'Draft'}
          </span>
        </div>
        <ul className="space-y-1.5 text-[13px] text-stone-600 pt-1">
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#024E46]" />
            <span>1x Dedicated post ({state.platform})</span>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#024E46]" />
            <span>1 revision included max</span>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#024E46]" />
            <span>48h automated referee window</span>
          </li>
        </ul>
      </div>

      {/* AI Referee Verification Checks */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-stone-900 text-sm">AI Referee Checks</h3>
          <span className="text-[13px] text-stone-500">Automated</span>
        </div>
        <div className="space-y-2">
          {REFEREE_CHECKS.map((check) => {
            const result = state.checks[check.id];
            return (
              <div
                key={check.id}
                className="flex items-center justify-between text-[13px] py-1 border-b border-stone-100 last:border-0"
              >
                <span className="text-stone-700">{check.label}</span>
                <span className="flex items-center gap-1.5">
                  {result === 'idle' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-300" aria-label="Not run" />
                  )}
                  {result === 'running' && (
                    <Loader2 className="w-3.5 h-3.5 text-[#024E46] animate-spin" aria-label="Checking" />
                  )}
                  {result === 'pass' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-label="Passed" />
                  )}
                  {result === 'fail' && (
                    <XCircle className="w-4 h-4 text-red-600" aria-label="Failed" />
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rule Checker & Dispute Status */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-stone-600 font-medium">Rule Checker (#ad)</span>
          <span
            className={`font-semibold ${
              state.adLabelFixed ? 'text-emerald-700' : 'text-amber-600'
            }`}
          >
            {state.adLabelFixed ? 'Present' : 'Missing'}
          </span>
        </div>

        {state.dispute !== 'none' && (
          <div className="flex items-center justify-between text-[13px] pt-2 border-t border-stone-100">
            <span className="text-stone-600 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Dispute
            </span>
            <span className="font-semibold text-amber-700 capitalize">
              {state.dispute === 'open' ? 'Active (48h)' : `Resolved (${state.disputeOutcome})`}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
