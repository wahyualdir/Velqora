"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal, Cpu, AlertTriangle, Layers, Clock } from "lucide-react";
import { NotebookCodeUnit } from "@/lib/curriculum/types";
import { NoteRenderer } from "@/components/notes/note-renderer";
import { toast } from "sonner";

interface NotebookCodeCellProps {
  unit: NotebookCodeUnit;
}

export function NotebookCodeCell({ unit }: NotebookCodeCellProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(unit.code);
      setCopied(true);
      toast.success("Kode berhasil disalin ke clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusBadge = () => {
    switch (unit.executionStatus) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            VERIFIED RUNNABLE
          </span>
        );
      case "success":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            SUCCESS
          </span>
        );
      case "running":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-2.5 h-2.5 animate-spin" />
            RUNNING
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            FAILED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-muted text-muted-foreground border border-border">
            NOT EXECUTED
          </span>
        );
    }
  };

  const lines = unit.code.split("\n");

  return (
    <div className="my-6 rounded-xl border border-border bg-surface dark:bg-[#121316] shadow-sm overflow-hidden transition-all">
      {/* 1. Pre-Explanation (Rationale & Theory Before Code) */}
      {unit.preExplanation && (
        <div className="px-5 py-4 border-b border-border/80 bg-surface-secondary/40 dark:bg-white/[0.02]">
          <div className="text-sm text-text-secondary leading-relaxed prose dark:prose-invert max-w-none">
            <NoteRenderer content={unit.preExplanation} />
          </div>
        </div>
      )}

      {/* 2. Code Cell Bar (Colab/Jupyter [In x] Header) */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-muted/40 dark:bg-[#18191d] border-b border-border/70 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <span className="px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-[11px] select-none">
            In [{unit.cellIndex !== undefined ? unit.cellIndex : " "}]
          </span>
          {unit.filename && (
            <span className="flex items-center gap-1.5 text-text-secondary font-medium text-[11px]">
              <Terminal className="w-3.5 h-3.5 text-text-tertiary" />
              <span>{unit.filename}</span>
            </span>
          )}
          <span className="text-[10px] uppercase tracking-wider text-text-tertiary px-1.5 py-0.5 rounded bg-surface border border-border">
            {unit.language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-surface text-text-secondary hover:text-text-primary transition-colors cursor-pointer border border-transparent hover:border-border"
            title="Salin kode"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px]">Salin</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Code Listing with Line Numbers */}
      <div className="relative overflow-x-auto bg-[#0d1117] text-[#e6edf3] font-mono text-[13px] leading-6 py-3 px-2 selection:bg-brand-500/30">
        <div className="flex">
          {/* Gutter Line Numbers */}
          <div className="select-none text-right pr-4 pl-2 text-white/30 border-r border-white/10 shrink-0 font-mono text-xs">
            {lines.map((_, i) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Actual Code */}
          <div className="pl-4 pr-2 flex-1 whitespace-pre overflow-x-auto">
            <code>{unit.code}</code>
          </div>
        </div>
      </div>

      {/* 4. Progressive Disclosure: Dependencies, Complexity & Failure Modes */}
      {(unit.dependencies?.length || unit.runtimeComplexity || unit.memoryComplexity || unit.failureModes?.length) ? (
        <details className="group border-t border-border/70 text-xs font-mono">
          <summary className="px-4 py-2 bg-surface-secondary/20 hover:bg-surface-secondary/40 dark:bg-white/[0.01] cursor-pointer text-[11px] text-text-tertiary hover:text-text-secondary select-none flex items-center justify-between transition-colors">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-brand-500" />
              <span>Rincian Lingkungan & Analisis Kompleksitas</span>
            </span>
            <span className="text-[10px] text-text-tertiary group-open:rotate-180 transition-transform">
              ▼
            </span>
          </summary>

          <div className="p-3 space-y-2 bg-surface-secondary/10 border-t border-border/40">
            {/* Dependencies & Complexity */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
              {unit.dependencies && unit.dependencies.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Layers className="w-3 h-3 text-text-tertiary shrink-0" />
                  <span className="text-text-tertiary">Dependencies:</span>
                  {unit.dependencies.map((dep) => (
                    <span
                      key={dep}
                      className="px-1.5 py-0.5 rounded bg-surface border border-border text-text-secondary text-[10px]"
                    >
                      {dep}
                    </span>
                  ))}
                </div>
              )}

              {(unit.runtimeComplexity || unit.memoryComplexity) && (
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-text-secondary">
                    <span>Waktu:</span>
                    <span className="text-text-primary font-semibold">{unit.runtimeComplexity || "O(1)"}</span>
                  </span>
                  <span className="flex items-center gap-1 text-text-secondary">
                    <span>Memori:</span>
                    <span className="text-text-primary font-semibold">{unit.memoryComplexity || "O(1)"}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Failure Modes */}
            {unit.failureModes && unit.failureModes.length > 0 && (
              <div className="pt-2 border-t border-border/40 text-[11px]">
                <div className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-400 mb-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>Potensi Kegagalan Runtime (Failure Modes):</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-text-secondary">
                  {unit.failureModes.map((failure, idx) => (
                    <li key={idx}>{failure}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </details>
      ) : null}

      {/* 5. Post-Analysis Commentary */}
      {unit.postAnalysis && (
        <div className="px-5 py-3.5 border-t border-border bg-surface dark:bg-[#121316]">
          <div className="text-xs text-text-secondary leading-relaxed prose dark:prose-invert max-w-none">
            <NoteRenderer content={unit.postAnalysis} />
          </div>
        </div>
      )}
    </div>
  );
}
