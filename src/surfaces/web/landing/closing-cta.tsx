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
    <section className="py-20 lg:py-28 border-b border-paper-border bg-paper-card overflow-hidden">
      <div
        ref={ref}
        className={`max-w-[1200px] mx-auto px-6 lg:px-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-[0.98]"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Punchy Action Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Editorial Kicker */}
            <div className="flex items-center gap-3">
              <span className="font-editorial italic text-[15px] text-tinta-700">Mulai Sekarang</span>
              <span className="h-px w-20 bg-paper-border" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-semibold font-editorial tracking-tight text-ink-primary leading-[1.15]">
              Mulai semester ini dengan meja belajar digital yang tertata rapi.
            </h2>

            <p className="text-base text-ink-secondary font-sans leading-relaxed max-w-lg">
              Gratis untuk seluruh mahasiswa. Tanpa kartu kredit, tanpa masa trial. Langsung masuk ke workspace dan rasakan bedanya perkuliahan yang terorganisir.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/dashboard" className="focus-visible:outline-hidden">
                <Button
                  size="lg"
                  className="text-sm font-semibold gap-2 bg-tinta-600 hover:bg-tinta-700 active:scale-[0.98] text-white px-7 shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer"
                >
                  <span>Masuk ke Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login" className="focus-visible:outline-hidden">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-sm font-medium text-ink-secondary hover:text-ink-primary hover:bg-paper-secondary transition-colors"
                >
                  Masuk Akun
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-3 text-xs text-ink-tertiary pt-2">
              <span className="flex items-center gap-1 text-ink-secondary font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Akses instan di browser
              </span>
              <span className="w-px h-3 bg-paper-border" />
              <span>Semua fitur aktif</span>
            </div>
          </div>

          {/* Right: Verified Metrics Grid (rounded-xl, solid cards) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-paper-secondary/60 border border-paper-border space-y-1 text-left shadow-2xs transition-all duration-200">
              <p className="text-3xl font-semibold font-editorial text-ink-primary">
                {stat100}%
              </p>
              <p className="text-xs text-ink-secondary font-medium">Bebas Iklan & Pelacak</p>
              <p className="text-[11px] text-ink-tertiary">Privasi penuh per akun</p>
            </div>

            <div className="p-5 rounded-xl bg-paper-secondary/60 border border-paper-border space-y-1 text-left shadow-2xs transition-all duration-200">
              <p className="text-3xl font-semibold font-editorial text-tinta-600">
                PWA
              </p>
              <p className="text-xs text-ink-secondary font-medium">Web & Mobile Instan</p>
              <p className="text-[11px] text-ink-tertiary">Tanpa boros memori HP</p>
            </div>

            <div className="p-5 rounded-xl bg-paper-secondary/60 border border-paper-border space-y-1 text-left shadow-2xs transition-all duration-200">
              <p className="text-3xl font-semibold font-editorial text-ink-primary">
                RLS
              </p>
              <p className="text-xs text-ink-secondary font-medium">Data Terisolasi Aman</p>
              <p className="text-[11px] text-ink-tertiary">Row-Level Security aktif</p>
            </div>

            <div className="p-5 rounded-xl bg-paper-secondary/60 border border-paper-border space-y-1 text-left shadow-2xs transition-all duration-200">
              <p className="text-3xl font-semibold font-editorial text-emerald-600">
                &lt;{latency}ms
              </p>
              <p className="text-xs text-ink-secondary font-medium">Latensi Navigasi</p>
              <p className="text-[11px] text-ink-tertiary">Ringan & responsif</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
