"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Code2,
  Calendar,
  Layers,
  CheckSquare,
} from "lucide-react";
import { VelqoraMark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import type { ScheduleItem } from "@/types";
import { resolveActiveTopicEmblem } from "./dashboard-utils";

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

function toTitleLabel(text: string): string {
  return text
    .toLowerCase()
    .replace(/\b\w/g, (ch) => ch.toUpperCase())
    .replace(/\bAi\b/g, "AI")
    .replace(/\bSql\b/g, "SQL")
    .replace(/\bDsa\b/g, "DSA");
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
      aria-label="Ringkasan Kontekstual"
      className="w-full xl:w-[300px] 2xl:w-[320px] shrink-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4 sm:gap-5 items-start font-sans"
    >
      {/* ─── Card 1: Clean Proportional Topik Fokus Card (No AI-slop dot grid) ─── */}
      <Link
        href={emblem.href}
        className="group rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E6E0D6] dark:border-[#24201E] hover:border-[#C2553A]/35 dark:hover:border-[#D4664A]/40 p-5 flex items-center gap-4 shadow-2xs transition-colors"
      >
        <div
          className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border shadow-xs transition-transform duration-200 group-hover:scale-[1.03]",
            emblem.bgClass,
            emblem.borderClass
          )}
        >
          <span
            className={cn(
              "font-display font-bold tracking-tight leading-none select-none",
              emblem.code.length >= 3 ? "text-xl" : "text-2xl",
              emblem.textClass
            )}
          >
            {emblem.code}
          </span>
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#F3EFE9] dark:bg-[#1C1917] text-[#C2553A] dark:text-[#F09A82] text-[11px] font-semibold">
            {toTitleLabel(emblem.label)}
          </span>
          <p className="text-sm font-semibold text-[#1C1917] dark:text-[#F5F5F4] truncate font-display group-hover:text-[#C2553A] dark:group-hover:text-[#F09A82] transition-colors">
            {emblem.sublabel}
          </p>
          <p className="text-xs text-[#6B6560] dark:text-[#A8A29E]">
            Topik fokus aktif →
          </p>
        </div>
      </Link>

      {/* ─── Card 2 & 3 Stack ─── */}
      <div className="space-y-4 sm:space-y-5">
        {/* Card 2: Hari Ini | Detail Modul (Flat hairline rows — zero box-in-box clutter) */}
        <div className="rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E6E0D6] dark:border-[#24201E] p-3.5 shadow-2xs space-y-3">
          <div
            role="tablist"
            aria-label="Ringkasan Aktivitas"
            className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#F3EFE9] dark:bg-[#1C1917]"
          >
            <button
              type="button"
              role="tab"
              aria-selected={railTab === "today"}
              onClick={() => setRailTab("today")}
              className={cn(
                "py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
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
                "py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                railTab === "detail"
                  ? "bg-[#FFFFFF] dark:bg-[#24201D] text-[#1C1917] dark:text-[#F5F5F4] shadow-2xs"
                  : "text-[#6B6560] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F5F4]"
              )}
            >
              Detail Modul
            </button>
          </div>

          {railTab === "today" ? (
            <div className="divide-y divide-[#E6E0D6]/70 dark:divide-[#24201E] text-xs">
              <Link
                href="/dashboard/jadwal"
                className="flex items-center justify-between py-2.5 px-1.5 hover:bg-[#FAF8F5] dark:hover:bg-[#1C1917] rounded-lg transition-colors"
              >
                <span className="flex items-center gap-2 text-[#5C554E] dark:text-[#A8A29E] font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#F09A82]" />
                  <span>Sesi hari ini</span>
                </span>
                <span className="font-semibold text-[#1C1917] dark:text-[#F5F5F4] tabular-nums">
                  {loading ? "…" : `${todaySchedules.length} sesi`}
                </span>
              </Link>

              <Link
                href="/dashboard/tugas"
                className="flex items-center justify-between py-2.5 px-1.5 hover:bg-[#FAF8F5] dark:hover:bg-[#1C1917] rounded-lg transition-colors"
              >
                <span className="flex items-center gap-2 text-[#5C554E] dark:text-[#A8A29E] font-medium">
                  <CheckSquare className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#F09A82]" />
                  <span>Tugas aktif</span>
                </span>
                <span className="font-semibold text-[#1C1917] dark:text-[#F5F5F4] tabular-nums">
                  {loading ? "…" : `${recentTasks.length} tugas`}
                </span>
              </Link>

              <div className="pt-3 flex items-center gap-2">
                <Link
                  href="/dashboard/playground"
                  className="flex-1 flex items-center justify-center gap-1.5 h-8.5 rounded-xl vt-btn-chrome text-xs font-semibold"
                >
                  <Code2 className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#F09A82]" />
                  <span>Lab Kode</span>
                </Link>
                <Link
                  href="/dashboard/ai-tutor"
                  className="flex-1 flex items-center justify-center gap-1.5 h-8.5 rounded-xl vt-btn-chrome text-xs font-semibold"
                >
                  <Bot className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#F09A82]" />
                  <span>Tanya AI</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="px-1 pt-1 space-y-3">
              {primaryModule ? (
                <>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-[#C2553A] dark:text-[#F09A82]">
                      {primaryModule.category?.name || "Kurikulum Utama"}
                    </span>
                    <p className="text-[13px] font-semibold text-[#1C1917] dark:text-[#F5F5F4] line-clamp-2 leading-snug">
                      {primaryModule.title}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6B6560] dark:text-[#A8A29E]">
                        Progres bab
                      </span>
                      <span className="font-semibold text-[#1C1917] dark:text-[#F5F5F4] tabular-nums">
                        {progressPercent}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#F3EFE9] dark:bg-[#24201E] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#C2553A] dark:bg-[#D4664A] transition-all"
                        style={{ width: `${Math.max(4, progressPercent)}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/modul?module=${primaryModule.id}`}
                    className="w-full h-9 rounded-xl vt-btn-chrome text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <span>Buka Modul</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#F09A82]" />
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
                    <Layers className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#F09A82]" />
                    <span>Buat Modul</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card 3: Clean Status Workspace Card (Zero ALL-CAPS jargon, no inner nested border) */}
        <div className="rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E6E0D6] dark:border-[#24201E] p-4 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#FAF3EF] dark:bg-[#D4664A]/15 flex items-center justify-center shrink-0">
                <VelqoraMark size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-[#1C1917] dark:text-[#F5F5F4] leading-tight truncate font-display">
                  {userName?.trim() || "Velqora Workspace"}
                </p>
                <p className="text-[11px] text-[#6B6560] dark:text-[#A8A29E] truncate">
                  Status Workspace
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2E6B4E]/10 text-[#2E6B4E] dark:bg-[#4ADE80]/12 dark:text-[#4ADE80] text-[11px] font-semibold shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B4E] dark:bg-[#4ADE80]" />
              <span>Aktif</span>
            </span>
          </div>

          <div className="pt-2.5 border-t border-[#E6E0D6]/70 dark:border-[#24201E] flex items-center justify-between gap-2 text-xs text-[#6B6560] dark:text-[#A8A29E]">
            <span className="truncate">
              {totalModul} modul · {totalTugas} tugas · {totalMateri} materi
            </span>
            <Link
              href="/dashboard/statistik"
              className="inline-flex items-center gap-1 font-semibold text-[#C2553A] dark:text-[#F09A82] hover:underline shrink-0"
              title="Lihat Statistik Belajar"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Statistik</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
