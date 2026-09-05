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
        "vt-window rounded-none overflow-hidden shadow-xs mb-4 sm:mb-6",
        className
      )}
    >
      {/* Retro OS Titlebar */}
      <div className="vt-titlebar px-3 py-1.5 flex items-center justify-between select-none">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#FAF8F5]/80 shrink-0" />
          <span className="font-mono text-xs font-bold tracking-wide text-white truncate uppercase">
            {typeof eyebrow === "string"
              ? `${eyebrow.toUpperCase()} // VELQORA OS`
              : "SYSTEM CONSOLE // VELQORA OS"}
          </span>
        </div>
        {/* Window Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="vt-window-btn text-[10px] select-none">_</span>
          <span className="vt-window-btn text-[10px] select-none font-sans">□</span>
          <span className="vt-window-btn vt-window-btn-close text-[10px] select-none">×</span>
        </div>
      </div>

      {/* Header Inner Body */}
      <div className="p-4 sm:p-5 bg-[#FAF8F5] space-y-3">
        {hasDirectProps ? (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
            {/* Left Column: Context Eyebrow + Title + Subtitle */}
            <div className="space-y-1 min-w-0 max-w-2xl">
              {/* Context Eyebrow & Badges */}
              {(eyebrow || badge) && (
                <div className="flex items-center flex-wrap gap-2 text-xs font-mono text-[#853827]">
                  {eyebrow && (
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase bg-[#FAF3EF] text-[#C2553A] border border-[#C2553A]/30">
                      {eyebrow}
                    </span>
                  )}
                  {badge && <div className="inline-flex items-center">{badge}</div>}
                </div>
              )}

              {/* Main Title H1 */}
              {title && (
                <h1 className="text-xl sm:text-2xl font-bold text-[#1C1917] tracking-tight font-sans flex items-center gap-2 flex-wrap leading-snug">
                  <span>{title}</span>
                </h1>
              )}

              {/* Subtitle */}
              {description && (
                <p className="text-xs sm:text-sm text-[#524B42] leading-relaxed max-w-xl">
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
        {children && <div className={hasDirectProps ? "pt-2 border-t border-[#7A756D]/20" : ""}>{children}</div>}
      </div>

      {/* Retro Status Bar at Bottom of Header */}
      <div className="px-3 py-1 bg-[#ECE9D8] border-t-2 border-[#FFFFFF] flex items-center justify-between text-[11px] font-mono text-[#524B42] select-none">
        <span className="flex items-center gap-1.5 truncate">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          <span>STATUS: ACTIVE · SYSTEM VERIFIED</span>
        </span>
        <span className="text-[#8A8378] hidden sm:inline text-[10px]">VELQORA_KERNEL · 64-BIT</span>
      </div>
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
        "text-xl sm:text-2xl font-bold text-[#1C1917] tracking-tight font-sans flex items-center gap-2 flex-wrap leading-snug",
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
    <p className={cn("text-xs sm:text-sm text-[#524B42] leading-relaxed max-w-xl", className)}>
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
    <div className={cn("inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase bg-[#FAF3EF] text-[#C2553A] border border-[#C2553A]/30", className)}>
      {children}
    </div>
  );
};
