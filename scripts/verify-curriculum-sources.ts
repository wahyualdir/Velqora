import { ALL_ACADEMIC_CURRICULA } from "../src/lib/curriculum/registry";

export interface SourceValidationReport {
  totalSources: number;
  uniqueUrls: number;
  duplicateUrls: string[];
  invalidUrls: string[];
  emptyUrls: string[];
  sourcesWithoutTitle: string[];
  sourcesWithoutProvider: string[];
  sourcesWithoutType: string[];
  verifiedCount: number;
  needsManualVerificationCount: number;
  topicsWithoutSources: string[];
  sourcesByTopic: Record<string, number>;
  sourcesByType: Record<string, number>;
  sourcesByProvider: Record<string, number>;
}

export function runSourceVerification(): SourceValidationReport {
  const seenUrls = new Set<string>();
  const duplicateUrls: string[] = [];
  const invalidUrls: string[] = [];
  const emptyUrls: string[] = [];
  const sourcesWithoutTitle: string[] = [];
  const sourcesWithoutProvider: string[] = [];
  const sourcesWithoutType: string[] = [];
  const topicsWithoutSources: string[] = [];
  const sourcesByTopic: Record<string, number> = {};
  const sourcesByType: Record<string, number> = {};
  const sourcesByProvider: Record<string, number> = {};

  let totalSources = 0;
  let verifiedCount = 0;
  let needsManualVerificationCount = 0;

  for (const curr of ALL_ACADEMIC_CURRICULA) {
    let topicSourceCount = 0;

    // Kumpulkan dari level topik
    const allCitations = [...(curr.primaryReferences || [])];

    // Kumpulkan dari level bab dan subbab
    for (const ch of curr.chapters) {
      for (const sub of ch.subchapters) {
        if (sub.references) {
          allCitations.push(...sub.references);
        }
        if (sub.subSubchapters) {
          for (const unit of sub.subSubchapters) {
            if (unit.references) {
              allCitations.push(...unit.references);
            }
          }
        }
      }
    }

    if (allCitations.length === 0) {
      topicsWithoutSources.push(curr.title);
    }

    for (const ref of allCitations) {
      totalSources++;
      topicSourceCount++;

      // Validasi URL
      if (!ref.url || ref.url.trim() === "") {
        emptyUrls.push(`${curr.title}: ${ref.title || "Tanpa Judul"}`);
      } else {
        try {
          const parsed = new URL(ref.url);
          if (!["http:", "https:"].includes(parsed.protocol)) {
            invalidUrls.push(ref.url);
          }
        } catch {
          invalidUrls.push(ref.url);
        }

        if (seenUrls.has(ref.url)) {
          duplicateUrls.push(ref.url);
        } else {
          seenUrls.add(ref.url);
        }
      }

      // Validasi Metadata
      if (!ref.title || ref.title.trim() === "") {
        sourcesWithoutTitle.push(`${curr.title} (URL: ${ref.url})`);
      }
      if (!ref.provider || ref.provider.trim() === "") {
        sourcesWithoutProvider.push(`${curr.title}: ${ref.title}`);
      }
      if (!ref.type) {
        sourcesWithoutType.push(`${curr.title}: ${ref.title}`);
      }

      // Hitung tipe
      const t = ref.type || "unknown";
      sourcesByType[t] = (sourcesByType[t] || 0) + 1;

      // Hitung provider
      const p = ref.provider || "Unspecified";
      sourcesByProvider[p] = (sourcesByProvider[p] || 0) + 1;

      // Status Verifikasi
      if (ref.verified === true) {
        verifiedCount++;
      } else {
        needsManualVerificationCount++;
      }
    }

    sourcesByTopic[curr.title] = topicSourceCount;
  }

  return {
    totalSources,
    uniqueUrls: seenUrls.size,
    duplicateUrls: Array.from(new Set(duplicateUrls)),
    invalidUrls,
    emptyUrls,
    sourcesWithoutTitle,
    sourcesWithoutProvider,
    sourcesWithoutType,
    verifiedCount,
    needsManualVerificationCount,
    topicsWithoutSources,
    sourcesByTopic,
    sourcesByType,
    sourcesByProvider,
  };
}

// Eksekusi jika dijalankan langsung
if (require.main === module || process.argv[1]?.includes("verify-curriculum-sources")) {
  console.log("=== VERIFIKASI SUMBER & REFERENSI KURIKULUM (PHASE 2.2) ===");
  const report = runSourceVerification();
  console.log(`Total Sumber Ditemukan: ${report.totalSources}`);
  console.log(`URL Unik: ${report.uniqueUrls}`);
  console.log(`URL Terverifikasi: ${report.verifiedCount}`);
  console.log(`URL Perlu Verifikasi Manual: ${report.needsManualVerificationCount}`);
  console.log(`URL Kosong: ${report.emptyUrls.length}`);
  console.log(`URL Tidak Valid: ${report.invalidUrls.length}`);
  console.log(`Topik Tanpa Sumber: ${report.topicsWithoutSources.length}`);
  console.log("\nDistribusi Berdasarkan Tipe Sumber:", report.sourcesByType);
  console.log("\nTopik dengan Sumber:");
  console.table(
    Object.entries(report.sourcesByTopic).map(([topic, count]) => ({
      Topik: topic,
      JumlahSumber: count,
    }))
  );

  if (report.invalidUrls.length > 0) {
    console.error("Ditemukan URL tidak valid:", report.invalidUrls);
    process.exit(1);
  }
}
