"use client";

import React from "react";
import { Search, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MATERIAL_TYPE_LABELS } from "@/types";

interface MaterialFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
  categories: any[];
  selectedType: string;
  onTypeChange: (val: string) => void;
  sortBy: string;
  onSortChange: (val: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export function MaterialFilters({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange,
  onResetFilters,
  hasActiveFilters,
}: MaterialFiltersProps) {
  return (
    <div className="space-y-3 p-3.5 sm:p-4 rounded-xl border border-border bg-surface shadow-2xs">
      {/* Top Search Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari materi atau dokumen..."
          className="w-full pl-10 pr-9 py-2 min-h-[40px] rounded-xl border border-border bg-surface-secondary/70 text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-500 transition-colors font-medium"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 p-1 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface transition-colors"
            title="Hapus kata kunci pencarian"
            aria-label="Hapus kata kunci pencarian"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2.5 justify-between pt-1">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-1.5 min-h-[36px] rounded-lg border border-border bg-surface-secondary/60 text-xs text-text-primary font-medium focus:outline-none focus:border-brand-500 cursor-pointer"
            aria-label="Filter kategori materi"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Type Dropdown */}
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="px-3 py-1.5 min-h-[36px] rounded-lg border border-border bg-surface-secondary/60 text-xs text-text-primary font-medium focus:outline-none focus:border-brand-500 cursor-pointer"
            aria-label="Filter jenis materi"
          >
            <option value="">Semua Jenis Dokumen</option>
            {Object.entries(MATERIAL_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Controls & Reset Button */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-1.5 min-h-[36px] rounded-lg border border-border bg-surface-secondary/60 text-xs text-text-secondary font-medium focus:outline-none focus:border-brand-500 cursor-pointer"
            aria-label="Urutkan materi"
          >
            <option value="latest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="title_asc">Nama A–Z</option>
            <option value="title_desc">Nama Z–A</option>
          </select>

          {hasActiveFilters && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onResetFilters}
              className="gap-1 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 min-h-[36px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset filter</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
