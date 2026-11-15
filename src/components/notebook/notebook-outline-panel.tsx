"use client";

import React, { useMemo, useState } from "react";
import {
  BookOpen,
  Code2,
  Database,
  FileSpreadsheet,
  Hash,
  ListTree,
  Plus,
  Search,
  Sparkles,
  Check,
  Loader2,
} from "lucide-react";
import type { NotebookCell, NotebookKernel } from "@/lib/notebook/types";
import {
  NOTEBOOK_SNIPPETS,
  SAMPLE_DATASETS,
  type NotebookSnippetSpec,
  type SampleDatasetSpec,
} from "@/lib/notebook/sample-datasets";

interface NotebookOutlinePanelProps {
  cells: NotebookCell[];
  activeCellId: string;
  onSelectCell: (cellId: string) => void;
  onInsertSnippet: (code: string, kernel: NotebookKernel) => void;
  onLoadSampleDataset: (sample: SampleDatasetSpec) => Promise<void> | void;
  loadedFileNames: string[];
}

interface OutlineEntry {
  id: string;
  cellId: string;
  cellIndex: number;
  title: string;
  level: 1 | 2 | 3;
  kind: "heading" | "cell-title" | "cell";
  kernel?: NotebookKernel;
  executionCount?: number | null;
}

const SNIPPET_CATEGORIES: Array<"Semua" | NotebookSnippetSpec["category"]> = [
  "Semua",
  "Dataset & Pandas",
  "Visualisasi",
  "SQLite",
  "Statistik & ML",
];

