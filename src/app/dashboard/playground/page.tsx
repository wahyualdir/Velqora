"use client";

import React, { useState, useEffect } from "react";
import { PageContainer } from "@/components/ui/section";
import { SubNavTabs } from "@/components/layout/sub-nav-tabs";
import { executeJavaScript, executePython, ExecutionResult } from "@/lib/code-runner";
import { toast } from "sonner";
import { PlaygroundHeader } from "@/components/playground/playground-header";
import { PlaygroundEditor, LanguagePreset } from "@/components/playground/playground-editor";
import { PlaygroundOutput } from "@/components/playground/playground-output";

const CODE_PRESETS: Record<string, LanguagePreset> = {
  javascript: {
    name: "JavaScript",
    extension: ".js",
    templates: [
      {
        label: "Dasar & Array",
        code: `// Belajar JavaScript Modern
const dataMahasiswa = [
  { nama: "Alex", nilai: 95 },
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
  const [selectedTemplateLabel, setSelectedTemplateLabel] = useState(
    CODE_PRESETS.javascript.templates[0].label
  );
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [copied, setCopied] = useState(false);

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

  const handleReset = () => {
    const defaultTemplate = CODE_PRESETS[lang].templates[0];
    setCode(defaultTemplate.code);
    setSelectedTemplateLabel(defaultTemplate.label);
    setResult(null);
    toast.info("Kode dikembalikan ke template awal.");
  };

  const handleChangeLang = (newLang: "javascript" | "python") => {
    setLang(newLang);
    const defaultTemplate = CODE_PRESETS[newLang].templates[0];
    setCode(defaultTemplate.code);
    setSelectedTemplateLabel(defaultTemplate.label);
    setResult(null);
  };

  const handleSelectTemplate = (templateCode: string) => {
    const found = CODE_PRESETS[lang].templates.find((t) => t.code === templateCode);
    setCode(templateCode);
    if (found) setSelectedTemplateLabel(found.label);
    setResult(null);
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <SubNavTabs category="tools" />

        {/* Workspace Header */}
        <PlaygroundHeader
          lang={lang}
          onRun={handleRun}
          isRunning={isRunning}
          onReset={handleReset}
          onCopy={handleCopy}
          copied={copied}
        />

        {/* Editor & Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Main Code Editor */}
          <div className="lg:col-span-7 xl:col-span-8">
            <PlaygroundEditor
              lang={lang}
              onChangeLang={handleChangeLang}
              code={code}
              onChangeCode={setCode}
              presets={CODE_PRESETS}
              onSelectTemplate={handleSelectTemplate}
              selectedTemplateLabel={selectedTemplateLabel}
            />
          </div>

          {/* Execution Output Console */}
          <div className="lg:col-span-5 xl:col-span-4">
            <PlaygroundOutput
              result={result}
              onClear={() => setResult(null)}
              isRunning={isRunning}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
