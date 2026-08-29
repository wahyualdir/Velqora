import { RawScheduleItemInput } from "./schema";

export type SemanticColumnType =
  | "DAY"
  | "DATE"
  | "TIME"
  | "COURSE"
  | "CODE"
  | "ROOM"
  | "LECTURER"
  | "SKS"
  | "CLASS"
  | "UNKNOWN";

export const SEMANTIC_HEADER_PATTERNS: Record<SemanticColumnType, RegExp[]> = {
  DAY: [
    /^(?:hari|day|hari\s*kuliah|hari\/tanggal|hari\s*pelaksanaan|day\s*of\s*week)$/i,
    /\b(?:hari|day)\b/i,
  ],
  DATE: [
    /^(?:tanggal|date|tgl|tgl\s*kuliah|tanggal\s*pelaksanaan)$/i,
    /\b(?:tanggal|date|tgl)\b/i,
  ],
  TIME: [
    /^(?:jam|waktu|time|jam\s*kuliah|pukul|waktu\s*pelaksanaan|slot\s*waktu|sesi|waktu\s*kuliah)$/i,
    /\b(?:jam|waktu|time|pukul)\b/i,
  ],
  COURSE: [
    /^(?:mata\s*kuliah|matakuliah|mata\s*ajaran|course|subject|nama\s*mata\s*kuliah|nama\s*mk|course\s*name|kegiatan|agenda)$/i,
    /\b(?:mata\s*kuliah|matakuliah|course|subject)\b/i,
  ],
  CODE: [
    /^(?:kode|kode\s*mk|kode\s*matkul|kode\s*mata\s*kuliah|course\s*code|sandi\s*mk|class\s*code)$/i,
    /\b(?:kode\s*mk|kode|code)\b/i,
  ],
  ROOM: [
    /^(?:ruang|ruangan|room|lokasi|tempat|lab|laboratorium|gedung|kelas|classroom|virtual\s*room)$/i,
    /\b(?:ruang|ruangan|room|lokasi|lab)\b/i,
  ],
  LECTURER: [
    /^(?:dosen|pengajar|lecturer|instructor|dosen\s*pengampu|dosen\s*pembimbing|nama\s*dosen|teacher)$/i,
    /\b(?:dosen|pengajar|lecturer|instructor)\b/i,
  ],
  SKS: [/^(?:sks|kredit|credit|credits)$/i],
  CLASS: [/^(?:kelas|paralel|group|section)$/i],
  UNKNOWN: [],
};

/**
 * Classifies a column header label into a canonical semantic column type
 */
export function classifyColumnHeader(headerText: string): SemanticColumnType {
  const clean = headerText.trim().toLowerCase().replace(/[-_:]+/g, " ");

  for (const [type, patterns] of Object.entries(SEMANTIC_HEADER_PATTERNS) as [SemanticColumnType, RegExp[]][]) {
    if (type === "UNKNOWN") continue;
    for (const pattern of patterns) {
      if (pattern.test(clean)) {
        return type;
      }
    }
  }

  return "UNKNOWN";
}

export interface TableColumnMapping {
  columnIndex: number;
  headerName: string;
  semanticType: SemanticColumnType;
}

export interface ParsedTableStructure {
  headerRowIndex: number;
  columns: TableColumnMapping[];
  dataRows: string[][];
  sourceTracePrefix?: string;
}

/**
 * Discovers table structure, detects header row, and maps semantic columns
 */
