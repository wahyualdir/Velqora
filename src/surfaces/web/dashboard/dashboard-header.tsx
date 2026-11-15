"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DashboardCategoryFilter,
  getCurrentAcademicPeriod,
} from "./dashboard-utils";

interface DashboardHeaderProps {
  userName?: string;
  totalModul?: number;
  activeFilter: DashboardCategoryFilter;
  onFilterChange: (filter: DashboardCategoryFilter) => void;
}

const FILTER_TABS: Array<{ id: DashboardCategoryFilter; label: string }> = [
  { id: "semua", label: "Semua" },
  { id: "modul", label: "Modul & Kelas" },
  { id: "tugas", label: "Tugas dan Kuis" },
  { id: "ujian", label: "Ujian & Lab" },
  { id: "jadwal", label: "Jadwal" },
  { id: "statistik", label: "Statistik" },
];

export function DashboardHeader({
  userName,
  totalModul = 0,
  activeFilter,
  onFilterChange,
}: DashboardHeaderProps) {
  const [semesterLabel, setSemesterLabel] = useState("Semester Ganjil 2026/2027");
  const displayName = userName?.trim() ? userName.trim() : null;

  useEffect(() => {
    setSemesterLabel(getCurrentAcademicPeriod(new Date()).semesterLabel);
  }, []);

  return (
    <section className="space-y-4">
      {/* Eyebrow + Title + Soft Counter Pill */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono font-bold uppercase tracking-[0.12em] text-[#5C554E] dark:text-[#A8A29E]">
            <span>PORTAL AKADEMIK MAHASISWA</span>
            <span aria-hidden="true">•</span>
            <span className="text-[#C2553A] dark:text-[#D4664A]">{semesterLabel}</span>
            {displayName && (
              <>
                <span aria-hidden="true" className="hidden md:inline">•</span>
                <span className="hidden md:inline truncate max-w-[200px]">
                  {displayName}
                </span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-[28px] lg:text-[31px] font-extrabold font-display text-[#1C1917] dark:text-[#F5F5F4] tracking-tight leading-tight">
            Ruang Pembelajaran Mahasiswa
          </h1>
        </div>

        {/* Counter Pill + Optional Quick Add */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Link
            href="/dashboard/modul"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF3EF] dark:bg-[#D4664A]/15 border border-[#C2553A]/20 dark:border-[#D4664A]/30 text-[#C2553A] dark:text-[#D4664A] text-xs font-bold font-mono hover:bg-[#F5E7DF] dark:hover:bg-[#D4664A]/22 transition-colors whitespace-nowrap"
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span>{totalModul} Modul &amp; Mata Kuliah Aktif</span>
          </Link>

          <Link
            href="/dashboard/modul/baru"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FFFFFF] dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] text-[#524B42] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] hover:border-[#C2553A]/35 text-xs font-semibold transition-colors"
            title="Tambah Modul / Mata Kuliah Baru"
          >
            <Plus className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
            <span>Baru</span>
          </Link>
        </div>
      </div>

      {/* Segmented Category Filter Pill Bar matching reference portal tabs */}
      <div className="overflow-x-auto scrollbar-none touch-pan-x -mx-1 px-1 pb-0.5">
        <div
          role="tablist"
          aria-label="Filter Ruang Pembelajaran"
          className="inline-flex items-center gap-1 p-1.5 rounded-2xl bg-[#F3EFE9] dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] min-w-max select-none"
        >
          {FILTER_TABS.map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onFilterChange(tab.id)}
                className={cn(
                  "px-3.5 sm:px-4 py-1.5 rounded-xl text-xs sm:text-[13px] font-sans transition-all cursor-pointer whitespace-nowrap",
                  isSelected
                    ? "bg-[#1C1917] text-[#FAF8F5] dark:bg-[#F5F5F4] dark:text-[#141210] font-bold shadow-xs"
                    : "text-[#524B42] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] hover:bg-[#FFFFFF]/70 dark:hover:bg-[#1C1917] font-medium"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
