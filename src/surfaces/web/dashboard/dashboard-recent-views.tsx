"use client";

import React from "react";
import Link from "next/link";
import { Clock, FileText, ChevronRight, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

interface DashboardRecentViewsProps {
  loading: boolean;
  views: any[];
}

export function DashboardRecentViews({ loading, views }: DashboardRecentViewsProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-2xs">
      <div className="p-4 sm:px-5 bg-surface-secondary/40 border-b border-border flex items-center justify-between select-none">
        <span className="font-bold text-sm text-text-primary flex items-center gap-2 font-display">
          <div className="w-7 h-7 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <span>Riwayat Bacaan Terkini</span>
        </span>
        <Link
          href="/dashboard/materi"
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors flex items-center gap-1"
        >
          <span>Pustaka Materi</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="p-4 space-y-2.5">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
      ) : views.length === 0 ? (
        <div className="p-6 text-center space-y-1">
          <p className="text-xs text-text-primary font-bold">Belum ada riwayat bacaan.</p>
          <p className="text-xs text-text-secondary">
            Materi dan dokumen yang Anda buka akan tercatat di sini secara otomatis.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {views.map((item) => {
            const mat = item.material;
            if (!mat) return null;
            return (
              <Link
                key={item.id}
                href={`/dashboard/materi/${mat.id}`}
                className="group flex items-center justify-between p-3.5 sm:px-5 hover:bg-surface-secondary/50 active:bg-surface-secondary/70 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                      {mat.title}
                    </p>
                    <p className="text-[11px] text-text-tertiary">
                      Dibuka {formatDate(item.viewed_at)}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-brand-600 dark:text-brand-400 group-hover:translate-x-0.5 shrink-0 transition-transform" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
