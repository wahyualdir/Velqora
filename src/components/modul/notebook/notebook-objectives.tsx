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
      className={`p-4 rounded-xl border border-sky-200/80 dark:border-sky-900/50 bg-sky-50/50 dark:bg-sky-950/20 space-y-2.5 ${className}`}
    >
      <div className="flex items-center gap-2 text-xs font-semibold text-sky-900 dark:text-sky-300 font-mono tracking-tight uppercase">
        <Target className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
        <span>Capaian Pembelajaran (Learning Objectives)</span>
      </div>

      <ul className="space-y-1.5 text-xs sm:text-sm text-text-secondary">
        {objectives.map((obj, i) => (
          <li key={i} className="flex items-start gap-2 leading-relaxed">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0 opacity-80" />
            <span>{obj}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
