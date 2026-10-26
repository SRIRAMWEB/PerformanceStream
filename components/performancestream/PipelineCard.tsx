'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from './Badge';
import { CardFooter } from './CardFooter';
import { CHECK_DEFINITIONS } from '../../src/lib/gate';

export interface CheckStatus {
  state: 'idle' | 'checking' | 'pass' | 'fail' | 'flag' | 'skipped';
  resultText?: string;
}

export interface ReadingPoint {
  seq: number;
  hr: number;
  outcome: 'TRUSTED' | 'QUARANTINED' | 'REJECTED';
  timestamp?: number;
}

interface PipelineCardProps {
  verdict: 'IDLE' | 'CHECKING' | 'ACCEPTED' | 'QUARANTINED' | 'REJECTED';
  verdictText: string;
  activeCheckIndex: number; // 0 to 4, or -1
  checkStatuses: CheckStatus[];
  readings: ReadingPoint[];
  onLearnMore?: () => void;
}

export function PipelineCard({
  verdict,
  verdictText,
  activeCheckIndex,
  checkStatuses,
  readings,
  onLearnMore,
}: PipelineCardProps) {
  // SVG Graph calculations
  const graphWidth = 580;
  const graphHeight = 160;
  const padLeft = 35;
  const padRight = 20;
  const padTop = 16;
  const padBottom = 24;
  const plotW = graphWidth - padLeft - padRight;
  const plotH = graphHeight - padTop - padBottom;

  const yForHr = (hr: number) => {
    // clamp for visual plotting between 30 and 260
    const clamped = Math.max(30, Math.min(260, hr));
    return padTop + ((260 - clamped) / (260 - 30)) * plotH;
  };

  // Slice last 10 readings for graph window
  const windowReadings = readings.slice(-10);
  const xForIndex = (idx: number, total: number) => {
    if (total <= 1) return padLeft + plotW / 2;
    return padLeft + (idx / (total - 1)) * plotW;
  };

  // Build continuous path for accepted readings
  const acceptedReadings = windowReadings.map((r, i) => ({
    ...r,
    x: xForIndex(i, windowReadings.length),
    y: yForHr(r.hr),
  }));

  const linePoints = acceptedReadings
    .filter((r) => r.outcome === 'TRUSTED')
    .map((r) => `${r.x},${r.y}`);
  const polylinePath = linePoints.length > 1 ? `M ${linePoints.join(' L ')}` : '';

  const getVerdictBadge = () => {
    switch (verdict) {
      case 'ACCEPTED':
        return <Badge variant="trusted" isStamp>ACCEPTED</Badge>;
      case 'QUARANTINED':
        return <Badge variant="quarantined" isStamp>QUARANTINED</Badge>;
      case 'REJECTED':
        return <Badge variant="rejected" isStamp>REJECTED</Badge>;
      case 'CHECKING':
        return <Badge variant="checking">EVALUATING</Badge>;
      default:
        return <Badge variant="idle">STANDBY</Badge>;
    }
  };

  return (
    <div className="bg-white dark:bg-[#1C1917] rounded-[20px] border border-[#EBEAEB] dark:border-[#2E2A27] p-6 pb-5 flex flex-col h-[443px] overflow-hidden shadow-sm">
      {/* Top row */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--ps-panel-border,#F1F1F1)]">
        <div>
          <span className="block text-[11px] font-[600] font-mono tracking-wider uppercase text-[#888888] dark:text-[#A8A29E]">
            Pipeline status
          </span>
          <p className="text-[14px] font-[500] text-[var(--ps-ink,#1D1A1A)] mt-0.5 truncate max-w-[420px]">
            {verdictText || 'Standby: awaiting incoming telemetry packet'}
          </p>
        </div>
        <div>{getVerdictBadge()}</div>
      </div>

      {/* Chain of 5 Connected Nodes */}
      <div className="pt-3 pb-2">
        <div className="grid grid-cols-5 gap-1.5 md:gap-2 relative">
          {CHECK_DEFINITIONS.map((def, idx) => {
            const status = checkStatuses[idx] || { state: 'idle' };
            const isActive = activeCheckIndex === idx;

            let borderClass = 'border-[#EBEAEB] dark:border-[#2E2A27]';
            let bgClass = 'bg-[#F9F8F8] dark:bg-[#23201D] text-[#656565] dark:text-[#A8A29E]';
            let dotColor = '#9CA3AF';

            if (status.state === 'pass') {
              borderClass = 'border-[var(--ps-trusted,#23C45F)]';
              bgClass = 'bg-[var(--ps-trusted-bg,#F1FDF4)] text-[var(--ps-trusted-text,#16A24B)]';
              dotColor = '#23C45F';
            } else if (status.state === 'fail') {
              borderClass = 'border-[var(--ps-reject,#EF4544)]';
              bgClass = 'bg-[var(--ps-reject-bg,#FEF2F2)] text-[var(--ps-reject-text,#DC2626)]';
              dotColor = '#EF4544';
            } else if (status.state === 'flag') {
              borderClass = 'border-[var(--ps-quarantine,#F87317)]';
              bgClass = 'bg-[var(--ps-quarantine-bg,#FFF7ED)] text-[var(--ps-quarantine-text,#C25E09)]';
              dotColor = '#F87317';
            } else if (status.state === 'checking') {
              borderClass = 'border-[var(--ps-ink,#1D1A1A)] ring-1 ring-[var(--ps-ink,#1D1A1A)]';
              bgClass = 'bg-[#FFFFFF] dark:bg-[#2A2624] text-[var(--ps-ink,#1D1A1A)]';
              dotColor = '#1D1A1A';
            } else if (status.state === 'skipped') {
              bgClass = 'bg-[#F9F8F8]/40 dark:bg-[#23201D]/40 text-[#A0A0A0] opacity-50';
            }

            return (
              <div key={def.id} className="relative flex flex-col items-center text-center">
                {/* Node Box */}
                <div
                  className={`w-full min-h-[58px] rounded-lg border p-1.5 flex flex-col justify-between transition-all duration-300 ${borderClass} ${bgClass}`}
                >
                  <div className="flex items-center justify-between text-[11px] font-[600] font-mono leading-none">
                    <span className="truncate">{def.title}</span>
                    <span
                      className="w-2 h-2 rounded-full shrink-0 ml-1 transition-colors"
                      style={{ backgroundColor: dotColor }}
                    />
                  </div>
                  <div className="text-[10px] text-left leading-tight opacity-80 mt-1 line-clamp-1">
                    {def.question}
                  </div>
                </div>

                {/* Result text */}
                <div className="h-[28px] mt-1 text-[10px] font-mono leading-tight flex items-start justify-center text-center px-0.5 overflow-hidden">
                  {status.state === 'checking' ? (
                    <span className="text-[var(--ps-ink,#1D1A1A)] font-bold animate-pulse">
                      evaluating...
                    </span>
                  ) : status.resultText ? (
                    <span
                      className={`truncate ${
                        status.state === 'pass'
                          ? 'text-[var(--ps-trusted-text,#16A24B)]'
                          : status.state === 'fail'
                          ? 'text-[var(--ps-reject-text,#DC2626)] font-semibold'
                          : status.state === 'flag'
                          ? 'text-[var(--ps-quarantine-text,#C25E09)] font-semibold'
                          : 'text-[#888888]'
                      }`}
                    >
                      {status.resultText}
                    </span>
                  ) : status.state === 'skipped' ? (
                    <span className="text-[#A0A0A0] italic">Skipped</span>
                  ) : (
                    <span className="text-[#A8A29E] opacity-40">idle</span>
                  )}
                </div>

                {/* Connector travelling dot indicator */}
                {idx < 4 && (
                  <div
                    className="hidden md:block absolute top-[28px] -right-[5px] w-[10px] h-[2px] bg-[#EBEAEB] dark:bg-[#2E2A27] z-10"
                    aria-hidden="true"
                  >
                    {isActive && (
                      <motion.div
                        className="w-1.5 h-1.5 -top-[2px] rounded-full bg-[var(--ps-ink,#1D1A1A)] absolute"
                        animate={{ x: [0, 8] }}
                        transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Heart-rate SVG graph */}
      <div className="flex-1 w-full bg-[#FAFAFA] dark:bg-[#151210] rounded-xl border border-[#F1F1F1] dark:border-[#2A2623] p-2 relative overflow-hidden flex flex-col justify-end">
        <div className="absolute top-2 left-3 flex items-center gap-3 text-[10px] font-mono text-[#888888] dark:text-[#A8A29E]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#23C45F]" />
            Trusted
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full border border-[#F87317]" />
            Quarantined
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 text-[#EF4544] font-bold leading-none">✕</span>
            Rejected
          </span>
        </div>

        <svg
          viewBox={`0 0 ${graphWidth} ${graphHeight}`}
          className="w-full h-[120px] overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Grid lines and Y labels */}
          {[250, 150, 50].map((bpm) => {
            const y = yForHr(bpm);
            return (
              <g key={bpm}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={graphWidth - padRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-[#EFEFEF] dark:text-[#25211E]"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <text
                  x={padLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-[#A0A0A0] text-[9px] font-mono"
                >
                  {bpm}
                </text>
              </g>
            );
          })}

          {/* Continuous Polyline for Trusted Points */}
          {polylinePath && (
            <motion.path
              d={polylinePath}
              fill="none"
              stroke="#23C45F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          )}

          {/* Points */}
          {acceptedReadings.map((pt, i) => {
            if (pt.outcome === 'TRUSTED') {
              return (
                <motion.circle
                  key={`pt-${pt.seq}-${i}`}
                  cx={pt.x}
                  cy={pt.y}
                  r={4}
                  fill="#23C45F"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              );
            } else if (pt.outcome === 'QUARANTINED') {
              return (
                <motion.circle
                  key={`pt-${pt.seq}-${i}`}
                  cx={pt.x}
                  cy={pt.y}
                  r={5}
                  fill="none"
                  stroke="#F87317"
                  strokeWidth="2"
                  strokeDasharray="2 1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              );
            } else {
              // Rejected: red X
              return (
                <g key={`pt-${pt.seq}-${i}`}>
                  <line
                    x1={pt.x - 4}
                    y1={pt.y - 4}
                    x2={pt.x + 4}
                    y2={pt.y + 4}
                    stroke="#EF4544"
                    strokeWidth="2"
                  />
                  <line
                    x1={pt.x + 4}
                    y1={pt.y - 4}
                    x2={pt.x - 4}
                    y2={pt.y + 4}
                    stroke="#EF4544"
                    strokeWidth="2"
                  />
                </g>
              );
            }
          })}
        </svg>
      </div>

      {/* Footer */}
      <CardFooter
        title="Five checks, one gate"
        description="A reading only reaches the coach after passing all five."
        linkText="Learn more"
        onLinkClick={onLearnMore}
      />
    </div>
  );
}
