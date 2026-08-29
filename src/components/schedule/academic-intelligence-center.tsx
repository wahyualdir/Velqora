"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  Activity,
  Calendar,
  Clock,
  Layers,
  Sliders,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAcademicIntelligenceCenterDataAction,
  simulateThreeWayOutcomeAction,
  applyOrchestratedProposalAction,
  recordRecommendationFeedbackAction,
  AcademicIntelligenceCenterData,
} from "@/actions/schedule-actions";
import { CurrentAcademicStateCard } from "./current-academic-state-card";
import { AcademicHealthCard } from "./academic-health-card";
import { WorkloadIntelligenceTable } from "./workload-intelligence-table";
import { DeadlineIntelligenceCard } from "./deadline-intelligence-card";
import { BehaviorInsightsCard } from "./behavior-insights-card";
import { RecommendationsCenter } from "./recommendations-center";
import { WhatIfSimulatorView } from "./what-if-simulator-view";
import { EarlyWarningBanner } from "./early-warning-banner";
import { RecommendationHistoryTable } from "./recommendation-history-table";
import { ExplainabilityModal } from "./explainability-modal";
import { SessionOutcomeForm } from "./session-outcome-form";
import { SchedulePreferencesModal } from "./schedule-preferences-modal";
import { ThreeWayWhatIfResult } from "@/lib/schedule-outcomes/types";
import { ScheduleItem } from "@/types";
import { toast } from "sonner";

