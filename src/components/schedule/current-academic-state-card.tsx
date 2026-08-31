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
import { Card, CardStat } from "@/components/ui/card";
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
  const urgentDeadlinesCount = deadlines.filter(
    (d) => d.urgency === "URGENT" || d.urgency === "OVERDUE"
  ).length;
  const overloadedDays = workload ? workload.overloadedDaysCount : 0;

  const getHealthStatus = () => {
    if (healthScore === null) return { label: "Menganalisis", variant: "neutral" as const };
    if (healthScore >= 80) return { label: "Prima", variant: "success" as const };
    if (healthScore >= 60) return { label: "Perhatian", variant: "warning" as const };
    return { label: "Kritis", variant: "danger" as const };
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
    <Card padding="md" className="space-y-4">
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 auto-rows-fr">
        {/* Metric 1: Academic Health */}
        <CardStat
          icon={Activity}
          label="Academic Health"
          value={healthScore !== null ? healthScore : "--"}
          badge={
            <Badge variant={healthStatus.variant} size="sm">
              {healthStatus.label}
            </Badge>
          }
          isMono
        />

        {/* Metric 2: Workload */}
        <CardStat
          icon={Calendar}
          label="Beban Mingguan"
          value={workload ? `${Math.round(workload.totalWeeklyMinutes / 60)}j` : "--"}
          badge={
            <Badge variant={workloadStatus.variant} size="sm">
              {workloadStatus.label}
            </Badge>
          }
          isMono
        />

        {/* Metric 3: Deadline Risk */}
        <CardStat
          icon={Clock}
          label="Tenggat Waktu"
          value={deadlines.length}
          badge={
            <Badge variant={urgentDeadlinesCount > 0 ? "warning" : "success"} size="sm">
              {urgentDeadlinesCount > 0 ? `${urgentDeadlinesCount} Mendesak` : "Terkendali"}
            </Badge>
          }
          isMono
        />

        {/* Metric 4: Conflict Status */}
        <CardStat
          icon={ShieldCheck}
          label="Integritas Jadwal"
          value={conflictsCount}
          badge={
            <Badge variant={conflictsCount === 0 ? "success" : "danger"} size="sm">
              {conflictsCount === 0 ? "Nol Bentrok" : `${conflictsCount} Bentrok`}
            </Badge>
          }
          isMono
        />

        {/* Metric 5: Balance & Pacing */}
        <div className="col-span-2 md:col-span-1 h-full">
          <CardStat
            icon={Scale}
            label="Keseimbangan"
            value={workload ? `${Math.round(workload.averageDailyMinutes / 60 * 10) / 10}j` : "--"}
            badge={
              <Badge variant={overloadedDays === 0 ? "success" : "neutral"} size="sm">
                {overloadedDays === 0 ? "Seimbang" : "Perlu Distribusi"}
              </Badge>
            }
            isMono
          />
        </div>
      </div>
    </Card>
  );
}
