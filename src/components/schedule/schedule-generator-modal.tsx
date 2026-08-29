"use client";

import React, { useState } from "react";
import {
  Sparkles,
  AlertCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  generateAutoScheduleAction,
  saveImportedSchedulesAction,
} from "@/actions/schedule-actions";
import {
  AutoScheduleGoalRequest,
  GeneratedScheduleCandidate,
  TimeOfDayPreference,
} from "@/lib/schedule-generator/types";
import { ScheduleDay } from "@/types";
import { toast } from "sonner";

interface ScheduleGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedItems: any[]) => void;
}

const AVAILABLE_DAYS: ScheduleDay[] = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

export function ScheduleGeneratorModal({
  isOpen,
  onClose,
  onSuccess,
}: ScheduleGeneratorModalProps) {
  const [step, setStep] = useState<"form" | "generating" | "review" | "saving">("form");
  const [goalTitle, setGoalTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [targetSessions, setTargetSessions] = useState(3);
  const [selectedDays, setSelectedDays] = useState<ScheduleDay[]>([
    "Senin",
    "Rabu",
    "Jumat",
  ]);
  const [timePreference, setTimePreference] = useState<TimeOfDayPreference>("malam");
  const [candidates, setCandidates] = useState<GeneratedScheduleCandidate[]>([]);
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
    if (!goalTitle.trim()) {
      toast.error("Nama tujuan belajar / topik wajib diisi.");
      return;
    }

    setStep("generating");
    setWarnings([]);

    try {
      const payload: AutoScheduleGoalRequest = {
        goalTitle: goalTitle.trim(),
        subject: subject.trim() || "Fokus Akademik",
        durationMinutes,
        targetSessionsPerWeek: targetSessions,
        preferredDays: selectedDays,
        timePreference,
        priority: "tinggi",
      };

      const res = await generateAutoScheduleAction(payload);

      if (!res.success) {
        setStep("form");
        toast.error(res.error || "Gagal menyusun jadwal otomatis.");
        return;
      }

      setCandidates(res.candidates);
      setWarnings(res.warnings || []);
      setStep("review");
      toast.success(
        `Berhasil menyusun ${res.recommendedSessionsCount} rekomendasi slot belajar!`
      );
    } catch (err: any) {
      setStep("form");
      toast.error(err.message || "Gagal memproses rekomendasi.");
    }
  };

  const handleToggleCandidate = (id: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

  const handleSaveToSchedule = async () => {
    const selected = candidates.filter((c) => c.selected);
    if (selected.length === 0) {
      toast.error("Pilih minimal 1 rekomendasi slot jadwal untuk disimpan.");
      return;
    }

    setStep("saving");
    try {
      const payload = selected.map((item) => ({
        title: item.title,
        subject: item.subject,
        day: item.day,
        start_time: item.startTime,
        end_time: item.endTime,
        time: item.time,
        location: item.location || "Ruang Belajar Mandiri",
        lecturer: "Rencana Otomatis",
        type: "jadwal" as const,
        priority: item.priority || "sedang",
        is_completed: false,
        source: "auto_generated" as const,
      }));

      const res = await saveImportedSchedulesAction(payload);
      if (!res.success) {
        setStep("review");
        toast.error(res.error || "Gagal menyimpan jadwal.");
        return;
      }

      toast.success(`${res.insertedCount} sesi belajar berhasil ditambahkan ke jadwal!`);
      onSuccess(res.savedItems);
      handleReset();
      onClose();
    } catch (err: any) {
      setStep("review");
      toast.error(err.message || "Gagal menyimpan sesi belajar.");
    }
  };

  const handleReset = () => {
    setStep("form");
    setCandidates([]);
    setWarnings([]);
  };

  const selectedCount = candidates.filter((c) => c.selected).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (step !== "saving" && step !== "generating") {
          onClose();
        }
      }}
      title="Susun Jadwal Belajar Otomatis AI"
      className="max-w-2xl"
    >
      {/* ─── 1. FORM WIZARD ─── */}
      {step === "form" && (
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs text-text-secondary leading-relaxed">
              Mesin penjadwalan Velqora akan menganalisis waktu luang Anda, menghindari bentrok perkuliahan & tenggat tugas, lalu menyusun slot belajar paling optimal.
            </p>
          </div>

          <Input
            label="Tujuan Belajar / Topik *"
            placeholder="Contoh: Belajar Machine Learning & Deep Learning"
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Mata Kuliah / Topik Terkait"
              placeholder="Contoh: Kecerdasan Buatan"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <Select
              label="Durasi per Sesi"
              value={durationMinutes.toString()}
              onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
              options={[
                { value: "45", label: "45 Menit (Fokus Ringkas)" },
                { value: "60", label: "60 Menit (1 Jam)" },
                { value: "90", label: "90 Menit (Standar Akademik)" },
                { value: "120", label: "120 Menit (2 Jam Intensif)" },
                { value: "180", label: "180 Menit (3 Jam)" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Target Frekuensi per Minggu"
              value={targetSessions.toString()}
              onChange={(e) => setTargetSessions(parseInt(e.target.value, 10))}
              options={[
                { value: "1", label: "1x Seminggu" },
                { value: "2", label: "2x Seminggu" },
                { value: "3", label: "3x Seminggu (Disarankan)" },
                { value: "4", label: "4x Seminggu" },
                { value: "5", label: "5x Seminggu" },
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
                { value: "fleksibel", label: "Fleksibel (Kapan saja waktu luang)" },
              ]}
            />
          </div>

          {/* Preferred Days Checklist */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary">
              Hari yang Diinginkan:
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {AVAILABLE_DAYS.map((day) => {
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
              <span>Analisis & Cari Slot Belajar</span>
            </Button>
          </div>
        </form>
      )}

      {/* ─── 2. GENERATING STEP ─── */}
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
                ? "Menganalisis jadwal bebas bentrok..."
                : "Menyimpan jadwal ke database..."}
            </h3>
            <p className="text-xs text-text-secondary">
              Memeriksa slot waktu luang dan ketersediaan waktu optimal.
            </p>
          </div>
        </div>
      )}

      {/* ─── 3. REVIEW CANDIDATES STEP ─── */}
      {step === "review" && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl border border-brand-500/30 bg-brand-500/10 flex items-center justify-between gap-3 text-xs text-brand-700 dark:text-brand-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-brand-500" />
              <span>
                Ditemukan <strong>{candidates.length} slot waktu luang</strong>. {selectedCount} slot otomatis dipilih sesuai target mingguan Anda.
              </span>
            </div>
          </div>

          {warnings.map((w, wIdx) => (
            <div
              key={wIdx}
              className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{w}</span>
            </div>
          ))}

          {/* Candidate List */}
          <div className="max-h-[320px] overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
            {candidates.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-tertiary">
                Tidak ditemukan slot waktu luang pada kombinasi hari dan preferensi ini.
              </div>
            ) : (
              candidates.map((cand) => (
                <div
                  key={cand.id}
                  onClick={() => handleToggleCandidate(cand.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    cand.selected
                      ? "border-brand-500 bg-surface shadow-2xs"
                      : "border-border bg-surface/50 opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <input
                      type="checkbox"
                      checked={!!cand.selected}
                      onChange={() => handleToggleCandidate(cand.id)}
                      className="w-4 h-4 rounded border-border text-brand-600 focus:ring-brand-500 cursor-pointer"
                      aria-label={`Pilih slot ${cand.day} ${cand.time}`}
                    />

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-surface-secondary border border-border text-brand-600 dark:text-brand-400">
                          {cand.day}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-surface-secondary border border-border text-text-primary">
                          {cand.time}
                        </span>
                        <Badge variant="success">Kecocokan {cand.suitabilityScore}%</Badge>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-text-primary truncate">
                        {cand.title}
                      </h4>

                      <div className="flex items-center gap-2 text-[11px] text-text-tertiary flex-wrap">
                        {cand.scoreReasons.map((reason, rIdx) => (
                          <span key={rIdx} className="flex items-center gap-1 text-emerald-500">
                            • {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
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
                <span>Tambahkan ke Jadwal ({selectedCount} Slot)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
