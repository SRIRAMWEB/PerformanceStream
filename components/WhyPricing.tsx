'use client';

import React from 'react';
import { Check, ShieldCheck, Zap, ArrowRight, Building, Sparkles } from 'lucide-react';

const COMPARISON_ROWS = [
  {
    type: 'Enterprise platforms',
    reality: '$2,000/month with annual lock-in contracts.',
    isProofReach: false,
  },
  {
    type: 'Creator marketplaces',
    reality: 'Escrow available, but weak or non-existent dispute handling.',
    isProofReach: false,
  },
  {
    type: 'Basic payment tools',
    reality: 'Holds funds securely, but never verifies actual delivery.',
    isProofReach: false,
  },
  {
    type: 'ProofReach',
    reality: 'Affordable. Verifies delivery. Checks ad labels. Settles disputes fairly and fast.',
    isProofReach: true,
  },
];

const PRICING_TIERS = [
  {
    name: 'Starter',
    price: '₹1,499',
    cadence: '/month',
    tagline: 'For first campaigns',
    features: [
      '3 campaigns per month',
      '5 verified posts',
      'Basic Trust Score reports',
      'Standard dispute support',
    ],
    highlighted: false,
    cta: 'Start with Starter',
  },
  {
    name: 'Growth',
    price: '₹4,999',
    cadence: '/month',
    tagline: 'For growing brands',
    features: [
      '15 campaigns per month',
      'Unlimited verified posts',
      'Full Trust Score audits',
      'Priority 24h dispute resolution',
    ],
    highlighted: true,
    cta: 'Try Growth Flow',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    cadence: '',
    tagline: 'For agencies and high volume',
    features: [
      'Dedicated account manager',
      'API access (Instagram & YouTube)',
      'Custom verification SLAs',
      'White-label Trust badges',
    ],
    highlighted: false,
    cta: 'Explore Enterprise',
  },
];

export default function WhyPricing() {
  return (
    <div className="w-full space-y-24 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Screen 3 Part 1: Why ProofReach Comparison Table */}
      <section
        id="why"
        style={{ scrollMarginTop: 80 }}
        aria-label="Why ProofReach comparison table"
      >
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="px-3 py-1 rounded-full text-[13px] font-bold bg-[#024E46]/10 text-[#024E46] border border-[#024E46]/20 inline-block mb-3">
            Market Comparison
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 tracking-tight font-serif">
            The creator collaboration gap
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
            Traditional influencer platforms lock you into expensive subscriptions without guaranteeing delivery.
            ProofReach connects escrow protection directly with automated post verification.
          </p>
        </div>

        {/* 2-Column Comparison Table */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 bg-stone-50 border-b border-stone-200 p-4 text-[13px] font-bold uppercase tracking-wider text-stone-500">
            <div>Tool Type</div>
            <div className="mt-1 sm:mt-0">The Reality</div>
          </div>

          <div className="divide-y divide-stone-100">
            {COMPARISON_ROWS.map((row) => (
              <div
                key={row.type}
                className={`grid grid-cols-1 sm:grid-cols-2 p-5 sm:p-6 transition-colors ${
                  row.isProofReach
                    ? 'bg-[#024E46] text-[#FAFADC]'
                    : 'hover:bg-stone-50/60 text-stone-800'
                }`}
              >
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  {row.isProofReach ? (
                    <div className="w-8 h-8 rounded-xl bg-[#FAFADC]/20 text-[#FAFADC] flex items-center justify-center font-bold text-sm shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-stone-300 shrink-0" />
                  )}
                  <span
                    className={`font-bold text-base ${
                      row.isProofReach ? 'text-[#FAFADC]' : 'text-stone-900'
                    }`}
                  >
                    {row.type}
                  </span>
                </div>

                <div
                  className={`text-sm sm:text-base leading-relaxed flex items-center ${
                    row.isProofReach
                      ? 'text-[#FAFADC] font-semibold'
                      : 'text-stone-600'
                  }`}
                >
                  {row.reality}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screen 3 Part 2: Pricing Tiers */}
      <section
        id="pricing"
        style={{ scrollMarginTop: 80 }}
        aria-label="ProofReach subscription pricing plans"
      >
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="px-3 py-1 rounded-full text-[13px] font-bold bg-[#024E46]/10 text-[#024E46] border border-[#024E46]/20 inline-block mb-3">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 tracking-tight font-serif">
            Predictable plans for growing brands
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
            Zero lock-in. Escrow security included. Scale your influencer reach with verified proof of performance.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                tier.highlighted
                  ? 'bg-white border-2 border-[#024E46] shadow-xl ring-4 ring-[#024E46]/10'
                  : 'bg-white border border-stone-200 shadow-sm hover:border-stone-300'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#024E46] text-[#FAFADC] text-[13px] font-bold tracking-wide shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <div className="mb-4">
                  <h3 className="font-bold text-xl text-stone-900">{tier.name}</h3>
                  <p className="text-[13px] text-stone-500 mt-1">{tier.tagline}</p>
                </div>

                <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-stone-100">
                  <span className="text-3xl sm:text-4xl font-extrabold text-stone-900">
                    {tier.price}
                  </span>
                  {tier.cadence && (
                    <span className="text-sm font-medium text-stone-500">
                      {tier.cadence}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-8 text-sm text-stone-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#024E46]/10 text-[#024E46] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <a
                  href="#demo"
                  className={`w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center transition-all ${
                    tier.highlighted
                      ? 'btn-primary shadow-md'
                      : 'border border-stone-200 text-stone-800 hover:border-stone-400 bg-stone-50 hover:bg-stone-100'
                  }`}
                >
                  <span>{tier.cta}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Illustrative Note */}
        <p className="text-center text-[13px] text-stone-500 mt-8 italic">
          Illustrative prices for prototype
        </p>
      </section>
    </div>
  );
}
