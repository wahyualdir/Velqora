"use client";

import React from "react";
import Link from "next/link";
import { Plus, BookOpen, CheckSquare, Sparkles } from "lucide-react";
import { OSWindow } from "@/components/os/os-window";

interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const displayName = userName?.trim() ? userName.trim() : null;

  return (
    <OSWindow
      title="WORKSPACE.EXE — ACADEMIC SESSION ACTIVE"
      icon={<Sparkles className="w-4 h-4 text-amber-200" />}
      statusText="USER LOGGED IN · REPOSITORI & JADWAL DISINKRONISASI"
      className="shadow-sm"
      bodyClassName="p-4 sm:p-5 bg-[#FFFFFF] dark:bg-[#141416] text-[#1C1917] dark:text-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono"
    >
      <div className="space-y-1.5 font-mono">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-[#FAF3EF] dark:bg-brand-500/15 text-[#C2553A] dark:text-brand-400 border border-[#C2553A]/30 dark:border-brand-500/30">
            WORKSPACE // DASHBOARD KULIAH
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold font-sans text-[#1C1917] dark:text-zinc-100 tracking-tight">
          {displayName ? `Selamat datang kembali, ${displayName}.` : "Selamat datang di Velqora."}
        </h1>
        <p className="text-xs text-[#524B42] dark:text-zinc-400 leading-relaxed max-w-2xl font-sans">
          Lanjutkan modul perkuliahan aktif, pantau tenggat tugas semester, atau eksplorasi kode di playground.
        </p>
      </div>

      {/* Curated Primary Quick Actions */}
      <div className="flex items-center gap-2 flex-wrap shrink-0 font-mono">
        <Link href="/dashboard/modul/baru">
          <button
            type="button"
            className="px-3.5 py-1.5 vt-btn-terracotta text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Modul</span>
          </button>
        </Link>

        <Link href="/dashboard/materi/baru">
          <button
            type="button"
            className="px-3 py-1.5 vt-btn-chrome text-xs font-semibold flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#C2553A] dark:text-brand-400" />
            <span>Unggah Materi</span>
          </button>
        </Link>

        <Link href="/dashboard/tugas/baru">
          <button
            type="button"
            className="px-3 py-1.5 vt-btn-chrome text-xs font-semibold flex items-center gap-1.5"
          >
            <CheckSquare className="w-3.5 h-3.5 text-[#C2553A] dark:text-brand-400" />
            <span>Buat Tugas</span>
          </button>
        </Link>
      </div>
    </OSWindow>
  );
}
