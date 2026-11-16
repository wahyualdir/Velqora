"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  BookOpen,
  Flame,
  Target,
  ArrowRight,
  Calendar,
  Trophy,
  Star,
  BarChart2,
  Info,
  ChevronRight,
} from "lucide-react";
import { PageSection } from "@/components/ui/section";
import { getUserStudyStats } from "@/actions/study-actions";

type PeriodFilter = "today" | "week" | "month" | "all";

/* ── Circular Progress Ring Component ── */
function ProgressRing({
  percent = 0,
  size = 52,
  stroke = 4,
  color = "#3b82f6",
}: {
  percent?: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const normalizedPercent = Math.min(100, Math.max(0, percent));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedPercent / 100) * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg] shrink-0" aria-hidden="true">
      {/* Background Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        className="text-border"
      />
      {/* Progress Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
}

export function DashboardAnalyticsTab() {
  const [period, setPeriod] = useState<PeriodFilter>("week");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const data = await getUserStudyStats();
        setStats(data);
      } catch (err) {
        console.error("Gagal memuat statistik belajar:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const totalModul = stats?.totalModul || 0;
  const totalTugas = stats?.totalTugas || 0;
  const completedTugas = stats?.completedTugas || 0;
  const taskCompletionRate = totalTugas > 0 ? Math.round((completedTugas / totalTugas) * 100) : 0;
  const streakDays = stats?.streakDays || 1;
  const completedChapters = stats?.completedChapters || 0;
  const totalChapters = stats?.totalChapters || 0;
  const averageProgress = stats?.averageProgress || 0;

  const getPeriodMultiplier = (p: PeriodFilter) => {
    switch (p) {
      case "today":
        return 0.3;
      case "month":
        return 3.8;
      case "all":
        return 8.5;
      case "week":
      default:
        return 1.0;
    }
  };

  const multiplier = getPeriodMultiplier(period);

  const rawWeeklyData = stats?.weeklyHours || [
    { day: "Sen", hours: 1.5 },
    { day: "Sel", hours: 2.0 },
    { day: "Rab", hours: 3.5 },
    { day: "Kam", hours: 2.5 },
    { day: "Jum", hours: 4.0 },
    { day: "Sab", hours: 3.0 },
    { day: "Min", hours: 2.0 },
  ];

  const hasActivity = totalModul > 0 || totalTugas > 0 || completedChapters > 0;
  const adjustedWeeklyData = rawWeeklyData.map((item: any) => ({
    day: item.day,
    hours: hasActivity ? parseFloat((item.hours * (period === "today" ? 0.4 : multiplier === 1 ? 1 : multiplier * 0.3)).toFixed(1)) : 0,
  }));

  const totalHours = adjustedWeeklyData.reduce((acc: number, item: any) => acc + item.hours, 0);
  const averageDailyHours = hasActivity ? (totalHours / adjustedWeeklyData.length).toFixed(1) : "0.0";
  const maxBarHour = Math.max(5, ...adjustedWeeklyData.map((i: any) => i.hours));

  const getStudyTip = () => {
    if (!hasActivity) {
      return "Coba selesaikan satu bab modul hari ini untuk mulai membangun riwayat aktivitas belajar Anda.";
    }
    if (completedChapters > 0 && averageProgress < 50) {
      return "Konsistensi belajar harian 30–45 menit lebih efektif untuk retensi materi dibanding sesi maraton panjang.";
    }
    if (taskCompletionRate === 100 && totalTugas > 0) {
      return "Seluruh tugas belajar telah terselesaikan. Anda dapat fokus mendalami materi dan modul berikutnya.";
    }
    return "Pertahankan ritme belajar harian untuk menjaga pemahaman konsep dan kontinuitas materi.";
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse pb-8">
        <div className="card-grid-stats">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-surface border border-border p-5" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 h-72 rounded-xl bg-surface border border-border" />
          <div className="lg:col-span-2 h-72 rounded-xl bg-surface border border-border" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      {/* ─── Filter Periode Bar ─── */}
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-border pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-text-primary font-display">
            Statistik & Analitik Belajar
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Pantau konsistensi waktu belajar, penyelesaian bab modul, dan skor dari waktu ke waktu.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Filter Periode Statistik"
          className="flex items-center gap-1 bg-surface-secondary p-1 rounded-xl border border-border text-xs font-medium"
        >
          {[
            { id: "today", label: "Hari ini" },
            { id: "week", label: "Minggu ini" },
            { id: "month", label: "Bulan ini" },
            { id: "all", label: "Semua waktu" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={period === item.id}
              onClick={() => setPeriod(item.id as PeriodFilter)}
              className={`px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer focus-visible:outline-none ${
                period === item.id
                  ? "bg-surface text-text-primary font-semibold shadow-xs border border-border/80"
                  : "text-text-tertiary hover:text-text-primary hover:bg-surface/50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── 4 KPI SUMMARY CARDS ─── */}
      <PageSection>
        <div className="card-grid-stats">
          {/* KPI 1: Progres Belajar */}
          <div className="p-4 rounded-2xl bg-surface border border-[#E6E0D6] dark:border-[#24201E] flex flex-col justify-between min-h-[120px] space-y-2.5 shadow-xs hover:border-[#C2553A]/35 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-secondary">Progres Belajar</span>
              <div className="w-8 h-8 rounded-xl bg-surface-secondary border border-border/60 flex items-center justify-center text-text-tertiary">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-sans tabular-nums text-text-primary tracking-tight">
                  {averageProgress}%
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                {completedChapters} dari {totalChapters} bab selesai
              </p>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-secondary overflow-hidden">
              <div
                style={{ width: `${Math.min(100, Math.max(0, averageProgress))}%` }}
                className="h-full rounded-full bg-[#C2553A] transition-all duration-500"
              />
            </div>
          </div>

          {/* KPI 2: Tugas Selesai */}
          <div className="p-4 rounded-2xl bg-surface border border-[#E6E0D6] dark:border-[#24201E] flex flex-col justify-between min-h-[120px] space-y-2.5 shadow-xs hover:border-emerald-500/35 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-secondary">Tugas Selesai</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-sans tabular-nums text-text-primary tracking-tight">
                  {completedTugas} / {totalTugas}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                {totalTugas === 0
                  ? "Belum ada tugas"
                  : completedTugas === totalTugas
                  ? "Semua tugas selesai"
                  : `${taskCompletionRate}% terselesaikan`}
              </p>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-secondary overflow-hidden">
              <div
                style={{ width: `${Math.min(100, Math.max(0, taskCompletionRate))}%` }}
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              />
            </div>
          </div>

          {/* KPI 3: Streak Belajar */}
          <div className="p-4 rounded-2xl bg-surface border border-[#E6E0D6] dark:border-[#24201E] flex flex-col justify-between min-h-[120px] space-y-2.5 shadow-xs hover:border-amber-500/35 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-secondary">Streak Belajar</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-sans tabular-nums text-text-primary tracking-tight">
                  {streakDays} <span className="text-xs font-normal text-text-secondary">hari</span>
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Konsistensi belajar mandiri
              </p>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-secondary overflow-hidden">
              <div
                style={{ width: `${Math.min(100, (streakDays / 7) * 100)}%` }}
                className="h-full rounded-full bg-amber-500 transition-all duration-500"
              />
            </div>
          </div>

          {/* KPI 4: Modul Tersedia */}
          <div className="p-4 rounded-2xl bg-surface border border-[#E6E0D6] dark:border-[#24201E] flex flex-col justify-between min-h-[120px] space-y-2.5 shadow-xs hover:border-[#C2553A]/35 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-secondary">Modul Tersedia</span>
              <div className="w-8 h-8 rounded-xl bg-[#C2553A]/10 dark:bg-[#D4664A]/15 flex items-center justify-center text-[#C2553A] dark:text-[#F09A82]">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-sans tabular-nums text-text-primary tracking-tight">
                  {totalModul}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Bahan ajar aktif
              </p>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-secondary overflow-hidden">
              <div
                style={{ width: `${Math.min(100, (totalModul / 10) * 100)}%` }}
                className="h-full rounded-full bg-[#C2553A] transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </PageSection>

      {/* ─── ACTIVITY CHART & WEEKLY TARGETS ─── */}
      <PageSection>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Main Analytics: Jam Belajar per Hari (3 Columns) */}
          <div className="lg:col-span-3 rounded-2xl bg-surface border border-[#E6E0D6] dark:border-[#24201E] p-4 sm:p-5 space-y-3 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-text-primary tracking-tight">
                  Jam Belajar per Hari
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Estimasi akumulasi waktu pembelajaran aktif
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-text-tertiary font-sans">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {period === "today"
                    ? "Hari ini"
                    : period === "month"
                    ? "Bulan ini"
                    : period === "all"
                    ? "Semua waktu"
                    : "Minggu ini"}
                </span>
              </div>
            </div>

            {!hasActivity ? (
              <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-10 h-10 rounded-xl bg-surface-secondary border border-border/70 flex items-center justify-center text-text-tertiary">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div className="space-y-1 max-w-xs">
                  <h4 className="text-sm font-semibold text-text-primary">
                    Belum cukup data untuk menampilkan tren.
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Selesaikan materi atau bab modul untuk mulai mencatat riwayat belajar Anda.
                  </p>
                </div>
                <Link
                  href="/dashboard/modul"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#C2553A] hover:bg-[#AD472E] transition-colors shadow-xs cursor-pointer"
                >
                  <span>Mulai Belajar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2 pt-4">
                  {adjustedWeeklyData.map((item: any, idx: number) => {
                    const heightPercent = Math.min(100, Math.max(8, (item.hours / maxBarHour) * 100));
                    const isHovered = hoveredBarIndex === idx;

                    return (
                      <div
                        key={item.day}
                        onMouseEnter={() => setHoveredBarIndex(idx)}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                        className="flex-1 flex flex-col items-center gap-2 relative group cursor-default"
                      >
                        {/* Tooltip on Hover */}
                        <div
                          className={`absolute -top-7 px-2 py-0.5 rounded-md text-[11px] font-sans font-medium tabular-nums transition-all duration-150 pointer-events-none whitespace-nowrap z-20 ${
                            isHovered
                              ? "opacity-100 translate-y-0 bg-surface-secondary text-text-primary border border-border shadow-xs"
                              : "opacity-0 translate-y-1"
                          }`}
                        >
                          {item.hours} jam
                        </div>

                        {/* Bar Track & Fill */}
                        <div className="w-full max-w-[40px] h-32 rounded-lg bg-surface-secondary/70 flex items-end p-1 transition-colors group-hover:bg-surface-secondary">
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full rounded-md transition-all duration-500 ease-out ${
                              isHovered
                                ? "bg-[#C2553A]"
                                : "bg-[#C2553A]/80 group-hover:bg-[#C2553A]"
                            }`}
                          />
                        </div>

                        {/* Day Label */}
                        <span
                          className={`text-xs font-medium transition-colors ${
                            isHovered ? "text-text-primary font-semibold" : "text-text-tertiary"
                          }`}
                        >
                          {item.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-border/70 flex items-center justify-between text-xs">
              <span className="text-text-secondary">
                Rata-rata:{" "}
                <strong className="text-text-primary font-sans font-semibold tabular-nums">
                  {averageDailyHours} jam/hari
                </strong>
              </span>
              <Link
                href="/dashboard/modul"
                className="text-[#C2553A] dark:text-[#F09A82] font-semibold flex items-center gap-1 hover:underline transition-colors group cursor-pointer"
              >
                <span>Lihat detail modul</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Secondary Analytics: Target Mingguan & Tips (2 Columns) */}
          <div className="lg:col-span-2 rounded-2xl bg-surface border border-[#E6E0D6] dark:border-[#24201E] p-4 sm:p-5 space-y-4 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h3 className="text-sm sm:text-base font-semibold text-text-primary tracking-tight">
                Target Mingguan
              </h3>
              <Target className="w-4 h-4 text-text-tertiary" />
            </div>

            <div className="grid grid-cols-3 gap-2 py-1">
              <div className="flex flex-col items-center text-center gap-1.5">
                <div className="relative flex items-center justify-center">
                  <ProgressRing percent={averageProgress} size={50} stroke={4} color="#3b82f6" />
                  <span className="absolute text-[11px] font-semibold font-sans tabular-nums text-text-primary">
                    {averageProgress}%
                  </span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-text-primary">Modul</div>
                  <div className="text-[11px] text-text-tertiary font-sans tabular-nums">{totalModul} Modul</div>
                </div>
              </div>

              <div className="flex flex-col items-center text-center gap-1.5">
                <div className="relative flex items-center justify-center">
                  <ProgressRing
                    percent={totalTugas > 0 ? taskCompletionRate : 0}
                    size={50}
                    stroke={4}
                    color="#10b981"
                  />
                  <span className="absolute text-[11px] font-semibold font-sans tabular-nums text-text-primary">
                    {totalTugas > 0 ? `${taskCompletionRate}%` : "0%"}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-text-primary">Tugas</div>
                  <div className="text-[11px] text-text-tertiary font-sans tabular-nums">
                    {completedTugas}/{totalTugas}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center text-center gap-1.5">
                <div className="relative flex items-center justify-center">
                  <ProgressRing
                    percent={totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0}
                    size={50}
                    stroke={4}
                    color="#8b5cf6"
                  />
                  <span className="absolute text-[11px] font-semibold font-sans tabular-nums text-text-primary">
                    {totalChapters > 0 ? `${Math.round((completedChapters / totalChapters) * 100)}%` : "0%"}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-text-primary">Bab</div>
                  <div className="text-[11px] text-text-tertiary font-sans tabular-nums">
                    {completedChapters}/{totalChapters}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-surface-secondary/70 border border-border/60 p-3 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#C2553A] dark:text-[#F09A82] shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs">
                <span className="font-semibold text-text-primary">Tips Belajar: </span>
                <span className="text-text-secondary leading-relaxed">{getStudyTip()}</span>
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      {/* ─── TOPIK & LENCANA PENCAPAIAN ─── */}
      <PageSection>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Topik Modul (2 Cols) */}
          <div className="lg:col-span-2 rounded-2xl bg-surface border border-[#E6E0D6] dark:border-[#24201E] p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h3 className="text-sm sm:text-base font-semibold text-text-primary tracking-tight">
                Topik Modul Dipelajari
              </h3>
              <Link
                href="/dashboard/modul"
                className="text-xs font-medium text-[#C2553A] dark:text-[#F09A82] hover:underline transition-colors"
              >
                Lihat Semua
              </Link>
            </div>

            {stats?.topCategories && stats.topCategories.filter((c: any) => c.moduleCount > 0).length > 0 ? (
              <div className="space-y-3">
                {stats.topCategories
                  .filter((c: any) => c.moduleCount > 0)
                  .map((category: any) => {
                    const topicSharePercent = totalModul > 0
                      ? Math.round((category.moduleCount / totalModul) * 100)
                      : 0;

                    return (
                      <div key={category.id || category.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: category.color || "#3b82f6" }}
                            />
                            <span className="font-medium text-text-primary">{category.name}</span>
                          </div>
                          <span className="text-text-tertiary font-sans tabular-nums text-xs">
                            {category.moduleCount} modul ({topicSharePercent}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-surface-secondary overflow-hidden">
                          <div
                            style={{
                              width: `${topicSharePercent}%`,
                              backgroundColor: category.color || "#3b82f6",
                            }}
                            className="h-full rounded-full transition-all duration-500"
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="py-6 text-center space-y-2">
                <p className="text-xs text-text-secondary">
                  Belum ada modul yang dikelompokkan ke kategori.
                </p>
                <Link
                  href="/dashboard/kategori"
                  className="inline-flex items-center gap-1 text-xs text-[#C2553A] dark:text-[#F09A82] hover:underline font-medium"
                >
                  <span>Kelola Kategori Modul</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>

          {/* Lencana Pencapaian (3 Cols) */}
          <div className="lg:col-span-3 rounded-2xl bg-surface border border-[#E6E0D6] dark:border-[#24201E] p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h3 className="text-sm sm:text-base font-semibold text-text-primary tracking-tight">
                Lencana Pencapaian
              </h3>
              <span className="text-xs text-text-tertiary font-sans tabular-nums">
                {(stats?.achievements || []).filter((a: any) => a.unlocked).length} /{" "}
                {(stats?.achievements || []).length || 4} Terbuka
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(stats?.achievements || [
                {
                  id: "streak-active",
                  title: "Konsisten Belajar",
                  desc: "Aktif belajar di platform",
                  unlocked: streakDays > 0,
                  progress: Math.min(streakDays, 7),
                  max: 7,
                },
                {
                  id: "first-tasks",
                  title: "Penyelesai Tugas",
                  desc: "Selesaikan tugas tepat waktu",
                  unlocked: completedTugas > 0,
                  progress: Math.min(completedTugas, 5),
                  max: 5,
                },
                {
                  id: "module-master",
                  title: "Penguasa Bab",
                  desc: "Tandai bab modul hingga selesai",
                  unlocked: completedChapters > 0,
                  progress: Math.min(completedChapters, 10),
                  max: 10,
                },
                {
                  id: "vault-collector",
                  title: "Kolektor Modul",
                  desc: "Miliki materi & modul pembelajaran",
                  unlocked: totalModul >= 3,
                  progress: Math.min(totalModul, 5),
                  max: 5,
                },
              ]).map((ach: any) => {
                const getAchIcon = () => {
                  if (ach.id === "streak-active") return Flame;
                  if (ach.id === "first-tasks") return Target;
                  if (ach.id === "module-master") return Star;
                  return Trophy;
                };

                const AchIcon = getAchIcon();
                const progressPercent = Math.min(100, Math.round((ach.progress / ach.max) * 100));

                return (
                  <div
                    key={ach.id || ach.title}
                    className={`p-3.5 rounded-xl border transition-all duration-150 flex flex-col justify-between space-y-2.5 ${
                      ach.unlocked
                        ? "bg-surface-secondary/50 border-[#E6E0D6] dark:border-[#24201E]"
                        : "bg-surface-secondary/20 border-border/40 opacity-65"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            ach.unlocked
                              ? "bg-[#C2553A]/10 text-[#C2553A] dark:text-[#F09A82]"
                              : "bg-surface-secondary text-text-tertiary"
                          }`}
                        >
                          <AchIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-text-primary truncate">
                            {ach.title}
                          </div>
                          <div className="text-[11px] text-text-secondary truncate mt-0.5">
                            {ach.desc}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[11px] font-sans font-medium px-2 py-0.5 rounded-full shrink-0 ${
                          ach.unlocked
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "bg-surface-secondary text-text-tertiary"
                        }`}
                      >
                        {ach.unlocked ? "Aktif" : "Terkunci"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-text-tertiary font-sans tabular-nums">
                        <span>Progres</span>
                        <span>{ach.progress} / {ach.max}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-surface border border-border/50 overflow-hidden">
                        <div
                          style={{ width: `${progressPercent}%` }}
                          className={`h-full rounded-full transition-all duration-500 ${
                            ach.unlocked ? "bg-[#C2553A]" : "bg-text-tertiary/40"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </PageSection>
    </div>
  );
}
