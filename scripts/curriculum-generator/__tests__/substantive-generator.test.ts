import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  SubstantiveCurriculumSpec,
  SubstantiveChapter,
  SubstantiveSubchapter,
  SubstantiveLearningUnit,
} from "../adaptive-schema";

const FORBIDDEN_SKELETON_PATTERNS = [
  /merupakan fondasi krusial untuk menjamin keandalan sistem\. Konsep ini menyelesaikan tantangan teknis/,
  /Pembahasan fokus mengenai \*\*.*?\*\* dalam konteks .*?\. Memastikan penguasaan mendalam/,
  /Status eksekusi: Komputasi berhasil dan output metrik valid\./,
  /Inisialisasi Data: Menyiapkan sampel representatif[\s\S]*Eksekusi Komputasi: Menjalankan fungsi algoritma[\s\S]*Verifikasi Output/,
];

export function validateSubstantiveUnit(unit: SubstantiveLearningUnit): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const fullText = [
    unit.purpose,
    unit.conceptualExplanation,
    unit.intuitionAnalogy,
    unit.technicalDepth,
  ].filter(Boolean).join(" ");

  const words = fullText.trim().split(/\s+/).filter(Boolean).length;
  if (words < 120) {
    errors.push(`Unit "${unit.title}" terlalu pendek (${words} kata; minimum 120 kata).`);
  }

  for (const pattern of FORBIDDEN_SKELETON_PATTERNS) {
    if (pattern.test(fullText)) {
      errors.push(`Unit "${unit.title}" mengandung template skeleton generik terlarang (${pattern}).`);
    }
  }

  if (unit.codeExample) {
    if (!unit.codeExample.isVerifiedOutput && unit.codeExample.expectedOutput.includes("Status eksekusi:")) {
      errors.push(`Unit "${unit.title}" menggunakan expectedOutput placeholder sintetis yang belum diverifikasi.`);
    }
    if (!unit.codeExample.dependencies || unit.codeExample.dependencies.length === 0) {
      errors.push(`Unit "${unit.title}" memiliki kode tanpa deklarasi dependensi eksplisit.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateSubstantiveChapter(chapter: SubstantiveChapter): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!chapter.summary || chapter.summary.trim().length < 80) {
    errors.push(`Bab "${chapter.title}" tidak memiliki rangkuman bab substantif (minimum 80 karakter).`);
  }

  if (!chapter.transitionToNextChapter || chapter.transitionToNextChapter.trim().length < 40) {
    errors.push(`Bab "${chapter.title}" tidak memiliki jembatan transisi kognitif menuju bab berikutnya.`);
  }

  if (!chapter.subchapters || chapter.subchapters.length < 2) {
    errors.push(`Bab "${chapter.title}" harus memiliki minimal 2 subbab.`);
  }

  for (const sub of chapter.subchapters || []) {
    for (const unit of sub.units || []) {
      const uRes = validateSubstantiveUnit(unit);
      if (!uRes.valid) {
        errors.push(...uRes.errors);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

describe("Phase 2.3-B: Substantive Content Quality Guardrails", () => {
  it("Harus menolak template skeleton sintetis Phase 2.2", () => {
    const fakeUnit: SubstantiveLearningUnit = {
      id: "fake-1",
      slug: "fake-1",
      title: "1.1.1. Konsep Palsu",
      orderIndex: 1,
      purpose: "Pembahasan fokus mengenai Konsep Palsu dalam konteks Machine Learning. Memastikan penguasaan mendalam.",
      conceptualExplanation: "merupakan fondasi krusial untuk menjamin keandalan sistem. Konsep ini menyelesaikan tantangan teknis dalam abstraksi sistem cerdas.",
      technicalDepth: "Alur eksekusi melibatkan tahapan sistematis: validasi input, transformasi representasi.",
    };

    const res = validateSubstantiveUnit(fakeUnit);
    assert.equal(res.valid, false, "Validator gagal mendeteksi skeleton template generik!");
    assert.ok(res.errors.some((e) => e.includes("template skeleton generik terlarang")));
  });

  it("Harus menolak expectedOutput placeholder sintetis", () => {
    const fakeUnitWithBadCode: SubstantiveLearningUnit = {
      id: "fake-code-1",
      slug: "fake-code-1",
      title: "1.2.1. Regresi Linear",
      orderIndex: 1,
      purpose: "Eksplorasi mendalam mengenai perumusan analitis Ordinary Least Squares.",
      conceptualExplanation: "Regresi linear memodelkan hubungan linear antara fitur independen dan target kontinu dengan meminimalkan kuadrat residu.",
      technicalDepth: "Solusi analitis normal equation didapatkan melalui perkalian invers matriks X transpose X dengan X transpose y.",
      codeExample: {
        id: "c-1",
        title: "ols.py",
        language: "python",
        filename: "ols.py",
        code: "import numpy as np; print('done')",
        dependencies: ["numpy"],
        expectedOutput: "Status eksekusi: Komputasi berhasil dan output metrik valid.",
        isVerifiedOutput: false,
        explanation: "Penjelasan kode.",
      },
    };

    const res = validateSubstantiveUnit(fakeUnitWithBadCode);
    assert.equal(res.valid, false, "Validator gagal mendeteksi placeholder output sintetis!");
    assert.ok(res.errors.some((e) => e.includes("placeholder sintetis")));
  });

  it("Harus menolak bab tanpa rangkuman dan tanpa jembatan transisi", () => {
    const fakeChapter: SubstantiveChapter = {
      id: "ch-1",
      slug: "bab-1",
      title: "BAB 1: Fondasi",
      orderIndex: 1,
      description: "Deskripsi",
      learningObjectives: ["Obj 1"],
      prerequisites: ["Prereq 1"],
      coreConcepts: ["Concept 1"],
      summary: "", // KOSONG
      transitionToNextChapter: "", // KOSONG
      subchapters: [],
      references: [],
    };

    const res = validateSubstantiveChapter(fakeChapter);
    assert.equal(res.valid, false, "Validator gagal mendeteksi ketiadaan rangkuman dan transisi!");
    assert.ok(res.errors.some((e) => e.includes("rangkuman")));
    assert.ok(res.errors.some((e) => e.includes("transisi")));
  });
});
