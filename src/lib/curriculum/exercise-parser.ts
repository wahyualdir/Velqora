import { ExerciseItem, ExerciseTestCase, AcademicSubchapter } from "./types";

/**
 * Parser untuk mengekstrak latihan mandiri berjenjang dari konten markdown
 */
export function parseExercisesFromMarkdown(markdown: string, baseId = "ex"): ExerciseItem[] {
  if (!markdown) return [];

  const exercises: ExerciseItem[] = [];

  // 1. Coba parse blok terstruktur: #### Latihan 1 / Level 1 / Tantangan 1
  const blockRegex = /(?:^|\n)#{3,4}\s*(?:Latihan|Level|Tantangan)\s*(\d+)[:\s]*([^\n]*)\n([\s\S]*?)(?=(?:\n#{3,4}\s*(?:Latihan|Level|Tantangan)\s*\d+)|\n#{1,3}\s+[^\n]+|$)/gi;
  let match;
  while ((match = blockRegex.exec(markdown)) !== null) {
    const rawLvl = parseInt(match[1], 10);
    const level = (Math.min(4, Math.max(1, isNaN(rawLvl) ? 1 : rawLvl))) as 1 | 2 | 3 | 4;
    const title = match[2]?.trim() || "";
    const body = match[3] || "";

    // Ekstrak Task / Tantangan
    let task = "";
    const taskMatch = body.match(/(?:Tantangan|Soal|Task)[:\s]*([^\n]+(?:\n(?!(?:Petunjuk|Hint|Kode Awal|Starter|Solusi|Solution)[:\s])[^\n]+)*)/i);
    if (taskMatch) {
      task = taskMatch[1].trim();
    } else if (title) {
      task = title;
    }

    // Ekstrak Hint / Petunjuk
    let hint: string | undefined;
    const hintMatch = body.match(/(?:Petunjuk|Hint)[:\s]*([^\n]+(?:\n(?!(?:Kode Awal|Starter|Solusi|Solution)[:\s])[^\n]+)*)/i);
    if (hintMatch) {
      hint = hintMatch[1].trim();
    }

    // Ekstrak Starter Code
    let starterCode: string | undefined;
    const starterMatch = body.match(/(?:Kode Awal|Starter Code)[:\s]*(?:```(?:[a-zA-Z0-9_-]+)?\s*\n([\s\S]*?)```|([^\n]+(?:\n(?!(?:Solusi|Solution)[:\s])[^\n]+)*))/i);
    if (starterMatch) {
      starterCode = (starterMatch[1] || starterMatch[2])?.trim();
    }

    // Ekstrak Solusi
    let solution: string | undefined;
    const solMatch = body.match(/(?:Solusi|Solution)[:\s]*(?:```(?:[a-zA-Z0-9_-]+)?\s*\n([\s\S]*?)```|([\s\S]+))/i);
    if (solMatch) {
      solution = (solMatch[1] || solMatch[2])?.trim();
    }

    exercises.push(
      createDefaultExerciseItem(
        baseId,
        level,
        task || `Tantangan Level ${level}`,
        hint,
        starterCode,
        solution
      )
    );
  }

  if (exercises.length > 0) {
    return exercises;
  }

  // 2. Fallback: pola baris peluru list (misal: - **Level 1 (Pemahaman)**: ...)
  const lines = markdown.split("\n");
  let inExerciseSection = false;

  const levelPatterns: Array<{ level: 1 | 2 | 3 | 4; regex: RegExp }> = [
    { level: 1, regex: /(?:^|\s)(?:[-*]|\d+\.)\s*\*\*Level\s*1(?:\s*\([^)]+\))?\*\*[:\s]*(.+)/i },
    { level: 2, regex: /(?:^|\s)(?:[-*]|\d+\.)\s*\*\*Level\s*2(?:\s*\([^)]+\))?\*\*[:\s]*(.+)/i },
    { level: 3, regex: /(?:^|\s)(?:[-*]|\d+\.)\s*\*\*Level\s*3(?:\s*\([^)]+\))?\*\*[:\s]*(.+)/i },
    { level: 4, regex: /(?:^|\s)(?:[-*]|\d+\.)\s*\*\*Level\s*4(?:\s*\([^)]+\))?\*\*[:\s]*(.+)/i },
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (/^##+\s*(?:6\.\s*)?Latihan\s+Mandiri/i.test(line) || /^##+\s*Latihan/i.test(line)) {
      inExerciseSection = true;
      continue;
    }

    if (inExerciseSection && /^##+\s+[^\d]/.test(line) && !line.toLowerCase().includes("latihan")) {
      break;
    }

    for (const { level, regex } of levelPatterns) {
      const match = line.match(regex);
      if (match) {
        const rawTask = match[1].trim();
        const item = createDefaultExerciseItem(baseId, level, rawTask);
        exercises.push(item);
        break;
      }
    }
  }

  // Jika tidak ditemukan via pola strict di atas, coba scan seluruh dokumen untuk format Level 1-4
  if (exercises.length === 0) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      for (const { level, regex } of levelPatterns) {
        const match = line.match(regex);
        if (match && !exercises.some((e) => e.level === level)) {
          const rawTask = match[1].trim();
          exercises.push(createDefaultExerciseItem(baseId, level, rawTask));
          break;
        }
      }
    }
  }

  return exercises;
}

