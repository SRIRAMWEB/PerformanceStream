'use client';

import React from 'react';
import { DemoState } from '@/lib/types';
import { CREATORS, PRODUCTS } from '@/lib/mockData';
import { formatINR } from '@/lib/format';
import { FileCheck2, Check, ArrowRight, MessageSquare, PenTool, Shield } from 'lucide-react';

interface Step3AgreementProps {
  state: DemoState;
  onBrandSign: () => void;
  onCreatorSign: () => void;
  onProceed: () => void;
}

export function Step3Agreement({
  state,
  onBrandSign,
  onCreatorSign,
  onProceed,
}: Step3AgreementProps) {
  const creator = CREATORS.find((c) => c.id === state.creatorId) ?? CREATORS[0];
  const product = PRODUCTS.find((p) => p.id === state.product) ?? PRODUCTS[0];

  const isBrandSigned = state.contract === 'brand_signed' || state.contract === 'signed';
  const isCreatorSigned = state.contract === 'signed';
  const isBothSigned = state.contract === 'signed';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
          Standardized Smart Agreement
        </h2>
        <p className="text-stone-600 text-sm mt-1">
          Automated contract terms locking scope, deliverables, and escrow protection.
        </p>
      </div>

      {/* Negotiation Preview */}
      <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-stone-600 mb-1">
          <MessageSquare className="w-4 h-4 text-[#024E46]" />
          <span>Negotiation Chat Thread</span>
        </div>
        <div className="space-y-2">
          <div className="bg-white p-3 rounded-xl border border-stone-200 text-[13px] max-w-sm mr-auto text-stone-700">
            <span className="font-semibold text-stone-900 block mb-0.5">Brand Partner</span>
            Hey {creator.name}, let&apos;s collaborate on {product.name} with 1 dedicated post on {state.platform}.
          </div>
          <div className="bg-[#024E46]/10 p-3 rounded-xl border border-[#024E46]/20 text-[13px] max-w-sm ml-auto text-stone-800">
            <span className="font-semibold text-[#024E46] block mb-0.5">{creator.name}</span>
            Sounds great! My fee is {formatINR(state.agreedAmount)}. Ready to proceed with verified escrow.
          </div>
        </div>
      </div>

      {/* Contract Terms Card */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-[#024E46]" />
            <h3 className="font-bold text-stone-900 text-base">Campaign Contract SLA</h3>
          </div>
          <span className="text-[13px] text-stone-500 font-medium">Standard Clause v2</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[13px] text-stone-500">Deliverable Scope</div>
            <div className="font-semibold text-stone-900 mt-0.5">
              1x Dedicated Post ({state.platform})
            </div>
            <div className="text-[13px] text-stone-600">Featuring {product.name}</div>
          </div>
          <div>
            <div className="text-[13px] text-stone-500">Agreed Fee</div>
            <div className="font-semibold text-stone-900 mt-0.5">
              {formatINR(state.agreedAmount)}
            </div>
            <div className="text-[13px] text-stone-600">Held in ProofReach Escrow</div>
          </div>
          <div>
            <div className="text-[13px] text-stone-500">Verification Criteria</div>
            <div className="font-semibold text-stone-900 mt-0.5">
              Product visible in 3s &bull; #ad label
            </div>
            <div className="text-[13px] text-stone-600">On-time publication before deadline</div>
          </div>
          <div>
            <div className="text-[13px] text-stone-500">Arbitration SLA</div>
            <div className="font-semibold text-stone-900 mt-0.5">
              48h Referee Window
            </div>
            <div className="text-[13px] text-stone-600">1 free revision included</div>
          </div>
        </div>

        {/* Signature Controls */}
        <div className="border-t border-stone-100 pt-4 space-y-3">
          <div className="text-sm font-semibold text-stone-800">Parties Signatures</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Brand Signature */}
            <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <div className="text-[13px] font-semibold text-stone-900">Brand Signature</div>
                <div className="text-[13px] text-stone-500">
                  {isBrandSigned ? 'Signed digitally' : 'Pending signature'}
                </div>
              </div>
              <button
                type="button"
                onClick={onBrandSign}
                disabled={isBrandSigned}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                  isBrandSigned
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-[#024E46] text-[#FAFADC] hover:bg-[#024E46]/90'
                }`}
              >
                {isBrandSigned ? (
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Signed
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <PenTool className="w-3.5 h-3.5" /> Sign as Brand
                  </span>
                )}
              </button>
            </div>

            {/* Creator Signature */}
            <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <div className="text-[13px] font-semibold text-stone-900">Creator Signature</div>
                <div className="text-[13px] text-stone-500">
                  {isCreatorSigned
                    ? 'Signed digitally'
                    : isBrandSigned || state.userRole === 'creator'
                    ? 'Ready to sign'
                    : 'Awaiting brand'}
                </div>
              </div>
              <button
                type="button"
                onClick={onCreatorSign}
                disabled={isCreatorSigned || (!isBrandSigned && state.userRole !== 'creator')}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                  isCreatorSigned
                    ? 'bg-emerald-100 text-emerald-800'
                    : !isBrandSigned && state.userRole !== 'creator'
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-[#024E46] text-[#FAFADC] hover:bg-[#024E46]/90'
                }`}
              >
                {isCreatorSigned ? (
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Signed
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <PenTool className="w-3.5 h-3.5" /> Sign as Creator
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Proceed Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onProceed}
          disabled={!isBothSigned}
          title={!isBothSigned ? 'Both parties must sign first' : undefined}
          className={`btn-primary w-full py-3.5 text-base justify-center rounded-2xl shadow-md ${
            !isBothSigned
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
        >
          <Shield className="w-5 h-5 mr-2" />
          <span>Lock Funds in Escrow</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
        {!isBothSigned && (
          <p className="text-center text-[13px] text-stone-500 mt-2">
            Both parties must sign first
          </p>
        )}
      </div>
    </div>
  );
}
