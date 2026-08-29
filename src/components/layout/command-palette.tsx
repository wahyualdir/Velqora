"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutGrid,
  BookOpen,
  FolderTree,
  FileText,
  Bot,
  BrainCircuit,
  ScanLine,
  CheckSquare,
  Users,
  Tags,
  Files,
  BarChart3,
  Bookmark,
  PenLine,
  Compass,
  HardDriveDownload,
  Settings,
  Plus,
  Palette,
  Command,
  ArrowRight,
  X,
  FileCode,
  Layers,
  Code2,
} from "lucide-react";
import { useThemeAccent } from "@/context/theme-accent-context";
import { toast } from "sonner";

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "Navigasi" | "Aksi Cepat" | "Tema & Aksen" | "Modul Populer";
  icon: any;
  action: () => void;
  keywords?: string[];
  badge?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { setAccent } = useThemeAccent();

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Navigate helper
  const navigateTo = React.useCallback(
    (path: string) => {
      router.push(path);
      onClose();
    },
    [router, onClose]
  );

  // Base command list
  const commandItems: CommandItem[] = useMemo(() => {
    return [
      // ─── 1. Navigasi Halaman Utama ───
      {
        id: "nav-dashboard",
        title: "Dashboard",
        subtitle: "Halaman utama materi, tugas, project, dan progres belajar",
        category: "Navigasi",
        icon: LayoutGrid,
        action: () => navigateTo("/dashboard"),
        keywords: ["home", "beranda", "utama", "dashboard", "overview", "ringkasan"],
      },
      {
        id: "nav-modul",
        title: "Modul dan Project",
        subtitle: "Materi pembelajaran dan project pemrograman yang tersimpan",
        category: "Navigasi",
        icon: Layers,
        action: () => navigateTo("/dashboard/modul"),
        keywords: ["modul", "project", "proyek", "source code", "repository", "belajar", "bab", "drive", "materi", "ipynb"],
      },
      {
        id: "nav-materi",
        title: "Materi Pembelajaran",
        subtitle: "Daftar materi kuliah, modul, dan dokumen pembelajaran",
        category: "Navigasi",
        icon: BookOpen,
        action: () => navigateTo("/dashboard/materi"),
        keywords: ["materi", "catatan", "artikel", "ringkasan", "notes"],
      },
      {
        id: "nav-ai-tutor",
        title: "Tutor AI",
        subtitle: "Konsultasi materi, penjelasan konsep, dan analisis kode",
        category: "Navigasi",
        icon: Bot,
        action: () => navigateTo("/dashboard/ai-tutor"),
        keywords: ["ai", "tutor", "bot", "tanya", "gemini", "claude", "asisten"],
      },
      {
        id: "nav-kuis-ai",
        title: "Latihan dan Kuis",
        subtitle: "Uji dan evaluasi pemahaman materi pembelajaran Anda",
        category: "Navigasi",
        icon: BrainCircuit,
        action: () => navigateTo("/dashboard/kuis-ai"),
        keywords: ["kuis", "quiz", "ujian", "latihan", "evaluasi", "exp"],
      },
      {
        id: "nav-konversi",
        title: "Konversi Berkas",
        subtitle: "Pindai dokumen, konversi format berkas, dan utilitas berkas",
        category: "Navigasi",
        icon: ScanLine,
        action: () => navigateTo("/dashboard/konversi"),
        keywords: ["scanner", "camscanner", "konversi", "convert", "pdf", "pasfoto", "docx", "word", "minify"],
      },
      {
        id: "nav-playground",
        title: "Ruang Praktik Kode",
        subtitle: "Eksperimen kode, uji coba sintaks, dan pelajari logika pemrograman",
        category: "Navigasi",
        icon: Code2,
        action: () => navigateTo("/dashboard/playground"),
        keywords: ["code", "playground", "compiler", "coding", "python", "js", "praktik"],
      },
      {
        id: "nav-tugas",
        title: "Tugas Pembelajaran",
        subtitle: "Kelola tugas, tenggat waktu, dan status penyelesaian",
        category: "Navigasi",
        icon: CheckSquare,
        action: () => navigateTo("/dashboard/tugas"),
        keywords: ["tugas", "jadwal", "deadline", "todo", "classroom", "pengingat"],
      },
      {
        id: "nav-kelas",
        title: "Ruang Kelas",
        subtitle: "Kelola kelas pembelajaran atau bergabung dengan kelas menggunakan kode",
        category: "Navigasi",
        icon: Users,
        action: () => navigateTo("/dashboard/kelas"),
        keywords: ["kelas", "classroom", "komunitas", "grup", "teman"],
      },
      {
        id: "nav-bookmark",
        title: "Materi Tersimpan",
        subtitle: "Daftar modul, materi, dan berkas yang disimpan untuk diakses kembali",
        category: "Navigasi",
        icon: Bookmark,
        action: () => navigateTo("/dashboard/bookmark"),
        keywords: ["bookmark", "simpan", "favorit", "saved", "tersimpan"],
      },
      {
        id: "nav-catatan",
        title: "Catatan Belajar",
        subtitle: "Ringkasan konsep, kode, dan catatan materi pembelajaran Anda",
        category: "Navigasi",
        icon: PenLine,
        action: () => navigateTo("/dashboard/catatan"),
        keywords: ["catatan", "notes", "memo", "jurnal"],
      },
      {
        id: "nav-kategori",
        title: "Kategori Pembelajaran",
        subtitle: "Kelola struktur kategori utama dan subkategori pembelajaran",
        category: "Navigasi",
        icon: FolderTree,
        action: () => navigateTo("/dashboard/kategori"),
        keywords: ["kategori", "bahasa", "pemrograman", "rumpun"],
      },
      {
        id: "nav-tag",
        title: "Label dan Tag",
        subtitle: "Kelola label dan tag untuk mengelompokkan materi dan tugas",
        category: "Navigasi",
        icon: Tags,
        action: () => navigateTo("/dashboard/tag"),
        keywords: ["tag", "label", "penanda", "filter"],
      },
      {
        id: "nav-file",
        title: "Berkas Pembelajaran",
        subtitle: "Daftar seluruh berkas dan dokumen yang tersimpan",
        category: "Navigasi",
        icon: Files,
        action: () => navigateTo("/dashboard/file"),
        keywords: ["file", "berkas", "dokumen", "cloud", "drive"],
      },
      {
        id: "nav-statistik",
        title: "Perkembangan Belajar",
        subtitle: "Pantau aktivitas dan perkembangan pembelajaran dari waktu ke waktu",
        category: "Navigasi",
        icon: BarChart3,
        action: () => navigateTo("/dashboard/statistik"),
        keywords: ["statistik", "analitik", "jam belajar", "progress", "grafik", "perkembangan"],
      },
      {
        id: "nav-panduan",
        title: "Panduan",
        subtitle: "Dokumentasi dan petunjuk penggunaan fitur platform",
        category: "Navigasi",
        icon: Compass,
        action: () => navigateTo("/dashboard/panduan"),
        keywords: ["panduan", "bantuan", "help", "dokumentasi", "tutorial"],
      },
      {
        id: "nav-backup",
        title: "Cadangan Data",
        subtitle: "Ekspor dan pemulihan data materi, tugas, dan modul",
        category: "Navigasi",
        icon: HardDriveDownload,
        action: () => navigateTo("/dashboard/backup"),
        keywords: ["backup", "restore", "ekspor", "impor", "json", "cadangkan"],
      },
      {
        id: "nav-pengaturan",
        title: "Pengaturan",
        subtitle: "Kelola profil, tampilan, dan preferensi akun Anda",
        category: "Navigasi",
        icon: Settings,
        action: () => navigateTo("/dashboard/pengaturan"),
        keywords: ["pengaturan", "settings", "profil", "tema", "password"],
      },

      // ─── 2. Aksi Cepat (Quick Actions) ───
      {
        id: "act-new-module",
        title: "Tambah Modul Pembelajaran Baru",
        subtitle: "Unggah materi, kurikulum bab, dan berkas studi baru",
        category: "Aksi Cepat",
        icon: Plus,
        action: () => navigateTo("/dashboard/modul/baru"),
        keywords: ["tambah modul", "buat modul", "upload modul", "new module"],
        badge: "Buat",
      },
      {
        id: "act-new-materi",
        title: "Buat Catatan Materi Baru",
        subtitle: "Tulis ringkasan atau catatan pembelajaran dengan Markdown",
        category: "Aksi Cepat",
        icon: FileText,
        action: () => navigateTo("/dashboard/materi/baru"),
        keywords: ["tambah materi", "buat catatan", "tulis materi", "new note"],
        badge: "Buat",
      },
      {
        id: "act-new-task",
        title: "Tambah Tugas Baru",
        subtitle: "Catat deadline dan prioritas tugas akademik baru",
        category: "Aksi Cepat",
        icon: Plus,
        action: () => navigateTo("/dashboard/tugas/baru"),
        keywords: ["tambah tugas", "buat tugas", "deadline baru", "new task"],
        badge: "Buat",
      },
      {
        id: "act-open-camscanner",
        title: "Buka CamScanner Dokumen",
        subtitle: "Pindai foto dokumen dan buat PDF multi-halaman",
        category: "Aksi Cepat",
        icon: ScanLine,
        action: () => navigateTo("/dashboard/konversi"),
        keywords: ["scan", "foto", "camscanner", "kamera", "pdf"],
      },

      // ─── 3. Modul Populer / Topik Cepat ───
      {
        id: "topic-python",
        title: "Modul: Python Fundamentals",
        subtitle: "Dasar sintaks, struktur data, OOP, dan pemrograman Python",
        category: "Modul Populer",
        icon: FileCode,
        action: () => navigateTo("/dashboard/modul?subcat=Python"),
        keywords: ["python", "py", "scripting", "backend", "machine learning"],
      },
      {
        id: "topic-nextjs",
        title: "Modul: Next.js 15 & React",
        subtitle: "Modern fullstack web development dengan App Router & Tailwind",
        category: "Modul Populer",
        icon: FileCode,
        action: () => navigateTo("/dashboard/modul?subcat=Next.js"),
        keywords: ["next.js", "nextjs", "react", "frontend", "typescript", "web"],
      },
      {
        id: "topic-sql",
        title: "Modul: PostgreSQL & Database",
        subtitle: "Relational database, query optimization, dan Supabase",
        category: "Modul Populer",
        icon: FileCode,
        action: () => navigateTo("/dashboard/modul?subcat=PostgreSQL"),
        keywords: ["postgresql", "postgres", "sql", "database", "supabase", "tabel"],
      },
      {
        id: "topic-typescript",
        title: "Modul: TypeScript Modern",
        subtitle: "Type safety, generics, interfaces, dan scalable JS architecture",
        category: "Modul Populer",
        icon: FileCode,
        action: () => navigateTo("/dashboard/modul?subcat=TypeScript"),
        keywords: ["typescript", "ts", "javascript", "type safe"],
      },

      // ─── 4. Tema & Aksen Warna Instan ───
      {
        id: "theme-stealth-titanium",
        title: "Aksen: Stealth Titanium (Default)",
        subtitle: "Palet minimalis slate titanium monochrome",
        category: "Tema & Aksen",
        icon: Palette,
        action: () => {
          setAccent("platinum");
          toast.success("Aksen warna diubah ke Stealth Titanium");
          onClose();
        },
        keywords: ["titanium", "stealth", "platinum", "slate", "monochrome", "abu"],
      },
      {
        id: "theme-cyber-indigo",
        title: "Aksen: Cyber Indigo",
        subtitle: "Electric Blue & Modern Tech",
        category: "Tema & Aksen",
        icon: Palette,
        action: () => {
          setAccent("indigo");
          toast.success("Aksen warna diubah ke Cyber Indigo");
          onClose();
        },
        keywords: ["indigo", "blue", "biru", "cyber"],
      },
      {
        id: "theme-emerald",
        title: "Aksen: Emerald Matrix",
        subtitle: "Neon Mint & Fresh Growth",
        category: "Tema & Aksen",
        icon: Palette,
        action: () => {
          setAccent("emerald");
          toast.success("Aksen warna diubah ke Emerald Matrix");
          onClose();
        },
        keywords: ["emerald", "green", "hijau", "matrix"],
      },
      {
        id: "theme-violet",
        title: "Aksen: Royal Violet",
        subtitle: "Futuristic Cyber Purple & Amethyst",
        category: "Tema & Aksen",
        icon: Palette,
        action: () => {
          setAccent("violet");
          toast.success("Aksen warna diubah ke Royal Violet");
          onClose();
        },
        keywords: ["violet", "purple", "ungu", "amethyst"],
      },
    ];
  }, [navigateTo, setAccent, onClose]);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return commandItems;
    }

    const q = query.toLowerCase().trim();
    return commandItems.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSubtitle = item.subtitle?.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q));
      return matchTitle || matchSubtitle || matchCategory || matchKeywords;
    });
  }, [query, commandItems]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? Math.max(0, filteredItems.length - 1) : prev - 1
      );
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
      return;
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      ) as HTMLElement;
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  // Group items by category
  const categories = Array.from(new Set(filteredItems.map((item) => item.category)));

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 pt-16 sm:pt-24 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Pencarian Cepat dan Navigasi Perintah"
    >
      <div
        className="w-full max-w-2xl bg-surface border border-border/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] sm:max-h-[75vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Top Input Box */}
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-4 border-b border-border bg-surface-secondary/40 shrink-0">
          <Search className="w-5 h-5 text-brand-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik tujuan, topik materi, alat konversi, atau perintah..."
            className="flex-1 bg-transparent text-sm sm:text-base text-text-primary placeholder:text-text-tertiary focus:outline-none min-w-0"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary transition-colors shrink-0"
              title="Hapus teks pencarian"
              aria-label="Hapus teks pencarian"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {/* Tombol Keluar / Close Eksplisit & Mudah */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 text-xs text-text-secondary transition-all active:scale-95 shrink-0 shadow-2xs font-medium cursor-pointer"
            title="Keluar dari pencarian (ESC)"
            aria-label="Tutup pencarian"
          >
            <X className="w-4 h-4 text-text-tertiary group-hover:text-red-400" />
            <span className="hidden xs:inline sm:inline font-semibold">Keluar</span>
            <span className="hidden sm:inline-block text-[10px] font-mono opacity-60 ml-0.5">ESC</span>
          </button>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto custom-scrollbar p-2 sm:p-3 space-y-4"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-2">
              <p className="text-sm font-semibold text-text-primary">
                Tidak ada hasil yang cocok dengan &quot;{query}&quot;
              </p>
              <p className="text-xs text-text-secondary max-w-sm mx-auto">
                Coba gunakan kata kunci lain seperti &quot;Python&quot;, &quot;Scanner&quot;, &quot;Tugas&quot;, &quot;AI Tutor&quot;, atau &quot;Kuis&quot;.
              </p>
            </div>
          ) : (
            categories.map((category) => {
              const itemsInCategory = filteredItems.filter((i) => i.category === category);
              return (
                <div key={category} className="space-y-1">
                  <div className="px-3 py-1 text-[11px] font-bold text-text-tertiary uppercase tracking-wider">
                    {category}
                  </div>
                  <div className="space-y-1">
                    {itemsInCategory.map((item) => {
                      const globalIndex = filteredItems.indexOf(item);
                      const isSelected = globalIndex === selectedIndex;
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.id}
                          data-index={globalIndex}
                          onClick={() => item.action()}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                            isSelected
                              ? "bg-brand-500/15 border border-brand-500/40 text-text-primary"
                              : "hover:bg-surface-secondary/70 border border-transparent text-text-secondary"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                                isSelected
                                  ? "bg-brand-500/20 text-brand-400 border-brand-500/30"
                                  : "bg-surface-secondary text-text-tertiary border-border"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-xs sm:text-sm font-semibold truncate ${
                                    isSelected ? "text-text-primary" : "text-text-primary/90"
                                  }`}
                                >
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-brand-500/20 text-brand-400 border border-brand-500/30">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              {item.subtitle && (
                                <p className="text-[11px] text-text-tertiary truncate">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isSelected && (
                              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-brand-400 font-mono">
                                <span>Pilih</span>
                                <ArrowRight className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Footer Shortcuts */}
        <div className="px-4 py-2.5 border-t border-border bg-surface-secondary/50 flex items-center justify-between text-[11px] text-text-tertiary shrink-0 gap-2">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono">↓</kbd>
              <span>Navigasi</span>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono">↵</kbd>
              <span>Buka</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 text-text-secondary hover:text-red-400 font-medium transition-colors cursor-pointer"
            >
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono">ESC</kbd>
              <span>Tutup Pencarian</span>
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-text-tertiary font-mono shrink-0">
            <Command className="w-3 h-3 text-brand-500" />
            <span>Velqora Spotlight</span>
          </div>
        </div>
      </div>
    </div>
  );
}
