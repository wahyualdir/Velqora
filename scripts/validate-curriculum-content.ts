import { ALL_ACADEMIC_CURRICULA } from "../src/lib/curriculum/registry";

export interface ContentValidationReport {
  totalTopics: number;
  totalChapters: number;
  totalSubchapters: number;
  totalSubSubchapters: number;
  totalCodeSnippets: number;
  totalDatasets: number;
  emptyChapters: string[];
  emptySubchapters: string[];
  placeholderFound: string[];
  duplicateTitles: string[];
  duplicateSlugs: string[];
  missingObjectives: string[];
  topicsMeetingDepth: string[];
  topicsBelowDepth: string[];
  mathFormulationStats: { withMath: number; withoutMath: number };
}

export function runContentValidation(): ContentValidationReport {
  const seenTitles = new Set<string>();
  const seenSlugs = new Set<string>();
  const duplicateTitles: string[] = [];
  const duplicateSlugs: string[] = [];
  const emptyChapters: string[] = [];
  const emptySubchapters: string[] = [];
  const placeholderFound: string[] = [];
  const missingObjectives: string[] = [];
  const topicsMeetingDepth: string[] = [];
  const topicsBelowDepth: string[] = [];

  let totalChapters = 0;
  let totalSubchapters = 0;
  let totalSubSubchapters = 0;
  let totalCodeSnippets = 0;
  let totalDatasets = 0;
  let withMath = 0;
  let withoutMath = 0;

  for (const curr of ALL_ACADEMIC_CURRICULA) {
    if (curr.datasets) {
      totalDatasets += curr.datasets.length;
    }

    if (seenSlugs.has(curr.slug)) {
      duplicateSlugs.push(`Topik slug duplikat: ${curr.slug}`);
    } else {
      seenSlugs.add(curr.slug);
    }

    let topicHasMath = false;

    // Evaluasi kedalaman bab berdasarkan Tier
    // Fundamental: >= 10, Menengah: >= 12, Profesional: >= 15, Topik Utama: >= 18
    const tierMajor = ["machine-learning", "deep-learning", "natural-language-processing", "computer-vision", "data-science", "generative-ai", "large-language-model", "mlops-deployment", "data-engineering-ai"];
    const tierProf = ["ai-agent", "ai-security", "recommendation-system", "time-series-forecasting", "reinforcement-learning", "robotics-embodied-ai", "vector-database-retrieval"];
    const tierInter = ["computational-intelligence", "automl-nas", "speech-audio-ai", "multimodal-ai", "graph-neural-network", "ai-governance", "ai-ethics"];
    
    let requiredChapters = 10; // fundamental
    if (tierMajor.includes(curr.id)) requiredChapters = 18;
    else if (tierProf.includes(curr.id)) requiredChapters = 15;
    else if (tierInter.includes(curr.id)) requiredChapters = 12;

    if (curr.chapters.length >= requiredChapters) {
      topicsMeetingDepth.push(`${curr.title} (${curr.chapters.length}/${requiredChapters} bab)`);
    } else {
      topicsBelowDepth.push(`${curr.title} (${curr.chapters.length}/${requiredChapters} bab)`);
    }

    totalChapters += curr.chapters.length;

    for (const ch of curr.chapters) {
      if (!ch.title || ch.title.trim() === "") {
        emptyChapters.push(`${curr.title} memiliki bab tanpa judul`);
      }
      if (ch.subchapters.length === 0) {
        emptyChapters.push(`${curr.title} - ${ch.title} (tanpa subbab)`);
      }

      totalSubchapters += ch.subchapters.length;

      for (const sub of ch.subchapters) {
        if (!sub.title || sub.title.trim() === "") {
          emptySubchapters.push(`${curr.title} - ${ch.title} memiliki subbab tanpa judul`);
        }

        const md = sub.content_markdown || "";
        if (md.trim().length === 0) {
          emptySubchapters.push(`${curr.title} - ${sub.title} (konten kosong)`);
        }

        if (
          md.toLowerCase().includes("lorem ipsum") ||
          md.toLowerCase().includes("coming soon") ||
          md.toLowerCase().includes("TODO:") ||
          md.toLowerCase().includes("akan ditambahkan kemudian")
        ) {
          placeholderFound.push(`${curr.title} - ${sub.title}: Placeholder terdeteksi`);
        }

        if (md.includes("$") || md.includes("$$")) {
          topicHasMath = true;
        }

        if (sub.codeExamples) {
          totalCodeSnippets += sub.codeExamples.length;
        }

        if (sub.subSubchapters) {
          totalSubSubchapters += sub.subSubchapters.length;
          for (const unit of sub.subSubchapters) {
            if (unit.codeExamples) {
              totalCodeSnippets += unit.codeExamples.length;
            }
          }
        }
      }
    }

    if (topicHasMath) {
      withMath++;
    } else {
      withoutMath++;
    }
  }

  return {
    totalTopics: ALL_ACADEMIC_CURRICULA.length,
    totalChapters,
    totalSubchapters,
    totalSubSubchapters,
    totalCodeSnippets,
    totalDatasets,
    emptyChapters,
    emptySubchapters,
    placeholderFound,
    duplicateTitles,
    duplicateSlugs,
    missingObjectives,
    topicsMeetingDepth,
    topicsBelowDepth,
    mathFormulationStats: { withMath, withoutMath },
  };
}

// Eksekusi jika dijalankan langsung
if (require.main === module || process.argv[1]?.includes("validate-curriculum-content")) {
  console.log("=== VALIDASI KONTEN KURIKULUM (PHASE 2.2) ===");
  const rep = runContentValidation();
  console.log(`Total Topik: ${rep.totalTopics}`);
  console.log(`Total Bab: ${rep.totalChapters}`);
  console.log(`Total Subbab: ${rep.totalSubchapters}`);
  console.log(`Total Sub-subbab: ${rep.totalSubSubchapters}`);
  console.log(`Total Kode Snippet: ${rep.totalCodeSnippets}`);
  console.log(`Total Dataset Terdaftar: ${rep.totalDatasets}`);
  console.log(`Bab Kosong: ${rep.emptyChapters.length}`);
  console.log(`Subbab Kosong: ${rep.emptySubchapters.length}`);
  console.log(`Placeholder Ditemukan: ${rep.placeholderFound.length}`);
  console.log(`Topik dengan Formulasi Matematika: ${rep.mathFormulationStats.withMath}/${rep.totalTopics}`);
  console.log(`\nTopik Memenuhi Target Kedalaman Bab: ${rep.topicsMeetingDepth.length}`);
  console.log(`Topik di Bawah Target Kedalaman Bab: ${rep.topicsBelowDepth.length}`);

  if (rep.topicsBelowDepth.length > 0) {
    console.log("\nDaftar topik di bawah target kedalaman:");
    rep.topicsBelowDepth.forEach(t => console.log(` - ${t}`));
  }
}
