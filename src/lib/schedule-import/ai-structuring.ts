import { RawDocumentExtraction } from "./types";
import { aiStructuringOutputSchema, AIStructuringOutput, RawScheduleItemInput } from "./schema";
import { analyzeTableStructure, extractItemsFromTableStructure } from "./table-structuring";
import { extractLocationFromTitle } from "./normalizer";
import { logger } from "@/lib/observability";

const MAX_PROMPT_CHARS = 10000;
const AI_TIMEOUT_MS = 30000;

/**
 * AI Structuring Engine
 * Transforms unstructured raw text or image documents into structured JSON schedule items.
 */
export async function structureScheduleWithAI(
  doc: RawDocumentExtraction,
  correlationId: string
): Promise<AIStructuringOutput> {
  const apiKey = process.env.GEMINI_API_KEY;

  // 1. If no API key or image without text, try heuristic parsing
  if (!apiKey) {
    logger.warn(
      "AI_SCHEDULE_IMPORT",
      "Gemini API key is not configured. Using deterministic heuristic extraction fallback.",
      { fileName: doc.fileName },
      correlationId
    );
    return heuristicTextScheduleExtractor(doc.extractedText);
  }

  // 2. Prepare payload
  const truncatedText = doc.extractedText.slice(0, MAX_PROMPT_CHARS);
  const isImage = !!doc.metadata?.isImage && !!doc.metadata?.base64;

  const systemInstruction = `Anda adalah Mesin Ekstraksi Jadwal Akademik Produksi (Velqora Schedule Structuring Engine).
Tugas Anda adalah membaca teks atau gambar jadwal perkuliahan / kegiatan akademik dan mengekstrak seluruh agenda kegiatan ke dalam format JSON yang valid.

Aturan Penting:
1. Ekstrak HANYA informasi yang benar-benar ada di dokumen. JANGAN mengarang nama, hari, atau jam.
2. Hari wajib dinormalisasi ke Bahasa Indonesia: "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu".
3. Format jam mulai dan jam selesai dalam format HH:mm (contoh: "08:00", "10:30").
4. Jika terdapat nama dosen/pengajar, ruang kelas/laboratorium, atau kode mata kuliah, masukkan ke field terkait.
5. Format keluaran WAJIB berupa JSON murni dengan schema:
{
  "items": [
    {
      "title": "Nama Kegiatan / Mata Kuliah",
      "subject": "Topik atau Kode MK (jika ada)",
      "day": "Senin | Selasa | Rabu | Kamis | Jumat | Sabtu | Minggu",
      "startTime": "08:00",
      "endTime": "10:00",
      "time": "08:00 - 10:00",
      "location": "Ruang Kelas / Gedung / Zoom",
      "instructor": "Nama Dosen / Pengajar",
      "description": "Keterangan tambahan jika ada",
      "type": "jadwal"
    }
  ]
}
DILARANG menghasilkan teks selain JSON. DILARANG menghasilkan HTML atau SQL.`;

  try {
    const aiResponseText = await callGeminiWithTimeout(
      apiKey,
      systemInstruction,
      truncatedText,
      isImage ? (doc.metadata?.base64 as string) : undefined,
      isImage ? (doc.mimeType as string) : undefined,
      AI_TIMEOUT_MS
    );

    if (!aiResponseText) {
      throw new Error("AI provider mengembalikan respons kosong.");
    }

    // 3. Parse JSON & Validate with Zod
    const parsed = safeJsonParse(aiResponseText);
    const validated = aiStructuringOutputSchema.safeParse(parsed);

    if (validated.success && validated.data.items.length > 0) {
      return validated.data;
    }

    // 4. Attempt 1 Repair attempt if initial parse/validation failed
    logger.warn(
      "AI_SCHEDULE_IMPORT",
      "Initial AI JSON invalid or empty, attempting 1-time schema repair...",
      { preview: aiResponseText.slice(0, 200) },
      correlationId
    );

    const repaired = await attemptJsonRepair(apiKey, aiResponseText);
    if (repaired && repaired.items.length > 0) {
      return repaired;
    }

    // Fallback to heuristic parser
    return heuristicTextScheduleExtractor(doc.extractedText);
  } catch (err: any) {
    logger.error(
      "AI_SCHEDULE_IMPORT",
      `AI structuring failed: ${err.message || String(err)}`,
      err,
      { fileName: doc.fileName },
      correlationId
    );

    // Safe fallback: never crash, return heuristic extraction
    return heuristicTextScheduleExtractor(doc.extractedText);
  }
}

/**
 * Calls Google Gemini REST API with strict timeout
 */
