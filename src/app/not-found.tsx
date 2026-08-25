"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TechBackground } from "@/components/ui/tech-background";
import { Logo } from "@/components/ui/logo";
import {
  FileQuestion,
  ArrowLeft,
  Home,
  BookOpen,
  Layers,
  Bot,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-background overflow-hidden">
      {/* Background decoration */}
      <TechBackground variant="subtle" />
      <div className="fixed inset-0 pointer-events-none dark:bg-black/40 bg-transparent -z-[5]" />

      <div className="relative z-10 max-w-lg w-full text-center space-y-6 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <Logo variant="navbar" />
        </div>

        {/* Main Card */}
        <Card className="p-6 sm:p-8 rounded-2xl bg-surface/90 backdrop-blur-xl border border-border shadow-xl space-y-6">
          <div className="inline-flex p-4 rounded-2xl bg-brand-500/10 border border-brand-500/25 text-brand-400 mx-auto">
            <FileQuestion className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-block px-2.5 py-1 rounded-md bg-surface-secondary border border-border text-[11px] font-mono font-semibold text-text-tertiary">
              404 // NOT_FOUND
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary font-display">
              Halaman Tidak Ditemukan
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
              Halaman atau berkas yang Anda tuju tidak tersedia, mungkin telah
              dipindahkan atau URL yang dimasukkan keliru.
            </p>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-2.5 pt-2 text-left">
            <Link
              href="/dashboard"
              className="p-3 rounded-xl bg-surface-secondary/70 hover:bg-surface-secondary border border-border text-xs font-semibold text-text-primary flex items-center gap-2 transition-colors group"
            >
              <Home className="w-4 h-4 text-brand-400 group-hover:scale-110 transition-transform" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/dashboard/modul"
              className="p-3 rounded-xl bg-surface-secondary/70 hover:bg-surface-secondary border border-border text-xs font-semibold text-text-primary flex items-center gap-2 transition-colors group"
            >
              <Layers className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Modul & Project</span>
            </Link>
            <Link
              href="/dashboard/materi"
              className="p-3 rounded-xl bg-surface-secondary/70 hover:bg-surface-secondary border border-border text-xs font-semibold text-text-primary flex items-center gap-2 transition-colors group"
            >
              <BookOpen className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Materi</span>
            </Link>
            <Link
              href="/dashboard/ai-tutor"
              className="p-3 rounded-xl bg-surface-secondary/70 hover:bg-surface-secondary border border-border text-xs font-semibold text-text-primary flex items-center gap-2 transition-colors group"
            >
              <Bot className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              <span>AI Tutor</span>
            </Link>
          </div>

          <div className="pt-2">
            <Link href="/dashboard" className="block w-full">
              <Button className="w-full gap-2 text-xs font-semibold py-2.5">
                <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
              </Button>
            </Link>
          </div>
        </Card>

        {/* Footer info */}
        <p className="text-[11px] font-mono text-text-tertiary">
          © 2026 Velqora Learning Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
}
