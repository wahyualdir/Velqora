"use client";

import React from "react";
import { CheckCircle2, Laptop, Smartphone } from "lucide-react";
import { useScrollReveal } from "./use-landing-animation";

export function ProductDuality() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="arsitektur" className="py-20 lg:py-28 border-b border-paper-border bg-paper-secondary/30">
      <div
        ref={ref}
        className="max-w-[1200px] mx-auto px-6 lg:px-8"
      >
        <div
          className={`max-w-xl space-y-3 mb-14 text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          {/* Editorial Kicker */}
          <div className="flex items-center gap-3">
            <span className="font-editorial italic text-[15px] text-tinta-700">Dua Layar</span>
            <span className="h-px w-20 bg-paper-border" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-semibold font-editorial tracking-tight text-ink-primary leading-tight">
            Bekerja serius di laptop, pantau cepat dari ponsel saat jalan ke kampus.
          </h2>
          <p className="text-sm sm:text-base text-ink-secondary font-sans leading-relaxed">
            Satu akun tersinkronisasi otomatis. Kamu tidak perlu mengetik ulang jadwal atau memindahkan berkas materi secara manual antar perangkat.
          </p>
        </div>

        {/* Asymmetric Layout with Staggered Entrance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Web Desktop — larger, workspace focus (rounded-2xl anchor) */}
          <div
            className={`lg:col-span-7 p-7 lg:p-9 rounded-2xl border border-paper-border bg-paper-card space-y-6 shadow-xs transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "60ms" }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-tinta-50 text-tinta-700 flex items-center justify-center shrink-0 border border-tinta-200/60">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold font-editorial text-ink-primary">Web Desktop Workspace</h3>
                <p className="text-xs text-ink-tertiary mt-0.5 font-medium">Layar lebar untuk sesi belajar panjang & mendalam</p>
              </div>
            </div>

            <p className="text-[13.5px] text-ink-secondary leading-relaxed">
              Dirancang untuk kenyamanan di laptop: navigasi sidebar yang leluasa, tabel jadwal dengan sorting dinamis, editor kode terintegrasi, dan pintasan keyboard instan <kbd className="px-2 py-0.5 rounded bg-paper-secondary border border-paper-border font-mono text-[11px] text-ink-primary font-semibold shadow-2xs">Ctrl + K</kbd> untuk mencari materi dalam hitungan detik.
            </p>

            <div className="space-y-3 pt-3 border-t border-paper-border">
              {[
                "Impor otomatis kalender dari file PDF silabus atau Excel KRS kampus",
                "Tabel multi-kolom dengan deteksi bentrok jam kuliah secara matematis",
                "Editor catatan dan playground kode split-screen yang ramah mata",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-[13px] text-ink-secondary">
                  <CheckCircle2 className="w-4 h-4 text-tinta-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile App — compact, daily companion (rounded-xl companion) */}
          <div
            className={`lg:col-span-5 p-7 lg:p-8 rounded-xl border border-paper-border bg-paper-card space-y-6 shadow-xs transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "140ms" }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold font-editorial text-ink-primary">Mobile Companion App</h3>
                <p className="text-xs text-ink-tertiary mt-0.5 font-medium">Akses ringkas dari saku saat berpindah kelas</p>
              </div>
            </div>

            <p className="text-[13.5px] text-ink-secondary leading-relaxed">
              Pasang langsung lewat browser (PWA) tanpa perlu unduh ratusan MB dari app store. Cek ruangan kuliah berikutnya dan tenggat tugas hanya dengan satu ketukan ibu jari.
            </p>

            <div className="space-y-3 pt-3 border-t border-paper-border">
              {[
                "Navigasi ergonomis satu tangan dengan bottom bar yang responsif",
                "Cache cerdas — jadwal tetap bisa dibuka saat sinyal kampus ngadat",
                "Panel bottom-sheet interaktif untuk detail tugas yang cepat ditutup",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-[13px] text-ink-secondary">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
