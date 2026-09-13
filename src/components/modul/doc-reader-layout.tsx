"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  BookOpen,
  Layers,
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  ExternalLink,
  Sparkles,
  LayoutGrid,
  FileText,
} from "lucide-react";
import { NoteRenderer } from "@/components/notes/note-renderer";
import { CodeBlock } from "@/components/ui/code-block";
import { Button } from "@/components/ui/button";
import { getCategoryIconComponent } from "./category-icon";
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

/**
 * Builds rich, comprehensive markdown if a section lacks full pre-rendered markdown content.
 */
function getEffectiveMarkdown(section: DocSectionItem, categoryName: string): string {
  if (section.content_markdown && section.content_markdown.trim().length > 30) {
    return section.content_markdown;
  }

  // Generate structured academic documentation markdown with mathematical rigor & code
  const title = section.title || "Dokumentasi Modul";
  const desc = section.description || "Panduan komprehensif konsep teknis, formulasi matematis, dan implementasi kode praktis.";
  const snippets = section.codeSnippets || [];

  let md = `# ${title}\n\n`;
  md += `> **Topik:** ${categoryName} | **Velqora Documentation & Curriculum**\n\n`;
  md += `## 1. Ikhtisar & Landasan Teori\n\n${desc}\n\n`;

  // Mathematical formulation if related to regression / linear models / scikit-learn
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("regresi") || lowerTitle.includes("regression") || lowerTitle.includes("linear")) {
    md += `## 2. Formulasi Matematis (Mathematical Formulation)\n\n`;
    md += `Pada model **Ridge Regression** (Tikhonov Regularization), fungsi objektif meminimalkan *penalized residual sum of squares*:\n\n`;
    md += `$$\\min_{w} \\|Xw - y\\|_2^2 + \\alpha \\|w\\|_2^2$$\n\n`;
    md += `Di mana parameter kompleksitas $\\alpha \\ge 0$ mengontrol derajat penalti shrinkage. Semakin besar nilai $\\alpha$, semakin besar penalti penyusutan koefisien, sehingga model lebih tangguh terhadap masalah multikolinearitas antar fitur.\n\n`;
    md += `Sedangkan pada **Lasso Regression** (Least Absolute Shrinkage and Selection Operator), penalti menggunakan norma $\\ell_1$ yang mendorong penipisan fitur (*sparse coefficients*):\n\n`;
    md += `$$\\min_{w} \\frac{1}{2n_{\\text{samples}}} \\|Xw - y\\|_2^2 + \\alpha \\|w\\|_1$$\n\n`;
  } else if (lowerTitle.includes("klasifikasi") || lowerTitle.includes("classification") || lowerTitle.includes("churn")) {
    md += `## 2. Formulasi Matematis (Mathematical Formulation)\n\n`;
    md += `Pada model **Logistic Regression**, probabilitas posterior dimodelkan dengan fungsi sigmoid $\\sigma(z)$:\n\n`;
    md += `$$P(y=1|x) = \\sigma(w^T x + b) = \\frac{1}{1 + e^{-(w^T x + b)}}$$\n\n`;
    md += `Dan dioptimalkan menggunakan fungsi rugi *Binary Cross-Entropy (Log-Loss)*:\n\n`;
    md += `$$\\mathcal{L}(w) = -\\frac{1}{N} \\sum_{i=1}^{N} \\left[ y_i \\log(\\hat{y}_i) + (1 - y_i) \\log(1 - \\hat{y}_i) \\right] + \\frac{1}{2C} \\|w\\|_2^2$$\n\n`;
  } else if (lowerTitle.includes("cluster") || lowerTitle.includes("kluster") || lowerTitle.includes("unsupervised")) {
    md += `## 2. Formulasi Matematis (Mathematical Formulation)\n\n`;
    md += `Pada algoritma **K-Means Clustering**, tujuannya adalah meminimalkan inersia (*within-cluster sum of squares*):\n\n`;
    md += `$$\\arg\\min_S \\sum_{i=1}^{k} \\sum_{x \\in S_i} \\|x - \\mu_i\\|^2$$\n\n`;
    md += `Di mana $\\mu_i$ adalah titik sentroid dari partisi kluster $S_i$.\n\n`;
  } else if (lowerTitle.includes("pca") || lowerTitle.includes("dimensi") || lowerTitle.includes("dekomposisi")) {
    md += `## 2. Formulasi Matematis (Mathematical Formulation)\n\n`;
    md += `Principal Component Analysis (PCA) mencari arah varians maksimal dengan melakukan dekomposisi nilai singular (*Singular Value Decomposition* / SVD) pada matriks kovarians terpusat $X$:\n\n`;
    md += `$$X = U \\Sigma V^T$$\n\n`;
    md += `Di mana kolom-kolom pada matriks $V$ merupakan vektor eigen (*principal components*) dan kuadrat nilai diagonal $\\Sigma$ menyatakan proporsi varians yang dijelaskan.\n\n`;
  }

  if (snippets.length > 0) {
    md += `## 3. Contoh Implementasi Kode Praktis\n\n`;
    for (const snip of snippets) {
      if (snip.caption) {
        md += `#### *${snip.caption}*\n`;
      }
      md += `\`\`\`${snip.language || "python"}\n${snip.code}\n\`\`\`\n\n`;
    }
  }

  md += `## 4. Parameter Kunci & Praktik Terbaik (Best Practices)\n\n`;
  md += `- **Penskalaan Data**: Selalu lakukan feature scaling (\`StandardScaler\` atau \`RobustScaler\`) sebelum melatih estimator yang sensitif terhadap skala fitur seperti Ridge, Lasso, SVM, atau K-Means.\n`;
  md += `- **Pencegahan Data Leakage**: Gunakan \`Pipeline\` dari Scikit-learn agar transformasi data hanya dihitung dari data training saat proses cross-validation.\n`;
  md += `- **Reproducibility**: Selalu tentukan \`random_state\` agar hasil evaluasi eksperimen dapat direplikasi secara konsisten.\n`;

  return md;
}

