import { ScheduleItem, Task, ScheduleDay } from "@/types";
import {
  ScheduleSnapshot,
  AcademicHealthScore,
  OptimizationProposal,
} from "@/lib/schedule-orchestration";
import {
  HealthTrendReport,
  ActualVsPlannedReport,
  RecommendationOutcomeRecord,
  BehaviorSignal2,
  EarlyWarning2Item,
} from "@/lib/schedule-outcomes/types";
import {
  WorkloadSummary,
  DeadlineAnalysisItem,
  DeadlineCoverageReport,
} from "@/lib/schedule-intelligence/types";

export interface AcademicIntelligenceCenterData {
  schedules: ScheduleItem[];
  tasks: Task[];
  snapshot: ScheduleSnapshot;
  health: AcademicHealthScore;
  healthTrend: HealthTrendReport;
  workload: WorkloadSummary;
  deadlines: DeadlineAnalysisItem[];
  deadlineCoverage: DeadlineCoverageReport[];
  behaviorSignals: BehaviorSignal2;
  topRecommendations: Array<{
    id: string;
    sessionId: string;
    title: string;
    fromDay: ScheduleDay;
    fromTime: string;
    toDay: ScheduleDay;
    toTime: string;
    durationMinutes: number;
    qualityScore: number;
    qualityLabel: string;
    impactSummary: string[];
    explanationAnswers: Record<string, string>;
  }>;
  earlyWarnings: EarlyWarning2Item[];
  adherenceReport: ActualVsPlannedReport;
  recommendationHistory: RecommendationOutcomeRecord[];
  recommendationSummary?: {
    totalRecommendations: number;
    acceptedCount: number;
    acceptanceRate: number;
    averageOutcomeScore: number;
    effectivenessRating: string;
    summary: string;
  };
  proposal: OptimizationProposal | null;
}
