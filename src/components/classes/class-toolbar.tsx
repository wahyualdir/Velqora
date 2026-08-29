"use client";

import React from "react";
import { Search, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClassToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  scopeFilter: string;
  onScopeChange: (val: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export function ClassToolbar({
  search,
  onSearchChange,
  scopeFilter,
  onScopeChange,
  onResetFilters,
  hasActiveFilters,
}: ClassToolbarProps) {
  return (
    <div className="space-y-3 p-3.5 sm:p-4 rounded-xl border border-border bg-surface shadow-2xs">
      {/* Top Search Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama kelas, mata kuliah, atau pengajar..."
          className="w-full pl-10 pr-9 py-2 min-h-[40px] rounded-xl border border-border bg-surface-secondary/70 text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-500 transition-colors font-medium"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 p-1 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
            title="Hapus kata kunci pencarian"
            aria-label="Hapus kata kunci pencarian"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2.5 justify-between pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onScopeChange("all")}
            className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              scopeFilter === "all"
                ? "bg-brand-600 text-white shadow-xs"
                : "bg-surface-secondary/70 hover:bg-surface-secondary text-text-secondary hover:text-text-primary border border-border/80"
            }`}
          >
            Semua Kelas
          </button>

          <button
            type="button"
            onClick={() => onScopeChange("mine")}
            className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              scopeFilter === "mine"
                ? "bg-brand-600 text-white shadow-xs"
                : "bg-surface-secondary/70 hover:bg-surface-secondary text-text-secondary hover:text-text-primary border border-border/80"
            }`}
          >
            Kelas Saya (Dibuat)
          </button>

          <button
            type="button"
            onClick={() => onScopeChange("joined")}
            className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              scopeFilter === "joined"
                ? "bg-brand-600 text-white shadow-xs"
                : "bg-surface-secondary/70 hover:bg-surface-secondary text-text-secondary hover:text-text-primary border border-border/80"
            }`}
          >
            Kelas Diikuti
          </button>
        </div>

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
  );
}
