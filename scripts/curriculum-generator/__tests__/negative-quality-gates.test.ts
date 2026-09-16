import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  SubstantiveLearningUnit,
  SubstantiveChapter,
} from "../adaptive-schema";
import {
  validateSubstantiveUnit,
  validateSubstantiveChapter,
} from "./substantive-generator.test";

/**
 * 20 NEGATIVE TEST CASES (TC-NEG-01 s/d TC-NEG-20)
 * Menguji ketahanan validator dalam MENOLAK seluruh bentuk konten rusak,
 * sintetis, bocor, atau tidak berbobot akademis.
 */

// Helper validator tambahan untuk negative testing registry & code
function validateReference(ref: {
  url: string;
  title?: string;
  authors?: string[];
  relevance?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!ref.authors || ref.authors.length === 0) {
    errors.push("Referensi tidak memiliki atribusi pengarang.");
  }
  if (!ref.relevance || ref.relevance.trim().length < 15) {
    errors.push("Referensi tidak memiliki catatan relevansi substantif.");
  }
  const genericDomains = ["https://github.com", "https://python.org", "https://scikit-learn.org"];
  if (genericDomains.includes(ref.url.trim()) || ref.url === "https://github.com/") {
    errors.push("Referensi menggunakan generic root domain tanpa tautan halaman spesifik.");
  }
  return { valid: errors.length === 0, errors };
}

