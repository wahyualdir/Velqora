"use client";

import { useEffect, useState, memo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CheckSquare,
  Layers,
  Plus,
  ArrowRight,
  Bot,
  Search,
  Sparkles,
  X,
  Code2,
  ScanLine,
  GraduationCap,
  Clock,
  FolderOpen,
  FileText,
  FolderCode,
  Compass,
  Cpu,
  FileCode2,
  Database,
  Terminal,
  FileSpreadsheet,
} from "lucide-react";
import { getDashboardStats } from "@/actions/study-actions";
import { Skeleton, EmptyState } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, daysUntilDeadline } from "@/lib/utils";

// Supported file types and integrations ecosystem
const COMPATIBLE_ECOSYSTEM = [
  {
    id: "notebook",
    name: "Jupyter Notebook",
    extension: ".ipynb",
    desc: "Render notebook Python, cell markdown, grafik output data science langsung di browser.",
    category: "Data Science & AI",
    badge: "Native Runner",
    icon: Terminal,
    color: "text-amber-500 bg-amber-500/10 border-amber-500/25",
    href: "/dashboard/modul?mode=project",
  },
  {
    id: "pdf",
    name: "Dokumen PDF & Slide",
    extension: ".pdf, .ppt, .docx",
    desc: "Integrated PDF reader dengan zoom, pencarian teks, dan pembuat catatan samping.",
    category: "Bahan Ajar",
    badge: "Integrated Viewer",
    icon: FileText,
    color: "text-red-500 dark:text-red-400 bg-red-500/10 border-red-500/25",
    href: "/dashboard/materi",
  },
  {
    id: "code",
    name: "Source Code Multi-Bahasa",
    extension: ".py, .ts, .js, .sql, .cpp",
    desc: "Syntax highlighting dengan Monaco Editor & eksekusi instan di Ruang Praktik Kode.",
    category: "Coding & Dev",
    badge: "Syntax Engine",
    icon: Code2,
    color: "text-blue-500 dark:text-blue-400 bg-blue-500/10 border-blue-500/25",
    href: "/dashboard/playground",
  },
  {
    id: "classroom",
    name: "Google Classroom Sync",
    extension: "API v1",
    desc: "Sinkronisasi otomatis tugas perkuliahan, jadwal pengumpulan, dan materi kelas kampus.",
    category: "Integrasi Kampus",
    badge: "Cloud Sync",
    icon: GraduationCap,
    color: "text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
    href: "/dashboard/tugas",
  },
  {
    id: "ocr",
    name: "OCR & Document Scanner",
    extension: "PNG, JPG, PDF",
    desc: "Ekstrak teks materi dari foto catatan kuliah dan slide fisik menjadi teks digital.",
    category: "AI Extraction",
    badge: "Vision OCR",
    icon: ScanLine,
    color: "text-cyan-500 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/25",
    href: "/dashboard/konversi",
  },
  {
    id: "markdown",
    name: "Markdown & KaTeX Math",
    extension: ".md, LaTeX",
    desc: "Format catatan akademik kaya rumus matematika, diagram Mermaid, dan blok kode.",
    category: "Dokumentasi",
    badge: "Rich Format",
    icon: FileCode2,
    color: "text-purple-500 dark:text-purple-400 bg-purple-500/10 border-purple-500/25",
    href: "/dashboard/catatan",
  },
];

