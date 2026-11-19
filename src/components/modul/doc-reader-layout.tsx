"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Sun,
  Moon,
  ListFilter,
  Menu,
  X,
  Maximize2,
  Minimize2,
  Share2,
  LayoutGrid,
  Bot,
  BrainCircuit,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Target,
  Layers,
  FileCode2,
  Play,
  Eye,
  MoreHorizontal,
  Sparkles,
  Sliders,
  Check,
  Type,
} from "lucide-react";
import { useTheme } from "next-themes";
import { NoteRenderer } from "@/components/notes/note-renderer";
import { toast } from "sonner";
import { getTopicStatus } from "@/lib/curriculum/status";
import { extractTheoryAndCodeFromMarkdown } from "@/lib/curriculum/theory-extractor";
import type { CodeCatalogEntry } from "@/lib/curriculum/code-catalog";
import {
  NotebookUnitRenderer,
  NotebookLessonHeader,
  NotebookObjectives,
  NotebookSummary,
  NotebookSourceList,
  NotebookNavigation,
} from "./notebook";
import { ExerciseCard } from "./exercise-card";
import {
  notebookUnitsToMarkdown,
  type DocSectionItem,
} from "@/lib/curriculum/types";

export type { DocSectionItem };

interface DocReaderLayoutProps {
  categoryName: string;
  categoryId: string;
  themeColor?: string;
  categoryIcon?: string;
  sections: DocSectionItem[];
  activeSectionId?: string;
  onSelectSection?: (sectionId: string) => void;
  onToggleViewMode?: () => void;
  viewMode?: "doc" | "grid";
}

