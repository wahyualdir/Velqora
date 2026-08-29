import { ScheduleItem, Task, ScheduleDay } from "@/types";
import { WorkloadExplanation, WorkloadFactorBreakdown } from "./types";
import { analyzeWorkload } from "./workload-analyzer";
import { analyzeTaskDeadlines } from "./deadline-analyzer";

/**
 * Generates clear, component-by-component explainability for daily academic workload
 */
export function explainDayWorkload(
  day: ScheduleDay,
  schedules: ScheduleItem[] = [],
  tasks: Task[] = []
): WorkloadExplanation {
  const workloadSummary = analyzeWorkload(schedules, tasks);
  const dayBreakdown = workloadSummary.dailyBreakdown[day];
  const deadlines = analyzeTaskDeadlines(tasks);

  const urgentTasks = deadlines.filter(
    (d) => d.urgency === "CRITICAL" || d.urgency === "URGENT"
  );

  const lectureCount = (dayBreakdown.activities || []).filter((a) => a.category === "kuliah").length;
  const studyCount = (dayBreakdown.activities || []).filter((a) => a.category === "belajar").length;

  const lectureMins = dayBreakdown.lecturesMinutes || 0;
  const studyMins = dayBreakdown.studyMinutes || 0;

  const factors: WorkloadFactorBreakdown[] = [];

  if (lectureMins > 0) {
    factors.push({
      label: "Perkuliahan & Praktikum",
      hours: parseFloat((lectureMins / 60).toFixed(1)),
      minutes: lectureMins,
      description: `${lectureCount} mata kuliah terjadwal pada hari ${day}`,
    });
  }

  if (studyMins > 0) {
    factors.push({
      label: "Sesi Belajar Mandiri & Tugas",
      hours: parseFloat((studyMins / 60).toFixed(1)),
      minutes: studyMins,
      description: `${studyCount} sesi fokus teralokasi`,
    });
  }

  if (urgentTasks.length > 0) {
    factors.push({
      label: "Tenggat Tugas Mendesak",
      hours: 0,
      minutes: 0,
      description: `${urgentTasks.length} tugas akademik dengan batas pengumpulan <72 jam`,
    });
  }

  // Construct narrative explanation
  const narrativeParts: string[] = [];
  if (lectureMins > 0) {
    narrativeParts.push(`${parseFloat((lectureMins / 60).toFixed(1))} jam kuliah`);
  }
  if (studyMins > 0) {
    narrativeParts.push(`${parseFloat((studyMins / 60).toFixed(1))} jam sesi belajar`);
  }
  if (urgentTasks.length > 0) {
    narrativeParts.push(`${urgentTasks.length} tugas dengan deadline dekat`);
  }

  let narrativeExplanation = "";
  if (narrativeParts.length > 0) {
    narrativeExplanation = `Hari ${day} tergolong ${dayBreakdown.level.toLowerCase().replace("_", " ")} karena terdapat ${narrativeParts.join(", ")}.`;
  } else {
    narrativeExplanation = `Hari ${day} memiliki agenda akademik yang lengang tanpa jadwal perkuliahan utama.`;
  }

  return {
    day,
    level: dayBreakdown.level,
    totalHours: dayBreakdown.totalHours,
    lectureHours: parseFloat((lectureMins / 60).toFixed(1)),
    studyHours: parseFloat((studyMins / 60).toFixed(1)),
    urgentTasksCount: urgentTasks.length,
    factors,
    narrativeExplanation,
  };
}
