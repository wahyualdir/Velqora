"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Code2,
  Download,
  Search,
  Table2,
  TrendingUp,
} from "lucide-react";
import type { DataFramePayload } from "@/lib/notebook/types";

interface DataFrameExplorerProps {
  payload: DataFramePayload;
  onInsertCode?: (code: string) => void;
}

type ExplorerViewMode = "table" | "chart" | "profile";
type QuickChartType = "bar" | "line" | "scatter" | "hist";
type BarAggMode = "mean" | "sum";

function toNumeric(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string") {
    const cleaned = value.trim().replace(/,/g, "");
    if (!cleaned) return null;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function formatAxisNum(val: number): string {
  const abs = Math.abs(val);
  if (abs >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (abs >= 10_000) return `${(val / 1_000).toFixed(1)}k`;
  if (Number.isInteger(val)) return String(val);
  if (abs >= 100) return val.toFixed(0);
  if (abs >= 1) return val.toFixed(2);
  return val.toFixed(3);
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

export function DataFrameExplorer({
  payload,
  onInsertCode,
}: DataFrameExplorerProps) {
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [viewMode, setViewMode] = useState<ExplorerViewMode>("table");
  const [chartType, setChartType] = useState<QuickChartType>("bar");
  const [barAgg, setBarAgg] = useState<BarAggMode>("mean");
  const [xCol, setXCol] = useState<string>("");
  const [yCol, setYCol] = useState<string>("");
  const [hoveredTip, setHoveredTip] = useState<{
    label: string;
    detail: string;
    xPct: number;
    yPct: number;
  } | null>(null);

  const colNames = useMemo(
    () => payload.columns.map((c) => c.name),
    [payload.columns]
  );

  const numericCols = useMemo(() => {
    return colNames.filter((name) => {
      const colMeta = payload.columns.find((c) => c.name === name);
      if (
        colMeta &&
        /int|float|double|number|decimal|numeric/i.test(colMeta.dtype)
      ) {
        return true;
      }
      const sample = (payload.rows || []).slice(0, 20);
      return sample.some((r) => toNumeric(r[name]) !== null);
    });
  }, [colNames, payload.columns, payload.rows]);

  const effectiveXCol = useMemo(() => {
    if (xCol && colNames.includes(xCol)) return xCol;
    if (chartType === "scatter") {
      return numericCols[0] ?? colNames[0] ?? "";
    }
    return (
      colNames.find((c) => !numericCols.includes(c)) ?? colNames[0] ?? ""
    );
  }, [xCol, colNames, numericCols, chartType]);

  const effectiveYCol = useMemo(() => {
    if (yCol && numericCols.includes(yCol)) return yCol;
    if (chartType === "scatter" && numericCols.length > 1) {
      return numericCols[1] ?? numericCols[0] ?? "";
    }
    return numericCols[0] ?? colNames[0] ?? "";
  }, [yCol, numericCols, colNames, chartType]);

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

  const quickChartData = useMemo(() => {
    if (viewMode !== "chart") return null;
    if (numericCols.length === 0 || !effectiveYCol) {
      return {
        kind: "empty" as const,
        reason: "Belum ada kolom numerik yang dapat divisualisasikan.",
      };
    }

    const rows = filteredAndSortedRows;
    if (rows.length === 0) {
      return {
        kind: "empty" as const,
        reason: "Tidak ada baris data yang cocok dengan filter.",
      };
    }

    if (chartType === "bar") {
      const grouped = new Map<string, number[]>();
      rows.forEach((row) => {
        const y = toNumeric(row[effectiveYCol]);
        if (y === null) return;
        const label = String(row[effectiveXCol] ?? "(Kosong)").trim() || "(Kosong)";
        const bucket = grouped.get(label) || [];
        bucket.push(y);
        grouped.set(label, bucket);
      });

      const items = [...grouped.entries()]
        .slice(0, 14)
        .map(([label, vals]) => {
          const sum = vals.reduce((a, b) => a + b, 0);
          const value = barAgg === "sum" ? sum : sum / vals.length;
          return { label, value, count: vals.length };
        });

      if (items.length === 0) {
        return {
          kind: "empty" as const,
          reason: `Kolom "${effectiveYCol}" tidak memiliki nilai angka valid.`,
        };
      }

      const values = items.map((i) => i.value);
      const rawMin = Math.min(...values);
      const rawMax = Math.max(...values);
      const min = Math.min(0, rawMin);
      const max = Math.max(0, rawMax === min ? min + 1 : rawMax);
      return {
        kind: "bar" as const,
        items,
        min,
        max,
        stats: {
          min: rawMin,
          max: rawMax,
          mean: values.reduce((a, b) => a + b, 0) / values.length,
          count: items.length,
        },
      };
    }

    if (chartType === "line") {
      const points: Array<{ index: number; label: string; value: number }> = [];
      for (let i = 0; i < rows.length && points.length < 60; i++) {
        const y = toNumeric(rows[i][effectiveYCol]);
        if (y === null) continue;
        const rawLabel = effectiveXCol ? rows[i][effectiveXCol] : undefined;
        const label =
          rawLabel !== undefined && rawLabel !== null && String(rawLabel).trim()
            ? String(rawLabel)
            : `#${i + 1}`;
        points.push({ index: points.length, label, value: y });
      }
      if (points.length === 0) {
        return {
          kind: "empty" as const,
          reason: `Kolom "${effectiveYCol}" tidak memiliki nilai angka valid.`,
        };
      }
      const values = points.map((p) => p.value);
      const rawMin = Math.min(...values);
      const rawMax = Math.max(...values);
      const pad = (rawMax - rawMin || Math.abs(rawMax) || 1) * 0.08;
      return {
        kind: "line" as const,
        points,
        min: rawMin - pad,
        max: rawMax + pad,
        stats: {
          min: rawMin,
          max: rawMax,
          mean: values.reduce((a, b) => a + b, 0) / values.length,
          count: points.length,
        },
      };
    }

    if (chartType === "scatter") {
      const sxCol = numericCols.includes(effectiveXCol)
        ? effectiveXCol
        : numericCols[0];
      const pts: Array<{ x: number; y: number; rowIdx: number }> = [];
      for (let i = 0; i < rows.length && pts.length < 250; i++) {
        const x = toNumeric(rows[i][sxCol]);
        const y = toNumeric(rows[i][effectiveYCol]);
        if (x === null || y === null) continue;
        pts.push({ x, y, rowIdx: i + 1 });
      }
      if (pts.length === 0) {
        return {
          kind: "empty" as const,
          reason: `Kombinasi "${sxCol}" dan "${effectiveYCol}" belum memiliki titik angka valid.`,
        };
      }
      const xs = pts.map((p) => p.x);
      const ys = pts.map((p) => p.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const padX = (maxX - minX || 1) * 0.06;
      const padY = (maxY - minY || 1) * 0.06;
      return {
        kind: "scatter" as const,
        xLabel: sxCol,
        points: pts,
        minX: minX - padX,
        maxX: maxX + padX,
        minY: minY - padY,
        maxY: maxY + padY,
        stats: {
          min: minY,
          max: maxY,
          mean: ys.reduce((a, b) => a + b, 0) / ys.length,
          count: pts.length,
        },
      };
    }

    // Histogram
    const vals = rows
      .map((r) => toNumeric(r[effectiveYCol]))
      .filter((n): n is number => n !== null);
    if (vals.length === 0) {
      return {
        kind: "empty" as const,
        reason: `Kolom "${effectiveYCol}" tidak memiliki nilai angka valid.`,
      };
    }
    const rawMin = Math.min(...vals);
    const rawMax = Math.max(...vals);
    const binCount = rawMax === rawMin ? 1 : 10;
    const width = (rawMax - rawMin) / binCount || 1;
    const bins = Array.from({ length: binCount }, (_, i) => ({
      start: rawMin + i * width,
      end: rawMin + (i + 1) * width,
      count: 0,
    }));
    vals.forEach((v) => {
      const idx =
        rawMax === rawMin
          ? 0
          : Math.min(binCount - 1, Math.floor((v - rawMin) / width));
      bins[idx].count += 1;
    });
    const maxCount = Math.max(...bins.map((b) => b.count), 1);
    return {
      kind: "hist" as const,
      bins,
      maxCount,
      stats: {
        min: rawMin,
        max: rawMax,
        mean: vals.reduce((a, b) => a + b, 0) / vals.length,
        count: vals.length,
      },
    };
  }, [
    viewMode,
    numericCols,
    effectiveXCol,
    effectiveYCol,
    filteredAndSortedRows,
    chartType,
    barAgg,
  ]);

  const handleInsertMatplotlib = () => {
    if (!onInsertCode) return;
    const dfVar = payload.variableName || "df";
    const esc = (s: string) => s.replace(/'/g, "\\'");
    let snippet = "";

    if (chartType === "bar") {
      const aggFn = barAgg === "sum" ? "sum" : "mean";
      snippet = [
        "import matplotlib.pyplot as plt",
        "",
        `grouped = ${dfVar}.groupby('${esc(effectiveXCol)}') ['${esc(effectiveYCol)}'].${aggFn}().head(12)`.replace(") ['", ")['"),
        "fig, ax = plt.subplots(figsize=(8, 4.2))",
        "grouped.plot(kind='bar', ax=ax, color='#C2553A', edgecolor='none')",
        `ax.set_title('${barAgg === "sum" ? "Total" : "Rata-rata"} ${esc(effectiveYCol)} per ${esc(effectiveXCol)}')`,
        `ax.set_xlabel('${esc(effectiveXCol)}')`,
        `ax.set_ylabel('${esc(effectiveYCol)}')`,
        "plt.xticks(rotation=30, ha='right')",
        "plt.tight_layout()",
        "plt.show()",
      ].join("\n");
    } else if (chartType === "line") {
      snippet = [
        "import matplotlib.pyplot as plt",
        "",
        "fig, ax = plt.subplots(figsize=(8, 4.2))",
        `ax.plot(${dfVar}['${esc(effectiveXCol)}'].head(60), ${dfVar}['${esc(effectiveYCol)}'].head(60), marker='o', color='#C2553A', linewidth=2)`,
        `ax.set_title('Tren ${esc(effectiveYCol)} terhadap ${esc(effectiveXCol)}')`,
        `ax.set_xlabel('${esc(effectiveXCol)}')`,
        `ax.set_ylabel('${esc(effectiveYCol)}')`,
        "ax.grid(alpha=0.25)",
        "plt.xticks(rotation=30, ha='right')",
        "plt.tight_layout()",
        "plt.show()",
      ].join("\n");
    } else if (chartType === "scatter") {
      const sxCol = numericCols.includes(effectiveXCol)
        ? effectiveXCol
        : numericCols[0] || effectiveXCol;
      snippet = [
        "import matplotlib.pyplot as plt",
        "",
        "fig, ax = plt.subplots(figsize=(7.5, 4.5))",
        `ax.scatter(${dfVar}['${esc(sxCol)}'], ${dfVar}['${esc(effectiveYCol)}'], alpha=0.8, color='#C2553A')`,
        `ax.set_title('Sebaran ${esc(effectiveYCol)} vs ${esc(sxCol)}')`,
        `ax.set_xlabel('${esc(sxCol)}')`,
        `ax.set_ylabel('${esc(effectiveYCol)}')`,
        "ax.grid(alpha=0.25)",
        "plt.tight_layout()",
        "plt.show()",
      ].join("\n");
    } else {
      snippet = [
        "import matplotlib.pyplot as plt",
        "",
        "fig, ax = plt.subplots(figsize=(7.5, 4.2))",
        `ax.hist(${dfVar}['${esc(effectiveYCol)}'].dropna(), bins=10, color='#C2553A', edgecolor='white')`,
        `ax.set_title('Distribusi ${esc(effectiveYCol)}')`,
        `ax.set_xlabel('${esc(effectiveYCol)}')`,
        "ax.set_ylabel('Frekuensi')",
        "ax.grid(axis='y', alpha=0.25)",
        "plt.tight_layout()",
        "plt.show()",
      ].join("\n");
    }

    onInsertCode(snippet);
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

          <div className="inline-flex items-center p-0.5 rounded-lg bg-surface border border-border">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono cursor-pointer transition-colors ${
                viewMode === "table"
                  ? "bg-[#C2553A] text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Table2 className="w-3 h-3" />
              <span>Tabel</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode("chart");
                setHoveredTip(null);
              }}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono cursor-pointer transition-colors ${
                viewMode === "chart"
                  ? "bg-[#C2553A] text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              <span>Grafik Cepat</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("profile")}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono cursor-pointer transition-colors ${
                viewMode === "profile"
                  ? "bg-[#C2553A] text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              <span>Profil</span>
            </button>
          </div>

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
      {viewMode === "profile" && (
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

      {/* Quick Chart View */}
      {viewMode === "chart" && (
        <div className="p-3 bg-surface-secondary/20 border-b border-border space-y-3">
          {/* Controls Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: "bar", label: "Bar" },
                  { id: "line", label: "Line" },
                  { id: "scatter", label: "Scatter" },
                  { id: "hist", label: "Histogram" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setChartType(opt.id);
                    setHoveredTip(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-colors cursor-pointer ${
                    chartType === opt.id
                      ? "bg-[#C2553A]/15 text-[#C2553A] dark:text-[#F09A82] border-[#C2553A]/40 font-semibold"
                      : "bg-surface text-text-secondary border-border hover:text-text-primary"
                  }`}
                >
                  {opt.label}
                </button>
              ))}

              {chartType !== "hist" && (
                <label className="inline-flex items-center gap-1 text-[11px] font-mono text-text-secondary ml-1">
                  <span>X:</span>
                  <select
                    value={effectiveXCol}
                    onChange={(e) => setXCol(e.target.value)}
                    className="px-2 py-1 rounded-lg border border-border bg-surface text-text-primary text-[11px]"
                  >
                    {(chartType === "scatter" ? numericCols : colNames).map(
                      (c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      )
                    )}
                  </select>
                </label>
              )}

              <label className="inline-flex items-center gap-1 text-[11px] font-mono text-text-secondary">
                <span>{chartType === "hist" ? "Kolom:" : "Y:"}</span>
                <select
                  value={effectiveYCol}
                  onChange={(e) => setYCol(e.target.value)}
                  className="px-2 py-1 rounded-lg border border-border bg-surface text-text-primary text-[11px]"
                >
                  {numericCols.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              {chartType === "bar" && (
                <select
                  value={barAgg}
                  onChange={(e) => setBarAgg(e.target.value as BarAggMode)}
                  className="px-2 py-1 rounded-lg border border-border bg-surface text-text-primary text-[11px] font-mono"
                  aria-label="Agregasi Bar"
                >
                  <option value="mean">Rata-rata</option>
                  <option value="sum">Total</option>
                </select>
              )}
            </div>

            {onInsertCode && quickChartData && quickChartData.kind !== "empty" && (
              <button
                type="button"
                onClick={handleInsertMatplotlib}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#C2553A] hover:bg-[#AD472E] text-white text-[11px] font-semibold cursor-pointer transition-colors"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>+ Kode Matplotlib</span>
              </button>
            )}
          </div>

          {/* Interactive SVG Canvas */}
          {!quickChartData || quickChartData.kind === "empty" ? (
            <div className="p-6 rounded-xl border border-dashed border-border bg-surface text-center text-xs text-text-muted">
              {quickChartData?.reason ||
                "Data tidak cukup untuk membuat grafik."}
            </div>
          ) : (
            <div className="relative rounded-xl border border-border bg-surface p-3 overflow-hidden">
              {hoveredTip && (
                <div
                  className="pointer-events-none absolute z-10 px-2.5 py-1.5 rounded-lg bg-[#1C1917] text-[#FAF8F5] border border-white/15 shadow-md text-[10.5px] font-mono -translate-x-1/2 -translate-y-full"
                  style={{
                    left: `${Math.min(88, Math.max(12, hoveredTip.xPct))}%`,
                    top: `${Math.max(16, hoveredTip.yPct)}%`,
                  }}
                >
                  <div className="font-bold">{hoveredTip.label}</div>
                  <div className="text-amber-300">{hoveredTip.detail}</div>
                </div>
              )}

              <svg
                viewBox="0 0 640 240"
                className="w-full h-[220px] select-none"
                onMouseLeave={() => setHoveredTip(null)}
              >
                {(() => {
                  const W = 640;
                  const H = 240;
                  const m = { top: 14, right: 16, bottom: 44, left: 54 };
                  const iw = W - m.left - m.right;
                  const ih = H - m.top - m.bottom;

                  if (quickChartData.kind === "bar") {
                    const { items, min, max } = quickChartData;
                    const range = max - min || 1;
                    const y0 = m.top + ih - ((0 - min) / range) * ih;
                    const bandW = iw / items.length;
                    const barW = Math.max(8, Math.min(38, bandW * 0.66));

                    return (
                      <>
                        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                          const y = m.top + ih - t * ih;
                          const tickVal = min + t * range;
                          return (
                            <g key={i}>
                              <line
                                x1={m.left}
                                x2={W - m.right}
                                y1={y}
                                y2={y}
                                stroke="currentColor"
                                strokeOpacity={0.1}
                                strokeDasharray="3 3"
                              />
                              <text
                                x={m.left - 6}
                                y={y + 3}
                                textAnchor="end"
                                className="fill-text-muted text-[9.5px] font-mono"
                              >
                                {formatAxisNum(tickVal)}
                              </text>
                            </g>
                          );
                        })}

                        {items.map((item, i) => {
                          const x = m.left + i * bandW + (bandW - barW) / 2;
                          const yVal = m.top + ih - ((item.value - min) / range) * ih;
                          const barTop = Math.min(yVal, y0);
                          const barH = Math.max(2, Math.abs(y0 - yVal));
                          const labelShort =
                            item.label.length > 10
                              ? `${item.label.slice(0, 9)}…`
                              : item.label;

                          return (
                            <g
                              key={`${item.label}-${i}`}
                              className="cursor-pointer"
                              onMouseEnter={() =>
                                setHoveredTip({
                                  label: item.label,
                                  detail: `${effectiveYCol}: ${formatAxisNum(item.value)} (${item.count} baris)`,
                                  xPct: ((x + barW / 2) / W) * 100,
                                  yPct: (barTop / H) * 100,
                                })
                              }
                            >
                              <rect
                                x={x}
                                y={barTop}
                                width={barW}
                                height={barH}
                                rx={4}
                                className="fill-[#C2553A] hover:fill-[#E06D50] transition-colors"
                              />
                              <text
                                x={x + barW / 2}
                                y={H - m.bottom + 14}
                                textAnchor="middle"
                                className="fill-text-secondary text-[9px] font-mono"
                              >
                                {labelShort}
                              </text>
                            </g>
                          );
                        })}
                      </>
                    );
                  }

                  if (quickChartData.kind === "line") {
                    const { points, min, max } = quickChartData;
                    const range = max - min || 1;
                    const coords = points.map((p, i) => {
                      const cx =
                        points.length === 1
                          ? m.left + iw / 2
                          : m.left + (i / (points.length - 1)) * iw;
                      const cy = m.top + ih - ((p.value - min) / range) * ih;
                      return { ...p, cx, cy };
                    });
                    const polyPoints = coords
                      .map((c) => `${c.cx.toFixed(1)},${c.cy.toFixed(1)}`)
                      .join(" ");

                    return (
                      <>
                        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                          const y = m.top + ih - t * ih;
                          return (
                            <g key={i}>
                              <line
                                x1={m.left}
                                x2={W - m.right}
                                y1={y}
                                y2={y}
                                stroke="currentColor"
                                strokeOpacity={0.1}
                                strokeDasharray="3 3"
                              />
                              <text
                                x={m.left - 6}
                                y={y + 3}
                                textAnchor="end"
                                className="fill-text-muted text-[9.5px] font-mono"
                              >
                                {formatAxisNum(min + t * range)}
                              </text>
                            </g>
                          );
                        })}

                        <polyline
                          fill="none"
                          stroke="#C2553A"
                          strokeWidth={2.2}
                          points={polyPoints}
                        />

                        {coords.map((c, i) => (
                          <circle
                            key={i}
                            cx={c.cx}
                            cy={c.cy}
                            r={coords.length > 35 ? 2.8 : 4}
                            className="fill-[#C2553A] stroke-surface stroke-1 hover:r-6 cursor-pointer"
                            onMouseEnter={() =>
                              setHoveredTip({
                                label: `${effectiveXCol}: ${c.label}`,
                                detail: `${effectiveYCol}: ${formatAxisNum(c.value)}`,
                                xPct: (c.cx / W) * 100,
                                yPct: (c.cy / H) * 100,
                              })
                            }
                          />
                        ))}

                        {coords.length > 0 && (
                          <>
                            <text
                              x={m.left}
                              y={H - m.bottom + 15}
                              className="fill-text-muted text-[9px] font-mono"
                            >
                              {coords[0].label.slice(0, 12)}
                            </text>
                            <text
                              x={W - m.right}
                              y={H - m.bottom + 15}
                              textAnchor="end"
                              className="fill-text-muted text-[9px] font-mono"
                            >
                              {coords[coords.length - 1].label.slice(0, 12)}
                            </text>
                          </>
                        )}
                      </>
                    );
                  }

                  if (quickChartData.kind === "scatter") {
                    const { points, minX, maxX, minY, maxY, xLabel } =
                      quickChartData;
                    const rangeX = maxX - minX || 1;
                    const rangeY = maxY - minY || 1;
                    return (
                      <>
                        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                          const y = m.top + ih - t * ih;
                          return (
                            <g key={i}>
                              <line
                                x1={m.left}
                                x2={W - m.right}
                                y1={y}
                                y2={y}
                                stroke="currentColor"
                                strokeOpacity={0.1}
                                strokeDasharray="3 3"
                              />
                              <text
                                x={m.left - 6}
                                y={y + 3}
                                textAnchor="end"
                                className="fill-text-muted text-[9.5px] font-mono"
                              >
                                {formatAxisNum(minY + t * rangeY)}
                              </text>
                            </g>
                          );
                        })}

                        {points.map((pt, i) => {
                          const cx = m.left + ((pt.x - minX) / rangeX) * iw;
                          const cy = m.top + ih - ((pt.y - minY) / rangeY) * ih;
                          return (
                            <circle
                              key={i}
                              cx={cx}
                              cy={cy}
                              r={4}
                              fillOpacity={0.78}
                              className="fill-[#C2553A] hover:fill-[#E06D50] cursor-pointer"
                              onMouseEnter={() =>
                                setHoveredTip({
                                  label: `Baris #${pt.rowIdx}`,
                                  detail: `${xLabel}: ${formatAxisNum(pt.x)} · ${effectiveYCol}: ${formatAxisNum(pt.y)}`,
                                  xPct: (cx / W) * 100,
                                  yPct: (cy / H) * 100,
                                })
                              }
                            />
                          );
                        })}

                        <text
                          x={m.left}
                          y={H - m.bottom + 15}
                          className="fill-text-muted text-[9px] font-mono"
                        >
                          {formatAxisNum(minX)}
                        </text>
                        <text
                          x={m.left + iw / 2}
                          y={H - m.bottom + 15}
                          textAnchor="middle"
                          className="fill-text-secondary text-[9.5px] font-mono"
                        >
                          {xLabel}
                        </text>
                        <text
                          x={W - m.right}
                          y={H - m.bottom + 15}
                          textAnchor="end"
                          className="fill-text-muted text-[9px] font-mono"
                        >
                          {formatAxisNum(maxX)}
                        </text>
                      </>
                    );
                  }

                  // Histogram
                  const { bins, maxCount } = quickChartData;
                  const bandW = iw / bins.length;
                  const barW = Math.max(8, bandW * 0.86);
                  return (
                    <>
                      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                        const y = m.top + ih - t * ih;
                        return (
                          <g key={i}>
                            <line
                              x1={m.left}
                              x2={W - m.right}
                              y1={y}
                              y2={y}
                              stroke="currentColor"
                              strokeOpacity={0.1}
                              strokeDasharray="3 3"
                            />
                            <text
                              x={m.left - 6}
                              y={y + 3}
                              textAnchor="end"
                              className="fill-text-muted text-[9.5px] font-mono"
                            >
                              {Math.round(t * maxCount)}
                            </text>
                          </g>
                        );
                      })}

                      {bins.map((b, i) => {
                        const x = m.left + i * bandW + (bandW - barW) / 2;
                        const bh = Math.max(2, (b.count / maxCount) * ih);
                        const y = m.top + ih - bh;
                        return (
                          <g
                            key={i}
                            className="cursor-pointer"
                            onMouseEnter={() =>
                              setHoveredTip({
                                label: `${formatAxisNum(b.start)} – ${formatAxisNum(b.end)}`,
                                detail: `Frekuensi: ${b.count}`,
                                xPct: ((x + barW / 2) / W) * 100,
                                yPct: (y / H) * 100,
                              })
                            }
                          >
                            <rect
                              x={x}
                              y={y}
                              width={barW}
                              height={bh}
                              rx={3}
                              className="fill-[#C2553A] hover:fill-[#E06D50] transition-colors"
                            />
                            {(i === 0 || i === bins.length - 1 || i % 2 === 0) && (
                              <text
                                x={x + barW / 2}
                                y={H - m.bottom + 14}
                                textAnchor="middle"
                                className="fill-text-muted text-[8.5px] font-mono"
                              >
                                {formatAxisNum(b.start)}
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>

              {/* Quick Stats Strip */}
              <div className="mt-2 pt-2 border-t border-border/70 flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-mono text-text-secondary">
                <div className="flex flex-wrap items-center gap-3">
                  <span>
                    Min: <strong>{formatAxisNum(quickChartData.stats.min)}</strong>
                  </span>
                  <span>
                    Mean: <strong>{formatAxisNum(quickChartData.stats.mean)}</strong>
                  </span>
                  <span>
                    Max: <strong>{formatAxisNum(quickChartData.stats.max)}</strong>
                  </span>
                </div>
                <span className="text-text-muted">
                  {quickChartData.stats.count} titik ditampilkan
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Data Grid */}
      {viewMode === "table" && (
        <>
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
        </>
      )}
    </div>
  );
}
