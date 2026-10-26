'use client';

import React from 'react';
import Link from 'next/link';
import { Download, ArrowLeft, Play, ShieldCheck, Video, ExternalLink } from 'lucide-react';

export default function VideoPage() {
  return (
    <div className="min-h-[85vh] py-12 px-6 sm:px-12 flex flex-col items-center justify-center font-['Manrope']">
      <div className="max-w-[1000px] w-full">
        {/* Breadcrumb back */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#034F46] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Overview
          </Link>

          <a
            href="/videos/performancestream_walkthrough.mp4"
            download="performancestream_walkthrough.mp4"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#034F46] hover:bg-[#023b34] text-[#FCFDFD] font-semibold text-[14px] shadow-sm transition-all"
          >
            <Download className="w-4 h-4" /> Download MP4 Video (1080p)
          </a>
        </div>

        {/* Video Player Card */}
        <div className="bg-[#F4F0E8] border border-[rgba(15,31,27,0.14)] rounded-[28px] sm:rounded-[32px] p-4 sm:p-6 shadow-xl">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e9e4db] text-[12px] font-semibold text-[#034F46] mb-1">
                <ShieldCheck className="w-3.5 h-3.5" /> BreachX · Problem BRCX-SPT-03
              </div>
              <h1 className="font-['Fraunces'] text-[24px] sm:text-[30px] text-[#0F1F1B]">
                PerformanceStream: Walkthrough Demo
              </h1>
            </div>
            <span className="text-[13px] text-[#48504F] font-mono bg-[#e9e4db] px-3 py-1 rounded-full self-start sm:self-auto">
              01:26 · Full HD 1080p
            </span>
          </div>

          {/* Native HTML5 Video Player */}
          <div className="relative rounded-[20px] overflow-hidden bg-black shadow-inner aspect-video">
            <video
              src="/videos/performancestream_walkthrough.mp4"
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain"
            >
              Your browser does not support HTML5 video playback.
            </video>
          </div>

          {/* Action Bar below video */}
          <div className="mt-6 pt-5 border-t border-[rgba(15,31,27,0.1)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[13px] text-[#48504F]">
              Includes complete voiceover narration explaining the 5-check cryptographic gate, live attack defenses, and immutable hash ledger.
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="/videos/performancestream_walkthrough.mp4"
                download="performancestream_walkthrough.mp4"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#034F46] hover:bg-[#023b34] text-[#FCFDFD] font-bold text-[14px] shadow-sm transition-all"
              >
                <Download className="w-4 h-4" /> Download Video
              </a>
              <a
                href="/simulator"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#e9e4db] hover:bg-[#ded8cc] text-[#0F1F1B] font-semibold text-[14px] transition-colors"
              >
                Try Live Simulator <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
