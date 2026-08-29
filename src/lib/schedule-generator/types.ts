import { ScheduleDay } from "@/types";

export type TimeOfDayPreference = "pagi" | "siang" | "sore" | "malam" | "fleksibel";

export interface AutoScheduleGoalRequest {
  goalTitle: string;
  subject?: string;
  durationMinutes: number; // e.g. 60, 90, 120
  targetSessionsPerWeek: number; // e.g. 2, 3, 4, 5
  preferredDays: ScheduleDay[]; // e.g. ["Senin", "Rabu", "Jumat"]
  timePreference: TimeOfDayPreference; // "pagi" | "siang" | "sore" | "malam" | "fleksibel"
  location?: string;
  priority?: "tinggi" | "sedang" | "rendah";
}

export interface TimeSlotWindow {
  day: ScheduleDay;
  startMinutes: number;
  endMinutes: number;
  startTime: string;
  endTime: string;
}

export interface GeneratedScheduleCandidate {
  id: string;
  title: string;
  subject: string;
  day: ScheduleDay;
  startTime: string;
  endTime: string;
  time: string;
  location?: string;
  priority: "tinggi" | "sedang" | "rendah";
  type: "jadwal";
  suitabilityScore: number; // 0 - 100
  scoreReasons: string[];
  selected?: boolean;
}

export interface AutoSchedulePlanResult {
  success: boolean;
  goal: AutoScheduleGoalRequest;
  totalCandidateSlots: number;
  recommendedSessionsCount: number;
  candidates: GeneratedScheduleCandidate[];
  availabilityOverview: Record<ScheduleDay, TimeSlotWindow[]>;
  warnings?: string[];
  error?: string;
}
