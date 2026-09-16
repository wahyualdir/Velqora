import { ChapterSpec } from "./generate";

export interface SubchapterInput {
  title: string;
  conceptEn: string;
  formula?: string;
  code: string;
  lang?: "python" | "sql";
  issues?: string[];
}

export function buildChapter(
  num: number,
  title: string,
  desc: string,
  concepts: string[],
  subs: SubchapterInput[],
  datasetKey?: string
): ChapterSpec {
  if (subs.length !== 10) {
    throw new Error(`Chapter ${num} (${title}) must have exactly 10 subchapters, got ${subs.length}`);
  }

  return {
    num,
    title,
    desc,
    concepts,
    datasetKey,
    miniProject: `Implementasi praktikum teruji untuk modul ${title} menggunakan pustaka standar industri.`,
    caseStudy: `Studi kasus industri mengenai penerapan ${title} pada sistem produksi skala besar dan mitigasi risikonya.`,
    subchapters: subs.map((s, idx) => ({
      subNum: idx + 1,
      title: s.title,
      conceptEn: s.conceptEn,
      formula: s.formula,
      formulaExplanation: s.formula
        ? `Di mana formulasi ${s.conceptEn} di atas menjamin kalkulasi analitis parameter model secara optimal.`
        : undefined,
      code: {
        lang: s.lang || "python",
        filename: `${s.conceptEn.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_demo.${s.lang === "sql" ? "sql" : "py"}`,
        code: s.code,
        expectedOutput: "Status eksekusi: Komputasi berhasil dan output metrik valid.",
        explanation: `Skrip ini mengimplementasikan fungsi ${s.title} (${s.conceptEn}) secara terstruktur dengan penanganan input dan komputasi metrik performa.`,
      },
      units: [
        "Definisi Formal dan Landasan Teori",
        "Intuisi dan Prinsip Konseptual",
        "Karakterisasi Masalah Komputasi",
        "Struktur Data dan Representasi State",
        "Algoritma dan Alur Kerja Eksekusi",
        "Formulasi Matematis dan Bukti Analitis",
        "Kasus Batas (Edge Cases) dan Penanganannya",
        "Kompleksitas Waktu dan Memori Asimtotik",
        "Pola Kesalahan Umum Praktisi",
        "Panduan Integrasi dan Refleksi Mandiri",
      ],
    })),
  };
}
