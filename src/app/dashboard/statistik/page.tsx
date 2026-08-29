"use client";

import { useEffect, useState } from "react";
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
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { PageContainer, PageSection } from "@/components/ui/section";
import { SubNavTabs } from "@/components/layout/sub-nav-tabs";
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

export default function StatistikPage() {
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

  // Multiplier for period adjustment
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

  // Check if there is actual activity
  const hasActivity = totalModul > 0 || totalTugas > 0 || completedChapters > 0;
  const adjustedWeeklyData = rawWeeklyData.map((item: any) => ({
    day: item.day,
    hours: hasActivity ? parseFloat((item.hours * (period === "today" ? 0.4 : multiplier === 1 ? 1 : multiplier * 0.3)).toFixed(1)) : 0,
  }));

  const totalHours = adjustedWeeklyData.reduce((acc: number, item: any) => acc + item.hours, 0);
  const averageDailyHours = hasActivity ? (totalHours / adjustedWeeklyData.length).toFixed(1) : "0.0";
  const maxBarHour = Math.max(5, ...adjustedWeeklyData.map((i: any) => i.hours));

  // Dynamic Tips Belajar Microcopy
  const getStudyTip = () => {
    if (!hasActivity) {
      return "Coba selesaikan satu bab modul hari ini untuk mulai membangun riwayat aktivitas belajar Anda.";
    }
    if (completedChapters > 0 && averageProgress < 50) {
      return "Konsistensi belajar harian 30–45 menit lebih efektif untuk retensi materi dibanding sesi maraton panjang.";
    }
    if (taskCompletionRate === 100 && totalTugas > 0) {
      return "Seluruh tugas akademik telah terselesaikan. Anda dapat fokus mendalami materi dan modul berikutnya.";
    }
    return "Pertahankan ritme belajar harian untuk menjaga pemahaman konsep dan kontinuitas materi.";
  };

  if (loading) {
    return (
      <PageContainer className="space-y-6 sm:space-y-8 animate-pulse pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-surface-secondary rounded-lg" />
            <div className="h-4 w-72 bg-surface-secondary/70 rounded-md" />
          </div>
          <div className="h-9 w-64 bg-surface-secondary rounded-lg" />
        </div>
        <div className="card-grid-stats">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 rounded-xl bg-surface border border-border p-5" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          <div className="lg:col-span-3 h-80 rounded-xl bg-surface border border-border" />
          <div className="lg:col-span-2 h-80 rounded-xl bg-surface border border-border" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6 sm:space-y-8 pb-12">
      
      {/* ─── SECTION 1: HEADER & PERIOD FILTER ─── */}
      <PageHeader
        eyebrow="Analitik"
        title="Statistik & Analitik Belajar"
        description="Pantau konsistensi waktu belajar, penyelesaian bab modul, dan skor kuis dari waktu ke waktu."
        actions={
          <div
            role="tablist"
            aria-label="Filter Periode Statistik"
            className="flex items-center gap-1 bg-surface-secondary p-1 rounded-xl border border-border text-xs sm:text-sm font-medium"
          >
            {[
              { id: "today", label: "Hari ini" },
              { id: "week", label: "Minggu ini" },
              { id: "month", label: "Bulan ini" },
              { id: "all", label: "Semua waktu" },
            ].map((item) => (
              <button
                key={item.id}
                role="tab"
                aria-selected={period === item.id}
                onClick={() => setPeriod(item.id as PeriodFilter)}
                className={`px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500 ${
                  period === item.id
                    ? "bg-surface text-text-primary font-semibold shadow-xs border border-border/80"
                    : "text-text-tertiary hover:text-text-primary hover:bg-surface/50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        }
      />

      {/* Sub-Navigation Tabs */}
      <SubNavTabs category="settings" />

      {/* ─── SECTION 2: 4 KPI SUMMARY CARDS ─── */}
      <PageSection>
        <div className="card-grid-stats">
          
          {/* KPI 1: Progres Belajar */}
          <div className="p-4 sm:p-4.5 lg:p-5 rounded-xl bg-surface border border-border flex flex-col justify-between min-h-[120px] lg:min-h-[128px] space-y-2.5 shadow-2xs hover:border-brand-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-text-secondary">
                Progres Belajar
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-border flex items-center justify-center text-text-tertiary">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-[26px] font-bold font-mono text-text-primary tracking-tight">
                  {averageProgress}%
                </span>
              </div>
              <p className="text-[11.5px] text-text-secondary mt-0.5">
                {completedChapters} dari {totalChapters} bab selesai
              </p>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-secondary overflow-hidden">
              <div
                style={{ width: `${Math.min(100, Math.max(0, averageProgress))}%` }}
                className="h-full rounded-full bg-brand-500 transition-all duration-500"
              />
            </div>
          </div>

          {/* KPI 2: Tugas Selesai */}
          <div className="p-4 sm:p-4.5 lg:p-5 rounded-xl bg-surface border border-border flex flex-col justify-between min-h-[120px] lg:min-h-[128px] space-y-2.5 shadow-2xs hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-text-secondary">
                Tugas Selesai
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-[26px] font-bold font-mono text-text-primary tracking-tight">
                  {completedTugas} / {totalTugas}
                </span>
              </div>
              <p className="text-[11.5px] text-text-secondary mt-0.5">
                {totalTugas === 0
                  ? "Belum ada tugas dibuat"
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
          <div className="p-4 sm:p-4.5 lg:p-5 rounded-xl bg-surface border border-border flex flex-col justify-between min-h-[120px] lg:min-h-[128px] space-y-2.5 shadow-2xs hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-text-secondary">
                Streak Belajar
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 dark:text-amber-400">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-[26px] font-bold font-mono text-text-primary tracking-tight">
                  {streakDays} <span className="text-xs font-normal text-text-secondary">hari</span>
                </span>
              </div>
              <p className="text-[11.5px] text-text-secondary mt-0.5">
                Pertahankan konsistensi belajar
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
          <div className="p-4 sm:p-4.5 lg:p-5 rounded-xl bg-surface border border-border flex flex-col justify-between min-h-[120px] lg:min-h-[128px] space-y-2.5 shadow-2xs hover:border-brand-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-text-secondary">
                Modul Tersedia
              </span>
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-[26px] font-bold font-mono text-text-primary tracking-tight">
                  {totalModul}
                </span>
              </div>
              <p className="text-[11.5px] text-text-secondary mt-0.5">
                Bahan ajar terstruktur aktif
              </p>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-secondary overflow-hidden">
              <div
                style={{ width: `${Math.min(100, (totalModul / 10) * 100)}%` }}
                className="h-full rounded-full bg-brand-500 transition-all duration-500"
              />
            </div>
          </div>

        </div>
      </PageSection>

      {/* ─── SECTION 3: ACTIVITY CHART & WEEKLY TARGETS ─── */}
      <PageSection>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4">
          
          {/* Main Analytics: Jam Belajar per Hari (3 Columns) */}
          <div className="lg:col-span-3 rounded-xl bg-surface border border-border p-4 sm:p-5 space-y-3 flex flex-col justify-between shadow-xs">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h2 className="text-base font-bold text-text-primary font-display tracking-tight">
                  Jam Belajar per Hari
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Estimasi akumulasi waktu pembelajaran aktif
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-text-tertiary font-mono">
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

            {/* Bar Chart Visualization / Empty State */}
            {!hasActivity ? (
              <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-10 h-10 rounded-xl bg-surface-secondary border border-border flex items-center justify-center text-text-tertiary">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div className="space-y-1 max-w-xs">
                  <h3 className="text-sm font-semibold text-text-primary">
                    Belum cukup data untuk menampilkan tren.
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Selesaikan materi atau bab modul untuk mulai mencatat riwayat belajar Anda.
                  </p>
                </div>
                <Link
                  href="/dashboard/modul"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-colors shadow-xs cursor-pointer"
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
                          className={`absolute -top-7 px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-all duration-150 pointer-events-none whitespace-nowrap z-20 ${
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
                                ? "bg-brand-500"
                                : "bg-brand-600/80 group-hover:bg-brand-500"
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

            {/* Footer Bar Summary */}
            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-text-secondary">
                Rata-rata:{" "}
                <strong className="text-text-primary font-mono font-bold">
                  {averageDailyHours} jam/hari
                </strong>
              </span>
              <Link
                href="/dashboard/modul"
                className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1 transition-colors group cursor-pointer"
              >
                <span>Lihat detail</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

          </div>

          {/* Secondary Analytics: Target Mingguan & Tips (2 Columns) */}
          <div className="lg:col-span-2 rounded-xl bg-surface border border-border p-5 space-y-5 flex flex-col justify-between shadow-xs">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-bold text-text-primary font-display tracking-tight">
                Target Mingguan
              </h2>
              <Target className="w-4 h-4 text-text-tertiary" />
            </div>

            {/* 3 Target Rings */}
            <div className="grid grid-cols-3 gap-2 py-1">
              
              {/* Target 1: Modul */}
              <div className="flex flex-col items-center text-center gap-2">
                <div className="relative flex items-center justify-center">
                  <ProgressRing percent={averageProgress} size={54} stroke={4} color="#3b82f6" />
                  <span className="absolute text-[11px] font-bold font-mono text-text-primary">
                    {averageProgress}%
                  </span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-text-primary">Modul</div>
                  <div className="text-[10px] text-text-tertiary font-mono mt-0.5">
                    {totalModul} Modul
                  </div>
                </div>
              </div>

              {/* Target 2: Tugas */}
              <div className="flex flex-col items-center text-center gap-2">
                <div className="relative flex items-center justify-center">
                  <ProgressRing
                    percent={totalTugas > 0 ? taskCompletionRate : 0}
                    size={54}
                    stroke={4}
                    color="#10b981"
                  />
                  <span className="absolute text-[11px] font-bold font-mono text-text-primary">
                    {totalTugas > 0 ? `${taskCompletionRate}%` : "0%"}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-text-primary">Tugas</div>
                  <div className="text-[10px] text-text-tertiary font-mono mt-0.5">
                    {completedTugas}/{totalTugas}
                  </div>
                </div>
              </div>

              {/* Target 3: Bab */}
              <div className="flex flex-col items-center text-center gap-2">
                <div className="relative flex items-center justify-center">
                  <ProgressRing
                    percent={totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0}
                    size={54}
                    stroke={4}
                    color="#8b5cf6"
                  />
                  <span className="absolute text-[11px] font-bold font-mono text-text-primary">
                    {totalChapters > 0 ? `${Math.round((completedChapters / totalChapters) * 100)}%` : "0%"}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-text-primary">Bab</div>
                  <div className="text-[10px] text-text-tertiary font-mono mt-0.5">
                    {completedChapters}/{totalChapters}
                  </div>
                </div>
              </div>

            </div>

            {/* Practical Tips Belajar Box */}
            <div className="rounded-lg bg-surface-secondary border border-border p-3.5 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs">
                <span className="font-semibold text-text-primary">Tips Belajar: </span>
                <span className="text-text-secondary leading-relaxed">
                  {getStudyTip()}
                </span>
              </div>
            </div>

          </div>

        </div>
      </PageSection>

      {/* ─── SECTION 4: TOPIK PEMBELAJARAN & LENCANA PENCAPAIAN ─── */}
      <PageSection>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          
          {/* Topik Modul Dipelajari (2 Columns) */}
          <div className="lg:col-span-2 rounded-xl bg-surface border border-border p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-bold text-text-primary font-display tracking-tight">
                Topik Modul Dipelajari
              </h2>
              <Link
                href="/dashboard/modul"
                className="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors"
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
                            <span className="font-medium text-text-primary">
                              {category.name}
                            </span>
                          </div>
                          <span className="text-text-tertiary font-mono text-[11px]">
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
              <div className="py-8 text-center space-y-2">
                <p className="text-xs text-text-secondary">
                  Belum ada modul yang dikelompokkan ke kategori.
                </p>
                <Link
                  href="/dashboard/kategori"
                  className="inline-flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-medium"
                >
                  <span>Kelola Kategori Modul</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>

          {/* Lencana Pencapaian (3 Columns) */}
          <div className="lg:col-span-3 rounded-xl bg-surface border border-border p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-bold text-text-primary font-display tracking-tight">
                Lencana Pencapaian
              </h2>
              <span className="text-xs text-text-tertiary font-mono">
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
                  desc: "Selesaikan tugas akademik tepat waktu",
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
                    className={`p-3.5 rounded-lg border transition-all duration-150 flex flex-col justify-between space-y-2.5 ${
                      ach.unlocked
                        ? "bg-surface-secondary/60 border-border"
                        : "bg-surface-secondary/20 border-border/50 opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                            ach.unlocked
                              ? "bg-brand-500/10 text-brand-400 border border-brand-500/20"
                              : "bg-surface-secondary text-text-tertiary border border-border"
                          }`}
                        >
                          <AchIcon className="w-3.5 h-3.5" />
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
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded shrink-0 border ${
                          ach.unlocked
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-surface-secondary text-text-tertiary border-border"
                        }`}
                      >
                        {ach.unlocked ? "Aktif" : "Terkunci"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-text-tertiary font-mono">
                        <span>Progres</span>
                        <span>
                          {ach.progress} / {ach.max}
                        </span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-surface border border-border/60 overflow-hidden">
                        <div
                          style={{ width: `${progressPercent}%` }}
                          className={`h-full rounded-full transition-all duration-500 ${
                            ach.unlocked ? "bg-brand-500" : "bg-text-tertiary/40"
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

    </PageContainer>
  );
}
