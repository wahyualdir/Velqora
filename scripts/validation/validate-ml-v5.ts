/**
 * VELQORA ML v5.0 — AUTOMATED 8-GATE QUALITY LINTER (G1–G6 Content & Structure)
 *
 * Enforces Principal ML Engineer (20+ years) content standards:
 *   G1: Zero Fake Output (no '# Output ...', no placeholder strings, verified flag)
 *   G2: Dual-Track Code & Standalone Hygiene (:::code-tabs, runtimeBadge, zero cross-tab deps)
 *   G3: Anti-Boilerplate & Cross-Subchapter Uniqueness (n-gram Jaccard < 15%)
 *   G4: Citation Integrity (real authors, valid publication years, valid HTTPS URLs)
 *   G5: KaTeX, Mermaid & Directive Lint (no single-line math trapped in <details>)
 *   G6: Principal-Level Depth Budget (word budget, exercises + starterCode + testCase, bug-diff)
 *
 * Usage:
 *   npx tsx scripts/validation/validate-ml-v5.ts --chapter ch01-problem-framing
 *   npx tsx scripts/validation/validate-ml-v5.ts --chapter chunk1-ch01
 *   npx tsx scripts/validation/validate-ml-v5.ts --all
 */

import * as fs from "fs";
import * as path from "path";
import { pathToFileURL } from "url";
import type { AcademicChapter, AcademicSubchapter } from "../../src/lib/curriculum/types";

const REPO_ROOT = path.resolve(__dirname, "../..");
const ML_DIR = path.resolve(REPO_ROOT, "src/lib/curriculum/topics/machine-learning");

interface Violation {
  gate: "G1" | "G2" | "G3" | "G4" | "G5" | "G6";
  chapterId: string;
  subchapterId: string;
  message: string;
}

const FORBIDDEN_BOILERPLATE_PHRASES = [
  "buktikan secara analitis formulasi matematis utama pada",
  "buktikan secara analitis perumusan matematis utama pada",
  "verify_numerical_bounds",
  "verify_mlops_metric",
  "kunci pseudo-random generator seed (misal: `random_state=42`) untuk menjamin reproduksibilitas ilmiah eksperimen komputasi",
  "peneliti & pengembang resmi",
  "peneliti resmi & kontributor pustaka",
  "tim dokumentasi resmi / peneliti utama",
  "di era digital saat ini",
  "lorem ipsum",
  "[placeholder]",
  "isi materi di sini",
  "output belum dibuat",
];

