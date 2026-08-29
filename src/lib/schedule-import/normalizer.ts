import { ExtractedScheduleItem, ScheduleDayName } from "./types";
import { RawScheduleItemInput } from "./schema";
import { evaluateConfidence2 } from "./confidence-engine";
import { buildFieldEvidence } from "./evidence";

const DAY_MAPPING: Record<string, ScheduleDayName> = {
  senin: "Senin",
  sen: "Senin",
  mon: "Senin",
  monday: "Senin",

  selasa: "Selasa",
  sel: "Selasa",
  tue: "Selasa",
  tues: "Selasa",
  tuesday: "Selasa",

  rabu: "Rabu",
  rab: "Rabu",
  wed: "Rabu",
  wednesday: "Rabu",

  kamis: "Kamis",
  kam: "Kamis",
  thu: "Kamis",
  thur: "Kamis",
  thursday: "Kamis",

  jumat: "Jumat",
  jum: "Jumat",
  "jum'at": "Jumat",
  fri: "Jumat",
  friday: "Jumat",

  sabtu: "Sabtu",
  sab: "Sabtu",
  sat: "Sabtu",
  saturday: "Sabtu",

  minggu: "Minggu",
  min: "Minggu",
  ahad: "Minggu",
  sun: "Minggu",
  sunday: "Minggu",
};

const INDONESIAN_MONTHS: Record<string, string> = {
  januari: "01",
  jan: "01",
  january: "01",
  februari: "02",
  feb: "02",
  february: "02",
  maret: "03",
  mar: "03",
  march: "03",
  april: "04",
  apr: "04",
  mei: "05",
  may: "05",
  juni: "06",
  jun: "06",
  june: "06",
  juli: "07",
  jul: "07",
  july: "07",
  agustus: "08",
  agu: "08",
  agt: "08",
  august: "08",
  aug: "08",
  september: "09",
  sep: "09",
  oktober: "10",
  okt: "10",
  october: "10",
  oct: "10",
  november: "11",
  nov: "11",
  desember: "12",
  des: "12",
  december: "12",
  dec: "12",
};

const DAY_NAMES_BY_INDEX: ScheduleDayName[] = [
  "Minggu", // 0
  "Senin",  // 1
  "Selasa", // 2
  "Rabu",   // 3
  "Kamis",  // 4
  "Jumat",  // 5
  "Sabtu",  // 6
];

/**
 * Normalizes day name to Indonesian canonical format
 */
