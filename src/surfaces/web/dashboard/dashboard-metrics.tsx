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
            className="rounded-2xl border border-border bg-surface p-4 sm:p-5 space-y-3 shadow-2xs h-full flex flex-col justify-between"
          >
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-8 w-14 rounded-lg" />
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
      color: "text-brand-600 dark:text-brand-400",
      bg: "bg-brand-500/10",
      border: "border-brand-500/20",
    },
    {
      label: "Bahan Materi",
      value: totalMateri,
      href: "/dashboard/materi",
      icon: BookOpen,
      hint: "Diktat & slide",
      color: "text-brand-600 dark:text-brand-400",
      bg: "bg-brand-500/10",
      border: "border-brand-500/20",
    },
    {
      label: "Tugas Aktif",
      value: totalTugas,
      href: "/dashboard/tugas",
      icon: CheckSquare,
      hint: "Menunggu tuntas",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      label: "Berkas Tersimpan",
      value: totalFile,
      href: "/dashboard/file",
      icon: Files,
      hint: "Arsip dokumen",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
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
            className="rounded-2xl border border-border bg-surface p-4 sm:p-5 hover:border-brand-500/40 hover:bg-surface-secondary/40 transition-all group flex flex-col justify-between shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-text-secondary truncate">
                  {item.label}
                </span>
                <div className={`w-8 h-8 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center ${item.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-bold font-mono text-text-primary tracking-tight">
                {item.value}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] text-text-tertiary">
              <span>{item.hint}</span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
