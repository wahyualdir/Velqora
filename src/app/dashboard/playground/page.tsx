"use client";

import React, { Suspense, useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookOpen, FileCode2, Info, Terminal, X } from "lucide-react";
import { PageContainer } from "@/components/ui/section";
import { SubNavTabs } from "@/components/layout/sub-nav-tabs";
import { executeJavaScript, executePython, executeSql, ExecutionResult } from "@/lib/code-runner";
import { findCodeEntryById, type CodeCatalogEntry } from "@/lib/curriculum/code-catalog";
import { toast } from "sonner";
import { PlaygroundHeader } from "@/components/playground/playground-header";
import {
  PlaygroundEditor,
  LanguagePreset,
  PlaygroundLanguage,
} from "@/components/playground/playground-editor";
import { PlaygroundOutput } from "@/components/playground/playground-output";

const CODE_PRESETS: Record<PlaygroundLanguage, LanguagePreset> = {
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
  sql: {
    name: "SQL",
    extension: ".sql",
    templates: [
      {
        label: "Relasional & Join",
        code: `-- Lab SQLite WebAssembly (sql.js)
CREATE TABLE mahasiswa (
  id INTEGER PRIMARY KEY,
  nama TEXT NOT NULL,
  jurusan TEXT NOT NULL
);

CREATE TABLE nilai (
  id INTEGER PRIMARY KEY,
  mahasiswa_id INTEGER NOT NULL,
  mata_kuliah TEXT NOT NULL,
  skor REAL NOT NULL,
  FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa(id)
);

INSERT INTO mahasiswa VALUES
  (1, 'Alya Putri', 'Informatika'),
  (2, 'Budi Santoso', 'Sains Data'),
  (3, 'Citra Lestari', 'Informatika');

INSERT INTO nilai VALUES
  (1, 1, 'Machine Learning', 92.5),
  (2, 1, 'Basis Data', 89.0),
  (3, 2, 'Basis Data', 94.0),
  (4, 3, 'Machine Learning', 87.5);

SELECT
  m.nama,
  m.jurusan,
  ROUND(AVG(n.skor), 2) AS rata_rata_skor,
  COUNT(n.id) AS jumlah_mk
FROM mahasiswa m
JOIN nilai n ON n.mahasiswa_id = m.id
GROUP BY m.id, m.nama, m.jurusan
ORDER BY rata_rata_skor DESC;`,
      },
      {
        label: "CTE & Agregasi",
        code: `-- Analisis Eksperimen Model dengan CTE
CREATE TABLE model_runs (
  run_id INTEGER PRIMARY KEY,
  arsitektur TEXT NOT NULL,
  f1_score REAL NOT NULL,
  latency_ms INTEGER NOT NULL
);

INSERT INTO model_runs VALUES
  (1, 'XGBoost', 0.88, 12),
  (2, 'RandomForest', 0.84, 18),
  (3, 'LightGBM', 0.91, 9),
  (4, 'MLP', 0.86, 25);

WITH ranked AS (
  SELECT
    arsitektur,
    f1_score,
    latency_ms,
    ROUND(f1_score / latency_ms * 100, 2) AS efisiensi
  FROM model_runs
)
SELECT * FROM ranked
ORDER BY f1_score DESC;`,
      },
    ],
  },
};

function resolvePlaygroundLanguage(rawLang?: string): PlaygroundLanguage {
  const norm = (rawLang || "").trim().toLowerCase();
  if (norm === "sql") return "sql";
  if (norm === "javascript" || norm === "js") return "javascript";
  return "python";
}

