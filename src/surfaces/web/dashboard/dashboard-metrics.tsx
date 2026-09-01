"use client";

import React from "react";
import { Layers, BookOpen, CheckSquare, Files } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CardStat } from "@/components/ui/card";

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
            className="p-3.5 sm:p-4 rounded-xl border border-border bg-surface space-y-2 h-full flex flex-col justify-between"
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-fr">
      {metrics.map((item) => (
        <CardStat
          key={item.label}
          label={item.label}
          value={item.value}
          icon={item.icon}
          hint={item.hint}
          href={item.href}
        />
      ))}
    </div>
  );
}
