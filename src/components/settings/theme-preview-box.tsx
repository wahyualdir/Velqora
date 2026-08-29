"use client";

import React, { useState } from "react";
import {
  LayoutGrid,
  BookOpen,
  Layers,
  Search,
  CheckCircle2,
  Bell,
  TrendingUp,
} from "lucide-react";
import { VelqoraMark } from "@/components/ui/logo";
import { useThemeAccent } from "@/context/theme-accent-context";
import { useTheme } from "next-themes";

export function ThemePreviewBox() {
  const { accent, density } = useThemeAccent();
  const { resolvedTheme } = useTheme();
  const [inputValue, setInputValue] = useState("Algoritma & Struktur Data");
  const [activeTab, setActiveTab] = useState("modul");

  return (
    <div className="w-full rounded-xl border border-border bg-surface p-3 sm:p-4 space-y-3 shadow-2xs overflow-hidden transition-all">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-text-primary">
            Pratinjau Langsung (Live Preview)
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-text-tertiary">
          <span className="capitalize">{resolvedTheme || "dark"}</span>
          <span>•</span>
          <span className="capitalize">{accent}</span>
          <span>•</span>
          <span className="capitalize">{density}</span>
        </div>
      </div>

      {/* Interactive Mockup Container */}
      <div className="rounded-lg border border-border bg-surface-secondary/50 overflow-hidden flex flex-col md:flex-row min-h-[290px]">
        {/* 1. Mini Sidebar */}
        <div className="w-full md:w-48 border-b md:border-b-0 md:border-r border-border bg-sidebar p-3 flex flex-col justify-between shrink-0">
          <div className="space-y-3">
            {/* Mini Brand Header */}
            <div className="flex items-center gap-2 px-1">
              <VelqoraMark size={18} />
              <span className="text-xs font-bold text-text-primary font-display">
                Vel<span className="text-brand-500">qora</span>
              </span>
            </div>

            {/* Mini Navigation Links */}
            <div className="space-y-1 pt-1">
              <button
                type="button"
                onClick={() => setActiveTab("modul")}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  activeTab === "modul"
                    ? "bg-brand-500/15 text-brand-600 dark:text-brand-400 font-bold border border-brand-500/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Modul Belajar</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("proyek")}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  activeTab === "proyek"
                    ? "bg-brand-500/15 text-brand-600 dark:text-brand-400 font-bold border border-brand-500/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Proyek Studi</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("catatan")}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  activeTab === "catatan"
                    ? "bg-brand-500/15 text-brand-600 dark:text-brand-400 font-bold border border-brand-500/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Catatan</span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-border/70 flex items-center gap-2 text-[10px] text-text-tertiary">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Workspace Siap</span>
          </div>
        </div>

        {/* 2. Mini Content Area */}
        <div className="flex-1 p-4 space-y-3 bg-surface flex flex-col justify-between">
          <div className="space-y-3">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between gap-2">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-text-tertiary" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full pl-7 pr-2 py-1 text-[11px] rounded-md border border-border bg-surface-secondary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="p-1 rounded-md border border-border bg-surface text-text-secondary hover:text-text-primary cursor-pointer"
                >
                  <Bell className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-md bg-brand-500 text-white text-[11px] font-semibold hover:bg-brand-600 transition-colors shadow-2xs cursor-pointer"
                >
                  + Baru
                </button>
              </div>
            </div>

            {/* Mock Item Card */}
            <div className="p-3 rounded-lg border border-border bg-surface-secondary/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded border border-brand-500/20">
                  Modul Aktif
                </span>
                <span className="text-[10px] font-mono text-text-tertiary flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Selesai 85%
                </span>
              </div>
              <h4 className="text-xs font-bold text-text-primary">
                Struktur Data: Binary Search Tree & Graph
              </h4>
              <p className="text-[11px] text-text-secondary line-clamp-1">
                Implementasi struktur data pohon biner terurut dan algoritma penelusuran graf DFS & BFS.
              </p>
            </div>
          </div>

          {/* Bottom Metrik */}
          <div className="pt-2 border-t border-border/70 flex items-center justify-between text-[10px] text-text-tertiary font-mono">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <TrendingUp className="w-3 h-3" />
              Retensi Belajar +14%
            </span>
            <span>Velqora v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
