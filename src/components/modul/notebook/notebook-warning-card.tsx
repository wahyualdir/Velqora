"use client";

import React from "react";
import { AlertTriangle, AlertCircle, Info, Lightbulb, Wrench } from "lucide-react";
import { NotebookWarningUnit } from "@/lib/curriculum/types";
import { NoteRenderer } from "@/components/notes/note-renderer";

interface NotebookWarningCardProps {
  unit: NotebookWarningUnit;
}

export function NotebookWarningCard({ unit }: NotebookWarningCardProps) {
  const getSeverityConfig = () => {
    switch (unit.severity) {
      case "danger":
        return {
          icon: <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />,
          border: "border-rose-500/30",
          bg: "bg-rose-500/[0.04]",
          headerBg: "bg-rose-500/10",
          textColor: "text-rose-700 dark:text-rose-400",
          tag: "PERINGATAN KRITIS / DANGER",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />,
          border: "border-amber-500/30",
          bg: "bg-amber-500/[0.04]",
          headerBg: "bg-amber-500/10",
          textColor: "text-amber-700 dark:text-amber-400",
          tag: "PERINGATAN / CAVEAT",
        };
      case "tip":
        return {
          icon: <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
          border: "border-emerald-500/30",
          bg: "bg-emerald-500/[0.04]",
          headerBg: "bg-emerald-500/10",
          textColor: "text-emerald-700 dark:text-emerald-400",
          tag: "PRO-TIP / PRAKTIK TERBAIK",
        };
      default:
        return {
          icon: <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />,
          border: "border-blue-500/30",
          bg: "bg-blue-500/[0.04]",
          headerBg: "bg-blue-500/10",
          textColor: "text-blue-700 dark:text-blue-400",
          tag: "CATATAN PENTING / NOTE",
        };
    }
  };

  const config = getSeverityConfig();

  return (
    <div className={`my-5 rounded-xl border ${config.border} ${config.bg} shadow-xs overflow-hidden transition-all`}>
      <div className={`flex items-center gap-2 px-4 py-2.5 border-b ${config.border} ${config.headerBg}`}>
        {config.icon}
        <span className={`text-[11px] font-mono uppercase tracking-wider font-bold ${config.textColor}`}>
          {config.tag}
        </span>
        <span className="text-text-tertiary">•</span>
        <h4 className="text-xs sm:text-sm font-bold text-text-primary">
          {unit.title}
        </h4>
      </div>

      <div className="p-4 space-y-3 text-xs sm:text-sm leading-relaxed">
        <div className="text-text-secondary">
          <NoteRenderer content={unit.description} />
        </div>

        {unit.countermeasure && (
          <div className="p-3 rounded-lg bg-surface dark:bg-[#121316] border border-border">
            <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary font-semibold flex items-center gap-1.5 mb-1">
              <Wrench className="w-3.5 h-3.5 text-brand-500" />
              <span>Mitigasi & Solusi Rekayasa:</span>
            </span>
            <div className="text-text-primary text-xs sm:text-[13px] leading-relaxed">
              <NoteRenderer content={unit.countermeasure} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
