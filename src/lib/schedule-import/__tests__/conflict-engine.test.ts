import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  checkIntervalOverlap,
  analyzeItemConflict,
  detectAllScheduleConflicts,
} from "../conflict-engine";
import { ExtractedScheduleItem } from "../types";
import { ScheduleItem } from "@/types";

describe("Schedule Conflict Engine", () => {
  describe("checkIntervalOverlap", () => {
    it("should detect overlap when intervals intersect (08:00-10:00 vs 09:00-11:00)", () => {
      const overlap = checkIntervalOverlap("08:00", "10:00", "09:00", "11:00");
      assert.equal(overlap, true);
    });

    it("should NOT detect overlap when intervals only touch boundaries (08:00-10:00 vs 10:00-12:00)", () => {
      const overlap = checkIntervalOverlap("08:00", "10:00", "10:00", "12:00");
      assert.equal(overlap, false);
    });

    it("should NOT detect overlap when intervals touch previous boundary (08:00-10:00 vs 07:00-08:00)", () => {
      const overlap = checkIntervalOverlap("08:00", "10:00", "07:00", "08:00");
      assert.equal(overlap, false);
    });

    it("should detect overlap when one interval is completely inside another (08:00-12:00 vs 09:00-10:00)", () => {
      const overlap = checkIntervalOverlap("08:00", "12:00", "09:00", "10:00");
      assert.equal(overlap, true);
    });
  });

  describe("analyzeItemConflict", () => {
    const existingSchedule: ScheduleItem = {
      id: "s1",
      title: "Algoritma & Pemrograman",
      day: "Senin",
      start_time: "08:00",
      end_time: "10:00",
      time: "08:00 - 10:00",
      type: "jadwal",
      priority: "tinggi",
      location: "Lab Komputer 1",
    };

    it("should detect conflict when imported item overlaps existing schedule", () => {
      const imported: ExtractedScheduleItem = {
        id: "imp_1",
        title: "Kalkulus I",
        day: "Senin",
        startTime: "09:00",
        endTime: "11:00",
        time: "09:00 - 11:00",
        confidence: "verified",
      };

      const result = analyzeItemConflict(imported, existingSchedule);
      assert.equal(result.hasConflict, true);
      assert.equal(result.conflictType, "time_overlap");
      assert.match(result.message, /Bentrok waktu/);
    });

    it("should not conflict when imported item is on a different day", () => {
      const imported: ExtractedScheduleItem = {
        id: "imp_2",
        title: "Kalkulus I",
        day: "Selasa",
        startTime: "08:00",
        endTime: "10:00",
        time: "08:00 - 10:00",
        confidence: "verified",
      };

      const result = analyzeItemConflict(imported, existingSchedule);
      assert.equal(result.hasConflict, false);
    });

    it("should detect exact duplicate item", () => {
      const imported: ExtractedScheduleItem = {
        id: "imp_dup",
        title: "Algoritma & Pemrograman",
        day: "Senin",
        startTime: "08:00",
        endTime: "10:00",
        time: "08:00 - 10:00",
        confidence: "verified",
      };

      const result = analyzeItemConflict(imported, existingSchedule);
      assert.equal(result.hasConflict, true);
      assert.equal(result.conflictType, "exact_duplicate");
      assert.match(result.message, /sudah ada di jadwal Anda/);
    });
  });

  describe("detectAllScheduleConflicts", () => {
    it("should detect conflicts and intra-file duplicates correctly", () => {
      const importedList: ExtractedScheduleItem[] = [
        {
          id: "item_1",
          title: "Sistem Basis Data",
          day: "Rabu",
          startTime: "08:00",
          endTime: "10:00",
          time: "08:00 - 10:00",
          confidence: "verified",
          selected: true,
        },
        {
          id: "item_2",
          title: "Jaringan Komputer",
          day: "Rabu",
          startTime: "09:00",
          endTime: "11:00",
          time: "09:00 - 11:00",
          confidence: "verified",
          selected: true,
        },
        {
          id: "item_3",
          title: "Sistem Operasi",
          day: "Kamis",
          startTime: "13:00",
          endTime: "15:00",
          time: "13:00 - 15:00",
          confidence: "verified",
          selected: true,
        },
      ];

      const analyzed = detectAllScheduleConflicts(importedList, []);

      // item_1 and item_2 conflict on Rabu 09:00
      assert.equal(analyzed[0].hasConflict, true);
      assert.equal(analyzed[1].hasConflict, true);
      assert.equal(analyzed[0].selected, false); // conflict deselects item
      assert.equal(analyzed[1].selected, false);

      // item_3 has no conflicts
      assert.equal(analyzed[2].hasConflict, false);
      assert.equal(analyzed[2].selected, true);
    });
  });
});
