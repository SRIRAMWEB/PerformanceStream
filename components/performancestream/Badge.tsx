'use client';

import React from 'react';

export type BadgeVariant = 'trusted' | 'quarantined' | 'rejected' | 'skipped' | 'checking' | 'idle' | 'attack' | 'normal';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  isStamp?: boolean;
}

export function Badge({ variant, children, className = '', isStamp = false }: BadgeProps) {
  let colorClasses = 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]';

  switch (variant) {
    case 'trusted':
    case 'normal':
      colorClasses = 'bg-[var(--ps-trusted-bg,#F1FDF4)] text-[var(--ps-trusted-text,#16A24B)] border-[var(--ps-trusted-border,#BBF7D0)]';
      break;
    case 'quarantined':
      colorClasses = 'bg-[var(--ps-quarantine-bg,#FFF7ED)] text-[var(--ps-quarantine-text,#C25E09)] border-[var(--ps-quarantine-border,#FED7AA)]';
      break;
    case 'rejected':
    case 'attack':
      colorClasses = 'bg-[var(--ps-reject-bg,#FEF2F2)] text-[var(--ps-reject-text,#DC2626)] border-[var(--ps-reject-border,#FECACA)]';
      break;
    case 'checking':
      colorClasses = 'bg-[var(--ps-inner-panel,#F9F8F8)] text-[var(--ps-ink,#1D1A1A)] border-[var(--ps-ink,#1D1A1A)]';
      break;
    case 'skipped':
    case 'idle':
    default:
      colorClasses = 'bg-[var(--ps-skipped-bg,#F3F4F6)] text-[var(--ps-skipped-text,#6B7280)] border-[var(--ps-skipped-border,#E5E7EB)]';
      break;
  }

  const stampClasses = isStamp
    ? 'text-[11px] font-[700] uppercase tracking-wider -rotate-2 border-[1.5px] shadow-sm transform transition-transform'
    : 'text-[12px] font-[500] border';

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full font-mono ${stampClasses} ${colorClasses} ${className}`}
    >
      {children}
    </span>
  );
}

export function FilterPill({
  label,
  active = false,
  onClick,
  className = '',
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-mono rounded-md border transition-colors ${
        active
          ? 'bg-[var(--ps-ink,#1D1A1A)] text-[var(--ps-card,#FFFFFF)] border-[var(--ps-ink,#1D1A1A)]'
          : 'bg-[var(--ps-inner-panel,#F9F8F8)] text-[var(--ps-muted,#656565)] border-[var(--ps-panel-border,#F1F1F1)] hover:border-[var(--ps-card-border,#EBEAEB)]'
      } ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </button>
  );
}
