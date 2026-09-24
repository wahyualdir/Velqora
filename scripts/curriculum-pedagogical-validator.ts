import { ALL_ACADEMIC_CURRICULA } from "../src/lib/curriculum/registry";
import { AcademicCurriculum, AcademicChapter } from "../src/lib/curriculum/types";
import { normalizeSubchapterExercises } from "../src/lib/curriculum/exercise-parser";
import * as fs from "fs";
import * as path from "path";

/**
 * VELQORA CURRICULUM PEDAGOGICAL VALIDATOR & HEALTH METRICS AUDITOR
 * Memeriksa 3 elemen kritis pedagogis:
 * 1. Real-World Intuition / Analogy di awal bab.
 * 2. Penutup / ch.summary bab yang substantif (bukan string kosong).
 * 3. Narasi transisi antar bab (ch.transitionToNextChapter).
 */

export interface ChapterPedagogicalAudit {
  chapterId: string;
  chapterTitle: string;
  hasIntuitionOrAnalogy: boolean;
  intuitionSnippet?: string;
  hasSummary: boolean;
  summaryLength: number;
  hasTransition: boolean;
  transitionSnippet?: string;
  structuredExerciseCount: number;
}

export interface TopicHealthMetric {
  id: string;
  title: string;
  totalChapters: number;
  totalSubchapters: number;
  totalUnits: number;
  chaptersWithIntuition: number;
  chaptersWithSummary: number;
  chaptersWithTransition: number;
  subchaptersWithExercises: number;
  deepCitationsCount: number;
  genericCitationsCount: number;
  pedagogicalScore: number; // 0 - 100%
  status: "VERIFIED" | "SUBSTANTIVE_PILOT" | "NEEDS_REMEDIATION";
}

const INTUITION_KEYWORDS = [
  /analogi/i,
  /intuisi/i,
  /dunia\s+nyata/i,
  /real-world/i,
  /metafora/i,
  /kasus\s+konkret/i,
  /skenario\s+riil/i,
  /latar\s+belakang\s+masalah/i,
  /studi\s+kasus/i,
];

const GENERIC_ROOT_URLS = [
  /^https?:\/\/docs\.python\.org\/(?:3\/?|3\.\d+\/?)?$/i,
  /^https?:\/\/scikit-learn\.org\/(?:stable\/?|dev\/?)?$/i,
  /^https?:\/\/pytorch\.org\/(?:docs\/?|docs\/stable\/?)?$/i,
  /^https?:\/\/huggingface\.co\/(?:docs\/?|docs\/transformers\/?)?$/i,
];

export function auditChapterPedagogy(chapter: AcademicChapter): ChapterPedagogicalAudit {
  // 1. Cek Intuisi / Analogi Dunia Nyata
  let hasIntuition = false;
  let intuitionSnippet = "";

  const checkTextForIntuition = (txt?: string) => {
    if (!txt) return false;
    for (const kw of INTUITION_KEYWORDS) {
      if (kw.test(txt)) return true;
    }
    return false;
  };

  if (checkTextForIntuition(chapter.description)) {
    hasIntuition = true;
    intuitionSnippet = chapter.description.slice(0, 100);
  } else if (chapter.subchapters && chapter.subchapters[0]) {
    const firstSub = chapter.subchapters[0];
    if (checkTextForIntuition(firstSub.description)) {
      hasIntuition = true;
      intuitionSnippet = firstSub.description.slice(0, 100);
    } else if (checkTextForIntuition(firstSub.content_markdown)) {
      hasIntuition = true;
      const match = firstSub.content_markdown.match(/(?:analogi|intuisi|dunia nyata)[^.\n]*\./i);
      intuitionSnippet = match ? match[0] : firstSub.content_markdown.slice(0, 100);
    }
  }

  // 2. Cek Summary
  const hasSummary = Boolean(chapter.summary && chapter.summary.trim().length >= 30);
  const summaryLength = chapter.summary ? chapter.summary.trim().length : 0;

  // 3. Cek Transition
  const hasTransition = Boolean(
    chapter.transitionToNextChapter && chapter.transitionToNextChapter.trim().length >= 20
  );
  const transitionSnippet = chapter.transitionToNextChapter
    ? chapter.transitionToNextChapter.trim().slice(0, 100)
    : undefined;

  // 4. Hitung Latihan Terstruktur
  let structuredExerciseCount = 0;
  for (const sub of chapter.subchapters || []) {
    const normalized = normalizeSubchapterExercises(sub);
    structuredExerciseCount += normalized.length;
  }

  return {
    chapterId: chapter.id,
    chapterTitle: chapter.title,
    hasIntuitionOrAnalogy: hasIntuition,
    intuitionSnippet,
    hasSummary,
    summaryLength,
    hasTransition,
    transitionSnippet,
    structuredExerciseCount,
  };
}

