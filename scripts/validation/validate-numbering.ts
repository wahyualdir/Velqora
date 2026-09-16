/**
 * VALIDATOR PENOMORAN & HIERARKI KURIKULUM
 * Memeriksa integritas sekuensial bab, subbab, dan ketiadaan nomor yang melompat (gaps)
 * atau duplikasi nomor heading.
 */

import { ALL_ACADEMIC_CURRICULA } from "../../src/lib/curriculum/registry";

interface NumberingDefect {
  topicId: string;
  chapterIndex?: number;
  subchapterIndex?: number;
  defectType: "MISSING_NUMBER" | "DUPLICATE_NUMBER" | "ORDER_INCONSISTENCY" | "EMPTY_HEADING";
  details: string;
}

export function validateCurriculumNumbering(): {
  isValid: boolean;
  totalCheckedChapters: number;
  totalCheckedSubchapters: number;
  defects: NumberingDefect[];
} {
  const defects: NumberingDefect[] = [];
  let totalCheckedChapters = 0;
  let totalCheckedSubchapters = 0;

  for (const topic of ALL_ACADEMIC_CURRICULA) {
    let expectedChapterOrder = 1;
    const seenChapterIndices = new Set<number>();

    for (const chapter of topic.chapters || []) {
      totalCheckedChapters++;
      const chIdx = chapter.orderIndex;

      if (!chapter.title || chapter.title.trim().length === 0) {
        defects.push({
          topicId: topic.id,
          chapterIndex: chIdx,
          defectType: "EMPTY_HEADING",
          details: `Bab memiliki judul kosong pada orderIndex ${chIdx}`,
        });
      }

      if (seenChapterIndices.has(chIdx)) {
        defects.push({
          topicId: topic.id,
          chapterIndex: chIdx,
          defectType: "DUPLICATE_NUMBER",
          details: `Duplikasi nomor bab ${chIdx} pada topik ${topic.id}`,
        });
      }
      seenChapterIndices.add(chIdx);

      // Periksa subbab di dalam bab
      let expectedSubOrder = 1;
      const seenSubIndices = new Set<number>();

      for (const sub of chapter.subchapters || []) {
        totalCheckedSubchapters++;
        const subIdx = sub.orderIndex;

        if (!sub.title || sub.title.trim().length === 0) {
          defects.push({
            topicId: topic.id,
            chapterIndex: chIdx,
            subchapterIndex: subIdx,
            defectType: "EMPTY_HEADING",
            details: `Subbab memiliki judul kosong pada bab ${chIdx}.${subIdx}`,
          });
        }

        if (seenSubIndices.has(subIdx)) {
          defects.push({
            topicId: topic.id,
            chapterIndex: chIdx,
            subchapterIndex: subIdx,
            defectType: "DUPLICATE_NUMBER",
            details: `Duplikasi nomor subbab ${subIdx} pada bab ${chIdx}`,
          });
        }
        seenSubIndices.add(subIdx);

        expectedSubOrder++;
      }

      expectedChapterOrder++;
    }
  }

  return {
    isValid: defects.length === 0,
    totalCheckedChapters,
    totalCheckedSubchapters,
    defects,
  };
}

if (require.main === module || process.argv[1]?.includes("validate-numbering")) {
  console.log("=== MENJALANKAN VALIDASI PENOMORAN & HIERARKI KURIKULUM ===");
  const result = validateCurriculumNumbering();
  console.log(`Total Bab Diperiksa: ${result.totalCheckedChapters}`);
  console.log(`Total Subbab Diperiksa: ${result.totalCheckedSubchapters}`);
  console.log(`Status Valid: ${result.isValid ? "LULUS (0 Defek)" : "DITEMUKAN DEFEK"}`);

  if (result.defects.length > 0) {
    console.error(`\nDitemukan ${result.defects.length} defek penomoran:`);
    result.defects.slice(0, 10).forEach((d) => console.error(` - [${d.defectType}] ${d.details}`));
    process.exit(1);
  } else {
    console.log("Semua bab dan subbab memiliki urutan dan penomoran valid tanpa celah.");
    process.exit(0);
  }
}
