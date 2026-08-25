import React from "react";
import { Terminal } from "lucide-react";

export interface PageHeaderProps {
  /** Small path/category context at the top, e.g. '~/workspace' or '01 / silabus' */
  eyebrow?: React.ReactNode;
  /** Main H1 heading title */
  title: React.ReactNode;
  /** Conversational, fresh subtitle */
  description?: React.ReactNode;
  /** Right-aligned or bottom action buttons/switches */
  actions?: React.ReactNode;
  /** Optional status pill or counter badge next to title/eyebrow */
  badge?: React.ReactNode;
  /** Optional technical mark string e.g. '< dev />' or '[ 01 ]' */
  technicalMark?: string;
  /** Whether to show a subtle bottom separator border */
  border?: boolean;
  /** Custom outer container className */
  className?: string;
  /** Children element rendered under header (e.g. search console, quick filters) */
  children?: React.ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  badge,
  technicalMark,
  border = true,
  className = "",
  children,
}: PageHeaderProps) {
  return (
    <div
      className={`space-y-3 sm:space-y-4 ${
        border ? "pb-4 sm:pb-5 border-b border-border/80" : ""
      } ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
        {/* Left Column: Context Eyebrow + Title + Subtitle */}
        <div className="space-y-1.5 min-w-0 max-w-2xl">
          {/* Eyebrow & Technical Marks */}
          {(eyebrow || technicalMark || badge) && (
            <div className="flex items-center flex-wrap gap-2 text-[11px] font-mono text-text-tertiary">
              {eyebrow && (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-secondary border border-border text-text-secondary font-medium tracking-tight">
                  <Terminal className="w-3 h-3 text-brand-400 shrink-0" />
                  <span>{eyebrow}</span>
                </div>
              )}
              {technicalMark && (
                <span className="text-[10px] text-text-tertiary font-mono hidden xs:inline">
                  {technicalMark}
                </span>
              )}
              {badge && <div className="inline-flex items-center">{badge}</div>}
            </div>
          )}

          {/* Main Title H1 */}
          <h1 className="text-lg sm:text-2xl md:text-[26px] font-bold text-text-primary tracking-tight font-display flex items-center gap-2 flex-wrap leading-snug">
            <span>{title}</span>
          </h1>

          {/* Fresh Natural Subtitle */}
          {description && (
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-xl">
              {description}
            </p>
          )}
        </div>

        {/* Right Column: Actions / Tools */}
        {actions && (
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto self-start sm:self-end shrink-0 pt-1 sm:pt-0">
            {actions}
          </div>
        )}
      </div>

      {/* Children Slot (e.g. Search Bars, Filter Chips, Sub-controls) */}
      {children && <div className="pt-1">{children}</div>}
    </div>
  );
}
