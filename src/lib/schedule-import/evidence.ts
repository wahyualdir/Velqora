import { ExtractedScheduleItem, FieldEvidence } from "./types";

/**
 * Builds field-level evidence tracing each extracted property back to its source text snippet.
 */
export function buildFieldEvidence(
  item: Partial<ExtractedScheduleItem>,
  sourceSnippet: string = "",
  pageOrRow?: string | number
): FieldEvidence[] {
  const evidences: FieldEvidence[] = [];
  const source = sourceSnippet || item.sourceText || "";
  const trace = pageOrRow || item.sourceTrace;

  // Title Evidence
  if (item.title) {
    evidences.push({
      field: "title",
      value: item.title,
      sourceSnippet: extractSnippetForMatch(source, item.title),
      confidence: item.title.length >= 3 ? 0.98 : 0.75,
      pageOrRow: trace,
    });
  }

  // Day Evidence
  if (item.day) {
    evidences.push({
      field: "day",
      value: item.day,
      sourceSnippet: extractSnippetForMatch(source, item.day),
      confidence: 0.95,
      pageOrRow: trace,
    });
  }

  // Date Evidence
  if (item.date) {
    evidences.push({
      field: "date",
      value: item.date,
      sourceSnippet: extractSnippetForMatch(source, item.date),
      confidence: 0.95,
      pageOrRow: trace,
    });
  }

  // Start Time Evidence
  if (item.startTime) {
    evidences.push({
      field: "startTime",
      value: item.startTime,
      sourceSnippet: extractSnippetForMatch(source, item.startTime),
      confidence: 0.95,
      pageOrRow: trace,
    });
  }

  // End Time Evidence
  if (item.endTime) {
    evidences.push({
      field: "endTime",
      value: item.endTime,
      sourceSnippet: extractSnippetForMatch(source, item.endTime),
      confidence: item.isEstimatedEndTime ? 0.65 : 0.95,
      pageOrRow: trace,
    });
  }

  // Location / Room Evidence
  if (item.location) {
    evidences.push({
      field: "location",
      value: item.location,
      sourceSnippet: extractSnippetForMatch(source, item.location),
      confidence: 0.92,
      pageOrRow: trace,
    });
  }

  // Lecturer Evidence
  if (item.instructor || item.lecturer) {
    const val = item.instructor || item.lecturer || "";
    evidences.push({
      field: "lecturer",
      value: val,
      sourceSnippet: extractSnippetForMatch(source, val),
      confidence: 0.9,
      pageOrRow: trace,
    });
  }

  // Course Code / Subject Evidence
  if (item.subject) {
    evidences.push({
      field: "courseCode",
      value: item.subject,
      sourceSnippet: extractSnippetForMatch(source, item.subject),
      confidence: 0.95,
      pageOrRow: trace,
    });
  }

  return evidences;
}

/**
 * Extracts a contextual substring or returns full line snippet containing the query
 */
function extractSnippetForMatch(sourceText: string, targetValue: string): string {
  if (!sourceText) return targetValue;
  const idx = sourceText.toLowerCase().indexOf(targetValue.toLowerCase());
  if (idx === -1) {
    return sourceText.length > 80 ? `${sourceText.slice(0, 77)}...` : sourceText;
  }

  const start = Math.max(0, idx - 15);
  const end = Math.min(sourceText.length, idx + targetValue.length + 15);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < sourceText.length ? "..." : "";

  return `${prefix}${sourceText.slice(start, end).trim()}${suffix}`;
}
