"use client";

import React from "react";
import Link from "next/link";
import { Plus, BookOpen, Code2, Layers, FolderCode, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModuleHeaderProps {
  contentMode: "all" | "module" | "project";
  onModeChange: (mode: "all" | "module" | "project") => void;
  totalModules: number;
  totalProjects: number;
  onOpenSorter?: () => void;
}

export function ModuleHeader({
  contentMode,
  onModeChange,
  totalModules,
  totalProjects,
  onOpenSorter,
}: ModuleHeaderProps) {
  return (
    <header className="space-y-4 border-b border-border/70 pb-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase font-mono bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              Kurikulum & Repositori
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight font-display">
            Modul & Project
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
            Kelola modul pembelajaran berstruktur silabus dan repositori proyek kode Anda secara terorganisir.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {onOpenSorter && (
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenSorter}
              className="gap-1.5 text-xs text-text-secondary hover:text-text-primary"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span className="hidden sm:inline">Klasifikasi Kategori</span>
            </Button>
          )}

          <Link href="/dashboard/modul/baru">
            <Button size="sm" className="gap-1.5 text-xs font-semibold shadow-xs">
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Modul</span>
            </Button>
          </Link>

          <Link href="/dashboard/modul/baru?mode=project">
            <Button size="sm" variant="secondary" className="gap-1.5 text-xs font-medium">
              <FolderCode className="w-3.5 h-3.5" />
              <span>Project Baru</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-secondary/70 border border-border w-fit max-w-full overflow-x-auto">
        <button
          type="button"
          onClick={() => onModeChange("all")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            contentMode === "all"
              ? "bg-surface text-text-primary shadow-xs border border-border/80"
              : "text-text-secondary hover:text-text-primary hover:bg-surface/50 border border-transparent"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Semua ({totalModules + totalProjects})</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange("module")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            contentMode === "module"
              ? "bg-surface text-brand-600 dark:text-brand-400 shadow-xs border border-border/80"
              : "text-text-secondary hover:text-text-primary hover:bg-surface/50 border border-transparent"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Modul Belajar ({totalModules})</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange("project")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            contentMode === "project"
              ? "bg-surface text-blue-600 dark:text-blue-400 shadow-xs border border-border/80"
              : "text-text-secondary hover:text-text-primary hover:bg-surface/50 border border-transparent"
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Proyek Kode ({totalProjects})</span>
        </button>
      </div>
    </header>
  );
}
