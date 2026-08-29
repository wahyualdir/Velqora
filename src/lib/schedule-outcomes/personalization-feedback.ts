import { UserSchedulePreference } from "../schedule-intelligence/types";
import { SessionOutcome, PersonalizationFeedbackPrompt, TimePatternType } from "./types";
import { timeToMinutes } from "../schedule-import/normalizer";

/**
 * Compares declared user preferences against empirical session outcome behavior.
 * Purely observational and advisory — NEVER auto-mutates preferences without explicit user choice.
 */
export function evaluatePersonalizationFeedback(
  preferences: UserSchedulePreference,
  outcomes: SessionOutcome[] = []
): PersonalizationFeedbackPrompt {
  const completedSessions = outcomes.filter(
    (o) => o.status === "COMPLETED" || o.status === "PARTIALLY_COMPLETED"
  );

  // Require minimum 5 completed sessions to avoid premature conclusions
  if (completedSessions.length < 5) {
    return {
      hasDivergence: false,
      declaredWindow: `${preferences.preferredStudyStartTime} - ${preferences.preferredStudyEndTime}`,
      observedWindow: "Belum cukup data",
      dominantCompletionPercentage: 0,
      title: "Preferensi Sesuai",
      description: "Data riwayat sesi belajar belum mencukupi untuk mendeteksi deviasi preferensi.",
      options: [],
    };
  }

  // Count completions in time buckets
  let morningCount = 0;   // 06:00 - 11:00
  let afternoonCount = 0; // 11:00 - 15:00
  let eveningCount = 0;   // 15:00 - 18:30
  let nightCount = 0;     // 18:30 - 23:30

  for (const s of completedSessions) {
    const timeStr = s.actualStartTime || s.plannedStartTime;
    const min = timeToMinutes(timeStr);
    if (min === null) continue;

    if (min >= 360 && min < 660) morningCount++;
    else if (min >= 660 && min < 900) afternoonCount++;
    else if (min >= 900 && min < 1110) eveningCount++;
    else if (min >= 1110) nightCount++;
  }

  const total = morningCount + afternoonCount + eveningCount + nightCount;
  if (total === 0) {
    return {
      hasDivergence: false,
      declaredWindow: `${preferences.preferredStudyStartTime} - ${preferences.preferredStudyEndTime}`,
      observedWindow: "Belum cukup data",
      dominantCompletionPercentage: 0,
      title: "Preferensi Sesuai",
      description: "Belum ditemukan perbedaan pola waktu belajar.",
      options: [],
    };
  }

  // Find dominant empirical window
  let dominantBucket: TimePatternType = "NIGHT";
  let dominantCount = nightCount;
  let observedWindowStr = "Malam (19:00 - 21:30)";

  if (morningCount > dominantCount) {
    dominantBucket = "MORNING";
    dominantCount = morningCount;
    observedWindowStr = "Pagi (08:00 - 10:30)";
  }
  if (afternoonCount > dominantCount) {
    dominantBucket = "AFTERNOON";
    dominantCount = afternoonCount;
    observedWindowStr = "Siang (13:00 - 15:00)";
  }
  if (eveningCount > dominantCount) {
    dominantBucket = "EVENING";
    dominantCount = eveningCount;
    observedWindowStr = "Sore (16:00 - 18:00)";
  }

  const dominantPercentage = Math.round((dominantCount / total) * 100);

  // Evaluate declared preference time
  const prefStartMin = timeToMinutes(preferences.preferredStudyStartTime) || 1140; // 19:00
  let declaredBucket: TimePatternType = "NIGHT";
  if (prefStartMin >= 360 && prefStartMin < 660) declaredBucket = "MORNING";
  else if (prefStartMin >= 660 && prefStartMin < 900) declaredBucket = "AFTERNOON";
  else if (prefStartMin >= 900 && prefStartMin < 1110) declaredBucket = "EVENING";

  // Check if empirical dominant exceeds 60% and differs from declared bucket
  const hasDivergence = dominantPercentage >= 60 && dominantBucket !== declaredBucket;

  const declaredWindowStr = `${preferences.preferredStudyStartTime} - ${preferences.preferredStudyEndTime}`;

  if (!hasDivergence) {
    return {
      hasDivergence: false,
      declaredWindow: declaredWindowStr,
      observedWindow: observedWindowStr,
      dominantCompletionPercentage: dominantPercentage,
      title: "Pola Belajar Selaras",
      description: `Waktu belajar aktual Anda (${dominantPercentage}%) selaras dengan preferensi yang dinyatakan (${declaredWindowStr}).`,
      options: [],
    };
  }

  return {
    hasDivergence: true,
    declaredWindow: declaredWindowStr,
    observedWindow: observedWindowStr,
    dominantCompletionPercentage: dominantPercentage,
    title: "Penyesuaian Preferensi Belajar",
    description: `Preferensi waktu belajar Anda saat ini adalah ${declaredWindowStr}, namun ${dominantPercentage}% sesi yang berhasil diselesaikan berada pada ${observedWindowStr}.`,
    options: [
      {
        action: "PRESERVE_DECLARED",
        label: "Pertahankan Preferensi Saya",
        explanation: `Tetap gunakan waktu belajar ${declaredWindowStr} untuk usulan berikutnya.`,
      },
      {
        action: "ADAPT_TO_OBSERVED",
        label: `Gunakan Pola Aktual (${observedWindowStr})`,
        explanation: `Perbarui preferensi waktu belajar ke ${observedWindowStr} agar sesuai dengan kebiasaan nyata.`,
      },
      {
        action: "DISMISS",
        label: "Jangan Tampilkan Lagi",
        explanation: "Abaikan pemberitahuan ini dan pertahankan pengaturan saat ini.",
      },
    ],
  };
}
