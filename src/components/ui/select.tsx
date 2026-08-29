"use client";

import React, { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: SelectOption[];
  groups?: SelectGroup[];
  placeholder?: string;
  optional?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      id,
      options = [],
      groups,
      placeholder,
      optional = false,
      required,
      disabled,
      children,
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

        <div className="relative w-full">
          <select
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            aria-invalid={Boolean(error)}
            className={cn(
              "w-full h-10 min-h-[40px] rounded-xl border bg-surface px-3.5 pr-9 py-2 text-xs sm:text-sm text-text-primary appearance-none cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus:border-brand-500",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-secondary/40",
              "transition-all duration-150 shadow-2xs",
              error ? "border-red-500 focus-visible:ring-red-500/40" : "border-border hover:border-border-hover",
              className
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {children
              ? children
              : groups
              ? groups.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        disabled={opt.disabled}
                      >
                        {opt.label}
                      </option>
                    ))}
                  </optgroup>
                ))
              : options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                  >
                    {opt.label}
                  </option>
                ))}
          </select>

          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none"
            aria-hidden="true"
          />
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

Select.displayName = "Select";
