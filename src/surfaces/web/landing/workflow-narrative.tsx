"use client";

import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useScrollReveal } from "./use-landing-animation";

const workflowSteps = [
  {
    phase: "Minggu 1",
    title: "Plot KRS & Cek Bentrok",
    desc: "Unggah jadwal dari portal akademik. Sistem langsung memvalidasi potensi tabrakan jam kuliah dan memetakan jadwal mingguanmu.",
    highlight: true,
  },
  {
    phase: "Minggu 2–7",
    title: "Kumpulkan Slide & Catatan",
    desc: "Setiap ada materi baru dari dosen, simpan di folder mata kuliah masing-masing. Terbuka dan bisa dicari kapan pun.",
    highlight: false,
  },
  {
    phase: "Minggu 8–14",
    title: "Kendalikan Deadline Tugas",
    desc: "Lacak tenggat tugas kuliah dan laporan praktikum dengan jelas. Tidak ada lagi tugas penting yang terlupa.",
    highlight: false,
  },
  {
    phase: "Pekan Ujian",
    title: "Bedah Konsep bareng AI",
    desc: "Tanya bagian materi yang belum dipahami dan uji pemahaman lewat kuis latihan otomatis sebelum hari H ujian.",
    highlight: false,
  },
];

export function WorkflowNarrative() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="alur-kerja" className="py-20 lg:py-28 border-b border-border bg-surface-secondary/40">
      <div
        ref={ref}
        className={`max-w-[1200px] mx-auto px-6 lg:px-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="max-w-xl space-y-3 mb-14 text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-500/10 text-brand-600 text-xs font-semibold uppercase tracking-wider">
            Alur Semester
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-bold font-display tracking-tight text-text-primary leading-tight">
            Dari pengisian KRS sampai malam sebelum ujian akhir.
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Velqora menemani dinamika perkuliahanmu di setiap fase semester, membantu menjaga ritme belajar agar tetap teratur dan bebas stres.
          </p>
        </div>

        {/* Asymmetric Timeline: Step 1 gets larger visual anchor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Step 1 — Anchor (5 cols) */}
          <div className="lg:col-span-5 p-7 sm:p-8 rounded-2xl border border-brand-500/30 bg-white shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 space-y-4 text-left relative overflow-hidden">
            <div className="absolute top-6 right-6 w-16 h-16 rounded-full bg-brand-500/5 flex items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold font-mono text-brand-500/30">01</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500 text-white font-mono font-bold text-xs shadow-2xs">
              <Sparkles className="w-3 h-3" />
              <span>{workflowSteps[0].phase}</span>
            </div>
            <h3 className="text-xl font-bold text-text-primary font-display pt-1">{workflowSteps[0].title}</h3>
            <p className="text-[13.5px] text-text-secondary leading-relaxed pr-8">
              {workflowSteps[0].desc}
            </p>
          </div>

          {/* Steps 2, 3, 4 — Compact Grid (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {workflowSteps.slice(1).map((step, idx) => (
              <div
                key={step.phase}
                className="p-5 sm:p-6 rounded-2xl border border-border bg-white shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 space-y-3 text-left flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-surface-secondary border border-border text-text-secondary font-mono font-bold text-[11px]">
                    0{idx + 2} • {step.phase}
                  </div>
                  <h3 className="text-sm font-bold text-text-primary font-display">{step.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Narrative Flow Indicator */}
        <div className="hidden lg:flex items-center justify-center gap-3 mt-10 text-text-tertiary select-none">
          <div className="w-12 h-px bg-border" />
          <div className="flex items-center gap-2 text-[12px] font-medium text-text-secondary">
            <span>Satu alur terpadu yang berulang dan menyempurnakan setiap semester barumu</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-500" />
          </div>
          <div className="w-12 h-px bg-border" />
        </div>
      </div>
    </section>
  );
}
