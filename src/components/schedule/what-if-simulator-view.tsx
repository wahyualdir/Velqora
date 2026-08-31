"use client";

import React, { useState } from "react";
import {
  Sliders,
  ShieldCheck,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThreeWayWhatIfResult } from "@/lib/schedule-outcomes/types";
import { ScheduleItem } from "@/types";

interface WhatIfSimulatorViewProps {
  schedules: ScheduleItem[];
  threeWayResult?: ThreeWayWhatIfResult | null;
  onSimulate?: (action: "MOVE_ITEM" | "DELETE_ITEM", itemId: string, targetDay?: string, targetTime?: string) => Promise<void>;
  isLoading?: boolean;
}

export function WhatIfSimulatorView({
  schedules,
  threeWayResult,
  onSimulate,
  isLoading = false,
}: WhatIfSimulatorViewProps) {
  const [selectedItemId, setSelectedItemId] = useState<string>(schedules[0]?.id || "");
  const [selectedTargetDay, setSelectedTargetDay] = useState<string>("Rabu");
  const [selectedStartTime, setSelectedStartTime] = useState<string>("14:00");
  const [selectedEndTime, setSelectedEndTime] = useState<string>("15:30");

  const handleRunSimulation = async () => {
    if (!selectedItemId || !onSimulate) return;
    await onSimulate("MOVE_ITEM", selectedItemId, selectedTargetDay, `${selectedStartTime} - ${selectedEndTime}`);
  };

  const scA = threeWayResult?.scenarioA;
  const scB = threeWayResult?.scenarioB;
  const scC = threeWayResult?.scenarioC;
  const best = threeWayResult?.bestScenario;

  return (
    <div className="rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-sm p-5 space-y-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand-500" />
            <span>Simulator Dampak 3-Arah (What-If Outcome Simulator)</span>
          </h3>
          <p className="text-xs text-text-tertiary">
            Evaluasi perbandingan skenario secara instan di memori (100% bebas efek samping dan tanpa mengubah database).
          </p>
        </div>

        <Badge variant="success" size="sm" isMono className="gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Side-Effect Free</span>
        </Badge>
      </div>

      {/* Control Input Row */}
      {schedules.length > 0 && onSimulate && (
        <div className="p-4 rounded-xl border border-border/60 bg-surface-secondary/30 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-text-tertiary uppercase font-mono">
              Pilih Agenda / Sesi:
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full h-8 px-2.5 rounded-lg border border-border bg-surface text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {schedules.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.day}, {s.time})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-text-tertiary uppercase font-mono">
              Pindah ke Hari:
            </label>
            <select
              value={selectedTargetDay}
              onChange={(e) => setSelectedTargetDay(e.target.value)}
              className="w-full h-8 px-2.5 rounded-lg border border-border bg-surface text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-text-tertiary uppercase font-mono">
              Waktu Simulasi:
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="time"
                value={selectedStartTime}
                onChange={(e) => setSelectedStartTime(e.target.value)}
                className="w-full h-8 px-2 rounded-lg border border-border bg-surface text-xs text-text-primary font-mono"
              />
              <span className="text-text-muted">-</span>
              <input
                type="time"
                value={selectedEndTime}
                onChange={(e) => setSelectedEndTime(e.target.value)}
                className="w-full h-8 px-2 rounded-lg border border-border bg-surface text-xs text-text-primary font-mono"
              />
            </div>
          </div>

          <Button
            size="sm"
            onClick={handleRunSimulation}
            disabled={isLoading || !selectedItemId}
            className="w-full h-8 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white cursor-pointer"
          >
            {isLoading ? "Menghitung..." : "Jalankan Simulasi"}
          </Button>
        </div>
      )}

      {/* 3-Column Scenario Comparison Matrix */}
      {threeWayResult && scA && scB && scC && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Scenario A: Current */}
            <div
              className={`p-4 rounded-xl border bg-surface space-y-3 transition-all ${
                best === "SCENARIO_A_CURRENT"
                  ? "border-emerald-500/60 ring-1 ring-emerald-500/20"
                  : "border-border/60"
              }`}
            >
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-xs font-bold text-text-primary">
                  Skenario A (Saat Ini)
                </span>
                {best === "SCENARIO_A_CURRENT" && (
                  <Badge variant="success" size="sm">
                    Rekomendasi Terbaik
                  </Badge>
                )}
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Skor Kesehatan:</span>
                  <span className="font-mono font-bold text-text-primary">{scA.healthScore} / 100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Bentrok Jadwal:</span>
                  <span className={`font-mono font-semibold ${scA.conflictsCount > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                    {scA.conflictsCount} Bentrok
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Total Beban:</span>
                  <span className="font-mono text-text-primary">{Math.round(scA.totalWorkloadMinutes / 60)} Jam</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Cakupan Deadline:</span>
                  <span className="font-mono text-text-primary">{scA.deadlineCoverageRate}%</span>
                </div>
              </div>
            </div>

            {/* Scenario B: Proposed */}
            <div
              className={`p-4 rounded-xl border bg-surface space-y-3 transition-all ${
                best === "SCENARIO_B_PROPOSED"
                  ? "border-brand-500/60 ring-1 ring-brand-500/20"
                  : "border-border/60"
              }`}
            >
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-xs font-bold text-text-primary">
                  Skenario B (Setelah Perubahan)
                </span>
                {best === "SCENARIO_B_PROPOSED" && (
                  <Badge variant="success" size="sm">
                    Rekomendasi Terbaik
                  </Badge>
                )}
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Skor Kesehatan:</span>
                  <span className="font-mono font-bold text-text-primary">{scB.healthScore} / 100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Bentrok Jadwal:</span>
                  <span className={`font-mono font-semibold ${scB.conflictsCount > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                    {scB.conflictsCount} Bentrok
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Total Beban:</span>
                  <span className="font-mono text-text-primary">{Math.round(scB.totalWorkloadMinutes / 60)} Jam</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Cakupan Deadline:</span>
                  <span className="font-mono text-text-primary">{scB.deadlineCoverageRate}%</span>
                </div>
              </div>
            </div>

            {/* Scenario C: Recovery */}
            <div
              className={`p-4 rounded-xl border bg-surface space-y-3 transition-all ${
                best === "SCENARIO_C_RECOVERY"
                  ? "border-brand-500/60 ring-1 ring-brand-500/20"
                  : "border-border/60"
              }`}
            >
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-xs font-bold text-text-primary">
                  Skenario C (Pemulihan Seimbang)
                </span>
                {best === "SCENARIO_C_RECOVERY" && (
                  <Badge variant="success" size="sm">
                    Rekomendasi Terbaik
                  </Badge>
                )}
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Skor Kesehatan:</span>
                  <span className="font-mono font-bold text-text-primary">{scC.healthScore} / 100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Bentrok Jadwal:</span>
                  <span className={`font-mono font-semibold ${scC.conflictsCount > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                    {scC.conflictsCount} Bentrok
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Total Beban:</span>
                  <span className="font-mono text-text-primary">{Math.round(scC.totalWorkloadMinutes / 60)} Jam</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Cakupan Deadline:</span>
                  <span className="font-mono text-text-primary">{scC.deadlineCoverageRate}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trade-Off Summary */}
          {threeWayResult.tradeOffSummary && (
            <div className="p-3.5 rounded-xl border border-brand-500/20 bg-brand-500/5 flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed">
              <Info className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
              <p>{threeWayResult.tradeOffSummary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
