import { ExtractedScheduleItem } from "./types";
import { GroundTruthFixture, GroundTruthRecord } from "../../../fixtures/schedules/ground-truth";

export interface FieldAccuracyReport {
  fieldName: string;
  totalEvaluated: number;
  correctCount: number;
  mismatchCount: number;
  missingInExtractedCount: number;
  accuracy: number; // 0.00 to 1.00
}

export interface SingleFixtureBenchmarkResult {
  fixtureId: string;
  fileName: string;
  expectedRecords: number;
  extractedRecords: number;
  correctRecords: number;
  incorrectRecords: number;
  missingRecords: number;
  falsePositiveRecords: number;
  averageConfidence: number;
  recordRecall: number; // 0.00 to 1.00
  recordPrecision: number; // 0.00 to 1.00
  exactMatchRate: number;
  partialMatchRate: number;
  falsePositiveRate: number;
  fields: Record<string, FieldAccuracyReport>;
  matchDetails: Array<{
    groundTruth: GroundTruthRecord;
    matchedExtraction?: ExtractedScheduleItem;
    isExactMatch: boolean;
    isPartialMatch: boolean;
    fieldDifferences: string[];
  }>;
}

export interface ComprehensiveBenchmarkSummary {
  totalFixtures: number;
  totalExpectedRecords: number;
  totalExtractedRecords: number;
  totalCorrectRecords: number;
  totalMissingRecords: number;
  totalFalsePositives: number;
  overallRecordRecall: number;
  overallRecordPrecision: number;
  overallFieldAccuracy: number;
  overallExactMatchRate: number;
  overallPartialMatchRate: number;
  averageConfidence: number;
  fixtureResults: SingleFixtureBenchmarkResult[];
  fieldSummaries: Record<string, { totalEvaluated: number; correctCount: number; accuracy: number }>;
}

/**
 * Normalizes title string for fuzzy comparison (removes punctuation and extra spaces)
 */
