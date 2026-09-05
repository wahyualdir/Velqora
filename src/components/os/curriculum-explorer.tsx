"use client";

import React, { useState } from "react";
import { OSWindow } from "./os-window";
import { 
  Folder, 
  FileText, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  BookOpen, 
  Code2, 
  Layers, 
  Database, 
  ShieldAlert, 
  TestTube2, 
  Container,
  ChevronRight,
  Filter,
  X
} from "lucide-react";
import Link from "next/link";

interface ModuleData {
  id: string;
  number: string;
  title: string;
  category: "Fundamentals" | "React Ecosystem" | "Backend & Data" | "Quality & DevOps";
  icon: React.ReactNode;
  tags: string[];
  summary: string;
  keyConcepts: string[];
  duration: string;
  fileSlug: string;
}

const MODULES: ModuleData[] = [
  {
    id: "m01",
    number: "01",
    title: "Pengantar Pengembangan Web Modern",
    category: "Fundamentals",
    icon: <Layers className="w-4 h-4 text-cyan-400" />,
    tags: ["Client-Server", "HTTP/HTTPS", "SPA vs RSC", "Runtime Boundary"],
    summary: "Membedah batas runtime peramban vs server, siklus request-response HTTP, dan pergeseran paradigma arsitektur rendering dari MPA ke RSC.",
    keyConcepts: ["Request-Response Cycle", "Client vs Server Boundary", "Hydration Cost", "MPA to React Server Components"],
    duration: "3 SKS · 150m",
    fileSlug: "modul-01-pengantar-pengembangan-web-modern.md",
  },
  {
    id: "m02",
    number: "02",
    title: "HTML5 Semantik, Aksesibilitas, & CSS Modern",
    category: "Fundamentals",
    icon: <FileText className="w-4 h-4 text-emerald-400" />,
    tags: ["Semantic HTML", "WAI-ARIA", "WCAG 2.2 AA", "CSS Grid 2D"],
    summary: "Standar aksesibilitas web internasional (WCAG 2.2 AA), semantic landmarks, fluid typography clamp(), dan arsitektur CSS Grid 2D vs Flexbox 1D.",
    keyConcepts: ["Accessible Name Computation", "Keyboard Trapping", "Screen Reader Landmarks", "Fluid Grid Systems"],
    duration: "3 SKS · 150m",
    fileSlug: "modul-02-html5-css3-lanjutan.md",
  },
  {
    id: "m03",
    number: "03",
    title: "JavaScript ES6+ & Pemrograman Asynchronous",
    category: "Fundamentals",
    icon: <Code2 className="w-4 h-4 text-amber-400" />,
    tags: ["Event Loop", "Microtask Queue", "Immutability", "async/await"],
    summary: "Mekanisme internal Event Loop JavaScript (Call Stack, Task Queue, Microtask Queue), struktur Promise asinkron, dan pola Exponential Backoff retry.",
    keyConcepts: ["Non-blocking I/O", "Microtask Priority", "Immutable State Operations", "Retry Pattern"],
    duration: "3 SKS · 150m",
    fileSlug: "modul-03-javascript-es6-asynchronous.md",
  },
  {
    id: "m04",
    number: "04",
    title: "Pengantar React: Komponen, Props, & State",
    category: "React Ecosystem",
    icon: <Layers className="w-4 h-4 text-[#00F2FE]" />,
    tags: ["Declarative UI", "useState", "Batching", "Lifting State Up"],
    summary: "Mental model pemrograman deklaratif, JSX runtime, unidirectional data flow, rekonsiliasi DOM virtual, dan jebakan state mutability.",
    keyConcepts: ["Batching Updates", "Reconciliation Algorithm", "Key Identity Pitfall", "Component Lifecycle"],
    duration: "3 SKS · 150m",
    fileSlug: "modul-04-pengantar-react-komponen-state.md",
  },
  {
    id: "m05",
    number: "05",
    title: "Routing Modern dengan Next.js App Router",
    category: "React Ecosystem",
    icon: <Layers className="w-4 h-4 text-[#FF2E93]" />,
    tags: ["File-system Routing", "Nested Layouts", "Next 15 Async Params", "Route Groups"],
    summary: "Hierarki perutean Next.js 15, route groups terisolasi (auth), penanganan promise params asinkron, streaming loading.tsx, dan error boundaries.",
    keyConcepts: ["Layout Preservation", "Parallel Routes", "Prefetching Optimization", "Server Route Handlers"],
    duration: "3 SKS · 150m",
    fileSlug: "modul-05-nextjs-app-router.md",
  },
  {
    id: "m06",
    number: "06",
    title: "Data Fetching & Server Actions di Next.js",
    category: "React Ecosystem",
    icon: <Database className="w-4 h-4 text-purple-400" />,
    tags: ["Server Actions", "useActionState", "Zod Validation", "Waterfall Elimination"],
    summary: "Arsitektur mutasi data tanpa API endpoints manual via Server Actions, validasi skema Zod type-safe, dan revalidasi cache instan.",
    keyConcepts: ["Zero Client Bundle Mutations", "Optimistic UI Updates", "Form State Binding", "RevalidatePath"],
    duration: "3 SKS · 150m",
    fileSlug: "modul-06-data-fetching-server-actions.md",
  },
  {
    id: "m07",
    number: "07",
    title: "Manajemen State Lanjutan di Ekosistem React",
    category: "React Ecosystem",
    icon: <Layers className="w-4 h-4 text-amber-400" />,
    tags: ["Zustand", "Context Pitfalls", "Compound Components", "Atomic Selectors"],
    summary: "Mengatasi re-render storm pada Context API, implementasi compound components pattern, dan arsitektur global store Zustand dengan middleware persist.",
    keyConcepts: ["Fine-grained Subscriptions", "Decoupled Store Architecture", "Storage Middleware", "Inverted Control UI"],
    duration: "3 SKS · 150m",
    fileSlug: "modul-07-manajemen-state-lanjutan.md",
  },
  {
    id: "m08",
    number: "08",
    title: "Styling Modern: Tailwind CSS & Component Library",
    category: "React Ecosystem",
    icon: <Code2 className="w-4 h-4 text-cyan-400" />,
    tags: ["Tailwind AOT", "CVA Variants", "tailwind-merge", "Radix UI Headless"],
    summary: "Membangun sistem desain bervarian tinggi via class-variance-authority (CVA), helper specificity cn(), token Dark Mode, dan headless accessibility.",
    keyConcepts: ["Ahead-Of-Time Purging", "Specificity Resolution", "Semantic Color Tokens", "Focus Trapping Modal"],
    duration: "3 SKS · 150m",
    fileSlug: "modul-08-styling-modern-tailwind-css.md",
  },
  {
    id: "m09",
    number: "09",
    title: "Autentikasi dan Otorisasi Pengguna",
    category: "Backend & Data",
    icon: <ShieldAlert className="w-4 h-4 text-red-400" />,
    tags: ["HttpOnly Cookies", "Stateless JWT", "Data Access Layer", "RBAC"],
    summary: "Mencegah pencurian kredensial XSS pada localStorage via HttpOnly Secure Cookies, arsitektur Data Access Layer (DAL), dan Role-Based Access Control.",
    keyConcepts: ["401 vs 403 Authorization", "Defense-in-Depth Strategy", "IDOR Mitigation", "Argon2/Bcrypt Security"],
    duration: "3 SKS · 150m",
    fileSlug: "modul-09-autentikasi-dan-otorisasi.md",
  },
  {
    id: "m10",
    number: "10",
    title: "Integrasi Database Relasional & ORM Modern",
    category: "Backend & Data",
    icon: <Database className="w-4 h-4 text-blue-400" />,
    tags: ["PostgreSQL", "Prisma ORM", "N+1 Problem", "PgBouncer Serverless"],
    summary: "Perancangan skema relasional, eliminasi bencana performa N+1 Query via eager loading, transaksi atomik $transaction, dan connection pooling serverless.",
    keyConcepts: ["ACID Guarantees", "B-Tree Database Indexing", "Connection Exhaustion", "Migration Lifecycle"],
    duration: "3 SKS · 150m",
    fileSlug: "modul-10-integrasi-database-orm.md",
  },
  {
    id: "m11",
    number: "11",
    title: "Strategi Testing Aplikasi Web Modern",
    category: "Quality & DevOps",
    icon: <TestTube2 className="w-4 h-4 text-emerald-400" />,
    tags: ["Testing Trophy", "Vitest", "React Testing Library", "Playwright E2E"],
    summary: "Pengujian berpusat pada pengguna tanpa testing implementation details, mocking jaringan dengan Mock Service Worker (MSW), dan E2E browser tests.",
    keyConcepts: ["Accessibility Queries (getByRole)", "User Event Simulation", "Network Interception", "Flaky Test Elimination"],
    duration: "3 SKS · 150m",
    fileSlug: "modul-11-testing-aplikasi-web.md",
  },
  {
    id: "m12",
    number: "12",
    title: "Deployment Produksi, Docker, & CI/CD Pipeline",
    category: "Quality & DevOps",
    icon: <Container className="w-4 h-4 text-purple-400" />,
    tags: ["Docker Multi-Stage", "Next Standalone", "GitHub Actions CI", "Secrets"],
    summary: "Mengemas Next.js menjadi Docker image ultra-ramping (~100 MB), non-root least privilege user, manajemen rahasia env, dan pipeline verifikasi otomatis.",
    keyConcepts: ["Multi-stage Build Isolation", "Container Security", "CI Verification Gates", "Zero-Downtime Healthcheck"],
    duration: "3 SKS · 150m",
    fileSlug: "modul-12-deployment-docker-cicd.md",
  },
];

