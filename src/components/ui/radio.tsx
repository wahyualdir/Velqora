"use client";

import React, { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
  description?: ReactNode;
  error?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      label,
      description,
      error,
      checked,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex items-start gap-2.5 select-none text-left">
        <div className="relative flex items-center justify-center shrink-0 mt-0.5">
          <input
            ref={ref}
            type="radio"
            id={inputId}
            checked={checked}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all duration-150 cursor-pointer",
              "border-border bg-surface hover:border-border-hover peer-hover:border-border-hover",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
              "peer-checked:border-brand-600",
              "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:bg-surface-secondary/40",
              error ? "border-red-500" : "",
              className
            )}
          >
            {checked && (
              <div className="w-2 h-2 rounded-full bg-brand-600" />
            )}
          </div>
        </div>

        {(label || description) && (
          <label htmlFor={inputId} className="flex flex-col cursor-pointer">
            {label && (
              <span
                className={cn(
                  "text-xs sm:text-sm font-medium text-text-primary leading-tight",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {label}
              </span>
            )}
            {description && (
              <span className="text-[11px] text-text-secondary leading-normal mt-0.5">
                {description}
              </span>
            )}
            {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
          </label>
        )}
      </div>
    );
  }
);

Radio.displayName = "Radio";

export function RadioGroup({
  label,
  helperText,
  error,
  children,
  className,
}: {
  label?: string;
  helperText?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={cn("space-y-2 text-left", className)}>
      {label && (
        <legend className="text-xs sm:text-sm font-medium text-text-secondary mb-1">
          {label}
        </legend>
      )}
      <div className="space-y-2">{children}</div>
      {error ? (
        <p className="text-xs text-red-500 font-medium mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-text-tertiary mt-1">{helperText}</p>
      ) : null}
    </fieldset>
  );
}
