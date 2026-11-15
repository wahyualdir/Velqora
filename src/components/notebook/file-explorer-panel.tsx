"use client";

import React, { useRef } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import type { VfsFileEntry } from "@/lib/notebook/types";

interface FileExplorerPanelProps {
  files: VfsFileEntry[];
  onUploadFiles: (files: FileList) => void;
  onDeleteFile: (path: string) => void;
  onDownloadFile: (path: string, name: string) => void;
  onInsertSnippet: (snippet: string, kernelHint?: "python" | "sql") => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function FileExplorerPanel({
  files,
  onUploadFiles,
  onDeleteFile,
  onDownloadFile,
  onInsertSnippet,
}: FileExplorerPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const visibleFiles = files.filter(
    (f) => f.path !== "/workspace/.velqora_session.sqlite"
  );

  const buildReadSnippet = (file: VfsFileEntry) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "csv" || ext === "tsv") {
      return `import pandas as pd\ndf = pd.read_csv("${file.path}"${
        ext === "tsv" ? ', sep="\\t"' : ""
      })\ndf.head()`;
    }
    if (ext === "xlsx" || ext === "xls") {
      return `import pandas as pd\ndf = pd.read_excel("${file.path}")\ndf.head()`;
    }
    if (ext === "json") {
      return `import json\nwith open("${file.path}", "r", encoding="utf-8") as f:\n    data = json.load(f)\ndata`;
    }
    return `with open("${file.path}", "r", encoding="utf-8") as f:\n    isi = f.read()\nprint(isi[:500])`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-text-secondary">
          <FolderOpen className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
          <span>/workspace ({visibleFiles.length})</span>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".csv,.tsv,.json,.xlsx,.xls,.txt,.py,.sql,.sqlite,.db"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onUploadFiles(e.target.files);
              e.target.value = "";
            }
          }}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="min-h-[36px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C2553A] hover:bg-[#D4664A] text-white text-xs font-mono font-semibold cursor-pointer transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Unggah File</span>
        </button>
      </div>

      <p className="text-[11px] text-text-secondary leading-relaxed">
        Dataset CSV/XLSX/JSON tersimpan di OPFS/IndexedDB browser, langsung bisa dibaca via{" "}
        <code className="font-mono text-[#C2553A] dark:text-[#D4664A]">
          /workspace/...
        </code>{" "}
        maupun otomatis menjadi tabel SQL.
      </p>

      {visibleFiles.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full p-5 rounded-xl border border-dashed border-border hover:border-[#C2553A]/50 bg-surface text-center space-y-1.5 cursor-pointer transition-colors"
        >
          <Plus className="w-5 h-5 mx-auto text-text-tertiary" />
          <p className="text-xs font-semibold text-text-primary">
            Unggah dataset CSV, XLSX, JSON, atau skrip
          </p>
          <p className="text-[11px] text-text-tertiary">
            Otomatis sinkron ke Python, SQLite, dan JS Sandbox
          </p>
        </button>
      ) : (
        <div className="space-y-1.5">
          {visibleFiles.map((file) => {
            const isTabular = /\.(csv|tsv|xlsx|xls|json)$/i.test(file.name);
            return (
              <div
                key={file.path}
                className="p-2.5 rounded-xl border border-border bg-surface space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {isTabular ? (
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-text-secondary shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-mono font-bold text-text-primary truncate">
                        {file.name}
                      </p>
                      <p className="text-[10px] font-mono text-text-tertiary">
                        {formatSize(file.size)} •{" "}
                        {file.origin === "kernel" ? "Dibuat oleh Kernel" : "Upload"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
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

                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      onInsertSnippet(buildReadSnippet(file), "python")
                    }
                    className="px-2 py-1 rounded-md border border-border bg-surface-secondary/60 hover:bg-surface-secondary text-[10.5px] font-mono text-text-primary cursor-pointer"
                  >
                    + Baca di Python
                  </button>
                  {isTabular && (
                    <button
                      type="button"
                      onClick={() => {
                        const tableName = file.name
                          .replace(/\.[^.]+$/, "")
                          .toLowerCase()
                          .replace(/[^a-z0-9_]+/g, "_");
                        onInsertSnippet(`SELECT * FROM ${tableName} LIMIT 25;`, "sql");
                      }}
                      className="px-2 py-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-[10.5px] font-mono text-emerald-700 dark:text-emerald-300 cursor-pointer"
                    >
                      + Query SQL
                    </button>
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