export function AcademicIntelligenceCenter() {
  const [data, setData] = useState<AcademicIntelligenceCenterData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "workload" | "deadlines" | "behavior" | "recommendations" | "whatif" | "history"
  >("overview");

  // Modals & Drawers
  const [showPreferences, setShowPreferences] = useState(false);
  const [selectedExplainItem, setSelectedExplainItem] = useState<{
    title: string;
    answers: Record<string, string>;
  } | null>(null);
  const [outcomeSession, setOutcomeSession] = useState<ScheduleItem | null>(null);
  const [threeWayResult, setThreeWayResult] = useState<ThreeWayWhatIfResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const loadIntelligenceData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getAcademicIntelligenceCenterDataAction();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError(res.error || "Gagal memuat data pusat intelijen.");
      }
    } catch {
      setError("Terjadi kesalahan saat memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIntelligenceData();
  }, [loadIntelligenceData]);

  // Handle What-If Simulation
  const handleSimulate = async (
    action: "MOVE_ITEM" | "DELETE_ITEM",
    itemId: string,
    targetDay?: string,
    targetTime?: string
  ) => {
    setIsSimulating(true);
    try {
      const startTime = targetTime?.split(" - ")[0] || "14:00";
      const endTime = targetTime?.split(" - ")[1] || "15:30";

      const res = await simulateThreeWayOutcomeAction({
        action,
        itemId,
        targetDay: targetDay as any,
        targetStartTime: startTime,
        targetEndTime: endTime,
      });

      if (res.success && res.result) {
        setThreeWayResult(res.result);
        toast.success("Simulasi 3 arah berhasil dihitung.");
      } else {
        toast.error(res.error || "Gagal menjalankan simulasi.");
      }
    } catch {
      toast.error("Terjadi kegagalan jaringan saat simulasi.");
    } finally {
      setIsSimulating(false);
    }
  };

  // Handle Review & Apply Recommendation via Approval Gate
  const handleReviewRecommendation = async (rec: any) => {
    if (!data?.proposal) {
      toast.error("Usulan optimasi tidak ditemukan.");
      return;
    }

    const confirmApply = window.confirm(
      `Apakah Anda ingin menerapkan pemindahan sesi "${rec.title}" ke hari ${rec.toDay} (${rec.toTime})?`
    );

    if (confirmApply) {
      try {
        const applyRes = await applyOrchestratedProposalAction(data.proposal);
        if (applyRes.success) {
          await recordRecommendationFeedbackAction(rec.id, true);
          toast.success("Rekomendasi jadwal berhasil diterapkan secara aman!");
          loadIntelligenceData();
        } else {
          toast.error(applyRes.error || "Gagal menerapkan rekomendasi.");
        }
      } catch {
        toast.error("Terjadi kesalahan saat menerapkan rekomendasi.");
      }
    }
  };

  if (isLoading && !data) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="h-8 w-64 bg-surface-secondary rounded-lg" />
        <div className="h-28 bg-surface-secondary rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-64 bg-surface-secondary rounded-2xl" />
          <div className="h-64 bg-surface-secondary rounded-2xl" />
          <div className="h-64 bg-surface-secondary rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-text-primary">Gagal Memuat Intelijen Akademik</h2>
        <p className="text-xs text-text-tertiary">{error}</p>
        <Button onClick={loadIntelligenceData} size="sm" className="gap-2">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Coba Lagi</span>
        </Button>
      </div>
    );
  }

  const conflictsCount = 0; // Handled strictly by conflict engine
  const earlyWarnings = data?.earlyWarnings || [];

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/jadwal"
              className="inline-flex items-center gap-1 text-xs text-text-tertiary hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Jadwal</span>
            </Link>
            <span className="text-text-muted">•</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase font-mono bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded border border-brand-500/20">
              <Activity className="w-3 h-3" />
              <span>Intelligence Center</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight font-display">
            Pusat Intelijen & Observabilitas Akademik
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-3xl">
            Pusat observasi real-time untuk memantau kesehatan jadwal, mendeteksi penumpukan beban, dan melihat transparansi rekomendasi otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPreferences(true)}
            className="text-xs gap-1.5 h-8.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Preferensi</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={loadIntelligenceData}
            className="text-xs gap-1.5 h-8.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Segarkan Data</span>
          </Button>

          {data?.schedules && data.schedules.length > 0 && (
            <Button
              size="sm"
              onClick={() => setOutcomeSession(data.schedules[0])}
              className="text-xs gap-1.5 h-8.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Catat Hasil Sesi</span>
            </Button>
          )}
        </div>
      </div>

      {/* Early Warning Banner */}
      {earlyWarnings.length > 0 && (
        <EarlyWarningBanner
          warnings={earlyWarnings}
          onActionClick={() => setActiveTab("recommendations")}
        />
      )}

      {/* Current Academic State Overview (Compact 5-metric view) */}
      <CurrentAcademicStateCard
        health={data?.health || null}
        healthTrend={data?.healthTrend || null}
        workload={data?.workload || null}
        deadlines={data?.deadlines || []}
        conflictsCount={conflictsCount}
      />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-border/60 overflow-x-auto pb-px">
        {[
          { id: "overview", label: "Ringkasan Lengkap", icon: <Activity className="w-3.5 h-3.5" /> },
          { id: "workload", label: "Beban Belajar", icon: <Calendar className="w-3.5 h-3.5" /> },
          { id: "deadlines", label: "Intelijen Deadline", icon: <Clock className="w-3.5 h-3.5" /> },
          { id: "behavior", label: "Pola Aktual", icon: <Layers className="w-3.5 h-3.5" /> },
          { id: "recommendations", label: "Rekomendasi Cerdas", icon: <Sparkles className="w-3.5 h-3.5" /> },
          { id: "whatif", label: "Simulator 3-Arah", icon: <Sliders className="w-3.5 h-3.5" /> },
          { id: "history", label: "Riwayat & Efektivitas", icon: <TrendingUp className="w-3.5 h-3.5" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-500/5"
                  : "border-transparent text-text-tertiary hover:text-text-primary hover:bg-surface-secondary/40"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
              <AcademicHealthCard
                health={data?.health || null}
                healthTrend={data?.healthTrend || null}
              />
            </div>
            <div className="lg:col-span-6">
              <BehaviorInsightsCard
                signals={data?.behaviorSignals || null}
                adherence={data?.adherenceReport || null}
                onOpenPreferences={() => setShowPreferences(true)}
              />
            </div>
          </div>

          <RecommendationsCenter
            recommendations={data?.topRecommendations || []}
            onReviewRecommendation={handleReviewRecommendation}
            onExplainRecommendation={(rec) =>
              setSelectedExplainItem({
                title: rec.title,
                answers: rec.explanationAnswers,
              })
            }
          />

          <WorkloadIntelligenceTable
            workload={data?.workload || null}
          />

          <DeadlineIntelligenceCard
            deadlines={data?.deadlines || []}
            coverageReports={data?.deadlineCoverage || []}
          />
        </div>
      )}

      {activeTab === "workload" && (
        <div className="space-y-6">
          <WorkloadIntelligenceTable
            workload={data?.workload || null}
          />
        </div>
      )}

      {activeTab === "deadlines" && (
        <div className="space-y-6">
          <DeadlineIntelligenceCard
            deadlines={data?.deadlines || []}
            coverageReports={data?.deadlineCoverage || []}
          />
        </div>
      )}

      {activeTab === "behavior" && (
        <div className="space-y-6">
          <BehaviorInsightsCard
            signals={data?.behaviorSignals || null}
            adherence={data?.adherenceReport || null}
            onOpenPreferences={() => setShowPreferences(true)}
          />
        </div>
      )}

      {activeTab === "recommendations" && (
        <div className="space-y-6">
          <RecommendationsCenter
            recommendations={data?.topRecommendations || []}
            onReviewRecommendation={handleReviewRecommendation}
            onExplainRecommendation={(rec) =>
              setSelectedExplainItem({
                title: rec.title,
                answers: rec.explanationAnswers,
              })
            }
          />
        </div>
      )}

      {activeTab === "whatif" && (
        <div className="space-y-6">
          <WhatIfSimulatorView
            schedules={data?.schedules || []}
            threeWayResult={threeWayResult}
            onSimulate={handleSimulate}
            isLoading={isSimulating}
          />
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-6">
          <RecommendationHistoryTable
            history={data?.recommendationHistory || []}
            summary={data?.recommendationSummary}
          />
        </div>
      )}

      {/* Preferences Modal */}
      <SchedulePreferencesModal
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        onSaved={loadIntelligenceData}
      />

      {/* Explainability 4.0 Modal */}
      {selectedExplainItem && (
        <ExplainabilityModal
          isOpen={!!selectedExplainItem}
          onClose={() => setSelectedExplainItem(null)}
          title={selectedExplainItem.title}
          answers={selectedExplainItem.answers}
        />
      )}

      {/* Outcome Feedback Modal */}
      {outcomeSession && (
        <SessionOutcomeForm
          session={outcomeSession}
          onClose={() => setOutcomeSession(null)}
          onSuccess={loadIntelligenceData}
        />
      )}
    </div>
  );
}
