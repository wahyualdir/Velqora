"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";

interface MaterialHeaderProps {
  totalCount?: number;
}

export function MaterialHeader({ totalCount: _totalCount }: MaterialHeaderProps) {
  return (
    <PageHeader
      eyebrow="Bahan Belajar & Referensi"
      title="Materi Pembelajaran"
      description="Temukan, unggah, dan kelola seluruh materi belajar dan dokumentasi studi Anda dalam satu workspace."
      actions={
        <Link href="/dashboard/materi/baru">
          <Button size="sm" className="gap-1.5 text-xs font-semibold cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Materi</span>
          </Button>
        </Link>
      }
    />
  );
}
