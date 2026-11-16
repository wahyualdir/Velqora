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
}: DashboardTodayScheduleProps) {
  const todayLabel = getIndonesianDayName(new Date());
  const visibleItems = todaySchedules.slice(0, 3);
  const nextUpcoming = upcomingSchedules[0] || null;

  return (
    <section className="flex flex-col space-y-3 h-full font-sans">
      {/* Clean Section Header */}
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div className="flex items-center gap-2 min-w-0">
          <Calendar className="w-4 h-4 text-[#C2553A] dark:text-[#F09A82] shrink-0" />
          <h3 className="text-[15px] font-bold text-[#1C1917] dark:text-[#F5F5F4] font-display truncate">
            Jadwal Hari Ini
          </h3>
          <span className="text-xs font-medium text-[#8A8378] dark:text-[#8C857F] hidden sm:inline">
            · {todayLabel}
          </span>
        </div>

        <Link
          href="/dashboard/jadwal"
          className="text-xs font-semibold text-[#5C554E] dark:text-[#A8A29E] hover:text-[#C2553A] dark:hover:text-[#F09A82] transition-colors flex items-center gap-1 shrink-0"
        >
          <span>Kalender</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="space-y-3 flex-1">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      ) : visibleItems.length > 0 ? (
        <div className="space-y-3 flex-1 flex flex-col">
          {visibleItems.map((item) => {
            const isLive = isScheduleLiveNow(item);
            const isDone = Boolean(item.isCompleted || item.is_completed);
            const categoryText =
              item.subject?.trim() ||
              (item.type === "classroom"
                ? "Classroom"
                : item.type === "reminder"
                ? "Pengingat"
                : "Sesi Belajar");

            return (
              <Link
                key={item.id}
                href="/dashboard/jadwal"
                className="group block rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E6E0D6] dark:border-[#24201E] hover:border-[#C2553A]/35 dark:hover:border-[#D4664A]/40 p-4 sm:p-5 transition-colors shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-mono font-medium text-[#5C554E] dark:text-[#A8A29E] tabular-nums">
                    {getScheduleTimeRange(item)}
                  </span>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F3EFE9] dark:bg-[#1C1917] text-[#5C554E] dark:text-[#A8A29E] text-[11px] font-medium truncate max-w-[130px]">
                      {categoryText}
                    </span>

                    {isLive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C2553A]/12 dark:bg-[#D4664A]/15 text-[#C2553A] dark:text-[#F09A82] text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C2553A] dark:bg-[#F09A82]" />
                        Berlangsung
                      </span>
                    ) : isDone ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#2E6B4E]/10 text-[#2E6B4E] dark:bg-[#4ADE80]/12 dark:text-[#4ADE80] text-[11px] font-semibold">
                        Selesai
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#F3EFE9] dark:bg-[#1C1917] text-[#6B6560] dark:text-[#A8A29E] text-[11px] font-medium">
                        Terjadwal
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="mt-2.5 text-[15px] font-semibold text-[#1C1917] dark:text-[#F5F5F4] group-hover:text-[#C2553A] dark:group-hover:text-[#F09A82] transition-colors leading-snug line-clamp-2 font-display">
                  {item.title}
                </h4>

                {(item.location || item.lecturer) && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-[#6B6560] dark:text-[#A8A29E] truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#8A8378] dark:text-[#8C857F] shrink-0" />
                    <span className="truncate">
                      {[item.location, item.lecturer].filter(Boolean).join(" · ")}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E6E0D6] dark:border-[#24201E] p-5 flex flex-col justify-between gap-4 shadow-2xs">
          {nextUpcoming ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B6560] dark:text-[#A8A29E]">
                  <Clock className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#F09A82]" />
                  <span>Agenda berikutnya ({nextUpcoming.day})</span>
                </span>
                <span className="text-xs font-mono text-[#6B6560] dark:text-[#A8A29E]">
                  {getScheduleTimeRange(nextUpcoming)}
                </span>
              </div>
              <h4 className="text-[15px] font-semibold text-[#1C1917] dark:text-[#F5F5F4] font-display">
                {nextUpcoming.title}
              </h4>
              <p className="text-xs text-[#6B6560] dark:text-[#A8A29E] leading-relaxed">
                Tidak ada sesi terjadwal untuk hari {todayLabel}.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <h4 className="text-[15px] font-semibold text-[#1C1917] dark:text-[#F5F5F4] font-display">
                Tidak ada jadwal untuk hari {todayLabel}
              </h4>
              <p className="text-xs text-[#6B6560] dark:text-[#A8A29E] leading-relaxed">
                Tambahkan jadwal belajar rutin agar pengingat harian muncul di sini.
              </p>
            </div>
          )}

          <div className="pt-3 border-t border-[#E6E0D6]/70 dark:border-[#24201E] flex items-center justify-between gap-2">
            <Link
              href="/dashboard/jadwal"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl vt-btn-chrome text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#F09A82]" />
              <span>Atur Jadwal</span>
            </Link>
            <Link
              href="/dashboard/playground"
              className="text-xs font-semibold text-[#C2553A] dark:text-[#F09A82] hover:underline"
            >
              Buka Lab Kode →
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
