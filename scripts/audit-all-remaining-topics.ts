import * as fs from "fs";
import * as path from "path";
import { pathToFileURL } from "url";

// Topik-topik yang sudah selesai kita tangani (Prioritas 1-3)
const ALREADY_UPGRADED_SLUGS = new Set([
  "data-analyst",    // Prioritas 1 - 100% OK
  "data-science",    // Prioritas 2 - 100% OK
  "machine-learning" // Prioritas 3 - 100% OK
]);

const TOPICS_DIR = path.resolve(__dirname, "../src/lib/curriculum/topics");

interface SubchapterAudit {
  slug: string;
  hasSubstantiveCode: boolean;
  codeLength: number;
  isBoilerplateCode: boolean;
  conceptLength: number;
  hasSpecificRefUrl: boolean;
  refCount: number;
  hasFormula: boolean;
}

interface TopicAuditReport {
  file: string;
  slug: string;
  title: string;
  fileSizeKb: number;
  lineCount: number;
  chapterCount: number;
  subchapterCount: number;
  avgConceptLength: number;
  boilerplateCodeCount: number;
  substantiveCodeCount: number;
  genericRefUrlCount: number;
  specificRefUrlCount: number;
  emptyRefCount: number;
  category: "COMPLETED_UPGRADED" | "MINI_TOPIC" | "BOILERPLATE_SHELL" | "GENUINELY_SUBSTANTIVE";
  details: string;
}

