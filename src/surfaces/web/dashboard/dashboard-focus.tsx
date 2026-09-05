"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, AlertCircle, Plus, Upload, BookOpen, Layers } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { daysUntilDeadline } from "@/lib/utils";
import { OSWindow } from "@/components/os/os-window";

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
      <div className="vt-window p-4 bg-[#FFFFFF] space-y-2.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    );
  }

  // 1. Brand new workspace
  if (isBrandNew) {
    return (
      <OSWindow
        title="FOKUS_BELAJAR.EXE — SETUP WORKSPACE"
        icon={<Sparkles className="w-4 h-4 text-amber-200" />}
        statusText="STATUS: INITIALIZING FIRST MODULE"
        className="shadow-sm"
        bodyClassName="p-4 sm:p-5 bg-[#FFFFFF] text-[#1C1917] font-mono"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 bg-[#FAF3EF] border border-[#C2553A]/30 flex items-center justify-center text-[#C2553A] shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm sm:text-base font-bold text-[#1C1917] font-sans">
              Mulai Susun Workspace Akademis Anda
            </h2>
            <p className="text-xs sm:text-sm text-[#524B42] leading-relaxed max-w-2xl font-sans">
              Tambahkan modul perkuliahan semester ini, unggah slide dosen, atau buat daftar tugas agar seluruh bahan belajar terorganisir rapi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap pt-3 mt-3 border-t border-[#E5DDD5]">
          <Link href="/dashboard/modul/baru">
            <button type="button" className="px-3.5 py-1.5 vt-btn-terracotta text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Modul Pertama</span>
            </button>
          </Link>
          <Link href="/dashboard/materi/baru">
            <button type="button" className="px-3 py-1.5 vt-btn-chrome text-xs font-semibold flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-[#C2553A]" />
              <span>Unggah Materi</span>
            </button>
          </Link>
          <Link href="/dashboard/panduan">
            <button type="button" className="px-3 py-1.5 vt-btn-chrome text-xs font-semibold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#C2553A]" />
              <span>Panduan Penggunaan</span>
            </button>
          </Link>
        </div>
      </OSWindow>
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
      <OSWindow
        title="FOKUS_BELAJAR.EXE — ACTIVE SUBJECT"
        icon={<Layers className="w-4 h-4 text-amber-200" />}
        statusText={`STATUS: IN PROGRESS · ${activeModule.category?.name || "UMUM"} · ${activeModule.kind === "project" ? "PROYEK" : "MODUL"}`}
        className="shadow-sm"
        bodyClassName="p-4 sm:p-5 bg-[#FFFFFF] text-[#1C1917] font-mono"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-xs font-bold text-[#C2553A]">
                Fokus Belajar Aktif
              </span>
              <span className="text-[#8A8378]">•</span>
              <span className="px-2 py-0.5 bg-[#FAF8F5] border border-[#D6CEC4] text-[#1C1917] text-[11px] font-bold">
                {activeModule.category?.name || "Umum"}
              </span>
              <span className="px-2 py-0.5 bg-[#FAF8F5] border border-[#D6CEC4] text-[#1C1917] text-[11px] font-bold">
                {activeModule.kind === "project" ? "Proyek" : "Modul"}
              </span>
              {isUrgent && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-300">
                  <AlertCircle className="w-3 h-3" />
                  <span>Tenggat tugas {days === 0 ? "hari ini" : "besok"}</span>
                </span>
              )}
            </div>

            <h2 className="text-base sm:text-xl font-bold text-[#1C1917] font-sans truncate">
              {activeModule.title}
            </h2>

            {activeModule.description && (
              <p className="text-xs sm:text-[13px] text-[#524B42] line-clamp-1 max-w-2xl font-sans">
                {activeModule.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 pt-1 md:pt-0">
            <Link href={`/dashboard/modul?module=${activeModule.id}`}>
              <button
                type="button"
                className="px-4 py-2 vt-btn-terracotta text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <span>Lanjutkan Belajar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </OSWindow>
    );
  }

  if (activeView) {
    return (
      <OSWindow
        title="FOKUS_BELAJAR.EXE — MATERI DIBUKA"
        icon={<BookOpen className="w-4 h-4 text-amber-200" />}
        statusText="STATUS: LAST VIEWED MATERIAL"
        className="shadow-sm"
        bodyClassName="p-4 sm:p-5 bg-[#FFFFFF] text-[#1C1917] font-mono"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-xs font-bold text-[#C2553A]">
                Materi Terakhir Dibuka
              </span>
              <span className="text-[#8A8378]">•</span>
              <span className="px-2 py-0.5 bg-[#FAF8F5] border border-[#D6CEC4] text-[#1C1917] text-[11px] font-bold">
                {activeView.category?.name || "Bahan Ajar"}
              </span>
            </div>

            <h2 className="text-base sm:text-xl font-bold text-[#1C1917] font-sans truncate">
              {activeView.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0 pt-1 md:pt-0">
            <Link href={`/dashboard/materi/${activeView.id}`}>
              <button
                type="button"
                className="px-4 py-2 vt-btn-terracotta text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <span>Buka Materi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </OSWindow>
    );
  }

  return null;
}
