"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Files,
  Bookmark,
  PenLine,
  Bot,
  BrainCircuit,
  Code2,
  ScanLine,
  CheckSquare,
  Calendar,
  Sliders,
  FolderOpen,
  Tag,
  HardDriveDownload,
  BarChart3,
} from "lucide-react";

interface SubNavTabItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
}

const DOCUMENT_TABS: SubNavTabItem[] = [
  { label: "Materi Pembelajaran", href: "/dashboard/materi", icon: BookOpen },
  { label: "Semua Berkas", href: "/dashboard/file", icon: Files },
  { label: "Materi Tersimpan", href: "/dashboard/bookmark", icon: Bookmark },
  { label: "Catatan Belajar", href: "/dashboard/catatan", icon: PenLine },
];

const AI_TABS: SubNavTabItem[] = [
  { label: "AI Tutor", href: "/dashboard/ai-tutor", icon: Bot },
  { label: "Kuis & Evaluasi AI", href: "/dashboard/kuis-ai", icon: BrainCircuit },
];

const TOOL_TABS: SubNavTabItem[] = [
  { label: "Ruang Praktik Kode", href: "/dashboard/playground", icon: Code2 },
  { label: "Konversi & OCR Berkas", href: "/dashboard/konversi", icon: ScanLine },
];

const TASK_TABS: SubNavTabItem[] = [
  { label: "Daftar Tugas", href: "/dashboard/tugas", icon: CheckSquare },
  { label: "Jadwal Perkuliahan", href: "/dashboard/jadwal", icon: Calendar },
];

const SETTINGS_TABS: SubNavTabItem[] = [
  { label: "Pengaturan Umum", href: "/dashboard/pengaturan", icon: Sliders },
  { label: "Kategori & Subjek", href: "/dashboard/kategori", icon: FolderOpen },
  { label: "Label & Tag", href: "/dashboard/tag", icon: Tag },
  { label: "Cadangan Data", href: "/dashboard/backup", icon: HardDriveDownload },
  { label: "Statistik Belajar", href: "/dashboard/statistik", icon: BarChart3 },
];

interface SubNavTabsProps {
  category: "documents" | "ai" | "tools" | "tasks" | "settings";
  className?: string;
}

export function SubNavTabs({ category, className }: SubNavTabsProps) {
  const pathname = usePathname();

  const tabs =
    category === "documents"
      ? DOCUMENT_TABS
      : category === "ai"
      ? AI_TABS
      : category === "tools"
      ? TOOL_TABS
      : category === "tasks"
      ? TASK_TABS
      : SETTINGS_TABS;

  return (
    <nav
      aria-label="Navigasi Sub Kategori"
      className={cn(
        "flex items-center gap-1.5 p-1 rounded-xl bg-surface border border-border overflow-x-auto scrollbar-none touch-pan-x max-w-full select-none shadow-2xs",
        className
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 whitespace-nowrap",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
              isActive
                ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 shadow-2xs font-semibold"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary border border-transparent"
            )}
          >
            <Icon
              className={cn(
                "w-4 h-4 shrink-0",
                isActive ? "text-brand-600 dark:text-brand-400" : "text-text-tertiary"
              )}
            />
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-surface-secondary border border-border text-text-muted">
                {tab.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
