"use client";

import React, { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked,
      onCheckedChange,
      label,
      description,
      disabled = false,
      id,
      className,
    },
    ref
  ) => {
    const inputId = id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const handleToggle = () => {
      if (!disabled) {
        onCheckedChange(!checked);
      }
    };

    return (
      <div className="flex items-center justify-between gap-4 text-left select-none">
        {(label || description) && (
          <label
            htmlFor={inputId}
            className={cn("flex flex-col cursor-pointer", disabled && "opacity-50 cursor-not-allowed")}
            onClick={handleToggle}
          >
            {label && (
              <span className="text-xs sm:text-sm font-medium text-text-primary leading-tight">
                {label}
              </span>
            )}
            {description && (
              <span className="text-[11px] text-text-secondary leading-normal mt-0.5">
                {description}
              </span>
            )}
          </label>
        )}

        <button
          ref={ref}
          type="button"
          id={inputId}
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              handleToggle();
            }
          }}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            checked ? "bg-brand-600" : "bg-surface-tertiary border-border",
            className
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
              checked ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
      </div>
    );
  }
);

Switch.displayName = "Switch";
