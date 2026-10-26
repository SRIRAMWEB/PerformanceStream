'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FilterPill } from './Badge';
import { CardFooter } from './CardFooter';

export interface PacketData {
  sensor: string;
  hr: number;
  ts: number;
  seq: number;
  nonce: string;
  sig: string;
  changedFields?: string[];
  isFlood?: boolean;
  floodRate?: number;
  droppedCount?: number;
}

interface PacketCardProps {
  packet: PacketData | null;
  onLearnMore?: () => void;
}

export function PacketCard({ packet, onLearnMore }: PacketCardProps) {
  const isChanged = (field: string) => packet?.changedFields?.includes(field);

  return (
    <div className="bg-white dark:bg-[#1C1917] rounded-[20px] border border-[#EBEAEB] dark:border-[#2E2A27] p-6 pb-5 flex flex-col h-[443px] overflow-hidden shadow-sm relative">
      {/* Corner instrument tick marks */}
      <span className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#888888]/40 pointer-events-none" />
      <span className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#888888]/40 pointer-events-none" />
      <span className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#888888]/40 pointer-events-none" />
      <span className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#888888]/40 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--ps-panel-border,#F1F1F1)]">
        <div>
          <h3 className="text-[15px] font-[600] text-[var(--ps-ink,#1D1A1A)]">
            Message arriving at the gate
          </h3>
          <span className="text-[11px] font-mono text-[#888888]">Raw ingress packet</span>
        </div>
        <FilterPill label={packet ? packet.sensor : 'No sensor'} />
      </div>

      {/* Packet details body */}
      <div className="flex-1 py-3 overflow-y-auto">
        {!packet ? (
          <div className="h-full flex items-center justify-center text-center text-[13px] font-mono text-[#888888]">
            Waiting for a message.
          </div>
        ) : (
          <div className="space-y-3 font-mono text-[12px]">
            {/* Flood indicator if active */}
            {packet.isFlood && (
              <div className="bg-[#FEF2F2] dark:bg-[#2A1515] border border-[#FECACA] dark:border-[#4B1F1F] rounded-lg p-2.5 space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-[600]">
                  <span className="text-[#DC2626]">Requests: {packet.floodRate || 500} / second</span>
                  <span className="text-[#888888]">Limit: 20 / s</span>
                </div>
                {/* Thin animated bar */}
                <div className="w-full bg-[#E5E7EB] dark:bg-[#382F2F] h-2 rounded-full overflow-hidden relative">
                  <motion.div
                    className="h-full bg-[#EF4544]"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-[2px] bg-[var(--ps-ink,#1D1A1A)]"
                    style={{ left: '4%' }}
                    title="20/s Limit Threshold"
                  />
                </div>
                <div className="text-[10px] text-[#DC2626] flex justify-between">
                  <span>{packet.droppedCount || 480} dropped at perimeter</span>
                  <span className="text-[#16A24B] font-bold">20 capacity remaining</span>
                </div>
              </div>
            )}

            {/* Key/Value Table */}
            <div className="divide-y divide-[#F1F1F1] dark:divide-[#2F2925] border border-[#F1F1F1] dark:border-[#2F2925] rounded-xl overflow-hidden bg-[#F9F8F8] dark:bg-[#23201D]">
              <div
                className={`p-2 flex items-center justify-between transition-colors ${
                  isChanged('sensor') ? 'bg-[#FFE9A8] dark:bg-[#4D3800]' : ''
                }`}
              >
                <span className="text-[#888888]">Sensor ID</span>
                <span className="font-[600] text-[var(--ps-ink,#1D1A1A)]">{packet.sensor}</span>
              </div>

              <div
                className={`p-2 flex items-center justify-between transition-colors ${
                  isChanged('hr') ? 'bg-[#FFE9A8] dark:bg-[#4D3800]' : ''
                }`}
              >
                <span className="text-[#888888]">Heart rate</span>
                <span className="font-[700] text-[var(--ps-ink,#1D1A1A)]">{packet.hr} bpm</span>
              </div>

              <div
                className={`p-2 flex items-center justify-between transition-colors ${
                  isChanged('ts') ? 'bg-[#FFE9A8] dark:bg-[#4D3800]' : ''
                }`}
              >
                <span className="text-[#888888]">Time (s)</span>
                <span className="text-[var(--ps-ink,#1D1A1A)]">{packet.ts}</span>
              </div>

              <div
                className={`p-2 flex items-center justify-between transition-colors ${
                  isChanged('seq') ? 'bg-[#FFE9A8] dark:bg-[#4D3800]' : ''
                }`}
              >
                <span className="text-[#888888]">Sequence no.</span>
                <span className="font-[600] text-[var(--ps-ink,#1D1A1A)]">#{packet.seq}</span>
              </div>

              <div
                className={`p-2 flex items-center justify-between transition-colors ${
                  isChanged('nonce') ? 'bg-[#FFE9A8] dark:bg-[#4D3800]' : ''
                }`}
              >
                <span className="text-[#888888]">One-time ID</span>
                <span className="text-[var(--ps-ink,#1D1A1A)] truncate max-w-[150px]">{packet.nonce}</span>
              </div>

              <div
                className={`p-2 flex items-center justify-between transition-colors ${
                  isChanged('sig') ? 'bg-[#FFE9A8] dark:bg-[#4D3800]' : ''
                }`}
              >
                <span className="text-[#888888]">Signature</span>
                <span className="text-[var(--ps-ink,#1D1A1A)] truncate max-w-[140px]" title={packet.sig}>
                  {packet.sig ? `${packet.sig.slice(0, 20)}…` : '—'}
                </span>
              </div>
            </div>

            {packet.changedFields && packet.changedFields.length > 0 && (
              <div className="text-[10px] text-[#A16207] dark:text-[#FDE047] flex items-center gap-1.5 px-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
                Highlighted fields tampered by adversary
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <CardFooter
        title="The message"
        description="What the gate actually sees."
        linkText="Learn more"
        onLinkClick={onLearnMore}
      />
    </div>
  );
}
