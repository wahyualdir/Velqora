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
];

/**
 * Robust RFC-4180 CSV & TSV Parser
 * Supports commas, semicolons, tabs, quoted multiline fields, BOM, offset headers, and row-level traceability.
 */
export async function parseCsvDocument(
  buffer: Buffer,
  fileName: string
): Promise<RawDocumentExtraction> {
  let rawText = "";
  try {
    rawText = buffer.toString("utf-8");
  } catch {
    rawText = buffer.toString("latin1");
  }

  // Remove UTF-8 BOM if present
  if (rawText.charCodeAt(0) === 0xfeff) {
    rawText = rawText.slice(1);
  }

  const rows = parseCsvRows(rawText);
  if (rows.length === 0) {
    return {
      fileName,
      mimeType: "text/csv",
      size: buffer.length,
      extractedText: "",
      rowCount: 0,
      isScanned: false,
      fragments: [],
    };
  }

  // Detect header row index
  const headerRowIndex = findHeaderRowIndex(rows);
  const headers = (rows[headerRowIndex] || []).map((h) => h.trim());
  const lines: string[] = [];
  const fragments: Array<{ pageOrRow: string; text: string }> = [];

  const cleanHeaderString = headers.filter(Boolean).join(" | ");
  if (cleanHeaderString) {
    lines.push(`[HEADER]: ${cleanHeaderString}`);
  }

  rows.forEach((row, index) => {
    if (index <= headerRowIndex) return; // Skip headers and banner rows before it
    const isBlank = row.every((c) => !c.trim());
    if (isBlank) return;

    const rowText = row
      .map((cell, cIdx) => {
        if (!cell.trim()) return "";
        const headerName = headers[cIdx] ? `${headers[cIdx]}: ` : "";
        return `${headerName}${cell.trim()}`;
      })
      .filter((t) => t.trim().length > 0)
      .join(" | ");

    if (!rowText) return;

    const traceLabel = `Baris ${index + 1}`;
    lines.push(`[${traceLabel}]: ${rowText}`);
    fragments.push({
      pageOrRow: traceLabel,
      text: rowText,
    });
  });

  return {
    fileName,
    mimeType: "text/csv",
    size: buffer.length,
    extractedText: lines.join("\n"),
    rowCount: rows.length,
    isScanned: false,
    fragments,
  };
}

/**
 * Searches for the row that best matches schedule column headers
 */
function findHeaderRowIndex(rows: string[][]): number {
  let bestIdx = 0;
  let maxScore = -1;

  for (let i = 0; i < Math.min(rows.length, 6); i++) {
    const row = rows[i] || [];
    let score = 0;
    for (const cell of row) {
      const cellStr = cell.toLowerCase().trim();
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

/**
 * Parses raw CSV/TSV text into 2D string matrix
 */
export function parseCsvRows(text: string): string[][] {
  // Detect delimiter: comma, semicolon, tab, or pipe
  const firstLines = text.split(/\r?\n/).slice(0, 5).join("\n");
  const commaCount = (firstLines.match(/,/g) || []).length;
  const semiCount = (firstLines.match(/;/g) || []).length;
  const tabCount = (firstLines.match(/\t/g) || []).length;
  const pipeCount = (firstLines.match(/\|/g) || []).length;

  let delimiter = ",";
  if (semiCount > commaCount && semiCount >= tabCount) delimiter = ";";
  else if (tabCount > commaCount && tabCount >= semiCount) delimiter = "\t";
  else if (pipeCount > commaCount && pipeCount >= semiCount) delimiter = "|";

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = "";
    } else if ((char === "\r" || char === "\n") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i++; // skip \n in CRLF
      }
      currentRow.push(currentCell.trim());
      if (currentRow.some((c) => c.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = "";
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((c) => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}
