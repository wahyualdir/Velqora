"use client";

import React, { useState } from "react";
import {
  Target,
  Lightbulb,
  Key,
  ChevronDown,
  ChevronUp,
  Award,
  FileCode,
  Copy,
  Check,
  Play,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ExerciseItem } from "@/lib/curriculum/types";
import { NoteRenderer } from "@/components/notes/note-renderer";

interface ExerciseCardProps {
  exercise: ExerciseItem;
  index?: number;
}

export function ExerciseCard({ exercise, index }: ExerciseCardProps) {
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const getLevelBadge = (level: number) => {
    switch (level) {
      case 1:
        return {
          label: "Level 1: Pemahaman Konseptual",
          color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          icon: "🌱",
        };
      case 2:
        return {
          label: "Level 2: Implementasi Standar",
          color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
          icon: "⚡",
        };
      case 3:
        return {
          label: "Level 3: Debugging & Edge Cases",
          color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
          icon: "🛠️",
        };
      case 4:
        return {
          label: "Level 4: Mini-Project Terapan",
          color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
          icon: "🚀",
        };
      default:
        return {
          label: `Level ${level}`,
          color: "bg-muted text-muted-foreground border-border",
          icon: "🎯",
        };
    }
  };

  const badge = getLevelBadge(exercise.level);

  const handleCopyStarter = (codeText: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(codeText);
      setCopiedCode(true);
      toast.success("Kode starter berhasil disalin ke clipboard!");
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="rounded-xl border border-border/80 bg-surface dark:bg-[#141519] shadow-2xs overflow-hidden transition-all duration-200">
      {/* 1. Header with Level Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-4 sm:px-5 py-3 border-b border-border/80 bg-surface-secondary/40 dark:bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400">
            <Target className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs sm:text-sm font-bold text-text-primary font-display">
            {index !== undefined ? `Tantangan #${index + 1}` : "Latihan Praktikum"}
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${badge.color}`}
        >
          <span>{badge.icon}</span>
          <span>{badge.label}</span>
        </span>
      </div>

      {/* 2. Task Description */}
      <div className="p-4 sm:p-5 space-y-4 text-xs sm:text-sm leading-relaxed">
        <div className="text-text-primary prose dark:prose-invert max-w-none text-xs sm:text-sm">
          <NoteRenderer content={exercise.task} />
        </div>

        {/* 3. Starter Code Block (if available) */}
        {exercise.starterCode && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-text-tertiary">
              <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wider">
                <FileCode className="w-3.5 h-3.5 text-blue-500" />
                <span>Kode Starter / Kerangka Solusi:</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyStarter(exercise.starterCode!)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                  title="Salin kode starter"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? "Disalin" : "Salin"}</span>
                </button>
                <Link
                  href={`/dashboard/playground?code=${encodeURIComponent(exercise.starterCode)}`}
                  className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-600 hover:bg-brand-700 text-white transition-colors"
                  title="Jalankan langsung di Python Playground"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Playground</span>
                </Link>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden border border-border/80 bg-[#0d1117] text-[#e6edf3] p-3 font-mono text-xs overflow-x-auto whitespace-pre">
              <code>{exercise.starterCode}</code>
            </div>
          </div>
        )}

        {/* 4. Test Case Preview (if available) */}
        {exercise.testCase && (
          <div className="p-3 rounded-lg border border-border/70 bg-surface-secondary/20 dark:bg-white/[0.01] space-y-1.5 text-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary font-bold flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-emerald-500" />
              <span>Verifikasi Test Case & Ekspektasi Output:</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-surface border border-border/60">
                <span className="text-text-tertiary block text-[10px]">Input:</span>
                <span className="text-text-primary truncate block">
                  {typeof exercise.testCase.input === "object"
                    ? JSON.stringify(exercise.testCase.input)
                    : String(exercise.testCase.input)}
                </span>
              </div>
              <div className="p-2 rounded bg-surface border border-border/60">
                <span className="text-text-tertiary block text-[10px]">Expected Output:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold truncate block">
                  {typeof exercise.testCase.expectedOutput === "object"
                    ? JSON.stringify(exercise.testCase.expectedOutput)
                    : String(exercise.testCase.expectedOutput)}
                </span>
              </div>
            </div>
            {exercise.testCase.description && (
              <span className="text-[10px] text-text-tertiary block italic">
                {exercise.testCase.description}
              </span>
            )}
          </div>
        )}

        {/* 5. Progressive Hint Toggle */}
        {exercise.hint && (
          <div className="border border-border/80 rounded-lg overflow-hidden bg-surface dark:bg-[#101114]">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-surface-secondary/40 transition-colors cursor-pointer text-xs font-medium text-text-secondary"
            >
              <span className="flex items-center gap-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-semibold text-text-primary">Petunjuk Penyelesaian (Hint)</span>
              </span>
              {showHint ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showHint && (
              <div className="px-3.5 py-2.5 border-t border-border/80 bg-surface-secondary/20 text-xs text-text-secondary prose dark:prose-invert max-w-none">
                <NoteRenderer content={exercise.hint} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 6. Solution Reveal Toggle */}
      {exercise.solution && (
        <div className="border-t border-border bg-surface-secondary/30 dark:bg-white/[0.01]">
          <div className="p-3 sm:p-4">
            <button
              type="button"
              onClick={() => setShowSolution(!showSolution)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-surface hover:bg-surface-secondary border border-border text-xs font-semibold text-text-primary shadow-2xs transition-all cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-brand-500" />
              <span>{showSolution ? "Sembunyikan Pembahasan & Kunci Solusi" : "Buka Pembahasan & Kunci Solusi"}</span>
              {showSolution ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
            </button>
          </div>

          {showSolution && (
            <div className="px-4 sm:px-5 pb-5 pt-1 space-y-2.5 border-t border-border/80">
              <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary block font-semibold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-500" />
                <span>Solusi Referensi Terverifikasi:</span>
              </span>
              <div className="p-3 rounded-lg bg-surface dark:bg-[#0f1013] border border-border text-xs sm:text-sm text-text-secondary leading-relaxed prose dark:prose-invert max-w-none">
                <NoteRenderer content={exercise.solution} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
