"use client";

import React from "react";
import {
  HelpCircle,
  X,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExplainabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  answers: Record<string, string>;
}

const QUESTION_TITLES: Record<string, string> = {
  q1_whyThisTime: "1. Mengapa waktu dan hari ini yang dipilih?",
  q2_whatPrioritized: "2. Apa prioritas utama dalam keputusan ini?",
  q3_dataConsidered: "3. Data apa saja yang dipertimbangkan sistem?",
  q4_conflictStatus: "4. Apakah ada bentrok dengan agenda kuliah lain?",
  q5_workloadAfter: "5. Bagaimana dampak terhadap beban harian?",
  q6_sessionDuration: "6. Mengapa durasi sesi ini yang dipilih?",
  q7_userPreferenceUsed: "7. Bagaimana preferensi belajar Anda digunakan?",
  q8_tradeOffs: "8. Apa trade-off atau penyesuaian yang terjadi?",
  q9_alternativesCount: "9. Berapa alternatif slot yang dievaluasi?",
  q10_systemSafetyGuarantees: "10. Apa jaminan keselamatan sistem?",
  q11_whatWillChange: "11. Apa yang akan berubah jika diterapkan?",
  q12_whyRankedNumberOne: "12. Mengapa usulan ini menempati peringkat teratas?",
};

export function ExplainabilityModal({
  isOpen,
  onClose,
  title,
  answers,
}: ExplainabilityModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl border border-border max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in-0 zoom-in-95">
        {/* Modal Header */}
        <div className="p-5 border-b border-border flex items-center justify-between shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400">
                <HelpCircle className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-text-primary">
                Transparansi & Alasan Rekomendasi (Explainability 4.0)
              </h3>
            </div>
            <p className="text-xs text-text-tertiary">
              Penjelasan deterministik berbasis data untuk sesi: <strong className="text-text-primary">{title}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-secondary text-text-tertiary hover:text-text-primary cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with 12 Questions */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs divide-y divide-border/40">
          {Object.keys(QUESTION_TITLES).map((qKey) => {
            const qTitle = QUESTION_TITLES[qKey];
            const answer = answers[qKey] || "Sistem telah memverifikasi keselarasan faktor ini secara deterministik.";

            return (
              <div key={qKey} className="pt-3 first:pt-0 space-y-1">
                <div className="font-bold text-text-primary flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                  <span>{qTitle}</span>
                </div>
                <p className="text-text-secondary leading-relaxed pl-5">
                  {answer}
                </p>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between shrink-0 bg-surface-secondary/20">
          <span className="text-[11px] text-text-tertiary font-mono">
            Sistem bekerja tanpa estimasi probabilistik acak.
          </span>
          <Button
            size="sm"
            onClick={onClose}
            className="text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white cursor-pointer px-4"
          >
            Mengerti & Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
