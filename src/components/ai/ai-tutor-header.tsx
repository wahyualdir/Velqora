"use client";

import React from "react";
import { Plus, Brain, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

interface AITutorHeaderProps {
  onNewSession: () => void;
  onOpenMemory: () => void;
  showSidebar: boolean;
  onToggleSidebar: () => void;
  sessionCount: number;
}

export function AITutorHeader({
  onNewSession,
  onOpenMemory,
  showSidebar,
  onToggleSidebar,
  sessionCount,
}: AITutorHeaderProps) {
  return (
    <PageHeader
      eyebrow="Asisten Akademik"
      title="AI Tutor"
      description="Konsultasi materi, analisis kode, dan pemahaman konsep akademik berbantuan kecerdasan buatan."
      actions={
        <>
          <button
            type="button"
            onClick={onToggleSidebar}
            className="vt-btn-chrome text-xs font-mono font-bold flex items-center gap-1.5 py-1.5 px-3 cursor-pointer"
            title={showSidebar ? "Sembunyikan Riwayat Sesi" : "Tampilkan Riwayat Sesi"}
            aria-label="Toggle riwayat sesi"
          >
            {showSidebar ? (
              <PanelLeftClose className="w-3.5 h-3.5" />
            ) : (
              <PanelLeftOpen className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Riwayat ({sessionCount})</span>
          </button>

          <button
            type="button"
            onClick={onOpenMemory}
            className="vt-btn-chrome text-xs font-mono font-bold flex items-center gap-1.5 py-1.5 px-3 cursor-pointer"
            title="Kelola Memori Konteks Pembelajaran"
            aria-label="Kelola memori AI"
          >
            <Brain className="w-3.5 h-3.5 text-[#C2553A] dark:text-brand-400" />
            <span>Memori Belajar</span>
          </button>

          <button
            type="button"
            onClick={onNewSession}
            className="vt-btn-terracotta text-xs font-mono font-bold flex items-center gap-1.5 py-1.5 px-3 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Sesi Baru</span>
          </button>
        </>
      }
    />
  );
}
