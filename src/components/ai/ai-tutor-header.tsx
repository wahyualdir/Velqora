"use client";

import React from "react";
import { Plus, Brain, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleSidebar}
            className="gap-1.5 text-xs font-semibold cursor-pointer"
            title={showSidebar ? "Sembunyikan Riwayat Sesi" : "Tampilkan Riwayat Sesi"}
            aria-label="Toggle riwayat sesi"
          >
            {showSidebar ? (
              <PanelLeftClose className="w-3.5 h-3.5" />
            ) : (
              <PanelLeftOpen className="w-3.5 h-3.5" />
            )}
            <span>Riwayat ({sessionCount})</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenMemory}
            className="gap-1.5 text-xs font-semibold cursor-pointer"
            title="Kelola Memori Konteks Pembelajaran"
            aria-label="Kelola memori AI"
          >
            <Brain className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span className="hidden sm:inline">Memori Belajar</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onNewSession}
            className="gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Sesi Baru</span>
          </Button>
        </>
      }
    />
  );
}
