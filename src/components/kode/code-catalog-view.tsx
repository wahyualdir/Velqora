"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  FileCode2,
  Filter,
  Layers,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Terminal,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { CodeBlock } from "@/components/ui/code-block";
import { PageContainer } from "@/components/ui/section";
import {
  getCodeCatalogEntries,
  getCodeChaptersForTopic,
  getTopicCodeSummaries,
  type CodeCatalogEntry,
  type CodeCatalogLanguage,
  type CodeCatalogLevel,
  type CodeCatalogSourceType,
} from "@/lib/curriculum/code-catalog";
import { findCatalogTopic } from "@/lib/curriculum/catalog";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 12;

const LANGUAGE_LABELS: Record<CodeCatalogLanguage, string> = {
  python: "Python",
  sql: "SQL",
  bash: "Bash / CLI",
  javascript: "JavaScript",
  typescript: "TypeScript",
};

const LEVEL_LABELS: Record<CodeCatalogLevel, string> = {
  pemula: "Pemula",
  menengah: "Menengah",
  lanjutan: "Lanjutan",
};

const SOURCE_LABELS: Record<CodeCatalogSourceType, string> = {
  implementation: "Implementasi Modul",
  "markdown-lab": "Lab Praktikum",
  exercise: "Latihan Kode",
};

