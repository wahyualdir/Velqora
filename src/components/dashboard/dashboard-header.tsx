"use client";

import React from "react";
import Link from "next/link";
import { Plus, BookOpen, CheckSquare, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const displayName = userName?.trim() ? userName.trim() : null;

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/70 pb-5">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase font-mono bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            Workspace
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight font-display">
          {displayName ? `Selamat datang kembali, ${displayName}.` : "Selamat datang di Velqora."}
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
          Lanjutkan pekerjaan belajar Anda, pantau tenggat tugas, atau kembangkan proyek kode.
        </p>
      </div>

      {/* Curated Primary Quick Actions (3-4 buttons max) */}
      <div className="flex items-center gap-2 flex-wrap shrink-0">
        <Link href="/dashboard/modul/baru">
          <Button size="sm" className="gap-1.5 text-xs font-semibold shadow-xs">
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Modul</span>
          </Button>
        </Link>

        <Link href="/dashboard/materi/baru">
          <Button size="sm" variant="secondary" className="gap-1.5 text-xs font-medium">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Materi Baru</span>
          </Button>
        </Link>

        <Link href="/dashboard/tugas/baru">
          <Button size="sm" variant="outline" className="gap-1.5 text-xs font-medium">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Tugas Baru</span>
          </Button>
        </Link>

        <Link href="/dashboard/playground">
          <Button size="sm" variant="ghost" className="gap-1.5 text-xs text-text-secondary hover:text-text-primary">
            <Code2 className="w-3.5 h-3.5 text-brand-500" />
            <span className="hidden sm:inline">Praktik Kode</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
