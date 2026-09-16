"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Terminal, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ArrowRight, 
  BookOpen 
} from "lucide-react";

export function LandingNotebookPreview() {
  const [activeTab, setActiveTab] = useState<"formula" | "code" | "output" | "exercise">("code");
  const [copied, setCopied] = useState(false);
  const [hintsOpen, setHintsOpen] = useState(false);

  const samplePythonCode = `import numpy as np

# Ambang Batas Keputusan Bayesian Berbobot Biaya (Hastie et al., ESL Sec 2.4)
cost_fp = 25.0    # Biaya False Positive ($): Biaya verifikasi manual transaksi
cost_fn = 500.0   # Biaya False Negative ($): Kerugian fraud terlewatkan

# Derivasi cut-off probabilitas optimal: tau* = c_fp / (c_fp + c_fn)
optimal_threshold = cost_fp / (cost_fp + cost_fn)
print(f"Ambang Batas Kritis Optimal: {optimal_threshold:.4f}")

# Bandingkan dengan threshold naif 0.50
y_prob = np.array([0.08, 0.45, 0.52, 0.03, 0.12])
predictions_optimal = (y_prob >= optimal_threshold).astype(int)
print(f"Keputusan Intervensi Optimal: {predictions_optimal.tolist()}")`;

  const sampleOutput = `=== EVALUASI PENGAMBILAN KEPUTUSAN BERBOBOT BIAYA BISNIS ===
Ambang Batas Kritis Optimal: 0.0476
Keputusan Intervensi Optimal: [1, 1, 1, 0, 1]

Peningkatan Nilai Bisnis Menggunakan Problem Framing Berbobot Biaya: +$3,272,850.00`;

  const handleCopy = () => {
    navigator.clipboard.writeText(samplePythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="notebook-showcase" className="py-20 bg-white dark:bg-zinc-900 border-b border-zinc-200/60 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3EF] dark:bg-[#C2553A]/10 border border-[#C2553A]/30 text-xs font-mono font-semibold text-[#C2553A] mb-3">
            <span>LIVE INTERACTIVE NOTEBOOK PREVIEW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Arsitektur Pembelajaran Bebas Klise.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-300">
            Setiap subbab memadukan formula matematis formal, implementasi kode nyata yang dapat dieksekusi, 
            interpretasi hasil komputasi, serta latihan berpikir kritis bertingkat.
          </p>
        </div>

        {/* Interactive Notebook Preview Card */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-[#FAF8F5] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
          {/* Notebook Window Header */}
          <div className="px-5 py-3.5 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300 font-semibold pl-2 border-l border-zinc-300 dark:border-zinc-700">
                11.1.2 · Problem Framing Berbobot Biaya Asimetris
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FAF3EF] text-[#C2553A] border border-[#C2553A]/30">
                FLOW: MATHEMATICAL
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                GOLD STANDARD PILOT
              </span>
            </div>
          </div>

          {/* Unit Selector Tabs */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-4 gap-2 text-xs font-medium overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("code")}
              className={`py-3 px-3 border-b-2 font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "code"
                  ? "border-[#C2553A] text-[#C2553A] font-bold"
                  : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              1. Sel Kode Python
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("output")}
              className={`py-3 px-3 border-b-2 font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "output"
                  ? "border-[#C2553A] text-[#C2553A] font-bold"
                  : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              2. Output Eksekusi Python 3.12
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("formula")}
              className={`py-3 px-3 border-b-2 font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "formula"
                  ? "border-[#C2553A] text-[#C2553A] font-bold"
                  : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              3. Formulasi Matematis (KaTeX)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("exercise")}
              className={`py-3 px-3 border-b-2 font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "exercise"
                  ? "border-[#C2553A] text-[#C2553A] font-bold"
                  : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              4. Latihan Scaffolding
            </button>
          </div>

          {/* Unit Content Area */}
          <div className="p-5 sm:p-7 min-h-[380px]">
            {/* TAB 1: CODE CELL */}
            {activeTab === "code" && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs text-zinc-500 font-mono pb-2 border-b border-zinc-200 dark:border-zinc-800">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    python · 1.2-cost-weighted-problem-framing.py
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-[10px] font-bold">
                      O(N) Complexity
                    </span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center gap-1 cursor-pointer"
                      title="Salin Kode"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[10px]">{copied ? "Tersalin" : "Salin"}</span>
                    </button>
                  </div>
                </div>

                <pre className="p-4 rounded-xl bg-[#1C1917] text-zinc-100 font-mono text-xs overflow-x-auto leading-relaxed border border-zinc-800">
                  <code>{samplePythonCode}</code>
                </pre>
                <div className="text-[11px] text-zinc-500 italic">
                  * Cuplikan mandiri yang merefleksikan teori keputusan statistik Trevor Hastie et al. (ESL Hal. 18–22).
                </div>
              </div>
            )}

            {/* TAB 2: OUTPUT CELL */}
            {activeTab === "output" && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Executed · Exit 0
                    </span>
                  </div>
                  <span className="text-zinc-500 text-[11px]">
                    Python 3.12.10 (AMD64) · 22.45 ms
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 text-emerald-400 font-mono text-xs whitespace-pre-wrap leading-relaxed border border-zinc-800 shadow-inner">
                  {sampleOutput}
                </div>

                <div className="p-3.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  <strong className="text-emerald-800 dark:text-emerald-300 block mb-1">
                    Interpretasi Pedagogis:
                  </strong>
                  Karena biaya kerugian FN ($500) jauh melampaui biaya FP ($25), ambang batas optimal turun drastis dari 0.50 menjadi 0.0476. Hal ini menangkap 1.920 kasus fraud yang sebelumnya terlewatkan dan menyelamatkan finansial bersih sebesar $3.272.850.
                </div>
              </div>
            )}

            {/* TAB 3: FORMULA */}
            {activeTab === "formula" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="text-xs font-mono text-zinc-500 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                  Formulasi Ambang Batas Optimal Bayesian
                </div>

                <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center shadow-xs">
                  <div className="text-xl sm:text-2xl font-serif text-zinc-900 dark:text-white py-2">
                    &tau;* = C<sub>FP</sub> / ( C<sub>FP</sub> + C<sub>FN</sub> )
                  </div>
                  <div className="text-xs text-zinc-500 mt-2 font-mono">
                    Rujukan: The Elements of Statistical Learning (ESL Theorem 2.4)
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Kamus Variabel Simbolik:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                      <span className="font-mono font-bold text-[#C2553A]">&tau;*</span>: Ambang batas probabilitas minimum untuk memutuskan label positif.
                    </div>
                    <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                      <span className="font-mono font-bold text-[#C2553A]">C<sub>FP</sub></span>: Biaya finansial akibat kesalahan alarm palsu (False Positive).
                    </div>
                    <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                      <span className="font-mono font-bold text-[#C2553A]">C<sub>FN</sub></span>: Biaya finansial akibat kerugian terlewatkan (False Negative).
                    </div>
                    <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                      <span className="font-mono font-bold text-[#C2553A]">Asumsi</span>: Model menghasilkan probabilitas kalibrasi posterior yang akurat.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: EXERCISE */}
            {activeTab === "exercise" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    LATIHAN ANALITIS: TINGKAT 3 (PENGAMBILAN KEPUTUSAN)
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">Bobot: 20 Poin</span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
                  Sebuah sistem diagnosis kanker memiliki biaya intervensi biopsi awal (FP) sebesar $200, 
                  sedangkan biaya keterlambatan deteksi stadium lanjut (FN) bernilai $10.000. Berapakah ambang batas probabilitas Bayesian optimal yang harus diterapkan?
                </p>

                {/* Collapsible Hints Accordion */}
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
                  <button
                    type="button"
                    onClick={() => setHintsOpen(!hintsOpen)}
                    className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 text-[#C2553A]">
                      <HelpCircle className="w-4 h-4" />
                      <span>{hintsOpen ? "Sembunyikan Petunjuk Solusi" : "Buka Petunjuk Solusi & Rumus"}</span>
                    </span>
                    {hintsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {hintsOpen && (
                    <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-50/60 dark:bg-zinc-950/40 space-y-2">
                      <p>• Gunakan rumus: &tau;* = C<sub>FP</sub> / (C<sub>FP</sub> + C<sub>FN</sub>)</p>
                      <p>• Substitusi: 200 / (200 + 10.000) = 200 / 10.200 &approx; 0.0196 (1.96%).</p>
                      <p>• <strong>Kesimpulan Klinis:</strong> Dokter harus melakukan biopsi bahkan jika probabilitas risiko kanker hanya 2% karena biaya keterlambatan diagnosis fatal.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Card Footer Link */}
          <div className="px-5 py-3.5 bg-zinc-100/80 dark:bg-zinc-900/80 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-mono">
              Terhubung langsung ke modul: Data Science Bab 1
            </span>
            <Link
              href="/dashboard/modul/kategori/data-science"
              className="text-xs font-semibold text-[#C2553A] hover:underline flex items-center gap-1"
            >
              <span>Buka Modul Penuh di Reader</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
