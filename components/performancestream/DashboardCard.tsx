'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from './Badge';
import { CardFooter } from './CardFooter';

export interface DashboardReading {
  id: string;
  sensor: string;
  hr: number;
  seq: number;
  nonce: string;
  ts: number;
  sig: string;
  outcome: 'TRUSTED' | 'QUARANTINED';
  receivedAt: string;
}

interface DashboardCardProps {
  trustedCount: number;
  quarantinedCount: number;
  rejectedCount: number;
  readingsList: DashboardReading[];
  onLearnMore?: () => void;
}

export function DashboardCard({
  trustedCount,
  quarantinedCount,
  rejectedCount,
  readingsList,
  onLearnMore,
}: DashboardCardProps) {
  const [selectedLineage, setSelectedLineage] = useState<DashboardReading | null>(null);

  return (
    <div className="bg-white dark:bg-[#1C1917] rounded-[20px] border border-[#EBEAEB] dark:border-[#2E2A27] p-6 pb-5 flex flex-col h-[443px] overflow-hidden shadow-sm relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--ps-panel-border,#F1F1F1)]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--ps-trusted,#23C45F)]" />
          <h3 className="text-[16px] font-[600] text-[var(--ps-ink,#1D1A1A)]">
            Coach’s dashboard
          </h3>
        </div>
        <button
          type="button"
          aria-label="Options"
          className="text-[#888888] hover:text-[var(--ps-ink,#1D1A1A)] transition-colors p-1"
        >
          ⋮
        </button>
      </div>

      {/* Counters row: 3 inner panels */}
      <div className="grid grid-cols-3 gap-2.5 my-3">
        <div className="bg-[#F9F8F8] dark:bg-[#23201D] border border-[#F1F1F1] dark:border-[#2F2925] rounded-xl p-2.5 text-center">
          <span className="block text-[11px] font-mono uppercase text-[#888888] dark:text-[#A8A29E]">
            Trusted
          </span>
          <span className="text-[22px] font-[700] font-mono text-[var(--ps-trusted-text,#16A24B)] leading-none mt-1 block">
            {trustedCount}
          </span>
        </div>

        <div className="bg-[#F9F8F8] dark:bg-[#23201D] border border-[#F1F1F1] dark:border-[#2F2925] rounded-xl p-2.5 text-center">
          <span className="block text-[11px] font-mono uppercase text-[#888888] dark:text-[#A8A29E]">
            Quarantine
          </span>
          <span className="text-[22px] font-[700] font-mono text-[var(--ps-quarantine-text,#C25E09)] leading-none mt-1 block">
            {quarantinedCount}
          </span>
        </div>

        <div className="bg-[#F9F8F8] dark:bg-[#23201D] border border-[#F1F1F1] dark:border-[#2F2925] rounded-xl p-2.5 text-center">
          <span className="block text-[11px] font-mono uppercase text-[#888888] dark:text-[#A8A29E]">
            Rejected
          </span>
          <span className="text-[22px] font-[700] font-mono text-[var(--ps-reject-text,#DC2626)] leading-none mt-1 block">
            {rejectedCount}
          </span>
        </div>
      </div>

      {/* Reading list with fade mask */}
      <div
        className="flex-1 overflow-y-auto space-y-2 pr-1"
        style={{
          maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
        }}
      >
        <AnimatePresence initial={false}>
          {readingsList.length === 0 ? (
            <div className="p-4 text-center text-[12px] font-mono text-[#888888] italic">
              No live readings received yet
            </div>
          ) : (
            readingsList.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  if (item.outcome === 'TRUSTED') {
                    setSelectedLineage(selectedLineage?.id === item.id ? null : item);
                  }
                }}
                className={`bg-[#F9F8F8] dark:bg-[#23201D] border border-[#F1F1F1] dark:border-[#2F2925] rounded-xl p-2.5 flex items-center justify-between text-[13px] font-mono transition-colors ${
                  item.outcome === 'TRUSTED'
                    ? 'cursor-pointer hover:border-[var(--ps-trusted-border,#BBF7D0)]'
                    : 'opacity-90'
                } ${selectedLineage?.id === item.id ? 'ring-1 ring-[var(--ps-trusted,#23C45F)]' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-[600] text-[var(--ps-ink,#1D1A1A)]">
                    {item.sensor}
                  </span>
                  <span className="text-[#888888]">·</span>
                  <span className="font-[700] text-[var(--ps-ink,#1D1A1A)]">
                    {item.hr} bpm
                  </span>
                  <span className="text-[#888888]">·</span>
                  <span className="text-[#888888]">#{item.seq}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Badge variant={item.outcome === 'TRUSTED' ? 'trusted' : 'quarantined'}>
                    {item.outcome === 'TRUSTED' ? 'Trusted' : 'Quarantined'}
                  </Badge>
                  {item.outcome === 'TRUSTED' && (
                    <span className="text-[10px] text-[#888888] hover:text-[var(--ps-ink,#1D1A1A)]">
                      {selectedLineage?.id === item.id ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Inline Lineage Overlay/Drawer */}
      <AnimatePresence>
        {selectedLineage && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="absolute inset-x-4 bottom-[72px] bg-white dark:bg-[#201D1A] border border-[var(--ps-trusted-border,#BBF7D0)] rounded-xl p-3 shadow-md z-20 text-[11px] font-mono space-y-1.5"
          >
            <div className="flex items-center justify-between font-[700] text-[var(--ps-trusted-text,#16A24B)] border-b border-[#F1F1F1] dark:border-[#2F2925] pb-1">
              <span>Verified Lineage #{selectedLineage.seq}</span>
              <button
                type="button"
                onClick={() => setSelectedLineage(null)}
                className="text-[#888888] hover:text-[var(--ps-ink,#1D1A1A)]"
              >
                ✕
              </button>
            </div>
            <div className="text-[11px] text-[var(--ps-ink,#1D1A1A)] space-y-1 leading-snug">
              <div>
                <strong>Dashboard value:</strong> {selectedLineage.hr} bpm
              </div>
              <div className="text-[#656565] dark:text-[#A8A29E]">
                ← validated reading #{selectedLineage.seq} from {selectedLineage.sensor}
              </div>
              <div className="text-[#656565] dark:text-[#A8A29E] truncate">
                ← raw nonce <span className="text-[var(--ps-ink,#1D1A1A)]">{selectedLineage.nonce}</span> / ts {selectedLineage.ts}s
              </div>
              <div className="text-[#656565] dark:text-[#A8A29E] truncate">
                ← HMAC signature verified (sensor-07-secret)
              </div>
              <div className="text-[#16A24B] font-[600]">
                ← stored unchanged in raw immutable zone
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <CardFooter
        title="Trust labels and lineage"
        description="Every number traces to its source."
        linkText="Learn more"
        onLinkClick={onLearnMore}
      />
    </div>
  );
}
