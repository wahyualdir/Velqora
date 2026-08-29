"use client";

import React, { useState } from "react";
import {
  ClipboardList,
  Plus,
  Calendar,
  CheckCircle2,
  Circle,
  Trash2,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Textarea } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/dialog";
import { daysUntilDeadline, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export interface ClassTask {
  id: string;
  title: string;
  dueDate: string;
  points: number;
  description: string;
  isCompleted: boolean;
}

interface ClassTasksTabProps {
  tasks: ClassTask[];
  canManage: boolean;
  onAddTask: (task: ClassTask) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function ClassTasksTab({
  tasks,
  canManage,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: ClassTasksTabProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [points, setPoints] = useState("100");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Judul penugasan wajib diisi.");
      return;
    }

    const newTask: ClassTask = {
      id: "task-" + Date.now(),
      title: title.trim(),
      description: desc.trim(),
      dueDate: dueDate || new Date(Date.now() + 86400000 * 7).toISOString(),
      points: Number(points) || 100,
      isCompleted: false,
    };

    onAddTask(newTask);
    toast.success(`Penugasan "${newTask.title}" berhasil dibuat!`);
    setTitle("");
    setDesc("");
    setDueDate("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-text-secondary">
          Daftar Penugasan Kelas
        </h3>

        {canManage && (
          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="gap-1.5 text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Penugasan</span>
          </Button>
        )}
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="w-8 h-8" />}
          title="Belum ada tugas"
          description="Belum ada penugasan untuk kelas ini."
          action={
            canManage ? (
              <Button
                size="sm"
                onClick={() => setShowAddModal(true)}
                className="gap-1.5 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Buat Tugas Pertama</span>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const days = daysUntilDeadline(task.dueDate);
            let deadlineLabel = "";
            let deadlineVariant: "default" | "danger" | "warning" | "neutral" = "neutral";

            if (task.isCompleted) {
              deadlineLabel = "Selesai";
              deadlineVariant = "neutral";
            } else if (days !== null) {
              if (days < 0) {
                deadlineLabel = `Terlambat (${Math.abs(days)} hari lalu)`;
                deadlineVariant = "danger";
              } else if (days === 0) {
                deadlineLabel = "Jatuh tempo hari ini";
                deadlineVariant = "danger";
              } else if (days === 1) {
                deadlineLabel = "Besok";
                deadlineVariant = "warning";
              } else {
                deadlineLabel = `${days} hari lagi`;
                deadlineVariant = "neutral";
              }
            }

            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 rounded-xl border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs ${
                  task.isCompleted
                    ? "bg-surface/50 border-border/60 opacity-80"
                    : "bg-surface border-border hover:border-brand-500/40"
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => onToggleTask(task.id)}
                    className="mt-0.5 text-text-tertiary hover:text-brand-500 transition-colors cursor-pointer shrink-0"
                    title={task.isCompleted ? "Tandai belum selesai" : "Tandai tuntas"}
                    aria-label={`Ubah status penugasan ${task.title}`}
                  >
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-text-tertiary hover:text-brand-500" />
                    )}
                  </button>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant={task.isCompleted ? "success" : "secondary"}
                        className="text-[10px]"
                      >
                        {task.isCompleted ? "Selesai" : "Belum Selesai"}
                      </Badge>

                      <Badge variant="neutral" className="text-[10px] gap-1">
                        <Award className="w-3 h-3 text-amber-500" />
                        <span>{task.points} Poin</span>
                      </Badge>
                    </div>

                    <h4
                      className={`text-sm sm:text-base font-bold tracking-tight font-display ${
                        task.isCompleted ? "line-through text-text-tertiary" : "text-text-primary"
                      }`}
                    >
                      {task.title}
                    </h4>

                    {task.description && (
                      <p className="text-xs text-text-secondary line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] font-mono text-text-tertiary pt-0.5">
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
                        <span>{deadlineLabel || formatDate(task.dueDate)}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                {canManage && (
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => setDeleteId(task.id)}
                      className="p-2 rounded-lg border border-border bg-surface hover:bg-rose-500/10 hover:border-rose-500/30 text-text-tertiary hover:text-rose-500 transition-colors cursor-pointer"
                      title="Hapus Penugasan"
                      aria-label={`Hapus ${task.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Task Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Buat Penugasan Baru"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Judul Tugas *"
            placeholder="Contoh: Tugas Individu - Normalisasi Basis Data"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Tenggat Waktu (Deadline)"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <Input
              label="Bobot Nilai / Poin Maksimal"
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
            />
          </div>

          <Textarea
            label="Petunjuk & Kriteria Penilaian"
            placeholder="Tuliskan instruksi pengerjaan tugas, format berkas, dan rubrik penilaian..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddModal(false)}
            >
              Batal
            </Button>
            <Button type="submit" size="sm" className="font-semibold">
              Terbitkan Tugas
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            onDeleteTask(deleteId);
            setDeleteId(null);
            toast.success("Penugasan berhasil dihapus.");
          }
        }}
        title="Hapus Penugasan?"
        message="Apakah Anda yakin ingin menghapus tugas ini? Data pengumpulan tugas mahasiswa akan dihapus."
        confirmText="Hapus"
      />
    </div>
  );
}
