"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileListProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileList({ children, className }: MobileListProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-surface divide-y divide-border/60 overflow-hidden shadow-2xs",
        className
      )}
    >
      {children}
    </div>
  );
}

interface MobileListItemProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  trailing?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  showChevron?: boolean;
}

export function MobileListItem({
  title,
  subtitle,
  icon,
  badge,
  trailing,
  href,
  onClick,
  className,
  showChevron = true,
}: MobileListItemProps) {
  const content = (
    <div
      className={cn(
        "flex items-center justify-between p-3.5 transition-colors active:bg-surface-secondary/70 gap-3 min-w-0",
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {icon && <div className="shrink-0">{icon}</div>}
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-primary truncate font-sans">
              {title}
            </span>
            {badge}
          </div>
          {subtitle && (
            <p className="text-[11px] text-text-tertiary truncate leading-snug">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {trailing}
        {showChevron && (
          <ChevronRight className="w-4 h-4 text-text-tertiary shrink-0" />
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none">
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left focus:outline-none"
      >
        {content}
      </button>
    );
  }

  return content;
}

export function MobileSectionHeader({
  title,
  action,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-1 mb-2 pt-2",
        className
      )}
    >
      <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono">
        {title}
      </h2>
      {action}
    </div>
  );
}

export function MobileActionBar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-30 p-3 bg-surface/95 backdrop-blur-md border-t border-border pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] md:hidden shadow-xl flex items-center gap-2",
        className
      )}
    >
      {children}
    </div>
  );
}
