"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

interface MaterialHeaderProps {
  totalCount?: number;
}

export function MaterialHeader({ totalCount: _totalCount }: MaterialHeaderProps) {
  return (
    <PageHeader
      eyebrow="Bahan Ajar & Dokumen"
      title="Materi Pembelajaran"
      description="Temukan, unggah, dan kelola seluruh bahan materi perkuliahan dan dokumen studi dalam satu ruang kerja terstruktur."
      actions={
        <Link
          href="/dashboard/materi/baru"
          className="vt-btn-terracotta text-xs font-mono font-bold flex items-center gap-1.5 py-1.5 px-3 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Materi</span>
        </Link>
      }
    />
  );
}
