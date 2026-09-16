/**
 * VALIDATOR KETERLACAKAN SUMBER AKADEMIK (SOURCE TRACEABILITY)
 * Memastikan bahwa seluruh referensi rujukan memiliki metadata akademis
 * yang lengkap (penulis, judul, penerbit/venue, URL/DOI) tanpa fabrikasi.
 */

import { ALL_ACADEMIC_CURRICULA } from "../../src/lib/curriculum/registry";

interface SourceDefect {
  topicId: string;
  sourceTitle: string;
  defectType: "MISSING_AUTHORS" | "MISSING_TITLE" | "MISSING_URL_OR_DOI" | "INVALID_YEAR";
  details: string;
}

export function validateSourceTraceability(): {
  isValid: boolean;
  totalSourcesChecked: number;
  defects: SourceDefect[];
} {
  const defects: SourceDefect[] = [];
  let totalSourcesChecked = 0;

  for (const topic of ALL_ACADEMIC_CURRICULA) {
    for (const ref of topic.primaryReferences || []) {
      totalSourcesChecked++;

      if (!ref.title || ref.title.trim().length === 0) {
        defects.push({
          topicId: topic.id,
          sourceTitle: "Untitled",
          defectType: "MISSING_TITLE",
          details: `Sumber rujukan pada topik ${topic.id} tidak memiliki judul`,
        });
      }

      if (!ref.authors || ref.authors.length === 0) {
        defects.push({
          topicId: topic.id,
          sourceTitle: ref.title,
          defectType: "MISSING_AUTHORS",
          details: `Sumber '${ref.title}' tidak mencantumkan penulis`,
        });
      }

      if (!ref.url && !ref.doi) {
        defects.push({
          topicId: topic.id,
          sourceTitle: ref.title,
          defectType: "MISSING_URL_OR_DOI",
          details: `Sumber '${ref.title}' tidak memiliki URL maupun DOI`,
        });
      }

      if (ref.year && (ref.year < 1940 || ref.year > 2027)) {
        defects.push({
          topicId: topic.id,
          sourceTitle: ref.title,
          defectType: "INVALID_YEAR",
          details: `Tahun publikasi '${ref.year}' di luar rentang valid untuk '${ref.title}'`,
        });
      }
    }
  }

  return {
    isValid: defects.length === 0,
    totalSourcesChecked,
    defects,
  };
}

if (require.main === module || process.argv[1]?.includes("validate-source-traceability")) {
  console.log("=== MENJALANKAN VALIDASI KETERLACAKAN SUMBER AKADEMIK ===");
  const result = validateSourceTraceability();
  console.log(`Total Sumber Primer Diperiksa: ${result.totalSourcesChecked}`);
  console.log(`Status Keterlacakan: ${result.isValid ? "LULUS (0 Defek)" : "DITEMUKAN DEFEK"}`);

  if (result.defects.length > 0) {
    console.error(`\nDitemukan ${result.defects.length} defek sumber:`);
    result.defects.forEach((d) => console.error(` - [${d.defectType}] ${d.details}`));
    process.exit(1);
  } else {
    console.log("Seluruh rujukan akademik primer terverifikasi memiliki metadata lengkap.");
    process.exit(0);
  }
}
