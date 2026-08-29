import { ScheduleItem, Task, ScheduleDay } from "@/types";

export type WorkloadLevel = "RINGAN" | "NORMAL" | "PADAT" | "SANGAT_PADAT";

export type DeadlineUrgency = "CRITICAL" | "URGENT" | "UPCOMING" | "SAFE" | "OVERDUE";

export interface WorkloadActivityEvidence {
  category: "kuliah" | "belajar" | "tugas" | "lainnya";
  title: string;
  durationMinutes: number;
  timeSnippet: string;
}

export interface DayWorkloadBreakdown {
  day: ScheduleDay;
  date?: string;
  lecturesMinutes: number;
  studyMinutes: number;
  taskMinutes: number;
  totalMinutes: number;
  totalHours: number;
  level: WorkloadLevel;
  activities: WorkloadActivityEvidence[];
  isOverloaded: boolean;
}

export interface WorkloadSummary {
  isSufficientData: boolean;
  totalWeeklyMinutes: number;
  totalWeeklyHours: number;
  averageDailyMinutes: number;
  averageDailyHours: number;
  overallLevel: WorkloadLevel;
  dailyBreakdown: Record<ScheduleDay, DayWorkloadBreakdown>;
  overloadedDaysCount: number;
  evidenceSummary: string[];
}

export interface DeadlineAnalysisItem {
  taskId: string;
  title: string;
  subject?: string;
  deadlineDate: string;
  deadlineIso: string;
  hoursRemaining: number;
  daysRemaining: number;
  urgency: DeadlineUrgency;
  urgencyLabel: string;
  urgencyExplanation: string;
  estimatedMinutesToComplete: number;
  priority: "tinggi" | "sedang" | "rendah";
  isOverdue: boolean;
}

export interface FreeTimeSlot {
  id: string;
  day: ScheduleDay;
  date?: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  bufferMinutesBefore: number;
  bufferMinutesAfter: number;
  suitabilityScore: number;
  isPeakFocusSlot: boolean;
}

export interface RecommendationExplanation {
  summary: string;
  factors: string[];
  evidence: string[];
  constraintsApplied: string[];
}

export interface ScheduleRecommendation {
  id: string;
  activity: string;
  subject?: string;
  day: ScheduleDay;
  date?: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  priority: "tinggi" | "sedang" | "rendah";
  reason: string;
  evidence: string[];
  conflictStatus: "VERIFIED_NO_CONFLICT" | "POTENTIAL_OVERLAP" | "RESOLVED";
  confidence: number;
  explanation: RecommendationExplanation;
  taskId?: string;
  selected?: boolean;
}

export interface DailyPlanRequest {
  date: string; // YYYY-MM-DD
  day?: ScheduleDay;
  targetStudyHours?: number;
  priorityTaskIds?: string[];
  maxDailyStudyMinutes?: number;
  minBreakMinutes?: number;
  timePreference?: "pagi" | "siang" | "sore" | "malam" | "fleksibel";
}

export interface DailyPlanResult {
  success: boolean;
  date: string;
  day: ScheduleDay;
  totalMinutesPlanned: number;
  totalHoursPlanned: number;
  targetMet: boolean;
  recommendedSessions: ScheduleRecommendation[];
  freeSlotsRemaining: FreeTimeSlot[];
  workloadStatus: WorkloadLevel;
  warnings: string[];
  error?: string;
}

export interface WeeklyPlanRequest {
  weekStartDate?: string;
  targetStudyHoursTotal: number;
  maxDailyStudyMinutes?: number;
  minBreakMinutes?: number;
  preferredDays?: ScheduleDay[];
  timePreference?: "pagi" | "siang" | "sore" | "malam" | "fleksibel";
}

export interface WeeklyPlanResult {
  success: boolean;
  totalWeeklyMinutesPlanned: number;
  totalWeeklyHoursPlanned: number;
  recommendedSessionsCount: number;
  sessions: ScheduleRecommendation[];
  dailyBreakdown: Record<ScheduleDay, {
    sessions: ScheduleRecommendation[];
    totalMinutes: number;
    level: WorkloadLevel;
  }>;
  overloadedDays: ScheduleDay[];
  warnings: string[];
  error?: string;
}

export interface RescheduleProposal {
  impactedSessionId: string;
  originalDay: ScheduleDay;
  originalStartTime: string;
  originalEndTime: string;
  title: string;
  proposedSlot: FreeTimeSlot;
  reason: string;
}

export interface RescheduleImpact {
  hasImpact: boolean;
  changedEvent: {
    title: string;
    day: ScheduleDay;
    newStartTime: string;
    newEndTime: string;
  };
  impactedSessionsCount: number;
  proposals: RescheduleProposal[];
  warnings: string[];
}

export interface ScheduleIntelligenceContext {
  userId: string;
  generatedAt: string;
  schedules: ScheduleItem[];
  tasks: Task[];
  workload: WorkloadSummary;
  deadlines: DeadlineAnalysisItem[];
  availableSlotsCount: number;
}
