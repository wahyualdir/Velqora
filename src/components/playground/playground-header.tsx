"use client";

import React from "react";
import { Play, RotateCcw, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlaygroundHeaderProps {
  lang?: "javascript" | "python";
  onRun: () => void;
  isRunning: boolean;
  onReset: () => void;
  onCopy: () => void;
  copied: boolean;
}

export function PlaygroundHeader({
  lang: _lang,
  onRun,
  isRunning,
  onReset,
  onCopy,
  copied,
}: PlaygroundHeaderProps) {
  return (
    <header className="space-y-4 border-b border-border/70 pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase font-mono bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              Ruang Praktik
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight font-display">
            Ruang Praktik Kode
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
            Lingkungan eksekusi kode interaktif di browser untuk menguji algoritma, fungsi, dan latihan praktikum akademik.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={onReset}
            disabled={isRunning}
            className="gap-1.5 text-xs text-text-secondary hover:text-text-primary cursor-pointer disabled:opacity-50"
            title="Reset kode ke template awal"
            aria-label="Reset kode"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onCopy}
            className="gap-1.5 text-xs text-text-secondary hover:text-text-primary cursor-pointer"
            title="Salin kode ke clipboard"
            aria-label="Salin kode"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-semibold">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin</span>
              </>
            )}
          </Button>

          <Button
            size="sm"
            onClick={onRun}
            disabled={isRunning}
            className="gap-1.5 text-xs font-semibold px-4 cursor-pointer shadow-2xs"
            aria-label="Jalankan kode (Ctrl+Enter)"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? "Mengeksekusi..." : "Jalankan Kode"}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
