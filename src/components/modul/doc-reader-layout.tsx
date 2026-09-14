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

    // Construct rich markdown from description and codeSnippets for all modules
    let md = `# ${currentSection.title}\n\n`;
    if (currentSection.description) {
      md += `> ${currentSection.description}\n\n`;
      md += `## Gambaran Umum & Konsep Fundamental\n\nMateri ini membahas konsep inti, arsitektur pemodelan matematis, serta praktik terbaik implementasi untuk **${currentSection.title}** dalam kurikulum ${categoryName}.\n\n`;
    }

    if (currentSection.codeSnippets && currentSection.codeSnippets.length > 0) {
      md += `## Implementasi Praktikum Kode Python\n\nBerikut adalah implementasi kode yang dapat dijalankan langsung untuk mempraktikkan konsep ini:\n\n`;
      for (const snip of currentSection.codeSnippets) {
        if (snip.caption) {
          md += `### ${snip.caption}\n\n`;
        }
        md += "```" + (snip.language || "python") + "\n" + snip.code + "\n```\n\n";
      }
    }

    md += `## Ringkasan & Poin Penting\n\n1. Pemahaman mendalam mengenai **${currentSection.title}** merupakan pilar penting dalam spesialisasi ${categoryName}.\n2. Terapkan kode praktikum di atas ke dalam alur kerja analisis data atau pelatihan model mandiri.\n3. Gunakan panel daftar isi di sebelah kanan (*Pada Halaman Ini*) untuk menelusuri sub-bagian materi secara instan.`;

    return md;
  }, [currentSection, categoryName]);

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
        if (rect.top - containerTop <= 100) {
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

  // Smooth scroll to an in-page heading
  const scrollToHeading = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el && contentRef.current) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveHeadingId(id);
    }
  }, []);

  // Handle section click
  const handleSelect = (sectionId: string) => {
    setSelectedId(sectionId);
    if (onSelectSection) {
      onSelectSection(sectionId);
    }
  };

  // Toggle chapter accordion expand/collapse
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
          : "flex-1 h-full min-h-[calc(100vh-3.5rem)]"
      }`}
    >
      {/* ─── 1. TOP DOCUMENTATION NAVBAR (Velqora Modern Docs Header) ─── */}
      <header className="flex items-center justify-between px-3 sm:px-5 py-2.5 border-b border-border bg-[#FFFFFF] dark:bg-[#18181B] select-none shrink-0 gap-3 z-20">
        {/* Left: Velqora Brand + Category Identity */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* Back to Module Catalog */}
          <Link
            href="/dashboard/modul"
            className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors shrink-0"
            title="Kembali ke Katalog Modul"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          {/* Velqora Docs Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white shadow-xs shrink-0"
              style={{
                backgroundColor: themeColor,
              }}
            >
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-extrabold text-text-primary font-display tracking-tight flex items-center gap-1.5">
                Velqora <span className="font-mono text-xs font-normal text-text-tertiary">/ Docs</span>
              </span>
              <span className="text-[10px] font-mono text-text-secondary mt-0.5 truncate max-w-[140px] sm:max-w-[200px]">
                {categoryName}
              </span>
            </div>
          </div>

          {/* Category Pill */}
          <div
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shrink-0"
            style={{
              backgroundColor: `${themeColor}15`,
              borderColor: `${themeColor}35`,
              color: themeColor,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor }} />
            <span className="font-medium truncate max-w-[180px]">{categoryName}</span>
          </div>

          {/* Navigation Tabs (Velqora Learning Flow) */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-medium font-sans ml-2">
            <span
              className="px-3 py-1.5 border-b-2 font-bold cursor-default flex items-center gap-1.5"
              style={{
                borderColor: themeColor,
                color: themeColor,
              }}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Dokumentasi & Teori</span>
            </span>
            <Link
              href="/dashboard/modul"
              className="px-3 py-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
            >
              Katalog Modul
            </Link>
            <Link
              href="/dashboard/catatan"
              className="px-3 py-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
            >
              Catatan Vault
            </Link>
            <Link
              href="/dashboard/proyek"
              className="px-3 py-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
            >
              Praktikum Proyek
            </Link>
          </nav>
        </div>

        {/* Right: Search, Switcher, Theme, Fullscreen */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Search Shortcut */}
          <button
            type="button"
            onClick={() => {
              const searchInput = document.getElementById("doc-toc-search");
              searchInput?.focus();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-surface-secondary/60 hover:bg-surface-secondary text-xs text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
            title="Cari bab atau materi"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cari</span>
            <kbd className="hidden lg:inline text-[10px] font-mono px-1 py-0.2 rounded border border-border bg-surface text-text-tertiary">
              Ctrl K
            </kbd>
          </button>

          {/* Toggle view mode to Grid Kartu */}
          {onToggleViewMode && (
            <button
              type="button"
              onClick={onToggleViewMode}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-xs font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              title="Ganti ke Tampilan Ringkasan Grid Kartu"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-text-secondary" />
              <span className="hidden sm:inline">Tampilan Kartu</span>
            </button>
          )}

          {/* Theme Switcher Toggle */}
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            title={resolvedTheme === "dark" ? "Ganti ke Light Mode" : "Ganti ke Dark Mode"}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Fullscreen focus reading mode toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            title={isFullscreen ? "Keluar dari Layar Penuh" : "Mode Baca Layar Penuh"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-brand-600" />
            ) : (
              <Maximize2 className="w-4 h-4" />
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
              {/* Collapse Sidebar Button */}
              <button
                type="button"
                onClick={() => setSidebarCollapsed(true)}
                className="flex items-center gap-1.5 px-2 py-1 rounded border border-border bg-surface hover:bg-surface-secondary text-[11px] font-mono font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                title="Sembunyikan panel navigasi"
              >
                <PanelLeftClose className="w-3.5 h-3.5" style={{ color: themeColor }} />
                <span>Collapse Sidebar</span>
              </button>

              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border text-text-tertiary">
                {flatSections.length} Materi
              </span>
            </div>

            <h3 className="text-xs font-bold font-mono tracking-wider text-text-primary uppercase pt-1">
              Navigasi Materi & Bab
            </h3>

            {/* Quick search input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-text-tertiary pointer-events-none" />
              <input
                id="doc-toc-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari bab atau subbab..."
                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-md border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                        ? "bg-surface font-bold shadow-2xs"
                        : "text-text-primary hover:bg-surface/70 font-semibold"
                    }`}
                    style={isChapterActive ? { color: themeColor } : undefined}
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

                  {/* Subbab Tree (Subsections with left guideline and active indicator) */}
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
                                ? "bg-white dark:bg-[#1c1c20] font-bold -ml-[15px] pl-[18px] shadow-2xs"
                                : "text-text-secondary hover:text-text-primary hover:bg-surface/50"
                            }`}
                            style={
                              isSubActive
                                ? {
                                    color: themeColor,
                                    borderLeft: `3px solid ${themeColor}`,
                                  }
                                : undefined
                            }
                          >
                            <span className="leading-snug line-clamp-2">
                              {sub.title}
                            </span>
                            {isSubActive && (
                              <ChevronRight className="w-3 h-3 shrink-0 mt-0.5" style={{ color: themeColor }} />
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
            <span className="font-semibold shrink-0" style={{ color: themeColor }}>
              Velqora Learning
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
                <PanelLeftOpen className="w-3.5 h-3.5" style={{ color: themeColor }} />
                <span>Buka Navigasi Materi</span>
              </button>
            </div>
          )}

          {/* Breadcrumbs Styled Elegantly (Dashboard > Modul AI > Category > Chapter > Section) */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs font-sans text-text-tertiary flex-wrap"
          >
            <Link
              href="/dashboard"
              className="hover:text-text-primary transition-colors flex items-center gap-1 shrink-0"
              title="Dashboard"
            >
              <Home className="w-3.5 h-3.5 opacity-80" />
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
            <Link
              href="/dashboard/modul"
              className="hover:text-text-primary transition-colors shrink-0"
            >
              Modul AI
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
            <span className="hover:text-text-primary transition-colors shrink-0 font-medium" style={{ color: themeColor }}>
              {categoryName}
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
