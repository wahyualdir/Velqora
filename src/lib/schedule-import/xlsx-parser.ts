import * as XLSX from "xlsx";
import { RawDocumentExtraction } from "./types";

const SCHEDULE_HEADER_KEYWORDS = [
  "hari",
  "day",
  "jam",
  "waktu",
  "time",
  "mata kuliah",
  "matakuliah",
  "matkul",
  "course",
  "subject",
  "ruang",
  "ruangan",
  "room",
  "dosen",
  "pengajar",
  "lecturer",
  "kode",
  "code",
  "kelas",
  "class",
];

/**
 * Excel Spreadsheet (.xlsx, .xls) Parser
 * Extracts all worksheets, rows, and cells with row-level traceability.
 * Automatically detects offset header rows, handles merged cells (fill forward), and ignores decorative titles.
 * Never executes spreadsheet formulas, completely safe.
 */
export async function parseXlsxDocument(
  buffer: Buffer,
  fileName: string
): Promise<RawDocumentExtraction> {
  try {
    const workbook = XLSX.read(buffer, {
      type: "buffer",
      cellDates: true,
      cellFormula: false, // Security: do not execute or evaluate formulas
      cellHTML: false,
    });

    const lines: string[] = [];
    const fragments: Array<{ pageOrRow: string; text: string }> = [];
    let totalRows = 0;

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) continue;

      lines.push(`\n=== LEMBAR KERJA (SHEET): ${sheetName} ===`);

      // Convert sheet to JSON rows as array of arrays
      const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: "",
        blankrows: false,
        raw: false,
      });

      if (rawRows.length === 0) continue;

      // Detect header row index
      const headerRowIndex = findHeaderRowIndex(rawRows);
      const headers = (rawRows[headerRowIndex] || []).map((h) => String(h || "").trim());

      // If headers found, emit header line
      const cleanHeaderString = headers.filter(Boolean).join(" | ");
      if (cleanHeaderString) {
        lines.push(`[HEADER]: ${cleanHeaderString}`);
      }

      // Find day column index for merged cell forward-filling
      const dayHeaderIdx = headers.findIndex((h) => /^(?:hari|day|hari\s*kuliah)$/i.test(h));
      let lastKnownDay = "";

      // Process data rows
      rawRows.forEach((row, index) => {
        if (index <= headerRowIndex) return; // Skip headers and banner rows before it

        const rowStrings = row.map((cell) => String(cell || "").trim());
        const isBlank = rowStrings.every((c) => !c);
        if (isBlank) return;

        // Forward fill merged day cell
        if (dayHeaderIdx !== -1) {
          if (rowStrings[dayHeaderIdx]) {
            lastKnownDay = rowStrings[dayHeaderIdx];
          } else if (lastKnownDay) {
            rowStrings[dayHeaderIdx] = lastKnownDay;
          }
        }

        totalRows++;
        const rowText = rowStrings
          .map((cell, cIdx) => {
            if (!cell) return "";
            const headerName = headers[cIdx] ? `${headers[cIdx]}: ` : "";
            return `${headerName}${cell}`;
          })
          .filter((t) => t.trim().length > 0)
          .join(" | ");

        if (!rowText) return;

        const traceLabel = `${sheetName} - Baris ${index + 1}`;
        lines.push(`[${traceLabel}]: ${rowText}`);
        fragments.push({
          pageOrRow: traceLabel,
          text: rowText,
        });
      });
    }

    return {
      fileName,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      size: buffer.length,
      extractedText: lines.join("\n").trim(),
      rowCount: totalRows,
      isScanned: false,
      fragments,
    };
  } catch (err: any) {
    throw new Error(`Gagal membaca berkas Excel (.xlsx/.xls): ${err.message || String(err)}`);
  }
}

/**
 * Searches for the row that best matches schedule column headers
 */
function findHeaderRowIndex(rows: any[][]): number {
  let bestIdx = 0;
  let maxScore = -1;

  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const row = rows[i] || [];
    let score = 0;
    for (const cell of row) {
      const cellStr = String(cell || "").toLowerCase().trim();
      if (!cellStr) continue;
      for (const kw of SCHEDULE_HEADER_KEYWORDS) {
        if (cellStr.includes(kw)) {
          score += 2;
          break;
        }
      }
    }

    if (score > maxScore && score >= 2) {
      maxScore = score;
      bestIdx = i;
    }
  }

  return bestIdx;
}
