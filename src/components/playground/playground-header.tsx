"use client";

import React from "react";
import { Play, RotateCcw, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";

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
    <PageHeader
      eyebrow="Ruang Praktik"
      title="Ruang Praktik Kode"
      description="Lingkungan eksekusi kode interaktif di browser untuk menguji algoritma, fungsi, dan latihan praktikum akademik."
      actions={
        <>
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
        </>
      }
    />
  );
}
