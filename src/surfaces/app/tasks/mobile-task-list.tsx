"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  MoreVertical,
  Edit2,
  Trash2,
  ExternalLink,
  Plus,
} from "lucide-react";
import { MobileBottomSheet } from "@/surfaces/app/layout/mobile-bottom-sheet";
import { Button } from "@/components/ui/button";
import { cn, daysUntilDeadline, formatDate } from "@/lib/utils";

import { Card } from "@/components/ui/card";

interface MobileTaskListProps {
  tasks: any[];
  onUpdateStatus: (taskId: string, newStatus: string) => void;
  onEdit: (task: any) => void;
  onDelete: (id: string) => void;
}

export function MobileTaskList({
  tasks,
  onUpdateStatus,
  onEdit,
  onDelete,
}: MobileTaskListProps) {
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  const getStatusChip = (status: string, deadline?: string) => {
    const days = deadline ? daysUntilDeadline(deadline) : null;
    const isOverdue = days !== null && days < 0 && status !== "selesai";

    if (status === "selesai") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" />
          Selesai
        </span>
      );
    }

    if (isOverdue) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-rose-500/15 text-rose-700 border border-rose-500/30 font-mono">
          <AlertTriangle className="w-3 h-3" />
          Terlambat
        </span>
      );
    }

    if (status === "sedang_dikerjakan") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-500/15 text-blue-700 border border-blue-500/30">
          <Clock className="w-3 h-3" />
          Proses
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-surface-secondary text-text-secondary border border-border/60">
        Belum Mulai
      </span>
    );
  };

  return (
    <div className="space-y-3 pb-8">
      {/* List Container */}
      <Card padding="none" className="divide-y divide-border/60 overflow-hidden">
        {tasks.map((task) => {
          const daysLeft = task.deadline ? daysUntilDeadline(task.deadline) : null;

          return (
            <div
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className="p-3.5 hover:bg-surface-secondary/40 active:bg-surface-secondary/70 transition-colors flex items-center justify-between gap-3 cursor-pointer"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-text-primary truncate font-sans">
                    {task.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-text-secondary truncate">
                  <span className="font-medium text-text-secondary">
                    {task.subject || "Tugas"}
                  </span>
                  {task.deadline && (
                    <>
                      <span>·</span>
                      <span
                        className={cn(
                          "font-mono font-medium",
                          daysLeft !== null && daysLeft < 0 && task.status !== "selesai"
                            ? "text-rose-700 font-bold"
                            : daysLeft === 0
                            ? "text-amber-800 font-bold"
                            : "text-text-secondary"
                        )}
                      >
                        {formatDate(task.deadline)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {getStatusChip(task.status, task.deadline)}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTask(task);
                  }}
                  className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary active:scale-95"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </Card>

      {/* Floating Add Task CTA on Mobile */}
      <div className="fixed bottom-20 right-4 z-30 md:hidden">
        <Link href="/dashboard/tugas/baru">
          <Button
            size="lg"
            className="h-12 px-4 rounded-full shadow-xl bg-brand-500 hover:bg-brand-600 text-white gap-2 font-semibold text-xs active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tugas</span>
          </Button>
        </Link>
      </div>

      {/* Mobile Task Detail / Action Bottom Sheet */}
      {selectedTask && (
        <MobileBottomSheet
          isOpen={Boolean(selectedTask)}
          onClose={() => setSelectedTask(null)}
          title={selectedTask.title}
        >
          <div className="space-y-4 pt-1">
            {/* Task Info Summary */}
            <div className="p-3 rounded-xl bg-surface-secondary/50 border border-border/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-tertiary">Mata Kuliah</span>
                <span className="font-semibold text-text-primary">
                  {selectedTask.subject || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-tertiary">Dosen Pengampu</span>
                <span className="text-text-secondary">
                  {selectedTask.lecturer || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-tertiary">Tenggat Waktu</span>
                <span className="font-mono font-medium text-text-primary">
                  {selectedTask.deadline
                    ? formatDate(selectedTask.deadline)
                    : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-tertiary">Prioritas</span>
                <span className="font-semibold capitalize text-brand-500">
                  {selectedTask.priority || "Normal"}
                </span>
              </div>
              {selectedTask.description && (
                <div className="pt-2 border-t border-border/60">
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    {selectedTask.description}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Actions List */}
            <div className="space-y-1.5 pt-1">
              {selectedTask.status !== "selesai" ? (
                <Button
                  onClick={() => {
                    onUpdateStatus(selectedTask.id, "selesai");
                    setSelectedTask(null);
                  }}
                  className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tandai Sebagai Selesai</span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    onUpdateStatus(selectedTask.id, "belum_dikerjakan");
                    setSelectedTask(null);
                  }}
                  className="w-full h-11 rounded-xl font-semibold text-xs gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>Buka Kembali Tugas</span>
                </Button>
              )}

              {selectedTask.external_url && (
                <a
                  href={selectedTask.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-xl font-semibold text-xs gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Buka Tautan Tugas</span>
                  </Button>
                </a>
              )}

              <Button
                variant="outline"
                onClick={() => {
                  onEdit(selectedTask);
                  setSelectedTask(null);
                }}
                className="w-full h-11 rounded-xl font-semibold text-xs gap-2"
              >
                <Edit2 className="w-4 h-4 text-text-tertiary" />
                <span>Ubah Informasi Tugas</span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  onDelete(selectedTask.id);
                  setSelectedTask(null);
                }}
                className="w-full h-11 rounded-xl text-rose-500 hover:bg-rose-500/10 font-semibold text-xs gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Tugas Ini</span>
              </Button>
            </div>
          </div>
        </MobileBottomSheet>
      )}
    </div>
  );
}
