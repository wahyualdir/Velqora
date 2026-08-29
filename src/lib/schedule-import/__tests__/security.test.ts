import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { scheduleBatchSaveRequestSchema } from "../schema";
import { sanitizeFileName } from "../parser";

describe("Security & Validation Guarantees", () => {
  describe("sanitizeFileName", () => {
    it("should strip directory traversal and dangerous characters", () => {
      assert.equal(sanitizeFileName("../../../etc/passwd"), "passwd");
      assert.equal(sanitizeFileName("..\\..\\windows\\system32.dll"), "system32.dll");
      assert.equal(sanitizeFileName("jadwal\0malicious.pdf"), "jadwalmalicious.pdf");
      assert.equal(sanitizeFileName('test<>:"|?*file.xlsx'), "test_______file.xlsx");
    });
  });

  describe("scheduleBatchSaveRequestSchema", () => {
    it("should reject empty items array", () => {
      const res = scheduleBatchSaveRequestSchema.safeParse({ items: [] });
      assert.equal(res.success, false);
    });

    it("should reject invalid day strings", () => {
      const res = scheduleBatchSaveRequestSchema.safeParse({
        items: [
          {
            title: "Test Kuliah",
            day: "HariLibur", // invalid
            time: "08:00 - 10:00",
          },
        ],
      });
      assert.equal(res.success, false);
    });

    it("should accept valid payload with strict types", () => {
      const res = scheduleBatchSaveRequestSchema.safeParse({
        items: [
          {
            title: "Pengolahan Citra Digital",
            subject: "Informatika",
            day: "Senin",
            time: "08:00 - 10:00",
            location: "Lab Multimedia",
            priority: "tinggi",
            type: "jadwal",
          },
        ],
      });
      assert.equal(res.success, true);
      if (res.success) {
        assert.equal(res.data.items[0].day, "Senin");
        assert.equal(res.data.items[0].is_completed, false);
      }
    });
  });
});
