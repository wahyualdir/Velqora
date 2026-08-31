"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { ScheduleItem, ScheduleDay } from "@/types";
import {
  WhatIfSimulationResult,
  SimulationModification,
} from "@/lib/schedule-orchestration/types";
import { simulateWhatIfAction } from "@/actions/schedule-actions";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

interface WhatIfModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedules: ScheduleItem[];
}

const DAYS: ScheduleDay[] = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

export function WhatIfModal({ isOpen, onClose, schedules }: WhatIfModalProps) {
  const [selectedItemId, setSelectedItemId] = useState<string>(
    schedules[0]?.id || ""
  );
  const [targetDay, setTargetDay] = useState<ScheduleDay>("Rabu");
  const [targetStartTime, setTargetStartTime] = useState<string>("16:00");
  const [targetEndTime, setTargetEndTime] = useState<string>("17:30");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] =
    useState<WhatIfSimulationResult | null>(null);

  const handleRunSimulation = async () => {
    if (!selectedItemId) {
      toast.error("Pilih agenda yang ingin disimulasikan.");
      return;
    }

    setIsSimulating(true);
    try {
      const mod: SimulationModification = {
        action: "MOVE_ITEM",
        itemId: selectedItemId,
        targetDay,
        targetStartTime,
        targetEndTime,
      };

      const res = await simulateWhatIfAction(mod);
      if (res.success && res.simulation) {
        setSimulationResult(res.simulation);
        toast.success("Simulasi dampak selesai dihitung.");
      } else {
        toast.error(res.error || "Gagal menjalankan simulasi.");
      }
    } catch {
      toast.error("Terjadi kendala saat menjalankan simulasi.");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Simulasi Perubahan Jadwal (What-If)"
      description="Uji dampak pemindahan jadwal secara langsung tanpa mengubah data asli di database."
      size="lg"
    >

        <div className="space-y-5 py-3">
          {/* Form Input */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                Pilih Agenda yang Ingin Diuji
              </label>
              <select
                value={selectedItemId}
                onChange={(e) => {
                  setSelectedItemId(e.target.value);
                  setSimulationResult(null);
                }}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2"
              >
                {schedules.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.day}, {s.time})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Hari Tujuan
                </label>
                <select
                  value={targetDay}
                  onChange={(e) => {
                    setTargetDay(e.target.value as ScheduleDay);
                    setSimulationResult(null);
                  }}
                  className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1.5"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Jam Mulai
                </label>
                <input
                  type="time"
                  value={targetStartTime}
                  onChange={(e) => {
                    setTargetStartTime(e.target.value);
                    setSimulationResult(null);
                  }}
                  className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1.5"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Jam Selesai
                </label>
                <input
                  type="time"
                  value={targetEndTime}
                  onChange={(e) => {
                    setTargetEndTime(e.target.value);
                    setSimulationResult(null);
                  }}
                  className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1.5"
                />
              </div>
            </div>

            <Button
              onClick={handleRunSimulation}
              disabled={isSimulating || !selectedItemId}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            >
              {isSimulating ? "Menghitung Simulasi..." : "Jalankan Simulasi Dampak"}
            </Button>
          </div>

          {/* Simulation Output */}
          {simulationResult && (
            <div className="space-y-4 pt-2">
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  simulationResult.isSafe
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200"
                    : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200"
                }`}
              >
                {simulationResult.isSafe ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-semibold text-sm">
                    {simulationResult.isSafe
                      ? "Perubahan Aman Diterapkan"
                      : "Peringatan Risiko Akademik"}
                  </h4>
                  <p className="text-xs mt-0.5 opacity-90">
                    {simulationResult.summary}
                  </p>
                </div>
              </div>

              {/* Metric Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-2.5">Faktor Evaluasi</th>
                      <th className="p-2.5">Sebelum</th>
                      <th className="p-2.5">Setelah Simulasi</th>
                      <th className="p-2.5">Dampak</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr>
                      <td className="p-2.5 font-medium">Bentrok Jadwal</td>
                      <td className="p-2.5">{simulationResult.conflictsBefore} bentrok</td>
                      <td className="p-2.5">{simulationResult.conflictsAfter} bentrok</td>
                      <td className="p-2.5">
                        {simulationResult.conflictsAfter >
                        simulationResult.conflictsBefore ? (
                          <span className="text-rose-600 font-medium">Bertambah</span>
                        ) : (
                          <span className="text-emerald-600 font-medium">Aman</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Total Waktu Bebas</td>
                      <td className="p-2.5">{simulationResult.freeTimeBeforeHours} jam</td>
                      <td className="p-2.5">{simulationResult.freeTimeAfterHours} jam</td>
                      <td className="p-2.5">
                        {simulationResult.freeTimeAfterHours >=
                        simulationResult.freeTimeBeforeHours ? (
                          <span className="text-emerald-600 font-medium">Terjaga</span>
                        ) : (
                          <span className="text-amber-600 font-medium">Sedikit Berkurang</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Risiko Tenggat Tugas</td>
                      <td className="p-2.5">{simulationResult.deadlineRiskBefore}</td>
                      <td className="p-2.5">{simulationResult.deadlineRiskAfter}</td>
                      <td className="p-2.5 text-emerald-600 font-medium">Stabil</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Changes list */}
              {simulationResult.changes.length > 0 && (
                <div className="space-y-1.5">
                  <h5 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                    Catatan Perubahan
                  </h5>
                  {simulationResult.changes.map((c, i) => (
                    <div
                      key={i}
                      className="text-xs bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {c.description}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose} className="text-sm">
            Tutup
          </Button>
        </div>
    </Modal>
  );
}