/**
 * Membuat ExerciseItem terstruktur lengkap dengan starter code, hint, dan solution
 */
export function createDefaultExerciseItem(
  baseId: string,
  level: 1 | 2 | 3 | 4,
  task: string,
  hint?: string,
  starterCode?: string,
  solution?: string,
  testCase?: ExerciseTestCase
): ExerciseItem {
  const levelNames: Record<1 | 2 | 3 | 4, string> = {
    1: "Pemahaman Konseptual",
    2: "Implementasi Standar",
    3: "Debugging & Edge Cases",
    4: "Mini-Project Terapan",
  };

  const defaultHints: Record<1 | 2 | 3 | 4, string> = {
    1: "Tinjau kembali definisi formal, batasan asumsi, dan perumusan matematis pada bagian awal materi ini.",
    2: "Gunakan pustaka standar (NumPy/PyTorch/Scikit-Learn). Pastikan tipe data array masukan dan dimensi matriks sesuai.",
    3: "Perhatikan kasus batas seperti input kosong, nilai None/NaN, pembagian dengan nol, atau dimensi tensor yang tidak sejajar.",
    4: "Rancang modular: pisahkan fungsi persiapan data, eksekusi pemodelan, dan pelaporan metrik evaluasi.",
  };

  const defaultStarters: Record<1 | 2 | 3 | 4, string> = {
    1: `# Tuliskan penjelasan analitis Anda di sini:\n# 1. Konsep Inti:\n# 2. Asumsi Masalah:\n# 3. Solusi Terarah:`,
    2: `def solve_exercise(data_input):\n    \"\"\"\n    Implementasikan solusi terstruktur untuk:\n    ${task.replace(/"/g, "'")}\n    \"\"\"\n    # TODO: Implementasi logika algoritma di sini\n    pass\n\n# Eksekusi uji coba\n# print(solve_exercise([1, 2, 3]))`,
    3: `def debug_and_handle_edge_cases(data_input):\n    \"\"\"\n    Perbaiki galat dan tangani masukan ekstrem (None, empty, NaN)\n    \"\"\"\n    if data_input is None or len(data_input) == 0:\n        return {"status": "handled", "error": "InvalidInput"}\n    # Lanjutkan logika komputasi aman...\n    return {"status": "success", "result": None}`,
    4: `class MiniProjectPipeline:\n    \"\"\"\n    Pipeline modular untuk tantangan terapan:\n    ${task.replace(/"/g, "'")}\n    \"\"\"\n    def __init__(self, config=None):\n        self.config = config or {}\n        \n    def fit_and_evaluate(self, X, y=None):\n        # 1. Validasi & Preprocessing\n        # 2. Komputasi Model\n        # 3. Metrik Evaluasi\n        return {"status": "completed", "score": 1.0}`,
  };

  const defaultSolutions: Record<1 | 2 | 3 | 4, string> = {
    1: `Solusi Analitis:\n${task}\n\nPembahasan: Mahasiswa diharapkan menjelaskan hubungan fungsional antara representasi input dan pemetaan aksi dengan mengacu pada formulasi matematis di materi ini.`,
    2: `def solve_exercise(data_input):\n    # Solusi referensi terstandarisasi\n    processed = [x for x in data_input if x is not None]\n    return sum(processed) / len(processed) if processed else 0.0`,
    3: `def debug_and_handle_edge_cases(data_input):\n    if not data_input:\n        return {"status": "handled", "error": "EmptyInput"}\n    try:\n        # Eksekusi dengan validasi tipe\n        valid_items = [float(x) for x in data_input if x is not None]\n        return {"status": "success", "count": len(valid_items)}\n    except (ValueError, TypeError) as err:\n        return {"status": "error", "message": str(err)}`,
    4: `class MiniProjectPipeline:\n    def __init__(self, config=None):\n        self.config = config or {"tolerance": 1e-4}\n    def fit_and_evaluate(self, X, y=None):\n        if len(X) == 0:\n            raise ValueError("Dataset tidak boleh kosong")\n        return {"status": "completed", "samples": len(X), "metric": "evaluated"}`,
  };

  const defaultTestCases: Record<1 | 2 | 3 | 4, ExerciseTestCase> = {
    1: { input: "Konsep Dasar", expectedOutput: "Validasi Analitis", description: "Verifikasi pemahaman konsep kunci" },
    2: { input: [10, 20, 30], expectedOutput: 20.0, description: "Pengujian fungsi dengan data numerik representatif" },
    3: { input: [], expectedOutput: { status: "handled", error: "EmptyInput" }, description: "Pengujian ketahanan terhadap input kosong" },
    4: { input: { samples: 100 }, expectedOutput: { status: "completed", score: 1.0 }, description: "Pengujian pipeline end-to-end" },
  };

  return {
    id: `${baseId}-ex-lvl${level}`,
    level,
    task: task || `Tantangan ${levelNames[level]}: Terapkan konsep materi pada skenario terukur.`,
    hint: hint || defaultHints[level],
    starterCode: starterCode || defaultStarters[level],
    solution: solution || defaultSolutions[level],
    testCase: testCase || defaultTestCases[level],
  };
}

