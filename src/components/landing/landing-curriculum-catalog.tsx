"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  BookOpen, 
  ArrowRight, 
  Layers, 
  GraduationCap, 
  Clock, 
  Briefcase, 
  CheckCircle2, 
  Sparkles 
} from "lucide-react";
import { AcademicDisciplineItem, DisciplineCluster } from "@/actions/study/landing";

interface LandingCurriculumCatalogProps {
  disciplines: AcademicDisciplineItem[];
  clusters: DisciplineCluster[];
}

export function LandingCurriculumCatalog({
  disciplines = [],
  clusters = [],
}: LandingCurriculumCatalogProps) {
  const [selectedCluster, setSelectedCluster] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredDisciplines = useMemo(() => {
    return disciplines.filter((d) => {
      const matchCluster =
        selectedCluster === "all" || d.cluster === selectedCluster;
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        d.title.toLowerCase().includes(query) ||
        d.code.toLowerCase().includes(query) ||
        d.targetRole.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query);

      return matchCluster && matchSearch;
    });
  }, [disciplines, selectedCluster, searchQuery]);

  return (
    <section id="curriculum-catalog" className="py-24 bg-[#FAF8F5] dark:bg-zinc-950 border-b border-zinc-200/60 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3EF] dark:bg-[#C2553A]/10 border border-[#C2553A]/30 text-xs font-mono font-semibold text-[#C2553A] mb-3">
              <span>EXPLORER KURIKULUM 28 TOPIK</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Katalog Lengkap Disiplin Akademik.
            </h2>
            <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Disusun secara hierarkis mengikuti silabus standar perguruan tinggi bereputasi tinggi. 
              Mencakup total <strong className="text-zinc-900 dark:text-zinc-200">373 bab</strong> dan <strong className="text-zinc-900 dark:text-zinc-200">3.680 subbab</strong> materi mendalam.
            </p>
          </div>

          {/* Live Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Cari topik, kode, atau peran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#C2553A] shadow-xs"
            />
          </div>
        </div>

        {/* Cluster Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => setSelectedCluster("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCluster === "all"
                ? "bg-[#C2553A] text-white shadow-xs"
                : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
            }`}
          >
            Semua Disiplin ({disciplines.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedCluster("ai")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCluster === "ai"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
            }`}
          >
            Kecerdasan Buatan (12)
          </button>

          <button
            type="button"
            onClick={() => setSelectedCluster("ml")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCluster === "ml"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
            }`}
          >
            Machine &amp; Deep Learning (6)
          </button>

          <button
            type="button"
            onClick={() => setSelectedCluster("data")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCluster === "data"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
            }`}
          >
            Sains Data &amp; Analitika (6)
          </button>

          <button
            type="button"
            onClick={() => setSelectedCluster("systems")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCluster === "systems"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
            }`}
          >
            Sistem &amp; Rekayasa (4)
          </button>
        </div>

        {/* 28 Disciplinary Topic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDisciplines.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 p-6 flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {item.code}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${item.badgeColor}`}>
                    {item.totalCredits} SKS · {item.degreeLevel}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight mb-2 group-hover:text-[#C2553A] dark:group-hover:text-[#C2553A] transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3 mb-4">
                  {item.description}
                </p>

                {/* Career Role */}
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
                  <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="truncate">{item.targetRole}</span>
                </div>
              </div>

              {/* Card Footer: Metrics & Link */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
                  <span>{item.chaptersCount} Bab</span>
                  <span>·</span>
                  <span>{item.subchaptersCount} Subbab</span>
                </div>

                <Link
                  href={`/dashboard/modul/kategori/${item.slug}`}
                  className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-[#C2553A] hover:text-white text-zinc-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1 transition-all group-hover:bg-[#C2553A] group-hover:text-white"
                  title={`Pelajari ${item.title}`}
                >
                  <span>Buka Modul</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDisciplines.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 text-sm">
              Tidak ada topik kurikulum yang cocok dengan kata kunci &quot;{searchQuery}&quot;.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
