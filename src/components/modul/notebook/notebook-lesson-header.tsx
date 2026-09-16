"use client";

import React from "react";
import { Clock, BookOpen, Layers, Sparkles, Cpu, Calculator, FolderKanban } from "lucide-react";
import { LessonFlow } from "@/lib/curriculum/types";

interface NotebookLessonHeaderProps {
  number?: string;
  title: string;
  subtitle?: string;
  description?: string;
  flow?: LessonFlow;
  estimatedMinutes?: number;
  chapterTitle?: string;
  categoryName?: string;
  className?: string;
}

export function NotebookLessonHeader({
  number,
  title,
  subtitle,
  description,
  flow = "conceptual",
  estimatedMinutes = 15,
  chapterTitle,
  categoryName,
  className = "",
}: NotebookLessonHeaderProps) {
  const getFlowMeta = (f: LessonFlow) => {
    switch (f) {
      case "mathematical":
        return {
          label: "Mathematical Derivation",
          icon: <Calculator className="w-3.5 h-3.5 text-indigo-500" />,
          colorClass: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60",
        };
      case "computational":
        return {
          label: "Computational Implementation",
          icon: <Cpu className="w-3.5 h-3.5 text-emerald-500" />,
          colorClass: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
        };
      case "algorithmic":
        return {
          label: "Algorithmic Analysis",
          icon: <Layers className="w-3.5 h-3.5 text-sky-500" />,
          colorClass: "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/60",
        };
      case "project":
        return {
          label: "End-to-End Project Case",
          icon: <FolderKanban className="w-3.5 h-3.5 text-amber-500" />,
          colorClass: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
        };
      case "mixed":
        return {
          label: "Theory & Practice",
          icon: <Sparkles className="w-3.5 h-3.5 text-purple-500" />,
          colorClass: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60",
        };
      case "conceptual":
      default:
        return {
          label: "Conceptual Framework",
          icon: <BookOpen className="w-3.5 h-3.5 text-blue-500" />,
          colorClass: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60",
        };
    }
  };

  const flowMeta = getFlowMeta(flow);

  return (
    <header className={`space-y-3 pb-5 border-b border-border/70 ${className}`}>
      {/* Category & Chapter Context */}
      {(categoryName || chapterTitle) && (
        <div className="flex items-center gap-2 text-xs font-mono text-text-tertiary">
          {categoryName && <span>{categoryName}</span>}
          {categoryName && chapterTitle && <span>/</span>}
          {chapterTitle && <span className="text-text-secondary truncate">{chapterTitle}</span>}
        </div>
      )}

      {/* Main Title */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight font-display leading-tight">
          {number && <span className="text-text-tertiary font-mono mr-2.5 font-bold">{number}</span>}
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm sm:text-base font-medium text-text-secondary">
            {subtitle}
          </p>
        )}
      </div>

      {/* Description / Summary Lead */}
      {description && (
        <p className="text-sm leading-relaxed text-text-secondary max-w-3xl">
          {description}
        </p>
      )}

      {/* Badges: Flow, Estimated Reading Time */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-medium ${flowMeta.colorClass}`}
        >
          {flowMeta.icon}
          <span>{flowMeta.label}</span>
        </span>

        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-border bg-surface text-text-tertiary text-[11px] font-mono">
          <Clock className="w-3 h-3" />
          <span>~{estimatedMinutes} menit baca</span>
        </span>
      </div>
    </header>
  );
}