export function DocReaderLayout({
  categoryName,
  categoryId,
  themeColor = "#8B5CF6",
  categoryIcon = "machine_learning",
  sections,
  activeSectionId,
  onSelectSection,
  onToggleViewMode,
  viewMode = "doc",
}: DocReaderLayoutProps) {
  // Sidebar collapsed state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Fullscreen focus reading mode
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Section search query
  const [searchQuery, setSearchQuery] = useState("");
  // Selected section state
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (activeSectionId) return activeSectionId;
    return sections[0]?.id || "";
  });

  const contentRef = useRef<HTMLDivElement>(null);

  // Sync active section if prop updates
  useEffect(() => {
    if (activeSectionId && activeSectionId !== selectedId) {
      setSelectedId(activeSectionId);
    }
  }, [activeSectionId, selectedId]);

  // Scroll to top when selected section changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedId]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onSelectSection?.(id);
  };

  // Filtered sections by search
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase().trim();
    return sections.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (s.description || "").toLowerCase().includes(q)
    );
  }, [sections, searchQuery]);

  // Find active section object & previous/next for bottom navigation
  const activeIndex = sections.findIndex((s) => s.id === selectedId);
  const currentSection =
    activeIndex >= 0 ? sections[activeIndex] : sections[0] || null;
  const prevSection = activeIndex > 0 ? sections[activeIndex - 1] : null;
  const nextSection =
    activeIndex >= 0 && activeIndex < sections.length - 1
      ? sections[activeIndex + 1]
      : null;

  const currentMarkdown = useMemo(() => {
    if (!currentSection) return "";
    return getEffectiveMarkdown(currentSection, categoryName);
  }, [currentSection, categoryName]);

  const CategoryIconComponent = getCategoryIconComponent(categoryIcon);

  return (
    <div
      className={`flex flex-col border border-border rounded-2xl bg-surface overflow-hidden shadow-sm transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-2 z-50 rounded-xl shadow-2xl h-[calc(100vh-16px)]"
          : "h-[calc(100vh-150px)] min-h-[640px]"
      }`}
    >
      {/* ─── Top Documentation Bar ─── */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-surface-secondary border-b border-border select-none shrink-0 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Collapse/Expand Sidebar Trigger button (like Scikit-Learn) */}
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-xs font-mono font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer shrink-0"
            title={sidebarCollapsed ? "Buka Sidebar Navigasi" : "Tutup Sidebar Navigasi"}
          >
            {sidebarCollapsed ? (
              <>
                <PanelLeftOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span className="hidden sm:inline">Expand Sidebar</span>
              </>
            ) : (
              <>
                <PanelLeftClose className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span className="hidden sm:inline">Collapse Sidebar</span>
              </>
            )}
          </button>

          {/* Breadcrumb Context */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-text-tertiary truncate">
            <Link
              href="/dashboard/modul"
              className="hover:text-text-primary hover:underline transition-colors shrink-0"
            >
              Modul AI
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
            <div className="flex items-center gap-1 text-text-secondary font-medium shrink-0">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: themeColor }}
              />
              <span>{categoryName}</span>
            </div>
            {currentSection && (
              <>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60 hidden md:inline" />
                <span className="text-text-primary font-bold truncate hidden md:inline">
                  {currentSection.title}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onToggleViewMode && (
            <button
              type="button"
              onClick={onToggleViewMode}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-xs font-mono text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              title="Beralih ke Tampilan Grid Kartu"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tampilan Kartu</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Tautan materi berhasil disalin!");
              }
            }}
            className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            title="Salin tautan modul ini"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
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

      {/* ─── Main 2-Column Documentation Area ─── */}
      <div className="flex flex-1 min-h-0 relative overflow-hidden bg-[#FFFFFF] dark:bg-[#121214]">
        {/* ── Left Sidebar (Section Navigation) ── */}
        <aside
          className={`flex flex-col border-r border-border bg-[#FAF8F5] dark:bg-[#18181B] transition-all duration-300 select-none shrink-0 ${
            sidebarCollapsed
              ? "w-0 -translate-x-full opacity-0 pointer-events-none border-r-0"
              : "w-72 sm:w-80 lg:w-84 translate-x-0 opacity-100"
          }`}
        >
          {/* Section Navigation Header */}
          <div className="p-3.5 border-b border-border/80 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>Section Navigation</span>
              </h3>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border text-text-tertiary">
                {sections.length} Bab
              </span>
            </div>

            {/* Quick search inside chapters */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-text-tertiary pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari bab atau materi..."
                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Section Tree List */}
          <nav className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
            {filteredSections.map((sec, idx) => {
              const isSelected = sec.id === selectedId;
              const sectionNumber = idx + 1;

              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => handleSelect(sec.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-start justify-between gap-2 group cursor-pointer ${
                    isSelected
                      ? "bg-surface text-brand-600 dark:text-brand-400 font-bold border-l-3 border-brand-600 shadow-2xs"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface/60"
                  }`}
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <span
                      className={`text-[11px] font-mono shrink-0 mt-0.5 ${
                        isSelected
                          ? "text-brand-600 dark:text-brand-400 font-bold"
                          : "text-text-tertiary"
                      }`}
                    >
                      {sectionNumber}.
                    </span>
                    <span className="leading-snug line-clamp-2">
                      {sec.title.replace(/^BAB\s*\d+\s*:\s*/i, "")}
                    </span>
                  </div>

                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 mt-0.5 transition-transform ${
                      isSelected
                        ? "text-brand-600 dark:text-brand-400 transform translate-x-0.5"
                        : "text-text-tertiary opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </button>
              );
            })}

            {filteredSections.length === 0 && (
              <div className="p-4 text-center text-xs text-text-tertiary font-mono">
                Tidak ada materi yang sesuai &quot;{searchQuery}&quot;
              </div>
            )}
          </nav>

          {/* Bottom Sidebar Category Summary */}
          <div className="p-3 border-t border-border/80 bg-surface/40 flex items-center justify-between text-[11px] font-mono text-text-tertiary">
            <span className="truncate">{categoryName}</span>
            <span className="text-brand-600 dark:text-brand-400 font-semibold shrink-0">
              Dokumentasi Resmi
            </span>
          </div>
        </aside>

        {/* ── Right Content Pane (Main Documentation Reader) ── */}
        <main
          ref={contentRef}
          className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 max-w-5xl mx-auto scrollbar-thin"
        >
          {currentSection ? (
            <article className="space-y-6">
              {/* Document Header */}
              <div className="space-y-2 border-b border-border/70 pb-5">
                <div className="flex items-center gap-2 text-xs font-mono text-text-tertiary">
                  <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold border border-brand-500/20">
                    Bab {activeIndex + 1} dari {sections.length}
                  </span>
                  <span>•</span>
                  <span>{categoryName}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight font-display">
                  {currentSection.title}
                </h1>

                {currentSection.description && (
                  <p className="text-sm text-text-secondary leading-relaxed font-sans max-w-3xl">
                    {currentSection.description}
                  </p>
                )}
              </div>

              {/* Rendered Markdown Body with LaTeX & Code */}
              <div className="py-2">
                <NoteRenderer content={currentMarkdown} />
              </div>

              {/* Bottom Pagination Navigation (Prev / Next Section) */}
              <nav
                aria-label="Navigasi Halaman Dokumentasi"
                className="mt-12 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {prevSection ? (
                  <button
                    type="button"
                    onClick={() => handleSelect(prevSection.id)}
                    className="flex flex-col items-start p-3.5 rounded-xl border border-border hover:border-brand-500/40 bg-surface hover:bg-surface-secondary/50 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-[11px] font-mono text-text-tertiary flex items-center gap-1 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                      <ArrowLeft className="w-3 h-3" />
                      <span>Bab Sebelumnya</span>
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-text-primary line-clamp-1 mt-0.5">
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
                    className="flex flex-col items-end p-3.5 rounded-xl border border-border hover:border-brand-500/40 bg-surface hover:bg-surface-secondary/50 text-right transition-all cursor-pointer group sm:col-start-2"
                  >
                    <span className="text-[11px] font-mono text-text-tertiary flex items-center gap-1 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                      <span>Bab Selanjutnya</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-text-primary line-clamp-1 mt-0.5">
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
      </div>
    </div>
  );
}
