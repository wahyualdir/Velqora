"use client";

import React from "react";
import { TechIconPickerProps, TechIconKey } from "./types";
import { TECH_ICONS } from "./brand-icons-registry";
import { TechIcon } from "./tech-icon";

export function TechIconPicker({ selectedKey, onSelect }: TechIconPickerProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text-secondary">
        Pilih Logo Bahasa / Teknologi
      </label>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-56 overflow-y-auto p-2.5 bg-surface-tertiary rounded-2xl border border-border">
        {TECH_ICONS.map((icon) => {
          const isSelected = selectedKey?.toLowerCase() === icon.key;
          return (
            <button
              key={icon.key}
              type="button"
              onClick={() => onSelect(icon.key)}
              title={icon.label}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200 border text-center transform active:scale-90 hover:scale-105 ${
                isSelected
                  ? "bg-surface border-brand-600 ring-2 ring-brand-500/30 shadow-md scale-105"
                  : "bg-surface/40 border-transparent hover:bg-surface hover:border-border"
              }`}
            >
              <TechIcon name={icon.key} size={24} animate={false} />
              <span className="text-[10px] font-semibold text-text-secondary truncate w-full">
                {icon.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
