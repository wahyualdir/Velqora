import { describe, it } from "node:test";
import assert from "node:assert";
import {
  AI_FUNDAMENTALS_CHAPTERS,
  getAllFlatAiFundamentalsSections,
  getAiFundamentalsModuleSections,
} from "../ai-fundamentals-curriculum";
import { getDefaultSectionsForCategory } from "../fallback-syllabus-defaults";

describe("Topik 5: Artificial Intelligence Fundamentals Academic Pilot Suite", () => {
  it("harus memiliki tepat 5 Bab Kurikulum Utama", () => {
    assert.strictEqual(AI_FUNDAMENTALS_CHAPTERS.length, 5);
  });

  it("harus memiliki tepat 26 Subbab dengan materi akademik komprehensif", () => {
    const flatSections = getAllFlatAiFundamentalsSections();
    assert.strictEqual(flatSections.length, 26);

    flatSections.forEach((sec, idx) => {
      assert.ok(sec.id, `Subbab ke-${idx + 1} harus memiliki ID`);
      assert.ok(sec.title, `Subbab ke-${idx + 1} harus memiliki Judul`);
      assert.ok(sec.slug, `Subbab ke-${idx + 1} harus memiliki Slug`);
      assert.ok(sec.parentTitle, `Subbab ke-${idx + 1} harus memiliki referensi Bab Induk`);
      assert.ok(
        sec.content_markdown && sec.content_markdown.trim().length > 100,
        `Subbab '${sec.title}' harus memiliki konten markdown akademik komprehensif (> 100 karakter)`
      );
    });
  });

  it("harus memuat perumusan matematis LaTeX formal pada bab-bab terkait", () => {
    const flat = getAllFlatAiFundamentalsSections();
    const searchSection = flat.find((s) => s.id === "aif-bab-2-5");
    assert.ok(searchSection, "Subbab 2.5 (A* Search) harus ditemukan");
    assert.ok(
      searchSection.content_markdown?.includes("f(n) = g(n) + h(n)"),
      "Harus memuat formulasi matematis f(n) = g(n) + h(n)"
    );
    assert.ok(
      searchSection.content_markdown?.includes("h(n)") && searchSection.content_markdown?.includes("h^*(n)"),
      "Harus memuat kondisi admissibility heuristik"
    );

    const biasVarSection = flat.find((s) => s.id === "aif-bab-4-5");
    assert.ok(biasVarSection, "Subbab 4.5 (Bias-Variance) harus ditemukan");
    assert.ok(
      biasVarSection.content_markdown?.includes("Bias"),
      "Harus memuat dekomposisi bias"
    );
    assert.ok(
      biasVarSection.content_markdown?.includes("Var"),
      "Harus memuat dekomposisi varians"
    );
  });

  it("harus menyediakan implementasi kode Python runnable pada subbab praktikum", () => {
    const flat = getAllFlatAiFundamentalsSections();
    const labBfs = flat.find((s) => s.id === "aif-bab-5-1");
    assert.ok(labBfs, "Subbab 5.1 (Lab BFS) harus ditemukan");
    assert.ok(
      labBfs.content_markdown?.includes("def solve_maze_bfs"),
      "Harus memuat implementasi fungsi BFS grid maze solver"
    );

    const labAStar = flat.find((s) => s.id === "aif-bab-5-2");
    assert.ok(labAStar, "Subbab 5.2 (Lab A*) harus ditemukan");
    assert.ok(
      labAStar.content_markdown?.includes("heapq"),
      "Harus memuat implementasi priority queue heapq untuk A*"
    );

    const labRule = flat.find((s) => s.id === "aif-bab-5-3");
    assert.ok(labRule, "Subbab 5.3 (Lab Rule Engine) harus ditemukan");
    assert.ok(
      labRule.content_markdown?.includes("class RuleBasedClassifier"),
      "Harus memuat implementasi sistem pakar forward chaining"
    );
  });

  it("harus menyediakan silabus modul bawaan dan terintegrasi dengan kurikulum akademik SSOT", () => {
    const pilotSections = getAiFundamentalsModuleSections();
    assert.strictEqual(pilotSections.length, 5);
    assert.strictEqual(pilotSections[0].title, "BAB 1: Pengantar AI & Intelligent Agents");

    const academicSections = getDefaultSectionsForCategory("Artificial Intelligence Fundamentals");
    assert.strictEqual(academicSections.length, 10);
    assert.strictEqual(academicSections[0].title, "BAB 1: Pengantar Kecerdasan Buatan & Paradigma Agen Rasional");
    assert.strictEqual(academicSections[4].title, "BAB 5: Teori Admisibilitas & Konsistensi Heuristik");
  });
});
