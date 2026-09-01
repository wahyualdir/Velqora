"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, AlertCircle, Plus, Upload, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { daysUntilDeadline } from "@/lib/utils";
import { Card } from "@/components/ui/card";

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
      <Card padding="md" variant="subtle" className="space-y-2.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </Card>
    );
  }

  // 1. Brand new workspace
  if (isBrandNew) {
    return (
      <Card padding="md" variant="focus" className="space-y-4">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm sm:text-base font-bold text-text-primary font-display">
              Mulai Susun Workspace Akademis Anda
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
              Tambahkan modul perkuliahan semester ini, unggah slide dosen, atau buat daftar tugas agar seluruh bahan belajar terorganisir rapi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap pt-1">
          <Link href="/dashboard/modul/baru">
            <Button size="sm" variant="primary" className="text-xs font-semibold gap-1.5 shadow-xs">
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Modul Pertama</span>
            </Button>
          </Link>
          <Link href="/dashboard/materi/baru">
            <Button size="sm" variant="outline" className="text-xs font-medium gap-1.5">
              <Upload className="w-3.5 h-3.5 text-text-tertiary" />
              <span>Unggah Materi</span>
            </Button>
          </Link>
          <Link href="/dashboard/panduan">
            <Button size="sm" variant="ghost" className="text-xs text-text-secondary hover:text-text-primary gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-text-tertiary" />
              <span>Panduan Penggunaan</span>
            </Button>
          </Link>
        </div>
      </Card>
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
      <Card padding="md" variant="focus" hover className="transition-all duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-xs font-semibold text-brand-600">
                Fokus Belajar Aktif
              </span>
              <span className="text-text-tertiary">•</span>
              <Badge variant="neutral">
                {activeModule.category?.name || "Umum"}
              </Badge>
              <Badge variant="secondary">
                {activeModule.kind === "project" ? "Proyek" : "Modul"}
              </Badge>
              {isUrgent && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 font-mono">
                  <AlertCircle className="w-3 h-3" />
                  <span>Tenggat tugas {days === 0 ? "hari ini" : "besok"}</span>
                </span>
              )}
            </div>

            <h2 className="text-base sm:text-lg font-bold text-text-primary font-display truncate">
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
              <Button size="sm" variant="primary" className="gap-1.5 text-xs font-semibold shadow-xs">
                <span>Lanjutkan Belajar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  if (activeView) {
    return (
      <Card padding="md" variant="focus" hover className="transition-all duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-xs font-semibold text-brand-600">
                Materi Terakhir Dibuka
              </span>
              <span className="text-text-tertiary">•</span>
              <Badge variant="neutral">
                {activeView.category?.name || "Bahan Ajar"}
              </Badge>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-text-primary font-display truncate">
              {activeView.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0 pt-1 md:pt-0">
            <Link href={`/dashboard/materi/${activeView.id}`}>
              <Button size="sm" variant="primary" className="gap-1.5 text-xs font-semibold shadow-xs">
                <span>Buka Materi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return null;
}
