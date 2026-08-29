"use client";

import React from "react";

export function SettingsHeader() {
  return (
    <header className="space-y-4 border-b border-border/70 pb-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase font-mono bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            Pengaturan
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight font-display">
          Pengaturan Workspace
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
          Kelola profil identitas, tampilan antarmuka, preferensi belajar, notifikasi, serta keamanan akun Velqora Anda.
        </p>
      </div>
    </header>
  );
}