function extractParamTitle(source: string): string | null {
  const match = source.match(/^#\s*@title\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

export function NotebookOutlinePanel({
  cells,
  activeCellId,
  onSelectCell,
  onInsertSnippet,
  onLoadSampleDataset,
  loadedFileNames,
}: NotebookOutlinePanelProps) {
  const [tab, setTab] = useState<"outline" | "snippets">("outline");
  const [snippetCategory, setSnippetCategory] =
    useState<"Semua" | NotebookSnippetSpec["category"]>("Semua");
  const [snippetQuery, setSnippetQuery] = useState("");
  const [loadingSampleId, setLoadingSampleId] = useState<string | null>(null);

  const outlineEntries = useMemo<OutlineEntry[]>(() => {
    const entries: OutlineEntry[] = [];

    cells.forEach((cell, idx) => {
      if (cell.type === "markdown") {
        const headingMatches = [...cell.source.matchAll(/^(#{1,3})\s+(.+)$/gm)];
        if (headingMatches.length > 0) {
          headingMatches.forEach((m, hIdx) => {
            const level = Math.min(3, Math.max(1, m[1].length)) as 1 | 2 | 3;
            const rawTitle = m[2].replace(/[*_`~]/g, "").trim();
            if (rawTitle) {
              entries.push({
                id: `${cell.id}-h-${hIdx}`,
                cellId: cell.id,
                cellIndex: idx,
                title: rawTitle,
                level,
                kind: "heading",
              });
            }
          });
          return;
        }

        const firstLine = cell.source
          .split(/\r?\n/)
          .map((l) => l.replace(/^>\s*/, "").trim())
          .find(Boolean);
        if (firstLine) {
          entries.push({
            id: `${cell.id}-md`,
            cellId: cell.id,
            cellIndex: idx,
            title: firstLine.slice(0, 48),
            level: 3,
            kind: "cell",
          });
        }
        return;
      }

      const paramTitle = cell.title || extractParamTitle(cell.source);
      if (paramTitle) {
        entries.push({
          id: `${cell.id}-title`,
          cellId: cell.id,
          cellIndex: idx,
          title: paramTitle,
          level: 2,
          kind: "cell-title",
          kernel: cell.kernel,
          executionCount: cell.executionCount,
        });
      }
    });

    return entries;
  }, [cells]);

  const filteredSnippets = useMemo(() => {
    const q = snippetQuery.trim().toLowerCase();
    return NOTEBOOK_SNIPPETS.filter((s) => {
      if (snippetCategory !== "Semua" && s.category !== snippetCategory) {
        return false;
      }
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    });
  }, [snippetCategory, snippetQuery]);

  const normalizedLoaded = useMemo(() => {
    return new Set(loadedFileNames.map((name) => name.toLowerCase()));
  }, [loadedFileNames]);

  const handleLoadSample = async (sample: SampleDatasetSpec) => {
    setLoadingSampleId(sample.id);
    try {
      await onLoadSampleDataset(sample);
    } finally {
      setLoadingSampleId(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-surface border border-border rounded-2xl overflow-hidden shadow-xs">
      {/* Segmented Header */}
      <div className="p-2 border-b border-border bg-surface-secondary/40 shrink-0">
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-surface border border-border/80">
          <button
            type="button"
            onClick={() => setTab("outline")}
            className={`inline-flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              tab === "outline"
                ? "bg-[#C2553A] text-white shadow-2xs"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary/70"
            }`}
          >
            <ListTree className="w-3.5 h-3.5" />
            <span>Outline</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("snippets")}
            className={`inline-flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              tab === "snippets"
                ? "bg-[#C2553A] text-white shadow-2xs"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary/70"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Snippet</span>
          </button>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2.5 space-y-4">
        {tab === "outline" ? (
          <>
            {/* Daftar Isi Headings & Judul Sel */}
            <div className="space-y-1">
              <div className="px-1.5 pb-1 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-text-muted">
                <span>Daftar Isi</span>
                <span>{outlineEntries.length}</span>
              </div>

              {outlineEntries.length === 0 ? (
                <div className="p-3 rounded-xl border border-dashed border-border text-[11px] text-text-muted leading-relaxed">
                  Tambahkan heading Markdown (`# Judul`) atau `#@title Nama Sel`
                  untuk membangun daftar isi otomatis.
                </div>
              ) : (
                <div className="space-y-0.5">
                  {outlineEntries.map((item) => {
                    const isActive = item.cellId === activeCellId;
                    const indentClass =
                      item.level === 1
                        ? "pl-2 font-semibold"
                        : item.level === 2
                          ? "pl-4 font-medium"
                          : "pl-6 text-text-secondary";

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onSelectCell(item.cellId)}
                        title={item.title}
                        className={`w-full text-left py-1.5 pr-2 rounded-lg text-[11.5px] transition-colors flex items-center gap-1.5 cursor-pointer ${indentClass} ${
                          isActive
                            ? "bg-[#C2553A]/12 text-[#C2553A] dark:text-[#F09A82] border-l-2 border-[#C2553A]"
                            : "text-text-primary hover:bg-surface-secondary/80 border-l-2 border-transparent"
                        }`}
                      >
                        {item.kind === "heading" ? (
                          <Hash className="w-3 h-3 shrink-0 opacity-60" />
                        ) : item.kind === "cell-title" ? (
                          <Code2 className="w-3 h-3 shrink-0 opacity-70" />
                        ) : (
                          <BookOpen className="w-3 h-3 shrink-0 opacity-60" />
                        )}
                        <span className="truncate flex-1">{item.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Peta Semua Sel */}
            <div className="pt-2 border-t border-border/70 space-y-1.5">
              <div className="px-1.5 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-text-muted">
                <span>Sel Notebook</span>
                <span>{cells.length}</span>
              </div>
              <div className="space-y-1">
                {cells.map((cell, idx) => {
                  const isActive = cell.id === activeCellId;
                  const firstNonEmpty =
                    cell.title ||
                    extractParamTitle(cell.source) ||
                    cell.source
                      .split(/\r?\n/)
                      .map((l) => l.trim())
                      .find(Boolean) ||
                    (cell.type === "markdown" ? "Catatan Teks" : "Sel Kosong");

                  return (
                    <button
                      key={cell.id}
                      type="button"
                      onClick={() => onSelectCell(cell.id)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] flex items-center gap-2 transition-colors cursor-pointer ${
                        isActive
                          ? "bg-[#C2553A]/10 text-text-primary border border-[#C2553A]/35"
                          : "hover:bg-surface-secondary/70 text-text-secondary border border-transparent"
                      }`}
                    >
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-secondary text-text-muted shrink-0">
                        {cell.type === "markdown"
                          ? "MD"
                          : cell.executionCount != null
                            ? `[${cell.executionCount}]`
                            : `#${idx + 1}`}
                      </span>
                      <span className="truncate flex-1">{firstNonEmpty}</span>
                      {cell.type === "code" && (
                        <span className="text-[9.5px] font-mono uppercase text-text-muted shrink-0">
                          {cell.kernel === "python"
                            ? "PY"
                            : cell.kernel === "sql"
                              ? "SQL"
                              : cell.kernel === "typescript"
                                ? "TS"
                                : "JS"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Quick Sample Datasets */}
            <div className="space-y-2">
              <div className="px-1 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-text-muted">
                <span>Sample Dataset</span>
                <span>sample_data/</span>
              </div>

              <div className="space-y-1.5">
                {SAMPLE_DATASETS.map((sample) => {
                  const isLoaded =
                    normalizedLoaded.has(sample.filename.toLowerCase()) ||
                    normalizedLoaded.has(`sample_data/${sample.filename}`.toLowerCase());
                  const isLoading = loadingSampleId === sample.id;

                  return (
                    <div
                      key={sample.id}
                      className="p-2 rounded-xl border border-border/80 bg-surface-secondary/35 hover:border-border-strong transition-colors space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <FileSpreadsheet className="w-3.5 h-3.5 text-[#C2553A] shrink-0" />
                            <p className="text-[11.5px] font-semibold text-text-primary truncate">
                              {sample.title}
                            </p>
                          </div>
                          <p className="text-[10px] font-mono text-text-muted mt-0.5 truncate">
                            {sample.filename} · {sample.rows}×{sample.columns}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleLoadSample(sample)}
                          disabled={isLoading}
                          className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10.5px] font-semibold border transition-colors cursor-pointer ${
                            isLoaded
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                              : "bg-surface hover:bg-[#C2553A] hover:text-white hover:border-[#C2553A] text-text-primary border-border"
                          }`}
                        >
                          {isLoading ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : isLoaded ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Plus className="w-3 h-3" />
                          )}
                          <span>{isLoaded ? "Ada" : "Muat"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Code Snippets Library */}
            <div className="pt-2 border-t border-border/70 space-y-2">
              <div className="px-1 text-[10px] font-mono uppercase tracking-wider text-text-muted">
                Snippet Kode Cepat
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={snippetQuery}
                  onChange={(e) => setSnippetQuery(e.target.value)}
                  placeholder="Cari snippet Pandas, Plot, SQL..."
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-xl bg-surface-secondary/60 border border-border text-[11px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[#C2553A]"
                />
              </div>

              <div className="flex flex-wrap gap-1">
                {SNIPPET_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSnippetCategory(cat)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium border transition-colors cursor-pointer ${
                      snippetCategory === cat
                        ? "bg-[#C2553A]/15 text-[#C2553A] dark:text-[#F09A82] border-[#C2553A]/35"
                        : "bg-surface text-text-muted border-border hover:text-text-primary"
                    }`}
                  >
                    {cat === "Dataset & Pandas" ? "Pandas" : cat}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                {filteredSnippets.map((snippet) => (
                  <div
                    key={snippet.id}
                    className="p-2.5 rounded-xl border border-border/80 bg-surface-secondary/25 hover:border-border-strong transition-colors space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          {snippet.kernel === "sql" ? (
                            <Database className="w-3 h-3 text-sky-500 shrink-0" />
                          ) : (
                            <Code2 className="w-3 h-3 text-[#C2553A] shrink-0" />
                          )}
                          <p className="text-[11.5px] font-semibold text-text-primary leading-snug">
                            {snippet.title}
                          </p>
                        </div>
                        <p className="text-[10.5px] text-text-secondary mt-0.5 leading-snug">
                          {snippet.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[9.5px] font-mono uppercase px-1.5 py-0.5 rounded bg-surface-secondary text-text-muted">
                        {snippet.kernel}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onInsertSnippet(snippet.code, snippet.kernel)
                        }
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#C2553A]/10 hover:bg-[#C2553A] text-[#C2553A] hover:text-white dark:text-[#F09A82] text-[10.5px] font-semibold transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Sisipkan Sel</span>
                      </button>
                    </div>
                  </div>
                ))}

                {filteredSnippets.length === 0 && (
                  <div className="p-3 text-center text-[11px] text-text-muted">
                    Tidak ada snippet yang cocok.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