function normalizeString(str?: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Checks if two course titles match either exactly or partially
 */
function isTitleMatch(gtTitle: string, extTitle: string): { match: boolean; isExact: boolean } {
  const normGt = normalizeString(gtTitle);
  const normExt = normalizeString(extTitle);

  if (normGt === normExt) return { match: true, isExact: true };
  if (normGt.includes(normExt) || normExt.includes(normGt)) {
    return { match: true, isExact: false };
  }

  // Token overlap ratio
  const tokensGt = new Set(normGt.split(" ").filter((w) => w.length > 2));
  const tokensExt = new Set(normExt.split(" ").filter((w) => w.length > 2));
  if (tokensGt.size === 0 || tokensExt.size === 0) return { match: false, isExact: false };

  let overlap = 0;
  for (const token of tokensExt) {
    if (tokensGt.has(token)) overlap++;
  }

  const overlapRatio = overlap / Math.min(tokensGt.size, tokensExt.size);
  if (overlapRatio >= 0.6) {
    return { match: true, isExact: false };
  }

  return { match: false, isExact: false };
}

/**
 * Benchmarks extracted schedule items against the explicit ground truth fixture
 */
export function evaluateFixtureExtraction(
  fixture: GroundTruthFixture,
  extracted: ExtractedScheduleItem[]
): SingleFixtureBenchmarkResult {
  const groundTruths = fixture.groundTruthRecords;
  const expectedCount = groundTruths.length;
  const extractedCount = extracted.length;

  const matchedExtractedIndices = new Set<number>();
  let correctRecords = 0;
  let exactMatchCount = 0;
  let partialMatchCount = 0;

  const fieldStats: Record<string, { total: number; correct: number; mismatch: number; missing: number }> = {
    title: { total: 0, correct: 0, mismatch: 0, missing: 0 },
    day: { total: 0, correct: 0, mismatch: 0, missing: 0 },
    date: { total: 0, correct: 0, mismatch: 0, missing: 0 },
    startTime: { total: 0, correct: 0, mismatch: 0, missing: 0 },
    endTime: { total: 0, correct: 0, mismatch: 0, missing: 0 },
    location: { total: 0, correct: 0, mismatch: 0, missing: 0 },
    lecturer: { total: 0, correct: 0, mismatch: 0, missing: 0 },
    courseCode: { total: 0, correct: 0, mismatch: 0, missing: 0 },
  };

  const matchDetails: SingleFixtureBenchmarkResult["matchDetails"] = [];

  // Match each ground truth against extracted items
  for (const gt of groundTruths) {
    let bestMatchIdx = -1;
    const diffs: string[] = [];

    // Find best candidate
    for (let i = 0; i < extracted.length; i++) {
      if (matchedExtractedIndices.has(i)) continue;
      const cand = extracted[i];

      const titleMatch = isTitleMatch(gt.title, cand.title);
      const dayMatch = !gt.day || normalizeString(gt.day) === normalizeString(cand.day);

      if (titleMatch.match && dayMatch) {
        bestMatchIdx = i;
        break;
      }
    }

    if (bestMatchIdx >= 0) {
      matchedExtractedIndices.add(bestMatchIdx);
      const matched = extracted[bestMatchIdx];
      let itemIsAllFieldsExact = true;

      // 1. Title
      fieldStats.title.total++;
      const titleComparison = isTitleMatch(gt.title, matched.title);
      if (titleComparison.match) {
        fieldStats.title.correct++;
      } else {
        fieldStats.title.mismatch++;
        itemIsAllFieldsExact = false;
        diffs.push(`title: expected "${gt.title}" vs "${matched.title}"`);
      }

      // 2. Day
      if (gt.day) {
        fieldStats.day.total++;
        if (normalizeString(gt.day) === normalizeString(matched.day)) {
          fieldStats.day.correct++;
        } else {
          fieldStats.day.mismatch++;
          itemIsAllFieldsExact = false;
          diffs.push(`day: expected "${gt.day}" vs "${matched.day}"`);
        }
      }

      // 3. Date
      if (gt.date) {
        fieldStats.date.total++;
        if (gt.date === matched.date) {
          fieldStats.date.correct++;
        } else {
          fieldStats.date.mismatch++;
          itemIsAllFieldsExact = false;
          diffs.push(`date: expected "${gt.date}" vs "${matched.date}"`);
        }
      }

      // 4. Start Time
      if (gt.startTime) {
        fieldStats.startTime.total++;
        if (gt.startTime === matched.startTime) {
          fieldStats.startTime.correct++;
        } else {
          fieldStats.startTime.mismatch++;
          itemIsAllFieldsExact = false;
          diffs.push(`startTime: expected "${gt.startTime}" vs "${matched.startTime}"`);
        }
      }

      // 5. End Time
      if (gt.endTime) {
        fieldStats.endTime.total++;
        if (gt.endTime === matched.endTime) {
          fieldStats.endTime.correct++;
        } else {
          fieldStats.endTime.mismatch++;
          itemIsAllFieldsExact = false;
          diffs.push(`endTime: expected "${gt.endTime}" vs "${matched.endTime}"`);
        }
      }

      // 6. Location
      if (gt.location) {
        fieldStats.location.total++;
        if (matched.location && normalizeString(matched.location).includes(normalizeString(gt.location).slice(0, 5))) {
          fieldStats.location.correct++;
        } else if (!matched.location) {
          fieldStats.location.missing++;
          diffs.push(`location: missing (expected "${gt.location}")`);
        } else {
          fieldStats.location.mismatch++;
          diffs.push(`location: expected "${gt.location}" vs "${matched.location}"`);
        }
      }

      // 7. Lecturer
      if (gt.lecturer) {
        fieldStats.lecturer.total++;
        const extLecturer = matched.instructor || matched.lecturer || "";
        if (extLecturer && (normalizeString(extLecturer).includes(normalizeString(gt.lecturer).slice(0, 6)) || normalizeString(gt.lecturer).includes(normalizeString(extLecturer).slice(0, 6)))) {
          fieldStats.lecturer.correct++;
        } else if (!extLecturer) {
          fieldStats.lecturer.missing++;
          diffs.push(`lecturer: missing (expected "${gt.lecturer}")`);
        } else {
          fieldStats.lecturer.mismatch++;
          diffs.push(`lecturer: expected "${gt.lecturer}" vs "${extLecturer}"`);
        }
      }

      // 8. Course Code
      if (gt.courseCode) {
        fieldStats.courseCode.total++;
        const extSubject = matched.subject || "";
        if (extSubject.toLowerCase().includes(gt.courseCode.toLowerCase()) || matched.title.toLowerCase().includes(gt.courseCode.toLowerCase())) {
          fieldStats.courseCode.correct++;
        } else {
          fieldStats.courseCode.missing++;
        }
      }

      correctRecords++;
      if (itemIsAllFieldsExact && diffs.length === 0) {
        exactMatchCount++;
      } else {
        partialMatchCount++;
      }

      matchDetails.push({
        groundTruth: gt,
        matchedExtraction: matched,
        isExactMatch: itemIsAllFieldsExact && diffs.length === 0,
        isPartialMatch: !itemIsAllFieldsExact || diffs.length > 0,
        fieldDifferences: diffs,
      });
    } else {
      // Missing Record
      fieldStats.title.total++;
      fieldStats.title.missing++;
      if (gt.day) {
        fieldStats.day.total++;
        fieldStats.day.missing++;
      }
      if (gt.startTime) {
        fieldStats.startTime.total++;
        fieldStats.startTime.missing++;
      }
      if (gt.endTime) {
        fieldStats.endTime.total++;
        fieldStats.endTime.missing++;
      }

      matchDetails.push({
        groundTruth: gt,
        matchedExtraction: undefined,
        isExactMatch: false,
        isPartialMatch: false,
        fieldDifferences: ["Record completely missing from extraction output"],
      });
    }
  }

  const missingRecords = expectedCount - correctRecords;
  const falsePositiveRecords = Math.max(0, extractedCount - correctRecords);

  const recordRecall = expectedCount > 0 ? parseFloat((correctRecords / expectedCount).toFixed(4)) : 1.0;
  const recordPrecision = extractedCount > 0 ? parseFloat((correctRecords / extractedCount).toFixed(4)) : 1.0;
  const exactMatchRate = expectedCount > 0 ? parseFloat((exactMatchCount / expectedCount).toFixed(4)) : 1.0;
  const partialMatchRate = expectedCount > 0 ? parseFloat((partialMatchCount / expectedCount).toFixed(4)) : 0.0;
  const falsePositiveRate = extractedCount > 0 ? parseFloat((falsePositiveRecords / extractedCount).toFixed(4)) : 0.0;

  const totalConf = extracted.reduce((acc, curr) => acc + (curr.confidenceScore ?? 0.8), 0);
  const averageConfidence = extractedCount > 0 ? parseFloat((totalConf / extractedCount).toFixed(2)) : 0.0;

  const fieldReports: Record<string, FieldAccuracyReport> = {};
  for (const [key, val] of Object.entries(fieldStats)) {
    const accuracy = val.total > 0 ? parseFloat((val.correct / val.total).toFixed(4)) : 1.0;
    fieldReports[key] = {
      fieldName: key,
      totalEvaluated: val.total,
      correctCount: val.correct,
      mismatchCount: val.mismatch,
      missingInExtractedCount: val.missing,
      accuracy,
    };
  }

  return {
    fixtureId: fixture.fixtureId,
    fileName: fixture.fileName,
    expectedRecords: expectedCount,
    extractedRecords: extractedCount,
    correctRecords,
    incorrectRecords: missingRecords,
    missingRecords,
    falsePositiveRecords,
    averageConfidence,
    recordRecall,
    recordPrecision,
    exactMatchRate,
    partialMatchRate,
    falsePositiveRate,
    fields: fieldReports,
    matchDetails,
  };
}

/**
 * Aggregates benchmark results across all fixtures
 */
export function aggregateBenchmarkResults(
  results: SingleFixtureBenchmarkResult[]
): ComprehensiveBenchmarkSummary {
  let totalExpected = 0;
  let totalExtracted = 0;
  let totalCorrect = 0;
  let totalMissing = 0;
  let totalFalsePositives = 0;
  let totalExact = 0;
  let totalPartial = 0;
  let weightedConfidenceSum = 0;

  const fieldTotals: Record<string, { total: number; correct: number }> = {};

  for (const r of results) {
    totalExpected += r.expectedRecords;
    totalExtracted += r.extractedRecords;
    totalCorrect += r.correctRecords;
    totalMissing += r.missingRecords;
    totalFalsePositives += r.falsePositiveRecords;
    totalExact += Math.round(r.exactMatchRate * r.expectedRecords);
    totalPartial += Math.round(r.partialMatchRate * r.expectedRecords);
    weightedConfidenceSum += r.averageConfidence * r.extractedRecords;

    for (const [fName, fReport] of Object.entries(r.fields)) {
      if (!fieldTotals[fName]) fieldTotals[fName] = { total: 0, correct: 0 };
      fieldTotals[fName].total += fReport.totalEvaluated;
      fieldTotals[fName].correct += fReport.correctCount;
    }
  }

  const overallRecall = totalExpected > 0 ? parseFloat((totalCorrect / totalExpected).toFixed(4)) : 1.0;
  const overallPrecision = totalExtracted > 0 ? parseFloat((totalCorrect / totalExtracted).toFixed(4)) : 1.0;
  const overallExactRate = totalExpected > 0 ? parseFloat((totalExact / totalExpected).toFixed(4)) : 1.0;
  const overallPartialRate = totalExpected > 0 ? parseFloat((totalPartial / totalExpected).toFixed(4)) : 0.0;
  const avgConfidence = totalExtracted > 0 ? parseFloat((weightedConfidenceSum / totalExtracted).toFixed(2)) : 0.0;

  let totalFieldEvaluations = 0;
  let totalFieldCorrect = 0;
  const fieldSummaries: Record<string, { totalEvaluated: number; correctCount: number; accuracy: number }> = {};

  for (const [k, v] of Object.entries(fieldTotals)) {
    totalFieldEvaluations += v.total;
    totalFieldCorrect += v.correct;
    fieldSummaries[k] = {
      totalEvaluated: v.total,
      correctCount: v.correct,
      accuracy: v.total > 0 ? parseFloat((v.correct / v.total).toFixed(4)) : 1.0,
    };
  }

  const overallFieldAccuracy =
    totalFieldEvaluations > 0 ? parseFloat((totalFieldCorrect / totalFieldEvaluations).toFixed(4)) : 1.0;

  return {
    totalFixtures: results.length,
    totalExpectedRecords: totalExpected,
    totalExtractedRecords: totalExtracted,
    totalCorrectRecords: totalCorrect,
    totalMissingRecords: totalMissing,
    totalFalsePositives,
    overallRecordRecall: overallRecall,
    overallRecordPrecision: overallPrecision,
    overallFieldAccuracy,
    overallExactMatchRate: overallExactRate,
    overallPartialMatchRate: overallPartialRate,
    averageConfidence: avgConfidence,
    fixtureResults: results,
    fieldSummaries,
  };
}
