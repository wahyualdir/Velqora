"use client";

import React, { useState } from "react";
import { Briefcase, Database, CheckSquare, Square, Flag, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { NotebookProjectUnit } from "@/lib/curriculum/types";
import { NoteRenderer } from "@/components/notes/note-renderer";

interface NotebookProjectCardProps {
  unit: NotebookProjectUnit;
}

export function NotebookProjectCard({ unit }: NotebookProjectCardProps) {
  const [completedDeliverables, setCompletedDeliverables] = useState<Record<string, boolean>>({});

  const toggleDeliverable = (key: string) => {
    setCompletedDeliverables((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="my-6 rounded-xl border border-brand-500/30 bg-surface dark:bg-[#131418] shadow-sm overflow-hidden transition-all">
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 border-b border-border bg-brand-500/5">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
            <Briefcase className="w-4 h-4" />
          </span>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary">
              Proyek Praktikum Terapan (End-to-End Case Study)
            </span>
            <h4 className="text-sm sm:text-base font-bold text-text-primary font-display">
              {unit.title}
            </h4>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
        {/* 2. Industry Context & Business Problem */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-surface-secondary/40 dark:bg-white/[0.02] border border-border">
            <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary font-semibold block mb-1">
              Konteks Industri:
            </span>
            <p className="text-text-primary text-xs leading-relaxed">
              {unit.industryContext}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-surface-secondary/40 dark:bg-white/[0.02] border border-border">
            <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary font-semibold block mb-1">
              Tantangan Bisnis:
            </span>
            <p className="text-text-primary text-xs leading-relaxed">
              {unit.businessProblem}
            </p>
          </div>
        </div>

        {/* 3. Dataset Specifications Table */}
        <div className="p-3.5 rounded-lg border border-border bg-surface-secondary/20">
          <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary font-semibold flex items-center gap-1.5 mb-2">
            <Database className="w-3.5 h-3.5 text-brand-500" />
            <span>Spesifikasi Dataset Rujukan:</span>
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
            <div className="p-2 rounded bg-surface border border-border">
              <span className="text-text-tertiary text-[10px] block">NAMA DATASET</span>
              <span className="font-semibold text-text-primary text-xs">{unit.datasetSpecs.name}</span>
            </div>
            <div className="p-2 rounded bg-surface border border-border">
              <span className="text-text-tertiary text-[10px] block">DIMENSI (BARIS × KOLOM)</span>
              <span className="font-semibold text-text-primary text-xs">
                {unit.datasetSpecs.rows.toLocaleString()} × {unit.datasetSpecs.columns}
              </span>
            </div>
            <div className="p-2 rounded bg-surface border border-border">
              <span className="text-text-tertiary text-[10px] block">VARIABEL TARGET</span>
              <span className="font-semibold text-brand-600 dark:text-brand-400 text-xs">
                {unit.datasetSpecs.targetVariable || "N/A"}
              </span>
            </div>
            <div className="p-2 rounded bg-surface border border-border">
              <span className="text-text-tertiary text-[10px] block">PROVENANCE / SUMBER</span>
              <a
                href={unit.datasetSpecs.source}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-brand-600 hover:underline truncate block"
              >
                {unit.datasetSpecs.source.replace(/^https?:\/\//, "")}
              </a>
            </div>
          </div>
        </div>

        {/* 4. Milestones with Deliverable Checklist */}
        <div className="space-y-3 pt-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary font-semibold flex items-center gap-1.5">
            <Flag className="w-3.5 h-3.5 text-brand-500" />
            <span>Milestone Implementasi & Deliverables:</span>
          </span>
          <div className="space-y-2">
            {unit.milestoneSteps.map((step, sIdx) => (
              <div
                key={sIdx}
                className="p-3 rounded-lg border border-border bg-surface dark:bg-[#111215]"
              >
                <h5 className="font-semibold text-xs sm:text-sm text-text-primary mb-2 flex items-center gap-2">
                  <span className="px-1.5 py-0.2 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 font-mono text-[10px]">
                    Tahap {sIdx + 1}
                  </span>
                  <span>{step.title}</span>
                </h5>
                <ul className="space-y-1.5 pl-1">
                  {step.deliverables.map((del, dIdx) => {
                    const key = `${sIdx}-${dIdx}`;
                    const isChecked = !!completedDeliverables[key];
                    return (
                      <li
                        key={dIdx}
                        onClick={() => toggleDeliverable(key)}
                        className="flex items-start gap-2 text-xs text-text-secondary cursor-pointer hover:text-text-primary select-none"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-text-tertiary shrink-0 mt-0.5" />
                        )}
                        <span className={isChecked ? "line-through text-text-tertiary" : ""}>
                          {del}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Acceptance Criteria */}
        <div className="p-3.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Kriteria Penerimaan (Acceptance Criteria):</span>
          </span>
          <ul className="space-y-1 text-xs text-text-secondary">
            {unit.acceptanceCriteria.map((crit, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>{crit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
