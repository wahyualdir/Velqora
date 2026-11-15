import {
  CATALOG_GROUPS,
  findCatalogTopic,
  getActiveCatalogTopics,
  type CatalogTopic,
  type TopicGroupId,
} from "./catalog";
import { ALL_ACADEMIC_CURRICULA, getAcademicCurriculum } from "./registry";
import {
  extractTheoryAndCodeFromMarkdown,
  type ExtractedCodeSnippetFromMarkdown,
  type TheoryCodeExtractionResult,
} from "./theory-extractor";
import type {
  AcademicChapter,
  AcademicCodeExample,
  AcademicCurriculum,
  AcademicSubchapter,
} from "./types";

export {
  extractTheoryAndCodeFromMarkdown,
  type ExtractedCodeSnippetFromMarkdown,
  type TheoryCodeExtractionResult,
};

export type CodeCatalogSourceType = "implementation" | "markdown-lab" | "exercise";

export type CodeCatalogLanguage = "python" | "sql" | "bash" | "javascript" | "typescript";

export type CodeCatalogLevel = "pemula" | "menengah" | "lanjutan";

export interface CodeCatalogEntry {
  id: string;
  rawId: string;
  topicId: string;
  topicName: string;
  topicColor: string;
  topicGroup: TopicGroupId;
  curriculumId: string;
  curriculumTitle: string;
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  subchapterId: string;
  subchapterSlug: string;
  subchapterTitle: string;
  title: string;
  filename: string;
  language: CodeCatalogLanguage;
  level: CodeCatalogLevel;
  sourceType: CodeCatalogSourceType;
  code: string;
  expectedOutput: string;
  actualOutput?: string;
  explanation: string;
  prerequisites?: string[];
  executionSteps?: string[];
  troubleshooting?: string[];
  dependencies?: string[];
  hardwareRequirement?: string;
  verificationStatus?: string;
  isVerifiedOutput?: boolean;
  theoryHref: string;
  playgroundHref: string;
}

export interface TopicCodeSummary {
  topic: CatalogTopic;
  groupLabel: string;
  totalEntries: number;
  implementationCount: number;
  exerciseCount: number;
  languages: CodeCatalogLanguage[];
  chaptersCount: number;
}

export interface CodeCatalogFilters {
  topicId?: string;
  chapterId?: string;
  subchapterId?: string;
  language?: CodeCatalogLanguage | "all";
  level?: CodeCatalogLevel | "all";
  sourceType?: CodeCatalogSourceType | "all";
  query?: string;
}

export interface CodeCatalogTopicMeta {
  id: string;
  name: string;
  color: string;
  status: CatalogTopic["status"];
  badgeLabel: string;
  shortDescription: string;
  groupLabel: string;
  totalEntries: number;
  implementationCount: number;
  exerciseCount: number;
  languages: CodeCatalogLanguage[];
  chaptersCount: number;
}

export interface CodeCatalogChapterMeta {
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  count: number;
}

export interface CodeCatalogQueryStats {
  total: number;
  implementations: number;
  exercises: number;
  activeWithCode: number;
  totalTopics: number;
  languages: CodeCatalogLanguage[];
}

export interface CodeCatalogQueryPayload {
  entries: CodeCatalogEntry[];
  totalMatched: number;
  page: number;
  limit: number;
  totalPages: number;
  chapters: CodeCatalogChapterMeta[];
  selectedTopicMeta: CodeCatalogTopicMeta | null;
  topicSummaries: CodeCatalogTopicMeta[];
  stats: CodeCatalogQueryStats;
}

function normalizeCodeFingerprint(code: string): string {
  return code.replace(/\s+/g, " ").trim().slice(0, 160);
}

function normalizeCurriculumKey(value: string): string {
  return value
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function findCurriculumByKey(rawKey: string): AcademicCurriculum | undefined {
  if (!rawKey) return undefined;
  const direct = getAcademicCurriculum(rawKey);
  if (direct) return direct;

  const stripped = rawKey.replace(/\s*\([^)]*\)\s*/g, "").trim();
  if (stripped && stripped !== rawKey) {
    const byStripped = getAcademicCurriculum(stripped);
    if (byStripped) return byStripped;
  }

  const targetNorm = normalizeCurriculumKey(rawKey);
  return ALL_ACADEMIC_CURRICULA.find((c) => {
    const idNorm = normalizeCurriculumKey(c.id);
    const slugNorm = normalizeCurriculumKey(c.slug);
    const titleNorm = normalizeCurriculumKey(c.title || "");
    return (
      idNorm === targetNorm ||
      slugNorm === targetNorm ||
      titleNorm === targetNorm ||
      (targetNorm.length >= 6 && titleNorm.startsWith(targetNorm))
    );
  });
}