function CodeCatalogEntryCard({ entry }: { entry: CodeCatalogEntry }) {
  const [showOutput, setShowOutput] = useState(false);
  const outputText = entry.actualOutput || entry.expectedOutput;
  const isVerified =
    Boolean(entry.isVerifiedOutput) || entry.verificationStatus === "verified_runnable";

  return (
    <article className="rounded-2xl border border-border bg-surface p-4 sm:p-5 space-y-4 shadow-2xs hover:border-brand-500/30 transition-colors">
      {/* Breadcrumb & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-text-secondary min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: entry.topicColor || "#0284C7" }}
          />
          <span className="font-semibold text-text-primary">{entry.topicName}</span>
          <ChevronRight className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
          <span className="truncate max-w-[240px]">Bab {entry.chapterNumber}</span>
          <ChevronRight className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
          <span className="truncate max-w-[260px] text-text-tertiary">
            {entry.subchapterTitle}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <span className="px-2 py-0.5 rounded-md border border-border bg-surface-secondary text-[10px] font-mono font-bold uppercase text-text-primary">
            {LANGUAGE_LABELS[entry.language] || entry.language}
          </span>
          <span className="px-2 py-0.5 rounded-md border border-border bg-surface text-[10px] font-mono text-text-secondary">
            {LEVEL_LABELS[entry.level] || entry.level}
          </span>
          <span className="px-2 py-0.5 rounded-md border border-brand-500/20 bg-brand-500/10 text-[10px] font-mono font-medium text-brand-700 dark:text-brand-300">
            {SOURCE_LABELS[entry.sourceType]}
          </span>
          {isVerified && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-emerald-500/25 bg-emerald-500/10 text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-300"
              title="Output eksekusi terverifikasi"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Terverifikasi</span>
            </span>
          )}
        </div>
      </div>

      {/* Title & Explanation */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-base sm:text-lg font-bold text-text-primary font-display leading-snug">
            {entry.title}
          </h3>
          <span className="text-[11px] font-mono text-text-tertiary bg-surface-secondary px-2 py-0.5 rounded border border-border/70">
            {entry.filename}
          </span>
        </div>
        {entry.explanation && (
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-3">
            {entry.explanation}
          </p>
        )}
      </div>

      {/* Syntax-highlighted Code Block */}
      <CodeBlock
        code={entry.code}
        language={entry.language}
        title={entry.filename}
        showLineNumbers
        collapsible={entry.code.split("\n").length > 26}
        defaultExpanded={entry.code.split("\n").length <= 38}
      />

      {/* Optional Verified / Expected Output Toggle */}
      {outputText && (
        <div className="rounded-xl border border-border/80 bg-surface-secondary/40 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowOutput((prev) => !prev)}
            className="w-full px-3.5 py-2 flex items-center justify-between text-xs font-mono font-medium text-text-secondary hover:text-text-primary hover:bg-surface-secondary/70 transition-colors cursor-pointer"
          >
            <span className="inline-flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>{showOutput ? "Sembunyikan Output Eksekusi" : "Lihat Output Eksekusi & Validasi"}</span>
            </span>
            <span className="text-[10px] text-text-tertiary">
              {showOutput ? "Tutup" : "Buka"}
            </span>
          </button>
          {showOutput && (
            <div className="p-3 border-t border-border/70 bg-surface">
              <pre className="text-xs font-mono text-text-primary whitespace-pre-wrap break-words overflow-x-auto max-h-64">
                {outputText}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-border/60">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={entry.playgroundHref}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-mono font-semibold transition-colors shadow-2xs"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Jalankan di Ruang Praktik</span>
          </Link>

          <Link
            href={entry.theoryHref}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-xs font-mono font-medium text-text-primary transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Baca Teori Subbab</span>
          </Link>
        </div>

        <span className="text-[11px] font-mono text-text-tertiary">
          {entry.chapterTitle}
        </span>
      </div>
    </article>
  );
}

export function CodeCatalogView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTopicParam = searchParams.get("topic") || "all";
  const initialChapterParam = searchParams.get("chapter") || "all";
  const initialSubParam = searchParams.get("sub") || "all";
  const initialLangParam = (searchParams.get("lang") || "all") as CodeCatalogLanguage | "all";
  const initialQueryParam = searchParams.get("q") || "";

  const [selectedTopic, setSelectedTopic] = useState<string>(initialTopicParam);
  const [selectedChapter, setSelectedChapter] = useState<string>(initialChapterParam);
  const [selectedSub, setSelectedSub] = useState<string>(initialSubParam);
  const [selectedLang, setSelectedLang] = useState<CodeCatalogLanguage | "all">(
    initialLangParam
  );
  const [selectedLevel, setSelectedLevel] = useState<CodeCatalogLevel | "all">("all");
  const [selectedSource, setSelectedSource] = useState<CodeCatalogSourceType | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>(initialQueryParam);
  const [page, setPage] = useState<number>(1);
  const [showAllTopicsGrid, setShowAllTopicsGrid] = useState<boolean>(false);

  // Sinkronisasi URL query params bila pengguna menavigasi dari Katalog Modul / DocReader
  useEffect(() => {
    const nextTopic = searchParams.get("topic") || "all";
    const nextSub = searchParams.get("sub") || "all";
    const nextChapter = searchParams.get("chapter") || "all";
    const nextQ = searchParams.get("q") || "";
    setSelectedTopic(nextTopic);
    setSelectedSub(nextSub);
    setSelectedChapter(nextChapter);
    if (nextQ) setSearchQuery(nextQ);
    setPage(1);
  }, [searchParams]);

  const topicSummaries = useMemo(() => getTopicCodeSummaries(), []);

  const totalCatalogStats = useMemo(() => {
    let total = 0;
    let exercises = 0;
    let activeWithCode = 0;
    const langs = new Set<CodeCatalogLanguage>();

    for (const s of topicSummaries) {
      total += s.totalEntries;
      exercises += s.exerciseCount;
      if (s.totalEntries > 0) activeWithCode += 1;
      s.languages.forEach((l) => langs.add(l));
    }

    return {
      total,
      implementations: total - exercises,
      exercises,
      activeWithCode,
      totalTopics: topicSummaries.length,
      languagesCount: langs.size,
      languages: Array.from(langs),
    };
  }, [topicSummaries]);

  const resolvedSelectedTopic = useMemo(() => {
    if (selectedTopic === "all") return undefined;
    return findCatalogTopic(selectedTopic);
  }, [selectedTopic]);

  const chaptersForTopic = useMemo(() => {
    if (!resolvedSelectedTopic) return [];
    return getCodeChaptersForTopic(resolvedSelectedTopic.id);
  }, [resolvedSelectedTopic]);

  const filteredEntries = useMemo(() => {
    return getCodeCatalogEntries({
      topicId: resolvedSelectedTopic?.id || selectedTopic,
      chapterId: selectedChapter,
      subchapterId: selectedSub,
      language: selectedLang,
      level: selectedLevel,
      sourceType: selectedSource,
      query: searchQuery,
    });
  }, [
    resolvedSelectedTopic,
    selectedTopic,
    selectedChapter,
    selectedSub,
    selectedLang,
    selectedLevel,
    selectedSource,
    searchQuery,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEntries.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEntries, currentPage]);

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopic(topicId);
    setSelectedChapter("all");
    setSelectedSub("all");
    setPage(1);
    if (topicId === "all") {
      router.replace("/dashboard/kode", { scroll: false });
    } else {
      router.replace(`/dashboard/kode?topic=${encodeURIComponent(topicId)}`, {
        scroll: false,
      });
    }
  };

  const handleResetFilters = () => {
    setSelectedTopic("all");
    setSelectedChapter("all");
    setSelectedSub("all");
    setSelectedLang("all");
    setSelectedLevel("all");
    setSelectedSource("all");
    setSearchQuery("");
    setPage(1);
    router.replace("/dashboard/kode", { scroll: false });
  };

  const hasActiveFilters =
    selectedTopic !== "all" ||
    selectedChapter !== "all" ||
    selectedSub !== "all" ||
    selectedLang !== "all" ||
    selectedLevel !== "all" ||
    selectedSource !== "all" ||
    searchQuery.trim().length > 0;

  const visibleTopicChips = showAllTopicsGrid
    ? topicSummaries
    : topicSummaries.slice(0, 10);

  return (
    <PageContainer className="py-6 sm:py-8 space-y-6">
      <PageHeader
        eyebrow="Menu 2 • Laboratorium & Implementasi Kurikulum"
        title="Katalog Kode AI & Data"
        description="Direktori skrip Python, SQL, Bash, dan latihan kode dari 24 topik kurikulum—terpisah dari bacaan teori agar Anda dapat mencari kode, memeriksa output eksekusi, atau langsung mencobanya di Ruang Praktik."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/dashboard/modul"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-xs font-mono font-medium text-text-primary transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Katalog Modul (Teori)</span>
            </Link>
            <Link
              href="/dashboard/playground"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-mono font-semibold transition-colors shadow-2xs"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Ruang Praktik Kode</span>
            </Link>
          </div>
        }
      />

      {/* Stats Strip */}
      <section
        aria-label="Statistik Katalog Kode"
        className="grid grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-3 sm:gap-4"
      >
        <div className="rounded-xl border border-border bg-surface p-3.5 sm:p-4 flex flex-col justify-between gap-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary">
            Total Skrip Kode
          </span>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xl sm:text-2xl font-bold font-display text-text-primary tabular-nums">
              {totalCatalogStats.total.toLocaleString("id-ID")}
            </span>
            <FileCode2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3.5 sm:p-4 flex flex-col justify-between gap-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary">
            Implementasi vs Latihan
          </span>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-lg sm:text-xl font-bold font-display text-text-primary tabular-nums">
              {totalCatalogStats.implementations.toLocaleString("id-ID")} /{" "}
              {totalCatalogStats.exercises.toLocaleString("id-ID")}
            </span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3.5 sm:p-4 flex flex-col justify-between gap-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary">
            Topik Terindeks
          </span>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xl sm:text-2xl font-bold font-display text-text-primary tabular-nums">
              {totalCatalogStats.activeWithCode} / {totalCatalogStats.totalTopics}
            </span>
            <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3.5 sm:p-4 flex flex-col justify-between gap-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary">
            Bahasa Pemrograman
          </span>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-sm sm:text-base font-bold font-mono text-text-primary">
              {totalCatalogStats.languages
                .map((l) => LANGUAGE_LABELS[l] || l.toUpperCase())
                .join(", ")}
            </span>
            <Terminal className="w-4 h-4 text-text-tertiary shrink-0" />
          </div>
        </div>
      </section>

      {/* Topic Selector Pills */}
      <section className="rounded-2xl border border-border bg-surface p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Pilih Topik Kurikulum</span>
          </span>
          <button
            type="button"
            onClick={() => setShowAllTopicsGrid((prev) => !prev)}
            className="text-xs font-mono text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
          >
            {showAllTopicsGrid
              ? "Tampilkan Lebih Sedikit"
              : `Lihat Semua Topik (${topicSummaries.length})`}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleSelectTopic("all")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors cursor-pointer",
              selectedTopic === "all"
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-surface-secondary/50 text-text-secondary border-border hover:text-text-primary"
            )}
          >
            Semua Topik ({totalCatalogStats.total.toLocaleString("id-ID")})
          </button>

          {visibleTopicChips.map((summary) => {
            const isActive =
              resolvedSelectedTopic?.id === summary.topic.id ||
              selectedTopic === summary.topic.id;
            return (
              <button
                key={summary.topic.id}
                type="button"
                onClick={() => handleSelectTopic(summary.topic.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors cursor-pointer",
                  isActive
                    ? "bg-brand-600 text-white border-brand-600 font-semibold"
                    : "bg-surface text-text-secondary border-border hover:bg-surface-secondary hover:text-text-primary"
                )}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: isActive ? "#ffffff" : summary.topic.color || "#0284C7",
                  }}
                />
                <span>{summary.topic.name}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full tabular-nums",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-surface-secondary text-text-tertiary"
                  )}
                >
                  {summary.totalEntries}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Deep-Link Subchapter Banner (jika datang dari tombol Katalog Kode di DocReader) */}
      {selectedSub !== "all" && (
        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono text-text-primary">
            Menampilkan kode khusus untuk subbab:{" "}
            <span className="font-bold text-brand-700 dark:text-brand-300">{selectedSub}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedSub("all");
              setPage(1);
            }}
            className="text-xs font-mono font-semibold text-brand-700 dark:text-brand-300 hover:underline cursor-pointer"
          >
            Tampilkan semua subbab di topik ini
          </button>
        </div>
      )}

      {/* Detailed Filter & Search Bar */}
      <section className="rounded-2xl border border-border bg-surface p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Cari judul skrip, fungsi Python, kueri SQL, atau file..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-surface-secondary/40 text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>

          {/* Chapter Filter (active when single topic selected) */}
          <div className="md:col-span-3">
            <select
              aria-label="Filter Bab"
              value={selectedChapter}
              disabled={!resolvedSelectedTopic || chaptersForTopic.length === 0}
              onChange={(e) => {
                setSelectedChapter(e.target.value);
                setSelectedSub("all");
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-xs font-mono text-text-primary disabled:opacity-50"
            >
              <option value="all">
                {resolvedSelectedTopic
                  ? `Semua Bab (${chaptersForTopic.length})`
                  : "Pilih topik untuk filter Bab"}
              </option>
              {chaptersForTopic.map((ch) => (
                <option key={ch.chapterId} value={ch.chapterId}>
                  Bab {ch.chapterNumber}: {ch.chapterTitle} ({ch.count})
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div className="md:col-span-2">
            <select
              aria-label="Filter Bahasa"
              value={selectedLang}
              onChange={(e) => {
                setSelectedLang(e.target.value as CodeCatalogLanguage | "all");
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-xs font-mono text-text-primary"
            >
              <option value="all">Semua Bahasa</option>
              {totalCatalogStats.languages.map((lang) => (
                <option key={lang} value={lang}>
                  {LANGUAGE_LABELS[lang] || lang}
                </option>
              ))}
            </select>
          </div>

          {/* Source Type Filter */}
          <div className="md:col-span-2">
            <select
              aria-label="Filter Tipe Kode"
              value={selectedSource}
              onChange={(e) => {
                setSelectedSource(e.target.value as CodeCatalogSourceType | "all");
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-xs font-mono text-text-primary"
            >
              <option value="all">Semua Tipe</option>
              <option value="implementation">Implementasi Modul</option>
              <option value="markdown-lab">Lab Praktikum</option>
              <option value="exercise">Latihan Kode</option>
            </select>
          </div>
        </div>

        {/* Level Filter Pills + Results Count */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono text-text-tertiary mr-1">Level:</span>
            {(["all", "pemula", "menengah", "lanjutan"] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => {
                  setSelectedLevel(lvl);
                  setPage(1);
                }}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[11px] font-mono border transition-colors cursor-pointer",
                  selectedLevel === lvl
                    ? "bg-text-primary text-surface border-text-primary font-semibold"
                    : "bg-surface text-text-secondary border-border hover:bg-surface-secondary"
                )}
              >
                {lvl === "all" ? "Semua" : LEVEL_LABELS[lvl]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-text-secondary">
            <span>
              Menampilkan{" "}
              <strong className="text-text-primary tabular-nums">
                {filteredEntries.length.toLocaleString("id-ID")}
              </strong>{" "}
              skrip kode
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Code Cards Results */}
      {paginatedEntries.length > 0 ? (
        <section id="katalog-kode-list" className="space-y-4">
          {paginatedEntries.map((entry) => (
            <CodeCatalogEntryCard key={entry.id} entry={entry} />
          ))}

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <nav
              aria-label="Paginasi Katalog Kode"
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3"
            >
              <span className="text-xs font-mono text-text-secondary">
                Halaman <strong className="text-text-primary">{currentPage}</strong> dari{" "}
                <strong className="text-text-primary">{totalPages}</strong> (
                {filteredEntries.length.toLocaleString("id-ID")} skrip)
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-xs font-mono text-text-primary disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Sebelumnya</span>
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-xs font-mono text-text-primary disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </nav>
          )}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center space-y-3">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-surface-secondary border border-border text-text-tertiary mx-auto">
            <FileCode2 className="w-5 h-5" />
          </div>

          {resolvedSelectedTopic &&
          (resolvedSelectedTopic.status === "in_progress" ||
            resolvedSelectedTopic.status === "coming_soon") ? (
            <>
              <h3 className="text-base font-bold text-text-primary font-display">
                Lab Kode &ldquo;{resolvedSelectedTopic.name}&rdquo; Sedang Disiapkan
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto">
                Topik ini berstatus{" "}
                <span className="font-semibold text-text-primary">
                  {resolvedSelectedTopic.badgeLabel}
                </span>
                . Anda tetap dapat meninjau kerangka silabus &amp; rancangan babnya di Katalog Modul.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <Link
                  href={`/dashboard/modul/kategori/${encodeURIComponent(
                    resolvedSelectedTopic.id
                  )}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-mono font-semibold"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Lihat Silabus Modul</span>
                </Link>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-xs font-mono text-text-primary cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Kembali ke Semua Topik</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-base font-bold text-text-primary font-display">
                Tidak Ada Skrip Kode yang Cocok
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
                Coba ubah kata kunci pencarian atau reset filter bahasa, level, dan subbab.
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-xs font-mono font-medium text-text-primary cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Semua Filter</span>
                </button>
              </div>
            </>
          )}
        </section>
      )}
    </PageContainer>
  );
}
