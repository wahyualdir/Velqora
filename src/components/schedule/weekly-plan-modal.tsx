"use client";

import React, { useState } from "react";
import {
  Sparkles,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  generateWeeklyPlanAction,
  confirmScheduleRecommendationsAction,
} from "@/actions/schedule-actions";
import {
  WeeklyPlanRequest,
  ScheduleRecommendation,
} from "@/lib/schedule-intelligence/types";
import { ScheduleDay } from "@/types";
import { toast } from "sonner";

interface WeeklyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedItems: any[]) => void;
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

export function WeeklyPlanModal({
  isOpen,
  onClose,
  onSuccess,
}: WeeklyPlanModalProps) {
  const [step, setStep] = useState<"form" | "generating" | "review" | "saving">("form");
  const [targetWeeklyHours, setTargetWeeklyHours] = useState(6);
  const [selectedDays, setSelectedDays] = useState<ScheduleDay[]>([
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
  ]);
  const [maxDailyMinutes] = useState(240);
  const [timePreference, setTimePreference] = useState<"pagi" | "siang" | "sore" | "malam" | "fleksibel">("malam");

  const [sessions, setSessions] = useState<ScheduleRecommendation[]>([]);
  const [totalPlannedHours, setTotalPlannedHours] = useState(0);
  const [warnings, setWarnings] = useState<string[]>([]);

  const toggleDay = (day: ScheduleDay) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length === 1) {
        toast.error("Pilih minimal 1 hari belajar.");
        return;
      }
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("generating");
    setWarnings([]);

    try {
      const payload: WeeklyPlanRequest = {
        targetStudyHoursTotal: targetWeeklyHours,
        preferredDays: selectedDays,
        maxDailyStudyMinutes: maxDailyMinutes,
        timePreference,
      };

      const res = await generateWeeklyPlanAction(payload);

      if (!res.success) {
        setStep("form");
        toast.error(res.error || "Gagal menyusun rencana mingguan.");
        return;
      }

      setSessions(res.sessions);
      setTotalPlannedHours(res.totalWeeklyHoursPlanned);
      setWarnings(res.warnings || []);
      setStep("review");
      toast.success(`Berhasil menyusun ${res.recommendedSessionsCount} sesi belajar mingguan!`);
    } catch (err: any) {
      setStep("form");
      toast.error(err.message || "Terjadi kendala saat menyusun rencana mingguan.");
    }
  };

  const handleToggleSession = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s))
    );
  };

  const handleSaveToSchedule = async () => {
    const selected = sessions.filter((s) => s.selected);
    if (selected.length === 0) {
      toast.error("Pilih minimal 1 sesi belajar untuk disimpan.");
      return;
    }

    setStep("saving");
    try {
      const res = await confirmScheduleRecommendationsAction(selected);

      if (!res.success) {
        setStep("review");
        toast.error(res.error || "Gagal menyimpan jadwal.");
        return;
      }

      toast.success(`${res.insertedCount} sesi belajar mingguan berhasil disimpan ke jadwal!`);
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
    setSessions([]);
    setWarnings([]);
  };

  const selectedCount = sessions.filter((s) => s.selected).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (step !== "saving" && step !== "generating") {
          onClose();
        }
      }}
      title="Susun Minggu Saya (Weekly Academic Plan)"
      className="max-w-2xl"
    >
      {/* ─── STEP 1: FORM WIZARD ─── */}
      {step === "form" && (
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs text-text-secondary leading-relaxed">
              Tentukan target total jam belajar mingguan dan hari yang diinginkan. Mesin cerdas Velqora akan mendistribusikan sesi belajar secara proporsional ke hari-hari luang tanpa beban berlebih.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Target Total Belajar Mingguan"
              value={targetWeeklyHours.toString()}
              onChange={(e) => setTargetWeeklyHours(Number(e.target.value))}
              options={[
                { value: "4", label: "4 Jam / Minggu (Ringan)" },
                { value: "6", label: "6 Jam / Minggu (Standar)" },
                { value: "8", label: "8 Jam / Minggu (Optimal)" },
                { value: "10", label: "10 Jam / Minggu (Intensif)" },
                { value: "12", label: "12 Jam / Minggu (Maksimal)" },
              ]}
            />

            <Select
              label="Preferensi Waktu Belajar"
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
          </div>

          {/* Preferred Days Checklist */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary">
              Hari Belajar yang Diinginkan:
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {ALL_DAYS.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-brand-600 text-white shadow-xs"
                        : "bg-surface-secondary text-text-secondary hover:text-text-primary border border-border"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" size="sm" className="gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Susun Rencana Mingguan</span>
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
                ? "Mendistribusikan sesi belajar mingguan bebas bentrok..."
                : "Menyimpan seluruh sesi belajar ke database..."}
            </h3>
            <p className="text-xs text-text-secondary">
              Memeriksa slot luang pada seluruh hari pilihan dan membatasi beban harian secara proporsional.
            </p>
          </div>
        </div>
      )}

      {/* ─── STEP 3: REVIEW SESSIONS ─── */}
      {step === "review" && (
        <div className="space-y-4">
          {/* Header Summary */}
          <div className="p-3.5 rounded-xl border border-brand-500/30 bg-brand-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-brand-700 dark:text-brand-300">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-500 shrink-0" />
                <span className="font-bold">
                  {sessions.length} Sesi Belajar Mingguan Disusun ({selectedCount} dipilih)
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Total Waktu: <strong>{totalPlannedHours} Jam</strong> dari target {targetWeeklyHours} Jam
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

          {/* Sessions List */}
          <div className="max-h-[320px] overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
            {sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => handleToggleSession(s.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                  s.selected
                    ? "border-brand-500 bg-surface shadow-2xs"
                    : "border-border bg-surface/50 opacity-70 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <input
                      type="checkbox"
                      checked={!!s.selected}
                      onChange={() => handleToggleSession(s.id)}
                      className="w-4 h-4 rounded border-border text-brand-600 focus:ring-brand-500 cursor-pointer"
                    />

                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-surface-secondary border border-border text-brand-600 dark:text-brand-400">
                          {s.day}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-surface-secondary border border-border text-text-primary">
                          {s.startTime} - {s.endTime} ({s.durationMinutes}m)
                        </span>
                        <Badge variant="success">Bebas Bentrok</Badge>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-text-primary truncate">
                        {s.activity}
                      </h4>
                    </div>
                  </div>
                </div>

                {s.explanation && (
                  <div className="p-2 rounded-lg bg-muted/30 border border-border/40 text-[11px] text-muted-foreground flex items-start gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{s.explanation.summary}</span>
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
