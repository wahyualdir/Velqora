import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function EditorialFooter() {
  return (
    <footer className="py-14 border-t border-border bg-surface-secondary/30 text-text-secondary">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 space-y-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-1.5">
            <Logo variant="sidebar" withTile showSubtitle={false} />
            <p className="text-xs text-text-tertiary max-w-xs">
              Platform belajar dan manajemen kuliah untuk mahasiswa Indonesia.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[13px]">
            <Link href="/dashboard" className="hover:text-text-primary transition-colors duration-150">
              Workspace
            </Link>
            <Link href="/dashboard/materi" className="hover:text-text-primary transition-colors duration-150">
              Materi Kuliah
            </Link>
            <Link href="/dashboard/tugas" className="hover:text-text-primary transition-colors duration-150">
              Tugas & Deadline
            </Link>
            <Link href="/dashboard/jadwal" className="hover:text-text-primary transition-colors duration-150">
              Jadwal Kuliah
            </Link>
            <Link href="/dashboard/ai-tutor" className="hover:text-text-primary transition-colors duration-150">
              AI Tutor
            </Link>
            <Link href="/download" className="hover:text-text-primary transition-colors font-medium text-brand-500">
              Unduh PWA
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-text-tertiary">
          <div>
            &copy; {new Date().getFullYear()} Velqora. Seluruh hak cipta dilindungi.
          </div>
          <div className="flex items-center gap-3">
            <span>Aplikasi Web & Mobile PWA</span>
            <span className="w-px h-3 bg-border" />
            <span>Data Aman Terisolasi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
