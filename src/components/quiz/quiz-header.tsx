"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizHeaderProps {
  quizState: "setup" | "playing" | "finished";
  onReset: () => void;
}

export function QuizHeader({ quizState, onReset }: QuizHeaderProps) {
  return (
    <header className="space-y-4 border-b border-border/70 pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase font-mono bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              Evaluasi Pemahaman
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight font-display">
            Kuis AI
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
            Uji pemahaman akademik dan retensi materi melalui kuis interaktif yang dihasilkan secara terstruktur oleh AI.
          </p>
        </div>

        {quizState !== "setup" && (
          <Button
            size="sm"
            variant="outline"
            onClick={onReset}
            className="gap-1.5 text-xs text-text-secondary hover:text-text-primary shrink-0 self-start sm:self-auto cursor-pointer"
            aria-label="Kembali ke pengaturan kuis"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Pengaturan Kuis</span>
          </Button>
        )}
      </div>
    </header>
  );
}
