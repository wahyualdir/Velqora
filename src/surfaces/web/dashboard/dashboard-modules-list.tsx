"use client";

import React from "react";
import Link from "next/link";
import { Layers, ChevronRight, ArrowRight, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

interface DashboardModulesListProps {
  loading: boolean;
  modules: any[];
}

export function DashboardModulesList({ loading, modules }: DashboardModulesListProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-2xs">
      <div className="p-4 sm:px-5 bg-surface-secondary/40 border-b border-border flex items-center justify-between select-none">
        <span className="font-bold text-sm text-text-primary flex items-center gap-2 font-display">
          <div className="w-7 h-7 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <span>Daftar Modul Kuliah</span>
        </span>
        <Link
          href="/dashboard/modul"
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors flex items-center gap-1"
        >
          <span>Semua Modul</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

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
            description="Simpan materi atau proyek yang sedang Anda pelajari agar terstruktur dan mudah dilanjutkan."
            action={
              <Link href="/dashboard/modul/baru">
                <Button size="sm" className="gap-1.5 text-xs font-semibold shadow-2xs">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Modul</span>
                </Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {modules.map((mod) => (
            <Link
              key={mod.id}
              href={`/dashboard/modul?module=${mod.id}`}
              className="group flex items-center justify-between p-3.5 sm:px-5 hover:bg-surface-secondary/50 active:bg-surface-secondary/70 transition-colors"
            >
              <div className="space-y-1 min-w-0 flex-1 pr-3">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-surface-secondary border border-border text-text-primary text-[10.5px] font-medium">
                    {mod.category?.name || "Umum"}
                  </span>
                  <span className="text-[11px] text-text-tertiary">
                    {mod.kind === "project" ? "Proyek Kode" : "Modul Belajar"}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug truncate">
                  {mod.title}
                </h3>
                {mod.description && (
                  <p className="text-xs text-text-secondary truncate max-w-xl">
                    {mod.description}
                  </p>
                )}
              </div>
              <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:translate-x-0.5 transition-transform">
                <span className="hidden sm:inline">Buka</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
