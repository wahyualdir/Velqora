"use client";

import React from "react";
import Link from "next/link";
import { Layers, BookOpen, CheckSquare, Files, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardMetricsProps {
  loading: boolean;
  totalModul: number;
  totalMateri: number;
  totalTugas: number;
  totalFile: number;
}

export function DashboardMetrics({
  loading,
  totalModul,
  totalMateri,
  totalTugas,
  totalFile,
}: DashboardMetricsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-fr">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-[#E4DDD4] dark:border-[#292524] p-4 sm:p-5 bg-[#FFFFFF] dark:bg-[#141210] space-y-2 h-full flex flex-col justify-between"
          >
            <Skeleton className="h-3 w-20 rounded-md" />
            <Skeleton className="h-7 w-12 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      label: "Modul & Proyek",
      value: totalModul,
      href: "/dashboard/modul",
      icon: Layers,
      hint: "Kurikulum aktif",
    },
    {
      label: "Bahan Materi",
      value: totalMateri,
      href: "/dashboard/materi",
      icon: BookOpen,
      hint: "Diktat & slide",
    },
    {
      label: "Tugas Aktif",
      value: totalTugas,
      href: "/dashboard/tugas",
      icon: CheckSquare,
      hint: "Menunggu tuntas",
    },
    {
      label: "Berkas Tersimpan",
      value: totalFile,
      href: "/dashboard/file",
      icon: Files,
      hint: "Arsip dokumen",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-fr select-none">
      {metrics.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] p-4 sm:p-5 hover:bg-[#FAF8F5] dark:hover:bg-[#1C1917] transition-all group flex flex-col justify-between cursor-pointer border border-[#E4DDD4] dark:border-[#292524] hover:border-[#C2553A]/40 dark:hover:border-[#D4664A]/40 shadow-2xs"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5 gap-2">
                <span className="text-xs font-bold text-[#5C554E] dark:text-[#A8A29E] truncate">
                  {item.label}
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#FAF3EF] dark:bg-[#1C1917] border border-[#C2553A]/20 dark:border-[#292524] flex items-center justify-center text-[#C2553A] dark:text-[#D4664A] group-hover:scale-105 transition-transform shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] dark:text-[#F5F5F4] tracking-tight tabular-nums font-display">
                {item.value}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#E4DDD4] dark:border-[#292524] flex items-center justify-between text-[11px] font-mono text-[#8A8378] dark:text-[#8C857F]">
              <span className="truncate">{item.hint}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A] group-hover:translate-x-0.5 transition-transform shrink-0" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
