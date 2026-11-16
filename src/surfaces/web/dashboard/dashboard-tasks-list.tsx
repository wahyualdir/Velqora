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
    <section className="flex flex-col space-y-3 h-full font-sans">
      {/* Clean Section Header */}
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div className="flex items-center gap-2 min-w-0">
          <Clock className="w-4 h-4 text-[#C2553A] dark:text-[#F09A82] shrink-0" />
          <h3 className="text-[15px] font-bold text-[#1C1917] dark:text-[#F5F5F4] font-display truncate">
            Tenggat Terdekat
          </h3>
        </div>

        <Link
          href="/dashboard/tugas"
          className="text-xs font-semibold text-[#5C554E] dark:text-[#A8A29E] hover:text-[#C2553A] dark:hover:text-[#F09A82] transition-colors flex items-center gap-1 shrink-0"
        >
          <span>Semua Tugas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Cards List */}
      {loading ? (
        <div className="space-y-3 flex-1">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      ) : visibleTasks.length === 0 ? (
        <div className="flex-1 rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E6E0D6] dark:border-[#24201E] p-5 flex flex-col justify-between gap-4 shadow-2xs">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E6B4E] dark:text-[#4ADE80]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Semua tugas selesai</span>
            </div>
            <h4 className="text-[15px] font-semibold text-[#1C1917] dark:text-[#F5F5F4] font-display">
              Tidak ada tenggat waktu mendesak
            </h4>
            <p className="text-xs text-[#6B6560] dark:text-[#A8A29E] leading-relaxed">
              Buat daftar tugas baru kapan pun ada target belajar yang ingin dipantau.
            </p>
          </div>

          <div className="pt-3 border-t border-[#E6E0D6]/70 dark:border-[#24201E]">
            <Link href="/dashboard/tugas/baru">
              <button
                type="button"
                className="px-3.5 py-1.5 vt-btn-chrome rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#F09A82]" />
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

            const priorityLabel = task.priority
              ? `${String(task.priority).charAt(0).toUpperCase()}${String(task.priority).slice(1)}`
              : "Normal";

            return (
              <Link
                key={task.id}
                href="/dashboard/tugas"
                className="group block rounded-2xl bg-[#FFFFFF] dark:bg-[#141210] border border-[#E6E0D6] dark:border-[#24201E] hover:border-[#C2553A]/35 dark:hover:border-[#D4664A]/40 p-4 sm:p-5 transition-colors shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0 text-xs font-medium text-[#6B6560] dark:text-[#A8A29E]">
                    <Award className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#F09A82] shrink-0" />
                    <span className="truncate">{task.subject || "Tugas Belajar"}</span>
                  </div>

                  {isUrgent ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C2553A]/10 dark:bg-[#D4664A]/15 text-[#C2553A] dark:text-[#F09A82] text-[11px] font-semibold shrink-0">
                      <AlertCircle className="w-3 h-3" />
                      <span>Mendesak</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#F3EFE9] dark:bg-[#1C1917] text-[#5C554E] dark:text-[#A8A29E] text-[11px] font-medium shrink-0">
                      {priorityLabel}
                    </span>
                  )}
                </div>

                <h4 className="mt-2.5 text-[15px] font-semibold text-[#1C1917] dark:text-[#F5F5F4] group-hover:text-[#C2553A] dark:group-hover:text-[#F09A82] transition-colors leading-snug line-clamp-2 font-display">
                  {task.title}
                </h4>

                <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                  <span
                    className={
                      isLate
                        ? "text-rose-600 dark:text-rose-400 font-semibold"
                        : isUrgent
                        ? "text-[#C2553A] dark:text-[#F09A82] font-semibold"
                        : "text-[#6B6560] dark:text-[#8C857F] font-medium"
                    }
                  >
                    {deadlineSummary}
                  </span>
                  <span className="text-xs font-semibold text-[#8A8378] dark:text-[#8C857F] group-hover:text-[#C2553A] dark:group-hover:text-[#F09A82] transition-colors">
                    Detail →
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
