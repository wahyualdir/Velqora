"use client";

import React from "react";
import Link from "next/link";
import { Layers, ChevronRight, ArrowRight, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { OSWindow } from "@/components/os/os-window";

interface DashboardModulesListProps {
  loading: boolean;
  modules: any[];
}

export function DashboardModulesList({ loading, modules }: DashboardModulesListProps) {
  return (
    <OSWindow
      title="MODULES // KURIKULUM SEDANG DIPELAJARI"
      icon={<Layers className="w-4 h-4" />}
      statusText={`${modules.length} MODUL AKTIF · KLIK UNTUK MEMBUKA`}
      className="shadow-sm"
      bodyClassName="p-0 bg-[#FFFFFF] dark:bg-[#141210] text-[#1C1917] dark:text-[#F5F5F4]"
    >
      <div className="p-3.5 bg-[#FAF8F5] dark:bg-[#100E0D] border-b border-[#E4DDD4] dark:border-[#292524] flex items-center justify-between font-mono text-xs select-none">
        <span className="font-semibold text-[#1C1917] dark:text-[#F5F5F4] flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
          <span>Daftar Modul Kuliah</span>
        </span>
        <Link
          href="/dashboard/modul"
          className="text-xs font-semibold text-[#C2553A] dark:text-[#D4664A] hover:underline transition-colors flex items-center gap-1"
        >
          <span>Semua Modul</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {loading ? (
        <div className="p-3.5 space-y-2.5">
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
        </div>
      ) : modules.length === 0 ? (
        <div className="p-6">
          <EmptyState
            icon={<Layers className="w-7 h-7" />}
            title="Belum ada modul tersimpan"
            description="Simpan materi atau proyek yang sedang Anda pelajari agar terstruktur dan mudah dilanjutkan."
            action={
              <Link href="/dashboard/modul/baru">
                <button
                  type="button"
                  className="px-3.5 py-2 vt-btn-terracotta rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Modul</span>
                </button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="divide-y divide-[#E4DDD4] dark:divide-[#292524] font-mono">
          {modules.map((mod) => (
            <Link
              key={mod.id}
              href={`/dashboard/modul?module=${mod.id}`}
              className="group flex items-center justify-between p-3.5 sm:px-4 hover:bg-[#FAF8F5] dark:hover:bg-[#1C1917] transition-colors"
            >
              <div className="space-y-1 min-w-0 flex-1 pr-3">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-[#F3EFE9] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] text-[#524B42] dark:text-[#A8A29E] text-[10px] font-semibold">
                    {mod.category?.name || "Umum"}
                  </span>
                  <span className="text-[10px] text-[#8A8378] dark:text-[#8C857F]">
                    {mod.kind === "project" ? "Proyek Kode" : "Modul Belajar"}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold font-sans text-[#1C1917] dark:text-[#F5F5F4] group-hover:text-[#C2553A] dark:group-hover:text-[#D4664A] transition-colors leading-snug truncate">
                  {mod.title}
                </h3>
                {mod.description && (
                  <p className="text-[11px] text-[#524B42] dark:text-[#A8A29E] truncate max-w-xl font-sans">
                    {mod.description}
                  </p>
                )}
              </div>
              <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-[#C2553A] dark:text-[#D4664A] group-hover:translate-x-0.5 transition-transform">
                <span className="hidden sm:inline">Buka</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </OSWindow>
  );
}
