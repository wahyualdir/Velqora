"use client";

import React, { useState } from "react";
import { Sigma, ChevronDown, ChevronUp, Calculator, BookOpen, Layers } from "lucide-react";
import { NotebookFormulaUnit } from "@/lib/curriculum/types";
import { NoteRenderer } from "@/components/notes/note-renderer";

interface NotebookFormulaCardProps {
  unit: NotebookFormulaUnit;
}

export function NotebookFormulaCard({ unit }: NotebookFormulaCardProps) {
  const [showWorkedExample, setShowWorkedExample] = useState(true);

  return (
    <div className="my-6 rounded-xl border border-border bg-surface dark:bg-[#131418] shadow-sm overflow-hidden transition-all">
      {/* 1. Card Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface-secondary/40 dark:bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
            <Sigma className="w-4 h-4" />
          </span>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary">
              Formulasi Matematis
            </span>
            <h4 className="text-sm sm:text-base font-bold text-text-primary font-display">
              {unit.name}
            </h4>
          </div>
        </div>
      </div>

      {/* 2. KaTeX Formula Display */}
      <div className="py-6 px-4 sm:px-6 bg-gradient-to-b from-surface to-surface-secondary/30 dark:from-[#131418] dark:to-[#0f1013] text-center overflow-x-auto">
        <div className="text-base sm:text-lg text-text-primary max-w-full inline-block">
          <NoteRenderer content={`$$\n${unit.latex}\n$$`} />
        </div>
      </div>

      {/* 3. Derivation Notes (Theoretical Context) */}
      {unit.derivationNotes && (
        <div className="px-5 py-3.5 border-t border-border/70 bg-surface-secondary/10 text-xs sm:text-sm text-text-secondary leading-relaxed">
          <div className="flex items-center gap-1.5 font-semibold text-text-primary mb-1">
            <BookOpen className="w-3.5 h-3.5 text-brand-500" />
            <span>Landasan Teoretis & Penurunan:</span>
          </div>
          <NoteRenderer content={unit.derivationNotes} />
        </div>
      )}

      {/* 4. Variables Dictionary Table */}
      {unit.variables && unit.variables.length > 0 && (
        <div className="px-5 py-3.5 border-t border-border/70 overflow-x-auto">
          <div className="flex items-center gap-1.5 font-semibold text-xs text-text-primary mb-2">
            <Layers className="w-3.5 h-3.5 text-brand-500" />
            <span>Daftar Simbol & Variabel:</span>
          </div>
          <table className="w-full text-left text-xs border border-border rounded-lg overflow-hidden">
            <thead className="bg-surface-secondary/50 dark:bg-white/[0.03] text-text-tertiary font-mono">
              <tr>
                <th className="py-2 px-3 border-b border-border w-24">Simbol</th>
                <th className="py-2 px-3 border-b border-border">Deskripsi & Makna Statistik</th>
                <th className="py-2 px-3 border-b border-border w-32">Satuan / Dimensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-sans text-text-secondary">
              {unit.variables.map((v, idx) => (
                <tr key={idx} className="hover:bg-surface-secondary/20 transition-colors">
                  <td className="py-2 px-3 font-mono font-semibold text-brand-600 dark:text-brand-400 whitespace-nowrap">
                    <NoteRenderer content={`$${v.symbol}$`} />
                  </td>
                  <td className="py-2 px-3">{v.description}</td>
                  <td className="py-2 px-3 font-mono text-[11px] text-text-tertiary">
                    {v.unit || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. Worked Numerical Example (Real Calculation with Real Numbers) */}
      {unit.workedExample && (
        <div className="border-t border-border/80 bg-surface-secondary/20 dark:bg-white/[0.01]">
          <button
            type="button"
            onClick={() => setShowWorkedExample(!showWorkedExample)}
            className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-surface-secondary/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold text-text-primary">
                Contoh Perhitungan Numerik Manual (Worked Example)
              </span>
            </div>
            {showWorkedExample ? (
              <ChevronUp className="w-4 h-4 text-text-tertiary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-tertiary" />
            )}
          </button>

          {showWorkedExample && (
            <div className="px-5 pb-4 pt-1 space-y-3 text-xs sm:text-sm border-t border-border/60">
              {/* Inputs */}
              <div className="p-3 rounded-lg bg-surface dark:bg-[#0f1013] border border-border">
                <span className="text-[11px] font-mono text-text-tertiary uppercase tracking-wider block mb-1">
                  Parameter & Data Input:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                  {Object.entries(unit.workedExample.inputs).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between p-1.5 rounded bg-surface-secondary/40">
                      <span className="text-text-secondary">{key}:</span>
                      <span className="font-semibold text-text-primary">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Breakdown */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-text-tertiary uppercase tracking-wider block">
                  Langkah Kalkulasi Aritmatika:
                </span>
                <ol className="list-decimal list-inside space-y-1.5 text-text-secondary">
                  {unit.workedExample.stepByStep.map((step, idx) => (
                    <li key={idx} className="leading-relaxed pl-1">
                      <span className="font-sans">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Final Computed Value */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/[0.05] border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-semibold">
                <span className="text-xs">Hasil Komputasi Final:</span>
                <span className="font-mono text-sm">{unit.workedExample.finalResult}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
