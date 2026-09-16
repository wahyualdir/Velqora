"use client";

import React from "react";
import { Search, Compass, AlertCircle, Check } from "lucide-react";
import { NotebookInterpretationUnit } from "@/lib/curriculum/types";
import { NoteRenderer } from "@/components/notes/note-renderer";

interface NotebookInterpretationCardProps {
  unit: NotebookInterpretationUnit;
}

export function NotebookInterpretationCard({ unit }: NotebookInterpretationCardProps) {
  return (
    <div className="my-5 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.02] dark:bg-indigo-500/[0.03] shadow-xs overflow-hidden transition-all">
      {/* 1. Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-indigo-500/20 bg-indigo-500/5">
        <Search className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-semibold">
          Interpretasi Hasil Analisis
        </span>
        <span className="text-text-tertiary">•</span>
        <h4 className="text-xs sm:text-sm font-bold text-text-primary">
          {unit.headline}
        </h4>
      </div>

      <div className="p-4 space-y-3 text-xs sm:text-sm leading-relaxed">
        {/* 2. Key Observations */}
        {unit.observations && unit.observations.length > 0 && (
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary font-semibold block mb-1.5">
              Observasi Numerik & Visual Kunci:
            </span>
            <ul className="space-y-1.5">
              {unit.observations.map((obs, idx) => (
                <li key={idx} className="flex items-start gap-2 text-text-secondary text-xs sm:text-[13px]">
                  <span className="p-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>{obs}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 3. Domain Implication */}
        <div className="p-3 rounded-lg bg-surface dark:bg-[#111215] border border-border">
          <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary font-semibold flex items-center gap-1.5 mb-1">
            <Compass className="w-3.5 h-3.5 text-brand-500" />
            <span>Implikasi Domain & Keputusan Praktis:</span>
          </span>
          <div className="text-text-primary text-xs sm:text-[13px] leading-relaxed">
            <NoteRenderer content={unit.domainImplication} />
          </div>
        </div>

        {/* 4. Statistical Caveats */}
        {unit.statisticalCaveats && unit.statisticalCaveats.length > 0 && (
          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1.5 mb-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Peringatan & Batasan Statistik (Caveats):</span>
            </span>
            <ul className="list-disc list-inside space-y-1 text-xs text-text-secondary">
              {unit.statisticalCaveats.map((caveat, idx) => (
                <li key={idx}>{caveat}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
