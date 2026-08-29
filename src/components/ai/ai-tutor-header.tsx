"use client";

import React from "react";
import { Plus, Brain, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <header className="space-y-4 border-b border-border/70 pb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase font-mono bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              Asisten Akademik
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight font-display">
            AI Tutor
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
            Konsultasi materi, analisis kode, dan pemahaman konsep akademik berbantuan kecerdasan buatan.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={onToggleSidebar}
            className="gap-1.5 text-xs text-text-secondary hover:text-text-primary"
            title={showSidebar ? "Sembunyikan Riwayat Sesi" : "Tampilkan Riwayat Sesi"}
            aria-label="Toggle riwayat sesi"
          >
            {showSidebar ? (
              <PanelLeftClose className="w-3.5 h-3.5" />
            ) : (
              <PanelLeftOpen className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Riwayat ({sessionCount})</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onOpenMemory}
            className="gap-1.5 text-xs text-text-secondary hover:text-text-primary"
            title="Kelola Memori Konteks Pembelajaran"
            aria-label="Kelola memori AI"
          >
            <Brain className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Memori Belajar</span>
          </Button>

          <Button
            size="sm"
            onClick={onNewSession}
            className="gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Sesi Baru</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
