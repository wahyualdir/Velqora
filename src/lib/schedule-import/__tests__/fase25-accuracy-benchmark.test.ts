import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { GROUND_TRUTH_DATASET } from "../../../../fixtures/schedules/ground-truth";
import { getFixtureBuffer } from "../../../../fixtures/schedules/data/real-world-fixtures";
import { processScheduleDocumentImport } from "../index";
import {
  evaluateFixtureExtraction,
  aggregateBenchmarkResults,
  SingleFixtureBenchmarkResult,
} from "../benchmark";

describe("FASE 26 — Real-World 20+ Fixtures Extraction Accuracy Benchmark", () => {
  it("should benchmark extraction accuracy against all 23 ground truth fixtures with >=95% recall & precision", async () => {
    const fixtureResults: SingleFixtureBenchmarkResult[] = [];

    for (const fixture of GROUND_TRUTH_DATASET) {
      const { buffer, fileName, mimeType } = await getFixtureBuffer(fixture.fixtureId);

      // Execute end-to-end import pipeline (deterministic parsing, structuring, normalization, conflict analysis)
      const pipelineResult = await processScheduleDocumentImport(
        buffer,
        fileName,
        mimeType,
        [],
        `bench_${fixture.fixtureId}`
      );

      // For valid schedule documents, pipeline must succeed
      if (!fixture.isCorrupted && !fixture.isScanned && !fixture.isUnrelated && !fixture.isEmpty) {
        assert.equal(
          pipelineResult.success,
          true,
          `Pipeline failed for fixture ${fixture.fixtureId}: ${pipelineResult.error}`
        );
      }

      // Evaluate accuracy against independent ground truth
      const extractedItems = pipelineResult.items || [];
      const evalResult = evaluateFixtureExtraction(fixture, extractedItems);
      fixtureResults.push(evalResult);

      // Per-fixture assertions for schedule fixtures
      if (fixture.expectedRecordsCount > 0) {
        assert.equal(
          evalResult.recordRecall >= 0.9,
          true,
          `Fixture ${fixture.fixtureId} recall (${evalResult.recordRecall}) is below 0.90`
        );
        assert.equal(
          evalResult.recordPrecision >= 0.9,
          true,
          `Fixture ${fixture.fixtureId} precision (${evalResult.recordPrecision}) is below 0.90`
        );
      } else {
        // For 0-expected fixtures (scanned, corrupt, unrelated, empty), extracted count must be 0 (0 false positives)
        assert.equal(
          extractedItems.length === 0,
          true,
          `Fixture ${fixture.fixtureId} expected 0 records but extracted ${extractedItems.length} false positives`
        );
      }
    }

    const summary = aggregateBenchmarkResults(fixtureResults);

    console.log("\n=======================================================");
    console.log("FASE 26 — EXTRACTION ACCURACY BENCHMARK SUMMARY REPORT");
    console.log("=======================================================");
    console.log(`Total Fixtures Evaluated  : ${summary.totalFixtures}`);
    console.log(`Total Expected Records    : ${summary.totalExpectedRecords}`);
    console.log(`Total Extracted Records   : ${summary.totalExtractedRecords}`);
    console.log(`Total Correct Records     : ${summary.totalCorrectRecords}`);
    console.log(`Total Missing Records     : ${summary.totalMissingRecords}`);
    console.log(`Total False Positives     : ${summary.totalFalsePositives}`);
    console.log(`-------------------------------------------------------`);
    console.log(`Record Recall             : ${(summary.overallRecordRecall * 100).toFixed(2)}%`);
    console.log(`Record Precision          : ${(summary.overallRecordPrecision * 100).toFixed(2)}%`);
    console.log(`Overall Field Accuracy    : ${(summary.overallFieldAccuracy * 100).toFixed(2)}%`);
    console.log(`Exact Match Rate          : ${(summary.overallExactMatchRate * 100).toFixed(2)}%`);
    console.log(`Partial Match Rate        : ${(summary.overallPartialMatchRate * 100).toFixed(2)}%`);
    console.log(`Average Evidence Conf.    : ${(summary.averageConfidence * 100).toFixed(1)}%`);
    console.log("-------------------------------------------------------");
    console.log("FIELD ACCURACY BREAKDOWN:");
    for (const [fName, fData] of Object.entries(summary.fieldSummaries)) {
      console.log(
        ` • ${fName.padEnd(12)}: ${(fData.accuracy * 100).toFixed(1)}% (${fData.correctCount}/${fData.totalEvaluated})`
      );
    }
    console.log("=======================================================\n");

    // Benchmark Threshold Assertions
    assert.equal(
      summary.overallRecordRecall >= 0.95,
      true,
      `Overall Record Recall (${(summary.overallRecordRecall * 100).toFixed(1)}%) must be >= 95%`
    );
    assert.equal(
      summary.overallRecordPrecision >= 0.95,
      true,
      `Overall Record Precision (${(summary.overallRecordPrecision * 100).toFixed(1)}%) must be >= 95%`
    );
    assert.equal(
      summary.overallFieldAccuracy >= 0.90,
      true,
      `Overall Field Accuracy (${(summary.overallFieldAccuracy * 100).toFixed(1)}%) must be >= 90%`
    );
    assert.equal(
      summary.totalFalsePositives === 0,
      true,
      `False positive records must be 0, found ${summary.totalFalsePositives}`
    );
  });
});
