"use client";

import React from "react";
import { Plus, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClassHeaderProps {
  onCreateClass: () => void;
  onJoinClass: () => void;
}

export function ClassHeader({ onCreateClass, onJoinClass }: ClassHeaderProps) {
  return (
    <header className="space-y-4 border-b border-border/70 pb-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase font-mono bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              Ruang Kelas
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight font-display">
            Kelas
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
            Kelola ruang belajar bersama, materi perkuliahan, dan kolaborasi tugas akademik dalam satu tempat.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={onJoinClass}
            className="gap-1.5 text-xs text-text-secondary hover:text-text-primary"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Gabung Kelas</span>
          </Button>

          <Button
            size="sm"
            onClick={onCreateClass}
            className="gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Buat Kelas Baru</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
