'use client';

import React from 'react';
import { CardFooter } from './CardFooter';
import { SCENARIO_PRESETS } from '../../src/lib/gate';

interface ScenarioCardProps {
  activeScenarioId: string | null;
  isRunning: boolean;
  narration: {
    actor: 'Sensor' | 'Attacker' | 'System';
    caption: string;
  } | null;
  onRunScenario: (scenarioId: string) => void;
  onLearnMore?: () => void;
}

export function ScenarioCard({
  activeScenarioId,
  isRunning,
  narration,
  onRunScenario,
  onLearnMore,
}: ScenarioCardProps) {
  const getActorBorder = (actor?: 'Sensor' | 'Attacker' | 'System') => {
    switch (actor) {
      case 'Attacker':
        return 'border-l-[3px] border-l-[#EF4544]';
      case 'System':
        return 'border-l-[3px] border-l-[#23C45F]';
      case 'Sensor':
      default:
        return 'border-l-[3px] border-l-[var(--ps-ink,#1D1A1A)]';
    }
  };

  return (
    <div className="bg-white dark:bg-[#1C1917] rounded-[20px] border border-[#EBEAEB] dark:border-[#2E2A27] p-6 pb-5 flex flex-col h-[443px] overflow-hidden shadow-sm relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--ps-panel-border,#F1F1F1)]">
        <div>
          <h3 className="text-[16px] font-[600] text-[var(--ps-ink,#1D1A1A)]">
            Scenarios
          </h3>
          <span className="text-[11px] font-mono text-[#888888]">1 normal · 6 attacks</span>
        </div>
        <span className="text-[11px] font-mono font-[600] text-[#888888]">
          {isRunning ? 'RUNNING...' : 'READY'}
        </span>
      </div>

      {/* List of 7 Scenarios */}
      <div className="flex-1 overflow-y-auto py-2 space-y-1.5 pr-1">
        {SCENARIO_PRESETS.map((sc) => {
          const isActive = activeScenarioId === sc.id;
          return (
            <div
              key={sc.id}
              className={`p-2 rounded-xl border transition-all flex items-center justify-between gap-2 text-left ${
                isActive
                  ? 'border-[var(--ps-ink,#1D1A1A)] dark:border-[#F5F0E8] ring-1 ring-[var(--ps-ink,#1D1A1A)] bg-[#FFFFFF] dark:bg-[#25221F]'
                  : 'border-[#F1F1F1] dark:border-[#2F2925] bg-[#F9F8F8] dark:bg-[#23201D] hover:border-[#EBEAEB]'
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                {/* SVG Icon */}
                <div className="w-6 h-6 rounded-md bg-white dark:bg-[#1C1917] border border-[#EBEAEB] dark:border-[#2E2A27] flex items-center justify-center shrink-0">
                  {sc.type === 'normal' ? (
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-[#23C45F]">
                      <path d="M13.333 4L6 11.333 2.667 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-[#EF4544]">
                      <path d="M8 1.333L1.333 13.333h13.334L8 1.333zM8 6v3.333M8 11.333h.007" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-[600] text-[var(--ps-ink,#1D1A1A)] truncate">
                      {sc.name}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                        sc.type === 'normal'
                          ? 'bg-[#F1FDF4] text-[#16A24B]'
                          : 'bg-[#FEF2F2] text-[#DC2626]'
                      }`}
                    >
                      {sc.type === 'normal' ? 'Normal' : 'Attack'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#656565] dark:text-[#A8A29E] truncate">
                    {sc.description}
                  </p>
                </div>
              </div>

              {/* Run Button */}
              <button
                type="button"
                disabled={isRunning}
                onClick={() => onRunScenario(sc.id)}
                className={`px-2.5 py-1 text-[11px] font-mono font-[600] rounded-md transition-all shrink-0 ${
                  isRunning
                    ? 'opacity-40 cursor-not-allowed bg-transparent text-[#888888] border border-[#E5E7EB]'
                    : 'bg-[var(--ps-ink,#1D1A1A)] text-white hover:opacity-90 active:scale-95'
                }`}
              >
                Run
              </button>
            </div>
          );
        })}
      </div>

      {/* Pinned Narration Box */}
      <div
        className={`bg-[#F9F8F8] dark:bg-[#23201D] border border-[#F1F1F1] dark:border-[#2F2925] rounded-lg p-2.5 my-1 text-[11px] font-mono transition-all ${getActorBorder(
          narration?.actor
        )}`}
      >
        <div className="flex items-center gap-1.5 font-[700] text-[10px] uppercase tracking-wider text-[#888888] mb-0.5">
          <span>Actor:</span>
          <span
            className={
              narration?.actor === 'Attacker'
                ? 'text-[#DC2626]'
                : narration?.actor === 'System'
                ? 'text-[#16A24B]'
                : 'text-[var(--ps-ink,#1D1A1A)]'
            }
          >
            {narration ? narration.actor : 'Pipeline standby'}
          </span>
        </div>
        <p className="text-[var(--ps-ink,#1D1A1A)] line-clamp-2 leading-relaxed">
          {narration ? narration.caption : 'Select a scenario or trigger “Play all attacks” to begin simulation.'}
        </p>
      </div>

      {/* Footer */}
      <CardFooter
        title="Attack simulator"
        description="Six ways to fool a pipeline, one gate that stops them."
        linkText="Learn more"
        onLinkClick={onLearnMore}
      />
    </div>
  );
}
