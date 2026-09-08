"use client";

import React from "react";
import Link from "next/link";
import { Clock, FileText, ChevronRight, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { OSWindow } from "@/components/os/os-window";

interface DashboardRecentViewsProps {
  loading: boolean;
  views: any[];
}

export function DashboardRecentViews({ loading, views }: DashboardRecentViewsProps) {
  return (
    <OSWindow
      title="RECENT_DOCS.TXT — RIWAYAT BACAAN TERKINI"
      icon={<FileText className="w-4 h-4 text-amber-200" />}
      statusText={`${views.length} ARSIP TERBUKA`}
      className="shadow-sm"
      bodyClassName="p-0 bg-[#FFFFFF] dark:bg-[#141416] text-[#1C1917] dark:text-zinc-100"
    >
      <div className="p-3 bg-[#FAF8F5] dark:bg-[#18181B] border-b border-[#E5DDD5] dark:border-zinc-800 flex items-center justify-between font-mono text-xs select-none">
        <span className="font-bold text-[#1C1917] dark:text-zinc-100 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#C2553A] dark:text-brand-400" />
          <span>Riwayat Bacaan Terkini</span>
        </span>
        <Link
          href="/dashboard/materi"
          className="text-xs font-bold text-[#C2553A] dark:text-brand-400 hover:text-[#B84A2B] dark:hover:text-brand-300 transition-colors flex items-center gap-1"
        >
          <span>Pustaka Materi</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {loading ? (
        <div className="p-3 space-y-2">
          <Skeleton className="h-12 rounded-none" />
          <Skeleton className="h-12 rounded-none" />
        </div>
      ) : views.length === 0 ? (
        <div className="p-5 text-center space-y-1 font-mono">
          <p className="text-xs text-[#1C1917] dark:text-zinc-100 font-bold">Belum ada riwayat bacaan.</p>
          <p className="text-[11px] text-[#7A756D] dark:text-zinc-400">
            Materi dan dokumen yang Anda buka akan tercatat di sini secara otomatis.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#E5DDD5] dark:divide-zinc-800 font-mono">
          {views.map((item) => {
            const mat = item.material;
            if (!mat) return null;
            return (
              <Link
                key={item.id}
                href={`/dashboard/materi/${mat.id}`}
                className="group flex items-center justify-between p-3 sm:px-4 hover:bg-[#FAF8F5] dark:hover:bg-zinc-800/60 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="p-1.5 bg-[#FAF8F5] dark:bg-zinc-800 border border-[#D6CEC4] dark:border-zinc-700 text-[#C2553A] dark:text-brand-400 group-hover:scale-105 transition-transform shrink-0">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold font-sans text-[#1C1917] dark:text-zinc-100 group-hover:text-[#C2553A] dark:group-hover:text-brand-400 transition-colors truncate">
                      {mat.title}
                    </p>
                    <p className="text-[10px] text-[#7A756D] dark:text-zinc-400">
                      Dibuka {formatDate(item.viewed_at)}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#C2553A] dark:text-brand-400 group-hover:translate-x-0.5 shrink-0 transition-transform" />
              </Link>
            );
          })}
        </div>
      )}
    </OSWindow>
  );
}
