"use client";

import React from "react";
import { Search, X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Toolbar({ className, children, ...props }: ToolbarProps) {
  return (
    <div
      className={cn(
        "space-y-3 p-3.5 sm:p-4 rounded-xl border border-border bg-surface shadow-2xs",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Search sub-component
export function ToolbarSearch({
  value,
  onChange,
  placeholder = "Cari...",
  className,
  onClear,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  onClear?: () => void;
}) {
  return (
    <div className={cn("relative flex items-center", className)}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2 min-h-[40px] rounded-xl border border-border bg-surface-secondary/70 text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-500 transition-colors font-medium"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            onClear?.();
          }}
          className="absolute right-2.5 p-1 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
          title="Hapus kata kunci pencarian"
          aria-label="Hapus kata kunci pencarian"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

// Filter Row Container
export function ToolbarFilterRow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2.5 justify-between pt-1",
        className
      )}
    >
      {children}
    </div>
  );
}

// Filter Button Pill
export function ToolbarFilterButton({
  active,
  onClick,
  children,
  className,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5",
        active
          ? "bg-brand-600 text-white shadow-xs"
          : "bg-surface-secondary/70 hover:bg-surface-secondary text-text-secondary hover:text-text-primary border border-border/80",
        className
      )}
    >
      <span>{children}</span>
      {typeof count === "number" && (
        <span
          className={cn(
            "text-[10px] px-1.5 py-0.2 rounded-full",
            active ? "bg-white/20 text-white" : "bg-surface-tertiary text-text-tertiary"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// Reset Filters Button
export function ToolbarResetButton({
  onClick,
  label = "Reset filter",
  className,
}: {
  onClick: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={onClick}
      className={cn(
        "gap-1 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 min-h-[36px]",
        className
      )}
    >
      <RotateCcw className="w-3 h-3" />
      <span>{label}</span>
    </Button>
  );
}

// Compound API assignment
Toolbar.Search = ToolbarSearch;
Toolbar.FilterRow = ToolbarFilterRow;
Toolbar.FilterButton = ToolbarFilterButton;
Toolbar.ResetButton = ToolbarResetButton;