function resolveCurriculaForTopic(topic: CatalogTopic): AcademicCurriculum[] {
  const lookupIds =
    topic.mergedFrom && topic.mergedFrom.length > 0
      ? [...topic.mergedFrom, ...(topic.curriculumLookup ? [topic.curriculumLookup] : [])]
      : [topic.curriculumLookup || topic.id];

  const resolved: AcademicCurriculum[] = [];
  const seen = new Set<string>();

  for (const lookupId of lookupIds) {
    const found = findCurriculumByKey(lookupId);
    if (found && !seen.has(found.id)) {
      seen.add(found.id);
      resolved.push(found);
    }
  }

  return resolved;
}

function getCurriculumTitle(curriculum: AcademicCurriculum): string {
  return curriculum.title || curriculum.slug;
}

function inferDefaultFilename(
  topicId: string,
  subchapterSlug: string,
  language: CodeCatalogLanguage,
  index: number
): string {
  const extMap: Record<CodeCatalogLanguage, string> = {
    python: "py",
    sql: "sql",
    bash: "sh",
    javascript: "js",
    typescript: "ts",
  };
  const safeSlug = (subchapterSlug || topicId)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 32);
  return `${safeSlug}_${index + 1}.${extMap[language]}`;
}

function buildTheoryHref(topicId: string, subchapter: AcademicSubchapter): string {
  const sectionTarget = subchapter.id || subchapter.slug;
  return `/dashboard/modul/kategori/${encodeURIComponent(topicId)}?section=${encodeURIComponent(sectionTarget)}`;
}

function buildPlaygroundHref(
  topicId: string,
  entryId: string,
  language: CodeCatalogLanguage
): string {
  const params = new URLSearchParams({
    topic: topicId,
    codeId: entryId,
    lang: language,
  });
  return `/dashboard/playground?${params.toString()}`;
}

let cachedAllEntries: CodeCatalogEntry[] | null = null;
let cachedTopicSummaries: TopicCodeSummary[] | null = null;

function mapCodeExampleToEntry(
  topic: CatalogTopic,
  curriculum: AcademicCurriculum,
  chapter: AcademicChapter,
  subchapter: AcademicSubchapter,
  ex: AcademicCodeExample,
  index: number
): CodeCatalogEntry {
  const lang = (ex.language || "python") as CodeCatalogLanguage;
  const entryId = `${topic.id}::${curriculum.id}::${subchapter.id}::${ex.id || index}`;

  return {
    id: entryId,
    rawId: ex.id,
    topicId: topic.id,
    topicName: topic.name,
    topicColor: topic.color,
    topicGroup: topic.group,
    curriculumId: curriculum.id,
    curriculumTitle: getCurriculumTitle(curriculum),
    chapterId: chapter.id,
    chapterNumber: chapter.orderIndex,
    chapterTitle: chapter.title,
    subchapterId: subchapter.id,
    subchapterSlug: subchapter.slug,
    subchapterTitle: subchapter.title,
    title: ex.title,
    filename: ex.filename || inferDefaultFilename(topic.id, subchapter.slug, lang, index),
    language: lang,
    level: (ex.level || topic.level || "menengah") as CodeCatalogLevel,
    sourceType: "implementation",
    code: ex.code,
    expectedOutput: ex.expectedOutput || "",
    actualOutput: ex.actualOutput,
    explanation: ex.explanation || "",
    prerequisites: ex.prerequisites,
    executionSteps: ex.executionSteps,
    troubleshooting: ex.troubleshooting,
    dependencies: ex.dependencies,
    hardwareRequirement: ex.hardwareRequirement,
    verificationStatus: ex.verificationStatus,
    isVerifiedOutput: ex.isVerifiedOutput,
    theoryHref: buildTheoryHref(topic.id, subchapter),
    playgroundHref: buildPlaygroundHref(topic.id, entryId, lang),
  };
}

