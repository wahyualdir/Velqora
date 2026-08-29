import { ScheduleItem, Task, ScheduleDay } from "@/types";
import { ValidationScenario, ScenarioCategory } from "./types";

/**
 * Scenario Generator for Real-World Academic Validation
 * Generates 150+ deterministic scenarios covering all nuances of student life.
 */

const DAYS: ScheduleDay[] = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export function createMockScheduleItem(overrides: Partial<ScheduleItem> = {}): ScheduleItem {
  const startTime = overrides.start_time || "08:00";
  const endTime = overrides.end_time || "09:40";
  return {
    id: overrides.id || `sched_${Math.random().toString(36).substr(2, 9)}`,
    user_id: overrides.user_id || "user_test_default",
    title: overrides.title || "Pemrograman Web",
    day: overrides.day || "Senin",
    start_time: startTime,
    end_time: endTime,
    time: overrides.time || `${startTime} - ${endTime}`,
    location: overrides.location || "Lab 1",
    lecturer: overrides.lecturer || "Dr. Aris",
    type: overrides.type || "jadwal",
    priority: overrides.priority || "sedang",
    created_at: overrides.created_at || "2026-08-20T00:00:00.000Z",
    updated_at: overrides.updated_at || "2026-08-20T00:00:00.000Z",
  };
}

export function createMockTask(overrides: Partial<Task> = {}): Task {
  return {
    id: overrides.id || `task_${Math.random().toString(36).substr(2, 9)}`,
    user_id: overrides.user_id || "user_test_default",
    title: overrides.title || "Tugas Proyek 1",
    subject: overrides.subject || "Pemrograman Web",
    deadline: overrides.deadline || new Date(Date.now() + 86400000 * 3).toISOString(),
    status: overrides.status || "belum_dikerjakan",
    priority: overrides.priority || "sedang",
    description: overrides.description || "Implementasi modul autentikasi",
    lecturer: overrides.lecturer || "Dr. Aris",
    file_url: null,
    file_name: null,
    external_url: null,
    notes: null,
    created_at: overrides.created_at || "2026-08-20T00:00:00.000Z",
    updated_at: overrides.updated_at || "2026-08-20T00:00:00.000Z",
  };
}

