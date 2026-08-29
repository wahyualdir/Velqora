import React from "react";

export interface PageHeaderProps {
  /** Clean category/context at the top */
  eyebrow?: React.ReactNode;
  /** Main H1 heading title */
  title: React.ReactNode;
  /** Conversational, clear subtitle */
  description?: React.ReactNode;
  /** Right-aligned or bottom action buttons/switches */
  actions?: React.ReactNode;
  /** Optional status pill or counter badge next to title/eyebrow */
  badge?: React.ReactNode;
  /** Deprecated technical mark prop (kept for backward compatibility, unused) */
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
        <div className="space-y-1 min-w-0 max-w-2xl">
          {/* Context Eyebrow & Badges */}
          {(eyebrow || badge) && (
            <div className="flex items-center flex-wrap gap-2 text-xs text-text-tertiary">
              {eyebrow && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-secondary text-text-secondary border border-border/60">
                  {eyebrow}
                </span>
              )}
              {badge && <div className="inline-flex items-center">{badge}</div>}
            </div>
          )}

          {/* Main Title H1 */}
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight font-display flex items-center gap-2 flex-wrap leading-snug">
            <span>{title}</span>
          </h1>

          {/* Subtitle */}
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

