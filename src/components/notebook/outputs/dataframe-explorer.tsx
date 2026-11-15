"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  Table2,
} from "lucide-react";
import type { DataFramePayload } from "@/lib/notebook/types";

interface DataFrameExplorerProps {
  payload: DataFramePayload;
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function csvEscape(val: unknown): string {
  if (val === null || val === undefined) return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function DataFrameExplorer({ payload }: DataFrameExplorerProps) {
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [showProfile, setShowProfile] = useState(false);

  const colNames = useMemo(
    () => payload.columns.map((c) => c.name),
    [payload.columns]
  );

  const filteredAndSortedRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = payload.rows || [];
    if (q) {
      list = list.filter((row) =>
        colNames.some((c) =>
          String(row[c] ?? "")
            .toLowerCase()
            .includes(q)
        )
      );
    }
    if (sortCol) {
      const col = sortCol;
      list = [...list].sort((a, b) => {
        const va = a[col];
        const vb = b[col];
        if (va === vb) return 0;
        if (va === null || va === undefined) return 1;
        if (vb === null || vb === undefined) return -1;
        if (typeof va === "number" && typeof vb === "number") {
          return sortDir === "asc" ? va - vb : vb - va;
        }
        return sortDir === "asc"
          ? String(va).localeCompare(String(vb))
          : String(vb).localeCompare(String(va));
      });
    }
    return list;
  }, [payload.rows, colNames, search, sortCol, sortDir]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedRows.length / pageSize)
  );
  const safePage = Math.min(page, totalPages);
  const visibleRows = filteredAndSortedRows.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
    setPage(1);
  };

  const handleExportCsv = () => {
    const header = colNames.map(csvEscape).join(",");
    const body = filteredAndSortedRows
      .map((r) => colNames.map((c) => csvEscape(r[c])).join(","))
      .join("\n");
    const blob = new Blob([`${header}\n${body}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${payload.variableName || "dataframe"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      {/* Header Toolbar */}
      <div className="px-3 py-2 bg-surface-secondary/60 border-b border-border flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Table2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
          <span className="text-xs font-mono font-bold text-text-primary truncate">
            {payload.variableName ? `${payload.variableName} ` : ""}
            ({payload.totalRows.toLocaleString("id-ID")} baris × {payload.totalColumns} kolom)
          </span>
          {payload.memoryBytes ? (
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-text-tertiary">
              {formatBytes(payload.memoryBytes)}
            </span>
          ) : null}
          {payload.truncated && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[10px] font-mono">
              Preview {payload.rows.length} baris
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="relative">
            <Search className="w-3 h-3 text-text-tertiary absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Filter baris..."
              className="pl-6 pr-2 py-1 text-[11px] font-mono rounded-lg border border-border bg-surface text-text-primary w-32 sm:w-40 focus:outline-hidden focus:border-brand-500"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowProfile((p) => !p)}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-mono cursor-pointer transition-colors ${
              showProfile
                ? "bg-brand-500/15 text-brand-700 dark:text-brand-300 border-brand-500/30"
                : "bg-surface text-text-secondary border-border hover:bg-surface-secondary"
            }`}
          >
            <BarChart3 className="w-3 h-3" />
            <span>Profil Kolom</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-[11px] font-mono text-text-secondary hover:text-text-primary cursor-pointer"
            title="Unduh DataFrame sebagai CSV"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* Column Profile Drawer */}
      {showProfile && (
        <div className="p-3 bg-surface-secondary/30 border-b border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {payload.columns.map((col) => {
            const maxBin = col.histogram ? Math.max(...col.histogram, 1) : 1;
            return (
              <div
                key={col.name}
                className="p-2.5 rounded-lg border border-border bg-surface space-y-1.5 text-[11px] font-mono"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-text-primary truncate">{col.name}</span>
                  <span className="px-1.5 py-0.5 rounded bg-surface-secondary text-[10px] text-text-tertiary shrink-0">
                    {col.dtype}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-text-secondary">
                  <span>Unique: {col.uniqueCount}</span>
                  <span>Null: {col.nullCount}</span>
                  {col.mean !== undefined && col.mean !== null && (
                    <span>Mean: {Number(col.mean).toFixed(2)}</span>
                  )}
                </div>
                {col.histogram && col.histogram.length > 0 && (
                  <div className="h-6 flex items-end gap-0.5 pt-1" aria-hidden="true">
                    {col.histogram.map((count, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-brand-600/70 dark:bg-brand-400/70 rounded-t-[2px]"
                        style={{
                          height: `${Math.max(12, Math.round((count / maxBin) * 100))}%`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Data Grid */}
      <div className="overflow-x-auto max-h-[380px]">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead className="bg-surface-secondary/80 sticky top-0 z-10 border-b border-border">
            <tr>
              <th className="px-2.5 py-2 text-[10px] text-text-tertiary font-semibold w-10 border-r border-border/50">
                #
              </th>
              {payload.columns.map((col) => {
                const isSorted = sortCol === col.name;
                return (
                  <th
                    key={col.name}
                    onClick={() => handleSort(col.name)}
                    className="px-3 py-2 font-semibold text-text-primary cursor-pointer hover:bg-surface-secondary select-none whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.name}</span>
                      <span className="text-[9.5px] font-normal text-text-tertiary">
                        ({col.dtype})
                      </span>
                      {isSorted &&
                        (sortDir === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-brand-600" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-brand-600" />
                        ))}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {visibleRows.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-surface-secondary/40 transition-colors"
              >
                <td className="px-2.5 py-1.5 text-[10.5px] text-text-tertiary border-r border-border/40 tabular-nums">
                  {(safePage - 1) * pageSize + idx + 1}
                </td>
                {colNames.map((colName) => {
                  const val = row[colName];
                  const isNull = val === null || val === undefined || val === "";
                  return (
                    <td
                      key={colName}
                      className="px-3 py-1.5 whitespace-nowrap max-w-[260px] truncate text-text-primary tabular-nums"
                      title={isNull ? "NULL" : String(val)}
                    >
                      {isNull ? (
                        <span className="text-[10px] italic text-text-tertiary">NaN</span>
                      ) : typeof val === "object" ? (
                        JSON.stringify(val)
                      ) : (
                        String(val)
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            {visibleRows.length === 0 && (
              <tr>
                <td
                  colSpan={colNames.length + 1}
                  className="px-4 py-6 text-center text-xs text-text-tertiary"
                >
                  Tidak ada baris yang cocok dengan filter pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-3 py-2 bg-surface-secondary/40 border-t border-border flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-text-secondary">
        <div className="flex items-center gap-2">
          <span>
            Halaman {safePage} / {totalPages} ({filteredAndSortedRows.length} baris tampil)
          </span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="px-1.5 py-0.5 rounded border border-border bg-surface text-[11px]"
            aria-label="Baris per halaman"
          >
            <option value={10}>10/hal</option>
            <option value={15}>15/hal</option>
            <option value={30}>30/hal</option>
            <option value={50}>50/hal</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-1 rounded border border-border bg-surface disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="p-1 rounded border border-border bg-surface disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            aria-label="Halaman berikutnya"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
