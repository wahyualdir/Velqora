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
  phaseTitle?: string;
  isNew2026?: boolean;
  className?: string;
}

export function NotebookLessonHeader({
  number,
  title,
  subtitle,
  description,
  flow = "conceptual",
  estimatedMinutes = 12,
  chapterTitle,
  categoryName,
  phaseTitle,
  isNew2026 = false,
  className = "",
}: NotebookLessonHeaderProps) {
  const getFlowMeta = (f: LessonFlow) => {
    switch (f) {
      case "mathematical":
        return {
          label: "Derivasi Matematis",
          icon: <Calculator className="w-3.5 h-3.5 text-[#D4664A]" />,
          colorClass: "bg-[#C2553A]/10 text-[#C2553A] dark:text-[#E5C194] border-[#D4664A]/30",
        };
      case "computational":
        return {
          label: "Implementasi & Komputasi",
          icon: <Cpu className="w-3.5 h-3.5 text-[#34D399]" />,
          colorClass: "bg-[#34D399]/10 text-emerald-700 dark:text-[#34D399] border-[#34D399]/28",
        };
      case "algorithmic":
        return {
          label: "Analisis Algoritmik",
          icon: <Layers className="w-3.5 h-3.5 text-[#D4664A]" />,
          colorClass: "bg-[#D4664A]/10 text-[#C2553A] dark:text-[#D4664A] border-[#D4664A]/28",
        };
      case "project":
        return {
          label: "System Design & Kasus Industri",
          icon: <FolderKanban className="w-3.5 h-3.5 text-[#E5B567]" />,
          colorClass: "bg-[#E5B567]/10 text-amber-700 dark:text-[#E5B567] border-[#E5B567]/28",
        };
      case "mixed":
        return {
          label: "Teori & Praktikum Produksi",
          icon: <Sparkles className="w-3.5 h-3.5 text-[#D4664A]" />,
          colorClass: "bg-[#D4664A]/10 text-[#C2553A] dark:text-[#E5C194] border-[#D4664A]/28",
        };
      case "conceptual":
      default:
        return {
          label: "Kerangka Konseptual",
          icon: <BookOpen className="w-3.5 h-3.5 text-[#D4664A]" />,
          colorClass: "bg-surface-secondary text-text-secondary border-border",
        };
    }
  };

  const flowMeta = getFlowMeta(flow);

  return (
    <header className={`space-y-3.5 pb-6 border-b border-border ${className}`}>
      {/* Phase & Chapter Context */}
      {(phaseTitle || categoryName || chapterTitle) && (
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-text-tertiary">
          {phaseTitle ? (
            <span className="px-2 py-0.5 rounded-md bg-[#C2553A]/10 text-[#C2553A] dark:text-[#E5C194] border border-[#D4664A]/25 font-semibold">
              {phaseTitle}
            </span>
          ) : (
            categoryName && <span>{categoryName}</span>
          )}
          {chapterTitle && (
            <>
              <span className="opacity-40">/</span>
              <span className="text-text-secondary truncate max-w-[360px] sm:max-w-none">{chapterTitle}</span>
            </>
          )}
        </div>
      )}

      {/* Main Editorial Title */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl md:text-[32px] font-bold text-text-primary tracking-tight font-display leading-[1.18]">
          {number && (
            <span className="text-[#C2553A] dark:text-[#D4664A] font-mono mr-2.5 font-semibold">
              {number}
            </span>
          )}
          {title}
        </h1>
        {subtitle && subtitle !== chapterTitle && (
          <p className="text-sm font-medium text-text-secondary">
            {subtitle}
          </p>
        )}
      </div>

      {/* Lead Description */}
      {description && (
        <p className="text-[15px] leading-relaxed text-text-secondary max-w-3xl">
          {description}
        </p>
      )}

      {/* Metadata Badges */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono font-medium ${flowMeta.colorClass}`}
        >
          {flowMeta.icon}
          <span>{flowMeta.label}</span>
        </span>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-surface-secondary/70 text-text-secondary text-[11px] font-mono tabular-nums">
          <Clock className="w-3 h-3 text-text-tertiary" />
          <span>~{estimatedMinutes} menit baca</span>
        </span>

        {isNew2026 && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E5C194]/35 bg-[#E5C194]/12 text-amber-800 dark:text-[#E5C194] text-[11px] font-mono font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>Standar 2026</span>
          </span>
        )}
      </div>
    </header>
  );
}
