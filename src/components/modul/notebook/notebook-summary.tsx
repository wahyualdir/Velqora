"use client";

import React from "react";
import { BookCheck } from "lucide-react";

interface NotebookSummaryProps {
  summary: string | string[];
  className?: string;
}

export function NotebookSummary({ summary, className = "" }: NotebookSummaryProps) {
  if (!summary || (Array.isArray(summary) && summary.length === 0)) return null;

  const points = Array.isArray(summary) ? summary : [summary];

  return (
    <section
      aria-label="Ringkasan Materi"
      className={`my-8 p-5 rounded-xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3 ${className}`}
    >
      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 dark:text-emerald-300 font-mono tracking-tight uppercase">
        <BookCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>Poin Kunci & Ringkasan (Key Takeaways)</span>
      </div>

      <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
        {points.map((pt, i) => (
          <li key={i} className="flex items-start gap-2.5 leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
            <span>{pt}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
