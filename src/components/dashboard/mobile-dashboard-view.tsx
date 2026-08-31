"use client";

import React from "react";
import Link from "next/link";
import {
  Play,
  BookOpen,
  CheckSquare,
  Bot,
  ScanLine,
  ChevronRight,
  Clock,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, daysUntilDeadline } from "@/lib/utils";

interface MobileDashboardViewProps {
  userName: string;
  stats: {
    totalMateri: number;
    totalTugas: number;
    totalModul: number;
    totalFile: number;
    recentViews: any[];
    recentTasks: any[];
    recentModules: any[];
  };
  loading: boolean;
  onRefresh: () => void;
}

export function MobileDashboardView({
  userName,
  stats,
  loading,
}: MobileDashboardViewProps) {
  const primaryModule = stats.recentModules?.[0] || null;
  const upcomingTasks = (stats.recentTasks || []).slice(0, 3);
  const recentViews = (stats.recentViews || []).slice(0, 4);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return "Selamat pagi";
    if (hour < 15) return "Selamat siang";
    if (hour < 18) return "Selamat sore";
    return "Selamat malam";
  };

  return (
    <div className="space-y-5 pb-8 animate-fade-in">
      {/* ─── 1. App Greeting Header ─── */}
      <div className="px-1 pt-1">
        <p className="text-xs font-mono text-text-tertiary uppercase tracking-wider">
          {getGreeting()},
        </p>
        <h1 className="text-xl font-bold text-text-primary tracking-tight font-display">
          {userName || "Pelajar"}
        </h1>
      </div>

      {/* ─── 2. Continue Learning Hero Block ─── */}
      {loading ? (
        <Card padding="md" variant="subtle" className="space-y-3">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-6 w-3/4 rounded" />
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-9 w-full rounded-xl" />
        </Card>
      ) : primaryModule ? (
        <Card padding="md" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              <Sparkles className="w-3 h-3" />
              Lanjutkan Belajar
            </span>
            <span className="text-[11px] text-text-tertiary font-mono">
              {primaryModule.category?.name || "Modul"}
            </span>
          </div>

          <div>
            <h2 className="text-base font-bold text-text-primary font-display line-clamp-1">
              {primaryModule.title}
            </h2>
            {primaryModule.description && (
              <p className="text-xs text-text-secondary line-clamp-2 mt-0.5 leading-snug">
                {primaryModule.description}
              </p>
            )}
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] text-text-tertiary">
              <span>Progres pembelajaran</span>
              <span className="font-mono font-semibold text-brand-500">
                {primaryModule.level ? `${primaryModule.level}` : "Aktif"}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-secondary overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full"
                style={{ width: "65%" }}
              />
            </div>
          </div>

          <Link
            href={`/dashboard/modul/${primaryModule.id}`}
            className="block pt-1"
          >
            <Button className="w-full h-10 rounded-xl gap-2 font-semibold text-xs shadow-xs">
              <Play className="w-4 h-4 fill-current" />
              <span>Lanjutkan Belajar</span>
            </Button>
          </Link>
        </Card>
      ) : (
        <Card padding="md" variant="subtle" className="text-center space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-text-primary font-display">
            Mulai Belajar Sekarang
          </h2>
          <p className="text-xs text-text-secondary max-w-xs mx-auto">
            Tambahkan modul atau materi perkuliahan pertama Anda.
          </p>
          <Link href="/dashboard/modul" className="inline-block pt-1">
            <Button size="sm" className="text-xs rounded-lg">
              Jelajahi Modul
            </Button>
          </Link>
        </Card>
      )}

      {/* ─── 3. Quick Academic Shortcuts (4 Icons) ─── */}
      <div className="grid grid-cols-4 gap-2 auto-rows-fr">
        <Link
          href="/dashboard/ai-tutor"
          className="p-3 rounded-xl border border-border bg-surface flex flex-col items-center justify-center text-center gap-1.5 hover:border-brand-500/40 hover:bg-surface-secondary/40 active:scale-95 transition-all shadow-2xs h-full"
        >
          <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-medium text-text-primary leading-tight">
            AI Tutor
          </span>
        </Link>

        <Link
          href="/dashboard/tugas"
          className="p-3 rounded-xl border border-border bg-surface flex flex-col items-center justify-center text-center gap-1.5 hover:border-brand-500/40 hover:bg-surface-secondary/40 active:scale-95 transition-all shadow-2xs h-full"
        >
          <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-medium text-text-primary leading-tight">
            Tugas
          </span>
        </Link>

        <Link
          href="/dashboard/jadwal"
          className="p-3 rounded-xl border border-border bg-surface flex flex-col items-center justify-center text-center gap-1.5 hover:border-brand-500/40 hover:bg-surface-secondary/40 active:scale-95 transition-all shadow-2xs h-full"
        >
          <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-medium text-text-primary leading-tight">
            Jadwal
          </span>
        </Link>

        <Link
          href="/dashboard/konversi"
          className="p-3 rounded-xl border border-border bg-surface flex flex-col items-center justify-center text-center gap-1.5 hover:border-brand-500/40 hover:bg-surface-secondary/40 active:scale-95 transition-all shadow-2xs h-full"
        >
          <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
            <ScanLine className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-medium text-text-primary leading-tight">
            Scanner
          </span>
        </Link>
      </div>

      {/* ─── 4. Upcoming Tasks Section ─── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono">
            Tugas Terdekat
          </h3>
          <Link
            href="/dashboard/tugas"
            className="text-[11px] font-semibold text-brand-500 flex items-center gap-0.5"
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
          <Card padding="none" className="divide-y divide-border/60">
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
                  className="flex items-center justify-between p-3.5 hover:bg-surface-secondary/50 active:bg-surface-secondary/70 transition-colors gap-2.5"
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-xs font-semibold text-text-primary truncate">
                      {task.title}
                    </p>
                    <p className="text-[11px] text-text-tertiary truncate">
                      {task.subject || "Tugas Kuliah"}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {task.deadline && (
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono",
                          isOverdue
                            ? "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                            : isDueToday
                            ? "bg-amber-500/15 text-amber-500 border border-amber-500/30 font-bold"
                            : isDueTomorrow
                            ? "bg-blue-500/15 text-blue-500 border border-blue-500/30"
                            : "bg-surface-secondary text-text-tertiary"
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
                    <ChevronRight className="w-3.5 h-3.5 text-text-tertiary" />
                  </div>
                </Link>
              );
            })}
          </Card>
        ) : (
          <Card padding="sm" variant="subtle" className="text-center">
            <p className="text-xs text-text-secondary">
              Tidak ada tugas yang mendesak.
            </p>
          </Card>
        )}
      </div>

      {/* ─── 5. Recent Activity List ─── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono">
            Aktivitas Terakhir
          </h3>
          <Link
            href="/dashboard/materi"
            className="text-[11px] font-semibold text-brand-500 flex items-center gap-0.5"
          >
            <span>Materi</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentViews.length > 0 ? (
          <Card padding="none" className="divide-y divide-border/60">
            {recentViews.map((item) => (
              <Link
                key={item.id}
                href={item.url || `/dashboard/materi/${item.target_id || item.id}`}
                className="flex items-center justify-between p-3.5 hover:bg-surface-secondary/50 active:bg-surface-secondary/70 transition-colors gap-2.5"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-7 h-7 rounded-lg bg-surface-secondary flex items-center justify-center text-text-secondary shrink-0">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-text-primary truncate">
                      {item.title}
                    </p>
                    <p className="text-[10.5px] text-text-tertiary truncate">
                      {item.subtitle || item.category || "Materi Pelajaran"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
              </Link>
            ))}
          </Card>
        ) : (
          <Card padding="sm" variant="subtle" className="text-center">
            <p className="text-xs text-text-secondary">
              Belum ada aktivitas baru.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
