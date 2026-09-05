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
      bodyClassName="p-0 bg-[#FFFFFF] text-[#1C1917]"
    >
      <div className="p-3 bg-[#FAF8F5] border-b border-[#E5DDD5] flex items-center justify-between font-mono text-xs select-none">
        <span className="font-bold text-[#1C1917] flex items-center gap-1.5">
          <CheckSquare className="w-3.5 h-3.5 text-[#C2553A]" />
          <span>Tugas &amp; Tenggat</span>
        </span>
        <Link
          href="/dashboard/tugas"
          className="text-xs font-bold text-[#C2553A] hover:text-[#B84A2B] transition-colors flex items-center gap-1"
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
          <p className="text-xs font-bold text-[#1C1917]">Semua tugas telah selesai.</p>
          <p className="text-[11px] text-[#7A756D]">
            Tidak ada tenggat waktu mendesak yang menunggu dikerjakan.
          </p>
          <div className="pt-2">
            <Link href="/dashboard/tugas/baru">
              <button
                type="button"
                className="px-3.5 py-1.5 vt-btn-chrome text-xs font-bold flex items-center gap-1.5 mx-auto"
              >
                <Plus className="w-3.5 h-3.5 text-[#C2553A]" />
                <span>+ Tambah Tugas</span>
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-[#E5DDD5] font-mono">
          {tasks.map((task) => {
            const days = task.deadline ? daysUntilDeadline(task.deadline) : null;
            const isUrgent = days !== null && days <= 2 && days >= 0;
            const isLate = days !== null && days < 0;

            return (
              <Link
                key={task.id}
                href="/dashboard/tugas"
                className="group block p-3 sm:px-3.5 hover:bg-[#FAF8F5] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-1.5 py-0.2 bg-[#FAF8F5] border border-[#D6CEC4] text-[#1C1917] text-[10px] font-bold uppercase">
                      {task.priority || "Normal"}
                    </span>

                    {task.deadline && (
                      <span
                        className={`text-[10px] font-bold font-mono ${
                          isLate
                            ? "text-red-600"
                            : isUrgent
                            ? "text-amber-600"
                            : "text-[#7A756D]"
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
                  <h3 className="text-xs font-bold font-sans text-[#1C1917] group-hover:text-[#C2553A] transition-colors truncate">
                    {task.title}
                  </h3>
                  <p className="text-[11px] text-[#524B42] truncate font-sans">
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
