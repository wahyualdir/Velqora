"use client";

import React from "react";
import { BookOpen, Code } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModeSelectorProps {
  kind: "module" | "project";
  onChangeKind: (newKind: "module" | "project") => void;
  disabled?: boolean;
}

export function ModeSelector({ kind, onChangeKind, disabled = false }: ModeSelectorProps) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-border bg-surface shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
          Jenis Konten
        </label>
        <span className="text-[11px] text-text-tertiary">Pilih format kurikulum yang sesuai</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChangeKind("module")}
          className={cn(
            "p-3.5 sm:p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all duration-150 cursor-pointer select-none",
            kind === "module"
              ? "border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400 font-medium shadow-xs ring-1 ring-brand-500/30"
              : "border-border bg-surface-secondary/50 text-text-secondary hover:border-border-hover hover:text-text-primary"
          )}
        >
          <div
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
              kind === "module"
                ? "bg-brand-500 text-white"
                : "bg-surface border border-border text-text-tertiary"
            )}
          >
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="text-xs sm:text-sm font-bold text-text-primary">Modul Perkuliahan</div>
            <div className="text-[11px] text-text-secondary leading-snug">
              Bahan ajar akademik, silabus bab, teori, catatan, dan referensi perkuliahan.
            </div>
          </div>
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onChangeKind("project")}
          className={cn(
            "p-3.5 sm:p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all duration-150 cursor-pointer select-none",
            kind === "project"
              ? "border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400 font-medium shadow-xs ring-1 ring-brand-500/30"
              : "border-border bg-surface-secondary/50 text-text-secondary hover:border-border-hover hover:text-text-primary"
          )}
        >
          <div
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
              kind === "project"
                ? "bg-brand-500 text-white"
                : "bg-surface border border-border text-text-tertiary"
            )}
          >
            <Code className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="text-xs sm:text-sm font-bold text-text-primary">Proyek Coding / Riset</div>
            <div className="text-[11px] text-text-secondary leading-snug">
              Jupyter Notebooks, repositori kode, dataset ilmiah, dan dokumen proyek.
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
