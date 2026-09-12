"use client";

import React from "react";
import Link from "next/link";
import { Plus, BookOpen, Code2, Layers, FolderCode, Sparkles } from "lucide-react";
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
}: ModuleHeaderProps) {
  return (
    <PageHeader
      eyebrow="Kurikulum Kecerdasan Buatan"
      title="Katalog Modul AI"
      description="Jelajahi kurikulum terstruktur serta proyek praktikum Kecerdasan Buatan (AI) yang terorganisir per topik."
      actions={
        <>
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
        <div className="flex items-center gap-1 p-1 bg-surface-secondary rounded-xl border border-border w-fit max-w-full overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => onViewTabChange?.("categories")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
              viewTab === "categories"
                ? "bg-brand-600 text-white font-bold shadow-xs"
                : "text-text-secondary hover:text-text-primary hover:bg-surface/50"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Topik Kurikulum ({totalCategories})</span>
          </button>

          <button
            type="button"
            onClick={() => onViewTabChange?.("all-content")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
              viewTab === "all-content"
                ? "bg-brand-600 text-white font-bold shadow-xs"
                : "text-text-secondary hover:text-text-primary hover:bg-surface/50"
            }`}
          >
            <FolderCode className="w-3.5 h-3.5" />
            <span>Semua Modul & Proyek ({totalModules + totalProjects})</span>
          </button>
        </div>

        {/* Content Mode Sub-tabs (when viewTab is 'all-content') */}
        {viewTab === "all-content" && (
          <div className="flex items-center gap-1 p-1 bg-surface-secondary/70 rounded-xl border border-border/80 w-fit max-w-full overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => onModeChange("all")}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
                contentMode === "all"
                  ? "bg-surface text-brand-600 dark:text-brand-400 font-bold border border-border shadow-2xs"
                  : "text-text-tertiary hover:text-text-primary"
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => onModeChange("module")}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
                contentMode === "module"
                  ? "bg-surface text-brand-600 dark:text-brand-400 font-bold border border-border shadow-2xs"
                  : "text-text-tertiary hover:text-text-primary"
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>Modul ({totalModules})</span>
            </button>
            <button
              type="button"
              onClick={() => onModeChange("project")}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
                contentMode === "project"
                  ? "bg-surface text-brand-600 dark:text-brand-400 font-bold border border-border shadow-2xs"
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
