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
  const [periodBadge, setPeriodBadge] = useState("TA 2026/2027 GANJIL");

  useEffect(() => {
    setPeriodBadge(getCurrentAcademicPeriod(new Date()).badgeText);
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

  // Urgent task alert check for hero banner
  const nearestTask = upcomingTasks[0] || null;
  const taskDays = nearestTask?.deadline ? daysUntilDeadline(nearestTask.deadline) : null;
  const isUrgentTask = taskDays !== null && taskDays <= 2;

  return (
    <div className="space-y-5 pb-8 animate-fade-in">
      {/* ─── 1. App Greeting & Period Header ─── */}
      <div className="px-1 pt-1 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-mono text-[#5C554E] dark:text-[#A8A29E] uppercase tracking-wider font-bold">
            {getGreeting()} • {todayLabel}
          </p>
          <h1 className="text-xl font-extrabold text-text-primary tracking-tight font-display truncate">
            {userName || "Pelajar Velqora"}
          </h1>
        </div>

        <Link
          href="/dashboard/jadwal"
          className="px-2.5 py-1 rounded-xl bg-[#C2553A] dark:bg-[#D4664A] text-[#FFFBF8] font-mono text-[10px] font-bold uppercase tracking-wider shrink-0 shadow-2xs"
        >
          {periodBadge}
        </Link>
      </div>

      {/* ─── 2. Continue Learning Hero Block (PRIORITAS UTAMA) ─── */}
      {loading ? (
        <Card padding="md" variant="subtle" className="space-y-3 border-l-4 border-l-[#C2553A]">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-6 w-3/4 rounded" />
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-9 w-full rounded-xl" />
        </Card>
      ) : isUrgentTask && nearestTask ? (
        <Card
          padding="md"
          className="space-y-3 border-l-4 border-l-[#C2553A] dark:border-l-[#D4664A] bg-surface"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#1C1917] dark:bg-[#F5F5F4] text-[#FAF8F5] dark:text-[#141210] font-mono uppercase tracking-wider">
              <Award className="w-3 h-3" />
              PRIORITAS UTAMA
            </span>
            <span className="text-[11px] text-[#C2553A] dark:text-[#D4664A] font-mono font-bold">
              {taskDays === 0 ? "Hari ini" : taskDays === 1 ? "Besok" : "Mendesak"}
            </span>
          </div>

          <div>
            <h2 className="text-base font-extrabold text-text-primary font-display line-clamp-2">
              {nearestTask.title}
            </h2>
            <p className="text-xs text-text-secondary mt-0.5 font-medium truncate">
              {nearestTask.subject || "Tugas Akademik"}
            </p>
          </div>

          <Link href="/dashboard/tugas" className="block pt-1">
            <Button className="w-full h-10 rounded-xl gap-2 font-bold text-xs shadow-2xs bg-[#C2553A] hover:bg-[#A34530] text-[#FFFBF8]">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Lanjutkan Belajar</span>
            </Button>
          </Link>
        </Card>
      ) : primaryModule ? (
        <Card
          padding="md"
          className="space-y-3 border-l-4 border-l-[#C2553A] dark:border-l-[#D4664A] bg-surface"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#1C1917] dark:bg-[#F5F5F4] text-[#FAF8F5] dark:text-[#141210] font-mono uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              PRIORITAS UTAMA
            </span>
            <span className="text-[11px] text-text-secondary font-mono font-semibold truncate">
              {primaryModule.category?.name || "Modul"}
            </span>
          </div>

          <div>
            <h2 className="text-base font-extrabold text-text-primary font-display line-clamp-1">
              {primaryModule.title}
            </h2>
            {primaryModule.description && (
              <p className="text-xs text-text-secondary line-clamp-2 mt-0.5 leading-snug font-normal">
                {primaryModule.description}
              </p>
            )}
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] text-text-secondary font-medium">
              <span>Progres pembelajaran</span>
              <span className="font-mono font-bold text-[#C2553A] dark:text-[#D4664A]">
                {primaryModule.level ? `${primaryModule.level}` : "Aktif"}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-secondary overflow-hidden border border-border/40">
              <div
                className="h-full bg-[#C2553A] dark:bg-[#D4664A] rounded-full"
                style={{ width: `${Math.max(15, primaryModule.progress || 50)}%` }}
              />
            </div>
          </div>

          <Link href={`/dashboard/modul?module=${primaryModule.id}`} className="block pt-1">
            <Button className="w-full h-10 rounded-xl gap-2 font-bold text-xs shadow-2xs bg-[#C2553A] hover:bg-[#A34530] text-[#FFFBF8]">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Lanjutkan Belajar</span>
            </Button>
          </Link>
        </Card>
      ) : (
        <Card
          padding="md"
          variant="subtle"
          className="text-center space-y-2.5 border-l-4 border-l-[#C2553A]"
        >
          <div className="w-10 h-10 rounded-xl bg-[#C2553A]/10 text-[#C2553A] dark:text-[#D4664A] flex items-center justify-center mx-auto">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-text-primary font-display">
            Lanjutkan Belajar di Velqora
          </h2>
          <p className="text-xs text-text-secondary max-w-xs mx-auto font-normal">
            Tambahkan modul atau jadwal perkuliahan pertama Anda.
          </p>
          <Link href="/dashboard/modul/baru" className="inline-block pt-1">
            <Button size="sm" className="text-xs rounded-xl bg-[#C2553A] text-[#FFFBF8]">
              Jelajahi Modul
            </Button>
          </Link>
        </Card>
      )}

      {/* ─── 3. Quick Academic Shortcuts (4 Icons, auto-rows-fr preserved) ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 auto-rows-fr">
        <Link
          href="/dashboard/playground"
          className="p-3 min-h-[76px] rounded-2xl border border-border bg-surface flex flex-col items-center justify-center text-center gap-1.5 hover:border-[#C2553A]/40 hover:bg-surface-secondary/40 active:scale-95 transition-all shadow-2xs h-full"
        >
          <div className="w-9 h-9 rounded-xl bg-[#C2553A]/10 text-[#C2553A] dark:text-[#D4664A] flex items-center justify-center shrink-0">
            <Code2 className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-text-primary leading-tight truncate w-full px-0.5">
            Lab Notebook
          </span>
        </Link>

        <Link
          href="/dashboard/kode"
          className="p-3 min-h-[76px] rounded-2xl border border-border bg-surface flex flex-col items-center justify-center text-center gap-1.5 hover:border-[#C2553A]/40 hover:bg-surface-secondary/40 active:scale-95 transition-all shadow-2xs h-full"
        >
          <div className="w-9 h-9 rounded-xl bg-[#C2553A]/10 text-[#C2553A] dark:text-[#D4664A] flex items-center justify-center shrink-0">
            <FileCode2 className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-text-primary leading-tight truncate w-full px-0.5">
            Katalog Kode
          </span>
        </Link>

        <Link
          href="/dashboard/modul"
          className="p-3 min-h-[76px] rounded-2xl border border-border bg-surface flex flex-col items-center justify-center text-center gap-1.5 hover:border-[#C2553A]/40 hover:bg-surface-secondary/40 active:scale-95 transition-all shadow-2xs h-full"
        >
          <div className="w-9 h-9 rounded-xl bg-[#C2553A]/10 text-[#C2553A] dark:text-[#D4664A] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-text-primary leading-tight truncate w-full px-0.5">
            Modul
          </span>
        </Link>

        <Link
          href="/dashboard/ai-tutor"
          className="p-3 min-h-[76px] rounded-2xl border border-border bg-surface flex flex-col items-center justify-center text-center gap-1.5 hover:border-[#C2553A]/40 hover:bg-surface-secondary/40 active:scale-95 transition-all shadow-2xs h-full"
        >
          <div className="w-9 h-9 rounded-xl bg-[#C2553A]/10 text-[#C2553A] dark:text-[#D4664A] flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-text-primary leading-tight truncate w-full px-0.5">
            AI Tutor
          </span>
        </Link>
      </div>

      {/* ─── 4. Today's Schedule Feed ─── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
            <span>Jadwal Hari Ini</span>
          </h3>
          <Link
            href="/dashboard/jadwal"
            className="text-[11px] font-bold text-[#C2553A] dark:text-[#D4664A] flex items-center gap-0.5 hover:underline"
          >
            <span>Kalender</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <Skeleton className="h-16 w-full rounded-2xl" />
        ) : todaySchedules.length > 0 ? (
          <Card padding="none" className="divide-y divide-border/60 overflow-hidden">
            {todaySchedules.map((sched) => {
              const live = isScheduleLiveNow(sched);
              return (
                <Link
                  key={sched.id}
                  href="/dashboard/jadwal"
                  className="flex items-center justify-between p-3.5 hover:bg-surface-secondary/50 transition-colors gap-3"
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-[11px] font-mono font-bold text-[#C2553A] dark:text-[#D4664A]">
                      {getScheduleTimeRange(sched)}
                    </p>
                    <p className="text-xs font-bold text-text-primary truncate">
                      {sched.title}
                    </p>
                  </div>
                  {live ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#C2553A] text-[#FFFBF8] text-[9.5px] font-extrabold font-mono uppercase shrink-0">
                      BERLANGSUNG
                    </span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-text-secondary shrink-0" />
                  )}
                </Link>
              );
            })}
          </Card>
        ) : (
          <Card padding="sm" variant="subtle" className="flex items-center justify-between gap-2">
            <span className="text-xs text-text-secondary">
              Belum ada sesi jadwal untuk hari {todayLabel}.
            </span>
            <Link
              href="/dashboard/jadwal"
              className="text-[11px] font-bold text-[#C2553A] dark:text-[#D4664A] shrink-0"
            >
              Atur →
            </Link>
          </Card>
        )}
      </div>

      {/* ─── 5. Upcoming Tasks Section ─── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
            <span>Tenggat Terdekat</span>
          </h3>
          <Link
            href="/dashboard/tugas"
            className="text-[11px] font-bold text-[#C2553A] dark:text-[#D4664A] flex items-center gap-0.5 hover:underline"
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
                className="flex items-center justify-between"
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
          <Card padding="none" className="divide-y divide-border/60 overflow-hidden">
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
                    <p className="text-xs font-bold text-text-primary truncate">
                      {task.title}
                    </p>
                    <p className="text-[11px] font-medium text-text-secondary truncate">
                      {task.subject || "Tugas Kuliah"}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {task.deadline && (
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono whitespace-nowrap shrink-0",
                          isOverdue
                            ? "bg-rose-500/15 text-rose-700 border border-rose-500/30 font-bold"
                            : isDueToday
                            ? "bg-[#C2553A]/15 text-[#C2553A] border border-[#C2553A]/30 font-bold"
                            : isDueTomorrow
                            ? "bg-amber-500/15 text-amber-800 border border-amber-500/30 font-bold"
                            : "bg-surface-secondary text-text-secondary border border-border/60 font-medium"
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
          <Card padding="md" variant="subtle" className="text-center">
            <p className="text-xs font-medium text-text-secondary">
              Tidak ada tugas yang mendesak.
            </p>
          </Card>
        )}
      </div>

      {/* ─── 6. Recent Activity List ─── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono">
            Aktivitas Terakhir
          </h3>
          <Link
            href="/dashboard/materi"
            className="text-[11px] font-bold text-[#C2553A] dark:text-[#D4664A] flex items-center gap-0.5 hover:underline"
          >
            <span>Materi</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentViews.length > 0 ? (
          <Card padding="none" className="divide-y divide-border/60 overflow-hidden">
            {recentViews.map((item) => {
              const mat = item.material || item;
              return (
                <Link
                  key={item.id}
                  href={item.url || `/dashboard/materi/${mat.id || item.id}`}
                  className="flex items-center justify-between p-3.5 hover:bg-surface-secondary/50 active:bg-surface-secondary/70 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-xl bg-[#C2553A]/10 text-[#C2553A] dark:text-[#D4664A] flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="text-xs font-bold text-text-primary truncate">
                        {mat.title || "Materi Pelajaran"}
                      </p>
                      <p className="text-[10.5px] font-medium text-text-secondary truncate">
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
          <Card padding="md" variant="subtle" className="text-center">
            <p className="text-xs font-medium text-text-secondary">
              Belum ada aktivitas baru.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
