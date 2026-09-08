"use client";

import React from "react";
import Link from "next/link";
import { CheckSquare, ArrowRight, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { daysUntilDeadline } from "@/lib/utils";

interface DashboardTasksListProps {
  loading: boolean;
  tasks: any[];
}

export function DashboardTasksList({ loading, tasks }: DashboardTasksListProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-2xs">
      <div className="p-4 sm:px-5 bg-surface-secondary/40 border-b border-border flex items-center justify-between select-none">
        <span className="font-bold text-sm text-text-primary flex items-center gap-2 font-display">
          <div className="w-7 h-7 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center">
            <CheckSquare className="w-4 h-4" />
          </div>
          <span>Tugas &amp; Tenggat</span>
        </span>
        <Link
          href="/dashboard/tugas"
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors flex items-center gap-1"
        >
          <span>Kelola</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="p-4 space-y-2.5">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="p-6 text-center space-y-2">
          <p className="text-xs font-bold text-text-primary">Semua tugas telah selesai.</p>
          <p className="text-xs text-text-secondary">
            Tidak ada tenggat waktu mendesak yang menunggu dikerjakan.
          </p>
          <div className="pt-2">
            <Link href="/dashboard/tugas/baru">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs font-semibold mx-auto">
                <Plus className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>Tambah Tugas</span>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {tasks.map((task) => {
            const days = task.deadline ? daysUntilDeadline(task.deadline) : null;
            const isUrgent = days !== null && days <= 2 && days >= 0;
            const isLate = days !== null && days < 0;

            return (
              <Link
                key={task.id}
                href="/dashboard/tugas"
                className="group block p-3.5 sm:px-4 hover:bg-surface-secondary/50 active:bg-surface-secondary/70 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-surface-secondary border border-border text-text-primary text-[10.5px] font-semibold uppercase">
                      {task.priority || "Normal"}
                    </span>

                    {task.deadline && (
                      <span
                        className={`text-[11px] font-bold font-mono ${
                          isLate
                            ? "text-rose-600 dark:text-rose-400"
                            : isUrgent
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-text-tertiary"
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
                  <h3 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                    {task.title}
                  </h3>
                  <p className="text-xs text-text-secondary truncate">
                    {task.subject || "Tugas Mandiri"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
