"use client";

import React, { useState, useMemo } from "react";
import { OSWindow } from "./os-window";
import { 
  Folder, 
  CheckCircle2, 
  BookOpen, 
  ChevronRight,
  Search,
  Layers,
  Sparkles,
  Database,
  Code2,
  Cpu,
  ExternalLink,
  GraduationCap
} from "lucide-react";
import Link from "next/link";
import { AcademicDisciplineItem, DisciplineCluster } from "@/actions/study/landing";
import { getTopicStatus } from "@/lib/curriculum/status";

interface CurriculumExplorerProps {
  disciplines?: AcademicDisciplineItem[];
  clusters?: DisciplineCluster[];
  activeDisciplines?: string[];
  // Backward compatibility
  collections?: any[];
  allModules?: any[];
}

export function CurriculumExplorer({
  disciplines = [],
  clusters = [],
  activeDisciplines = [
    "Semua",
    "Kecerdasan Buatan & Sistem Cerdas",
    "Fondasi Machine & Deep Learning",
    "Sains Data & Analitika Lanjutan",
    "Rekayasa Perangkat Lunak & Sistem",
  ],
  collections,
  allModules,
}: CurriculumExplorerProps) {
  const [showAllModal, setShowAllModal] = useState(false);
  const [selectedClusterId, setSelectedClusterId] = useState<string>("all");
  const [selectedDisciplineItem, setSelectedDisciplineItem] = useState<AcademicDisciplineItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Gunakan disciplines jika ada, atau konversi dari allModules
  const effectiveDisciplines: AcademicDisciplineItem[] = useMemo(() => {
    if (disciplines && disciplines.length > 0) return disciplines;
    if (allModules && allModules.length > 0) {
      return allModules.map((m: any) => ({
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
      }));
    }
    return [];
  }, [disciplines, allModules]);

  const filteredDisciplines = useMemo(() => {
    return effectiveDisciplines.filter((d) => {
      const matchCluster =
        selectedClusterId === "all" || d.cluster === selectedClusterId;
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        d.title.toLowerCase().includes(query) ||
        d.code.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query) ||
        d.targetRole.toLowerCase().includes(query);
      return matchCluster && matchSearch;
    });
  }, [effectiveDisciplines, selectedClusterId, searchQuery]);

  return (
    <div id="curriculum-section" className="w-full max-w-7xl mx-auto px-2 sm:px-4 my-8">
      <OSWindow
        title="C:\VELQORA\CURRICULUM_EXPLORER"
        icon={<Folder className="w-4 h-4 text-amber-200" />}
        statusText={`28 DISIPLIN AKADEMIK (7 TERVERIFIKASI, 1 PROSES LANJUT, 20 DALAM REVISI) | My Computer`}
        className="shadow-md"
        bodyClassName="p-4 sm:p-6 bg-[#FFFFFF] dark:bg-[#141416] text-[#1C1917] dark:text-zinc-100"
      >
        {/* Windows Explorer Address Bar */}
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-[#E5DDD5] dark:border-zinc-800 font-mono text-xs select-none">
          <span className="text-[#6B6560] dark:text-zinc-400 font-bold">Address</span>
          <div className="flex-1 px-3 py-1 bg-[#FAF8F5] dark:bg-[#1a1a1e] border border-[#D6CEC4] dark:border-zinc-700 text-[#1C1917] dark:text-zinc-200 font-bold flex items-center justify-between">
            <span>C:\Velqora\Curriculum_Explorer\</span>
            <span className="text-[10px] text-[#A89F91] dark:text-zinc-500">7 TERVERIFIKASI · 1 PROSES LANJUT (LLM) · 20 REVISI</span>
          </div>
          <button
            type="button"
            onClick={() => setShowAllModal(true)}
            className="px-3 py-1 vt-btn-chrome text-xs font-bold cursor-pointer"
          >
            Jelajahi (28)
          </button>
        </div>

        {/* Section Header */}
        <div className="space-y-2 mb-6 font-mono">
          <div className="text-xs text-[#C2553A] font-bold tracking-wider uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C2553A] animate-pulse" />
            <span>02 — KURIKULUM &amp; MATERI AKADEMIK · 7 DARI 28 TOPIK TERVERIFIKASI PENUH (1.250 SUBBAB)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-sans text-[#1C1917] dark:text-zinc-100 tracking-tight">
            Kurikulum Modern Berstandar Industri.
          </h2>
          <p className="text-xs sm:text-sm text-[#524B42] dark:text-zinc-400 font-sans max-w-3xl leading-relaxed">
            Mencakup materi mutakhir Kecerdasan Buatan (AI), Machine Learning, Deep Learning, Sains Data, 
            Computer Vision, NLP, hingga Model Bahasa Besar (LLM). 7 dari 28 disiplin terverifikasi penuh bebas data sintetis, 
            LLM mencapai 72% (130 subbab), dan 20 topik lainnya dalam tahap perombakan materi bertahap.
          </p>
        </div>

        {/* Cards Grid: 4 Major Academic Clusters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {clusters.map((cluster) => (
            <div
              key={cluster.id}
              onClick={() => {
                const clusterKey = cluster.id.replace("cluster-", "");
                setSelectedClusterId(clusterKey);
                setShowAllModal(true);
              }}
              className="p-4 bg-[#FAF8F5] dark:bg-[#18181b] border-2 border-t-[#FFFFFF] dark:border-t-zinc-700 border-l-[#FFFFFF] dark:border-l-zinc-700 border-r-[#C5BCB0] dark:border-r-zinc-900 border-b-[#C5BCB0] dark:border-b-zinc-900 flex flex-col justify-between hover:bg-[#F5EFEB] dark:hover:bg-[#202024] transition-all cursor-pointer group shadow-xs hover:shadow-md"
            >
              <div>
                <div 
                  className="text-[10px] font-mono font-bold tracking-wider mb-2"
                  style={{ color: cluster.accentColor }}
                >
                  {cluster.tag}
                </div>
                <h3 className="text-sm font-bold font-sans text-[#1C1917] dark:text-zinc-100 group-hover:text-[#C2553A] transition-colors leading-snug">
                  {cluster.title}
                </h3>
                <p className="text-xs text-[#524B42] dark:text-zinc-400 mt-2 font-sans line-clamp-3 leading-relaxed">
                  {cluster.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E5DDD5] dark:border-zinc-800 font-mono text-xs flex items-center justify-between text-[#C2553A] font-bold group-hover:translate-x-0.5 transition-transform">
                <span className="text-[11px]">{cluster.count} Disiplin Akademik</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Action: Lihat semua modul & materi */}
        <div className="mt-6 pt-4 border-t border-[#E5DDD5] dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedClusterId("all");
              setShowAllModal(true);
            }}
            className="px-5 py-2.5 vt-btn-terracotta text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>Lihat status seluruh 28 disiplin</span>
            <span>▸</span>
          </button>

          <span className="text-xs font-mono text-[#7A756D] dark:text-zinc-400">
            Terhubung langsung dengan database akademik dan status audit rujukan kanonikal
          </span>
        </div>
      </OSWindow>

      {/* Modal: All Modules Breakdown with Search & Filter */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-4xl vt-window shadow-2xl animate-in fade-in zoom-in-95 duration-100 flex flex-col max-h-[85vh]">
            {/* Titlebar */}
            <div className="vt-titlebar px-3 py-1.5 flex items-center justify-between select-none">
              <span className="font-mono text-xs font-bold text-white uppercase flex items-center gap-2">
                <Folder className="w-3.5 h-3.5" />
                <span>DAFTAR 28 KURIKULUM AKADEMIK VELQORA (STATUS AUDIT TRANSPARAN)</span>
              </span>
              <button
                type="button"
                onClick={() => setShowAllModal(false)}
                className="vt-window-btn vt-window-btn-close cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 bg-[#FFFFFF] dark:bg-[#141416] text-[#1C1917] dark:text-zinc-100 font-mono text-xs space-y-3 flex-1 overflow-hidden flex flex-col">
              {/* Header & Search Bar */}
              <div className="space-y-2 pb-2 border-b border-[#E5DDD5] dark:border-zinc-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs text-[#C2553A] font-bold">
                    KURIKULUM AKADEMIK VELQORA (6 TERVERIFIKASI / ONGOING, 22 DALAM REVISI)
                  </div>
                  <span className="text-[11px] text-[#7A756D] dark:text-zinc-400">
                    {filteredDisciplines.length} dari {effectiveDisciplines.length} disiplin ditemukan
                  </span>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedClusterId("all")}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-xs transition-colors cursor-pointer ${
                      selectedClusterId === "all"
                        ? "bg-[#C2553A] text-white font-bold"
                        : "bg-[#FAF8F5] dark:bg-zinc-800 text-[#524B42] dark:text-zinc-300 hover:bg-[#E5DDD5] border border-[#E5DDD5] dark:border-zinc-700"
                    }`}
                  >
                    Semua ({effectiveDisciplines.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedClusterId("ai")}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-xs transition-colors cursor-pointer ${
                      selectedClusterId === "ai"
                        ? "bg-purple-600 text-white font-bold"
                        : "bg-[#FAF8F5] dark:bg-zinc-800 text-[#524B42] dark:text-zinc-300 hover:bg-[#E5DDD5] border border-[#E5DDD5] dark:border-zinc-700"
                    }`}
                  >
                    Kecerdasan Buatan (12)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedClusterId("ml")}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-xs transition-colors cursor-pointer ${
                      selectedClusterId === "ml"
                        ? "bg-blue-600 text-white font-bold"
                        : "bg-[#FAF8F5] dark:bg-zinc-800 text-[#524B42] dark:text-zinc-300 hover:bg-[#E5DDD5] border border-[#E5DDD5] dark:border-zinc-700"
                    }`}
                  >
                    Machine &amp; Deep Learning (6)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedClusterId("data")}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-xs transition-colors cursor-pointer ${
                      selectedClusterId === "data"
                        ? "bg-emerald-600 text-white font-bold"
                        : "bg-[#FAF8F5] dark:bg-zinc-800 text-[#524B42] dark:text-zinc-300 hover:bg-[#E5DDD5] border border-[#E5DDD5] dark:border-zinc-700"
                    }`}
                  >
                    Sains Data &amp; Analitika (6)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedClusterId("systems")}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-xs transition-colors cursor-pointer ${
                      selectedClusterId === "systems"
                        ? "bg-amber-600 text-white font-bold"
                        : "bg-[#FAF8F5] dark:bg-zinc-800 text-[#524B42] dark:text-zinc-300 hover:bg-[#E5DDD5] border border-[#E5DDD5] dark:border-zinc-700"
                    }`}
                  >
                    Sistem &amp; Rekayasa (4)
                  </button>
                </div>

                {/* Search Input Box */}
                <div className="relative pt-1">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-[#A89F91]" />
                  <input
                    type="text"
                    placeholder="Ketik nama topik, kode, atau peran karir..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-[#FAF8F5] dark:bg-zinc-900 border border-[#D6CEC4] dark:border-zinc-700 text-[#1C1917] dark:text-zinc-200 text-xs font-mono focus:outline-none focus:border-[#C2553A]"
                  />
                </div>
              </div>

              {/* Disciplines Table / List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {filteredDisciplines.map((item) => {
                  const topicStatus = getTopicStatus(item.slug);
                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-[#FAF8F5] dark:bg-zinc-900/60 border border-[#E5DDD5] dark:border-zinc-800 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F5EFEB] dark:hover:bg-zinc-800/80 transition-colors"
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded-xs bg-[#E5DDD5] dark:bg-zinc-800 text-[#1C1917] dark:text-zinc-200 text-[10px] font-bold">
                            {item.code}
                          </span>
                          <h4 className="font-bold font-sans text-xs text-[#1C1917] dark:text-zinc-100">
                            {item.title}
                          </h4>
                          <span className={`px-1.5 py-0.2 rounded-xs text-[9px] font-bold border ${
                            topicStatus.status === "verified"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                              : topicStatus.status === "in_development"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700"
                          }`}>
                            {topicStatus.badgeLabel}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            ({item.totalCredits} SKS · {item.degreeLevel})
                          </span>
                        </div>
                        <p className="text-[11px] text-[#524B42] dark:text-zinc-400 font-sans line-clamp-1">
                          {item.description}
                        </p>
                        <div className="text-[10px] text-zinc-500">
                          {item.chaptersCount} Bab · {item.subchaptersCount} Subbab · Target: {item.targetRole}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <Link
                          href={`/dashboard/modul/kategori/${item.slug}`}
                          onClick={() => setShowAllModal(false)}
                          className="px-3 py-1.5 vt-btn-terracotta text-[11px] font-bold flex items-center gap-1"
                        >
                          <span>Buka di Reader</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}

                {filteredDisciplines.length === 0 && (
                  <div className="text-center py-8 text-zinc-500 text-xs">
                    Tidak ada kurikulum yang cocok dengan filter pencarian.
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-[#E5DDD5] dark:border-zinc-800 flex items-center justify-between">
                <span className="text-[11px] text-[#7A756D] dark:text-zinc-400">
                  Total Kurikulum: 28 Topik (7 Terverifikasi Penuh, 1 Proses Lanjut [LLM], 20 Dalam Revisi)
                </span>
                <button
                  type="button"
                  onClick={() => setShowAllModal(false)}
                  className="px-4 py-1.5 vt-btn-chrome text-xs font-bold cursor-pointer"
                >
                  Tutup Jendela
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
