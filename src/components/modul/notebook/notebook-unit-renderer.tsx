"use client";

import React from "react";
import Image from "next/image";
import { NotebookUnit, NotebookCodeUnit, NotebookOutputUnit, NotebookInterpretationUnit } from "@/lib/curriculum/types";
import { NoteRenderer } from "@/components/notes/note-renderer";
import { NotebookCodeCell } from "./notebook-code-cell";
import { NotebookOutputCell } from "./notebook-output-cell";
import { NotebookFormulaCard } from "./notebook-formula-card";
import { NotebookExerciseCard } from "./notebook-exercise-card";
import { NotebookDefinitionCard } from "./notebook-definition-card";
import { NotebookInterpretationCard } from "./notebook-interpretation-card";
import { NotebookWarningCard } from "./notebook-warning-card";
import { NotebookProjectCard } from "./notebook-project-card";
import { NotebookTableCard } from "./notebook-table-card";
import { Lightbulb, Database, ArrowRight } from "lucide-react";

interface NotebookUnitRendererProps {
  units: NotebookUnit[];
  className?: string;
}

export function NotebookUnitRenderer({ units, className = "" }: NotebookUnitRendererProps) {
  if (!units || units.length === 0) return null;

  // Render elements in sequential academic narrative
  return (
    <div className={`notebook-academic-canvas space-y-7 ${className}`}>
      {units.map((unit, index) => {
        const key = unit.id || `unit-${unit.type}-${index}`;

        switch (unit.type) {
          case "markdown":
            return (
              <div key={key} className="py-1 text-sm sm:text-[15px] leading-relaxed text-text-secondary font-sans prose dark:prose-invert max-w-none">
                <NoteRenderer content={unit.content} />
              </div>
            );

          case "definition":
            return <NotebookDefinitionCard key={key} unit={unit} />;

          case "formula":
            return <NotebookFormulaCard key={key} unit={unit} />;

          case "code":
            return <NotebookCodeCell key={key} unit={unit as NotebookCodeUnit} />;

          case "output":
            return <NotebookOutputCell key={key} unit={unit as NotebookOutputUnit} />;

          case "interpretation":
            return <NotebookInterpretationCard key={key} unit={unit as NotebookInterpretationUnit} />;

          case "warning":
            return <NotebookWarningCard key={key} unit={unit} />;

          case "exercise":
            return <NotebookExerciseCard key={key} unit={unit} />;

          case "project":
            return <NotebookProjectCard key={key} unit={unit} />;

          case "table":
            return <NotebookTableCard key={key} unit={unit} />;

          case "example":
            return (
              <div
                key={key}
                className="my-6 rounded-xl border border-border/80 bg-surface dark:bg-[#121316] shadow-2xs overflow-hidden"
              >
                <div className="flex items-center gap-2 px-5 py-3 border-b border-border/80 bg-surface-secondary/30">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary font-semibold">
                    Kasus Konkret / Case Illustration
                  </span>
                  <span className="text-text-tertiary">•</span>
                  <h4 className="text-xs sm:text-sm font-bold text-text-primary font-display truncate">
                    {unit.scenario}
                  </h4>
                </div>

                <div className="p-5 space-y-4 text-xs sm:text-sm leading-relaxed">
                  {/* Raw Input */}
                  <div className="p-3 rounded-lg bg-surface-secondary/30 dark:bg-white/[0.02] border border-border/70">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary block mb-1.5 font-semibold flex items-center gap-1.5">
                      <Database className="w-3 h-3" />
                      <span>Data Input Mentah:</span>
                    </span>
                    <pre className="font-mono text-xs overflow-x-auto p-2.5 bg-[#0d1117] text-[#e6edf3] rounded-md border border-border/60">
                      {typeof unit.rawInput === "string"
                        ? unit.rawInput
                        : JSON.stringify(unit.rawInput, null, 2)}
                    </pre>
                  </div>

                  {/* Transformation Steps */}
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary block mb-1.5 font-semibold">
                      Tahapan Transformasi & Pemrosesan:
                    </span>
                    <ol className="list-decimal list-inside space-y-1 text-text-secondary pl-1">
                      {unit.transformationSteps.map((step, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Expected Output */}
                  <div className="p-3 rounded-lg bg-surface-secondary/30 dark:bg-white/[0.02] border border-border/70">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary block mb-1.5 font-semibold">
                      Hasil Transformasi Akhir:
                    </span>
                    <pre className="font-mono text-xs overflow-x-auto p-2.5 bg-[#0d1117] text-[#e6edf3] rounded-md border border-border/60">
                      {typeof unit.expectedOutput === "string"
                        ? unit.expectedOutput
                        : JSON.stringify(unit.expectedOutput, null, 2)}
                    </pre>
                  </div>

                  {/* Domain Analysis */}
                  <div className="pt-2 border-t border-border/60">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary block mb-1 font-semibold">
                      Analisis Domain & Rekomendasi Praktis:
                    </span>
                    <div className="text-text-secondary leading-relaxed prose dark:prose-invert max-w-none">
                      <NoteRenderer content={unit.analysis} />
                    </div>
                  </div>
                </div>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
