"use client";

import React, { useState } from "react";
import { OSWindow } from "./os-window";
import { 
  Folder, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  ExternalLink,
  ChevronRight,
  Search,
  Layers,
  Code2,
  Database,
  Container
} from "lucide-react";
import Link from "next/link";

interface CollectionItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  moduleCount: string;
  lessonCount: string;
  modulesIncluded: string[];
  accentColor: string;
}

const COLLECTIONS: CollectionItem[] = [
  {
    id: "col-1",
    tag: "01 // FONDASI WEB",
    title: "Fondasi Client-Server, Semantik, & Asinkron",
    description: "Memahami batas runtime browser vs server, standar aksesibilitas WCAG 2.2 AA, dan internal loop JavaScript tanpa asumsi keliru.",
    moduleCount: "Modul 01, 02, 03",
    lessonCount: "3 MODUL LENGKAP →",
    modulesIncluded: [
      "Modul 01: Pengantar Pengembangan Web Modern & Runtime Boundary",
      "Modul 02: HTML5 Semantik, Aksesibilitas WCAG 2.2, & CSS Modern",
      "Modul 03: JavaScript ES6+ & Asynchronous Event Loop",
    ],
    accentColor: "#C2553A",
  },
  {
    id: "col-2",
    tag: "02 // REACT & NEXT.JS",
    title: "Arsitektur React 19 & Next.js 15 App Router",
    description: "Declarative UI mental model, server-client boundaries, Next.js 15 async params, dan mutasi data server actions dengan validasi Zod.",
    moduleCount: "Modul 04, 05, 06",
    lessonCount: "3 MODUL LENGKAP →",
    modulesIncluded: [
      "Modul 04: Pengantar React: Komponen, Props, & State Reconciliation",
      "Modul 05: Routing Modern dengan Next.js App Router & Layouts",
      "Modul 06: Data Fetching & Server Actions di Next.js",
    ],
    accentColor: "#C2553A",
  },
  {
    id: "col-3",
    tag: "03 // STATE & STYLING",
    title: "State Lanjutan, Tailwind AOT, & Design Tokens",
    description: "Eliminasi re-render storm via Zustand, component variants CVA type-safe, headless accessible primitives Radix UI, dan token Dark Mode.",
    moduleCount: "Modul 07, 08",
    lessonCount: "2 MODUL LENGKAP →",
    modulesIncluded: [
      "Modul 07: Manajemen State Lanjutan di Ekosistem React (Zustand)",
      "Modul 08: Styling Modern: Tailwind CSS, CVA, & Radix UI",
    ],
    accentColor: "#F59E0B",
  },
  {
    id: "col-4",
    tag: "04 // PRODUKSI & DEVOPS",
    title: "Autentikasi HttpOnly, Prisma ORM, Testing, & Docker",
    description: "Perlindungan XSS cookie, PostgreSQL connection pooling serverless, Vitest/Playwright testing, dan multi-stage Docker containerization.",
    moduleCount: "Modul 09, 10, 11, 12",
    lessonCount: "4 MODUL LENGKAP →",
    modulesIncluded: [
      "Modul 09: Autentikasi HttpOnly Cookies & Role-Based Access Control",
      "Modul 10: Integrasi Database Relasional PostgreSQL & Prisma ORM",
      "Modul 11: Strategi Testing Aplikasi Web: Vitest, RTL, & Playwright",
      "Modul 12: Deployment Produksi, Docker Multi-Stage, & CI/CD Pipeline",
    ],
    accentColor: "#10B981",
  },
];

const ALL_12_MODULES = [
  { id: "01", title: "Pengantar Pengembangan Web Modern & Runtime Boundary", dur: "3 SKS · 150m" },
  { id: "02", title: "HTML5 Semantik, Aksesibilitas WCAG 2.2, & CSS Modern", dur: "3 SKS · 150m" },
  { id: "03", title: "JavaScript ES6+ & Asynchronous Event Loop", dur: "3 SKS · 150m" },
  { id: "04", title: "Pengantar React: Komponen, Props, & State Reconciliation", dur: "3 SKS · 150m" },
  { id: "05", title: "Routing Modern dengan Next.js App Router & Layouts", dur: "3 SKS · 150m" },
  { id: "06", title: "Data Fetching & Server Actions di Next.js", dur: "3 SKS · 150m" },
  { id: "07", title: "Manajemen State Lanjutan di Ekosistem React (Zustand)", dur: "3 SKS · 150m" },
  { id: "08", title: "Styling Modern: Tailwind CSS, CVA, & Radix UI", dur: "3 SKS · 150m" },
  { id: "09", title: "Autentikasi HttpOnly Cookies & Role-Based Access Control", dur: "3 SKS · 150m" },
  { id: "10", title: "Integrasi Database Relasional PostgreSQL & Prisma ORM", dur: "3 SKS · 150m" },
  { id: "11", title: "Strategi Testing Aplikasi Web: Vitest, RTL, & Playwright", dur: "3 SKS · 150m" },
  { id: "12", title: "Deployment Produksi, Docker Multi-Stage, & CI/CD Pipeline", dur: "3 SKS · 150m" },
];

