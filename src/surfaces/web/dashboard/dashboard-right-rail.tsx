"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Code2,
  Calendar,
  Layers,
  CheckSquare,
} from "lucide-react";
import { VelqoraMark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import type { ScheduleItem } from "@/types";
import {
  getCurrentAcademicPeriod,
  resolveActiveTopicEmblem,
} from "./dashboard-utils";

interface DashboardRightRailProps {
  userName: string;
  loading: boolean;
  totalModul: number;
  totalTugas: number;
  totalMateri: number;
  recentModules: any[];
  recentTasks: any[];
  recentViews: any[];
  todaySchedules: ScheduleItem[];
}

export function DashboardRightRail({
  userName,
  loading,
  totalModul,
  totalTugas,
  totalMateri,
  recentModules,
  recentTasks,
  recentViews,
  todaySchedules,
}: DashboardRightRailProps) {
  const [railTab, setRailTab] = useState<"today" | "detail">("today");
  const [shortPeriod, setShortPeriod] = useState("Ganjil 2026/2027");

  useEffect(() => {
    setShortPeriod(getCurrentAcademicPeriod(new Date()).shortPeriod);
  }, []);

  const emblem = resolveActiveTopicEmblem(
    recentModules,
    recentTasks,
    recentViews
  );
  const primaryModule = recentModules?.[0] || null;
  const chapters = Array.isArray(primaryModule?.chapters)
    ? primaryModule.chapters
    : [];
  const completedChapters = chapters.filter((c: any) => c.is_completed).length;
  const progressPercent =
    chapters.length > 0
      ? Math.round((completedChapters / chapters.length) * 100)
      : primaryModule?.progress || 0;

  return (
    <aside
      aria-label="Panel Kontekstual Belajar"
      className="w-full xl:w-[305px] 2xl:w-[325px] shrink-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4 sm:gap-5 items-start"
    >
      {/* ─── Card 1: Active Topic Spotlight Emblem ─── */}
      <Link
        href={emblem.href}
        className="group rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] hover:border-[#C2553A]/40 dark:hover:border-[#D4664A]/40 p-5 flex flex-col items-center justify-center gap-4 shadow-2xs transition-all"
      >
        <div
          className={cn(
            "w-40 h-40 sm:w-44 sm:h-44 rounded-2xl flex items-end justify-end p-5 relative overflow-hidden shadow-md transition-transform duration-200 group-hover:scale-[1.02] border",
            emblem.bgClass,
            emblem.borderClass
          )}
        >
          {/* Subtle geometric architectural grid line inside emblem */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.65) 1px, transparent 0)",
              backgroundSize: "16px 16px",
            }}
          />
          <span
            className={cn(
              "font-display font-extrabold tracking-tight leading-none select-none relative z-10",
              emblem.code.length >= 3 ? "text-5xl" : "text-6xl",
              emblem.textClass
            )}
          >
            {emblem.code}
          </span>
        </div>

        <div className="flex flex-col items-center text-center gap-1.5 min-w-0 w-full">
          <span className="inline-flex items-center px-4 py-1 rounded-full border border-[#1C1917]/20 dark:border-[#F5F5F4]/20 bg-[#F3EFE9] dark:bg-[#1C1917] text-[#1C1917] dark:text-[#F5F5F4] font-mono text-[11px] font-extrabold tracking-widest uppercase">
            {emblem.label}
          </span>
          <p className="text-[11.5px] font-medium text-[#6B6560] dark:text-[#A8A29E] truncate max-w-full px-2">
            {emblem.sublabel}
          </p>
        </div>
      </Link>

      {/* ─── Card 2 & 3 Stack (Pairs cleanly on Tablet 2-col too) ─── */}
      <div className="space-y-4 sm:space-y-5">
        {/* Segmented Mini-Switcher: Hari Ini | Detail Modul */}
        <div className="rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] p-2 shadow-2xs space-y-3">
          <div
            role="tablist"
            aria-label="Ringkasan Kontekstual"
            className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#F3EFE9] dark:bg-[#1C1917]"
          >
            <button
              type="button"
              role="tab"
              aria-selected={railTab === "today"}
              onClick={() => setRailTab("today")}
              className={cn(
                "py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                railTab === "today"
                  ? "bg-[#FFFFFF] dark:bg-[#24201D] text-[#1C1917] dark:text-[#F5F5F4] shadow-2xs"
                  : "text-[#6B6560] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F5F4]"
              )}
            >
              Hari Ini
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={railTab === "detail"}
              onClick={() => setRailTab("detail")}
              className={cn(
                "py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                railTab === "detail"
                  ? "bg-[#FFFFFF] dark:bg-[#24201D] text-[#1C1917] dark:text-[#F5F5F4] shadow-2xs"
                  : "text-[#6B6560] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F5F4]"
              )}
            >
              Detail Modul
            </button>
          </div>

          {railTab === "today" ? (
            <div className="px-2 pb-1.5 space-y-2.5">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  href="/dashboard/jadwal"
                  className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] hover:border-[#C2553A]/35 transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#8A8378] dark:text-[#8C857F] uppercase">
                    <Calendar className="w-3 h-3 text-[#C2553A] dark:text-[#D4664A]" />
                    <span>Sesi Hari Ini</span>
                  </div>
                  <p className="mt-1 text-lg font-extrabold text-[#1C1917] dark:text-[#F5F5F4] tabular-nums">
                    {loading ? "…" : todaySchedules.length}
                  </p>
                </Link>

                <Link
                  href="/dashboard/tugas"
                  className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] hover:border-[#C2553A]/35 transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#8A8378] dark:text-[#8C857F] uppercase">
                    <CheckSquare className="w-3 h-3 text-[#C2553A] dark:text-[#D4664A]" />
                    <span>Tugas Aktif</span>
                  </div>
                  <p className="mt-1 text-lg font-extrabold text-[#1C1917] dark:text-[#F5F5F4] tabular-nums">
                    {loading ? "…" : recentTasks.length}
                  </p>
                </Link>
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                <Link
                  href="/dashboard/playground"
                  className="flex-1 flex items-center justify-center gap-1.5 h-8.5 rounded-xl vt-btn-chrome text-[11px] font-bold"
                >
                  <Code2 className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
                  <span>Lab Kode</span>
                </Link>
                <Link
                  href="/dashboard/ai-tutor"
                  className="flex-1 flex items-center justify-center gap-1.5 h-8.5 rounded-xl vt-btn-chrome text-[11px] font-bold"
                >
                  <Bot className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
                  <span>Tanya AI</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="px-2 pb-1.5 space-y-2.5">
              {primaryModule ? (
                <>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#C2553A] dark:text-[#D4664A]">
                      {primaryModule.category?.name || "Kurikulum Utama"}
                    </span>
                    <p className="text-xs font-bold text-[#1C1917] dark:text-[#F5F5F4] line-clamp-2 leading-snug">
                      {primaryModule.title}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#6B6560] dark:text-[#A8A29E]">
                        Progres Bab
                      </span>
                      <span className="font-bold text-[#1C1917] dark:text-[#F5F5F4]">
                        {progressPercent}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#F3EFE9] dark:bg-[#1C1917] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#C2553A] dark:bg-[#D4664A] transition-all"
                        style={{ width: `${Math.max(8, progressPercent)}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/modul?module=${primaryModule.id}`}
                    className="w-full h-8.5 rounded-xl bg-[#C2553A] hover:bg-[#A34530] dark:bg-[#D4664A] dark:hover:bg-[#C2553A] text-[#FFFBF8] text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Buka Modul</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              ) : (
                <div className="py-2 text-center space-y-2">
                  <p className="text-xs text-[#6B6560] dark:text-[#A8A29E]">
                    Belum ada modul aktif.
                  </p>
                  <Link
                    href="/dashboard/modul/baru"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl vt-btn-chrome text-xs font-semibold"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
                    <span>Buat Modul</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── Card 3: Kartu Identitas Akademik Aktif (matching bottom-right card) ─── */}
        <div className="rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#FAF3EF] dark:bg-[#D4664A]/15 border border-[#C2553A]/20 dark:border-[#D4664A]/30 flex items-center justify-center shrink-0">
                <VelqoraMark size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-[#1C1917] dark:text-[#F5F5F4] leading-tight truncate font-display">
                  Velqora
                </p>
                <p className="text-[9.5px] font-mono font-bold text-[#8A8378] dark:text-[#8C857F] uppercase tracking-wider truncate">
                  KARTU AKADEMIK AKTIF
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2E6B4E]/10 text-[#2E6B4E] dark:bg-[#4ADE80]/12 dark:text-[#4ADE80] border border-[#2E6B4E]/25 dark:border-[#4ADE80]/25 text-[10px] font-extrabold font-mono uppercase shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B4E] dark:bg-[#4ADE80]" />
              <span>AKTIF</span>
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#1C1917] dark:text-[#F5F5F4] truncate">
                {userName?.trim() || "Pembelajar Velqora"}
              </p>
              <p className="text-[10.5px] font-mono text-[#6B6560] dark:text-[#A8A29E] truncate">
                {shortPeriod} • {totalModul} Modul • {totalTugas} Tugas • {totalMateri} Materi
              </p>
            </div>
            <Link
              href="/dashboard/statistik"
              className="p-1.5 rounded-lg hover:bg-[#FFFFFF] dark:hover:bg-[#24201D] text-[#C2553A] dark:text-[#D4664A] transition-colors shrink-0"
              title="Buka Statistik Belajar"
            >
              <BookOpen className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
