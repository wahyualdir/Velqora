import { describe, it } from "node:test";
import assert from "node:assert/strict";
import JSZip from "jszip";
import * as XLSX from "xlsx";
import { parseTextDocument } from "../text-parser";
import { parseCsvDocument } from "../csv-parser";
import { parseDocxDocument } from "../docx-parser";
import { parseXlsxDocument } from "../xlsx-parser";
import { parsePdfDocument } from "../pdf-parser";
import { validateScheduleFile } from "../parser";

describe("Document Parsers", () => {
  describe("validateScheduleFile", () => {
    it("should allow valid extensions and sizes", () => {
      const res = validateScheduleFile("jadwal_kuliah.pdf", "application/pdf", 1024 * 1024);
      assert.equal(res.isValid, true);
      assert.equal(res.fileExtension, "pdf");
    });

    it("should reject disallowed extensions", () => {
      const res = validateScheduleFile("script.exe", "application/octet-stream", 500);
      assert.equal(res.isValid, false);
      assert.match(res.error || "", /tidak didukung/);
    });

    it("should reject files larger than 15MB", () => {
      const res = validateScheduleFile("huge.pdf", "application/pdf", 20 * 1024 * 1024);
      assert.equal(res.isValid, false);
      assert.match(res.error || "", /melebihi batas maksimal/);
    });
  });

  describe("parseTextDocument", () => {
    it("should parse plain text documents into lines and fragments", async () => {
      const textContent = `Jadwal Semester 5
Senin: Pemrograman Web (08:00 - 10:00) Ruang 301
Rabu: Kecerdasan Buatan (13:00 - 15:30) Lab AI`;

      const buffer = Buffer.from(textContent, "utf-8");
      const res = await parseTextDocument(buffer, "jadwal.txt");

      assert.equal(res.rowCount, 3);
      assert.equal(res.isScanned, false);
      assert.match(res.extractedText, /Pemrograman Web/);
      assert.equal(res.fragments?.length, 3);
    });
  });

  describe("parseCsvDocument", () => {
    it("should parse comma-separated CSV with headers", async () => {
      const csvContent = `Mata Kuliah,Hari,Waktu,Ruangan
Struktur Data,Senin,08:00 - 10:00,Lab 1
Grafika Komputer,Kamis,10:00 - 12:00,Ruang 204`;

      const buffer = Buffer.from(csvContent, "utf-8");
      const res = await parseCsvDocument(buffer, "jadwal.csv");

      assert.equal(res.rowCount, 3);
      assert.match(res.extractedText, /Struktur Data/);
      assert.match(res.extractedText, /Grafika Komputer/);
      assert.equal(res.fragments?.length, 2);
    });

    it("should handle semicolon-separated CSV and quotes", async () => {
      const csvContent = `Mata Kuliah;Hari;Waktu;Keterangan
"Sistem Informasi, Lanjut";Selasa;08.00 - 10.00;"Kuliah & Praktikum"`;

      const buffer = Buffer.from(csvContent, "utf-8");
      const res = await parseCsvDocument(buffer, "jadwal_semicolon.csv");

      assert.match(res.extractedText, /Sistem Informasi, Lanjut/);
      assert.match(res.extractedText, /08.00 - 10.00/);
    });
  });

  describe("parseDocxDocument", () => {
    it("should extract text from docx zip XML safely", async () => {
      const zip = new JSZip();
      const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:r><w:t>Jadwal Kuliah Semester Ganjil</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>Senin, 08:00 - 10:00 : Rekayasa Perangkat Lunak (Ruang A2)</w:t></w:r>
    </w:p>
  </w:body>
</w:document>`;

      zip.file("word/document.xml", docXml);
      const docxBuffer = await zip.generateAsync({ type: "nodebuffer" });

      const res = await parseDocxDocument(docxBuffer, "jadwal.docx");
      assert.equal(res.rowCount, 2);
      assert.match(res.extractedText, /Rekayasa Perangkat Lunak/);
    });
  });

  describe("parseXlsxDocument", () => {
    it("should extract sheets, rows and cells from Excel workbook", async () => {
      const wb = XLSX.utils.book_new();
      const data = [
        ["Mata Kuliah", "Hari", "Jam Mulai", "Jam Selesai", "Dosen"],
        ["Keamanan Jaringan", "Jumat", "08:00", "10:30", "Dr. Budi"],
        ["Etika Profesi", "Kamis", "13:00", "14:40", "Prof. Siti"],
      ];
      const ws = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, "Jadwal_Sem5");

      const xlsxBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

      const res = await parseXlsxDocument(xlsxBuffer, "jadwal.xlsx");
      assert.equal(res.rowCount, 2);
      assert.match(res.extractedText, /Keamanan Jaringan/);
      assert.match(res.extractedText, /Dr\. Budi/);
    });
  });

  describe("parsePdfDocument", () => {
    it("should safely handle PDF parsing errors or empty buffers", async () => {
      const invalidBuffer = Buffer.from("NOT_A_REAL_PDF", "utf-8");
      await assert.rejects(async () => {
        await parsePdfDocument(invalidBuffer, "corrupt.pdf");
      });
    });
  });
});
