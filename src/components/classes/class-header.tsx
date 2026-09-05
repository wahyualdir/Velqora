"use client";

import React from "react";
import { Plus, KeyRound } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

interface ClassHeaderProps {
  onCreateClass: () => void;
  onJoinClass: () => void;
}

export function ClassHeader({ onCreateClass, onJoinClass }: ClassHeaderProps) {
  return (
    <PageHeader
      eyebrow="Ruang Kolaborasi"
      title="Ruang Kelas"
      description="Kelola ruang belajar bersama, materi perkuliahan, dan kolaborasi tugas akademik dalam satu tempat."
      actions={
        <>
          <button
            type="button"
            onClick={onJoinClass}
            className="vt-btn-chrome text-xs font-mono font-bold flex items-center gap-1.5 py-1.5 px-3 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#C2553A] dark:text-brand-400" />
            <span>Gabung Kelas</span>
          </button>

          <button
            type="button"
            onClick={onCreateClass}
            className="vt-btn-terracotta text-xs font-mono font-bold flex items-center gap-1.5 py-1.5 px-3 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Kelas</span>
          </button>
        </>
      }
    />
  );
}
