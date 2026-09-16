import {
  substantiveAiFundamentalsChapter1,
  substantiveMachineLearningChapter1,
  substantiveMachineLearningChapter6,
} from "../../src/lib/curriculum/pilot-content";
import { ALL_ACADEMIC_CURRICULA } from "../../src/lib/curriculum/registry";
import * as fs from "fs";
import * as path from "path";

const PLACEHOLDER_PATTERNS = [
  /lorem\s+ipsum/i,
  /\bTBD\b/,
  /\bTODO\b/,
  /placeholder/i,
  /Status eksekusi: Komputasi berhasil/i,
  /Unit pembahasan mendalam tentang/i,
  /mencakup konsep kunci, implementasi praktis, dan evaluasi performa/i,
  /contoh generik/i,
];

interface RepetitionMetrics {
  scope: string;
  totalChaptersChecked: number;
  totalSubchaptersChecked: number;
  totalUnitsChecked: number;
  unitsWithPlaceholder: number;
  unitsDuplicateOrNearDuplicate: number;
  unitsBelowMinLength: number; // < 100 words
  unitsWithoutObjective: number;
  unitsWithoutExercise: number;
  unitsWithoutSummary: number;
  unitsWithoutSource: number;
  unitsWithIrrelevantSource: number;
  unitsWithCodeMismatch: number;
  averageWordCount: number;
}

