"use client";

import React from "react";
import Link from "next/link";
import { Calendar, ArrowRight, MapPin, Plus, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { ScheduleItem } from "@/types";
import {
  getIndonesianDayName,
  getScheduleTimeRange,
  isScheduleLiveNow,
} from "./dashboard-utils";

interface DashboardTodayScheduleProps {
  loading: boolean;
  todaySchedules: ScheduleItem[];
  upcomingSchedules?: ScheduleItem[];
  activeModule?: any;
}

export function DashboardTodaySchedule({
  loading,
  todaySchedules,
  upcomingSchedules = [],
  activeModule,
}: DashboardTodayScheduleProps) {
  const todayLabel = getIndonesianDayName(new Date());
  const visibleItems = todaySchedules.slice(0, 3);
  const nextUpcoming = upcomingSchedules[0] || null;

  return (
    <section className="flex flex-col space-y-3 h-full">
      {/* Section Header matching Reference Portal Feed */}
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div className="flex items-center gap-2 min-w-0">
          <Calendar className="w-4 h-4 text-[#C2553A] dark:text-[#D4664A] shrink-0" />
          <h3 className="text-[15px] sm:text-base font-extrabold text-[#1C1917] dark:text-[#F5F5F4] font-display truncate">
            Jadwal Hari Ini
          </h3>
          <span className="text-[11px] font-mono font-semibold text-[#8A8378] dark:text-[#8C857F] hidden sm:inline">
            ({todayLabel})
          </span>
        </div>

        <Link
          href="/dashboard/jadwal"
          className="text-xs font-bold text-[#1C1917] dark:text-[#F5F5F4] hover:text-[#C2553A] dark:hover:text-[#D4664A] transition-colors flex items-center gap-1 shrink-0"
        >
          <span>Kalender</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Cards Container */}
      {loading ? (
        <div className="space-y-3 flex-1">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      ) : visibleItems.length > 0 ? (
        <div className="space-y-3 flex-1 flex flex-col">
          {visibleItems.map((item) => {
            const isLive = isScheduleLiveNow(item);
            const isDone = Boolean(item.isCompleted || item.is_completed);
            const codePill =
              item.subject?.trim() ||
              (item.type === "classroom" ? "CLASSROOM" : item.type === "reminder" ? "REMINDER" : "KULIAH");

            return (
              <Link
                key={item.id}
                href="/dashboard/jadwal"
                className="group block rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] hover:border-[#C2553A]/45 dark:hover:border-[#D4664A]/45 p-4 sm:p-5 transition-all shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-[#5C554E] dark:text-[#A8A29E] tabular-nums">
                    {getScheduleTimeRange(item)}
                  </span>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F3EFE9] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] text-[#524B42] dark:text-[#A8A29E] font-mono text-[10px] font-bold uppercase truncate max-w-[120px]">
                      {codePill}
                    </span>

                    {isLive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C2553A] dark:bg-[#D4664A] text-[#FFFBF8] font-mono text-[10px] font-extrabold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFFBF8]" />
                        BERLANGSUNG
                      </span>
                    ) : isDone ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#2E6B4E]/10 text-[#2E6B4E] dark:bg-[#4ADE80]/12 dark:text-[#4ADE80] border border-[#2E6B4E]/25 font-mono text-[10px] font-bold uppercase">
                        SELESAI
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FAF3EF] dark:bg-[#1C1917] text-[#C2553A] dark:text-[#D4664A] border border-[#C2553A]/20 font-mono text-[10px] font-bold uppercase">
                        TERJADWAL
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="mt-3 text-sm sm:text-[15px] font-extrabold text-[#1C1917] dark:text-[#F5F5F4] group-hover:text-[#C2553A] dark:group-hover:text-[#D4664A] transition-colors leading-snug line-clamp-2 font-display">
                  {item.title}
                </h4>

                {(item.location || item.lecturer) && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-[#6B6560] dark:text-[#A8A29E] truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#8A8378] dark:text-[#8C857F] shrink-0" />
                    <span className="truncate">
                      {[item.location, item.lecturer].filter(Boolean).join(" • ")}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] p-5 flex flex-col justify-between gap-4 shadow-2xs">
          {nextUpcoming ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#8A8378] dark:text-[#8C857F] uppercase">
                  <Clock className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
                  Jadwal Terdekat ({nextUpcoming.day})
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F3EFE9] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] text-[10px] font-mono font-bold text-[#524B42] dark:text-[#A8A29E]">
                  {getScheduleTimeRange(nextUpcoming)}
                </span>
              </div>
              <h4 className="text-sm sm:text-[15px] font-extrabold text-[#1C1917] dark:text-[#F5F5F4] font-display">
                {nextUpcoming.title}
              </h4>
              <p className="text-xs text-[#5C554E] dark:text-[#A8A29E]">
                Hari {todayLabel} Anda sedang senggang. Gunakan waktu ini untuk menuntaskan materi {activeModule?.title || "aktif"}.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-[#8A8378] dark:text-[#8C857F] uppercase">
                  {todayLabel} • Bebas Sesi Kelas
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F3EFE9] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] text-[10px] font-mono font-bold text-[#524B42] dark:text-[#A8A29E]">
                  MANDIRI
                </span>
              </div>
              <h4 className="text-sm sm:text-[15px] font-extrabold text-[#1C1917] dark:text-[#F5F5F4] font-display">
                {activeModule
                  ? `Rekomendasi Belajar: ${activeModule.title}`
                  : "Belum ada jadwal kuliah hari ini"}
              </h4>
              <p className="text-xs text-[#5C554E] dark:text-[#A8A29E] leading-relaxed">
                Tambahkan jadwal kuliah mingguan atau sinkronisasi rencana belajar agar agenda harian muncul di sini.
              </p>
            </div>
          )}

          <div className="pt-2 border-t border-[#E4DDD4] dark:border-[#292524] flex items-center justify-between gap-2">
            <Link
              href="/dashboard/jadwal"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl vt-btn-chrome text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
              <span>Atur Jadwal</span>
            </Link>
            <Link
              href="/dashboard/playground"
              className="text-xs font-bold text-[#C2553A] dark:text-[#D4664A] hover:underline"
            >
              Buka Lab Kode →
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
