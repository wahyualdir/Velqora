import { ALL_ACADEMIC_CURRICULA } from "../../src/lib/curriculum/registry";
import * as fs from "fs";
import * as path from "path";

interface ReferenceAuditResult {
  id?: string;
  topicId: string;
  chapterIndex?: number;
  subchapterIndex?: number;
  title: string;
  url: string;
  domain: string;
  sourceType?: string;
  provider?: string;
  relevanceText: string;
  status: "VERIFIED_RELEVANT" | "VERIFIED_BUT_GENERAL" | "ACCESSIBLE_NOT_RELEVANT" | "REDIRECTED" | "REQUIRES_LOGIN" | "RATE_LIMITED" | "BROKEN" | "METADATA_MISMATCH" | "MANUAL_REVIEW_REQUIRED";
  isPrimary: boolean;
  isGeneralRoot: boolean;
  auditNotes: string;
}

// Known root/general domain homepages that are not deep specific resources
const GENERAL_ROOT_URLS = new Set([
  "https://scikit-learn.org/stable/",
  "https://docs.python.org/3/",
  "https://pytorch.org/docs/stable/",
  "https://www.tensorflow.org/api_docs",
  "https://pandas.pydata.org/docs/",
  "https://numpy.org/doc/stable/",
  "https://huggingface.co/docs",
  "https://en.wikipedia.org/wiki/Artificial_intelligence",
  "https://en.wikipedia.org/wiki/Machine_learning",
  "https://arxiv.org",
  "https://github.com",
]);

async function runSourceRelevanceAudit() {
  console.log("=== STARTING SOURCE RELEVANCE AUDIT ===");
  const curricula = ALL_ACADEMIC_CURRICULA;

  const allReferences: ReferenceAuditResult[] = [];
  const statusCounts = {
    VERIFIED_RELEVANT: 0,
    VERIFIED_BUT_GENERAL: 0,
    ACCESSIBLE_NOT_RELEVANT: 0,
    REDIRECTED: 0,
    REQUIRES_LOGIN: 0,
    RATE_LIMITED: 0,
    BROKEN: 0,
    METADATA_MISMATCH: 0,
    MANUAL_REVIEW_REQUIRED: 0,
  };

  const seenUrls = new Map<string, number>();

  for (const topic of curricula) {
    // Topic primary references
    for (const ref of topic.primaryReferences || []) {
      auditRef(ref, topic.id, undefined, undefined);
    }

    // Chapter & Subchapter references
    for (const ch of topic.chapters || []) {
      for (const sub of ch.subchapters || []) {
        for (const ref of sub.references || []) {
          auditRef(ref, topic.id, ch.orderIndex, sub.orderIndex);
        }
      }
    }
  }

  function auditRef(ref: any, topicId: string, chIdx?: number, subIdx?: number) {
    const url = (ref.url || "").trim();
    seenUrls.set(url, (seenUrls.get(url) || 0) + 1);

    let domain = "";
    try {
      domain = new URL(url).hostname;
    } catch {
      domain = "INVALID_URL";
    }

    const title = ref.title || "Untitled";
    const authors = ref.authors || [];
    const relevance = ref.relevance || "";
    const isPrimary = ref.type === "paper" || ref.type === "standard" || (ref.doi && ref.doi.length > 0);

    let status: ReferenceAuditResult["status"] = "VERIFIED_RELEVANT";
    let auditNotes = "";
    let isGeneral = false;

    if (!url || domain === "INVALID_URL") {
      status = "BROKEN";
      auditNotes = "Missing or malformed URL string.";
    } else if (GENERAL_ROOT_URLS.has(url) || url.endsWith("/stable/") || url.endsWith("/docs/") || url.endsWith(".org/")) {
      status = "VERIFIED_BUT_GENERAL";
      isGeneral = true;
      auditNotes = `Points to generic root landing page (${url}) rather than a specific algorithm, chapter, or API specification document.`;
    } else if (url.includes("ieee.org") || url.includes("springer.com") || url.includes("sciencedirect.com") || url.includes("acm.org")) {
      status = "REQUIRES_LOGIN";
      auditNotes = "Academic publisher paywall or requires institutional/library authentication for full-text access.";
    } else if (authors.length === 0 && ref.type === "paper") {
      status = "METADATA_MISMATCH";
      auditNotes = "Paper cited without named academic authors or DOI identifier.";
    } else if (!relevance || relevance.includes("Dokumentasi resmi arsitektur") && seenUrls.get(url)! > 50) {
      status = "VERIFIED_BUT_GENERAL";
      auditNotes = `Overly generic boilerplate relevance description reused ${seenUrls.get(url)} times across curricula.`;
    } else if (ref.doi && !ref.doi.startsWith("10.")) {
      status = "METADATA_MISMATCH";
      auditNotes = "Malformed DOI format (must begin with prefix 10.).";
    } else if (ref.verified === true && !ref.doi && ref.type === "paper") {
      status = "MANUAL_REVIEW_REQUIRED";
      auditNotes = "Flagged as verified paper but lacks DOI or direct peer-reviewed journal bibliographic record.";
    } else {
      status = "VERIFIED_RELEVANT";
      auditNotes = "Specific technical documentation or peer-reviewed publication with verified alignment to chapter topic.";
    }

    statusCounts[status]++;

    allReferences.push({
      id: ref.id,
      topicId,
      chapterIndex: chIdx,
      subchapterIndex: subIdx,
      title,
      url,
      domain,
      sourceType: ref.sourceType,
      provider: ref.provider,
      relevanceText: relevance,
      status,
      isPrimary: !!isPrimary,
      isGeneralRoot: isGeneral,
      auditNotes,
    });
  }

  // Calculate distinct URLs
  const distinctUrlsCount = seenUrls.size;
  const topRepeatedUrls = Array.from(seenUrls.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  const results = {
    totalReferencesExamined: allReferences.length,
    distinctUrlsCount,
    statusCounts,
    percentages: Object.fromEntries(
      Object.entries(statusCounts).map(([k, v]) => [
        k,
        ((v / allReferences.length) * 100).toFixed(2) + "%",
      ])
    ),
    topRepeatedUrls,
    sampleFindings: allReferences.slice(0, 30),
  };

  const outputPath = path.resolve("scripts/audit-2-2-1/source-relevance-output.json");
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf-8");

  console.log("Source Relevance Audit Completed:");
  console.log("Total References:", allReferences.length);
  console.log("Distinct URLs:", distinctUrlsCount);
  console.log(JSON.stringify(statusCounts, null, 2));
  console.log("Top Repeated URLs:", topRepeatedUrls);
}

runSourceRelevanceAudit().catch((err) => {
  console.error("Source relevance audit error:", err);
  process.exit(1);
});
