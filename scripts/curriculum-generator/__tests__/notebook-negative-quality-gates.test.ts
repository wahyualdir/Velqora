import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { dataScienceCurriculum } from "../../../src/lib/curriculum/topics/11-data-science";
import {
  NotebookUnit,
  NotebookCodeUnit,
  NotebookFormulaUnit,
  NotebookExerciseUnit,
  NotebookProjectUnit,
  NotebookTableUnit,
  NotebookInterpretationUnit,
  NotebookWarningUnit,
  NotebookDefinitionUnit,
  AcademicSubchapter,
} from "../../../src/lib/curriculum/types";

// ============================================================================
// VALIDATOR QUALITY GATES IMPLEMENTATION
// ============================================================================

export class NotebookQualityGateValidator {
  /**
   * Validasi subbab berstandar akademik tinggi
   */
  static validateSubchapter(sub: AcademicSubchapter): void {
    if (!sub.units || sub.units.length === 0) {
      throw new Error(`[QUALITY_GATE_1] Subbab '${sub.title}' tidak memiliki notebook units terstruktur!`);
    }

    let codeUnitCount = 0;
    let outputUnitCount = 0;

    for (const unit of sub.units) {
      this.validateUnit(unit, sub.units);
      if (unit.type === "code") codeUnitCount++;
      if (unit.type === "output") outputUnitCount++;
    }

    if (codeUnitCount > 0 && outputUnitCount === 0) {
      throw new Error(`[QUALITY_GATE_5] Subbab '${sub.title}' memiliki ${codeUnitCount} code cell tetapi 0 output cell!`);
    }
  }

  /**
   * Validasi unit individual berdasarkan tipenya
   */
  static validateUnit(unit: NotebookUnit, allUnits: NotebookUnit[]): void {
    switch (unit.type) {
      case "code":
        this.validateCodeUnit(unit, allUnits);
        break;
      case "formula":
        this.validateFormulaUnit(unit);
        break;
      case "exercise":
        this.validateExerciseUnit(unit);
        break;
      case "project":
        this.validateProjectUnit(unit);
        break;
      case "table":
        this.validateTableUnit(unit);
        break;
      case "interpretation":
        this.validateInterpretationUnit(unit);
        break;
      case "warning":
        this.validateWarningUnit(unit);
        break;
      case "definition":
        this.validateDefinitionUnit(unit);
        break;
      default:
        break;
    }
  }

  static validateCodeUnit(unit: NotebookCodeUnit, allUnits: NotebookUnit[]): void {
    if (!unit.preExplanation || unit.preExplanation.trim().length < 20) {
      throw new Error(`[QUALITY_GATE_2] Code unit '${unit.id}' tidak memiliki preExplanation teoritis yang memadai!`);
    }

    if (!unit.dependencies || unit.dependencies.length === 0) {
      throw new Error(`[QUALITY_GATE_6] Code unit '${unit.id}' tidak mendefinisikan dependencies!`);
    }

    if (!unit.failureModes || unit.failureModes.length === 0) {
      throw new Error(`[QUALITY_GATE_7] Code unit '${unit.id}' tidak mendefinisikan potensi failureModes!`);
    }

    if (!unit.runtimeComplexity || !unit.memoryComplexity) {
      throw new Error(`[QUALITY_GATE_8] Code unit '${unit.id}' tidak mendefinisikan kompleksitas runtime atau memori!`);
    }

    // Cari output unit yang berpasangan
    const matchingOutput = allUnits.find(
      (u) => u.type === "output" && u.relatedCodeUnitId === unit.id
    );

    if (unit.executionStatus === "verified") {
      if (!matchingOutput || matchingOutput.type !== "output" || !matchingOutput.executionEvidence) {
        throw new Error(`[QUALITY_GATE_3] Code unit '${unit.id}' berstatus verified tetapi tidak memiliki executionEvidence asli!`);
      }

      if (matchingOutput.executionEvidence.exitCode !== 0) {
        throw new Error(`[QUALITY_GATE_4] Code unit '${unit.id}' memiliki exit code non-zero (${matchingOutput.executionEvidence.exitCode})!`);
      }

      if (!matchingOutput.content || matchingOutput.content.trim().length === 0) {
        throw new Error(`[QUALITY_GATE_5] Code unit '${unit.id}' menghasilkan output kosong!`);
      }
    }
  }