function PlaygroundWorkspaceContent() {
  const searchParams = useSearchParams();
  const codeIdParam = searchParams.get("codeId") || "";
  const topicParam = searchParams.get("topic") || "";
  const rawCodeParam = searchParams.get("code") || "";
  const langParam = searchParams.get("lang") || "";
  const titleParam = searchParams.get("title") || "";

  const matchedEntry = useMemo<CodeCatalogEntry | undefined>(() => {
    if (!codeIdParam) return undefined;
    return findCodeEntryById(codeIdParam, topicParam || undefined);
  }, [codeIdParam, topicParam]);

  const [dismissedContext, setDismissedContext] = useState(false);
  const [lang, setLang] = useState<PlaygroundLanguage>("javascript");
  const [code, setCode] = useState(CODE_PRESETS.javascript.templates[0].code);
  const [selectedTemplateLabel, setSelectedTemplateLabel] = useState(
    CODE_PRESETS.javascript.templates[0].label
  );
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Sinkronkan kode & bahasa ketika pengguna membuka Playground dari Katalog Kode atau ExerciseCard
  useEffect(() => {
    if (matchedEntry) {
      setDismissedContext(false);
      setLang(resolvePlaygroundLanguage(matchedEntry.language));
      setCode(matchedEntry.code);
      setSelectedTemplateLabel(matchedEntry.title);
      setResult(null);
      return;
    }

    if (rawCodeParam) {
      setDismissedContext(false);
      setLang(resolvePlaygroundLanguage(langParam));
      setCode(rawCodeParam);
      setSelectedTemplateLabel(titleParam || "Latihan Kode dari Modul");
      setResult(null);
    }
  }, [matchedEntry, rawCodeParam, langParam, titleParam]);

  const activeEntry = !dismissedContext ? matchedEntry : undefined;

  const handleRun = useCallback(async () => {
    if (!code.trim()) {
      toast.error("Kode tidak boleh kosong.");
      return;
    }

    setIsRunning(true);
    try {
      if (lang === "python") {
        const res = await executePython(code);
        setResult(res);
      } else if (lang === "sql") {
        const res = await executeSql(code);
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
  }, [code, lang]);

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
  }, [handleRun]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Kode disalin ke papan klip.");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    if (activeEntry) {
      setLang(resolvePlaygroundLanguage(activeEntry.language));
      setCode(activeEntry.code);
      setSelectedTemplateLabel(activeEntry.title);
      setResult(null);
      toast.info("Kode dikembalikan ke skrip awal modul.");
      return;
    }
    const defaultTemplate = CODE_PRESETS[lang].templates[0];
    setCode(defaultTemplate.code);
    setSelectedTemplateLabel(defaultTemplate.label);
    setResult(null);
    toast.info("Kode dikembalikan ke template awal.");
  };

  const handleChangeLang = (newLang: PlaygroundLanguage) => {
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

  const activeOutputRef = activeEntry?.actualOutput || activeEntry?.expectedOutput;
  const nonBrowserRuntimeNotice =
    activeEntry &&
    activeEntry.language !== "python" &&
    activeEntry.language !== "javascript" &&
    activeEntry.language !== "sql";
  const usesExternalPyPackages =
    lang === "python" &&
    (Boolean(activeEntry?.dependencies && activeEntry.dependencies.length > 0) ||
      /\bimport\s+(numpy|pandas|torch|tensorflow|sklearn|matplotlib|scipy|seaborn)\b/.test(
        code
      ));

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <SubNavTabs category="tools" />

        {/* Contextual Banner jika kode dimuat dari Katalog Kode */}
        {activeEntry && (
          <section className="rounded-2xl border border-border bg-surface p-4 sm:p-5 space-y-3 shadow-2xs">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-text-secondary">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: activeEntry.topicColor || "#0284C7" }}
                  />
                  <span className="font-semibold text-text-primary">
                    {activeEntry.topicName}
                  </span>
                  <span>•</span>
                  <span className="truncate">{activeEntry.subchapterTitle}</span>
                  <span className="px-1.5 py-0.5 rounded bg-surface-secondary border border-border uppercase font-bold text-[10px]">
                    {activeEntry.language}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-text-primary font-display">
                  {activeEntry.title}{" "}
                  <span className="text-xs font-mono font-normal text-text-tertiary">
                    ({activeEntry.filename})
                  </span>
                </h2>
                {activeEntry.explanation && (
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {activeEntry.explanation}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Link
                  href={activeEntry.theoryHref}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-surface-secondary/50 hover:bg-surface-secondary text-xs font-mono font-medium text-text-primary transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  <span>Baca Teori</span>
                </Link>
                <Link
                  href={`/dashboard/kode?topic=${encodeURIComponent(
                    activeEntry.topicId
                  )}&sub=${encodeURIComponent(activeEntry.subchapterId)}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-surface-secondary/50 hover:bg-surface-secondary text-xs font-mono font-medium text-text-primary transition-colors"
                >
                  <FileCode2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  <span>Katalog Kode</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setDismissedContext(true)}
                  className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
                  title="Tutup info modul"
                  aria-label="Tutup info modul"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {(nonBrowserRuntimeNotice || usesExternalPyPackages) && (
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 px-3 py-2 flex items-start gap-2 text-xs text-amber-800 dark:text-amber-200">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <span>
                  {nonBrowserRuntimeNotice
                    ? `Skrip ini bertipe ${activeEntry.language.toUpperCase()}. Anda tetap dapat menyunting kode dan membandingkannya dengan Output Terverifikasi di bawah.`
                    : "Skrip ini mengimpor pustaka Python eksternal (seperti NumPy/Pandas/Scikit-learn/Torch). Bila runtime browser terbatas, gunakan Referensi Output Terverifikasi di bawah atau jalankan di Jupyter / Python lokal."}
                </span>
              </div>
            )}

            {activeOutputRef && (
              <details className="rounded-xl border border-border/80 bg-surface-secondary/35 overflow-hidden">
                <summary className="px-3 py-2 text-xs font-mono font-medium text-text-secondary hover:text-text-primary cursor-pointer flex items-center gap-2 select-none">
                  <Terminal className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  <span>Referensi Output Terverifikasi Modul</span>
                </summary>
                <div className="p-3 border-t border-border/70 bg-surface">
                  <pre className="text-xs font-mono text-text-primary whitespace-pre-wrap break-words max-h-56 overflow-y-auto">
                    {activeOutputRef}
                  </pre>
                </div>
              </details>
            )}
          </section>
        )}

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

export default function PlaygroundPage() {
  return (
    <Suspense
      fallback={
        <PageContainer className="py-8">
          <div className="h-64 rounded-2xl border border-border bg-surface animate-pulse" />
        </PageContainer>
      }
    >
      <PlaygroundWorkspaceContent />
    </Suspense>
  );
}
