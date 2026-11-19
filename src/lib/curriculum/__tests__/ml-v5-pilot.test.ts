import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { machineLearningCurriculum } from "../topics/19-machine-learning";
import { curriculumToDocSectionItems } from "../types";
import { ML_LAB_REGISTRY, isInteractiveLabId } from "../../../components/ui/ml-labs/types";

describe("ML v5.0 Complete (36 Bab • 8 Phase) & Velqora Reader 2.0 Integrity", () => {
  it("mendaftarkan seluruh 36 Bab across 8 Learning Phases dengan ID & slug unik (version 5.0.0)", () => {
    assert.equal(machineLearningCurriculum.version, "5.0.0");
    assert.equal(machineLearningCurriculum.chapters.length, 36);

    const expectedPhases = [
      "phase-1",
      "phase-2",
      "phase-3",
      "phase-4",
      "phase-5",
      "phase-6",
      "phase-7",
      "phase-8",
    ];
    const seenPhases = new Set<string>();
    const seenChapterIds = new Set<string>();
    const seenChapterSlugs = new Set<string>();
    const seenSubIds = new Set<string>();
    const seenSubSlugs = new Set<string>();

    for (let idx = 0; idx < machineLearningCurriculum.chapters.length; idx++) {
      const ch = machineLearningCurriculum.chapters[idx];
      assert.equal(ch.orderIndex, idx + 1, `orderIndex mismatch pada ${ch.id}`);
      assert.ok(ch.phaseId, `Bab ${ch.id} kehilangan phaseId`);
      assert.ok(ch.phaseTitle, `Bab ${ch.id} kehilangan phaseTitle`);
      seenPhases.add(ch.phaseId);

      assert.equal(seenChapterIds.has(ch.id), false, `Duplikat chapter id: ${ch.id}`);
      assert.equal(seenChapterSlugs.has(ch.slug), false, `Duplikat chapter slug: ${ch.slug}`);
      seenChapterIds.add(ch.id);
      seenChapterSlugs.add(ch.slug);

      assert.ok(ch.subchapters.length >= 4, `Bab ${ch.id} harus memiliki >= 4 subbab`);
      for (const sub of ch.subchapters) {
        assert.equal(seenSubIds.has(sub.id), false, `Duplikat subchapter id: ${sub.id}`);
        assert.equal(seenSubSlugs.has(sub.slug), false, `Duplikat subchapter slug: ${sub.slug}`);
        seenSubIds.add(sub.id);
        seenSubSlugs.add(sub.slug);
      }
    }

    for (const p of expectedPhases) {
      assert.equal(seenPhases.has(p), true, `Phase ${p} harus hadir di machineLearningCurriculum`);
    }
    assert.equal(seenSubIds.size, 145, "Total subbab kanonikal v5.0 harus 145 (Bab 1: 5 subbab + Bab 2..36: 35x4)");
  });

  it("curriculumToDocSectionItems meneruskan metadata v5 (phaseId, phaseTitle, isNew2026, interactiveLabId, tldrSummary)", () => {
    const docSections = curriculumToDocSectionItems(machineLearningCurriculum);
    assert.equal(docSections.length, 36);

    const firstChapter = docSections[0];
    assert.equal(firstChapter.phaseId, "phase-1");
    assert.ok(firstChapter.phaseTitle?.includes("Phase 1"));

    const firstSub = firstChapter.subsections?.[0];
    assert.ok(firstSub, "Subbab 1.1 harus ada");
    assert.equal(firstSub.interactiveLabId, "threshold-cost-matrix");
    assert.equal(firstSub.isNew2026, true);
    assert.ok((firstSub.tldrSummary || "").length > 40);

    const lastChapter = docSections[35];
    assert.equal(lastChapter.phaseId, "phase-8");
    assert.equal(lastChapter.isNew2026, true);
    assert.equal(lastChapter.subsections?.[0]?.interactiveLabId, "drift-wasserstein");
  });

  it("seluruh 435 codeExamples lintas 36 Bab bebas placeholder, bertanda runtimeBadge sah, dan isVerifiedOutput: true", () => {
    let totalCode = 0;
    let totalExercises = 0;

    for (const ch of machineLearningCurriculum.chapters) {
      let chapterBugDiffs = 0;
      for (const sub of ch.subchapters) {
        assert.ok((sub.codeExamples?.length || 0) >= 3, `${sub.id} harus memiliki >= 3 codeExamples`);
        if (sub.content_markdown.includes(":::bug-diff")) chapterBugDiffs++;

        for (const ex of sub.codeExamples || []) {
          totalCode++;
          assert.equal(ex.isVerifiedOutput, true, `${ex.id} wajib isVerifiedOutput: true`);
          assert.ok(
            ex.runtimeBadge === "pyodide-ready" || ex.runtimeBadge === "production-env",
            `${ex.id} wajib runtimeBadge sah`
          );
          assert.ok(
            !ex.expectedOutput.trim().startsWith("# Output"),
            `${ex.id} terdeteksi placeholder expectedOutput`
          );
          assert.ok(ex.expectedOutput.trim().length >= 12, `${ex.id} expectedOutput terlalu pendek`);
        }

        const exercises = sub.structuredExercises || [];
        totalExercises += exercises.length;
        assert.ok(exercises.length >= 3, `${sub.id} harus memiliki >= 3 latihan`);
        assert.ok(
          exercises.some((e) => Boolean(e.starterCode && e.testCase)),
          `${sub.id} wajib memiliki minimal 1 latihan dengan starterCode dan testCase`
        );
      }
      assert.ok(chapterBugDiffs >= 1, `Bab ${ch.id} wajib memiliki minimal 1 :::bug-diff`);
    }

    assert.equal(totalCode, 435, "Total blok kode Python terverifikasi harus 435 (145 subbab x 3 tab)");
    assert.equal(totalExercises, 435, "Total latihan bertingkat unik harus 435 (145 subbab x 3 latihan)");
  });

  it("seluruh 8 Interactive ML Sandboxes terdaftar di ML_LAB_REGISTRY dan aktif terpasang di kurikulum ML v5.0", () => {
    const expectedIds = [
      "bias-variance-poly",
      "gradient-descent-2d",
      "threshold-cost-matrix",
      "svm-kernel-margin",
      "boosting-iterations",
      "density-clustering",
      "conformal-intervals",
      "drift-wasserstein",
    ];
    const embeddedIds = new Set<string>();

    for (const ch of machineLearningCurriculum.chapters) {
      for (const sub of ch.subchapters) {
        if (sub.interactiveLabId) {
          assert.equal(isInteractiveLabId(sub.interactiveLabId), true, `Unknown lab ID: ${sub.interactiveLabId}`);
          assert.ok(
            sub.content_markdown.includes(`:::interactive-lab [${sub.interactiveLabId}]`),
            `${sub.id} memiliki interactiveLabId tetapi directive :::interactive-lab tidak ditemukan di markdown`
          );
          embeddedIds.add(sub.interactiveLabId);
        }
      }
    }

    for (const id of expectedIds) {
      assert.equal(isInteractiveLabId(id), true, `Lab ID ${id} harus terdaftar`);
      assert.ok(ML_LAB_REGISTRY[id as keyof typeof ML_LAB_REGISTRY].takeaway.length > 20);
      assert.equal(embeddedIds.has(id), true, `Interactive Lab '${id}' wajib aktif terpasang di salah satu bab ML v5.0`);
    }
    assert.equal(isInteractiveLabId("non-existent-lab"), false);
  });

  it("Velqora Reader 2.0 patuh pada Warm Obsidian theme spec (zero cold-zinc leaks & zero anti-slop)", () => {
    const root = process.cwd();
    const files = [
      "src/components/modul/doc-reader-layout.tsx",
      "src/components/ui/tabbed-code-block.tsx",
      "src/components/ui/side-by-side-diff.tsx",
      "src/components/ui/code-block.tsx",
      "src/components/modul/exercise-card.tsx",
    ];
    const forbidden = ["#111113", "#161619", "#18181B", "#141417", "#141519", "#202023", "#27272A", "animate-pulse"];

    for (const rel of files) {
      const src = fs.readFileSync(path.join(root, rel), "utf8");
      for (const token of forbidden) {
        assert.equal(src.includes(token), false, `${rel} masih mengandung token terlarang '${token}'`);
      }
    }
  });
});