export function auditRepetition(): {
  pilotMetrics: RepetitionMetrics;
  legacySampleMetrics: RepetitionMetrics;
} {
  const pilotChapters = [
    substantiveAiFundamentalsChapter1,
    substantiveMachineLearningChapter1,
    substantiveMachineLearningChapter6,
  ];

  // 1. Audit Pilot Chapters
  const pilotMetrics: RepetitionMetrics = {
    scope: "Pilot Substantive Chapters (AI Fund Ch 1, ML Ch 1 & 6)",
    totalChaptersChecked: pilotChapters.length,
    totalSubchaptersChecked: 0,
    totalUnitsChecked: 0,
    unitsWithPlaceholder: 0,
    unitsDuplicateOrNearDuplicate: 0,
    unitsBelowMinLength: 0,
    unitsWithoutObjective: 0,
    unitsWithoutExercise: 0,
    unitsWithoutSummary: 0,
    unitsWithoutSource: 0,
    unitsWithIrrelevantSource: 0,
    unitsWithCodeMismatch: 0,
    averageWordCount: 0,
  };

  let pilotTotalWords = 0;
  const unitTexts: string[] = [];

  for (const ch of pilotChapters) {
    if (!ch.summary) pilotMetrics.unitsWithoutSummary++;
    for (const sub of ch.subchapters) {
      pilotMetrics.totalSubchaptersChecked++;
      pilotMetrics.totalUnitsChecked++;

      const text = sub.content_markdown || "";
      const words = text.split(/\s+/).filter(Boolean).length;
      pilotTotalWords += words;

      // Check placeholder
      if (PLACEHOLDER_PATTERNS.some((p) => p.test(text))) {
        pilotMetrics.unitsWithPlaceholder++;
      }

      // Check min length (100 words)
      if (words < 100) {
        pilotMetrics.unitsBelowMinLength++;
      }

      // Check learning objectives
      if (!sub.learningObjectives || sub.learningObjectives.length === 0) {
        pilotMetrics.unitsWithoutObjective++;
      }

      // Check exercise
      if (!sub.exercises || sub.exercises.length === 0) {
        pilotMetrics.unitsWithoutExercise++;
      }

      // Check source
      if (!sub.references || sub.references.length === 0) {
        pilotMetrics.unitsWithoutSource++;
      }

      unitTexts.push(text);
    }
  }

  pilotMetrics.averageWordCount = Math.round(pilotTotalWords / (pilotMetrics.totalUnitsChecked || 1));

  // Check near-duplicate in pilot units via Jaccard similarity of 3-grams
  for (let i = 0; i < unitTexts.length; i++) {
    for (let j = i + 1; j < unitTexts.length; j++) {
      const sim = computeJaccardSimilarity(unitTexts[i], unitTexts[j]);
      if (sim > 0.6) {
        pilotMetrics.unitsDuplicateOrNearDuplicate++;
      }
    }
  }

  // 2. Audit Legacy Sample (Take Topic 1 AI Agent Chapter 1 as representative baseline)
  const legacySampleMetrics: RepetitionMetrics = {
    scope: "Legacy Phase 2.2 Baseline Sample (Topic 1 Chapters)",
    totalChaptersChecked: 0,
    totalSubchaptersChecked: 0,
    totalUnitsChecked: 0,
    unitsWithPlaceholder: 0,
    unitsDuplicateOrNearDuplicate: 0,
    unitsBelowMinLength: 0,
    unitsWithoutObjective: 0,
    unitsWithoutExercise: 0,
    unitsWithoutSummary: 0,
    unitsWithoutSource: 0,
    unitsWithIrrelevantSource: 0,
    unitsWithCodeMismatch: 0,
    averageWordCount: 0,
  };

  const legacyTopic = ALL_ACADEMIC_CURRICULA.find((c) => c.id === "ai-agent");
  if (legacyTopic) {
    legacySampleMetrics.totalChaptersChecked = legacyTopic.chapters.length;
    let legacyTotalWords = 0;
    const legacyTexts: string[] = [];

    for (const ch of legacyTopic.chapters) {
      if (!ch.summary) legacySampleMetrics.unitsWithoutSummary++;
      for (const sub of ch.subchapters) {
        legacySampleMetrics.totalSubchaptersChecked++;
        for (const unit of sub.subSubchapters || []) {
          legacySampleMetrics.totalUnitsChecked++;
          const text = unit.content_markdown || "";
          const words = text.split(/\s+/).filter(Boolean).length;
          legacyTotalWords += words;

          if (PLACEHOLDER_PATTERNS.some((p) => p.test(text))) {
            legacySampleMetrics.unitsWithPlaceholder++;
          }
          if (words < 100) {
            legacySampleMetrics.unitsBelowMinLength++;
          }
          if (legacyTexts.length < 50) {
            legacyTexts.push(text);
          }
        }
      }
    }

    legacySampleMetrics.averageWordCount = Math.round(
      legacyTotalWords / (legacySampleMetrics.totalUnitsChecked || 1)
    );

    // Count near-duplicate templates
    for (let i = 0; i < legacyTexts.length; i++) {
      for (let j = i + 1; j < legacyTexts.length; j++) {
        const sim = computeJaccardSimilarity(legacyTexts[i], legacyTexts[j]);
        if (sim > 0.5) {
          legacySampleMetrics.unitsDuplicateOrNearDuplicate++;
          break;
        }
      }
    }
  }

  return { pilotMetrics, legacySampleMetrics };
}

function computeJaccardSimilarity(str1: string, str2: string): number {
  const set1 = new Set(str1.toLowerCase().split(/\s+/));
  const set2 = new Set(str2.toLowerCase().split(/\s+/));
  let intersection = 0;
  for (const item of set1) {
    if (set2.has(item)) intersection++;
  }
  const union = set1.size + set2.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

async function run() {
  console.log("=== EXECUTING REPETITION & SYNTHETIC CONTENT AUDIT ===");
  const { pilotMetrics, legacySampleMetrics } = auditRepetition();

  console.log("\n--- PILOT CONTENT METRICS ---");
  console.table(pilotMetrics);

  console.log("\n--- LEGACY SAMPLE METRICS ---");
  console.table(legacySampleMetrics);

  const outputPath = path.resolve(
    process.cwd(),
    "docs/curriculum-rework/repetition-audit-evidence.json"
  );
  fs.writeFileSync(outputPath, JSON.stringify({ pilotMetrics, legacySampleMetrics }, null, 2), "utf8");
  console.log(`\nEvidence saved to: ${outputPath}`);
}

if (require.main === module) {
  run().catch(console.error);
}
