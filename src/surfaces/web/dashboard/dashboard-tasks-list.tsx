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
      title="TASKS_MONITOR.EXE — DAFTAR TUGAS"
      icon={<CheckSquare className="w-4 h-4 text-amber-200" />}
      statusText={`${tasks.length} TUGAS TERJADWAL`}
      className="shadow-sm"
      bodyClassName="p-0 bg-[#FFFFFF] dark:bg-[#141416] text-[#1C1917] dark:text-zinc-100"
    >
      <div className="p-3 bg-[#FAF8F5] dark:bg-[#18181B] border-b border-[#E5DDD5] dark:border-zinc-800 flex items-center justify-between font-mono text-xs select-none">
        <span className="font-bold text-[#1C1917] dark:text-zinc-100 flex items-center gap-1.5">
          <CheckSquare className="w-3.5 h-3.5 text-[#C2553A] dark:text-brand-400" />
          <span>Tugas &amp; Tenggat</span>
        </span>
        <Link
          href="/dashboard/tugas"
          className="text-xs font-bold text-[#C2553A] dark:text-brand-400 hover:text-[#B84A2B] dark:hover:text-brand-300 transition-colors flex items-center gap-1"
        >
          <span>Kelola</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {loading ? (
        <div className="p-3 space-y-2">
          <Skeleton className="h-12 rounded-none" />
          <Skeleton className="h-12 rounded-none" />
          <Skeleton className="h-12 rounded-none" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="p-5 text-center space-y-2 font-mono">
          <p className="text-xs font-bold text-[#1C1917] dark:text-zinc-100">Semua tugas telah selesai.</p>
          <p className="text-[11px] text-[#7A756D] dark:text-zinc-400">
            Tidak ada tenggat waktu mendesak yang menunggu dikerjakan.
          </p>
          <div className="pt-2">
            <Link href="/dashboard/tugas/baru">
              <button
                type="button"
                className="px-3.5 py-1.5 vt-btn-chrome text-xs font-bold flex items-center gap-1.5 mx-auto"
              >
                <Plus className="w-3.5 h-3.5 text-[#C2553A] dark:text-brand-400" />
                <span>+ Tambah Tugas</span>
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-[#E5DDD5] dark:divide-zinc-800 font-mono">
          {tasks.map((task) => {
            const days = task.deadline ? daysUntilDeadline(task.deadline) : null;
            const isUrgent = days !== null && days <= 2 && days >= 0;
            const isLate = days !== null && days < 0;

            return (
              <Link
                key={task.id}
                href="/dashboard/tugas"
                className="group block p-3 sm:px-3.5 hover:bg-[#FAF8F5] dark:hover:bg-zinc-800/60 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-1.5 py-0.2 bg-[#FAF8F5] dark:bg-zinc-800 border border-[#D6CEC4] dark:border-zinc-700 text-[#1C1917] dark:text-zinc-200 text-[10px] font-bold uppercase">
                      {task.priority || "Normal"}
                    </span>

                    {task.deadline && (
                      <span
                        className={`text-[10px] font-bold font-mono ${
                          isLate
                            ? "text-red-600 dark:text-red-400"
                            : isUrgent
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-[#7A756D] dark:text-zinc-400"
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
                  <h3 className="text-xs font-bold font-sans text-[#1C1917] dark:text-zinc-100 group-hover:text-[#C2553A] dark:group-hover:text-brand-400 transition-colors truncate">
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
