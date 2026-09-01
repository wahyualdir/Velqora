import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClosingCTA() {
  return (
    <section className="py-24 lg:py-32 border-b border-border bg-white">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Left-aligned editorial CTA — NOT centered copy-paste of hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-[2.5rem] font-extrabold font-display tracking-tight text-text-primary leading-[1.1]">
              Semester berikutnya bisa lebih tertata.
            </h2>
            <p className="text-base text-text-secondary leading-relaxed max-w-md">
              Gratis, tanpa kartu kredit, tanpa batas waktu trial. Langsung buka workspace dan mulai atur jadwal kuliah Anda.
            </p>
            <div className="pt-2">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="text-sm font-semibold gap-2 bg-brand-500 hover:bg-brand-600 text-white px-8 shadow-sm"
                >
                  <span>Buka Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side: simple stats, not a full mockup */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-surface-secondary border border-border space-y-1">
              <p className="text-2xl font-bold font-display text-text-primary">100%</p>
              <p className="text-xs text-text-tertiary">Gratis untuk mahasiswa</p>
            </div>
            <div className="p-5 rounded-xl bg-surface-secondary border border-border space-y-1">
              <p className="text-2xl font-bold font-display text-text-primary">PWA</p>
              <p className="text-xs text-text-tertiary">Tanpa app store</p>
            </div>
            <div className="p-5 rounded-xl bg-surface-secondary border border-border space-y-1">
              <p className="text-2xl font-bold font-display text-text-primary">RLS</p>
              <p className="text-xs text-text-tertiary">Data terisolasi per akun</p>
            </div>
            <div className="p-5 rounded-xl bg-surface-secondary border border-border space-y-1">
              <p className="text-2xl font-bold font-display text-brand-500">&lt;150ms</p>
              <p className="text-xs text-text-tertiary">Response time rata-rata</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
