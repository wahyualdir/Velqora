import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeDayName,
  normalizeTimeRange,
  normalizeSingleTime,
  normalizeExtractedScheduleItem,
} from "../normalizer";

describe("Schedule Normalizer Engine", () => {
  describe("normalizeDayName", () => {
    it("should normalize Indonesian day names correctly", () => {
      assert.equal(normalizeDayName("Senin"), "Senin");
      assert.equal(normalizeDayName("selasa"), "Selasa");
      assert.equal(normalizeDayName("RABU"), "Rabu");
      assert.equal(normalizeDayName("kamis"), "Kamis");
      assert.equal(normalizeDayName("Jumat"), "Jumat");
      assert.equal(normalizeDayName("Jum'at"), "Jumat");
      assert.equal(normalizeDayName("Sabtu"), "Sabtu");
      assert.equal(normalizeDayName("Minggu"), "Minggu");
    });

    it("should normalize English day names to Indonesian canonical days", () => {
      assert.equal(normalizeDayName("Monday"), "Senin");
      assert.equal(normalizeDayName("Tuesday"), "Selasa");
      assert.equal(normalizeDayName("Wednesday"), "Rabu");
      assert.equal(normalizeDayName("Thursday"), "Kamis");
      assert.equal(normalizeDayName("Friday"), "Jumat");
      assert.equal(normalizeDayName("Saturday"), "Sabtu");
      assert.equal(normalizeDayName("Sunday"), "Minggu");
    });

    it("should handle day abbreviations", () => {
      assert.equal(normalizeDayName("Sen"), "Senin");
      assert.equal(normalizeDayName("Sel"), "Selasa");
      assert.equal(normalizeDayName("Rab"), "Rabu");
      assert.equal(normalizeDayName("Kam"), "Kamis");
      assert.equal(normalizeDayName("Jum"), "Jumat");
      assert.equal(normalizeDayName("Sab"), "Sabtu");
      assert.equal(normalizeDayName("Min"), "Minggu");
      assert.equal(normalizeDayName("Ahad"), "Minggu");
    });

    it("should return null for non-day strings", () => {
      assert.equal(normalizeDayName("Hari Ganjil"), null);
      assert.equal(normalizeDayName(""), null);
    });
  });

  describe("normalizeSingleTime", () => {
    it("should normalize diverse time variations to standard HH:mm", () => {
      assert.equal(normalizeSingleTime("08.00"), "08:00");
      assert.equal(normalizeSingleTime("08:00"), "08:00");
      assert.equal(normalizeSingleTime("8:00"), "08:00");
      assert.equal(normalizeSingleTime("8.30"), "08:30");
      assert.equal(normalizeSingleTime("13:45"), "13:45");
      assert.equal(normalizeSingleTime("13.45.00"), "13:45");
      assert.equal(normalizeSingleTime("8"), "08:00");
      assert.equal(normalizeSingleTime("14"), "14:00");
    });

    it("should return null for invalid times", () => {
      assert.equal(normalizeSingleTime("25:00"), null);
      assert.equal(normalizeSingleTime("12:65"), null);
      assert.equal(normalizeSingleTime("abc"), null);
    });
  });

  describe("normalizeTimeRange", () => {
    it("should parse and normalize time ranges with various delimiters", () => {
      const res1 = normalizeTimeRange("08:00 - 10:00");
      assert.equal(res1.isValid, true);
      assert.equal(res1.startTime, "08:00");
      assert.equal(res1.endTime, "10:00");
      assert.equal(res1.formattedTime, "08:00 - 10:00");

      const res2 = normalizeTimeRange("08.00 s/d 10.00 WIB");
      assert.equal(res2.isValid, true);
      assert.equal(res2.startTime, "08:00");
      assert.equal(res2.endTime, "10:00");

      const res3 = normalizeTimeRange("08.00 s.d. 10.30");
      assert.equal(res3.isValid, true);
      assert.equal(res3.startTime, "08:00");
      assert.equal(res3.endTime, "10:30");

      const res4 = normalizeTimeRange("Pukul 08:00-10:00");
      assert.equal(res4.isValid, true);
      assert.equal(res4.startTime, "08:00");
      assert.equal(res4.endTime, "10:00");

      const res5 = normalizeTimeRange("08.00 sampai 11.00");
      assert.equal(res5.isValid, true);
      assert.equal(res5.startTime, "08:00");
      assert.equal(res5.endTime, "11:00");
    });

    it("should detect invalid chronological ranges (endTime <= startTime)", () => {
      const res = normalizeTimeRange("10:00 - 08:00");
      assert.equal(res.isValid, false);
      assert.match(res.reason || "", /tidak boleh mendahului|tidak boleh sebelum/);
    });

    it("should handle single start time by estimating 90 mins slot", () => {
      const res = normalizeTimeRange("08:00");
      assert.equal(res.isValid, true);
      assert.equal(res.startTime, "08:00");
      assert.equal(res.endTime, "09:30");
    });
  });

  describe("normalizeExtractedScheduleItem", () => {
    it("should correctly assign verified confidence to complete items", () => {
      const item = normalizeExtractedScheduleItem({
        title: "Machine Learning & AI",
        day: "Selasa",
        time: "10:00 - 12:00",
        location: "Ruang 304",
        instructor: "Dr. Ahmad",
      });

      assert.equal(item.confidence, "verified");
      assert.equal(item.day, "Selasa");
      assert.equal(item.startTime, "10:00");
      assert.equal(item.endTime, "12:00");
      assert.equal(item.selected, true);
    });

    it("should flag needs_review when time is missing or unparseable", () => {
      const item = normalizeExtractedScheduleItem({
        title: "Kalkulus Lanjut",
        day: "Senin",
        time: "Waktu Menyusul",
      });

      assert.equal(item.confidence, "needs_review");
      assert.equal(item.selected, false);
    });

    it("should flag invalid when title is missing", () => {
      const item = normalizeExtractedScheduleItem({
        title: "   ",
        day: "Senin",
        time: "08:00 - 10:00",
      });

      assert.equal(item.confidence, "invalid");
    });

    it("should detect Day-Date Mismatch and flag needs_review", () => {
      // 2026-09-01 is a Tuesday ("Selasa"), but declared day is "Rabu"
      const item = normalizeExtractedScheduleItem({
        title: "Sistem Terdistribusi",
        day: "Rabu",
        date: "01/09/2026",
        time: "08:00 - 10:00",
      });

      assert.equal(item.dayDateMismatch, true);
      assert.match(item.dayDateMismatchReason || "", /jatuh pada hari Selasa/);
      assert.equal(item.selected, false); // should not be auto-selected due to mismatch
    });

    it("should verify matching Day and Date correctly", () => {
      // 2026-09-01 is a Tuesday ("Selasa")
      const item = normalizeExtractedScheduleItem({
        title: "Sistem Terdistribusi",
        day: "Selasa",
        date: "2026-09-01",
        time: "08:00 - 10:00",
      });

      assert.equal(item.dayDateMismatch, false);
      assert.equal(item.confidence, "verified");
      assert.equal(item.selected, true);
    });
  });
});

