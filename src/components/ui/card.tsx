"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

// ========== Card Component (Tactile Dossier & Workspace Surface) ==========
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  interactive?: boolean;
  variant?: "default" | "subtle" | "elevated" | "outline" | "dossier" | "secondary";
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
        // Hover & interactive treatment
        isClickable &&
          "cursor-pointer hover:border-border-hover hover:bg-surface-hover/40 active:scale-[0.998]",
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
      className={cn("flex flex-col space-y-1 p-4 sm:p-4.5 lg:p-5 pb-2 sm:pb-2.5", className)}
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
        "text-sm sm:text-[15px] font-bold text-text-primary tracking-tight font-display leading-snug",
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
    <div className={cn("p-4 sm:p-4.5 lg:p-5 pt-0", className)} {...props}>
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
        "flex items-center justify-between p-4 sm:p-4.5 lg:p-5 pt-2.5 sm:pt-3 border-t border-border/60 text-xs text-text-secondary gap-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ========== Badge (Refined Typography & Semantic Palette) ==========
export interface BadgeProps {
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
  isMono?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  isMono = false,
  size = "md",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-surface-secondary text-text-secondary border-border/80 hover:bg-surface-tertiary",
    neutral: "bg-surface-tertiary text-text-secondary border-border",
    secondary: "bg-surface-secondary text-text-secondary border-border/70",
    brand: "bg-brand-500/10 text-brand-400 border-brand-500/25 dark:text-brand-300",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
    danger: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25",
    info: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/25",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25",
    outline: "bg-transparent text-text-secondary border-border",
  };

  const sizes = {
    sm: "px-1.5 py-0.5 text-[10px] gap-1",
    md: "px-2 py-0.5 text-[11px] gap-1.5",
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
    >
      {children}
    </span>
  );
}

// ========== Modal (StudyVault Focused Dialog) ==========
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, size = "md", maxWidth }: ModalProps) {
  if (!isOpen) return null;

  const sizes = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-lg",
    lg: "sm:max-w-2xl",
    xl: "sm:max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />
      {/* Content Container */}
      <div
        className={cn(
          "relative bg-surface rounded-t-2xl sm:rounded-2xl border border-border shadow-2xl w-full max-h-[90dvh] sm:max-h-[85vh] animate-fade-in overflow-hidden flex flex-col mx-auto",
          maxWidth || sizes[size]
        )}
      >
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-border bg-surface-secondary/40 shrink-0">
          <h2 className="text-sm sm:text-base font-bold text-text-primary tracking-tight font-display truncate pr-2">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-secondary shrink-0 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
            aria-label="Tutup dialog"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 overflow-y-auto overscroll-contain scrollbar-thin flex-1 safe-area-bottom">
          {children}
        </div>
      </div>
    </div>
  );
}

// ========== Confirm Dialog ==========
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  description?: string;
  confirmText?: string;
  variant?: "danger" | "default";
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  description,
  confirmText = "Hapus",
  variant,
  loading,
}: ConfirmDialogProps) {
  if (!isOpen) return null;
  const displayMessage = message || description || "";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-surface rounded-t-2xl sm:rounded-2xl border border-border shadow-2xl w-full sm:max-w-sm animate-fade-in p-4 sm:p-5">
        <h3 className="text-sm sm:text-base font-bold text-text-primary mb-1.5 font-display">{title}</h3>
        <p className="text-xs text-text-secondary mb-4 leading-relaxed">{displayMessage}</p>
        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-text-secondary hover:text-text-primary rounded-lg border border-border hover:bg-surface-secondary transition-colors cursor-pointer min-h-[38px]"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-white bg-accent-red hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-xs min-h-[38px]"
          >
            {loading ? "Menghapus..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// ========== Skeleton ==========
export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("skeleton rounded-lg", className)} />;
}

// ========== Empty State ==========
export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-8 sm:py-12 px-4 text-center rounded-xl border border-dashed border-border bg-surface-secondary/30", className)}>
      {icon && <div className="mb-2.5 text-text-tertiary">{icon}</div>}
      <h3 className="text-sm sm:text-base font-bold text-text-primary mb-1 font-display">{title}</h3>
      <p className="text-xs sm:text-sm text-text-secondary mb-4 max-w-md leading-relaxed">{description}</p>
      {action}
    </div>
  );
}
