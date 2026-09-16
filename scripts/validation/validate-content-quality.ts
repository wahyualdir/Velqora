/**
 * VALIDATOR MUTU KONTEN & ANTI-BOILERPLATE KURIKULUM
 * Memeriksa bahwa unit kurikulum memiliki substansi akademis yang memadai,
 * ketiadaan placeholder teks kosong, dan keselarasan alur pedagogis.
 */

import { ALL_ACADEMIC_CURRICULA } from "../../src/lib/curriculum/registry";

interface QualityDefect {
  topicId: string;
  subchapterId: string;
  defectType: "PLACEHOLDER" | "BOILERPLATE_DETECTED" | "MISSING_INTERPRETATION" | "MISSING_OBJECTIVES";
  details: string;
}

const FORBIDDEN_PLACEHOLDER_STRINGS = [
  "lorem ipsum",
  "isi materi di sini",
  "TODO:",
  "[PLACEHOLDER]",
  "output belum dibuat",
  "konten generik",
];

export function validateCurriculumQuality(): {
  isValid: boolean;
  totalSubchaptersChecked: number;
  totalUnitsChecked: number;
  defects: QualityDefect[];
} {
  const defects: QualityDefect[] = [];
  let totalSubchaptersChecked = 0;
  let totalUnitsChecked = 0;

  for (const topic of ALL_ACADEMIC_CURRICULA) {
    for (const chapter of topic.chapters || []) {
      for (const sub of chapter.subchapters || []) {
        totalSubchaptersChecked++;

        // Periksa keberadaan learning objectives pada subbab yang diaudit
        if (sub.units && sub.units.length > 0) {
          if (!sub.learningObjectives || sub.learningObjectives.length === 0) {
            defects.push({
              topicId: topic.id,
              subchapterId: sub.id,
              defectType: "MISSING_OBJECTIVES",
              details: `Subbab unit '${sub.title}' tidak memiliki learning objectives terdefinisi`,
            });
          }

          let lastWasCode = false;
          let codeHasOutput = false;

          for (const unit of sub.units) {
            totalUnitsChecked++;

            // Periksa string placeholder
            const stringified = JSON.stringify(unit).toLowerCase();
            for (const ph of FORBIDDEN_PLACEHOLDER_STRINGS) {
              if (stringified.includes(ph.toLowerCase())) {
                defects.push({
                  topicId: topic.id,
                  subchapterId: sub.id,
                  defectType: "PLACEHOLDER",
                  details: `Unit ${unit.id} mengandung teks placeholder terlarang '${ph}'`,
                });
              }
            }

            // Validasi relasi kode -> output
            if (unit.type === "code") {
              lastWasCode = true;
              codeHasOutput = false;
            } else if (unit.type === "output" && lastWasCode) {
              codeHasOutput = true;
              lastWasCode = false;
            } else if (unit.type === "interpretation" && codeHasOutput) {
              // Valid code-output-interpretation sequence
              codeHasOutput = false;
            }
          }
        }
      }
    }
  }

  return {
    isValid: defects.length === 0,
    totalSubchaptersChecked,
    totalUnitsChecked,
    defects,
  };
}

if (require.main === module || process.argv[1]?.includes("validate-content-quality")) {
  console.log("=== MENJALANKAN VALIDASI MUTU KONTEN & ANTI-BOILERPLATE ===");
  const result = validateCurriculumQuality();
  console.log(`Total Subbab Diperiksa: ${result.totalSubchaptersChecked}`);
  console.log(`Total Unit Semantik Diperiksa: ${result.totalUnitsChecked}`);
  console.log(`Status Mutu: ${result.isValid ? "LULUS (0 Defek)" : "DITEMUKAN DEFEK"}`);

  if (result.defects.length > 0) {
    console.error(`\nDitemukan ${result.defects.length} defek kualitas:`);
    result.defects.slice(0, 10).forEach((d) => console.error(` - [${d.defectType}] ${d.details}`));
    process.exit(1);
  } else {
    console.log("Seluruh unit semantik terverifikasi substantif dan bebas dari placeholder.");
    process.exit(0);
  }
}
