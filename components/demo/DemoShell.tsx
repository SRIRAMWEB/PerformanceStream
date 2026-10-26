'use client';

import React, { useReducer, useState, useEffect, useRef } from 'react';
import { demoReducer, makeInitialState } from '@/lib/demoReducer';
import { formatINR } from '@/lib/format';
import { StepRail } from './StepRail';
import { StatusRail } from './StatusRail';
import { RiskModal } from './RiskModal';
import { BackConfirmModal } from './BackConfirmModal';
import { Step1Goal } from './steps/Step1Goal';
import { Step2Match } from './steps/Step2Match';
import { Step3Agreement } from './steps/Step3Agreement';
import { Step4Escrow } from './steps/Step4Escrow';
import { Step5PostCheck } from './steps/Step5PostCheck';
import { Step6Payout } from './steps/Step6Payout';
import { RotateCcw, Sparkles, SlidersHorizontal, CheckCircle2 } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
}

export default function DemoShell() {
  const [state, dispatch] = useReducer(demoReducer, undefined, makeInitialState);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showMobileStatus, setShowMobileStatus] = useState(false);

  // Track previous states to avoid duplicate toasts
  const prevStateRef = useRef(state);

  const addToast = (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  useEffect(() => {
    const prev = prevStateRef.current;

    // Toast 1: Agreement signed
    if (prev.contract !== 'signed' && state.contract === 'signed') {
      addToast('Agreement signed by both parties');
    }

    // Toast 2: Escrow funded
    if (prev.escrow !== 'held' && state.escrow === 'held') {
      addToast(`Escrow funded: ${formatINR(state.agreedAmount)} held`);
    }

    // Toast 3: Ad label added
    if (!prev.adLabelFixed && state.adLabelFixed) {
      addToast('Ad label added');
    }

    // Toast 4: Post verified / payout released
    if (prev.step !== 'payout' && state.step === 'payout') {
      addToast('Post verified: payout released');
    }

    // Toast 5: Dispute opened
    if (prev.dispute === 'none' && state.dispute === 'open') {
      addToast('Dispute opened: resolution in 48h');
    }

    prevStateRef.current = state;
  }, [state]);

  return (
    <section
      id="demo"
      className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-y border-stone-200/60 bg-[#FAFADC]/30"
      aria-label="ProofReach Studio interactive demo"
    >
      <div className="max-w-7xl mx-auto">
        {/* Studio Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-1 rounded-full text-[13px] font-bold bg-[#024E46]/10 text-[#024E46] border border-[#024E46]/20">
                Interactive Studio
              </span>
              <span className="text-[13px] text-stone-500 font-medium">
                Live State Machine
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight">
              ProofReach Studio
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Experience end-to-end verified creator collaboration with real escrow simulation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Role indicator / selector */}
            <div className="flex items-center p-1 rounded-xl bg-white border border-stone-200 shadow-sm">
              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_USER_ROLE', role: 'brand' })}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                  state.userRole === 'brand'
                    ? 'bg-[#024E46] text-[#FAFADC] shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Brand Mode
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_USER_ROLE', role: 'creator' })}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                  state.userRole === 'creator'
                    ? 'bg-[#024E46] text-[#FAFADC] shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Creator Mode
              </button>
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={() => dispatch({ type: 'RESET' })}
              aria-label="Reset demo to start"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 hover:border-stone-300 text-stone-700 text-[13px] font-semibold shadow-sm transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>

        {/* Mobile Status Toggle Button */}
        <div className="lg:hidden mb-6">
          <button
            type="button"
            onClick={() => setShowMobileStatus((prev) => !prev)}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-stone-200 text-stone-800 text-sm font-semibold shadow-sm"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#024E46]" />
              <span>{showMobileStatus ? 'Hide Live Audit Rail' : 'View Live Audit Rail'}</span>
            </span>
            <span className="text-[13px] text-[#024E46] font-bold">
              Escrow: {formatINR(state.agreedAmount)}
            </span>
          </button>

          {showMobileStatus && (
            <div className="mt-4 p-4 bg-white rounded-3xl border border-stone-200 shadow-md animate-in fade-in duration-200">
              <StatusRail state={state} />
            </div>
          )}
        </div>

        {/* Main 3-Column Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_300px] gap-6 xl:gap-8 items-start">
          {/* Column 1: Step Rail */}
          <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-sm hidden lg:block sticky top-24">
            <div className="text-[13px] font-bold uppercase tracking-wider text-stone-500 mb-3 px-3">
              Workflow Steps
            </div>
            <StepRail
              currentStep={state.step}
              onStepClick={(targetStep) =>
                dispatch({ type: 'REQUEST_BACK', step: targetStep })
              }
            />
          </div>

          {/* Column 2: Active Step Content Panel */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm min-h-[580px]">
            {state.step === 'goal' && (
              <Step1Goal
                state={state}
                onSetProduct={(id) => dispatch({ type: 'SET_PRODUCT', productId: id })}
                onSetBudget={(b) => dispatch({ type: 'SET_BUDGET', budget: b })}
                onSetPlatform={(p) => dispatch({ type: 'SET_PLATFORM', platform: p })}
                onSetCity={(c) => dispatch({ type: 'SET_CITY', city: c })}
                onSetObjective={(o) => dispatch({ type: 'SET_OBJECTIVE', objective: o })}
                onFindCreators={() => dispatch({ type: 'START_MATCH_SCAN' })}
              />
            )}

            {state.step === 'match' && (
              <Step2Match
                state={state}
                onScanDone={() => dispatch({ type: 'MATCH_SCAN_DONE' })}
                onSelectCreator={(id) => dispatch({ type: 'SELECT_CREATOR', creatorId: id })}
                onProceed={() => dispatch({ type: 'GO_TO_STEP', step: 'agreement' })}
              />
            )}

            {state.step === 'agreement' && (
              <Step3Agreement
                state={state}
                onBrandSign={() => dispatch({ type: 'BRAND_SIGN' })}
                onCreatorSign={() => dispatch({ type: 'CREATOR_SIGN' })}
                onProceed={() => dispatch({ type: 'GO_TO_STEP', step: 'escrow' })}
              />
            )}

            {state.step === 'escrow' && (
              <Step4Escrow
                state={state}
                onFundEscrow={() => dispatch({ type: 'FUND_ESCROW' })}
                onProceed={() => dispatch({ type: 'ESCROW_HELD' })}
              />
            )}

            {state.step === 'post' && (
              <Step5PostCheck
                state={state}
                onFixAdLabel={() => dispatch({ type: 'FIX_AD_LABEL' })}
                onSetSimulateFailure={(val) =>
                  dispatch({ type: 'SET_SIMULATE_FAILURE', value: val })
                }
                onStartChecks={() => dispatch({ type: 'START_CHECKS' })}
                onSetCheck={(id, result) =>
                  dispatch({ type: 'SET_CHECK', id, result })
                }
                onChecksComplete={() => dispatch({ type: 'CHECKS_COMPLETE' })}
                onOpenDispute={() => dispatch({ type: 'OPEN_DISPUTE' })}
                onResolvePartial={() => dispatch({ type: 'RESOLVE_PARTIAL' })}
                onResolveReshoot={() => dispatch({ type: 'RESOLVE_RESHOOT' })}
                onReleasePayout={() => dispatch({ type: 'RELEASE_PAYOUT' })}
              />
            )}

            {state.step === 'payout' && (
              <Step6Payout
                state={state}
                onReset={() => dispatch({ type: 'RESET' })}
              />
            )}
          </div>

          {/* Column 3: Live Status Rail */}
          <div className="hidden lg:block sticky top-24">
            <StatusRail state={state} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <RiskModal
        isOpen={state.highRiskModalOpen}
        onDismiss={() => dispatch({ type: 'DISMISS_RISK_MODAL' })}
        onContinue={() => dispatch({ type: 'CONTINUE_WITH_RISK' })}
      />

      <BackConfirmModal
        isOpen={state.backConfirmModalOpen}
        onConfirm={() => dispatch({ type: 'CONFIRM_BACK' })}
        onCancel={() => dispatch({ type: 'CANCEL_BACK' })}
      />

      {/* Floating Toast Notification Container */}
      <div
        aria-live="assertive"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-stone-900 text-[#FAFADC] shadow-2xl text-[13px] font-medium border border-stone-700 animate-in slide-in-from-bottom-2 duration-200 pointer-events-auto"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
