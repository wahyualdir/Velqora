"use client";

import React from "react";
import { PageHeader } from "@/components/layout/page-header";

export function SettingsHeader() {
  return (
    <PageHeader
      eyebrow="Pengaturan"
      title="Pengaturan Workspace"
      description="Kelola profil identitas, tampilan antarmuka, preferensi belajar, notifikasi, serta keamanan akun Velqora Anda."
    />
  );
}