export function CurriculumExplorer() {
  const [showAllModal, setShowAllModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<CollectionItem | null>(null);

  return (
    <div id="curriculum-section" className="w-full max-w-7xl mx-auto px-2 sm:px-4 my-8">
      <OSWindow
        title="C:\VELQORA\CURRICULUM_EXPLORER"
        icon={<Folder className="w-4 h-4 text-amber-200" />}
        statusText="4 object(s) | 12 modul lengkap | My Computer"
        className="shadow-md"
        bodyClassName="p-4 sm:p-6 bg-[#FFFFFF] text-[#1C1917]"
      >
        {/* Windows Explorer Address Bar (Exact Vintec Learn) */}
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-[#E5DDD5] font-mono text-xs select-none">
          <span className="text-[#6B6560] font-bold">Address</span>
          <div className="flex-1 px-3 py-1 bg-[#FAF8F5] border border-[#D6CEC4] text-[#1C1917] font-bold flex items-center justify-between">
            <span>C:\Velqora\Koleksi\</span>
            <span className="text-[10px] text-[#A89F91]">EXPLORER</span>
          </div>
          <button
            type="button"
            className="px-3 py-1 vt-btn-chrome text-xs font-bold"
          >
            Go
          </button>
        </div>

        {/* Section Header (02 — KURIKULUM · 4 DARI 12 MODUL) */}
        <div className="space-y-2 mb-6 font-mono">
          <div className="text-xs text-[#C2553A] font-bold tracking-wider uppercase">
            02 — KURIKULUM · 4 DARI 12 MODUL
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-sans text-[#1C1917] tracking-tight">
            Koleksi untuk kerja nyata.
          </h2>
          <p className="text-xs sm:text-sm text-[#524B42] font-sans max-w-2xl leading-relaxed">
            Dari fondasi protokol web hingga kontainerisasi aplikasi ke server produksi. 
            Disusun bertahap mengikuti kurikulum baku perkuliahan.
          </p>
        </div>

        {/* Cards Grid (4 Collections) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLLECTIONS.map((col) => (
            <div
              key={col.id}
              onClick={() => setSelectedCollection(col)}
              className="p-4 bg-[#FAF8F5] border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#C5BCB0] border-b-[#C5BCB0] flex flex-col justify-between hover:bg-[#F5EFEB] transition-all cursor-pointer group shadow-xs hover:shadow-md"
            >
              <div>
                <div className="text-[10px] font-mono font-bold text-[#C2553A] tracking-wider mb-2">
                  {col.tag}
                </div>
                <h3 className="text-sm font-bold font-sans text-[#1C1917] group-hover:text-[#C2553A] transition-colors leading-snug">
                  {col.title}
                </h3>
                <p className="text-xs text-[#524B42] mt-2 font-sans line-clamp-3 leading-relaxed">
                  {col.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E5DDD5] font-mono text-xs flex items-center justify-between text-[#C2553A] font-bold group-hover:translate-x-0.5 transition-transform">
                <span className="text-[11px]">{col.lessonCount}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Action: Lihat semua 12 modul ▸ */}
        <div className="mt-6 pt-4 border-t border-[#E5DDD5] flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowAllModal(true)}
            className="px-5 py-2.5 vt-btn-terracotta text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm"
          >
            <span>Lihat semua 12 modul</span>
            <span>▸</span>
          </button>

          <span className="text-xs font-mono text-[#7A756D]">
            Seluruh berkas markdown tersedia di <code>docs/modul/</code>
          </span>
        </div>
      </OSWindow>

      {/* Modal: All 12 Modules Breakdown */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-3xl vt-window shadow-2xl animate-in fade-in zoom-in-95 duration-100">
            <div className="vt-titlebar px-3 py-1.5 flex items-center justify-between select-none">
              <span className="font-mono text-xs font-bold text-white uppercase">
                DAFTAR LENGKAP 12 MODUL WEB MODERN
              </span>
              <button
                type="button"
                onClick={() => setShowAllModal(false)}
                className="vt-window-btn vt-window-btn-close"
              >
                ×
              </button>
            </div>

            <div className="p-5 bg-[#FFFFFF] text-[#1C1917] font-mono text-xs space-y-3 max-h-[75vh] overflow-y-auto">
              <div className="text-xs text-[#C2553A] font-bold">
                KURIKULUM RESMI (36 SKS TOTAL · LEVEL ENTERPRISE)
              </div>

              <div className="space-y-2 divide-y divide-[#E5DDD5]">
                {ALL_12_MODULES.map((m) => (
                  <div key={m.id} className="pt-2 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#C2553A] min-w-[24px]">
                        [{m.id}]
                      </span>
                      <span className="text-[#1C1917] font-semibold">{m.title}</span>
                    </div>
                    <span className="text-[10px] text-[#7A756D] whitespace-nowrap bg-[#FAF8F5] px-2 py-0.5 border border-[#E5DDD5]">
                      {m.dur}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#E5DDD5] flex justify-end gap-2">
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
                  <span>Buka di Dashboard</span>
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

            <div className="p-5 bg-[#FFFFFF] text-[#1C1917] font-mono text-xs space-y-4">
              <div>
                <span className="text-[10px] text-[#C2553A] font-bold">KOLEKSI PEMBELAJARAN</span>
                <h3 className="text-base font-bold text-[#1C1917] mt-1">{selectedCollection.title}</h3>
                <p className="text-xs text-[#524B42] mt-2 leading-relaxed">{selectedCollection.description}</p>
              </div>

              <div className="space-y-1.5 bg-[#FAF8F5] p-3 border border-[#E5DDD5] rounded-xs">
                <div className="font-bold text-[#C2553A] text-[11px] mb-1">Modul yang Termasuk:</div>
                {selectedCollection.modulesIncluded.map((modTitle, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-700 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{modTitle}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E5DDD5]">
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