/**
 * Mengindeks seluruh potongan kode terstruktur (`codeExamples`), lab markdown
 * yang belum masuk `codeExamples`, serta latihan berkode (`structuredExercises`)
 * dari semua topik aktif di `CATALOG_TOPICS`.
 */
export function getAllCodeCatalogEntries(): CodeCatalogEntry[] {
  if (cachedAllEntries) return cachedAllEntries;

  const entries: CodeCatalogEntry[] = [];
  const activeTopics = getActiveCatalogTopics();

  for (const topic of activeTopics) {
    const curricula = resolveCurriculaForTopic(topic);

    for (const curriculum of curricula) {
      for (const chapter of curriculum.chapters) {
        for (const subchapter of chapter.subchapters) {
          const seenFingerprints = new Set<string>();
          const examples = subchapter.codeExamples ?? [];

          examples.forEach((ex, idx) => {
            if (!ex.code || !ex.code.trim()) return;
            seenFingerprints.add(normalizeCodeFingerprint(ex.code));
            entries.push(
              mapCodeExampleToEntry(topic, curriculum, chapter, subchapter, ex, idx)
            );
          });

          // Fallback untuk subbab yang hanya menaruh kode praktikum di content_markdown (mis. SQL Basis Data)
          if (subchapter.content_markdown) {
            const extracted = extractTheoryAndCodeFromMarkdown(subchapter.content_markdown);
            extracted.extractedSnippets.forEach((snippet, idx) => {
              const fp = normalizeCodeFingerprint(snippet.code);
              if (seenFingerprints.has(fp)) return;
              seenFingerprints.add(fp);

              const entryId = `${topic.id}::${curriculum.id}::${subchapter.id}::md-${idx + 1}`;
              entries.push({
                id: entryId,
                rawId: `md-${subchapter.id}-${idx + 1}`,
                topicId: topic.id,
                topicName: topic.name,
                topicColor: topic.color,
                topicGroup: topic.group,
                curriculumId: curriculum.id,
                curriculumTitle: getCurriculumTitle(curriculum),
                chapterId: chapter.id,
                chapterNumber: chapter.orderIndex,
                chapterTitle: chapter.title,
                subchapterId: subchapter.id,
                subchapterSlug: subchapter.slug,
                subchapterTitle: subchapter.title,
                title:
                  snippet.heading && snippet.heading.toLowerCase() !== "kode lengkap"
                    ? `${subchapter.title} — ${snippet.heading}`
                    : `${subchapter.title} (Lab Praktikum)`,
                filename: inferDefaultFilename(topic.id, subchapter.slug, snippet.language, idx),
                language: snippet.language,
                level: (topic.level || "menengah") as CodeCatalogLevel,
                sourceType: "markdown-lab",
                code: snippet.code,
                expectedOutput: snippet.expectedOutput || "",
                explanation: `Kode praktikum dari subbab "${subchapter.title}" (${chapter.title}).`,
                theoryHref: buildTheoryHref(topic.id, subchapter),
                playgroundHref: buildPlaygroundHref(topic.id, entryId, snippet.language),
              });
            });
          }

          // Indeks latihan yang memiliki starterCode atau solution
          const exercises = subchapter.structuredExercises ?? [];
          exercises.forEach((exercise, idx) => {
            const rawCode = exercise.starterCode?.trim() || exercise.solution?.trim();
            if (!rawCode) return;

            const fp = normalizeCodeFingerprint(rawCode);
            if (seenFingerprints.has(fp)) return;
            seenFingerprints.add(fp);

            const inferredLang: CodeCatalogLanguage =
              topic.id === "sql-basis-data" && /\b(SELECT|CREATE|INSERT|WITH)\b/i.test(rawCode)
                ? "sql"
                : "python";
            const entryId = `${topic.id}::${curriculum.id}::${subchapter.id}::ex-${exercise.id || idx + 1}`;

            const level: CodeCatalogLevel =
              exercise.level === 1
                ? "pemula"
                : exercise.level === 4
                  ? "lanjutan"
                  : "menengah";

            const formattedExpectedOutput =
              exercise.testCase?.expectedOutput !== undefined
                ? typeof exercise.testCase.expectedOutput === "string"
                  ? exercise.testCase.expectedOutput
                  : JSON.stringify(exercise.testCase.expectedOutput, null, 2)
                : "";

            entries.push({
              id: entryId,
              rawId: exercise.id || `ex-${idx + 1}`,
              topicId: topic.id,
              topicName: topic.name,
              topicColor: topic.color,
              topicGroup: topic.group,
              curriculumId: curriculum.id,
              curriculumTitle: getCurriculumTitle(curriculum),
              chapterId: chapter.id,
              chapterNumber: chapter.orderIndex,
              chapterTitle: chapter.title,
              subchapterId: subchapter.id,
              subchapterSlug: subchapter.slug,
              subchapterTitle: subchapter.title,
              title: `Latihan Level ${exercise.level}: ${subchapter.title}`,
              filename: inferDefaultFilename(topic.id, subchapter.slug, inferredLang, idx),
              language: inferredLang,
              level,
              sourceType: "exercise",
              code: rawCode,
              expectedOutput: formattedExpectedOutput,
              explanation: exercise.hint
                ? `${exercise.task} — Petunjuk: ${exercise.hint}`
                : exercise.task || `Latihan pemrograman untuk subbab ${subchapter.title}.`,
              theoryHref: buildTheoryHref(topic.id, subchapter),
              playgroundHref: buildPlaygroundHref(topic.id, entryId, inferredLang),
            });
          });
        }
      }
    }
  }

  cachedAllEntries = entries;
  return entries;
}