async function callGeminiWithTimeout(
  apiKey: string,
  systemInstruction: string,
  textContext: string,
  imageBase64?: string,
  imageMimeType?: string,
  timeoutMs: number = 30000
): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const parts: Array<Record<string, unknown>> = [];

  if (imageBase64) {
    parts.push({
      inline_data: {
        mime_type: imageMimeType || "image/jpeg",
        data: imageBase64,
      },
    });
  }

  const promptMessage = textContext.trim()
    ? `Tolong ekstrak seluruh jadwal kuliah / kegiatan akademik dari dokumen berikut:\n\n${textContext}`
    : "Tolong ekstrak seluruh jadwal kuliah / kegiatan akademik dari gambar dokumen ini ke dalam format JSON yang ditentukan.";

  parts.push({ text: promptMessage });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: [
          {
            role: "user",
            parts,
          },
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API HTTP ${res.status}: ${errText.slice(0, 300)}`);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidate || null;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Safely parses JSON with markdown strip
 */
function safeJsonParse(raw: string): any {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/```\s*$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/```\s*$/, "");
  }
  return JSON.parse(cleaned.trim());
}

/**
 * 1-time repair attempt
 */
async function attemptJsonRepair(
  apiKey: string,
  malformedJson: string
): Promise<AIStructuringOutput | null> {
  try {
    const repairPrompt = `Perbaiki JSON berikut agar valid sesuai schema { "items": [{ "title": string, "day": string, "startTime": string, "endTime": string, "location": string, "instructor": string }] }:\n\n${malformedJson.slice(0, 3000)}`;
    const resText = await callGeminiWithTimeout(
      apiKey,
      "Anda adalah asisten perbaikan JSON. Hasilkan HANYA JSON valid.",
      repairPrompt,
      undefined,
      undefined,
      10000
    );
    if (!resText) return null;
    const parsed = safeJsonParse(resText);
    const validated = aiStructuringOutputSchema.safeParse(parsed);
    return validated.success ? validated.data : null;
  } catch {
    return null;
  }
}

const DAY_REGEX = /\b(senin|selasa|rabu|kamis|jumat|jum'at|sabtu|minggu|ahad|sen|sel|rab|kam|jum|sab|min|monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|wed|thu|fri|sat|sun)\b/i;
const TIME_RANGE_REGEX = /(\d{1,2}(?:[:.]\d{2})?(?:\s*(?:am|pm))?)\s*(?:-|–|—|s\.?d\.?|sampai|hingga|\/)\s*(\d{1,2}(?:[:.]\d{2})?(?:\s*(?:am|pm))?)/i;
const SINGLE_TIME_REGEX = /\b(\d{1,2}[:.]\d{2}(?:\s*(?:am|pm))?|\d{1,2}\s*(?:am|pm))\b/i;
const ACADEMIC_TITLES_REGEX = /\b(prof\.|dr\.|ir\.|drs\.|dra\.|m\.kom|m\.t\.|s\.t\.|s\.kom|ph\.d|m\.sc|m\.cs|m\.si|m\.m|m\.ds|s\.sn|s\.pd|m\.pd|bba|mba|ceh|pmp)\b/i;
const ROOM_LOCATION_REGEX = /\b(ruang|ruangan|lab|laboratorium|gedung|auditorium|aula|r\.\s*\d+|zoom|classroom|room)\b/i;
const COURSE_CODE_REGEX = /\b([A-Z]{2,4}[-\s]?\d{3,4})\b/i;

/**
 * Deterministic Regex & Keyword Heuristic Fallback Extractor
 * Guarantees that even if AI provider is offline or unconfigured,
 * academic schedule tables, key-values, and multi-line notes are extracted with high precision!
 */
export function heuristicTextScheduleExtractor(text: string): AIStructuringOutput {
  const rawLines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const items: RawScheduleItemInput[] = [];
  const visitedLineIndices = new Set<number>();

  // 1. Check if document has raw grid table rows without key-value prefixes
  const potentialTableRows: string[][] = [];
  const rowTraces: string[] = [];

  for (const line of rawLines) {
    let clean = line;
    let trace = `Baris ${potentialTableRows.length + 1}`;
    const traceMatch = line.match(/^\[([^\]]+)\]:\s*(.*)$/);
    if (traceMatch) {
      trace = traceMatch[1];
      clean = traceMatch[2];
    }

    if (clean.includes("|")) {
      potentialTableRows.push(clean.split("|").map((c) => c.trim()));
      rowTraces.push(trace);
    } else if (clean.includes("\t")) {
      potentialTableRows.push(clean.split("\t").map((c) => c.trim()));
      rowTraces.push(trace);
    }
  }

  const isKeyValueFormat = potentialTableRows.some((row) =>
    row.some((cell) => cell.includes(": "))
  );

  if (!isKeyValueFormat && potentialTableRows.length >= 3) {
    const tableStruct = analyzeTableStructure(potentialTableRows, "Tabel", rowTraces);
    if (tableStruct) {
      const tableItems = extractItemsFromTableStructure(tableStruct);
      if (tableItems.length >= 1) {
        return aiStructuringOutputSchema.parse({
          items: tableItems,
          documentSummary: `Ekstraksi tabel terstruktur menemukan ${tableItems.length} agenda perkuliahan.`,
        });
      }
    }
  }

  // 2. Check for Multi-Line Blocks (Key-Value or multi-line blocks separated by blank lines or headers)
  const rawBlocks = text.split(/\r?\n\s*\r?\n/).map((b) => b.trim()).filter(Boolean);
  if (rawBlocks.length >= 2) {
    for (let bIdx = 0; bIdx < rawBlocks.length; bIdx++) {
      const blockText = rawBlocks[bIdx];
      const bLines = blockText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

      let title = "";
      let subject: string | undefined = undefined;
      let day: string | undefined = undefined;
      let date: string | undefined = undefined;
      let time: string | undefined = undefined;
      let location: string | undefined = undefined;
      let instructor: string | undefined = undefined;

      for (const bLine of bLines) {
        const clean = bLine.replace(/^\[[^\]]+\]:\s*/, "").trim();
        const lower = clean.toLowerCase();

        if (lower.startsWith("mata kuliah") || lower.startsWith("matkul") || lower.startsWith("course") || lower.startsWith("kegiatan") || lower.startsWith("nama mk")) {
          title = clean.replace(/^[^:]+:\s*/i, "").trim();
        } else if (lower.startsWith("kode") || lower.startsWith("kode mk") || lower.startsWith("code")) {
          subject = clean.replace(/^[^:]+:\s*/i, "").trim();
        } else if (lower.startsWith("hari") || lower.startsWith("day")) {
          day = clean.replace(/^[^:]+:\s*/i, "").trim();
        } else if (lower.startsWith("tanggal") || lower.startsWith("date")) {
          date = clean.replace(/^[^:]+:\s*/i, "").trim();
        } else if (lower.startsWith("waktu") || lower.startsWith("jam") || lower.startsWith("time") || lower.startsWith("pukul")) {
          time = clean.replace(/^[^:]+:\s*/i, "").trim();
        } else if (lower.startsWith("ruang") || lower.startsWith("ruangan") || lower.startsWith("room") || lower.startsWith("lokasi")) {
          location = clean.replace(/^[^:]+:\s*/i, "").trim();
        } else if (lower.startsWith("dosen") || lower.startsWith("pengajar") || lower.startsWith("lecturer") || lower.startsWith("instructor")) {
          instructor = clean.replace(/^[^:]+:\s*/i, "").trim();
        } else {
          // Unlabeled line
          if (!day && clean.match(DAY_REGEX)) {
            day = clean.match(DAY_REGEX)![1];
          }
          if (!time && (clean.match(TIME_RANGE_REGEX) || clean.match(SINGLE_TIME_REGEX))) {
            const tm = clean.match(TIME_RANGE_REGEX) || clean.match(SINGLE_TIME_REGEX);
            time = tm![2] ? `${tm![1]} - ${tm![2]}` : tm![1];
          }
          if (!location && clean.match(ROOM_LOCATION_REGEX)) {
            location = clean.replace(/^(?:ruang|ruangan|room|lab)[:\s-]*/i, "").trim() || clean;
          }
          if (!instructor && (clean.match(ACADEMIC_TITLES_REGEX) || clean.toLowerCase().startsWith("dr.") || clean.toLowerCase().startsWith("prof."))) {
            instructor = clean;
          }
          if (!title && clean.length >= 3 && !clean.match(DAY_REGEX) && !clean.match(TIME_RANGE_REGEX) && !clean.startsWith("===") && !clean.startsWith("---")) {
            title = clean;
          }
        }
      }

      // Clean course code from title if embedded
      if (title) {
        const cCode = title.match(COURSE_CODE_REGEX);
        if (cCode && !subject) {
          subject = cCode[1];
          title = title.replace(COURSE_CODE_REGEX, "").replace(/[()]/g, "").trim();
        }
      }

      // Disambiguate location from title if merged
      if (title) {
        const locDisambig = extractLocationFromTitle(title, location);
        title = locDisambig.cleanTitle || title;
        if (!location && locDisambig.extractedLocation) {
          location = locDisambig.extractedLocation;
        }
      }

      if (title && (day || time)) {
        items.push({
          title,
          subject,
          day,
          date,
          time,
          location,
          instructor,
          sourceText: bLines.join(" | "),
          sourceTrace: `Blok Catatan #${bIdx + 1}`,
          type: "jadwal",
          priority: "sedang",
        });
      }
    }

    if (items.length >= 1) {
      return aiStructuringOutputSchema.parse({
        items,
        documentSummary: `Ekstraksi blok catatan menemukan ${items.length} agenda perkuliahan.`,
      });
    }
  }

  // 3. First Pass: Check for Delimited Lines with Day & Time
  for (let i = 0; i < rawLines.length; i++) {
    if (visitedLineIndices.has(i)) continue;
    const line = rawLines[i];

    // Skip pure header lines
    if (line.startsWith("[HEADER]") || line.toLowerCase().startsWith("header:") || line.toLowerCase().startsWith("kode mk |") || line.toLowerCase().startsWith("mata kuliah |")) {
      visitedLineIndices.add(i);
      continue;
    }

    // Strip row label prefix like `[Baris 2]: ` or `[Tabel 1 - Baris 2]: `
    let cleanLine = line;
    let traceLabel = `Baris ${i + 1}`;
    const traceMatch = line.match(/^\[([^\]]+)\]:\s*(.*)$/);
    if (traceMatch) {
      traceLabel = traceMatch[1];
      cleanLine = traceMatch[2];
    }

    // Check if line contains Day and Time (or separated Start Time + End Time key-values)
    const dayMatch = cleanLine.match(DAY_REGEX);
    const timeMatch = cleanLine.match(TIME_RANGE_REGEX);
    const singleTimeMatch = cleanLine.match(SINGLE_TIME_REGEX);
    const startMatch = cleanLine.match(/(?:jam\s*mulai|waktu\s*mulai|start\s*time)[:\s]*(\d{1,2}[:.]\d{2})/i);
    const endMatch = cleanLine.match(/(?:jam\s*selesai|waktu\s*selesai|end\s*time)[:\s]*(\d{1,2}[:.]\d{2})/i);

    if (dayMatch && (timeMatch || singleTimeMatch || (startMatch && endMatch))) {
      const timeRegexMatch = (timeMatch || singleTimeMatch || startMatch)!;
      const parsedItem = extractFieldsFromDelimitedLine(cleanLine, dayMatch, timeRegexMatch, traceLabel, startMatch && endMatch ? `${startMatch[1]} - ${endMatch[1]}` : undefined);
      if (parsedItem && parsedItem.title.length >= 2) {
        items.push(parsedItem);
        visitedLineIndices.add(i);
        continue;
      }
    }
  }

  return aiStructuringOutputSchema.parse({
    items,
    documentSummary: `Ekstraksi deterministik menemukan ${items.length} agenda perkuliahan.`,
  });
}

