"use client";

import React from "react";
import Link from "next/link";
import { Clock, ArrowRight, Plus, Award, AlertCircle, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { daysUntilDeadline } from "@/lib/utils";

interface DashboardTasksListProps {
  loading: boolean;
  tasks: any[];
}

export function DashboardTasksList({ loading, tasks }: DashboardTasksListProps) {
  const visibleTasks = tasks.slice(0, 3);

  return (
    <section className="flex flex-col space-y-3 h-full">
      {/* Section Header matching Reference Portal Feed */}
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div className="flex items-center gap-2 min-w-0">
          <Clock className="w-4 h-4 text-[#C2553A] dark:text-[#D4664A] shrink-0" />
          <h3 className="text-[15px] sm:text-base font-extrabold text-[#1C1917] dark:text-[#F5F5F4] font-display truncate">
            Tenggat Terdekat
          </h3>
        </div>

        <Link
          href="/dashboard/tugas"
          className="text-xs font-bold text-[#1C1917] dark:text-[#F5F5F4] hover:text-[#C2553A] dark:hover:text-[#D4664A] transition-colors flex items-center gap-1 shrink-0"
        >
          <span>Semua Tenggat</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Cards List */}
      {loading ? (
        <div className="space-y-3 flex-1">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      ) : visibleTasks.length === 0 ? (
        <div className="flex-1 rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] p-5 flex flex-col justify-between gap-4 shadow-2xs">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2E6B4E]/10 text-[#2E6B4E] dark:bg-[#4ADE80]/12 dark:text-[#4ADE80] border border-[#2E6B4E]/20 text-[10px] font-bold font-mono uppercase">
              <CheckCircle2 className="w-3 h-3" />
              <span>SEMUA TUNTAS</span>
            </div>
            <h4 className="text-sm sm:text-[15px] font-extrabold text-[#1C1917] dark:text-[#F5F5F4] font-display">
              Tidak ada tenggat waktu mendesak
            </h4>
            <p className="text-xs text-[#5C554E] dark:text-[#A8A29E] leading-relaxed">
              Seluruh tugas Anda saat ini terkendali. Tambahkan tugas atau kuis baru kapan pun diperlukan.
            </p>
          </div>

          <div className="pt-2 border-t border-[#E4DDD4] dark:border-[#292524]">
            <Link href="/dashboard/tugas/baru">
              <button
                type="button"
                className="px-3.5 py-1.5 vt-btn-chrome rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
                <span>Tambah Tugas</span>
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3 flex-1 flex flex-col">
          {visibleTasks.map((task) => {
            const days = task.deadline ? daysUntilDeadline(task.deadline) : null;
            const isLate = days !== null && days < 0;
            const isUrgent =
              isLate ||
              (days !== null && days <= 3) ||
              task.priority === "tinggi";

            const deadlineSummary = isLate
              ? "Tenggat telah lewat"
              : days === 0
              ? "Batas hari ini"
              : days === 1
              ? "Besok berakhir"
              : days !== null
              ? `${days} hari lagi`
              : "Tanpa batas tanggal";

            return (
              <Link
                key={task.id}
                href="/dashboard/tugas"
                className="group block rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] hover:border-[#C2553A]/45 dark:hover:border-[#D4664A]/45 p-4 sm:p-5 transition-all shadow-2xs"
              >
                {/* Top Row: Subject Label + ! MENDESAK Outline Pill */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0 text-xs font-semibold text-[#5C554E] dark:text-[#A8A29E]">
                    <Award className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A] shrink-0" />
                    <span className="truncate">{task.subject || "Tugas Kuliah"}</span>
                  </div>

                  {isUrgent ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-[#C2553A]/40 dark:border-[#D4664A]/45 bg-[#C2553A]/8 dark:bg-[#D4664A]/12 text-[#C2553A] dark:text-[#D4664A] font-mono text-[10px] font-extrabold uppercase tracking-wider shrink-0">
                      <AlertCircle className="w-3 h-3" />
                      <span>MENDESAK</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#F3EFE9] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] text-[#524B42] dark:text-[#A8A29E] font-mono text-[10px] font-bold uppercase shrink-0">
                      {task.priority || "NORMAL"}
                    </span>
                  )}
                </div>

                {/* Middle: Bold Task Headline */}
                <h4 className="mt-3 text-sm sm:text-[15px] font-extrabold text-[#1C1917] dark:text-[#F5F5F4] group-hover:text-[#C2553A] dark:group-hover:text-[#D4664A] transition-colors leading-snug line-clamp-2 font-display">
                  {task.title}
                </h4>

                {/* Bottom: Deadline Countdown */}
                <div className="mt-2 flex items-center justify-between gap-2 text-xs font-mono">
                  <span
                    className={
                      isLate
                        ? "text-rose-600 dark:text-rose-400 font-bold"
                        : isUrgent
                        ? "text-[#C2553A] dark:text-[#D4664A] font-bold"
                        : "text-[#6B6560] dark:text-[#8C857F] font-medium"
                    }
                  >
                    {deadlineSummary}
                  </span>
                  <span className="text-[11px] font-sans font-semibold text-[#8A8378] dark:text-[#8C857F] group-hover:text-[#C2553A] dark:group-hover:text-[#D4664A] transition-colors">
                    Buka Detail →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
