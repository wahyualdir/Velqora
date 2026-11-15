"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart2,
  Check,
  Code2,
  Copy,
  Database,
  FileSpreadsheet,
  FileText,
  Loader2,
  Search,
  Table2,
  X,
} from "lucide-react";
import {
  buildDatasetSnippets,
  getSafeSqlTableName,
} from "@/lib/notebook/sample-datasets";
import type { VfsFileEntry } from "@/lib/notebook/types";
import {
  parseTabularDataset,
  readVfsFileBytes,
} from "@/lib/notebook/vfs-manager";

interface DatasetPreviewModalProps {
  notebookId: string;
  file: VfsFileEntry | null;
  onClose: () => void;
  onInsertSnippet: (snippet: string, kernelHint?: "python" | "sql") => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function DatasetPreviewModal({
  notebookId,
  file,
  onClose,
  onInsertSnippet,
}: DatasetPreviewModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabular, setTabular] = useState<{
    tableName: string;
    columns: string[];
    rows: Record<string, unknown>[];
  } | null>(null);
  const [rawText, setRawText] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [copiedPath, setCopiedPath] = useState(false);

  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setTabular(null);
    setRawText(null);
    setSearch("");

    void (async () => {
      try {
        const bytes = await readVfsFileBytes(notebookId, file.path);
        if (cancelled) return;
        if (!bytes) {
          setError("Berkas tidak ditemukan di penyimpanan /workspace.");
          return;
        }
        const parsed = await parseTabularDataset(file.name, bytes);
        if (cancelled) return;
        if (parsed) {
          setTabular(parsed);
        } else {
          const previewSlice = bytes.slice(0, 24_000);
          const decoded = new TextDecoder("utf-8", { fatal: false }).decode(
            previewSlice
          );
          setRawText(decoded);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Gagal memuat pratinjau berkas.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [file, notebookId]);

  const filteredRows = useMemo(() => {
    if (!tabular) return [];
    const q = search.trim().toLowerCase();
    const list = q
      ? tabular.rows.filter((r) =>
          tabular.columns.some((col) =>
            String(r[col] ?? "")
              .toLowerCase()
              .includes(q)
          )
        )
      : tabular.rows;
    return list.slice(0, 200);
  }, [tabular, search]);

  const columnTypes = useMemo(() => {
    if (!tabular) return new Map<string, "numerik" | "teks">();
    const map = new Map<string, "numerik" | "teks">();
    const sample = tabular.rows.slice(0, 30);
    for (const col of tabular.columns) {
      const nonEmpty = sample
        .map((r) => r[col])
        .filter((v) => v !== null && v !== undefined && v !== "");
      const isNum =
        nonEmpty.length > 0 && nonEmpty.every((v) => typeof v === "number");
      map.set(col, isNum ? "numerik" : "teks");
    }
    return map;
  }, [tabular]);

  if (!file) return null;

  const snippets = buildDatasetSnippets(file);
  const sqlTableName = tabular?.tableName || getSafeSqlTableName(file.name);

  const handleCopyPath = async () => {
    try {
      await navigator.clipboard.writeText(file.path);
      setCopiedPath(true);
      setTimeout(() => setCopiedPath(false), 1500);
    } catch {
      // Ignore clipboard permission denial
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl max-h-[88dvh] rounded-2xl border border-border bg-surface shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-5 py-3 border-b border-border bg-[#F3EFE9]/60 dark:bg-[#141210] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/12 border border-emerald-500/25 flex items-center justify-center shrink-0">
              {tabular ? (
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <FileText className="w-4 h-4 text-[#C2553A]" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-mono font-bold text-text-primary truncate">
                  {file.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-surface border border-border text-[10px] font-mono text-text-secondary shrink-0">
                  {formatBytes(file.size)}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-text-tertiary">
                <span>{file.path}</span>
                {tabular && (
                  <>
                    <span>•</span>
                    <span className="text-text-secondary">
                      {tabular.rows.length.toLocaleString("id-ID")} baris ×{" "}
                      {tabular.columns.length} kolom
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 dark:text-emerald-300">
                      Tabel SQL: {sqlTableName}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleCopyPath}
              className="min-h-[34px] px-2.5 py-1 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-[11px] font-mono text-text-secondary hover:text-text-primary inline-flex items-center gap-1.5 cursor-pointer"
            >
              {copiedPath ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedPath ? "Tersalin" : "Salin Path"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[34px] min-w-[34px] rounded-xl border border-border bg-surface hover:bg-surface-secondary text-text-secondary flex items-center justify-center cursor-pointer"
              aria-label="Tutup pratinjau dataset"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {loading ? (
            <div className="p-10 flex flex-col items-center justify-center gap-2 text-xs font-mono text-text-secondary">
              <Loader2 className="w-5 h-5 animate-spin text-[#C2553A]" />
              <span>Memuat pratinjau dataset...</span>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-xs font-mono text-rose-600 dark:text-rose-400">
              {error}
            </div>
          ) : tabular ? (
            <>
              {/* Schema & Search Strip */}
              <div className="px-4 py-2.5 border-b border-border bg-surface-secondary/30 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 max-w-full">
                  <Table2 className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
                  {tabular.columns.map((col) => (
                    <span
                      key={col}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-border bg-surface text-[10.5px] font-mono text-text-primary shrink-0"
                    >
                      <span>{col}</span>
                      <span className="text-[9.5px] text-text-tertiary">
                        ({columnTypes.get(col) || "teks"})
                      </span>
                    </span>
                  ))}
                </div>

                <div className="relative shrink-0">
                  <Search className="w-3.5 h-3.5 text-text-tertiary absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari baris..."
                    className="pl-8 pr-3 py-1 rounded-xl border border-border bg-surface text-xs font-mono text-text-primary w-44 sm:w-56 focus:outline-hidden focus:border-[#C2553A]"
                  />
                </div>
              </div>

              {/* Data Table */}
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead className="bg-surface-secondary/85 sticky top-0 z-10 border-b border-border">
                    <tr>
                      <th className="px-3 py-2 text-[10px] text-text-tertiary border-r border-border/50 w-10">
                        #
                      </th>
                      {tabular.columns.map((col) => (
                        <th
                          key={col}
                          className="px-3 py-2 font-semibold text-text-primary whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-surface-secondary/40">
                        <td className="px-3 py-1.5 text-[10.5px] text-text-tertiary border-r border-border/40 tabular-nums">
                          {idx + 1}
                        </td>
                        {tabular.columns.map((col) => {
                          const val = row[col];
                          const isNull =
                            val === null || val === undefined || val === "";
                          return (
                            <td
                              key={col}
                              className="px-3 py-1.5 whitespace-nowrap max-w-[260px] truncate text-text-primary tabular-nums"
                              title={isNull ? "NULL" : String(val)}
                            >
                              {isNull ? (
                                <span className="text-[10px] italic text-text-tertiary">
                                  NULL
                                </span>
                              ) : (
                                String(val)
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    {filteredRows.length === 0 && (
                      <tr>
                        <td
                          colSpan={tabular.columns.length + 1}
                          className="px-4 py-8 text-center text-xs text-text-tertiary"
                        >
                          Tidak ada baris yang cocok dengan kata kunci.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-auto p-4 bg-[#FAF8F5] dark:bg-[#0F0E0D]">
              <pre className="text-xs font-mono leading-relaxed text-text-primary whitespace-pre-wrap break-words">
                {rawText || "(Berkas kosong atau format biner tidak dapat ditampilkan sebagai teks)"}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Quick Code Insertion */}
        <div className="px-4 sm:px-5 py-3 border-t border-border bg-[#F3EFE9]/50 dark:bg-[#141210] flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-mono text-text-tertiary">
            {tabular && tabular.rows.length > 200
              ? "Menampilkan 200 baris pertama untuk pratinjau cepat."
              : "Siap digunakan di sel Python, SQL, maupun JS."}
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onInsertSnippet(snippets.pandasRead, "python");
                onClose();
              }}
              className="min-h-[36px] px-3 py-1.5 rounded-xl bg-[#C2553A] hover:bg-[#D4664A] text-white text-xs font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>+ Baca di Pandas</span>
            </button>

            {tabular && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onInsertSnippet(snippets.pandasPlot, "python");
                    onClose();
                  }}
                  className="min-h-[36px] px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-xs font-mono font-semibold text-text-primary inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <BarChart2 className="w-3.5 h-3.5 text-[#C2553A]" />
                  <span>+ Grafik Otomatis</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onInsertSnippet(snippets.sqlQuery, "sql");
                    onClose();
                  }}
                  className="min-h-[36px] px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>+ Query SQL</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
