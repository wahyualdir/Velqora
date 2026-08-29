"use client";

import React from "react";
import {
  Image as ImageIcon,
  FolderArchive,
  FileText,
  Table,
  Code2,
} from "lucide-react";

interface ConverterCategoryNavProps {
  activeCategory: "image" | "compress" | "document" | "data" | "code";
  onSelectCategory: (cat: "image" | "compress" | "document" | "data" | "code") => void;
  counts: Record<string, number>;
}

const CATEGORIES = [
  { id: "image", label: "Foto & Scanner", icon: ImageIcon },
  { id: "compress", label: "Kompresi & Arsip", icon: FolderArchive },
  { id: "document", label: "Dokumen & PDF", icon: FileText },
  { id: "data", label: "Data & Tabel", icon: Table },
  { id: "code", label: "Kode & Dev Tools", icon: Code2 },
] as const;

export function ConverterCategoryNav({
  activeCategory,
  onSelectCategory,
  counts,
}: ConverterCategoryNavProps) {
  return (
    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface border border-border overflow-x-auto scrollbar-none touch-pan-x">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.id;
        const count = counts[cat.id] || 0;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 shadow-2xs"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{cat.label}</span>
            {count > 0 && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isActive
                    ? "bg-brand-500/20 text-brand-700 dark:text-brand-300"
                    : "bg-surface-secondary text-text-tertiary"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
