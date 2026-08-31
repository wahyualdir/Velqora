"use client";

import React from "react";
import {
  Calendar,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WorkloadSummary, WorkloadLevel } from "@/lib/schedule-intelligence/types";
import { ScheduleDay } from "@/types";
import { ACADEMIC_CONSTANTS } from "@/lib/schedule/academic-constants";

interface WorkloadIntelligenceTableProps {
  workload: WorkloadSummary | null;
  selectedDay?: string;
  onSelectDay?: (day: string) => void;
}

const ALL_DAYS: ScheduleDay[] = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

const WORKLOAD_CONFIG: Record<
  WorkloadLevel,
  { label: string; variant: "success" | "neutral" | "warning" | "danger" }
> = {
  RINGAN: { label: "Ringan", variant: "success" },
  NORMAL: { label: "Normal", variant: "neutral" },
  PADAT: { label: "Padat", variant: "warning" },
  SANGAT_PADAT: { label: "Sangat Padat (>6 Jam)", variant: "danger" },
};

export function WorkloadIntelligenceTable({
  workload,
  selectedDay,
  onSelectDay,
}: WorkloadIntelligenceTableProps) {
  if (!workload) {
    return (
      <div className="p-6 rounded-2xl border border-border bg-surface text-center space-y-2">
        <Calendar className="w-8 h-8 mx-auto text-text-muted" />
        <h3 className="text-sm font-semibold text-text-primary">Belum Ada Analisis Beban Belajar</h3>
        <p className="text-xs text-text-tertiary">
          Tambahkan jadwal perkuliahan untuk menghitung distribusi beban per hari.
        </p>
      </div>
    );
  }

  const hardCapMinutes = ACADEMIC_CONSTANTS.DAILY_WORKLOAD_HARD_CAP_MINUTES;

  return (
    <div className="rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-sm p-5 space-y-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-500" />
            <span>Distribusi & Kepadatan Beban Belajar Mingguan</span>
          </h3>
          <p className="text-xs text-text-tertiary">
            Batas keselamatan harian maksimal {Math.round(hardCapMinutes / 60)} jam ({hardCapMinutes} menit) untuk menjaga efektivitas kognitif.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-text-secondary">
          <span>Rata-rata: <strong className="text-text-primary">{Math.round(workload.averageDailyMinutes / 60 * 10) / 10} jam/hari</strong></span>
          <span>Total: <strong className="text-text-primary">{Math.round(workload.totalWeeklyMinutes / 60)} jam/minggu</strong></span>
        </div>
      </div>

      {/* Structured Clean Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-xs border-collapse min-w-[540px]">
          <thead>
            <tr className="border-b border-border/60 text-text-tertiary font-mono text-[11px]">
              <th className="py-2.5 px-3 font-semibold">Hari</th>
              <th className="py-2.5 px-3 font-semibold">Kuliah</th>
              <th className="py-2.5 px-3 font-semibold">Belajar Mandiri</th>
              <th className="py-2.5 px-3 font-semibold">Beban Harian / Batas 6 Jam</th>
              <th className="py-2.5 px-3 font-semibold text-right">Status Beban</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {ALL_DAYS.map((day) => {
              const stat = workload.dailyBreakdown[day];
              if (!stat) return null;

              const isSelected = selectedDay === day;
              const percentOfCap = Math.min(100, Math.round((stat.totalMinutes / hardCapMinutes) * 100));
              const cfg = WORKLOAD_CONFIG[stat.level] || WORKLOAD_CONFIG.NORMAL;
              const isOver = stat.isOverloaded;

              return (
                <tr
                  key={day}
                  onClick={() => onSelectDay?.(day)}
                  className={`transition-colors hover:bg-surface-secondary/50 cursor-pointer ${
                    isSelected ? "bg-brand-500/5 font-semibold" : ""
                  }`}
                >
                  {/* Hari */}
                  <td className="py-3 px-3">
                    <span className="font-semibold text-text-primary">{day}</span>
                  </td>

                  {/* Kuliah */}
                  <td className="py-3 px-3 font-mono text-text-secondary">
                    {stat.lecturesMinutes > 0 ? (
                      `${Math.round(stat.lecturesMinutes / 60 * 10) / 10}j (${stat.lecturesMinutes}m)`
                    ) : (
                      <span className="text-text-muted">-</span>
                    )}
                  </td>

                  {/* Belajar Mandiri */}
                  <td className="py-3 px-3 font-mono text-text-secondary">
                    {stat.studyMinutes > 0 ? (
                      `${Math.round(stat.studyMinutes / 60 * 10) / 10}j (${stat.studyMinutes}m)`
                    ) : (
                      <span className="text-text-muted">-</span>
                    )}
                  </td>

                  {/* Progress vs Hard Cap */}
                  <td className="py-3 px-3">
                    <div className="space-y-1 max-w-xs">
                      <div className="flex justify-between text-[11px] font-mono text-text-secondary">
                        <span>{stat.totalHours} jam</span>
                        <span className={isOver ? "text-rose-500 font-bold" : "text-text-tertiary"}>
                          {percentOfCap}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-surface-secondary overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isOver
                              ? "bg-rose-500"
                              : stat.level === "PADAT"
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${percentOfCap}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3 text-right">
                    <Badge variant={cfg.variant} size="sm">
                      {cfg.label}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
