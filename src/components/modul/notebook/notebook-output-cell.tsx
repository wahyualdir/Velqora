"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Clock, Terminal, ShieldCheck } from "lucide-react";
import { NotebookOutputUnit } from "@/lib/curriculum/types";

interface NotebookOutputCellProps {
  unit: NotebookOutputUnit;
}

export function NotebookOutputCell({ unit }: NotebookOutputCellProps) {
  const isError = unit.format === "error" || (unit.executionEvidence && unit.executionEvidence.exitCode !== 0);

  return (
    <div
      className={`my-4 -mt-2 rounded-xl border ${
        isError
          ? "border-rose-500/40 bg-rose-500/[0.02]"
          : "border-border/80 bg-surface dark:bg-[#0f1013]"
      } shadow-xs overflow-hidden transition-all`}
    >
      {/* 1. Header Provenance & Evidence Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-muted/30 dark:bg-[#141519] border-b border-border/60 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] select-none">
            Out [{unit.cellIndex !== undefined ? unit.cellIndex : " "}]
          </span>
          <span className="text-[10px] text-text-tertiary flex items-center gap-1">
            <Terminal className="w-3 h-3" />
            <span>Format: {unit.format.toUpperCase()}</span>
          </span>
        </div>

        {/* Execution Provenance Badge */}
        {unit.executionEvidence ? (
          <div className="flex items-center gap-3 text-[11px] text-text-tertiary flex-wrap">
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{unit.executionEvidence.runtime}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{unit.executionEvidence.executionTimeMs}ms</span>
            </span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                unit.executionEvidence.exitCode === 0
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              }`}
            >
              exit {unit.executionEvidence.exitCode}
            </span>
          </div>
        ) : (
          <div className="text-[10px] text-text-tertiary flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Output Divalidasi</span>
          </div>
        )}
      </div>

      {/* 2. Formatted Output Body */}
      <div className="p-4 overflow-x-auto max-h-[500px] scrollbar-thin">
        {isError ? (
          <div className="flex items-start gap-2.5 text-rose-600 dark:text-rose-400 font-mono text-xs whitespace-pre">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <code>{unit.content}</code>
          </div>
        ) : (
          <pre className="font-mono text-xs sm:text-[12.5px] leading-relaxed text-text-primary dark:text-[#d1d7e0] whitespace-pre selection:bg-brand-500/20">
            {unit.content}
          </pre>
        )}
      </div>
    </div>
  );
}
