"use client";

import { cn } from "@/lib/utils";
import React, { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { X } from "lucide-react";
export { Textarea } from "./textarea";
export type { TextareaProps } from "./textarea";
export { Select } from "./select";
export type { SelectProps, SelectOption, SelectGroup } from "./select";

// ========== Input Component ==========
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  onClear?: () => void;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  optional?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      id,
      onClear,
      value,
      startIcon,
      endIcon,
      optional = false,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasValue = value !== undefined && value !== null && String(value).length > 0;
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

        <div className="relative flex items-center w-full">
          {startIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-text-tertiary">
              {startIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            value={value}
            disabled={disabled}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            aria-invalid={Boolean(error)}
            className={cn(
              "w-full h-10 min-h-[40px] rounded-xl border bg-surface px-3.5 py-2 text-xs sm:text-sm text-text-primary",
              "placeholder:text-text-tertiary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus:border-brand-500",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-secondary/40",
              "transition-all duration-150 shadow-2xs",
              startIcon ? "pl-9" : "",
              (onClear && hasValue) || endIcon ? "pr-9" : "",
              error ? "border-red-500 focus-visible:ring-red-500/40" : "border-border hover:border-border-hover",
              className
            )}
            {...props}
          />

          {onClear && hasValue && !disabled && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-2 p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors shrink-0 cursor-pointer min-h-[30px] min-w-[30px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              title="Hapus teks"
              aria-label="Hapus teks"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {endIcon && !(onClear && hasValue) && (
            <div className="absolute right-3 flex items-center pointer-events-none text-text-tertiary">
              {endIcon}
            </div>
          )}
        </div>

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

Input.displayName = "Input";
