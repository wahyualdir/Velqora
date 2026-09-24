import { AcademicCitation, AcademicSubchapter, ExerciseItem } from "./types";

/**
 * SEMANTIC QUALITY GATES & REPETITION ELIMINATOR
 * Mengeliminasi False PASS (Goodhart's Law) pada test suite kurikulum.
 */

export class TemplateRepetitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TEMPLATE_REPETITION_ERROR";
  }
}

export class TrivialCodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TRIVIAL_CODE_ERROR";
  }
}

export class UnstructuredExercisesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UNSTRUCTURED_EXERCISES_ERROR";
  }
}

export class GenericCitationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GENERIC_CITATION_ERROR";
  }
}

/**
 * Menghitung Jaccard similarity berbasis word set
 */
export function computeJaccardSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;
  const words1 = str1.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
  const words2 = str2.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);

  if (words1.length === 0 || words2.length === 0) return 0;

  const set1 = new Set(words1);
  const set2 = new Set(words2);

  let intersection = 0;
  for (const item of set1) {
    if (set2.has(item)) intersection++;
  }

  const union = set1.size + set2.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * 1. UNIQUENESS ASSERTION
 * Menggagalkan pengujian jika kemiripan antar-unit > 60% atau memuat template repetitif.
 */
export function assertContentUniqueness(
  textsOrUnits: Array<string | { content_markdown?: string }>,
  threshold = 0.6
): void {
  if (!textsOrUnits || textsOrUnits.length < 2) return;

  const texts = textsOrUnits.map((item) =>
    typeof item === "string" ? item : (item.content_markdown || "")
  );

  const openingSentences = new Map<string, number>();

  for (let i = 0; i < texts.length; i++) {
    const text = texts[i].trim();
    if (!text) continue;

    // Deteksi pembuka template sintetis yang berulang
    const firstLineMatch = text.match(/^(?:###\s+[^\n]+\n+)?([^.\n]{20,120}\.)/);
    if (firstLineMatch) {
      const opening = firstLineMatch[1].trim().toLowerCase();
      // Pola template terkenal
      if (
        opening.includes("pembahasan fokus mengenai") ||
        opening.includes("materi ini menyajikan eksplorasi mendalam") ||
        opening.includes("merupakan fondasi krusial untuk menjamin keandalan sistem")
      ) {
        const count = (openingSentences.get(opening) || 0) + 1;
        openingSentences.set(opening, count);
        if (count >= 3) {
          throw new TemplateRepetitionError(
            `TEMPLATE_REPETITION_ERROR: Ditemukan kalimat pembuka template repetitif sebanyak ${count} kali: "${firstLineMatch[1]}"`
          );
        }
      }
    }

    // Bandingkan kemiripan Jaccard dengan cuplikan lain
    for (let j = i + 1; j < Math.min(texts.length, i + 15); j++) {
      const sim = computeJaccardSimilarity(text, texts[j]);
      if (sim > threshold) {
        throw new TemplateRepetitionError(
          `TEMPLATE_REPETITION_ERROR: Kemiripan Jaccard sebesar ${(sim * 100).toFixed(1)}% melampaui batas toleransi ${(threshold * 100)}% antara unit ${i + 1} dan ${j + 1}.`
        );
      }
    }
  }
}

/**
 * 2. CODE SUBSTANCE ASSERTION
 * Menolak kode yang hanya berisi print(...) tanpa komputasi nyata atau pengembalian string palsu.
 */
export function assertCodeSubstance(
  codeOrSub: string | { code?: string; content_markdown?: string; codeExamples?: Array<{ code: string; title?: string }> },
  context = "Code snippet"
): void {
  if (typeof codeOrSub !== "string" && codeOrSub) {
    let foundCode = false;
    if (codeOrSub.codeExamples && Array.isArray(codeOrSub.codeExamples)) {
      for (const ex of codeOrSub.codeExamples) {
        if (ex.code) {
          foundCode = true;
          assertCodeSubstance(ex.code, `${context} > ${ex.title || "example"}`);
        }
      }
    }
    if (codeOrSub.content_markdown) {
      const codeBlockRegex = /```(?:[a-zA-Z0-9_-]+)?\s*\n([\s\S]*?)```/g;
      let match;
      while ((match = codeBlockRegex.exec(codeOrSub.content_markdown)) !== null) {
        foundCode = true;
        assertCodeSubstance(match[1], context);
      }
    }
    if (codeOrSub.code) {
      foundCode = true;
      assertCodeSubstance(codeOrSub.code, context);
    }
    if (!foundCode) {
      // Subchapter konseptual tanpa blok kode diloloskan
      return;
    }
    return;
  }

  const code = typeof codeOrSub === "string" ? codeOrSub : ((codeOrSub as any)?.code || "");
  if (!code || code.trim().length === 0) {
    throw new TrivialCodeError(`TRIVIAL_CODE_ERROR: [${context}] Kode komputasi kosong.`);
  }

  const clean = code.trim();

  // Tolak kode yang hanya terdiri dari print(...) saja
  const lines = clean.split("\n").map((l: string) => l.trim()).filter((l: string) => l.length > 0 && !l.startsWith("#"));
  const onlyPrint = lines.every((line: string) => line.startsWith("print(") && line.endsWith(")"));
  if (onlyPrint) {
    throw new TrivialCodeError(
      `TRIVIAL_CODE_ERROR: [${context}] Kode hanya berisi instruksi print() tanpa ekspresi komputasi atau manipulasi data.`
    );
  }

  // Tolak pola trivial generator palsu: return f'action_for_{...}' atau f"processed_{action}"
  if (
    /return\s+f['"][a-zA-Z0-9_-]*_\{/i.test(clean) ||
    /Status eksekusi: Komputasi berhasil dan output metrik valid/i.test(clean)
  ) {
    throw new TrivialCodeError(
      `TRIVIAL_CODE_ERROR: [${context}] Kode memuat fungsi mockup generator sintetis tanpa algoritma nyata.`
    );
  }

  // Harus memuat ekspresi komputasi substantif
  const hasSubstance =
    /\b(def|class|for|while|import|from|return|lambda)\b/.test(clean) ||
    /[=+\-*/%><&|]/.test(clean) ||
    /\b(numpy|torch|sklearn|pandas|math|scipy|tf)\b/i.test(clean);

  if (!hasSubstance && lines.length <= 2) {
    throw new TrivialCodeError(
      `TRIVIAL_CODE_ERROR: [${context}] Kode tidak memiliki konstruksi algoritma atau logika komputasi.`
    );
  }
}

/**
 * 3. STRUCTURED EXERCISES ASSERTION
 * Memastikan latihan memiliki minimal 2 level dengan task dan solution substantif.
 */
export function assertStructuredExercises(
  exercisesOrSub?: any[] | { structuredExercises?: any[]; exercises?: any[] },
  context = "Subchapter"
): void {
  let exercises: any[] | undefined;
  if (Array.isArray(exercisesOrSub)) {
    exercises = exercisesOrSub;
  } else if (exercisesOrSub && typeof exercisesOrSub === "object") {
    if ("structuredExercises" in exercisesOrSub && Array.isArray((exercisesOrSub as any).structuredExercises)) {
      exercises = (exercisesOrSub as any).structuredExercises;
    } else if ("exercises" in exercisesOrSub && Array.isArray((exercisesOrSub as any).exercises)) {
      exercises = (exercisesOrSub as any).exercises;
    }
  }

  if (!exercises || !Array.isArray(exercises) || exercises.length < 2) {
    throw new UnstructuredExercisesError(
      `UNSTRUCTURED_EXERCISES_ERROR: [${context}] Jumlah latihan < 2 level (ditemukan: ${exercises?.length || 0}). Wajib memiliki minimal Level 1 dan Level 2.`
    );
  }

  const levelsFound = new Set<number>();
  for (const ex of exercises) {
    if (typeof ex === "string") {
      throw new UnstructuredExercisesError(
        `UNSTRUCTURED_EXERCISES_ERROR: [${context}] Latihan masih bertipe string mentah bukan objek ExerciseItem terstruktur.`
      );
    }

    if (!ex.id) {
      throw new UnstructuredExercisesError(`UNSTRUCTURED_EXERCISES_ERROR: [${context}] ID latihan tidak boleh kosong.`);
    }

    if (!ex.level || ![1, 2, 3, 4, 5].includes(ex.level)) {
      throw new UnstructuredExercisesError(`UNSTRUCTURED_EXERCISES_ERROR: [${context}] Level latihan harus bernilai 1, 2, 3, atau 4.`);
    }

    if (!ex.task || ex.task.trim().length < 15) {
      throw new UnstructuredExercisesError(`UNSTRUCTURED_EXERCISES_ERROR: [${context}] Task latihan terlalu pendek / tidak substantif.`);
    }

    if (!ex.solution || ex.solution.trim().length < 15) {
      throw new UnstructuredExercisesError(`UNSTRUCTURED_EXERCISES_ERROR: [${context}] Kunci solusi referensi latihan tidak boleh kosong.`);
    }

    levelsFound.add(ex.level);
  }

  if (levelsFound.size < 2) {
    throw new UnstructuredExercisesError(
      `UNSTRUCTURED_EXERCISES_ERROR: [${context}] Latihan harus mencakup minimal 2 level berjenjang berbeda.`
    );
  }
}

/**
 * 4. CITATION DEEP-LINK ASSERTION
 * Menolak sitasi generik yang hanya menunjuk root homepage dokumentasi.
 */
const GENERIC_ROOT_HOMEPAGES = [
  /^https?:\/\/docs\.python\.org\/(?:3\/?|3\.\d+\/?)?$/i,
  /^https?:\/\/scikit-learn\.org\/(?:stable\/?|dev\/?)?$/i,
  /^https?:\/\/pytorch\.org\/(?:docs\/?|docs\/stable\/?)?$/i,
  /^https?:\/\/huggingface\.co\/(?:docs\/?|docs\/transformers\/?)?$/i,
  /^https?:\/\/numpy\.org\/(?:doc\/?|doc\/stable\/?)?$/i,
  /^https?:\/\/pandas\.pydata\.org\/(?:docs\/?|pandas-docs\/stable\/?)?$/i,
];

export function assertCitationDeepLink(
  citationsOrSub?: AcademicCitation[] | { references?: AcademicCitation[] },
  context = "Topic"
): void {
  let citations: AcademicCitation[] | undefined;
  if (Array.isArray(citationsOrSub)) {
    citations = citationsOrSub;
  } else if (citationsOrSub && typeof citationsOrSub === "object" && "references" in citationsOrSub) {
    citations = (citationsOrSub as any).references;
  }

  if (!citations || !Array.isArray(citations) || citations.length === 0) {
    throw new GenericCitationError(`GENERIC_CITATION_ERROR: [${context}] Topik tidak memiliki rujukan akademik.`);
  }

  for (const ref of citations) {
    if (!ref.url || !/^https?:\/\//.test(ref.url)) {
      throw new GenericCitationError(`GENERIC_CITATION_ERROR: [${context}] URL tidak valid pada rujukan "${ref.title}".`);
    }

    const isGenericRoot = GENERIC_ROOT_HOMEPAGES.some((rgx) => rgx.test(ref.url.trim()));
    if (isGenericRoot) {
      throw new GenericCitationError(
        `GENERIC_CITATION_ERROR: [${context}] Rujukan "${ref.title}" menunjuk root homepage generik (${ref.url}) tanpa subpath modul/API/paper spesifik.`
      );
    }
  }
}

/**
 * Pemeriksa Mutu Komprehensif untuk satu Subbab
 */
export function checkSemanticQuality(sub: AcademicSubchapter): { passes: boolean; errors: string[] } {
  const errors: string[] = [];

  // 1. Cek kode
  if (sub.codeExamples) {
    for (const code of sub.codeExamples) {
      try {
        assertCodeSubstance(code.code, `${sub.title} > ${code.title}`);
      } catch (err: any) {
        errors.push(err.message);
      }
    }
  }

  // 2. Cek latihan terstruktur
  try {
    assertStructuredExercises(sub.exercises, sub.title);
  } catch (err: any) {
    errors.push(err.message);
  }

  // 3. Cek sitasi jika ada
  if (sub.references) {
    try {
      assertCitationDeepLink(sub.references, sub.title);
    } catch (err: any) {
      errors.push(err.message);
    }
  }

  return {
    passes: errors.length === 0,
    errors,
  };
}
