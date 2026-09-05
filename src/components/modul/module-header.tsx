"use client";

import React from "react";
import Link from "next/link";
import { Plus, BookOpen, Code2, Layers, FolderCode, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";

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
    <PageHeader
      eyebrow="Kurikulum & Repositori"
      title="Modul & Project"
      description="Kelola modul pembelajaran berstruktur silabus dan repositori proyek kode Anda secara terorganisir."
      actions={
        <>
          {onOpenSorter && (
            <button
              type="button"
              onClick={onOpenSorter}
              className="vt-btn-chrome text-xs font-mono font-bold flex items-center gap-1.5 py-1.5 px-3 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C2553A]" />
              <span className="hidden sm:inline">Klasifikasi Kategori</span>
            </button>
          )}

          <Link
            href="/dashboard/modul/baru"
            className="vt-btn-terracotta text-xs font-mono font-bold flex items-center gap-1.5 py-1.5 px-3 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Modul</span>
          </Link>

          <Link
            href="/dashboard/modul/baru?mode=project"
            className="vt-btn-chrome text-xs font-mono font-bold flex items-center gap-1.5 py-1.5 px-3 cursor-pointer"
          >
            <FolderCode className="w-3.5 h-3.5" />
            <span>Project Baru</span>
          </Link>
        </>
      }
    >
      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#ECE9D8] border-t-2 border-l-2 border-[#7A756D] border-b border-r border-[#FFFFFF] w-fit max-w-full overflow-x-auto">
        <button
          type="button"
          onClick={() => onModeChange("all")}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold shrink-0 cursor-pointer ${
            contentMode === "all"
              ? "vt-btn-terracotta shadow-xs"
              : "vt-btn-chrome"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Semua ({totalModules + totalProjects})</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange("module")}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold shrink-0 cursor-pointer ${
            contentMode === "module"
              ? "vt-btn-terracotta shadow-xs"
              : "vt-btn-chrome"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Modul Belajar ({totalModules})</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange("project")}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold shrink-0 cursor-pointer ${
            contentMode === "project"
              ? "vt-btn-terracotta shadow-xs"
              : "vt-btn-chrome"
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Proyek Kode ({totalProjects})</span>
        </button>
      </div>
    </PageHeader>
  );
}
