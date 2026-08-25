"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, forwardRef } from "react";
import { X } from "lucide-react";

// ========== Input ==========
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  onClear?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, onClear, value, ...props }, ref) => {
    const hasValue = value !== undefined && value !== null && String(value).length > 0;
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label htmlFor={id} className="block text-xs sm:text-sm font-semibold text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          <input
            ref={ref}
            id={id}
            value={value}
            className={cn(
              "w-full h-10 min-h-[40px] rounded-xl border bg-surface px-3.5 py-2 text-xs sm:text-sm text-text-primary",
              "placeholder:text-text-tertiary",
              "focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500",
              "transition-all duration-150 shadow-2xs",
              onClear && hasValue ? "pr-9" : "",
              error ? "border-accent-red" : "border-border hover:border-border-hover",
              className
            )}
            {...props}
          />
          {onClear && hasValue && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-2 p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors shrink-0 cursor-pointer min-h-[30px] min-w-[30px] flex items-center justify-center"
              title="Hapus teks"
              aria-label="Hapus teks"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {error && <p className="text-xs text-accent-red mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

// ========== Textarea ==========
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label htmlFor={id} className="block text-xs sm:text-sm font-semibold text-text-secondary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          rows={4}
          className={cn(
            "w-full rounded-xl border bg-surface px-3.5 py-2.5 text-xs sm:text-sm text-text-primary resize-y",
            "placeholder:text-text-tertiary leading-relaxed",
            "focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500",
            "transition-all duration-150 shadow-2xs",
            error ? "border-accent-red" : "border-border hover:border-border-hover",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-accent-red mt-1">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

// ========== Select ==========
interface SelectOption {
  value: string;
  label: string;
}

interface SelectGroup {
  label: string;
  options: SelectOption[];
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
  groups?: SelectGroup[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options = [], groups, placeholder, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label htmlFor={id} className="block text-xs sm:text-sm font-semibold text-text-secondary">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            "w-full h-10 min-h-[40px] rounded-xl border bg-surface px-3.5 py-2 text-xs sm:text-sm text-text-primary",
            "focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500",
            "transition-all duration-150 shadow-2xs cursor-pointer",
            error ? "border-accent-red" : "border-border hover:border-border-hover",
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {groups
            ? groups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              ))
            : options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
        </select>
        {error && <p className="text-xs text-accent-red mt-1">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Input, Textarea, Select };
