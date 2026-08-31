"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { UserSchedulePreference, PlanningStyle } from "@/lib/schedule-intelligence/types";
import { ScheduleDay } from "@/types";
import {
  getUserSchedulePreferencesAction,
  saveUserSchedulePreferencesAction,
} from "@/actions/schedule-actions";
import { toast } from "sonner";

interface SchedulePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (prefs: UserSchedulePreference) => void;
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

export function SchedulePreferencesModal({
  isOpen,
  onClose,
  onSaved,
}: SchedulePreferencesModalProps) {
  const [prefs, setPrefs] = useState<UserSchedulePreference>({
    preferredStudyStartTime: "19:00",
    preferredStudyEndTime: "21:30",
    preferredSessionDuration: 60,
    preferredDays: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"],
    preferredBreakDuration: 30,
    maximumDailyStudyMinutes: 240,
    planningStyle: "BALANCED",
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getUserSchedulePreferencesAction()
        .then((res) => {
          if (res.success && res.preferences) {
            setPrefs(res.preferences);
          }
        });
    }
  }, [isOpen]);

  const toggleDay = (day: ScheduleDay) => {
    setPrefs((prev) => {
      const exists = prev.preferredDays.includes(day);
      if (exists && prev.preferredDays.length <= 1) {
        toast.info("Minimal pilih 1 hari belajar.");
        return prev;
      }
      return {
        ...prev,
        preferredDays: exists
          ? prev.preferredDays.filter((d) => d !== day)
          : [...prev.preferredDays, day],
      };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await saveUserSchedulePreferencesAction(prefs);
      if (!res.success) {
        toast.error(res.error || "Gagal menyimpan preferensi.");
      } else {
        toast.success("Preferensi jadwal belajar berhasil diperbarui.");
        if (onSaved) onSaved(res.preferences);
        onClose();
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat menyimpan.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isSaving) onClose();
      }}
      title="Preferensi & Gaya Jadwal Belajar"
      className="max-w-xl"
    >
      <div className="space-y-4 text-xs">
        {/* Banner */}
        <div className="p-3.5 rounded-xl border border-brand-500/30 bg-brand-500/10 space-y-1">
          <div className="flex items-center gap-2 font-bold text-brand-700 dark:text-brand-300">
            <Sparkles className="w-4 h-4 text-brand-500 shrink-0" />
            <span>Personalisasi Asisten Belajar Velqora</span>
          </div>
          <p className="text-text-secondary leading-relaxed">
            Preferensi Anda digunakan untuk menyusun rekomendasi waktu luang yang paling nyaman, tanpa melanggar perlindungan bentrok dan batas kelelahan.
          </p>
        </div>

        {/* Planning Style */}
        <div className="space-y-2">
          <label className="font-bold text-text-primary block">Gaya Perencanaan Belajar:</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "BALANCED", label: "Seimbang (Balanced)", desc: "Distribusi rata sepanjang minggu" },
              { id: "DEADLINE_FOCUSED", label: "Fokus Deadline", desc: "Prioritas tugas paling mendesak" },
              { id: "LIGHT_DAILY", label: "Ringan Harian", desc: "Sesi mikro 45m setiap hari" },
              { id: "INTENSIVE_WEEKEND", label: "Intensif Weekend", desc: "Konsentrasi belajar di akhir pekan" },
            ].map((style) => (
              <div
                key={style.id}
                onClick={() => setPrefs((prev) => ({ ...prev, planningStyle: style.id as PlanningStyle }))}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer space-y-0.5 ${
                  prefs.planningStyle === style.id
                    ? "border-brand-500 bg-brand-500/5 shadow-2xs"
                    : "border-border bg-surface hover:border-border-hover"
                }`}
              >
                <div className="font-bold text-text-primary">{style.label}</div>
                <div className="text-[11px] text-text-tertiary">{style.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Preferred Study Time Window */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl border border-border/80 bg-surface">
          <div className="space-y-1">
            <label className="font-semibold text-text-primary block">Jam Mulai Favorit:</label>
            <input
              type="time"
              value={prefs.preferredStudyStartTime}
              onChange={(e) => setPrefs((prev) => ({ ...prev, preferredStudyStartTime: e.target.value }))}
              className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface-secondary text-text-primary font-mono text-xs focus:ring-1 focus:ring-brand-500 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-text-primary block">Jam Selesai Maksimal:</label>
            <input
              type="time"
              value={prefs.preferredStudyEndTime}
              onChange={(e) => setPrefs((prev) => ({ ...prev, preferredStudyEndTime: e.target.value }))}
              className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface-secondary text-text-primary font-mono text-xs focus:ring-1 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>

        {/* Preferred Days */}
        <div className="space-y-1.5">
          <label className="font-bold text-text-primary block">Hari Belajar Pilihan:</label>
          <div className="flex items-center gap-1.5 flex-wrap">
            {ALL_DAYS.map((day) => {
              const isSelected = prefs.preferredDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-brand-600 text-white shadow-2xs"
                      : "bg-surface-secondary text-text-secondary border border-border hover:text-text-primary"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Limits & Buffers */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl border border-border/80 bg-surface">
          <div className="space-y-1">
            <label className="font-semibold text-text-primary block">Durasi Sesi Ideal:</label>
            <select
              value={prefs.preferredSessionDuration}
              onChange={(e) => setPrefs((prev) => ({ ...prev, preferredSessionDuration: Number(e.target.value) }))}
              className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface-secondary text-text-primary text-xs outline-none"
            >
              <option value={45}>45 Menit (Fokus Ringan)</option>
              <option value={60}>60 Menit (Standar)</option>
              <option value={90}>90 Menit (Mendalam)</option>
              <option value={120}>120 Menit (Intensif)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-text-primary block">Jeda Istirahat Minimum:</label>
            <select
              value={prefs.preferredBreakDuration}
              onChange={(e) => setPrefs((prev) => ({ ...prev, preferredBreakDuration: Number(e.target.value) }))}
              className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface-secondary text-text-primary text-xs outline-none"
            >
              <option value={15}>15 Menit</option>
              <option value={30}>30 Menit (Disarankan)</option>
              <option value={45}>45 Menit</option>
              <option value={60}>60 Menit</option>
            </select>
          </div>
        </div>

        {/* Safety Note */}
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-secondary/40 border border-border/50 text-[11px] text-text-tertiary">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Batas belajar maksimal 4 jam/hari dan proteksi anti-bentrok kuliah tetap diprioritaskan.</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSaving}>
            Batal
          </Button>

          <Button size="sm" onClick={handleSave} disabled={isSaving} className="gap-1.5 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isSaving ? "Menyimpan..." : "Simpan Preferensi"}</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
