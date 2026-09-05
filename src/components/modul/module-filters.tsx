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
    <div className="vt-window rounded-none overflow-hidden shadow-xs mb-4">
      {/* Mini Titlebar */}
      <div className="px-3 py-1 bg-[#ECE9D8] border-b border-[#7A756D] flex items-center justify-between text-[11px] font-mono text-[#524B42] select-none">
        <span className="font-bold uppercase tracking-wider text-[#853827]">
          SEARCH & FILTER CONSOLE
        </span>
        <span className="text-[10px] text-[#8A8378]">FILTER_ENGINE // V1.0</span>
      </div>

      <div className="p-3.5 sm:p-4 bg-[#FAF8F5] space-y-3">
        {/* Top Search Input */}
        <div className="relative flex items-center border-t-2 border-l-2 border-[#7A756D] border-b border-r border-[#FFFFFF] bg-[#FFFFFF]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8378] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari modul atau project berdasarkan judul, deskripsi, atau topik..."
            className="w-full pl-9 pr-9 py-2 min-h-[38px] bg-transparent text-xs sm:text-sm text-[#1C1917] placeholder:text-[#8A8378] focus:outline-hidden font-medium"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2 p-1 text-[#8A8378] hover:text-[#1C1917] cursor-pointer"
              title="Hapus teks pencarian"
              aria-label="Hapus teks pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-2.5 justify-between pt-0.5">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="px-2.5 py-1.5 min-h-[34px] border-t-2 border-l-2 border-[#7A756D] border-b border-r border-[#FFFFFF] bg-[#FFFFFF] text-xs font-mono text-[#1C1917] font-medium focus:outline-hidden cursor-pointer"
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
              className="px-2.5 py-1.5 min-h-[34px] border-t-2 border-l-2 border-[#7A756D] border-b border-r border-[#FFFFFF] bg-[#FFFFFF] text-xs font-mono text-[#1C1917] font-medium focus:outline-hidden cursor-pointer"
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
              className="px-2.5 py-1.5 min-h-[34px] border-t-2 border-l-2 border-[#7A756D] border-b border-r border-[#FFFFFF] bg-[#FFFFFF] text-xs font-mono text-[#1C1917] font-medium focus:outline-hidden cursor-pointer"
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
              className="px-2.5 py-1.5 min-h-[34px] border-t-2 border-l-2 border-[#7A756D] border-b border-r border-[#FFFFFF] bg-[#FFFFFF] text-xs font-mono text-[#524B42] font-medium focus:outline-hidden cursor-pointer"
              aria-label="Urutkan modul"
            >
              <option value="latest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="title_asc">Nama A–Z</option>
              <option value="title_desc">Nama Z–A</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="vt-btn-chrome text-xs font-mono font-bold text-rose-700 flex items-center gap-1 py-1 px-2.5 min-h-[34px] cursor-pointer"
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
