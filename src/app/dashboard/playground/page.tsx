"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Code2,
  Play,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Card, Badge, Skeleton } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { SubNavTabs } from "@/components/layout/sub-nav-tabs";
import { executeJavaScript, executePython, ExecutionResult } from "@/lib/code-runner";
import { toast } from "sonner";

const CODE_PRESETS = {
  javascript: {
    name: "JavaScript",
    extension: ".js",
    templates: [
      {
        label: "Dasar & Array",
        code: `// Belajar JavaScript Modern
const dataMahasiswa = [
  { nama: "Wahyu", nilai: 95 },
  { nama: "Budi", nilai: 88 },
  { nama: "Siti", nilai: 92 }
];

console.log("=== DAFTAR MAHASISWA ===");
dataMahasiswa.forEach((mhs, idx) => {
  console.log(\`\${idx + 1}. \${mhs.nama} - Nilai: \${mhs.nilai}\`);
});

const rataRata = dataMahasiswa.reduce((acc, curr) => acc + curr.nilai, 0) / dataMahasiswa.length;
console.log(\`\\nRata-rata Nilai: \${rataRata.toFixed(2)}\`);`,
      },
      {
        label: "Fibonacci Algoritma",
        code: `// Algoritma Fibonacci Sequence
function generateFibonacci(n) {
  const seq = [0, 1];
  for (let i = 2; i < n; i++) {
    seq.push(seq[i - 1] + seq[i - 2]);
  }
  return seq;
}

const n = 10;
console.log(\`Deret Fibonacci \${n} angka pertama:\`, generateFibonacci(n));`,
      },
    ],
  },
  python: {
    name: "Python",
    extension: ".py",
    templates: [
      {
        label: "Dasar Python",
        code: `# Contoh Python Dasar
def hitung_faktorial(n):
    if n <= 1:
        return 1
    return n * hitung_faktorial(n - 1)

angka = 5
hasil = hitung_faktorial(angka)
print(f"Faktorial dari {angka} adalah {hasil}")

# List Comprehension
kuadrat = [x**2 for x in range(1, 6)]
print(f"Bilangan kuadrat 1-5: {kuadrat}")`,
      },
    ],
  },
};

export default function PlaygroundPage() {
  const [lang, setLang] = useState<"javascript" | "python">("javascript");
  const [code, setCode] = useState(CODE_PRESETS.javascript.templates[0].code);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleRun = async () => {
    if (!code.trim()) {
      toast.error("Kode tidak boleh kosong.");
      return;
    }

    setIsRunning(true);
    try {
      if (lang === "python") {
        const res = await executePython(code);
        setResult(res);
      } else {
        const res = await executeJavaScript(code);
        setResult(res);
      }
    } catch (err: any) {
      setResult({
        output: "",
        error: err?.message || String(err),
        executionTimeMs: 0,
        logs: [],
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Keyboard shortcut Ctrl+Enter / Cmd+Enter to run
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code, lang]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Kode disalin ke papan klip.");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectTemplate = (tplCode: string) => {
    setCode(tplCode);
    setResult(null);
  };

  return (
    <div className="page-container space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <PageHeader
        eyebrow="~/sandbox"
        technicalMark="< js // py // ts // html />"
        title="Ruang Praktik & Alat"
        description="Tulis, eksperimen logika, dan jalankan kode langsung di browser."
        actions={
          <Button
            onClick={handleRun}
            loading={isRunning}
            className="gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold min-h-[40px] px-4 shadow-xs"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Jalankan (Ctrl+Enter)</span>
          </Button>
        }
      />

      {/* Sub-Navigation Tabs */}
      <SubNavTabs category="tools" />

      {/* Control Bar: Language, Templates, Sandbox Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-surface border border-border shadow-xs">
        {/* Language Tabs */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setLang("javascript");
              setCode(CODE_PRESETS.javascript.templates[0].code);
              setResult(null);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              lang === "javascript"
                ? "bg-brand-600 text-white shadow-xs"
                : "bg-surface-secondary text-text-secondary hover:text-text-primary hover:bg-surface-tertiary"
            }`}
          >
            JavaScript / Node
          </button>
          <button
            type="button"
            onClick={() => {
              setLang("python");
              setCode(CODE_PRESETS.python.templates[0].code);
              setResult(null);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              lang === "python"
                ? "bg-brand-600 text-white shadow-xs"
                : "bg-surface-secondary text-text-secondary hover:text-text-primary hover:bg-surface-tertiary"
            }`}
          >
            Python
          </button>
        </div>

        {/* Template Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono uppercase text-text-tertiary">Contoh:</span>
          {CODE_PRESETS[lang].templates.map((tpl) => (
            <button
              key={tpl.label}
              type="button"
              onClick={() => handleSelectTemplate(tpl.code)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-secondary hover:bg-surface-tertiary text-text-secondary hover:text-text-primary border border-border transition-colors cursor-pointer"
            >
              {tpl.label}
            </button>
          ))}
        </div>

        {/* Sandbox Notice Badge */}
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Client Sandbox</span>
        </div>
      </div>

      {/* Editor & Output (Vertical on Mobile, 2-Col on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Code Editor Container */}
        <Card className="p-0 rounded-2xl bg-surface border-border overflow-hidden flex flex-col shadow-sm">
          <div className="px-4 py-2.5 border-b border-border bg-surface-secondary/50 flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-text-secondary">
              editor{CODE_PRESETS[lang].extension}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-text-tertiary hover:text-text-primary p-1 rounded transition-colors cursor-pointer"
              title="Salin Kode"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{copied ? "Tersalin" : "Salin"}</span>
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full min-h-[300px] sm:min-h-[380px] p-4 bg-[#010206] text-slate-100 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-none"
            placeholder="Ketik kode di sini..."
          />
        </Card>

        {/* Output Console / Terminal */}
        <Card className="p-0 rounded-2xl bg-surface border-border overflow-hidden flex flex-col shadow-sm">
          <div className="px-4 py-2.5 border-b border-border bg-surface-secondary/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-text-tertiary" />
              <span className="text-xs font-mono font-semibold text-text-secondary">
                Output Terminal
              </span>
            </div>

            {result && (
              <span className="text-[10px] font-mono text-text-tertiary">
                {result.executionTimeMs} ms
              </span>
            )}
          </div>

          <div className="p-4 bg-[#010206] min-h-[300px] sm:min-h-[380px] font-mono text-xs sm:text-sm overflow-y-auto max-h-[420px]">
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-16">
                <Play className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-xs">Klik &quot;Jalankan&quot; atau tekan Ctrl+Enter untuk mengeksekusi kode.</p>
              </div>
            ) : result.error ? (
              <div className="space-y-2">
                <div className="text-rose-400 font-semibold flex items-center gap-1.5">
                  <span>Eksekusi Gagal:</span>
                </div>
                <pre className="text-rose-300 text-xs whitespace-pre-wrap leading-relaxed">
                  {result.error}
                </pre>
              </div>
            ) : (
              <div className="space-y-1 text-emerald-400">
                <pre className="whitespace-pre-wrap leading-relaxed font-mono">
                  {result.output}
                </pre>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
