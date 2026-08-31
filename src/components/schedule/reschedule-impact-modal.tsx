"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RescheduleImpactReport } from "@/lib/schedule-intelligence/types";
import { applyRescheduleProposalAction } from "@/actions/schedule-actions";
import { toast } from "sonner";

interface RescheduleImpactModalProps {
  isOpen: boolean;
  onClose: () => void;
  impactReport: RescheduleImpactReport | null;
  onSuccess: () => void;
}

export function RescheduleImpactModal({
  isOpen,
  onClose,
  impactReport,
  onSuccess,
}: RescheduleImpactModalProps) {
  const [selectedAltIndex, setSelectedAltIndex] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!impactReport) return null;

  const { eventChanged, affectedStudySessions, recommendedAlternatives, humanSummary, hasImpact } = impactReport;

  const handleApply = async () => {
    if (!eventChanged.id) {
      toast.error("ID jadwal tidak ditemukan.");
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedAlt = recommendedAlternatives[selectedAltIndex];

      const payload: any = {
        changedEvent: {
          id: eventChanged.id,
          title: eventChanged.title,
          day: eventChanged.day,
          startTime: eventChanged.newStartTime,
          endTime: eventChanged.newEndTime,
        },
      };

      if (affectedStudySessions.length > 0 && selectedAlt) {
        payload.relocatedSession = {
          id: affectedStudySessions[0].id,
          day: selectedAlt.slot.day,
          startTime: selectedAlt.slot.startTime,
          endTime: selectedAlt.slot.endTime,
        };
      }

      const res = await applyRescheduleProposalAction(payload);

      if (!res.success) {
        toast.error(res.error || "Gagal menerapkan perubahan jadwal.");
      } else {
        toast.success("Perubahan jadwal dan relokasi sesi belajar berhasil diterapkan!");
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat menerapkan perubahan.");
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
      title="Analisis Dampak Perubahan Jadwal"
      className="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Human Summary Box */}
        <div
          className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
            hasImpact
              ? "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
          }`}
        >
          {hasImpact ? (
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          )}
          <p className="leading-relaxed">{humanSummary}</p>
        </div>

        {/* Before vs After Card */}
        <div className="p-3.5 rounded-xl border border-border/80 bg-surface space-y-2">
          <span className="text-xs font-bold text-text-primary">Perubahan Jam Kuliah:</span>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-secondary/40 border border-border/50 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] text-text-tertiary uppercase font-mono">Sebelumnya</span>
              <div className="font-mono text-text-secondary line-through">
                {eventChanged.previousTime || "Waktu Awal"}
              </div>
            </div>

            <ArrowRight className="w-4 h-4 text-brand-500" />

            <div className="space-y-0.5 text-right">
              <span className="text-[10px] text-brand-600 dark:text-brand-400 uppercase font-mono font-bold">
                Jadwal Baru
              </span>
              <div className="font-mono font-bold text-text-primary">
                {eventChanged.day} {eventChanged.newStartTime} - {eventChanged.newEndTime}
              </div>
            </div>
          </div>
        </div>

        {/* Affected Study Sessions & Alternatives */}
        {affectedStudySessions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-primary">
                Sesi Belajar Terdampak ({affectedStudySessions.length}):
              </span>
              <Badge variant="warning" size="sm">
                Perlu Dipindahkan
              </Badge>
            </div>

            {affectedStudySessions.map((session) => (
              <div
                key={session.id}
                className="p-3 rounded-xl border border-amber-500/30 bg-surface/60 text-xs space-y-1"
              >
                <div className="font-semibold text-text-primary">{session.title}</div>
                <div className="text-[11px] text-text-tertiary font-mono">
                  Waktu bentrok: {session.day} {session.start_time || session.time}
                </div>
              </div>
            ))}

            {/* Proposed Relocation Slots */}
            {recommendedAlternatives.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-text-primary">
                  Pilih Slot Alternatif Bebas Bentrok:
                </span>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {recommendedAlternatives.map((alt, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedAltIndex(idx)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                        selectedAltIndex === idx
                          ? "border-brand-500 bg-brand-500/5 shadow-2xs"
                          : "border-border bg-surface hover:border-border-hover"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="relocation_slot"
                            checked={selectedAltIndex === idx}
                            onChange={() => setSelectedAltIndex(idx)}
                            className="w-3.5 h-3.5 text-brand-600 focus:ring-brand-500"
                          />
                          <span className="text-xs font-bold text-text-primary font-mono">
                            {alt.slot.day} {alt.slot.startTime} - {alt.slot.endTime} ({alt.slot.durationMinutes}m)
                          </span>
                        </div>

                        <Badge
                          variant={alt.quality.score >= 80 ? "success" : "neutral"}
                          size="sm"
                          isMono
                        >
                          {alt.quality.score}/100 — {alt.quality.label}
                        </Badge>
                      </div>

                      <p className="text-[11px] text-text-secondary pl-5.5 leading-snug">
                        {alt.explanation.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>

          <Button
            size="sm"
            onClick={handleApply}
            disabled={isSubmitting}
            className="gap-1.5 font-semibold"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Menerapkan..." : "Terapkan Perubahan"}</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
