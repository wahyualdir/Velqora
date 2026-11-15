"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, FileText, ChevronRight, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

interface DashboardRecentViewsProps {
  loading: boolean;
  views: any[];
}

export function DashboardRecentViews({ loading, views }: DashboardRecentViewsProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen className="w-4 h-4 text-[#C2553A] dark:text-[#D4664A] shrink-0" />
          <h3 className="text-[15px] sm:text-base font-extrabold text-[#1C1917] dark:text-[#F5F5F4] font-display truncate">
            Riwayat Bacaan Terkini
          </h3>
        </div>

        <Link
          href="/dashboard/materi"
          className="text-xs font-bold text-[#1C1917] dark:text-[#F5F5F4] hover:text-[#C2553A] dark:hover:text-[#D4664A] transition-colors flex items-center gap-1 shrink-0"
        >
          <span>Perpustakaan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-4 space-y-2.5">
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
          </div>
        ) : views.length === 0 ? (
          <div className="p-6 text-center space-y-1.5">
            <p className="text-xs font-bold text-[#1C1917] dark:text-[#F5F5F4]">
              Belum ada riwayat bacaan.
            </p>
            <p className="text-xs text-[#6B6560] dark:text-[#8C857F]">
              Materi dan dokumen yang Anda buka akan tercatat di sini secara otomatis.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E4DDD4] dark:divide-[#292524]">
            {views.map((item) => {
              const mat = item.material;
              if (!mat) return null;
              return (
                <Link
                  key={item.id}
                  href={`/dashboard/materi/${mat.id}`}
                  className="group flex items-center justify-between p-4 sm:px-5 hover:bg-[#FAF8F5] dark:hover:bg-[#1C1917] transition-colors gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF3EF] dark:bg-[#1C1917] border border-[#C2553A]/20 dark:border-[#292524] text-[#C2553A] dark:text-[#D4664A] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-[#1C1917] dark:text-[#F5F5F4] group-hover:text-[#C2553A] dark:group-hover:text-[#D4664A] transition-colors truncate font-display">
                        {mat.title}
                      </p>
                      <p className="text-[11px] font-mono text-[#8A8378] dark:text-[#8C857F]">
                        {mat.category?.name ? `${mat.category.name} • ` : ""}Dibuka{" "}
                        {formatDate(item.viewed_at)}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#C2553A] dark:text-[#D4664A] group-hover:translate-x-0.5 shrink-0 transition-transform" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
