"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface-secondary/40 animate-pulse">
        <div className="h-4 w-32 bg-border/60 rounded mb-2" />
        <div className="h-6 w-3/4 bg-border/60 rounded mb-2" />
        <div className="h-3 w-1/2 bg-border/60 rounded" />
      </div>
    );
  }

  // 1. Brand new workspace
  if (isBrandNew) {
    return (
      <div className="p-4 sm:p-5 rounded-xl border border-brand-500/30 bg-brand-500/5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm sm:text-base font-bold text-text-primary font-display">
              Mulai Workspace Belajar Anda
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
              Tambahkan modul perkuliahan, bahan materi, atau repositori coding untuk mengorganisir kurikulum belajar Anda secara rapi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap pt-1 pl-11">
          <Link href="/dashboard/modul/baru">
            <Button size="sm" className="text-xs font-semibold">
              + Buat Modul Pertama
            </Button>
          </Link>
          <Link href="/dashboard/materi/baru">
            <Button size="sm" variant="secondary" className="text-xs font-medium">
              + Unggah Materi
            </Button>
          </Link>
          <Link href="/dashboard/panduan">
            <Button size="sm" variant="ghost" className="text-xs text-text-secondary hover:text-text-primary">
              Panduan Penggunaan
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
      <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface hover:border-brand-500/40 transition-colors shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-brand-600 dark:text-brand-400">
                Fokus Belajar Utama
              </span>
              <span className="text-text-tertiary text-xs">•</span>
              <Badge variant="neutral">
                {activeModule.category?.name || "Umum"}
              </Badge>
              <Badge variant="secondary">
                {activeModule.kind === "project" ? "Proyek" : "Modul"}
              </Badge>
              {isUrgent && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500 font-mono">
                  <AlertCircle className="w-3 h-3" />
                  <span>Tenggat tugas {days === 0 ? "hari ini" : "besok"}</span>
                </span>
              )}
            </div>

            <h2 className="text-sm sm:text-base font-bold text-text-primary font-display truncate">
              {activeModule.title}
            </h2>

            {activeModule.description && (
              <p className="text-xs text-text-secondary line-clamp-1 max-w-2xl">
                {activeModule.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 pt-1 md:pt-0">
            <Link href={`/dashboard/modul?module=${activeModule.id}`}>
              <Button size="sm" className="gap-1.5 text-xs font-semibold shadow-xs">
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
      <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface hover:border-brand-500/40 transition-colors shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-brand-600 dark:text-brand-400">
                Materi Terakhir Dibuka
              </span>
              <span className="text-text-tertiary text-xs">•</span>
              <Badge variant="neutral">
                {activeView.category?.name || "Bahan Ajar"}
              </Badge>
            </div>

            <h2 className="text-sm sm:text-base font-bold text-text-primary font-display truncate">
              {activeView.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0 pt-1 md:pt-0">
            <Link href={`/dashboard/materi/${activeView.id}`}>
              <Button size="sm" className="gap-1.5 text-xs font-semibold shadow-xs">
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
