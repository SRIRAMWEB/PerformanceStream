'use client';

import React, { useState } from 'react';
import { Creator } from '@/lib/types';
import { ShieldCheck, Share2, Check } from 'lucide-react';

interface TrustCardProps {
  creator: Creator;
  trustScore: number;
  verifiedDeliveries: number;
}

export function TrustCard({ creator, trustScore, verifiedDeliveries }: TrustCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border-2 border-[#024E46]/20 shadow-lg relative overflow-hidden">
      {/* Background seal watermarks */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#024E46]/5 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#024E46]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 12l10 10 10-10L12 2zm0 4.5l5.5 5.5L12 17.5 6.5 12 12 6.5z" />
          </svg>
          <span className="font-bold text-[#024E46] text-sm tracking-wide">
            PROOFREACH AUDIT
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#024E46]/10 text-[#024E46] text-[13px] font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Verified by ProofReach</span>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-[#024E46] text-[#FAFADC] flex items-center justify-center font-bold text-xl shadow-inner">
          {creator.name.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-stone-900 text-lg leading-tight">
            {creator.name}
          </h4>
          <p className="text-[13px] text-stone-500">{creator.handle} &bull; {creator.niche}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3.5 rounded-2xl bg-[#FAFADC]/50 border border-stone-200">
          <div className="text-[13px] text-stone-600 mb-0.5">Trust Score</div>
          <div className="text-xl font-bold text-[#024E46]">{trustScore}%</div>
          <div className="text-[13px] text-stone-500 font-medium">Audience Authenticity</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#FAFADC]/50 border border-stone-200">
          <div className="text-[13px] text-stone-600 mb-0.5">Verified Delivery</div>
          <div className="text-xl font-bold text-[#024E46]">{verifiedDeliveries}</div>
          <div className="text-[13px] text-stone-500 font-medium">Completed Campaigns</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-stone-100">
        <span className="text-[13px] text-stone-500">
          Audited against bot networks &amp; contract SLAs
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Share Verified Trust Card"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-stone-200 hover:border-[#024E46] text-stone-700 hover:text-[#024E46] text-[13px] font-medium transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Link Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Card</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
