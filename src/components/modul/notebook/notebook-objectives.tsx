"use client";

import React from "react";
import { Target, CheckCircle2 } from "lucide-react";

interface NotebookObjectivesProps {
  objectives: string[];
  className?: string;
}

export function NotebookObjectives({ objectives, className = "" }: NotebookObjectivesProps) {
  if (!objectives || objectives.length === 0) return null;

  return (
    <section
      aria-label="Capaian Pembelajaran"
      className={`p-4 sm:p-5 rounded-2xl border border-border bg-surface-secondary/60 dark:bg-[#141210] shadow-[inset_0_1px_0_rgba(255,248,240,0.04)] space-y-2.5 ${className}`}
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold text-[#C2553A] dark:text-[#E5C194] font-mono tracking-wider uppercase">
        <Target className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A] shrink-0" />
        <span>Capaian Kompetensi (Learning Objectives)</span>
      </div>

      <ul className="space-y-2 text-[13.5px] sm:text-sm text-text-secondary">
        {objectives.map((obj, i) => (
          <li key={i} className="flex items-start gap-2.5 leading-relaxed">
            <CheckCircle2 className="w-4 h-4 text-[#34D399] mt-0.5 shrink-0" />
            <span>{obj}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
