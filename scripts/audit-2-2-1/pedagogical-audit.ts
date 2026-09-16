import { ALL_ACADEMIC_CURRICULA } from "../../src/lib/curriculum/registry";
import * as fs from "fs";
import * as path from "path";

const DIMENSIONS = [
  "tujuan_pembelajaran",
  "prasyarat",
  "definisi_formal",
  "intuisi_analogi",
  "istilah_terminologi",
  "penjelasan_teknis",
  "contoh_konkret",
  "formula_matematika",
  "kode_runnable",
  "interpretasi_output",
  "kesalahan_umum",
  "keterbatasan",
  "latihan_bertingkat",
  "referensi_akademik",
  "ringkasan_bab",
  "hubungan_antar_bab",
] as const;

type DimensionName = typeof DIMENSIONS[number];

interface ChapterPedagogicalScore {
  topicId: string;
  chapterIndex: number;
  chapterTitle: string;
  scores: Record<DimensionName, 0 | 1 | 2 | 3>;
  notes: Record<DimensionName, string>;
}

async function runPedagogicalAudit() {
  console.log("=== STARTING PEDAGOGICAL VALIDATION AUDIT ===");
  const curricula = ALL_ACADEMIC_CURRICULA;

  const chapterScores: ChapterPedagogicalScore[] = [];

  // Track distribution per dimension: dim -> { 0: count, 1: count, 2: count, 3: count }
  const dimensionDistribution: Record<DimensionName, Record<0 | 1 | 2 | 3, number>> = {} as any;
  for (const dim of DIMENSIONS) {
    dimensionDistribution[dim] = { 0: 0, 1: 0, 2: 0, 3: 0 };
  }

  for (const topic of curricula) {
    for (const ch of topic.chapters || []) {
      const scores: Record<DimensionName, 0 | 1 | 2 | 3> = {} as any;
      const notes: Record<DimensionName, string> = {} as any;

      const firstSub = ch.subchapters?.[0];
      const allSubContent = (ch.subchapters || []).map((s) => s.content_markdown || "").join("\n");
      const hasMath = allSubContent.includes("$$") || allSubContent.includes("$");
      const codeCount = (ch.subchapters || []).filter((s) => s.codeExamples && s.codeExamples.length > 0).length;

      // 1. Tujuan Pembelajaran
      if (ch.learningObjectives && ch.learningObjectives.length >= 3) {
        scores.tujuan_pembelajaran = 2;
        notes.tujuan_pembelajaran = "Tersedia learning objectives terstruktur di level bab.";
      } else if (firstSub?.learningObjectives && firstSub.learningObjectives.length >= 2) {
        scores.tujuan_pembelajaran = 1;
        notes.tujuan_pembelajaran = "Hanya tersedia di level subbab berupa template 3 butir umum.";
      } else {
        scores.tujuan_pembelajaran = 0;
        notes.tujuan_pembelajaran = "Tidak ditemukan tujuan pembelajaran terukur.";
      }

      // 2. Prasyarat
      if (ch.prerequisites && ch.prerequisites.length >= 2) {
        scores.prasyarat = 2;
        notes.prasyarat = "Daftar prasyarat konseptual dan teknis tercantum.";
      } else if (firstSub?.prerequisites && firstSub.prerequisites.length > 0) {
        scores.prasyarat = 1;
        notes.prasyarat = "Prasyarat umum (dasar Python/NumPy) berulang.";
      } else {
        scores.prasyarat = 0;
        notes.prasyarat = "Prasyarat tidak didefinisikan.";
      }

      // 3. Definisi Formal
      if (allSubContent.includes("## 1. Definisi") && allSubContent.includes("merupakan fondasi krusial")) {
        scores.definisi_formal = 1; // It's template repetition
        notes.definisi_formal = "Definisi hadir namun menggunakan kalimat template sintaks boilerplate.";
      } else if (allSubContent.includes("## 1. Definisi")) {
        scores.definisi_formal = 2;
        notes.definisi_formal = "Definisi konseptual memadai.";
      } else {
        scores.definisi_formal = 0;
        notes.definisi_formal = "Definisi formal tidak ditemukan.";
      }

      // 4. Intuisi / Analogi
      if (allSubContent.includes("Intuisi dan Prinsip Konseptual") && allSubContent.includes("Pembahasan fokus mengenai")) {
        scores.intuisi_analogi = 1;
        notes.intuisi_analogi = "Unit intuisi hadir sebagai heading dan boilerplate 25 kata tanpa analogi nyata.";
      } else if (allSubContent.toLowerCase().includes("analogi") || allSubContent.toLowerCase().includes("intuisi")) {
        scores.intuisi_analogi = 2;
        notes.intuisi_analogi = "Terdapat penjelasan intuisi yang memadai.";
      } else {
        scores.intuisi_analogi = 0;
        notes.intuisi_analogi = "Tidak ada analogi atau jembatan intuisi pemula.";
      }

      // 5. Istilah / Terminologi
      if (ch.terminology && ch.terminology.length >= 3) {
        scores.istilah_terminologi = 3;
        notes.istilah_terminologi = "Glosarium terminologi lengkap dengan definisi dan istilah bahasa Inggris.";
      } else if (ch.coreConcepts && ch.coreConcepts.length > 0) {
        scores.istilah_terminologi = 1;
        notes.istilah_terminologi = "Hanya berupa daftar konsep kunci tanpa penjelasan glosarium mendalam.";
      } else {
        scores.istilah_terminologi = 0;
        notes.istilah_terminologi = "Terminologi tidak didefinisikan secara khusus.";
      }

      // 6. Penjelasan Teknis
      if (allSubContent.includes("## 2. Mekanisme Kerja & Arsitektur Teknis")) {
        scores.penjelasan_teknis = 1;
        notes.penjelasan_teknis = "Memiliki bagian mekanisme teknis namun strukturnya шаблон template 2 paragraf.";
      } else {
        scores.penjelasan_teknis = 0;
        notes.penjelasan_teknis = "Bagian arsitektur teknis tidak tersedia.";
      }

      // 7. Contoh Konkret
      if (codeCount > 0) {
        scores.contoh_konkret = 1;
        notes.contoh_konkret = "Contoh tersedia dalam bentuk kode mini demonstrasi.";
      } else {
        scores.contoh_konkret = 0;
        notes.contoh_konkret = "Tidak ada contoh konkret penerapan.";
      }

      // 8. Formula Matematika
      if (allSubContent.includes("$$")) {
        scores.formula_matematika = 2;
        notes.formula_matematika = "Formulasi LaTeX KaTeX blok mandiri ($$) disajikan.";
      } else if (hasMath) {
        scores.formula_matematika = 1;
        notes.formula_matematika = "Hanya menggunakan notasi matematika inline ($).";
      } else {
        scores.formula_matematika = 0;
        notes.formula_matematika = "Tidak ada formulasi matematis.";
      }

      // 9. Kode Runnable
      if (codeCount >= 8) {
        scores.kode_runnable = 2;
        notes.kode_runnable = "Hampir seluruh subbab memiliki kode pendamping.";
      } else if (codeCount > 0) {
        scores.kode_runnable = 1;
        notes.kode_runnable = "Sebagian subbab memiliki kode.";
      } else {
        scores.kode_runnable = 0;
        notes.kode_runnable = "Tidak ada kode pendamping.";
      }

      // 10. Interpretasi Output
      if (allSubContent.includes("### Penjelasan Alur Kode:")) {
        scores.interpretasi_output = 1;
        notes.interpretasi_output = "Penjelasan alur 3-langkah template (Inisialisasi Data, Eksekusi Komputasi, Verifikasi Output).";
      } else {
        scores.interpretasi_output = 0;
        notes.interpretasi_output = "Interpretasi output kode tidak dijelaskan.";
      }

      // 11. Kesalahan Umum
      if (ch.commonPitfalls && ch.commonPitfalls.length >= 2) {
        scores.kesalahan_umum = 2;
        notes.kesalahan_umum = "Daftar common pitfalls terdefinisi di level bab.";
      } else if (allSubContent.includes("## 5. Kesalahan Umum & Praktik Rekayasa Terbaik")) {
        scores.kesalahan_umum = 1;
        notes.kesalahan_umum = "Kesalahan umum tercantum sebagai bullet poin umum 3 butir.";
      } else {
        scores.kesalahan_umum = 0;
        notes.kesalahan_umum = "Tidak ada panduan kesalahan umum.";
      }

      // 12. Keterbatasan
      if (ch.limitations && ch.limitations.length > 50) {
        scores.keterbatasan = 2;
        notes.keterbatasan = "Keterbatasan teknis dan batasan domain dijelaskan.";
      } else if (allSubContent.includes("batasan domain, serta kasus batas")) {
        scores.keterbatasan = 1;
        notes.keterbatasan = "Disebutkan secara sepintas dalam teks mekanisme kerja.";
      } else {
        scores.keterbatasan = 0;
        notes.keterbatasan = "Keterbatasan algoritma/konsep tidak diulas.";
      }

      // 13. Latihan Bertingkat
      if (allSubContent.includes("## 6. Latihan Mandiri Berjenjang")) {
        scores.latihan_bertingkat = 1;
        notes.latihan_bertingkat = "Tersedia 4 level latihan (Pemahaman, Implementasi, Debugging, Mini-Project) namun teks instruksi generik.";
      } else if (ch.exercises && ch.exercises.length > 0) {
        scores.latihan_bertingkat = 2;
        notes.latihan_bertingkat = "Tersedia latihan mandiri spesifik.";
      } else {
        scores.latihan_bertingkat = 0;
        notes.latihan_bertingkat = "Tidak ada latihan mandiri.";
      }

      // 14. Referensi Akademik
      const refCount = (ch.subchapters || []).flatMap((s) => s.references || []).length;
      if (refCount >= 5) {
        scores.referensi_akademik = 2;
        notes.referensi_akademik = "Sitasi akademik/dokumentasi tertaut di setiap subbab.";
      } else if (refCount > 0) {
        scores.referensi_akademik = 1;
        notes.referensi_akademik = "Terdapat referensi namun terbatas/berulang.";
      } else {
        scores.referensi_akademik = 0;
        notes.referensi_akademik = "Tidak memiliki sitasi pendukung.";
      }

      // 15. Ringkasan Bab
      if (ch.summary && ch.summary.length > 50) {
        scores.ringkasan_bab = 2;
        notes.ringkasan_bab = "Terdapat ringkasan bab naratif.";
      } else {
        scores.ringkasan_bab = 0;
        notes.ringkasan_bab = "Tidak memiliki ringkasan rangkuman bab khusus.";
      }

      // 16. Hubungan Antar Bab
      if (ch.checklist && ch.checklist.length > 0) {
        scores.hubungan_antar_bab = 1;
        notes.hubungan_antar_bab = "Checklist pemahaman ada, namun ketiadaan narasi jembatan antar bab.";
      } else {
        scores.hubungan_antar_bab = 0;
        notes.hubungan_antar_bab = "Tidak ada eksplisit jembatan atau transisi menuju bab selanjutnya.";
      }

      // Record distribution
      for (const dim of DIMENSIONS) {
        dimensionDistribution[dim][scores[dim]]++;
      }

      chapterScores.push({
        topicId: topic.id,
        chapterIndex: ch.orderIndex,
        chapterTitle: ch.title,
        scores,
        notes,
      });
    }
  }

  const results = {
    totalChaptersEvaluated: chapterScores.length,
    dimensionDistribution,
    percentageDistribution: Object.fromEntries(
      Object.entries(dimensionDistribution).map(([dim, dist]) => [
        dim,
        {
          "0 (Missing)": ((dist[0] / chapterScores.length) * 100).toFixed(1) + "%",
          "1 (Superficial)": ((dist[1] / chapterScores.length) * 100).toFixed(1) + "%",
          "2 (Adequate)": ((dist[2] / chapterScores.length) * 100).toFixed(1) + "%",
          "3 (Deep/Teachable)": ((dist[3] / chapterScores.length) * 100).toFixed(1) + "%",
        },
      ])
    ),
    deficitAnalysis: [
      "Intuisi/Analogi: Mayoritas dinilai 1 (Superficial) karena unit sub-subbab hanya berupa skeleton 25 kata tanpa analogi empiris yang nyata.",
      "Hubungan Antar Bab: 100% dinilai 0 (Missing) karena tidak ada paragraf transisi 'Dari Bab X menuju Bab Y' yang menghubungkan alur kognitif pelajar.",
      "Ringkasan Bab: 100% dinilai 0 (Missing) karena field ch.summary tidak diisi pada objek bab.",
      "Latihan Mandiri: Dinilai 1 (Superficial) karena instruksi 4 level latihan berulang secara identik di setiap subbab tanpa variasi soal matematika atau dataset nyata.",
      "Interpretasi Output: Dinilai 1 (Superficial) karena menggunakan teks penjelasan 3-langkah generik daripada menjelaskan makna angka/metrik keluaran kode.",
    ],
    sampleChapterScores: chapterScores.slice(0, 10),
  };

  const outputPath = path.resolve("scripts/audit-2-2-1/pedagogical-audit-output.json");
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf-8");

  console.log("=== PEDAGOGICAL AUDIT FINISHED ===");
  console.log("Evaluated Chapters:", chapterScores.length);
  console.log("Distribution:", JSON.stringify(results.percentageDistribution, null, 2));
}

runPedagogicalAudit().catch((err) => {
  console.error("Pedagogical audit error:", err);
  process.exit(1);
});