  static validateFormulaUnit(unit: NotebookFormulaUnit): void {
    if (!unit.variables || unit.variables.length === 0) {
      throw new Error(`[QUALITY_GATE_9] Formula unit '${unit.id}' tidak memiliki daftar kamus variabel (variables dictionary)!`);
    }

    if (!unit.workedExample || !unit.workedExample.stepByStep || unit.workedExample.stepByStep.length === 0) {
      throw new Error(`[QUALITY_GATE_10] Formula unit '${unit.id}' tidak memiliki contoh perhitungan manual (worked example)!`);
    }
  }

  static validateExerciseUnit(unit: NotebookExerciseUnit): void {
    if (!unit.evaluationRubric || unit.evaluationRubric.length === 0) {
      throw new Error(`[QUALITY_GATE_11] Exercise unit '${unit.id}' tidak memiliki rubrik penilaian (evaluationRubric)!`);
    }

    const totalWeight = unit.evaluationRubric.reduce((sum, r) => sum + r.weight, 0);
    if (Math.abs(totalWeight - 100) > 0.01) {
      throw new Error(`[QUALITY_GATE_11] Bobot rubrik penilaian exercise '${unit.id}' berjumlah ${totalWeight}%, bukan 100%!`);
    }

    if (!unit.hints || unit.hints.length === 0) {
      throw new Error(`[QUALITY_GATE_12] Exercise unit '${unit.id}' tidak memiliki petunjuk bertahap (hints)!`);
    }

    if (!unit.solutionCode || !unit.solutionExplanation) {
      throw new Error(`[QUALITY_GATE_13] Exercise unit '${unit.id}' tidak memiliki kode solusi atau penjelasan referensi!`);
    }
  }

  static validateProjectUnit(unit: NotebookProjectUnit): void {
    if (!unit.datasetSpecs || !unit.datasetSpecs.name || !unit.datasetSpecs.rows || !unit.datasetSpecs.source) {
      throw new Error(`[QUALITY_GATE_14] Project unit '${unit.id}' tidak memiliki spesifikasi dataset yang lengkap!`);
    }

    if (!unit.milestoneSteps || unit.milestoneSteps.length === 0) {
      throw new Error(`[QUALITY_GATE_15] Project unit '${unit.id}' tidak memiliki tahapan milestone deliverables!`);
    }
  }

  static validateTableUnit(unit: NotebookTableUnit): void {
    if (!unit.headers || unit.headers.length === 0 || !unit.rows || unit.rows.length === 0) {
      throw new Error(`[QUALITY_GATE_16] Table unit '${unit.id}' memiliki header atau baris kosong!`);
    }
  }

  static validateInterpretationUnit(unit: NotebookInterpretationUnit): void {
    if (!unit.observations || unit.observations.length < 2) {
      throw new Error(`[QUALITY_GATE_17] Interpretation unit '${unit.id}' memiliki observasi kurang dari 2!`);
    }
  }

  static validateWarningUnit(unit: NotebookWarningUnit): void {
    if (!unit.countermeasure || unit.countermeasure.trim().length < 15) {
      throw new Error(`[QUALITY_GATE_18] Warning unit '${unit.id}' tidak memiliki countermeasure / solusi rekayasa terukur!`);
    }
  }

