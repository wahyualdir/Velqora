"use client";

import React, { InputHTMLAttributes, forwardRef, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Check, Minus } from "lucide-react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  indeterminate?: boolean;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      description,
      indeterminate = false,
      error,
      checked,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const inputId = id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return (
      <div className="flex items-start gap-2.5 select-none text-left">
        <div className="relative flex items-center justify-center shrink-0 mt-0.5">
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
            type="checkbox"
            id={inputId}
            checked={checked}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all duration-150 cursor-pointer",
              "border-border bg-surface hover:border-border-hover peer-hover:border-border-hover",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
              "peer-checked:bg-brand-600 peer-checked:border-brand-600 peer-checked:text-white",
              "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:bg-surface-secondary/40",
              error ? "border-red-500" : "",
              className
            )}
          >
            {indeterminate ? (
              <Minus className="w-3 h-3 text-white stroke-[3]" />
            ) : checked ? (
              <Check className="w-3 h-3 text-white stroke-[3]" />
            ) : null}
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

Checkbox.displayName = "Checkbox";
