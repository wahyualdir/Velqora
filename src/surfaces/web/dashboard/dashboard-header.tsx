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
      title="WORKSPACE // SESI AKADEMIK AKTIF"
      icon={<Sparkles className="w-4 h-4" />}
      statusText="REPOSITORI & JADWAL DISINKRONISASI"
      className="shadow-sm"
      bodyClassName="p-5 sm:p-6 bg-[#FFFFFF] dark:bg-[#141210] text-[#1C1917] dark:text-[#F5F5F4] flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono"
    >
      <div className="space-y-1.5 font-mono">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#FAF3EF] dark:bg-[#D4664A]/12 text-[#C2553A] dark:text-[#D4664A] border border-[#C2553A]/20 dark:border-[#D4664A]/30">
            WORKSPACE // DASHBOARD KULIAH
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold font-sans text-[#1C1917] dark:text-[#F5F5F4] tracking-tight">
          {displayName ? `Selamat datang kembali, ${displayName}.` : "Selamat datang di Velqora."}
        </h1>
        <p className="text-xs text-[#524B42] dark:text-[#A8A29E] leading-relaxed max-w-2xl font-sans">
          Lanjutkan modul perkuliahan aktif, pantau tenggat tugas semester, atau eksplorasi kode di playground.
        </p>
      </div>

      {/* Curated Primary Quick Actions */}
      <div className="flex items-center gap-2 flex-wrap shrink-0 font-mono">
        <Link href="/dashboard/modul/baru">
          <button
            type="button"
            className="px-3.5 py-2 vt-btn-terracotta rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Modul</span>
          </button>
        </Link>

        <Link href="/dashboard/materi/baru">
          <button
            type="button"
            className="px-3.5 py-2 vt-btn-chrome rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
            <span>Unggah Materi</span>
          </button>
        </Link>

        <Link href="/dashboard/tugas/baru">
          <button
            type="button"
            className="px-3.5 py-2 vt-btn-chrome rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <CheckSquare className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
            <span>Buat Tugas</span>
          </button>
        </Link>
      </div>
    </OSWindow>
  );
}
