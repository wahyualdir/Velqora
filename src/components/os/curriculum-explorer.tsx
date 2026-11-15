"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Layers,
  Maximize2,
  Search,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type {
  AcademicDisciplineItem,
  DisciplineCluster,
  LandingStats,
} from "@/actions/study/landing";
import { getTopicStatus, type TopicStatus } from "@/lib/curriculum/status";
import {
  EASE_SMOOTH,
  EditorialEyebrow,
  RevealSection,
  SPRING_GENTLE,
  StaggerContainer,
  StaggerItem,
} from "./motion-primitives";

interface CurriculumExplorerProps {
  disciplines?: AcademicDisciplineItem[];
  clusters?: DisciplineCluster[];
  stats?: LandingStats;
  activeDisciplines?: string[];
  collections?: any[];
  allModules?: any[];
}

const STATUS_BADGE_CLASSES: Record<TopicStatus, string> = {
  verified:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-[#34D399]/10 dark:text-[#34D399] dark:border-[#34D399]/30",
  in_development:
    "bg-amber-50 text-amber-800 border-amber-200 dark:bg-[#E5B567]/10 dark:text-[#E5B567] dark:border-[#E5B567]/30",
  in_progress:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-[#D4664A]/10 dark:text-[#D4664A] dark:border-[#D4664A]/30",
  under_review:
    "bg-[#F3EFE9] text-[#57534E] border-[#E4DDD4] dark:bg-[#24201D] dark:text-[#A8A29E] dark:border-[#292524]",
  coming_soon:
    "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-[#1C1917] dark:text-[#8C857F] dark:border-[#292524]",
};

const STATUS_PRIORITY: Record<TopicStatus, number> = {
  verified: 0,
  in_development: 1,
  in_progress: 2,
  under_review: 3,
  coming_soon: 4,
};

interface DisciplineCardProps {
  item: AcademicDisciplineItem;
  index: number;
  onNavigate?: () => void;
}

function DisciplineCard({ item, index, onNavigate }: DisciplineCardProps) {
  const prefersReduced = useReducedMotion();
  const topicStatus = getTopicStatus(item.slug);
  const badgeClass =
    STATUS_BADGE_CLASSES[topicStatus.status] ?? STATUS_BADGE_CLASSES.coming_soon;

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReduced ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.28,
        delay: prefersReduced ? 0 : Math.min(index * 0.03, 0.24),
        ease: EASE_SMOOTH,
      }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
    >
      <Link
        href={`/dashboard/modul/kategori/${item.slug}`}
        onClick={onNavigate}
        className="group relative h-full p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1917] border border-[#E4DDD4] dark:border-[#292524] hover:border-[#C2553A]/45 hover:dark:border-[#D4664A]/45 hover:bg-white dark:hover:bg-[#221E1B] hover:shadow-md transition-all flex flex-col justify-between gap-4 overflow-hidden"
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-5 top-0 h-[2px] rounded-b-full bg-[#C2553A] dark:bg-[#D4664A] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
        />

        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] font-mono text-[11px] font-semibold text-[#44403C] dark:text-[#E5C194]">
                {item.code}
              </span>
              <span className="text-[11px] font-medium text-[#78716C] dark:text-[#8C857F]">
                {item.degreeLevel.replace("Sarjana ", "")}
              </span>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass}`}
            >
              {topicStatus.badgeLabel}
            </span>
          </div>

          <h4 className="font-display text-base font-bold text-[#1C1917] dark:text-[#F5F5F4] group-hover:text-[#C2553A] dark:group-hover:text-[#D4664A] transition-colors leading-snug">
            {item.title}
          </h4>

          <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E] line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="pt-3 border-t border-[#E4DDD4] dark:border-[#292524] flex items-center justify-between gap-2 text-xs">
          <span className="text-[#6B6560] dark:text-[#8C857F] font-mono text-[11px] tabular-nums">
            {item.chaptersCount} Bab · {item.subchaptersCount.toLocaleString("id-ID")} Subbab
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-[#C2553A] dark:text-[#D4664A] group-hover:translate-x-1 transition-transform duration-200">
            <span>Buka</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

interface FilterTabBarProps {
  tabs: { id: string; label: string; count: number }[];
  selectedId: string;
  onSelect: (id: string) => void;
  layoutGroupId: string;
}

function FilterTabBar({
  tabs,
  selectedId,
  onSelect,
  layoutGroupId,
}: FilterTabBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tabs.map((tab) => {
        const active = selectedId === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelect(tab.id)}
            className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              active
                ? "text-[#FFFBF8]"
                : "bg-[#FAF8F5] dark:bg-[#1C1917] text-[#57534E] dark:text-[#A8A29E] border border-[#E4DDD4] dark:border-[#292524] hover:bg-[#F3EFE9] dark:hover:bg-[#24201D] hover:dark:text-[#F5F5F4]"
            }`}
          >
            {active && (
              <motion.span
                layoutId={layoutGroupId}
                transition={SPRING_GENTLE}
                className="absolute inset-0 rounded-xl bg-[#C2553A] border border-[#D4664A]/45 shadow-2xs"
              />
            )}
            <span className="relative z-10">
              {tab.label} ({tab.count})
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function CurriculumExplorer({
  disciplines = [],
  clusters = [],
  stats,
  allModules,
}: CurriculumExplorerProps) {
  const [showAllModal, setShowAllModal] = useState(false);
  const [showAllInline, setShowAllInline] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Close modal on Escape key
  useEffect(() => {
    if (!showAllModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowAllModal(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showAllModal]);

  const effectiveDisciplines: AcademicDisciplineItem[] = useMemo(() => {
    const base: AcademicDisciplineItem[] =
      disciplines && disciplines.length > 0
        ? disciplines
        : allModules && allModules.length > 0
        ? allModules.map((m: any) => ({
            id: m.id,
            title: m.title,
            slug: m.id.replace("mod-", ""),
            code: "AC-401",
            degreeLevel: m.level || "Sarjana (S1)",
            totalCredits: 4,
            targetRole: "Specialist",
            description: m.category || "Modul Kurikulum Akademik",
            chaptersCount: m.chaptersCount || 12,
            subchaptersCount: (m.chaptersCount || 12) * 10,
            cluster: "ai" as const,
            clusterLabel: m.category || "Kecerdasan Buatan",
            badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
            accentColor: "#C2553A",
          }))
        : [];

    // Sort verified & active topics first for an organized reader-first experience
    return [...base].sort((a, b) => {
      const statusA = getTopicStatus(a.slug);
      const statusB = getTopicStatus(b.slug);
      const rankDiff =
        STATUS_PRIORITY[statusA.status] - STATUS_PRIORITY[statusB.status];
      if (rankDiff !== 0) return rankDiff;
      const prioA = statusA.priorityOrder ?? 999;
      const prioB = statusB.priorityOrder ?? 999;
      if (prioA !== prioB) return prioA - prioB;
      return a.title.localeCompare(b.title);
    });
  }, [disciplines, allModules]);

  const counts = useMemo(() => {
    const result = {
      all: effectiveDisciplines.length,
      verified: 0,
      ai: 0,
      ml: 0,
      data: 0,
      systems: 0,
    };
    for (const d of effectiveDisciplines) {
      if (getTopicStatus(d.slug).status === "verified") {
        result.verified += 1;
      }
      if (d.cluster in result) {
        result[d.cluster] += 1;
      }
    }
    return result;
  }, [effectiveDisciplines]);

  const filteredDisciplines = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return effectiveDisciplines.filter((d) => {
      const matchFilter =
        selectedFilter === "all"
          ? true
          : selectedFilter === "verified"
          ? getTopicStatus(d.slug).status === "verified"
          : d.cluster === selectedFilter;

      const matchSearch =
        !query ||
        d.title.toLowerCase().includes(query) ||
        d.code.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query) ||
        d.targetRole.toLowerCase().includes(query);

      return matchFilter && matchSearch;
    });
  }, [effectiveDisciplines, selectedFilter, searchQuery]);

  const totalDisciplines = stats?.totalDisciplines ?? effectiveDisciplines.length;
  const verifiedDisciplines = stats?.verifiedDisciplines ?? counts.verified;
  const inProgressDisciplines = stats?.inProgressDisciplines ?? 4;

  const isFiltering = selectedFilter !== "all" || searchQuery.trim().length > 0;
  const visibleInlineDisciplines =
    showAllInline || isFiltering
      ? filteredDisciplines
      : filteredDisciplines.slice(0, 6);

  const filterTabs = [
    { id: "all", label: "Semua", count: counts.all },
    { id: "verified", label: "Terverifikasi", count: counts.verified },
    { id: "ai", label: "Kecerdasan Buatan", count: counts.ai },
    { id: "ml", label: "Machine & Deep Learning", count: counts.ml },
    { id: "data", label: "Sains Data", count: counts.data },
    { id: "systems", label: "Sistem & Fondasi", count: counts.systems },
  ];

  const handleClusterSelect = (clusterId: string) => {
    const clusterKey = clusterId.replace("cluster-", "");
    setSelectedFilter(clusterKey);
    const directoryEl = document.getElementById("curriculum-directory");
    if (directoryEl) {
      directoryEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="curriculum-section"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20"
    >
      <RevealSection className="rounded-3xl bg-white dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] p-6 sm:p-10 shadow-xs dark:shadow-[inset_0_1px_0_rgba(255,248,240,0.04)] space-y-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-3 max-w-3xl">
            <EditorialEyebrow index="02" label="Eksplorasi Kurikulum" />

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1C1917] dark:text-[#F5F5F4] tracking-tight">
              Kurikulum Modern Berstandar Industri.
            </h2>

            <p className="text-sm sm:text-base text-[#44403C] dark:text-[#A8A29E] leading-relaxed">
              Mencakup {totalDisciplines} disiplin ilmu dari AI Fundamentals,
              Machine Learning, Deep Learning, Computer Vision, NLP, hingga LLM
              dan Rekayasa Sistem. Sebanyak {verifiedDisciplines} topik telah
              terverifikasi penuh bebas data sintetis dan{" "}
              {inProgressDisciplines} topik sedang dalam penulisan aktif.
            </p>
          </div>

          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.18, ease: EASE_SMOOTH }}
            onClick={() => setShowAllModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E4DDD4] dark:border-[#292524] bg-[#FAF8F5] dark:bg-[#1C1917] hover:border-[#C2553A]/45 hover:dark:border-[#3A3431] hover:bg-[#F3EFE9] dark:hover:bg-[#24201D] text-xs sm:text-sm font-semibold text-[#1C1917] dark:text-[#F5F5F4] transition-colors shrink-0 cursor-pointer self-start lg:self-auto"
          >
            <Maximize2 className="w-4 h-4 text-[#C2553A] dark:text-[#D4664A]" />
            <span>Lihat Daftar Lengkap ({totalDisciplines})</span>
          </motion.button>
        </div>

        {/* 4 Major Academic Clusters */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {clusters.map((cluster) => {
            const clusterKey = cluster.id.replace("cluster-", "");
            const isActiveCluster = selectedFilter === clusterKey;
            return (
              <StaggerItem key={cluster.id}>
                <motion.button
                  type="button"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ duration: 0.2, ease: EASE_SMOOTH }}
                  onClick={() => handleClusterSelect(cluster.id)}
                  className={`relative w-full h-full text-left p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 cursor-pointer group overflow-hidden ${
                    isActiveCluster
                      ? "bg-[#FDF2EE] dark:bg-[#D4664A]/12 border-[#C2553A] dark:border-[#D4664A] shadow-sm"
                      : "bg-[#FAF8F5] dark:bg-[#1C1917] border-[#E4DDD4] dark:border-[#292524] hover:border-[#C2553A]/45 hover:dark:border-[#3A3431] hover:bg-white dark:hover:bg-[#221E1B] hover:shadow-md"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-5 top-0 h-[2px] rounded-b-full transition-transform duration-300 origin-left ${
                      isActiveCluster ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                    style={{ backgroundColor: cluster.accentColor }}
                  />

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="inline-block w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: cluster.accentColor }}
                      />
                      <span className="text-[10.5px] font-mono font-semibold tracking-wider text-[#6B6560] dark:text-[#8C857F] truncate">
                        {cluster.tag.split("//")[1]?.trim() || cluster.tag}
                      </span>
                    </div>

                    <h3 className="font-display text-base font-bold text-[#1C1917] dark:text-[#F5F5F4] group-hover:text-[#C2553A] dark:group-hover:text-[#D4664A] transition-colors leading-snug">
                      {cluster.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E] line-clamp-3 leading-relaxed">
                      {cluster.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E4DDD4] dark:border-[#292524] flex items-center justify-between text-xs font-semibold text-[#C2553A] dark:text-[#D4664A]">
                    <span>{cluster.count} Disiplin Akademik</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </motion.button>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Inline Interactive Curriculum Directory */}
        <div
          id="curriculum-directory"
          className="pt-6 border-t border-[#E4DDD4] dark:border-[#292524] space-y-5 scroll-mt-24"
        >
          {/* Sliding Filter Tabs & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <FilterTabBar
              tabs={filterTabs}
              selectedId={selectedFilter}
              onSelect={setSelectedFilter}
              layoutGroupId="curriculum-filter-pill"
            />

            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C] dark:text-[#8C857F]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari topik atau kode mata kuliah..."
                aria-label="Cari topik kurikulum"
                className="w-full pl-9 pr-9 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#0F0E0D] border border-[#E4DDD4] dark:border-[#292524] text-sm text-[#1C1917] dark:text-[#F5F5F4] placeholder:text-[#78716C] dark:placeholder:text-[#6E6863] focus:outline-none focus:ring-2 focus:ring-[#D4664A]/25 focus:border-[#D4664A] transition-shadow"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Hapus pencarian"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#78716C] dark:text-[#8C857F] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Grid of Discipline Cards */}
          {visibleInlineDisciplines.length > 0 ? (
            <motion.div
              key={`${selectedFilter}-${searchQuery}-${showAllInline}`}
              initial={{ opacity: 0.65 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.22, ease: EASE_SMOOTH }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {visibleInlineDisciplines.map((item, idx) => (
                <DisciplineCard
                  key={`${selectedFilter}-${item.id}`}
                  item={item}
                  index={idx}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-10 text-center rounded-2xl bg-[#FAF8F5] dark:bg-[#1C1917]/60 border border-dashed border-[#E4DDD4] dark:border-[#292524] space-y-2"
            >
              <p className="text-sm font-medium text-[#44403C] dark:text-[#A8A29E]">
                Tidak ada kurikulum yang cocok dengan pencarian Anda.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedFilter("all");
                  setSearchQuery("");
                }}
                className="text-xs font-semibold text-[#C2553A] dark:text-[#D4664A] hover:underline cursor-pointer"
              >
                Reset filter pencarian
              </button>
            </motion.div>
          )}

          {/* Bottom Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2.5">
              {!isFiltering && filteredDisciplines.length > 6 && (
                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.18, ease: EASE_SMOOTH }}
                  onClick={() => setShowAllInline((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C2553A] hover:bg-[#B34B32] text-[#FFFBF8] border border-[#D4664A]/45 text-sm font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>
                    {showAllInline
                      ? "Ringkas Tampilan"
                      : `Tampilkan Semua (${filteredDisciplines.length} Topik)`}
                  </span>
                </motion.button>
              )}

              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.18, ease: EASE_SMOOTH }}
                onClick={() => setShowAllModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E4DDD4] dark:border-[#292524] bg-white dark:bg-[#1C1917] hover:bg-[#F3EFE9] dark:hover:bg-[#24201D] text-sm font-semibold text-[#1C1917] dark:text-[#F5F5F4] transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#C2553A] dark:text-[#D4664A]" />
                <span>Buka Katalog Penuh</span>
              </motion.button>
            </div>

            <span className="text-xs text-[#6B6560] dark:text-[#8C857F]">
              Menampilkan {visibleInlineDisciplines.length} dari{" "}
              {filteredDisciplines.length} topik sesuai filter
            </span>
          </div>
        </div>
      </RevealSection>

      {/* Smooth Animated Modal Explorer */}
      <AnimatePresence>
        {showAllModal && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Katalog Lengkap Kurikulum Velqora"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowAllModal(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={SPRING_GENTLE}
              className="w-full max-w-5xl rounded-3xl bg-white dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] shadow-2xl flex flex-col max-h-[88vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[#E4DDD4] dark:border-[#292524] flex items-center justify-between gap-4 bg-[#FAF8F5] dark:bg-[#1C1917]">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#1C1917] dark:text-[#F5F5F4]">
                    Katalog Kurikulum Akademik Velqora
                  </h3>
                  <p className="text-xs text-[#6B6560] dark:text-[#A8A29E] mt-0.5">
                    {totalDisciplines} disiplin · {verifiedDisciplines} terverifikasi penuh ·{" "}
                    {inProgressDisciplines} progres aktif
                  </p>
                </div>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setShowAllModal(false)}
                  aria-label="Tutup katalog"
                  className="h-9 w-9 rounded-xl border border-[#E4DDD4] dark:border-[#292524] bg-white dark:bg-[#141210] text-[#44403C] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Filters & Search */}
              <div className="px-6 py-4 border-b border-[#E4DDD4] dark:border-[#292524] space-y-3">
                <FilterTabBar
                  tabs={filterTabs}
                  selectedId={selectedFilter}
                  onSelect={setSelectedFilter}
                  layoutGroupId="modal-filter-pill"
                />

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C] dark:text-[#8C857F]" />
                  <input
                    type="text"
                    placeholder="Ketik nama topik, kode mata kuliah, atau peran karir..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#0F0E0D] border border-[#E4DDD4] dark:border-[#292524] text-sm text-[#1C1917] dark:text-[#F5F5F4] placeholder:text-[#78716C] dark:placeholder:text-[#6E6863] focus:outline-none focus:ring-2 focus:ring-[#D4664A]/25 focus:border-[#D4664A]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      aria-label="Hapus pencarian"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] dark:text-[#8C857F] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Modal Scrollable Grid */}
              <div className="p-6 overflow-y-auto flex-1">
                {filteredDisciplines.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDisciplines.map((item, idx) => (
                      <DisciplineCard
                        key={`modal-${selectedFilter}-${item.id}`}
                        item={item}
                        index={idx}
                        onNavigate={() => setShowAllModal(false)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-sm text-[#6B6560] dark:text-[#A8A29E]">
                    Tidak ada kurikulum yang cocok dengan filter pencarian.
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3.5 border-t border-[#E4DDD4] dark:border-[#292524] bg-[#FAF8F5] dark:bg-[#1C1917] flex items-center justify-between gap-3">
                <span className="text-xs text-[#6B6560] dark:text-[#8C857F]">
                  Menampilkan {filteredDisciplines.length} dari{" "}
                  {effectiveDisciplines.length} topik
                </span>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowAllModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#E4DDD4] dark:border-[#292524] bg-white dark:bg-[#141210] hover:bg-[#F3EFE9] dark:hover:bg-[#24201D] text-xs font-semibold text-[#1C1917] dark:text-[#F5F5F4] cursor-pointer"
                >
                  Tutup
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
