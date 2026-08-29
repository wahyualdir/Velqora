"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?:
    | "default"
    | "neutral"
    | "brand"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "purple"
    | "secondary"
    | "outline";
  size?: "sm" | "md" | "lg";
  isMono?: boolean;
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  isMono = false,
  dot = false,
  className,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-surface-secondary text-text-secondary border-border hover:bg-surface-tertiary",
    neutral: "bg-surface-tertiary text-text-secondary border-border",
    secondary: "bg-surface-secondary text-text-secondary border-border/80",
    brand: "bg-brand-500/10 text-brand-400 border-brand-500/25 dark:text-brand-300",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
    danger: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25",
    info: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25",
    outline: "bg-transparent text-text-secondary border-border",
  };

  const sizes = {
    sm: "px-1.5 py-0.5 text-[10px] gap-1",
    md: "px-2 py-0.5 text-xs gap-1.5",
    lg: "px-2.5 py-1 text-xs gap-1.5 font-semibold",
  };

  const dotColors = {
    default: "bg-text-tertiary",
    neutral: "bg-text-tertiary",
    secondary: "bg-text-tertiary",
    brand: "bg-brand-400",
    success: "bg-emerald-400",
    warning: "bg-amber-400",
    danger: "bg-red-400",
    info: "bg-sky-400",
    purple: "bg-purple-400",
    outline: "bg-text-secondary",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium border tracking-tight transition-colors select-none shrink-0",
        isMono && "font-mono uppercase text-[10px] tracking-wider font-semibold",
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
