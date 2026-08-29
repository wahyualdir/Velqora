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

// ==========================================
// FASE 31: ADAPTIVE INTELLIGENCE & DIFF CONTRACTS
// ==========================================

export type ScheduleDiffType =
  | "ADDED"
  | "REMOVED"
  | "TIME_CHANGED"
  | "DATE_CHANGED"
  | "ROOM_CHANGED"
  | "LECTURER_CHANGED"
  | "TITLE_CHANGED"
  | "UNCHANGED";

export interface ScheduleDiffItem {
  identityKey: string;
  diffType: ScheduleDiffType;
  description: string;
  previousItem?: ScheduleItem;
  incomingItem?: Partial<ScheduleItem>;
  changes: Array<{
    field: string;
    previousValue: any;
    newValue: any;
  }>;
  selectedAction: "ADD" | "UPDATE" | "KEEP_OLD" | "REMOVE" | "IGNORE";
}

export interface ScheduleDiffResult {
  totalIncoming: number;
  totalExisting: number;
  addedCount: number;
  removedCount: number;
  changedCount: number;
  unchangedCount: number;
  items: ScheduleDiffItem[];
  categorized: {
    added: ScheduleDiffItem[];
    changed: ScheduleDiffItem[];
    unchanged: ScheduleDiffItem[];
    removed: ScheduleDiffItem[];
  };
  summary: string;
}

export interface RecommendationQualityBreakdown {
  score: number; // 0 - 100
  label: "Sangat Cocok" | "Optimal" | "Cukup" | "Perlu Penyesuaian";
  factors: {
    deadlineUrgencyScore: number; // max 30
    freeTimeAdequacyScore: number; // max 20
    zeroConflictScore: number; // max 15
    workloadBalanceScore: number; // max 15
    breakComplianceScore: number; // max 10
    preferredTimeScore: number; // max 10
  };
  explanations: string[];
}

export interface RescheduleAlternative {
  slot: FreeTimeSlot;
  quality: RecommendationQualityBreakdown;
  explanation: RecommendationExplanation;
  isRecommended: boolean;
}

export interface RescheduleImpactReport {
  hasImpact: boolean;
  eventChanged: {
    id?: string;
    title: string;
    day: ScheduleDay;
    previousTime?: string;
    newStartTime: string;
    newEndTime: string;
  };
  affectedSchedules: ScheduleItem[];
  affectedStudySessions: ScheduleItem[];
  affectedTasks: Task[];
  lostFreeTimeMinutes: number;
  gainedFreeTimeMinutes: number;
  newConflictsCount: number;
  resolvedConflictsCount: number;
  workloadBefore: WorkloadLevel;
  workloadAfter: WorkloadLevel;
  deadlineRiskIncreased: boolean;
  recommendedAlternatives: RescheduleAlternative[];
  humanSummary: string;
}

export interface AdaptiveScheduleContext {
  userId: string;
  currentDateIso: string;
  currentDay: ScheduleDay;
  todayLectures: ScheduleItem[];
  weekLectures: ScheduleItem[];
  activeStudySessions: ScheduleItem[];
  activeTasks: Task[];
  criticalDeadlines: DeadlineAnalysisItem[];
  todayFreeSlots: FreeTimeSlot[];
  todayWorkload: DayWorkloadBreakdown;
  weeklyWorkload: WorkloadSummary;
  isOverloaded: boolean;
  recoveryModeActive: boolean;
  activeConflictsCount: number;
  incompleteTasksCount: number;
}

export interface ImportUpdateModePayload {
  selectedDiffItems: ScheduleDiffItem[];
  correlationId?: string;
}

export interface ImportUpdateModeResult {
  success: boolean;
  addedCount: number;
  updatedCount: number;
  removedCount: number;
  ignoredCount: number;
  savedSchedules: ScheduleItem[];
  errors: string[];
}

