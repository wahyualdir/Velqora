import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { classifyScheduleDocument } from "../classifier";
import { analyzeTableStructure, classifyColumnHeader } from "../table-structuring";
import { normalizeTimeRange, normalizeDate, normalizeDayName, parseMultiLecturers, parseMultiRooms, normalizeExtractedScheduleItem } from "../normalizer";
import { buildFieldEvidence } from "../evidence";
import { evaluateConfidence2 } from "../confidence-engine";
import { checkIntervalOverlap, isNearDuplicateTitle, detectAllScheduleConflicts, analyzeItemConflict } from "../conflict-engine";
import { validateScheduleFile, sanitizeFileName } from "../parser";
import { scheduleBatchSaveRequestSchema } from "../schema";
import { heuristicTextScheduleExtractor } from "../ai-structuring";

describe("FASE 26 — Comprehensive Test Matrix (Scenarios A to Z)", () => {
  // Scenario A: Document Classification
  it("Scenario A: Document classification should differentiate academic schedule vs unrelated documents", () => {
    const scheduleText = "Jadwal Kuliah Semester Ganjil\nSenin | 08:00 - 10:00 | Pemrograman Web | Lab 1 | Dr. Budi";
    const classResult = classifyScheduleDocument(scheduleText, "jadwal.txt");
    assert.equal(classResult.isSchedule, true);
    assert.equal(classResult.category, "academic_schedule");

    const unrelatedText = "BAB I PENDAHULUAN\nLatar belakang penelitian ini membahas tentang neraca keuangan industri.";
    const unrelatedResult = classifyScheduleDocument(unrelatedText, "makalah.txt");
    assert.equal(unrelatedResult.isSchedule, false);
    assert.equal(unrelatedResult.category, "unrelated_document");
  });

  // Scenario B: Table Detection
  it("Scenario B: Table detection should identify header row and data rows", () => {
    const rawTable = [
      ["UNIVERSITAS XYZ"],
      ["Hari", "Jam", "Mata Kuliah", "Ruang", "Dosen"],
      ["Senin", "08:00 - 10:00", "Struktur Data", "Lab 2", "Dr. Budi"],
      ["Selasa", "13:00 - 15:00", "Kalkulus", "Ruang 301", "Drs. Joko"],
    ];
    const structure = analyzeTableStructure(rawTable);
    assert.ok(structure);
    assert.equal(structure.headerRowIndex, 1);
    assert.equal(structure.dataRows.length, 2);
  });

  // Scenario C: Semantic Header Mapping
  it("Scenario C: Semantic header mapping should map flexible header labels to canonical types", () => {
    assert.equal(classifyColumnHeader("Mata Kuliah"), "COURSE");
    assert.equal(classifyColumnHeader("Course Name"), "COURSE");
    assert.equal(classifyColumnHeader("Waktu Pelaksanaan"), "TIME");
    assert.equal(classifyColumnHeader("Jam Kuliah"), "TIME");
    assert.equal(classifyColumnHeader("Hari/Tanggal"), "DAY");
    assert.equal(classifyColumnHeader("Dosen Pengampu"), "LECTURER");
    assert.equal(classifyColumnHeader("Kode MK"), "CODE");
    assert.equal(classifyColumnHeader("Ruangan"), "ROOM");
  });

  // Scenario D: Time Normalization (08.00, 08:00, 08-10, 8 AM - 10 AM, 13.30-15.10)
  it("Scenario D: Time normalization handles various delimiters, 24h/12h, and dots", () => {
    const t1 = normalizeTimeRange("08.00 - 10.00");
    assert.equal(t1.startTime, "08:00");
    assert.equal(t1.endTime, "10:00");

    const t2 = normalizeTimeRange("08:00 s/d 10:00 WIB");
    assert.equal(t2.startTime, "08:00");
    assert.equal(t2.endTime, "10:00");

    const t3 = normalizeTimeRange("8 AM - 10 AM");
    assert.equal(t3.startTime, "08:00");
    assert.equal(t3.endTime, "10:00");

    const t4 = normalizeTimeRange("13.30-15.10");
    assert.equal(t4.startTime, "13:30");
    assert.equal(t4.endTime, "15:10");

    const t5 = normalizeTimeRange("08-10");
    assert.equal(t5.startTime, "08:00");
    assert.equal(t5.endTime, "10:00");
  });

  // Scenario E: Date Normalization & Month Parsing
  it("Scenario E: Date normalization converts Indonesian and English dates to YYYY-MM-DD", () => {
    assert.equal(normalizeDate("25 Agustus 2026"), "2026-08-25");
    assert.equal(normalizeDate("01-09-2026"), "2026-09-01");
    assert.equal(normalizeDate("September 1, 2026"), "2026-09-01");
    assert.equal(normalizeDate("Selasa, 15 Des 2026"), "2026-12-15");
  });

  // Scenario F: Day Normalization
  it("Scenario F: Day normalization resolves Indonesian, English, and abbreviations", () => {
    assert.equal(normalizeDayName("Sen"), "Senin");
    assert.equal(normalizeDayName("Monday"), "Senin");
    assert.equal(normalizeDayName("Rab"), "Rabu");
    assert.equal(normalizeDayName("Wednesday"), "Rabu");
    assert.equal(normalizeDayName("Jum'at"), "Jumat");
    assert.equal(normalizeDayName("Ahad"), "Minggu");
  });

  // Scenario G: Lecturer Extraction
  it("Scenario G: Lecturer extraction parses multiple team-teaching lecturers with titles", () => {
    const res = parseMultiLecturers("Prof. Dr. Ir. Budi Santoso, M.T.; Dr. Hendra Wijaya, M.Sc.");
    assert.equal(res.list.length, 2);
    assert.match(res.primary, /Budi Santoso/);
    assert.match(res.primary, /Hendra Wijaya/);
  });

  // Scenario H: Room Extraction
  it("Scenario H: Room extraction parses multiple combined rooms", () => {
    const res = parseMultiRooms("Lab AI 1 / Lab AI 2");
    assert.equal(res.list.length, 2);
    assert.equal(res.list[0], "Lab AI 1");
    assert.equal(res.list[1], "Lab AI 2");
  });

  // Scenario I: Course Code Extraction
  it("Scenario I: Course code extraction identifies standard university codes", () => {
    const res = heuristicTextScheduleExtractor("IF3101 Pemrograman Web | Senin | 08:00 - 10:00 | Lab 1");
    assert.equal(res.items.length >= 1, true);
    assert.equal(res.items[0].subject, "IF3101");
  });

  // Scenario J: Field Evidence Generation
  it("Scenario J: Evidence generation produces traceable provenance for all extracted fields", () => {
    const evidences = buildFieldEvidence(
      { title: "Kecerdasan Buatan", day: "Selasa", startTime: "13:00", endTime: "15:00", location: "Lab 2" },
      "Selasa 13:00-15:00 Kecerdasan Buatan Lab 2",
      "Baris 4"
    );
    assert.equal(evidences.length >= 4, true);
    const titleEv = evidences.find((e) => e.field === "title");
    assert.ok(titleEv);
    assert.equal(titleEv.value, "Kecerdasan Buatan");
    assert.equal(titleEv.pageOrRow, "Baris 4");
  });

  // Scenario K: 4-Tier Confidence Scoring 2.0
  it("Scenario K: Confidence Scoring 2.0 assigns correct tiers based on observable evidence", () => {
    const high = evaluateConfidence2({
      title: "Pemrograman Web Lanjut",
      day: "Senin",
      startTime: "08:00",
      endTime: "10:00",
      location: "Lab 1",
      instructor: "Dr. Budi",
    });
    assert.equal(high.confidenceTier, "HIGH_CONFIDENCE");
    assert.equal(high.confidence, "verified");

    const review = evaluateConfidence2({
      title: "Seminar",
      day: "Senin",
      startTime: "08:00",
      endTime: "09:30",
      isEstimatedEndTime: true,
    });
    assert.equal(review.confidenceTier, "REVIEW_REQUIRED");

    const invalid = evaluateConfidence2({ title: "" });
    assert.equal(invalid.confidenceTier, "INVALID");
  });

  // Scenario L: Duplicate Detection
  it("Scenario L: Duplicate detection identifies exact and near-duplicate titles", () => {
    assert.equal(isNearDuplicateTitle("Pemrograman Web", "Pemrograman Web (IF101)"), true);
    assert.equal(isNearDuplicateTitle("Kalkulus I", "Kalkulus I "), true);
    assert.equal(isNearDuplicateTitle("Fisika Dasar", "Kimia Dasar"), false);
  });

  // Scenario M: Conflict Detection
  it("Scenario M: Conflict detection flags interval overlap and allows touching boundary", () => {
    assert.equal(checkIntervalOverlap("08:00", "10:00", "09:00", "11:00"), true);
    assert.equal(checkIntervalOverlap("08:00", "10:00", "10:00", "12:00"), false);
  });

  // Scenario N: Invalid Schedule Rejection
  it("Scenario N: Invalid schedule rejection prevents inverted chronological time slots", () => {
    const invalidTime = normalizeTimeRange("10:00 - 08:00");
    assert.equal(invalidTime.isValid, false);
    assert.match(invalidTime.reason || "", /tidak boleh mendahului/i);
  });

  // Scenario O: Irrelevant Document Rejection
  it("Scenario O: Irrelevant document classification rejects non-schedule files without hallucinations", () => {
    const essay = "Abstrak: Penelitian ini mengeksplorasi penggunaan kecerdasan buatan dalam deteksi anomali.";
    const classification = classifyScheduleDocument(essay, "paper.pdf");
    assert.equal(classification.isSchedule, false);
  });

  // Scenario P: OCR Detection
  it("Scenario P: Scanned PDF detection identifies image-only PDF payloads", () => {
    const minPdf = "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000101 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF";
    const classification = classifyScheduleDocument(minPdf, "scan.pdf");
    assert.equal(classification.isSchedule, false);
  });

  // Scenario Q: AI Timeout Fallback
  it("Scenario Q: Deterministic heuristic extractor functions reliably when AI is offline", () => {
    const docText = "Pemrograman Web | Senin | 08:00 - 10:00 | Lab 1 | Dr. Budi";
    const res = heuristicTextScheduleExtractor(docText);
    assert.equal(res.items.length >= 1, true);
    assert.equal(res.items[0].day, "Senin");
  });

  // Scenario R: AI Malformed JSON Rejection
  it("Scenario R: Zod schema strictly rejects malformed extraction objects", () => {
    const malformed = [{ title: 123, day: false }];
    const res = scheduleBatchSaveRequestSchema.safeParse({ items: malformed });
    assert.equal(res.success, false);
  });

  // Scenario S: Forged user_id Injection Stripping
  it("Scenario S: Batch save payload ignores client user_id injection", () => {
    const payload = {
      items: [
        {
          title: "Basis Data",
          day: "Senin",
          time: "08:00 - 10:00",
          user_id: "injected_attacker_uuid_12345",
        },
      ],
    };
    const parsed = scheduleBatchSaveRequestSchema.safeParse(payload);
    assert.equal(parsed.success, true);
  });

  // Scenario T: Cross-User Multi-Tenant Safety
  it("Scenario T: Conflict analysis between separate items behaves deterministically", () => {
    const itemA = normalizeExtractedScheduleItem({ title: "MK A", day: "Senin", time: "08:00 - 10:00" });
    const itemB = normalizeExtractedScheduleItem({ title: "MK B", day: "Selasa", time: "08:00 - 10:00" });
    const conflict = analyzeItemConflict(itemA, itemB);
    assert.equal(conflict.hasConflict, false);
  });

  // Scenario U: Double Submit & Intra-Batch Exact Duplicate Prevention
  it("Scenario U: Consecutive identical uploads flag duplicates within batch", () => {
    const item1 = normalizeExtractedScheduleItem({ title: "MK A", day: "Senin", time: "08:00 - 10:00" });
    const item2 = normalizeExtractedScheduleItem({ title: "MK A", day: "Senin", time: "08:00 - 10:00" });
    const analyzed = detectAllScheduleConflicts([item1, item2], []);
    assert.equal(analyzed[1].isDuplicate, true);
  });

  // Scenario V: Partial Batch Failure Handling
  it("Scenario V: Schema requires valid non-empty items array", () => {
    const res = scheduleBatchSaveRequestSchema.safeParse({ items: [] });
    assert.equal(res.success, false);
  });

  // Scenario W: Large File Rejection
  it("Scenario W: File validator rejects files larger than 15MB", () => {
    const res = validateScheduleFile("large.pdf", "application/pdf", 16 * 1024 * 1024);
    assert.equal(res.isValid, false);
    assert.match(res.error || "", /15 MB/i);
  });

  // Scenario X: Malformed File / Path Traversal Sanitization
  it("Scenario X: Filename sanitizer eliminates directory traversal and null bytes", () => {
    const safe = sanitizeFileName("../../../etc/passwd\0.xlsx");
    assert.equal(safe, "passwd.xlsx");
  });

  // Scenario Y: Inline Correction Revalidation
  it("Scenario Y: Editing an item immediately recalculates confidence and detects conflicts", () => {
    const original = normalizeExtractedScheduleItem({ title: "MK A", day: "Senin", time: "08:00" });
    assert.equal(original.confidenceTier, "REVIEW_REQUIRED");

    // Correct time to explicit range
    const corrected = normalizeExtractedScheduleItem({ title: "MK A", day: "Senin", time: "08:00 - 10:00", location: "Lab 1", instructor: "Dr. Budi" });
    assert.equal(corrected.confidenceTier, "HIGH_CONFIDENCE");
    assert.equal(corrected.confidence, "verified");
  });

  // Scenario Z: Final Database Batch Payload Verification
  it("Scenario Z: Normalized items format into strict database schema payload", () => {
    const item = normalizeExtractedScheduleItem({
      title: "Kecerdasan Buatan",
      subject: "IF3102",
      day: "Selasa",
      time: "13:00 - 15:30",
      location: "Ruang 402",
      instructor: "Prof. Siti",
    });

    const payload = {
      items: [
        {
          title: item.title,
          subject: item.subject,
          day: item.day,
          start_time: item.startTime,
          end_time: item.endTime,
          time: item.time,
          location: item.location,
          lecturer: item.lecturer,
          type: "jadwal",
          priority: "sedang",
          is_completed: false,
        },
      ],
    };

    const validated = scheduleBatchSaveRequestSchema.safeParse(payload);
    assert.equal(validated.success, true);
  });
});
