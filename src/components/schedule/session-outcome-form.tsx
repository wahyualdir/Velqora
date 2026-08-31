"use client";

import React, { useState } from "react";
import {
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OutcomeStatus } from "@/lib/schedule-outcomes/types";
import { ScheduleItem } from "@/types";
import { toast } from "sonner";
import { recordSessionOutcomeAction } from "@/actions/schedule-actions";

interface SessionOutcomeFormProps {
  session: ScheduleItem | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SessionOutcomeForm({
  session,
  onClose,
  onSuccess,
}: SessionOutcomeFormProps) {
  const [status, setStatus] = useState<OutcomeStatus>("COMPLETED");
  const [actualDurationMinutes, setActualDurationMinutes] = useState<number>(60);
  const [skipReason, setSkipReason] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!session) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await recordSessionOutcomeAction({
        scheduleItemId: session.id,
        sessionTitle: session.title,
        day: session.day as any,
        plannedStartTime: session.start_time || "14:00",
        plannedEndTime: session.end_time || "15:30",
        plannedDurationMinutes: 90,
        actualStartTime: session.start_time || "14:00",
        actualEndTime: session.end_time || "15:30",
        actualDurationMinutes: status === "SKIPPED" ? 0 : actualDurationMinutes,
        status,
        skipReason: status === "SKIPPED" ? (skipReason as any) : undefined,
        notes: notes.trim() || undefined,
      });

      if (res.success) {
        toast.success("Catatan hasil sesi belajar berhasil disimpan.");
        onSuccess?.();
        onClose();
      } else {
        toast.error(res.error || "Gagal mencatat hasil sesi.");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl border border-border max-w-md w-full p-5 space-y-4 shadow-xl animate-in fade-in-0 zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-text-primary">
              Catat Hasil Sesi Belajar
            </h3>
            <p className="text-xs text-text-tertiary">
              {session.title} ({session.day}, {session.time})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-secondary text-text-tertiary hover:text-text-primary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Status Selection */}
          <div className="space-y-1.5">
            <label className="font-semibold text-text-secondary">
              Bagaimana pelaksanaan sesi ini?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus("COMPLETED")}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  status === "COMPLETED"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold"
                    : "border-border bg-surface text-text-secondary hover:bg-surface-secondary"
                }`}
              >
                Selesai Penuh
              </button>
              <button
                type="button"
                onClick={() => setStatus("PARTIALLY_COMPLETED")}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  status === "PARTIALLY_COMPLETED"
                    ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold"
                    : "border-border bg-surface text-text-secondary hover:bg-surface-secondary"
                }`}
              >
                Sebagian
              </button>
              <button
                type="button"
                onClick={() => setStatus("SKIPPED")}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  status === "SKIPPED"
                    ? "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold"
                    : "border-border bg-surface text-text-secondary hover:bg-surface-secondary"
                }`}
              >
                Terlewat
              </button>
            </div>
          </div>

          {/* Actual Duration Input */}
          {status !== "SKIPPED" && (
            <div className="space-y-1.5">
              <label className="font-semibold text-text-secondary">
                Durasi Belajar Aktual (Menit):
              </label>
              <input
                type="number"
                min={5}
                max={360}
                value={actualDurationMinutes}
                onChange={(e) => setActualDurationMinutes(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-lg border border-border bg-surface text-xs font-mono text-text-primary focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          )}

          {/* Skip Reason */}
          {status === "SKIPPED" && (
            <div className="space-y-1.5">
              <label className="font-semibold text-text-secondary">
                Alasan Terlewat (Opsional):
              </label>
              <select
                value={skipReason}
                onChange={(e) => setSkipReason(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-surface text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="">Pilih Alasan</option>
                <option value="Kelelahan / Perlu Istirahat">Kelelahan / Perlu Istirahat</option>
                <option value="Ada Agenda Kuliah Pengganti">Ada Agenda Kuliah Pengganti</option>
                <option value="Tugas Sudah Selesai Lebih Awal">Tugas Sudah Selesai Lebih Awal</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          )}

          {/* Optional Notes */}
          <div className="space-y-1.5">
            <label className="font-semibold text-text-secondary">
              Catatan Pribadi (Opsional):
            </label>
            <input
              type="text"
              placeholder="Contoh: Menyelesaikan Bab 2 & 3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-border bg-surface text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs text-text-secondary cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="text-xs bg-brand-600 hover:bg-brand-700 text-white font-semibold cursor-pointer"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Catatan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
