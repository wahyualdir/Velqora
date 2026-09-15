import { SYSTEM_PRIMARY_CATEGORIES } from "../src/lib/constants";
import { getDefaultSectionsForCategory } from "../src/lib/fallback-syllabus-defaults";
import { SCIKIT_LEARN_USER_GUIDE_SECTIONS, getAllFlatScikitLearnSections } from "../src/lib/scikit-learn-curriculum";
import { AI_FUNDAMENTALS_CHAPTERS, getAllFlatAiFundamentalsSections } from "../src/lib/ai-fundamentals-curriculum";
import * as fs from "fs";
import * as path from "path";

const aiCategory = SYSTEM_PRIMARY_CATEGORIES.find(c => c.name === "Kecerdasan Buatan");
if (!aiCategory) {
  console.error("Kecerdasan Buatan not found in SYSTEM_PRIMARY_CATEGORIES");
  process.exit(1);
}

const topics = aiCategory.subcategories.map(s => s.name);
console.log(`\n=== VELQORA CURRICULUM AUDIT: 28 TOPIK KECERDASAN BUATAN ===\nTotal Topics: ${topics.length}\n`);

// Check reader routing logic from DedicatedCategoryModulesPage:
// Which topics have dedicated TS curriculum?
// Machine Learning -> SCIKIT_LEARN_USER_GUIDE_SECTIONS (22 chapters, rich subchapters)
// Artificial Intelligence Fundamentals -> AI_FUNDAMENTALS_CHAPTERS (5 chapters, 26 subchapters)
// Others -> vaultNotes (if seeded in DB) OR fallback via enrichCurriculumToDocSections(getDefaultSectionsForCategory(catName), catName)

const auditResults = [];

topics.forEach((topicName, idx) => {
  const norm = topicName.toLowerCase().trim();
  let source = "Fallback (Batch Defaults + Universal Enricher)";
  let chaptersCount = 0;
  let subchaptersCount = 0;
  let isDedicatedTs = false;
  let hasCode = false;

  if (norm.includes("machine learning") || norm.includes("pembelajaran mesin") || norm.includes("scikit")) {
    source = "Dedicated TS Module (Scikit-Learn Curriculum: chapters-1-to-22)";
    chaptersCount = SCIKIT_LEARN_USER_GUIDE_SECTIONS.length;
    subchaptersCount = getAllFlatScikitLearnSections().length;
    isDedicatedTs = true;
    hasCode = true;
  } else if (
    norm.includes("artificial intelligence fundamentals") ||
    norm.includes("ai fundamentals") ||
    norm.includes("dasar kecerdasan buatan")
  ) {
    source = "Dedicated TS Module (AI Fundamentals Russell & Norvig Pilot)";
    chaptersCount = AI_FUNDAMENTALS_CHAPTERS.length;
    subchaptersCount = getAllFlatAiFundamentalsSections().length;
    isDedicatedTs = true;
    hasCode = true;
  } else {
    const fallbackSections = getDefaultSectionsForCategory(topicName);
    chaptersCount = fallbackSections.length;
    // Each fallback section in batch defaults has ~1 codeSnippet and a single description
    subchaptersCount = 0; // No real subchapters, only top-level chapters in batch defaults!
    hasCode = fallbackSections.some(s => s.codeSnippets && s.codeSnippets.length > 0);
  }

  auditResults.push({
    index: idx + 1,
    topicName,
    source,
    chaptersCount,
    subchaptersCount,
    isDedicatedTs,
    hasCode,
  });

  console.log(`[${String(idx + 1).padStart(2, '0')}] ${topicName.padEnd(50, ' ')} | Ch: ${String(chaptersCount).padStart(2)} | Sub: ${String(subchaptersCount).padStart(2)} | Source: ${source}`);
});
