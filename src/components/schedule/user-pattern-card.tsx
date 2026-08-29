"use client";

import { useState, useEffect } from "react";
import {
  BehaviorSignal2,
  ActualVsPlannedReport,
  HealthTrendReport,
  PersonalizationFeedbackPrompt,
} from "@/lib/schedule-outcomes/types";
import {
  getActualVsPlannedAnalysisAction,
  getHealthTrendAction,
  getPersonalizationFeedbackAction,
} from "@/actions/schedule-actions";
import {
  Clock,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  Sparkles,
  Calendar,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserPatternCardProps {
  onOpenPreferences?: () => void;
}

export function UserPatternCard({ onOpenPreferences }: UserPatternCardProps) {
  const [adherenceReport, setAdherenceReport] =
    useState<ActualVsPlannedReport | null>(null);
  const [healthTrend, setHealthTrend] = useState<HealthTrendReport | null>(null);
  const [personalizationPrompt, setPersonalizationPrompt] =
    useState<PersonalizationFeedbackPrompt | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadPatternData() {
      setIsLoading(true);
      try {
        const [adhRes, trendRes, promptRes] = await Promise.all([
          getActualVsPlannedAnalysisAction(),
          getHealthTrendAction(),
          getPersonalizationFeedbackAction(),
        ]);

        if (adhRes.success && adhRes.report) {
          setAdherenceReport(adhRes.report);
        }
        if (trendRes.success && trendRes.report) {
          setHealthTrend(trendRes.report);
        }
        if (promptRes.success && promptRes.prompt) {
          setPersonalizationPrompt(promptRes.prompt);
        }
      } catch (err) {
        console.error("Failed to load user pattern data", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadPatternData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 rounded-xl border border-border bg-surface animate-pulse space-y-3">
        <div className="h-5 w-40 bg-surface-secondary rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-surface-secondary rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const completed = adherenceReport?.completedSessionsCount || 0;
  const skipped = adherenceReport?.skippedSessionsCount || 0;
  const rescheduled = adherenceReport?.rescheduledSessionsCount || 0;
  const adherenceIndex = adherenceReport?.scheduleAdherenceIndex;

  return (
    <div className="p-5 rounded-2xl border border-border/80 bg-surface/80 backdrop-blur-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              Pola Jadwal & Pembelajaran Nyata
            </h3>
            <p className="text-xs text-text-muted">
              Evaluasi hasil sesi belajar aktual dan tren kepatuhan jadwal
            </p>
          </div>
        </div>

        {healthTrend && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-border bg-surface-secondary">
            {healthTrend.trend === "IMPROVING" && (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            )}
            {healthTrend.trend === "DECLINING" && (
              <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
            )}
            {healthTrend.trend === "STABLE" && (
              <Minus className="w-3.5 h-3.5 text-blue-500" />
            )}
            <span>{healthTrend.statusLabel}</span>
          </div>
        )}
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl border border-border/50 bg-surface-secondary/50 space-y-1">
          <span className="text-[11px] font-medium text-text-muted flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Selesai
          </span>
          <p className="text-lg font-bold text-text-primary">
            {completed}{" "}
            <span className="text-xs font-normal text-text-muted">sesi</span>
          </p>
        </div>

        <div className="p-3 rounded-xl border border-border/50 bg-surface-secondary/50 space-y-1">
          <span className="text-[11px] font-medium text-text-muted flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-500" /> Terlewat
          </span>
          <p className="text-lg font-bold text-text-primary">
            {skipped}{" "}
            <span className="text-xs font-normal text-text-muted">sesi</span>
          </p>
        </div>

        <div className="p-3 rounded-xl border border-border/50 bg-surface-secondary/50 space-y-1">
          <span className="text-[11px] font-medium text-text-muted flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-500" /> Dipindahkan
          </span>
          <p className="text-lg font-bold text-text-primary">
            {rescheduled}{" "}
            <span className="text-xs font-normal text-text-muted">kali</span>
          </p>
        </div>

        <div className="p-3 rounded-xl border border-border/50 bg-surface-secondary/50 space-y-1">
          <span className="text-[11px] font-medium text-text-muted flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-primary" /> Kepatuhan
          </span>
          <p className="text-lg font-bold text-text-primary">
            {adherenceIndex !== "UNKNOWN" && adherenceIndex !== undefined
              ? `${adherenceIndex}%`
              : "Data Awal"}
          </p>
        </div>
      </div>

      {/* Personalization Divergence Alert (if any) */}
      {personalizationPrompt && personalizationPrompt.hasDivergence && (
        <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{personalizationPrompt.title}</span>
            </div>
            <p className="text-xs text-text-secondary">
              {personalizationPrompt.description}
            </p>
          </div>
          {onOpenPreferences && (
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenPreferences}
              className="text-xs border-amber-500/40 text-amber-700 dark:text-amber-300 shrink-0 hover:bg-amber-500/15"
            >
              Sesuaikan Preferensi
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
