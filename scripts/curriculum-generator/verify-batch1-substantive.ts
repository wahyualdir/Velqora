import { deepLearningCurriculum } from "../../src/lib/curriculum/topics/12-deep-learning";
import { dataScienceCurriculum } from "../../src/lib/curriculum/topics/11-data-science";

interface AuditResult {
  topicId: string;
  title: string;
  totalChapters: number;
  totalSubchapters: number;
  totalWordCount: number;
  totalCodeExamples: number;
  totalReferences: number;
  totalExercises: number;
  totalEvaluationQuestions: number;
  hasSummaryInAllChapters: boolean;
  hasTransitionInAllChapters: boolean;
  hasEvaluationQuestionsInAllChapters: boolean;
  hasExercisesInAllSubchapters: boolean;
  hasCommonPitfallsInAllSubchapters: boolean;
  boilerplateDetected: boolean;
  boilerplateMatches: string[];
  codeExamplesVerified: boolean;
  allOutputsMatchActual: boolean;
  auditPassed: boolean;
}

const FORBIDDEN_BOILERPLATES = [
  "merupakan fondasi krusial untuk menjamin keandalan sistem",
  "Pembahasan fokus mengenai",
  "Inisialisasi Data:",
  "Eksekusi Komputasi:",
  "Menampilkan Metrik Kinerja:",
  "Evaluasi Hasil:",
  "Visualisasi & Validasi:",
  "Implementasi unit pengujian",
  "akan dibahas secara komprehensif pada modul ini"
];

function countWords(str: string): number {
  return (str || "").trim().split(/\s+/).filter(Boolean).length;
}

function auditTopic(curriculum: any): AuditResult {
  let totalWordCount = countWords(curriculum.description);
  let totalSubchapters = 0;
  let totalCodeExamples = 0;
  let totalReferences = curriculum.primaryReferences ? curriculum.primaryReferences.length : 0;
  let totalExercises = 0;
  let totalEvaluationQuestions = 0;

  let hasSummaryInAllChapters = true;
  let hasTransitionInAllChapters = true;
  let hasEvaluationQuestionsInAllChapters = true;
  let hasExercisesInAllSubchapters = true;
  let hasCommonPitfallsInAllSubchapters = true;

  const boilerplateMatches: string[] = [];

  // Check description
  for (const bp of FORBIDDEN_BOILERPLATES) {
    if (curriculum.description.includes(bp)) {
      boilerplateMatches.push(`description: "${bp}"`);
    }
  }

  for (const ch of curriculum.chapters) {
    totalWordCount += countWords(ch.description);
    if (!ch.summary || ch.summary.trim().length < 50) hasSummaryInAllChapters = false;
    if (!ch.transitionToNextChapter || ch.transitionToNextChapter.trim().length < 30) hasTransitionInAllChapters = false;
    if (!ch.evaluationQuestions || ch.evaluationQuestions.length === 0) hasEvaluationQuestionsInAllChapters = false;
    totalEvaluationQuestions += (ch.evaluationQuestions || []).length;

    for (const bp of FORBIDDEN_BOILERPLATES) {
      if (ch.description.includes(bp)) boilerplateMatches.push(`ch ${ch.id} desc: "${bp}"`);
      if (ch.summary && ch.summary.includes(bp)) boilerplateMatches.push(`ch ${ch.id} summary: "${bp}"`);
    }

    for (const sub of ch.subchapters) {
      totalSubchapters++;
      totalWordCount += countWords(sub.description) + countWords(sub.content_markdown);

      if (!sub.exercises || sub.exercises.length === 0) hasExercisesInAllSubchapters = false;
      totalExercises += (sub.exercises || []).length;

      if (!sub.commonPitfalls || sub.commonPitfalls.length === 0) hasCommonPitfallsInAllSubchapters = false;

      totalCodeExamples += (sub.codeExamples || []).length;
      totalReferences += (sub.references || []).length;

      for (const bp of FORBIDDEN_BOILERPLATES) {
        if (sub.content_markdown.includes(bp)) boilerplateMatches.push(`sub ${sub.id}: "${bp}"`);
      }
    }
  }

  let codeExamplesVerified = true;
  let allOutputsMatchActual = true;

  for (const ch of curriculum.chapters) {
    for (const sub of ch.subchapters) {
      for (const code of sub.codeExamples || []) {
        if (code.verificationStatus !== "VERIFIED_RUNNABLE") codeExamplesVerified = false;
        if (!code.isVerifiedOutput) allOutputsMatchActual = false;
        if (!code.expectedOutput || code.expectedOutput.trim().length === 0) allOutputsMatchActual = false;
        if (code.expectedOutput.includes("Output komputasi simulasi")) allOutputsMatchActual = false;
      }
    }
  }

  const boilerplateDetected = boilerplateMatches.length > 0;
  const auditPassed =
    !boilerplateDetected &&
    hasSummaryInAllChapters &&
    hasTransitionInAllChapters &&
    hasEvaluationQuestionsInAllChapters &&
    hasExercisesInAllSubchapters &&
    hasCommonPitfallsInAllSubchapters &&
    codeExamplesVerified &&
    allOutputsMatchActual &&
    totalWordCount > 1500;

  return {
    topicId: curriculum.id,
    title: curriculum.title,
    totalChapters: curriculum.chapters.length,
    totalSubchapters,
    totalWordCount,
    totalCodeExamples,
    totalReferences,
    totalExercises,
    totalEvaluationQuestions,
    hasSummaryInAllChapters,
    hasTransitionInAllChapters,
    hasEvaluationQuestionsInAllChapters,
    hasExercisesInAllSubchapters,
    hasCommonPitfallsInAllSubchapters,
    boilerplateDetected,
    boilerplateMatches,
    codeExamplesVerified,
    allOutputsMatchActual,
    auditPassed,
  };
}

console.log("=== BATCH 1 SUBSTANTIVE AUDIT ===");
const dlAudit = auditTopic(deepLearningCurriculum);
const dsAudit = auditTopic(dataScienceCurriculum);

console.log("\n[DEEP LEARNING]");
console.log(JSON.stringify(dlAudit, null, 2));

console.log("\n[DATA SCIENCE]");
console.log(JSON.stringify(dsAudit, null, 2));

if (dlAudit.auditPassed && dsAudit.auditPassed) {
  console.log("\n>>> BATCH 1 AUDIT PASSED: ZERO BOILERPLATE, FULL SUBSTANTIVE COMPLIANCE <<<");
  process.exit(0);
} else {
  console.error("\n>>> BATCH 1 AUDIT FAILED <<<");
  process.exit(1);
}
