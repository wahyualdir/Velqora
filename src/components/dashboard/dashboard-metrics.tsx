"use client";

import React from "react";
import Link from "next/link";
import { Layers, BookOpen, CheckSquare, Files } from "lucide-react";
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-3.5 sm:p-4 rounded-xl border border-border bg-surface space-y-2"
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
      hint: "Dokumen bacaan",
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
      hint: "Penyimpanan cloud",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {metrics.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className="group p-3.5 sm:p-4 rounded-xl border border-border bg-surface hover:border-brand-500/40 hover:bg-surface-secondary/40 transition-all flex flex-col justify-between shadow-2xs"
          >
            <div className="flex items-center justify-between gap-1 text-text-tertiary group-hover:text-brand-500 transition-colors">
              <span className="text-xs font-medium text-text-secondary">
                {item.label}
              </span>
              <Icon className="w-4 h-4 shrink-0" />
            </div>

            <div className="pt-2 flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary font-display">
                {item.value}
              </span>
              <span className="text-[10.5px] text-text-tertiary hidden sm:inline group-hover:text-text-secondary transition-colors">
                {item.hint}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
