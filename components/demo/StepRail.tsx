'use client';

import React from 'react';
import { StepId } from '@/lib/types';
import { Check } from 'lucide-react';

interface StepItem {
  id: StepId;
  number: number;
  label: string;
  sub: string;
}

const STEP_ITEMS: StepItem[] = [
  { id: 'goal', number: 1, label: 'Goal & Budget', sub: 'Campaign parameters' },
  { id: 'match', number: 2, label: 'Verified Match', sub: 'Audience quality scan' },
  { id: 'agreement', number: 3, label: 'Smart Agreement', sub: 'Standardized terms' },
  { id: 'escrow', number: 4, label: 'Escrow Lock', sub: 'Funds held in trust' },
  { id: 'post', number: 5, label: 'AI Post Check', sub: 'Automated verification' },
  { id: 'payout', number: 6, label: 'Instant Payout', sub: 'Trust score update' },
];

interface StepRailProps {
  currentStep: StepId;
  onStepClick: (step: StepId) => void;
}

export function StepRail({ currentStep, onStepClick }: StepRailProps) {
  const currentIndex = STEP_ITEMS.findIndex((s) => s.id === currentStep);

  return (
    <nav aria-label="Demo steps progress" className="w-full">
      <ol className="space-y-2">
        {STEP_ITEMS.map((item, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          const content = (
            <div
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left w-full ${
                isCurrent
                  ? 'bg-[#024E46]/10 border border-[#024E46]/20 shadow-sm'
                  : isDone
                  ? 'hover:bg-[#024E46]/5 border border-transparent cursor-pointer'
                  : 'opacity-50 border border-transparent'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-[13px] shrink-0 transition-colors ${
                  isDone
                    ? 'bg-[#024E46] text-[#FAFADC]'
                    : isCurrent
                    ? 'bg-[#024E46] text-[#FAFADC] ring-4 ring-[#024E46]/15'
                    : 'bg-stone-200/80 text-stone-600'
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                ) : (
                  <span>{item.number}</span>
                )}
              </div>
              <div className="min-w-0">
                <div
                  className={`text-[13px] sm:text-sm font-semibold truncate ${
                    isCurrent ? 'text-[#024E46]' : isDone ? 'text-stone-900' : 'text-stone-500'
                  }`}
                >
                  {item.label}
                </div>
                <div className="text-[13px] text-stone-500 truncate hidden xl:block">
                  {item.sub}
                </div>
              </div>
            </div>
          );

          return (
            <li key={item.id} className="relative">
              {isDone ? (
                <button
                  type="button"
                  onClick={() => onStepClick(item.id)}
                  aria-label={`Go back to step ${item.number}: ${item.label}`}
                  className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#024E46] rounded-xl"
                >
                  {content}
                </button>
              ) : isCurrent ? (
                <div aria-current="step">{content}</div>
              ) : (
                <div aria-disabled="true">{content}</div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
