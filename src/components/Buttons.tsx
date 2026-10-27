'use client';

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
  id?: string;
}

export function PrimaryButton({
  children,
  onClick,
  href,
  className = '',
  disabled = false,
  type = 'button',
  'aria-label': ariaLabel,
  id,
}: ButtonProps) {
  const baseClasses = `inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#1D1B16] text-[#FFFFFF] font-sans font-semibold text-[14px] hover:bg-[#333027] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1B16] min-h-[44px] ${
    disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
  } ${className}`;

  if (href) {
    return (
      <a href={href} id={id} className={baseClasses} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} id={id} onClick={onClick} disabled={disabled} className={baseClasses} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  href,
  className = '',
  disabled = false,
  type = 'button',
  'aria-label': ariaLabel,
  id,
}: ButtonProps) {
  const baseClasses = `inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-[#E3DCCB] bg-[#FFFFFF] text-[#1D1B16] font-sans font-medium text-[14px] hover:border-[#1D1B16] hover:bg-[#F6F1E7] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1B16] min-h-[44px] ${
    disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
  } ${className}`;

  if (href) {
    return (
      <a href={href} id={id} className={baseClasses} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} id={id} onClick={onClick} disabled={disabled} className={baseClasses} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

export function AttackButton({
  children,
  onClick,
  disabled = false,
  statusType = 'attack',
  active = false,
  description = '',
  shortcutKey = '',
  className = '',
  id,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  statusType?: 'normal' | 'attack';
  active?: boolean;
  description?: string;
  shortcutKey?: string;
  className?: string;
  id?: string;
}) {
  const marker = statusType === 'normal' ? (
    <span className="w-2 h-2 rounded-full bg-[#2F6B3F] shrink-0" aria-hidden="true" />
  ) : (
    <span className="w-2 h-2 rounded-xs bg-[#B7791F] shrink-0" aria-hidden="true" />
  );

  return (
    <button
      type="button"
      id={id}
      onClick={onClick}
      disabled={disabled}
      title={description}
      aria-label={`${children}. ${description}${shortcutKey ? ` Shortcut: ${shortcutKey}` : ''}`}
      className={`inline-flex flex-col text-left p-3 rounded-xl border transition-all min-h-[44px] ${
        active
          ? 'border-[#1D1B16] bg-[#FFFFFF] ring-2 ring-[#1D1B16] shadow-sm'
          : 'border-[#E3DCCB] bg-[#FFFFFF] hover:border-[#1D1B16] hover:bg-[#FAF8F3]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      <div className="flex items-center justify-between w-full gap-2">
        <div className="flex items-center gap-2">
          {marker}
          <span className="font-sans font-semibold text-[13px] text-[#1D1B16]">{children}</span>
        </div>
        {shortcutKey && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F6F1E7] border border-[#E3DCCB] text-[#6B6559]">
            {shortcutKey}
          </span>
        )}
      </div>
      {description && (
        <span className="text-[11px] text-[#6B6559] mt-1 leading-snug line-clamp-1">
          {description}
        </span>
      )}
    </button>
  );
}