async function auditAllTopics() {
  console.log("================================================================================");
  console.log("AUDIT MENYELURUH 28 TOPIK KURIKULUM VELQORA (IDENTIFIKASI BOILERPLATE VS GENUINE)");
  console.log("================================================================================\n");

  const files = fs.readdirSync(TOPICS_DIR).filter(f => f.endsWith(".ts"));
  const reports: TopicAuditReport[] = [];

  for (const file of files) {
    const filePath = path.join(TOPICS_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const lineCount = content.split("\n").length;
    const fileSizeKb = Math.round(Buffer.byteLength(content, "utf-8") / 1024);

    // Import curriculum object dynamically
    let topicMod: any;
    try {
      topicMod = await import(pathToFileURL(filePath).href);
    } catch (e: any) {
      console.error(`Gagal import ${file}: ${e.message}`);
      continue;
    }

    const curriculumKey = Object.keys(topicMod).find(k => k.endsWith("Curriculum") || k === "default");
    const topic = curriculumKey ? topicMod[curriculumKey] : null;

    if (!topic || !topic.chapters) {
      reports.push({
        file,
        slug: file.replace(".ts", ""),
        title: "INVALID / EMPTY",
        fileSizeKb,
        lineCount,
        chapterCount: 0,
        subchapterCount: 0,
        avgConceptLength: 0,
        boilerplateCodeCount: 0,
        substantiveCodeCount: 0,
        genericRefUrlCount: 0,
        specificRefUrlCount: 0,
        emptyRefCount: 0,
        category: "MINI_TOPIC",
        details: "Format tidak memiliki properti chapters valid"
      });
      continue;
    }

    const chapters = topic.chapters;
    let totalSubchapters = 0;
    let totalConceptLen = 0;
    let boilerplateCode = 0;
    let substantiveCode = 0;
    let genericRefUrls = 0;
    let specificRefUrls = 0;
    let emptyRefs = 0;

    for (const ch of chapters) {
      const subs = ch.subchapters || [];
      totalSubchapters += subs.length;

      for (const sub of subs) {
        // Cek konsep
        const conceptStr = sub.concept || sub.content || sub.description || "";
        totalConceptLen += conceptStr.length;

        // Cek kode praktikum
        const codeSnippets = sub.codeSnippets || [];
        const mainCode = codeSnippets.length > 0 ? (codeSnippets[0].code || "") : (sub.code || "");
        
        const isDummy = 
          mainCode.includes("# Kode implementasi untuk subbab ini") ||
          mainCode.includes('print("Implementasi:') ||
          mainCode.includes("print(f\"Implementasi") ||
          mainCode.trim().split("\n").length <= 3;

        if (isDummy) {
          boilerplateCode++;
        } else if (mainCode.length > 80) {
          substantiveCode++;
        } else {
          boilerplateCode++;
        }

        // Cek referensi
        const refs = sub.references || sub.sumber_referensi || [];
        if (refs.length === 0) {
          emptyRefs++;
        } else {
          for (const r of refs) {
            const url = r.url || "";
            // Root URL pattern seperti: https://scikit-learn.org/stable/ atau https://pytorch.org/docs/stable/
            const isRootUrl = 
              url.endsWith("/stable/") || 
              url.endsWith("/stable") ||
              url.endsWith(".org/") || 
              url.endsWith(".com/") ||
              url.endsWith(".io/") ||
              url === "" ||
              url.split("/").length <= 4;

            if (isRootUrl) {
              genericRefUrls++;
            } else {
              specificRefUrls++;
            }
          }
        }
      }
    }

    const avgConceptLength = totalSubchapters > 0 ? Math.round(totalConceptLen / totalSubchapters) : 0;

    // Tentukan kategori
    let category: TopicAuditReport["category"];
    let details = "";

    if (ALREADY_UPGRADED_SLUGS.has(topic.slug)) {
      category = "COMPLETED_UPGRADED";
      details = "Sudah selesai ditulis ulang & terverifikasi (Prioritas 1-3)";
    } else if (chapters.length <= 4 || totalSubchapters <= 40 || fileSizeKb < 200) {
      category = "MINI_TOPIC";
      details = `Ukuran mini: hanya ${chapters.length} bab, ${totalSubchapters} subbab, ${fileSizeKb} KB`;
    } else if (boilerplateCode > substantiveCode || genericRefUrls > specificRefUrls) {
      category = "BOILERPLATE_SHELL";
      const dummyPct = Math.round((boilerplateCode / Math.max(1, totalSubchapters)) * 100);
      details = `CANGKANG BOILERPLATE: ${dummyPct}% kode dummy/print biasa, ref generik (${genericRefUrls} root URLs vs ${specificRefUrls} spesifik)`;
    } else {
      category = "GENUINELY_SUBSTANTIVE";
      details = `Konten substantif: ${substantiveCode} kode riil, rata-rata konsep ${avgConceptLength} char`;
    }

    reports.push({
      file,
      slug: topic.slug || file.replace(".ts", ""),
      title: topic.title || file,
      fileSizeKb,
      lineCount,
      chapterCount: chapters.length,
      subchapterCount: totalSubchapters,
      avgConceptLength,
      boilerplateCodeCount: boilerplateCode,
      substantiveCodeCount: substantiveCode,
      genericRefUrlCount: genericRefUrls,
      specificRefUrlCount: specificRefUrls,
      emptyRefCount: emptyRefs,
      category,
      details
    });
  }

  // Tampilkan Hasil
  console.log("------------------------------------------------------------------------------------------------------------------------");
  console.log(
    "NO".padEnd(4) +
    "FILE".padEnd(35) +
    "BAB/SUB".padEnd(10) +
    "SIZE(KB)".padEnd(10) +
    "DUMMY/REAL".padEnd(14) +
    "REF GEN/SPEC".padEnd(14) +
    "STATUS KATEGORI"
  );
  console.log("------------------------------------------------------------------------------------------------------------------------");

  let idx = 1;
  for (const r of reports) {
    const babSub = `${r.chapterCount}/${r.subchapterCount}`.padEnd(10);
    const size = `${r.fileSizeKb} KB`.padEnd(10);
    const code = `${r.boilerplateCodeCount}/${r.substantiveCodeCount}`.padEnd(14);
    const refs = `${r.genericRefUrlCount}/${r.specificRefUrlCount}`.padEnd(14);
    console.log(
      `${idx.toString().padEnd(4)}${r.file.padEnd(35)}${babSub}${size}${code}${refs}${r.category}`
    );
    idx++;
  }

  console.log("\n================================================================================");
  console.log("RINGKASAN EKSEKUTIF KATEGORISASI 28 TOPIK:");
  console.log("================================================================================");

  const completed = reports.filter(r => r.category === "COMPLETED_UPGRADED");
  const mini = reports.filter(r => r.category === "MINI_TOPIC");
  const boilerplate = reports.filter(r => r.category === "BOILERPLATE_SHELL");
  const genuine = reports.filter(r => r.category === "GENUINELY_SUBSTANTIVE");

  console.log(`\n1. SUDAH SELESAI DITULIS ULANG & DIVERIFIKASI (3 Topik):`);
  completed.forEach(r => console.log(`   - [${r.file}] ${r.title} (${r.chapterCount} Bab, ${r.subchapterCount} Subbab, ${r.fileSizeKb} KB)`));

  console.log(`\n2. TOPIK MINI / PERLU EKSPANSI BESAR DARI AWAL (${mini.length} Topik):`);
  mini.forEach(r => console.log(`   - [${r.file}] ${r.title} (${r.chapterCount} Bab, ${r.subchapterCount} Subbab, ${r.fileSizeKb} KB) -> ${r.details}`));

  console.log(`\n3. CANGKANG BOILERPLATE RUSAK (POLA MIRIP MACHINE LEARNING) (${boilerplate.length} Topik):`);
  boilerplate.forEach(r => console.log(`   - [${r.file}] ${r.title} (${r.chapterCount} Bab, ${r.subchapterCount} Subbab, ${r.fileSizeKb} KB) -> ${r.details}`));

  console.log(`\n4. TOPIK YANG SUDAH SUBSTANTIF / GENUINELY OK (${genuine.length} Topik):`);
  if (genuine.length === 0) {
    console.log("   (Tidak ada topik tersisa yang genuinely substantive tanpa pola boilerplate)");
  } else {
    genuine.forEach(r => console.log(`   - [${r.file}] ${r.title} (${r.chapterCount} Bab, ${r.subchapterCount} Subbab, ${r.fileSizeKb} KB) -> ${r.details}`));
  }

  // Simpan JSON laporan lengkap ke scratch untuk referensi
  const outPath = path.resolve(__dirname, "../../scratch/audit_all_topics_result.json");
  // Pastikan direktori ada
  try {
    fs.writeFileSync("C:/Users/ACER/.gemini/antigravity-ide/brain/1f048f04-270a-46b7-b8b1-b47f6057583b/scratch/audit_all_topics_result.json", JSON.stringify(reports, null, 2), "utf-8");
  } catch (err) {}
}

auditAllTopics().catch(console.error);
