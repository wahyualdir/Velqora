"use client";

import React from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileHeaderProps {
  onUploadClick: () => void;
  uploading: boolean;
  fileCount?: number;
}

export function FileHeader({ onUploadClick, uploading, fileCount: _fileCount }: FileHeaderProps) {
  return (
    <header className="space-y-4 border-b border-border/70 pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase font-mono bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              Berkas Akademik
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight font-display">
            Semua Berkas
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
            Kelola, pratinjau, dan simpan seluruh berkas perkuliahan, kode program, diagram, dan dokumen studi Anda di cloud storage.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            size="sm"
            onClick={onUploadClick}
            disabled={uploading}
            className="gap-1.5 text-xs font-semibold px-4 cursor-pointer shadow-2xs"
            aria-label="Unggah berkas baru"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{uploading ? "Mengunggah..." : "+ Unggah Berkas"}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
