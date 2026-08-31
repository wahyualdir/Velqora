"use client";

import React from "react";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AcademicHealthScore } from "@/lib/schedule-orchestration/types";
import { HealthTrendReport } from "@/lib/schedule-outcomes/types";

interface AcademicHealthCardProps {
  health: AcademicHealthScore | null;
  healthTrend: HealthTrendReport | null;
}

export function AcademicHealthCard({ health, healthTrend }: AcademicHealthCardProps) {
  if (!health) {
    return (
      <div className="p-6 rounded-2xl border border-border bg-surface text-center space-y-2">
        <Activity className="w-8 h-8 mx-auto text-text-muted" />
        <h3 className="text-sm font-semibold text-text-primary">Belum Ada Data Kesehatan Akademik</h3>
        <p className="text-xs text-text-tertiary max-w-sm mx-auto">
          Tambahkan jadwal kuliah dan tugas untuk mengaktifkan perhitungan kesehatan akademik otomatis.
        </p>
      </div>
    );
  }

  const score = health.overallScore;
  const getScoreColor = () => {
    if (score >= 85) return "text-emerald-500 stroke-emerald-500";
    if (score >= 70) return "text-sky-500 stroke-sky-500";
    if (score >= 50) return "text-amber-500 stroke-amber-500";
    return "text-rose-500 stroke-rose-500";
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-sm p-5 space-y-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-500" />
            <span>Kesehatan Akademik & Tren Keseimbangan</span>
          </h3>
          <p className="text-xs text-text-tertiary">
            Evaluasi kuantitatif terhadap ritme belajar, alokasi istirahat, dan pencegahan kejenuhan.
          </p>
        </div>

        {healthTrend && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary">Tren Periode:</span>
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
                <span>Stabil (Delta {healthTrend.scoreDelta})</span>
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Score Ring Display (4 Cols) */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-surface-secondary/40 border border-border/60 text-center space-y-2">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-border stroke-current"
                strokeWidth="3.5"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`${getScoreColor()} transition-all duration-700 ease-out`}
                strokeDasharray={`${score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-bold font-mono text-text-primary tracking-tight">
                {score}
              </span>
              <span className="text-[10px] text-text-tertiary uppercase font-mono">
                dari 100
              </span>
            </div>
          </div>
          <div className="text-xs font-semibold text-text-primary">
            {score >= 80 ? "Kondisi Jadwal Sangat Baik" : score >= 60 ? "Kondisi Jadwal Cukup" : "Perlu Penyesuaian"}
          </div>
        </div>

        {/* Breakdown Factors (8 Cols) */}
        <div className="md:col-span-8 space-y-2.5">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider font-mono">
            Rincian Faktor Penilaian (Deterministik)
          </span>
          <div className="space-y-2">
            {health.factors.map((factor, idx) => {
              const maxFactorScore = factor.maxScore || 20;
              const percent = Math.round((factor.score / maxFactorScore) * 100);
              return (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-border/50 bg-surface flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-medium text-text-primary truncate">
                      {factor.name}
                    </div>
                    {factor.note && (
                      <p className="text-[11px] text-text-tertiary truncate">
                        {factor.note}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-16 sm:w-24 h-2 rounded-full bg-surface-secondary overflow-hidden hidden sm:block">
                      <div
                        className={`h-full rounded-full ${
                          percent >= 80 ? "bg-emerald-500" : percent >= 60 ? "bg-sky-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="font-mono font-semibold text-text-primary w-12 text-right">
                      {factor.score}/{maxFactorScore}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary Narration backed by evidence */}
      {health.summary && (
        <div className="p-3.5 rounded-xl border border-brand-500/20 bg-brand-500/5 flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed">
          <Info className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
          <p>{health.summary}</p>
        </div>
      )}
    </div>
  );
}
