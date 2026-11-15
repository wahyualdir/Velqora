"use client";

import React from "react";
import { Search, X, RotateCcw } from "lucide-react";

import { ACTIVE_CATEGORY_SCOPE, isCategoryInActiveScope } from "@/lib/constants";
export { ACTIVE_CATEGORY_SCOPE, isCategoryInActiveScope };

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
  // Saring kategori yang ditampilkan di dropdown agar hanya dalam scope AI aktif
  const scopedCategories = React.useMemo(() => {
    return categories.filter((cat) =>
      isCategoryInActiveScope(cat.name, cat.parent?.name)
    );
  }, [categories]);
  return (
    <div className="vt-window rounded-2xl overflow-hidden mb-5">
      {/* Editorial Header */}
      <div className="px-4 py-2.5 bg-[#F3EFE9]/75 dark:bg-[#1C1917]/80 border-b border-[#E4DDD4] dark:border-[#292524] flex items-center justify-between text-[11px] font-mono text-[#524B42] dark:text-[#A8A29E] select-none">
        <span className="font-semibold uppercase tracking-wider text-[#C2553A] dark:text-[#D4664A]">
          SEARCH &amp; FILTER CONSOLE
        </span>
        <span className="text-[10px] text-[#8A8378] dark:text-[#8C857F]">FILTER // ACTIVE</span>
      </div>

      <div className="p-4 sm:p-5 bg-[#FFFFFF] dark:bg-[#141210] space-y-3.5">
        {/* Top Search Input */}
        <div className="relative flex items-center rounded-xl border border-[#E4DDD4] dark:border-[#292524] bg-[#FAF8F5] dark:bg-[#0F0E0D] focus-within:border-[#C2553A] dark:focus-within:border-[#D4664A] focus-within:ring-2 focus-within:ring-[#D4664A]/20 transition-all">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8378] dark:text-[#8C857F] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari modul atau project berdasarkan judul, deskripsi, atau topik..."
            className="w-full pl-10 pr-10 py-2 min-h-[38px] bg-transparent text-xs sm:text-sm text-[#1C1917] dark:text-[#F5F5F4] placeholder:text-[#8A8378] dark:placeholder:text-[#8C857F] focus:outline-hidden font-medium"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 p-1 text-[#8A8378] dark:text-[#8C857F] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] cursor-pointer"
              title="Hapus teks pencarian"
              aria-label="Hapus teks pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Row */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2.5 justify-between pt-0.5">
          <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2 flex-1 min-w-0">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full sm:w-auto min-w-0 truncate px-3 py-1.5 min-h-[40px] rounded-xl border border-[#E4DDD4] dark:border-[#292524] bg-[#FAF8F5] dark:bg-[#0F0E0D] text-xs font-mono text-[#1C1917] dark:text-[#F5F5F4] font-medium focus:outline-hidden focus:border-[#D4664A] cursor-pointer"
              aria-label="Filter kategori"
            >
              <option value="">Semua Topik AI</option>
              {scopedCategories.map((cat) => (
                <option key={cat.id} value={cat.id} className="dark:bg-[#141210] dark:text-[#F5F5F4]">
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Level Filter */}
            <select
              value={levelFilter}
              onChange={(e) => onLevelChange(e.target.value)}
              className="w-full sm:w-auto min-w-0 truncate px-3 py-1.5 min-h-[40px] rounded-xl border border-[#E4DDD4] dark:border-[#292524] bg-[#FAF8F5] dark:bg-[#0F0E0D] text-xs font-mono text-[#1C1917] dark:text-[#F5F5F4] font-medium focus:outline-hidden focus:border-[#D4664A] cursor-pointer"
              aria-label="Filter tingkat kesulitan"
            >
              <option value="">Semua Tingkat</option>
              <option value="pemula" className="dark:bg-[#141210] dark:text-[#F5F5F4]">Pemula</option>
              <option value="menengah" className="dark:bg-[#141210] dark:text-[#F5F5F4]">Menengah</option>
              <option value="lanjutan" className="dark:bg-[#141210] dark:text-[#F5F5F4]">Lanjutan</option>
            </select>

            {/* Scope Selector */}
            <select
              value={scope}
              onChange={(e) => onScopeChange(e.target.value as "all" | "mine")}
              className="w-full sm:w-auto min-w-0 truncate px-3 py-1.5 min-h-[40px] rounded-xl border border-[#E4DDD4] dark:border-[#292524] bg-[#FAF8F5] dark:bg-[#0F0E0D] text-xs font-mono text-[#1C1917] dark:text-[#F5F5F4] font-medium focus:outline-hidden focus:border-[#D4664A] cursor-pointer"
              aria-label="Filter kepemilikan"
            >
              <option value="all" className="dark:bg-[#141210] dark:text-[#F5F5F4]">Semua Konten</option>
              <option value="mine" className="dark:bg-[#141210] dark:text-[#F5F5F4]">Dibuat Oleh Saya</option>
            </select>
          </div>

          {/* Sort Controls & Reset */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="flex-1 sm:flex-initial min-w-0 truncate px-3 py-1.5 min-h-[40px] rounded-xl border border-[#E4DDD4] dark:border-[#292524] bg-[#FAF8F5] dark:bg-[#0F0E0D] text-xs font-mono text-[#524B42] dark:text-[#A8A29E] font-medium focus:outline-hidden focus:border-[#D4664A] cursor-pointer"
              aria-label="Urutkan modul"
            >
              <option value="latest" className="dark:bg-[#141210] dark:text-[#F5F5F4]">Terbaru</option>
              <option value="oldest" className="dark:bg-[#141210] dark:text-[#F5F5F4]">Terlama</option>
              <option value="title_asc" className="dark:bg-[#141210] dark:text-[#F5F5F4]">Nama A–Z</option>
              <option value="title_desc" className="dark:bg-[#141210] dark:text-[#F5F5F4]">Nama Z–A</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="vt-btn-chrome rounded-xl text-xs font-mono font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1.5 py-1.5 px-3 min-h-[40px] cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
