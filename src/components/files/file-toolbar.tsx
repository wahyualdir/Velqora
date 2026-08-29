"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface FileToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  typeFilter: string;
  onTypeFilterChange: (val: string) => void;
  onResetFilter: () => void;
  hasActiveFilter: boolean;
}

const TYPE_FILTERS = [
  { id: "all", label: "Semua" },
  { id: "document", label: "Dokumen (PDF/Word)" },
  { id: "image", label: "Gambar & Diagram" },
  { id: "code", label: "Kode & Data" },
  { id: "archive", label: "Arsip (ZIP)" },
];

export function FileToolbar({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  onResetFilter,
  hasActiveFilter,
}: FileToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama berkas atau format..."
          className="w-full pl-9 pr-8 py-2 min-h-[38px] rounded-xl border border-border bg-surface text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-500 shadow-2xs"
          aria-label="Pencarian berkas"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary p-0.5 cursor-pointer"
            aria-label="Bersihkan pencarian"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onTypeFilterChange(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              typeFilter === f.id
                ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/30 shadow-2xs"
                : "bg-surface text-text-secondary border-border hover:border-border-hover hover:text-text-primary"
            }`}
          >
            {f.label}
          </button>
        ))}

        {hasActiveFilter && (
          <button
            type="button"
            onClick={onResetFilter}
            className="text-xs text-brand-600 dark:text-brand-400 hover:underline px-2 font-medium whitespace-nowrap cursor-pointer"
          >
            Reset filter
          </button>
        )}
      </div>
    </div>
  );
}
