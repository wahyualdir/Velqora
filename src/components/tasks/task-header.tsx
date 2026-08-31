"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenClassroom}
              className="gap-1.5 text-xs text-text-secondary hover:text-text-primary"
            >
              <GoogleClassroomIcon className="w-3.5 h-3.5" />
              <span>{isClassroomConnected ? "Classroom Terhubung" : "Hubungkan Classroom"}</span>
            </Button>
          )}

          <Link href="/dashboard/tugas/baru">
            <Button size="sm" className="gap-1.5 text-xs font-semibold shadow-xs">
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tugas Baru</span>
            </Button>
          </Link>
        </>
      }
    />
  );
}