/**
 * Mengembalikan ringkasan statistik kode per topik aktif untuk filter & kartu topik di Katalog Kode.
 */
export function getTopicCodeSummaries(): TopicCodeSummary[] {
  if (cachedTopicSummaries) return cachedTopicSummaries;

  const allEntries = getAllCodeCatalogEntries();
  const groupNameMap = new Map(CATALOG_GROUPS.map((g) => [g.id, g.title]));

  const summaries: TopicCodeSummary[] = getActiveCatalogTopics().map((topic) => {
    const topicEntries = allEntries.filter((e) => e.topicId === topic.id);
    const langs = Array.from(new Set(topicEntries.map((e) => e.language)));
    const chapters = new Set(topicEntries.map((e) => `${e.curriculumId}:${e.chapterId}`));
    const exerciseCount = topicEntries.filter((e) => e.sourceType === "exercise").length;

    return {
      topic,
      groupLabel: groupNameMap.get(topic.group) || topic.group,
      totalEntries: topicEntries.length,
      implementationCount: topicEntries.length - exerciseCount,
      exerciseCount,
      languages: langs,
      chaptersCount: chapters.size,
    };
  });

  cachedTopicSummaries = summaries;
  return summaries;
}

/**
 * Mengambil daftar bab yang memiliki kode pada suatu topik tertentu.
 */
