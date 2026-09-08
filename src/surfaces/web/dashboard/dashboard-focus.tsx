"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, AlertCircle, Plus, Upload, BookOpen, Layers } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { daysUntilDeadline } from "@/lib/utils";

interface DashboardFocusProps {
  loading: boolean;
  recentModules: any[];
  recentTasks: any[];
  recentViews: any[];
  isBrandNew: boolean;
}

export function DashboardFocus({
  loading,
  recentModules,
  recentTasks,
  recentViews,
  isBrandNew,
}: DashboardFocusProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-surface/90 p-5 sm:p-6 space-y-3 shadow-2xs">
        <Skeleton className="h-4 w-32 rounded-lg" />
        <Skeleton className="h-6 w-3/4 rounded-lg" />
        <Skeleton className="h-3 w-1/2 rounded-lg" />
      </div>
    );
  }

  // 1. Brand new workspace
  if (isBrandNew) {
    return (
      <div className="rounded-2xl border border-border bg-surface/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-text-primary font-display">
              Mulai Susun Workspace Akademis Anda
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
              Tambahkan modul perkuliahan semester ini, unggah slide dosen, atau buat daftar tugas agar seluruh bahan belajar terorganisir rapi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap pt-3 border-t border-border/80">
          <Link href="/dashboard/modul/baru">
            <Button size="sm" className="gap-1.5 text-xs font-semibold shadow-2xs">
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Modul Pertama</span>
            </Button>
          </Link>
          <Link href="/dashboard/materi/baru">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs font-semibold">
              <Upload className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Unggah Materi</span>
            </Button>
          </Link>
          <Link href="/dashboard/panduan">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Panduan Penggunaan</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 2. Urgent task notification if deadline is today or tomorrow
  const nearestTask = recentTasks[0];
  const days = nearestTask?.deadline ? daysUntilDeadline(nearestTask.deadline) : null;
  const isUrgent = days !== null && days <= 1 && days >= 0;

  // 3. Active in-progress module
  const activeModule = recentModules[0];
  const activeView = recentViews[0]?.material;

  if (activeModule) {
    return (
      <div className="rounded-2xl border border-border bg-surface/90 p-5 sm:p-6 shadow-2xs transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                <Layers className="w-3 h-3" />
                <span>Fokus Belajar Aktif</span>
              </span>
              <span className="text-text-tertiary">•</span>
              <span className="px-2 py-0.5 bg-surface-secondary border border-border rounded-lg text-text-primary text-[11px] font-medium">
                {activeModule.category?.name || "Umum"}
              </span>
              <span className="px-2 py-0.5 bg-surface-secondary border border-border rounded-lg text-text-primary text-[11px] font-medium">
                {activeModule.kind === "project" ? "Proyek" : "Modul"}
              </span>
              {isUrgent && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-300 dark:border-amber-700/50">
                  <AlertCircle className="w-3 h-3" />
                  <span>Tenggat tugas {days === 0 ? "hari ini" : "besok"}</span>
                </span>
              )}
            </div>

            <h2 className="text-base sm:text-xl font-bold text-text-primary font-display truncate">
              {activeModule.title}
            </h2>

            {activeModule.description && (
              <p className="text-xs sm:text-[13px] text-text-secondary line-clamp-1 max-w-2xl">
                {activeModule.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 pt-1 md:pt-0">
            <Link href={`/dashboard/modul?module=${activeModule.id}`}>
              <Button size="sm" className="gap-1.5 text-xs font-semibold px-4 shadow-2xs">
                <span>Lanjutkan Belajar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (activeView) {
    return (
      <div className="rounded-2xl border border-border bg-surface/90 p-5 sm:p-6 shadow-2xs transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                <BookOpen className="w-3 h-3" />
                <span>Materi Terakhir Dibuka</span>
              </span>
              <span className="text-text-tertiary">•</span>
              <span className="px-2 py-0.5 bg-surface-secondary border border-border rounded-lg text-text-primary text-[11px] font-medium">
                {activeView.category?.name || "Bahan Ajar"}
              </span>
            </div>

            <h2 className="text-base sm:text-xl font-bold text-text-primary font-display truncate">
              {activeView.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0 pt-1 md:pt-0">
            <Link href={`/dashboard/materi/${activeView.id}`}>
              <Button size="sm" className="gap-1.5 text-xs font-semibold px-4 shadow-2xs">
                <span>Buka Materi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
