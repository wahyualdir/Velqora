"use client";

import React from "react";
import { Plus, KeyRound } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

interface ClassHeaderProps {
  onCreateClass: () => void;
  onJoinClass: () => void;
}

export function ClassHeader({ onCreateClass, onJoinClass }: ClassHeaderProps) {
  return (
    <PageHeader
      eyebrow="Ruang Kolaborasi"
      title="Ruang Kelas"
      description="Kelola ruang belajar bersama, materi perkuliahan, dan kolaborasi tugas akademik dalam satu tempat."
      actions={
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={onJoinClass}
            className="gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Gabung Kelas</span>
          </Button>

          <Button
            size="sm"
            onClick={onCreateClass}
            className="gap-1.5 text-xs font-semibold cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Kelas</span>
          </Button>
        </>
      }
    />
  );
}
