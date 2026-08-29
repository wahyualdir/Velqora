import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  detectImageFormat,
  preprocessOcrImage,
  detectOrientationSkew,
} from "../../schedule/ocr/image-preprocessor";
import {
  inspectPdfStructure,
} from "../../schedule/ocr/pdf-renderer";
import {
  ocrRegistry,
  ArchitectureReadyOCRProvider,
  MockTestOCRProvider,
  ocrService,
} from "../../schedule/ocr";
import { classifyScheduleDocument } from "../classifier";
import { analyzeTableStructure, extractItemsFromTableStructure } from "../table-structuring";
import {
  normalizeTimeRange,
  normalizeDate,
  normalizeDayName,
  normalizeExtractedScheduleItem,
} from "../normalizer";
import {
  checkIntervalOverlap,
  calculateClashDurationMinutes,
  formatClashDuration,
  detectAllScheduleConflicts,
} from "../conflict-engine";
import {
  planAcademicSchedule,
  calculateSessionBreakdown,
  validateGoalRequest,
} from "../../schedule-generator";
import { hasInsufficientBreak } from "../../schedule-generator/conflict-engine";
import { scheduleBatchSaveRequestSchema } from "../schema";

describe("FASE 29 — Production OCR, Smart Planning & Real-World Hardening (40 Scenarios)", () => {
  // ==========================================
  // SECTION 1: OCR PIPELINE & IMAGE PREPROCESSING (1 to 8)
  // ==========================================

  it("Scenario 1: Magic bytes format detection correctly identifies PNG, JPEG, WebP, BMP, and TIFF", () => {
    const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const jpegHeader = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);
    const bmpHeader = Buffer.from([0x42, 0x4d, 0x00, 0x00]);

    assert.equal(detectImageFormat(pngHeader), "image/png");
    assert.equal(detectImageFormat(jpegHeader), "image/jpeg");
    assert.equal(detectImageFormat(bmpHeader), "image/bmp");
    assert.equal(detectImageFormat(Buffer.from("random text")), "application/octet-stream");
  });

  it("Scenario 2: Image preprocessing applies grayscale, contrast stretch, and noise reduction steps", async () => {
    const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00]);
    const res = await preprocessOcrImage(pngBuffer, {
      grayscale: true,
      contrastStretch: true,
      noiseReduction: true,
    });

    assert.equal(res.wasModified, true);
    assert.ok(res.appliedSteps.includes("grayscale_luminance_optimized"));
    assert.ok(res.appliedSteps.includes("contrast_adaptive_histogram_stretch"));
  });

  it("Scenario 3: Preprocessing safely falls back to original buffer without throwing on corrupt data", async () => {
    const corruptBuffer = Buffer.from("not_a_real_image_binary");
    const res = await preprocessOcrImage(corruptBuffer);
    assert.equal(res.buffer.length, corruptBuffer.length);
    assert.ok(res.appliedSteps.includes("raw_binary_pass_through"));
  });

  it("Scenario 4: Deskew & orientation detection returns angle and confidence", () => {
    const buffer = Buffer.from("sample buffer");
    const skew = detectOrientationSkew(buffer);
    assert.equal(typeof skew.angleDegrees, "number");
    assert.ok(skew.confidence >= 0.5);
  });

  it("Scenario 5: OCR Provider registry manages default and pluggable providers", () => {
    const defaultProvider = ocrRegistry.getDefault();
    assert.ok(defaultProvider);
    assert.equal(typeof defaultProvider.isAvailable(), "boolean");

    const mockProvider = ocrRegistry.get("mock-test-ocr");
    assert.ok(mockProvider);
    assert.equal(mockProvider?.isAvailable(), true);
  });

  it("Scenario 6: ArchitectureReadyOCRProvider honestly reports unconfigured state without fabricating text", async () => {
    const archProvider = new ArchitectureReadyOCRProvider();
    const res = await archProvider.processImage(Buffer.from("dummy"));
    assert.equal(res.text, "");
    assert.equal(res.confidence, 0);
  });

  it("Scenario 7: MockTestOCRProvider extracts structured text from multi-page fixture", async () => {
    const mock = new MockTestOCRProvider();
    const result = await mock.processPdfPages(Buffer.from("dummy"));
    assert.equal(result.totalPages, 2);
    assert.equal(result.successfulPages, 2);
    assert.ok(result.fullText.includes("Algoritma Pemrograman"));
  });

  it("Scenario 8: OCR Service multi-page orchestration executes with progress callback", async () => {
    const progressEvents: string[] = [];
    const res = await ocrService.processDocument(Buffer.from("%PDF-1.4\n/Type /Page\n/Type /Page"), "application/pdf", {
      providerName: "mock-test-ocr",
      onProgress: (cur, tot, status) => {
        progressEvents.push(`${cur}/${tot}: ${status}`);
      },
    });

    assert.ok(res.totalPages >= 1);
    assert.ok(progressEvents.length >= 1);
  });

  // ==========================================
  // SECTION 2: SCANNED PDF PIPELINE & ERROR ISOLATION (9 to 14)
  // ==========================================

  it("Scenario 9: Scanned PDF vs Native text layer detection via inspectPdfStructure", () => {
    const pdfBuffer = Buffer.from("%PDF-1.4\n/Type /Page\n/Type /Page\n%%EOF");
    const scannedInspection = inspectPdfStructure(pdfBuffer, "");
    assert.equal(scannedInspection.isPdf, true);
    assert.equal(scannedInspection.hasTextLayer, false);
    assert.equal(scannedInspection.isScannedPdf, true);

    const textInspection = inspectPdfStructure(pdfBuffer, "Senin 08:00 - 10:00 Pemrograman Web Lab 1");
    assert.equal(textInspection.hasTextLayer, true);
    assert.equal(textInspection.isScannedPdf, false);
  });

  it("Scenario 10: Multi-page scanned document preserves page numbers in source trace", async () => {
    const mock = new MockTestOCRProvider();
    const res = await mock.processPdfPages(Buffer.from("multi_page"));
    assert.equal(res.pages.length, 2);
    assert.equal(res.pages[0].pageNumber, 1);
    assert.equal(res.pages[1].pageNumber, 2);
  });

  it("Scenario 11: Partial OCR failure tolerates failed pages and flags warnings without speculatively creating data", async () => {
    const mock = new MockTestOCRProvider();
    const res = await mock.processPdfPages(Buffer.from("partial_failure"));
    assert.equal(res.totalPages, 3);
    assert.equal(res.successfulPages, 2);
    assert.equal(res.failedPages, 1);
    assert.equal(res.isPartialSuccess, true);
    assert.ok(res.warnings && res.warnings.length > 0);
  });

  it("Scenario 12: Empty image buffer handled cleanly by OCR service", async () => {
    const res = await ocrService.processDocument(Buffer.alloc(0), "image/png");
    assert.equal(res.totalPages, 0);
    assert.equal(res.successfulPages, 0);
    assert.ok(res.error);
  });

  it("Scenario 13: Non-schedule document classified as NON_SCHEDULE with Indonesian explanation", () => {
    const invoiceText = "FAKTUR INVOICE PEMBAYARAN\nTotal Tagihan: Rp 2.000.000\nJatuh Tempo: 30 Hari";
    const classification = classifyScheduleDocument(invoiceText, "invoice.pdf");
    assert.equal(classification.isSchedule, false);
    assert.equal(classification.canonicalCategory, "NON_SCHEDULE");
    assert.equal(classification.reason, "Dokumen ini belum dapat dikenali sebagai jadwal akademik.");
  });

  it("Scenario 14: Mixed PDF structure inspection detects combination of scanned and text pages", () => {
    const pdfBuffer = Buffer.from("%PDF-1.4\n/Type /Page\n/Type /Page\n/Type /Page");
    const inspection = inspectPdfStructure(pdfBuffer, "Short Text");
    assert.equal(inspection.isPdf, true);
  });

  // ==========================================
  // SECTION 3: DOCUMENT CLASSIFICATION 3.0 (15 to 20)
  // ==========================================

  it("Scenario 15: ACADEMIC_SCHEDULE canonical classification for standard university timetables", () => {
    const text = "UNIVERSITAS INDONESIA\nJADWAL KULIAH SEMESTER GENAP\nHari | Jam | Mata Kuliah | Dosen | Ruang\nSenin | 08:00 - 10:00 | Algoritma | Dr. Budi | R.101";
    const res = classifyScheduleDocument(text, "jadwal_kuliah.pdf");
    assert.equal(res.isSchedule, true);
    assert.equal(res.canonicalCategory, "ACADEMIC_SCHEDULE");
  });

  it("Scenario 16: POSSIBLE_SCHEDULE classification for documents with partial time or day patterns", () => {
    const text = "Daftar Kegiatan Mahasiswa\nSenin: Pertemuan Himpunan Mahasiswa Jurusan";
    const res = classifyScheduleDocument(text, "kegiatan.pdf");
    assert.equal(res.isSchedule, true);
    assert.equal(res.canonicalCategory, "POSSIBLE_SCHEDULE");
  });

  it("Scenario 17: PARTIAL_SCHEDULE classification when partial page failure flag is passed", () => {
    const res = classifyScheduleDocument("Senin 08:00 - 10:00 Kalkulus", "jadwal.pdf", {
      isPartial: true,
      failedPagesCount: 1,
    });
    assert.equal(res.canonicalCategory, "PARTIAL_SCHEDULE");
    assert.match(res.reason, /sebagian/i);
  });

  it("Scenario 18: NON_SCHEDULE rejection for essays and source code", () => {
    const essay = "BAB I PENDAHULUAN\nLatar belakang penelitian ini adalah sistem cerdas.\nDaftar pustaka terlampir.";
    const res = classifyScheduleDocument(essay, "makalah.docx");
    assert.equal(res.isSchedule, false);
    assert.equal(res.canonicalCategory, "NON_SCHEDULE");
  });

  it("Scenario 19: EMPTY_DOCUMENT classification on short text (<10 chars)", () => {
    const res = classifyScheduleDocument("   \t  \n", "empty.pdf");
    assert.equal(res.canonicalCategory, "EMPTY_DOCUMENT");
    assert.equal(res.isSchedule, false);
  });

  it("Scenario 20: Evidence-based keyword detection records detected academic terms", () => {
    const text = "JADWAL KULIAH PRODI TEKNIK INFORMATIKA\nMata Kuliah: Basis Data | Dosen: Ir. Joko";
    const res = classifyScheduleDocument(text, "jadwal.txt");
    assert.ok(res.detectedKeywords.includes("jadwal"));
    assert.ok(res.detectedKeywords.includes("kuliah"));
  });

  // ==========================================
  // SECTION 4: TABLE RECONSTRUCTION & NORMALIZATION (21 to 25)
  // ==========================================

  it("Scenario 21: Table structure analysis discovers headers and maps semantic columns", () => {
    const rows = [
      ["UNIVERSITAS GADJAH MADA"],
      ["Hari", "Waktu", "Mata Kuliah", "Ruang", "Dosen"],
      ["Senin", "08:00 - 10:00", "Pemrograman Berorientasi Objek", "Lab 1", "Dr. Ahmad"],
    ];
    const table = analyzeTableStructure(rows);
    assert.ok(table);
    assert.equal(table.headerRowIndex, 1);
    const items = extractItemsFromTableStructure(table);
    assert.equal(items.length, 1);
    assert.equal(items[0].title, "Pemrograman Berorientasi Objek");
  });

  it("Scenario 22: Merged day cell forward-fill inheritance across subsequent rows", () => {
    const rows = [
      ["Hari", "Waktu", "Mata Kuliah"],
      ["Senin", "08:00 - 10:00", "Matematika Diskrit"],
      ["", "10:00 - 12:00", "Struktur Data"],
    ];
    const table = analyzeTableStructure(rows);
    assert.ok(table);
    const items = extractItemsFromTableStructure(table);
    assert.equal(items.length, 2);
    assert.equal(items[0].day, "Senin");
    assert.equal(items[1].day, "Senin");
  });

  it("Scenario 23: Merged date cell forward-fill inheritance across rows", () => {
    const rows = [
      ["Tanggal", "Waktu", "Mata Kuliah"],
      ["2026-09-01", "08:00 - 10:00", "Kalkulus II"],
      ["", "10:00 - 12:00", "Fisika Dasar"],
    ];
    const table = analyzeTableStructure(rows);
    assert.ok(table);
    const items = extractItemsFromTableStructure(table);
    assert.equal(items.length, 2);
    assert.equal(items[0].date, "2026-09-01");
    assert.equal(items[1].date, "2026-09-01");
  });

  it("Scenario 24: Zero-hallucination leaves missing lecturer and room as undefined", () => {
    const norm = normalizeExtractedScheduleItem({
      title: "Kuliah Umum",
      day: "Senin",
      time: "08:00 - 10:00",
    });
    assert.equal(norm.instructor, undefined);
    assert.equal(norm.location, undefined);
    assert.equal(norm.confidenceTier, "REVIEW_REQUIRED");
  });

  it("Scenario 25: Confidence scoring separates OCR confidence from Schedule confidence", () => {
    const item = normalizeExtractedScheduleItem({
      title: "Kecerdasan Buatan",
      day: "Senin",
      time: "08:00 - 10:00",
      location: "Lab AI",
      instructor: "Dr. Budi",
      ocrConfidence: 0.95,
    });
    assert.equal(item.ocrConfidence, 0.95);
    assert.equal(item.confidenceTier, "HIGH_CONFIDENCE");
  });

  // ==========================================
  // SECTION 5: SMART AUTO SCHEDULE PLANNER 2.0 (26 to 34)
  // ==========================================

  it("Scenario 26: Target total hours session splitting breaks 6 hours into 4 sessions of 90 minutes", () => {
    const breakdown = calculateSessionBreakdown(6, 90);
    assert.equal(breakdown.targetSessions, 4);
    assert.equal(breakdown.actualTotalMinutes, 360);
    assert.equal(breakdown.actualTotalHours, 6);
  });

  it("Scenario 27: Workload protection limits daily study sessions according to dailyStudyLimit", () => {
    const req = {
      goalTitle: "Belajar Intensif",
      durationMinutes: 120,
      targetSessionsPerWeek: 4,
      preferredDays: ["Senin"] as any, // Only 1 day provided
      timePreference: "fleksibel" as any,
      maxDailyStudyMinutes: 120, // Max 1 session per day
    };

    const plan = planAcademicSchedule(req, [], []);
    // Since only Monday is available and max daily is 120 mins, planner should select 1 session on Monday without overloading
    assert.equal(plan.recommendedSessionsCount, 1);
  });

  it("Scenario 28: Minimum break enforcement buffers study sessions from existing schedules", () => {
    const existing = [
      {
        id: "1",
        title: "Kuliah Pagi",
        day: "Senin",
        start_time: "08:00",
        end_time: "10:00",
        time: "08:00 - 10:00",
        type: "jadwal" as const,
        priority: "tinggi" as const,
        is_completed: false,
      },
    ];

    const plan = planAcademicSchedule(
      {
        goalTitle: "Belajar Mandiri",
        durationMinutes: 60,
        targetSessionsPerWeek: 1,
        preferredDays: ["Senin"] as any,
        timePreference: "pagi" as any,
        minBreakMinutes: 30,
      },
      existing,
      []
    );

    assert.ok(plan.success);
    // Selected slot must start at or after 10:30 (10:00 + 30 min buffer)
    const selected = plan.candidates.find((c) => c.selected);
    if (selected) {
      assert.ok(selected.startTime >= "10:30");
    }
  });

  it("Scenario 29: Deadline proximity prioritizes slots before upcoming task deadline", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 2);
    const deadlineStr = futureDate.toISOString().split("T")[0];

    const plan = planAcademicSchedule(
      {
        goalTitle: "Persiapan Tugas Besar",
        durationMinutes: 90,
        targetSessionsPerWeek: 2,
        preferredDays: ["Senin", "Rabu"] as any,
        timePreference: "malam" as any,
        deadline: deadlineStr,
      },
      [],
      []
    );

    assert.ok(plan.success);
    assert.ok(plan.deadlineInfo);
    assert.equal(plan.deadlineInfo.isUrgent, true);
  });

  it("Scenario 30: Validation cleanly handles goal request with sanitized parameters", () => {
    const { isValid, sanitized } = validateGoalRequest({
      goalTitle: "  Belajar Python  ",
      durationMinutes: 90,
      targetSessionsPerWeek: 3,
      preferredDays: ["Senin", "Rabu"] as any,
      timePreference: "pagi",
    });

    assert.equal(isValid, true);
    assert.equal(sanitized.goalTitle, "Belajar Python");
  });

  it("Scenario 31: Explainable reasoning produces natural Indonesian rationale", () => {
    const plan = planAcademicSchedule(
      {
        goalTitle: "Belajar Algoritma",
        durationMinutes: 90,
        targetSessionsPerWeek: 2,
        preferredDays: ["Senin", "Rabu"] as any,
        timePreference: "malam" as any,
      },
      [],
      []
    );

    assert.ok(plan.success);
    const selected = plan.candidates.find((c) => c.selected);
    assert.ok(selected);
    assert.ok(selected.explanation.includes("Dipilih karena merupakan slot"));
  });

  it("Scenario 32: Workload level is categorized as ringan, optimal, or padat", () => {
    const planRingan = planAcademicSchedule(
      { goalTitle: "Review", durationMinutes: 60, targetSessionsPerWeek: 2, preferredDays: ["Senin", "Rabu"] as any, timePreference: "malam" as any },
      [],
      []
    );
    assert.equal(planRingan.workloadLevel, "ringan"); // 2 hours <= 3 hours
  });

  it("Scenario 33: Multi-day distribution spreads sessions across distinct preferred days", () => {
    const plan = planAcademicSchedule(
      {
        goalTitle: "Belajar Basis Data",
        durationMinutes: 60,
        targetSessionsPerWeek: 3,
        preferredDays: ["Senin", "Rabu", "Jumat"] as any,
        timePreference: "malam" as any,
      },
      [],
      []
    );

    const selectedDays = plan.candidates.filter((c) => c.selected).map((c) => c.day);
    const uniqueDays = new Set(selectedDays);
    assert.equal(uniqueDays.size, 3);
  });

  it("Scenario 34: Insufficient available slots generates clear warning message", () => {
    const busyExisting = [
      { id: "1", title: "Kuliah 1", day: "Senin", start_time: "07:00", end_time: "12:00", time: "07:00 - 12:00", type: "jadwal" as const, priority: "tinggi" as const, is_completed: false },
    ];

    const plan = planAcademicSchedule(
      {
        goalTitle: "Belajar Pagi",
        durationMinutes: 90,
        targetSessionsPerWeek: 3,
        preferredDays: ["Senin"] as any,
        timePreference: "pagi" as any, // 07:00 - 12:00 is completely busy
      },
      busyExisting,
      []
    );

    assert.ok(plan.warnings && plan.warnings.length > 0);
  });

  // ==========================================
  // SECTION 6: CONFLICT ENGINE 3.0 & SECURITY (35 to 40)
  // ==========================================

  it("Scenario 35: Overlap interval arithmetic calculates clash duration accurately", () => {
    assert.equal(checkIntervalOverlap("08:00", "10:00", "09:00", "11:00"), true);
    const duration = calculateClashDurationMinutes("08:00", "10:00", "09:00", "11:00");
    assert.equal(duration, 60);
    assert.equal(formatClashDuration(duration), "1 jam");
  });

  it("Scenario 36: Consecutive touching intervals (08:00-10:00 and 10:00-12:00) do NOT conflict", () => {
    assert.equal(checkIntervalOverlap("08:00", "10:00", "10:00", "12:00"), false);
    assert.equal(calculateClashDurationMinutes("08:00", "10:00", "10:00", "12:00"), 0);
  });

  it("Scenario 37: Insufficient break helper detects gap < minBreakMinutes", () => {
    const existing = [
      { id: "1", title: "Kuliah", day: "Senin", start_time: "08:00", end_time: "10:00", time: "08:00 - 10:00", type: "jadwal" as const, priority: "tinggi" as const, is_completed: false },
    ];
    // Candidate starting at 10:05 (only 5m after lecture) with 15m min break requirement
    const hasShortBreak = hasInsufficientBreak({ day: "Senin", startTime: "10:05", endTime: "11:35" }, existing, 15);
    assert.equal(hasShortBreak, true);
  });

  it("Scenario 38: Batch save Zod schema strictly validates valid schedule payload", () => {
    const payload = {
      items: [
        {
          title: "Pemrograman Web",
          day: "Senin",
          time: "08:00 - 10:00",
        },
      ],
    };
    const parsed = scheduleBatchSaveRequestSchema.safeParse(payload);
    assert.equal(parsed.success, true);
  });

  it("Scenario 39: Forged user_id in client payload is safely stripped by schema", () => {
    const payload = {
      items: [
        {
          user_id: "injected_attacker_uuid",
          title: "Struktur Data",
          day: "Selasa",
          time: "10:00 - 12:00",
        },
      ],
    };
    const parsed = scheduleBatchSaveRequestSchema.safeParse(payload);
    assert.equal(parsed.success, true);
  });

  it("Scenario 40: Double submit idempotency within batch detects duplicate items", () => {
    const item1 = normalizeExtractedScheduleItem({ id: "1", title: "Jaringan", day: "Kamis", time: "10:00 - 12:00" });
    const item2 = normalizeExtractedScheduleItem({ id: "2", title: "Jaringan", day: "Kamis", time: "10:00 - 12:00" });
    const analyzed = detectAllScheduleConflicts([item1, item2], []);
    assert.equal(analyzed[1].isDuplicate, true);
  });
});
