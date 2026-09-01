import React from "react";

const steps = [
  {
    num: "01",
    title: "Unggah Jadwal Kuliah",
    desc: "Masukkan jadwal manual atau unggah silabus PDF/Excel — kalender semester terbentuk otomatis dengan deteksi bentrok.",
    emphasis: true,
  },
  {
    num: "02",
    title: "Organisasi Materi",
    desc: "Simpan slide dosen, rangkuman, dan referensi per mata kuliah. Cari lintas format.",
    emphasis: false,
  },
  {
    num: "03",
    title: "Pantau Deadline",
    desc: "Lacak tenggat tugas dengan prioritas. Notifikasi di ponsel saat mendekati batas waktu.",
    emphasis: false,
  },
  {
    num: "04",
    title: "Tanya AI Tutor",
    desc: "Konsep sulit? Tanya langsung. AI memahami konteks silabus Anda.",
    emphasis: false,
  },
];

export function WorkflowNarrative() {
  return (
    <section id="alur-kerja" className="py-20 lg:py-28 border-b border-border bg-surface-secondary/30">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="max-w-xl space-y-3 mb-14">
          <h2 className="text-2xl lg:text-[2rem] font-bold font-display tracking-tight text-text-primary leading-tight">
            Dari awal semester sampai ujian akhir.
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Empat langkah — tapi bukan empat kotak yang sama. Langkah pertama yang paling penting.
          </p>
        </div>

        {/* Asymmetric timeline: step 1 gets more visual weight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Step 1 — takes 5 columns (larger) */}
          <div className="lg:col-span-5 p-7 rounded-2xl border border-brand-500/20 bg-white space-y-4 relative">
            <div className="absolute top-6 right-6 w-14 h-14 rounded-full bg-brand-500/5 flex items-center justify-center">
              <span className="text-2xl font-bold font-mono text-brand-500/40">01</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-500 text-white font-mono font-bold text-sm flex items-center justify-center">
              01
            </div>
            <h3 className="text-lg font-bold text-text-primary font-display">{steps[0].title}</h3>
            <p className="text-[13px] text-text-secondary leading-relaxed pr-16">
              {steps[0].desc}
            </p>
          </div>

          {/* Steps 2-4 — share 7 columns, stacked compact */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {steps.slice(1).map((step) => (
              <div key={step.num} className="p-5 rounded-2xl border border-border bg-white space-y-3">
                <div className="w-9 h-9 rounded-full bg-surface-secondary border border-border text-text-tertiary font-mono font-bold text-xs flex items-center justify-center">
                  {step.num}
                </div>
                <h3 className="text-sm font-bold text-text-primary">{step.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Connecting flow indicator */}
        <div className="hidden lg:flex items-center justify-center gap-2 mt-8 text-text-tertiary">
          <div className="w-8 h-px bg-border" />
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
          <span className="text-[11px] font-medium">Alur berulang setiap semester</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
          <div className="w-8 h-px bg-border" />
        </div>
      </div>
    </section>
  );
}
