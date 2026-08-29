import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseDocument } from "../document-parser";
import { extractSchedules } from "../schedule-extractor";
import { validateSchedule, validateBatchSchedules } from "../schedule-validator";
import { detectConflicts } from "../conflict-detector";
import { processScheduleDocument } from "../index";
import { ScheduleItem } from "@/types";

describe("Schedule Automation Engine (Facade & Core Pipeline)", () => {
  it("should parse text document and extract schedules", async () => {
    const text = `Senin\n08:00 - 10:00\nMatematika Diskrit\nRuang 301\n\nSelasa\n10:00 - 12:00\nBasis Data\nLab Komputer`;
    const parsed = await parseDocument(Buffer.from(text), "jadwal.txt", "text/plain");

    assert.equal(parsed.sourceType, "txt");
    assert.equal(parsed.text.length > 0, true);

    const extracted = await extractSchedules(parsed);
    assert.equal(extracted.length >= 2, true);
    assert.equal(extracted[0].startTime, "08:00");
    assert.equal(extracted[0].endTime, "10:00");
    assert.equal(extracted[0].confidence >= 0.7, true);
  });

  it("should validate valid and invalid schedule items", () => {
    const valid = validateSchedule({
      title: "Algoritma Pemrograman",
      day: "Senin",
      startTime: "08:00",
      endTime: "10:00",
    });
    assert.equal(valid.valid, true);
    assert.equal(valid.errors.length, 0);

    const invalidTime = validateSchedule({
      title: "Algoritma Pemrograman",
      day: "Senin",
      startTime: "12:00",
      endTime: "10:00", // End before start
    });
    assert.equal(invalidTime.valid, false);
    assert.equal(invalidTime.errors.length > 0, true);

    const missingTitle = validateSchedule({
      title: "",
      day: "Senin",
      startTime: "08:00",
      endTime: "10:00",
    });
    assert.equal(missingTitle.valid, false);
  });

  it("should detect duplicate items in batch validation", () => {
    const batch = [
      {
        id: "1",
        title: "Kalkulus",
        day: "Senin",
        startTime: "08:00",
        endTime: "10:00",
        confidence: 0.95,
      },
      {
        id: "2",
        title: "Kalkulus",
        day: "Senin",
        startTime: "08:00",
        endTime: "10:00",
        confidence: 0.95,
      },
    ];

    const result = validateBatchSchedules(batch);
    assert.equal(result.validCount, 1);
    assert.equal(result.invalidCount, 1);
    assert.match(result.results[1].validation.errors[0], /Duplikasi internal/);
  });

  it("should detect database and intra-batch conflicts", () => {
    const existingDb: ScheduleItem[] = [
      {
        id: "db1",
        user_id: "user1",
        title: "Jaringan Komputer",
        day: "Senin",
        start_time: "08:00",
        end_time: "10:00",
        time: "08:00 - 10:00",
        type: "jadwal",
        priority: "sedang",
        is_completed: false,
        isCompleted: false,
        created_at: new Date().toISOString(),
      },
    ];

    const candidates = [
      {
        id: "c1",
        title: "Keamanan Siber",
        day: "Senin",
        startTime: "09:00",
        endTime: "11:00", // Overlaps 08:00-10:00
        confidence: 0.95,
      },
      {
        id: "c2",
        title: "Jaringan Komputer",
        day: "Senin",
        startTime: "08:00",
        endTime: "10:00", // Exact duplicate
        confidence: 0.95,
      },
      {
        id: "c3",
        title: "Sistem Operasi",
        day: "Selasa",
        startTime: "10:00",
        endTime: "12:00", // Different day - NO conflict
        confidence: 0.95,
      },
    ];

    const checked = detectConflicts(candidates, existingDb);
    assert.equal(checked[0].hasConflict, true);
    assert.equal(checked[0].conflictType, "time_overlap");

    assert.equal(checked[1].hasConflict, true);
    assert.equal(checked[1].conflictType === "exact_duplicate" || checked[1].conflictType === "duplicate_exact", true);
    assert.equal(checked[1].selected, false);

    assert.equal(checked[2].hasConflict, false);
  });

  it("should process end-to-end schedule document buffer", async () => {
    const csv = `Mata Kuliah,Hari,Jam Mulai,Jam Selesai,Ruang\nSistem Terdistribusi,Rabu,13:00 - 15:00,15:00,Lab 4`;
    const res = await processScheduleDocument(Buffer.from(csv), "jadwal.csv", "text/csv");

    assert.equal(res.success, true);
    assert.equal(res.items.length >= 1, true);
    assert.equal(res.items[0].title.includes("Sistem Terdistribusi"), true);
    assert.equal(res.items[0].day, "Rabu");
    assert.equal(res.items[0].startTime, "13:00");
    assert.equal(res.items[0].endTime, "15:00");
  });
});
