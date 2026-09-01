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

const MAX_XLSX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const MAX_SHEETS_ALLOWED = 25;
const MAX_ROWS_PER_SHEET = 2500;
const MAX_CELL_STRING_LENGTH = 1000;

/**
 * Sanitizes cell values to prevent Prototype Pollution and ReDoS
 */
function sanitizeCellValue(cell: unknown): string {
  if (cell === null || cell === undefined) return "";
  const raw = String(cell).trim();
  if (!raw) return "";

  // Prevent prototype pollution keywords or formula injection
  const cleaned = raw
    .replace(/(?:__proto__|prototype|constructor)/gi, "")
    .slice(0, MAX_CELL_STRING_LENGTH)
    .trim();

  return cleaned;
}

/**
 * Excel Spreadsheet (.xlsx, .xls) Parser
 * Extracts worksheets, rows, and cells with row-level traceability.
 * Defense-in-depth:
 * - Hard bounds on file size (15MB), sheet count (25), and row count (2500).
 * - Disables formula execution (cellFormula: false) and HTML evaluation (cellHTML: false).
 * - Sanitizes cell text to protect against Prototype Pollution & ReDoS.
 * - Handles offset header rows and forward-fills merged cells safely.
 */
export async function parseXlsxDocument(
  buffer: Buffer,
  fileName: string
): Promise<RawDocumentExtraction> {
  if (buffer.length > MAX_XLSX_FILE_SIZE) {
    throw new Error(
      `Ukuran berkas Excel (${(buffer.length / (1024 * 1024)).toFixed(1)} MB) melebihi batas aman 15 MB.`
    );
  }

  try {
    const workbook = XLSX.read(buffer, {
      type: "buffer",
      cellDates: true,
      cellFormula: false, // Security: do not execute or evaluate formulas
      cellHTML: false, // Security: do not parse HTML
      cellText: false,
      dense: true, // Memory optimization
      sheetRows: MAX_ROWS_PER_SHEET, // Mitigates ReDoS & excessive row processing
    });

    const lines: string[] = [];
    const fragments: Array<{ pageOrRow: string; text: string }> = [];
    let totalRows = 0;

    const sheetNames = workbook.SheetNames.slice(0, MAX_SHEETS_ALLOWED);

    for (const sheetName of sheetNames) {
      const safeSheetName = sanitizeCellValue(sheetName) || "Sheet";
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) continue;

      lines.push(`\n=== LEMBAR KERJA (SHEET): ${safeSheetName} ===`);

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
      const headers = (rawRows[headerRowIndex] || []).map((h) => sanitizeCellValue(h));

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

        const rowStrings = (Array.isArray(row) ? row : []).map((cell) => sanitizeCellValue(cell));
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

        const traceLabel = `${safeSheetName} - Baris ${index + 1}`;
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
      const cellStr = sanitizeCellValue(cell).toLowerCase();
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
