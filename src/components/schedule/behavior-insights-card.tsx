"use client";

import React from "react";
import {
  Layers,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BehaviorSignal2, ActualVsPlannedReport } from "@/lib/schedule-outcomes/types";
import { TimePatternType } from "@/lib/schedule-outcomes/types";

interface BehaviorInsightsCardProps {
  signals: BehaviorSignal2 | null;
  adherence: ActualVsPlannedReport | null;
  onOpenPreferences?: () => void;
}

const TIME_PATTERN_LABEL: Record<TimePatternType, string> = {
  MORNING: "Pagi Hari (06:00 – 11:00)",
  AFTERNOON: "Siang Hari (11:00 – 15:00)",
  EVENING: "Sore Hari (15:00 – 18:30)",
  NIGHT: "Malam Hari (18:30 – 23:00)",
  MIXED: "Kombinasi / Campuran",
  UNKNOWN: "Belum Teridentifikasi",
};

export function BehaviorInsightsCard({
  signals,
  adherence,
  onOpenPreferences,
}: BehaviorInsightsCardProps) {
  const isSufficientData = signals ? signals.isSufficientData : false;

  if (!signals || !isSufficientData) {
    return (
      <div className="rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-sm p-6 text-center space-y-3 shadow-2xs">
        <div className="w-10 h-10 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto">
          <Layers className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-text-primary">
            Belum Cukup Data untuk Mengenali Pola Belajar
          </h3>
          <p className="text-xs text-text-tertiary max-w-md mx-auto leading-relaxed">
            Sistem membutuhkan minimal 5 catatan hasil sesi belajar aktual untuk memetakan jendela waktu paling konsisten dan durasi belajar optimal Anda secara akurat.
          </p>
        </div>
        <div className="pt-1">
          <Badge variant="neutral" size="sm" isMono>
            {signals?.evaluatedSessionsCount || 0} / 5 Sesi Terkumpul
          </Badge>
        </div>
      </div>
    );
  }

  const windowLabel = TIME_PATTERN_LABEL[signals.observedTimePattern] || TIME_PATTERN_LABEL.UNKNOWN;
  const consistentDays = signals.mostConsistentDays.slice(0, 3).join(", ");
  const completedRatio = adherence?.averageCompletionRatioPercent !== "UNKNOWN"
    ? `${adherence?.averageCompletionRatioPercent}%`
    : `${signals.adherenceIndex}%`;

  return (
    <div className="rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-sm p-5 space-y-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-500" />
            <span>Pola & Kebiasaan Belajar Aktual (Observasi Nyata)</span>
          </h3>
          <p className="text-xs text-text-tertiary">
            Data empiris berbasis rekaman pelaksanaan sesi belajar nyata untuk menyempurnakan rekomendasi jadwal.
          </p>
        </div>

        <Badge variant="success" size="sm" isMono>
          {signals.evaluatedSessionsCount} Sesi Terekam
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Preferred Window */}
        <div className="p-3.5 rounded-xl border border-border/60 bg-surface space-y-1">
          <div className="flex items-center justify-between text-text-tertiary">
            <span className="text-[11px] font-medium">Jendela Waktu Teraktif</span>
            <Clock className="w-3.5 h-3.5 text-brand-500" />
          </div>
          <div className="text-sm font-bold text-text-primary">
            {signals.observedTimePattern !== "UNKNOWN" ? signals.observedTimePattern : "Variatif"}
          </div>
          <p className="text-[11px] text-text-secondary leading-tight">
            {windowLabel}
          </p>
        </div>

        {/* Metric 2: Effective Duration */}
        <div className="p-3.5 rounded-xl border border-border/60 bg-surface space-y-1">
          <div className="flex items-center justify-between text-text-tertiary">
            <span className="text-[11px] font-medium">Durasi Efektif Rata-Rata</span>
            <TrendingUp className="w-3.5 h-3.5 text-brand-500" />
          </div>
          <div className="text-sm font-bold font-mono text-text-primary">
            {signals.preferredEffectiveDurationMinutes} Menit
          </div>
          <p className="text-[11px] text-text-secondary leading-tight">
            Durasi fokus riil per sesi belajar
          </p>
        </div>

        {/* Metric 3: Most Consistent Days */}
        <div className="p-3.5 rounded-xl border border-border/60 bg-surface space-y-1">
          <div className="flex items-center justify-between text-text-tertiary">
            <span className="text-[11px] font-medium">Hari Paling Konsisten</span>
            <Calendar className="w-3.5 h-3.5 text-brand-500" />
          </div>
          <div className="text-sm font-bold text-text-primary truncate">
            {consistentDays || "Semua Hari"}
          </div>
          <p className="text-[11px] text-text-secondary leading-tight">
            Tingkat eksekusi sesi tertinggi
          </p>
        </div>

        {/* Metric 4: Adherence Index */}
        <div className="p-3.5 rounded-xl border border-border/60 bg-surface space-y-1">
          <div className="flex items-center justify-between text-text-tertiary">
            <span className="text-[11px] font-medium">Indeks Kepatuhan Jadwal</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
          </div>
          <div className="text-sm font-bold font-mono text-text-primary">
            {completedRatio}
          </div>
          <p className="text-[11px] text-text-secondary leading-tight">
            Rasio penyelesaian rencana vs realisasi
          </p>
        </div>
      </div>
    </div>
  );
}
