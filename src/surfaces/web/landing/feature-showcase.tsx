"use client";

import React from "react";
import { Calendar, Bot, FolderArchive, CheckSquare, Code2, BrainCircuit } from "lucide-react";
import { useScrollReveal } from "./use-landing-animation";

export function FeatureShowcase() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.08 });

  return (
    <section id="fitur" className="py-20 lg:py-28 border-b border-paper-border">
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
            <span className="font-editorial italic text-[15px] text-tinta-700">Alat Produktivitas Kuliah</span>
            <span className="h-px w-24 bg-paper-border" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-semibold font-editorial tracking-tight text-ink-primary leading-tight">
            Peralatan yang memang menjawab keluhan mahasiswa.
          </h2>
          <p className="text-sm sm:text-base text-ink-secondary font-sans leading-relaxed">
            Bukan kumpulan gimmick. Tiap fitur dibangun dari pengalaman nyata di ruang kuliah: jadwal bertabrakan saat KRS-an, materi berserakan di grup chat, hingga persiapan ujian tengah malam.
          </p>
        </div>

        {/* Broken-rhythm Bento Grid — 12 cols total */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Feature 1: Jadwal Kuliah Pintar — FULL WIDTH ANCHOR (rounded-2xl) */}
          <div
            className={`lg:col-span-12 p-6 sm:p-8 rounded-2xl border border-paper-border bg-paper-card shadow-xs transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-tinta-50 text-tinta-700 text-xs font-bold uppercase tracking-wider border border-tinta-200/60">
                  <Calendar className="w-3.5 h-3.5" />
                  Fitur Utama
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold font-editorial text-ink-primary leading-snug">
                  Jadwal kuliah pintar dengan deteksi bentrok instan
                </h3>
                <p className="text-[13.5px] text-ink-secondary leading-relaxed">
                  Cukup unggah dokumen silabus PDF atau tabel Excel dari portal kampus. Sistem secara otomatis memetakan jadwal per hari, menghitung total SKS, dan memberi peringatan merah jika ada jam kuliah yang tabrakan.
                </p>
              </div>

              {/* Interactive Schedule Mini-Preview */}
              <div className="lg:col-span-6 p-4 rounded-xl bg-paper-secondary/60 border border-paper-border space-y-3 text-xs">
                <div className="flex items-center justify-between text-[11px] pb-1 border-b border-paper-border">
                  <span className="font-semibold text-ink-primary font-editorial">Selasa • 3 Sesi Terjadwal</span>
                  <span className="text-emerald-700 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span>✓</span> Bebas Bentrok
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { time: "08:00 – 09:40", name: "Pemrograman Web", room: "Lab 3", tag: "2 SKS" },
                    { time: "10:00 – 11:40", name: "Jaringan Komputer", room: "R. 302", tag: "2 SKS" },
                    { time: "13:00 – 15:30", name: "Kecerdasan Buatan", room: "Auditorium", tag: "3 SKS" },
                  ].map((s) => (
                    <div key={s.name} className="p-2.5 rounded-lg bg-paper-card border border-paper-border shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-ink-tertiary">
                        <span>{s.time}</span>
                        <span className="font-mono text-tinta-600 font-semibold">{s.tag}</span>
                      </div>
                      <p className="font-semibold text-ink-primary font-editorial text-[11px] truncate">{s.name}</p>
                      <p className="text-[10px] text-ink-tertiary">{s.room}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: AI Tutor Kontekstual — 5 cols (rounded-xl) */}
          <div
            className={`lg:col-span-5 p-6 rounded-xl border border-paper-border bg-paper-card shadow-xs transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] space-y-4 text-left flex flex-col justify-between ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "70ms" }}
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center border border-purple-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold font-editorial text-ink-primary">AI Tutor Kontekstual</h3>
              <p className="text-[13px] text-ink-secondary leading-relaxed">
                Bukan AI umum yang menjawab sembarangan. Tutor Velqora membaca konteks modul kuliahmu, jadi saat kamu bertanya materi sulit di malam hari, penjelasannya langsung selaras dengan materi dosen.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-paper-secondary/60 border border-paper-border space-y-2 text-xs">
              <div className="p-2 rounded-lg bg-paper-card border border-paper-border text-[11px] text-ink-secondary shadow-2xs">
                <span className="font-semibold text-ink-primary">Mahasiswa:</span> Kapan sebaiknya pakai Dijkstra dibanding Bellman-Ford?
              </div>
              <div className="p-2 rounded-lg bg-tinta-50/80 border border-tinta-200/60 text-[11px] text-tinta-900 leading-relaxed">
                <span className="font-semibold text-tinta-700">AI Tutor:</span> Dijkstra lebih efisien untuk graf berbobot non-negatif O((V+E) log V). Gunakan Bellman-Ford jika graf memiliki edge bernilai negatif...
              </div>
            </div>
          </div>

          {/* Feature 3: Arsip Modul & Dokumen — 3 cols (rounded-xl) */}
          <div
            className={`lg:col-span-3 p-6 rounded-xl border border-paper-border bg-paper-card shadow-xs transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] space-y-4 text-left flex flex-col justify-between ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "140ms" }}
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
                <FolderArchive className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold font-editorial text-ink-primary">Arsip Modul Rapi</h3>
              <p className="text-[13px] text-ink-secondary leading-relaxed">
                Kumpulkan slide materi PPTX, diktat PDF, dan dokumen tugas per mata kuliah. Tidak ada lagi materi kuliah yang tercecer.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-paper-secondary/60 border border-paper-border grid grid-cols-2 gap-1.5 text-[10px] font-mono font-bold">
              <span className="px-2 py-1.5 rounded-md bg-paper-card border border-paper-border text-rose-600 text-center shadow-2xs">.PDF</span>
              <span className="px-2 py-1.5 rounded-md bg-paper-card border border-paper-border text-blue-600 text-center shadow-2xs">.DOCX</span>
              <span className="px-2 py-1.5 rounded-md bg-paper-card border border-paper-border text-amber-600 text-center shadow-2xs">.PPTX</span>
              <span className="px-2 py-1.5 rounded-md bg-paper-card border border-paper-border text-emerald-600 text-center shadow-2xs">.PY / .JS</span>
            </div>
          </div>

          {/* Feature 4: Pelacakan Tugas & Deadline — 4 cols (rounded-xl) */}
          <div
            className={`lg:col-span-4 p-6 rounded-xl border border-paper-border bg-paper-card shadow-xs transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] space-y-4 text-left flex flex-col justify-between ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "210ms" }}
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center border border-rose-500/20">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold font-editorial text-ink-primary">Tenggat Tugas Terkontrol</h3>
              <p className="text-[13px] text-ink-secondary leading-relaxed">
                Kelola beban tugas berdasarkan urgensi dan tanggal pengumpulan. Hindari kepanikan tugas menumpuk di akhir pekan.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-paper-secondary/60 border border-paper-border space-y-2 text-[11px]">
              <div className="flex items-center justify-between p-2 rounded-lg bg-paper-card border border-paper-border shadow-2xs">
                <span className="font-semibold text-ink-primary truncate">Tugas Desain Basis Data</span>
                <span className="text-[10px] text-rose-700 bg-rose-500/10 px-2 py-0.5 rounded-md font-bold shrink-0">Besok</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-paper-card border border-paper-border shadow-2xs">
                <span className="font-semibold text-ink-primary truncate">Laporan Akhir Jaringan</span>
                <span className="text-[10px] text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded-md font-bold shrink-0">4 Hari</span>
              </div>
            </div>
          </div>

          {/* Feature 5: Playground Kode & OCR Catatan — 8 cols (rounded-xl) */}
          <div
            className={`lg:col-span-8 p-6 rounded-xl border border-paper-border bg-paper-card shadow-xs transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] space-y-4 text-left ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "280ms" }}
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold font-editorial text-ink-primary">Playground Kode & OCR Catatan Kuliah</h3>
              <p className="text-[13px] text-ink-secondary leading-relaxed">
                Uji coba algoritma dan snippet program langsung di browser tanpa instalasi compiler yang rumit. Atau foto coretan rumus di papan tulis dosen, sistem akan mengekstraknya jadi teks digital yang bisa langsung disunting.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-paper-secondary/60 border border-paper-border space-y-1.5 font-mono text-[11px] text-ink-secondary">
              <div className="flex items-center justify-between text-[10px] text-ink-tertiary border-b border-paper-border pb-1.5">
                <span className="font-semibold text-ink-primary">binary_search.py</span>
                <span className="text-emerald-700 font-semibold">● Output Terverifikasi (0.02s)</span>
              </div>
              <pre className="text-ink-primary overflow-x-auto p-1 leading-relaxed">
                <code>{`def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target: return mid
        elif arr[mid] < target: low = mid + 1
        else: high = mid - 1
    return -1`}</code>
              </pre>
            </div>
          </div>

          {/* Feature 6: Latihan & Kuis AI — 4 cols (rounded-xl) */}
          <div
            className={`lg:col-span-4 p-6 rounded-xl border border-paper-border bg-paper-card shadow-xs transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] space-y-4 text-left flex flex-col justify-between ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "350ms" }}
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center border border-cyan-500/20">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold font-editorial text-ink-primary">Latihan & Kuis AI</h3>
              <p className="text-[13px] text-ink-secondary leading-relaxed">
                Hasilkan kuis latihan interaktif otomatis dari dokumen materi kuliahmu. Uji sejauh mana pemahamanmu sebelum menghadapi UTS atau UAS.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-paper-secondary/60 border border-paper-border space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="font-semibold font-editorial text-ink-primary">Skor Uji Coba Terakhir</span>
                <span className="text-emerald-700 font-bold font-mono">92/100</span>
              </div>
              <div className="w-full h-1.5 bg-paper-border rounded-full overflow-hidden">
                <div className="w-[92%] h-full bg-emerald-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
