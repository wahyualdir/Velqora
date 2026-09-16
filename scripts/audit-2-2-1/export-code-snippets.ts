import { ALL_ACADEMIC_CURRICULA } from "../../src/lib/curriculum/registry";
import * as fs from "fs";
import * as path from "path";

async function exportAllCode() {
  console.log("Exporting all code snippets from all 28 topics...");
  const curricula = ALL_ACADEMIC_CURRICULA;
  const snippets: any[] = [];

  for (const topic of curricula) {
    for (const ch of topic.chapters || []) {
      for (const sub of ch.subchapters || []) {
        for (const c of sub.codeExamples || []) {
          snippets.push({
            topicId: topic.id,
            chapterIndex: ch.orderIndex,
            chapterTitle: ch.title,
            subchapterIndex: sub.orderIndex,
            subchapterTitle: sub.title,
            codeId: c.id,
            filename: c.filename,
            language: c.language,
            code: c.code || "",
            expectedOutput: c.expectedOutput || "",
            explanation: c.explanation || "",
          });
        }
      }
    }
  }

  const outPath = path.resolve("scripts/audit-2-2-1/all-code-snippets.json");
  fs.writeFileSync(outPath, JSON.stringify(snippets, null, 2), "utf-8");
  console.log(`Exported ${snippets.length} snippets to ${outPath}`);
}

exportAllCode().catch((err) => {
  console.error(err);
  process.exit(1);
});
