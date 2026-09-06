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
            className="vt-window p-3.5 sm:p-4 bg-[#FFFFFF] dark:bg-[#18181B] space-y-2 h-full flex flex-col justify-between"
          >
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-7 w-12" />
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
      accent: "#C2553A",
    },
    {
      label: "Bahan Materi",
      value: totalMateri,
      href: "/dashboard/materi",
      icon: BookOpen,
      hint: "Diktat & slide",
      accent: "#C2553A",
    },
    {
      label: "Tugas Aktif",
      value: totalTugas,
      href: "/dashboard/tugas",
      icon: CheckSquare,
      hint: "Menunggu tuntas",
      accent: "#F59E0B",
    },
    {
      label: "Berkas Tersimpan",
      value: totalFile,
      href: "/dashboard/file",
      icon: Files,
      hint: "Arsip dokumen",
      accent: "#10B981",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-fr select-none font-mono">
      {metrics.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className="vt-window bg-[#FFFFFF] dark:bg-[#18181B] p-3.5 sm:p-4 hover:bg-[#FAF8F5] dark:hover:bg-zinc-800/80 transition-all group flex flex-col justify-between shadow-xs hover:shadow-md cursor-pointer border-2 border-t-[#FFFFFF] dark:border-t-[#3F3F46] border-l-[#FFFFFF] dark:border-l-[#3F3F46] border-r-[#7A756D] dark:border-r-[#09090B] border-b-[#7A756D] dark:border-b-[#09090B]"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#524B42] dark:text-zinc-400 truncate">
                  {item.label}
                </span>
                <div className="w-6 h-6 bg-[#FAF8F5] dark:bg-zinc-800 border border-[#D6CEC4] dark:border-zinc-700 flex items-center justify-center text-[#C2553A] dark:text-brand-400 group-hover:scale-105 transition-transform">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-black text-[#1C1917] dark:text-zinc-100 tracking-tight">
                {item.value}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#E5DDD5] dark:border-zinc-800 flex items-center justify-between text-[10px] text-[#7A756D] dark:text-zinc-400">
              <span>{item.hint}</span>
              <ArrowRight className="w-3 h-3 text-[#C2553A] dark:text-brand-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
