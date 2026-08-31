"use client";

import React from "react";
import Link from "next/link";
import { Layers, ChevronRight, ArrowRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

import { Card } from "@/components/ui/card";

interface DashboardModulesListProps {
  loading: boolean;
  modules: any[];
}

export function DashboardModulesList({ loading, modules }: DashboardModulesListProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-0.5">
        <h2 className="text-sm sm:text-base font-bold text-text-primary tracking-tight font-display flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-500" />
          <span>Modul Sedang Dipelajari</span>
        </h2>
        <Link
          href="/dashboard/modul"
          className="text-xs font-semibold text-text-secondary hover:text-brand-500 transition-colors flex items-center gap-1"
        >
          <span>Semua Modul</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      ) : modules.length === 0 ? (
        <EmptyState
          icon={<Layers className="w-7 h-7" />}
          title="Belum ada modul tersimpan"
          description="Simpan materi atau proyek yang sedang Anda pelajari agar terstruktur dan mudah dilanjutkan."
          action={
            <Link href="/dashboard/modul/baru">
              <Button size="sm" className="gap-1.5 text-xs">
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Modul</span>
              </Button>
            </Link>
          }
        />
      ) : (
        <Card padding="none" className="divide-y divide-border/60">
          {modules.map((mod) => (
            <Link
              key={mod.id}
              href={`/dashboard/modul?module=${mod.id}`}
              className="group flex items-center justify-between p-3.5 sm:px-4 hover:bg-surface-secondary/60 transition-colors"
            >
              <div className="space-y-1 min-w-0 flex-1 pr-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="neutral">
                    {mod.category?.name || "Umum"}
                  </Badge>
                  <span className="text-[11px] font-mono text-text-tertiary">
                    {mod.kind === "project" ? "Proyek Kode" : "Modul Belajar"}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-brand-500 transition-colors leading-snug truncate font-display">
                  {mod.title}
                </h3>
                {mod.description && (
                  <p className="text-[11.5px] text-text-secondary truncate max-w-xl">
                    {mod.description}
                  </p>
                )}
              </div>
              <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-text-tertiary group-hover:text-brand-500 transition-colors">
                <span className="hidden sm:inline">Buka</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </Card>
      )}
    </section>
  );
}
