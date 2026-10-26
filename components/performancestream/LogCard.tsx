'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SecurityLogEntry {
  id: string;
  time: string;
  type: 'TRUST' | 'QUARANTINE' | 'REJECT' | 'RATE-LIMIT';
  sensor: string;
  message: string;
}

interface LogCardProps {
  blockedCount: number;
  logs: SecurityLogEntry[];
}

export function LogCard({ blockedCount, logs }: LogCardProps) {
  return (
    <div className="bg-[#1D1A1A] text-white rounded-[20px] border border-[#2E2A27] p-6 pb-5 flex flex-col h-[443px] overflow-hidden shadow-sm relative">
      {/* Top title */}
      <div className="flex items-center justify-between pb-2 border-b border-[#332E2B]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#EF4544] animate-pulse" />
          <h3 className="text-[15px] font-[600] font-mono tracking-wide text-[#F5F0E8]">
            SECURITY AUDIT LOG
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#888888]">WORM immutable</span>
      </div>

      {/* Security Log stream with bottom fade mask */}
      <div
        className="flex-1 overflow-y-auto py-2 space-y-1.5 font-mono text-[12px] leading-relaxed pr-1"
        style={{
          maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
        }}
      >
        <AnimatePresence initial={false}>
          {logs.length === 0 ? (
            <div className="text-[#888888] italic text-[11px] pt-4">
              [SYSTEM] Ingress monitoring active. No security anomalies logged.
            </div>
          ) : (
            logs.map((log) => {
              let typeColor = 'text-[#888888]';
              if (log.type === 'TRUST') typeColor = 'text-[#23C45F]';
              else if (log.type === 'QUARANTINE') typeColor = 'text-[#F87317]';
              else if (log.type === 'REJECT') typeColor = 'text-[#EF4544]';
              else if (log.type === 'RATE-LIMIT') typeColor = 'text-[#EAB308]';

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2 border-b border-[#2A2624] pb-1"
                >
                  <span className="text-[#656565] shrink-0 text-[11px]">{log.time}</span>
                  <span className={`font-bold shrink-0 text-[11px] ${typeColor}`}>
                    {log.type}
                  </span>
                  <span className="text-[#D1D5DB] truncate text-[11px]">
                    <span className="text-white font-[600]">{log.sensor}:</span> {log.message}
                  </span>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Big Stat block at bottom */}
      <div className="pt-3 border-t border-[#332E2B] mt-auto">
        <div className="flex items-baseline gap-3">
          <span className="text-[56px] font-[800] font-mono leading-none tracking-tight text-white">
            {blockedCount}
          </span>
          <div className="text-[13px] text-[#A8A29E] leading-snug">
            bad messages stopped before reaching the coach
          </div>
        </div>
      </div>
    </div>
  );
}
