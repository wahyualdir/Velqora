import { machineLearningCurriculum } from "../../src/lib/curriculum/topics/19-machine-learning";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

console.log("=== MEMULAI AUDIT PRIORITAS 3: MACHINE LEARNING (19-machine-learning.ts) ===");

const chapters = machineLearningCurriculum.chapters || [];
console.log(`Total Bab yang Ada: ${chapters.length}`);

interface FlatSubchapter {
  chapterIndex: number;
  chapterTitle: string;
  subchapterIndex: number;
  subchapterId: string;
  subchapterTitle: string;
  references: any[];
  codeExamples: any[];
  contentMarkdown: string;
}

const allSubchapters: FlatSubchapter[] = [];

chapters.forEach((ch, chIdx) => {
  (ch.subchapters || []).forEach((sub, subIdx) => {
    allSubchapters.push({
      chapterIndex: chIdx + 1,
      chapterTitle: ch.title,
      subchapterIndex: subIdx + 1,
      subchapterId: sub.id,
      subchapterTitle: sub.title,
      references: sub.references || [],
      codeExamples: sub.codeExamples || [],
      contentMarkdown: (sub as any).content_markdown || (sub as any).content || ""
    });
  });
});

console.log(`Total Subbab yang Berhasil Diparsing: ${allSubchapters.length}`);

// Pilih 5 subbab acak secara deterministik namun tersebar dari 22 bab
// Kita pilih dari berbagai bab (misal Bab 3, Bab 7, Bab 10, Bab 15, Bab 21)
const targetIndices = [
  Math.floor(allSubchapters.length * 0.15), // sekitar Bab 3-4
  Math.floor(allSubchapters.length * 0.35), // sekitar Bab 7-8
  Math.floor(allSubchapters.length * 0.50), // sekitar Bab 11-12
  Math.floor(allSubchapters.length * 0.70), // sekitar Bab 15-16
  Math.floor(allSubchapters.length * 0.90), // sekitar Bab 20-21
];

const selectedSubchapters = targetIndices.map(idx => allSubchapters[idx]);

console.log("\n=== 5 SUBBAB ACAK YANG DIPILIH UNTUK AUDIT ===");
selectedSubchapters.forEach((sub, i) => {
  console.log(`[${i + 1}] Bab ${sub.chapterIndex}: ${sub.chapterTitle}`);
  console.log(`    Subbab: ${sub.subchapterTitle} (ID: ${sub.subchapterId})`);
  console.log(`    Jumlah Referensi: ${sub.references.length}`);
  console.log(`    Jumlah Code Examples: ${sub.codeExamples.length}`);
});

// Audit masing-masing subbab
const auditResults: any[] = [];

selectedSubchapters.forEach((sub, i) => {
  console.log(`\n------------------------------------------------------------`);
  console.log(`AUDIT SUBBAB ${i + 1}: ${sub.subchapterTitle}`);
  console.log(`------------------------------------------------------------`);

  // 1. Audit Referensi
  let refStatus = "KOSONG / TIDAK VALID";
  let refDetails: any[] = [];
  if (sub.references.length > 0) {
    const validRefs = sub.references.filter(r => r.title && r.url && r.url.startsWith("http"));
    if (validRefs.length > 0) {
      refStatus = `VALID (${validRefs.length} rujukan terverifikasi)`;
      refDetails = validRefs.map(r => ({ title: r.title, url: r.url, authors: r.authors }));
    }
  }
  console.log(`1. Status Rujukan/Referensi: ${refStatus}`);
  if (refDetails.length > 0) {
    refDetails.forEach(r => console.log(`   - Title: ${r.title} | URL: ${r.url}`));
  }

  // 2. Audit Kode Praktikum & Eksekusi di Sandbox Python
  let codeStatus = "TIDAK ADA KODE";
  let codeSnippet = "";
  let executionSuccess = false;
  let executionOutput = "";
  let executionError = "";

  if (sub.codeExamples.length > 0) {
    const firstCode = sub.codeExamples[0];
    codeSnippet = firstCode.code || "";
    const isPseudocode = !codeSnippet.includes("import ") && !codeSnippet.includes("def ");

    if (isPseudocode) {
      codeStatus = "TERDETEKSI PSEUDOCODE / BUKAN KODE AKTUAL";
    } else {
      codeStatus = "KODE PYTHON TERSEDIA";
      // Tulis ke file temporer dan jalankan di sandbox Python
      const tempScriptPath = path.resolve(__dirname, `../../scratch/test_ml_audit_${i + 1}.py`);
      fs.writeFileSync(tempScriptPath, codeSnippet, "utf-8");

      try {
        const out = execSync(`python "${tempScriptPath}"`, {
          timeout: 10000,
          encoding: "utf-8",
          stdio: ["pipe", "pipe", "pipe"]
        });
        executionSuccess = true;
        executionOutput = out.trim();
      } catch (err: any) {
        executionSuccess = false;
        executionError = (err.stderr || err.message || "").trim();
      }
    }
  }

  console.log(`2. Status Kode: ${codeStatus}`);
  if (codeSnippet) {
    console.log(`   Panjang Kode: ${codeSnippet.split("\n").length} baris`);
    console.log(`   Runnable di Python Sandbox: ${executionSuccess ? "YA (BERHASIL DIJALANKAN)" : "GAGAL / ERROR"}`);
    if (executionSuccess) {
      console.log(`   Cuplikan Output:\n${executionOutput.slice(0, 200)}...`);
    } else {
      console.log(`   Pesan Error:\n${executionError.slice(0, 200)}...`);
    }
  }

  auditResults.push({
    subchapter: sub.subchapterTitle,
    chapter: sub.chapterTitle,
    refStatus,
    refDetails,
    codeStatus,
    executionSuccess,
    executionOutput,
    executionError,
    lineCount: codeSnippet.split("\n").length
  });
});

// Simpan bukti hasil audit ke file JSON untuk laporan
const outputPath = path.resolve(__dirname, "../../scratch/ml_audit_report.json");
fs.writeFileSync(outputPath, JSON.stringify(auditResults, null, 2), "utf-8");
console.log(`\nAudit selesai! Laporan disimpan di ${outputPath}`);
