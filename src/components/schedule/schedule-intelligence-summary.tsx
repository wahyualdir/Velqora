"use client";

import Link from "next/link";
import {
  Sparkles,
  Clock,
  BookOpen,
  Calendar,
  AlertTriangle,
  Flame,
  CheckCircle2,
  CalendarCheck,
  ChevronRight,
  Info,
  Sliders,
  Scale,
  ShieldAlert,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScheduleIntelligenceContext, WorkloadLevel } from "@/lib/schedule-intelligence/types";
import { ScheduleDay } from "@/types";

interface ScheduleIntelligenceSummaryProps {
  context: ScheduleIntelligenceContext | null;
  selectedDay: string;
  onOpenDailyPlan: () => void;
  onOpenWeeklyPlan: () => void;
  onOpenPreferences?: () => void;
  onOpenOptimization?: () => void;
  onOpenRealism?: () => void;
  onSelectDayFilter?: (day: string) => void;
}

const LEVEL_CONFIG: Record<
  WorkloadLevel,
  { label: string; badgeVariant: "success" | "neutral" | "warning" | "danger"; colorClass: string }
> = {
  RINGAN: { label: "Beban Ringan", badgeVariant: "success", colorClass: "text-emerald-500" },
  NORMAL: { label: "Beban Optimal", badgeVariant: "neutral", colorClass: "text-sky-500" },
  PADAT: { label: "Beban Padat", badgeVariant: "warning", colorClass: "text-amber-500" },
  SANGAT_PADAT: { label: "Sangat Padat", badgeVariant: "danger", colorClass: "text-rose-500" },
};

export function ScheduleIntelligenceSummary({
  context,
  selectedDay,
  onOpenDailyPlan,
  onOpenWeeklyPlan,
  onOpenPreferences,
  onOpenOptimization,
  onOpenRealism,
}: ScheduleIntelligenceSummaryProps) {
  if (!context) {
    return null;
  }

  const { workload, deadlines } = context;
  const currentDayKey = (selectedDay !== "Semua" ? selectedDay : "Senin") as ScheduleDay;
  const dayBreakdown = workload.dailyBreakdown[currentDayKey] || workload.dailyBreakdown["Senin"];

  const levelInfo = LEVEL_CONFIG[dayBreakdown.level] || LEVEL_CONFIG.NORMAL;
  const urgentDeadlines = deadlines.filter((d) => d.urgency === "CRITICAL" || d.urgency === "URGENT");

  return (
    <section className="rounded-2xl border border-border/80 bg-surface/70 backdrop-blur-md p-4 sm:p-5 space-y-4 shadow-2xs">
      {/* Header with Title & Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-text-primary">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>Asisten Jadwal & Optimasi Cerdas</span>
            </span>
            <Badge variant={levelInfo.badgeVariant} size="sm" isMono>
              {levelInfo.label} ({dayBreakdown.totalHours} Jam)
            </Badge>
          </div>
          <p className="text-[11px] text-text-tertiary">
            Analisis beban harian, jeda istirahat bebas bentrok, gaya belajar, dan optimasi mingguan.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Link href="/dashboard/jadwal/intelligence">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 border-brand-500/30 hover:bg-brand-500/10 h-8 px-2.5 shadow-2xs"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Intelligence Center</span>
            </Button>
          </Link>

          {onOpenPreferences && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onOpenPreferences}
              className="gap-1.5 text-xs text-text-secondary hover:text-text-primary h-8 px-2.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Preferensi</span>
            </Button>
          )}

          {onOpenOptimization && (
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenOptimization}
              className="gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 border-brand-500/30 hover:bg-brand-500/10 h-8 px-2.5 shadow-2xs"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Optimasi Mingguan</span>
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={onOpenDailyPlan}
            className="gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 border-brand-500/30 hover:bg-brand-500/10 h-8 px-2.5 shadow-2xs"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Susun Hari</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onOpenWeeklyPlan}
            className="gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 border-brand-500/30 hover:bg-brand-500/10 h-8 px-2.5 shadow-2xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Susun Minggu</span>
          </Button>
        </div>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Metric 1: Kuliah */}
        <div className="p-3 rounded-xl bg-surface-secondary/50 border border-border/60 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-text-tertiary">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-brand-500" /> Kuliah
            </span>
          </div>
          <div className="text-base sm:text-lg font-bold text-text-primary font-mono">
            {parseFloat((dayBreakdown.lecturesMinutes / 60).toFixed(1))} <span className="text-xs font-sans font-normal text-text-tertiary">Jam</span>
          </div>
          <p className="text-[10px] text-text-tertiary truncate">
            {dayBreakdown.activities.filter((a) => a.category === "kuliah").length} mata kuliah
          </p>
        </div>

        {/* Metric 2: Belajar Mandiri */}
        <div className="p-3 rounded-xl bg-surface-secondary/50 border border-border/60 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-text-tertiary">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand-500" /> Belajar
            </span>
          </div>
          <div className="text-base sm:text-lg font-bold text-text-primary font-mono">
            {parseFloat((dayBreakdown.studyMinutes / 60).toFixed(1))} <span className="text-xs font-sans font-normal text-text-tertiary">Jam</span>
          </div>
          <p className="text-[10px] text-text-tertiary truncate">
            {dayBreakdown.activities.filter((a) => a.category === "belajar").length} sesi terencana
          </p>
        </div>

        {/* Metric 3: Deadline Kritis */}
        <div className="p-3 rounded-xl bg-surface-secondary/50 border border-border/60 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-text-tertiary">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" /> Deadline
            </span>
          </div>
          <div className="text-base sm:text-lg font-bold text-rose-500 font-mono">
            {urgentDeadlines.length} <span className="text-xs font-sans font-normal text-text-tertiary">Tugas</span>
          </div>
          <p className="text-[10px] text-text-tertiary truncate">
            {urgentDeadlines.length > 0 ? "Perlu segera dikerjakan" : "Tidak ada tenggat mendesak"}
          </p>
        </div>

        {/* Metric 4: Total Beban Mingguan */}
        <div className="p-3 rounded-xl bg-surface-secondary/50 border border-border/60 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-text-tertiary">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-brand-500" /> Mingguan
            </span>
          </div>
          <div className="text-base sm:text-lg font-bold text-text-primary font-mono">
            {workload.totalWeeklyHours} <span className="text-xs font-sans font-normal text-text-tertiary">Jam</span>
          </div>
          <p className="text-[10px] text-text-tertiary truncate">
            Rata-rata {workload.averageDailyHours} jam/hari
          </p>
        </div>
      </div>

      {/* Urgent Task Warning Banner if any */}
      {urgentDeadlines.length > 0 && (
        <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-700 dark:text-amber-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="truncate">
              Tenggat Terdekat: <strong>{urgentDeadlines[0].title}</strong> ({urgentDeadlines[0].urgencyExplanation})
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenDailyPlan}
            className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <span>Jadwalkan Sesi</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </section>
  );
}
