import React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export function ProductDuality() {
  return (
    <section id="arsitektur" className="py-20 lg:py-28 border-b border-border bg-surface-secondary/50">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="max-w-xl space-y-3 mb-14">
          <h2 className="text-2xl lg:text-[2rem] font-bold font-display tracking-tight text-text-primary leading-tight">
            Satu akun, dua pengalaman yang berbeda.
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Laptop untuk mengerjakan tugas dan menyusun materi. Ponsel untuk cek jadwal dan deadline di perjalanan kampus. Keduanya tersinkronisasi.
          </p>
        </div>

        {/* Asymmetric Layout: Desktop gets more emphasis (7/5 split, not 6/6) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Web Desktop — larger, primary */}
          <div className="lg:col-span-7 p-7 lg:p-9 rounded-2xl border border-border bg-white space-y-6">
            <div className="flex items-start gap-4">
              {/* Custom SVG — laptop icon, not lucide generic */}
              <div className="w-12 h-12 rounded-xl bg-brand-500/8 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-brand-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-text-primary">Web Desktop</h3>
                <p className="text-xs text-text-tertiary mt-0.5">Ruang kerja layar lebar untuk fokus mendalam</p>
              </div>
            </div>

            <p className="text-[13px] text-text-secondary leading-relaxed">
              Dioptimalkan untuk sesi belajar panjang di laptop: navigasi sidebar, tabel data dengan sorting, editor kode split-pane, dan pencarian cepat dengan <kbd className="px-1.5 py-0.5 rounded bg-surface-secondary border border-border font-mono text-[10px] text-text-tertiary">Ctrl+K</kbd>.
            </p>

            <div className="space-y-2.5 pt-3 border-t border-border/60">
              {[
                "Mode tenang ramah mata untuk belajar larut malam",
                "Impor jadwal otomatis dari Excel, CSV, atau PDF silabus",
                "Tabel jadwal multi-kolom dengan deteksi bentrok instan",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-[13px] text-text-secondary">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile App — smaller, complementary */}
          <div className="lg:col-span-5 p-7 lg:p-8 rounded-2xl border border-border bg-white space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/8 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-text-primary">Mobile App</h3>
                <p className="text-xs text-text-tertiary mt-0.5">Pendamping harian di saku Anda</p>
              </div>
            </div>

            <p className="text-[13px] text-text-secondary leading-relaxed">
              Pasang via PWA — tanpa app store. Cek jadwal kuliah, ruangan, dan deadline tugas sambil jalan ke kelas.
            </p>

            <div className="space-y-2.5 pt-3 border-t border-border/60">
              {[
                "Navigasi satu tangan dengan bottom bar ergonomis",
                "Cache offline — buka jadwal saat sinyal lemah",
                "Sheet interaktif buka-tutup dengan gestur",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-[13px] text-text-secondary">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
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
