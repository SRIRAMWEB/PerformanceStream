'use client';

import React, { useEffect } from 'react';
import { DemoState } from '@/lib/types';
import { CREATORS, calculateAgreedAmount } from '@/lib/mockData';
import { formatINR } from '@/lib/format';
import { ShieldCheck, AlertTriangle, ArrowRight, Check, ScanLine } from 'lucide-react';

interface Step2MatchProps {
  state: DemoState;
  onScanDone: () => void;
  onSelectCreator: (id: string) => void;
  onProceed: () => void;
}

export function Step2Match({
  state,
  onScanDone,
  onSelectCreator,
  onProceed,
}: Step2MatchProps) {
  useEffect(() => {
    if (state.isScanningMatch) {
      const timer = setTimeout(() => {
        onScanDone();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.isScanningMatch, onScanDone]);

  if (state.isScanningMatch) {
    return (
      <div className="py-12 px-6 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-[#024E46]/10 text-[#024E46] flex items-center justify-center animate-pulse">
          <ScanLine className="w-8 h-8 animate-bounce" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-stone-900">
            Scanning Creator Network
          </h3>
          <p className="text-stone-600 text-sm max-w-md mx-auto">
            Analysing audience quality and bot ratio against {state.platform} graph data...
          </p>
        </div>
        <div className="w-full max-w-md mx-auto bg-stone-200 h-2 rounded-full overflow-hidden">
          <div className="bg-[#024E46] h-full rounded-full animate-[shimmer_1.5s_infinite] w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Verified Creator Matches
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            Audited for real follower ratio, content fit, and verified delivery history.
          </p>
        </div>
        <span className="self-start sm:self-auto px-3 py-1 rounded-full text-[13px] font-medium bg-stone-100 text-stone-600 border border-stone-200">
          Sample creators
        </span>
      </div>

      <div className="space-y-3">
        {CREATORS.map((creator) => {
          const isSelected = state.creatorId === creator.id;
          const fee = calculateAgreedAmount(state.budget, creator.rateFactor);
          const isHighRisk = creator.realFollowerPct < 60;

          return (
            <div
              key={creator.id}
              onClick={() => onSelectCreator(creator.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                isSelected
                  ? 'border-[#024E46] bg-[#024E46]/5 ring-2 ring-[#024E46]/20 shadow-sm'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Creator Profile */}
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 ${
                      isHighRisk
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-[#024E46] text-[#FAFADC]'
                    }`}
                  >
                    {creator.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-stone-900 text-base">{creator.name}</h3>
                      <span className="text-[13px] text-stone-500 font-medium">
                        {creator.handle}
                      </span>
                    </div>
                    <div className="text-[13px] text-stone-600 mt-0.5">
                      {creator.niche} &bull; {creator.platform}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[13px]">
                      <span className="text-stone-600">
                        <strong className="text-stone-900">{creator.followerCount}</strong> followers
                      </span>
                      <span className="text-stone-600">
                        <strong className="text-stone-900">{creator.engagement}</strong> engagement
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          isHighRisk ? 'text-amber-700' : 'text-emerald-700'
                        }`}
                      >
                        {isHighRisk ? (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        )}
                        <span>{creator.realFollowerPct}% real</span>
                      </span>
                      {creator.flaggedPct && (
                        <span className="text-red-700 font-medium">
                          ({creator.flaggedPct}% bot ratio)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Match & Rate Column */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <div className="text-left sm:text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[13px] font-bold mb-1 ${
                        creator.matchPct >= 90
                          ? 'bg-emerald-100 text-emerald-800'
                          : creator.matchPct >= 80
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {creator.matchPct}% Match
                    </span>
                    <div className="text-base font-bold text-stone-900">
                      {formatINR(fee)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCreator(creator.id);
                    }}
                    className={`mt-2 px-4 py-1.5 rounded-xl text-[13px] font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#024E46] text-[#FAFADC]'
                        : 'border border-stone-200 text-stone-700 hover:border-stone-400 bg-white'
                    }`}
                  >
                    {isSelected ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Selected
                      </span>
                    ) : (
                      'Select'
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onProceed}
          className="btn-primary w-full py-3.5 text-base justify-center rounded-2xl shadow-md"
        >
          <span>Generate Smart Agreement</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
}
