import { ALL_ACADEMIC_CURRICULA } from "../src/lib/curriculum/registry";

console.log("=== DETAILED CURRICULUM AUDIT (PHASE 2.2) ===");
console.log(`Total Curricula: ${ALL_ACADEMIC_CURRICULA.length}\n`);

interface TopicAudit {
  id: string;
  title: string;
  category: string;
  level: string;
  chaptersCount: number;
  subchaptersCount: number;
  avgSub: number;
  minSub: number;
  maxSub: number;
  totalCode: number;
  totalRefs: number;
  totalChars: number;
  hasMath: boolean;
}

const auditResults: TopicAudit[] = [];

for (const curr of ALL_ACADEMIC_CURRICULA) {
  let subCount = 0;
  let minSub = Infinity;
  let maxSub = 0;
  let codeCount = 0;
  let charCount = 0;
  let hasMath = false;

  for (const ch of curr.chapters) {
    const subs = ch.subchapters.length;
    subCount += subs;
    if (subs < minSub) minSub = subs;
    if (subs > maxSub) maxSub = subs;

    for (const sub of ch.subchapters) {
      if (sub.codeExamples) {
        codeCount += sub.codeExamples.length;
      }
      if (sub.content_markdown) {
        charCount += sub.content_markdown.length;
        if (sub.content_markdown.includes("$")) hasMath = true;
      }
    }
  }

  auditResults.push({
    id: curr.id,
    title: curr.title,
    category: curr.category,
    level: curr.level,
    chaptersCount: curr.chapters.length,
    subchaptersCount: subCount,
    avgSub: curr.chapters.length ? +(subCount / curr.chapters.length).toFixed(1) : 0,
    minSub: minSub === Infinity ? 0 : minSub,
    maxSub,
    totalCode: codeCount,
    totalRefs: curr.primaryReferences.length,
    totalChars: charCount,
    hasMath,
  });
}

console.table(auditResults);
