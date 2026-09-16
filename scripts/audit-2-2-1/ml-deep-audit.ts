import { machineLearningCurriculum } from "../../src/lib/curriculum/topics/19-machine-learning";
import * as fs from "fs";
import * as path from "path";

async function auditMachineLearningTopic() {
  console.log("=== STARTING DEEP AUDIT OF TOPIC 19 (MACHINE LEARNING) ===");
  const topic = machineLearningCurriculum;

  const chapterAudits: any[] = [];
  let totalSubchapters = 0;
  let totalUnits = 0;

  let has16StepInspection = false;
  let hasOverfittingSuite = false;
  let hasPolyDegree1315 = false;
  let hasBiasVarianceAnalysis = false;
  let hasRidgeLassoMath = false;
  let hasLearningCurve = false;
  let hasValidationCurve = false;
  let hasPipelineUsage = false;
  let detectedDataLeakages: string[] = [];

  for (const ch of topic.chapters) {
    const chData = {
      orderIndex: ch.orderIndex,
      title: ch.title,
      subchaptersCount: ch.subchapters?.length || 0,
      subchapters: [] as any[],
    };

    if (ch.title.toLowerCase().includes("overfitting") || ch.title.toLowerCase().includes("bias-variance")) {
      hasOverfittingSuite = true;
    }

    for (const sub of ch.subchapters || []) {
      totalSubchapters++;
      const subUnits = sub.subSubchapters?.length || 0;
      totalUnits += subUnits;

      const content = sub.content_markdown || "";
      const code = sub.codeExamples?.[0]?.code || "";
      const expectedOutput = sub.codeExamples?.[0]?.expectedOutput || "";

      if (content.includes("16 langkah") || content.includes("16-langkah") || code.includes("16-langkah") || content.includes("inspeksi")) {
        has16StepInspection = true;
      }
      if (code.includes("PolynomialFeatures") && (code.includes("degree=15") || code.includes("degree=3") || code.includes("degrees = [1, 3, 15]"))) {
        hasPolyDegree1315 = true;
      }
      if (content.includes("bias-variance") || content.includes("bias-varians") || code.includes("bias")) {
        hasBiasVarianceAnalysis = true;
      }
      if (code.includes("Ridge") || code.includes("Lasso")) {
        hasRidgeLassoMath = true;
      }
      if (code.includes("learning_curve") || content.includes("learning curve")) {
        hasLearningCurve = true;
      }
      if (code.includes("validation_curve") || content.includes("validation curve")) {
        hasValidationCurve = true;
      }
      if (code.includes("Pipeline(") || code.includes("make_pipeline(")) {
        hasPipelineUsage = true;
      }

      // Check data leakage
      if (
        (code.includes("fit_transform") || code.includes(".fit(X)")) &&
        code.includes("train_test_split")
      ) {
        const fitIdx = code.indexOf(".fit");
        const splitIdx = code.indexOf("train_test_split");
        if (fitIdx < splitIdx) {
          detectedDataLeakages.push(`Chapter ${ch.orderIndex}, Subchapter ${sub.orderIndex} (${sub.title}): Preprocessor fit before split`);
        }
      }

      chData.subchapters.push({
        orderIndex: sub.orderIndex,
        title: sub.title,
        codeSnippetSample: code.slice(0, 100),
        hasCode: code.length > 0,
        contentWords: content.split(/\s+/).length,
        unitsCount: subUnits,
      });
    }

    chapterAudits.push(chData);
  }

  const report = {
    topicId: topic.id,
    title: topic.title,
    chaptersCount: topic.chapters.length,
    totalSubchapters,
    totalUnits,
    curriculumDatasets: topic.datasets?.map((d) => ({
      name: d.name,
      license: d.license,
      samples: d.numSamples,
      features: d.numFeatures,
    })),
    keyVerifications: {
      has16StepInspection,
      hasOverfittingSuite,
      hasPolyDegree1315,
      hasBiasVarianceAnalysis,
      hasRidgeLassoMath,
      hasLearningCurve,
      hasValidationCurve,
      hasPipelineUsage,
      detectedDataLeakagesCount: detectedDataLeakages.length,
      detectedDataLeakages,
    },
    chapters: chapterAudits,
  };

  const outputPath = path.resolve("scripts/audit-2-2-1/ml-deep-audit-output.json");
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), "utf-8");

  console.log("=== ML TOPIC AUDIT COMPLETED ===");
  console.log("Chapters:", topic.chapters.length);
  console.log("Subchapters:", totalSubchapters);
  console.log("Units:", totalUnits);
  console.log("Key Verifications:", JSON.stringify(report.keyVerifications, null, 2));
}

auditMachineLearningTopic().catch((err) => {
  console.error("ML audit error:", err);
  process.exit(1);
});
