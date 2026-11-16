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
  border: _border = true,
  className = "",
  children,
}: PageHeaderProps) {
  const hasDirectProps = title || description || actions || eyebrow || badge;

  return (
    <header
      className={cn(
        "rounded-2xl border border-[#E6E0D6] dark:border-[#24201E] bg-[#FFFFFF] dark:bg-[#141210] p-5 sm:p-6 shadow-2xs mb-5 transition-colors",
        className
      )}
    >
      {hasDirectProps ? (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          {/* Left Column: Context Eyebrow + Title + Subtitle */}
          <div className="space-y-1.5 min-w-0 max-w-2xl">
            {(eyebrow || badge) && (
              <div className="flex items-center flex-wrap gap-2 text-xs font-sans">
                {eyebrow && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FAF3EF] dark:bg-[#D4664A]/12 text-[#C2553A] dark:text-[#F09A82]">
                    {eyebrow}
                  </span>
                )}
                {badge && <div className="inline-flex items-center">{badge}</div>}
              </div>
            )}

            {title && (
              <h1 className="text-xl sm:text-2xl font-bold text-[#1C1917] dark:text-[#F5F5F4] tracking-tight font-display flex items-center gap-2 flex-wrap leading-tight">
                <span>{title}</span>
              </h1>
            )}

            {description && (
              <p className="text-xs sm:text-sm text-[#5C554E] dark:text-[#A8A29E] leading-relaxed max-w-2xl font-sans font-normal">
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
      {children && (
        <div className={hasDirectProps ? "pt-3.5 border-t border-border mt-3.5" : ""}>
          {children}
        </div>
      )}
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
        "text-xl sm:text-2xl font-bold text-text-primary tracking-tight font-display flex items-center gap-2 flex-wrap leading-tight",
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
    <p className={cn("text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl font-normal", className)}>
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
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20",
        className
      )}
    >
      {children}
    </div>
  );
};
