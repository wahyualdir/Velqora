import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  extractTheoryAndCodeFromMarkdown,
  findCodeEntryById,
  getAllCodeCatalogEntries,
  getCodeCatalogEntries,
  getCodeChaptersForTopic,
  getTopicCodeSummaries,
} from "../code-catalog";
import { getActiveCatalogTopics } from "../catalog";
import { ALL_ACADEMIC_CURRICULA } from "../registry";

describe("Theory vs Code Extractor & Code Catalog", () => {
  it("memisahkan blok implementasi H2 beserta output & analisis sambil menjaga teori, matematika, diagram, studi kasus, dan rujukan", () => {
    const sample = `# Subbab 1.1: Gradient Descent

## 1. Intuisi & Definisi Formal
Kita meminimalkan fungsi rugi $L(\\theta)$ dengan pembaruan iteratif:

$$\\theta_{t+1} = \\theta_t - \\eta \\nabla L(\\theta_t)$$

\`\`\`mermaid
graph LR
  A[Inisialisasi] --> B[Hitung Gradien]
  B --> C[Update Parameter]
\`\`\`

## 4. Implementasi Kode & Praktikum

### Kode Lengkap
\`\`\`python
# Hitung step gradient descent
def step(theta, grad, lr=0.01):
    # komentar tidak boleh dianggap heading
    return theta - lr * grad

print(step(1.0, 2.0))
\`\`\`

### Hasil Eksekusi & Validasi Output
\`\`\`text
0.98
\`\`\`

### Penjelasan Alur Kode
Fungsi \`step\` mengurangi bobot sesuai arah gradien negatif.

## 5. Kesalahan Umum
Learning rate terlalu besar menyebabkan divergensi.

## Sumber Rujukan
- Goodfellow et al. (2016) Deep Learning.
`;

    const result = extractTheoryAndCodeFromMarkdown(sample);

    assert.equal(result.hasExtractedCode, true);
    assert.ok(result.extractedCount >= 1);
    assert.equal(result.extractedSnippets.length, 1);
    assert.equal(result.extractedSnippets[0].language, "python");
    assert.equal(result.extractedSnippets[0].expectedOutput, "0.98");

    // Teori tetap utuh
    assert.match(result.theoryMarkdown, /Intuisi & Definisi Formal/);
    assert.match(result.theoryMarkdown, /\\theta_\{t\+1\}/);
    assert.match(result.theoryMarkdown, /graph LR/);
    assert.match(result.theoryMarkdown, /Kesalahan Umum/);
    assert.match(result.theoryMarkdown, /Sumber Rujukan/);

    // Implementasi kode & output tidak lagi memadati bacaan teori
    assert.doesNotMatch(result.theoryMarkdown, /Implementasi Kode & Praktikum/);
    assert.doesNotMatch(result.theoryMarkdown, /Hasil Eksekusi & Validasi Output/);
    assert.doesNotMatch(result.theoryMarkdown, /def step\(theta, grad/);
  });

  it("menangani pola H3 standalone (mis. SQL Basis Data) tanpa menghapus sintaks konseptual teori", () => {
    const sample = `## Konsep DDL Dasar
Sintaks umum mendefinisikan tabel:

\`\`\`sql
CREATE TABLE mahasiswa (
  id INT PRIMARY KEY,
  nama VARCHAR(100)
);
\`\`\`

### Kode Lengkap
\`\`\`sql
CREATE TABLE produk (
  id INT PRIMARY KEY,
  harga NUMERIC(10, 2) NOT NULL,
  stok INT DEFAULT 0
);
INSERT INTO produk VALUES (1, 25000.00, 10);
\`\`\`

### Output Terverifikasi
\`\`\`text
INSERT 0 1
\`\`\`

### Penjelasan Kode
Menambahkan satu baris produk ke tabel \`produk\`.

---

### Jebakan Umum
- Lupa menuliskan constraint NOT NULL pada harga.
`;

    const result = extractTheoryAndCodeFromMarkdown(sample);

    assert.equal(result.hasExtractedCode, true);
    assert.equal(result.extractedSnippets.length, 1);
    assert.equal(result.extractedSnippets[0].language, "sql");
    assert.equal(result.extractedSnippets[0].expectedOutput, "INSERT 0 1");

    // Sintaks konseptual di dalam bagian teori tetap ada
    assert.match(result.theoryMarkdown, /Konsep DDL Dasar/);
    assert.match(result.theoryMarkdown, /CREATE TABLE mahasiswa/);
    // Jebakan umum tetap bertahan
    assert.match(result.theoryMarkdown, /Jebakan Umum/);
    // Implementasi praktikum terpisah
    assert.doesNotMatch(result.theoryMarkdown, /CREATE TABLE produk/);
    assert.doesNotMatch(result.theoryMarkdown, /Output Terverifikasi/);
  });

  it("mengindeks seluruh 24 topik aktif pada getTopicCodeSummaries termasuk topik gabungan & SQL", () => {
    const activeTopics = getActiveCatalogTopics();
    const summaries = getTopicCodeSummaries();

    assert.equal(summaries.length, activeTopics.length);

    for (const summary of summaries) {
      if (summary.topic.status === "in_progress" || summary.topic.status === "coming_soon") {
        assert.equal(summary.totalEntries >= 0, true);
        continue;
      }
      assert.ok(
        summary.totalEntries > 0,
        `Topik "${summary.topic.id}" seharusnya memiliki entri kode pada Katalog Kode`
      );
      assert.ok(summary.languages.length > 0);
    }

    const sqlSummary = summaries.find((s) => s.topic.id === "sql-basis-data");
    assert.ok(sqlSummary, "Summary sql-basis-data harus tersedia");
    assert.ok(
      sqlSummary.totalEntries >= 4,
      `sql-basis-data harus mengindeks lab SQL/Python (ditemukan ${sqlSummary.totalEntries})`
    );

    const responsibleSummary = summaries.find((s) => s.topic.id === "responsible-ai");
    assert.ok(
      responsibleSummary && responsibleSummary.totalEntries >= 100,
      `responsible-ai harus menggabungkan ai-ethics & ai-governance (ditemukan ${responsibleSummary?.totalEntries})`
    );

    const klasikSummary = summaries.find((s) => s.topic.id === "ai-klasik");
    assert.ok(
      klasikSummary && klasikSummary.totalEntries >= 100,
      `ai-klasik harus menggabungkan 3 kurikulum AI klasik (ditemukan ${klasikSummary?.totalEntries})`
    );
  });

  it("memastikan seluruh ID entri kode unik dan dapat dicari ulang melalui findCodeEntryById", () => {
    const entries = getAllCodeCatalogEntries();
    assert.ok(entries.length > 1000, `Harapannya ribuan entri kode, ditemukan ${entries.length}`);

    const seenIds = new Set<string>();
    for (const entry of entries) {
      assert.ok(!seenIds.has(entry.id), `Duplikasi ID ditemukan: ${entry.id}`);
      seenIds.add(entry.id);
      assert.ok(entry.theoryHref.startsWith("/dashboard/modul/kategori/"));
      assert.ok(entry.playgroundHref.startsWith("/dashboard/playground?"));
    }

    const sample = entries[0];
    assert.deepEqual(findCodeEntryById(sample.id)?.id, sample.id);
    assert.deepEqual(findCodeEntryById(sample.rawId, sample.topicId)?.rawId, sample.rawId);
  });

  it("mendukung filter berdasarkan topik, bab, bahasa, level, sumber, dan query teks", () => {
    const mlChapters = getCodeChaptersForTopic("machine-learning");
    assert.ok(mlChapters.length >= 10);

    const filtered = getCodeCatalogEntries({
      topicId: "machine-learning",
      chapterId: mlChapters[0].chapterId,
      language: "python",
      sourceType: "implementation",
    });
    assert.ok(filtered.length > 0);
    assert.ok(filtered.every((e) => e.topicId === "machine-learning" && e.language === "python"));
  });

  it("ekstraksi teori pada subbab nyata menyisakan konten teori yang substantif", () => {
    const sampleCurricula = ALL_ACADEMIC_CURRICULA.filter((c) =>
      ["ai-agent", "machine-learning", "large-language-model", "sql-basis-data"].includes(c.id)
    );
    assert.ok(sampleCurricula.length >= 4);

    for (const curriculum of sampleCurricula) {
      const firstSub = curriculum.chapters[0]?.subchapters[0];
      assert.ok(firstSub?.content_markdown);
      const { theoryMarkdown } = extractTheoryAndCodeFromMarkdown(firstSub.content_markdown);
      assert.ok(
        theoryMarkdown.length > 150,
        `Teori hasil ekstraksi terlalu pendek untuk ${curriculum.id}/${firstSub.id}`
      );
    }
  });
});