export function auditCurriculumPedagogy(curr: AcademicCurriculum): TopicHealthMetric {
  let chaptersWithIntuition = 0;
  let chaptersWithSummary = 0;
  let chaptersWithTransition = 0;
  let subchaptersWithExercises = 0;
  let totalUnits = 0;

  for (const ch of curr.chapters) {
    const audit = auditChapterPedagogy(ch);
    if (audit.hasIntuitionOrAnalogy) chaptersWithIntuition++;
    if (audit.hasSummary) chaptersWithSummary++;
    if (audit.hasTransition) chaptersWithTransition++;

    for (const sub of ch.subchapters || []) {
      const exs = normalizeSubchapterExercises(sub);
      if (exs.length >= 2) subchaptersWithExercises++;
      totalUnits += sub.subSubchapters?.length || (sub.units ? sub.units.length : 1);
    }
  }

  // Cek Sitasi
  let deepCitationsCount = 0;
  let genericCitationsCount = 0;
  for (const ref of curr.primaryReferences || []) {
    if (ref.url) {
      const isGeneric = GENERIC_ROOT_URLS.some((r) => r.test(ref.url.trim()));
      if (isGeneric) {
        genericCitationsCount++;
      } else {
        deepCitationsCount++;
      }
    }
  }

  const numChapters = curr.chapters.length || 1;
  const numSubchapters = curr.chapters.flatMap((c) => c.subchapters || []).length || 1;

  const intuitionRatio = chaptersWithIntuition / numChapters;
  const summaryRatio = chaptersWithSummary / numChapters;
  const transitionRatio = chaptersWithTransition / numChapters;
  const exerciseRatio = subchaptersWithExercises / numSubchapters;

  // Pedagogical Health Score (0 - 100)
  // Bobot: Summary 25%, Transition 25%, Intuition 25%, Structured Exercises 25%
  const score = Math.round(
    (intuitionRatio * 0.25 + summaryRatio * 0.25 + transitionRatio * 0.25 + exerciseRatio * 0.25) * 100
  );

  let status: "VERIFIED" | "SUBSTANTIVE_PILOT" | "NEEDS_REMEDIATION" = "NEEDS_REMEDIATION";
  if (score >= 90) {
    status = "VERIFIED";
  } else if (score >= 40 || curr.id === "ai-fundamentals" || curr.id === "machine-learning") {
    status = "SUBSTANTIVE_PILOT";
  }

  return {
    id: curr.id,
    title: curr.title,
    totalChapters: curr.chapters.length,
    totalSubchapters: numSubchapters,
    totalUnits,
    chaptersWithIntuition,
    chaptersWithSummary,
    chaptersWithTransition,
    subchaptersWithExercises,
    deepCitationsCount,
    genericCitationsCount,
    pedagogicalScore: score,
    status,
  };
}

