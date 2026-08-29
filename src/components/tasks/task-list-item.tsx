"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Calendar,
  ExternalLink,
  Pencil,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/dialog";
import { formatDate, daysUntilDeadline } from "@/lib/utils";
import { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS } from "@/types";

interface TaskListItemProps {
  task: any;
  onUpdateStatus: (taskId: string, newStatus: string) => void;
  onEdit: (task: any) => void;
  onDelete: (id: string) => void;
}

export function TaskListItem({
  task,
  onUpdateStatus,
  onEdit,
  onDelete,
}: TaskListItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isCompleted = task.status === "selesai";
  const isInProgress = task.status === "sedang_dikerjakan";

  // Cycle status on check
  const handleToggle = () => {
    if (task.status === "belum_dikerjakan") {
      onUpdateStatus(task.id, "sedang_dikerjakan");
    } else if (task.status === "sedang_dikerjakan") {
      onUpdateStatus(task.id, "selesai");
    } else {
      onUpdateStatus(task.id, "belum_dikerjakan");
    }
  };

  // Human-readable deadline calculation
  const deadlineDays = task.deadline ? daysUntilDeadline(task.deadline) : null;
  let deadlineText = "";
  let deadlineVariant: "default" | "danger" | "warning" | "success" | "neutral" = "neutral";

  if (task.deadline) {
    if (isCompleted) {
      deadlineText = `Deadline: ${formatDate(task.deadline)}`;
      deadlineVariant = "neutral";
    } else if (deadlineDays !== null) {
      if (deadlineDays < 0) {
        deadlineText = `Terlambat (${Math.abs(deadlineDays)} hari lalu)`;
        deadlineVariant = "danger";
      } else if (deadlineDays === 0) {
        deadlineText = "Jatuh tempo hari ini";
        deadlineVariant = "danger";
      } else if (deadlineDays === 1) {
        deadlineText = "Besok";
        deadlineVariant = "warning";
      } else {
        deadlineText = `${deadlineDays} hari lagi`;
        deadlineVariant = "neutral";
      }
    }
  }

  // Semantic priority variant
  const priorityVariant: "danger" | "warning" | "neutral" =
    task.priority === "tinggi"
      ? "danger"
      : task.priority === "sedang"
      ? "warning"
      : "neutral";

  return (
    <div
      className={`rounded-xl border transition-colors shadow-2xs overflow-hidden ${
        isCompleted
          ? "bg-surface/50 border-border/60 opacity-80"
          : "bg-surface border-border hover:border-brand-500/40"
      }`}
    >
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        {/* Left: Checkbox & Task Info */}
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          {/* Status Checkbox / Cycle Button */}
          <button
            type="button"
            onClick={handleToggle}
            className="mt-0.5 text-text-tertiary hover:text-brand-500 transition-colors cursor-pointer shrink-0"
            title={
              isCompleted
                ? "Tandai belum selesai"
                : isInProgress
                ? "Tandai selesai"
                : "Mulai kerjakan tugas"
            }
            aria-label={`Ubah status tugas ${task.title}`}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : isInProgress ? (
              <Clock className="w-5 h-5 text-blue-500" />
            ) : (
              <Circle className="w-5 h-5 text-text-tertiary hover:text-brand-500" />
            )}
          </button>

          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Priority Badge */}
              <Badge variant={priorityVariant}>
                {TASK_PRIORITY_LABELS[task.priority as keyof typeof TASK_PRIORITY_LABELS] ||
                  task.priority}
              </Badge>

              {/* Status Badge */}
              <Badge
                variant={
                  isCompleted
                    ? "success"
                    : isInProgress
                    ? "info"
                    : "secondary"
                }
              >
                {TASK_STATUS_LABELS[task.status as keyof typeof TASK_STATUS_LABELS] ||
                  task.status}
              </Badge>

              {/* Subject / Course */}
              {task.subject && (
                <span className="text-[11px] font-semibold text-text-secondary">
                  {task.subject}
                </span>
              )}

              {/* Lecturer */}
              {task.lecturer && (
                <span className="text-[11px] text-text-tertiary">
                  • {task.lecturer}
                </span>
              )}
            </div>

            {/* Task Title */}
            <h3
              className={`text-sm sm:text-base font-bold font-display tracking-tight leading-snug ${
                isCompleted
                  ? "line-through text-text-tertiary"
                  : "text-text-primary"
              }`}
            >
              {task.title}
            </h3>

            {/* Description */}
            {task.description && (
              <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}

            {/* Deadline & Meta Info */}
            <div className="flex items-center gap-3 text-[11px] font-mono text-text-tertiary flex-wrap pt-0.5">
              {task.deadline && (
                <span
                  className={`inline-flex items-center gap-1 font-semibold ${
                    deadlineVariant === "danger"
                      ? "text-rose-500"
                      : deadlineVariant === "warning"
                      ? "text-amber-500"
                      : "text-text-secondary"
                  }`}
                >
                  <Calendar className="w-3 h-3" />
                  <span>{deadlineText}</span>
                </span>
              )}

              {task.external_url && (
                <a
                  href={task.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline font-sans"
                >
                  <span>Tautan Pengumpulan</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="p-2 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
            title="Edit Tugas"
            aria-label={`Edit tugas ${task.title}`}
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-lg border border-border bg-surface hover:bg-rose-500/10 hover:border-rose-500/30 text-text-tertiary hover:text-rose-500 transition-colors cursor-pointer"
            title="Hapus Tugas"
            aria-label={`Hapus tugas ${task.title}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDelete(task.id);
        }}
        title="Hapus Tugas Ini?"
        message={`Apakah Anda yakin ingin menghapus "${task.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Tugas"
      />
    </div>
  );
}