export function normalizeDayName(rawDay?: string | null): ScheduleDayName | null {
  if (!rawDay) return null;
  const clean = rawDay
    .toLowerCase()
    .replace(/[^a-z']/g, "")
    .trim();

  if (DAY_MAPPING[clean]) {
    return DAY_MAPPING[clean];
  }

  // Substring match
  for (const [key, val] of Object.entries(DAY_MAPPING)) {
    if (clean === key || clean.startsWith(key) || (key.length >= 4 && clean.includes(key))) {
      return val;
    }
  }

  return null;
}

/**
 * Normalizes Indonesian & International Date formats to YYYY-MM-DD
 */
export function normalizeDate(rawDate?: string | null): string | null {
  if (!rawDate || !rawDate.trim()) return null;

  const clean = rawDate
    .toLowerCase()
    .replace(/^(senin|selasa|rabu|kamis|jumat|jum'at|sabtu|minggu|ahad|monday|tuesday|wednesday|thursday|friday|saturday|sunday)[,\s]+/gi, "")
    .trim();

  // Pattern 1: ISO YYYY-MM-DD
  const isoMatch = clean.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (isoMatch) {
    const yyyy = isoMatch[1];
    const mm = isoMatch[2].padStart(2, "0");
    const dd = isoMatch[3].padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  // Pattern 2: DD/MM/YYYY or DD-MM-YYYY (Indonesian standard)
  const dmyMatch = clean.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (dmyMatch) {
    const dd = dmyMatch[1].padStart(2, "0");
    const mm = dmyMatch[2].padStart(2, "0");
    const yyyy = dmyMatch[3];
    return `${yyyy}-${mm}-${dd}`;
  }

  // Pattern 3: "1 September 2026" or "01 Sep 2026" or "1-September-2026"
  const textDateMatch = clean.match(/^(\d{1,2})[\s-]+([a-zA-Z]+)[\s-]+(\d{4})$/);
  if (textDateMatch) {
    const dd = textDateMatch[1].padStart(2, "0");
    const monthWord = textDateMatch[2].toLowerCase();
    const yyyy = textDateMatch[3];
    const mm = INDONESIAN_MONTHS[monthWord];
    if (mm) {
      return `${yyyy}-${mm}-${dd}`;
    }
  }

  // Pattern 4: "September 1, 2026" or "Sep 01, 2026"
  const monthFirstMatch = clean.match(/^([a-zA-Z]+)[\s-]+(\d{1,2}),?[\s-]+(\d{4})$/);
  if (monthFirstMatch) {
    const monthWord = monthFirstMatch[1].toLowerCase();
    const dd = monthFirstMatch[2].padStart(2, "0");
    const yyyy = monthFirstMatch[3];
    const mm = INDONESIAN_MONTHS[monthWord];
    if (mm) {
      return `${yyyy}-${mm}-${dd}`;
    }
  }

  return null;
}

/**
 * Validates whether the specified Day Name matches the actual Gregorian Day of the specified Date
 */
export function validateDayDateMatch(
  dayName?: string | null,
  dateStr?: string | null
): {
  isMatch: boolean;
  actualDay: ScheduleDayName | null;
  dayDateMismatch: boolean;
  reason?: string;
} {
  const normDay = normalizeDayName(dayName);
  const normDate = normalizeDate(dateStr);

  if (!normDate) {
    return {
      isMatch: true,
      actualDay: null,
      dayDateMismatch: false,
    };
  }

  const [yyyy, mm, dd] = normDate.split("-").map((v) => parseInt(v, 10));
  if (isNaN(yyyy) || isNaN(mm) || isNaN(dd)) {
    return {
      isMatch: true,
      actualDay: null,
      dayDateMismatch: false,
    };
  }

  // Use UTC to avoid timezone shift on day of week
  const dateObj = new Date(Date.UTC(yyyy, mm - 1, dd));
  const dayIdx = dateObj.getUTCDay();
  const actualDay = DAY_NAMES_BY_INDEX[dayIdx];

  if (!normDay) {
    return {
      isMatch: true,
      actualDay,
      dayDateMismatch: false,
    };
  }

  const isMatch = normDay === actualDay;

  return {
    isMatch,
    actualDay,
    dayDateMismatch: !isMatch,
    reason: isMatch
      ? undefined
      : `Tanggal ${normDate} sebenarnya jatuh pada hari ${actualDay}, bukan ${normDay}.`,
  };
}

/**
 * Normalizes single time string (e.g. "08.00", "8:00", "08.00 WIB", "8 AM", "2 PM", "08") to canonical "HH:mm"
 */
export function normalizeSingleTime(raw?: string | null): string | null {
  if (!raw || !raw.trim()) return null;

  const clean = raw.trim().toLowerCase().replace(/pukul|jam|wib|wita|wit/gi, "").trim();

  // Handle 12-Hour AM/PM: "8 AM", "8:30 PM", "08.00 am"
  const ampmMatch = clean.match(/^(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)$/i);
  if (ampmMatch) {
    let hour = parseInt(ampmMatch[1], 10);
    const minute = ampmMatch[2] ? parseInt(ampmMatch[2], 10) : 0;
    const isPm = ampmMatch[3].toLowerCase() === "pm";

    if (hour === 12) {
      hour = isPm ? 12 : 0;
    } else if (isPm) {
      hour += 12;
    }

    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    }
  }

  // Handle 24-Hour "HH:mm" or "HH.mm"
  const colonDotMatch = clean.match(/^(\d{1,2})[:.](\d{2})/);
  if (colonDotMatch) {
    const hour = parseInt(colonDotMatch[1], 10);
    const minute = parseInt(colonDotMatch[2], 10);
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    }
  }

  // Handle single hour number "08" or "8"
  const singleHourMatch = clean.match(/^(\d{1,2})$/);
  if (singleHourMatch) {
    const hour = parseInt(singleHourMatch[1], 10);
    if (hour >= 6 && hour <= 22) {
      return `${String(hour).padStart(2, "0")}:00`;
    }
  }

  return null;
}

/**
 * Normalizes time ranges with extensive pattern support:
 * Handles:
 * "08.00-10.00", "08:00-10:00", "08.00 – 10.00", "08:00 s/d 10:00", "08:00 sampai 10:00",
 * "08-10", "8 AM - 10 AM", "8:00 AM - 10:00 AM", "13.30-15.10", "08.00 - 10.00 WIB"
 */
export function normalizeTimeRange(rawTime?: string | null): {
  startTime: string | null;
  endTime: string | null;
  formattedTime: string;
  isValid: boolean;
  isEstimatedEndTime?: boolean;
  timeIncomplete?: boolean;
  reason?: string;
} {
  if (!rawTime || !rawTime.trim()) {
    return {
      startTime: null,
      endTime: null,
      formattedTime: "--:--",
      isValid: false,
      timeIncomplete: true,
      reason: "Waktu kegiatan tidak dicantumkan.",
    };
  }

  const clean = rawTime
    .replace(/pukul|jam|wib|wita|wit/gi, "")
    .replace(/s\.?d\.?|s\/d|sampai|hingga|to|–|—/gi, "-")
    .replace(/\s+/g, " ")
    .trim();

  // Pattern A: Delimited Range "A - B"
  if (clean.includes("-") || clean.includes("/")) {
    const parts = clean.split(/[-/]/).map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      const start = normalizeSingleTime(parts[0]);
      const end = normalizeSingleTime(parts[1]);

      if (start && end) {
        if (start < end) {
          return {
            startTime: start,
            endTime: end,
            formattedTime: `${start} - ${end}`,
            isValid: true,
          };
        } else {
          return {
            startTime: start,
            endTime: end,
            formattedTime: `${start} - ${end}`,
            isValid: false,
            reason: `Waktu selesai (${end}) tidak boleh mendahului atau sama dengan waktu mulai (${start}).`,
          };
        }
      }
    }
  }

  // Pattern B: Single start time
  const single = normalizeSingleTime(clean);
  if (single) {
    const [h, m] = single.split(":").map((v) => parseInt(v, 10));
    const startMins = h * 60 + m;
    const endMins = startMins + 90; // estimated default 90m slot
    const endH = Math.min(23, Math.floor(endMins / 60));
    const endM = endMins % 60;
    const estimatedEnd = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;

    return {
      startTime: single,
      endTime: estimatedEnd,
      formattedTime: `${single} - ${estimatedEnd}`,
      isValid: true,
      isEstimatedEndTime: true,
      timeIncomplete: true,
      reason: "Waktu selesai tidak dicantumkan di dokumen, otomatis diestimasi 90 menit.",
    };
  }

  return {
    startTime: null,
    endTime: null,
    formattedTime: "--:--",
    isValid: false,
    timeIncomplete: true,
    reason: `Format waktu "${rawTime}" tidak dikenali.`,
  };
}

const LOCATION_PATTERNS: RegExp[] = [
  /\b(?:ruang|ruangan|room)\s*[:.\-]?\s*([A-Za-z0-9.\-]+(?:\s+[A-Za-z0-9.\-]+)*)\b/i,
  /\b(?:r\.|r\s+)\s*(\d{2,4}[A-Za-z]?)\b/i,
  /\b(?:lab(?:oratorium)?)\s*[:.\-]?\s*([A-Za-z0-9.\-]+(?:\s+[A-Za-z0-9.\-]+)*)\b/i,
  /\b(?:gedung\s+[A-Za-z0-9]+(?:\s+lt\.?\s*\d+)?)\b/i,
  /\b(?:auditorium|aula)(?:\s+[A-Za-z0-9]+)?\b/i,
  /\b(?:zoom|google\s*meet|teams|online)\b/i,
];

const COURSE_CODE_REGEX = /\b([A-Z]{2,4}[-\s]?\d{3,4})\b/i;

/**
 * Disambiguates location from title if location is merged inside title string.
 * e.g. "Etika Profesi Ruang 401" -> title: "Etika Profesi", location: "Ruang 401"
 * "Algoritma dan Pemrograman - Lab Komputer 2" -> title: "Algoritma dan Pemrograman", location: "Lab Komputer 2"
 */
export function extractLocationFromTitle(
  rawTitle: string,
  existingLocation?: string | null
): {
  cleanTitle: string;
  extractedLocation?: string;
} {
  let title = rawTitle.trim();
  if (!title) return { cleanTitle: "", extractedLocation: existingLocation || undefined };

  // If explicit location already exists and is not inside title, return as is
  if (existingLocation && existingLocation.trim()) {
    // Remove location from title if redundantly present
    const locClean = existingLocation.trim();
    if (title.toLowerCase().includes(locClean.toLowerCase())) {
      const cleaned = title
        .replace(new RegExp(`[-–—/:([]*\\s*${escapeRegex(locClean)}\\s*[\\])]*`, "gi"), " ")
        .replace(/\s+/g, " ")
        .replace(/[-–—/:(]+$/, "")
        .trim();
      if (cleaned.length >= 2) {
        title = cleaned;
      }
    }
    return { cleanTitle: title, extractedLocation: locClean };
  }

  // Look for location patterns in title
  for (const pattern of LOCATION_PATTERNS) {
    const match = title.match(pattern);
    if (match) {
      const fullMatchedLocation = match[0].trim();
      const remainingTitle = title
        .replace(pattern, " ")
        .replace(/[-–—/:([]+\s*$/, "")
        .replace(/^\s*[-–—/:)\]]+/, "")
        .replace(/\s+/g, " ")
        .replace(/[()[\]{}]/g, "")
        .trim();

      // Only strip if remaining title is meaningful
      if (remainingTitle.length >= 2) {
        return {
          cleanTitle: remainingTitle,
          extractedLocation: fullMatchedLocation,
        };
      }
    }
  }

  return { cleanTitle: title, extractedLocation: undefined };
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Parses and normalizes multiple lecturer strings without breaking on degree commas
 * e.g. "Dr. Budi Santoso, S.Kom., M.Kom.; Andi Pratama, M.T." or "Prof. Ir. Siti / Dr. Hendra"
 */
export function parseMultiLecturers(raw?: string | null): {
  primary: string;
  list: string[];
} {
  if (!raw || !raw.trim()) {
    return { primary: "", list: [] };
  }

  const clean = raw.trim().replace(/^dosen[:\s-]*/i, "");

  // Split only by semicolon, slash with spaces, or " dan " / " & "
  // Do NOT split by plain commas because commas separate academic degrees (e.g. Dr. Budi, S.Kom., M.T.)
  const parts = clean
    .split(/;\s*|\s+\/\s+|\s+dan\s+|\s+&\s+/i)
    .map((p) => p.trim())
    .filter((p) => p.length >= 2);

  if (parts.length === 0) {
    return { primary: clean, list: [clean] };
  }

  return {
    primary: parts.join("; "),
    list: parts,
  };
}

/**
 * Parses and normalizes multiple room/location strings
 * e.g. "Lab 1 / Lab 2" or "Ruang 401 & Ruang 402"
 */
export function parseMultiRooms(raw?: string | null): {
  primary: string;
  list: string[];
} {
  if (!raw || !raw.trim()) {
    return { primary: "", list: [] };
  }

  const clean = raw.trim().replace(/^ruang[:\s-]*/i, "");
  const parts = clean
    .split(/;\s*|\s+\/\s+|\s+dan\s+|\s+&\s+/i)
    .map((p) => p.trim())
    .filter((p) => p.length >= 2);

  if (parts.length === 0) {
    return { primary: clean, list: [clean] };
  }

  return {
    primary: parts.join(" / "),
    list: parts,
  };
}

/**
 * Master Normalizer for Schedule Item Input
 */
export function normalizeExtractedScheduleItem(
  raw: RawScheduleItemInput | Partial<ExtractedScheduleItem>,
  index: number = 0,
  sourceTraceOverride?: string
): ExtractedScheduleItem {
  let title = (raw.title || raw.subject || "").trim();
  let subject = raw.subject?.trim() || undefined;
  const rawDay = raw.day || "";
  const rawTime = raw.time || `${raw.startTime || ""} - ${raw.endTime || ""}`;
  const rawDate = raw.date || undefined;

  // 1. Extract course code from title if present
  const codeMatch = title.match(COURSE_CODE_REGEX);
  if (codeMatch && !subject) {
    subject = codeMatch[1];
    title = title.replace(COURSE_CODE_REGEX, "").replace(/[()[\]{}]/g, "").replace(/^[-–—:\s]+|[-–—:\s]+$/g, "").trim();
  }

  // 2. Disambiguate Location from Title
  const locationDisambig = extractLocationFromTitle(title, raw.location);
  title = locationDisambig.cleanTitle || title;
  const rawLocation = locationDisambig.extractedLocation || raw.location || "";

  const normalizedDay = normalizeDayName(rawDay);
  const timeNorm = normalizeTimeRange(rawTime);
  const normalizedDate = normalizeDate(rawDate);

  // Validate Day-Date Match
  const dateCheck = validateDayDateMatch(normalizedDay, normalizedDate);

  // Parse multi-lecturers and multi-rooms
  const lecturers = parseMultiLecturers(raw.instructor || raw.lecturer || "");
  const rooms = parseMultiRooms(rawLocation);

  const item: Partial<ExtractedScheduleItem> = {
    id: ("id" in raw && raw.id ? raw.id : undefined) || `ext_${index + 1}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    title,
    subject: subject || undefined,
    courseCode: subject || undefined,
    day: normalizedDay || undefined,
    date: normalizedDate || undefined,
    startTime: timeNorm.startTime || undefined,
    endTime: timeNorm.endTime || undefined,
    time: timeNorm.startTime && timeNorm.endTime ? `${timeNorm.startTime} - ${timeNorm.endTime}` : rawTime || undefined,
    isEstimatedEndTime: timeNorm.isEstimatedEndTime,
    endTimeEstimated: timeNorm.isEstimatedEndTime,
    timeIncomplete: !timeNorm.isValid,
    location: rooms.primary || undefined,
    rawLocationSnippet: rawLocation || undefined,
    instructor: lecturers.primary || undefined,
    lecturer: lecturers.primary || undefined,
    multiLecturers: lecturers.list.length > 1 ? lecturers.list : undefined,
    multiRooms: rooms.list.length > 1 ? rooms.list : undefined,
    description: raw.description?.trim() || undefined,
    type: raw.type || "jadwal",
    priority: raw.priority || "sedang",
    sourceText: raw.sourceText || "",
    sourceTrace: sourceTraceOverride || raw.sourceTrace || `Baris ${index + 1}`,
    dayDateMismatch: dateCheck.dayDateMismatch,
    dayDateMismatchReason: dateCheck.reason,
    expectedDayFromDate: dateCheck.actualDay || undefined,
  };

  // Evaluate Confidence 3.0
  const confResult = evaluateConfidence2(item);
  item.confidence = confResult.confidence;
  item.confidenceTier = confResult.confidenceTier;
  item.confidenceScore = confResult.confidenceScore;
  item.confidenceReason = confResult.confidenceReason;
  item.confidenceLevel = confResult.confidenceLevel;

  // Build Field-Level Evidence
  item.fieldEvidence = buildFieldEvidence(item, item.sourceText, item.sourceTrace);

  // Pre-selection: Select only High Confidence and Review Required items without mismatch and with complete time by default
  item.selected =
    (confResult.confidence === "verified" || confResult.confidence === "needs_review") &&
    !dateCheck.dayDateMismatch &&
    !!item.startTime &&
    !item.timeIncomplete;

  return item as ExtractedScheduleItem;
}

export { timeToMinutes, minutesToTime } from "./conflict-engine";
export { evaluateConfidence, evaluateConfidence2 } from "./confidence-engine";

