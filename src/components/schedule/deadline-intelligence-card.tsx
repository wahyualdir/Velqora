"use client";

import React from "react";
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DeadlineAnalysisItem,
  DeadlineCoverageReport,
  DeadlineUrgency,
} from "@/lib/schedule-intelligence/types";

interface DeadlineIntelligenceCardProps {
  deadlines: DeadlineAnalysisItem[];
  coverageReports: DeadlineCoverageReport[];
  onOpenDailyPlan?: () => void;
}

const URGENCY_CONFIG: Record<
  DeadlineUrgency,
  { label: string; variant: "danger" | "warning" | "neutral" | "success" }
> = {
  CRITICAL: { label: "Kritis (<24 Jam)", variant: "danger" },
  URGENT: { label: "Mendesak (1–3 Hari)", variant: "warning" },
  UPCOMING: { label: "Mendekati (3–7 Hari)", variant: "neutral" },
  SAFE: { label: "Aman (>7 Hari)", variant: "success" },
  OVERDUE: { label: "Melewati Tenggat", variant: "danger" },
};

export function DeadlineIntelligenceCard({
  deadlines,
  coverageReports,
  onOpenDailyPlan,
}: DeadlineIntelligenceCardProps) {
  if (deadlines.length === 0) {
    return (
      <div className="rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-sm p-6 text-center space-y-2 shadow-2xs">
        <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
        <h3 className="text-sm font-semibold text-text-primary">Semua Tugas Berada dalam Batas Aman</h3>
        <p className="text-xs text-text-tertiary">
          Tidak ada tugas aktif dengan tenggat mendesak saat ini. Kalender belajar Anda terstruktur dengan baik.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-sm p-5 space-y-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-500" />
            <span>Intelijen Batas Waktu & Alokasi Waktu Belajar</span>
          </h3>
          <p className="text-xs text-text-tertiary">
            Perhitungan estimasi kecukupan alokasi belajar mandiri sebelum tenggat pengumpulan tugas.
          </p>
        </div>

        <span className="text-xs font-mono text-text-secondary">
          {deadlines.length} Tugas Terpantau
        </span>
      </div>

      <div className="space-y-3">
        {deadlines.map((task) => {
          const coverage = coverageReports.find((r) => r.taskTitle === task.title);
          const urgencyCfg = URGENCY_CONFIG[task.urgency] || URGENCY_CONFIG.UPCOMING;

          const plannedMinutes = coverage ? Math.round(coverage.hoursAvailable * 60) : 0;
          const targetMinutes = coverage ? Math.round(coverage.hoursNeeded * 60) : 120;
          const gapMinutes = coverage ? coverage.gapMinutes : 0;
          const hasEnoughTime = coverage ? coverage.status === "SUFFICIENT_TIME" : true;

          return (
            <div
              key={task.taskId}
              className="p-4 rounded-xl border border-border/60 bg-surface hover:border-border transition-colors space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <div className="font-semibold text-xs sm:text-sm text-text-primary truncate">
                    {task.title}
                  </div>
                  {task.subject && (
                    <div className="text-xs text-text-tertiary">
                      Mata Kuliah: <span className="font-medium text-text-secondary">{task.subject}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono text-text-tertiary">
                    {task.hoursRemaining !== undefined
                      ? task.hoursRemaining <= 24
                        ? `${task.hoursRemaining} jam lagi`
                        : `${Math.round(task.hoursRemaining / 24)} hari lagi`
                      : ""}
                  </span>
                  <Badge variant={urgencyCfg.variant} size="sm">
                    {urgencyCfg.label}
                  </Badge>
                </div>
              </div>

              {/* Coverage Progress Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-1 border-t border-border/40 text-xs">
                <div className="sm:col-span-8 space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-text-secondary">
                    <span>
                      Alokasi Belajar Terjadwal: <strong className="text-text-primary">{plannedMinutes}m</strong> / {targetMinutes}m
                    </span>
                    <span className={hasEnoughTime ? "text-emerald-500 font-semibold" : "text-amber-500 font-semibold"}>
                      {hasEnoughTime ? "Cakupan Terpenuhi" : `Kurang ${gapMinutes}m`}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        hasEnoughTime ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                      style={{
                        width: `${Math.min(100, Math.round((plannedMinutes / Math.max(1, targetMinutes)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="sm:col-span-4 text-right">
                  {!hasEnoughTime && onOpenDailyPlan && (
                    <button
                      type="button"
                      onClick={onOpenDailyPlan}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Alokasikan Waktu Belajar</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
