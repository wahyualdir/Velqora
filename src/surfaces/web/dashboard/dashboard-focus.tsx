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
      <div className="rounded-2xl border border-[#E4DDD4] dark:border-[#292524] border-l-4 border-l-[#C2553A] bg-[#FFFFFF] dark:bg-[#141210] p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-36 rounded-full" />
            <Skeleton className="h-6 w-2/3 rounded-md" />
            <Skeleton className="h-3.5 w-1/2 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  // 1. Brand new workspace onboarding banner
  if (isBrandNew) {
    return (
      <div className="rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] border-l-4 border-l-[#C2553A] dark:border-l-[#D4664A] p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-[#C2553A] dark:bg-[#D4664A] text-[#FFFBF8] flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-[#1C1917] dark:bg-[#F5F5F4] text-[#FAF8F5] dark:text-[#141210] text-[10px] font-extrabold font-mono uppercase tracking-wider">
                  PRIORITAS UTAMA
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F3EFE9] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] text-[#524B42] dark:text-[#A8A29E] text-[10.5px] font-semibold">
                  Mulai Ruang Belajar
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#1C1917] dark:text-[#F5F5F4] font-display leading-snug">
                Susun Modul Kuliah &amp; Jadwal Belajar Anda
              </h2>
              <p className="text-xs sm:text-[13px] text-[#5C554E] dark:text-[#A8A29E] leading-relaxed max-w-2xl">
                Tambahkan modul pertama, unggah catatan dosen, atau jadwalkan target kuliah agar portal harian terisi otomatis.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <Link href="/dashboard/modul/baru">
              <button
                type="button"
                className="px-4 h-11 rounded-xl bg-[#C2553A] hover:bg-[#A34530] dark:bg-[#D4664A] dark:hover:bg-[#C2553A] text-[#FFFBF8] text-xs sm:text-[13px] font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Modul Pertama</span>
              </button>
            </Link>
            <Link href="/dashboard/materi/baru">
              <button
                type="button"
                className="px-3.5 h-11 vt-btn-chrome rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Upload className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
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

  // Build priority banner view-model
  let badgeLabel = "PRIORITAS UTAMA";
  let headline = "";
  let metadata = "";
  let ctaLabel = "Mulai Sekarang";
  let ctaHref = "/dashboard/modul";
  let secondaryHref = "/dashboard/tugas";
  let IconComponent: React.ElementType = Award;

  if (isUrgentTask) {
    const deadlineText =
      taskDays === null
        ? "Segera dikerjakan"
        : taskDays < 0
        ? "Melewati tenggat"
        : taskDays === 0
        ? "Hari ini"
        : `${taskDays} hari lagi`;

    badgeLabel = "PRIORITAS UTAMA";
    headline = `Tugas Aktif: ${nearestTask.title}`;
    metadata = `${nearestTask.subject || "Tugas Mandiri"} • Batas waktu: ${deadlineText}`;
    ctaLabel = "Kerjakan Tugas";
    ctaHref = "/dashboard/tugas";
    secondaryHref = "/dashboard/tugas";
    IconComponent = Award;
  } else if (liveSchedule) {
    badgeLabel = "PRIORITAS UTAMA";
    headline = `Sesi Berlangsung: ${liveSchedule.title}`;
    metadata = `${liveSchedule.subject || "Kelas Terjadwal"} • ${getScheduleTimeRange(liveSchedule)}${
      liveSchedule.location ? ` • ${liveSchedule.location}` : ""
    }`;
    ctaLabel = "Buka Jadwal";
    ctaHref = "/dashboard/jadwal";
    secondaryHref = "/dashboard/jadwal";
    IconComponent = Clock;
  } else if (activeModule) {
    const chapters = Array.isArray(activeModule.chapters) ? activeModule.chapters : [];
    const doneChapters = chapters.filter((c: any) => c.is_completed).length;
    const progressPct =
      chapters.length > 0
        ? Math.round((doneChapters / chapters.length) * 100)
        : activeModule.progress || 0;

    headline = `${activeModule.kind === "project" ? "Proyek Aktif" : "Kurikulum Aktif"}: ${activeModule.title}`;
    metadata = `${activeModule.category?.name || "Umum"} • Progres ${progressPct}%${
      nearestTask ? ` • ${recentTasks.length} tugas menunggu` : ""
    }`;
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

    headline = `Tugas Terjadwal: ${nearestTask.title}`;
    metadata = `${nearestTask.subject || "Mata Kuliah"} • Sisa waktu / batas: ${deadlineText}`;
    ctaLabel = "Lihat Tugas";
    ctaHref = "/dashboard/tugas";
    secondaryHref = "/dashboard/tugas";
    IconComponent = Award;
  } else if (activeView) {
    headline = `Bacaan Terakhir: ${activeView.title}`;
    metadata = `${activeView.category?.name || "Materi Kuliah"} • Lanjutkan membaca dokumen terakhir`;
    ctaLabel = "Buka Materi";
    ctaHref = `/dashboard/materi/${activeView.id}`;
    secondaryHref = "/dashboard/materi";
    IconComponent = BookOpen;
  } else {
    return null;
  }

  return (
    <div className="rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] border-l-4 border-l-[#C2553A] dark:border-l-[#D4664A] p-5 sm:p-6 shadow-2xs transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5">
        <div className="flex items-start gap-3.5 sm:gap-4 min-w-0">
          {/* Terracotta 48x48 Focus Emblem Box */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#C2553A] dark:bg-[#D4664A] text-[#FFFBF8] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <IconComponent className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </div>

          <div className="space-y-1.5 min-w-0 flex-1">
            {/* Top Pills Row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#1C1917] dark:bg-[#F5F5F4] text-[#FAF8F5] dark:text-[#141210] text-[10px] font-extrabold font-mono uppercase tracking-wider">
                {badgeLabel}
              </span>

              {extraCount > 0 && (
                <Link
                  href={secondaryHref}
                  className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full bg-[#F3EFE9] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] text-[#524B42] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] text-[10.5px] font-bold transition-colors"
                >
                  <span>+{extraCount} lainnya</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              )}
            </div>

            {/* Priority Headline */}
            <h2 className="text-base sm:text-xl font-extrabold text-[#1C1917] dark:text-[#F5F5F4] font-display leading-snug line-clamp-2">
              {headline}
            </h2>

            {/* Sub-metadata Line */}
            <p className="text-xs sm:text-[13px] font-medium text-[#5C554E] dark:text-[#A8A29E] leading-relaxed line-clamp-1">
              {metadata}
            </p>
          </div>
        </div>

        {/* Right Primary Solid Terracotta CTA */}
        <div className="flex items-center shrink-0 pt-1 md:pt-0">
          <Link href={ctaHref} className="w-full md:w-auto">
            <button
              type="button"
              className="w-full md:w-auto px-5 h-11 rounded-xl bg-[#C2553A] hover:bg-[#A34530] dark:bg-[#D4664A] dark:hover:bg-[#C2553A] text-[#FFFBF8] text-xs sm:text-[13px] font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer whitespace-nowrap"
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
