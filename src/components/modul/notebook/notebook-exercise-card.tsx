"use client";

import React, { useState } from "react";
import {
  Target,
  Lightbulb,
  Key,
  ChevronDown,
  ChevronUp,
  Award,
  CheckSquare,
  FileCode,
} from "lucide-react";
import { NotebookExerciseUnit } from "@/lib/curriculum/types";
import { NoteRenderer } from "@/components/notes/note-renderer";

interface NotebookExerciseCardProps {
  unit: NotebookExerciseUnit;
}

export function NotebookExerciseCard({ unit }: NotebookExerciseCardProps) {
  const [showSolution, setShowSolution] = useState(false);
  const [activeHintIndex, setActiveHintIndex] = useState<number | null>(null);

  const getLevelBadge = (level: number) => {
    switch (level) {
      case 1:
        return {
          label: "Level 1: Konseptual Dasar",
          color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        };
      case 2:
        return {
          label: "Level 2: Implementasi Standar",
          color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        };
      case 3:
        return {
          label: "Level 3: Debugging & Edge Cases",
          color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        };
      case 4:
        return {
          label: "Level 4: Optimasi & Skalabilitas",
          color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        };
      case 5:
        return {
          label: "Level 5: Desain Sistem & Ekstensi",
          color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        };
      default:
        return {
          label: `Level ${level}`,
          color: "bg-muted text-muted-foreground border-border",
        };
    }
  };

  const badge = getLevelBadge(unit.level);

  return (
    <div className="my-6 rounded-xl border border-border bg-surface dark:bg-[#131418] shadow-sm overflow-hidden transition-all">
      {/* 1. Header with Level Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 border-b border-border bg-surface-secondary/40 dark:bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
            <Target className="w-4 h-4" />
          </span>
          <h4 className="text-sm sm:text-base font-bold text-text-primary font-display">
            {unit.title}
          </h4>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${badge.color}`}
        >
          {badge.label}
        </span>
      </div>

      {/* 2. Scenario & Task Description */}
      <div className="p-5 space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
        <div className="p-3.5 rounded-lg bg-surface-secondary/30 dark:bg-white/[0.01] border border-border/80">
          <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary block mb-1 font-semibold">
            Skenario Masalah:
          </span>
          <div className="text-text-primary prose dark:prose-invert max-w-none">
            <NoteRenderer content={unit.scenario} />
          </div>
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary block mb-1 font-semibold">
            Tugas Anda:
          </span>
          <div className="text-text-primary font-medium prose dark:prose-invert max-w-none">
            <NoteRenderer content={unit.task} />
          </div>
        </div>

        {/* 3. Progressive Hints (Collapsible) */}
        {unit.hints && unit.hints.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary block font-semibold flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Petunjuk Bertahap (Hints):</span>
            </span>
            <div className="space-y-1.5">
              {unit.hints.map((hint, idx) => {
                const isOpen = activeHintIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-border rounded-lg overflow-hidden bg-surface dark:bg-[#101114]"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveHintIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-surface-secondary/40 transition-colors cursor-pointer text-xs font-medium text-text-secondary"
                    >
                      <span className="flex items-center gap-2">
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px]">
                          Hint {idx + 1}
                        </span>
                        <span>Klik untuk melihat petunjuk {idx + 1}</span>
                      </span>
                      {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    {isOpen && (
                      <div className="px-3 py-2.5 border-t border-border bg-surface-secondary/20 text-xs text-text-secondary">
                        <NoteRenderer content={hint} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Evaluation Rubric Table */}
        {unit.evaluationRubric && unit.evaluationRubric.length > 0 && (
          <div className="pt-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary block mb-2 font-semibold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-brand-500" />
              <span>Rubrik Penilaian & Standar Kualitas:</span>
            </span>
            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-secondary/50 dark:bg-white/[0.03] text-text-tertiary font-mono">
                  <tr>
                    <th className="py-2 px-3 border-b border-border">Kriteria</th>
                    <th className="py-2 px-3 border-b border-border w-20 text-center">Bobot</th>
                    <th className="py-2 px-3 border-b border-border">Ekspektasi Capaian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-text-secondary">
                  {unit.evaluationRubric.map((r, idx) => (
                    <tr key={idx} className="hover:bg-surface-secondary/20 transition-colors">
                      <td className="py-2 px-3 font-semibold text-text-primary">{r.criterion}</td>
                      <td className="py-2 px-3 font-mono text-center text-brand-600 dark:text-brand-400">
                        {r.weight}%
                      </td>
                      <td className="py-2 px-3 text-[11px] leading-relaxed">{r.expectation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 5. Reference Solution Reveal Toggle */}
      {(unit.solutionCode || unit.solutionExplanation) && (
        <div className="border-t border-border bg-surface-secondary/20 dark:bg-white/[0.01]">
          <div className="p-4">
            <button
              type="button"
              onClick={() => setShowSolution(!showSolution)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-surface hover:bg-surface-secondary border border-border text-xs font-semibold text-text-primary shadow-2xs transition-all cursor-pointer"
            >
              <Key className="w-4 h-4 text-brand-500" />
              <span>{showSolution ? "Sembunyikan Kunci Jawaban & Solusi" : "Buka Kunci Jawaban & Pembahasan Referensi"}</span>
              {showSolution ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </button>
          </div>

          {showSolution && (
            <div className="px-5 pb-5 pt-1 space-y-3 border-t border-border/80">
              {unit.solutionCode && (
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary block mb-1 font-semibold flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Kode Solusi Referensi:</span>
                  </span>
                  <div className="rounded-lg overflow-hidden border border-border bg-[#0d1117] text-[#e6edf3] p-3 font-mono text-xs overflow-x-auto whitespace-pre">
                    <code>{unit.solutionCode}</code>
                  </div>
                </div>
              )}

              {unit.solutionExplanation && (
                <div className="p-3 rounded-lg bg-surface dark:bg-[#0f1013] border border-border text-xs sm:text-sm text-text-secondary leading-relaxed">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary block mb-1 font-semibold">
                    Analisis & Pembahasan Solusi:
                  </span>
                  <NoteRenderer content={unit.solutionExplanation} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
