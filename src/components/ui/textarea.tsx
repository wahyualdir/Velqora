"use client";

import React, { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  optional?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      id,
      optional = false,
      required,
      disabled,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const helperId = inputId ? `${inputId}-helper` : undefined;
    const errorId = inputId ? `${inputId}-error` : undefined;

    return (
      <div className="space-y-1.5 w-full text-left">
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
              className="block text-xs sm:text-sm font-medium text-text-secondary select-none"
            >
              {label}
              {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
            </label>
            {optional && (
              <span className="text-[11px] text-text-tertiary">Opsional</span>
            )}
          </div>
        )}

        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          disabled={disabled}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          aria-invalid={Boolean(error)}
          className={cn(
            "w-full rounded-xl border bg-surface px-3.5 py-2.5 text-xs sm:text-sm text-text-primary resize-y",
            "placeholder:text-text-tertiary leading-relaxed",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus:border-brand-500",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-secondary/40",
            "transition-all duration-150 shadow-2xs",
            error ? "border-red-500 focus-visible:ring-red-500/40" : "border-border hover:border-border-hover",
            className
          )}
          {...props}
        />

        {error ? (
          <p id={errorId} className="text-xs text-red-500 font-medium" role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-[11px] text-text-tertiary leading-normal">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
