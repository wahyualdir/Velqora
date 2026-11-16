"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Sparkles,
  Plus,
  Upload,
  BookOpen,
  Layers,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { daysUntilDeadline } from "@/lib/utils";
import type { ScheduleItem } from "@/types";
import { getScheduleTimeRange, isScheduleLiveNow } from "./dashboard-utils";

interface DashboardFocusProps {
  loading: boolean;
  recentModules: any[];
  recentTasks: any[];
  recentViews: any[];
  todaySchedules?: ScheduleItem[];
  isBrandNew: boolean;
}

export function DashboardFocus({
  loading,
  recentModules,
  recentTasks,
  recentViews,
  todaySchedules = [],
  isBrandNew,
}: DashboardFocusProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-[#E6E0D6] dark:border-[#24201E] bg-[#FFFFFF] dark:bg-[#141210] p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-3.5">
          <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-6 w-2/3 rounded-md" />
            <Skeleton className="h-3 w-1/2 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  // 1. Brand new workspace onboarding banner
  if (isBrandNew) {
    return (
      <div className="rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E6E0D6] dark:border-[#24201E] p-5 sm:p-6 shadow-2xs font-sans">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-stretch gap-3.5 min-w-0">
            <div className="w-1 rounded-full bg-[#C2553A] dark:bg-[#D4664A] shrink-0" aria-hidden="true" />
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-[#FAF3EF] dark:bg-[#D4664A]/15 text-[#C2553A] dark:text-[#F09A82] flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FAF3EF] dark:bg-[#D4664A]/15 text-[#C2553A] dark:text-[#F09A82] text-xs font-semibold">
                    Prioritas Utama
                  </span>
                  <span className="text-xs font-medium text-[#6B6560] dark:text-[#A8A29E]">
                    Mulai Ruang Belajar
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#1C1917] dark:text-[#F5F5F4] font-display leading-snug">
                  Susun Modul &amp; Target Belajar Pertama Anda
                </h2>
                <p className="text-[13px] text-[#5C554E] dark:text-[#A8A29E] leading-relaxed max-w-2xl">
                  Tambahkan modul, unggah bahan bacaan, atau buat catatan agar progres harian tersusun rapi di sini.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0 pl-4 md:pl-0">
            <Link href="/dashboard/modul/baru">
              <button
                type="button"
                className="px-4 h-10.5 rounded-xl bg-[#C2553A] hover:bg-[#A34530] dark:bg-[#D4664A] dark:hover:bg-[#C2553A] text-[#FFFBF8] text-[13px] font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Modul Pertama</span>
              </button>
            </Link>
            <Link href="/dashboard/materi/baru">
              <button
                type="button"
                className="px-3.5 h-10.5 vt-btn-chrome rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Upload className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#F09A82]" />
                <span>Unggah Materi</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Determine the single highest-priority actionable focus item
  const liveSchedule = todaySchedules.find((s) => isScheduleLiveNow(s));
  const nearestTask = recentTasks[0];
  const taskDays = nearestTask?.deadline ? daysUntilDeadline(nearestTask.deadline) : null;
  const isUrgentTask =
    nearestTask &&
    ((taskDays !== null && taskDays <= 3) || nearestTask.priority === "tinggi");
  const activeModule = recentModules[0];
  const activeView = recentViews[0]?.material;

  const extraCount = Math.max(
    0,
    (recentTasks?.length || 0) + (todaySchedules?.length || 0) + (recentModules?.length || 0) - 1
  );

  let badgeLabel = "Prioritas Utama";
  let categoryLabel = "Fokus Belajar";
  let headline = "";
  let metadata = "";
  let progressPct: number | null = null;
  let ctaLabel = "Lanjutkan Belajar";
  let ctaHref = "/dashboard/modul";
  let secondaryHref = "/dashboard/modul";
  let IconComponent: React.ElementType = Layers;

  if (isUrgentTask) {
    const deadlineText =
      taskDays === null
        ? "Segera dikerjakan"
        : taskDays < 0
        ? "Melewati tenggat"
        : taskDays === 0
        ? "Tenggat hari ini"
        : `${taskDays} hari lagi`;

    badgeLabel = "Prioritas Utama";
    categoryLabel = nearestTask.subject || "Tugas";
    headline = nearestTask.title;
    metadata = `Batas waktu: ${deadlineText}`;
    ctaLabel = "Kerjakan Tugas";
    ctaHref = "/dashboard/tugas";
    secondaryHref = "/dashboard/tugas";
    IconComponent = Award;
  } else if (liveSchedule) {
    badgeLabel = "Sedang Berlangsung";
    categoryLabel = liveSchedule.subject || "Agenda";
    headline = liveSchedule.title;
    metadata = `${getScheduleTimeRange(liveSchedule)}${
      liveSchedule.location ? ` · ${liveSchedule.location}` : ""
    }`;
    ctaLabel = "Buka Jadwal";
    ctaHref = "/dashboard/jadwal";
    secondaryHref = "/dashboard/jadwal";
    IconComponent = Clock;
  } else if (activeModule) {
    const chapters = Array.isArray(activeModule.chapters) ? activeModule.chapters : [];
    const doneChapters = chapters.filter((c: any) => c.is_completed).length;
    progressPct =
      chapters.length > 0
        ? Math.round((doneChapters / chapters.length) * 100)
        : activeModule.progress || 0;

    badgeLabel = "Prioritas Utama";
    categoryLabel = activeModule.category?.name || (activeModule.kind === "project" ? "Proyek" : "Modul");
    headline = activeModule.title;
    metadata =
      chapters.length > 0
        ? `Progres ${progressPct}% (${doneChapters} dari ${chapters.length} bab selesai)`
        : `Progres belajar ${progressPct}%`;
    ctaLabel = "Lanjutkan Belajar";
    ctaHref = `/dashboard/modul?module=${activeModule.id}`;
    secondaryHref = "/dashboard/modul";
    IconComponent = Layers;
  } else if (nearestTask) {
    const deadlineText =
      taskDays === null
        ? "Terjadwal"
        : taskDays < 0
        ? "Melewati tenggat"
        : taskDays === 0
        ? "Hari ini"
        : `${taskDays} hari lagi`;

    badgeLabel = "Prioritas Utama";
    categoryLabel = nearestTask.subject || "Tugas";
    headline = nearestTask.title;
    metadata = `Batas waktu: ${deadlineText}`;
    ctaLabel = "Lihat Tugas";
    ctaHref = "/dashboard/tugas";
    secondaryHref = "/dashboard/tugas";
    IconComponent = Award;
  } else if (activeView) {
    badgeLabel = "Lanjutkan Bacaan";
    categoryLabel = activeView.category?.name || "Materi";
    headline = activeView.title;
    metadata = "Terakhir kali Anda buka";
    ctaLabel = "Buka Materi";
    ctaHref = `/dashboard/materi/${activeView.id}`;
    secondaryHref = "/dashboard/materi";
    IconComponent = BookOpen;
  } else {
    return null;
  }

  return (
    <div className="rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E6E0D6] dark:border-[#24201E] p-5 sm:p-6 shadow-2xs transition-colors font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5">
        <div className="flex items-stretch gap-3.5 sm:gap-4 min-w-0 flex-1">
          {/* Clean internal vertical accent bar (no curved outer border artifact) */}
          <div className="w-1 rounded-full bg-[#C2553A] dark:bg-[#D4664A] shrink-0" aria-hidden="true" />

          <div className="flex items-start gap-3.5 min-w-0 flex-1">
            <div className="w-11 h-11 rounded-xl bg-[#FAF3EF] dark:bg-[#D4664A]/15 text-[#C2553A] dark:text-[#F09A82] flex items-center justify-center shrink-0 mt-0.5">
              <IconComponent className="w-5 h-5" />
            </div>

            <div className="space-y-1.5 min-w-0 flex-1">
              {/* Calm Badges Row */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FAF3EF] dark:bg-[#D4664A]/15 text-[#C2553A] dark:text-[#F09A82] text-xs font-semibold">
                  {badgeLabel}
                </span>

                <span className="text-xs font-medium text-[#6B6560] dark:text-[#A8A29E] truncate">
                  {categoryLabel}
                </span>

                {extraCount > 0 && (
                  <Link
                    href={secondaryHref}
                    className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#F3EFE9] dark:bg-[#1C1917] text-[#5C554E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] text-xs font-medium transition-colors"
                  >
                    <span>+{extraCount} lainnya</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {/* Clean Module / Task Headline */}
              <h2 className="text-lg sm:text-[20px] font-bold text-[#1C1917] dark:text-[#F5F5F4] font-display leading-snug line-clamp-2">
                {headline}
              </h2>

              {/* Metadata & Subtle Progress Bar */}
              <div className="space-y-2 pt-0.5">
                <p className="text-xs sm:text-[13px] font-normal text-[#6B6560] dark:text-[#A8A29E] truncate">
                  {metadata}
                </p>

                {progressPct !== null && (
                  <div className="w-full max-w-sm h-1.5 rounded-full bg-[#F3EFE9] dark:bg-[#24201E] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#C2553A] dark:bg-[#D4664A] transition-all duration-300"
                      style={{ width: `${Math.max(4, progressPct)}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Single Primary Terracotta CTA */}
        <div className="flex items-center shrink-0 pl-4 md:pl-0">
          <Link href={ctaHref} className="w-full md:w-auto">
            <button
              type="button"
              className="w-full md:w-auto px-5 h-10.5 rounded-xl bg-[#C2553A] hover:bg-[#A34530] dark:bg-[#D4664A] dark:hover:bg-[#C2553A] text-[#FFFBF8] text-[13px] font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
