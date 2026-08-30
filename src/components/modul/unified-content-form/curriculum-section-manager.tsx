"use client";

import React from "react";
import { Layers, Plus, Trash2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CurriculumSectionManagerProps {
  kind: "module" | "project";
  sections: string[];
  newSectionInput: string;
  onChangeNewSectionInput: (val: string) => void;
  onAddSection: () => void;
  onRemoveSection: (index: number) => void;
  onApplyDefaultPresets: () => void;
  disabled?: boolean;
}

export function CurriculumSectionManager({
  kind,
  sections,
  newSectionInput,
  onChangeNewSectionInput,
  onAddSection,
  onRemoveSection,
  onApplyDefaultPresets,
  disabled = false,
}: CurriculumSectionManagerProps) {
  const isProject = kind === "project";

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-border bg-surface shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-text-primary">
              {isProject ? "Struktur & Milestone Proyek" : "Silabus Bab Perkuliahan"}
            </h3>
            <p className="text-[11px] text-text-secondary">
              {isProject
                ? "Bagi proyek Anda ke dalam tahapan pengerjaan yang terstruktur."
                : "Daftar bab atau topik pembahasan yang ada di dalam modul ini."}
            </p>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onApplyDefaultPresets}
          disabled={disabled}
          className="text-xs gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span>Gunakan Preset {isProject ? "Proyek" : "Bab"}</span>
        </Button>
      </div>

      {/* Add New Section Input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newSectionInput}
          onChange={(e) => onChangeNewSectionInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAddSection();
            }
          }}
          disabled={disabled}
          placeholder={
            isProject
              ? "Tambah milestone/tahapan baru (tekan Enter)..."
              : "Tambah bab / materi pokok baru (tekan Enter)..."
          }
          className="flex-1 h-9 px-3 text-xs rounded-xl bg-surface-secondary border border-border text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        />
        <Button
          type="button"
          size="sm"
          onClick={onAddSection}
          disabled={disabled || !newSectionInput.trim()}
          className="text-xs gap-1 shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah</span>
        </Button>
      </div>

      {/* Sections List */}
      {sections.length === 0 ? (
        <div className="py-6 text-center rounded-xl border border-dashed border-border/80 bg-surface-secondary/30 text-xs text-text-tertiary space-y-1">
          <p>Belum ada {isProject ? "milestone" : "bab"} yang ditambahkan.</p>
          <p className="text-[11px]">
            Klik &ldquo;Gunakan Preset&rdquo; untuk mengisi struktur standar secara instan.
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-border/80 bg-surface-secondary/40 hover:bg-surface-secondary transition-colors text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-5 h-5 rounded-md bg-surface border border-border text-[10.5px] font-mono font-bold text-text-tertiary flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="font-medium text-text-primary truncate">{section}</span>
              </div>

              <button
                type="button"
                onClick={() => onRemoveSection(idx)}
                disabled={disabled}
                className="p-1 rounded-md text-text-tertiary hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
                title="Hapus bab ini"
                aria-label={`Hapus ${section}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
