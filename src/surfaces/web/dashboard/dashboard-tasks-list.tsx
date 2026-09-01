"use client";

import React from "react";
import Link from "next/link";
import { CheckSquare, ArrowRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { daysUntilDeadline } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface DashboardTasksListProps {
  loading: boolean;
  tasks: any[];
}

export function DashboardTasksList({ loading, tasks }: DashboardTasksListProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-0.5">
        <h2 className="text-sm sm:text-base font-bold text-text-primary tracking-tight font-display flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-amber-600" />
          <span>Tugas Aktif & Tenggat</span>
        </h2>
        <Link
          href="/dashboard/tugas"
          className="text-xs font-semibold text-text-secondary hover:text-brand-600 transition-colors flex items-center gap-1"
        >
          <span>Kelola</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
        </div>
      ) : tasks.length === 0 ? (
        <Card padding="md" variant="subtle" className="border-dashed text-center space-y-2">
          <p className="text-xs font-semibold text-text-secondary">Semua tugas telah selesai.</p>
          <p className="text-[11.5px] text-text-tertiary">
            Tidak ada tenggat waktu mendesak yang menunggu dikerjakan.
          </p>
          <div className="pt-1">
            <Link href="/dashboard/tugas/baru">
              <Button size="sm" variant="outline" className="text-xs gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Tugas</span>
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card padding="none" className="divide-y divide-border/60">
          {tasks.map((task) => {
            const days = task.deadline ? daysUntilDeadline(task.deadline) : null;
            const isUrgent = days !== null && days <= 2 && days >= 0;
            const isLate = days !== null && days < 0;

            const priorityVariant =
              task.priority === "tinggi"
                ? "danger"
                : task.priority === "sedang"
                ? "warning"
                : "neutral";

            return (
              <Link
                key={task.id}
                href="/dashboard/tugas"
                className="group block p-3 sm:px-3.5 hover:bg-surface-secondary/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={priorityVariant} size="sm">
                      {task.priority || "Normal"}
                    </Badge>

                    {task.deadline && (
                      <span
                        className={`text-[10.5px] font-mono ${
                          isLate
                            ? "text-red-600 font-semibold"
                            : isUrgent
                            ? "text-amber-600 font-semibold"
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
                  <h3 className="text-xs font-semibold text-text-primary group-hover:text-brand-600 transition-colors truncate">
                    {task.title}
                  </h3>
                  <p className="text-[11px] text-text-secondary truncate">
                    {task.subject || "Tugas Mandiri"}
                  </p>
                </div>
              </Link>
            );
          })}
        </Card>
      )}
    </section>
  );
}
