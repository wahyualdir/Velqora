import { ScheduleDay } from "@/types";

export type TimeOfDayPreference = "pagi" | "siang" | "sore" | "malam" | "fleksibel";

export type WorkloadLevel = "ringan" | "optimal" | "padat";

export interface AutoScheduleGoalRequest {
  goalTitle: string;
  subject?: string;
  durationMinutes: number; // e.g. 45, 60, 90, 120
  targetSessionsPerWeek: number; // e.g. 2, 3, 4, 5
  targetTotalHours?: number; // e.g. 4, 6, 8 hours total
  preferredDays: ScheduleDay[]; // e.g. ["Senin", "Rabu", "Jumat"]
  timePreference: TimeOfDayPreference; // "pagi" | "siang" | "sore" | "malam" | "fleksibel"
  deadline?: string; // ISO date string or YYYY-MM-DD
  maxDailyStudyMinutes?: number; // e.g. 180 or 240 mins
  minBreakMinutes?: number; // e.g. 15 or 30 mins
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
  explanation: string; // Human-readable explainable rationale
  deadlineProximityDays?: number;
  workloadImpact?: string;
  selected?: boolean;
}

export interface AutoSchedulePlanResult {
  success: boolean;
  goal: AutoScheduleGoalRequest;
  totalCandidateSlots: number;
  recommendedSessionsCount: number;
  totalStudyHours: number;
  workloadLevel: WorkloadLevel;
  candidates: GeneratedScheduleCandidate[];
  availabilityOverview: Record<ScheduleDay, TimeSlotWindow[]>;
  deadlineInfo?: {
    deadlineDate: string;
    daysRemaining: number;
    isUrgent: boolean;
  };
  warnings?: string[];
  error?: string;
}
