"use client";

import React from "react";
import {
  User,
  Palette,
  BookOpen,
  Bell,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

export type SettingsSectionId =
  | "profile"
  | "appearance"
  | "learning"
  | "notifications"
  | "privacy"
  | "account";

interface SettingsNavProps {
  activeSection: SettingsSectionId;
  onSelectSection: (id: SettingsSectionId) => void;
}

const SECTIONS = [
  { id: "profile", label: "Profil", icon: User },
  { id: "appearance", label: "Tampilan", icon: Palette },
  { id: "learning", label: "Preferensi Belajar", icon: BookOpen },
  { id: "notifications", label: "Notifikasi", icon: Bell },
  { id: "privacy", label: "Privasi & Keamanan", icon: ShieldCheck },
  { id: "account", label: "Akun", icon: KeyRound },
] as const;

export function SettingsNav({ activeSection, onSelectSection }: SettingsNavProps) {
  return (
    <nav aria-label="Navigasi Pengaturan" className="w-full">
      {/* Mobile Horizontal Pill Tabs */}
      <div className="flex lg:hidden items-center gap-1.5 p-1 rounded-xl bg-surface border border-border overflow-x-auto scrollbar-none touch-pan-x">
        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;

          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => onSelectSection(sec.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 shadow-2xs"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop Vertical Menu */}
      <div className="hidden lg:flex flex-col gap-1 p-2 rounded-xl border border-border bg-surface shadow-2xs">
        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;

          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => onSelectSection(sec.id)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-left transition-all cursor-pointer ${
                isActive
                  ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 shadow-2xs font-bold"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