/**
 * Normalisasi latihan dari AcademicSubchapter menjadi array ExerciseItem[] terstruktur
 */
export function normalizeSubchapterExercises(sub: AcademicSubchapter): ExerciseItem[] {
  // 1. Jika sudah ada structuredExercises, utamakan itu
  if (sub.structuredExercises && sub.structuredExercises.length > 0) {
    return sub.structuredExercises;
  }

  const results: ExerciseItem[] = [];
  const baseId = sub.id || "sub";

  // 2. Jika ada sub.exercises
  if (sub.exercises && sub.exercises.length > 0) {
    for (let idx = 0; idx < sub.exercises.length; idx++) {
      const raw = sub.exercises[idx];
      if (typeof raw === "string") {
        const lvl = (Math.min(4, Math.max(1, idx + 1))) as 1 | 2 | 3 | 4;
        results.push(createDefaultExerciseItem(`${baseId}-${idx + 1}`, lvl, raw));
      } else if (typeof raw === "object" && raw !== null) {
        const rawObj = raw as any;
        const validLevel = (Math.min(4, Math.max(1, Number(rawObj.level) || idx + 1))) as 1 | 2 | 3 | 4;
        results.push(
          createDefaultExerciseItem(
            rawObj.id || `${baseId}-${validLevel}`,
            validLevel,
            rawObj.task || `Tantangan Level ${validLevel}`,
            rawObj.hint,
            rawObj.starterCode,
            rawObj.solution,
            rawObj.testCase
          )
        );
      }
    }
  }

  // 3. Jika sub.exercises kosong atau belum mencakup minimal 2 level, ekstrak dari content_markdown
  if (results.length < 2 && sub.content_markdown) {
    const fromMarkdown = parseExercisesFromMarkdown(sub.content_markdown, baseId);
    for (const item of fromMarkdown) {
      if (!results.some((r) => r.level === item.level)) {
        results.push(item);
      }
    }
  }

  // 4. Jika tetap belum ada minimal 2 level, buatkan level default terstandarisasi berbasis sub.title
  if (results.length === 0) {
    results.push(
      createDefaultExerciseItem(
        baseId,
        1,
        `Jelaskan prinsip matematis dan arsitektur komputasi fundamental pada materi ${sub.title}.`
      ),
      createDefaultExerciseItem(
        baseId,
        2,
        `Implementasikan fungsi mandiri dalam Python yang mengeksekusi algoritma inti dari ${sub.title}.`
      )
    );
  } else if (results.length === 1) {
    const existingLevel = results[0].level;
    const nextLevel = existingLevel === 1 ? 2 : 1;
    results.push(
      createDefaultExerciseItem(
        baseId,
        nextLevel as 1 | 2 | 3 | 4,
        nextLevel === 1
          ? `Jelaskan landasan teoretis dan justifikasi pemilihan metode pada ${sub.title}.`
          : `Rancang implementasi algoritma dan uji batas kasus numerik untuk materi ${sub.title}.`
      )
    );
  }

  // Urutkan berdasarkan level menaik (1, 2, 3, 4)
  results.sort((a, b) => a.level - b.level);
  return results;
}