// Memoized developer-grade search input
const SearchConsoleInput = memo(function SearchConsoleInput({
  searchQuery,
  onSearchChange,
}: {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}) {
  return (
    <div className="w-full relative flex items-center min-w-0">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Cari materi, modul, tugas, atau topik ngoding..."
        className="w-full bg-transparent text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none font-medium truncate pr-2"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => onSearchChange("")}
          className="p-1 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors shrink-0 flex items-center gap-1 text-[11px] cursor-pointer"
          title="Reset pencarian"
          aria-label="Hapus pencarian"
        >
          <X className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-mono text-[10px]">Reset</span>
        </button>
      )}
    </div>
  );
});

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<{
    totalMateri: number;
    totalTugas: number;
    totalModul: number;
    totalFile: number;
    recentViews: any[];
    recentTasks: any[];
    recentModules: any[];
  }>({
    totalMateri: 0,
    totalTugas: 0,
    totalModul: 0,
    totalFile: 0,
    recentViews: [],
    recentTasks: [],
    recentModules: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"semua" | "materi" | "tugas" | "modul">("semua");

  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      try {
        const data = await getDashboardStats();
        if (isMounted && data) {
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    if (activeTab === "tugas") {
      router.push(`/dashboard/tugas?q=${encodeURIComponent(query)}`);
    } else if (activeTab === "modul") {
      router.push(`/dashboard/modul?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/dashboard/materi?q=${encodeURIComponent(query)}`);
    }
  };

  const isBrandNewWorkspace =
    !loading &&
    stats.totalMateri === 0 &&
    stats.totalTugas === 0 &&
    stats.totalModul === 0 &&
    stats.totalFile === 0;

  return (
    <div className="page-container space-y-6 sm:space-y-8 pb-12 animate-fade-in">
      {/* ─── 1. Header & Search Command Bar ─── */}
      <section className="space-y-4 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-surface-secondary border border-border text-[11px] font-mono text-text-tertiary">
              <span className="text-brand-500 font-bold">~/</span>
              <span className="text-text-secondary font-medium">workspace</span>
              <span className="text-border">|</span>
              <span className="text-text-tertiary">dashboard</span>
            </div>
            <h1 className="text-fluid-h1 font-bold text-text-primary tracking-tight font-display">
              Ringkasan Workspace
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary">
              Pantau materi yang sedang dipelajari, selesaikan tugas aktif, dan akses modul terkini.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/dashboard/modul/baru">
              <Button size="sm" className="gap-1.5 text-xs font-semibold shadow-xs">
                <Plus className="w-3.5 h-3.5" /> Tambah Modul
              </Button>
            </Link>
            <Link href="/dashboard/modul/baru?mode=project">
              <Button size="sm" variant="secondary" className="gap-1.5 text-xs font-semibold">
                <FolderCode className="w-3.5 h-3.5" /> Project Baru
              </Button>
            </Link>
          </div>
        </div>

        {/* Search & Quick Filter Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="rounded-xl border border-border bg-surface p-2.5 shadow-2xs space-y-2.5 transition-all duration-150 focus-within:border-brand-500/50"
        >
          <div className="flex items-center gap-2.5 px-2 py-0.5">
            <Search className="w-4 h-4 text-text-tertiary shrink-0" />
            <SearchConsoleInput
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/70 px-1 gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              <button
                type="button"
                onClick={() => setActiveTab("semua")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                  activeTab === "semua"
                    ? "bg-brand-500/15 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary border border-transparent"
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("modul")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                  activeTab === "modul"
                    ? "bg-brand-500/15 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary border border-transparent"
                }`}
              >
                Modul & Project
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("materi")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                  activeTab === "materi"
                    ? "bg-brand-500/15 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary border border-transparent"
                }`}
              >
                Materi
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("tugas")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                  activeTab === "tugas"
                    ? "bg-brand-500/15 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary border border-transparent"
                }`}
              >
                Tugas
              </button>
            </div>

            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer shrink-0 ml-auto"
            >
              <span>Cari</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </section>

      {/* ─── 2. First-Use Onboarding Banner (Honest & Clean) ─── */}
      {isBrandNewWorkspace && (
        <section className="p-5 sm:p-6 rounded-xl border border-brand-500/30 bg-brand-500/5 space-y-3.5 shadow-2xs animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 shrink-0 mt-0.5">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm sm:text-base font-bold text-text-primary font-display">
                Selamat datang di Velqora.
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
                Mulai dari satu materi kuliah atau project kode yang sedang kamu kerjakan. Data aktivitas nyata kamu akan otomatis mengisi dashboard ini seiring progres belajar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap pt-1 pl-12">
            <Link href="/dashboard/modul/baru">
              <Button size="sm" className="text-xs font-semibold">
                + Tambah Modul Pertama
              </Button>
            </Link>
            <Link href="/dashboard/modul/baru?mode=project">
              <Button size="sm" variant="secondary" className="text-xs font-medium">
                + Tambah Project Kode
              </Button>
            </Link>
            <Link href="/dashboard/panduan">
              <Button size="sm" variant="ghost" className="text-xs text-text-secondary hover:text-text-primary gap-1">
                <Compass className="w-3.5 h-3.5" /> Baca Panduan
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* ─── 3. KPI Metrics Summary Cards ─── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-xs sm:text-sm font-bold text-text-primary uppercase tracking-wider font-mono">
            Metrik Pembelajaran
          </h2>
          <span className="text-[11px] font-mono text-text-tertiary">
            Realtime DB
          </span>
        </div>

        <div className="card-grid-stats">
          {/* Card 1: Modul & Project */}
          <Link
            href="/dashboard/modul"
            className="group rounded-xl border border-border bg-surface p-4 transition-all duration-150 hover:border-brand-500/40 hover:bg-surface-secondary/60 flex flex-col justify-between min-h-[108px] shadow-2xs cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-border flex items-center justify-center text-text-secondary group-hover:text-brand-500 group-hover:border-brand-500/40 transition-colors shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-brand-500 transition-colors truncate font-display">
                    Modul & Project
                  </h3>
                  <p className="text-[11px] text-text-tertiary truncate">
                    Silabus & repositori
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xl sm:text-2xl font-mono font-bold text-text-primary block leading-none">
                  {loading ? "..." : stats.totalModul}
                </span>
                <span className="text-[10px] font-mono text-text-tertiary">Tersimpan</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-text-secondary group-hover:text-brand-500 pt-2 mt-2 border-t border-border/50 transition-colors">
              <span>Buka Modul</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Materi & Dokumen */}
          <Link
            href="/dashboard/materi"
            className="group rounded-xl border border-border bg-surface p-4 transition-all duration-150 hover:border-brand-500/40 hover:bg-surface-secondary/60 flex flex-col justify-between min-h-[108px] shadow-2xs cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-border flex items-center justify-center text-text-secondary group-hover:text-brand-500 group-hover:border-brand-500/40 transition-colors shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-brand-500 transition-colors truncate font-display">
                    Materi Pembelajaran
                  </h3>
                  <p className="text-[11px] text-text-tertiary truncate">
                    Slide & dokumen
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xl sm:text-2xl font-mono font-bold text-text-primary block leading-none">
                  {loading ? "..." : stats.totalMateri}
                </span>
                <span className="text-[10px] font-mono text-text-tertiary">Dokumen</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-text-secondary group-hover:text-brand-500 pt-2 mt-2 border-t border-border/50 transition-colors">
              <span>Lihat Materi</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Tugas Aktif */}
          <Link
            href="/dashboard/tugas"
            className="group rounded-xl border border-border bg-surface p-4 transition-all duration-150 hover:border-brand-500/40 hover:bg-surface-secondary/60 flex flex-col justify-between min-h-[108px] shadow-2xs cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-border flex items-center justify-center text-text-secondary group-hover:text-brand-500 group-hover:border-brand-500/40 transition-colors shrink-0">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-brand-500 transition-colors truncate font-display">
                    Tugas & Tenggat
                  </h3>
                  <p className="text-[11px] text-text-tertiary truncate">
                    Pelacak deadline
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xl sm:text-2xl font-mono font-bold text-text-primary block leading-none">
                  {loading ? "..." : stats.totalTugas}
                </span>
                <span className="text-[10px] font-mono text-text-tertiary">Tugas</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-text-secondary group-hover:text-brand-500 pt-2 mt-2 border-t border-border/50 transition-colors">
              <span>Kelola Tugas</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Berkas & Berkas Cloud */}
          <Link
            href="/dashboard/file"
            className="group rounded-xl border border-border bg-surface p-4 transition-all duration-150 hover:border-brand-500/40 hover:bg-surface-secondary/60 flex flex-col justify-between min-h-[108px] shadow-2xs cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-border flex items-center justify-center text-text-secondary group-hover:text-brand-500 group-hover:border-brand-500/40 transition-colors shrink-0">
                  <FolderOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-brand-500 transition-colors truncate font-display">
                    Berkas Cloud
                  </h3>
                  <p className="text-[11px] text-text-tertiary truncate">
                    Storage & lampiran
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xl sm:text-2xl font-mono font-bold text-text-primary block leading-none">
                  {loading ? "..." : stats.totalFile}
                </span>
                <span className="text-[10px] font-mono text-text-tertiary">File</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-text-secondary group-hover:text-brand-500 pt-2 mt-2 border-t border-border/50 transition-colors">
              <span>Lihat Berkas</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* ─── 4. Main 2-Column Work Hub (Recent Learning + Pending Tasks) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left Column (7 cols): Continue Learning & Recent Activity */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section: Yang Sedang Dipelajari (Recent Modules) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-0.5">
              <h2 className="text-sm sm:text-base font-bold text-text-primary tracking-tight font-display flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-500" />
                <span>Modul & Project Terkini</span>
              </h2>
              <Link
                href="/dashboard/modul"
                className="text-xs font-semibold text-text-secondary hover:text-brand-500 transition-colors flex items-center gap-1"
              >
                <span>Semua Modul</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-2.5">
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
              </div>
            ) : stats.recentModules.length === 0 ? (
              <EmptyState
                icon={<Layers className="w-8 h-8" />}
                title="Belum ada modul tersimpan"
                description="Simpan materi atau project yang sedang kamu pelajari agar mudah ditemukan kembali."
                action={
                  <Link href="/dashboard/modul/baru">
                    <Button size="sm">+ Tambah Modul</Button>
                  </Link>
                }
              />
            ) : (
              <div className="space-y-2.5">
                {stats.recentModules.map((mod) => (
                  <Link
                    key={mod.id}
                    href={`/dashboard/modul?module=${mod.id}`}
                    className="group block p-3.5 sm:p-4 rounded-xl border border-border bg-surface hover:border-brand-500/40 hover:bg-surface-secondary/60 transition-all shadow-2xs cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-secondary border border-border text-text-secondary">
                            {mod.category?.name || "Umum"}
                          </span>
                          <span className="text-[10px] font-mono text-text-tertiary">
                            {mod.level ? String(mod.level).toUpperCase() : "SEMUA LEVEL"}
                          </span>
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-brand-500 transition-colors leading-snug line-clamp-1 font-display">
                          {mod.title}
                        </h3>
                        {mod.description && (
                          <p className="text-[11.5px] text-text-secondary line-clamp-1 leading-normal">
                            {mod.description}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-brand-500 pt-1">
                        <span>Lanjutkan</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Section: Belajar Terakhir (Recent Views / Documents) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-0.5">
              <h2 className="text-sm sm:text-base font-bold text-text-primary tracking-tight font-display flex items-center gap-2">
                <Clock className="w-4 h-4 text-text-tertiary" />
                <span>Dokumen yang Terakhir Dibuka</span>
              </h2>
              <Link
                href="/dashboard/materi"
                className="text-xs font-semibold text-text-secondary hover:text-brand-500 transition-colors flex items-center gap-1"
              >
                <span>Koleksi Materi</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-14 rounded-xl" />
                <Skeleton className="h-14 rounded-xl" />
              </div>
            ) : stats.recentViews.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-border text-center bg-surface-secondary/20 space-y-1">
                <p className="text-xs text-text-secondary">Belum ada riwayat dokumen yang dibuka.</p>
                <p className="text-[11px] text-text-tertiary">Dokumen yang kamu baca akan tercatat di sini.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/60 rounded-xl border border-border bg-surface overflow-hidden shadow-2xs">
                {stats.recentViews.map((item) => {
                  const mat = item.material;
                  if (!mat) return null;
                  return (
                    <Link
                      key={item.id}
                      href={`/dashboard/materi/${mat.id}`}
                      className="group flex items-center justify-between p-3 sm:px-4 hover:bg-surface-secondary/60 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <FileText className="w-4 h-4 text-text-tertiary group-hover:text-brand-500 shrink-0 transition-colors" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-text-primary group-hover:text-brand-500 transition-colors truncate">
                            {mat.title}
                          </p>
                          <p className="text-[10.5px] font-mono text-text-tertiary">
                            {formatDate(item.viewed_at)}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-brand-500 shrink-0 transition-colors" />
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right Column (5 cols): Active Tasks & Quick Tools */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section: Tugas yang Perlu Diselesaikan */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-0.5">
              <h2 className="text-sm sm:text-base font-bold text-text-primary tracking-tight font-display flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-amber-500" />
                <span>Tugas Aktif & Tenggat</span>
              </h2>
              <Link
                href="/dashboard/tugas"
                className="text-xs font-semibold text-text-secondary hover:text-brand-500 transition-colors flex items-center gap-1"
              >
                <span>Semua Tugas</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-2.5">
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
              </div>
            ) : stats.recentTasks.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-border text-center bg-surface-secondary/20 space-y-1">
                <p className="text-xs text-text-secondary font-medium">Semua tugas telah diselesaikan.</p>
                <p className="text-[11px] text-text-tertiary">Tidak ada tenggat waktu aktif yang mendesak.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {stats.recentTasks.map((task) => {
                  const days = task.deadline ? daysUntilDeadline(task.deadline) : null;
                  const isUrgent = days !== null && days <= 2 && days >= 0;
                  const isLate = days !== null && days < 0;

                  return (
                    <Link
                      key={task.id}
                      href={`/dashboard/tugas`}
                      className="group block p-3 rounded-xl border border-border bg-surface hover:border-brand-500/40 hover:bg-surface-secondary/60 transition-all shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9.5px] font-mono font-semibold uppercase ${
                                task.priority === "tinggi"
                                  ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/25"
                                  : task.priority === "sedang"
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25"
                                  : "bg-surface-secondary text-text-secondary border border-border"
                              }`}
                            >
                              {task.priority || "Normal"}
                            </span>
                            {task.deadline && (
                              <span
                                className={`text-[10px] font-mono ${
                                  isLate
                                    ? "text-red-500 font-semibold"
                                    : isUrgent
                                    ? "text-amber-500 font-semibold"
                                    : "text-text-tertiary"
                                }`}
                              >
                                {isLate
                                  ? "Terlewat"
                                  : days === 0
                                  ? "Hari ini"
                                  : `${days} hari lagi`}
                              </span>
                            )}
                          </div>
                          <h3 className="text-xs font-semibold text-text-primary group-hover:text-brand-500 transition-colors leading-snug line-clamp-1">
                            {task.title}
                          </h3>
                        </div>
                        <span className="text-[10.5px] font-mono text-text-tertiary capitalize shrink-0 pt-0.5">
                          {task.status || "Baru"}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* Section: Alat Praktik & AI (Compact Cards) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-0.5">
              <h2 className="text-sm sm:text-base font-bold text-text-primary tracking-tight font-display">
                Alat Pembelajaran Terintegrasi
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Ruang Praktik Kode */}
              <Link
                href="/dashboard/playground"
                className="group p-3 rounded-xl border border-border bg-surface hover:border-brand-500/40 hover:bg-surface-secondary/60 transition-all flex items-center justify-between gap-3 shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-500 flex items-center justify-center shrink-0">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-text-primary group-hover:text-brand-500 transition-colors">
                      Ruang Praktik Kode
                    </h3>
                    <p className="text-[11px] text-text-secondary truncate">
                      Uji kode JavaScript & Python dengan live output
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-brand-500 shrink-0 transition-colors" />
              </Link>

              {/* AI Tutor */}
              <Link
                href="/dashboard/ai-tutor"
                className="group p-3 rounded-xl border border-border bg-surface hover:border-purple-500/40 hover:bg-surface-secondary/60 transition-all flex items-center justify-between gap-3 shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-500 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-text-primary group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                      Velqora AI Tutor
                    </h3>
                    <p className="text-[11px] text-text-secondary truncate">
                      Tanyakan konsep, debug sintaks, dan ringkas materi
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-purple-500 shrink-0 transition-colors" />
              </Link>

              {/* Kuis AI */}
              <Link
                href="/dashboard/kuis-ai"
                className="group p-3 rounded-xl border border-border bg-surface hover:border-amber-500/40 hover:bg-surface-secondary/60 transition-all flex items-center justify-between gap-3 shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-text-primary group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                      Kuis AI Interaktif
                    </h3>
                    <p className="text-[11px] text-text-secondary truncate">
                      Evaluasi pemahaman konsep silabus secara otomatis
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-amber-500 shrink-0 transition-colors" />
              </Link>

              {/* Scanner & Konversi */}
              <Link
                href="/dashboard/konversi"
                className="group p-3 rounded-xl border border-border bg-surface hover:border-cyan-500/40 hover:bg-surface-secondary/60 transition-all flex items-center justify-between gap-3 shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 dark:text-cyan-400 flex items-center justify-center shrink-0">
                    <ScanLine className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-text-primary group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                      Konversi & OCR Berkas
                    </h3>
                    <p className="text-[11px] text-text-secondary truncate">
                      Ekstrak teks materi dari gambar dan dokumen fisik
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-cyan-500 shrink-0 transition-colors" />
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* ─── 5. Format & Ekosistem yang Kompatibel (Supported Tooling & Ecosystem) ─── */}
      <section className="space-y-3.5 pt-4 border-t border-border/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-brand-500 uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5" />
              <span>Ekosistem & Kompatibilitas Sistem</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-text-primary font-display tracking-tight">
              Format Berkas & Engine yang Didukung
            </h2>
          </div>
          <p className="text-xs text-text-secondary max-w-md">
            Velqora mendukung pembacaan, eksekusi kode, dan sinkronisasi berbagai format materi akademik secara native di browser.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {COMPATIBLE_ECOSYSTEM.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="group p-4 rounded-xl border border-border bg-surface hover:border-brand-500/40 hover:bg-surface-secondary/60 transition-all flex flex-col justify-between space-y-3 shadow-2xs cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${item.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-brand-500 transition-colors truncate font-display">
                          {item.name}
                        </h3>
                        <span className="text-[10.5px] font-mono text-text-tertiary">
                          {item.extension}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-surface-secondary border border-border text-text-secondary shrink-0">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-text-secondary leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] font-semibold text-text-secondary group-hover:text-brand-500 transition-colors">
                  <span className="text-[10px] font-mono uppercase text-text-tertiary">{item.category}</span>
                  <div className="flex items-center gap-1">
                    <span>Eksplorasi</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
