import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getFixtureBuffer } from "../../../../fixtures/schedules/data/real-world-fixtures";
import { parseCsvDocument } from "../csv-parser";
import { parseXlsxDocument } from "../xlsx-parser";
import { parseDocxDocument } from "../docx-parser";
import { parseTextDocument } from "../text-parser";
import { parsePdfDocument } from "../pdf-parser";
import { validateScheduleFile, sanitizeFileName } from "../parser";

describe("FASE 25 — Real-World Document Parsers Validation", () => {
  // 1. CSV Standard Comma
  it("should parse standard comma-separated CSV with row traceability", async () => {
    const { buffer, fileName } = await getFixtureBuffer("csv_standard_comma");
    const parsed = await parseCsvDocument(buffer, fileName);

    assert.equal(parsed.mimeType, "text/csv");
    assert.equal((parsed.rowCount ?? 0) >= 4, true);
    assert.match(parsed.extractedText, /Pemrograman Web Lanjut/);
    assert.match(parsed.extractedText, /Kecerdasan Buatan/);
    assert.equal((parsed.fragments?.length ?? 0) >= 4, true);
    assert.match(String(parsed.fragments?.[0]?.pageOrRow || ""), /Baris 2/);
  });

  // 2. CSV Semicolon with Quoted Multiline and UTF-8 BOM
  it("should parse semicolon-separated CSV with UTF-8 BOM and quoted columns", async () => {
    const { buffer, fileName } = await getFixtureBuffer("csv_semicolon_quoted");
    const parsed = await parseCsvDocument(buffer, fileName);

    assert.equal((parsed.rowCount ?? 0) >= 3, true);
    assert.match(parsed.extractedText, /Jaringan Komputer dan Keamanan Siber/);
    assert.match(parsed.extractedText, /Interaksi Manusia dan Komputer/);
    assert.match(parsed.extractedText, /Manajemen Proyek Teknologi Informasi/);
  });

  // 3. XLSX Header Offset (Banner at Row 1, Headers at Row 4)
  it("should parse XLSX with offset headers and strip decorative title banners", async () => {
    const { buffer, fileName } = await getFixtureBuffer("xlsx_offset_headers");
    const parsed = await parseXlsxDocument(buffer, fileName);

    assert.equal((parsed.rowCount ?? 0) >= 3, true);
    assert.match(parsed.extractedText, /Struktur Data & Algoritma/);
    assert.match(parsed.extractedText, /Kalkulus Lanjut/);
    assert.match(parsed.extractedText, /Arsitektur Komputer/);
    assert.match(String(parsed.fragments?.[0]?.pageOrRow || ""), /Jadwal_TI - Baris 5/);
  });

  // 4. XLSX Multi-Sheet Extraction
  it("should extract all sheets from multi-sheet Excel workbook", async () => {
    const { buffer, fileName } = await getFixtureBuffer("xlsx_multisheet");
    const parsed = await parseXlsxDocument(buffer, fileName);

    assert.equal((parsed.rowCount ?? 0) >= 4, true);
    assert.match(parsed.extractedText, /Fisika Dasar II/);
    assert.match(parsed.extractedText, /Matematika Diskrit/);
    assert.match(parsed.extractedText, /Machine Learning & Deep Learning/);
    assert.match(parsed.extractedText, /Cloud Computing Architecture/);
  });

  // 5. TXT Multi-Line Block Format
  it("should parse structured multi-line text notes with blocks", async () => {
    const { buffer, fileName } = await getFixtureBuffer("txt_block_format");
    const parsed = await parseTextDocument(buffer, fileName);

    assert.equal(parsed.mimeType, "text/plain");
    assert.match(parsed.extractedText, /Pemrograman Berorientasi Objek/);
    assert.match(parsed.extractedText, /Pengolahan Citra Digital/);
    assert.match(parsed.extractedText, /Sistem Tertanam & IoT/);
  });

  // 6. TXT Inline Delimited Format with Indonesian Aliases
  it("should parse inline delimited text with day abbreviations and time dots", async () => {
    const { buffer, fileName } = await getFixtureBuffer("txt_inline_delimited");
    const parsed = await parseTextDocument(buffer, fileName);

    assert.match(parsed.extractedText, /Sistem Terdistribusi/);
    assert.match(parsed.extractedText, /Kriptografi & Keamanan Informasi/);
    assert.match(parsed.extractedText, /Technopreneurship & Startup Digital/);
  });

  // 7. DOCX Academic Table
  it("should parse Word (.docx) document extracting tables and cell rows cleanly", async () => {
    const { buffer, fileName } = await getFixtureBuffer("docx_academic_table");
    const parsed = await parseDocxDocument(buffer, fileName);

    assert.match(parsed.extractedText, /Teori Graf dan Otomata/);
    assert.match(parsed.extractedText, /Pengembangan Aplikasi Bergerak/);
    assert.match(parsed.extractedText, /Data Warehouse & Business Intelligence/);
    assert.match(String(parsed.fragments?.[0]?.pageOrRow || ""), /Tabel 1 - Baris 1/);
  });

  // 8. PDF Validation (Scanned, Corrupt, Empty)
  it("should detect scanned PDF when text is less than 15 characters", async () => {
    const minimalPdf = "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000101 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF";
    const parsed = await parsePdfDocument(Buffer.from(minimalPdf), "scan.pdf");
    assert.equal(parsed.isScanned, true);
  });

  it("should reject corrupted PDF buffer without PDF header", async () => {
    const corrupt = Buffer.from("NOT_A_VALID_PDF_DATA_STREAM");
    await assert.rejects(async () => {
      await parsePdfDocument(corrupt, "broken.pdf");
    });
  });

  // 9. File Security & Path Traversal Sanitization
  it("should sanitize malicious filenames preventing path traversal and null bytes", () => {
    const safe1 = sanitizeFileName("../../etc/passwd");
    assert.equal(safe1, "passwd");

    const safe2 = sanitizeFileName("..\\..\\windows\\system32\\calc.exe");
    assert.equal(safe2, "calc.exe");

    const safe3 = sanitizeFileName("schedule\0malicious.pdf");
    assert.equal(safe3, "schedulemalicious.pdf");
  });

  it("should reject disallowed extensions and oversized files", () => {
    const disallowed = validateScheduleFile("payload.exe", "application/octet-stream", 1024);
    assert.equal(disallowed.isValid, false);
    assert.match(disallowed.error || "", /tidak didukung/i);

    const oversized = validateScheduleFile("large.xlsx", "application/vnd.openxmlformats", 16 * 1024 * 1024);
    assert.equal(oversized.isValid, false);
    assert.match(oversized.error || "", /15 MB/i);

    const zeroByte = validateScheduleFile("empty.csv", "text/csv", 0);
    assert.equal(zeroByte.isValid, false);
    assert.match(zeroByte.error || "", /kosong/i);
  });
});
