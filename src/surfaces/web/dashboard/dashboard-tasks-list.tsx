"use client";

import React from "react";
import Link from "next/link";
import { CheckSquare, ArrowRight, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { daysUntilDeadline } from "@/lib/utils";
import { OSWindow } from "@/components/os/os-window";

interface DashboardTasksListProps {
  loading: boolean;
  tasks: any[];
}

export function DashboardTasksList({ loading, tasks }: DashboardTasksListProps) {
  return (
    <OSWindow
      title="TASKS // DAFTAR TUGAS"
      icon={<CheckSquare className="w-4 h-4" />}
      statusText={`${tasks.length} TUGAS TERJADWAL`}
      className="shadow-sm"
      bodyClassName="p-0 bg-[#FFFFFF] dark:bg-[#141210] text-[#1C1917] dark:text-[#F5F5F4]"
    >
      <div className="p-3.5 bg-[#FAF8F5] dark:bg-[#100E0D] border-b border-[#E4DDD4] dark:border-[#292524] flex items-center justify-between font-mono text-xs select-none">
        <span className="font-semibold text-[#1C1917] dark:text-[#F5F5F4] flex items-center gap-1.5">
          <CheckSquare className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
          <span>Tugas &amp; Tenggat</span>
        </span>
        <Link
          href="/dashboard/tugas"
          className="text-xs font-semibold text-[#C2553A] dark:text-[#D4664A] hover:underline transition-colors flex items-center gap-1"
        >
          <span>Kelola</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {loading ? (
        <div className="p-3.5 space-y-2.5">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="p-5 text-center space-y-2 font-mono">
          <p className="text-xs font-semibold text-[#1C1917] dark:text-[#F5F5F4]">Semua tugas telah selesai.</p>
          <p className="text-[11px] text-[#8A8378] dark:text-[#8C857F]">
            Tidak ada tenggat waktu mendesak yang menunggu dikerjakan.
          </p>
          <div className="pt-2">
            <Link href="/dashboard/tugas/baru">
              <button
                type="button"
                className="px-3.5 py-2 vt-btn-chrome rounded-lg text-xs font-semibold flex items-center gap-1.5 mx-auto cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
                <span>Tambah Tugas</span>
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-[#E4DDD4] dark:divide-[#292524] font-mono">
          {tasks.map((task) => {
            const days = task.deadline ? daysUntilDeadline(task.deadline) : null;
            const isUrgent = days !== null && days <= 2 && days >= 0;
            const isLate = days !== null && days < 0;

            return (
              <Link
                key={task.id}
                href="/dashboard/tugas"
                className="group block p-3.5 sm:px-4 hover:bg-[#FAF8F5] dark:hover:bg-[#1C1917] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#F3EFE9] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] text-[#524B42] dark:text-[#A8A29E] text-[10px] font-semibold uppercase">
                      {task.priority || "Normal"}
                    </span>

                    {task.deadline && (
                      <span
                        className={`text-[10px] font-semibold font-mono ${
                          isLate
                            ? "text-rose-600 dark:text-rose-400"
                            : isUrgent
                            ? "text-amber-700 dark:text-[#E5C194]"
                            : "text-[#8A8378] dark:text-[#8C857F]"
                        }`}
                      >
                        {isLate
                          ? "Terlewat"
                          : days === 0
                          ? "Hari ini"
                          : `${days} hari lagi`}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-semibold font-sans text-[#1C1917] dark:text-[#F5F5F4] group-hover:text-[#C2553A] dark:group-hover:text-[#D4664A] transition-colors truncate">
                    {task.title}
                  </h3>
                  <p className="text-[11px] text-[#524B42] dark:text-zinc-400 truncate font-sans">
                    {task.subject || "Tugas Mandiri"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </OSWindow>
  );
}
