"use client";

import React from "react";
import { UploadCloud } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

interface FileHeaderProps {
  onUploadClick: () => void;
  uploading: boolean;
  fileCount?: number;
}

export function FileHeader({ onUploadClick, uploading, fileCount: _fileCount }: FileHeaderProps) {
  return (
    <PageHeader
      eyebrow="Berkas Akademik"
      title="Semua Berkas"
      description="Kelola, pratinjau, dan simpan seluruh berkas perkuliahan, kode program, diagram, dan dokumen studi Anda di cloud storage."
      actions={
        <button
          type="button"
          onClick={onUploadClick}
          disabled={uploading}
          className="vt-btn-terracotta text-xs font-mono font-bold flex items-center gap-1.5 py-1.5 px-3.5 cursor-pointer disabled:opacity-50"
          aria-label="Unggah berkas baru"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>{uploading ? "Mengunggah..." : "Unggah Berkas"}</span>
        </button>
      }
    />
  );
}
