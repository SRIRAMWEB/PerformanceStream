'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Download,
  ExternalLink,
  Layers,
  Activity,
  ShieldCheck,
  Radio,
} from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  start: number;
  route: string;
  description: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: 'intro',
    title: '1. Problem & Threat Landscape',
    start: 0,
    route: '/',
    description: 'Why sideline coaches cannot trust unverified wearable telemetry in modern stadiums.',
  },
  {
    id: 'arch',
    title: '2. Five-Stage Cryptographic Gate',
    start: 36,
    route: '/architecture',
    description: 'HMAC-SHA256, freshness nonces, sequence continuity, and statistical z-scores.',
  },
  {
    id: 'sim',
    title: '3. Live Attack Demonstrations',
    start: 71,
    route: '/simulator',
    description: 'Watching fake sensors, altered packets, replay floods, and stolen keys get neutralized.',
  },
  {
    id: 'ledger',
    title: '4. Immutable Ledger & Athlete Lineage',
    start: 126,
    route: '/simulator',
    description: 'Chaining verified telemetry into SHA-256 blocks for 100% auditable decisions.',
  },
  {
    id: 'conclusion',
    title: '5. Summary & Trust Guarantee',
    start: 161,
    route: '/',
    description: 'Complete data integrity from wearable sensor to coach decision.',
  },
];

const TRANSCRIPTS = [
  { start: 0, end: 12, text: 'Welcome to PerformanceStream, a secure real-time sports analytics pipeline built for Team Among Us, BreachX problem BRCX-SPT-03.' },
  { start: 12, end: 28, text: 'In elite athletics, sideline coaches and sports scientists rely heavily on wearable sensors for pacing, cardiac load management, and critical substitutions.' },
  { start: 28, end: 36, text: 'PerformanceStream places a zero-trust cryptographic verification gate directly between the athlete wearables and the coaching dashboard.' },
  { start: 36, end: 48, text: 'First, let us examine the pipeline architecture. Every incoming reading must survive five sequential defensive checks.' },
  { start: 48, end: 60, text: 'Check 1 verifies device identity against an authorized registry. Check 2 uses keyed HMAC-SHA256 signatures to prove integrity.' },
  { start: 60, end: 71, text: 'Check 3 enforces freshness with Unix timestamps and nonces. Check 4 monitors sequence order, and Check 5 uses rolling z-scores to catch impossible spikes.' },
  { start: 71, end: 84, text: 'Now let us enter the Live Simulator. Watch how the pipeline reacts under attack when protection is enabled.' },
  { start: 84, end: 95, text: 'When an attacker injects a fake sensor reading, Check 1 rejects it immediately, dropping the packet and logging an incident.' },
  { start: 95, end: 106, text: 'When telemetry values are modified in-flight, Check 2 detects the cryptographic signature mismatch and denies access.' },
  { start: 106, end: 116, text: 'When an adversary attempts to replay old packets, Check 3 flags the expired nonce and halts execution.' },
  { start: 116, end: 126, text: 'Even with a stolen key, an impossible 240 BPM spike is quarantined by Check 5 statistical anomaly scoring.' },
  { start: 126, end: 145, text: 'Under volumetric flooding, perimeter token-bucket rate limiters shed bursts while preserving clean athlete channels.' },
  { start: 145, end: 161, text: 'Every verified reading is anchored into an immutable SHA-256 hash ledger, allowing coaches to trace any number back to its source.' },
  { start: 161, end: 185, text: 'If historical records are tampered with, the ledger algorithm immediately detects the broken link. PerformanceStream delivers absolute trust from athlete to sideline.' },
];

