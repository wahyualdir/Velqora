"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleClassroomIcon } from "@/components/ui/brand-logos";

interface TaskHeaderProps {
  onOpenClassroom?: () => void;
  isClassroomConnected?: boolean;
}

export function TaskHeader({
  onOpenClassroom,
  isClassroomConnected = false,
}: TaskHeaderProps) {
  return (
    <header className="space-y-4 border-b border-border/70 pb-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase font-mono bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              Tugas & Pekerjaan
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight font-display">
            Tugas
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
            Kelola tugas akademik, batas waktu pengumpulan, dan status penyelesaian tugas Anda secara terorganisir.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
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
        </div>
      </div>
    </header>
  );
}
