"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

// ── Master Page Container (Max-width 1440px / 90rem) ──
export function PageContainer({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ── Focused Content Container (Max-width 1024px / 64rem) ──
export function ContentContainer({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "w-full max-w-5xl mx-auto px-4 sm:px-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ── Academic Reading Container (Max-width 768px / 48rem, optimal reading line-length) ──
export function ReadingContainer({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "w-full max-w-3xl mx-auto px-4 sm:px-6 leading-relaxed",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ── Structured Page Section with predictable vertical spacing ──
export function PageSection({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn("space-y-4 mb-6 sm:mb-8 last:mb-0", className)}
      {...props}
    >
      {children}
    </section>
  );
}

// ── Section Header with Title, Description, and Action slot ──
export interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export function SectionHeader({
  title,
  description,
  action,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-border/50",
        className
      )}
      {...props}
    >
      <div>
        <h3 className="text-sm sm:text-base font-bold text-text-primary tracking-tight font-display">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-text-secondary mt-0.5 leading-normal">
            {description}
          </p>
        )}
      </div>

      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
}
