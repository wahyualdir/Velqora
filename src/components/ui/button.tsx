"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020617] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98] select-none";

    const variants = {
      primary:
        "bg-brand-600 text-white hover:bg-brand-500 shadow-2xs border border-brand-500/40",
      secondary:
        "bg-surface-tertiary text-text-primary hover:bg-surface-hover border border-border",
      danger:
        "bg-accent-red text-white hover:bg-red-600 focus-visible:ring-red-500 shadow-2xs border border-red-500/30",
      ghost:
        "text-text-secondary hover:bg-surface-tertiary hover:text-text-primary",
      outline:
        "border border-border text-text-primary hover:bg-surface-tertiary hover:border-border-hover",
    };

    const sizes = {
      sm: "px-3 py-1.5 min-h-[34px] sm:min-h-[32px] text-xs gap-1.5",
      md: "px-4 py-2 min-h-[40px] sm:min-h-[38px] text-xs sm:text-sm gap-2",
      lg: "px-5 py-2.5 min-h-[44px] sm:min-h-[42px] text-sm sm:text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-3.5 w-3.5 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
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
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };

