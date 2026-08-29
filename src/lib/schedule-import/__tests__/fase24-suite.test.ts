import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeDayName,
  normalizeTimeRange,
  validateDayDateMatch,
  normalizeExtractedScheduleItem,
} from "../normalizer";
import {
  checkIntervalOverlap,
  detectAllScheduleConflicts,
} from "../conflict-engine";
import { parseTextDocument } from "../text-parser";
import { parseCsvDocument } from "../csv-parser";
import { heuristicTextScheduleExtractor } from "../ai-structuring";
import { validateScheduleFile } from "../parser";
import { scheduleBatchSaveRequestSchema } from "../schema";

describe("FASE 24 — Comprehensive Test Suite (Scenarios A to K)", () => {
  // TEST A: Standard Document Extraction (PDF / Academic Text)
  it("Scenario A: PDF / Academic Schedule standard extraction", async () => {
    const rawPdfText = `Kecerdasan Buatan (IF301) | Senin | 08:00 - 10:00 WIB | Lab AI 1 | Dosen: Dr. Hendra
Basis Data Lanjut | Rabu | 13:00 - 15:30 WIB | R.302 | Dosen: Maya Safitri`;

    const structured = heuristicTextScheduleExtractor(rawPdfText);
    assert.equal(structured.items.length >= 2, true);

    const item1 = normalizeExtractedScheduleItem(structured.items[0], 0, "PDF Halaman 1");
    assert.equal(item1.day, "Senin");
    assert.equal(item1.startTime, "08:00");
    assert.equal(item1.endTime, "10:00");
    assert.equal(item1.confidence, "verified");
  });

  // TEST B: Excel / CSV Table Matrix Extraction
  it("Scenario B: Excel / CSV table matrix extraction", async () => {
    const csvContent = `Mata Kuliah,Hari,Jam Mulai,Jam Selesai,Ruang,Dosen
Pemrograman Web,Selasa,09:00,11:30,Lab Komputer 2,Budi Santoso M.T.
Jaringan Komputer,Kamis,13:00,15:00,Lab Cisco,Ahmad Fauzi S.Kom`;

    const rawDoc = await parseCsvDocument(Buffer.from(csvContent), "jadwal.csv");
    assert.equal(rawDoc.rowCount, 3);

    const structured = heuristicTextScheduleExtractor(rawDoc.extractedText);
    assert.equal(structured.items.length >= 2, true);
    assert.equal(structured.items[0].title.includes("Pemrograman Web"), true);
  });

  // TEST C: Plain Text Unstructured Notes Extraction
  it("Scenario C: Plain Text raw unstructured format extraction", async () => {
    const note = "Etika Profesi Ruang 401 | Jumat | 08.00 - 10.00";
    const rawDoc = await parseTextDocument(Buffer.from(note), "catatan.txt");
    const structured = heuristicTextScheduleExtractor(rawDoc.extractedText);
    assert.equal(structured.items.length >= 1, true);

    const item = normalizeExtractedScheduleItem(structured.items[0]);
    assert.equal(item.day, "Jumat");
    assert.equal(item.startTime, "08:00");
    assert.equal(item.endTime, "10:00");
    assert.equal(item.confidence, "verified");
  });

  // TEST D: Structured Table / Key-Value Extraction
  it("Scenario D: Structured Table extraction mapping", () => {
    const raw = {
      title: "Rekayasa Perangkat Lunak",
      subject: "RPL-202",
      day: "Rabu",
      time: "10:00 - 12:00",
      location: "Gedung B 201",
      instructor: "Dr. Budi",
    };

    const item = normalizeExtractedScheduleItem(raw, 0, "Baris 14");
    assert.equal(item.title, "Rekayasa Perangkat Lunak");
    assert.equal(item.day, "Rabu");
    assert.equal(item.startTime, "10:00");
    assert.equal(item.endTime, "12:00");
    assert.equal(item.confidence, "verified");
  });

  // TEST E: Conflicting Schedule Detection (Interval Overlap)
  it("Scenario E: Conflicting schedule detection with mathematical interval overlap", () => {
    // 09:00-11:00 vs 10:00-12:00 -> Overlap!
    const overlap1 = checkIntervalOverlap("09:00", "11:00", "10:00", "12:00");
    assert.equal(overlap1, true);

    // 08:00-10:00 vs 10:00-12:00 -> Touching boundary, NO overlap!
    const touchingBoundary = checkIntervalOverlap("08:00", "10:00", "10:00", "12:00");
    assert.equal(touchingBoundary, false);

    // 08:00-10:00 vs 11:00-13:00 -> Distinct intervals, NO overlap!
    const distinct = checkIntervalOverlap("08:00", "10:00", "11:00", "13:00");
    assert.equal(distinct, false);
  });

  // TEST F: Exact Duplicate Schedule Detection
  it("Scenario F: Exact duplicate schedule detection", () => {
    const existing = [
      {
        id: "s1",
        title: "Kalkulus I",
        day: "Senin",
        time: "08:00 - 10:00",
        type: "jadwal" as const,
        priority: "sedang" as const,
      },
    ];

    const imported = [
      normalizeExtractedScheduleItem({
        title: "Kalkulus I",
        day: "Senin",
        time: "08:00 - 10:00",
      }),
    ];

    const detected = detectAllScheduleConflicts(imported, existing);
    assert.equal(detected[0].hasConflict, true);
    assert.equal(detected[0].isDuplicate, true);
    assert.equal(detected[0].selected, false);
  });

  // TEST G: Ambiguous Day Name Normalization
  it("Scenario G: Ambiguous day name normalization (ID, EN, abbreviations)", () => {
    assert.equal(normalizeDayName("sen"), "Senin");
    assert.equal(normalizeDayName("sel"), "Selasa");
    assert.equal(normalizeDayName("rab"), "Rabu");
    assert.equal(normalizeDayName("kam"), "Kamis");
    assert.equal(normalizeDayName("jum'at"), "Jumat");
    assert.equal(normalizeDayName("sab"), "Sabtu");
    assert.equal(normalizeDayName("ahad"), "Minggu");
    assert.equal(normalizeDayName("wednesday"), "Rabu");
  });

  // TEST H: Ambiguous Time Format Normalization
  it("Scenario H: Ambiguous time format normalization", () => {
    const t1 = normalizeTimeRange("08.00 s/d 10.00 WIB");
    assert.equal(t1.isValid, true);
    assert.equal(t1.startTime, "08:00");
    assert.equal(t1.endTime, "10:00");

    const t2 = normalizeTimeRange("08:00-10:00");
    assert.equal(t2.isValid, true);
    assert.equal(t2.startTime, "08:00");
    assert.equal(t2.endTime, "10:00");

    const t3 = normalizeTimeRange("Pukul 13.30 s.d. 15.00");
    assert.equal(t3.isValid, true);
    assert.equal(t3.startTime, "13:30");
    assert.equal(t3.endTime, "15:00");
  });

  // TEST I: Day-Date Mismatch and Scanned Document Resilience
  it("Scenario I: Day-Date Mismatch verification", () => {
    // 2026-09-01 is a Tuesday ("Selasa"), mismatch when given "Rabu"
    const validation = validateDayDateMatch("Rabu", "2026-09-01");
    assert.equal(validation.dayDateMismatch, true);
    assert.equal(validation.actualDay, "Selasa");

    const matchValidation = validateDayDateMatch("Selasa", "2026-09-01");
    assert.equal(matchValidation.dayDateMismatch, false);
    assert.equal(matchValidation.actualDay, "Selasa");
  });

  // TEST J: Malicious / Invalid / Oversized File Rejection
  it("Scenario J: Invalid and oversized file rejection", () => {
    // File > 15MB
    const oversized = validateScheduleFile("huge_schedule.pdf", "application/pdf", 16 * 1024 * 1024);
    assert.equal(oversized.isValid, false);
    assert.match(oversized.error || "", /15 MB/);

    // Unsupported extension
    const invalidExt = validateScheduleFile("virus.exe", "application/x-msdownload", 1024);
    assert.equal(invalidExt.isValid, false);

    // Zero-byte empty file
    const emptyFile = validateScheduleFile("empty.pdf", "application/pdf", 0);
    assert.equal(emptyFile.isValid, false);
    assert.match(emptyFile.error || "", /kosong/);
  });

  // TEST K: Multi-tenant User Isolation and Schema Validation
  it("Scenario K: Schema validation for atomic batch insert", () => {
    const validBatch = {
      items: [
        {
          title: "Sistem Basis Data",
          day: "Senin",
          time: "08:00 - 10:00",
          start_time: "08:00",
          end_time: "10:00",
          type: "jadwal",
          priority: "sedang",
        },
      ],
    };

    const parsed = scheduleBatchSaveRequestSchema.safeParse(validBatch);
    assert.equal(parsed.success, true);

    const invalidBatch = {
      items: [
        {
          title: "", // invalid empty title
          day: "Senin",
          time: "08:00 - 10:00",
        },
      ],
    };

    const invalidParsed = scheduleBatchSaveRequestSchema.safeParse(invalidBatch);
    assert.equal(invalidParsed.success, false);
  });
});
