"use client";

import { useState, useEffect } from "react";
import { ScheduleItem, Task } from "@/types";
import {
  AcademicHealthScore,
  EarlyWarningItem,
} from "@/lib/schedule-orchestration/types";
import {
  getAcademicHealthAction,
  getEarlyWarningsAction,
} from "@/actions/schedule-actions";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Sparkles,
  Sliders,
  TrendingUp,
} from "lucide-react";

interface ScheduleControlCenterProps {
  schedules: ScheduleItem[];
  tasks?: Task[];
  onOpenPreferences: () => void;
  onOpenOptimization: () => void;
  onOpenWhatIf: () => void;
}

export function ScheduleControlCenter({
  schedules,
  tasks = [],
  onOpenPreferences,
  onOpenOptimization,
  onOpenWhatIf,
}: ScheduleControlCenterProps) {
  const [health, setHealth] = useState<AcademicHealthScore | null>(null);
  const [warnings, setWarnings] = useState<EarlyWarningItem[]>([]);

  useEffect(() => {
    async function loadControlData() {
      try {
        const [healthRes, warnRes] = await Promise.all([
          getAcademicHealthAction(),
          getEarlyWarningsAction(),
        ]);
        if (healthRes.success && healthRes.health) {
          setHealth(healthRes.health);
        }
        if (warnRes.success && warnRes.warnings) {
          setWarnings(warnRes.warnings);
        }
      } catch (err) {
        console.error("Failed to load control center data", err);
      }
    }
    loadControlData();
  }, [schedules.length, tasks.length]);

  const getHealthBadge = (category: string) => {
    switch (category) {
      case "HEALTHY":
        return {
          label: "Sangat Sehat",
          bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
        };
      case "STABLE":
        return {
          label: "Stabil",
          bg: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        };
      case "ATTENTION":
        return {
          label: "Perlu Perhatian",
          bg: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800",
        };
      case "HIGH_RISK":
      case "CRITICAL":
        return {
          label: "Risiko Tinggi",
          bg: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800",
        };
      default:
        return {
          label: "Memeriksa",
          bg: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200",
        };
    }
  };

  const badgeInfo = health ? getHealthBadge(health.category) : getHealthBadge("");

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs mb-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Schedule Control Center
            </h3>
            {health && (
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${badgeInfo.bg}`}
              >
                {badgeInfo.label} ({health.overallScore}/100)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {health?.summary || "Memantau distribusi beban dan keselamatan akademik secara deterministik."}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenWhatIf}
            className="text-xs h-8 text-slate-700 dark:text-slate-300"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
            Simulasi What-If
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenOptimization}
            className="text-xs h-8 text-slate-700 dark:text-slate-300"
          >
            <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
            Optimasi Berkelanjutan
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenPreferences}
            className="text-xs h-8 text-slate-600 dark:text-slate-400"
          >
            <Sliders className="w-3.5 h-3.5 mr-1.5" />
            Preferensi
          </Button>
        </div>
      </div>

      {/* Health Factors Breakdown */}
      {health && health.factors && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-4">
          {health.factors.map((f, i) => (
            <div
              key={i}
              className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80"
            >
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                {f.name}
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {f.score}/{f.maxScore}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                    f.status === "BAIK"
                      ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40"
                      : f.status === "CUKUP"
                      ? "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40"
                      : "text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40"
                  }`}
                >
                  {f.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Early Warnings Panel (Only if warnings exist) */}
      {warnings.length > 0 && (
        <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            Perlu Perhatian Akademik ({warnings.length})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {warnings.map((w, idx) => (
              <div
                key={idx}
                className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 p-2.5 rounded-lg text-xs"
              >
                <div className="font-semibold text-amber-900 dark:text-amber-200">
                  {w.title}
                </div>
                <p className="text-amber-800/80 dark:text-amber-300/80 text-[11px] mt-0.5 line-clamp-2">
                  {w.explanation}
                </p>
                <div className="mt-1.5 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                  Saran: {w.suggestedAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
