"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MissedSessionRecoveryReport, MissedSessionRecoveryOption } from "@/lib/schedule-intelligence/types";
import { applyMissedSessionRecoveryAction } from "@/actions/schedule-actions";
import { toast } from "sonner";

interface MissedSessionRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  recoveryReport: MissedSessionRecoveryReport | null;
  onSuccess: () => void;
}

export function MissedSessionRecoveryModal({
  isOpen,
  onClose,
  recoveryReport,
  onSuccess,
}: MissedSessionRecoveryModalProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string>("TODAY");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!recoveryReport) return null;

  const { session, missedDay, missedTime, options, explanation, hasSafeRecoverySlot } = recoveryReport;

  const selectedOption = options.find((o) => o.optionId === selectedOptionId) || options[0];

  const handleApply = async () => {
    if (!selectedOption || !session.id) {
      toast.error("Pilihan pemulihan tidak valid.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await applyMissedSessionRecoveryAction({
        sessionId: session.id,
        targetDay: selectedOption.day,
        startTime: selectedOption.startTime,
        endTime: selectedOption.endTime,
      });

      if (!res.success) {
        toast.error(res.error || "Gagal memulihkan sesi belajar.");
      } else {
        toast.success(`Sesi '${session.title}' berhasil dijadwalkan ulang ke ${selectedOption.day} ${selectedOption.startTime}.`);
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat memulihkan sesi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isSubmitting) onClose();
      }}
      title="Pemulihan Sesi Belajar Terlewat"
      className="max-w-xl"
    >
      <div className="space-y-4 text-xs">
        {/* Banner */}
        <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-1 text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Sesi Belajar &apos;{session.title}&apos; Terlewat</span>
          </div>
          <p className="text-text-secondary leading-relaxed">{explanation}</p>
        </div>

        {/* Options List */}
        {hasSafeRecoverySlot && (
          <div className="space-y-2">
            <label className="font-bold text-text-primary block">Pilih Opsi Jadwal Pengganti:</label>
            <div className="space-y-2">
              {options.map((opt) => (
                <div
                  key={opt.optionId}
                  onClick={() => setSelectedOptionId(opt.optionId)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1 ${
                    selectedOptionId === opt.optionId
                      ? "border-brand-500 bg-brand-500/5 shadow-2xs"
                      : "border-border bg-surface hover:border-border-hover"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="recovery_option"
                        checked={selectedOptionId === opt.optionId}
                        onChange={() => setSelectedOptionId(opt.optionId)}
                        className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="font-bold text-text-primary">{opt.title}</span>
                    </div>
                    <Badge variant={opt.isRecommended ? "success" : "neutral"} size="sm">
                      {opt.day} {opt.startTime}–{opt.endTime}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-text-secondary pl-6 leading-snug">{opt.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Abaikan
          </Button>

          {hasSafeRecoverySlot && (
            <Button
              size="sm"
              onClick={handleApply}
              disabled={isSubmitting || !selectedOption}
              className="gap-1.5 font-semibold"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Menjadwalkan..." : "Pulihkan Sesi Ini"}</span>
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
