"use client";

import React, { useRef, useState } from "react";
import {
  BarChart2,
  Check,
  ClipboardPaste,
  Copy,
  Database,
  Download,
  Eye,
  FileCode2,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Globe,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import {
  buildDatasetSnippets,
  normalizeDatasetUrl,
  SAMPLE_DATASETS,
  type SampleDatasetSpec,
} from "@/lib/notebook/sample-datasets";
import type { VfsFileEntry } from "@/lib/notebook/types";

interface FileExplorerPanelProps {
  files: VfsFileEntry[];
  onUploadFiles: (files: FileList | File[]) => Promise<void> | void;
  onIngestDatasetBuffer: (
    fileName: string,
    bytes: Uint8Array,
    mimeType: string,
    origin?: "upload" | "dataset"
  ) => Promise<void>;
  onDeleteFile: (path: string) => void;
  onDownloadFile: (path: string, name: string) => void;
  onPreviewFile: (file: VfsFileEntry) => void;
  onInsertSnippet: (snippet: string, kernelHint?: "python" | "sql") => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function convertTsvPasteToCsv(raw: string): string {
  const lines = raw.split(/\r?\n/);
  const hasTabs = lines[0]?.includes("\t");
  if (!hasTabs) return raw;
  return lines
    .map((line) =>
      line
        .split("\t")
        .map((cell) => {
          const clean = cell.trim();
          return clean.includes(",") || clean.includes('"')
            ? `"${clean.replace(/"/g, '""')}"`
            : clean;
        })
        .join(",")
    )
    .join("\n");
}

export function FileExplorerPanel({
  files,
  onUploadFiles,
  onIngestDatasetBuffer,
  onDeleteFile,
  onDownloadFile,
  onPreviewFile,
  onInsertSnippet,
}: FileExplorerPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeImportMode, setActiveImportMode] = useState<
    null | "samples" | "url" | "paste"
  >(null);

  const [urlInput, setUrlInput] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  const [pasteName, setPasteName] = useState("dataset_baru.csv");
  const [pasteContent, setPasteContent] = useState("");
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [loadingSampleId, setLoadingSampleId] = useState<string | null>(null);

  const visibleFiles = files.filter(
    (f) => f.path !== "/workspace/.velqora_session.sqlite"
  );

  const handleLoadSample = async (sample: SampleDatasetSpec) => {
    setLoadingSampleId(sample.id);
    try {
      const bytes = new TextEncoder().encode(sample.csvContent);
      await onIngestDatasetBuffer(
        sample.filename,
        bytes,
        "text/csv",
        "dataset"
      );
    } finally {
      setLoadingSampleId(null);
    }
  };

  const handleUrlImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setUrlLoading(true);
    setUrlError(null);
    try {
      const { fetchUrl, suggestedFileName } = normalizeDatasetUrl(urlInput);
      const res = await fetch(fetchUrl);
      if (!res.ok) {
        throw new Error(`Server mengembalikan status ${res.status}.`);
      }
      const buf = new Uint8Array(await res.arrayBuffer());
      if (buf.byteLength === 0) {
        throw new Error("Berkas yang diunduh kosong.");
      }
      const mimeType =
        res.headers.get("content-type")?.split(";")[0] || "text/csv";
      await onIngestDatasetBuffer(suggestedFileName, buf, mimeType, "dataset");
      setUrlInput("");
      setActiveImportMode(null);
    } catch (err: any) {
      setUrlError(
        err?.message?.includes("Failed to fetch")
          ? "Gagal mengambil URL (kemungkinan diblokir CORS). Unduh file lalu drag & drop, atau gunakan tab Paste."
          : err?.message || "URL dataset tidak valid."
      );
    } finally {
      setUrlLoading(false);
    }
  };

  const handlePasteImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasteContent.trim()) return;
    const rawName = pasteName.trim() || "dataset_baru.csv";
    const finalName = rawName.includes(".") ? rawName : `${rawName}.csv`;
    const normalizedText = finalName.toLowerCase().endsWith(".csv")
      ? convertTsvPasteToCsv(pasteContent.trim())
      : pasteContent.trim();
    const bytes = new TextEncoder().encode(normalizedText);
    await onIngestDatasetBuffer(finalName, bytes, "text/csv", "dataset");
    setPasteContent("");
    setActiveImportMode(null);
  };

  const handleCopyPath = async (path: string) => {
    try {
      await navigator.clipboard.writeText(path);
      setCopiedPath(path);
      setTimeout(() => setCopiedPath(null), 1400);
    } catch {
      // Ignore
    }
  };

  return (
    <div
      className="space-y-3"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          void onUploadFiles(e.dataTransfer.files);
        }
      }}
    >
      {/* Hidden Input */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".csv,.tsv,.json,.xlsx,.xls,.txt,.py,.sql,.sqlite,.db,.md"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            void onUploadFiles(e.target.files);
            e.target.value = "";
          }
        }}
      />

      {/* Header & Workspace Path */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-text-secondary">
          <FolderOpen className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
          <span>/workspace ({visibleFiles.length})</span>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="min-h-[32px] inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#C2553A] hover:bg-[#D4664A] text-white text-[11px] font-mono font-semibold cursor-pointer transition-colors"
        >
          <Upload className="w-3 h-3" />
          <span>Unggah File</span>
        </button>
      </div>

      {/* Quick Import Modes (Sample Data, URL, Paste) */}
      <div className="grid grid-cols-3 gap-1.5">
        <button
          type="button"
          onClick={() =>
            setActiveImportMode((m) => (m === "samples" ? null : "samples"))
          }
          className={`min-h-[34px] px-2 py-1 rounded-xl border text-[10.5px] font-mono font-semibold inline-flex items-center justify-center gap-1 cursor-pointer transition-colors ${
            activeImportMode === "samples"
              ? "bg-[#C2553A]/12 border-[#C2553A]/45 text-[#C2553A] dark:text-[#D4664A]"
              : "bg-surface border-border text-text-secondary hover:text-text-primary hover:bg-surface-secondary/70"
          }`}
        >
          <Sparkles className="w-3 h-3 shrink-0" />
          <span className="truncate">Sample</span>
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveImportMode((m) => (m === "url" ? null : "url"))
          }
          className={`min-h-[34px] px-2 py-1 rounded-xl border text-[10.5px] font-mono font-semibold inline-flex items-center justify-center gap-1 cursor-pointer transition-colors ${
            activeImportMode === "url"
              ? "bg-[#C2553A]/12 border-[#C2553A]/45 text-[#C2553A] dark:text-[#D4664A]"
              : "bg-surface border-border text-text-secondary hover:text-text-primary hover:bg-surface-secondary/70"
          }`}
        >
          <Globe className="w-3 h-3 shrink-0" />
          <span className="truncate">Dari URL</span>
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveImportMode((m) => (m === "paste" ? null : "paste"))
          }
          className={`min-h-[34px] px-2 py-1 rounded-xl border text-[10.5px] font-mono font-semibold inline-flex items-center justify-center gap-1 cursor-pointer transition-colors ${
            activeImportMode === "paste"
              ? "bg-[#C2553A]/12 border-[#C2553A]/45 text-[#C2553A] dark:text-[#D4664A]"
              : "bg-surface border-border text-text-secondary hover:text-text-primary hover:bg-surface-secondary/70"
          }`}
        >
          <ClipboardPaste className="w-3 h-3 shrink-0" />
          <span className="truncate">Paste</span>
        </button>
      </div>

      {/* Sample Datasets Drawer */}
      {activeImportMode === "samples" && (
        <div className="p-2.5 rounded-xl border border-border bg-surface-secondary/35 space-y-2">
          <div className="flex items-center justify-between text-[10.5px] font-mono font-bold text-text-secondary">
            <span>sample_data/ (Siap Pakai 1 Klik)</span>
          </div>
          <div className="space-y-1.5">
            {SAMPLE_DATASETS.map((sample) => {
              const exists = visibleFiles.some(
                (f) => f.name === sample.filename
              );
              const isBusy = loadingSampleId === sample.id;
              return (
                <div
                  key={sample.id}
                  className="p-2 rounded-xl border border-border bg-surface flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono font-bold text-text-primary truncate">
                        {sample.title}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-surface-secondary text-[9px] font-mono text-text-tertiary shrink-0">
                        {sample.rows}×{sample.columns}
                      </span>
                    </div>
                    <p className="text-[10px] text-text-tertiary truncate">
                      {sample.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => void handleLoadSample(sample)}
                    className={`shrink-0 px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-semibold cursor-pointer transition-colors ${
                      exists
                        ? "border border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "bg-[#C2553A] hover:bg-[#D4664A] text-white"
                    }`}
                  >
                    {isBusy ? "..." : exists ? "Muat Ulang" : "+ Muat"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* URL Importer */}
      {activeImportMode === "url" && (
        <form
          onSubmit={handleUrlImport}
          className="p-2.5 rounded-xl border border-border bg-surface-secondary/35 space-y-2"
        >
          <label className="text-[10.5px] font-mono font-bold text-text-secondary block">
            Impor CSV / JSON dari URL (GitHub, Google Sheets, atau Raw)
          </label>
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://raw.githubusercontent.com/.../data.csv"
            required
            className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-xs font-mono text-text-primary focus:outline-hidden focus:border-[#C2553A]"
          />
          {urlError && (
            <p className="text-[10.5px] font-mono text-rose-600 dark:text-rose-400">
              {urlError}
            </p>
          )}
          <div className="flex justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setActiveImportMode(null)}
              className="px-2.5 py-1 rounded-lg border border-border text-[11px] font-mono text-text-secondary cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={urlLoading}
              className="px-3 py-1 rounded-lg bg-[#C2553A] hover:bg-[#D4664A] text-white text-[11px] font-mono font-semibold inline-flex items-center gap-1 cursor-pointer disabled:opacity-60"
            >
              {urlLoading && <Loader2 className="w-3 h-3 animate-spin" />}
              <span>Unduh ke /workspace</span>
            </button>
          </div>
        </form>
      )}

      {/* Paste CSV / Excel Importer */}
      {activeImportMode === "paste" && (
        <form
          onSubmit={handlePasteImport}
          className="p-2.5 rounded-xl border border-border bg-surface-secondary/35 space-y-2"
        >
          <label className="text-[10.5px] font-mono font-bold text-text-secondary block">
            Tempel Data CSV / Salinan Tabel Excel
          </label>
          <input
            type="text"
            value={pasteName}
            onChange={(e) => setPasteName(e.target.value)}
            placeholder="nama_file.csv"
            className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-xs font-mono text-text-primary focus:outline-hidden focus:border-[#C2553A]"
          />
          <textarea
            value={pasteContent}
            onChange={(e) => setPasteContent(e.target.value)}
            rows={4}
            placeholder={"nama,nilai\nAlya,95\nBima,88"}
            required
            className="w-full p-2 rounded-lg border border-border bg-surface text-[11px] font-mono text-text-primary focus:outline-hidden focus:border-[#C2553A]"
          />
          <div className="flex justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setActiveImportMode(null)}
              className="px-2.5 py-1 rounded-lg border border-border text-[11px] font-mono text-text-secondary cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded-lg bg-[#C2553A] hover:bg-[#D4664A] text-white text-[11px] font-mono font-semibold cursor-pointer"
            >
              Simpan Dataset
            </button>
          </div>
        </form>
      )}

      {/* Drag & Drop Dropzone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`w-full p-3.5 rounded-xl border border-dashed text-center space-y-1 cursor-pointer transition-all ${
          isDragging
            ? "border-[#C2553A] bg-[#C2553A]/10 scale-[1.01]"
            : "border-border hover:border-[#C2553A]/50 bg-surface"
        }`}
      >
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-text-primary">
          <Plus className="w-4 h-4 text-[#C2553A]" />
          <span>
            {isDragging
              ? "Lepas file untuk unggah"
              : "Tarik & lepas file CSV, XLSX, JSON ke sini"}
          </span>
        </div>
        <p className="text-[10.5px] text-text-tertiary">
          Tersimpan di <code className="font-mono text-[#C2553A]">/workspace</code> &amp; otomatis jadi tabel SQLite
        </p>
      </button>

      {/* File Cards */}
      {visibleFiles.length > 0 && (
        <div className="space-y-2">
          {visibleFiles.map((file) => {
            const isTabular = /\.(csv|tsv|xlsx|xls|json)$/i.test(file.name);
            const snippets = buildDatasetSnippets(file);
            const isCopied = copiedPath === file.path;

            return (
              <div
                key={file.path}
                className="p-2.5 rounded-xl border border-border bg-surface hover:border-border-strong space-y-2 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {isTabular ? (
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-text-secondary shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-mono font-bold text-text-primary truncate">
                        {file.name}
                      </p>
                      <p className="text-[10px] font-mono text-text-tertiary">
                        {formatSize(file.size)} •{" "}
                        {file.origin === "kernel"
                          ? "Output Kernel"
                          : file.origin === "dataset"
                          ? "Dataset"
                          : "Upload"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onPreviewFile(file)}
                      className="p-1.5 rounded-lg border border-border hover:bg-surface-secondary text-text-secondary hover:text-text-primary cursor-pointer"
                      title="Pratinjau isi berkas"
                      aria-label={`Pratinjau ${file.name}`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleCopyPath(file.path)}
                      className="p-1.5 rounded-lg border border-border hover:bg-surface-secondary text-text-secondary hover:text-text-primary cursor-pointer"
                      title={`Salin path ${file.path}`}
                      aria-label={`Salin path ${file.name}`}
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDownloadFile(file.path, file.name)}
                      className="p-1.5 rounded-lg border border-border hover:bg-surface-secondary text-text-secondary cursor-pointer"
                      title="Unduh file"
                      aria-label={`Unduh ${file.name}`}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteFile(file.path)}
                      className="p-1.5 rounded-lg border border-border hover:bg-rose-500/10 text-text-secondary hover:text-rose-600 cursor-pointer"
                      title="Hapus file"
                      aria-label={`Hapus ${file.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Quick Code Snippets */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      onInsertSnippet(snippets.pandasRead, "python")
                    }
                    className="px-2 py-1 rounded-lg border border-border bg-surface-secondary/60 hover:bg-surface-secondary text-[10.5px] font-mono text-text-primary inline-flex items-center gap-1 cursor-pointer"
                  >
                    <FileCode2 className="w-3 h-3 text-[#C2553A]" />
                    <span>+ Pandas</span>
                  </button>

                  {isTabular && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          onInsertSnippet(snippets.pandasPlot, "python")
                        }
                        className="px-2 py-1 rounded-lg border border-border bg-surface-secondary/60 hover:bg-surface-secondary text-[10.5px] font-mono text-text-primary inline-flex items-center gap-1 cursor-pointer"
                      >
                        <BarChart2 className="w-3 h-3 text-[#C2553A]" />
                        <span>+ Plot</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onInsertSnippet(snippets.pandasStats, "python")
                        }
                        className="px-2 py-1 rounded-lg border border-border bg-surface-secondary/60 hover:bg-surface-secondary text-[10.5px] font-mono text-text-primary inline-flex items-center gap-1 cursor-pointer"
                        title="Cek ringkasan statistik deskriptif & missing values (null)"
                      >
                        <span>+ Statistik &amp; Null</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onInsertSnippet(snippets.sqlQuery, "sql")
                        }
                        className="px-2 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 text-[10.5px] font-mono text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Database className="w-3 h-3" />
                        <span>+ SQL</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
