import { ScheduleItem, ScheduleDay } from "@/types";
import {
  MissedSessionRecoveryReport,
  MissedSessionRecoveryOption,
} from "./types";
import { analyzeFreeTimeSlots, minutesToTimeStr } from "./free-time-analyzer";
import { timeToMinutes } from "../schedule-import/normalizer";

const ALL_DAYS: ScheduleDay[] = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

/**
 * Discovers non-conflicting recovery alternatives when a study session has passed uncompleted
 */
export function planMissedSessionRecovery(
  missedSession: ScheduleItem,
  existingSchedules: ScheduleItem[] = [],
  currentDay: ScheduleDay = "Senin"
): MissedSessionRecoveryReport {
  const sessionStart = missedSession.start_time || (missedSession.time ? missedSession.time.split("-")[0]?.trim() : "") || "08:00";
  const sessionEnd = missedSession.end_time || (missedSession.time ? missedSession.time.split("-")[1]?.trim() : "") || "09:30";
  const sessionDuration = Math.max(45, (timeToMinutes(sessionEnd) || 90) - (timeToMinutes(sessionStart) || 0));

  const options: MissedSessionRecoveryOption[] = [];

  // Exclude the missed session itself from conflict checks
  const baseSchedules = existingSchedules.filter((s) => s.id !== missedSession.id);

  // 1. Opsi A: Recovery Hari Ini
  const todayFreeSlots = analyzeFreeTimeSlots(currentDay, baseSchedules, {
    minBreakMinutes: 30,
    minSlotDurationMinutes: 45,
  });

  const validTodaySlot = todayFreeSlots.find((s) => s.durationMinutes >= sessionDuration);
  if (validTodaySlot) {
    const sStartMin = timeToMinutes(validTodaySlot.startTime)!;
    const sEnd = minutesToTimeStr(sStartMin + sessionDuration);

    options.push({
      optionId: "TODAY",
      title: "Sesi Pengganti Hari Ini",
      description: `Menjadwalkan ulang '${missedSession.title}' hari ini pada pukul ${validTodaySlot.startTime}–${sEnd}.`,
      day: currentDay,
      startTime: validTodaySlot.startTime,
      endTime: sEnd,
      durationMinutes: sessionDuration,
      qualityScore: 92,
      isRecommended: true,
    });
  }

  // 2. Opsi B: Recovery Besok
  const curIdx = ALL_DAYS.indexOf(currentDay);
  const nextDay = ALL_DAYS[(curIdx + 1) % ALL_DAYS.length];

  const tomorrowFreeSlots = analyzeFreeTimeSlots(nextDay, baseSchedules, {
    minBreakMinutes: 30,
    minSlotDurationMinutes: 45,
  });

  const validTomorrowSlot = tomorrowFreeSlots.find((s) => s.durationMinutes >= sessionDuration);
  if (validTomorrowSlot) {
    const sStartMin = timeToMinutes(validTomorrowSlot.startTime)!;
    const sEnd = minutesToTimeStr(sStartMin + sessionDuration);

    options.push({
      optionId: "TOMORROW",
      title: "Sesi Pengganti Besok",
      description: `Memindahkan sesi ke hari ${nextDay} pukul ${validTomorrowSlot.startTime}–${sEnd}.`,
      day: nextDay,
      startTime: validTomorrowSlot.startTime,
      endTime: sEnd,
      durationMinutes: sessionDuration,
      qualityScore: 84,
      isRecommended: options.length === 0,
    });
  }

  // 3. Opsi C: Sesi Terbagi (2 x 45m jika durasi >= 90m)
  if (sessionDuration >= 90 && (todayFreeSlots.length >= 2 || (todayFreeSlots.length >= 1 && todayFreeSlots[0].durationMinutes >= 120))) {
    if (todayFreeSlots.length >= 2) {
      const slot1 = todayFreeSlots[0];
      const slot2 = todayFreeSlots[1];

      const slot1StartMin = timeToMinutes(slot1.startTime)!;
      const slot1End = minutesToTimeStr(slot1StartMin + 45);

      const slot2StartMin = timeToMinutes(slot2.startTime)!;
      const slot2End = minutesToTimeStr(slot2StartMin + 45);

      options.push({
        optionId: "SPLIT",
        title: "Sesi Terbagi (2 × 45 Menit)",
        description: `Membagi sesi menjadi 2 bagian fokus: ${slot1.startTime}–${slot1End} dan ${slot2.startTime}–${slot2End}.`,
        day: currentDay,
        startTime: slot1.startTime,
        endTime: slot2End,
        durationMinutes: 90,
        splitSessions: [
          { day: currentDay, startTime: slot1.startTime, endTime: slot1End, durationMinutes: 45 },
          { day: currentDay, startTime: slot2.startTime, endTime: slot2End, durationMinutes: 45 },
        ],
        qualityScore: 78,
        isRecommended: false,
      });
    } else {
      const slot = todayFreeSlots[0];
      const startMin = timeToMinutes(slot.startTime)!;
      const part1End = minutesToTimeStr(startMin + 45);
      const part2Start = minutesToTimeStr(startMin + 75); // with 30m break
      const part2End = minutesToTimeStr(startMin + 120);

      options.push({
        optionId: "SPLIT",
        title: "Sesi Terbagi (2 × 45 Menit)",
        description: `Membagi sesi menjadi 2 bagian dengan jeda istirahat: ${slot.startTime}–${part1End} dan ${part2Start}–${part2End}.`,
        day: currentDay,
        startTime: slot.startTime,
        endTime: part2End,
        durationMinutes: 90,
        splitSessions: [
          { day: currentDay, startTime: slot.startTime, endTime: part1End, durationMinutes: 45 },
          { day: currentDay, startTime: part2Start, endTime: part2End, durationMinutes: 45 },
        ],
        qualityScore: 78,
        isRecommended: false,
      });
    }
  }

  const hasSafeRecoverySlot = options.length > 0;
  const explanation = hasSafeRecoverySlot
    ? `Ditemukan ${options.length} alternatif waktu luang aman bebas bentrok untuk menggantikan sesi '${missedSession.title}'.`
    : `Tidak tersedia slot aman yang cukup pada hari ini dan esok. Sistem tidak akan memaksakan penambahan sesi.`;

  return {
    session: missedSession,
    missedDay: (missedSession.day as ScheduleDay) || currentDay,
    missedTime: `${sessionStart} - ${sessionEnd}`,
    hasSafeRecoverySlot,
    options,
    explanation,
  };
}
