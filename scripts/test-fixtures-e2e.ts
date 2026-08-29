import fs from "fs";
import path from "path";
import assert from "node:assert/strict";
import { processScheduleDocumentImport } from "../src/lib/schedule-import";

async function runE2ETests() {
  console.log("=== RUNNING END-TO-END FIXTURE EXTRACTION TESTS ===");
  const fixturesDir = path.join(__dirname, "../fixtures");

  const testCases = [
    {
      file: "jadwal_kuliah.txt",
      mime: "text/plain",
      expectedMinItems: 5,
      expectedSubject: "Rekayasa Perangkat Lunak",
    },
    {
      file: "jadwal_semester.csv",
      mime: "text/csv",
      expectedMinItems: 4,
      expectedSubject: "Kecerdasan Buatan",
    },
    {
      file: "jadwal_komputer.xlsx",
      mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      expectedMinItems: 4,
      expectedSubject: "Pengolahan Citra Digital",
    },
    {
      file: "jadwal_akademik.docx",
      mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      expectedMinItems: 3,
      expectedSubject: "Pemrograman Berorientasi Objek",
    },
    {
      file: "jadwal_kuliah.pdf",
      mime: "application/pdf",
      expectedMinItems: 4,
      expectedSubject: "Kecerdasan Komputasional",
    },
  ];

  for (const tc of testCases) {
    const filePath = path.join(fixturesDir, tc.file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Fixture not found: ${tc.file}`);
    }

    const buffer = fs.readFileSync(filePath);
    console.log(`\n Testing File: ${tc.file} (${buffer.length} bytes)...`);

    const result = await processScheduleDocumentImport(buffer, tc.file, tc.mime, []);

    console.log(`   - Success: ${result.success}`);
    console.log(`   - Total items found: ${result.totalFound}`);
    console.log(`   - Verified items: ${result.verifiedCount}`);
    console.log(`   - Conflicts: ${result.conflictCount}`);

    assert.equal(result.success, true, `Processing ${tc.file} should succeed`);
    assert.ok(result.totalFound >= tc.expectedMinItems, `Should find at least ${tc.expectedMinItems} items in ${tc.file}`);
    assert.ok(result.verifiedCount > 0, `Should have verified items in ${tc.file}`);

    // Print sample extracted item
    const sample = result.items[0];
    console.log(`   - Sample Item: [${sample.day}] ${sample.time} - "${sample.title}" (Trace: ${sample.sourceTrace}, Conf: ${sample.confidence})`);
  }

  console.log("\n ALL 5/5 FIXTURE FORMATS PASSED END-TO-END EXTRACTION SUCCESSFULLY!\n");
}

runE2ETests().catch((err) => {
  console.error("E2E Test Failed:", err);
  process.exit(1);
});