export function CurriculumExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalModule, setActiveModalModule] = useState<ModuleData | null>(null);

  const categories = ["All", "Fundamentals", "React Ecosystem", "Backend & Data", "Quality & DevOps"];

  const filteredModules = MODULES.filter((m) => {
    const matchesCategory = selectedCategory === "All" || m.category === selectedCategory;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.number.includes(searchQuery) ||
      m.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="curriculum-section" className="w-full max-w-6xl mx-auto px-4 my-10">
      <OSWindow
        title="C:\VELQORA\CURRICULUM_EXPLORER.EXE"
        icon={<Folder className="w-4 h-4 text-[#00F2FE]" />}
        statusText={`12 OBJECTS LOADED · ${filteredModules.length} DISPLAYED · SYSTEM READY`}
        className="shadow-2xl"
      >
        <div className="flex flex-col bg-[#0A0E15]">
          {/* File Explorer Toolbar & Address Bar */}
          <div className="p-3 bg-[#0F141D] border-b border-[#1E293B] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 font-mono text-xs">
            {/* Address Bar */}
            <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-[#07090E] border-t border-l border-black border-b border-r border-[#2A364F] rounded-xs text-slate-300">
              <span className="text-slate-500">Address:</span>
              <span className="text-[#00F2FE] font-bold">C:\Velqora\Curriculum\Web_Development\</span>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari modul / konsep..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#07090E] border-t border-l border-black border-b border-r border-[#2A364F] rounded-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#00F2FE] text-xs font-mono"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="px-4 py-2.5 bg-[#0B0F17] border-b border-[#1A2230] flex items-center gap-2 overflow-x-auto text-xs font-mono select-none">
            <span className="text-slate-500 font-bold flex items-center gap-1 flex-shrink-0">
              <Filter className="w-3 h-3 text-[#FF2E93]" />
              Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-xs transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "vt-btn-pink text-white"
                    : "vt-btn-chrome text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Module Cards Grid */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModules.map((module) => (
              <div
                key={module.id}
                onClick={() => setActiveModalModule(module)}
                className="vt-window bg-[#0D121B] hover:bg-[#121824] p-4 flex flex-col justify-between transition-all duration-150 cursor-pointer group border-t-2 border-l-2 border-[#1E293B] border-b-2 border-r-2 border-black hover:border-[#00F2FE]"
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-black text-[#FF2E93] px-2 py-0.5 bg-[#FF2E93]/10 border border-[#FF2E93]/30 rounded-xs">
                      MODUL {module.number}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                      {module.duration}
                    </span>
                  </div>

                  <h3 className="text-sm font-mono font-bold text-slate-100 group-hover:text-[#00F2FE] transition-colors leading-snug">
                    {module.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {module.summary}
                  </p>
                </div>

                {/* Tags & Action */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {module.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      7 Soal Kuis
                    </span>
                    <span className="text-[#00F2FE] group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold">
                      Buka Modul <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </OSWindow>

      {/* Module Detail Preview Modal */}
      {activeModalModule && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl vt-window animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Titlebar */}
            <div className="vt-titlebar px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#00F2FE]" />
                <span className="font-mono text-xs font-bold text-slate-200">
                  PROPERTIES — MODUL_{activeModalModule.number}.DOC
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalModule(null)}
                className="vt-window-btn vt-window-btn-close"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 bg-[#0C1017] text-slate-200 font-mono text-xs space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="text-[#FF2E93] text-xs font-bold">
                    MODUL {activeModalModule.number} · {activeModalModule.category.toUpperCase()}
                  </div>
                  <h2 className="text-base font-bold text-white mt-1">
                    {activeModalModule.title}
                  </h2>
                </div>
                <span className="text-emerald-400 px-2.5 py-1 bg-emerald-950/40 border border-emerald-500/30 rounded text-[10px]">
                  VERIFIED CURRICULUM
                </span>
              </div>

              <div>
                <h4 className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                  Deskripsi Modul:
                </h4>
                <p className="text-slate-300 leading-relaxed bg-[#080B10] p-3 rounded border border-slate-800">
                  {activeModalModule.summary}
                </p>
              </div>

              <div>
                <h4 className="text-[#00F2FE] font-bold uppercase tracking-wider text-[11px] mb-2">
                  Konsep Inti & Arsitektur yang Dipelajari:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeModalModule.keyConcepts.map((concept, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 bg-slate-900/60 rounded border border-slate-800 text-slate-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE]" />
                      <span>{concept}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded border border-slate-800 flex items-center justify-between text-[11px]">
                <div>
                  <span className="text-slate-400">File Sumber: </span>
                  <span className="text-slate-200">docs/modul/{activeModalModule.fileSlug}</span>
                </div>
                <div className="text-slate-400">Standar: S1 Sem 3 (3 SKS)</div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalModule(null)}
                  className="px-4 py-2 vt-btn-chrome text-xs"
                >
                  TUTUP
                </button>
                <Link
                  href={`/dashboard/modul`}
                  className="px-4 py-2 vt-btn-pink text-xs flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>PELAJARI DI DASHBOARD</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