const FAKE_OUTPUT_RE = /^(?:#\s*output\b|todo:|\[placeholder\])/i;

function wordCount(text: string): number {
  return (text || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

function to3Grams(text: string): Set<string> {
  const tokens = (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
  const grams = new Set<string>();
  for (let i = 0; i <= tokens.length - 3; i++) {
    grams.add(`${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`);
  }
  return grams;
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) {
    if (b.has(x)) inter++;
  }
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

function resolveChapterFiles(chapterArg?: string, runAll = false): string[] {
  if (runAll) {
    const v5 = fs
      .readdirSync(ML_DIR)
      .filter((f) => /^ch\d{2}-.*\.ts$/.test(f))
      .sort()
      .map((f) => path.join(ML_DIR, f));
    if (v5.length > 0) return v5;
    return fs
      .readdirSync(ML_DIR)
      .filter((f) => /^chunk\d+-ch\d{2}\.ts$/.test(f))
      .sort()
      .map((f) => path.join(ML_DIR, f));
  }

  if (!chapterArg) {
    throw new Error("Specify --chapter <name-or-path> or --all");
  }

  if (fs.existsSync(chapterArg)) return [path.resolve(chapterArg)];
  const inDir = path.join(ML_DIR, chapterArg.endsWith(".ts") ? chapterArg : `${chapterArg}.ts`);
  if (fs.existsSync(inDir)) return [inDir];

  const matches = fs
    .readdirSync(ML_DIR)
    .filter((f) => f.includes(chapterArg) && f.endsWith(".ts"))
    .sort()
    .map((f) => path.join(ML_DIR, f));
  if (matches.length > 0) return matches;

  throw new Error(`Chapter file not found for '${chapterArg}'`);
}

async function loadChapter(filePath: string): Promise<AcademicChapter> {
  const mod = await import(pathToFileURL(filePath).href);
  const ch = Object.values(mod).find(
    (v: any) => v && typeof v === "object" && Array.isArray(v.subchapters)
  ) as AcademicChapter | undefined;
  if (!ch) throw new Error(`No AcademicChapter export found in ${filePath}`);
  return ch;
}

function auditChapter(chapter: AcademicChapter): {
  violations: Violation[];
  stats: {
    subchapters: number;
    avgWords: number;
    codeExamples: number;
    exercises: number;
    bugDiffs: number;
    interactiveLabs: number;
  };
} {
  const violations: Violation[] = [];
  const subs: AcademicSubchapter[] = chapter.subchapters || [];

  let totalWords = 0;
  let totalCode = 0;
  let totalExercises = 0;
  let chapterBugDiffs = 0;
  let chapterInteractiveLabs = 0;

  // Store 3-grams per subchapter for cross-subchapter uniqueness checks
  const pitfallGrams: Array<{ subId: string; grams: Set<string> }> = [];
  const exerciseGrams: Array<{ subId: string; grams: Set<string> }> = [];

  for (const sub of subs) {
    const md = sub.content_markdown || "";
    const lowerMd = md.toLowerCase();
    const words = wordCount(md);
    totalWords += words;

    // ─── G1: Zero Fake Output ───
    const codeExamples = sub.codeExamples || [];
    totalCode += codeExamples.length;
    if (codeExamples.length < 2) {
      violations.push({
        gate: "G1",
        chapterId: chapter.id,
        subchapterId: sub.id,
        message: `Expected >= 2 codeExamples (Dual-Track), found ${codeExamples.length}`,
      });
    }
    for (const ex of codeExamples) {
      const out = (ex.expectedOutput || "").trim();
      if (!out || out.length < 12 || FAKE_OUTPUT_RE.test(out)) {
        violations.push({
          gate: "G1",
          chapterId: chapter.id,
          subchapterId: sub.id,
          message: `Fake or empty expectedOutput in codeExample '${ex.id}': "${out.slice(0, 60)}"`,
        });
      }
      if (ex.isVerifiedOutput !== true && ex.runtimeBadge !== "production-env") {
        violations.push({
          gate: "G1",
          chapterId: chapter.id,
          subchapterId: sub.id,
          message: `codeExample '${ex.id}' is missing isVerifiedOutput: true`,
        });
      }
      if (!ex.runtimeBadge) {
        violations.push({
          gate: "G2",
          chapterId: chapter.id,
          subchapterId: sub.id,
          message: `codeExample '${ex.id}' is missing runtimeBadge ('pyodide-ready' | 'production-env')`,
        });
      }
    }

    // ─── G2: Dual-Track :::code-tabs & No Truncated Code ───
    if (!md.includes(":::code-tabs")) {
      violations.push({
        gate: "G2",
        chapterId: chapter.id,
        subchapterId: sub.id,
        message: `Missing :::code-tabs multi-track code directive in markdown`,
      });
    }
    if (/^\s*#\s*\.\.\.\s*(kode|implementasi|rest of)/im.test(md)) {
      violations.push({
        gate: "G2",
        chapterId: chapter.id,
        subchapterId: sub.id,
        message: `Truncated code placeholder comment detected`,
      });
    }

    // ─── G3: Anti-Boilerplate & Cross-Subchapter Uniqueness ───
    const serializedSub = JSON.stringify({
      md,
      exercises: sub.structuredExercises,
      references: sub.references,
      pitfalls: sub.commonPitfalls,
    }).toLowerCase();

    for (const phrase of FORBIDDEN_BOILERPLATE_PHRASES) {
      if (serializedSub.includes(phrase)) {
        violations.push({
          gate: "G3",
          chapterId: chapter.id,
          subchapterId: sub.id,
          message: `Forbidden boilerplate phrase detected: "${phrase}"`,
        });
      }
    }

    pitfallGrams.push({
      subId: sub.id,
      grams: to3Grams((sub.commonPitfalls || []).join(" ")),
    });
    exerciseGrams.push({
      subId: sub.id,
      grams: to3Grams(
        (sub.structuredExercises || []).map((e) => `${e.task} ${e.solution}`).join(" ")
      ),
    });

    // ─── G4: Citation Integrity ───
    const refs = sub.references || [];
    if (refs.length < 2) {
      violations.push({
        gate: "G4",
        chapterId: chapter.id,
        subchapterId: sub.id,
        message: `Expected >= 2 verified primary references, found ${refs.length}`,
      });
    }
    for (const ref of refs) {
      const authorsStr = (ref.authors || []).join(" ").toLowerCase();
      if (!ref.authors || ref.authors.length === 0 || authorsStr.includes("peneliti") || authorsStr.includes("tim dokumentasi")) {
        violations.push({
          gate: "G4",
          chapterId: chapter.id,
          subchapterId: sub.id,
          message: `Generic or missing authors on reference "${ref.title}"`,
        });
      }
      if (!ref.year || ref.year < 1936 || ref.year > 2026) {
        violations.push({
          gate: "G4",
          chapterId: chapter.id,
          subchapterId: sub.id,
          message: `Invalid publication year (${ref.year}) on reference "${ref.title}"`,
        });
      }
      if (!ref.url || !ref.url.startsWith("https://")) {
        violations.push({
          gate: "G4",
          chapterId: chapter.id,
          subchapterId: sub.id,
          message: `Missing or non-HTTPS URL on reference "${ref.title}"`,
        });
      }
    }

    // ─── G5: KaTeX, Mermaid & Directive Lint ───
    // Strip fenced code blocks before counting $$
    const mdNoCode = md.replace(/```[\s\S]*?```/g, "");
    const displayMathTokens = mdNoCode.match(/\$\$/g) || [];
    if (displayMathTokens.length % 2 !== 0) {
      violations.push({
        gate: "G5",
        chapterId: chapter.id,
        subchapterId: sub.id,
        message: `Unbalanced KaTeX display math delimiter '$$' (count=${displayMathTokens.length})`,
      });
    }
    // Disallow raw <details> wrapping 1-line formulas (legacy v4.0 anti-pattern)
    const rawDetails = md.match(/<details[\s\S]*?<\/details>/g) || [];
    for (const d of rawDetails) {
      const innerLines = d
        .replace(/<[^>]+>/g, "")
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && !l.startsWith("[Bukti]"));
      if (innerLines.length <= 2) {
        violations.push({
          gate: "G5",
          chapterId: chapter.id,
          subchapterId: sub.id,
          message: `Single-line formula hidden inside <details> accordion — display core formulas openly and use :::math-proof only for multi-step proofs`,
        });
        break;
      }
    }
    if (!md.includes("```mermaid")) {
      violations.push({
        gate: "G5",
        chapterId: chapter.id,
        subchapterId: sub.id,
        message: `Missing Mermaid architectural/algorithmic diagram`,
      });
    }
    if (!md.includes(":::tldr") && !sub.tldrSummary) {
      violations.push({
        gate: "G5",
        chapterId: chapter.id,
        subchapterId: sub.id,
        message: `Missing Executive Mental Model (:::tldr block or tldrSummary)`,
      });
    }

    if (md.includes(":::bug-diff")) chapterBugDiffs++;
    if (md.includes(":::interactive-lab") || sub.interactiveLabId) chapterInteractiveLabs++;

    // ─── G6: Principal-Level Depth Budget ───
    if (words < 900) {
      violations.push({
        gate: "G6",
        chapterId: chapter.id,
        subchapterId: sub.id,
        message: `Substantive prose word count too low (${words} words; minimum 900 words excluding code & display math)`,
      });
    }
    const exercises = sub.structuredExercises || [];
    totalExercises += exercises.length;
    if (exercises.length < 3) {
      violations.push({
        gate: "G6",
        chapterId: chapter.id,
        subchapterId: sub.id,
        message: `Expected >= 3 tiered structuredExercises, found ${exercises.length}`,
      });
    }
    const hasStarterAndTest = exercises.some((e) => e.starterCode && e.testCase);
    if (!hasStarterAndTest) {
      violations.push({
        gate: "G6",
        chapterId: chapter.id,
        subchapterId: sub.id,
        message: `No exercise with both starterCode and deterministic testCase found`,
      });
    }
    if (!lowerMd.includes("kapan tidak") && !lowerMd.includes("anti-use-case") && !lowerMd.includes("jangan gunakan")) {
      violations.push({
        gate: "G6",
        chapterId: chapter.id,
        subchapterId: sub.id,
        message: `Missing explicit 'Kapan TIDAK Menggunakan' (anti-use-case engineering judgment)`,
      });
    }
  }

  // Chapter-level checks
  if (chapterBugDiffs < 1) {
    violations.push({
      gate: "G6",
      chapterId: chapter.id,
      subchapterId: "(chapter)",
      message: `Chapter must include at least 1 :::bug-diff (Anti-Pattern vs Production-Safe) comparison`,
    });
  }

  // Cross-subchapter Jaccard uniqueness check (G3)
  for (let i = 0; i < pitfallGrams.length; i++) {
    for (let j = i + 1; j < pitfallGrams.length; j++) {
      const simPit = jaccardSimilarity(pitfallGrams[i].grams, pitfallGrams[j].grams);
      if (simPit >= 0.15) {
        violations.push({
          gate: "G3",
          chapterId: chapter.id,
          subchapterId: `${pitfallGrams[i].subId} <-> ${pitfallGrams[j].subId}`,
          message: `High pitfall duplication detected (Jaccard=${(simPit * 100).toFixed(1)}% >= 15%)`,
        });
      }
      const simEx = jaccardSimilarity(exerciseGrams[i].grams, exerciseGrams[j].grams);
      if (simEx >= 0.15) {
        violations.push({
          gate: "G3",
          chapterId: chapter.id,
          subchapterId: `${exerciseGrams[i].subId} <-> ${exerciseGrams[j].subId}`,
          message: `High exercise boilerplate similarity detected (Jaccard=${(simEx * 100).toFixed(1)}% >= 15%)`,
        });
      }
    }
  }

  return {
    violations,
    stats: {
      subchapters: subs.length,
      avgWords: subs.length ? Math.round(totalWords / subs.length) : 0,
      codeExamples: totalCode,
      exercises: totalExercises,
      bugDiffs: chapterBugDiffs,
      interactiveLabs: chapterInteractiveLabs,
    },
  };
}

async function main() {
  const args = process.argv.slice(2);
  const runAll = args.includes("--all");
  const chIdx = args.indexOf("--chapter");
  const chArg = chIdx >= 0 ? args[chIdx + 1] : undefined;

  const files = resolveChapterFiles(chArg, runAll);
  let totalViolations = 0;

  for (const filePath of files) {
    const ch = await loadChapter(filePath);
    const { violations, stats } = auditChapter(ch);
    totalViolations += violations.length;

    const status = violations.length === 0 ? "PASS" : "FAIL";
    console.log(
      `\n[${status}] ${ch.title} (${path.basename(filePath)}) | subs:${stats.subchapters} | avgWords:${stats.avgWords} | code:${stats.codeExamples} | ex:${stats.exercises} | bugDiff:${stats.bugDiffs} | labs:${stats.interactiveLabs} | violations:${violations.length}`
    );

    if (violations.length > 0) {
      const byGate: Record<string, number> = {};
      for (const v of violations) {
        byGate[v.gate] = (byGate[v.gate] || 0) + 1;
      }
      console.log("  Violations by Gate:", byGate);
      violations.slice(0, 15).forEach((v) => {
        console.log(`   - [${v.gate}] (${v.subchapterId}) ${v.message}`);
      });
      if (violations.length > 15) {
        console.log(`   ... and ${violations.length - 15} more violations`);
      }
    }
  }

  console.log(`\nOVERALL ML v5.0 QUALITY LINT: ${totalViolations === 0 ? "PASS (0 Violations)" : `FAIL (${totalViolations} Violations)`}`);
  process.exit(totalViolations === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("Validator crashed:", err);
  process.exit(2);
});
