'use client';

import React, { useState } from 'react';
import { ChevronDown, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How does escrow work?',
    answer:
      'Funds are deposited by the brand into a secure escrow vault before the campaign starts. Money is held safely until our automated AI Referee verifies that the creator’s post meets all agreed deliverables. Only then are funds released instantaneously to the creator.',
  },
  {
    id: 'faq-2',
    question: 'What is the Trust Score?',
    answer:
      'The Trust Score measures a creator’s real audience authenticity and verified delivery history. It starts from their real follower percentage (screened against bot networks) and increases by +2 points for every on-time, compliant campaign completed through ProofReach.',
  },
  {
    id: 'faq-3',
    question: 'What if a creator doesn’t post?',
    answer:
      'If a creator misses the agreed deadline without an approved extension, the escrow lock expires and 100% of the funds are refunded directly back to the brand vault. The creator’s Trust Score is updated to reflect the missed milestone.',
  },
  {
    id: 'faq-4',
    question: 'How are disputes settled?',
    answer:
      'If an automated referee check flags an issue (such as missing product visibility), our 48-hour dispute protocol activates. The parties can either settle with a 50% partial payout split, or the creator can submit a 24-hour re-shoot for automated re-verification.',
  },
  {
    id: 'faq-5',
    question: 'Do you check ad rules?',
    answer:
      'Yes. Our Rule Checker automatically scans the post caption, audio, and visual tags for required disclosures like #ad and paid partnership labels to ensure full regulatory and platform compliance.',
  },
];

export default function FaqCta() {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full space-y-20 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* FAQ Section */}
      <section
        id="faq"
        style={{ scrollMarginTop: 80 }}
        aria-label="Frequently Asked Questions"
      >
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="px-3 py-1 rounded-full text-[13px] font-bold bg-[#024E46]/10 text-[#024E46] border border-[#024E46]/20 inline-block mb-3">
            Common Questions
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 tracking-tight font-serif">
            Frequently asked questions
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
            Everything you need to know about our escrow protection, automated verification, and Trust Scores.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all shadow-sm"
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    id={`faq-btn-${faq.id}`}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left transition-colors hover:bg-stone-50/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#024E46]"
                  >
                    <span className="font-bold text-stone-900 text-base sm:text-lg pr-4">
                      {faq.question}
                    </span>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'bg-[#024E46] text-[#FAFADC] rotate-180'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                    </span>
                  </button>
                </h3>

                {isOpen && (
                  <div
                    id={`faq-answer-${faq.id}`}
                    role="region"
                    aria-labelledby={`faq-btn-${faq.id}`}
                    className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-sm sm:text-base text-stone-600 leading-relaxed border-t border-stone-100"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Screen 4 Part 2: Forest Green CTA Card */}
      <div className="bg-[#024E46] rounded-3xl p-8 sm:p-12 lg:p-16 text-[#FAFADC] shadow-2xl relative overflow-hidden border border-[#024E46]/80">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FAFADC]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAFADC]/15 text-[#FAFADC] text-[13px] font-semibold border border-[#FAFADC]/20">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Workflow</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#FAFADC] font-serif leading-tight">
            Pay only for proof
          </h2>

          <p className="text-stone-200 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            See the whole flow in under 90 seconds. Try our interactive sandbox to test verified matching, escrow locks, and referee audits.
          </p>

          <div className="pt-2">
            <a
              href="#demo"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#FAFADC] text-[#024E46] font-bold text-base hover:bg-white transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FAFADC]"
            >
              <span>Try the Live Demo</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
