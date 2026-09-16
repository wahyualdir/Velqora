import { ALL_ACADEMIC_CURRICULA } from "../../src/lib/curriculum/registry";
import * as fs from "fs";
import * as path from "path";

interface UnitClassification {
  topicId: string;
  chapterIndex: number;
  chapterTitle: string;
  subchapterIndex: number;
  subchapterTitle: string;
  unitIndex: number;
  unitId: string;
  unitTitle: string;
  contentLength: number;
  wordCount: number;
  classification: "UNIQUE_SUBSTANTIVE" | "UNIQUE_BUT_SHALLOW" | "TEMPLATE_REPETITION" | "EXACT_DUPLICATE" | "IRRELEVANT_CODE" | "MISSING_CONTEXT";
  reason: string;
  recommendation: string;
}

interface SubchapterAudit {
  topicId: string;
  subchapterId: string;
  title: string;
  codeSnippet: string;
  codeWordCount: number;
  contentWordCount: number;
  isTemplateSkeleton: boolean;
  codeClassification: string;
  codeReason: string;
}

async function runUniquenessAudit() {
  console.log("=== STARTING CONTENT UNIQUENESS AUDIT ===");

  const curricula = ALL_ACADEMIC_CURRICULA;
  const unitClassifications: UnitClassification[] = [];
  const subchapterAudits: SubchapterAudit[] = [];

  // Track global collections for duplicate detection
  const seenUnitTitles = new Map<string, string[]>(); // title -> [unitIds]
  const seenUnitContents = new Map<string, string[]>(); // normalized content -> [unitIds]
  const seenCodeSnippets = new Map<string, string[]>(); // normalized code -> [subchapterIds]

  // Skeletons to detect template repetition
  // From our inspection earlier:
  // "### ...\n\nPembahasan fokus mengenai **...** dalam konteks ... Memastikan penguasaan mendalam terhadap aspek teoritis, batasan komputasi, dan teknik integrasi tingkat lanjut."
  const unitTemplatePattern = /Pembahasan fokus mengenai \*\*.*?\*\* dalam konteks .*?\. Memastikan penguasaan mendalam terhadap aspek teoritis, batasan komputasi, dan teknik integrasi tingkat lanjut\./;

  // Subchapter template pattern:
  // "Dalam pemodelan Machine Learning, pemahaman terhadap ... merupakan fondasi krusial untuk menjamin keandalan sistem. Konsep ini menyelesaikan tantangan teknis dalam abstraksi sistem cerdas, mitigasi galat, dan efisiensi algoritma."
  const subTemplatePattern = /merupakan fondasi krusial untuk menjamin keandalan sistem\. Konsep ini menyelesaikan tantangan teknis dalam abstraksi sistem cerdas, mitigasi galat, dan efisiensi algoritma\./;

  let totalUnits = 0;
  let counts = {
    UNIQUE_SUBSTANTIVE: 0,
    UNIQUE_BUT_SHALLOW: 0,
    TEMPLATE_REPETITION: 0,
    EXACT_DUPLICATE: 0,
    IRRELEVANT_CODE: 0,
    MISSING_CONTEXT: 0,
  };

  for (const topic of curricula) {
    for (const ch of topic.chapters || []) {
      for (const sub of ch.subchapters || []) {
        // Audit Subchapter
        const subContent = sub.content_markdown || "";
        const subWords = subContent.trim().split(/\s+/).filter(Boolean).length;
        const codeEx = sub.codeExamples?.[0];
        const codeStr = codeEx?.code || "";
        const codeWords = codeStr.trim().split(/\s+/).filter(Boolean).length;

        const isSubTemplate = subTemplatePattern.test(subContent);

        // Check code snippet quality
        let codeClass = "RUNNABLE";
        let codeReason = "Standard functional implementation";
        if (codeStr.startsWith("print(") && codeWords <= 15) {
          codeClass = "TRIVIAL_PRINT_STATEMENT";
          codeReason = "Only prints descriptive strings without actual algorithmic computation";
        } else if (codeStr.includes("print('Status eksekusi:") && codeWords <= 20) {
          codeClass = "SYNTHETIC_MOCK_PRINT";
          codeReason = "Simulates output via print without real logic";
        }

        subchapterAudits.push({
          topicId: topic.id,
          subchapterId: sub.id,
          title: sub.title,
          codeSnippet: codeStr.slice(0, 100),
          codeWordCount: codeWords,
          contentWordCount: subWords,
          isTemplateSkeleton: isSubTemplate,
          codeClassification: codeClass,
          codeReason: codeReason,
        });

        // Audit each unit (sub-subchapter)
        for (const u of sub.subSubchapters || []) {
          totalUnits++;
          const content = (u.content_markdown || "").trim();
          const words = content.split(/\s+/).filter(Boolean).length;
          const normContent = content.toLowerCase().replace(/[^a-z0-9]/g, " ");

          // Track titles
          const titleKey = u.title.trim().toLowerCase();
          if (!seenUnitTitles.has(titleKey)) {
            seenUnitTitles.set(titleKey, []);
          }
          seenUnitTitles.get(titleKey)!.push(u.id);

          // Track content
          if (!seenUnitContents.has(normContent)) {
            seenUnitContents.set(normContent, []);
          }
          seenUnitContents.get(normContent)!.push(u.id);

          // Classification logic
          let classification: UnitClassification["classification"] = "UNIQUE_SUBSTANTIVE";
          let reason = "";
          let recommendation = "";

          const isTemplate = unitTemplatePattern.test(content);

          if (content.length === 0) {
            classification = "MISSING_CONTEXT";
            reason = "Content markdown string is empty.";
            recommendation = "Provide comprehensive academic exposition and practical case studies.";
          } else if (seenUnitContents.get(normContent)!.length > 1 && !isTemplate) {
            classification = "EXACT_DUPLICATE";
            reason = `Exact duplicate of content in unit ${seenUnitContents.get(normContent)![0]}.`;
            recommendation = "Differentiate unit content to address topic-specific theoretical nuances.";
          } else if (isTemplate) {
            classification = "TEMPLATE_REPETITION";
            reason = "Uses generic single-sentence boilerplate template generated by script skeleton (~25 words).";
            recommendation = "Replace skeleton with in-depth analytical text, formal proofs, or implementation walkthroughs.";
          } else if (words < 60) {
            classification = "UNIQUE_BUT_SHALLOW";
            reason = `Only ${words} words; presents brief definitions without technical or empirical depth.`;
            recommendation = "Expand to at least 250-500 words with equations, practical caveats, and diagrams.";
          } else {
            classification = "UNIQUE_SUBSTANTIVE";
            reason = `Substantive depth with ${words} words, containing technical explanation.`;
            recommendation = "Maintain depth and update citations as technology evolves.";
          }

          counts[classification]++;

          // Sample recording (to avoid 40,500 objects in memory if not needed, we record summary and specific representatives)
          if (
            unitClassifications.length < 500 || // sample first 500
            classification !== "TEMPLATE_REPETITION" // keep all non-template ones
          ) {
            unitClassifications.push({
              topicId: topic.id,
              chapterIndex: ch.orderIndex,
              chapterTitle: ch.title,
              subchapterIndex: sub.orderIndex,
              subchapterTitle: sub.title,
              unitIndex: u.orderIndex,
              unitId: u.id,
              unitTitle: u.title,
              contentLength: content.length,
              wordCount: words,
              classification,
              reason,
              recommendation,
            });
          }
        }
      }
    }
  }

  // Count template subchapters
  const templateSubchaptersCount = subchapterAudits.filter((s) => s.isTemplateSkeleton).length;
  const trivialPrintCodeCount = subchapterAudits.filter((s) => s.codeClassification === "TRIVIAL_PRINT_STATEMENT" || s.codeClassification === "SYNTHETIC_MOCK_PRINT").length;

  const results = {
    totalUnits,
    classificationCounts: counts,
    percentages: {
      UNIQUE_SUBSTANTIVE: ((counts.UNIQUE_SUBSTANTIVE / totalUnits) * 100).toFixed(2) + "%",
      UNIQUE_BUT_SHALLOW: ((counts.UNIQUE_BUT_SHALLOW / totalUnits) * 100).toFixed(2) + "%",
      TEMPLATE_REPETITION: ((counts.TEMPLATE_REPETITION / totalUnits) * 100).toFixed(2) + "%",
      EXACT_DUPLICATE: ((counts.EXACT_DUPLICATE / totalUnits) * 100).toFixed(2) + "%",
      IRRELEVANT_CODE: ((counts.IRRELEVANT_CODE / totalUnits) * 100).toFixed(2) + "%",
      MISSING_CONTEXT: ((counts.MISSING_CONTEXT / totalUnits) * 100).toFixed(2) + "%",
    },
    subchapterAudits: {
      totalSubchapters: subchapterAudits.length,
      templateSubchaptersCount,
      templateSubchapterPercentage: ((templateSubchaptersCount / subchapterAudits.length) * 100).toFixed(2) + "%",
      trivialPrintCodeCount,
      trivialPrintCodePercentage: ((trivialPrintCodeCount / subchapterAudits.length) * 100).toFixed(2) + "%",
    },
    sampleFindings: unitClassifications.slice(0, 50),
  };

  const outputPath = path.resolve("scripts/audit-2-2-1/uniqueness-output.json");
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf-8");

  console.log("Content Uniqueness Audit Completed:");
  console.log(JSON.stringify(results.classificationCounts, null, 2));
  console.log(JSON.stringify(results.percentages, null, 2));
  console.log("Subchapters template stats:", JSON.stringify(results.subchapterAudits, null, 2));
}

runUniquenessAudit().catch((err) => {
  console.error("Uniqueness audit error:", err);
  process.exit(1);
});