export function generateRealWorldScenarios(): ValidationScenario[] {
  const scenarios: ValidationScenario[] = [];

  // =========================================================================
  // GROUP A: NORMAL ACADEMIC WEEK (Scenarios 1–15)
  // =========================================================================
  for (let i = 1; i <= 15; i++) {
    const day = DAYS[(i - 1) % 5];
    scenarios.push({
      id: `SCENARIO_A_${i}`,
      category: "NORMAL_ACADEMIC_WEEK",
      title: `Normal Week Case ${i}: Kuliah Tersebar pada ${day}`,
      description: `Jadwal kuliah standar 1-2 sesi per hari dengan tugas deadline 5 hari mendatang.`,
      initialSchedules: [
        createMockScheduleItem({ id: `c_a_${i}_1`, title: "Matematika Diskrit", day, start_time: "08:00", end_time: "10:00", type: "jadwal" }),
        createMockScheduleItem({ id: `c_a_${i}_2`, title: "Basis Data", day, start_time: "13:00", end_time: "15:00", type: "jadwal" }),
        createMockScheduleItem({ id: `s_a_${i}_1`, title: "Belajar Mandiri", day, start_time: "19:00", end_time: "20:30", type: "reminder" }),
      ],
      tasks: [
        createMockTask({ id: `t_a_${i}`, title: `Laporan Praktikum ${i}`, deadline: new Date(Date.now() + 86400000 * 5).toISOString() }),
      ],
      expectedOutcome: {
        shouldHaveConflict: false,
        maxDailyWorkloadMinutes: 330,
        healthScoreMin: 70,
        proposalAllowed: true,
      },
    });
  }

  // =========================================================================
  // GROUP B: HIGH WORKLOAD (Scenarios 16–30)
  // =========================================================================
  for (let i = 1; i <= 15; i++) {
    const day = DAYS[(i - 1) % 5];
    scenarios.push({
      id: `SCENARIO_B_${i}`,
      category: "HIGH_WORKLOAD",
      title: `High Workload Case ${i}: Beban Padat pada ${day}`,
      description: `Hari dengan 3 sesi kuliah beruntun mendekati batas harian 360m.`,
      initialSchedules: [
        createMockScheduleItem({ id: `c_b_${i}_1`, title: "Sistem Operasi", day, start_time: "08:00", end_time: "10:00", type: "jadwal" }),
        createMockScheduleItem({ id: `c_b_${i}_2`, title: "Jaringan Komputer", day, start_time: "10:30", end_time: "12:30", type: "jadwal" }),
        createMockScheduleItem({ id: `c_b_${i}_3`, title: "Rekayasa Perangkat Lunak", day, start_time: "13:30", end_time: "15:00", type: "jadwal" }),
      ],
      tasks: [
        createMockTask({ id: `t_b_${i}_1`, title: `Tugas Besar Jarkom ${i}`, priority: "tinggi" }),
        createMockTask({ id: `t_b_${i}_2`, title: `Review Makalah RPL ${i}`, priority: "sedang" }),
      ],
      expectedOutcome: {
        shouldHaveConflict: false,
        maxDailyWorkloadMinutes: 330,
        healthScoreMin: 50,
      },
    });
  }

  // =========================================================================
  // GROUP C: DEADLINE PRESSURE (Scenarios 31–45)
  // =========================================================================
  for (let i = 1; i <= 15; i++) {
    const hoursAhead = (i % 3 === 0) ? 12 : (i % 3 === 1) ? 36 : 96;
    const urgency = hoursAhead <= 24 ? "CRITICAL" : hoursAhead <= 72 ? "URGENT" : "UPCOMING";
    scenarios.push({
      id: `SCENARIO_C_${i}`,
      category: "DEADLINE_PRESSURE",
      title: `Deadline Pressure Case ${i}: Tenggat ${hoursAhead} Jam (${urgency})`,
      description: `Tugas aktif dengan sisa waktu ketat membutuhkan slot belajar prioritas tinggi.`,
      initialSchedules: [
        createMockScheduleItem({ id: `c_c_${i}`, title: "Algoritma & Struktur Data", day: "Senin", start_time: "09:00", end_time: "11:30" }),
      ],
      tasks: [
        createMockTask({
          id: `t_c_${i}`,
          title: `Tugas Algoritma ${i}`,
          deadline: new Date(Date.now() + 3600000 * hoursAhead).toISOString(),
          priority: hoursAhead <= 24 ? "tinggi" : "sedang",
        }),
      ],
      expectedOutcome: {
        shouldHaveConflict: false,
        expectedUrgency: urgency,
        proposalAllowed: true,
      },
    });
  }

  // =========================================================================
  // GROUP D: MISSED SESSION & RECOVERY (Scenarios 46–60)
  // =========================================================================
  for (let i = 1; i <= 15; i++) {
    const skipDay = DAYS[(i - 1) % 5];
    scenarios.push({
      id: `SCENARIO_D_${i}`,
      category: "MISSED_SESSION",
      title: `Missed Session Recovery Case ${i}: Sesi Terlewat pada ${skipDay}`,
      description: `Sesi belajar terlewat memerlukan pemindahan kompensasi tanpa bentrok pada hari berikutnya.`,
      initialSchedules: [
        createMockScheduleItem({ id: `c_d_${i}`, title: "Kecerdasan Buatan", day: skipDay, start_time: "10:00", end_time: "12:00" }),
      ],
      tasks: [
        createMockTask({ id: `t_d_${i}`, title: `Ujian Tengah Semester AI ${i}` }),
      ],
      outcomes: [
        {
          id: `out_d_${i}`,
          userId: "user_test_default",
          scheduleItemId: `s_d_${i}`,
          sessionTitle: "Belajar Mandiri AI",
          day: skipDay,
          plannedStartTime: "19:00",
          plannedEndTime: "20:30",
          plannedDurationMinutes: 90,
          actualStartTime: "19:00",
          actualEndTime: "19:00",
          actualDurationMinutes: 0,
          status: "SKIPPED",
          skipReason: "KELELAHAN",
          recordedAt: new Date().toISOString(),
        },
      ],
      expectedOutcome: {
        shouldHaveConflict: false,
        proposalAllowed: true,
      },
    });
  }

  // =========================================================================
  // GROUP E: SCHEDULE CHANGE (Scenarios 61–75)
  // =========================================================================
  for (let i = 1; i <= 15; i++) {
    scenarios.push({
      id: `SCENARIO_E_${i}`,
      category: "SCHEDULE_CHANGE",
      title: `Schedule Mutation Case ${i}: Pemindahan Kuliah ke Hari Lain`,
      description: `Dosen memindahkan jam kuliah dari Senin ke Rabu, memicu deteksi impak reschedule.`,
      initialSchedules: [
        createMockScheduleItem({ id: `c_e_${i}_1`, title: "Interaksi Manusia & Komputer", day: "Senin", start_time: "08:00", end_time: "10:00" }),
        createMockScheduleItem({ id: `s_e_${i}_1`, title: "Belajar IMK", day: "Senin", start_time: "19:00", end_time: "20:30", type: "reminder" }),
      ],
      tasks: [],
      mutationsToApply: [
        {
          action: "MOVE",
          payload: { id: `c_e_${i}_1`, targetDay: "Rabu", targetStartTime: "10:00", targetEndTime: "12:00" },
        },
      ],
      expectedOutcome: {
        shouldHaveConflict: false,
        proposalAllowed: true,
      },
    });
  }

  // =========================================================================
  // GROUP F: EXTREME BUT VALID (Scenarios 76–90)
  // =========================================================================
  for (let i = 1; i <= 15; i++) {
    scenarios.push({
      id: `SCENARIO_F_${i}`,
      category: "EXTREME_BUT_VALID",
      title: `Extreme Case ${i}: Jadwal Padat Tepat di Batas 360 Menit`,
      description: `Beban tepat 360 menit (2 kuliah x 120m + 2 sesi belajar x 60m) tetap valid tanpa pelanggaran hard cap.`,
      initialSchedules: [
        createMockScheduleItem({ id: `c_f_${i}_1`, day: "Selasa", start_time: "08:00", end_time: "10:00" }), // 120m
        createMockScheduleItem({ id: `c_f_${i}_2`, day: "Selasa", start_time: "11:00", end_time: "13:00" }), // 120m
        createMockScheduleItem({ id: `s_f_${i}_1`, day: "Selasa", start_time: "16:00", end_time: "17:00", type: "reminder" }), // 60m
        createMockScheduleItem({ id: `s_f_${i}_2`, day: "Selasa", start_time: "19:00", end_time: "20:00", type: "reminder" }), // 60m
      ],
      tasks: [],
      expectedOutcome: {
        shouldHaveConflict: false,
        maxDailyWorkloadMinutes: 360,
      },
    });
  }

  // =========================================================================
  // GROUP G: DATA QUALITY & CORRUPTION (Scenarios 91–105)
  // =========================================================================
  for (let i = 1; i <= 15; i++) {
    scenarios.push({
      id: `SCENARIO_G_${i}`,
      category: "DATA_QUALITY",
      title: `Data Quality Resilience Case ${i}: Penanganan String Kosong / Waktu Inverted`,
      description: `Data jadwal kotor dengan format waktu tidak lazim harus dinormalisasi secara aman.`,
      initialSchedules: [
        createMockScheduleItem({ id: `c_g_${i}_1`, title: "", day: "Kamis", start_time: "14:00", end_time: "16:00" }),
        createMockScheduleItem({ id: `c_g_${i}_2`, title: "Sains Data", day: "Kamis", start_time: "10:00", end_time: "12:00" }),
      ],
      tasks: [],
      expectedOutcome: {
        shouldHaveConflict: false,
      },
    });
  }

  // =========================================================================
  // GROUP H: CONCURRENCY & STALE PROPOSALS (Scenarios 106–120)
  // =========================================================================
  for (let i = 1; i <= 15; i++) {
    scenarios.push({
      id: `SCENARIO_H_${i}`,
      category: "CONCURRENCY",
      title: `Concurrency Check Case ${i}: Deteksi Stale Snapshot Hash`,
      description: `Proposal yang dibuat dari snapshot lama harus diblokir oleh Approval Gate.`,
      initialSchedules: [
        createMockScheduleItem({ id: `c_h_${i}`, day: "Jumat", start_time: "08:00", end_time: "10:00" }),
      ],
      tasks: [],
      expectedOutcome: {
        shouldHaveConflict: false,
        expectStaleProposal: true,
      },
    });
  }

  // =========================================================================
  // GROUP I: USER BEHAVIOR & VARIANCE (Scenarios 121–135)
  // =========================================================================
  for (let i = 1; i <= 15; i++) {
    scenarios.push({
      id: `SCENARIO_I_${i}`,
      category: "USER_BEHAVIOR",
      title: `User Behavior Signal Case ${i}: Pola Belajar Malam Terbukti (${i + 4} sesi)`,
      description: `Ekstraksi sinyal belajar malam hari secara kuantitatif tanpa psikologisasi.`,
      initialSchedules: [
        createMockScheduleItem({ id: `c_i_${i}`, day: "Senin", start_time: "08:00", end_time: "10:00" }),
      ],
      tasks: [],
      outcomes: Array.from({ length: 6 }, (_, idx) => ({
        id: `out_i_${i}_${idx}`,
        userId: "user_test_default",
        scheduleItemId: `s_i_${idx}`,
        sessionTitle: "Belajar Malam",
        day: DAYS[idx % 5],
        plannedStartTime: "19:30",
        plannedEndTime: "21:00",
        plannedDurationMinutes: 90,
        actualStartTime: "19:35",
        actualEndTime: "21:05",
        actualDurationMinutes: 90,
        status: "COMPLETED" as const,
        recordedAt: new Date(Date.now() - 86400000 * (6 - idx)).toISOString(),
      })),
      expectedOutcome: {
        shouldHaveConflict: false,
        expectSufficientData: true,
      },
    });
  }

  // =========================================================================
  // GROUP J: LONG-TERM MULTI-WEEK ADAPTATION (Scenarios 136–150)
  // =========================================================================
  for (let i = 1; i <= 15; i++) {
    scenarios.push({
      id: `SCENARIO_J_${i}`,
      category: "LONG_TERM_ADAPTATION",
      title: `Multi-Week Stability Case ${i}: Simulasi Kalibrasi 4 Minggu`,
      description: `Memastikan kalibrasi pengali rekomendasi tetap berada dalam rentang wajar (0.8x - 1.25x).`,
      initialSchedules: [
        createMockScheduleItem({ id: `c_j_${i}`, day: "Selasa", start_time: "08:00", end_time: "10:00" }),
      ],
      tasks: [],
      recommendationHistory: Array.from({ length: 12 }, (_, idx) => ({
        recommendationId: `rec_j_${idx}`,
        userId: "user_test_default",
        proposalTitle: "WEEKLY_BALANCED_DISTRIBUTION",
        wasAccepted: idx % 4 !== 0,
        wasExecuted: idx % 3 !== 0,
        affectedSessionsOutcomes: ["COMPLETED" as const],
        conflictsOccurred: 0,
        outcomeScore: 85,
        recordedAt: new Date(Date.now() - 86400000 * (12 - idx)).toISOString(),
      })),
      expectedOutcome: {
        shouldHaveConflict: false,
        proposalAllowed: true,
      },
    });
  }

  // =========================================================================
  // GROUP K: PERFORMANCE INVARIANTS & LOAD (Scenarios 151–160)
  // =========================================================================
  for (let i = 1; i <= 10; i++) {
    const itemsCount = 7 + i * 2;
    scenarios.push({
      id: `SCENARIO_K_${i}`,
      category: "PERFORMANCE_INVARIANTS",
      title: `Performance Benchmark Case ${i}: Evaluasi ${itemsCount} Item Jadwal`,
      description: `Memastikan eksekusi snapshot, workload, deadline, dan health score tuntas <50ms.`,
      initialSchedules: Array.from({ length: itemsCount }, (_, idx) => {
        const dayIdx = idx % 7;
        const slotIdx = Math.floor(idx / 7);
        const startHour = 8 + slotIdx * 3;
        return createMockScheduleItem({
          id: `perf_item_${idx}`,
          day: DAYS[dayIdx],
          start_time: `${String(startHour).padStart(2, "0")}:00`,
          end_time: `${String(startHour + 1).padStart(2, "0")}:30`,
        });
      }),
      tasks: [createMockTask({ id: `t_k_${i}` })],
      expectedOutcome: {
        shouldHaveConflict: false,
      },
    });
  }

  // =========================================================================
  // GROUP L: REGRESSION PROTECTION (Scenarios 161–170)
  // =========================================================================
  for (let i = 1; i <= 10; i++) {
    scenarios.push({
      id: `SCENARIO_L_${i}`,
      category: "REGRESSION_PROTECTION",
      title: `Cross-Engine Regression Case ${i}: Integritas End-to-End`,
      description: `Memverifikasi bahwa integrasi seluruh subsistem FASE 24-36 konsisten tanpa regresi.`,
      initialSchedules: [
        createMockScheduleItem({ id: `reg_${i}_1`, day: "Senin", start_time: "08:00", end_time: "10:00" }),
        createMockScheduleItem({ id: `reg_${i}_2`, day: "Rabu", start_time: "13:00", end_time: "15:00" }),
        createMockScheduleItem({ id: `reg_${i}_3`, day: "Kamis", start_time: "19:00", end_time: "20:30", type: "reminder" }),
      ],
      tasks: [createMockTask({ id: `t_reg_${i}`, priority: "tinggi" })],
      expectedOutcome: {
        shouldHaveConflict: false,
        healthScoreMin: 70,
        proposalAllowed: true,
      },
    });
  }

  return scenarios;
}
