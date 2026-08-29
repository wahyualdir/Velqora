import { ConfidenceTier, ExtractedScheduleItem, ScheduleConfidence } from "./types";

export interface ConfidenceEvaluationResult {
  confidence: ScheduleConfidence;
  confidenceTier: ConfidenceTier;
  confidenceScore: number;
  confidenceReason: string;
  confidenceReasons: string[];
  confidenceLevel: "sangat_yakin" | "perlu_pemeriksaan_ringan" | "perlu_pemeriksaan" | "tidak_yakin";
}

/**
 * Evaluates schedule confidence based strictly on observable evidence and defect penalties.
 */
export function evaluateConfidence2(
  item: Partial<ExtractedScheduleItem>
): ConfidenceEvaluationResult {
  let score = 0;
  const reasons: string[] = [];
  const structuredReasons: string[] = [];

  // 1. Evidence Additions
  if (item.title && item.title.trim().length >= 2) {
    if (item.title.trim().length >= 4 && !/^\d+$/.test(item.title.trim())) {
      score += 0.25;
      reasons.push("Nama kegiatan/mata kuliah valid");
      structuredReasons.push("✓ Mata kuliah ditemukan");
    } else {
      score += 0.10;
      reasons.push("Nama kegiatan sangat pendek atau numerik");
      structuredReasons.push("⚠ Nama mata kuliah sangat pendek");
    }
  } else {
    return {
      confidence: "invalid",
      confidenceTier: "INVALID",
      confidenceScore: 0.1,
      confidenceReason: "Nama kegiatan / mata kuliah tidak ditemukan.",
      confidenceReasons: ["✕ Mata kuliah tidak ditemukan"],
      confidenceLevel: "tidak_yakin",
    };
  }

  if (item.day) {
    score += 0.15;
    reasons.push("Hari teridentifikasi");
    structuredReasons.push("✓ Hari ditemukan");
  } else {
    structuredReasons.push("⚠ Hari tidak tertera");
  }

  if (item.startTime) {
    score += 0.15;
    reasons.push("Waktu mulai teridentifikasi");
    structuredReasons.push("✓ Waktu mulai ditemukan");
  } else {
    structuredReasons.push("⚠ Waktu mulai tidak ditemukan");
  }

  if (item.endTime) {
    if (item.isEstimatedEndTime) {
      score += 0.05;
      reasons.push("Waktu selesai diestimasi (tidak tertera eksplisit di dokumen)");
      structuredReasons.push("⚠ Waktu selesai diestimasi");
    } else {
      score += 0.15;
      reasons.push("Waktu selesai eksplisit");
      structuredReasons.push("✓ Waktu selesai ditemukan");
    }
  } else {
    structuredReasons.push("⚠ Waktu selesai tidak ditemukan");
  }

  if (item.location) {
    score += 0.10;
    reasons.push("Ruangan/lokasi terdeteksi");
    structuredReasons.push("✓ Ruangan ditemukan");
  } else {
    structuredReasons.push("⚠ Ruangan tidak ditemukan");
  }

  if (item.instructor || item.lecturer) {
    score += 0.10;
    reasons.push("Dosen/pengajar terdeteksi");
    structuredReasons.push("✓ Dosen pengampu ditemukan");
  } else {
    structuredReasons.push("⚠ Dosen tidak ditemukan");
  }

  if (item.subject || item.courseCode) {
    score += 0.05;
    reasons.push("Kode mata kuliah teridentifikasi");
    structuredReasons.push("✓ Kode mata kuliah terverifikasi");
  }

  if (item.date && !item.dayDateMismatch) {
    score += 0.10;
    reasons.push("Tanggal terverifikasi");
    structuredReasons.push("✓ Tanggal terverifikasi");
  }

  // 2. Defect Penalties
  if (item.dayDateMismatch) {
    score -= 0.30;
    reasons.push("Hari dan tanggal tidak konsisten (perlu konfirmasi)");
    structuredReasons.push("✕ Hari dan tanggal tidak konsisten");
  }

  if (item.timeIncomplete || (!item.startTime && !item.time)) {
    score -= 0.25;
    reasons.push("Rentang waktu tidak lengkap");
    structuredReasons.push("✕ Rentang waktu tidak lengkap");
  }

  const finalScore = Math.max(0.1, Math.min(1.0, Number(score.toFixed(2))));

  // 3. Tier Classification
  if (finalScore >= 0.75 && !item.dayDateMismatch && item.startTime && item.day) {
    return {
      confidence: "verified",
      confidenceTier: "HIGH_CONFIDENCE",
      confidenceScore: finalScore,
      confidenceReason: reasons.join(" • "),
      confidenceReasons: structuredReasons,
      confidenceLevel: finalScore >= 0.90 ? "sangat_yakin" : "perlu_pemeriksaan_ringan",
    };
  }

  if (finalScore >= 0.45 || item.dayDateMismatch || item.isEstimatedEndTime || item.timeIncomplete) {
    return {
      confidence: "needs_review",
      confidenceTier: "REVIEW_REQUIRED",
      confidenceScore: finalScore,
      confidenceReason: reasons.join(" • "),
      confidenceReasons: structuredReasons,
      confidenceLevel: "perlu_pemeriksaan",
    };
  }

  if (finalScore >= 0.30) {
    return {
      confidence: "low_confidence",
      confidenceTier: "LOW_CONFIDENCE",
      confidenceScore: finalScore,
      confidenceReason: reasons.join(" • "),
      confidenceReasons: structuredReasons,
      confidenceLevel: "tidak_yakin",
    };
  }

  return {
    confidence: "invalid",
    confidenceTier: "INVALID",
    confidenceScore: finalScore,
    confidenceReason: "Informasi jadwal tidak memadai atau tidak valid.",
    confidenceReasons: structuredReasons,
    confidenceLevel: "tidak_yakin",
  };
}

/**
 * Legacy signature evaluateConfidence helper for backward compatibility
 */
export function evaluateConfidence(
  isTitleValid: boolean,
  isDayRecognized: boolean,
  isTimeValid: boolean,
  isEstimatedEndTime: boolean,
  dayDateMismatch: boolean,
  hasInstructor: boolean,
  hasLocation: boolean
): { score: number; legacyConfidence: ScheduleConfidence } {
  let score = 0;
  if (isTitleValid) score += 0.25;
  if (isDayRecognized) score += 0.25;
  if (isTimeValid) score += 0.20;
  if (!isEstimatedEndTime) score += 0.10;
  if (hasInstructor) score += 0.10;
  if (hasLocation) score += 0.10;
  if (dayDateMismatch) score -= 0.30;
  score = Math.max(0.1, Math.min(1.0, Number(score.toFixed(2))));
  const legacyConfidence: ScheduleConfidence = score >= 0.75 && !dayDateMismatch ? "verified" : "needs_review";
  return { score, legacyConfidence };
}

