"use client";

import React from "react";
import {
  Activity,
  Calendar,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Scale,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AcademicHealthScore } from "@/lib/schedule-orchestration/types";
import { HealthTrendReport } from "@/lib/schedule-outcomes/types";
import { WorkloadSummary, DeadlineAnalysisItem } from "@/lib/schedule-intelligence/types";

interface CurrentAcademicStateCardProps {
  health: AcademicHealthScore | null;
  healthTrend: HealthTrendReport | null;
  workload: WorkloadSummary | null;
  deadlines: DeadlineAnalysisItem[];
  conflictsCount: number;
}

export function CurrentAcademicStateCard({
  health,
  healthTrend,
  workload,
  deadlines,
  conflictsCount,
}: CurrentAcademicStateCardProps) {
  const healthScore = health ? health.overallScore : null;
  const overloadedDays = workload ? workload.overloadedDaysCount : 0;
  const urgentDeadlinesCount = deadlines.filter(
    (d) => d.urgency === "CRITICAL" || d.urgency === "URGENT"
  ).length;

  const getHealthStatus = () => {
    if (healthScore === null) return { label: "Belum Dihitung", variant: "neutral" as const };
    if (healthScore >= 85) return { label: "Sangat Sehat", variant: "success" as const };
    if (healthScore >= 70) return { label: "Sehat & Stabil", variant: "success" as const };
    if (healthScore >= 50) return { label: "Perlu Penyesuaian", variant: "warning" as const };
    return { label: "Risiko Beban", variant: "danger" as const };
  };

  const getWorkloadStatus = () => {
    if (!workload) return { label: "Memeriksa", variant: "neutral" as const };
    if (overloadedDays === 0) return { label: "Optimal", variant: "success" as const };
    if (overloadedDays === 1) return { label: `${overloadedDays} Hari Padat`, variant: "warning" as const };
    return { label: `${overloadedDays} Hari Sangat Padat`, variant: "danger" as const };
  };

  const healthStatus = getHealthStatus();
  const workloadStatus = getWorkloadStatus();

  return (
    <div className="rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-sm p-5 space-y-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider font-mono">
            Kondisi Akademik Saat Ini
          </h2>
          <p className="text-xs text-text-tertiary">
            Ringkasan kesehatan jadwal, beban harian, risiko batas waktu, dan integritas kalender.
          </p>
        </div>

        {healthTrend && (
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {healthTrend.trend === "IMPROVING" && (
              <Badge variant="success" size="sm" isMono className="gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Meningkat (+{healthTrend.scoreDelta})</span>
              </Badge>
            )}
            {healthTrend.trend === "DECLINING" && (
              <Badge variant="danger" size="sm" isMono className="gap-1">
                <TrendingDown className="w-3 h-3" />
                <span>Menurun ({healthTrend.scoreDelta})</span>
              </Badge>
            )}
            {healthTrend.trend === "STABLE" && (
              <Badge variant="neutral" size="sm" isMono className="gap-1">
                <Minus className="w-3 h-3" />
                <span>Stabil</span>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* 5 Compact Metric Columns */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Metric 1: Academic Health */}
        <div className="p-3 rounded-xl border border-border/60 bg-surface-secondary/40 space-y-1">
          <div className="flex items-center justify-between text-text-tertiary">
            <span className="text-[11px] font-medium">Academic Health</span>
            <Activity className="w-3.5 h-3.5 text-brand-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-text-primary">
              {healthScore !== null ? healthScore : "--"}
            </span>
            <span className="text-xs text-text-tertiary">/ 100</span>
          </div>
          <Badge variant={healthStatus.variant} size="sm">
            {healthStatus.label}
          </Badge>
        </div>

        {/* Metric 2: Workload */}
        <div className="p-3 rounded-xl border border-border/60 bg-surface-secondary/40 space-y-1">
          <div className="flex items-center justify-between text-text-tertiary">
            <span className="text-[11px] font-medium">Beban Mingguan</span>
            <Calendar className="w-3.5 h-3.5 text-sky-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-text-primary">
              {workload ? `${Math.round(workload.totalWeeklyMinutes / 60)}j` : "--"}
            </span>
            <span className="text-xs text-text-tertiary">/ pekan</span>
          </div>
          <Badge variant={workloadStatus.variant} size="sm">
            {workloadStatus.label}
          </Badge>
        </div>

        {/* Metric 3: Deadline Risk */}
        <div className="p-3 rounded-xl border border-border/60 bg-surface-secondary/40 space-y-1">
          <div className="flex items-center justify-between text-text-tertiary">
            <span className="text-[11px] font-medium">Tenggat Waktu</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-text-primary">
              {deadlines.length}
            </span>
            <span className="text-xs text-text-tertiary">tugas</span>
          </div>
          <Badge variant={urgentDeadlinesCount > 0 ? "warning" : "success"} size="sm">
            {urgentDeadlinesCount > 0 ? `${urgentDeadlinesCount} Mendesak` : "Terkendali"}
          </Badge>
        </div>

        {/* Metric 4: Conflict Status */}
        <div className="p-3 rounded-xl border border-border/60 bg-surface-secondary/40 space-y-1">
          <div className="flex items-center justify-between text-text-tertiary">
            <span className="text-[11px] font-medium">Integritas Jadwal</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-text-primary">
              {conflictsCount}
            </span>
            <span className="text-xs text-text-tertiary">bentrok</span>
          </div>
          <Badge variant={conflictsCount === 0 ? "success" : "danger"} size="sm">
            {conflictsCount === 0 ? "Nol Bentrok" : `${conflictsCount} Perlu Ditangani`}
          </Badge>
        </div>

        {/* Metric 5: Balance & Pacing */}
        <div className="p-3 rounded-xl border border-border/60 bg-surface-secondary/40 space-y-1 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-text-tertiary">
            <span className="text-[11px] font-medium">Keseimbangan</span>
            <Scale className="w-3.5 h-3.5 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-text-primary">
              {workload ? `${Math.round(workload.averageDailyMinutes / 60 * 10) / 10}j` : "--"}
            </span>
            <span className="text-xs text-text-tertiary">/ hari</span>
          </div>
          <Badge variant={overloadedDays === 0 ? "success" : "neutral"} size="sm">
            {overloadedDays === 0 ? "Seimbang" : "Distribusi Diperlukan"}
          </Badge>
        </div>
      </div>
    </div>
  );
}
