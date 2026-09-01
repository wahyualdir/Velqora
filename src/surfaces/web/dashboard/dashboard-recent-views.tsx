"use client";

import React from "react";
import Link from "next/link";
import { Clock, FileText, ChevronRight, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface DashboardRecentViewsProps {
  loading: boolean;
  views: any[];
}

export function DashboardRecentViews({ loading, views }: DashboardRecentViewsProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-0.5">
        <h2 className="text-sm font-bold text-text-primary tracking-tight font-display flex items-center gap-2">
          <Clock className="w-4 h-4 text-text-tertiary" />
          <span>Riwayat Bacaan Terkini</span>
        </h2>
        <Link
          href="/dashboard/materi"
          className="text-xs font-semibold text-text-secondary hover:text-brand-600 transition-colors flex items-center gap-1"
        >
          <span>Pustaka Materi</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
      ) : views.length === 0 ? (
        <Card padding="md" variant="subtle" className="border-dashed text-center space-y-1">
          <p className="text-xs text-text-secondary font-medium">Belum ada riwayat bacaan.</p>
          <p className="text-[11px] text-text-tertiary">
            Materi dan dokumen yang Anda buka akan tercatat di sini secara otomatis.
          </p>
        </Card>
      ) : (
        <Card padding="none" className="divide-y divide-border/60 bg-surface-secondary/40 border-border/70">
          {views.map((item) => {
            const mat = item.material;
            if (!mat) return null;
            return (
              <Link
                key={item.id}
                href={`/dashboard/materi/${mat.id}`}
                className="group flex items-center justify-between p-3 sm:px-4 hover:bg-surface-secondary/80 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="p-1.5 rounded-lg bg-surface border border-border/70 text-text-tertiary group-hover:text-brand-500 group-hover:border-brand-500/30 group-hover:bg-brand-500/5 transition-all duration-150 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-text-primary group-hover:text-brand-600 transition-colors truncate">
                      {mat.title}
                    </p>
                    <p className="text-[10.5px] font-mono text-text-tertiary">
                      Dibuka {formatDate(item.viewed_at)}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-brand-500 shrink-0 transition-colors" />
              </Link>
            );
          })}
        </Card>
      )}
    </section>
  );
}
