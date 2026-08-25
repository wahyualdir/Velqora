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
  { label: "AI Tutor Cerdas", href: "/dashboard/ai-tutor", icon: Bot },
  { label: "Latihan & Kuis AI", href: "/dashboard/kuis-ai", icon: BrainCircuit },
];

const TOOL_TABS: SubNavTabItem[] = [
  { label: "Ruang Praktik Kode", href: "/dashboard/playground", icon: Code2 },
  { label: "Konversi & OCR Berkas", href: "/dashboard/konversi", icon: ScanLine },
];

const TASK_TABS: SubNavTabItem[] = [
  { label: "Daftar Tugas", href: "/dashboard/tugas", icon: CheckSquare },
  { label: "Jadwal Perkuliahan", href: "/dashboard/tugas?tab=jadwal", icon: Calendar },
];

interface SubNavTabsProps {
  category: "documents" | "ai" | "tools" | "tasks";
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
      : TASK_TABS;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 p-1 rounded-xl bg-surface border border-border overflow-x-auto no-scrollbar max-w-full",
        className
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive =
          tab.href.includes("?tab=")
            ? pathname === tab.href.split("?")[0] &&
              (typeof window !== "undefined"
                ? window.location.search.includes(tab.href.split("?")[1])
                : false)
            : pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 whitespace-nowrap",
              isActive
                ? "bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-xs font-semibold"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-surface-elevated border border-border text-text-muted">
                {tab.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
