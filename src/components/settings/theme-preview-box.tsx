"use client";

import React, { useState } from "react";
import {
  LayoutGrid,
  BookOpen,
  Layers,
  Search,
  Sparkles,
  CheckCircle2,
  Bell,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { VelqoraMark } from "@/components/ui/logo";
import { useThemeAccent } from "@/context/theme-accent-context";
import { useTheme } from "next-themes";

export function ThemePreviewBox() {
  const { accent, bgStyle, contrast, density, radius, motion } = useThemeAccent();
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
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
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer text-left ${
                  activeTab === "dashboard"
                    ? "bg-brand-500/15 text-brand-400 font-semibold border border-brand-500/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-tertiary border border-transparent"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("modul")}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer text-left ${
                  activeTab === "modul"
                    ? "bg-brand-500/15 text-brand-400 font-semibold border border-brand-500/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-tertiary border border-transparent"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Modul & Project</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("materi")}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer text-left ${
                  activeTab === "materi"
                    ? "bg-brand-500/15 text-brand-400 font-semibold border border-brand-500/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-tertiary border border-transparent"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Materi Belajar</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-border mt-3 hidden md:block">
            <div className="flex items-center gap-2 px-1">
              <div className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center text-[9px] font-bold text-white">
                V
              </div>
              <div className="text-[10px] text-text-tertiary truncate">Senior Student</div>
            </div>
          </div>
        </div>

        {/* 2. Main Content Canvas */}
        <div className="flex-1 flex flex-col min-w-0 bg-surface/40 p-4 sm:p-5 space-y-4">
          {/* Mini Navbar */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-border">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                readOnly
                placeholder="Cari materi atau topik..."
                className="w-full pl-8 pr-3 py-1 rounded-lg border border-border bg-surface text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="w-7 h-7 rounded-lg border border-border bg-surface hover:bg-surface-secondary flex items-center justify-center text-text-secondary transition-colors"
                title="Notifikasi"
              >
                <Bell className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sample Interactive Card */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            {/* Primary Learning Card */}
            <div className="sm:col-span-8 rounded-xl border border-border bg-surface p-3.5 sm:p-4 space-y-3 shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      MODUL UTAMA
                    </span>
                    <span className="text-[10px] text-text-tertiary">Semester 4</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-text-primary font-display">
                    Struktur Data & Kompleksitas Algoritma
                  </h4>
                </div>
                <span className="text-xs font-mono font-semibold text-brand-400 shrink-0 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> 78%
                </span>
              </div>

              {/* Progress Bar with current Accent Color */}
              <div className="space-y-1">
                <div className="w-full h-1.5 rounded-full bg-surface-tertiary overflow-hidden">
                  <div
                    className="h-full bg-brand-600 rounded-full transition-all duration-300"
                    style={{ width: "78%" }}
                  />
                </div>
                <div className="flex justify-between text-[9.5px] font-mono text-text-tertiary">
                  <span>14 dari 18 Bab Selesai</span>
                  <span>4 Sisa</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500 shadow-xs transition-colors cursor-pointer"
                >
                  Lanjut Belajar
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-surface-tertiary text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
                >
                  Lihat Silabus
                </button>
              </div>
            </div>

            {/* Secondary Utility Card */}
            <div className="sm:col-span-4 rounded-xl border border-border bg-surface p-3.5 space-y-2.5 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider block">
                  Status Sistem
                </span>
                <p className="text-xs font-bold text-text-primary mt-0.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Optimal</span>
                </p>
                <p className="text-[10.5px] text-text-secondary mt-1 leading-relaxed">
                  Semua preferensi visual aktif dan tersinkronisasi.
                </p>
              </div>

              <div className="pt-2 border-t border-border">
                <label className="text-[10px] font-semibold text-text-tertiary block mb-1">
                  Uji Bidang Masukan:
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-2.5 py-1 text-xs rounded-lg border border-border bg-surface-secondary text-text-primary focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
