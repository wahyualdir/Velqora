"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Terminal, AlertTriangle, Clock } from "lucide-react";

export type AcademicExecutionStatus =
  | "not-run"
  | "executed"
  | "output-matched"
  | "source-verified"
  | "academically-reviewed"
  | "reader-validated"
  | "accepted"
  | "verified";

interface NotebookExecutionStatusProps {
  status?: AcademicExecutionStatus | string;
  runtime?: string;
  executionTimeMs?: number;
  exitCode?: number;
  className?: string;
}

export function NotebookExecutionStatus({
  status = "executed",
  runtime,
  executionTimeMs,
  exitCode = 0,
  className = "",
}: NotebookExecutionStatusProps) {
  const getBadge = () => {
    switch (status) {
      case "accepted":
        return {
          label: "Accepted — Gold Standard",
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
          classes: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
        };
      case "academically-reviewed":
        return {
          label: "Academically Reviewed",
          icon: <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />,
          classes: "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/60",
        };
      case "output-matched":
        return {
          label: "Output Matched (ε = 10⁻⁴)",
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
          classes: "bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-800/40",
        };
      case "source-verified":
        return {
          label: "Source Verified",
          icon: <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />,
          classes: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60",
        };
      case "executed":
      case "verified":
        return {
          label: "Executed (Python 3.12)",
          icon: <Terminal className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />,
          classes: "bg-slate-100 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700",
        };
      case "not-run":
        return {
          label: "Output Belum Dijalankan",
          icon: <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
          classes: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
        };
      case "failed":
        return {
          label: `Execution Failed (Exit ${exitCode})`,
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />,
          classes: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60",
        };
      default:
        return {
          label: status,
          icon: <Terminal className="w-3.5 h-3.5" />,
          classes: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
        };
    }
  };

  const badge = getBadge();

  return (
    <div className={`inline-flex items-center gap-2 text-[11px] font-mono ${className}`}>
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border font-medium ${badge.classes}`}
      >
        {badge.icon}
        <span>{badge.label}</span>
      </span>

      {runtime && (
        <span className="hidden sm:inline-flex items-center gap-1 text-text-tertiary">
          <span>•</span>
          <span>{runtime}</span>
        </span>
      )}

      {executionTimeMs !== undefined && executionTimeMs > 0 && (
        <span className="hidden md:inline-flex items-center gap-1 text-text-tertiary">
          <span>•</span>
          <span>{executionTimeMs}ms</span>
        </span>
      )}
    </div>
  );
}
