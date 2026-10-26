'use client';

import React from 'react';

interface CardFooterProps {
  title: string;
  description: string;
  linkText?: string;
  linkHref?: string;
  onLinkClick?: () => void;
  className?: string;
}

export function CardFooter({
  title,
  description,
  linkText = 'Learn more',
  linkHref = '#',
  onLinkClick,
  className = '',
}: CardFooterProps) {
  return (
    <div className={`pt-4 mt-auto border-t border-[var(--ps-card-border,#EBEAEB)] flex items-end justify-between gap-3 ${className}`}>
      <div>
        <h3 className="text-[16px] font-[500] text-[var(--ps-ink,#1D1A1A)] leading-snug">
          {title}
        </h3>
        <p className="text-[#656565] dark:text-[#A8A29E] text-[14px] md:text-[15px] leading-relaxed mt-0.5">
          {description}
        </p>
      </div>

      {linkText && (
        <a
          href={linkHref}
          onClick={(e) => {
            if (onLinkClick) {
              e.preventDefault();
              onLinkClick();
            }
          }}
          className="group inline-flex items-center text-[13px] font-[500] text-[var(--ps-ink,#1D1A1A)] hover:opacity-80 transition-opacity whitespace-nowrap shrink-0"
        >
          <span>{linkText}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="inline-block ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          >
            <path
              d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      )}
    </div>
  );
}
