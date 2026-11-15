"use client";

import React from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  GitBranch,
  Play,
  RefreshCw,
} from "lucide-react";
import type { DagNodeInfo } from "@/lib/notebook/types";

interface DagPanelProps {
  nodes: DagNodeInfo[];
  reactiveMode: boolean;
  onToggleReactiveMode: (next: boolean) => void;
  onRunStaleCells: () => void;
  onFocusCell: (cellId: string) => void;
}

export function DagPanel({
  nodes,
  reactiveMode,
  onToggleReactiveMode,
  onRunStaleCells,
  onFocusCell,
}: DagPanelProps) {
  const staleNodes = nodes.filter(
    (n) => n.status === "stale" || n.status === "out_of_order"
  );

  return (
    <div className="space-y-3.5">
      <div className="p-3 rounded-xl border border-border bg-surface space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
            <GitBranch className="w-4 h-4 text-[#C2553A] dark:text-[#D4664A]" />
            <span>Eksekusi Reaktif (DAG)</span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={reactiveMode}
            onClick={() => onToggleReactiveMode(!reactiveMode)}
            className={`min-h-[32px] px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold cursor-pointer transition-colors ${
              reactiveMode
                ? "bg-[#C2553A] text-white border-[#C2553A]"
                : "bg-surface-secondary text-text-secondary border-border"
            }`}
          >
            {reactiveMode ? "Aktif" : "Manual"}
          </button>
        </div>

        <p className="text-[11px] text-text-secondary leading-relaxed">
          Saat aktif, mengubah atau menjalankan sel hulu otomatis menjalankan sel hilir yang bergantung padanya (bebas bug eksekusi tidak berurutan).
        </p>

        {staleNodes.length > 0 && (
          <button
            type="button"
            onClick={onRunStaleCells}
            className="w-full min-h-[38px] px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-800 dark:text-amber-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Jalankan {staleNodes.length} Sel Stale / Usang</span>
          </button>
        )}
      </div>

      {/* Node List */}
      <div className="space-y-1.5">
        {nodes.map((node) => {
          const badge =
            node.status === "fresh"
              ? {
                  label: "Sinkron",
                  cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
                  icon: CheckCircle2,
                }
              : node.status === "stale" || node.status === "out_of_order"
              ? {
                  label: node.status === "out_of_order" ? "Urutan Salah" : "Stale",
                  cls: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30",
                  icon: AlertCircle,
                }
              : node.status === "error"
              ? {
                  label: "Error",
                  cls: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25",
                  icon: AlertCircle,
                }
              : node.status === "running"
              ? {
                  label: "Berjalan",
                  cls: "bg-[#C2553A]/15 text-[#C2553A] dark:text-[#D4664A] border-[#C2553A]/30",
                  icon: Play,
                }
              : {
                  label: "Idle",
                  cls: "bg-surface-secondary text-text-tertiary border-border",
                  icon: GitBranch,
                };

          const Icon = badge.icon;

          return (
            <button
              key={node.cellId}
              type="button"
              onClick={() => onFocusCell(node.cellId)}
              className="w-full text-left p-2.5 rounded-xl border border-border bg-surface hover:border-[#C2553A]/40 space-y-1.5 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-text-primary">
                  Sel [{node.index + 1}]
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-mono font-semibold ${badge.cls}`}
                >
                  <Icon className="w-3 h-3" />
                  {badge.label}
                </span>
              </div>

              {(node.defines.length > 0 || node.uses.length > 0) && (
                <div className="text-[10.5px] font-mono text-text-secondary space-y-0.5">
                  {node.defines.length > 0 && (
                    <div className="truncate">
                      <span className="text-text-tertiary">Mendefinisikan: </span>
                      <span className="text-text-primary">
                        {node.defines.slice(0, 6).join(", ")}
                      </span>
                    </div>
                  )}
                  {node.downstreamCellIds.length > 0 && (
                    <div className="flex items-center gap-1 text-text-tertiary truncate">
                      <ArrowRight className="w-3 h-3 shrink-0" />
                      <span>
                        Mempengaruhi {node.downstreamCellIds.length} sel hilir
                      </span>
                    </div>
                  )}
                </div>
              )}

              {node.staleReason && (
                <p className="text-[10px] font-mono text-amber-700 dark:text-amber-300">
                  {node.staleReason}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
