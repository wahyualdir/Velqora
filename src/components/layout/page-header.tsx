import React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  /** Clean category/context at the top */
  eyebrow?: React.ReactNode;
  /** Main H1 heading title */
  title?: React.ReactNode;
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
  // If compound children are provided without standard props
  const hasDirectProps = title || description || actions || eyebrow || badge;

  return (
    <header
      className={cn(
        "space-y-3 sm:space-y-4",
        border && "pb-4 sm:pb-5 border-b border-border/80",
        className
      )}
    >
      {hasDirectProps ? (
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
            {title && (
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight font-display flex items-center gap-2 flex-wrap leading-snug">
                <span>{title}</span>
              </h1>
            )}

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
      ) : null}

      {/* Children Slot (e.g. Search Bars, Filter Chips, Sub-controls, or Compound slots) */}
      {children && <div className={hasDirectProps ? "pt-1" : ""}>{children}</div>}
    </header>
  );
}

// Compound components for flexibility
PageHeader.Title = function PageHeaderTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h1
      className={cn(
        "text-xl sm:text-2xl font-bold text-text-primary tracking-tight font-display flex items-center gap-2 flex-wrap leading-snug",
        className
      )}
    >
      {children}
    </h1>
  );
};

PageHeader.Description = function PageHeaderDescription({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={cn("text-xs sm:text-sm text-text-secondary leading-relaxed max-w-xl", className)}>
      {children}
    </p>
  );
};

PageHeader.Actions = function PageHeaderActions({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 shrink-0", className)}>
      {children}
    </div>
  );
};

PageHeader.Eyebrow = function PageHeaderEyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-secondary text-text-secondary border border-border/60", className)}>
      {children}
    </div>
  );
};
