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
      title="RECENT // RIWAYAT BACAAN TERKINI"
      icon={<FileText className="w-4 h-4" />}
      statusText={`${views.length} ARSIP TERBUKA`}
      className="shadow-sm"
      bodyClassName="p-0 bg-[#FFFFFF] dark:bg-[#141210] text-[#1C1917] dark:text-[#F5F5F4]"
    >
      <div className="p-3.5 bg-[#FAF8F5] dark:bg-[#100E0D] border-b border-[#E4DDD4] dark:border-[#292524] flex items-center justify-between font-mono text-xs select-none">
        <span className="font-semibold text-[#1C1917] dark:text-[#F5F5F4] flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
          <span>Riwayat Bacaan Terkini</span>
        </span>
        <Link
          href="/dashboard/materi"
          className="text-xs font-semibold text-[#C2553A] dark:text-[#D4664A] hover:underline transition-colors flex items-center gap-1"
        >
          <span>Pustaka Materi</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {loading ? (
        <div className="p-3.5 space-y-2.5">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
      ) : views.length === 0 ? (
        <div className="p-5 text-center space-y-1 font-mono">
          <p className="text-xs text-[#1C1917] dark:text-[#F5F5F4] font-semibold">Belum ada riwayat bacaan.</p>
          <p className="text-[11px] text-[#8A8378] dark:text-[#8C857F]">
            Materi dan dokumen yang Anda buka akan tercatat di sini secara otomatis.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#E4DDD4] dark:divide-[#292524] font-mono">
          {views.map((item) => {
            const mat = item.material;
            if (!mat) return null;
            return (
              <Link
                key={item.id}
                href={`/dashboard/materi/${mat.id}`}
                className="group flex items-center justify-between p-3.5 sm:px-4 hover:bg-[#FAF8F5] dark:hover:bg-[#1C1917] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="p-2 rounded-lg bg-[#F3EFE9] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] text-[#C2553A] dark:text-[#D4664A] group-hover:scale-105 transition-transform shrink-0">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold font-sans text-[#1C1917] dark:text-[#F5F5F4] group-hover:text-[#C2553A] dark:group-hover:text-[#D4664A] transition-colors truncate">
                      {mat.title}
                    </p>
                    <p className="text-[10px] text-[#8A8378] dark:text-[#8C857F]">
                      Dibuka {formatDate(item.viewed_at)}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#C2553A] dark:text-[#D4664A] group-hover:translate-x-0.5 shrink-0 transition-transform" />
              </Link>
            );
          })}
        </div>
      )}
    </OSWindow>
  );
}
