"use client";

import React from "react";
import { Search, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModuleFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
  categories: any[];
  levelFilter: string;
  onLevelChange: (val: string) => void;
  scope: "all" | "mine";
  onScopeChange: (val: "all" | "mine") => void;
  sortBy: string;
  onSortChange: (val: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export function ModuleFilters({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  levelFilter,
  onLevelChange,
  scope,
  onScopeChange,
  sortBy,
  onSortChange,
  onResetFilters,
  hasActiveFilters,
}: ModuleFiltersProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-2xs mb-5 space-y-3.5">
      {/* Top Search Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari modul atau proyek berdasarkan judul, deskripsi, atau topik..."
          className="w-full pl-10 pr-10 py-2 min-h-[40px] rounded-xl border border-border bg-surface-secondary/60 hover:bg-surface-secondary text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary focus:outline-hidden focus:border-brand-500/50 transition-all font-medium"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 p-1 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
            title="Hapus teks pencarian"
            aria-label="Hapus teks pencarian"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-wrap items-center gap-2.5 justify-between pt-0.5">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-1.5 min-h-[36px] rounded-xl border border-border bg-surface-secondary/70 text-xs text-text-primary font-medium focus:outline-hidden focus:border-brand-500/50 transition-colors cursor-pointer"
            aria-label="Filter kategori"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => onLevelChange(e.target.value)}
            className="px-3 py-1.5 min-h-[36px] rounded-xl border border-border bg-surface-secondary/70 text-xs text-text-primary font-medium focus:outline-hidden focus:border-brand-500/50 transition-colors cursor-pointer"
            aria-label="Filter tingkat kesulitan"
          >
            <option value="">Semua Tingkat</option>
            <option value="pemula">Pemula</option>
            <option value="menengah">Menengah</option>
            <option value="lanjutan">Lanjutan</option>
          </select>

          {/* Scope Selector */}
          <select
            value={scope}
            onChange={(e) => onScopeChange(e.target.value as "all" | "mine")}
            className="px-3 py-1.5 min-h-[36px] rounded-xl border border-border bg-surface-secondary/70 text-xs text-text-primary font-medium focus:outline-hidden focus:border-brand-500/50 transition-colors cursor-pointer"
            aria-label="Filter kepemilikan"
          >
            <option value="all">Semua Konten</option>
            <option value="mine">Dibuat Oleh Saya</option>
          </select>
        </div>

        {/* Sort Controls & Reset */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-1.5 min-h-[36px] rounded-xl border border-border bg-surface-secondary/70 text-xs text-text-secondary font-medium focus:outline-hidden focus:border-brand-500/50 transition-colors cursor-pointer"
            aria-label="Urutkan modul"
          >
            <option value="latest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="title_asc">Nama A–Z</option>
            <option value="title_desc">Nama Z–A</option>
          </select>

          {hasActiveFilters && (
            <Button
              size="sm"
              variant="outline"
              onClick={onResetFilters}
              className="gap-1.5 text-xs text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/10 min-h-[36px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