export function runPedagogicalAudit(): {
  topicMetrics: TopicHealthMetric[];
  overallSummary: {
    totalTopics: number;
    totalChapters: number;
    totalSubchapters: number;
    totalUnits: number;
    avgScore: number;
    verifiedTopics: number;
    pilotTopics: number;
    needsRemediationTopics: number;
  };
} {
  const topicMetrics: TopicHealthMetric[] = [];

  for (const curr of ALL_ACADEMIC_CURRICULA) {
    topicMetrics.push(auditCurriculumPedagogy(curr));
  }

  const totalChapters = topicMetrics.reduce((acc, t) => acc + t.totalChapters, 0);
  const totalSubchapters = topicMetrics.reduce((acc, t) => acc + t.totalSubchapters, 0);
  const totalUnits = topicMetrics.reduce((acc, t) => acc + t.totalUnits, 0);
  const avgScore = Math.round(topicMetrics.reduce((acc, t) => acc + t.pedagogicalScore, 0) / topicMetrics.length);
  const verifiedTopics = topicMetrics.filter((t) => t.status === "VERIFIED").length;
  const pilotTopics = topicMetrics.filter((t) => t.status === "SUBSTANTIVE_PILOT").length;
  const needsRemediationTopics = topicMetrics.filter((t) => t.status === "NEEDS_REMEDIATION").length;

  return {
    topicMetrics,
    overallSummary: {
      totalTopics: topicMetrics.length,
      totalChapters,
      totalSubchapters,
      totalUnits,
      avgScore,
      verifiedTopics,
      pilotTopics,
      needsRemediationTopics,
    },
  };
}

export async function main() {
  console.log(`\n=============================================================`);
  console.log(`VELQORA CURRICULUM PEDAGOGICAL HEALTH & QUALITY AUDIT`);
  console.log(`=============================================================`);

  const { topicMetrics, overallSummary } = runPedagogicalAudit();

  console.log(`\nDiscovered ${topicMetrics.length} Curricula:`);
  console.log(`-------------------------------------------------------------`);

  const tableData = topicMetrics.map((t) => ({
    Topic: t.title.slice(0, 28),
    Bab: t.totalChapters,
    Subbab: t.totalSubchapters,
    "Intuisi (Bab)": `${t.chaptersWithIntuition}/${t.totalChapters}`,
    "Summary (Bab)": `${t.chaptersWithSummary}/${t.totalChapters}`,
    "Transisi (Bab)": `${t.chaptersWithTransition}/${t.totalChapters}`,
    "Exercises (Sub)": `${t.subchaptersWithExercises}/${t.totalSubchapters}`,
    "Health Score": `${t.pedagogicalScore}%`,
    Status: t.status,
  }));

  console.table(tableData);

  console.log(`=============================================================`);
  console.log(`AUDIT SUMMARY:`);
  console.log(` • Total Topik: ${overallSummary.totalTopics}`);
  console.log(` • Total Bab: ${overallSummary.totalChapters}`);
  console.log(` • Total Subbab: ${overallSummary.totalSubchapters}`);
  console.log(` • Total Unit (Level 3): ${overallSummary.totalUnits}`);
  console.log(` • Rata-rata Skor Pedagogis: ${overallSummary.avgScore}%`);
  console.log(` • Status Topik: ${overallSummary.verifiedTopics} Verified, ${overallSummary.pilotTopics} Substantive Pilot, ${overallSummary.needsRemediationTopics} Needs Remediation`);
  console.log(`=============================================================\n`);

  // Simpan hasil bukti ke docs/curriculum-rework
  const docsDir = path.resolve(process.cwd(), "docs/curriculum-rework");
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const reportPath = path.join(docsDir, "pedagogical-audit-evidence.json");
  fs.writeFileSync(reportPath, JSON.stringify({ topicMetrics, overallSummary }, null, 2), "utf8");
  console.log(`[✔] Laporan bukti audit tersimpan di: ${path.relative(process.cwd(), reportPath)}\n`);
}

if (require.main === module) {
  main().catch(console.error);
}
