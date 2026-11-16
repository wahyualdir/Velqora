"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Layers } from "lucide-react";
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
  { id: "tugas", label: "Tugas & Kuis" },
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
  const [semesterLabel, setSemesterLabel] = useState("Workspace Belajar");
  const displayName = userName?.trim() ? userName.trim() : null;

  useEffect(() => {
    setSemesterLabel(getCurrentAcademicPeriod(new Date()).semesterLabel);
  }, []);

  return (
    <section className="space-y-4 font-sans">
      {/* Clean Single-Line Context + Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-medium text-[#6B6560] dark:text-[#A8A29E] truncate">
            {displayName ? `Halo, ${displayName} · ` : ""}
            <span className="text-[#C2553A] dark:text-[#F09A82]">{semesterLabel}</span>
          </p>

          <h1 className="text-2xl sm:text-[26px] font-bold font-display text-[#1C1917] dark:text-[#F5F5F4] tracking-tight leading-tight">
            Ruang Pembelajaran
          </h1>
        </div>

        <Link
          href="/dashboard/modul"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF3EF] dark:bg-[#D4664A]/12 border border-[#C2553A]/15 dark:border-[#D4664A]/25 text-[#C2553A] dark:text-[#F09A82] text-xs font-semibold hover:bg-[#F5E7DF] dark:hover:bg-[#D4664A]/20 transition-colors whitespace-nowrap self-start sm:self-auto shrink-0"
        >
          <Layers className="w-3.5 h-3.5 shrink-0" />
          <span>{totalModul} Modul Aktif</span>
        </Link>
      </div>

      {/* Segmented Filter Pills (Font Sans, Zero AI-Slop) */}
      <div className="overflow-x-auto scrollbar-none touch-pan-x -mx-1 px-1 pb-0.5">
        <div
          role="tablist"
          aria-label="Filter Ruang Pembelajaran"
          className="inline-flex items-center gap-1 p-1 rounded-2xl bg-[#F3EFE9]/90 dark:bg-[#141210] border border-[#E6E0D6] dark:border-[#24201E] min-w-max select-none"
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
                  "px-3.5 sm:px-4 py-1.5 rounded-xl text-[13px] font-sans transition-all cursor-pointer whitespace-nowrap",
                  isSelected
                    ? "bg-[#FFFFFF] dark:bg-[#24201D] text-[#1C1917] dark:text-[#F5F5F4] font-semibold shadow-2xs"
                    : "text-[#5C554E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] font-medium"
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
