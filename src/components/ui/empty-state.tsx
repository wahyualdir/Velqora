"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-10 sm:py-16 px-4 text-center rounded-xl border border-dashed border-border bg-surface-secondary/20",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-3.5 flex items-center justify-center w-12 h-12 rounded-xl bg-surface-tertiary border border-border text-text-secondary">
          {icon}
        </div>
      )}
      <h3 className="text-sm sm:text-base font-semibold text-text-primary mb-1.5 font-display tracking-tight">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-text-secondary mb-5 max-w-md leading-relaxed">
        {description}
      </p>
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
