"use client";

import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useScrollReveal } from "./use-landing-animation";

const workflowSteps = [
  {
    chapter: "Bab I",
    numeral: "I",
    phase: "Minggu 1",
    title: "Plot KRS & Cek Bentrok",
    desc: "Unggah jadwal dari portal akademik. Sistem langsung memvalidasi potensi tabrakan jam kuliah dan memetakan jadwal mingguanmu.",
  },
  {
    chapter: "Bab II",
    numeral: "II",
    phase: "Minggu 2–7",
    title: "Kumpulkan Slide & Catatan",
    desc: "Setiap ada materi baru dari dosen, simpan di folder mata kuliah masing-masing. Terbuka dan bisa dicari kapan pun.",
  },
  {
    chapter: "Bab III",
    numeral: "III",
    phase: "Minggu 8–14",
    title: "Kendalikan Deadline Tugas",
    desc: "Lacak tenggat tugas kuliah dan laporan praktikum dengan jelas. Tidak ada lagi tugas penting yang terlupa.",
  },
  {
    chapter: "Bab IV",
    numeral: "IV",
    phase: "Pekan Ujian",
    title: "Bedah Konsep bareng AI",
    desc: "Tanya bagian materi yang belum dipahami dan uji pemahaman lewat kuis latihan otomatis sebelum hari H ujian.",
  },
];

export function WorkflowNarrative() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="alur-kerja" className="py-20 lg:py-28 border-b border-paper-border bg-paper-secondary/30">
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
            <span className="font-editorial italic text-[15px] text-tinta-700">Alur Semester</span>
            <span className="h-px w-20 bg-paper-border" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-semibold font-editorial tracking-tight text-ink-primary leading-tight">
            Dari pengisian KRS sampai malam sebelum ujian akhir.
          </h2>
          <p className="text-sm sm:text-base text-ink-secondary font-sans leading-relaxed">
            Velqora menemani dinamika perkuliahanmu di setiap fase semester, membantu menjaga ritme belajar agar tetap teratur dan bebas stres.
          </p>
        </div>

        {/* Asymmetric Timeline: Step 1 gets larger visual anchor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Step 1 — Anchor (Bab I, rounded-2xl) */}
          <div
            className={`lg:col-span-5 p-7 sm:p-8 rounded-2xl border border-tinta-500/30 bg-paper-card shadow-xs transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] space-y-4 text-left relative overflow-hidden ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            {/* Roman Numeral Watermark */}
            <div className="absolute top-4 right-6 w-16 h-16 flex items-center justify-end pointer-events-none select-none">
              <span className="text-5xl font-editorial italic font-bold text-tinta-500/15">
                {workflowSteps[0].numeral}
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tinta-600 text-white font-editorial text-xs shadow-2xs">
              <Sparkles className="w-3 h-3 text-tinta-200" />
              <span className="font-semibold tracking-wide">{workflowSteps[0].chapter} • {workflowSteps[0].phase}</span>
            </div>
            <h3 className="text-xl font-semibold text-ink-primary font-editorial pt-1">{workflowSteps[0].title}</h3>
            <p className="text-[13.5px] text-ink-secondary leading-relaxed pr-8">
              {workflowSteps[0].desc}
            </p>
          </div>

          {/* Steps 2, 3, 4 — Compact Grid (Bab II, III, IV, rounded-xl) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {workflowSteps.slice(1).map((step, idx) => (
              <div
                key={step.phase}
                className={`p-5 sm:p-6 rounded-xl border border-paper-border bg-paper-card shadow-xs transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] space-y-3 text-left flex flex-col justify-between ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${(idx + 1) * 90}ms` }}
              >
                <div className="space-y-3">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-paper-secondary border border-paper-border text-ink-secondary font-editorial text-[12px]">
                    <span className="font-semibold text-tinta-700">{step.chapter}</span>
                    <span className="mx-1 text-ink-tertiary">•</span>
                    <span>{step.phase}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-ink-primary font-editorial">{step.title}</h3>
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Narrative Flow Indicator */}
        <div
          className={`hidden lg:flex items-center justify-center gap-3 mt-10 text-ink-tertiary select-none transition-all duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "360ms" }}
        >
          <div className="w-12 h-px bg-paper-border" />
          <div className="flex items-center gap-2 text-[12px] font-medium text-ink-secondary">
            <span>Satu alur terpadu yang berulang dan menyempurnakan setiap semester barumu</span>
            <ArrowRight className="w-3.5 h-3.5 text-tinta-600" />
          </div>
          <div className="w-12 h-px bg-paper-border" />
        </div>
      </div>
    </section>
  );
}