export function AudioTourPlayer() {
  const router = useRouter();
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(182);
  const [isMuted, setIsMuted] = useState(false);
  const [activeChapter, setActiveChapter] = useState(CHAPTERS[0]);

  // Audio time update
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      // update active chapter
      const cur = audio.currentTime;
      for (let i = CHAPTERS.length - 1; i >= 0; i--) {
        if (cur >= CHAPTERS[i].start) {
          setActiveChapter(CHAPTERS[i]);
          break;
        }
      }
    };

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Audio play prevented or file unavailable:', err);
      });
    }
  };

  const jumpToTime = (time: number, targetRoute?: string) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      if (!isPlaying) {
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
    if (targetRoute && pathname !== targetRoute) {
      router.push(targetRoute);
    }
  };

  const currentTranscript = TRANSCRIPTS.find(
    (t) => currentTime >= t.start && currentTime < t.end
  ) || TRANSCRIPTS[0];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <>
      <audio ref={audioRef} src="/audio/walkthrough.wav" preload="metadata" />

      {/* Persistent Floating Widget at Bottom Right */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2 max-w-[94vw] sm:max-w-[480px]">
        {/* Expanded Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="w-full bg-[#F4F0E8] border border-[rgba(15,31,27,0.18)] rounded-[24px] shadow-2xl p-5 backdrop-blur-xl text-[#0F1F1B] font-['Manrope']"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[rgba(15,31,27,0.1)]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#034F46] animate-pulse" />
                  <span className="font-['Fraunces'] font-semibold text-[17px] text-[#0F1F1B]">
                    Guided Demo Walkthrough
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <a
                    href="/audio/walkthrough.wav"
                    download="performancestream-voiceover.wav"
                    title="Download Voiceover Audio (WAV)"
                    className="p-1.5 rounded-full text-[#48504F] hover:text-[#034F46] hover:bg-[#e9e4db] transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1.5 rounded-full text-[#48504F] hover:text-[#0F1F1B] hover:bg-[#e9e4db] transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subtitle / Live Transcript Box */}
              <div className="my-3.5 p-3 rounded-2xl bg-[#e9e4db] border border-[rgba(15,31,27,0.1)] min-h-[58px] flex items-center gap-3">
                <Radio className={`w-4 h-4 shrink-0 text-[#034F46] ${isPlaying ? 'animate-pulse' : 'opacity-50'}`} />
                <p className="text-[13px] leading-snug text-[#0F1F1B] italic">
                  "{currentTranscript.text}"
                </p>
              </div>

              {/* Chapters List */}
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1 my-3 scrollbar-thin">
                {CHAPTERS.map((ch) => {
                  const isActive = activeChapter.id === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => jumpToTime(ch.start, ch.route)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-[12px] flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-[#034F46] text-[#FCFDFD] font-semibold shadow-xs'
                          : 'bg-[#e9e4db]/60 text-[#48504F] hover:bg-[#e9e4db] hover:text-[#0F1F1B]'
                      }`}
                    >
                      <span className="truncate pr-2">{ch.title}</span>
                      <span className="font-mono text-[11px] opacity-80 shrink-0">
                        {formatTime(ch.start)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Scrubber Progress Bar */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#48504F] mb-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={duration || 180}
                  value={currentTime}
                  onChange={(e) => jumpToTime(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#e9e4db] rounded-lg appearance-none cursor-pointer accent-[#034F46]"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-[rgba(15,31,27,0.1)]">
                <button
                  onClick={() => jumpToTime(Math.max(0, currentTime - 10))}
                  title="Rewind 10s"
                  className="p-2 rounded-full hover:bg-[#e9e4db] text-[#48504F] hover:text-[#0F1F1B] transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="px-5 py-2 rounded-full bg-[#034F46] hover:bg-[#023b34] text-[#FCFDFD] font-semibold text-[13px] flex items-center gap-2 shadow-sm transition-all"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" /> Play Tour
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    const audio = audioRef.current;
                    if (audio) {
                      audio.muted = !isMuted;
                      setIsMuted(!isMuted);
                    }
                  }}
                  title={isMuted ? 'Unmute' : 'Mute'}
                  className="p-2 rounded-full hover:bg-[#e9e4db] text-[#48504F] hover:text-[#0F1F1B] transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Capsule Bar (Always Visible) */}
        <div className="flex items-center gap-2 bg-[#034F46] text-[#FCFDFD] rounded-full p-1.5 shadow-xl border border-[#034F46]/40 backdrop-blur-md">
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-[#E4F1C6] text-[#034F46] flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
            aria-label={isPlaying ? 'Pause voiceover demo' : 'Play voiceover demo'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2.5 px-2 text-left hover:opacity-90 transition-opacity"
          >
            <div className="flex flex-col">
              <span className="text-[12px] font-semibold text-[#FCFDFD] flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#E4F1C6]" />
                Audio Walkthrough
              </span>
              <span className="text-[10px] text-[#FCFDFD]/75 font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-[#E4F1C6]" />
            ) : (
              <ChevronUp className="w-4 h-4 text-[#E4F1C6]" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