/**
 * Extracts and disambiguates schedule fields from a single delimited line
 */
function extractFieldsFromDelimitedLine(
  line: string,
  dayMatch: RegExpMatchArray,
  timeMatch: RegExpMatchArray,
  traceLabel: string,
  explicitTimeStr?: string
): RawScheduleItemInput | null {
  const day = dayMatch[1];
  const timeStr = explicitTimeStr || (timeMatch[2] ? `${timeMatch[1]} - ${timeMatch[2]}` : timeMatch[1]);

  let rawCells = line.split(/[|;\t]/).map((c) => c.trim()).filter(Boolean);
  if (rawCells.length <= 1 && line.includes(",")) {
    rawCells = line.split(",").map((c) => c.trim()).filter(Boolean);
  }

  let title = "";
  let subject: string | undefined = undefined;
  let location: string | undefined = undefined;
  let instructor: string | undefined = undefined;
  let date: string | undefined = undefined;

  // 1. Process Key-Value labels first
  const remainingCells: string[] = [];

  for (const cell of rawCells) {
    const lower = cell.toLowerCase();

    if (lower.startsWith("mata kuliah:") || lower.startsWith("matkul:") || lower.startsWith("course:") || lower.startsWith("kegiatan:")) {
      title = cell.replace(/^[^:]+:\s*/i, "").trim();
    } else if (lower.startsWith("kode:") || lower.startsWith("kode mk:") || lower.startsWith("code:")) {
      subject = cell.replace(/^[^:]+:\s*/i, "").trim();
    } else if (lower.startsWith("ruang:") || lower.startsWith("ruangan:") || lower.startsWith("room:") || lower.startsWith("lokasi:")) {
      location = cell.replace(/^[^:]+:\s*/i, "").trim();
    } else if (lower.startsWith("dosen:") || lower.startsWith("pengajar:") || lower.startsWith("lecturer:") || lower.startsWith("instruktur:")) {
      instructor = cell.replace(/^[^:]+:\s*/i, "").trim();
    } else if (lower.startsWith("tanggal:") || lower.startsWith("date:")) {
      date = cell.replace(/^[^:]+:\s*/i, "").trim();
    } else if (
      lower.startsWith("hari:") ||
      lower.startsWith("day:") ||
      lower.startsWith("waktu:") ||
      lower.startsWith("jam:") ||
      lower.startsWith("time:") ||
      lower.startsWith("jam mulai:") ||
      lower.startsWith("jam selesai:")
    ) {
      // already captured
    } else {
      remainingCells.push(cell);
    }
  }

  // 2. Classify remaining cells
  for (const cell of remainingCells) {
    const isDayCell = cell.match(DAY_REGEX) && cell.length <= 15;
    const isTimeCell = cell.match(TIME_RANGE_REGEX) || (cell.match(SINGLE_TIME_REGEX) && cell.length <= 15);
    if (isDayCell || isTimeCell) continue;

    // Course Code
    const codeMatch = cell.match(/^([A-Z]{2,4}[-\s]?\d{3,4})$/i);
    if (codeMatch && !subject) {
      subject = codeMatch[1];
      continue;
    }

    // Number index (e.g. "1", "2", "No: 1")
    if (cell.match(/^(\d{1,3}|no[:.\s]*\d{1,3})$/i)) {
      continue;
    }

    // Lecturer
    if ((cell.match(ACADEMIC_TITLES_REGEX) || cell.toLowerCase().startsWith("dr.") || cell.toLowerCase().startsWith("prof.") || cell.toLowerCase().startsWith("dosen")) && !instructor) {
      instructor = cell.replace(/^dosen[:\s-]*/i, "").trim();
      continue;
    }

    // Location / Room
    if (cell.match(/^(?:ruang|ruangan|lab|laboratorium|gedung|auditorium|aula|r\.\s*\d+|zoom|classroom|room)\b/i) && !location) {
      location = cell;
      continue;
    } else if (cell.match(ROOM_LOCATION_REGEX) && !title) {
      const roomMatch = cell.match(/\b(ruang|ruangan|lab|laboratorium|gedung|auditorium|aula|r\.\s*\d+|room)\s*[\w\d.-]*/i);
      if (roomMatch) {
        location = roomMatch[0];
        const extractedTitle = cell.replace(roomMatch[0], "").trim();
        if (extractedTitle.length >= 2) {
          title = extractedTitle;
        }
      } else {
        title = cell;
      }
      continue;
    }

    // Title
    if (!title && cell.length >= 2) {
      title = cell;
    } else if (title && !instructor && cell.length >= 3 && !cell.match(/^\d+$/)) {
      if (cell.match(/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+/)) {
        instructor = cell;
      }
    }
  }

  // 3. Fallback: Clean remaining text
  if (!title) {
    let fallback = line
      .replace(DAY_REGEX, " ")
      .replace(TIME_RANGE_REGEX, " ")
      .replace(SINGLE_TIME_REGEX, " ")
      .replace(/\[HEADER\]|\[Baris \d+\]|\[Tabel \d+ - Baris \d+\]/gi, " ")
      .replace(/pukul|jam|wib|wita|wit/gi, " ")
      .replace(/[-–—:;,|]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (location) fallback = fallback.replace(location, "");
    if (instructor) fallback = fallback.replace(instructor, "");
    if (subject) fallback = fallback.replace(subject, "");

    title = fallback.trim();
  }

  const embeddedCode = title.match(COURSE_CODE_REGEX);
  if (embeddedCode && !subject) {
    subject = embeddedCode[1];
    title = title.replace(COURSE_CODE_REGEX, "").replace(/[()]/g, "").trim();
  }

  // Disambiguate location from title if merged
  const locDisambig = extractLocationFromTitle(title, location);
  title = locDisambig.cleanTitle || title;
  if (!location && locDisambig.extractedLocation) {
    location = locDisambig.extractedLocation;
  }

  if (!title || title.length < 2) {
    return null;
  }

  return {
    title: title.replace(/[-–—:;,|]+/g, " ").trim(),
    subject,
    day,
    date,
    time: timeStr,
    location,
    instructor,
    sourceText: line,
    sourceTrace: traceLabel,
    type: "jadwal",
    priority: "sedang",
  };
}