type ReadingMode = "intuition" | "theory" | "full-code";
type ReaderFontScale = "compact" | "standard" | "comfortable";
type SidebarFilter = "all" | "new2026" | "labs" | "incomplete";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface PhaseGroup {
  phaseId: string;
  phaseTitle: string;
  chapters: DocSectionItem[];
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s.-]/g, "")
    .replace(/[\s.]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractTocFromMarkdown(markdown: string): TocItem[] {
  if (!markdown) return [];
  const lines = markdown.split("\n");
  const items: TocItem[] = [];
  let inFence = false;

  for (const line of lines) {
    if (/^ {0,3}(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      let rawText = match[2].trim();
      rawText = rawText.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
      rawText = rawText.replace(/[*_`]/g, "");

      if (rawText.length > 0) {
        items.push({
          id: slugifyHeading(rawText),
          text: rawText,
          level,
        });
      }
    }
  }

  return items;
}

function flattenDocSections(sections: DocSectionItem[]): DocSectionItem[] {
  const flat: DocSectionItem[] = [];
  for (const sec of sections) {
    if (sec.content_markdown && sec.content_markdown.trim().length > 0 && (!sec.subsections || sec.subsections.length === 0)) {
      flat.push(sec);
    }
    if (sec.subsections && sec.subsections.length > 0) {
      for (const sub of sec.subsections) {
        flat.push({
          ...sub,
          parentTitle: sec.title,
          chapterNumber: sec.orderIndex,
          phaseId: sub.phaseId || sec.phaseId,
          phaseTitle: sub.phaseTitle || sec.phaseTitle,
          isNew2026: sub.isNew2026 ?? sec.isNew2026,
        });

        if (sub.subsections && sub.subsections.length > 0) {
          for (const unit of sub.subsections) {
            flat.push({
              ...unit,
              parentTitle: `${sec.title} > ${sub.title}`,
              chapterNumber: sec.orderIndex,
              phaseId: sec.phaseId,
              phaseTitle: sec.phaseTitle,
            });
          }
        }
      }
    } else if (!sec.content_markdown || sec.content_markdown.trim().length === 0) {
      flat.push(sec);
    }
  }
  return flat;
}

function estimateReadingMinutes(markdown: string, codeCount: number, explicit?: number): number {
  if (explicit && explicit > 0) return explicit;
  const prose = (markdown || "").replace(/```[\s\S]*?```/g, " ");
  const words = prose.split(/\s+/).filter(Boolean).length;
  const mins = Math.round(words / 185 + codeCount * 1.5);
  return Math.max(4, Math.min(45, mins || 10));
}

/**
 * Extracts a concise executive view for "Mode Intuisi":
 * Keeps :::tldr cards, :::interactive-lab sandboxes, Mermaid diagrams,
 * trade-off tables, and key pitfalls / engineering heuristics.
 */
function buildIntuitionMarkdown(cleanMarkdown: string, fallbackTldr?: string): string {
  if (!cleanMarkdown) return "";
  const parts: string[] = [];

  const tldrMatches = cleanMarkdown.match(/:::tldr[\s\S]*?:::/g);
  if (tldrMatches && tldrMatches.length > 0) {
    parts.push(...tldrMatches);
  } else if (fallbackTldr) {
    parts.push(`:::tldr [Intuisi & Mental Model]\n${fallbackTldr}\n:::`);
  }

  const labMatches = cleanMarkdown.match(/:::interactive-lab\s+\[[^\]]+\](?:\s*[^\n]*)?/g);
  if (labMatches && labMatches.length > 0) {
    parts.push(...labMatches);
  }

  const mermaidMatches = cleanMarkdown.match(/```mermaid[\s\S]*?```/g);
  if (mermaidMatches && mermaidMatches.length > 0) {
    parts.push("## Alur & Mental Model Visual\n\n" + mermaidMatches[0]);
  }

  // Extract selected high-signal H2 sections (Trade-off, Kapan Tidak, Jebakan Umum, Studi Kasus)
  const h2Sections = cleanMarkdown.split(/(?=^##\s+)/m);
  for (const block of h2Sections) {
    const headingLine = block.split("\n")[0] || "";
    if (
      /^##\s+.*(trade-?off|komparasi|kapan tidak|jebakan|pitfall|heuristik|ringkasan|studi kasus)/i.test(
        headingLine
      )
    ) {
      parts.push(block.trim());
    }
  }

  if (parts.length === 0) {
    // Graceful fallback for topics without v5 directives: show first ~45% theory
    const theoryOnly = extractTheoryAndCodeFromMarkdown(cleanMarkdown).theoryMarkdown;
    return theoryOnly || cleanMarkdown;
  }

  return parts.join("\n\n");
}

export function DocReaderLayout({
  categoryName,
  categoryId,
  themeColor = "#C2553A",
  categoryIcon: _categoryIcon = "machine_learning",
  sections,
  activeSectionId,
  onSelectSection,
  onToggleViewMode,
  viewMode: _viewMode = "doc",
}: DocReaderLayoutProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Normalize default accent to Warm Obsidian Terracotta when generic legacy blue is passed
  const accentColor =
    themeColor === "#0284C7" || !themeColor ? "#C2553A" : themeColor;

  const statusMeta = useMemo(
    () => getTopicStatus(categoryName || categoryId),
    [categoryName, categoryId]
  );
  const kodeTopicId = categoryId || categoryName;

  // ─── Reader 2.0 Adaptive States ───
  const [readingMode, setReadingMode] = useState<ReadingMode>("full-code");
  const [fontScale, setFontScale] = useState<ReaderFontScale>("standard");
  const [sidebarFilter, setSidebarFilter] = useState<SidebarFilter>("all");
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Sidebar & Outline Adaptive State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Search filter inside navigation
  const [searchQuery, setSearchQuery] = useState("");

  // ScrollSpy active heading ID
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");

  // Completion Progress Tracker (persisted per category in localStorage)
  const progressStorageKey = `velqora_reader_progress_v1:${categoryId || categoryName}`;
  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem(progressStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setCompletedIds(parsed);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, [progressStorageKey]);

  const toggleCompleted = useCallback(
    (sectionId: string, forceValue?: boolean) => {
      setCompletedIds((prev) => {
        const nextVal = forceValue !== undefined ? forceValue : !prev[sectionId];
        const next = { ...prev, [sectionId]: nextVal };
        if (!nextVal) delete next[sectionId];
        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(progressStorageKey, JSON.stringify(next));
          } catch {}
        }
        return next;
      });
    },
    [progressStorageKey]
  );

  const flatSections = useMemo(() => flattenDocSections(sections), [sections]);

  // Selected section ID
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (activeSectionId) return activeSectionId;
    return flatSections[0]?.id || sections[0]?.id || "";
  });

  // Track expanded phases
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});

  // Track expanded accordion chapters (Level 1)
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    sections.forEach((sec, idx) => {
      init[sec.id] = Boolean(
        idx === 0 ||
          sec.id === activeSectionId ||
          sec.subsections?.some(
            (sub) =>
              sub.id === activeSectionId ||
              sub.subsections?.some((u) => u.id === activeSectionId)
          )
      );
    });
    return init;
  });

  // Track expanded subchapters (Level 2 -> Level 3 units)
  const [expandedSubchapters, setExpandedSubchapters] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    sections.forEach((sec) => {
      sec.subsections?.forEach((sub) => {
        init[sub.id] = Boolean(
          sub.id === activeSectionId ||
            sub.subsections?.some((u) => u.id === activeSectionId)
        );
      });
    });
    return init;
  });

  const toggleSubchapter = (subchapterId: string) => {
    setExpandedSubchapters((prev) => ({
      ...prev,
      [subchapterId]: !prev[subchapterId],
    }));
  };

  const contentRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close overflow menu on outside click
  useEffect(() => {
    if (!moreMenuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [moreMenuOpen]);

  // Synchronize URL query parameter ?section=...
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const sectionFromUrl = urlParams.get("section");
      if (sectionFromUrl && sectionFromUrl !== selectedId) {
        setSelectedId(sectionFromUrl);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeSectionId && activeSectionId !== selectedId) {
      setSelectedId(activeSectionId);
    }
  }, [activeSectionId, selectedId]);

  // Expand parent phase, chapter & subchapter automatically
  useEffect(() => {
    for (const sec of sections) {
      const matches =
        sec.id === selectedId ||
        sec.subsections?.some(
          (sub) =>
            sub.id === selectedId ||
            sub.subsections?.some((u) => u.id === selectedId)
        );
      if (matches) {
        setExpandedChapters((prev) => ({ ...prev, [sec.id]: true }));
        if (sec.phaseId) {
          setExpandedPhases((prev) => ({ ...prev, [sec.phaseId!]: true }));
        }
        sec.subsections?.forEach((sub) => {
          if (sub.id === selectedId || sub.subsections?.some((u) => u.id === selectedId)) {
            setExpandedSubchapters((prev) => ({ ...prev, [sub.id]: true }));
          }
        });
        break;
      }
    }
  }, [selectedId, sections]);

  // Scroll to top on section change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    setActiveHeadingId("");
    setScrollProgress(0);
  }, [selectedId]);

  // Active section item
  const currentSection = useMemo(() => {
    return (
      flatSections.find((s) => s.id === selectedId || s.slug === selectedId) ||
      sections.find((s) => s.id === selectedId || s.slug === selectedId) ||
      flatSections[0] ||
      null
    );
  }, [flatSections, sections, selectedId]);

  // Parent chapter and parent subchapter for breadcrumbs
  const { parentChapter, parentSubchapter } = useMemo(() => {
    if (!currentSection) return { parentChapter: null, parentSubchapter: null };

    for (const sec of sections) {
      if (sec.id === currentSection.id) {
        return { parentChapter: sec, parentSubchapter: null };
      }
      if (sec.subsections) {
        for (const sub of sec.subsections) {
          if (sub.id === currentSection.id) {
            return { parentChapter: sec, parentSubchapter: sub };
          }
          if (sub.subsections?.some((u) => u.id === currentSection.id)) {
            return { parentChapter: sec, parentSubchapter: sub };
          }
        }
      }
    }
    return { parentChapter: null, parentSubchapter: null };
  }, [sections, currentSection]);

  const isChapter = useMemo(() => {
    if (!currentSection) return false;
    return sections.some((sec) => sec.id === currentSection.id);
  }, [sections, currentSection]);

  const { headerNumber, headerTitle } = useMemo(() => {
    if (!currentSection) return { headerNumber: undefined, headerTitle: "" };

    if (isChapter) {
      const cleanedChapterTitle = currentSection.title.replace(
        /^BAB\s+0*(\d+):/i,
        (_, num) => `Bab ${parseInt(num, 10)}:`
      );
      return {
        headerNumber: undefined,
        headerTitle: cleanedChapterTitle,
      };
    }

    let numStr: string | undefined = undefined;
    const titleMatch = currentSection.title.match(/^0*(\d+)\.(\d+)/);

    if (titleMatch) {
      const chNum = parseInt(titleMatch[1], 10);
      const subNum = parseInt(titleMatch[2], 10);
      numStr = `${chNum}.${subNum}`;
    } else if (currentSection.orderIndex) {
      const rawCh = currentSection.chapterNumber ?? parentChapter?.orderIndex ?? 1;
      const chNum =
        typeof rawCh === "number"
          ? rawCh
          : parseInt(String(rawCh).replace(/\D/g, "") || "1", 10);
      numStr = `${chNum}.${currentSection.orderIndex}`;
    }

    const cleanedSubTitle = currentSection.title
      .replace(/^0*\d+\.\d+[:\s.-]*/, "")
      .trim();

    return {
      headerNumber: numStr,
      headerTitle: cleanedSubTitle || currentSection.title,
    };
  }, [currentSection, isChapter, parentChapter]);

  const currentIndex = flatSections.findIndex((s) => s.id === currentSection?.id);
  const prevSection = currentIndex > 0 ? flatSections[currentIndex - 1] : null;
  const nextSection =
    currentIndex >= 0 && currentIndex < flatSections.length - 1
      ? flatSections[currentIndex + 1]
      : null;

  // Markdown content
  const currentMarkdown = useMemo(() => {
    if (!currentSection) return "";
    if (currentSection.content_markdown && currentSection.content_markdown.trim().length > 30) {
      return currentSection.content_markdown;
    }
    if (currentSection.units && currentSection.units.length > 0) {
      return notebookUnitsToMarkdown(currentSection.units);
    }

    let md = `# ${currentSection.title}\n\n`;
    if (currentSection.description) {
      md += `> ${currentSection.description}\n\n`;
    }
    if (currentSection.codeSnippets && currentSection.codeSnippets.length > 0) {
      md += `## Implementasi Praktikum Kode Python\n\n`;
      for (const snip of currentSection.codeSnippets) {
        if (snip.caption) md += `### ${snip.caption}\n\n`;
        md += "```" + (snip.language || "python") + "\n" + snip.code + "\n```\n\n";
      }
    }
    return md;
  }, [currentSection]);

  const cleanMarkdown = useMemo(() => {
    if (!currentMarkdown) return "";
    return currentMarkdown.replace(/^#\s+[^\n]+\n+/, "");
  }, [currentMarkdown]);

  const theoryExtraction = useMemo(() => {
    return extractTheoryAndCodeFromMarkdown(cleanMarkdown);
  }, [cleanMarkdown]);

  const displayMarkdown = useMemo(() => {
    if (readingMode === "intuition") {
      return buildIntuitionMarkdown(cleanMarkdown, currentSection?.tldrSummary || currentSection?.description);
    }
    if (readingMode === "theory") {
      return theoryExtraction.theoryMarkdown || cleanMarkdown;
    }
    return cleanMarkdown;
  }, [readingMode, cleanMarkdown, theoryExtraction, currentSection]);

  const dynamicMinutes = useMemo(
    () =>
      estimateReadingMinutes(
        cleanMarkdown,
        currentSection?.codeSnippets?.length || theoryExtraction.extractedCount,
        currentSection?.estimatedMinutes
      ),
    [cleanMarkdown, currentSection, theoryExtraction.extractedCount]
  );

  // Related code entries from Code Catalog API
  const [relatedCodeEntries, setRelatedCodeEntries] = useState<CodeCatalogEntry[]>([]);

  useEffect(() => {
    const topicQuery = kodeTopicId;
    if (!topicQuery || !currentSection) {
      setRelatedCodeEntries([]);
      return;
    }

    const controller = new AbortController();
    const candidateSubs = Array.from(
      new Set(
        [currentSection.id, currentSection.slug, parentSubchapter?.id].filter(
          (v): v is string => Boolean(v && v.trim())
        )
      )
    );

    async function loadRelatedCode() {
      for (const subId of candidateSubs) {
        try {
          const res = await fetch(
            `/api/kode?topic=${encodeURIComponent(topicQuery)}&sub=${encodeURIComponent(subId)}&limit=12`,
            { signal: controller.signal }
          );
          if (!res.ok) continue;
          const data = await res.json();
          if (Array.isArray(data?.entries) && data.entries.length > 0) {
            setRelatedCodeEntries(data.entries);
            return;
          }
        } catch (err) {
          if (err instanceof DOMException && err.name === "AbortError") return;
        }
      }
      setRelatedCodeEntries([]);
    }

    loadRelatedCode();
    return () => controller.abort();
  }, [kodeTopicId, currentSection, parentSubchapter?.id]);

  const kodeSubParam = parentSubchapter?.id || currentSection?.id || "";
  const kodeCatalogHref = useMemo(() => {
    const params = new URLSearchParams();
    if (kodeTopicId) params.set("topic", kodeTopicId);
    if (kodeSubParam && relatedCodeEntries.length > 0) {
      params.set("sub", kodeSubParam);
    }
    return `/dashboard/kode?${params.toString()}`;
  }, [kodeTopicId, kodeSubParam, relatedCodeEntries.length]);

  const filteredUnits = useMemo(() => {
    if (!currentSection?.units) return [];
    if (readingMode === "full-code") return currentSection.units;
    return currentSection.units.filter((u) => u.type !== "code" && u.type !== "output");
  }, [currentSection, readingMode]);

  const tocItems = useMemo(() => extractTocFromMarkdown(displayMarkdown), [displayMarkdown]);

  // ScrollSpy + Top Reading Progress Bar
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollable = container.scrollHeight - container.clientHeight;
      if (scrollable > 20) {
        setScrollProgress(Math.min(100, Math.max(0, (container.scrollTop / scrollable) * 100)));
      } else {
        setScrollProgress(0);
      }

      if (tocItems.length === 0) return;
      const headingElements = tocItems
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);

      if (headingElements.length === 0) return;
      const containerTop = container.getBoundingClientRect().top;
      let currentActive = headingElements[0].id;

      for (const el of headingElements) {
        const rect = el.getBoundingClientRect();
        if (rect.top - containerTop <= 110) {
          currentActive = el.id;
        } else {
          break;
        }
      }
      setActiveHeadingId(currentActive);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [tocItems]);

  const scrollToHeading = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el && contentRef.current) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveHeadingId(id);
    }
  }, []);

  const handleSelect = (sectionId: string) => {
    setSelectedId(sectionId);
    if (onSelectSection) onSelectSection(sectionId);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("section", sectionId);
      window.history.replaceState({}, "", url.toString());
    }
    setMobileDrawerOpen(false);
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  // Detect whether curriculum uses v5 phase metadata / 2026 tags / interactive labs
  const hasPhaseMetadata = useMemo(
    () => sections.some((s) => Boolean(s.phaseId && s.phaseTitle)),
    [sections]
  );
  const hasEnhancedFilters = useMemo(
    () =>
      sections.some(
        (s) =>
          s.isNew2026 ||
          s.subsections?.some((sub) => sub.isNew2026 || Boolean(sub.interactiveLabId))
      ),
    [sections]
  );

  // Filter sections by search query + sidebar filter chip
  const filteredSections = useMemo<DocSectionItem[]>(() => {
    const q = searchQuery.toLowerCase().trim();
    const result: DocSectionItem[] = [];

    for (const ch of sections) {
      const matchesChapterQuery =
        !q ||
        ch.title.toLowerCase().includes(q) ||
        (ch.description || "").toLowerCase().includes(q) ||
        (ch.phaseTitle || "").toLowerCase().includes(q);

      const matchingSubs: DocSectionItem[] = [];
      for (const sub of ch.subsections || []) {
        const matchesSubQuery =
          !q ||
          sub.title.toLowerCase().includes(q) ||
          (sub.description || "").toLowerCase().includes(q);

        const matchesChip =
          sidebarFilter === "all" ||
          (sidebarFilter === "new2026" && Boolean(sub.isNew2026 || ch.isNew2026)) ||
          (sidebarFilter === "labs" &&
            Boolean(
              sub.interactiveLabId ||
                (sub.content_markdown || "").includes(":::interactive-lab")
            )) ||
          (sidebarFilter === "incomplete" && !completedIds[sub.id]);

        const matchingUnits = (sub.subsections || []).filter(
          (u) =>
            !q ||
            u.title.toLowerCase().includes(q) ||
            (u.description || "").toLowerCase().includes(q)
        );

        if ((matchesSubQuery || matchingUnits.length > 0) && matchesChip) {
          matchingSubs.push({
            ...sub,
            subsections: matchingUnits.length > 0 ? matchingUnits : sub.subsections,
          });
        }
      }

      if (matchingSubs.length > 0) {
        result.push({ ...ch, subsections: matchingSubs });
      } else if (matchesChapterQuery && sidebarFilter === "all" && (!ch.subsections || ch.subsections.length === 0)) {
        result.push(ch);
      }
    }

    return result;
  }, [sections, searchQuery, sidebarFilter, completedIds]);

  // Group filtered chapters into Phases when phase metadata exists
  const phaseGroups = useMemo<PhaseGroup[]>(() => {
    if (!hasPhaseMetadata) return [];
    const map = new Map<string, PhaseGroup>();
    for (const ch of filteredSections) {
      const pid = ch.phaseId || "other";
      const ptitle = ch.phaseTitle || "Modul Kurikulum";
      if (!map.has(pid)) {
        map.set(pid, { phaseId: pid, phaseTitle: ptitle, chapters: [] });
      }
      map.get(pid)!.chapters.push(ch);
    }
    return Array.from(map.values());
  }, [filteredSections, hasPhaseMetadata]);

  // Completion counters
  const totalTrackable = flatSections.length;
  const completedCount = useMemo(
    () => flatSections.filter((s) => Boolean(completedIds[s.id])).length,
    [flatSections, completedIds]
  );
  const overallPercent = totalTrackable > 0 ? Math.round((completedCount / totalTrackable) * 100) : 0;
  const isCurrentCompleted = currentSection ? Boolean(completedIds[currentSection.id]) : false;

  const playgroundTargetHref = currentSection
    ? `/dashboard/playground?topic=${encodeURIComponent(categoryId)}&sub=${encodeURIComponent(
        currentSection.id
      )}`
    : relatedCodeEntries[0]?.playgroundHref || "/dashboard/playground";

  const canvasWidthClass =
    fontScale === "compact"
      ? "max-w-[740px] text-[14px]"
      : fontScale === "comfortable"
      ? "max-w-[840px] text-[16.5px]"
      : "max-w-[790px] text-[15px]";

  const renderChapterItem = (chapter: DocSectionItem) => {
    const hasSubsections = chapter.subsections && chapter.subsections.length > 0;
    const isExpanded = expandedChapters[chapter.id] ?? false;
    const isChapterActive = chapter.id === selectedId;
    const chCompleted = hasSubsections
      ? chapter.subsections!.filter((s) => completedIds[s.id]).length
      : completedIds[chapter.id]
      ? 1
      : 0;
    const chTotal = hasSubsections ? chapter.subsections!.length : 1;

    return (
      <div key={chapter.id} className="space-y-0.5">
        <div
          className={`flex items-center justify-between px-2.5 py-2 rounded-lg font-sans transition-colors group cursor-pointer ${
            isChapterActive
              ? "bg-surface text-[#C2553A] dark:text-[#E5C194] font-semibold border border-[#D4664A]/30"
              : "text-text-primary hover:bg-surface-secondary/70 font-medium border border-transparent"
          }`}
          onClick={() => {
            if (hasSubsections) {
              toggleChapter(chapter.id);
              if (!isExpanded && chapter.subsections![0]) {
                handleSelect(chapter.subsections![0].id);
              }
            } else {
              handleSelect(chapter.id);
            }
          }}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs leading-snug truncate">{chapter.title}</span>
            {chapter.isNew2026 && (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#E5C194]/15 text-amber-800 dark:text-[#E5C194] border border-[#E5C194]/30 shrink-0">
                2026
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-1">
            {chCompleted > 0 && (
              <span className="text-[10px] font-mono tabular-nums text-emerald-700 dark:text-[#34D399]">
                {chCompleted}/{chTotal}
              </span>
            )}
            {hasSubsections && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleChapter(chapter.id);
                }}
                className="p-0.5 text-text-tertiary hover:text-text-primary cursor-pointer"
                aria-label="Perluas atau ciutkan bab"
              >
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isExpanded ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Subchapters & Level 3 Units */}
        {hasSubsections && isExpanded && (
          <div className="pl-2.5 ml-2 border-l border-border space-y-0.5 my-1">
            {chapter.subsections!.map((sub) => {
              const isSubActive = sub.id === selectedId;
              const isDone = Boolean(completedIds[sub.id]);
              const hasUnits = Boolean(sub.subsections && sub.subsections.length > 0);
              const isSubExpanded = expandedSubchapters[sub.id] ?? false;
              const hasLab = Boolean(
                sub.interactiveLabId ||
                  (sub.content_markdown || "").includes(":::interactive-lab")
              );

              return (
                <div key={sub.id} className="space-y-0.5">
                  <div
                    onClick={() => {
                      if (sub.id.includes("#")) {
                        const [parentId, anchor] = sub.id.split("#");
                        handleSelect(parentId);
                        setTimeout(() => scrollToHeading(anchor), 120);
                      } else {
                        handleSelect(sub.id);
                      }
                      if (hasUnits && !isSubExpanded) toggleSubchapter(sub.id);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11.5px] font-sans transition-all flex items-start justify-between gap-1.5 cursor-pointer ${
                      isSubActive
                        ? "bg-[#C2553A]/12 text-[#C2553A] dark:text-[#E5C194] font-semibold border border-[#D4664A]/30"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary/60 border border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-1.5 min-w-0">
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399] shrink-0 mt-0.5" />
                      ) : (
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${
                            isSubActive ? "bg-[#D4664A]" : "bg-text-tertiary/40"
                          }`}
                        />
                      )}
                      <span className="leading-snug line-clamp-2">{sub.title}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      {hasLab && (
                        <span title="Tersedia Lab Interaktif">
                          <Sliders className="w-3 h-3 text-[#D4664A]/80" />
                        </span>
                      )}
                      {hasUnits && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSubchapter(sub.id);
                          }}
                          className="p-0.5 text-text-tertiary hover:text-text-primary rounded transition-colors cursor-pointer"
                          aria-label="Perluas atau ciutkan unit materi"
                        >
                          <ChevronDown
                            className={`w-3 h-3 transition-transform duration-200 ${
                              isSubExpanded ? "rotate-0" : "-rotate-90"
                            }`}
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Level 3: Units */}
                  {hasUnits && isSubExpanded && (
                    <div className="pl-2.5 ml-2 border-l border-border/70 space-y-0.5 my-0.5">
                      {sub.subsections!.map((unit, uIdx) => {
                        const isUnitActive = unit.id === selectedId;
                        return (
                          <button
                            key={unit.id || uIdx}
                            type="button"
                            onClick={() => handleSelect(unit.id)}
                            className={`w-full text-left px-2 py-1 rounded-md text-[10.5px] font-sans transition-all flex items-center gap-1.5 cursor-pointer ${
                              isUnitActive
                                ? "bg-[#C2553A]/12 text-[#C2553A] dark:text-[#E5C194] font-semibold"
                                : "text-text-tertiary hover:text-text-primary hover:bg-surface-secondary/50"
                            }`}
                          >
                            <span
                              className={`w-1 h-1 rounded-full shrink-0 ${
                                isUnitActive ? "bg-[#D4664A]" : "bg-text-tertiary/40"
                              }`}
                            />
                            <span className="truncate leading-tight">{unit.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col bg-background overflow-hidden transition-all duration-300 font-sans w-full h-dvh ${
        isFullscreen ? "fixed inset-0 z-50 shadow-2xl" : "flex-1"
      }`}
    >
      {/* ─── 1. EDITORIAL 3-ZONE TOOLBAR (WARM OBSIDIAN × WARM PAPER) ─── */}
      <header className="relative flex items-center justify-between px-3 sm:px-5 py-2 border-b border-border bg-background/90 backdrop-blur-md select-none shrink-0 gap-2 sm:gap-3 z-30">
        {/* Left Zone: Drawer/Sidebar Toggle + Back + Identity */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="md:hidden min-h-[40px] min-w-[40px] p-2 rounded-xl border border-border bg-surface text-text-secondary hover:text-text-primary transition-colors cursor-pointer flex items-center justify-center shrink-0"
            aria-label="Buka navigasi materi"
          >
            <Menu className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex items-center gap-1.5 min-h-[36px] px-2.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-xs font-sans font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer shrink-0"
            title={sidebarOpen ? "Sembunyikan daftar bab" : "Buka daftar bab"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
            ) : (
              <PanelLeftOpen className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
            )}
            <span className="hidden xl:inline">{sidebarOpen ? "Tutup" : "Bab"}</span>
          </button>

          <Link
            href="/dashboard/modul"
            className="min-h-[40px] min-w-[40px] sm:min-h-[36px] sm:min-w-[36px] p-1.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors shrink-0 flex items-center justify-center"
            title="Kembali ke Katalog Modul"
            aria-label="Kembali ke Katalog Modul"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[#FFFBF8] shrink-0 border border-[#D4664A]/40"
              style={{ backgroundColor: accentColor }}
            >
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-semibold font-display text-text-primary tracking-tight truncate">
                {categoryName}
              </span>
              <span className="text-[10.5px] font-mono text-text-tertiary hidden lg:inline truncate">
                {completedCount}/{totalTrackable} selesai • {overallPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Center Zone: Segmented Reading Depth Switcher */}
        <div
          role="tablist"
          aria-label="Mode Kedalaman Bacaan"
          className="hidden md:flex items-center p-0.5 rounded-xl border border-border bg-surface-secondary/80 shrink-0"
        >
          {(
            [
              { id: "intuition", label: "Intuisi", title: "Ringkas: TL;DR, Lab Interaktif, Diagram & Pitfalls" },
              { id: "theory", label: "Fokus Teori", title: "Teori, Rumus & Studi Kasus tanpa blok kode panjang" },
              { id: "full-code", label: "Teori + Kode", title: "Lengkap: Teori + Multi-Code Tabs + Bug Diff" },
            ] as const
          ).map((mode) => {
            const active = readingMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setReadingMode(mode.id)}
                title={mode.title}
                className={`px-2.5 lg:px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer ${
                  active
                    ? "bg-surface text-[#C2553A] dark:text-[#E5C194] font-semibold border border-[#D4664A]/30 shadow-2xs"
                    : "text-text-secondary hover:text-text-primary border border-transparent"
                }`}
              >
                {mode.label}
              </button>
            );
          })}
        </div>

        {/* Right Zone: 1 Primary CTA + Outline Toggle + Clean Overflow Menu */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href={playgroundTargetHref}
            className="min-h-[38px] sm:min-h-[36px] px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#C2553A] hover:bg-[#B34B32] text-[#FFFBF8] border border-[#D4664A]/40 text-xs font-sans font-semibold transition-colors inline-flex items-center gap-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
            title="Buka subbab ini langsung di Velqora Lab Notebook (Pyodide)"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lab Notebook</span>
          </Link>

          <button
            type="button"
            onClick={() => setOutlineOpen(!outlineOpen)}
            className={`hidden sm:flex items-center gap-1.5 min-h-[36px] px-2.5 py-1.5 rounded-lg border text-xs font-sans font-medium transition-colors cursor-pointer ${
              outlineOpen
                ? "bg-[#C2553A]/12 text-[#C2553A] dark:text-[#E5C194] border-[#D4664A]/35"
                : "border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
            }`}
            title="Buka / tutup panel daftar isi halaman"
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Outline</span>
            {tocItems.length > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-surface-secondary text-text-tertiary">
                {tocItems.length}
              </span>
            )}
          </button>

          {/* Overflow Utility Menu (AI Tutor, Kuis, Katalog Kode, Font, Share, Theme, Fullscreen) */}
          <div className="relative" ref={moreMenuRef}>
            <button
              type="button"
              onClick={() => setMoreMenuOpen((prev) => !prev)}
              className="min-h-[38px] min-w-[38px] sm:min-h-[36px] sm:min-w-[36px] p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Opsi bacaan dan alat bantu lainnya"
              title="Alat bantu & preferensi bacaan"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {moreMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-surface shadow-xl p-2 z-50 space-y-1 text-xs">
                {/* Mobile Reading Mode Switcher inside menu */}
                <div className="md:hidden px-2 py-1.5 border-b border-border mb-1">
                  <div className="text-[10px] font-mono uppercase text-text-tertiary mb-1.5">
                    Mode Bacaan
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {(
                      [
                        { id: "intuition", label: "Intuisi" },
                        { id: "theory", label: "Teori" },
                        { id: "full-code", label: "+ Kode" },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setReadingMode(m.id);
                          setMoreMenuOpen(false);
                        }}
                        className={`py-1 rounded-md text-[11px] font-medium border cursor-pointer ${
                          readingMode === m.id
                            ? "bg-[#C2553A]/15 text-[#C2553A] dark:text-[#E5C194] border-[#D4664A]/35 font-semibold"
                            : "bg-surface-secondary text-text-secondary border-border"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size Preference */}
                <div className="px-2 py-1.5 border-b border-border">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-text-tertiary mb-1.5">
                    <Type className="w-3 h-3" />
                    <span>Ukuran & Lebar Teks</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {(
                      [
                        { id: "compact", label: "Kompak" },
                        { id: "standard", label: "Standar" },
                        { id: "comfortable", label: "Nyaman" },
                      ] as const
                    ).map((fs) => (
                      <button
                        key={fs.id}
                        type="button"
                        onClick={() => setFontScale(fs.id)}
                        className={`py-1 rounded-md text-[11px] font-medium border cursor-pointer ${
                          fontScale === fs.id
                            ? "bg-[#C2553A]/15 text-[#C2553A] dark:text-[#E5C194] border-[#D4664A]/35 font-semibold"
                            : "bg-surface-secondary text-text-secondary border-border"
                        }`}
                      >
                        {fs.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contextual Learning Links */}
                {currentSection && (
                  <>
                    <Link
                      href={`/dashboard/ai-tutor?prompt=${encodeURIComponent(
                        `Halo AI Tutor, saya sedang mempelajari "${currentSection.title}" pada kurikulum ${categoryName}. Bisakah Anda menjelaskan intuisi intinya, penurunan matematisnya, dan studi kasus produksinya?`
                      )}`}
                      onClick={() => setMoreMenuOpen(false)}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
                    >
                      <Bot className="w-4 h-4 text-[#D4664A]" />
                      <span>Tanya AI Tutor</span>
                    </Link>

                    <Link
                      href={`/dashboard/kuis-ai?topic=${encodeURIComponent(
                        `${categoryName} - ${currentSection.title}`
                      )}`}
                      onClick={() => setMoreMenuOpen(false)}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
                    >
                      <BrainCircuit className="w-4 h-4 text-[#E5B567]" />
                      <span>Kuis Pemahaman AI</span>
                    </Link>
                  </>
                )}

                <Link
                  href={kodeCatalogHref}
                  onClick={() => setMoreMenuOpen(false)}
                  className="flex items-center justify-between px-2.5 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <FileCode2 className="w-4 h-4 text-[#34D399]" />
                    <span>Katalog Kode Subbab</span>
                  </span>
                  {relatedCodeEntries.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-surface-secondary text-text-primary">
                      {relatedCodeEntries.length}
                    </span>
                  )}
                </Link>

                <div className="h-px bg-border my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setTheme(resolvedTheme === "dark" ? "light" : "dark");
                    setMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
                >
                  {mounted && resolvedTheme === "dark" ? (
                    <>
                      <Sun className="w-4 h-4 text-[#E5B567]" />
                      <span>Mode Terang (Warm Paper)</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-text-secondary" />
                      <span>Mode Gelap (Warm Obsidian)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Tautan materi berhasil disalin.");
                    }
                    setMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Salin Tautan Materi</span>
                </button>

                {onToggleViewMode && (
                  <button
                    type="button"
                    onClick={() => {
                      onToggleViewMode();
                      setMoreMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span>Ganti ke Tampilan Kartu Grid</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsFullscreen(!isFullscreen);
                    setMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
                >
                  {isFullscreen ? (
                    <>
                      <Minimize2 className="w-4 h-4 text-[#D4664A]" />
                      <span>Keluar Layar Penuh</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-4 h-4" />
                      <span>Mode Layar Penuh</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2px Terracotta Reading Progress Bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="h-full bg-[#D4664A] transition-[width] duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </header>

      {/* ─── 2. ADAPTIVE MAIN WORKSPACE CANVAS ─── */}
      <div className="flex flex-1 min-h-0 relative overflow-hidden bg-background">
        {mobileDrawerOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-xs md:hidden"
            onClick={() => setMobileDrawerOpen(false)}
          />
        )}

        {/* ─── LEFT NAVIGATION SIDEBAR (PHASE-GROUPED + PROGRESS TRACKER) ─── */}
        <aside
          className={`flex flex-col border-r border-border bg-sidebar transition-all duration-200 select-none shrink-0 z-40 md:z-10 ${
            mobileDrawerOpen
              ? "fixed inset-y-0 left-0 w-80 max-w-[88vw] shadow-2xl flex"
              : "hidden md:flex"
          } ${
            sidebarOpen
              ? "md:w-72 lg:w-80 md:translate-x-0 md:opacity-100"
              : "md:w-0 md:-translate-x-full md:opacity-0 md:pointer-events-none md:border-r-0"
          }`}
        >
          {/* Mobile Drawer Header */}
          <div className="p-3 border-b border-border flex items-center justify-between md:hidden">
            <span className="font-bold text-xs font-display text-text-primary">
              Silabus & Progres Belajar
            </span>
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Summary Bar + Search + Quick Filters */}
          <div className="p-3 border-b border-border space-y-2.5">
            {/* Overall Progress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-text-tertiary">Progres Kurikulum</span>
                <span className="font-semibold text-[#C2553A] dark:text-[#E5C194] tabular-nums">
                  {completedCount}/{totalTrackable} ({overallPercent}%)
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-surface-tertiary overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#C2553A] dark:bg-[#D4664A] transition-all duration-300"
                  style={{ width: `${overallPercent}%` }}
                />
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-text-tertiary pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari bab, algoritma, konsep..."
                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#D4664A] focus:ring-1 focus:ring-[#D4664A]/30 font-sans"
              />
            </div>

            {/* Quick Filter Pills */}
            {hasEnhancedFilters && (
              <div className="flex flex-wrap gap-1">
                {(
                  [
                    { id: "all", label: "Semua" },
                    { id: "new2026", label: "2026" },
                    { id: "labs", label: "Ada Lab" },
                    { id: "incomplete", label: "Belum" },
                  ] as const
                ).map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setSidebarFilter(chip.id)}
                    className={`px-2 py-0.5 rounded-md text-[10.5px] font-mono transition-colors cursor-pointer border ${
                      sidebarFilter === chip.id
                        ? "bg-[#C2553A]/15 text-[#C2553A] dark:text-[#E5C194] border-[#D4664A]/35 font-semibold"
                        : "bg-surface text-text-tertiary hover:text-text-primary border-border"
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tree Navigation (Phase-Grouped if metadata present, else flat chapter tree) */}
          <nav className="flex-1 overflow-y-auto p-2.5 space-y-2 scrollbar-thin text-xs">
            {hasPhaseMetadata && phaseGroups.length > 0 ? (
              phaseGroups.map((group, gIdx) => {
                const isPhaseOpen = expandedPhases[group.phaseId] ?? (gIdx === 0 || Boolean(searchQuery) || sidebarFilter !== "all");
                const phaseSubs = group.chapters.flatMap((c) => c.subsections || [c]);
                const phaseDone = phaseSubs.filter((s) => completedIds[s.id]).length;

                return (
                  <div key={group.phaseId} className="space-y-1">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedPhases((prev) => ({
                          ...prev,
                          [group.phaseId]: !isPhaseOpen,
                        }))
                      }
                      className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-surface-secondary/60 transition-colors cursor-pointer"
                    >
                      <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-text-tertiary truncate">
                        {group.phaseTitle}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-mono text-text-tertiary tabular-nums">
                          {phaseDone}/{phaseSubs.length}
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-text-tertiary transition-transform duration-200 ${
                            isPhaseOpen ? "rotate-0" : "-rotate-90"
                          }`}
                        />
                      </div>
                    </button>

                    {isPhaseOpen && (
                      <div className="space-y-1 pl-0.5">
                        {group.chapters.map((ch) => renderChapterItem(ch))}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              filteredSections.map((chapter) => renderChapterItem(chapter))
            )}

            {filteredSections.length === 0 && (
              <div className="p-6 text-center text-xs text-text-tertiary space-y-1">
                <p>Tidak ada materi yang cocok dengan filter.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSidebarFilter("all");
                  }}
                  className="text-[#C2553A] dark:text-[#D4664A] hover:underline font-medium cursor-pointer"
                >
                  Reset filter
                </button>
              </div>
            )}
          </nav>

          {/* Sidebar Footer */}
          <div className="px-3 py-2.5 border-t border-border bg-surface/40 flex items-center justify-between text-[10.5px] font-mono text-text-tertiary">
            <span className="truncate">{sections.length} Bab • {totalTrackable} Materi</span>
            <span className="font-semibold text-[#C2553A] dark:text-[#E5C194]">Velqora</span>
          </div>
        </aside>

        {/* ─── CENTER EDITORIAL READING CANVAS ─── */}
        <main
          ref={contentRef}
          className="flex-1 overflow-y-auto w-full max-w-full min-w-0 overflow-x-hidden scrollbar-thin px-4 sm:px-7 md:px-10 lg:px-12 py-5 sm:py-8"
        >
          <div className={`mx-auto w-full ${canvasWidthClass} space-y-8 min-w-0 overflow-x-hidden`}>
            {/* Breadcrumb Navigation */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs font-sans text-text-tertiary pb-3 border-b border-border overflow-hidden flex-nowrap min-w-0"
            >
              <Link href="/dashboard/modul" className="hover:text-text-primary transition-colors shrink-0">
                Modul
              </Link>
              <span className="opacity-40 shrink-0">/</span>
              <span className="font-medium text-[#C2553A] dark:text-[#D4664A] shrink-0 truncate max-w-[120px] sm:max-w-none">
                {categoryName}
              </span>
              {parentChapter && parentChapter.id !== currentSection?.id && (
                <>
                  <span className="opacity-40 shrink-0">/</span>
                  <button
                    type="button"
                    onClick={() => handleSelect(parentChapter.subsections?.[0]?.id || parentChapter.id)}
                    className="hover:text-text-primary transition-colors truncate max-w-[120px] sm:max-w-[200px] cursor-pointer shrink-0"
                  >
                    {parentChapter.title.startsWith("BAB ") || parentChapter.title.startsWith("Bab ")
                      ? parentChapter.title.split(":")[0]
                      : `Bab ${parentChapter.orderIndex || 1}`}
                  </button>
                </>
              )}
              {currentSection && (
                <>
                  <span className="opacity-40 shrink-0">/</span>
                  <span className="font-semibold text-text-primary truncate min-w-0">
                    {isChapter
                      ? headerTitle
                      : headerNumber
                      ? `${headerNumber} ${headerTitle}`
                      : currentSection.title}
                  </span>
                </>
              )}
            </nav>

            {/* Current Section / Lesson Article */}
            {currentSection ? (
              <article className="space-y-8">
                {/* Parent Subchapter Back-Link Banner */}
                {parentSubchapter && currentSection.id !== parentSubchapter.id && (
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-surface-secondary/70 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <Layers className="w-4 h-4 shrink-0 text-[#D4664A]" />
                      <span className="text-text-secondary truncate">
                        Unit dari Subbab: <strong className="text-text-primary">{parentSubchapter.title}</strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelect(parentSubchapter.id)}
                      className="inline-flex items-center gap-1 font-semibold text-[#C2553A] dark:text-[#D4664A] hover:underline cursor-pointer text-xs"
                    >
                      <span>Lihat Subbab Penuh</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* 1. Lesson Header */}
                <div className="space-y-2.5">
                  <NotebookLessonHeader
                    number={headerNumber}
                    title={headerTitle}
                    subtitle={currentSection.parentTitle}
                    description={currentSection.description}
                    flow={
                      currentSection.flow ||
                      (currentSection.codeSnippets?.length || currentSection.units?.some((u) => u.type === "code")
                        ? "mixed"
                        : "conceptual")
                    }
                    estimatedMinutes={dynamicMinutes}
                    categoryName={categoryName}
                    chapterTitle={parentChapter?.title}
                    phaseTitle={currentSection.phaseTitle || parentChapter?.phaseTitle}
                    isNew2026={Boolean(currentSection.isNew2026 || parentChapter?.isNew2026)}
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                    {statusMeta.status === "verified" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-mono font-medium rounded-full bg-[#34D399]/10 text-emerald-700 dark:text-[#34D399] border border-[#34D399]/28">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Kurikulum Terverifikasi</span>
                      </span>
                    )}

                    {readingMode === "intuition" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-mono rounded-full bg-[#C2553A]/10 text-[#C2553A] dark:text-[#E5C194] border border-[#D4664A]/30">
                        <Sparkles className="w-3 h-3" />
                        <span>Mode Intuisi Cepat — klik &ldquo;Teori + Kode&rdquo; untuk materi penuh</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Notices for Under Review / In Development Topics */}
                {statusMeta.status === "under_review" && (
                  <div className="p-3.5 rounded-2xl border border-[#E5B567]/30 bg-[#E5B567]/8 text-xs flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-[#E5B567] mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-mono font-semibold text-[11px] text-amber-800 dark:text-[#E5B567]">
                        {statusMeta.badgeLabel}
                      </span>
                      <p className="text-text-secondary leading-relaxed">
                        Materi topik ini sedang diperbarui bertahap ke standar v5. Anda tetap dapat mempelajari draf saat ini.
                      </p>
                    </div>
                  </div>
                )}

                {statusMeta.status === "in_development" && (
                  <div className="p-3.5 rounded-2xl border border-border bg-surface-secondary/60 text-xs flex items-start gap-3">
                    <Clock className="w-4 h-4 shrink-0 text-[#D4664A] mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-mono font-semibold text-[11px] text-text-primary">
                        {statusMeta.badgeLabel}
                      </span>
                      <p className="text-text-secondary leading-relaxed">
                        Silabus topik ini sedang disusun bertahap dan dapat dipelajari sebagian.
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. Learning Objectives */}
                {readingMode !== "intuition" &&
                  currentSection.learningObjectives &&
                  currentSection.learningObjectives.length > 0 && (
                    <NotebookObjectives objectives={currentSection.learningObjectives} />
                  )}

                {/* 3. Main Lesson Units / Markdown Content */}
                {filteredUnits.length > 0 ? (
                  <NotebookUnitRenderer units={filteredUnits} />
                ) : (
                  <div className="py-1 prose dark:prose-invert max-w-none">
                    <NoteRenderer content={displayMarkdown} />
                  </div>
                )}

                {/* 4. Level 3 Units (Linear Flow) */}
                {currentSection.subsections && currentSection.subsections.length > 0 && (
                  <div className="space-y-10 pt-8 border-t border-border">
                    {currentSection.subsections.map((unit, uIdx) => {
                      const rawUnitMd = unit.content_markdown
                        ? unit.content_markdown.replace(/^#\s+[^\n]+\n+/, "")
                        : "";
                      const unitDisplayMd =
                        readingMode === "theory" && rawUnitMd
                          ? extractTheoryAndCodeFromMarkdown(rawUnitMd).theoryMarkdown
                          : rawUnitMd;

                      return (
                        <section
                          key={unit.id || uIdx}
                          id={`unit-${unit.id}`}
                          className="space-y-4 pt-6 first:pt-0"
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold text-[#FFFBF8] shrink-0"
                              style={{ backgroundColor: accentColor }}
                            >
                              Unit {uIdx + 1}
                            </span>
                            <h3 className="text-lg sm:text-xl font-semibold text-text-primary font-display tracking-tight">
                              {unit.title}
                            </h3>
                          </div>

                          {unit.description && (
                            <p className="text-sm text-text-secondary leading-relaxed">
                              {unit.description}
                            </p>
                          )}

                          {unitDisplayMd && (
                            <div className="py-1 prose dark:prose-invert max-w-none">
                              <NoteRenderer content={unitDisplayMd} />
                            </div>
                          )}

                          {readingMode === "full-code" &&
                            unit.codeSnippets &&
                            unit.codeSnippets.length > 0 && (
                              <div className="space-y-3 pt-2">
                                <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary block font-semibold">
                                  Praktikum Kode Unit:
                                </span>
                                {unit.codeSnippets.map((snip, sIdx) => (
                                  <div
                                    key={snip.id || sIdx}
                                    className="rounded-xl overflow-hidden border border-[#292524] bg-[#141210] text-[#F5F5F4] p-3.5 font-mono text-xs overflow-x-auto whitespace-pre"
                                  >
                                    <code>{snip.code}</code>
                                  </div>
                                ))}
                              </div>
                            )}
                        </section>
                      );
                    })}
                  </div>
                )}

                {/* 5. Bridge Card: Lab Kode & Ruang Praktik */}
                {(relatedCodeEntries.length > 0 ||
                  theoryExtraction.hasExtractedCode ||
                  (currentSection.codeSnippets?.length ?? 0) > 0) && (
                  <section
                    aria-label="Lab Kode Terkait"
                    className="rounded-2xl border border-border bg-surface-secondary/60 dark:bg-[#141210] p-4 sm:p-5 space-y-4 shadow-[inset_0_1px_0_rgba(255,248,240,0.04)]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#C2553A]/12 text-[#C2553A] dark:text-[#D4664A] border border-[#D4664A]/28">
                            <FileCode2 className="w-4 h-4" />
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-text-primary font-display">
                            Lab Kode &amp; Ruang Praktik Subbab Ini
                          </h3>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          Eksekusi seluruh implementasi Python secara langsung di browser (Pyodide WebAssembly) atau telusuri skrip terverifikasi di{" "}
                          <span className="font-semibold text-text-primary">Katalog Kode</span>.
                        </p>
                      </div>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-border bg-surface text-[11px] font-mono font-semibold text-text-secondary shrink-0 self-start">
                        {relatedCodeEntries.length > 0
                          ? `${relatedCodeEntries.length} Skrip Tersedia`
                          : `${Math.max(
                              theoryExtraction.extractedCount,
                              currentSection.codeSnippets?.length ?? 1
                            )} Blok Kode`}
                      </span>
                    </div>

                    {relatedCodeEntries.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {relatedCodeEntries.slice(0, 4).map((entry) => (
                          <Link
                            key={entry.id}
                            href={entry.playgroundHref}
                            className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border bg-surface hover:border-[#D4664A]/40 hover:bg-surface-secondary text-xs font-mono transition-colors group"
                            title={`Jalankan ${entry.title} di Lab Notebook`}
                          >
                            <span className="uppercase text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#C2553A]/12 text-[#C2553A] dark:text-[#E5C194]">
                              {entry.language}
                            </span>
                            <span className="text-text-primary group-hover:text-[#C2553A] dark:group-hover:text-[#D4664A] truncate max-w-[220px]">
                              {entry.filename}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      <Link
                        href={playgroundTargetHref}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#C2553A] hover:bg-[#B34B32] text-[#FFFBF8] border border-[#D4664A]/40 text-xs font-mono font-semibold transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Jalankan di Lab Notebook</span>
                      </Link>

                      <Link
                        href={kodeCatalogHref}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-xs font-mono font-medium text-text-primary transition-colors"
                      >
                        <FileCode2 className="w-3.5 h-3.5 text-[#D4664A]" />
                        <span>Buka Katalog Kode</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          setReadingMode((prev) =>
                            prev === "full-code" ? "theory" : "full-code"
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-surface/60 hover:bg-surface text-xs font-mono text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>
                          {readingMode === "full-code"
                            ? "Sembunyikan Kode Inline"
                            : "Tampilkan Kode Inline"}
                        </span>
                      </button>
                    </div>
                  </section>
                )}

                {/* 6. Tiered Exercises */}
                {currentSection.exercises && currentSection.exercises.length > 0 && (
                  <section className="space-y-4 pt-6 border-t border-border">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-bold text-text-primary font-display flex items-center gap-2">
                          <Target className="w-5 h-5 text-[#C2553A] dark:text-[#D4664A]" />
                          <span>Latihan Terstruktur &amp; Tantangan Rekayasa</span>
                        </h3>
                        <p className="text-xs text-text-secondary">
                          Tantangan bertingkat dari pemahaman konseptual, implementasi Pyodide, hingga debugging edge-case dengan verifikasi test case.
                        </p>
                      </div>
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-[#C2553A]/12 text-[#C2553A] dark:text-[#E5C194] border border-[#D4664A]/30">
                        {currentSection.exercises.length} Tantangan
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {currentSection.exercises.map((exercise, exIdx) => (
                        <ExerciseCard
                          key={exercise.id || exIdx}
                          exercise={exercise}
                          index={exIdx}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* 7. Key Takeaways / Summary */}
                {currentSection.summary && (
                  <NotebookSummary summary={currentSection.summary} />
                )}

                {/* 8. Academic Sources / Citations */}
                {currentSection.lesson?.furtherReading &&
                  currentSection.lesson.furtherReading.length > 0 && (
                    <NotebookSourceList sources={currentSection.lesson.furtherReading} />
                  )}

                {/* 9. Mark Completed Action Bar */}
                <div className="pt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface-secondary/50 p-4">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        toggleCompleted(currentSection.id);
                        toast.success(
                          isCurrentCompleted
                            ? "Status selesai dibatalkan."
                            : "Subbab ditandai selesai!"
                        );
                      }}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isCurrentCompleted
                          ? "bg-[#34D399]/15 text-emerald-700 dark:text-[#34D399] border-[#34D399]/35"
                          : "bg-surface hover:bg-surface-secondary text-text-primary border-border"
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>
                        {isCurrentCompleted ? "Subbab Selesai" : "Tandai Subbab Selesai"}
                      </span>
                    </button>
                    <span className="text-xs font-mono text-text-tertiary hidden sm:inline">
                      Progres: {completedCount}/{totalTrackable} ({overallPercent}%)
                    </span>
                  </div>

                  {nextSection && (
                    <button
                      type="button"
                      onClick={() => {
                        if (!isCurrentCompleted) toggleCompleted(currentSection.id, true);
                        handleSelect(nextSection.id);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C2553A] hover:bg-[#B34B32] text-[#FFFBF8] border border-[#D4664A]/40 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <span>Selesai &amp; Lanjut</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* 10. Previous / Next Lesson Navigation */}
                <NotebookNavigation
                  prev={prevSection ? { id: prevSection.id, title: prevSection.title } : null}
                  next={nextSection ? { id: nextSection.id, title: nextSection.title } : null}
                  onSelect={handleSelect}
                />
              </article>
            ) : (
              <div className="py-20 text-center text-text-tertiary font-mono space-y-2">
                <BookOpen className="w-8 h-8 mx-auto opacity-40" />
                <p className="text-sm">Silakan pilih bab di panel navigasi materi.</p>
              </div>
            )}
          </div>
        </main>

        {/* ─── RIGHT OUTLINE SIDEBAR ─── */}
        {outlineOpen && (
          <>
            <aside className="hidden xl:flex flex-col border-l border-border bg-sidebar transition-all duration-200 shrink-0 w-64 z-20">
              <div className="p-3.5 border-b border-border flex items-center justify-between">
                <h4 className="text-xs font-bold font-sans text-text-primary flex items-center gap-1.5">
                  <ListFilter className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
                  <span>Daftar Isi Halaman</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setOutlineOpen(false)}
                  className="p-1 rounded text-text-tertiary hover:text-text-primary text-xs cursor-pointer"
                  title="Tutup outline"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 text-xs scrollbar-thin">
                {tocItems.map((item) => {
                  const isActive = activeHeadingId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToHeading(item.id)}
                      className={`w-full text-left transition-colors flex items-start gap-2 cursor-pointer py-0.5 ${
                        item.level === 3 ? "pl-3 text-[11px]" : "font-medium"
                      } ${
                        isActive
                          ? "text-[#C2553A] dark:text-[#E5C194] font-semibold"
                          : "text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full mt-1.5 shrink-0 transition-colors ${
                          isActive ? "bg-[#D4664A]" : "bg-transparent"
                        }`}
                      />
                      <span className="line-clamp-2 leading-snug">{item.text}</span>
                    </button>
                  );
                })}

                {tocItems.length === 0 && (
                  <div className="p-4 text-center text-xs text-text-tertiary">
                    Tidak ada sub-heading pada halaman ini.
                  </div>
                )}
              </nav>
            </aside>

            {/* Tablet & Small-Screen Slide-Over Outline Drawer (<1280px) */}
            <div className="fixed inset-0 z-50 xl:hidden flex justify-end">
              <div
                className="fixed inset-0 bg-black/55 backdrop-blur-xs"
                onClick={() => setOutlineOpen(false)}
                aria-hidden="true"
              />
              <aside className="relative z-10 w-72 max-w-[85vw] h-full bg-surface border-l border-border shadow-2xl flex flex-col">
                <div className="p-3.5 border-b border-border flex items-center justify-between">
                  <h4 className="text-xs font-bold font-sans text-text-primary flex items-center gap-1.5">
                    <ListFilter className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
                    <span>Daftar Isi Halaman</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setOutlineOpen(false)}
                    className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-text-tertiary hover:text-text-primary cursor-pointer"
                    aria-label="Tutup outline"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 text-xs scrollbar-thin">
                  {tocItems.map((item) => {
                    const isActive = activeHeadingId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          scrollToHeading(item.id);
                          setOutlineOpen(false);
                        }}
                        className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors flex items-start gap-2 cursor-pointer ${
                          item.level === 3 ? "pl-5 text-[11px]" : "font-medium"
                        } ${
                          isActive
                            ? "bg-[#C2553A]/12 text-[#C2553A] dark:text-[#E5C194] font-semibold"
                            : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                            isActive ? "bg-[#D4664A]" : "bg-transparent"
                          }`}
                        />
                        <span className="line-clamp-2 leading-snug">{item.text}</span>
                      </button>
                    );
                  })}

                  {tocItems.length === 0 && (
                    <div className="p-4 text-center text-xs text-text-tertiary">
                      Tidak ada sub-heading pada halaman ini.
                    </div>
                  )}
                </nav>
              </aside>
            </div>
          </>
        )}
      </div>

      {/* ─── 3. FLOATING OUTLINE BUTTON ON MOBILE (< sm) ─── */}
      <div className="fixed bottom-5 right-4 z-30 sm:hidden flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMobileTocOpen(true)}
          className="flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-full shadow-lg border border-border bg-surface/95 backdrop-blur-md text-text-primary hover:border-[#D4664A] font-sans text-xs font-bold transition-all active:scale-95 cursor-pointer"
          aria-label="Buka Daftar Isi Halaman"
        >
          <ListFilter className="w-4 h-4 text-[#C2553A] dark:text-[#D4664A]" />
          <span>Daftar Isi</span>
          {tocItems.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold text-[#FFFBF8] bg-[#C2553A]">
              {tocItems.length}
            </span>
          )}
        </button>
      </div>

      {/* ─── 4. MOBILE BOTTOM-SHEET TOC DRAWER ─── */}
      {mobileTocOpen && (
        <div className="fixed inset-0 z-50 sm:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileTocOpen(false)}
          />

          <div className="relative z-10 w-full max-h-[82dvh] bg-surface rounded-t-2xl border-t border-border shadow-2xl flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom,0px)]">
            <div className="pt-2.5 pb-1 flex justify-center">
              <div className="w-10 h-1.5 rounded-full bg-border" />
            </div>

            <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListFilter className="w-4 h-4 text-[#C2553A] dark:text-[#D4664A]" />
                <span className="font-bold text-xs sm:text-sm font-display text-text-primary">
                  Daftar Isi &amp; Navigasi Cepat
                </span>
                <span className="text-[10.5px] font-mono text-text-tertiary">
                  ({tocItems.length})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileTocOpen(false)}
                className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1 text-xs scrollbar-thin">
              {tocItems.map((item) => {
                const isActive = activeHeadingId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      scrollToHeading(item.id);
                      setMobileTocOpen(false);
                    }}
                    className={`w-full text-left py-2.5 px-3 rounded-xl transition-colors flex items-start gap-2.5 cursor-pointer ${
                      item.level === 3 ? "pl-5 text-[11px]" : "font-medium text-xs"
                    } ${
                      isActive
                        ? "bg-[#C2553A]/12 text-[#C2553A] dark:text-[#E5C194] font-semibold"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary/60"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        isActive ? "bg-[#D4664A]" : "bg-text-tertiary/40"
                      }`}
                    />
                    <span className="leading-snug">{item.text}</span>
                  </button>
                );
              })}

              {tocItems.length === 0 && (
                <div className="p-6 text-center text-xs text-text-tertiary">
                  Tidak ada sub-heading pada halaman ini.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
