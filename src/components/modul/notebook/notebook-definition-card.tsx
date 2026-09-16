"use client";

import React from "react";
import { BookMarked, Sparkles, AlertOctagon, HelpCircle, Binary } from "lucide-react";
import { NotebookDefinitionUnit } from "@/lib/curriculum/types";
import { NoteRenderer } from "@/components/notes/note-renderer";

interface NotebookDefinitionCardProps {
  unit: NotebookDefinitionUnit;
}

export function NotebookDefinitionCard({ unit }: NotebookDefinitionCardProps) {
  return (
    <div className="my-6 rounded-xl border border-brand-500/20 bg-brand-500/[0.02] dark:bg-brand-500/[0.03] shadow-sm overflow-hidden transition-all">
      {/* 1. Header */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-brand-500/20 bg-brand-500/5">
        <BookMarked className="w-4 h-4 text-brand-600 dark:text-brand-400" />
        <span className="text-[11px] font-mono uppercase tracking-wider text-brand-700 dark:text-brand-300 font-semibold">
          Definisi Formal & Konsep Inti
        </span>
        <span className="text-text-tertiary">•</span>
        <h4 className="text-sm sm:text-base font-bold text-text-primary font-display">
          {unit.term}
        </h4>
      </div>

      <div className="p-5 space-y-4 text-xs sm:text-sm leading-relaxed">
        {/* 2. Formal Academic Definition */}
        <div className="p-3.5 rounded-lg border border-border bg-surface dark:bg-[#121316] relative pl-4 border-l-4 border-l-brand-500">
          <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary block mb-1">
            Definisi Akademik:
          </span>
          <p className="text-text-primary font-serif italic text-sm sm:text-[14.5px] leading-relaxed">
            &ldquo;{unit.formalDefinition}&rdquo;
          </p>
        </div>

        {/* 3. Intuitive Explanation */}
        <div className="space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Intuisi & Pemahaman Konseptual:</span>
          </span>
          <div className="text-text-secondary pl-1 prose dark:prose-invert max-w-none">
            <NoteRenderer content={unit.intuitiveExplanation} />
          </div>
        </div>

        {/* 4. Real-World Analogy */}
        {unit.realWorldAnalogy && (
          <div className="p-3 rounded-lg bg-surface-secondary/40 dark:bg-white/[0.02] border border-border/80">
            <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary font-semibold flex items-center gap-1.5 mb-1">
              <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
              <span>Analogi Dunia Nyata:</span>
            </span>
            <div className="text-text-secondary text-xs sm:text-[13px] leading-relaxed">
              <NoteRenderer content={unit.realWorldAnalogy} />
            </div>
          </div>
        )}

        {/* 5. Mathematical Basis (Optional) */}
        {unit.mathematicalBasis && (
          <div className="p-3 rounded-lg bg-surface-secondary/40 dark:bg-white/[0.02] border border-border/80">
            <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary font-semibold flex items-center gap-1.5 mb-1">
              <Binary className="w-3.5 h-3.5 text-indigo-500" />
              <span>Basis Matematis:</span>
            </span>
            <div className="text-text-secondary text-xs sm:text-[13px] leading-relaxed">
              <NoteRenderer content={unit.mathematicalBasis} />
            </div>
          </div>
        )}

        {/* 6. Common Misconceptions */}
        {unit.commonMisconceptions && unit.commonMisconceptions.length > 0 && (
          <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-rose-700 dark:text-rose-400 font-semibold flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
              <span>Miskonsepsi Umum yang Sering Terjadi:</span>
            </span>
            <ul className="list-disc list-inside space-y-1 text-xs text-text-secondary">
              {unit.commonMisconceptions.map((misconception, idx) => (
                <li key={idx} className="leading-relaxed">
                  <span className="text-text-primary font-medium">{misconception}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
