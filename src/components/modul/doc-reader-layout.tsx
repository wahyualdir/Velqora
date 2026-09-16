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
  ArrowLeft,
  ArrowRight,
  Sun,
  Moon,
  ListFilter,
  Check,
  Home,
  Menu,
  X,
  Maximize2,
  Minimize2,
  Share2,
  LayoutGrid,
  Bot,
  BrainCircuit,
  Code2,
  GraduationCap,
} from "lucide-react";
import { useTheme } from "next-themes";
import { NoteRenderer } from "@/components/notes/note-renderer";
import { toast } from "sonner";
import {
  NotebookUnitRenderer,
  NotebookLessonHeader,
  NotebookObjectives,
  NotebookPrerequisites,
  NotebookSummary,
  NotebookSourceList,
  NotebookNavigation,
} from "./notebook";
import {
  notebookUnitsToMarkdown,
  type DocSectionItem,
  type AcademicLesson,
  type LessonFlow,
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

interface TocItem {
  id: string;
  text: string;
  level: number;
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

  for (const line of lines) {
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
    if (sec.content_markdown && sec.content_markdown.trim().length > 0) {
      flat.push(sec);
    }
    if (sec.subsections && sec.subsections.length > 0) {
      for (const sub of sec.subsections) {
        flat.push({
          ...sub,
          parentTitle: sec.title,
          chapterNumber: sec.orderIndex,
        });

        if (sub.subsections && sub.subsections.length > 0) {
          for (const unit of sub.subsections) {
            flat.push({
              ...unit,
              parentTitle: `${sec.title} > ${sub.title}`,
              chapterNumber: sec.orderIndex,
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

  // Sidebar & Outline Adaptive State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [outlineOpen, setOutlineOpen] = useState(false); // Collapsed by default for spacious reading
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Search filter inside navigation
  const [searchQuery, setSearchQuery] = useState("");

  // ScrollSpy active heading ID
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");

  const flatSections = useMemo(() => flattenDocSections(sections), [sections]);

  // Selected section ID (URL query sync priority)
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const fromUrl = urlParams.get("section");
      if (fromUrl) return fromUrl;
    }
    if (activeSectionId) return activeSectionId;
    return flatSections[0]?.id || sections[0]?.id || "";
  });

  // Track expanded accordion chapters
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    sections.forEach((sec, idx) => {
      init[sec.id] = Boolean(
        idx === 0 ||
          sec.id === activeSectionId ||
          sec.subsections?.some(
            (sub) => sub.id === activeSectionId || sub.subsections?.some((u) => u.id === activeSectionId)
          )
      );
    });
    return init;
  });

  const contentRef = useRef<HTMLDivElement>(null);

  // Synchronize URL query parameter ?section=...
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const sectionFromUrl = urlParams.get("section");
      if (sectionFromUrl && sectionFromUrl !== selectedId) {
        setSelectedId(sectionFromUrl);
      }
    }
  }, [selectedId]);

  useEffect(() => {
    if (activeSectionId && activeSectionId !== selectedId) {
      setSelectedId(activeSectionId);
    }
  }, [activeSectionId, selectedId]);

  // Expand parent chapter automatically
  useEffect(() => {
    for (const sec of sections) {
      if (sec.id === selectedId) {
        setExpandedChapters((prev) => ({ ...prev, [sec.id]: true }));
        break;
      }
      if (
        sec.subsections?.some(
          (sub) => sub.id === selectedId || sub.subsections?.some((u) => u.id === selectedId)
        )
      ) {
        setExpandedChapters((prev) => ({ ...prev, [sec.id]: true }));
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
  }, [selectedId]);

  // Active section item
  const currentSection = useMemo(() => {
    return (
      flatSections.find((s) => s.id === selectedId) ||
      sections.find((s) => s.id === selectedId) ||
      flatSections[0] ||
      null
    );
  }, [flatSections, sections, selectedId]);

  // Parent chapter for breadcrumbs
  const parentChapter = useMemo(() => {
    if (!currentSection) return null;
    return sections.find(
      (sec) =>
        sec.id === currentSection.id ||
        sec.subsections?.some((sub) => sub.id === currentSection.id)
    );
  }, [sections, currentSection]);

  // Previous & Next navigation targets
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

    md += `## Ringkasan & Poin Penting\n\n1. Pemahaman mendalam mengenai **${currentSection.title}** merupakan pilar penting dalam spesialisasi ${categoryName}.\n2. Terapkan kode praktikum di atas ke dalam alur kerja analisis data atau pelatihan model mandiri.\n3. Gunakan panel daftar isi (*Outline*) untuk menelusuri sub-bagian materi secara instan.`;

    return md;
  }, [currentSection, categoryName]);

  // In-Page TOC items
  const tocItems = useMemo(() => {
    return extractTocFromMarkdown(currentMarkdown);
  }, [currentMarkdown]);

  // ScrollSpy listener
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
    if (onSelectSection) {
      onSelectSection(sectionId);
    }
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
      className={`flex flex-col bg-white dark:bg-[#111113] overflow-hidden transition-all duration-300 font-sans w-full h-screen ${
        isFullscreen ? "fixed inset-0 z-50 shadow-2xl" : "flex-1"
      }`}
    >
      {/* ─── 1. MINIMAL ACADEMIC TOOLBAR ─── */}
      <header className="flex items-center justify-between px-3 sm:px-6 py-2.5 border-b border-border/80 bg-white/90 dark:bg-[#161619]/90 backdrop-blur-md select-none shrink-0 gap-3 z-30">
        {/* Left: Mobile Drawer Trigger + Brand + Navigation Toggle */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* Mobile Navigation Drawer Button */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="md:hidden p-2 rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Buka navigasi materi"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Desktop Sidebar Toggle Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex items-center gap-1.5 p-1.5 px-2 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-xs font-mono text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            title={sidebarOpen ? "Sembunyikan panel bab" : "Buka panel bab"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-3.5 h-3.5" style={{ color: themeColor }} />
            ) : (
              <PanelLeftOpen className="w-3.5 h-3.5" style={{ color: themeColor }} />
            )}
            <span className="hidden lg:inline">{sidebarOpen ? "Tutup" : "Materi"}</span>
          </button>

          {/* Back to Catalog */}
          <Link
            href="/dashboard/modul"
            className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors shrink-0"
            title="Kembali ke Katalog Modul"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          {/* Academic Topic Identity */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white shadow-2xs shrink-0"
              style={{ backgroundColor: themeColor }}
            >
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-bold text-text-primary font-display tracking-tight truncate">
                {categoryName}
              </span>
              <span className="text-[10px] font-mono text-text-tertiary hidden sm:inline truncate">
                Velqora Academic Notebook Platform
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions, TOC Toggle, Theme, Fullscreen */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* In-Page Outline Toggle (Collapsible Right Panel) */}
          <button
            type="button"
            onClick={() => setOutlineOpen(!outlineOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
              outlineOpen
                ? "bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border-brand-300 dark:border-brand-700"
                : "border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
            }`}
            title="Buka / tutup panel daftar isi halaman"
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Outline</span>
            {tocItems.length > 0 && (
              <span className="text-[10px] px-1 py-0.2 rounded-full bg-surface-secondary text-text-tertiary">
                {tocItems.length}
              </span>
            )}
          </button>

          {/* Toggle Grid View Mode */}
          {onToggleViewMode && (
            <button
              type="button"
              onClick={onToggleViewMode}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-xs font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              title="Ganti ke Tampilan Kartu Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Kartu</span>
            </button>
          )}

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Ubah tema warna"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Fullscreen Reading Mode */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-brand-600" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* ─── 2. ADAPTIVE MAIN WORKSPACE CANVAS ─── */}
      <div className="flex flex-1 min-h-0 relative overflow-hidden bg-white dark:bg-[#111113]">
        {/* Mobile Backdrop Overlay */}
        {mobileDrawerOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
            onClick={() => setMobileDrawerOpen(false)}
          />
        )}

        {/* ─────────────────────────────────────────────────────────────
            LEFT NAVIGATION SIDEBAR (Collapsible Desktop & Mobile Drawer)
           ───────────────────────────────────────────────────────────── */}
        <aside
          className={`flex flex-col border-r border-border bg-[#FAF9F6] dark:bg-[#161619] transition-all duration-200 select-none shrink-0 z-40 md:z-10 ${
            // Mobile Drawer
            mobileDrawerOpen
              ? "fixed inset-y-0 left-0 w-80 shadow-2xl flex"
              : "hidden md:flex"
          } ${
            // Desktop Collapse State
            sidebarOpen
              ? "md:w-64 lg:w-72 md:translate-x-0 md:opacity-100"
              : "md:w-0 md:-translate-x-full md:opacity-0 md:pointer-events-none md:border-r-0"
          }`}
        >
          {/* Mobile Header in Drawer */}
          <div className="p-3 border-b border-border/80 flex items-center justify-between md:hidden">
            <span className="font-bold text-xs font-display text-text-primary">
              Daftar Bab & Materi
            </span>
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              className="p-1 rounded text-text-tertiary hover:text-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Search */}
          <div className="p-2.5 border-b border-border/70">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-text-tertiary pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari materi atau bab..."
                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-md border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-brand-500 font-sans"
              />
            </div>
          </div>

          {/* Tree Navigation */}
          <nav className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin text-xs">
            {filteredSections.map((chapter) => {
              const hasSubsections = chapter.subsections && chapter.subsections.length > 0;
              const isExpanded = expandedChapters[chapter.id] ?? false;
              const isChapterActive = chapter.id === selectedId;

              return (
                <div key={chapter.id} className="space-y-0.5">
                  <div
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-md font-sans transition-colors group cursor-pointer ${
                      isChapterActive
                        ? "bg-surface font-bold shadow-2xs"
                        : "text-text-primary hover:bg-surface/70 font-semibold"
                    }`}
                    style={isChapterActive ? { color: themeColor } : undefined}
                    onClick={() => {
                      handleSelect(chapter.id);
                      if (hasSubsections && !isExpanded) {
                        toggleChapter(chapter.id);
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
                        className="p-0.5 text-text-tertiary hover:text-text-primary"
                        aria-label="Perluas atau ciutkan bab"
                      >
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isExpanded ? "transform rotate-0" : "transform -rotate-90"
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Subchapters */}
                  {hasSubsections && isExpanded && (
                    <div className="pl-3 ml-2 border-l border-border/80 space-y-0.5 my-0.5">
                      {chapter.subsections!.map((sub) => {
                        const isSubActive = sub.id === selectedId;

                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => {
                              if (sub.id.includes("#")) {
                                const [parentId, anchor] = sub.id.split("#");
                                handleSelect(parentId);
                                setTimeout(() => scrollToHeading(anchor), 120);
                              } else {
                                handleSelect(sub.id);
                              }
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-md text-[11px] font-sans transition-all flex items-start justify-between gap-1.5 cursor-pointer ${
                              isSubActive
                                ? "bg-white dark:bg-[#1e1e22] font-bold shadow-2xs"
                                : "text-text-secondary hover:text-text-primary hover:bg-surface/50"
                            }`}
                            style={isSubActive ? { color: themeColor } : undefined}
                          >
                            <span className="leading-snug line-clamp-2">{sub.title}</span>
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
          </nav>

          {/* Sidebar Footer */}
          <div className="p-2.5 border-t border-border/80 bg-surface/40 flex items-center justify-between text-[10px] font-mono text-text-tertiary">
            <span className="truncate">{flatSections.length} Materi</span>
            <span className="font-semibold" style={{ color: themeColor }}>
              Velqora Learning
            </span>
          </div>
        </aside>

        {/* ─────────────────────────────────────────────────────────────
            CENTER MAIN ACADEMIC CANVAS (Comfortable 720–900px Width)
           ───────────────────────────────────────────────────────────── */}
        <main
          ref={contentRef}
          className="flex-1 overflow-y-auto min-w-0 scrollbar-thin px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 lg:py-10"
        >
          <div className="mx-auto w-full max-w-3xl xl:max-w-4xl space-y-8">
            {/* Breadcrumb Navigation */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs font-sans text-text-tertiary flex-wrap"
            >
              <Link
                href="/dashboard"
                className="hover:text-text-primary transition-colors flex items-center gap-1 shrink-0"
              >
                <Home className="w-3.5 h-3.5 opacity-80" />
              </Link>
              <ChevronRight className="w-3 h-3 opacity-40 shrink-0" />
              <Link href="/dashboard/modul" className="hover:text-text-primary transition-colors shrink-0">
                Modul AI
              </Link>
              <ChevronRight className="w-3 h-3 opacity-40 shrink-0" />
              <span className="hover:text-text-primary transition-colors shrink-0 font-medium" style={{ color: themeColor }}>
                {categoryName}
              </span>
              {parentChapter && (
                <>
                  <ChevronRight className="w-3 h-3 opacity-40 shrink-0" />
                  <span className="truncate max-w-[200px]">{parentChapter.title}</span>
                </>
              )}
            </nav>

            {/* Current Section / Lesson Article */}
            {currentSection ? (
              <article className="space-y-8">
                {/* 1. Lesson Header */}
                <NotebookLessonHeader
                  number={currentSection.orderIndex ? `${currentSection.chapterNumber || 1}.${currentSection.orderIndex}` : undefined}
                  title={currentSection.title}
                  subtitle={currentSection.parentTitle}
                  description={currentSection.description}
                  flow={currentSection.flow || (currentSection.units?.some((u) => u.type === "code") ? "computational" : "conceptual")}
                  estimatedMinutes={currentSection.units ? Math.max(10, currentSection.units.length * 2) : 15}
                  categoryName={categoryName}
                  chapterTitle={parentChapter?.title}
                />

                {/* 2. Contextual Quick Actions (Unobtrusive) */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-border/80 bg-surface/40 backdrop-blur-xs text-xs">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/40">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Standar Kurikulum Akademik</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Link
                      href={`/dashboard/ai-tutor?prompt=${encodeURIComponent(
                        `Halo AI Tutor, saya sedang mempelajari "${currentSection.title}" pada kurikulum ${categoryName}. Bisakah Anda menjelaskan konsep intinya, membimbing penurunan matematisnya, dan memberikan contoh kode interaktif?`
                      )}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-brand-600 hover:bg-brand-700 text-white shadow-2xs transition-colors"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Tanya Tutor</span>
                    </Link>

                    <Link
                      href={`/dashboard/kuis-ai?topic=${encodeURIComponent(`${categoryName} - ${currentSection.title}`)}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border border-border bg-surface hover:bg-surface-secondary text-text-primary transition-colors"
                    >
                      <BrainCircuit className="w-3.5 h-3.5 text-amber-500" />
                      <span>Kuis</span>
                    </Link>

                    <Link
                      href="/dashboard/playground"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border border-border bg-surface hover:bg-surface-secondary text-text-primary transition-colors"
                    >
                      <Code2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Playground</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success("Tautan materi berhasil disalin.");
                        }
                      }}
                      className="p-1 rounded-md border border-border bg-surface hover:bg-surface-secondary text-text-tertiary hover:text-text-primary transition-colors"
                      title="Salin tautan"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 3. Learning Objectives */}
                {currentSection.learningObjectives && currentSection.learningObjectives.length > 0 && (
                  <NotebookObjectives objectives={currentSection.learningObjectives} />
                )}

                {/* 4. Main Lesson Units / Markdown Content */}
                {currentSection.units && currentSection.units.length > 0 ? (
                  <NotebookUnitRenderer units={currentSection.units} />
                ) : (
                  <div className="py-2 prose dark:prose-invert max-w-none">
                    <NoteRenderer content={currentMarkdown} />
                  </div>
                )}

                {/* 5. Key Takeaways / Summary */}
                {currentSection.summary && (
                  <NotebookSummary summary={currentSection.summary} />
                )}

                {/* 6. Academic Sources / Citations */}
                {currentSection.lesson?.furtherReading && currentSection.lesson.furtherReading.length > 0 && (
                  <NotebookSourceList sources={currentSection.lesson.furtherReading} />
                )}

                {/* 7. Previous / Next Lesson Navigation */}
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

        {/* ─────────────────────────────────────────────────────────────
            RIGHT OUTLINE SIDEBAR (Collapsible / Optional "On this page")
           ───────────────────────────────────────────────────────────── */}
        {outlineOpen && (
          <aside className="hidden xl:flex flex-col border-l border-border bg-white dark:bg-[#141417] transition-all duration-200 shrink-0 w-64 z-20">
            <div className="p-3.5 border-b border-border/80 flex items-center justify-between">
              <h4 className="text-xs font-bold font-sans text-text-primary flex items-center gap-1.5">
                <ListFilter className="w-3.5 h-3.5" style={{ color: themeColor }} />
                <span>Daftar Isi Halaman</span>
              </h4>
              <button
                type="button"
                onClick={() => setOutlineOpen(false)}
                className="p-1 rounded text-text-tertiary hover:text-text-primary text-xs"
                title="Tutup outline"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs scrollbar-thin">
              {tocItems.map((item) => {
                const isActive = activeHeadingId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToHeading(item.id)}
                    className={`w-full text-left transition-colors flex items-start gap-1.5 cursor-pointer ${
                      item.level === 3 ? "pl-3 text-[11px]" : "font-medium"
                    } ${
                      isActive
                        ? "text-brand-600 dark:text-brand-400 font-bold"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    <span
                      className={`w-1 h-1 rounded-full mt-1.5 shrink-0 transition-colors ${
                        isActive ? "bg-brand-600 dark:bg-brand-400" : "bg-transparent hover:bg-text-tertiary"
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
        )}
      </div>
    </div>
  );
}
