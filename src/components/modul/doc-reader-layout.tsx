"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  BookOpen,
  Copy,
  Maximize2,
  Minimize2,
  ExternalLink,
  LayoutGrid,
  FileText,
  ArrowLeft,
  ArrowRight,
  Sun,
  Moon,
  ListFilter,
  Check,
  Home,
  Sliders,
  Sparkles,
} from "lucide-react";
import { useTheme } from "next-themes";
import { NoteRenderer } from "@/components/notes/note-renderer";
import { toast } from "sonner";

export interface DocSectionItem {
  id: string;
  slug?: string;
  title: string;
  orderIndex?: number;
  description?: string;
  content_markdown?: string | null;
  codeSnippets?: Array<{
    id: string;
    language: string;
    code: string;
    caption?: string;
  }>;
  subsections?: DocSectionItem[];
  parentTitle?: string;
  chapterNumber?: string | number;
  sectionNumber?: string;
}

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

interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Generate anchor ID from heading text matching NoteRenderer's generateHeadingId
 */
function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s.-]/g, "")
    .replace(/[\s.]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Parses markdown to extract in-page Table of Contents (H2 and H3)
 */
function extractTocFromMarkdown(markdown: string): TocItem[] {
  if (!markdown) return [];
  const lines = markdown.split("\n");
  const items: TocItem[] = [];

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      let rawText = match[2].trim();
      // Remove inline links and formatting
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

/**
 * Flattens hierarchical sections into a linear list for sequential prev/next navigation
 */
function flattenDocSections(sections: DocSectionItem[]): DocSectionItem[] {
  const flat: DocSectionItem[] = [];
  for (const sec of sections) {
    if (sec.subsections && sec.subsections.length > 0) {
      for (const sub of sec.subsections) {
        flat.push({
          ...sub,
          parentTitle: sec.title,
          chapterNumber: sec.orderIndex,
        });
      }
    } else {
      flat.push(sec);
    }
  }
  return flat;
}

export function DocReaderLayout({
  categoryName,
  categoryId,
  themeColor = "#0284C7",
  categoryIcon = "machine_learning",
  sections,
  activeSectionId,
  onSelectSection,
  onToggleViewMode,
  viewMode = "doc",
}: DocReaderLayoutProps) {
  const { resolvedTheme, setTheme } = useTheme();

  // Sidebar collapsed states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tocCollapsed, setTocCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Search filter inside section navigation
  const [searchQuery, setSearchQuery] = useState("");

  // Version switcher dropdown
  const [showVersionDropdown, setShowVersionDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);

  // Active heading for ScrollSpy
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");

  // Flatten sections to find active item and handle prev/next
  const flatSections = useMemo(() => flattenDocSections(sections), [sections]);

  // Selected section ID (defaults to first leaf section or passed active ID)
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (activeSectionId) return activeSectionId;
    return flatSections[0]?.id || sections[0]?.id || "";
  });

  // Track expanded accordion chapters
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    sections.forEach((sec, idx) => {
      // Default expand all or first few
      init[sec.id] = true;
    });
    return init;
  });

  const contentRef = useRef<HTMLDivElement>(null);

  // Sync selectedId with activeSectionId prop
  useEffect(() => {
    if (activeSectionId && activeSectionId !== selectedId) {
      setSelectedId(activeSectionId);
    }
  }, [activeSectionId, selectedId]);

  // Automatically expand parent chapter of selected section
  useEffect(() => {
    for (const sec of sections) {
      if (sec.id === selectedId) {
        setExpandedChapters((prev) => ({ ...prev, [sec.id]: true }));
        break;
      }
      if (sec.subsections?.some((sub) => sub.id === selectedId)) {
        setExpandedChapters((prev) => ({ ...prev, [sec.id]: true }));
        break;
      }
    }
  }, [selectedId, sections]);

  // Scroll reader pane to top when selected section changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    setActiveHeadingId("");
  }, [selectedId]);

  // Find currently active section object
  const currentSection = useMemo(() => {
    return flatSections.find((s) => s.id === selectedId) || sections.find((s) => s.id === selectedId) || flatSections[0] || null;
  }, [flatSections, sections, selectedId]);

  // Find parent chapter for breadcrumbs
  const parentChapter = useMemo(() => {
    if (!currentSection) return null;
    return sections.find(
      (sec) =>
        sec.id === currentSection.id ||
        sec.subsections?.some((sub) => sub.id === currentSection.id)
    );
  }, [sections, currentSection]);

  // Previous & Next navigation
  const currentIndex = flatSections.findIndex((s) => s.id === currentSection?.id);
  const prevSection = currentIndex > 0 ? flatSections[currentIndex - 1] : null;
  const nextSection = currentIndex >= 0 && currentIndex < flatSections.length - 1 ? flatSections[currentIndex + 1] : null;

  // Markdown content
  const currentMarkdown = useMemo(() => {
    if (!currentSection) return "";
    if (currentSection.content_markdown && currentSection.content_markdown.trim().length > 30) {
      return currentSection.content_markdown;
    }
    // Fallback template
    return `# ${currentSection.title}\n\n${currentSection.description || ""}\n\n*Materi komprehensif Scikit-Learn untuk bagian ini sedang dimuat.*`;
  }, [currentSection]);

  // In-Page Table of Contents (On this page)
  const tocItems = useMemo(() => {
    return extractTocFromMarkdown(currentMarkdown);
  }, [currentMarkdown]);

  // ScrollSpy: observe headings when scrolling inside contentRef
  useEffect(() => {
    const container = contentRef.current;
    if (!container || tocItems.length === 0) return;

    const handleScroll = () => {
      const headingElements = tocItems
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);

      if (headingElements.length === 0) return;

      const containerTop = container.getBoundingClientRect().top;
      let currentActive = headingElements[0].id;

      for (const el of headingElements) {
        const rect = el.getBoundingClientRect();
        if (rect.top - containerTop <= 120) {
          currentActive = el.id;
        } else {
          break;
        }
      }

      setActiveHeadingId(currentActive);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, [tocItems, selectedId]);

  // Smooth scroll to an in-page heading
  const scrollToHeading = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el && contentRef.current) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveHeadingId(id);
    }
  }, []);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onSelectSection?.(id);
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  // Filter sections by search query
  const filteredSections = useMemo<DocSectionItem[]>(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase().trim();
    const result: DocSectionItem[] = [];

    for (const ch of sections) {
      const matchesChapter =
        ch.title.toLowerCase().includes(q) ||
        (ch.description || "").toLowerCase().includes(q);
      const matchingSubs = (ch.subsections || []).filter(
        (sub) =>
          sub.title.toLowerCase().includes(q) ||
          (sub.description || "").toLowerCase().includes(q)
      );

      if (matchesChapter || matchingSubs.length > 0) {
        result.push({
          ...ch,
          subsections: matchingSubs.length > 0 ? matchingSubs : ch.subsections,
        });
      }
    }

    return result;
  }, [sections, searchQuery]);

  return (
    <div
      className={`flex flex-col border border-border rounded-xl bg-white dark:bg-[#111113] overflow-hidden shadow-sm transition-all duration-300 font-sans ${
        isFullscreen
          ? "fixed inset-0 z-50 rounded-none shadow-2xl h-screen"
          : "h-[calc(100vh-140px)] min-h-[680px]"
      }`}
    >
      {/* ─── 1. TOP DOCUMENTATION NAVBAR (Scikit-Learn Sphinx Style) ─── */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-[#FFFFFF] dark:bg-[#18181B] select-none shrink-0 gap-3 z-20">
        {/* Left: Scikit-learn Logo & Main Navigation Tabs */}
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          {/* Scikit-Learn Logo Representation */}
          <Link
            href="/dashboard/modul"
            className="flex items-center gap-2 group shrink-0"
            title="Kembali ke Katalog Modul"
          >
            <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-[#0284c7] via-[#0284c7] to-[#ea580c] shadow-xs">
              <span className="text-[11px] font-black text-white italic tracking-tighter">sk</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-extrabold text-[#ea580c] dark:text-[#f97316] font-display tracking-tight group-hover:underline">
                scikit<span className="text-[#0284c7] dark:text-[#38bdf8]">-learn</span>
              </span>
              <span className="text-[9px] font-mono text-text-tertiary">1.9.1 documentation</span>
            </div>
          </Link>

          {/* Nav Tabs (Install, User Guide [active], API, Examples, Community) */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-medium font-sans">
            <Link
              href="/dashboard/modul"
              className="px-2.5 py-1 rounded text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
            >
              Install
            </Link>
            <span
              className="px-2.5 py-1 border-b-2 border-[#0284c7] dark:border-[#38bdf8] text-[#0284c7] dark:text-[#38bdf8] font-bold cursor-default"
            >
              User Guide
            </span>
            <Link
              href="/dashboard/modul"
              className="px-2.5 py-1 rounded text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
            >
              API
            </Link>
            <Link
              href="/dashboard/modul"
              className="px-2.5 py-1 rounded text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
            >
              Examples
            </Link>
            <a
              href="https://blog.scikit-learn.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
            >
              <span>Community</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            {/* More Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMoreDropdown(!showMoreDropdown)}
                className="flex items-center gap-1 px-2 py-1 rounded text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
              >
                <span>More</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {showMoreDropdown && (
                <div className="absolute left-0 mt-1.5 w-44 rounded-lg border border-border bg-surface p-1 shadow-lg z-30 space-y-0.5 text-xs">
                  <a
                    href="https://scikit-learn.org/stable/getting_started.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-2.5 py-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                  >
                    <span>Getting Started</span>
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                  <a
                    href="https://scikit-learn.org/stable/whats_new.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-2.5 py-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                  >
                    <span>Release History</span>
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                  <a
                    href="https://scikit-learn.org/stable/glossary.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-2.5 py-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                  >
                    <span>Glossary</span>
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right: Search, Theme Switcher, GitHub Link, Version Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Search Shortcut */}
          <button
            type="button"
            onClick={() => {
              const searchInput = document.getElementById("scikit-toc-search");
              searchInput?.focus();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-surface-secondary/60 hover:bg-surface-secondary text-xs text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
            title="Cari di dokumentasi"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden lg:inline text-[10px] font-mono px-1 py-0.2 rounded border border-border bg-surface text-text-tertiary">
              Ctrl K
            </kbd>
          </button>

          {/* Theme Switcher Toggle */}
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-md border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            title={resolvedTheme === "dark" ? "Ganti ke Light Mode" : "Ganti ke Dark Mode"}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-700" />
            )}
          </button>

          {/* Official Scikit-Learn GitHub Repository Link */}
          <a
            href="https://github.com/scikit-learn/scikit-learn"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors"
            title="Scikit-Learn di GitHub"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>

          {/* Version Switcher Badge */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowVersionDropdown(!showVersionDropdown)}
              className="flex items-center gap-1 px-2 py-1 rounded-md border border-border bg-surface text-xs font-mono font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              <span>1.9.1 (stable)</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showVersionDropdown && (
              <div className="absolute right-0 mt-1.5 w-36 rounded-lg border border-border bg-surface p-1 shadow-lg z-30 space-y-0.5 text-xs font-mono">
                <div className="px-2 py-1 font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 rounded flex items-center justify-between">
                  <span>1.9.1 (stable)</span>
                  <Check className="w-3 h-3" />
                </div>
                <div className="px-2 py-1 text-text-tertiary hover:text-text-primary cursor-pointer rounded hover:bg-surface-secondary">
                  1.8.2
                </div>
                <div className="px-2 py-1 text-text-tertiary hover:text-text-primary cursor-pointer rounded hover:bg-surface-secondary">
                  dev (1.10.dev)
                </div>
              </div>
            )}
          </div>

          {/* Fullscreen focus reading mode toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-md border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            title={isFullscreen ? "Keluar dari Layar Penuh" : "Mode Baca Layar Penuh"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-brand-600" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </header>

      {/* ─── 2. MAIN 3-COLUMN DOCUMENTATION AREA ─── */}
      <div className="flex flex-1 min-h-0 relative overflow-hidden bg-white dark:bg-[#121214]">
        {/* ─────────────────────────────────────────────────────────────
            COLUMN 1: LEFT SIDEBAR (Section Navigation Tree with Subbab)
           ───────────────────────────────────────────────────────────── */}
        <aside
          className={`flex flex-col border-r border-border bg-[#FAF8F5] dark:bg-[#161619] transition-all duration-300 select-none shrink-0 ${
            sidebarCollapsed
              ? "w-0 -translate-x-full opacity-0 pointer-events-none border-r-0"
              : "w-72 sm:w-80 lg:w-84 translate-x-0 opacity-100"
          }`}
        >
          {/* Top Collapse Button & Section Navigation Title */}
          <div className="p-3 border-b border-border/80 space-y-2">
            <div className="flex items-center justify-between">
              {/* Collapse Sidebar Button (Styled exactly like Image 2) */}
              <button
                type="button"
                onClick={() => setSidebarCollapsed(true)}
                className="flex items-center gap-1.5 px-2 py-1 rounded border border-border bg-surface hover:bg-surface-secondary text-[11px] font-mono font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                title="Sembunyikan panel navigasi"
              >
                <PanelLeftClose className="w-3.5 h-3.5 text-[#0284c7] dark:text-[#38bdf8]" />
                <span>Collapse Sidebar</span>
              </button>

              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border text-text-tertiary">
                {flatSections.length} Materi
              </span>
            </div>

            <h3 className="text-xs font-bold font-mono tracking-wider text-text-primary uppercase pt-1">
              Section Navigation
            </h3>

            {/* Quick search input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-text-tertiary pointer-events-none" />
              <input
                id="scikit-toc-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari bab atau subbab..."
                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-md border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-[#0284c7]"
              />
            </div>
          </div>

          {/* Section Tree Accordion (Bab & Subbab) */}
          <nav className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin text-xs">
            {filteredSections.map((chapter) => {
              const hasSubsections = chapter.subsections && chapter.subsections.length > 0;
              const isExpanded = expandedChapters[chapter.id] ?? false;
              const isChapterActive = chapter.id === selectedId;

              return (
                <div key={chapter.id} className="space-y-0.5">
                  {/* Top-Level Chapter Header */}
                  <div
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-md font-sans transition-colors group cursor-pointer ${
                      isChapterActive
                        ? "bg-surface font-bold text-[#0284c7] dark:text-[#38bdf8] shadow-2xs"
                        : "text-text-primary hover:bg-surface/70 font-semibold"
                    }`}
                    onClick={() => {
                      if (hasSubsections) {
                        toggleChapter(chapter.id);
                      } else {
                        handleSelect(chapter.id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs truncate">{chapter.title}</span>
                    </div>

                    {hasSubsections && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleChapter(chapter.id);
                        }}
                        className="p-0.5 text-text-tertiary hover:text-text-primary transition-transform"
                      >
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isExpanded ? "transform rotate-0" : "transform -rotate-90"
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Subbab Tree (Subsections with left guideline and active blue indicator) */}
                  {hasSubsections && isExpanded && (
                    <div className="pl-3.5 ml-2 border-l border-border/80 space-y-0.5 my-0.5">
                      {chapter.subsections!.map((sub) => {
                        const isSubActive = sub.id === selectedId;

                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => handleSelect(sub.id)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-md text-[11px] font-sans transition-all flex items-start justify-between gap-1.5 cursor-pointer relative ${
                              isSubActive
                                ? "bg-white dark:bg-[#1c1c20] text-[#0284c7] dark:text-[#38bdf8] font-bold border-l-3 border-[#0284c7] dark:border-[#38bdf8] -ml-[15px] pl-[18px] shadow-2xs"
                                : "text-text-secondary hover:text-text-primary hover:bg-surface/50"
                            }`}
                          >
                            <span className="leading-snug line-clamp-2">
                              {sub.title}
                            </span>
                            {isSubActive && (
                              <ChevronRight className="w-3 h-3 text-[#0284c7] dark:text-[#38bdf8] shrink-0 mt-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredSections.length === 0 && (
              <div className="p-4 text-center text-xs text-text-tertiary font-mono">
                Tidak ada materi yang cocok dengan &quot;{searchQuery}&quot;
              </div>
            )}
          </nav>

          {/* Bottom Sidebar Footer */}
          <div className="p-2.5 border-t border-border/80 bg-surface/50 flex items-center justify-between text-[10px] font-mono text-text-tertiary">
            <span className="truncate">{categoryName}</span>
            <span className="text-[#0284c7] dark:text-[#38bdf8] font-semibold shrink-0">
              Scikit-Learn 1.9.1
            </span>
          </div>
        </aside>

        {/* ─────────────────────────────────────────────────────────────
            COLUMN 2: CENTER MAIN CONTENT (Reader Pane with Math & Code)
           ───────────────────────────────────────────────────────────── */}
        <main
          ref={contentRef}
          className="flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-8 lg:px-12 lg:py-10 max-w-4xl mx-auto scrollbar-thin space-y-6"
        >
          {/* Top Bar for Collapsed Sidebar Re-opening */}
          {sidebarCollapsed && (
            <div className="flex items-center gap-2 mb-3">
              <button
                type="button"
                onClick={() => setSidebarCollapsed(false)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-surface hover:bg-surface-secondary text-xs font-mono text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <PanelLeftOpen className="w-3.5 h-3.5 text-[#0284c7] dark:text-[#38bdf8]" />
                <span>Expand Sidebar</span>
              </button>
            </div>
          )}

          {/* Breadcrumbs Styled Exactly like Scikit-Learn (🏠 > User Guide > 1. Supervised learning > 1.1. Linear Models) */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs font-sans text-text-tertiary flex-wrap"
          >
            <Link
              href="/dashboard"
              className="hover:text-text-primary transition-colors flex items-center gap-1 shrink-0"
              title="Home"
            >
              <Home className="w-3.5 h-3.5 opacity-80" />
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
            <span className="hover:text-text-primary transition-colors shrink-0">
              User Guide
            </span>
            {parentChapter && (
              <>
                <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                <button
                  type="button"
                  onClick={() => toggleChapter(parentChapter.id)}
                  className="hover:text-text-primary transition-colors truncate max-w-[200px]"
                >
                  {parentChapter.title}
                </button>
              </>
            )}
            {currentSection && (
              <>
                <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                <span className="text-text-primary font-bold truncate max-w-[280px]">
                  {currentSection.title}
                </span>
              </>
            )}
          </nav>

          {/* Main Article Content */}
          {currentSection ? (
            <article className="space-y-6">
              {/* Document Markdown Content with LaTeX math equations & code blocks */}
              <div className="py-2">
                <NoteRenderer content={currentMarkdown} />
              </div>

              {/* Bottom Pagination Buttons (Prev / Next Section) */}
              <nav
                aria-label="Navigasi Halaman"
                className="mt-14 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {prevSection ? (
                  <button
                    type="button"
                    onClick={() => handleSelect(prevSection.id)}
                    className="flex flex-col items-start p-3 rounded-lg border border-border hover:border-[#0284c7]/50 bg-surface hover:bg-surface-secondary/50 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-[11px] font-sans text-text-tertiary flex items-center gap-1 group-hover:text-[#0284c7] dark:group-hover:text-[#38bdf8]">
                      <ArrowLeft className="w-3 h-3" />
                      <span>Previous</span>
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-text-primary line-clamp-1 mt-0.5">
                      {prevSection.title}
                    </span>
                  </button>
                ) : (
                  <div className="hidden sm:block" />
                )}

                {nextSection && (
                  <button
                    type="button"
                    onClick={() => handleSelect(nextSection.id)}
                    className="flex flex-col items-end p-3 rounded-lg border border-border hover:border-[#0284c7]/50 bg-surface hover:bg-surface-secondary/50 text-right transition-all cursor-pointer group sm:col-start-2"
                  >
                    <span className="text-[11px] font-sans text-text-tertiary flex items-center gap-1 group-hover:text-[#0284c7] dark:group-hover:text-[#38bdf8]">
                      <span>Next</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-text-primary line-clamp-1 mt-0.5">
                      {nextSection.title}
                    </span>
                  </button>
                )}
              </nav>
            </article>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 text-text-tertiary font-mono space-y-3">
              <FileText className="w-10 h-10 opacity-40" />
              <p className="text-sm">Silakan pilih bab di Section Navigation sebelah kiri.</p>
            </div>
          )}
        </main>

        {/* ─────────────────────────────────────────────────────────────
            COLUMN 3: RIGHT SIDEBAR ("On this page" In-Page TOC)
           ───────────────────────────────────────────────────────────── */}
        <aside
          className={`hidden xl:flex flex-col border-l border-border bg-white dark:bg-[#141417] transition-all duration-300 shrink-0 w-64 ${
            tocCollapsed ? "w-0 opacity-0 pointer-events-none border-l-0" : "opacity-100"
          }`}
        >
          {/* TOC Header */}
          <div className="p-3.5 border-b border-border/80 flex items-center justify-between">
            <h4 className="text-xs font-bold font-sans text-text-primary flex items-center gap-1.5">
              <ListFilter className="w-3.5 h-3.5 text-[#0284c7] dark:text-[#38bdf8]" />
              <span>On this page</span>
            </h4>
            <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-surface border border-border text-text-tertiary">
              {tocItems.length}
            </span>
          </div>

          {/* TOC Links List with ScrollSpy highlight */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs scrollbar-thin">
            {tocItems.map((item) => {
              const isActive = activeHeadingId === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToHeading(item.id)}
                  className={`w-full text-left transition-colors flex items-start gap-1.5 group cursor-pointer ${
                    item.level === 3 ? "pl-3 text-[11px]" : "font-medium"
                  } ${
                    isActive
                      ? "text-[#0284c7] dark:text-[#38bdf8] font-bold"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <span
                    className={`w-1 h-1 rounded-full mt-1.5 shrink-0 transition-colors ${
                      isActive
                        ? "bg-[#0284c7] dark:bg-[#38bdf8]"
                        : "bg-transparent group-hover:bg-text-tertiary"
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
    </div>
  );
}
