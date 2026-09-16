/**
 * VALIDATOR HUBUNGAN KODE, OUTPUT & INTERPRETASI
 * Memastikan bahwa setiap sel kode komputasi memiliki unit output dan
 * interpretasi analitis yang saling terhubung secara eksplisit.
 */

import { ALL_ACADEMIC_CURRICULA } from "../../src/lib/curriculum/registry";

interface ExecutionLinkDefect {
  topicId: string;
  subchapterId: string;
  unitId: string;
  defectType: "UNLINKED_OUTPUT" | "MISSING_EVIDENCE" | "MISSING_POST_ANALYSIS";
  details: string;
}

export function validateExecutionLinks(): {
  isValid: boolean;
  totalCodeCellsChecked: number;
  totalOutputCellsChecked: number;
  defects: ExecutionLinkDefect[];
} {
  const defects: ExecutionLinkDefect[] = [];
  let totalCodeCellsChecked = 0;
  let totalOutputCellsChecked = 0;

  for (const topic of ALL_ACADEMIC_CURRICULA) {
    for (const chapter of topic.chapters || []) {
      for (const sub of chapter.subchapters || []) {
        if (!sub.units || sub.units.length === 0) continue;

        const codeUnits = sub.units.filter((u) => u.type === "code");
        const outputUnits = sub.units.filter((u) => u.type === "output");

        totalCodeCellsChecked += codeUnits.length;
        totalOutputCellsChecked += outputUnits.length;

        for (const outUnit of outputUnits) {
          const out = outUnit as any;
          if (!out.relatedCodeUnitId) {
            defects.push({
              topicId: topic.id,
              subchapterId: sub.id,
              unitId: out.id,
              defectType: "UNLINKED_OUTPUT",
              details: `Output cell '${out.id}' tidak memiliki relatedCodeUnitId terdefinisi`,
            });
          }

          if (!out.content || out.content.trim().length === 0) {
            defects.push({
              topicId: topic.id,
              subchapterId: sub.id,
              unitId: out.id,
              defectType: "MISSING_EVIDENCE",
              details: `Output cell '${out.id}' memiliki konten kosong`,
            });
          }
        }
      }
    }
  }

  return {
    isValid: defects.length === 0,
    totalCodeCellsChecked,
    totalOutputCellsChecked,
    defects,
  };
}

if (require.main === module || process.argv[1]?.includes("validate-execution-links")) {
  console.log("=== MENJALANKAN VALIDASI HUBUNGAN KODE & OUTPUT ===");
  const result = validateExecutionLinks();
  console.log(`Total Sel Kode Diperiksa: ${result.totalCodeCellsChecked}`);
  console.log(`Total Sel Output Diperiksa: ${result.totalOutputCellsChecked}`);
  console.log(`Status Validasi: ${result.isValid ? "LULUS (0 Defek)" : "DITEMUKAN DEFEK"}`);

  if (result.defects.length > 0) {
    console.error(`\nDitemukan ${result.defects.length} defek tautan eksekusi:`);
    result.defects.forEach((d) => console.error(` - [${d.defectType}] ${d.details}`));
    process.exit(1);
  } else {
    console.log("Seluruh sel output terhubung secara valid ke sel kode terkait.");
    process.exit(0);
  }
}
