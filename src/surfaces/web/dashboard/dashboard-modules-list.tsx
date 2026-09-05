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
      title="MODULES_EXPLORER.EXE — KURIKULUM SEDANG DIPELAJARI"
      icon={<Layers className="w-4 h-4 text-amber-200" />}
      statusText={`${modules.length} MODUL AKTIF · DOUBLE-CLICK ATAU KLIK UNTUK MEMBUKA`}
      className="shadow-sm"
      bodyClassName="p-0 bg-[#FFFFFF] text-[#1C1917]"
    >
      <div className="p-3 bg-[#FAF8F5] border-b border-[#E5DDD5] flex items-center justify-between font-mono text-xs select-none">
        <span className="font-bold text-[#1C1917] flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#C2553A]" />
          <span>Daftar Modul Kuliah</span>
        </span>
        <Link
          href="/dashboard/modul"
          className="text-xs font-bold text-[#C2553A] hover:text-[#B84A2B] transition-colors flex items-center gap-1"
        >
          <span>Semua Modul</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {loading ? (
        <div className="p-3 space-y-2">
          <Skeleton className="h-14 rounded-none" />
          <Skeleton className="h-14 rounded-none" />
          <Skeleton className="h-14 rounded-none" />
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
                  className="px-3.5 py-1.5 vt-btn-terracotta text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Modul</span>
                </button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="divide-y divide-[#E5DDD5] font-mono">
          {modules.map((mod) => (
            <Link
              key={mod.id}
              href={`/dashboard/modul?module=${mod.id}`}
              className="group flex items-center justify-between p-3 sm:px-4 hover:bg-[#FAF8F5] transition-colors"
            >
              <div className="space-y-1 min-w-0 flex-1 pr-3">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="px-1.5 py-0.2 bg-[#FAF8F5] border border-[#D6CEC4] text-[#1C1917] text-[10px] font-bold">
                    {mod.category?.name || "Umum"}
                  </span>
                  <span className="text-[10px] text-[#7A756D]">
                    {mod.kind === "project" ? "Proyek Kode" : "Modul Belajar"}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold font-sans text-[#1C1917] group-hover:text-[#C2553A] transition-colors leading-snug truncate">
                  {mod.title}
                </h3>
                {mod.description && (
                  <p className="text-[11px] text-[#524B42] truncate max-w-xl font-sans">
                    {mod.description}
                  </p>
                )}
              </div>
              <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-[#C2553A] group-hover:translate-x-0.5 transition-transform">
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
