"use client";

import React from "react";
import Image from "next/image";
import { NotebookUnit } from "@/lib/curriculum/types";
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
import { Lightbulb, ArrowRight, Database, ImageIcon } from "lucide-react";

interface NotebookUnitRendererProps {
  units: NotebookUnit[];
  className?: string;
}

export function NotebookUnitRenderer({ units, className = "" }: NotebookUnitRendererProps) {
  if (!units || units.length === 0) return null;

  return (
    <div className={`notebook-learning-flow space-y-6 ${className}`}>
      {units.map((unit, index) => {
        const key = unit.id || `unit-${unit.type}-${index}`;

        switch (unit.type) {
          case "markdown":
            return (
              <div key={key} className="py-1">
                <NoteRenderer content={unit.content} />
              </div>
            );

          case "definition":
            return <NotebookDefinitionCard key={key} unit={unit} />;

          case "formula":
            return <NotebookFormulaCard key={key} unit={unit} />;

          case "code":
            return <NotebookCodeCell key={key} unit={unit} />;

          case "output":
            return <NotebookOutputCell key={key} unit={unit} />;

          case "interpretation":
            return <NotebookInterpretationCard key={key} unit={unit} />;

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
                className="my-6 rounded-xl border border-border bg-surface dark:bg-[#121316] shadow-sm overflow-hidden"
              >
                <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-surface-secondary/40">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary font-semibold">
                    Contoh Konkret / Case Illustration
                  </span>
                  <span className="text-text-tertiary">•</span>
                  <h4 className="text-xs sm:text-sm font-bold text-text-primary">
                    {unit.scenario}
                  </h4>
                </div>

                <div className="p-5 space-y-4 text-xs sm:text-sm leading-relaxed">
                  {/* Raw Input */}
                  <div className="p-3 rounded-lg bg-surface-secondary/30 dark:bg-white/[0.02] border border-border">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary block mb-1 font-semibold flex items-center gap-1.5">
                      <Database className="w-3 h-3" />
                      <span>Data Input Mentah:</span>
                    </span>
                    <pre className="font-mono text-xs overflow-x-auto p-2 bg-[#0d1117] text-[#e6edf3] rounded border border-border">
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
                    <div className="space-y-1.5">
                      {unit.transformationSteps.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2 text-text-secondary text-xs">
                          <span className="p-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 font-mono text-[10px] shrink-0 mt-0.5">
                            {sIdx + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expected Output */}
                  <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1 font-semibold flex items-center gap-1.5">
                      <ArrowRight className="w-3 h-3" />
                      <span>Output Akhir yang Diharapkan:</span>
                    </span>
                    <pre className="font-mono text-xs overflow-x-auto p-2 bg-[#0d1117] text-[#e6edf3] rounded border border-border">
                      {typeof unit.expectedOutput === "string"
                        ? unit.expectedOutput
                        : JSON.stringify(unit.expectedOutput, null, 2)}
                    </pre>
                  </div>

                  {/* Domain Analysis */}
                  <div className="p-3 rounded-lg bg-surface dark:bg-[#111215] border border-border text-text-secondary text-xs sm:text-[13px]">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary block mb-1 font-semibold">
                      Analisis Domain & Interpretasi:
                    </span>
                    <NoteRenderer content={unit.analysis} />
                  </div>
                </div>
              </div>
            );

          case "image":
            return (
              <figure
                key={key}
                className="my-6 rounded-xl border border-border bg-surface dark:bg-[#121316] p-4 text-center overflow-hidden shadow-xs"
              >
                <div className="flex items-center justify-center bg-surface-secondary/20 rounded-lg p-2 min-h-[160px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={unit.src}
                    alt={unit.alt}
                    className="max-h-[420px] max-w-full rounded object-contain mx-auto"
                  />
                </div>
                <figcaption className="mt-2.5 text-xs text-text-tertiary font-sans">
                  <span className="font-semibold text-text-secondary">{unit.caption}</span>
                </figcaption>
                {unit.technicalDiagramNote && (
                  <div className="mt-2 text-left p-2.5 rounded bg-surface-secondary/30 text-[11px] text-text-tertiary border border-border/60">
                    <span className="font-semibold text-text-secondary">Diagram Note: </span>
                    <span>{unit.technicalDiagramNote}</span>
                  </div>
                )}
              </figure>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
