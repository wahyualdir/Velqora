"use client";

import { cn } from "@/lib/utils";
import React, { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "danger"
    | "link"
    | "icon";
  size?: "sm" | "md" | "lg" | "icon-sm" | "icon-md" | "icon-lg";
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const isLink = variant === "link";

    const baseStyles = cn(
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 select-none cursor-pointer",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]",
      "touch-manipulation"
    );

    const variants = {
      primary:
        "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 border border-brand-500/30 shadow-2xs",
      secondary:
        "bg-surface-tertiary text-text-primary hover:bg-surface-hover active:bg-surface border border-border",
      outline:
        "bg-transparent text-text-primary hover:bg-surface-tertiary active:bg-surface-hover border border-border hover:border-border-hover",
      ghost:
        "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-tertiary active:bg-surface-hover",
      destructive:
        "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border border-red-500/30 shadow-2xs",
      danger:
        "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border border-red-500/30 shadow-2xs",
      link: "bg-transparent text-brand-500 hover:text-brand-400 hover:underline p-0 min-h-0 h-auto rounded-none border-0 shadow-none",
      icon: "bg-surface-secondary text-text-secondary hover:text-text-primary hover:bg-surface-tertiary border border-border p-2",
    };

    const sizes = {
      sm: "px-2.5 py-1.5 min-h-[34px] text-xs gap-1.5",
      md: "px-3.5 py-2 min-h-[40px] sm:min-h-[38px] text-xs sm:text-sm gap-2",
      lg: "px-5 py-2.5 min-h-[44px] text-sm sm:text-base gap-2.5 font-semibold",
      "icon-sm": "w-8 h-8 min-h-[32px] min-w-[32px] p-1.5 gap-0",
      "icon-md": "w-10 h-10 min-h-[40px] min-w-[40px] sm:min-h-[38px] sm:min-w-[38px] p-2 gap-0",
      "icon-lg": "w-11 h-11 min-h-[44px] min-w-[44px] p-2.5 gap-0",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          !isLink && sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-3.5 w-3.5 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
