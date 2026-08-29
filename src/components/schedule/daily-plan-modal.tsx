"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  Flame,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  generateDailyPlanAction,
  confirmScheduleRecommendationsAction,
} from "@/actions/schedule-actions";
import {
  DailyPlanRequest,
  ScheduleRecommendation,
  WorkloadLevel,
} from "@/lib/schedule-intelligence/types";
import { Task } from "@/types";
import { toast } from "sonner";

interface DailyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks?: Task[];
  onSuccess: (savedItems: any[]) => void;
}

export function DailyPlanModal({
  isOpen,
  onClose,
  tasks = [],
  onSuccess,
}: DailyPlanModalProps) {
  const todayStr = new Date().toISOString().split("T")[0];
  const [step, setStep] = useState<"form" | "generating" | "review" | "saving">("form");
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [targetHours, setTargetHours] = useState(3);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [maxDailyMinutes, setMaxDailyMinutes] = useState(240);
  const [timePreference, setTimePreference] = useState<"pagi" | "siang" | "sore" | "malam" | "fleksibel">("malam");

  const [recommendations, setRecommendations] = useState<ScheduleRecommendation[]>([]);
  const [workloadStatus, setWorkloadStatus] = useState<WorkloadLevel>("RINGAN");
  const [warnings, setWarnings] = useState<string[]>([]);

  const activeTasks = tasks.filter((t) => t.status !== "selesai");

  const toggleTaskSelection = (taskId: string) => {
    if (selectedTaskIds.includes(taskId)) {
      setSelectedTaskIds(selectedTaskIds.filter((id) => id !== taskId));
    } else {
      setSelectedTaskIds([...selectedTaskIds, taskId]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("generating");
    setWarnings([]);

    try {
      const payload: DailyPlanRequest = {
        date: selectedDate,
        targetStudyHours: targetHours,
        priorityTaskIds: selectedTaskIds.length > 0 ? selectedTaskIds : undefined,
        maxDailyStudyMinutes: maxDailyMinutes,
        timePreference,
      };

      const res = await generateDailyPlanAction(payload);

      if (!res.success) {
        setStep("form");
        toast.error(res.error || "Gagal menyusun jadwal harian.");
        return;
      }

      setRecommendations(res.recommendedSessions);
      setWorkloadStatus(res.workloadStatus);
      setWarnings(res.warnings || []);
      setStep("review");
      toast.success(`Ditemukan ${res.recommendedSessions.length} rekomendasi sesi belajar!`);
    } catch (err: any) {
      setStep("form");
      toast.error(err.message || "Terjadi kendala saat menyusun jadwal.");
    }
  };

  const handleToggleRecommendation = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r))
    );
  };

  const handleSaveToSchedule = async () => {
    const selected = recommendations.filter((r) => r.selected);
    if (selected.length === 0) {
      toast.error("Pilih minimal 1 sesi belajar untuk disimpan.");
      return;
    }

    setStep("saving");
    try {
      const res = await confirmScheduleRecommendationsAction(selected);

      if (!res.success) {
        setStep("review");
        toast.error(res.error || "Gagal menyimpan rekomendasi.");
        return;
      }

      toast.success(`${res.insertedCount} sesi belajar berhasil ditambahkan ke jadwal!`);
      onSuccess(res.savedItems);
      handleReset();
      onClose();
    } catch (err: any) {
      setStep("review");
      toast.error(err.message || "Gagal menyimpan jadwal.");
    }
  };

  const handleReset = () => {
    setStep("form");
    setRecommendations([]);
    setWarnings([]);
  };

  const selectedCount = recommendations.filter((r) => r.selected).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (step !== "saving" && step !== "generating") {
          onClose();
        }
      }}
      title="Susun Hari Saya (Daily Academic Plan)"
      className="max-w-2xl"
    >
      {/* ─── STEP 1: FORM WIZARD ─── */}
      {step === "form" && (
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs text-text-secondary leading-relaxed">
              Pilih tanggal, target durasi, dan tugas prioritas. Mesin cerdas Velqora akan mencari slot waktu luang optimal, menghindari bentrok jadwal kuliah, dan membatasi beban harian Anda secara proporsional.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              type="date"
              label="Tanggal Belajar *"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />

            <Select
              label="Target Durasi Belajar"
              value={targetHours.toString()}
              onChange={(e) => setTargetHours(Number(e.target.value))}
              options={[
                { value: "1", label: "1 Jam (Fokus Ringkas)" },
                { value: "2", label: "2 Jam (Standar)" },
                { value: "3", label: "3 Jam (Optimal)" },
                { value: "4", label: "4 Jam (Intensif)" },
                { value: "5", label: "5 Jam (Maksimal)" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Preferensi Waktu"
              value={timePreference}
              onChange={(e) => setTimePreference(e.target.value as any)}
              options={[
                { value: "pagi", label: "Pagi (07:00 - 12:00)" },
                { value: "siang", label: "Siang (12:00 - 16:00)" },
                { value: "sore", label: "Sore (15:30 - 18:30)" },
                { value: "malam", label: "Malam (18:30 - 22:30)" },
                { value: "fleksibel", label: "Fleksibel (Kapan Saja Luang)" },
              ]}
            />

            <Select
              label="Batas Maksimum Belajar Harian"
              value={maxDailyMinutes.toString()}
              onChange={(e) => setMaxDailyMinutes(Number(e.target.value))}
              options={[
                { value: "180", label: "3 Jam (Maksimal)" },
                { value: "240", label: "4 Jam (Disarankan)" },
                { value: "300", label: "5 Jam" },
                { value: "360", label: "6 Jam" },
              ]}
            />
          </div>

          {/* Priority Task Selection */}
          {activeTasks.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-text-primary flex items-center justify-between">
                <span>Pilih Tugas Prioritas (Opsional):</span>
                <span className="text-[10px] text-text-tertiary font-normal">
                  {selectedTaskIds.length} dipilih
                </span>
              </label>
              <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-1 rounded-xl border border-border/70 p-2 bg-surface-secondary/30">
                {activeTasks.map((t) => {
                  const isChecked = selectedTaskIds.includes(t.id);
                  return (
                    <div
                      key={t.id}
                      onClick={() => toggleTaskSelection(t.id)}
                      className={`p-2 rounded-lg border text-xs flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                        isChecked
                          ? "bg-brand-500/10 border-brand-500/40 text-brand-700 dark:text-brand-300"
                          : "bg-surface border-border text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleTaskSelection(t.id)}
                          className="w-3.5 h-3.5 rounded border-border text-brand-600 focus:ring-brand-500 cursor-pointer"
                        />
                        <span className="font-semibold truncate">{t.title}</span>
                      </div>
                      {t.deadline && (
                        <span className="text-[10px] font-mono text-rose-500 shrink-0 flex items-center gap-0.5">
                          <Flame className="w-3 h-3" /> {t.deadline.split("T")[0]}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" size="sm" className="gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Susun Rencana Belajar</span>
            </Button>
          </div>
        </form>
      )}

      {/* ─── STEP 2: GENERATING ─── */}
      {(step === "generating" || step === "saving") && (
        <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-brand-600 dark:text-brand-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-text-primary">
              {step === "generating"
                ? "Menganalisis slot waktu luang & batas beban harian..."
                : "Menyimpan sesi belajar ke database..."}
            </h3>
            <p className="text-xs text-text-secondary">
              Memeriksa bentrok jadwal perkuliahan, jeda istirahat 30 menit, dan tenggat tugas.
            </p>
          </div>
        </div>
      )}

      {/* ─── STEP 3: REVIEW CANDIDATES ─── */}
      {step === "review" && (
        <div className="space-y-4">
          {/* Header Summary */}
          <div className="p-3.5 rounded-xl border border-brand-500/30 bg-brand-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-brand-700 dark:text-brand-300">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-500 shrink-0" />
                <span className="font-bold">
                  {recommendations.length} Rekomendasi Sesi Belajar ({selectedCount} dipilih)
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Tanggal: <strong>{selectedDate}</strong> • Status Beban: <strong>{workloadStatus}</strong>
              </p>
            </div>
          </div>

          {warnings.map((w, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{w}</span>
            </div>
          ))}

          {/* Recommendations List */}
          <div className="max-h-[320px] overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                onClick={() => handleToggleRecommendation(rec.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                  rec.selected
                    ? "border-brand-500 bg-surface shadow-2xs"
                    : "border-border bg-surface/50 opacity-70 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <input
                      type="checkbox"
                      checked={!!rec.selected}
                      onChange={() => handleToggleRecommendation(rec.id)}
                      className="w-4 h-4 rounded border-border text-brand-600 focus:ring-brand-500 cursor-pointer"
                    />

                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-surface-secondary border border-border text-brand-600 dark:text-brand-400">
                          {rec.day}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-surface-secondary border border-border text-text-primary">
                          {rec.startTime} - {rec.endTime} ({rec.durationMinutes}m)
                        </span>
                        <Badge variant="success">Bebas Bentrok</Badge>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-text-primary truncate">
                        {rec.activity}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Explainable Rationale */}
                {rec.explanation && (
                  <div className="p-2 rounded-lg bg-muted/30 border border-border/40 text-[11px] text-muted-foreground flex items-start gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{rec.explanation.summary}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-1.5 text-xs text-text-secondary"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ubah Parameter</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Batal
              </Button>
              <Button
                size="sm"
                disabled={selectedCount === 0}
                onClick={handleSaveToSchedule}
                className="gap-1.5 font-semibold"
              >
                <span>Simpan ke Jadwal ({selectedCount} Sesi)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
