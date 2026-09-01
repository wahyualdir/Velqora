"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal, useCountUp } from "./use-landing-animation";

export function ClosingCTA() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });

  const stat100 = useCountUp(100, 1000, isVisible);
  const latency = useCountUp(150, 1000, isVisible);

  return (
    <section className="py-20 lg:py-28 border-b border-border bg-white overflow-hidden">
      <div
        ref={ref}
        className={`max-w-[1200px] mx-auto px-6 lg:px-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Punchy Action Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-500/10 text-brand-600 text-xs font-semibold uppercase tracking-wider">
              Mulai Sekarang
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-extrabold font-display tracking-tight text-text-primary leading-[1.15]">
              Mulai semester ini dengan meja belajar digital yang tertata rapi.
            </h2>

            <p className="text-base text-text-secondary leading-relaxed max-w-lg">
              Gratis untuk seluruh mahasiswa. Tanpa kartu kredit, tanpa masa trial. Langsung masuk ke workspace dan rasakan bedanya perkuliahan yang terorganisir.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/dashboard" className="focus-visible:outline-hidden">
                <Button
                  size="lg"
                  className="text-sm font-semibold gap-2 bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white px-7 shadow-sm hover:shadow-md transition-all duration-150"
                >
                  <span>Masuk ke Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login" className="focus-visible:outline-hidden">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
                >
                  Masuk Akun
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-3 text-xs text-text-tertiary pt-2">
              <span className="flex items-center gap-1 text-text-secondary font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Akses instan di browser
              </span>
              <span className="w-px h-3 bg-border" />
              <span>Semua fitur aktif</span>
            </div>
          </div>

          {/* Right: Verified Metrics Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-surface-secondary/70 border border-border space-y-1 text-left shadow-2xs hover:shadow-xs transition-shadow">
              <p className="text-3xl font-extrabold font-display text-text-primary">
                {stat100}%
              </p>
              <p className="text-xs text-text-secondary font-medium">Bebas Iklan & Pelacak</p>
              <p className="text-[11px] text-text-tertiary">Privasi penuh per akun</p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-secondary/70 border border-border space-y-1 text-left shadow-2xs hover:shadow-xs transition-shadow">
              <p className="text-3xl font-extrabold font-display text-brand-600">
                PWA
              </p>
              <p className="text-xs text-text-secondary font-medium">Web & Mobile Instan</p>
              <p className="text-[11px] text-text-tertiary">Tanpa boros memori HP</p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-secondary/70 border border-border space-y-1 text-left shadow-2xs hover:shadow-xs transition-shadow">
              <p className="text-3xl font-extrabold font-display text-text-primary">
                RLS
              </p>
              <p className="text-xs text-text-secondary font-medium">Data Terisolasi Aman</p>
              <p className="text-[11px] text-text-tertiary">Row-Level Security aktif</p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-secondary/70 border border-border space-y-1 text-left shadow-2xs hover:shadow-xs transition-shadow">
              <p className="text-3xl font-extrabold font-display text-emerald-600">
                &lt;{latency}ms
              </p>
              <p className="text-xs text-text-secondary font-medium">Latensi Navigasi</p>
              <p className="text-[11px] text-text-tertiary">Ringan & responsif</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
