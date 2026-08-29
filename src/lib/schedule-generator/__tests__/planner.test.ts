import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { planAcademicSchedule } from "../planner";
import { computeAvailabilityWindows } from "../availability";
import { AutoScheduleGoalRequest } from "../types";
import { ScheduleItem } from "@/types";

describe("Automatic Schedule Generator Engine", () => {
  const existingSchedules: ScheduleItem[] = [
    {
      id: "s1",
      title: "Kuliah Kecerdasan Buatan",
      day: "Senin",
      start_time: "08:00",
      end_time: "10:00",
      time: "08:00 - 10:00",
      type: "jadwal",
      priority: "tinggi",
    },
    {
      id: "s2",
      title: "Praktikum Jaringan",
      day: "Rabu",
      start_time: "13:00",
      end_time: "15:00",
      time: "13:00 - 15:00",
      type: "jadwal",
      priority: "sedang",
    },
  ];

  describe("computeAvailabilityWindows", () => {
    it("should compute free windows excluding busy schedules", () => {
      const windows = computeAvailabilityWindows(
        ["Senin", "Rabu", "Jumat"],
        "pagi", // 07:00 - 12:00
        existingSchedules,
        [],
        15 // 15 mins buffer
      );

      // On Senin (busy 08:00-10:00 with 15min buffer -> busy 07:45-10:15)
      // Free windows should include 10:15 - 12:00
      const seninWindows = windows["Senin"];
      assert.ok(seninWindows.length > 0);
      assert.ok(seninWindows.some((w) => w.startMinutes >= 10 * 60 + 15));

      // On Jumat (no busy schedules in morning)
      // Free window should span full 07:00 - 12:00
      const jumatWindows = windows["Jumat"];
      assert.equal(jumatWindows.length, 1);
      assert.equal(jumatWindows[0].startTime, "07:00");
      assert.equal(jumatWindows[0].endTime, "12:00");
    });
  });

  describe("planAcademicSchedule", () => {
    it("should generate deterministic, conflict-free recommendations matching user target", () => {
      const goal: AutoScheduleGoalRequest = {
        goalTitle: "Belajar Deep Learning PyTorch",
        subject: "AI Research",
        durationMinutes: 90,
        targetSessionsPerWeek: 3,
        preferredDays: ["Senin", "Rabu", "Jumat"],
        timePreference: "malam", // 18:30 - 22:30
        priority: "tinggi",
      };

      const result = planAcademicSchedule(goal, existingSchedules, []);

      assert.equal(result.success, true);
      assert.ok(result.candidates.length >= 3);
      assert.equal(result.recommendedSessionsCount, 3);

      const picked = result.candidates.filter((c) => c.selected);
      assert.equal(picked.length, 3);

      // Verify that all 3 picked slots are on distinct days or distinct times
      const days = picked.map((p) => p.day);
      assert.deepEqual([...new Set(days)].sort(), ["Jumat", "Rabu", "Senin"]);

      // Verify duration of each slot is exactly 90 minutes
      picked.forEach((slot) => {
        assert.equal(slot.title, "Belajar Deep Learning PyTorch");
        assert.ok(slot.suitabilityScore >= 70);
      });
    });

    it("should produce reproducible results given identical inputs", () => {
      const goal: AutoScheduleGoalRequest = {
        goalTitle: "Review Materi Algoritma",
        durationMinutes: 60,
        targetSessionsPerWeek: 2,
        preferredDays: ["Selasa", "Kamis"],
        timePreference: "pagi",
      };

      const run1 = planAcademicSchedule(goal, existingSchedules, []);
      const run2 = planAcademicSchedule(goal, existingSchedules, []);

      assert.deepEqual(
        run1.candidates.map((c) => ({ day: c.day, time: c.time, score: c.suitabilityScore })),
        run2.candidates.map((c) => ({ day: c.day, time: c.time, score: c.suitabilityScore }))
      );
    });
  });
});
