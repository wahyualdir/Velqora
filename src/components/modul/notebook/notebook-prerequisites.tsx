"use client";

import React from "react";
import { ArrowRightCircle } from "lucide-react";

interface NotebookPrerequisitesProps {
  prerequisites: string[];
  className?: string;
}

export function NotebookPrerequisites({
  prerequisites,
  className = "",
}: NotebookPrerequisitesProps) {
  if (!prerequisites || prerequisites.length === 0) return null;

  return (
    <div
      aria-label="Prasyarat Materi"
      className={`flex flex-wrap items-center gap-2 text-xs text-text-tertiary pt-1 ${className}`}
    >
      <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold flex items-center gap-1">
        <ArrowRightCircle className="w-3.5 h-3.5 text-brand-500" />
        <span>Prasyarat:</span>
      </span>
      <div className="flex flex-wrap items-center gap-1.5">
        {prerequisites.map((p, i) => (
          <span
            key={i}
            className="px-2 py-0.5 rounded-md border border-border bg-surface text-text-secondary text-[11px] font-sans"
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}
