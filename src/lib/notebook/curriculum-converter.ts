import type { CodeCatalogEntry } from "@/lib/curriculum/code-catalog";
import type {
  AcademicSubchapter,
  DocSectionItem,
  ExerciseItem,
  NotebookUnit,
} from "@/lib/curriculum/types";
import type { NotebookCell, NotebookDocument, NotebookKernel } from "./types";

function generateUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function makeCellId(prefix = "c"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function mapLanguageToKernel(lang?: string): NotebookKernel {
  const normalized = (lang || "python").toLowerCase().trim();
  if (normalized === "sql" || normalized === "sqlite") return "sql";
  if (normalized === "javascript" || normalized === "js") return "javascript";
  if (normalized === "typescript" || normalized === "ts") return "typescript";
  return "python";
}

function createEmptyCell(
  partial: Partial<NotebookCell> & Pick<NotebookCell, "type" | "source">
): NotebookCell {
  const now = Date.now();
  return {
    id: partial.id || makeCellId(partial.type === "markdown" ? "md" : "code"),
    type: partial.type,
    kernel: partial.kernel || "python",
    source: partial.source,
    outputs: partial.outputs || [],
    executionCount: null,
    executionOrder: null,
    timingMs: null,
    lastModifiedAt: now,
    lastExecutedAt: null,
    collapsed: false,
    title: partial.title,
    testAssertions: partial.testAssertions,
    formMode: partial.source.includes("#@param") ? "both" : partial.formMode,
  };
}

function formatUnitToMarkdown(unit: NotebookUnit): string {
  switch (unit.type) {
    case "markdown":
      return unit.content;
    case "definition": {
      const parts = [
        `### Definisi Formal: ${unit.term}`,
        `> **Definisi:** ${unit.formalDefinition}`,
        `**Intuisi:** ${unit.intuitiveExplanation}`,
        `**Analogi:** ${unit.realWorldAnalogy}`,
      ];
      if (unit.mathematicalBasis) {
        parts.push(`**Basis Matematis:** ${unit.mathematicalBasis}`);
      }
      return parts.join("\n\n");
    }
    case "formula": {
      const parts = [`### Formula: ${unit.name}`, `$$\n${unit.latex}\n$$`];
      if (unit.derivationNotes) parts.push(`*Catatan:* ${unit.derivationNotes}`);
      return parts.join("\n\n");
    }
    case "example": {
      return [
        `### Contoh Konkret: ${unit.scenario}`,
        `**Analisis:** ${unit.analysis}`,
      ].join("\n\n");
    }
    case "interpretation": {
      return [
        `#### Interpretasi: ${unit.headline}`,
        unit.observations.map((o) => `- ${o}`).join("\n"),
        unit.domainImplication,
      ].join("\n\n");
    }
    case "warning":
      return `> **${unit.title}**\n>\n> ${unit.description}\n>\n> *Mitigasi:* ${unit.countermeasure}`;
    case "table": {
      if (unit.markdownFallback) return unit.markdownFallback;
      const head = `| ${unit.headers.join(" | ")} |`;
      const sep = `| ${unit.headers.map(() => "---").join(" | ")} |`;
      const rows = unit.rows.map((r) => `| ${r.join(" | ")} |`).join("\n");
      return `### ${unit.caption}\n\n${head}\n${sep}\n${rows}`;
    }
    case "image":
      return `![${unit.alt}](${unit.src})\n\n*${unit.caption}*`;
    case "project":
      return `### Proyek Terapan: ${unit.title}\n\n**Konteks Industri:** ${unit.industryContext}\n\n**Tantangan:** ${unit.businessProblem}`;
    default:
      return "";
  }
}

export function buildExerciseAssertions(exercise: ExerciseItem): string | undefined {
  if (!exercise.testCase) return undefined;
  const expected = exercise.testCase.expectedOutput;
  if (expected === undefined || expected === null) return undefined;

  if (typeof expected === "number" || typeof expected === "boolean") {
    return [
      `# Autograder: ${exercise.testCase.description || "Verifikasi keluaran utama"}`,
      `assert any(val == ${JSON.stringify(expected)} for k, val in locals().items() if not k.startswith('_')), "Pastikan variabel hasil bernilai ${String(expected)}"`,
    ].join("\n");
  }

  return `# ${exercise.testCase.description || "Ekspektasi hasil"}: ${String(expected)}`;
}

export function convertSectionToNotebook(params: {
  topicId?: string;
  chapterId?: string;
  subchapter: DocSectionItem | AcademicSubchapter;
  defaultKernel?: NotebookKernel;
}): NotebookDocument {
  const { topicId, chapterId, subchapter } = params;
  const cells: NotebookCell[] = [];
  const nowIso = new Date().toISOString();

  const headerLines = [`# ${subchapter.title}`];
  if (subchapter.description) {
    headerLines.push(subchapter.description);
  }
  if (subchapter.learningObjectives && subchapter.learningObjectives.length > 0) {
    headerLines.push(
      "### Tujuan Pembelajaran\n" +
        subchapter.learningObjectives.map((obj) => `- ${obj}`).join("\n")
    );
  }
  cells.push(
    createEmptyCell({
      type: "markdown",
      source: headerLines.join("\n\n"),
    })
  );

  let detectedPrimaryKernel: NotebookKernel = params.defaultKernel || "python";

  if (subchapter.units && subchapter.units.length > 0) {
    for (const unit of subchapter.units) {
      if (unit.type === "code") {
        if (unit.language === "bash") {
          cells.push(
            createEmptyCell({
              type: "markdown",
              source: `\`\`\`bash\n${unit.code}\n\`\`\``,
            })
          );
          continue;
        }
        const kernel = mapLanguageToKernel(unit.language);
        detectedPrimaryKernel = kernel;
        const source = unit.preExplanation
          ? `# ${unit.preExplanation.replace(/\n+/g, " ")}\n${unit.code}`
          : unit.code;
        cells.push(
          createEmptyCell({
            type: "code",
            kernel,
            source,
            title: unit.filename || unit.id,
          })
        );
      } else if (unit.type === "exercise") {
        cells.push(
          createEmptyCell({
            type: "markdown",
            source: `### Latihan: ${unit.title}\n\n${unit.scenario}\n\n**Tugas:** ${unit.task}`,
          })
        );
        cells.push(
          createEmptyCell({
            type: "code",
            kernel: detectedPrimaryKernel,
            source: unit.solutionCode
              ? `# Kerjakan solusi Anda di sini:\n# (Petunjuk: ${unit.hints[0] || "Ikuti spesifikasi soal"})\n`
              : `# Tulis kode solusi Anda di sini\n`,
            title: unit.title,
          })
        );
      } else if (unit.type !== "output") {
        const md = formatUnitToMarkdown(unit);
        if (md.trim()) {
          cells.push(createEmptyCell({ type: "markdown", source: md }));
        }
      }
    }
  } else {
    if (subchapter.content_markdown && subchapter.content_markdown.trim()) {
      const trimmedMd =
        subchapter.content_markdown.length > 4500
          ? `${subchapter.content_markdown.slice(0, 4500)}\n\n*(Ringkasan teori — baca lengkap di Doc Reader)*`
          : subchapter.content_markdown;
      cells.push(createEmptyCell({ type: "markdown", source: trimmedMd }));
    }

    const docSnippets =
      "codeSnippets" in subchapter && Array.isArray(subchapter.codeSnippets)
        ? subchapter.codeSnippets
        : [];
    const subExamples =
      "codeExamples" in subchapter && Array.isArray(subchapter.codeExamples)
        ? subchapter.codeExamples
        : [];

    if (subExamples.length > 0) {
      for (const ex of subExamples) {
        if (ex.language === "bash") {
          cells.push(
            createEmptyCell({
              type: "markdown",
              source: `#### ${ex.title}\n\`\`\`bash\n${ex.code}\n\`\`\``,
            })
          );
          continue;
        }
        const kernel = mapLanguageToKernel(ex.language);
        detectedPrimaryKernel = kernel;
        cells.push(
          createEmptyCell({
            type: "code",
            kernel,
            source: `# ${ex.title}\n${ex.code}`,
            title: ex.filename || ex.title,
          })
        );
      }
    } else if (docSnippets.length > 0) {
      for (const sn of docSnippets) {
        if (sn.language === "bash") continue;
        const kernel = mapLanguageToKernel(sn.language);
        detectedPrimaryKernel = kernel;
        cells.push(
          createEmptyCell({
            type: "code",
            kernel,
            source: sn.code,
            title: sn.caption,
          })
        );
      }
    }
  }

  // Add default starter code cell if subchapter was purely conceptual
  if (!cells.some((c) => c.type === "code")) {
    cells.push(
      createEmptyCell({
        type: "code",
        kernel: detectedPrimaryKernel,
        source: `# Eksperimen interaktif untuk "${subchapter.title}"\nimport math\nprint("Siap bereksperimen!")`,
      })
    );
  }

  return {
    id: generateUuid(),
    title: `Lab: ${subchapter.title}`,
    description: subchapter.description,
    defaultKernel: detectedPrimaryKernel,
    runtimeMode: "wasm",
    sourceTopicId: topicId,
    sourceChapterId: chapterId,
    sourceSubchapterId: subchapter.id,
    reactiveMode: false,
    editorMode: "codemirror",
    cells,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

export function convertExerciseToNotebook(params: {
  exercise: ExerciseItem;
  topicId?: string;
  sectionTitle?: string;
}): NotebookDocument {
  const { exercise, topicId, sectionTitle } = params;
  const nowIso = new Date().toISOString();

  const mdLines = [
    `# Tantangan Praktikum${sectionTitle ? `: ${sectionTitle}` : ""}`,
    exercise.task,
  ];
  if (exercise.hint) {
    mdLines.push(`> **Petunjuk:** ${exercise.hint}`);
  }
  if (exercise.testCase?.description) {
    mdLines.push(`**Kriteria Uji:** ${exercise.testCase.description}`);
  }

  const starter =
    exercise.starterCode ||
    `# Tulis implementasi solusi Anda di bawah ini\n# Gunakan sel Autograder / Test di bawah atau tombol Run untuk menguji\n`;

  const assertions = buildExerciseAssertions(exercise);

  const cells: NotebookCell[] = [
    createEmptyCell({
      type: "markdown",
      source: mdLines.join("\n\n"),
    }),
    createEmptyCell({
      type: "code",
      kernel: "python",
      source: starter,
      title: "Kode Solusi Anda",
      testAssertions: assertions,
    }),
  ];

  if (exercise.solution) {
    cells.push(
      createEmptyCell({
        type: "markdown",
        source: `<details><summary>Kunci Solusi Referensi (Klik untuk membuka)</summary>\n\n\`\`\`python\n${exercise.solution}\n\`\`\`\n\n</details>`,
      })
    );
  }

  return {
    id: generateUuid(),
    title: `Latihan #${exercise.id}`,
    description: exercise.task.slice(0, 140),
    defaultKernel: "python",
    runtimeMode: "wasm",
    sourceTopicId: topicId,
    reactiveMode: false,
    editorMode: "codemirror",
    cells,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

export function convertCodeEntryToNotebook(entry: CodeCatalogEntry): NotebookDocument {
  const nowIso = new Date().toISOString();
  const kernel = mapLanguageToKernel(entry.language);

  const mdLines = [
    `# ${entry.title}`,
    entry.explanation || `Referensi kode dari modul **${entry.topicName}** — *${entry.subchapterTitle}*.`,
  ];
  if (entry.expectedOutput) {
    mdLines.push(`**Keluaran Referensi:**\n\`\`\`\n${entry.expectedOutput.slice(0, 800)}\n\`\`\``);
  }

  const cells: NotebookCell[] = [
    createEmptyCell({
      type: "markdown",
      source: mdLines.join("\n\n"),
    }),
    createEmptyCell({
      type: "code",
      kernel,
      source: entry.code,
      title: entry.filename || entry.title,
    }),
  ];

  return {
    id: generateUuid(),
    title: entry.title,
    description: `${entry.topicName} • ${entry.subchapterTitle}`,
    defaultKernel: kernel,
    runtimeMode: "wasm",
    sourceTopicId: entry.topicId,
    sourceChapterId: entry.chapterId,
    sourceSubchapterId: entry.subchapterId,
    sourceCodeId: entry.id,
    reactiveMode: false,
    editorMode: "codemirror",
    cells,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

export interface NotebookTemplateMeta {
  id: string;
  title: string;
  description: string;
  kernel: NotebookKernel;
}

export const NOTEBOOK_TEMPLATES: NotebookTemplateMeta[] = [
  {
    id: "python-plot",
    title: "Python Data & Grafik Matplotlib",
    description: "Visualisasi grafik NumPy + Matplotlib siap jalankan.",
    kernel: "python",
  },
  {
    id: "python-param",
    title: "Parameter Interaktif (#@param)",
    description: "Contoh eksperimen gelombang sinus dengan slider interaktif.",
    kernel: "python",
  },
  {
    id: "sql-starter",
    title: "SQLite Query Studio",
    description: "Membuat tabel, mengisi data, dan menjalankan SELECT query.",
    kernel: "sql",
  },
  {
    id: "js-async",
    title: "JavaScript / TS Sandbox",
    description: "Eksperimen array, fungsi, dan objek terstruktur.",
    kernel: "javascript",
  },
];

/**
 * Membuat notebook coding baru yang bersih (1 sel kode siap ketik,
 * tanpa tumpukan teks pengantar atau slider demo) ala Google Colab.
 */
export function createBlankNotebook(
  kernel: NotebookKernel = "python",
  customTitle?: string
): NotebookDocument {
  const nowIso = new Date().toISOString();
  const labelMap: Record<NotebookKernel, string> = {
    python: "Python",
    sql: "SQL",
    javascript: "JavaScript",
    typescript: "TypeScript",
  };
  return {
    id: generateUuid(),
    title: customTitle || `Notebook Baru (${labelMap[kernel]})`,
    defaultKernel: kernel,
    runtimeMode: "wasm",
    reactiveMode: false,
    editorMode: "codemirror",
    cells: [
      createEmptyCell({
        type: "code",
        kernel,
        source: "",
      }),
    ],
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

export function createTemplateNotebook(templateId: string): NotebookDocument {
  if (templateId === "python-param") {
    return createStarterNotebook("python");
  }
  if (templateId === "sql-starter") {
    return createStarterNotebook("sql");
  }
  if (templateId === "js-async") {
    return createStarterNotebook("javascript");
  }
  // python-plot default clean runnable visual template
  const nowIso = new Date().toISOString();
  return {
    id: generateUuid(),
    title: "Eksperimen Grafik Python",
    defaultKernel: "python",
    runtimeMode: "wasm",
    reactiveMode: false,
    editorMode: "codemirror",
    cells: [
      createEmptyCell({
        type: "code",
        kernel: "python",
        source: `import numpy as np\nimport matplotlib.pyplot as plt\n\nx = np.linspace(0, 2 * np.pi, 200)\ny = np.sin(2 * x) * np.exp(-0.15 * x)\n\nplt.figure(figsize=(7, 3.6))\nplt.plot(x, y, color="#C2553A", linewidth=2.2, label="Gelombang Teredam")\nplt.title("Visualisasi Matplotlib di Velqora Lab")\nplt.xlabel("x (radian)")\nplt.ylabel("Amplitudo")\nplt.grid(True, alpha=0.3)\nplt.legend()\nplt.show()`,
      }),
    ],
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

export function createStarterNotebook(kernel: NotebookKernel = "python"): NotebookDocument {
  const nowIso = new Date().toISOString();
  const defaultCells: Record<NotebookKernel, NotebookCell[]> = {
    python: [
      createEmptyCell({
        type: "markdown",
        source:
          "# Velqora Lab — Computational Notebook\n\nEksperimen interaktif **Python 3.12 (Pyodide)**, **SQLite Persistent**, dan **JS/TS Sandbox** langsung di browser dengan dukungan parameter interaktif `#@param`, grafik Matplotlib, DataFrame explorer, dan DAG Reaktif.",
      }),
      createEmptyCell({
        type: "code",
        kernel: "python",
        title: "Eksperimen Gelombang Interaktif (#@param)",
        source: `#@title Eksperimen Gelombang Sinus Interaktif\n#@markdown Ubah slider di panel kanan untuk memperbarui parameter secara instan.\nimport math\n\namplitudo = 2.5 #@param {type:"slider", min:0.5, max:10, step:0.5}\nfrekuensi = 3 #@param {type:"slider", min:1, max:10, step:1}\njudul_grafik = "Gelombang Harmonik Velqora" #@param {type:"string"}\n\nsampel = [round(amplitudo * math.sin(frekuensi * i * 0.15), 3) for i in range(40)]\nprint(f"{judul_grafik} | Puncak: {max(sampel):.3f} | Lembah: {min(sampel):.3f}")\n{"judul": judul_grafik, "titik_pertama": sampel[:6]}`,
      }),
    ],
    sql: [
      createEmptyCell({
        type: "markdown",
        source:
          "# Velqora Lab — Persistent SQLite Studio\n\nTabel yang Anda buat bertahan antar-sel dan terhubung ke dataset `/workspace` secara otomatis.",
      }),
      createEmptyCell({
        type: "code",
        kernel: "sql",
        title: "Skema & Query Persisten",
        source: `CREATE TABLE IF NOT EXISTS mahasiswa (
  id INTEGER PRIMARY KEY,
  nama TEXT NOT NULL,
  jurusan TEXT,
  ipk REAL
);
INSERT OR REPLACE INTO mahasiswa VALUES
  (1, 'Alya', 'Teknik Informatika', 3.92),
  (2, 'Bima', 'Data Science', 3.85),
  (3, 'Citra', 'Kecerdasan Artifisial', 3.96);
SELECT * FROM mahasiswa ORDER BY ipk DESC;`,
      }),
    ],
    javascript: [
      createEmptyCell({
        type: "markdown",
        source: "# Velqora Lab — JS/TS Worker Sandbox",
      }),
      createEmptyCell({
        type: "code",
        kernel: "javascript",
        source: `const skor = [88, 92, 95, 79, 98];\nconst rataRata = skor.reduce((a, b) => a + b, 0) / skor.length;\nconsole.log("Rata-rata nilai:", rataRata.toFixed(2));\n({ jumlah: skor.length, rataRata, tertinggi: Math.max(...skor) });`,
      }),
    ],
    typescript: [
      createEmptyCell({
        type: "markdown",
        source: "# Velqora Lab — TypeScript Worker Sandbox",
      }),
      createEmptyCell({
        type: "code",
        kernel: "typescript",
        source: `interface Eksperimen {\n  nama: string;\n  akurasi: number;\n}\nconst hasil: Eksperimen = { nama: "Baseline Transformer", akurasi: 0.942 };\nconsole.log(hasil);\nhasil;`,
      }),
    ],
  };

  return {
    id: generateUuid(),
    title: "Velqora Lab Notebook",
    defaultKernel: kernel,
    runtimeMode: "wasm",
    reactiveMode: false,
    editorMode: "codemirror",
    cells: defaultCells[kernel],
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}
