"use client";

import React from "react";
import { MessageSquare, BookOpen, Layers, ClipboardList, Users } from "lucide-react";

export type ClassTabKey = "stream" | "materi" | "modul" | "tugas" | "members";

interface ClassTabsProps {
  activeTab: ClassTabKey;
  onTabChange: (tab: ClassTabKey) => void;
  counts: {
    announcements: number;
    materials: number;
    modules: number;
    tasks: number;
    members: number;
  };
}

export function ClassTabs({ activeTab, onTabChange, counts }: ClassTabsProps) {
  const tabs: { key: ClassTabKey; label: string; icon: React.ElementType; count?: number }[] = [
    { key: "stream", label: "Ringkasan & Forum", icon: MessageSquare, count: counts.announcements },
    { key: "materi", label: "Bahan Ajar & Dokumen", icon: BookOpen, count: counts.materials },
    { key: "modul", label: "Modul Belajar", icon: Layers, count: counts.modules },
    { key: "tugas", label: "Penugasan", icon: ClipboardList, count: counts.tasks },
    { key: "members", label: "Anggota Kelas", icon: Users, count: counts.members },
  ];

  return (
    <div className="flex items-center gap-1.5 border-b border-border overflow-x-auto pb-0 scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`inline-flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
              isActive
                ? "border-brand-500 text-brand-600 dark:text-brand-400 font-bold"
                : "border-transparent text-text-secondary hover:text-text-primary hover:border-border"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {typeof tab.count === "number" && tab.count > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive
                    ? "bg-brand-500/20 text-brand-600 dark:text-brand-400 font-bold"
                    : "bg-surface-secondary text-text-tertiary"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