export function getCodeChaptersForTopic(
  topicId: string
): CodeCatalogChapterMeta[] {
  const entries = getAllCodeCatalogEntries().filter((e) => e.topicId === topicId);
  const map = new Map<string, CodeCatalogChapterMeta>();

  for (const entry of entries) {
    const key = `${entry.curriculumId}::${entry.chapterId}`;
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(key, {
        chapterId: entry.chapterId,
        chapterNumber: entry.chapterNumber,
        chapterTitle: entry.chapterTitle,
        count: 1,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => a.chapterNumber - b.chapterNumber);
}

/**
 * Memfilter entri Katalog Kode berdasarkan topik, bab, subbab, bahasa, level, sumber, dan kata kunci.
 */
export function getCodeCatalogEntries(
  filters: CodeCatalogFilters = {}
): CodeCatalogEntry[] {
  const all = getAllCodeCatalogEntries();
  const normalizedQuery = filters.query?.trim().toLowerCase() || "";

  let resolvedTopicId = filters.topicId;
  if (resolvedTopicId && resolvedTopicId !== "all") {
    const matchedTopic = findCatalogTopic(resolvedTopicId);
    if (matchedTopic) {
      resolvedTopicId = matchedTopic.id;
    }
  }

  return all.filter((entry) => {
    if (resolvedTopicId && resolvedTopicId !== "all" && entry.topicId !== resolvedTopicId) {
      return false;
    }
    if (filters.chapterId && filters.chapterId !== "all" && entry.chapterId !== filters.chapterId) {
      return false;
    }
    if (
      filters.subchapterId &&
      filters.subchapterId !== "all" &&
      entry.subchapterId !== filters.subchapterId &&
      entry.subchapterSlug !== filters.subchapterId
    ) {
      return false;
    }
    if (filters.language && filters.language !== "all" && entry.language !== filters.language) {
      return false;
    }
    if (filters.level && filters.level !== "all" && entry.level !== filters.level) {
      return false;
    }
    if (
      filters.sourceType &&
      filters.sourceType !== "all" &&
      entry.sourceType !== filters.sourceType
    ) {
      return false;
    }
    if (normalizedQuery) {
      const hay = `${entry.title} ${entry.filename} ${entry.topicName} ${entry.chapterTitle} ${entry.subchapterTitle} ${entry.explanation} ${entry.code}`.toLowerCase();
      if (!hay.includes(normalizedQuery)) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Mencari satu entri Katalog Kode berdasarkan ID lengkap (`entry.id`) maupun `rawId`
 * (opsional difilter berdasarkan `topicId`).
 */
export function findCodeEntryById(
  codeId: string,
  topicId?: string
): CodeCatalogEntry | undefined {
  if (!codeId) return undefined;
  const all = getAllCodeCatalogEntries();

  const exact = all.find((e) => e.id === codeId);
  if (exact) return exact;

  if (topicId) {
    const matchedTopic = findCatalogTopic(topicId);
    const tid = matchedTopic?.id || topicId;
    const byTopicRaw = all.find((e) => e.topicId === tid && e.rawId === codeId);
    if (byTopicRaw) return byTopicRaw;
  }

  return all.find((e) => e.rawId === codeId);
}

/**
 * Mengembalikan payload ringkas dan terpaginasi untuk server component `/dashboard/kode`
 * serta endpoint API `/api/kode`, tanpa mengirim seluruh registri kurikulum ke client bundle.
 */
export function queryCodeCatalogPayload(
  filters: CodeCatalogFilters = {},
  page = 1,
  limit = 12
): CodeCatalogQueryPayload {
  const summaries = getTopicCodeSummaries();
  const topicSummaries: CodeCatalogTopicMeta[] = summaries.map((s) => ({
    id: s.topic.id,
    name: s.topic.name,
    color: s.topic.color,
    status: s.topic.status,
    badgeLabel: s.topic.badgeLabel,
    shortDescription: s.topic.shortDescription,
    groupLabel: s.groupLabel,
    totalEntries: s.totalEntries,
    implementationCount: s.implementationCount,
    exerciseCount: s.exerciseCount,
    languages: s.languages,
    chaptersCount: s.chaptersCount,
  }));

  let total = 0;
  let exercises = 0;
  let activeWithCode = 0;
  const langSet = new Set<CodeCatalogLanguage>();

  for (const item of topicSummaries) {
    total += item.totalEntries;
    exercises += item.exerciseCount;
    if (item.totalEntries > 0) activeWithCode += 1;
    item.languages.forEach((lang) => langSet.add(lang));
  }

  let resolvedTopicId = filters.topicId;
  if (resolvedTopicId && resolvedTopicId !== "all") {
    const matchedTopic = findCatalogTopic(resolvedTopicId);
    if (matchedTopic) {
      resolvedTopicId = matchedTopic.id;
    }
  }

  const selectedTopicMeta =
    resolvedTopicId && resolvedTopicId !== "all"
      ? topicSummaries.find((t) => t.id === resolvedTopicId) || null
      : null;

  const chapters = selectedTopicMeta ? getCodeChaptersForTopic(selectedTopicMeta.id) : [];
  const filtered = getCodeCatalogEntries({
    ...filters,
    topicId: selectedTopicMeta?.id || filters.topicId,
  });

  const safeLimit = Math.max(1, Math.min(100, Math.floor(limit) || 12));
  const totalMatched = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalMatched / safeLimit));
  const safePage = Math.max(1, Math.min(totalPages, Math.floor(page) || 1));
  const start = (safePage - 1) * safeLimit;

  return {
    entries: filtered.slice(start, start + safeLimit),
    totalMatched,
    page: safePage,
    limit: safeLimit,
    totalPages,
    chapters,
    selectedTopicMeta,
    topicSummaries,
    stats: {
      total,
      implementations: total - exercises,
      exercises,
      activeWithCode,
      totalTopics: topicSummaries.length,
      languages: Array.from(langSet),
    },
  };
}
