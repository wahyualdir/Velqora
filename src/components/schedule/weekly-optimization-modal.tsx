"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Layers,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WeeklyOptimizationResult, WeeklyOptimizationProposal } from "@/lib/schedule-intelligence/types";
import { applyWeeklyOptimizationAction } from "@/actions/schedule-actions";
import { toast } from "sonner";

interface WeeklyOptimizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  optimizationResult: WeeklyOptimizationResult | null;
  onSuccess: () => void;
}

export function WeeklyOptimizationModal({
  isOpen,
  onClose,
  optimizationResult,
  onSuccess,
}: WeeklyOptimizationModalProps) {
  const [proposals, setProposals] = useState<WeeklyOptimizationProposal[]>(
    optimizationResult?.proposals || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state when optimizationResult updates
  React.useEffect(() => {
    if (optimizationResult?.proposals) {
      setProposals(optimizationResult.proposals);
    }
  }, [optimizationResult]);

  if (!optimizationResult) return null;

  const toggleProposal = (index: number) => {
    setProposals((prev) =>
      prev.map((p, idx) => (idx === index ? { ...p, selected: !p.selected } : p))
    );
  };

  const selectedCount = proposals.filter((p) => p.selected).length;

  const handleApply = async () => {
    if (selectedCount === 0) {
      toast.info("Pilih minimal satu usulan optimasi untuk diterapkan.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await applyWeeklyOptimizationAction(proposals);
      if (!res.success) {
        toast.error(res.error || "Gagal menerapkan optimasi mingguan.");
      } else {
        toast.success(`Berhasil memindahkan ${res.appliedCount} sesi belajar untuk menyeimbangkan beban.`);
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat menerapkan optimasi.");
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
      title="Optimasi Jadwal Mingguan Berkelanjutan"
      className="max-w-2xl"
    >
      <div className="space-y-4 text-xs">
        {/* Banner Summary */}
        <div className="p-3.5 rounded-xl border border-brand-500/30 bg-brand-500/10 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-brand-700 dark:text-brand-300">
              <Scale className="w-4 h-4 text-brand-500 shrink-0" />
              <span>Analisis Keseimbangan Beban Belajar</span>
            </div>
            <Badge variant="success" size="sm" isMono>
              Skor Perbaikan: {optimizationResult.improvementScore}/100
            </Badge>
          </div>
          <p className="text-text-secondary leading-relaxed">{optimizationResult.summary}</p>
        </div>

        {/* Proposals List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-text-primary">
              Usulan Pemindahan Sesi Belajar ({proposals.length}):
            </span>
            <span className="text-[11px] text-text-tertiary">
              {selectedCount} dari {proposals.length} dipilih
            </span>
          </div>

          {proposals.length === 0 ? (
            <div className="py-8 text-center text-text-tertiary">
              Jadwal mingguan Anda sudah terdistribusi dengan optimal. Tidak diperlukan pemindahan sesi.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {proposals.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleProposal(idx)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    p.selected
                      ? "border-brand-500/80 bg-surface shadow-2xs"
                      : "border-border/60 bg-surface/50 opacity-70"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={p.selected}
                        onChange={() => toggleProposal(idx)}
                        className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                      />
                      <h4 className="font-bold text-text-primary">{p.sessionTitle}</h4>
                    </div>
                    <Badge variant="neutral" size="sm" isMono>
                      {p.durationMinutes} Menit
                    </Badge>
                  </div>

                  {/* Move Details (From -> To) */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-secondary/40 border border-border/50 text-[11px]">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-rose-500 font-mono font-bold">Sebelumnya</span>
                      <div className="font-mono text-text-secondary">
                        {p.fromDay} {p.fromTime}
                      </div>
                    </div>

                    <ArrowRight className="w-3.5 h-3.5 text-brand-500 shrink-0" />

                    <div className="space-y-0.5 text-right">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                        Diusulkan ke
                      </span>
                      <div className="font-mono font-bold text-text-primary">
                        {p.toDay} {p.toTime}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-snug pl-6">{p.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Tutup
          </Button>

          {proposals.length > 0 && (
            <Button
              size="sm"
              onClick={handleApply}
              disabled={isSubmitting || selectedCount === 0}
              className="gap-1.5 font-semibold"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Menerapkan..." : `Terapkan (${selectedCount}) Optimasi`}</span>
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
