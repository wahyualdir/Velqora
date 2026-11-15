"use client";

import React from "react";
import { Database, Download } from "lucide-react";
import type { SqlResultPayload } from "@/lib/notebook/types";

interface SqlTableOutputProps {
  payload: SqlResultPayload;
}

function csvEscape(val: unknown): string {
  if (val === null || val === undefined) return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function SqlTableOutput({ payload }: SqlTableOutputProps) {
  const handleExportCsv = () => {
    const header = payload.columns.map(csvEscape).join(",");
    const body = payload.rows
      .map((r) => r.map(csvEscape).join(","))
      .join("\n");
    const blob = new Blob([`${header}\n${body}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sql-result-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (payload.columns.length === 0) {
    return (
      <div className="px-3 py-2 rounded-xl border border-emerald-500/25 bg-emerald-500/5 text-xs font-mono text-emerald-700 dark:text-emerald-300 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 shrink-0" />
          <span>
            Query {payload.statementType} berhasil dieksekusi ({payload.changes} baris terdampak) • {payload.executionMs}ms
          </span>
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="px-3 py-2 bg-surface-secondary/60 border-b border-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-mono text-text-primary">
          <Database className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span className="font-bold">
            {payload.rowCount.toLocaleString("id-ID")} baris • {payload.columns.length} kolom
          </span>
          <span className="text-[10.5px] text-text-tertiary">
            ({payload.executionMs}ms)
          </span>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-[11px] font-mono text-text-secondary hover:text-text-primary cursor-pointer"
        >
          <Download className="w-3 h-3" />
          <span>Ekspor CSV</span>
        </button>
      </div>

      <div className="overflow-x-auto max-h-[340px]">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead className="bg-surface-secondary/80 sticky top-0 z-10 border-b border-border">
            <tr>
              {payload.columns.map((col, idx) => (
                <th
                  key={`${col}-${idx}`}
                  className="px-3 py-2 font-semibold text-text-primary whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {payload.rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-surface-secondary/40">
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className="px-3 py-1.5 whitespace-nowrap max-w-[280px] truncate text-text-primary tabular-nums"
                    title={cell === null || cell === undefined ? "NULL" : String(cell)}
                  >
                    {cell === null || cell === undefined ? (
                      <span className="text-[10px] italic text-text-tertiary">NULL</span>
                    ) : (
                      String(cell)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
