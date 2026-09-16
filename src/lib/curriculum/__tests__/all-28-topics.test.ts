import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ALL_ACADEMIC_CURRICULA,
  getAcademicCurriculum,
  getAllCurriculumOverview,
} from "../registry";
import {
  curriculumToDocSectionItems,
  curriculumToFlatDocSectionItems,
  curriculumToModuleSections,
} from "../types";

describe("Phase 2: Complete Academic Curriculum Reconstruction (All 28 Topics)", () => {
  it("Harus memuat tepat 28 kurikulum akademik topik AI & Data Science", () => {
    assert.equal(ALL_ACADEMIC_CURRICULA.length, 28);
    const overview = getAllCurriculumOverview();
    assert.equal(overview.length, 28);
  });

  it("Setiap topik harus memiliki ID dan Slug unik tanpa duplikasi", () => {
    const idSet = new Set<string>();
    const slugSet = new Set<string>();

    for (const curr of ALL_ACADEMIC_CURRICULA) {
      assert.ok(curr.id, `ID topik kosong pada ${curr.title}`);
      assert.ok(curr.slug, `Slug topik kosong pada ${curr.title}`);
      assert.equal(idSet.has(curr.id), false, `ID duplikat: ${curr.id}`);
      assert.equal(slugSet.has(curr.slug), false, `Slug duplikat: ${curr.slug}`);
      idSet.add(curr.id);
      slugSet.add(curr.slug);
    }
  });

  it("Setiap topik harus memiliki rujukan akademik sah (DOI / URL / Buku Teks / Paper)", () => {
    for (const curr of ALL_ACADEMIC_CURRICULA) {
      assert.ok(curr.primaryReferences.length >= 1, `Tidak ada rujukan pada topik: ${curr.title}`);
      for (const ref of curr.primaryReferences) {
        assert.ok(ref.title, `Judul rujukan kosong pada ${curr.title}`);
        assert.ok(ref.authors.length > 0, `Daftar penulis kosong pada ${ref.title}`);
        assert.match(ref.url, /^https?:\/\//, `URL tidak valid pada ${ref.title}`);
        assert.ok(ref.relevance, `Relevansi kosong pada ${ref.title}`);
      }
    }
  });

  it("Setiap topik harus memiliki struktur bab dan subbab yang valid dan mendalam", () => {
    for (const curr of ALL_ACADEMIC_CURRICULA) {
      const minChapters = curr.auditStatus === "VERIFIED_WITH_LIMITATIONS" || curr.auditStatus === "VERIFIED" ? 2 : 4;
      assert.ok(curr.chapters.length >= minChapters, `Jumlah bab < ${minChapters} pada topik ${curr.title}`);

      for (const ch of curr.chapters) {
        assert.ok(ch.id, `ID bab kosong pada ${curr.title}`);
        assert.ok(ch.title, `Judul bab kosong pada ${curr.title}`);
        assert.ok(ch.subchapters.length >= 1, `Bab tanpa subbab pada ${ch.title}`);

        for (const sub of ch.subchapters) {
          assert.ok(sub.id, `ID subbab kosong pada ${ch.title}`);
          assert.ok(sub.title, `Judul subbab kosong pada ${ch.title}`);
          assert.ok(sub.content_markdown, `Konten subbab kosong pada ${sub.title}`);
          assert.ok(sub.content_markdown.length > 100, `Konten terlalu pendek pada ${sub.title}`);
        }
      }
    }
  });

  it("Setiap topik harus menyertakan formulasi matematis formal (LaTeX KaTeX)", () => {
    for (const curr of ALL_ACADEMIC_CURRICULA) {
      const fullMarkdown = curr.chapters
        .flatMap((ch) => ch.subchapters.map((sub) => sub.content_markdown))
        .join("\n");

      const hasLatex = fullMarkdown.includes("$") || fullMarkdown.includes("$$");
      assert.equal(hasLatex, true, `Topik ${curr.title} tidak memiliki formulasi LaTeX KaTeX`);
    }
  });

  it("CRITICAL: Pencegahan Tabrakan Rute AI Security vs Machine Learning", () => {
    // Kueri dengan nama lengkap AI Security
    const aiSec1 = getAcademicCurriculum("AI Security & Adversarial Machine Learning");
    assert.ok(aiSec1, "AI Security tidak ditemukan");
    assert.equal(aiSec1.id, "ai-security");
    assert.ok(aiSec1.title.includes("Security"));

    // Kueri dengan slug
    const aiSec2 = getAcademicCurriculum("ai-security");
    assert.ok(aiSec2);
    assert.equal(aiSec2.id, "ai-security");

    // Kueri dengan kata kunci adversarial
    const aiSec3 = getAcademicCurriculum("adversarial machine learning");
    assert.ok(aiSec3);
    assert.equal(aiSec3.id, "ai-security");

    // Kueri murni Machine Learning
    const ml1 = getAcademicCurriculum("Machine Learning");
    assert.ok(ml1, "Machine Learning tidak ditemukan");
    assert.equal(ml1.id, "machine-learning");

    const ml2 = getAcademicCurriculum("scikit-learn");
    assert.ok(ml2);
    assert.equal(ml2.id, "machine-learning");
  });

  it("Pencarian cerdas (lookup map) harus mendukung alias dan variasi nama dari SYSTEM_PRIMARY_CATEGORIES", () => {
    const testCases = [
      { query: "AI Agent", expectedId: "ai-agent" },
      { query: "AI Ethics & Responsible AI", expectedId: "ai-ethics" },
      { query: "AI Governance & Regulasi", expectedId: "ai-governance" },
      { query: "Computer Vision", expectedId: "computer-vision" },
      { query: "Data Analyst", expectedId: "data-analyst" },
      { query: "Data Engineering & Big Data untuk AI", expectedId: "data-engineering-ai" },
      { query: "Data Science", expectedId: "data-science" },
      { query: "Deep Learning", expectedId: "deep-learning" },
      { query: "Edge AI & TinyML", expectedId: "edge-ai-tinyml" },
      { query: "Expert System", expectedId: "expert-system" },
      { query: "Generative AI", expectedId: "generative-ai" },
      { query: "Graph Neural Network (GNN)", expectedId: "graph-neural-network" },
      { query: "Knowledge Representation", expectedId: "knowledge-representation" },
      { query: "Large Language Model", expectedId: "large-language-model" },
      { query: "MLOps & AI Deployment", expectedId: "mlops-deployment" },
      { query: "Multimodal AI", expectedId: "multimodal-ai" },
      { query: "Natural Language Processing", expectedId: "natural-language-processing" },
      { query: "Recommendation System", expectedId: "recommendation-system" },
      { query: "Reinforcement Learning", expectedId: "reinforcement-learning" },
      { query: "Robotics & Embodied AI", expectedId: "robotics-embodied-ai" },
      { query: "Speech & Audio AI", expectedId: "speech-audio-ai" },
      { query: "Time Series Forecasting & Anomaly Detection", expectedId: "time-series-forecasting" },
      { query: "Vector Database & Retrieval System", expectedId: "vector-database-retrieval" },
    ];

    for (const { query, expectedId } of testCases) {
      const result = getAcademicCurriculum(query);
      assert.ok(result, `Hasil pencarian undefined untuk ${query}`);
      assert.equal(result.id, expectedId, `Pencarian untuk ${query} menghasilkan ${result.id} bukan ${expectedId}`);
    }
  });

  it("Converter Helper: curriculumToDocSectionItems & curriculumToModuleSections", () => {
    for (const curr of ALL_ACADEMIC_CURRICULA) {
      const docSections = curriculumToDocSectionItems(curr);
      assert.equal(docSections.length, curr.chapters.length);
      assert.equal(docSections[0].title, curr.chapters[0].title);
      assert.equal(docSections[0].subsections?.length, curr.chapters[0].subchapters.length);

      const flatSections = curriculumToFlatDocSectionItems(curr);
      assert.ok(flatSections.length > 0);
      assert.ok(flatSections[0].title);

      const moduleSections = curriculumToModuleSections(curr);
      assert.equal(moduleSections.length, curr.chapters.length);
      assert.equal(moduleSections[0].title, curr.chapters[0].title);
    }
  });
});
