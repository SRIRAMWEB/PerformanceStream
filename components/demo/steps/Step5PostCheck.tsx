'use client';

import React, { useState } from 'react';
import { DemoState, CheckId, CheckResult } from '@/lib/types';
import { REFEREE_CHECKS } from '@/lib/mockData';
import { DisputePanel } from '@/components/demo/DisputePanel';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Play,
  ArrowRight,
  ShieldCheck,
  Wand2,
} from 'lucide-react';

interface Step5PostCheckProps {
  state: DemoState;
  onFixAdLabel: () => void;
  onSetSimulateFailure: (val: boolean) => void;
  onStartChecks: () => void;
  onSetCheck: (id: CheckId, result: CheckResult) => void;
  onChecksComplete: () => void;
  onOpenDispute: () => void;
  onResolvePartial: () => void;
  onResolveReshoot: () => void;
  onReleasePayout: () => void;
}

export function Step5PostCheck({
  state,
  onFixAdLabel,
  onSetSimulateFailure,
  onStartChecks,
  onSetCheck,
  onChecksComplete,
  onOpenDispute,
  onResolvePartial,
  onResolveReshoot,
  onReleasePayout,
}: Step5PostCheckProps) {
  const [isRunning, setIsRunning] = useState(false);

  const runAllChecks = async () => {
    setIsRunning(true);
    onStartChecks();

    const checkList = [...REFEREE_CHECKS];

    for (let i = 0; i < checkList.length; i++) {
      const check = checkList[i];
      onSetCheck(check.id, 'running');

      await new Promise((res) => setTimeout(res, 450));

      let result: CheckResult = 'pass';
      if (check.id === 'product' && state.simulateFailure) {
        result = 'fail';
      } else if (check.id === 'adlabel' && !state.adLabelFixed) {
        result = 'fail';
      } else if (check.id === 'engagement' && state.creatorId === 'creator-meera') {
        result = 'fail';
      }

      onSetCheck(check.id, result);
    }

    onChecksComplete();
    setIsRunning(false);
  };

  const hasRunChecks = Object.values(state.checks).some((r) => r !== 'idle');
  const hasFailures = Object.values(state.checks).some((r) => r === 'fail');
  const allPassed = hasRunChecks && !hasFailures;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            AI Referee Post Verification
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            Automated compliance scan testing live status, visual presence, ad labels, and audience authenticity.
          </p>
        </div>
        <span className="self-start sm:self-auto px-3 py-1 rounded-full text-[13px] font-medium bg-stone-100 text-stone-600 border border-stone-200">
          Simulated AI checks
        </span>
      </div>

      {/* Rule Checker / Caption Review */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-stone-900 text-sm">Draft Post Caption</h3>
            <span
              className={`px-2 py-0.5 rounded-full text-[13px] font-semibold ${
                state.adLabelFixed
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {state.adLabelFixed ? '#ad verified' : '#ad missing'}
            </span>
          </div>

          {!state.adLabelFixed && (
            <button
              type="button"
              onClick={onFixAdLabel}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#024E46] text-[#FAFADC] text-[13px] font-semibold hover:bg-[#024E46]/90 transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Fix it (Add #ad)</span>
            </button>
          )}
        </div>

        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 font-mono text-[13px] text-stone-800 leading-relaxed">
          {state.caption}
        </div>
      </div>

      {/* Simulation Toggle */}
      <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex items-center justify-between gap-4">
        <div>
          <label htmlFor="sim-fail-toggle" className="text-sm font-semibold text-stone-900 block">
            Simulate failed delivery (Product not visible)
          </label>
          <span className="text-[13px] text-stone-500">
            Tests dispute resolution flow by simulating a video without clear product presence in first 3s
          </span>
        </div>
        <input
          id="sim-fail-toggle"
          type="checkbox"
          checked={state.simulateFailure}
          onChange={(e) => onSetSimulateFailure(e.target.checked)}
          className="w-5 h-5 rounded text-[#024E46] focus:ring-[#024E46] accent-[#024E46] cursor-pointer"
        />
      </div>

      {/* Run Verification Button */}
      {!hasRunChecks && (
        <button
          type="button"
          onClick={runAllChecks}
          disabled={isRunning}
          className="btn-primary w-full py-3.5 text-base justify-center rounded-2xl shadow-md"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              <span>Running AI Referee Checks...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              <span>Submit Post for Verification</span>
            </>
          )}
        </button>
      )}

      {/* Verification Checks Grid */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="font-bold text-stone-900 text-sm">Referee Verification Audit</h3>
          <span className="text-[13px] text-stone-500">5-point automated check</span>
        </div>

        <div className="space-y-2.5">
          {REFEREE_CHECKS.map((check) => {
            const result = state.checks[check.id];
            return (
              <div
                key={check.id}
                className="flex items-center justify-between p-3 rounded-xl bg-stone-50/80 border border-stone-200 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 flex items-center justify-center">
                    {result === 'idle' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                    )}
                    {result === 'running' && (
                      <Loader2 className="w-4 h-4 text-[#024E46] animate-spin" />
                    )}
                    {result === 'pass' && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                    {result === 'fail' && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </span>
                  <span className="font-medium text-stone-800">{check.label}</span>
                </div>

                <div className="text-[13px] font-semibold">
                  {result === 'idle' && <span className="text-stone-400">Pending</span>}
                  {result === 'running' && (
                    <span className="text-[#024E46]">Analyzing...</span>
                  )}
                  {result === 'pass' && (
                    <span className="text-emerald-700">Verified</span>
                  )}
                  {result === 'fail' && (
                    <span className="text-red-700">Flagged</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Outcome Banners */}
      {allPassed && (
        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-700 shrink-0" />
            <div>
              <h4 className="font-bold text-stone-900 text-base">
                All 5 checks passed! Post verified.
              </h4>
              <p className="text-[13px] text-stone-600">
                Deliverable strictly complies with SLA criteria. Escrow funds ready for instant release.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onReleasePayout}
            className="btn-primary py-3 px-6 text-sm shrink-0 rounded-xl shadow-md"
          >
            <span>Release Escrow Payout</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>
      )}

      {hasFailures && state.dispute === 'none' && (
        <div className="bg-red-50 rounded-2xl p-5 border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-600 shrink-0" />
            <div>
              <h4 className="font-bold text-stone-900 text-base">
                Compliance Flag Detected
              </h4>
              <p className="text-[13px] text-red-700">
                Deliverable failed automated check criteria. Open dispute for 48h arbitration or re-shoot.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenDispute}
            className="btn-primary py-3 px-6 text-sm shrink-0 rounded-xl bg-red-700 hover:bg-red-800"
          >
            <span>Open Dispute</span>
          </button>
        </div>
      )}

      {/* Dispute Protocol Panel */}
      {state.dispute !== 'none' && (
        <DisputePanel
          state={state}
          onResolvePartial={onResolvePartial}
          onResolveReshoot={onResolveReshoot}
          onProceedToPayout={onReleasePayout}
        />
      )}
    </div>
  );
}
