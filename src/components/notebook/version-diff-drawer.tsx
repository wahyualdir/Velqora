"use client";

import React, { useMemo, useState } from "react";
import { diffLines } from "diff";
import { Clock, History, RotateCcw, Save, X } from "lucide-react";
import type { NotebookCell, NotebookVersion } from "@/lib/notebook/types";

interface VersionDiffDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  versions: NotebookVersion[];
  currentCells: NotebookCell[];
  onCreateCheckpoint: (label: string) => Promise<void>;
  onRestoreVersion: (cells: NotebookCell[]) => void;
}

function serializeCellsForDiff(cells: NotebookCell[]): string {
  return cells
    .map(
      (c, i) =>
        `# === Sel [${i + 1}] (${c.type}:${c.kernel}) ===\n${c.source.trimEnd()}`
    )
    .join("\n\n");
}

export function VersionDiffDrawer({
  isOpen,
  onClose,
  versions,
  currentCells,
  onCreateCheckpoint,
  onRestoreVersion,
}: VersionDiffDrawerProps) {
  const [selectedId, setSelectedId] = useState<string>("");
  const [label, setLabel] = useState("");
  const [saving, setSaving] = useState(false);

  const activeVersion = useMemo(
    () => versions.find((v) => v.id === selectedId) || versions[0] || null,
    [versions, selectedId]
  );

  const changes = useMemo(() => {
    if (!activeVersion) return [];
    const oldText = serializeCellsForDiff(activeVersion.cellsSnapshot);
    const newText = serializeCellsForDiff(currentCells);
    return diffLines(oldText, newText);
  }, [activeVersion, currentCells]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onCreateCheckpoint(label || `Checkpoint ${new Date().toLocaleTimeString("id-ID")}`);
      setLabel("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-3xl h-full bg-[#FAF8F5] dark:bg-[#100E0D] border-l border-border shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-2 bg-surface">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#C2553A] dark:text-[#D4664A]" />
            <h2 className="text-sm font-bold text-text-primary">
              Riwayat Versi & Visual Diff
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg border border-border hover:bg-surface-secondary text-text-secondary cursor-pointer"
            aria-label="Tutup riwayat versi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Create Checkpoint Bar */}
        <div className="p-3 border-b border-border bg-surface-secondary/40 flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Nama checkpoint (mis. Sebelum tuning hyperparameter)"
            className="flex-1 min-w-[200px] min-h-[38px] px-3 py-1.5 rounded-xl border border-border bg-surface text-xs font-mono text-text-primary focus:outline-hidden focus:border-[#C2553A]"
          />
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[#C2553A] hover:bg-[#D4664A] text-white text-xs font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Menyimpan..." : "Simpan Checkpoint"}</span>
          </button>
        </div>

        {/* Body Split */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Snapshot List */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border overflow-y-auto p-2.5 space-y-1.5 max-h-48 md:max-h-none">
            {versions.length === 0 ? (
              <p className="text-xs text-text-tertiary p-3 text-center">
                Belum ada checkpoint. Simpan checkpoint pertama di atas.
              </p>
            ) : (
              versions.map((v) => {
                const isSelected = activeVersion?.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedId(v.id)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-colors cursor-pointer space-y-1 ${
                      isSelected
                        ? "bg-[#C2553A]/10 border-[#C2553A]/40 text-text-primary"
                        : "bg-surface border-border hover:bg-surface-secondary text-text-secondary"
                    }`}
                  >
                    <p className="font-bold truncate">{v.label}</p>
                    <p className="text-[10px] font-mono text-text-tertiary flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(v.createdAt).toLocaleString("id-ID")}
                    </p>
                  </button>
                );
              })
            )}
          </div>

          {/* Diff Inspector */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            {activeVersion ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border">
                  <div className="text-xs font-mono text-text-secondary">
                    Membandingkan{" "}
                    <span className="font-bold text-text-primary">
                      {activeVersion.label}
                    </span>{" "}
                    → Kondisi Saat Ini
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onRestoreVersion(activeVersion.cellsSnapshot);
                      onClose();
                    }}
                    className="min-h-[36px] px-3 py-1 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-200 text-xs font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Pulihkan Versi Ini</span>
                  </button>
                </div>

                <pre className="rounded-xl border border-border bg-surface p-3 overflow-x-auto text-[11.5px] font-mono leading-relaxed">
                  {changes.map((part, idx) => (
                    <span
                      key={idx}
                      className={
                        part.added
                          ? "block bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 px-1.5"
                          : part.removed
                          ? "block bg-rose-500/15 text-rose-800 dark:text-rose-300 px-1.5"
                          : "block text-text-secondary px-1.5"
                      }
                    >
                      {part.value}
                    </span>
                  ))}
                </pre>
              </>
            ) : (
              <div className="p-8 text-center text-xs text-text-tertiary">
                Pilih checkpoint untuk membandingkan perubahan kode antar versi.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
