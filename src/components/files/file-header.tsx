"use client";

import React from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        <Button
          size="sm"
          onClick={onUploadClick}
          disabled={uploading}
          className="gap-1.5 text-xs font-semibold cursor-pointer"
          aria-label="Unggah berkas baru"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>{uploading ? "Mengunggah..." : "Unggah Berkas"}</span>
        </Button>
      }
    />
  );
}
