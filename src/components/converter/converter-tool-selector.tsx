"use client";

import React from "react";
import type { ConversionOption } from "@/lib/file-converter";

interface ConverterToolSelectorProps {
  options: ConversionOption[];
  selectedOption: ConversionOption;
  onSelectOption: (option: ConversionOption) => void;
}

export function ConverterToolSelector({
  options,
  selectedOption,
  onSelectOption,
}: ConverterToolSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {options.map((opt) => {
          const isSelected = selectedOption.id === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectOption(opt)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                isSelected
                  ? "bg-brand-500/10 border-brand-500/30 text-brand-600 dark:text-brand-400 shadow-2xs"
                  : "bg-surface border-border text-text-primary hover:border-border-hover hover:bg-surface-secondary"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold truncate">{opt.name}</span>
                <span className="text-[10px] font-mono text-text-tertiary px-1.5 py-0.5 rounded bg-surface-secondary border border-border shrink-0">
                  {opt.toFormat}
                </span>
              </div>
              <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
                {opt.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
