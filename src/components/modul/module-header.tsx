"use client";

import React from "react";
import Link from "next/link";
import { Plus, BookOpen, Code2, Layers, FolderCode, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";

export type ModuleViewTab = "categories" | "all-content";

interface ModuleHeaderProps {
  viewTab?: ModuleViewTab;
  onViewTabChange?: (tab: ModuleViewTab) => void;
  contentMode: "all" | "module" | "project";
  onModeChange: (mode: "all" | "module" | "project") => void;
  totalModules: number;
  totalProjects: number;
  totalCategories?: number;
  onOpenSorter?: () => void;
  onOpenImport?: () => void;
  importLabel?: string;
}

export function ModuleHeader({
  viewTab = "categories",
  onViewTabChange,
  contentMode,
  onModeChange,
  totalModules,
  totalProjects,
  totalCategories = 14,
  onOpenSorter,
  onOpenImport,
  importLabel = "Import Berkas Modul",
}: ModuleHeaderProps) {
  return (
    <PageHeader
      eyebrow="Kurikulum & Teori Kecerdasan Buatan"
      title="Katalog Modul AI"
      description="Fokus pada pemahaman konseptual, intuisi matematis, arsitektur, serta studi kasus per topik. Skrip implementasi dan praktikum tersedia terpadu di Katalog Kode."
      actions={
        <>
          {onOpenImport && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenImport}
              className="gap-1.5 text-xs font-semibold cursor-pointer border-brand-500/30 hover:bg-brand-500/10 hover:border-brand-500/50 text-brand-600 dark:text-brand-400"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{importLabel}</span>
            </Button>
          )}

          {onOpenSorter && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenSorter}
              className="gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span className="hidden sm:inline">Klasifikasi Kategori</span>
            </Button>
          )}

          <Link href="/dashboard/modul/baru">
            <Button size="sm" className="gap-1.5 text-xs font-semibold cursor-pointer">
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Modul</span>
            </Button>
          </Link>

          <Link href="/dashboard/modul/baru?mode=project">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold cursor-pointer">
              <FolderCode className="w-3.5 h-3.5" />
              <span>Project Baru</span>
            </Button>
          </Link>
        </>
      }
    >
      {/* Primary View Switcher: Topik Kurikulum vs Semua Modul & Proyek */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <div className="flex items-center gap-1 p-1 bg-surface-secondary rounded-xl border border-[#E6E0D6] dark:border-[#24201E] w-fit max-w-full overflow-x-auto scrollbar-none touch-pan-x">
          <button
            type="button"
            onClick={() => onViewTabChange?.("categories")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all shrink-0 cursor-pointer ${
              viewTab === "categories"
                ? "bg-surface text-text-primary font-semibold shadow-xs border border-border/50"
                : "text-text-secondary hover:text-text-primary hover:bg-surface/50"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Topik Kurikulum ({totalCategories})</span>
          </button>

          <button
            type="button"
            onClick={() => onViewTabChange?.("all-content")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all shrink-0 cursor-pointer ${
              viewTab === "all-content"
                ? "bg-surface text-text-primary font-semibold shadow-xs border border-border/50"
                : "text-text-secondary hover:text-text-primary hover:bg-surface/50"
            }`}
          >
            <FolderCode className="w-3.5 h-3.5" />
            <span>Semua Modul & Proyek ({totalModules + totalProjects})</span>
          </button>
        </div>

        {/* Content Mode Sub-tabs (when viewTab is 'all-content') */}
        {viewTab === "all-content" && (
          <div className="flex items-center gap-1 p-1 bg-surface-secondary/70 rounded-xl border border-[#E6E0D6] dark:border-[#24201E] w-fit max-w-full overflow-x-auto scrollbar-none touch-pan-x">
            <button
              type="button"
              onClick={() => onModeChange("all")}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all shrink-0 cursor-pointer ${
                contentMode === "all"
                  ? "bg-[#C2553A]/12 dark:bg-[#D4664A]/15 text-[#C2553A] dark:text-[#F09A82] font-semibold"
                  : "text-text-tertiary hover:text-text-primary"
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => onModeChange("module")}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all shrink-0 cursor-pointer ${
                contentMode === "module"
                  ? "bg-[#C2553A]/12 dark:bg-[#D4664A]/15 text-[#C2553A] dark:text-[#F09A82] font-semibold"
                  : "text-text-tertiary hover:text-text-primary"
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>Modul ({totalModules})</span>
            </button>
            <button
              type="button"
              onClick={() => onModeChange("project")}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all shrink-0 cursor-pointer ${
                contentMode === "project"
                  ? "bg-[#C2553A]/12 dark:bg-[#D4664A]/15 text-[#C2553A] dark:text-[#F09A82] font-semibold"
                  : "text-text-tertiary hover:text-text-primary"
              }`}
            >
              <Code2 className="w-3 h-3" />
              <span>Proyek ({totalProjects})</span>
            </button>
          </div>
        )}
      </div>
    </PageHeader>
  );
}
