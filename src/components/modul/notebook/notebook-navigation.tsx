"use client";

import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavTarget {
  id: string;
  title: string;
  number?: string | number;
}

interface NotebookNavigationProps {
  prev?: NavTarget | null;
  next?: NavTarget | null;
  onSelect: (id: string) => void;
  className?: string;
}

export function NotebookNavigation({
  prev,
  next,
  onSelect,
  className = "",
}: NotebookNavigationProps) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Navigasi Pelajaran"
      className={`mt-12 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3 ${className}`}
    >
      {prev ? (
        <button
          type="button"
          onClick={() => onSelect(prev.id)}
          className="flex flex-col items-start p-3.5 rounded-xl border border-border hover:border-brand-500/50 bg-surface hover:bg-surface-secondary/50 text-left transition-all cursor-pointer group shadow-2xs"
        >
          <span className="text-[11px] font-mono text-text-tertiary flex items-center gap-1 group-hover:text-brand-600 dark:group-hover:text-brand-400">
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Sebelumnya</span>
          </span>
          <span className="text-xs sm:text-sm font-semibold text-text-primary line-clamp-1 mt-1 font-display">
            {prev.title}
          </span>
        </button>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next ? (
        <button
          type="button"
          onClick={() => onSelect(next.id)}
          className="flex flex-col items-end p-3.5 rounded-xl border border-border hover:border-brand-500/50 bg-surface hover:bg-surface-secondary/50 text-right transition-all cursor-pointer group shadow-2xs sm:col-start-2"
        >
          <span className="text-[11px] font-mono text-text-tertiary flex items-center gap-1 group-hover:text-brand-600 dark:group-hover:text-brand-400">
            <span>Selanjutnya</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="text-xs sm:text-sm font-semibold text-text-primary line-clamp-1 mt-1 font-display">
            {next.title}
          </span>
        </button>
      ) : null}
    </nav>
  );
}
