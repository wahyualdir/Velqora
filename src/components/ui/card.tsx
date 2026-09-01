"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

// Re-export dedicated primitives for 100% backward compatibility
export { Badge } from "./badge";
export type { BadgeProps } from "./badge";
export { Modal, ConfirmDialog } from "./modal";
export type { ModalProps, ConfirmDialogProps } from "./modal";
export { Skeleton } from "./skeleton";
export type { SkeletonProps } from "./skeleton";
export { EmptyState } from "./empty-state";
export type { EmptyStateProps } from "./empty-state";

import Link from "next/link";

// ========== Card Component (Flat-First Academic Container) ==========
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  variant?: "default" | "subtle" | "focus" | "elevated" | "outline" | "secondary" | "interactive" | "dossier";
  onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
}

export function Card({
  children,
  className,
  hover = false,
  interactive = false,
  padding = "none",
  variant = "default",
  onClick,
  style,
  ...props
}: CardProps) {
  const isClickable = Boolean(onClick || hover || interactive || variant === "interactive");

  const variantStyles = {
    default: "bg-surface border-border shadow-2xs",
    subtle: "bg-surface-secondary/70 border-border/80",
    focus: "bg-surface border-border border-l-4 border-l-brand-500 shadow-xs",
    elevated: "bg-surface border-border shadow-xs dark:shadow-black/30",
    outline: "bg-transparent border-border",
    secondary: "bg-surface-secondary border-border",
    interactive: "bg-surface border-border shadow-2xs hover:border-brand-500/40 hover:bg-surface-secondary/40",
    dossier: "bg-surface border-border",
  };

  const paddingStyles = {
    none: "",
    sm: "p-3 sm:p-3.5",
    md: "p-4 sm:p-5",
    lg: "p-5 sm:p-6",
  };

  return (
    <div
      onClick={onClick}
      style={style}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        "rounded-xl border transition-all duration-150 text-text-primary",
        "relative overflow-hidden",
        variantStyles[variant],
        paddingStyles[padding],
        isClickable &&
          "cursor-pointer hover:border-brand-500/40 hover:bg-surface-secondary/30 active:scale-[0.998] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ========== CardStat (Symmetrical Metric/KPI Primitive) ==========
export interface CardStatProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  badge?: React.ReactNode;
  href?: string;
  variant?: "default" | "subtle" | "secondary";
  className?: string;
  isMono?: boolean;
}

export function CardStat({
  icon: Icon,
  label,
  value,
  hint,
  badge,
  href,
  variant = "default",
  className,
  isMono = false,
  ...props
}: CardStatProps) {
  const content = (
    <div className="h-full flex flex-col justify-between space-y-2 select-none">
      {/* Header: Label & Neutral Icon */}
      <div className="flex items-center justify-between gap-1.5 text-text-tertiary">
        <span className="text-xs font-medium text-text-secondary truncate">
          {label}
        </span>
        {Icon && (
          <Icon className="w-4 h-4 shrink-0 text-text-tertiary group-hover:text-brand-500 transition-colors duration-150" />
        )}
      </div>

      {/* Body: Value, Hint, or Badge */}
      <div className="pt-1 flex items-baseline justify-between gap-2 flex-wrap">
        <div className="flex items-baseline gap-1.5">
          <span
            className={cn(
              "text-xl sm:text-2xl font-bold tracking-tight text-text-primary",
              isMono ? "font-mono" : "font-display"
            )}
          >
            {value}
          </span>
        </div>

        {badge ? (
          <div className="shrink-0">{badge}</div>
        ) : hint ? (
          <span className="text-[11px] text-text-secondary leading-tight truncate">
            {hint}
          </span>
        ) : null}
      </div>
    </div>
  );

  const cardClasses = cn(
    "p-3.5 sm:p-4 rounded-xl border border-border bg-surface transition-all shadow-2xs h-full flex flex-col justify-between",
    href && "group hover:border-brand-500/40 hover:bg-surface-secondary/40 cursor-pointer active:scale-[0.995]",
    variant === "subtle" && "bg-surface-secondary/60 border-border/70",
    variant === "secondary" && "bg-surface-secondary border-border",
    className
  );

  if (href) {
    return (
      <Link href={href} className={cardClasses}>
        {content}
      </Link>
    );
  }

  return (
    <div className={cardClasses} {...props}>
      {content}
    </div>
  );
}

// ========== Card Subcomponents ==========
export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1 p-4 sm:p-5 pb-2 sm:pb-2.5", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-sm sm:text-base font-bold text-text-primary tracking-tight font-display leading-snug",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-xs sm:text-[13px] text-text-secondary leading-relaxed line-clamp-2",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4 sm:p-5 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 sm:p-5 pt-2.5 sm:pt-3 border-t border-border/60 text-xs text-text-secondary gap-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
