"use client";

import React from "react";
import { CheckCircle2, Laptop, Smartphone } from "lucide-react";
import { useScrollReveal } from "./use-landing-animation";

export function ProductDuality() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="arsitektur" className="py-20 lg:py-28 border-b border-border bg-surface-secondary/40">
      <div
        ref={ref}
        className={`max-w-[1200px] mx-auto px-6 lg:px-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="max-w-xl space-y-3 mb-14 text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-500/10 text-brand-600 text-xs font-semibold uppercase tracking-wider">
            Web & Mobile
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-bold font-display tracking-tight text-text-primary leading-tight">
            Bekerja serius di laptop, pantau cepat dari ponsel saat jalan ke kampus.
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Satu akun tersinkronisasi otomatis. Kamu tidak perlu mengetik ulang jadwal atau memindahkan berkas materi secara manual antar perangkat.
          </p>
        </div>

        {/* Asymmetric Layout: Desktop gets 7 cols, Mobile gets 5 cols */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Web Desktop — larger, workspace focus */}
          <div className="lg:col-span-7 p-7 lg:p-9 rounded-2xl border border-border bg-white space-y-6 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center shrink-0 border border-brand-500/20">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-text-primary">Web Desktop Workspace</h3>
                <p className="text-xs text-text-tertiary mt-0.5 font-medium">Layar lebar untuk sesi belajar panjang & mendalam</p>
              </div>
            </div>

            <p className="text-[13.5px] text-text-secondary leading-relaxed">
              Dirancang untuk kenyamanan di laptop: navigasi sidebar yang leluasa, tabel jadwal dengan sorting dinamis, editor kode terintegrasi, dan pintasan keyboard instan <kbd className="px-2 py-0.5 rounded bg-surface-secondary border border-border font-mono text-[11px] text-text-primary font-semibold shadow-2xs">Ctrl + K</kbd> untuk mencari materi dalam hitungan detik.
            </p>

            <div className="space-y-3 pt-3 border-t border-border/70">
              {[
                "Impor otomatis kalender dari file PDF silabus atau Excel KRS kampus",
                "Tabel multi-kolom dengan deteksi bentrok jam kuliah secara matematis",
                "Editor catatan dan playground kode split-screen yang ramah mata",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-[13px] text-text-secondary">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile App — compact, daily companion */}
          <div className="lg:col-span-5 p-7 lg:p-8 rounded-2xl border border-border bg-white space-y-6 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-text-primary">Mobile Companion App</h3>
                <p className="text-xs text-text-tertiary mt-0.5 font-medium">Akses ringkas dari saku saat berpindah kelas</p>
              </div>
            </div>

            <p className="text-[13.5px] text-text-secondary leading-relaxed">
              Pasang langsung lewat browser (PWA) tanpa perlu unduh ratusan MB dari app store. Cek ruangan kuliah berikutnya dan tenggat tugas hanya dengan satu ketukan ibu jari.
            </p>

            <div className="space-y-3 pt-3 border-t border-border/70">
              {[
                "Navigasi ergonomis satu tangan dengan bottom bar yang responsif",
                "Cache cerdas — jadwal tetap bisa dibuka saat sinyal kampus ngadat",
                "Panel bottom-sheet interaktif untuk detail tugas yang cepat ditutup",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-[13px] text-text-secondary">
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