  static validateDefinitionUnit(unit: NotebookDefinitionUnit): void {
    if (!unit.realWorldAnalogy || !unit.intuitiveExplanation) {
      throw new Error(`[QUALITY_GATE_19] Definition unit '${unit.id}' tidak memiliki analogi dunia nyata atau intuisi konseptual!`);
    }
  }

  static validateCaliforniaHousingAudit(sub: AcademicSubchapter): void {
    const contentStr = JSON.stringify(sub);
    const mentionsTruncation =
      contentStr.includes("5.000010") ||
      contentStr.includes("500,000") ||
      contentStr.includes("ceiling") ||
      contentStr.includes("terpancung") ||
      contentStr.includes("capping");

    if (!mentionsTruncation) {
      throw new Error(`[QUALITY_GATE_20] Audit California Housing mengabaikan batasan sensorik atas target (MedHouseVal ceiling capping)!`);
    }
  }
}

// ============================================================================
// SUITE UJI MUTU AKADEMIK (20 NEGATIVE QUALITY GATES & 1 POSITIVE VERIFICATION)
// ============================================================================

describe("Master Quality Gates: Notebook-Style Academic Module (Data Science Bab 1)", () => {
  const bab1 = dataScienceCurriculum.chapters[0];

  it("POSITIVE: Data Science Bab 1 memuat tepat 6 subbab komprehensif berstatus verified", () => {
    assert.equal(bab1.subchapters.length, 6, "Bab 1 harus memiliki tepat 6 subbab!");
    for (const sub of bab1.subchapters) {
      assert.equal(sub.reviewStatus, "verified");
      assert.ok(sub.units && sub.units.length >= 6, `Subbab ${sub.title} harus memiliki minimal 6 units`);
      // Validasi seluruh subbab lulus quality gates resmi
      NotebookQualityGateValidator.validateSubchapter(sub);
    }
    // Subbab 6 lulus audit truncation
    NotebookQualityGateValidator.validateCaliforniaHousingAudit(bab1.subchapters[5]);
  });

  it("Gate 1: Menolak subbab tanpa notebook units terstruktur", () => {
    const invalidSub: AcademicSubchapter = {
      ...bab1.subchapters[0],
      units: [],
    };
    assert.throws(
      () => NotebookQualityGateValidator.validateSubchapter(invalidSub),
      /QUALITY_GATE_1/
    );
  });

  it("Gate 2: Menolak code cell tanpa penjelasan teoritis sebelum kode (preExplanation)", () => {
    const invalidUnit: NotebookCodeUnit = {
      type: "code",
      id: "test-code-2",
      language: "python",
      executionStatus: "verified",
      preExplanation: "", // KOSONG
      code: "print('hello')",
      dependencies: ["numpy"],
      runtimeComplexity: "O(1)",
      memoryComplexity: "O(1)",
      failureModes: ["None"],
    };
    assert.throws(
      () => NotebookQualityGateValidator.validateCodeUnit(invalidUnit, []),
      /QUALITY_GATE_2/
    );
  });

  it("Gate 3: Menolak klaim verified jika executionEvidence tidak ada", () => {
    const invalidUnit: NotebookCodeUnit = {
      type: "code",
      id: "test-code-3",
      language: "python",
      executionStatus: "verified", // KLAIM VERIFIED
      preExplanation: "Penjelasan teoritis mendalam tentang algoritma linear.",
      code: "print('hello')",
      dependencies: ["numpy"],
      runtimeComplexity: "O(1)",
      memoryComplexity: "O(1)",
      failureModes: ["None"],
    };
    // Tidak ada output unit yang menyediakan evidence
    assert.throws(
      () => NotebookQualityGateValidator.validateCodeUnit(invalidUnit, [invalidUnit]),
      /QUALITY_GATE_3/
    );
  });

  it("Gate 4: Menolak code cell dengan exit code bukan nol", () => {
    const codeUnit: NotebookCodeUnit = {
      type: "code",
      id: "test-code-4",
      language: "python",
      executionStatus: "verified",
      preExplanation: "Penjelasan teoritis mendalam tentang algoritma linear.",
      code: "raise ValueError('error')",
      dependencies: ["numpy"],
      runtimeComplexity: "O(1)",
      memoryComplexity: "O(1)",
      failureModes: ["ValueError"],
    };
    const outputUnit: NotebookUnit = {
      type: "output",
      id: "out-4",
      relatedCodeUnitId: "test-code-4",
      format: "error",
      content: "Traceback error",
      executionEvidence: {
        runtime: "Python 3.12.10",
        exitCode: 1, // GAGAL EXIT CODE 1
        stdout: "",
        stderr: "ValueError",
        executionTimeMs: 12,
        timestamp: "2026-09-16T00:00:00Z",
      },
    };
    assert.throws(
      () => NotebookQualityGateValidator.validateCodeUnit(codeUnit, [codeUnit, outputUnit]),
      /QUALITY_GATE_4/
    );
  });

  it("Gate 5: Menolak code cell yang menghasilkan output kosong", () => {
    const codeUnit: NotebookCodeUnit = {
      type: "code",
      id: "test-code-5",
      language: "python",
      executionStatus: "verified",
      preExplanation: "Penjelasan teoritis mendalam tentang algoritma linear.",
      code: "pass",
      dependencies: ["numpy"],
      runtimeComplexity: "O(1)",
      memoryComplexity: "O(1)",
      failureModes: ["None"],
    };
    const outputUnit: NotebookUnit = {
      type: "output",
      id: "out-5",
      relatedCodeUnitId: "test-code-5",
      format: "text",
      content: "   ", // KOSONG HANYA WHITESPACE
      executionEvidence: {
        runtime: "Python 3.12.10",
        exitCode: 0,
        stdout: "",
        stderr: "",
        executionTimeMs: 5,
        timestamp: "2026-09-16T00:00:00Z",
      },
    };
    assert.throws(
      () => NotebookQualityGateValidator.validateCodeUnit(codeUnit, [codeUnit, outputUnit]),
      /QUALITY_GATE_5/
    );
  });

  it("Gate 6: Menolak code cell tanpa definisi dependencies", () => {
    const codeUnit: NotebookCodeUnit = {
      type: "code",
      id: "test-code-6",
      language: "python",
      executionStatus: "not_executed",
      preExplanation: "Penjelasan teoritis mendalam tentang algoritma linear.",
      code: "import torch",
      dependencies: [], // KOSONG
      runtimeComplexity: "O(1)",
      memoryComplexity: "O(1)",
      failureModes: ["ModuleNotFoundError"],
    };
    assert.throws(
      () => NotebookQualityGateValidator.validateCodeUnit(codeUnit, [codeUnit]),
      /QUALITY_GATE_6/
    );
  });

  it("Gate 7: Menolak code cell tanpa daftar potensi failureModes", () => {
    const codeUnit: NotebookCodeUnit = {
      type: "code",
      id: "test-code-7",
      language: "python",
      executionStatus: "not_executed",
      preExplanation: "Penjelasan teoritis mendalam tentang algoritma linear.",
      code: "a = 1 / 0",
      dependencies: ["numpy"],
      runtimeComplexity: "O(1)",
      memoryComplexity: "O(1)",
      failureModes: [], // KOSONG
    };
    assert.throws(
      () => NotebookQualityGateValidator.validateCodeUnit(codeUnit, [codeUnit]),
      /QUALITY_GATE_7/
    );
  });

  it("Gate 8: Menolak code cell tanpa spesifikasi kompleksitas runtime/memori", () => {
    const codeUnit: NotebookCodeUnit = {
      type: "code",
      id: "test-code-8",
      language: "python",
      executionStatus: "not_executed",
      preExplanation: "Penjelasan teoritis mendalam tentang algoritma linear.",
      code: "x = 1",
      dependencies: ["numpy"],
      runtimeComplexity: "", // KOSONG
      memoryComplexity: "O(1)",
      failureModes: ["None"],
    };
    assert.throws(
      () => NotebookQualityGateValidator.validateCodeUnit(codeUnit, [codeUnit]),
      /QUALITY_GATE_8/
    );
  });

  it("Gate 9: Menolak formula matematis tanpa kamus variabel (variables dictionary)", () => {
    const formulaUnit: NotebookFormulaUnit = {
      type: "formula",
      id: "test-formula-9",
      name: "Rumus Kosong",
      latex: "y = ax + b",
      variables: [], // KOSONG
      workedExample: {
        inputs: { a: 1 },
        stepByStep: ["step 1"],
        finalResult: "1",
      },
    };
    assert.throws(
      () => NotebookQualityGateValidator.validateFormulaUnit(formulaUnit),
      /QUALITY_GATE_9/
    );
  });

  it("Gate 10: Menolak formula matematis tanpa contoh perhitungan manual (worked example)", () => {
    const formulaUnit: NotebookFormulaUnit = {
      type: "formula",
      id: "test-formula-10",
      name: "Rumus Tanpa Contoh",
      latex: "y = ax + b",
      variables: [{ symbol: "y", description: "target", unit: "unit" }],
      workedExample: undefined, // KOSONG
    };
    assert.throws(
      () => NotebookQualityGateValidator.validateFormulaUnit(formulaUnit),
      /QUALITY_GATE_10/
    );
  });

  it("Gate 11: Menolak exercise dengan bobot rubrik penilaian tidak sama dengan 100%", () => {
    const exerciseUnit: NotebookExerciseUnit = {
      type: "exercise",
      id: "test-ex-11",
      level: 1,
      title: "Exercise 1",
      scenario: "Skenario",
      task: "Tugas",
      hints: ["Hint 1"],
      solutionCode: "x = 1",
      solutionExplanation: "Penjelasan",
      evaluationRubric: [
        { criterion: "Ketepatan", weight: 50, expectation: "Akurat" },
        { criterion: "Sintaks", weight: 30, expectation: "Rapi" }, // TOTAL HANYA 80%!
      ],
    };
    assert.throws(
      () => NotebookQualityGateValidator.validateExerciseUnit(exerciseUnit),
      /QUALITY_GATE_11/
    );
  });

  it("Gate 12: Menolak exercise tanpa petunjuk bertahap (hints)", () => {
    const exerciseUnit: NotebookExerciseUnit = {
      type: "exercise",
      id: "test-ex-12",
      level: 2,
      title: "Exercise 2",
      scenario: "Skenario",
      task: "Tugas",
      hints: [], // KOSONG
      solutionCode: "x = 1",
      solutionExplanation: "Penjelasan",
      evaluationRubric: [{ criterion: "Semua", weight: 100, expectation: "Bagus" }],
    };
    assert.throws(
      () => NotebookQualityGateValidator.validateExerciseUnit(exerciseUnit),
      /QUALITY_GATE_12/
    );
  });

  it("Gate 13: Menolak exercise tanpa kode solusi atau pembahasan referensi", () => {
    const exerciseUnit: NotebookExerciseUnit = {
      type: "exercise",
      id: "test-ex-13",
      level: 3,
      title: "Exercise 3",
      scenario: "Skenario",
      task: "Tugas",
      hints: ["Hint 1"],
      solutionCode: "", // KOSONG
      solutionExplanation: "",
      evaluationRubric: [{ criterion: "Semua", weight: 100, expectation: "Bagus" }],
    };
    assert.throws(
      () => NotebookQualityGateValidator.validateExerciseUnit(exerciseUnit),
      /QUALITY_GATE_13/
    );
  });

  it("Gate 14: Menolak project praktikum tanpa spesifikasi dataset lengkap", () => {
    const projUnit: NotebookProjectUnit = {
      type: "project",
      id: "test-proj-14",
      title: "Proyek A",
      industryContext: "Fintech",
      businessProblem: "Credit",
      datasetSpecs: {
        name: "", // KOSONG
        rows: 0,
        columns: 0,
        source: "",
      },
      milestoneSteps: [{ title: "Step 1", deliverables: ["D1"] }],
      acceptanceCriteria: ["OK"],
    };
    assert.throws(
      () => NotebookQualityGateValidator.validateProjectUnit(projUnit),
      /QUALITY_GATE_14/
    );
  });

  it("Gate 15: Menolak project praktikum tanpa milestone deliverables", () => {
    const projUnit: NotebookProjectUnit = {
      type: "project",
      id: "test-proj-15",
      title: "Proyek B",
      industryContext: "Healthcare",
      businessProblem: "Diagnosis",
      datasetSpecs: {
        name: "Data B",
        rows: 100,
        columns: 5,
        source: "https://example.com",
      },
      milestoneSteps: [], // KOSONG
      acceptanceCriteria: ["OK"],
    };
    assert.throws(
      () => NotebookQualityGateValidator.validateProjectUnit(projUnit),
      /QUALITY_GATE_15/
    );
  });

  it("Gate 16: Menolak tabel dengan header atau baris kosong", () => {
    const tableUnit: NotebookTableUnit = {
      type: "table",
      id: "test-tbl-16",
      caption: "Tabel Kosong",
      headers: [], // KOSONG
      rows: [],
    };
    assert.throws(
      () => NotebookQualityGateValidator.validateTableUnit(tableUnit),
      /QUALITY_GATE_16/
    );
  });

  it("Gate 17: Menolak interpretation card dengan observasi kurang dari 2", () => {
    const interpUnit: NotebookInterpretationUnit = {
      type: "interpretation",
      id: "test-interp-17",
      headline: "Headline",
      observations: ["Hanya satu observasi"], // KURANG DARI 2
      domainImplication: "Implikasi",
    };
    assert.throws(
      () => NotebookQualityGateValidator.validateInterpretationUnit(interpUnit),
      /QUALITY_GATE_17/
    );
  });

  it("Gate 18: Menolak warning card tanpa countermeasure terukur", () => {
    const warnUnit: NotebookWarningUnit = {
      type: "warning",
      id: "test-warn-18",
      severity: "warning",
      title: "Peringatan",
      description: "Deskripsi",
      countermeasure: "", // KOSONG
    };
    assert.throws(
      () => NotebookQualityGateValidator.validateWarningUnit(warnUnit),
      /QUALITY_GATE_18/
    );
  });

  it("Gate 19: Menolak definition card tanpa analogi dunia nyata atau intuisi", () => {
    const defUnit: NotebookDefinitionUnit = {
      type: "definition",
      id: "test-def-19",
      term: "Term",
      formalDefinition: "Definisi formal panjang",
      intuitiveExplanation: "", // KOSONG
      realWorldAnalogy: "",
    };
    assert.throws(
      () => NotebookQualityGateValidator.validateDefinitionUnit(defUnit),
      /QUALITY_GATE_19/
    );
  });

  it("Gate 20: Menolak audit California Housing yang mengabaikan ceiling truncation", () => {
    const blindSubchapter: AcademicSubchapter = {
      id: "sub-blind",
      slug: "blind",
      title: "Audit Buta",
      orderIndex: 6,
      description: "Deskripsi",
      content_markdown: "Hanya membahas rata-rata dan deviasi.",
      units: [
        {
          type: "markdown",
          id: "m-blind",
          content: "Data ini hanya memuat ringkasan sederhana tanpa audit nilai batas ekstrem.",
        },
      ],
    };
    assert.throws(
      () => NotebookQualityGateValidator.validateCaliforniaHousingAudit(blindSubchapter),
      /QUALITY_GATE_20/
    );
  });
});
