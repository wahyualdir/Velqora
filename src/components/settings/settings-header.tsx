"use client";

import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { SettingsGearIcon } from "@/components/icons/settings-gear-icon";

export function SettingsHeader() {
  return (
    <PageHeader
      eyebrow="Pengaturan"
      title={
        <span className="inline-flex items-center gap-3">
          <SettingsGearIcon className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 drop-shadow-sm" />
          <span>Pengaturan Workspace</span>
        </span>
      }
      description="Kelola profil identitas, tampilan antarmuka, preferensi belajar, notifikasi, serta keamanan akun Velqora Anda."
    />
  );
}
