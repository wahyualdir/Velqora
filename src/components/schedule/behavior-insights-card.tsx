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
import { Card, CardStat } from "@/components/ui/card";
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
}: BehaviorInsightsCardProps) {
  const isSufficientData = signals ? signals.isSufficientData : false;

  if (!signals || !isSufficientData) {
    return (
      <Card padding="md" variant="subtle" className="text-center space-y-2">
        <div className="w-9 h-9 rounded-xl bg-surface-secondary flex items-center justify-center mx-auto text-text-tertiary">
          <HelpCircle className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-text-primary">
            Belum Cukup Data Kebiasaan Belajar
          </h3>
          <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
            Sistem membutuhkan minimal 5 catatan hasil sesi belajar aktual untuk memetakan jendela waktu paling konsisten dan durasi belajar optimal Anda secara akurat.
          </p>
        </div>
        <div className="pt-1">
          <Badge variant="neutral" size="sm" isMono>
            {signals?.evaluatedSessionsCount || 0} / 5 Sesi Terkumpul
          </Badge>
        </div>
      </Card>
    );
  }

  const windowLabel = TIME_PATTERN_LABEL[signals.observedTimePattern] || TIME_PATTERN_LABEL.UNKNOWN;
  const consistentDays = signals.mostConsistentDays.slice(0, 3).join(", ");
  const completedRatio = adherence?.averageCompletionRatioPercent !== "UNKNOWN"
    ? `${adherence?.averageCompletionRatioPercent}%`
    : `${signals.adherenceIndex}%`;

  return (
    <Card padding="md" className="space-y-4">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-fr">
        {/* Metric 1: Preferred Window */}
        <CardStat
          icon={Clock}
          label="Jendela Waktu Teraktif"
          value={signals.observedTimePattern !== "UNKNOWN" ? signals.observedTimePattern : "Variatif"}
          hint={windowLabel}
        />

        {/* Metric 2: Effective Duration */}
        <CardStat
          icon={TrendingUp}
          label="Durasi Efektif Rata-Rata"
          value={`${signals.preferredEffectiveDurationMinutes} Menit`}
          hint="Durasi fokus riil per sesi belajar"
          isMono
        />

        {/* Metric 3: Most Consistent Days */}
        <CardStat
          icon={Calendar}
          label="Hari Paling Konsisten"
          value={consistentDays || "Semua Hari"}
          hint="Tingkat eksekusi sesi tertinggi"
        />

        {/* Metric 4: Adherence Index */}
        <CardStat
          icon={CheckCircle2}
          label="Indeks Kepatuhan Jadwal"
          value={completedRatio}
          hint="Rasio penyelesaian rencana vs realisasi"
          isMono
        />
      </div>
    </Card>
  );
}
