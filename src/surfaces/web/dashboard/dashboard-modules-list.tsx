"use client";

import React from "react";
import Link from "next/link";
import { Layers, ChevronRight, ArrowRight, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

interface DashboardModulesListProps {
  loading: boolean;
  modules: any[];
}

export function DashboardModulesList({ loading, modules }: DashboardModulesListProps) {
  return (
    <section className="space-y-3 font-sans">
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div className="flex items-center gap-2 min-w-0">
          <Layers className="w-4 h-4 text-[#C2553A] dark:text-[#F09A82] shrink-0" />
          <h3 className="text-[15px] font-bold text-[#1C1917] dark:text-[#F5F5F4] font-display truncate">
            Modul &amp; Kurikulum Aktif
          </h3>
        </div>

        <Link
          href="/dashboard/modul"
          className="text-xs font-semibold text-[#5C554E] dark:text-[#A8A29E] hover:text-[#C2553A] dark:hover:text-[#F09A82] transition-colors flex items-center gap-1 shrink-0"
        >
          <span>Semua Modul</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E6E0D6] dark:border-[#24201E] overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-4 space-y-2.5">
            <Skeleton className="h-14 rounded-xl" />
            <Skeleton className="h-14 rounded-xl" />
            <Skeleton className="h-14 rounded-xl" />
          </div>
        ) : modules.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<Layers className="w-7 h-7" />}
              title="Belum ada modul tersimpan"
              description="Simpan modul atau proyek belajar yang sedang Anda kerjakan agar progresnya terpantau."
              action={
                <Link href="/dashboard/modul/baru">
                  <button
                    type="button"
                    className="px-4 py-2 bg-[#C2553A] hover:bg-[#A34530] dark:bg-[#D4664A] text-[#FFFBF8] rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Modul</span>
                  </button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-[#E6E0D6]/70 dark:divide-[#24201E]">
            {modules.map((mod) => {
              const chapters = Array.isArray(mod.chapters) ? mod.chapters : [];
              const done = chapters.filter((c: any) => c.is_completed).length;
              const pct =
                chapters.length > 0
                  ? Math.round((done / chapters.length) * 100)
                  : mod.progress || 0;

              return (
                <Link
                  key={mod.id}
                  href={`/dashboard/modul?module=${mod.id}`}
                  className="group flex items-center justify-between p-4 sm:px-5 hover:bg-[#FAF8F5] dark:hover:bg-[#1C1917] transition-colors gap-3"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F3EFE9] dark:bg-[#1C1917] text-[#5C554E] dark:text-[#A8A29E] text-[11px] font-medium">
                        {mod.category?.name || "Umum"}
                      </span>
                      <span className="text-xs text-[#8A8378] dark:text-[#8C857F]">
                        {mod.kind === "project" ? "Proyek Kode" : "Modul"} · {pct}%
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold font-display text-[#1C1917] dark:text-[#F5F5F4] group-hover:text-[#C2553A] dark:group-hover:text-[#F09A82] transition-colors leading-snug truncate">
                      {mod.title}
                    </h4>
                    {mod.description && (
                      <p className="text-xs text-[#6B6560] dark:text-[#A8A29E] truncate max-w-xl">
                        {mod.description}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-[#C2553A] dark:text-[#F09A82] group-hover:translate-x-0.5 transition-transform">
                    <span className="hidden sm:inline">Buka</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