export function analyzeTableStructure(
  rows: string[][],
  tracePrefix: string = "Tabel"
): ParsedTableStructure | null {
  if (!rows || rows.length === 0) return null;

  let bestHeaderRowIndex = -1;
  let bestHeaderScore = 0;
  let bestColumns: TableColumnMapping[] = [];

  // Search first 10 rows for best header row candidate
  const maxSearchRows = Math.min(rows.length, 10);

  for (let r = 0; r < maxSearchRows; r++) {
    const row = rows[r];
    if (!row || row.length === 0) continue;

    let score = 0;
    const currentColumns: TableColumnMapping[] = [];
    const matchedTypes = new Set<SemanticColumnType>();

    for (let c = 0; c < row.length; c++) {
      const cellText = String(row[c] || "").trim();
      const semType = classifyColumnHeader(cellText);

      currentColumns.push({
        columnIndex: c,
        headerName: cellText,
        semanticType: semType,
      });

      if (semType !== "UNKNOWN" && !matchedTypes.has(semType)) {
        matchedTypes.add(semType);
        if (semType === "COURSE" || semType === "TIME" || semType === "DAY") {
          score += 3;
        } else {
          score += 1;
        }
      }
    }

    if (score > bestHeaderScore && matchedTypes.size >= 2) {
      bestHeaderScore = score;
      bestHeaderRowIndex = r;
      bestColumns = currentColumns;
    }
  }

  if (bestHeaderRowIndex === -1 || bestColumns.length === 0) {
    return null;
  }

  const dataRows = rows.slice(bestHeaderRowIndex + 1);

  return {
    headerRowIndex: bestHeaderRowIndex,
    columns: bestColumns,
    dataRows,
    sourceTracePrefix: tracePrefix,
  };
}

/**
 * Extracts raw schedule items from a structured table matrix using semantic column mapping
 */
export function extractItemsFromTableStructure(
  table: ParsedTableStructure
): RawScheduleItemInput[] {
  const items: RawScheduleItemInput[] = [];

  const dayCols = table.columns.filter((c) => c.semanticType === "DAY").map((c) => c.columnIndex);
  const dateCols = table.columns.filter((c) => c.semanticType === "DATE").map((c) => c.columnIndex);
  const timeCols = table.columns.filter((c) => c.semanticType === "TIME").map((c) => c.columnIndex);
  const courseCols = table.columns.filter((c) => c.semanticType === "COURSE").map((c) => c.columnIndex);
  const codeCols = table.columns.filter((c) => c.semanticType === "CODE").map((c) => c.columnIndex);
  const roomCols = table.columns.filter((c) => c.semanticType === "ROOM").map((c) => c.columnIndex);
  const lecturerCols = table.columns.filter((c) => c.semanticType === "LECTURER").map((c) => c.columnIndex);

  let lastKnownDay = "";

  for (let r = 0; r < table.dataRows.length; r++) {
    const row = table.dataRows[r];
    if (!row || row.every((c) => !c || !c.trim())) continue;

    // Extract fields
    let day = dayCols.map((idx) => row[idx]).filter(Boolean).join(" ").trim();
    const date = dateCols.map((idx) => row[idx]).filter(Boolean).join(" ").trim();
    const time = timeCols.map((idx) => row[idx]).filter(Boolean).join(" ").trim();
    let title = courseCols.map((idx) => row[idx]).filter(Boolean).join(" ").trim();
    const subject = codeCols.map((idx) => row[idx]).filter(Boolean).join(" ").trim();
    const location = roomCols.map((idx) => row[idx]).filter(Boolean).join(" ").trim();
    const instructor = lecturerCols.map((idx) => row[idx]).filter(Boolean).join(" ").trim();

    // Carry-over merged day cells if day is empty
    if (day) {
      lastKnownDay = day;
    } else if (lastKnownDay && (time || title)) {
      day = lastKnownDay;
    }

    // Skip rows without meaningful title or time
    if (!title && !time) continue;

    // If title is missing but other fields are present, search fallback in row
    if (!title && row.length > 0) {
      const nonClassified = row.filter((_, idx) => {
        return !dayCols.includes(idx) && !timeCols.includes(idx) && !codeCols.includes(idx) && !roomCols.includes(idx) && !lecturerCols.includes(idx);
      }).map((c) => c.trim()).filter((c) => c.length >= 2);
      if (nonClassified.length > 0) {
        title = nonClassified[0];
      }
    }

    if (title && title.length >= 2) {
      items.push({
        title,
        subject: subject || undefined,
        day: day || undefined,
        date: date || undefined,
        time: time || undefined,
        location: location || undefined,
        instructor: instructor || undefined,
        sourceText: row.join(" | "),
        sourceTrace: `${table.sourceTracePrefix || "Baris"} ${table.headerRowIndex + r + 2}`,
        type: "jadwal",
        priority: "sedang",
      });
    }
  }

  return items;
}
