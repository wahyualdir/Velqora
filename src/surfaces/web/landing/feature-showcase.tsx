import React from "react";

export function FeatureShowcase() {
  return (
    <section id="fitur" className="py-20 lg:py-28 border-b border-border">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="max-w-xl space-y-3 mb-14">
          <h2 className="text-2xl lg:text-[2rem] font-bold font-display tracking-tight text-text-primary leading-tight">
            Peralatan yang memang dibutuhkan mahasiswa.
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Bukan kumpulan fitur generik. Tiap alat dirancang dari masalah nyata perkuliahan — menyusun KRS, merapikan slide dosen, sampai latihan kuis lewat AI.
          </p>
        </div>

        {/* Broken-rhythm Bento Grid — 1 full-width editorial + 3 compact + 1 wide */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Feature 1: Jadwal Cerdas — FULL WIDTH, editorial feel */}
          <div className="lg:col-span-12 p-6 lg:p-8 rounded-2xl border border-border bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-brand-500/8 text-brand-500 text-[11px] font-semibold uppercase tracking-wider">
                  Fitur Utama
                </div>
                <h3 className="text-xl font-bold font-display text-text-primary leading-snug">
                  Jadwal kuliah cerdas dengan deteksi bentrok otomatis
                </h3>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  Sistem mendeteksi tumpang-tindih jam kuliah secara matematis, mengelompokkan per hari, dan menghitung beban SKS otomatis. Unggah silabus PDF/Excel — jadwal langsung jadi.
                </p>
              </div>
              {/* Live schedule mini-preview */}
              <div className="p-4 rounded-xl bg-surface-secondary border border-border space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-text-primary">Selasa • 3 Sesi</span>
                  <span className="text-emerald-600 font-medium text-[10px]">Status: Optimal</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { time: "08:00–09:40", name: "Pemrograman Web" },
                    { time: "10:00–11:40", name: "Jaringan Komputer" },
                    { time: "13:00–15:30", name: "Kecerdasan Buatan" },
                  ].map((s) => (
                    <div key={s.name} className="p-2 rounded-lg bg-white border border-border">
                      <p className="text-[10px] text-text-tertiary">{s.time}</p>
                      <p className="font-bold text-text-primary truncate">{s.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: AI Tutor — 5 cols */}
          <div className="lg:col-span-5 p-6 rounded-2xl border border-border bg-white space-y-5">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/8 text-purple-600 flex items-center justify-center">
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              </div>
              <h3 className="text-base font-bold font-display text-text-primary">AI Tutor Kontekstual</h3>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                Tanya konsep sulit kapan pun. AI memahami silabus dan konteks materi kuliah Anda — jawaban yang relevan, bukan generik.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-surface-secondary border border-border space-y-2 text-xs">
              <div className="p-2 rounded-lg bg-white border border-border text-[11px] text-text-secondary">
                <span className="font-semibold text-text-primary">Kamu:</span> Apa beda Dijkstra vs Bellman-Ford?
              </div>
              <div className="p-2 rounded-lg bg-brand-500/5 border border-brand-500/15 text-[11px] text-brand-700">
                <span className="font-semibold text-brand-600">AI Tutor:</span> Dijkstra lebih cepat O(E+V log V), tapi Bellman-Ford bisa menangani bobot negatif...
              </div>
            </div>
          </div>

          {/* Feature 3: Arsip Modul — 3 cols */}
          <div className="lg:col-span-3 p-6 rounded-2xl border border-border bg-white space-y-5">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/8 text-amber-600 flex items-center justify-center">
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0L12 17.25 6.43 14.25m11.14 0l4.179 2.25L12 21.75l-9.75-5.25 4.179-2.25" />
                </svg>
              </div>
              <h3 className="text-base font-bold font-display text-text-primary">Arsip Modul</h3>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                Satukan slide PDF, rangkuman DOCX, dan catatan per mata kuliah.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-surface-secondary border border-border grid grid-cols-2 gap-1.5 text-[10px]">
              <span className="px-2 py-1 rounded bg-white border border-border text-rose-600 font-mono text-center">.PDF</span>
              <span className="px-2 py-1 rounded bg-white border border-border text-blue-600 font-mono text-center">.DOCX</span>
              <span className="px-2 py-1 rounded bg-white border border-border text-amber-600 font-mono text-center">.PPTX</span>
              <span className="px-2 py-1 rounded bg-white border border-border text-emerald-600 font-mono text-center">.PY</span>
            </div>
          </div>

          {/* Feature 4: Pelacakan Tugas — 4 cols */}
          <div className="lg:col-span-4 p-6 rounded-2xl border border-border bg-white space-y-5">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-rose-500/8 text-rose-600 flex items-center justify-center">
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold font-display text-text-primary">Pelacakan Tugas</h3>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                Lacak tenggat pengumpulan dengan indikator prioritas. Tidak ada tugas yang terlewat.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-surface-secondary border border-border space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between p-1.5 rounded bg-white border border-border">
                <span className="font-medium text-text-primary truncate">Tugas ERD Database</span>
                <span className="text-[10px] text-rose-500 font-medium shrink-0">Besok</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-white border border-border">
                <span className="font-medium text-text-primary truncate">Laporan Jarkom</span>
                <span className="text-[10px] text-amber-500 font-medium shrink-0">3 hari</span>
              </div>
            </div>
          </div>

          {/* Feature 5: Playground Kode — wide, 8 cols */}
          <div className="lg:col-span-8 p-6 rounded-2xl border border-border bg-white space-y-5">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/8 text-emerald-600 flex items-center justify-center">
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
              </div>
              <h3 className="text-base font-bold font-display text-text-primary">Playground Kode & OCR Catatan</h3>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                Uji snippet kode di editor terintegrasi, atau pindai foto papan tulis dosen jadi teks yang bisa diedit otomatis.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-surface-secondary border border-border space-y-1.5 font-mono text-[11px] text-text-secondary">
              <div className="flex items-center justify-between text-[10px] text-text-tertiary border-b border-border pb-1.5">
                <span>quick_sort.py</span>
                <span className="text-emerald-600">● Eksekusi Sukses (0.04s)</span>
              </div>
              <pre className="text-text-primary overflow-x-auto">
                <code>{`def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    # Ekstraksi OCR Otomatis`}</code>
              </pre>
            </div>
          </div>

          {/* Feature 6: Kuis AI — 4 cols, compact */}
          <div className="lg:col-span-4 p-6 rounded-2xl border border-border bg-white space-y-4">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/8 text-cyan-600 flex items-center justify-center">
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <h3 className="text-base font-bold font-display text-text-primary">Kuis Latihan AI</h3>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                AI generate soal latihan dari materi Anda. Uji pemahaman sebelum ujian.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