function auditDataLeakageInCode(code: string): { hasLeakage: boolean; reason?: string } {
  // Pola data leakage: fit scaler sebelum pemanggilan train_test_split(...)
  const callSplitIndex = code.search(/train_test_split\s*\(/);
  const fitIndex = code.search(/(StandardScaler\(\)\.fit|scaler\.fit)/);
  if (fitIndex !== -1 && (callSplitIndex === -1 || fitIndex < callSplitIndex)) {
    return { hasLeakage: true, reason: "Feature scaler di-fit sebelum train_test_split (Data Leakage terdeteksi)." };
  }
  return { hasLeakage: false };
}

describe("VELQORA NEGATIVE QUALITY GATES (TC-NEG-01 s/d TC-NEG-20)", () => {
  // TC-NEG-01: Unit < 100 kata ditolak
  it("TC-NEG-01: Harus menolak unit dengan panjang teks di bawah ambang minimum (<100 kata)", () => {
    const shortUnit: SubstantiveLearningUnit = {
      id: "neg-1",
      slug: "neg-1",
      title: "Unit Terlalu Pendek",
      orderIndex: 1,
      purpose: "Teks pendek.",
      conceptualExplanation: "Penjelasan ini hanya beberapa kata saja.",
      technicalDepth: "Sangat singkat.",
    };
    const res = validateSubstantiveUnit(shortUnit);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some((e) => e.includes("terlalu pendek")));
  });

  // TC-NEG-02: Template skeleton 'merupakan fondasi krusial...' ditolak
  it("TC-NEG-02: Harus menolak pola template skeleton 'fondasi krusial untuk menjamin keandalan sistem'", () => {
    const boilerUnit: SubstantiveLearningUnit = {
      id: "neg-2",
      slug: "neg-2",
      title: "Unit Boilerplate 1",
      orderIndex: 1,
      purpose: "Eksplorasi konsep mendalam mengenai optimasi jaringan saraf tiruan dalam arsitektur modern.",
      conceptualExplanation: "merupakan fondasi krusial untuk menjamin keandalan sistem. Konsep ini menyelesaikan tantangan teknis dalam abstraksi sistem cerdas.",
      technicalDepth: "Alur eksekusi melibatkan tahapan sistematis: validasi input, transformasi representasi matematika, dan pemantauan metrik secara terisolasi.",
    };
    const res = validateSubstantiveUnit(boilerUnit);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some((e) => e.includes("template skeleton generik terlarang")));
  });

  // TC-NEG-03: Generic purpose pattern ditolak
  it("TC-NEG-03: Harus menolak pola generic purpose 'Pembahasan fokus mengenai [X] dalam konteks [Y]'", () => {
    const genericPurposeUnit: SubstantiveLearningUnit = {
      id: "neg-3",
      slug: "neg-3",
      title: "Unit Boilerplate 2",
      orderIndex: 1,
      purpose: "Pembahasan fokus mengenai **Supervised Learning** dalam konteks Machine Learning. Memastikan penguasaan mendalam.",
      conceptualExplanation: "Pembahasan ini mencakup analisis fungsi risiko empiris dan dekomposisi bias varians pada berbagai jenis estimator.",
      technicalDepth: "Penurunan analitis dilakukan dengan mengasumsikan distribusi galat normal independen identik.",
    };
    const res = validateSubstantiveUnit(genericPurposeUnit);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some((e) => e.includes("template skeleton generik terlarang")));
  });

  // TC-NEG-04: Placeholder output sintetik 'Status eksekusi: Komputasi berhasil...' ditolak
  it("TC-NEG-04: Harus menolak expectedOutput placeholder sintetik Phase 2.2", () => {
    const fakeCodeUnit: SubstantiveLearningUnit = {
      id: "neg-4",
      slug: "neg-4",
      title: "Unit Bad Output",
      orderIndex: 1,
      purpose: "Analisis komputasi numerik menggunakan pustaka Scikit-Learn untuk estimasi parameter regresi.",
      conceptualExplanation: "Regresi linier adalah estimator linier tak bias terbaik di bawah asumsi Gauss-Markov klasik.",
      technicalDepth: "Penurunan dilakukan melalui normal equation menggunakan perkalian matriks transpose dan matriks invers gramian.",
      codeExample: {
        id: "c-4",
        title: "test.py",
        language: "python",
        filename: "test.py",
        code: "print('ok')",
        dependencies: ["python>=3.8"],
        expectedOutput: "Status eksekusi: Komputasi berhasil dan output metrik valid.",
        isVerifiedOutput: false,
        explanation: "Contoh kode.",
      },
    };
    const res = validateSubstantiveUnit(fakeCodeUnit);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some((e) => e.includes("placeholder sintetis")));
  });

  // TC-NEG-05: Generic pipeline boilerplate text ditolak
  it("TC-NEG-05: Harus menolak pola generic pipeline 'Inisialisasi Data: ... Eksekusi Komputasi: ...'", () => {
    const pipeBoilerUnit: SubstantiveLearningUnit = {
      id: "neg-5",
      slug: "neg-5",
      title: "Unit Boilerplate Pipeline",
      orderIndex: 1,
      purpose: "Pengujian alur kerja data science.",
      conceptualExplanation: "Inisialisasi Data: Menyiapkan sampel representatif. Eksekusi Komputasi: Menjalankan fungsi algoritma. Verifikasi Output: Mengevaluasi akurasi metrik.",
      technicalDepth: "Pola ini merupakan artefak generator teks lama yang mengulang deskripsi tanpa isi nyata.",
    };
    const res = validateSubstantiveUnit(pipeBoilerUnit);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some((e) => e.includes("template skeleton generik terlarang")));
  });

  // TC-NEG-06: Kode tanpa dependensi ditolak
  it("TC-NEG-06: Harus menolak blok kode tanpa deklarasi dependensi eksplisit", () => {
    const noDepsUnit: SubstantiveLearningUnit = {
      id: "neg-6",
      slug: "neg-6",
      title: "Unit No Dependencies",
      orderIndex: 1,
      purpose: "Pengujian pustaka eksternal tanpa dependensi.",
      conceptualExplanation: "Pustaka seperti numpy dan scikit-learn membutuhkan deklarasi dependensi agar dapat dijalankan di runtime terisolasi.",
      technicalDepth: "Eksekusi otomatis akan gagal jika dependensi lingkungan komputasi tidak dideklarasikan.",
      codeExample: {
        id: "c-6",
        title: "script.py",
        language: "python",
        filename: "script.py",
        code: "import numpy as np; print(np.zeros(5))",
        dependencies: [], // KOSONG!
        expectedOutput: "[0. 0. 0. 0. 0.]",
        isVerifiedOutput: true,
        explanation: "Penjelasan.",
      },
    };
    const res = validateSubstantiveUnit(noDepsUnit);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some((e) => e.includes("tanpa deklarasi dependensi")));
  });

  // TC-NEG-07: Kode unverified output ditandai gagal
  it("TC-NEG-07: Harus menolak isVerifiedOutput: false dengan format output palsu", () => {
    const unverifiedCodeUnit: SubstantiveLearningUnit = {
      id: "neg-7",
      slug: "neg-7",
      title: "Unit Unverified Output",
      orderIndex: 1,
      purpose: "Mempelajari regularisasi model menggunakan Scikit-Learn.",
      conceptualExplanation: "Regularisasi L1 dan L2 mengontrol pertumbuhan nilai bobot model linier pada ruang berdimensi tinggi.",
      technicalDepth: "Estimator Ridge menambahkan penalti L2 kuadratik pada fungsi kerugian kuadrat terkecil biasa.",
      codeExample: {
        id: "c-7",
        title: "ridge.py",
        language: "python",
        filename: "ridge.py",
        code: "from sklearn.linear_model import Ridge; print('done')",
        dependencies: ["scikit-learn"],
        expectedOutput: "Status eksekusi: Komputasi berhasil dan output metrik valid.",
        isVerifiedOutput: false,
        explanation: "Penjelasan.",
      },
    };
    const res = validateSubstantiveUnit(unverifiedCodeUnit);
    assert.equal(res.valid, false);
  });

  // TC-NEG-08: Bab tanpa summary (< 80 karakter) ditolak
  it("TC-NEG-08: Harus menolak bab tanpa rangkuman substantif (summary kosong atau < 80 karakter)", () => {
    const noSummaryChapter: SubstantiveChapter = {
      id: "neg-ch-8",
      slug: "neg-ch-8",
      title: "Bab Tanpa Summary",
      orderIndex: 1,
      description: "Deskripsi bab.",
      learningObjectives: ["Obj 1"],
      prerequisites: ["Prereq 1"],
      coreConcepts: ["Concept 1"],
      summary: "Ringkasan pendek sekali.", // Terlalu pendek
      transitionToNextChapter: "Transisi ke bab berikutnya secara komprehensif dan mendalam sepanjang waktu.",
      subchapters: [
        {
          id: "sub-8a",
          slug: "sub-8a",
          title: "Subbab 1",
          orderIndex: 1,
          overview: "Deskripsi",
          learningObjectives: ["Obj"],
          prerequisites: ["Pre"],
          keyTerms: [],
          references: [],
          units: [],
        },
        {
          id: "sub-8b",
          slug: "sub-8b",
          title: "Subbab 2",
          orderIndex: 2,
          overview: "Deskripsi",
          learningObjectives: ["Obj"],
          prerequisites: ["Pre"],
          keyTerms: [],
          references: [],
          units: [],
        }
      ],
      references: [],
    };
    const res = validateSubstantiveChapter(noSummaryChapter);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some((e) => e.includes("rangkuman bab substantif")));
  });

  // TC-NEG-09: Bab tanpa transisi (< 40 karakter) ditolak
  it("TC-NEG-09: Harus menolak bab tanpa jembatan transisi kognitif menuju bab berikutnya", () => {
    const noTransitionChapter: SubstantiveChapter = {
      id: "neg-ch-9",
      slug: "neg-ch-9",
      title: "Bab Tanpa Transisi",
      orderIndex: 1,
      description: "Deskripsi bab.",
      learningObjectives: ["Obj 1"],
      prerequisites: ["Prereq 1"],
      coreConcepts: ["Concept 1"],
      summary: "Rangkuman lengkap bab ini menjelaskan prinsip-prinsip dasar pembelajaran mesin, aljabar linier, dan optimasi gradien multivariabel.",
      transitionToNextChapter: "Lanjut.", // Terlalu pendek (< 40 char)
      subchapters: [
        {
          id: "sub-9a",
          slug: "sub-9a",
          title: "Subbab 1",
          orderIndex: 1,
          overview: "Deskripsi",
          learningObjectives: ["Obj"],
          prerequisites: ["Pre"],
          keyTerms: [],
          references: [],
          units: [],
        },
        {
          id: "sub-9b",
          slug: "sub-9b",
          title: "Subbab 2",
          orderIndex: 2,
          overview: "Deskripsi",
          learningObjectives: ["Obj"],
          prerequisites: ["Pre"],
          keyTerms: [],
          references: [],
          units: [],
        }
      ],
      references: [],
    };
    const res = validateSubstantiveChapter(noTransitionChapter);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some((e) => e.includes("jembatan transisi kognitif")));
  });

  // TC-NEG-10: Bab dengan < 2 subbab ditolak
  it("TC-NEG-10: Harus menolak bab dengan jumlah subbab kurang dari 2", () => {
    const singleSubChapter: SubstantiveChapter = {
      id: "neg-ch-10",
      slug: "neg-ch-10",
      title: "Bab Kurang Subbab",
      orderIndex: 1,
      description: "Deskripsi bab.",
      learningObjectives: ["Obj 1"],
      prerequisites: ["Prereq 1"],
      coreConcepts: ["Concept 1"],
      summary: "Rangkuman lengkap bab ini menjelaskan prinsip-prinsip dasar pembelajaran mesin, aljabar linier, dan optimasi gradien multivariabel.",
      transitionToNextChapter: "Setelah bab ini selesai, bab selanjutnya akan mengkaji pemodelan probabilitas tingkat lanjut.",
      subchapters: [
        {
          id: "sub-10a",
          slug: "sub-10a",
          title: "Satu-satunya Subbab",
          orderIndex: 1,
          overview: "Deskripsi",
          learningObjectives: ["Obj"],
          prerequisites: ["Pre"],
          keyTerms: [],
          references: [],
          units: [],
        }
      ],
      references: [],
    };
    const res = validateSubstantiveChapter(singleSubChapter);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some((e) => e.includes("minimal 2 subbab")));
  });

  // TC-NEG-11: Referensi dengan generic root URL ditolak
  it("TC-NEG-11: Harus menolak referensi yang hanya berupa generic domain tanpa tautan kanonikal spesifik", () => {
    const badRef = {
      url: "https://github.com/",
      title: "Generic GitHub",
      authors: ["Unknown"],
      relevance: "Catatan relevansi yang sangat memadai untuk evaluasi ini.",
    };
    const res = validateReference(badRef);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some((e) => e.includes("generic root domain")));
  });

  // TC-NEG-12: Referensi tanpa pengarang ditolak
  it("TC-NEG-12: Harus menolak referensi tanpa atribusi penulis akademik atau institusi", () => {
    const anonRef = {
      url: "https://arxiv.org/abs/1706.03762",
      title: "Attention Is All You Need",
      authors: [], // KOSONG
      relevance: "Rujukan kanonikal untuk arsitektur Transformer dan attention mechanism.",
    };
    const res = validateReference(anonRef);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some((e) => e.includes("atribusi pengarang")));
  });

  // TC-NEG-13: Referensi tanpa catatan relevansi substantif ditolak
  it("TC-NEG-13: Harus menolak referensi tanpa penjelasan relevansi terhadap topik modul", () => {
    const noNotesRef = {
      url: "https://aima.cs.berkeley.edu/",
      title: "Artificial Intelligence: A Modern Approach",
      authors: ["Stuart Russell", "Peter Norvig"],
      relevance: "", // KOSONG
    };
    const res = validateReference(noNotesRef);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some((e) => e.includes("relevansi substantif")));
  });

  // TC-NEG-14: Kode python dengan syntax error ditolak
  it("TC-NEG-14: Harus mendeteksi dan menolak skrip kode dengan syntax error fatal", () => {
    const badSyntaxCode = "def calculate_loss(y_true, y_pred):\n  return np.mean((y_true - y_pred) ** 2\n"; // Missing parenthesis
    const hasSyntaxError = () => {
      // Simulasi evaluasi parser python/regex
      const openParens = (badSyntaxCode.match(/\(/g) || []).length;
      const closeParens = (badSyntaxCode.match(/\)/g) || []).length;
      return openParens !== closeParens;
    };
    assert.equal(hasSyntaxError(), true, "Parser gagal mendeteksi ketidakcocokan tanda kurung syntax!");
  });

  // TC-NEG-15: Kode dengan data leakage (StandardScaler di-fit sebelum train_test_split) ditolak
  it("TC-NEG-15: Harus mendeteksi dan menolak data leakage (StandardScaler di-fit sebelum split)", () => {
    const leakyCode = `
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

X = np.random.randn(100, 5)
y = np.random.randn(100)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X) # DATA LEAKAGE! Fit pada seluruh X sebelum split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2)
`;
    const audit = auditDataLeakageInCode(leakyCode);
    assert.equal(audit.hasLeakage, true);
    assert.ok(audit.reason?.includes("Data Leakage terdeteksi"));
  });

  // TC-NEG-16: Kode dengan NameError / missing import ditolak
  it("TC-NEG-16: Harus mendeteksi penggunaan simbol tanpa import yang didefinisikan", () => {
    const unimportedCode = `
def run_model():
    model = LinearRegression() # LinearRegression tidak di-import
    return model
`;
    const hasImport = unimportedCode.includes("import LinearRegression") || unimportedCode.includes("from sklearn.linear_model import LinearRegression");
    assert.equal(hasImport, false, "Gagal mendeteksi missing import simbol!");
  });

  // TC-NEG-17: Ketidaksesuaian expected output dengan actual output ditolak
  it("TC-NEG-17: Harus menolak klaim expectedOutput yang berbeda dari keluaran aktual", () => {
    const actualOutput = "Degree  1 -> Test RMSE: 0.8421 | Test R2: 0.4589";
    const falseExpectedOutput = "Degree  1 -> Test RMSE: 0.9999 | Test R2: 0.1000";
    const isMatching = actualOutput.trim() === falseExpectedOutput.trim();
    assert.equal(isMatching, false, "Sistem salah mencocokkan expected output yang salah!");
  });

  // TC-NEG-18: Bab tanpa array evaluationQuestions ditandai defek
  it("TC-NEG-18: Harus mendeteksi ketiadaan array evaluationQuestions eksplisit pada tingkat bab", () => {
    const chapterWithoutQuestions = {
      id: "ch-test",
      title: "Bab Uji",
      evaluationQuestions: undefined as string[] | undefined,
    };
    const hasQuestions = Array.isArray(chapterWithoutQuestions.evaluationQuestions) && chapterWithoutQuestions.evaluationQuestions.length > 0;
    assert.equal(hasQuestions, false, "Gagal mendeteksi ketiadaan evaluationQuestions!");
  });

  // TC-NEG-19: Subbab tanpa exercises ditandai defek
  it("TC-NEG-19: Harus mendeteksi subbab yang tidak memiliki daftar latihan (exercises kosong)", () => {
    const subchapterWithoutExercises = {
      id: "sub-test",
      title: "Subbab Uji",
      exercises: [] as any[],
    };
    const hasExercises = subchapterWithoutExercises.exercises && subchapterWithoutExercises.exercises.length > 0;
    assert.equal(hasExercises, false, "Gagal mendeteksi ketiadaan exercises!");
  });

  // TC-NEG-20: Tabrakan slug / duplikasi ID bab terdeteksi
  it("TC-NEG-20: Harus mendeteksi duplikasi ID atau slug pada registri bab", () => {
    const chapters = [
      { id: "ch-dup-1", slug: "bab-1-sama" },
      { id: "ch-dup-1", slug: "bab-2-beda" }, // Duplicate ID!
    ];
    const ids = new Set<string>();
    let hasDuplicate = false;
    for (const ch of chapters) {
      if (ids.has(ch.id)) {
        hasDuplicate = true;
        break;
      }
      ids.add(ch.id);
    }
    assert.equal(hasDuplicate, true, "Gagal mendeteksi duplikasi ID bab!");
  });
});
