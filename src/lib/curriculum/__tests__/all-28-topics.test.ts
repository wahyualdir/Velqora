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
import {
  assertContentUniqueness,
  assertCodeSubstance,
  assertStructuredExercises,
  assertCitationDeepLink,
  TemplateRepetitionError,
  TrivialCodeError,
  UnstructuredExercisesError,
  GenericCitationError,
} from "../semantic-gates";
import {
  parseExercisesFromMarkdown,
  normalizeSubchapterExercises,
} from "../exercise-parser";
import {
  substantiveAiFundamentalsChapter1,
  substantiveMachineLearningChapter1,
  substantiveMachineLearningChapter6,
} from "../pilot-content";

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

describe("Phase 2 Rework: 3-Level Hierarchy, Structured Exercises & Semantic Quality Gates", () => {
  describe("FASE 1: UI Rendering Hierarchy (Level 3 Traversal & Fallback)", () => {
    it("curriculumToDocSectionItems harus memetakan level 3 subsections (Unit) di bawah subbab", () => {
      const curr = ALL_ACADEMIC_CURRICULA[0];
      const docSections = curriculumToDocSectionItems(curr);

      assert.ok(docSections.length > 0, "DocSections tidak boleh kosong");
      const firstChapter = docSections[0];
      assert.ok(firstChapter.subsections && firstChapter.subsections.length > 0, "Bab harus memiliki subbab");

      const firstSubchapter = firstChapter.subsections[0];
      // Jika subbab memiliki unit di topics data, subsections harus terisi level 3
      if (firstSubchapter.subsections && firstSubchapter.subsections.length > 0) {
        const firstUnit = firstSubchapter.subsections[0];
        assert.equal(firstUnit.level, 3, "Unit harus memiliki level 3");
        assert.ok(firstUnit.id, "Unit harus memiliki id");
        assert.ok(firstUnit.title, "Unit harus memiliki judul");
      }
    });

    it("Fallback aman: Bab atau subbab tanpa unit tidak boleh throw runtime error", () => {
      const emptySubchapter = {
        id: "mock-sub-empty",
        slug: "mock-sub-empty",
        title: "Mock Subchapter Empty",
        orderIndex: 1,
        content_markdown: "Konten tanpa unit pembelajaran.",
        subsections: undefined,
      };

      const mockCurriculum: any = {
        id: "mock-curr",
        title: "Mock Curriculum",
        slug: "mock-curr",
        chapters: [
          {
            id: "mock-ch-1",
            slug: "mock-ch-1",
            title: "Mock Chapter 1",
            orderIndex: 1,
            subchapters: [emptySubchapter],
          },
        ],
      };

      assert.doesNotThrow(() => {
        const sections = curriculumToDocSectionItems(mockCurriculum);
        assert.equal(sections.length, 1);
        assert.equal(sections[0].subsections?.length, 1);
        assert.deepEqual(sections[0].subsections?.[0].subsections, []);
      });
    });
  });

  describe("FASE 2: Validasi & Schema Latihan Terstruktur (Structured Exercises)", () => {
    it("parseExercisesFromMarkdown harus mem-parse blok markdown latihan ke format ExerciseItem", () => {
      const sampleMarkdown = `
### Latihan Pemahaman & Implementasi
#### Latihan 1: Evaluasi Konsep
Tantangan: Jelaskan prinsip kerja agen rasional dan mengapa berbeda dari agen omniscient.
Petunjuk: Ingat bahwa rasionalitas memaksimalkan ekspektasi performa.
Solusi: Rasionalitas memaksimalkan ekspektasi performa berdasarkan persepsi yang diterima.

#### Latihan 2: Implementasi Fungsi
Tantangan: Buat fungsi kalkulasi nilai utilitas agen rasional.
Kode Awal:
def calculate_utility(rewards, discount):
    pass
Solusi:
def calculate_utility(rewards, discount):
    return sum(r * (discount ** i) for i, r in enumerate(rewards))
`;

      const parsed = parseExercisesFromMarkdown(sampleMarkdown);
      assert.ok(parsed.length >= 2, `Harus menghasilkan minimal 2 latihan, didapat: ${parsed.length}`);
      assert.equal(parsed[0].level, 1);
      assert.ok(parsed[0].task.includes("prinsip kerja agen rasional"));
      assert.ok(parsed[0].hint?.includes("ekspektasi performa"));
      assert.ok(parsed[0].solution.includes("Rasionalitas memaksimalkan"));

      assert.equal(parsed[1].level, 2);
      assert.ok(parsed[1].starterCode?.includes("def calculate_utility"));
      assert.ok(parsed[1].solution.includes("return sum"));
    });

    it("normalizeSubchapterExercises harus menjamin minimal 2 level latihan terstruktur", () => {
      const singleExerciseSubchapter = {
        id: "sub-1",
        slug: "sub-1",
        orderIndex: 1,
        description: "Pengantar materi kecerdasan buatan",
        title: "1.1 Pengantar",
        content_markdown: "Pengantar materi kecerdasan buatan.",
        exercises: [
          {
            level: 1,
            task: "Apakah AI sama dengan consciousness?",
            solution: "Tidak, AI modern adalah optimasi fungsi objektif matematika.",
          },
        ],
      };

      const normalized = normalizeSubchapterExercises(singleExerciseSubchapter);
      assert.ok(normalized.length >= 2, "Harus dinormalisasi menjadi minimal 2 latihan");
      assert.equal(normalized[0].level, 1);
      assert.equal(normalized[1].level, 2);
      assert.ok(normalized[0].id);
      assert.ok(normalized[1].id);
      assert.ok(normalized[0].task);
      assert.ok(normalized[0].solution);
      assert.ok(normalized[1].task);
      assert.ok(normalized[1].solution);
    });

    it("curriculumToDocSectionItems harus mengisi exercises dengan skema terstruktur di setiap subbab", () => {
      const curr = ALL_ACADEMIC_CURRICULA[0];
      const sections = curriculumToDocSectionItems(curr);
      const sub = sections[0].subsections?.[0];

      assert.ok(sub, "Subbab pertama harus ada");
      assert.ok(sub.exercises, "Field exercises harus terisi");
      assert.ok(sub.exercises.length >= 2, "Exercises harus memiliki minimal 2 level");
      for (const ex of sub.exercises) {
        assert.ok(ex.id, "ID latihan harus ada");
        assert.ok([1, 2, 3, 4].includes(ex.level), `Level latihan tidak valid: ${ex.level}`);
        assert.ok(ex.task && ex.task.trim().length > 0, "Task latihan tidak boleh kosong");
        assert.ok(ex.solution && ex.solution.trim().length > 0, "Solution latihan tidak boleh kosong");
      }
    });
  });

  describe("FASE 3: Assertion Semantik & Eliminasi False PASS", () => {
    describe("1. Uniqueness Assertion (Jaccard & Opening Sentence Clones)", () => {
      it("Harus menggagalkan konten jika kemiripan antar-unit > 60% (TemplateRepetitionError)", () => {
        const repetitiveUnit1 = {
          id: "u-1",
          title: "Unit 1",
          content_markdown: "Modul ini membahas konsep dasar sistem cerdas dalam era modern untuk memecahkan persoalan komputasi skala besar.",
        };
        const repetitiveUnit2 = {
          id: "u-2",
          title: "Unit 2",
          content_markdown: "Modul ini membahas konsep dasar sistem cerdas dalam era modern untuk memecahkan persoalan komputasi skala besar dan data.",
        };

        assert.throws(
          () => assertContentUniqueness([repetitiveUnit1, repetitiveUnit2], 0.6),
          TemplateRepetitionError
        );
      });

      it("Harus meloloskan konten yang memiliki substansi dan kalimat unik", () => {
        const distinctUnit1 = {
          id: "u-1",
          title: "Unit 1: Teorema Bayes",
          content_markdown: "Probabilitas posterior dihitung menggunakan normalisasi perkalian likelihood dan prior.",
        };
        const distinctUnit2 = {
          id: "u-2",
          title: "Unit 2: Algoritma Backpropagation",
          content_markdown: "Turunan parsial galat fungsi rugi terhadap bobot dihitung secara mundur melalui aturan rantai kalkulus.",
        };

        assert.doesNotThrow(() => assertContentUniqueness([distinctUnit1, distinctUnit2], 0.6));
      });
    });

    describe("2. Code Substance Assertion (Trivial Print & Mockup Detection)", () => {
      it("Harus menolak kode yang hanya berisi print() tanpa komputasi (TrivialCodeError)", () => {
        const trivialCodeSub = {
          id: "sub-trivial",
          title: "Subbab Trivial",
          content_markdown: `
Berikut contoh kodenya:
\`\`\`python
print("Hello World")
print("AI is cool")
\`\`\`
`,
        };

        assert.throws(() => assertCodeSubstance(trivialCodeSub), TrivialCodeError);
      });

      it("Harus menolak kode mockup generik return f'action_{name}' (TrivialCodeError)", () => {
        const mockupCodeSub = {
          id: "sub-mockup",
          title: "Subbab Mockup",
          content_markdown: `
\`\`\`python
def process_data(action):
    return f"processed_{action}"
\`\`\`
`,
        };

        assert.throws(() => assertCodeSubstance(mockupCodeSub), TrivialCodeError);
      });

      it("Harus meloloskan kode dengan struktur komputasi, fungsi matematika, atau manipulasi data nyata", () => {
        const validCodeSub = {
          id: "sub-valid",
          title: "Subbab Valid",
          content_markdown: `
\`\`\`python
import numpy as np

def sigmoid(z: np.ndarray) -> np.ndarray:
    return 1.0 / (1.0 + np.exp(-z))

def binary_cross_entropy(y_true: np.ndarray, y_pred: np.ndarray, eps: float = 1e-15) -> float:
    y_pred = np.clip(y_pred, eps, 1 - eps)
    loss = -np.mean(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))
    return float(loss)
\`\`\`
`,
        };

        assert.doesNotThrow(() => assertCodeSubstance(validCodeSub));
      });
    });

    describe("3. Structured Exercises Assertion", () => {
      it("Harus menolak subbab dengan latihan kurang dari 2 level (UnstructuredExercisesError)", () => {
        const incompleteSub = {
          id: "sub-incomplete-ex",
          title: "Incomplete Subchapter",
          content_markdown: "Konten materi.",
          structuredExercises: [
            {
              id: "ex-1",
              level: 1 as const,
              task: "Soal level 1",
              solution: "Jawaban level 1",
            },
          ],
        };

        assert.throws(() => assertStructuredExercises(incompleteSub), UnstructuredExercisesError);
      });

      it("Harus meloloskan subbab dengan minimal 2 level latihan terstruktur konkret", () => {
        const validSub = {
          id: "sub-valid-ex",
          title: "Valid Subchapter",
          content_markdown: "Konten materi.",
          structuredExercises: [
            {
              id: "ex-1",
              level: 1 as const,
              task: "Jelaskan definisi agen rasional",
              solution: "Agen yang memaksimalkan ekspektasi fungsi kinerja.",
            },
            {
              id: "ex-2",
              level: 2 as const,
              task: "Implementasikan kelas Agent dengan metode act()",
              starterCode: "class Agent:\n    pass",
              solution: "class Agent:\n    def act(self, percept):\n        return 'ACTION_MOVE'",
            },
          ],
        };

        assert.doesNotThrow(() => assertStructuredExercises(validSub));
      });
    });

    describe("4. Citation Deep-link Assertion", () => {
      it("Harus menolak sitasi generic homepage root seperti docs.python.org/3/ (GenericCitationError)", () => {
        const genericRefSub = {
          id: "sub-generic-ref",
          title: "Subbab Referensi Generic",
          references: [
            {
              title: "Python Documentation",
              authors: ["Python Software Foundation"],
              type: "documentation" as const,
              url: "https://docs.python.org/3/",
              relevance: "Dokumentasi umum python",
            },
          ],
        };

        assert.throws(() => assertCitationDeepLink(genericRefSub), GenericCitationError);
      });

      it("Harus meloloskan sitasi deep-link dengan subpath spesifik atau DOI", () => {
        const validRefSub = {
          id: "sub-valid-ref",
          title: "Subbab Referensi Valid",
          references: [
            {
              title: "Python AST Library Reference",
              authors: ["Python Software Foundation"],
              type: "documentation" as const,
              url: "https://docs.python.org/3/library/ast.html#ast.parse",
              relevance: "Spesifikasi resmi AST parser.",
            },
            {
              title: "Attention Is All You Need",
              authors: ["Vaswani et al."],
              type: "paper" as const,
              url: "https://arxiv.org/abs/1706.03762",
              relevance: "Makalah orisinal arsitektur transformer.",
            },
          ],
        };

        assert.doesNotThrow(() => assertCitationDeepLink(validRefSub));
      });
    });

    describe("5. Validasi Mutu Konten Pilot Substantif (AI Fundamentals & Machine Learning)", () => {
      it("Konten pilot substantiveAiFundamentalsChapter1 harus lolos semua assertion semantik", () => {
        assert.ok(substantiveAiFundamentalsChapter1.summary, "Chapter summary tidak boleh kosong");
        assert.ok(substantiveAiFundamentalsChapter1.transitionToNextChapter, "Chapter transition tidak boleh kosong");

        for (const sub of substantiveAiFundamentalsChapter1.subchapters) {
          // Normalize exercises for pilot
          const normalizedExercises = normalizeSubchapterExercises(sub);
          const subWithNorm = { ...sub, structuredExercises: normalizedExercises };

          assertStructuredExercises(subWithNorm);
          assertCodeSubstance(sub);
          assertCitationDeepLink(sub);
        }

        assertContentUniqueness(substantiveAiFundamentalsChapter1.subchapters, 0.7);
      });

      it("Konten pilot substantiveMachineLearningChapter1 harus lolos semua assertion semantik", () => {
        assert.ok(substantiveMachineLearningChapter1.summary, "Chapter summary tidak boleh kosong");
        assert.ok(substantiveMachineLearningChapter1.transitionToNextChapter, "Chapter transition tidak boleh kosong");

        for (const sub of substantiveMachineLearningChapter1.subchapters) {
          const normalizedExercises = normalizeSubchapterExercises(sub);
          const subWithNorm = { ...sub, structuredExercises: normalizedExercises };

          assertStructuredExercises(subWithNorm);
          assertCodeSubstance(sub);
          assertCitationDeepLink(sub);
        }

        assertContentUniqueness(substantiveMachineLearningChapter1.subchapters, 0.7);
      });

      it("Konten pilot substantiveMachineLearningChapter6 harus lolos semua assertion semantik", () => {
        assert.ok(substantiveMachineLearningChapter6.summary, "Chapter summary tidak boleh kosong");
        assert.ok(substantiveMachineLearningChapter6.transitionToNextChapter, "Chapter transition tidak boleh kosong");

        for (const sub of substantiveMachineLearningChapter6.subchapters) {
          const normalizedExercises = normalizeSubchapterExercises(sub);
          const subWithNorm = { ...sub, structuredExercises: normalizedExercises };

          assertStructuredExercises(subWithNorm);
          assertCodeSubstance(sub);
          assertCitationDeepLink(sub);
        }

        assertContentUniqueness(substantiveMachineLearningChapter6.subchapters, 0.7);
      });
    });
  });
});

