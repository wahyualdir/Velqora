"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Play,
  BookOpen,
  Code2,
  Bot,
  FileCode2,
  ChevronRight,
  Layers,
  Sparkles,
  Calendar,
  Clock,
  Award,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, daysUntilDeadline } from "@/lib/utils";
import type { DashboardStatsData } from "@/surfaces/web/dashboard/dashboard-utils";
import {
  getCurrentAcademicPeriod,
  getIndonesianDayName,
  getScheduleTimeRange,
  isScheduleLiveNow,
} from "@/surfaces/web/dashboard/dashboard-utils";

interface MobileDashboardViewProps {
  userName: string;
  stats: DashboardStatsData;
  loading: boolean;
  onRefresh: () => void;
}

export function MobileDashboardView({
  userName,
  stats,
  loading,
}: MobileDashboardViewProps) {
  const [shortPeriod, setShortPeriod] = useState("Hari Ini");

  useEffect(() => {
    setShortPeriod(getCurrentAcademicPeriod(new Date()).shortPeriod);
  }, []);

  const primaryModule = stats.recentModules?.[0] || null;
  const upcomingTasks = (stats.recentTasks || []).slice(0, 3);
  const todaySchedules = (stats.todaySchedules || []).slice(0, 3);
  const recentViews = (stats.recentViews || []).slice(0, 4);
  const todayLabel = getIndonesianDayName(new Date());

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return "Selamat pagi";
    if (hour < 15) return "Selamat siang";
    if (hour < 18) return "Selamat sore";
    return "Selamat malam";
  };

  const nearestTask = upcomingTasks[0] || null;
  const taskDays = nearestTask?.deadline ? daysUntilDeadline(nearestTask.deadline) : null;
  const isUrgentTask = taskDays !== null && taskDays <= 2;

  return (
    <div className="space-y-5 pb-8 animate-fade-in font-sans">
      {/* ─── 1. Calm App Greeting & Period Header ─── */}
      <div className="px-1 pt-1 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-text-secondary font-medium">
            {getGreeting()} · {todayLabel}
          </p>
          <h1 className="text-xl font-bold text-text-primary tracking-tight font-display truncate">
            {userName || "Velqora Workspace"}
          </h1>
        </div>

        <Link
          href="/dashboard/jadwal"
          className="px-3 py-1 rounded-full bg-[#FAF3EF] dark:bg-[#D4664A]/15 text-[#C2553A] dark:text-[#F09A82] text-[11px] font-semibold shrink-0"
        >
          {shortPeriod}
        </Link>
      </div>

      {/* ─── 2. Continue Learning Hero Card (Clean internal accent bar, zero heavy gradient) ─── */}
      {loading ? (
        <Card padding="md" variant="subtle" className="space-y-3 rounded-2xl">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-6 w-3/4 rounded" />
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </Card>
      ) : isUrgentTask && nearestTask ? (
        <Card padding="md" className="space-y-3 rounded-2xl bg-surface">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FAF3EF] dark:bg-[#D4664A]/15 text-[#C2553A] dark:text-[#F09A82]">
              <Award className="w-3.5 h-3.5" />
              <span>Prioritas Utama</span>
            </span>
            <span className="text-xs text-[#C2553A] dark:text-[#F09A82] font-semibold">
              {taskDays === 0 ? "Hari ini" : taskDays === 1 ? "Besok" : "Mendesak"}
            </span>
          </div>

          <div>
            <h2 className="text-base font-bold text-text-primary font-display line-clamp-2 leading-snug">
              {nearestTask.title}
            </h2>
            <p className="text-xs text-text-secondary mt-0.5 truncate">
              {nearestTask.subject || "Tugas Belajar"}
            </p>
          </div>

          <Link href="/dashboard/tugas" className="block pt-1">
            <Button className="w-full h-11 rounded-xl gap-2 font-semibold text-[13px] shadow-xs bg-[#C2553A] hover:bg-[#A34530] text-[#FFFBF8]">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Lanjutkan Belajar</span>
            </Button>
          </Link>
        </Card>
      ) : primaryModule ? (
        <Card padding="md" className="space-y-3 rounded-2xl bg-surface">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FAF3EF] dark:bg-[#D4664A]/15 text-[#C2553A] dark:text-[#F09A82]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lanjutkan Belajar</span>
            </span>
            <span className="text-xs text-text-secondary font-medium truncate">
              {primaryModule.category?.name || "Modul"}
            </span>
          </div>

          <div>
            <h2 className="text-base font-bold text-text-primary font-display line-clamp-2 leading-snug">
              {primaryModule.title}
            </h2>
            {primaryModule.description && (
              <p className="text-xs text-text-secondary line-clamp-2 mt-1 leading-relaxed">
                {primaryModule.description}
              </p>
            )}
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs text-text-secondary font-medium">
              <span>Progres pembelajaran</span>
              <span className="font-semibold text-[#C2553A] dark:text-[#F09A82] tabular-nums">
                {primaryModule.progress || 0}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-secondary overflow-hidden">
              <div
                className="h-full bg-[#C2553A] dark:bg-[#D4664A] rounded-full"
                style={{ width: `${Math.max(4, primaryModule.progress || 0)}%` }}
              />
            </div>
          </div>

          <Link href={`/dashboard/modul?module=${primaryModule.id}`} className="block pt-1">
            <Button className="w-full h-11 rounded-xl gap-2 font-semibold text-[13px] shadow-xs bg-[#C2553A] hover:bg-[#A34530] text-[#FFFBF8]">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Lanjutkan Belajar</span>
            </Button>
          </Link>
        </Card>
      ) : (
        <Card padding="md" variant="subtle" className="text-center space-y-2.5 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-[#C2553A]/10 text-[#C2553A] dark:text-[#F09A82] flex items-center justify-center mx-auto">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-text-primary font-display">
            Lanjutkan Belajar di Velqora
          </h2>
          <p className="text-xs text-text-secondary max-w-xs mx-auto">
            Tambahkan modul atau jadwal belajar pertama Anda.
          </p>
          <Link href="/dashboard/modul/baru" className="inline-block pt-1">
            <Button size="sm" className="text-xs rounded-xl bg-[#C2553A] text-[#FFFBF8]">
              Jelajahi Modul
            </Button>
          </Link>
        </Card>
      )}

      {/* ─── 3. Quick Shortcuts Grid (4 Icons, auto-rows-fr preserved) ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 auto-rows-fr">
        <Link
          href="/dashboard/playground"
          className="p-3 min-h-[76px] rounded-2xl border border-border bg-surface flex flex-col items-center justify-center text-center gap-1.5 hover:border-[#C2553A]/40 active:scale-95 transition-all shadow-2xs h-full"
        >
          <div className="w-9 h-9 rounded-xl bg-[#C2553A]/10 text-[#C2553A] dark:text-[#F09A82] flex items-center justify-center shrink-0">
            <Code2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-text-primary leading-tight truncate w-full px-0.5">
            Lab Notebook
          </span>
        </Link>

        <Link
          href="/dashboard/kode"
          className="p-3 min-h-[76px] rounded-2xl border border-border bg-surface flex flex-col items-center justify-center text-center gap-1.5 hover:border-[#C2553A]/40 active:scale-95 transition-all shadow-2xs h-full"
        >
          <div className="w-9 h-9 rounded-xl bg-[#C2553A]/10 text-[#C2553A] dark:text-[#F09A82] flex items-center justify-center shrink-0">
            <FileCode2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-text-primary leading-tight truncate w-full px-0.5">
            Katalog Kode
          </span>
        </Link>

        <Link
          href="/dashboard/modul"
          className="p-3 min-h-[76px] rounded-2xl border border-border bg-surface flex flex-col items-center justify-center text-center gap-1.5 hover:border-[#C2553A]/40 active:scale-95 transition-all shadow-2xs h-full"
        >
          <div className="w-9 h-9 rounded-xl bg-[#C2553A]/10 text-[#C2553A] dark:text-[#F09A82] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-text-primary leading-tight truncate w-full px-0.5">
            Modul
          </span>
        </Link>

        <Link
          href="/dashboard/ai-tutor"
          className="p-3 min-h-[76px] rounded-2xl border border-border bg-surface flex flex-col items-center justify-center text-center gap-1.5 hover:border-[#C2553A]/40 active:scale-95 transition-all shadow-2xs h-full"
        >
          <div className="w-9 h-9 rounded-xl bg-[#C2553A]/10 text-[#C2553A] dark:text-[#F09A82] flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-text-primary leading-tight truncate w-full px-0.5">
            AI Tutor
          </span>
        </Link>
      </div>

      {/* ─── 4. Today's Schedule Feed ─── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#F09A82]" />
            <span>Jadwal Hari Ini</span>
          </h3>
          <Link
            href="/dashboard/jadwal"
            className="text-xs font-semibold text-[#C2553A] dark:text-[#F09A82] flex items-center gap-0.5 hover:underline"
          >
            <span>Kalender</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <Skeleton className="h-16 w-full rounded-2xl" />
        ) : todaySchedules.length > 0 ? (
          <Card padding="none" className="divide-y divide-border/60 overflow-hidden rounded-2xl">
            {todaySchedules.map((sched) => {
              const live = isScheduleLiveNow(sched);
              return (
                <Link
                  key={sched.id}
                  href="/dashboard/jadwal"
                  className="flex items-center justify-between p-3.5 hover:bg-surface-secondary/50 transition-colors gap-3"
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-xs font-mono font-medium text-[#C2553A] dark:text-[#F09A82]">
                      {getScheduleTimeRange(sched)}
                    </p>
                    <p className="text-xs font-semibold text-text-primary truncate">
                      {sched.title}
                    </p>
                  </div>
                  {live ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#C2553A]/12 text-[#C2553A] dark:text-[#F09A82] text-[11px] font-semibold shrink-0">
                      Berlangsung
                    </span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-text-secondary shrink-0" />
                  )}
                </Link>
              );
            })}
          </Card>
        ) : (
          <Card padding="sm" variant="subtle" className="flex items-center justify-between gap-2 rounded-2xl">
            <span className="text-xs text-text-secondary">
              Belum ada sesi jadwal untuk hari {todayLabel}.
            </span>
            <Link
              href="/dashboard/jadwal"
              className="text-xs font-semibold text-[#C2553A] dark:text-[#F09A82] shrink-0"
            >
              Atur →
            </Link>
          </Card>
        )}
      </div>

      {/* ─── 5. Upcoming Tasks Section ─── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#F09A82]" />
            <span>Tenggat Terdekat</span>
          </h3>
          <Link
            href="/dashboard/tugas"
            className="text-xs font-semibold text-[#C2553A] dark:text-[#F09A82] flex items-center gap-0.5 hover:underline"
          >
            <span>Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <Card
                key={i}
                padding="sm"
                className="flex items-center justify-between rounded-2xl"
              >
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
                <Skeleton className="h-5 w-16 rounded" />
              </Card>
            ))}
          </div>
        ) : upcomingTasks.length > 0 ? (
          <Card padding="none" className="divide-y divide-border/60 overflow-hidden rounded-2xl">
            {upcomingTasks.map((task) => {
              const daysLeft = task.deadline
                ? daysUntilDeadline(task.deadline)
                : null;
              const isOverdue = daysLeft !== null && daysLeft < 0;
              const isDueTomorrow = daysLeft === 1;
              const isDueToday = daysLeft === 0;

              return (
                <Link
                  key={task.id}
                  href="/dashboard/tugas"
                  className="flex items-center justify-between p-3.5 hover:bg-surface-secondary/50 active:bg-surface-secondary/70 transition-colors gap-3"
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-xs font-semibold text-text-primary truncate">
                      {task.title}
                    </p>
                    <p className="text-[11px] text-text-secondary truncate">
                      {task.subject || "Tugas Belajar"}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {task.deadline && (
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap shrink-0",
                          isOverdue
                            ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 font-semibold"
                            : isDueToday
                            ? "bg-[#C2553A]/15 text-[#C2553A] dark:text-[#F09A82] font-semibold"
                            : isDueTomorrow
                            ? "bg-amber-500/15 text-amber-800 dark:text-amber-300 font-semibold"
                            : "bg-surface-secondary text-text-secondary"
                        )}
                      >
                        {isOverdue
                          ? "Terlambat"
                          : isDueToday
                          ? "Hari ini"
                          : isDueTomorrow
                          ? "Besok"
                          : `${daysLeft} hari lagi`}
                      </span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-text-secondary" />
                  </div>
                </Link>
              );
            })}
          </Card>
        ) : (
          <Card padding="sm" variant="subtle" className="text-center rounded-2xl">
            <p className="text-xs font-medium text-text-secondary">
              Tidak ada tugas yang mendesak.
            </p>
          </Card>
        )}
      </div>

      {/* ─── 6. Recent Activity List ─── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-text-primary">
            Aktivitas Terakhir
          </h3>
          <Link
            href="/dashboard/materi"
            className="text-xs font-semibold text-[#C2553A] dark:text-[#F09A82] flex items-center gap-0.5 hover:underline"
          >
            <span>Materi</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentViews.length > 0 ? (
          <Card padding="none" className="divide-y divide-border/60 overflow-hidden rounded-2xl">
            {recentViews.map((item) => {
              const mat = item.material || item;
              return (
                <Link
                  key={item.id}
                  href={item.url || `/dashboard/materi/${mat.id || item.id}`}
                  className="flex items-center justify-between p-3.5 hover:bg-surface-secondary/50 active:bg-surface-secondary/70 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-xl bg-[#C2553A]/10 text-[#C2553A] dark:text-[#F09A82] flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="text-xs font-semibold text-text-primary truncate">
                        {mat.title || "Materi Pelajaran"}
                      </p>
                      <p className="text-[11px] text-text-secondary truncate">
                        {mat.category?.name || item.subtitle || "Materi Pembelajaran"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-text-secondary shrink-0" />
                </Link>
              );
            })}
          </Card>
        ) : (
          <Card padding="sm" variant="subtle" className="text-center rounded-2xl">
            <p className="text-xs font-medium text-text-secondary">
              Belum ada aktivitas baru.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
