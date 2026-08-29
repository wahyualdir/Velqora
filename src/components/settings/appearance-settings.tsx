"use client";

import React from "react";
import {
  Sun,
  Moon,
  Monitor,
  Palette,
  RotateCcw,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemePreviewBox } from "@/components/settings/theme-preview-box";
import type {
  AccentColor,
  UIDensity,
  UIRadius,
  UIMotion,
} from "@/context/theme-accent-context";

interface AppearanceSettingsProps {
  theme: string | undefined;
  setTheme: (mode: string) => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  density: UIDensity;
  setDensity: (d: UIDensity) => void;
  radius: UIRadius;
  setRadius: (r: UIRadius) => void;
  motion: UIMotion;
  setMotion: (m: UIMotion) => void;
  onReset: () => void;
}

const ACCENT_OPTIONS: {
  id: AccentColor;
  name: string;
  dotColor: string;
}[] = [
  { id: "platinum", name: "Platinum Slate", dotColor: "bg-slate-400" },
  { id: "indigo", name: "Cyber Indigo", dotColor: "bg-blue-600" },
  { id: "emerald", name: "Emerald Mint", dotColor: "bg-emerald-500" },
  { id: "violet", name: "Royal Violet", dotColor: "bg-purple-500" },
  { id: "amber", name: "Solar Amber", dotColor: "bg-amber-500" },
  { id: "rose", name: "Rose Accent", dotColor: "bg-pink-500" },
  { id: "cyan", name: "Glacier Cyan", dotColor: "bg-cyan-500" },
];

export function AppearanceSettings({
  theme,
  setTheme,
  accent,
  setAccent,
  density,
  setDensity,
  radius,
  setRadius,
  motion,
  setMotion,
  onReset,
}: AppearanceSettingsProps) {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-text-primary">
            Tampilan & Tema
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Sesuaikan mode tema, palet warna aksen, dan kepadatan tata letak visual antarmuka Velqora.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onReset}
          className="gap-1.5 text-xs text-text-secondary hover:text-text-primary self-start sm:self-auto cursor-pointer"
          title="Kembalikan tema ke pengaturan bawaan"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Tema</span>
        </Button>
      </div>

      {/* Live Preview */}
      <div className="space-y-2">
        <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          Pratinjau Antarmuka Langsung
        </label>
        <ThemePreviewBox />
      </div>

      {/* Setting Row 1: Mode Tampilan (System / Light / Dark) */}
      <div className="pt-2 space-y-2 border-t border-border/70">
        <div className="space-y-0.5">
          <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-primary">
            Mode Tema
          </label>
          <p className="text-xs text-text-secondary">
            Pilih preferensi pencahayaan visual antarmuka sistem.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5 max-w-lg">
          {[
            { id: "system", label: "Sistem", icon: Monitor },
            { id: "light", label: "Terang", icon: Sun },
            { id: "dark", label: "Gelap", icon: Moon },
          ].map((m) => {
            const Icon = m.icon;
            const isSelected = theme === m.id;

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setTheme(m.id)}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-brand-500/10 border-brand-500/40 text-brand-600 dark:text-brand-400 shadow-2xs font-bold"
                    : "bg-surface border-border text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Setting Row 2: Accent Color Palette */}
      <div className="pt-4 space-y-2 border-t border-border/70">
        <div className="space-y-0.5">
          <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-primary flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5" />
            Warna Aksen Utama
          </label>
          <p className="text-xs text-text-secondary">
            Warna aksen yang diterapkan pada tombol primer, badge status, dan sorotan antarmuka.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ACCENT_OPTIONS.map((opt) => {
            const isSelected = accent === opt.id;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAccent(opt.id)}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-surface border-brand-500/50 text-text-primary shadow-2xs font-bold ring-1 ring-brand-500/30"
                    : "bg-surface border-border text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full ${opt.dotColor} shrink-0`} />
                <span className="truncate flex-1">{opt.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-500 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Setting Row 3: Density & Radius */}
      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border/70">
        {/* UI Density */}
        <div className="space-y-2">
          <div className="space-y-0.5">
            <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-primary">
              Kepadatan Antarmuka
            </label>
            <p className="text-[11px] text-text-secondary">
              Tingkat spasi dan jarak antar elemen UI.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl border border-border bg-surface">
            {[
              { id: "compact", label: "Padat" },
              { id: "comfortable", label: "Standar" },
              { id: "spacious", label: "Luas" },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDensity(d.id as UIDensity)}
                className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                  density === d.id
                    ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold shadow-2xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* UI Radius */}
        <div className="space-y-2">
          <div className="space-y-0.5">
            <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-primary">
              Sudut Komponen (Radius)
            </label>
            <p className="text-[11px] text-text-secondary">
              Tingkat kelengkungan sudut kartu dan tombol.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl border border-border bg-surface">
            {[
              { id: "sharp", label: "Tajam" },
              { id: "balanced", label: "Seimbang" },
              { id: "soft", label: "Halus" },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRadius(r.id as UIRadius)}
                className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                  radius === r.id
                    ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold shadow-2xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Setting Row 4: Motion Animation */}
      <div className="pt-4 space-y-2 border-t border-border/70">
        <div className="space-y-0.5">
          <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-primary">
            Efek Gerak & Transisi
          </label>
          <p className="text-xs text-text-secondary">
            Aktifkan atau kurangi animasi transisi untuk kenyamanan mata dan performa perangkat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: "balanced", label: "Standar (Animasi Halus)" },
            { id: "reduced", label: "Berkurang (Minimalis)" },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMotion(m.id as UIMotion)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                motion === m.id
                  ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/30 font-bold shadow-2xs"
                  : "bg-surface border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
