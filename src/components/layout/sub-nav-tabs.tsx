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
        "flex items-center gap-1 p-1 bg-[#ECE9D8] dark:bg-[#18181B] border-t border-l border-[#FFFFFF] dark:border-t-[#3F3F46] dark:border-l-[#3F3F46] border-b border-r border-[#7A756D] dark:border-b-[#09090B] dark:border-r-[#09090B] overflow-x-auto scrollbar-none touch-pan-x max-w-full select-none shadow-2xs font-mono mb-4",
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
              "flex items-center gap-2 px-3 py-1 text-xs font-medium transition-all shrink-0 whitespace-nowrap",
              "focus-visible:outline-none",
              isActive
                ? "bg-[#C2553A] dark:bg-brand-600 text-white font-bold border-t border-l border-[#EE7257] dark:border-t-brand-400 dark:border-l-brand-400 border-b border-r border-[#6B2D20] dark:border-b-brand-900 dark:border-r-brand-900 shadow-2xs"
                : "text-[#524B42] dark:text-zinc-400 hover:text-[#1C1917] dark:hover:text-zinc-100 hover:bg-[#FAF8F5]/80 dark:hover:bg-zinc-800 border border-transparent"
            )}
          >
            <Icon
              className={cn(
                "w-3.5 h-3.5 shrink-0",
                isActive ? "text-white" : "text-[#7A756D] dark:text-zinc-400"
              )}
            />
            <span className="font-sans text-xs font-semibold">{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "px-1.5 py-0.2 text-[9px] font-mono",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-[#FAF8F5] dark:bg-zinc-800 text-[#524B42] dark:text-zinc-400 border border-[#B8B1A5] dark:border-zinc-700"
                )}
              >
                {tab.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
