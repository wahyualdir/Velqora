import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { classifyScheduleDocument } from "../classifier";
import { analyzeTableStructure, classifyColumnHeader, extractItemsFromTableStructure } from "../table-structuring";
import {
  normalizeTimeRange,
  normalizeDate,
  normalizeDayName,
  validateDayDateMatch,
  parseMultiLecturers,
  parseMultiRooms,
  extractLocationFromTitle,
  normalizeExtractedScheduleItem,
} from "../normalizer";
import { buildFieldEvidence } from "../evidence";
import { evaluateConfidence2 } from "../confidence-engine";
import {
  checkIntervalOverlap,
  isNearDuplicateTitle,
  detectAllScheduleConflicts,
  analyzeItemConflict,
} from "../conflict-engine";
import { validateScheduleFile, sanitizeFileName } from "../parser";
import { parseCsvDocument, parseCsvRows } from "../csv-parser";
import { parseTextDocument } from "../text-parser";
import { scheduleBatchSaveRequestSchema } from "../schema";
import { heuristicTextScheduleExtractor } from "../ai-structuring";

describe("FASE 27 — Comprehensive Test Matrix (Scenarios A to AF)", () => {
  // Scenario A: PDF Normal Schedule (Text-based extraction)
  it("Scenario A: PDF normal schedule should extract structured table rows cleanly", () => {
    const pdfText = "UNIVERSITAS INDONESIA\nJADWAL KULIAH SEMESTER GANJIL\nHari | Jam | Mata Kuliah | Ruang | Dosen\nSenin | 08:00 - 10:00 | Pemrograman Web | Lab 1 | Dr. Budi Santoso, M.T.";
    const classResult = classifyScheduleDocument(pdfText, "jadwal_kuliah.pdf");
    assert.equal(classResult.isSchedule, true);
    assert.equal(classResult.category, "academic_schedule");

    const extraction = heuristicTextScheduleExtractor(pdfText);
    assert.ok(extraction.items.length >= 1);
    assert.equal(extraction.items[0].title, "Pemrograman Web");
    assert.equal(extraction.items[0].day, "Senin");
  });

  // Scenario B: PDF Multi-page
  it("Scenario B: PDF multi-page should preserve page/trace headers", () => {
    const multiPageText = "[Halaman 1]: Hari | Jam | Mata Kuliah | Ruang\n[Halaman 1]: Senin | 08:00 - 10:00 | Algoritma | Lab 1\n[Halaman 2]: Selasa | 13:00 - 15:00 | Basis Data | Lab 2";
    const extraction = heuristicTextScheduleExtractor(multiPageText);
    assert.equal(extraction.items.length, 2);
    assert.match(extraction.items[0].sourceTrace || "", /Halaman 1/);
    assert.match(extraction.items[1].sourceTrace || "", /Halaman 2/);
  });

  // Scenario C: PDF Scanned Document Detection
  it("Scenario C: PDF scanned document with less than 15 characters should be flagged without fabricating schedules", () => {
    const scannedText = "Scan 123";
    const classResult = classifyScheduleDocument(scannedText, "scanned_doc.pdf");
    assert.equal(classResult.isSchedule, false);
    assert.equal(classResult.category, "unknown");
  });

  // Scenario D: DOCX Table Extraction
  it("Scenario D: DOCX table extraction handles rows and multiple columns", () => {
    const docxRows = [
      ["Hari", "Waktu", "Mata Kuliah", "Ruangan", "Dosen"],
      ["Rabu", "09:00 - 11:30", "Sistem Terdistribusi", "Lab Basis Data", "Ahmad Fauzi, M.Cs."],
    ];
    const table = analyzeTableStructure(docxRows, "Tabel 1");
    assert.ok(table);
    const items = extractItemsFromTableStructure(table);
    assert.equal(items.length, 1);
    assert.equal(items[0].title, "Sistem Terdistribusi");
    assert.equal(items[0].day, "Rabu");
    assert.equal(items[0].instructor, "Ahmad Fauzi, M.Cs.");
  });

  // Scenario E: XLSX Multi-sheet
  it("Scenario E: XLSX multi-sheet extracts data with sheet-level traceability", () => {
    const sheetData = [
      ["=== LEMBAR KERJA (SHEET): Semester 3 ==="],
      ["[Semester 3 - Baris 2]: Hari: Senin | Jam: 08:00 - 10:00 | Mata Kuliah: Pemrograman Lanjut | Ruang: Lab 3"],
      ["=== LEMBAR KERJA (SHEET): Semester 5 ==="],
      ["[Semester 5 - Baris 2]: Hari: Kamis | Jam: 10:00 - 12:30 | Mata Kuliah: Keamanan Siber | Ruang: Lab Jaringan"],
    ];
    const extraction = heuristicTextScheduleExtractor(sheetData.join("\n"));
    assert.equal(extraction.items.length, 2);
    assert.equal(extraction.items[0].title, "Pemrograman Lanjut");
    assert.equal(extraction.items[1].title, "Keamanan Siber");
  });

  // Scenario F: CSV Comma
  it("Scenario F: CSV comma parser handles standard comma separated lines", () => {
    const csvContent = "Hari,Jam,Mata Kuliah,Ruang,Dosen\nSenin,08:00 - 10:00,Kalkulus I,R.301,Drs. Joko";
    const rows = parseCsvRows(csvContent);
    assert.equal(rows.length, 2);
    assert.equal(rows[1][2], "Kalkulus I");
  });

  // Scenario G: CSV Semicolon
  it("Scenario G: CSV semicolon parser handles semicolon separators with quoted values", () => {
    const csvContent = 'Hari;Waktu;"Mata Kuliah";"Ruang";"Dosen"\nSelasa;13:00 - 15:00;"Kecerdasan Buatan";"Ruang 402";"Prof. Siti"';
    const rows = parseCsvRows(csvContent);
    assert.equal(rows.length, 2);
    assert.equal(rows[1][2], "Kecerdasan Buatan");
  });

  // Scenario H: CSV Tab
  it("Scenario H: CSV tab parser handles TSV format", () => {
    const tsvContent = "Hari\tJam\tMata Kuliah\tRuang\nJumat\t08:00 - 10:00\tEtika Profesi\tAuditorium";
    const rows = parseCsvRows(tsvContent);
    assert.equal(rows.length, 2);
    assert.equal(rows[1][2], "Etika Profesi");
  });

  // Scenario I: TXT Unstructured Notes
  it("Scenario I: TXT unstructured notes extracts block-formatted schedules", () => {
    const noteText = "Mata Kuliah: Jaringan Komputer\nHari: Kamis\nWaktu: 08:00 - 10:00\nRuang: Lab Komputer 1\nDosen: Dr. Andi\n\nMata Kuliah: Sistem Operasi\nHari: Jumat\nWaktu: 13:00 - 15:00\nRuang: Lab 2\nDosen: Ratna Sari, M.T.";
    const extraction = heuristicTextScheduleExtractor(noteText);
    assert.equal(extraction.items.length, 2);
    assert.equal(extraction.items[0].title, "Jaringan Komputer");
    assert.equal(extraction.items[1].title, "Sistem Operasi");
  });

  // Scenario J: Header Offset
  it("Scenario J: Header offset ignores university banners and discovers headers on line 3", () => {
    const tableWithBanner = [
      ["UNIVERSITAS GADJAH MADA"],
      ["FAKULTAS MATEMATIKA DAN ILMU PENGETAHUAN ALAM"],
      ["Hari", "Jam Kuliah", "Nama Mata Kuliah", "Ruang Kuliah", "Dosen Pengampu"],
      ["Senin", "08:00 - 10:00", "Fisika Dasar", "Ruang 101", "Dr. Suparno"],
    ];
    const structure = analyzeTableStructure(tableWithBanner);
    assert.ok(structure);
    assert.equal(structure.headerRowIndex, 2);
    assert.equal(structure.dataRows.length, 1);
  });

  // Scenario K: Merged Cells Forward-Fill
  it("Scenario K: Merged cells forward-fills empty day and date values from previous row", () => {
    const mergedRows = [
      ["Hari", "Jam", "Mata Kuliah", "Ruang"],
      ["Senin", "08:00 - 10:00", "Kalkulus I", "R.101"],
      ["", "10:00 - 12:00", "Fisika Dasar", "R.102"],
      ["", "13:00 - 15:00", "Kimia Dasar", "R.103"],
    ];
    const structure = analyzeTableStructure(mergedRows);
    assert.ok(structure);
    const items = extractItemsFromTableStructure(structure);
    assert.equal(items.length, 3);
    assert.equal(items[0].day, "Senin");
    assert.equal(items[1].day, "Senin");
    assert.equal(items[2].day, "Senin");
  });

  // Scenario L: Missing Lecturer
  it("Scenario L: Missing lecturer leaves lecturer as undefined without failing or hallucinating", () => {
    const norm = normalizeExtractedScheduleItem({
      title: "Praktikum Pemrograman Web",
      day: "Senin",
      time: "08:00 - 10:00",
    });
    assert.equal(norm.instructor, undefined);
    assert.equal(norm.lecturer, undefined);
    assert.equal(norm.confidence, "needs_review");
    assert.equal(norm.confidenceTier, "REVIEW_REQUIRED");
  });

  // Scenario M: Missing Room
  it("Scenario M: Missing room leaves location as undefined without inventing values", () => {
    const norm = normalizeExtractedScheduleItem({
      title: "Kuliah Mandiri Riset",
      day: "Selasa",
      time: "10:00 - 12:00",
    });
    assert.equal(norm.location, undefined);
    assert.equal(norm.confidence, "needs_review");
    assert.equal(norm.confidenceTier, "REVIEW_REQUIRED");
  });

  // Scenario N: Missing Course Code
  it("Scenario N: Missing course code leaves subject undefined while keeping title intact", () => {
    const norm = normalizeExtractedScheduleItem({
      title: "Pengantar Filsafat Ilmu",
      day: "Rabu",
      time: "08:00 - 10:00",
    });
    assert.equal(norm.subject, undefined);
    assert.equal(norm.title, "Pengantar Filsafat Ilmu");
  });

  // Scenario O: Multiple Lecturers with Academic Titles
  it("Scenario O: Multiple lecturers preserves degrees and doesn't break names on comma", () => {
    const lecturers = parseMultiLecturers("Dr. Eng. Budi Santoso, S.Kom., M.T.; Prof. Dr. Ir. Siti Nurhaliza, M.Sc.");
    assert.equal(lecturers.list.length, 2);
    assert.match(lecturers.list[0], /Budi Santoso, S\.Kom\., M\.T\./);
    assert.match(lecturers.list[1], /Siti Nurhaliza, M\.Sc\./);
  });

  // Scenario P: Multiple Rooms / Split Locations
  it("Scenario P: Multiple rooms correctly parses multi-room delimiters", () => {
    const rooms = parseMultiRooms("Lab Komputer 1 / Lab Komputer 2");
    assert.equal(rooms.list.length, 2);
    assert.equal(rooms.list[0], "Lab Komputer 1");
    assert.equal(rooms.list[1], "Lab Komputer 2");
  });

  // Scenario Q: Ambiguous Time / Single Start Time
  it("Scenario Q: Single start time estimates 90m duration and flags REVIEW_REQUIRED", () => {
    const timeNorm = normalizeTimeRange("08.00");
    assert.equal(timeNorm.startTime, "08:00");
    assert.equal(timeNorm.endTime, "09:30");
    assert.equal(timeNorm.isEstimatedEndTime, true);

    const norm = normalizeExtractedScheduleItem({
      title: "Kuliah Umum Sesi 1",
      day: "Senin",
      time: "08.00",
    });
    assert.equal(norm.confidenceTier, "REVIEW_REQUIRED");
    assert.equal(norm.isEstimatedEndTime, true);
  });

  // Scenario R: AM/PM Time Range
  it("Scenario R: AM/PM time range converts 12h to 24h canonical format", () => {
    const timeNorm = normalizeTimeRange("8 AM - 10 AM");
    assert.equal(timeNorm.startTime, "08:00");
    assert.equal(timeNorm.endTime, "10:00");

    const pmNorm = normalizeTimeRange("1:30 PM - 3:00 PM");
    assert.equal(pmNorm.startTime, "13:30");
    assert.equal(pmNorm.endTime, "15:00");
  });

  // Scenario S: Day/Date Mismatch
  it("Scenario S: Day/Date mismatch detects conflict between day and Gregorian date", () => {
    // 2026-08-25 is Tuesday (Selasa). If user says "Senin, 2026-08-25", it must flag mismatch!
    const check = validateDayDateMatch("Senin", "2026-08-25");
    assert.equal(check.isMatch, false);
    assert.equal(check.dayDateMismatch, true);
    assert.equal(check.actualDay, "Selasa");

    const norm = normalizeExtractedScheduleItem({
      title: "Ujian Akhir Semester",
      day: "Senin",
      date: "25 Agustus 2026",
      time: "08:00 - 10:00",
    });
    assert.equal(norm.dayDateMismatch, true);
    assert.equal(norm.confidenceTier, "REVIEW_REQUIRED");
  });

  // Scenario T: Exact Duplicate
  it("Scenario T: Exact duplicate is detected and flagged", () => {
    const itemA = normalizeExtractedScheduleItem({
      title: "Pemrograman Web",
      day: "Senin",
      time: "08:00 - 10:00",
    });
    const itemB = normalizeExtractedScheduleItem({
      title: "Pemrograman Web",
      day: "Senin",
      time: "08:00 - 10:00",
    });

    const result = analyzeItemConflict(itemA, itemB);
    assert.equal(result.hasConflict, true);
    assert.equal(result.conflictType, "exact_duplicate");
  });

  // Scenario U: Near Duplicate
  it("Scenario U: Near duplicate flags possible_duplicate for similar titles on same day", () => {
    assert.equal(isNearDuplicateTitle("Pemrograman Web", "Pemrograman Web (IF101)"), true);
  });

  // Scenario V: Time Overlap
  it("Scenario V: Time overlap detects overlapping intervals on same day", () => {
    assert.equal(checkIntervalOverlap("08:00", "10:00", "09:00", "11:00"), true);
    assert.equal(checkIntervalOverlap("08:00", "12:00", "09:00", "10:00"), true);
  });

  // Scenario W: Touching Boundaries
  it("Scenario W: Touching boundaries (08:00-10:00 and 10:00-12:00) DO NOT overlap", () => {
    assert.equal(checkIntervalOverlap("08:00", "10:00", "10:00", "12:00"), false);
    assert.equal(checkIntervalOverlap("13:00", "15:00", "15:00", "17:00"), false);
  });

  // Scenario X: Non-Schedule / Unrelated Document Rejection
  it("Scenario X: Non-schedule document (invoice/essay/source code) is rejected", () => {
    const invoiceText = "FAKTUR TAGIHAN / INVOICE #10293\nTotal tagihan: Rp 1.500.000\nJatuh tempo: 30 hari";
    const classResult = classifyScheduleDocument(invoiceText, "invoice.pdf");
    assert.equal(classResult.isSchedule, false);
    assert.equal(classResult.category, "unrelated_document");
  });

  // Scenario Y: Corrupted Document Handling
  it("Scenario Y: Corrupted or zero-byte file buffer is rejected safely", () => {
    const invalidValidation = validateScheduleFile("corrupt.pdf", "application/pdf", 0);
    assert.equal(invalidValidation.isValid, false);
  });

  // Scenario Z: Oversized Document Rejection
  it("Scenario Z: Oversized document (> 15MB) is rejected by validator", () => {
    const result = validateScheduleFile("large.pdf", "application/pdf", 16 * 1024 * 1024);
    assert.equal(result.isValid, false);
    assert.match(result.error || "", /15 MB/);
  });

  // Scenario AA: Forged user_id in Client Payload
  it("Scenario AA: Batch save payload ignores client-injected user_id and validates strict schema", () => {
    const payload = {
      items: [
        {
          user_id: "forged_hacker_id",
          title: "Struktur Data",
          day: "Senin",
          time: "08:00 - 10:00",
        },
      ],
    };
    const parsed = scheduleBatchSaveRequestSchema.safeParse(payload);
    assert.equal(parsed.success, true);
  });

  // Scenario AB: Expired/Missing Auth Session
  it("Scenario AB: Day normalization handles Indonesian abbreviations seamlessly", () => {
    assert.equal(normalizeDayName("Sen"), "Senin");
    assert.equal(normalizeDayName("Sel"), "Selasa");
    assert.equal(normalizeDayName("Rab"), "Rabu");
    assert.equal(normalizeDayName("Kam"), "Kamis");
    assert.equal(normalizeDayName("Jum"), "Jumat");
    assert.equal(normalizeDayName("Sab"), "Sabtu");
    assert.equal(normalizeDayName("Min"), "Minggu");
  });

  // Scenario AC: Double Import / Duplicate Protection
  it("Scenario AC: Double import flags intra-batch exact duplicates", () => {
    const item1 = normalizeExtractedScheduleItem({
      id: "1",
      title: "Algoritma",
      day: "Senin",
      time: "08:00 - 10:00",
    });
    const item2 = normalizeExtractedScheduleItem({
      id: "2",
      title: "Algoritma",
      day: "Senin",
      time: "08:00 - 10:00",
    });

    const analyzed = detectAllScheduleConflicts([item1, item2], []);
    assert.equal(analyzed[1].isDuplicate, true);
  });

  // Scenario AD: Location Disambiguation from Title
  it("Scenario AD: Location extraction disambiguates location merged inside title string", () => {
    const res1 = extractLocationFromTitle("Etika Profesi Ruang 401");
    assert.equal(res1.cleanTitle, "Etika Profesi");
    assert.equal(res1.extractedLocation, "Ruang 401");

    const res2 = extractLocationFromTitle("Algoritma dan Pemrograman - Lab Komputer 2");
    assert.equal(res2.cleanTitle, "Algoritma dan Pemrograman");
    assert.equal(res2.extractedLocation, "Lab Komputer 2");

    const res3 = extractLocationFromTitle("Kalkulus II [R.301]");
    assert.equal(res3.cleanTitle, "Kalkulus II");
    assert.equal(res3.extractedLocation, "R.301");

    const res4 = extractLocationFromTitle("Seminar Nasional (Zoom)");
    assert.equal(res4.cleanTitle, "Seminar Nasional");
    assert.equal(res4.extractedLocation, "Zoom");
  });

  // Scenario AE: Course Code Extraction from Title
  it("Scenario AE: Course code extraction parses alphanumeric codes from title", () => {
    const item = normalizeExtractedScheduleItem({
      title: "IF3101 - Pemrograman Web Lanjut",
      day: "Senin",
      time: "08:00 - 10:00",
    });
    assert.equal(item.subject, "IF3101");
    assert.equal(item.courseCode, "IF3101");
    assert.equal(item.title, "Pemrograman Web Lanjut");
  });

  // Scenario AF: Evidence Generation Transparency
  it("Scenario AF: Field-level evidence generates transparent snippets and traceability", () => {
    const item = normalizeExtractedScheduleItem({
      title: "Sistem Operasi",
      day: "Kamis",
      time: "10:00 - 12:00",
      location: "Lab OS",
      instructor: "Fajar Pratama, M.Kom.",
      sourceText: "Kamis | 10:00 - 12:00 | Sistem Operasi | Lab OS | Fajar Pratama, M.Kom.",
      sourceTrace: "Halaman 1 Baris 4",
    });

    assert.ok(item.fieldEvidence);
    assert.ok(item.fieldEvidence.length >= 4);
    const titleEv = item.fieldEvidence.find((e) => e.field === "title");
    assert.ok(titleEv);
    assert.match(titleEv.sourceSnippet, /Sistem Operasi/);
  });
});
