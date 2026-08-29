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

// ========== Card Component (Flat-First Academic Container) ==========
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  interactive?: boolean;
  variant?: "default" | "subtle" | "elevated" | "outline" | "secondary" | "dossier";
  onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
}

export function Card({
  children,
  className,
  hover = false,
  interactive = false,
  variant = "default",
  onClick,
  style,
  ...props
}: CardProps) {
  const isClickable = Boolean(onClick || hover || interactive);

  const variantStyles = {
    default: "bg-surface border-border shadow-2xs",
    subtle: "bg-surface-secondary/70 border-border/80",
    elevated: "bg-surface border-border shadow-xs dark:shadow-black/30",
    outline: "bg-transparent border-border",
    secondary: "bg-surface-secondary border-border",
    dossier: "bg-surface border-border",
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
        isClickable &&
          "cursor-pointer hover:border-border-hover hover:bg-surface-hover/40 active:scale-[0.998] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        className
      )}
      {...props}
    >
      {children}
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
