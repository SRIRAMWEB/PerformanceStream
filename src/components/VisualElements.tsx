'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function EcgLine({ className = '', color = '#034F46' }: { className?: string; color?: string }) {
  return (
    <div className={`overflow-hidden flex items-center justify-center my-3 ${className}`}>
      <svg
        viewBox="0 0 600 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-8 opacity-60"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0 18 H200 L212 18 L218 8 L226 28 L234 2 L242 32 L250 18 L262 18 H600"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
    </div>
  );
}

export function TrackLanes({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none opacity-40 ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1000 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-[rgba(15,31,27,0.12)]"
        preserveAspectRatio="none"
      >
        <path d="M-100 100 C 400 100, 600 500, 1100 500" stroke="currentColor" strokeWidth="1" strokeDasharray="6 8" />
        <path d="M-100 160 C 420 160, 620 540, 1100 540" stroke="currentColor" strokeWidth="1" strokeDasharray="6 8" />
        <path d="M-100 220 C 440 220, 640 580, 1100 580" stroke="currentColor" strokeWidth="1" strokeDasharray="6 8" />
      </svg>
    </div>
  );
}

export function TrustRing({
  trustedCount,
  totalCount,
  size = 110,
}: {
  trustedCount: number;
  totalCount: number;
  size?: number;
}) {
  const percentage = totalCount > 0 ? Math.round((trustedCount / totalCount) * 100) : 100;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(15,31,27,0.12)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#034F46"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-['Fraunces'] font-bold text-[22px] text-[#0F1F1B] leading-none">
          {percentage}%
        </span>
        <span className="text-[10px] font-['Manrope'] font-semibold uppercase tracking-wider text-[#48504F] mt-0.5">
          Trust
        </span>
      </div>
    </div>
  );
}

export function ImageCard({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.04 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-[28px] sm:rounded-[32px] bg-[#F4F0E8] border border-[rgba(15,31,27,0.12)] group shadow-sm ${className}`}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter saturate-[0.92]"
      />
      {/* 8% Sand multiply tint overlay */}
      <div
        className="absolute inset-0 pointer-events-none bg-[#e9e4db] mix-blend-multiply opacity-15"
        aria-hidden="true"
      />
    </motion.div>
  );
}
