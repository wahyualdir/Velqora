"use client";

import React, { useState, useEffect } from "react";
import { Globe, LayoutGrid, List, Volume2, VolumeX, Check } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { toast } from "sonner";

export function LearningPreferences() {
  const { language, setLanguage } = useLanguage();
  const [defaultView, setDefaultView] = useState<"grid" | "list">("grid");
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedView = localStorage.getItem("velqora_pref_module_view");
      if (savedView === "grid" || savedView === "list") {
        setDefaultView(savedView);
      }
      const savedSound = localStorage.getItem("velqora_pref_sound");
      if (savedSound !== null) {
        setSoundEnabled(savedSound === "true");
      }
    }
  }, []);

  const handleChangeDefaultView = (view: "grid" | "list") => {
    setDefaultView(view);
    localStorage.setItem("velqora_pref_module_view", view);
    toast.success(`Tampilan bawaan modul diatur ke mode ${view === "grid" ? "Grid" : "Daftar"}.`);
  };

  const handleToggleSound = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem("velqora_pref_sound", String(enabled));
    toast.success(`Efek audio gamifikasi ${enabled ? "diaktifkan" : "dinonaktifkan"}.`);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-border pb-3 space-y-1">
        <h2 className="text-base sm:text-lg font-bold text-text-primary">
          Preferensi Belajar
        </h2>
        <p className="text-xs text-text-secondary leading-relaxed">
          Atur bahasa workspace, format tampilan konten modul, dan efek interaksi perkuliahan.
        </p>
      </div>

      {/* Setting Row 1: Workspace Language */}
      <div className="space-y-2">
        <div className="space-y-0.5">
          <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-primary flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            Bahasa Antarmuka
          </label>
          <p className="text-xs text-text-secondary">
            Bahasa utama yang digunakan untuk teks antarmuka dan label sistem.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 max-w-md">
          {[
            { id: "id", label: "Bahasa Indonesia", subtitle: "Bahasa Indonesia (ID)" },
            { id: "en", label: "English", subtitle: "English (US)" },
          ].map((l) => {
            const isSelected = language === l.id;

            return (
              <button
                key={l.id}
                type="button"
                onClick={() => {
                  setLanguage(l.id as any);
                  toast.success(`Bahasa workspace diubah ke ${l.label}.`);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
                  isSelected
                    ? "bg-brand-500/10 border-brand-500/40 text-brand-600 dark:text-brand-400 shadow-2xs font-bold"
                    : "bg-surface border-border text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">{l.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-500" />}
                </div>
                <p className="text-[11px] text-text-tertiary font-normal">{l.subtitle}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Setting Row 2: Default Module View */}
      <div className="pt-4 space-y-2 border-t border-border/70">
        <div className="space-y-0.5">
          <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-primary">
            Tampilan Bawaan Modul & Proyek
          </label>
          <p className="text-xs text-text-secondary">
            Format awal yang terbuka saat mengunjungi halaman Modul & Proyek.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 max-w-md">
          {[
            { id: "grid", label: "Tampilan Grid / Kartu", icon: LayoutGrid },
            { id: "list", label: "Tampilan Daftar Baris", icon: List },
          ].map((v) => {
            const Icon = v.icon;
            const isSelected = defaultView === v.id;

            return (
              <button
                key={v.id}
                type="button"
                onClick={() => handleChangeDefaultView(v.id as any)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-brand-500/10 border-brand-500/40 text-brand-600 dark:text-brand-400 shadow-2xs font-bold"
                    : "bg-surface border-border text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{v.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Setting Row 3: Gamification & Sound */}
      <div className="pt-4 space-y-2 border-t border-border/70">
        <div className="space-y-0.5">
          <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-primary">
            Efek Audio Gamifikasi
          </label>
          <p className="text-xs text-text-secondary">
            Putar nada audio saat menyelesaikan tugas studi atau evaluasi kuis AI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleToggleSound(true)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              soundEnabled
                ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/30 font-bold shadow-2xs"
                : "bg-surface border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Aktif</span>
          </button>

          <button
            type="button"
            onClick={() => handleToggleSound(false)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              !soundEnabled
                ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/30 font-bold shadow-2xs"
                : "bg-surface border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span>Nonaktif</span>
          </button>
        </div>
      </div>
    </div>
  );
}
