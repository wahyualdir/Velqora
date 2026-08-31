"use client";

import { useState } from "react";
import { ScheduleItem } from "@/types";
import {
  OutcomeStatus,
  SkipReason,
  RescheduleReason,
} from "@/lib/schedule-outcomes/types";
import { recordSessionOutcomeAction } from "@/actions/schedule-actions";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Sparkles,
} from "lucide-react";

interface SessionFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: ScheduleItem | null;
  onSuccess: () => void;
}

export function SessionFeedbackModal({
  isOpen,
  onClose,
  session,
  onSuccess,
}: SessionFeedbackModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OutcomeStatus>("COMPLETED");
  const [actualDuration, setActualDuration] = useState<number>(60);
  const [skipReason, setSkipReason] = useState<SkipReason | "">("");
  const [rescheduleReason, setRescheduleReason] = useState<RescheduleReason | "">("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!session) return null;

  const plannedStart = session.start_time || "08:00";
  const plannedEnd = session.end_time || "09:30";

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      const res = await recordSessionOutcomeAction({
        scheduleItemId: session!.id,
        sessionTitle: session!.title || "Sesi Belajar",
        day: session!.day as any,
        plannedStartTime: plannedStart,
        plannedEndTime: plannedEnd,
        plannedDurationMinutes: 60,
        actualStartTime: selectedStatus === "COMPLETED" ? plannedStart : null,
        actualEndTime: selectedStatus === "COMPLETED" ? plannedEnd : null,
        actualDurationMinutes:
          selectedStatus === "COMPLETED"
            ? actualDuration
            : selectedStatus === "SKIPPED"
            ? 0
            : actualDuration,
        status: selectedStatus,
        skipReason: skipReason ? (skipReason as SkipReason) : null,
        rescheduleReason: rescheduleReason
          ? (rescheduleReason as RescheduleReason)
          : null,
        notes: notes || null,
      });

      if (res.success) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Failed to record outcome", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Catat Hasil Sesi Belajar"
      description={`Bagaimana kelangsungan sesi "${session.title || "Sesi Belajar"}" pada hari ${session.day}?`}
      size="md"
    >
      <div className="space-y-4 pt-2">
        {/* Status Selection Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setSelectedStatus("COMPLETED")}
            className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
              selectedStatus === "COMPLETED"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-surface-secondary/50 text-text-secondary hover:border-border/80"
            }`}
          >
            <div className="flex items-center gap-1.5 font-medium text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Selesai</span>
            </div>
            <p className="text-[11px] opacity-80">Sesi terlaksana sesuai rencana</p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus("PARTIALLY_COMPLETED")}
            className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
              selectedStatus === "PARTIALLY_COMPLETED"
                ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "border-border bg-surface-secondary/50 text-text-secondary hover:border-border/80"
            }`}
          >
            <div className="flex items-center gap-1.5 font-medium text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>Sebagian</span>
            </div>
            <p className="text-[11px] opacity-80">Selesai sebagian durasi</p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus("SKIPPED")}
            className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
              selectedStatus === "SKIPPED"
                ? "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                : "border-border bg-surface-secondary/50 text-text-secondary hover:border-border/80"
            }`}
          >
            <div className="flex items-center gap-1.5 font-medium text-xs">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Tidak Jadi</span>
            </div>
            <p className="text-[11px] opacity-80">Terlewat atau dibatalkan</p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus("RESCHEDULED")}
            className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
              selectedStatus === "RESCHEDULED"
                ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                : "border-border bg-surface-secondary/50 text-text-secondary hover:border-border/80"
            }`}
          >
            <div className="flex items-center gap-1.5 font-medium text-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>Pindahkan</span>
            </div>
            <p className="text-[11px] opacity-80">Digeser ke waktu lain</p>
          </button>
        </div>

        {/* Optional Partial Duration */}
        {selectedStatus === "PARTIALLY_COMPLETED" && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">
              Durasi Terlaksana (Menit)
            </label>
            <input
              type="number"
              min={5}
              max={300}
              value={actualDuration}
              onChange={(e) => setActualDuration(Number(e.target.value) || 0)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-surface text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}

        {/* Optional Skip Reason */}
        {selectedStatus === "SKIPPED" && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">
              Alasan Terlewat (Opsional)
            </label>
            <select
              value={skipReason}
              onChange={(e) => setSkipReason(e.target.value as SkipReason)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-surface text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">-- Pilih Alasan (Opsional) --</option>
              <option value="KULIAH_BERUBAH">Jadwal Kuliah Berubah</option>
              <option value="TERLALU_PADAT">Hari Terlalu Padat</option>
              <option value="TIDAK_SEMPAT">Tidak Sempat</option>
              <option value="KELELAHAN">Kelelahan / Perlu Istirahat</option>
              <option value="PREFERENSI_BERUBAH">Waktu Belajar Kurang Nyaman</option>
              <option value="LAINNYA">Lainnya</option>
            </select>
          </div>
        )}

        {/* Optional Reschedule Reason */}
        {selectedStatus === "RESCHEDULED" && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">
              Alasan Pemindahan (Opsional)
            </label>
            <select
              value={rescheduleReason}
              onChange={(e) =>
                setRescheduleReason(e.target.value as RescheduleReason)
              }
              className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-surface text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">-- Pilih Alasan (Opsional) --</option>
              <option value="BENTROK_MENDADAK">Bentrok Acara Mendadak</option>
              <option value="DEADLINE_MAJU">Deadline Tugas Dimajukan</option>
              <option value="WAKTU_LEBIH_LUANG">Memilih Waktu Lebih Luang</option>
              <option value="PERMINTAAN_PENGGUNA">Penyesuaian Pribadi</option>
              <option value="LAINNYA">Lainnya</option>
            </select>
          </div>
        )}

        {/* Optional Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">
            Catatan Tambahan (Opsional)
          </label>
          <input
            type="text"
            placeholder="Mis. selesai sampai bab 2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-surface text-text-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-text-tertiary"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-xs"
          >
            Batal
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="text-xs gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Menyimpan..." : "Simpan Catatan"}</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
