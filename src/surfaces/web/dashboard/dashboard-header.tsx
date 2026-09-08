"use client";

import React from "react";
import Link from "next/link";
import { Plus, BookOpen, CheckSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const displayName = userName?.trim() ? userName.trim() : null;

  return (
    <div className="rounded-2xl border border-border bg-surface/90 backdrop-blur-xs p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Workspace Akademik Aktif</span>
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold font-display text-text-primary tracking-tight">
          {displayName ? `Selamat datang kembali, ${displayName}.` : "Selamat datang di Velqora."}
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl font-sans">
          Lanjutkan modul perkuliahan aktif, pantau tenggat tugas semester, atau eksplorasi kode di playground.
        </p>
      </div>

      {/* Curated Primary Quick Actions */}
      <div className="flex items-center gap-2.5 flex-wrap shrink-0">
        <Link href="/dashboard/modul/baru">
          <Button size="sm" className="gap-1.5 text-xs font-semibold shadow-2xs">
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Modul</span>
          </Button>
        </Link>

        <Link href="/dashboard/materi/baru">
          <Button size="sm" variant="outline" className="gap-1.5 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Unggah Materi</span>
          </Button>
        </Link>

        <Link href="/dashboard/tugas/baru">
          <Button size="sm" variant="outline" className="gap-1.5 text-xs font-semibold">
            <CheckSquare className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Buat Tugas</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
