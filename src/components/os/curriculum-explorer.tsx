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
  Cpu
} from "lucide-react";
import Link from "next/link";
import { CollectionItem, ModuleItem } from "@/actions/study/landing";

interface CurriculumExplorerProps {
  collections?: CollectionItem[];
  allModules?: ModuleItem[];
  activeDisciplines?: string[];
}

export function CurriculumExplorer({
  collections = [],
  allModules = [],
  activeDisciplines = ["Semua", "Kecerdasan Buatan", "Data Analytics", "Algoritma & Struktur Data", "Rekayasa Web"],
}: CurriculumExplorerProps) {
  const [showAllModal, setShowAllModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<CollectionItem | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredModules = useMemo(() => {
    return allModules.filter((m) => {
      const matchDiscipline =
        selectedDiscipline === "Semua" ||
        (m.category && m.category.toLowerCase().includes(selectedDiscipline.toLowerCase()));
      const matchSearch =
        !searchQuery.trim() ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.category && m.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchDiscipline && matchSearch;
    });
  }, [allModules, selectedDiscipline, searchQuery]);

  return (
    <div id="curriculum-section" className="w-full max-w-7xl mx-auto px-2 sm:px-4 my-8">
      <OSWindow
        title="C:\VELQORA\CURRICULUM_EXPLORER"
        icon={<Folder className="w-4 h-4 text-amber-200" />}
        statusText={`${collections.length} domain kurikulum | ${allModules.length}+ modul akademik | My Computer`}
        className="shadow-md"
        bodyClassName="p-4 sm:p-6 bg-[#FFFFFF] dark:bg-[#141416] text-[#1C1917] dark:text-zinc-100"
      >
        {/* Windows Explorer Address Bar */}
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-[#E5DDD5] dark:border-zinc-800 font-mono text-xs select-none">
          <span className="text-[#6B6560] dark:text-zinc-400 font-bold">Address</span>
          <div className="flex-1 px-3 py-1 bg-[#FAF8F5] dark:bg-[#1a1a1e] border border-[#D6CEC4] dark:border-zinc-700 text-[#1C1917] dark:text-zinc-200 font-bold flex items-center justify-between">
            <span>C:\Velqora\Curriculum_Explorer\</span>
            <span className="text-[10px] text-[#A89F91] dark:text-zinc-500">LIVE SYLLABUS</span>
          </div>
          <button
            type="button"
            onClick={() => setShowAllModal(true)}
            className="px-3 py-1 vt-btn-chrome text-xs font-bold"
          >
            Jelajahi
          </button>
        </div>

        {/* Section Header */}
        <div className="space-y-2 mb-6 font-mono">
          <div className="text-xs text-[#C2553A] font-bold tracking-wider uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C2553A] animate-pulse" />
            <span>02 — KURIKULUM &amp; MATERI TERSTANDARISASI · {collections.length} DOMAIN UTAMA</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-sans text-[#1C1917] dark:text-zinc-100 tracking-tight">
            Kurikulum Modern Berstandar Industri.
          </h2>
          <p className="text-xs sm:text-sm text-[#524B42] dark:text-zinc-400 font-sans max-w-3xl leading-relaxed">
            Mencakup materi mutakhir Kecerdasan Buatan (AI), Data Analytics Python, Algoritma Lanjutan, 
            hingga Rekayasa Web Modern. Disusun bertahap mengikuti kurikulum baku perkuliahan dengan studi kasus riil.
          </p>
        </div>

        {/* Cards Grid (Dynamic Collections) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {collections.map((col) => (
            <div
              key={col.id}
              onClick={() => setSelectedCollection(col)}
              className="p-4 bg-[#FAF8F5] dark:bg-[#18181b] border-2 border-t-[#FFFFFF] dark:border-t-zinc-700 border-l-[#FFFFFF] dark:border-l-zinc-700 border-r-[#C5BCB0] dark:border-r-zinc-900 border-b-[#C5BCB0] dark:border-b-zinc-900 flex flex-col justify-between hover:bg-[#F5EFEB] dark:hover:bg-[#202024] transition-all cursor-pointer group shadow-xs hover:shadow-md"
            >
              <div>
                <div 
                  className="text-[10px] font-mono font-bold tracking-wider mb-2"
                  style={{ color: col.accentColor }}
                >
                  {col.tag}
                </div>
                <h3 className="text-sm font-bold font-sans text-[#1C1917] dark:text-zinc-100 group-hover:text-[#C2553A] transition-colors leading-snug">
                  {col.title}
                </h3>
                <p className="text-xs text-[#524B42] dark:text-zinc-400 mt-2 font-sans line-clamp-3 leading-relaxed">
                  {col.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E5DDD5] dark:border-zinc-800 font-mono text-xs flex items-center justify-between text-[#C2553A] font-bold group-hover:translate-x-0.5 transition-transform">
                <span className="text-[11px]">{col.lessonCount}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Action: Lihat semua modul & materi */}
        <div className="mt-6 pt-4 border-t border-[#E5DDD5] dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowAllModal(true)}
            className="px-5 py-2.5 vt-btn-terracotta text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm"
          >
            <span>Lihat semua {allModules.length}+ modul &amp; materi</span>
            <span>▸</span>
          </button>

          <span className="text-xs font-mono text-[#7A756D] dark:text-zinc-400">
            Terhubung langsung dengan database akademik dan repositori proyek
          </span>
        </div>
      </OSWindow>

      {/* Modal: All Modules Breakdown with Search & Filter */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-3xl vt-window shadow-2xl animate-in fade-in zoom-in-95 duration-100">
            <div className="vt-titlebar px-3 py-1.5 flex items-center justify-between select-none">
              <span className="font-mono text-xs font-bold text-white uppercase flex items-center gap-2">
                <Folder className="w-3.5 h-3.5" />
                <span>DAFTAR LENGKAP KURIKULUM &amp; MATERI AKADEMIK</span>
              </span>
              <button
                type="button"
                onClick={() => setShowAllModal(false)}
                className="vt-window-btn vt-window-btn-close"
              >
                ×
              </button>
            </div>

            <div className="p-4 sm:p-5 bg-[#FFFFFF] dark:bg-[#141416] text-[#1C1917] dark:text-zinc-100 font-mono text-xs space-y-3 max-h-[80vh] flex flex-col">
              {/* Header & Search Bar */}
              <div className="space-y-2 pb-2 border-b border-[#E5DDD5] dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-[#C2553A] font-bold">
                    KURIKULUM AKADEMIK RESMI VELQORA
                  </div>
                  <span className="text-[11px] text-[#7A756D] dark:text-zinc-400">
                    {filteredModules.length} materi ditemukan
                  </span>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {activeDisciplines.map((discipline) => (
                    <button
                      key={discipline}
                      type="button"
                      onClick={() => setSelectedDiscipline(discipline)}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded-xs transition-colors ${
                        selectedDiscipline === discipline
                          ? "bg-[#C2553A] text-white font-bold"
                          : "bg-[#FAF8F5] dark:bg-zinc-800 text-[#524B42] dark:text-zinc-300 hover:bg-[#E5DDD5] border border-[#E5DDD5] dark:border-zinc-700"
                      }`}
                    >
                      {discipline}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="relative flex items-center pt-1">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 text-[#8A8378]" />
                  <input
                    type="text"
                    placeholder="Cari materi (misal: AI, Python, Algoritma, React)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-[#FAF8F5] dark:bg-[#18181b] border border-[#D6CEC4] dark:border-zinc-700 text-xs font-sans text-[#1C1917] dark:text-zinc-100 placeholder:text-[#8A8378] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Module List Scrollable */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-[#E5DDD5] dark:divide-zinc-800">
                {filteredModules.length === 0 ? (
                  <div className="py-8 text-center text-[#7A756D] dark:text-zinc-400">
                    Tidak ada materi yang sesuai dengan filter pencarian.
                  </div>
                ) : (
                  filteredModules.map((m, idx) => (
                    <div key={m.id} className="pt-2 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-[#C2553A] min-w-[32px]">
                          [{String(idx + 1).padStart(2, "0")}]
                        </span>
                        <div>
                          <span className="text-[#1C1917] dark:text-zinc-200 font-semibold text-xs block">
                            {m.title}
                          </span>
                          {m.category && (
                            <span className="text-[10px] text-[#7A756D] dark:text-zinc-400 font-mono">
                              {m.category} · Level: {m.level || "Standar"}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-[#7A756D] dark:text-zinc-400 whitespace-nowrap bg-[#FAF8F5] dark:bg-zinc-800/80 px-2 py-0.5 border border-[#E5DDD5] dark:border-zinc-700 shrink-0">
                        {m.dur || "3 SKS"}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Modal Actions */}
              <div className="pt-3 border-t border-[#E5DDD5] dark:border-zinc-800 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAllModal(false)}
                  className="px-4 py-2 vt-btn-chrome text-xs font-bold"
                >
                  Tutup
                </button>
                <Link
                  href="/dashboard/modul"
                  className="px-4 py-2 vt-btn-terracotta text-xs font-bold flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Buka Katalog Modul</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Collection Detail */}
      {selectedCollection && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl vt-window shadow-2xl animate-in fade-in zoom-in-95 duration-100">
            <div className="vt-titlebar px-3 py-1.5 flex items-center justify-between select-none">
              <span className="font-mono text-xs font-bold text-white uppercase">
                PROPERTIES — {selectedCollection.tag}
              </span>
              <button
                type="button"
                onClick={() => setSelectedCollection(null)}
                className="vt-window-btn vt-window-btn-close"
              >
                ×
              </button>
            </div>

            <div className="p-5 bg-[#FFFFFF] dark:bg-[#141416] text-[#1C1917] dark:text-zinc-100 font-mono text-xs space-y-4">
              <div>
                <span className="text-[10px] text-[#C2553A] font-bold">DOMAIN KURIKULUM</span>
                <h3 className="text-base font-bold text-[#1C1917] dark:text-zinc-100 mt-1">{selectedCollection.title}</h3>
                <p className="text-xs text-[#524B42] dark:text-zinc-400 mt-2 leading-relaxed">{selectedCollection.description}</p>
              </div>

              <div className="space-y-1.5 bg-[#FAF8F5] dark:bg-[#1a1a1e] p-3 border border-[#E5DDD5] dark:border-zinc-700 rounded-xs">
                <div className="font-bold text-[#C2553A] text-[11px] mb-1">Cakupan Materi:</div>
                {selectedCollection.modulesIncluded.map((modTitle, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-700 dark:text-zinc-300 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{modTitle}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E5DDD5] dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setSelectedCollection(null)}
                  className="px-4 py-2 vt-btn-chrome text-xs font-bold"
                >
                  Tutup
                </button>
                <Link
                  href="/dashboard/modul"
                  className="px-4 py-2 vt-btn-terracotta text-xs font-bold flex items-center gap-1"
                >
                  <span>Pelajari Sekarang</span>
                  <span>▸</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
