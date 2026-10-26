'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

export function PrimaryButton({
  children,
  onClick,
  href,
  className = '',
  disabled = false,
  type = 'button',
  'aria-label': ariaLabel,
}: PrimaryButtonProps) {
  const btnRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.15;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.15;
    setOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const content = (
    <motion.span
      className="inline-flex items-center gap-3 w-full justify-between"
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
    >
      <span className="w-11 h-11 rounded-full bg-[#E4F1C6] flex items-center justify-center shrink-0 transition-transform group-hover:rotate-45">
        <svg
          width="11"
          height="11"
          viewBox="0 0 11 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M0.353516 10L9.85352 0.5M9.85352 0.5V8.5M9.85352 0.5H1.85352"
            stroke="#034F46"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="font-['Manrope'] font-semibold text-[15px] tracking-tight text-[#FCFDFD] pr-4 whitespace-nowrap">
        {children}
      </span>
    </motion.span>
  );

  const baseClasses = `group inline-flex items-center justify-between p-[4px_4px_4px_4px] bg-[#034F46] hover:bg-[#023b34] rounded-[99px] text-[#FCFDFD] shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#034F46] focus-visible:ring-offset-2 min-h-[48px] ${
    disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
  } ${className}`;

  if (href) {
    return (
      <motion.a
        ref={btnRef as any}
        href={href}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        aria-label={ariaLabel}
        className={baseClasses}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={btnRef as any}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      aria-label={ariaLabel}
      className={baseClasses}
    >
      {content}
    </motion.button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  href,
  className = '',
  disabled = false,
  'aria-label': ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
}) {
  const baseClasses = `inline-flex items-center justify-center px-5 py-2.5 rounded-[99px] border border-[rgba(15,31,27,0.15)] bg-transparent text-[#0F1F1B] font-['Manrope'] font-semibold text-[14px] hover:border-[#0F1F1B] hover:bg-[rgba(15,31,27,0.03)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#034F46] min-h-[44px] ${
    disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
  } ${className}`;

  if (href) {
    return (
      <a href={href} className={baseClasses} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={baseClasses} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

export function AttackButton({
  children,
  onClick,
  disabled = false,
  dotColor = 'amber',
  active = false,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  dotColor?: 'amber' | 'clay' | 'green';
  active?: boolean;
  className?: string;
}) {
  const dotBg = dotColor === 'amber' ? 'bg-[#B7791F]' : dotColor === 'clay' ? 'bg-[#B5483A]' : 'bg-[#034F46]';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-[99px] border text-[13px] font-['Manrope'] font-medium transition-all min-h-[44px] ${
        active
          ? 'border-[#034F46] bg-[#F4F0E8] text-[#0F1F1B] font-semibold ring-1 ring-[#034F46]'
          : 'border-[rgba(15,31,27,0.15)] bg-transparent text-[#0F1F1B] hover:border-[rgba(15,31,27,0.4)]'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${dotBg} shrink-0`} />
      <span>{children}</span>
    </button>
  );
}
