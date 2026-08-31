"use client";

import React, { useState } from "react";
import {
  MapPin,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

interface ScheduleListItemProps {
  item: any;
  onToggleComplete?: (id: string) => void;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

export function ScheduleListItem({
  item,
  onToggleComplete,
  onEdit,
  onDelete,
}: ScheduleListItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isReminder = item.type === "reminder";
  const isClassroom = item.type === "classroom";
  const isCompleted = item.isCompleted;

  const priorityVariant: "danger" | "warning" | "neutral" =
    item.priority === "tinggi"
      ? "danger"
      : item.priority === "sedang"
      ? "warning"
      : "neutral";

  return (
    <Card
      padding="md"
      variant={isCompleted ? "subtle" : "default"}
      hover={!isCompleted}
      className={isCompleted ? "opacity-75" : ""}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        {/* Left: Time Timeline & Info */}
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          {/* Time Slot Box */}
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-surface-secondary border border-border shrink-0 min-w-[70px] text-center">
            <span className="text-[11px] font-bold uppercase font-mono text-brand-600 dark:text-brand-400">
              {item.day || "Hari"}
            </span>
            <span className="text-xs font-mono font-semibold text-text-primary">
              {item.time || "--:--"}
            </span>
          </div>

          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={priorityVariant}>
                {item.priority === "tinggi"
                  ? "Tinggi"
                  : item.priority === "sedang"
                  ? "Sedang"
                  : "Normal"}
              </Badge>

              <Badge variant={isReminder ? "info" : "secondary"}>
                {isReminder
                  ? "Pengingat"
                  : isClassroom
                  ? "Classroom"
                  : "Jadwal Kuliah"}
              </Badge>

              {item.subject && (
                <span className="text-[11px] font-semibold text-text-secondary">
                  {item.subject}
                </span>
              )}
            </div>

            <h3
              className={`text-sm sm:text-base font-bold font-display tracking-tight leading-snug ${
                isCompleted ? "line-through text-text-tertiary" : "text-text-primary"
              }`}
            >
              {item.title}
            </h3>

            <div className="flex items-center gap-3 text-[11px] font-mono text-text-tertiary flex-wrap pt-0.5">
              {item.location && (
                <span className="flex items-center gap-1 text-text-secondary font-sans">
                  <MapPin className="w-3 h-3 text-text-tertiary" />
                  <span>{item.location}</span>
                </span>
              )}

              {item.classroomUrl && (
                <a
                  href={item.classroomUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline font-sans"
                >
                  <span>Buka di Classroom</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60 w-full sm:w-auto justify-end">
          {isReminder && onToggleComplete && (
            <button
              type="button"
              onClick={() => onToggleComplete(item.id)}
              className="p-2 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-tertiary hover:text-brand-500 transition-colors cursor-pointer"
              title={isCompleted ? "Tandai belum selesai" : "Tandai tuntas"}
              aria-label="Ubah status pengingat"
            >
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => onEdit(item)}
            className="p-2 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
            title="Edit Agenda"
            aria-label={`Edit ${item.title}`}
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-lg border border-border bg-surface hover:bg-rose-500/10 hover:border-rose-500/30 text-text-tertiary hover:text-rose-500 transition-colors cursor-pointer"
            title="Hapus Agenda"
            aria-label={`Hapus ${item.title}`}
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
          onDelete(item.id);
        }}
        title="Hapus Agenda Ini?"
        message={`Apakah Anda yakin ingin menghapus "${item.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Agenda"
      />
    </Card>
  );
}
