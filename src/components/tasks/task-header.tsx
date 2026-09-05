"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { GoogleClassroomIcon } from "@/components/ui/brand-logos";
import { PageHeader } from "@/components/layout/page-header";

interface TaskHeaderProps {
  onOpenClassroom?: () => void;
  isClassroomConnected?: boolean;
}

export function TaskHeader({
  onOpenClassroom,
  isClassroomConnected = false,
}: TaskHeaderProps) {
  return (
    <PageHeader
      eyebrow="Tugas & Pekerjaan"
      title="Tugas"
      description="Kelola tugas akademik, batas waktu pengumpulan, dan status penyelesaian tugas Anda secara terorganisir."
      actions={
        <>
          {onOpenClassroom && (
            <button
              type="button"
              onClick={onOpenClassroom}
              className="vt-btn-chrome text-xs font-mono font-bold flex items-center gap-1.5 py-1.5 px-3 cursor-pointer"
            >
              <GoogleClassroomIcon className="w-3.5 h-3.5" />
              <span>{isClassroomConnected ? "Classroom Terhubung" : "Hubungkan Classroom"}</span>
            </button>
          )}

          <Link
            href="/dashboard/tugas/baru"
            className="vt-btn-terracotta text-xs font-mono font-bold flex items-center gap-1.5 py-1.5 px-3 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Tugas</span>
          </Link>
        </>
      }
    />
  );
}
