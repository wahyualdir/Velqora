"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: "info" | "success" | "warning" | "danger" | "neutral";
  title?: ReactNode;
  children?: ReactNode;
  icon?: ReactNode;
  onClose?: () => void;
  className?: string;
}

export function Alert({
  variant = "info",
  title,
  children,
  icon,
  onClose,
  className,
  ...props
}: AlertProps) {
  const defaultIcons = {
    info: <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />,
    danger: <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />,
    neutral: <Info className="w-4 h-4 text-text-secondary shrink-0 mt-0.5" />,
  };

  const variants = {
    info: "bg-sky-500/10 border-sky-500/25 text-text-primary",
    success: "bg-emerald-500/10 border-emerald-500/25 text-text-primary",
    warning: "bg-amber-500/10 border-amber-500/25 text-text-primary",
    danger: "bg-red-500/10 border-red-500/25 text-text-primary",
    neutral: "bg-surface-secondary border-border text-text-primary",
  };

  const selectedIcon = icon !== undefined ? icon : defaultIcons[variant];

  return (
    <div
      role="alert"
      className={cn(
        "relative flex items-start gap-3 rounded-xl border p-3.5 sm:p-4 text-left transition-all duration-150",
        variants[variant],
        className
      )}
      {...props}
    >
      {selectedIcon && <div className="shrink-0">{selectedIcon}</div>}

      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="text-xs sm:text-sm font-semibold tracking-tight leading-snug mb-0.5">
            {title}
          </h4>
        )}
        {children && (
          <div className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {children}
          </div>
        )}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-text-tertiary hover:text-text-primary transition-colors p-1 rounded-md hover:bg-surface-secondary/60 shrink-0 cursor-pointer"
          aria-label="Tutup notifikasi"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
