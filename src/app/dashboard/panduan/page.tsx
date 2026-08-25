"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Search,
  BookOpen,
  GraduationCap,
  FolderOpen,
  UploadCloud,
  FileCode,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Users,
  Calendar,
  ClipboardList,
  BarChart3,
  Lock,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileText,
  Sliders,
  Eye,
  Layers,
  HelpCircle,
  Clock,
  ShieldAlert,
  HardDrive,
  Cpu,
  Check,
  Mail,
  Copy,
  MessageCircle,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";

interface GuideItem {
  id: string;
  category: "modul-drive" | "interaksi" | "tugas-kelas" | "ai-tools" | "keamanan";
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  actionUrl?: string;
  actionLabel?: string;
  steps: { title: string; desc: string }[];
  tips?: string;
  importantNote?: string;
}

const GUIDE_ITEMS: GuideItem[] = [
  {
    id: "modul-explorer",
    category: "modul-drive",
    title: "1. Manajemen Modul & Project",
    subtitle: "Pengorganisasian bahan ajar dokumen kurikulum dan repositori kode project terstruktur.",
    badge: "Struktur Materi",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/25",
    icon: GraduationCap,
    actionUrl: "/dashboard/modul",
    actionLabel: "Buka Modul & Project",
    steps: [
      {
        title: "Pembuatan Modul & Project Baru",
        desc: "Pilih menu Tambah pada halaman utama. Pilih mode Modul untuk bahan ajar dokumen (PDF, Word, PPTX) atau mode Project untuk repositori source code, Jupyter Notebook, dan dataset.",
      },
      {
        title: "Daftar Berkas & Struktur Proyek",
        desc: "Kelola berkas terlampir, baca dokumentasi README.md langsung di browser, dan sematkan tautan repositori GitHub serta live demo.",
      },
      {
        title: "Pratinjau Berkas Terintegrasi",
        desc: "Klik tombol Buka untuk membaca dokumen PDF, notebook Jupyter (.ipynb), berkas kode sumber (Python, TypeScript, SQL), maupun tabel data CSV langsung di browser.",
      },
      {
        title: "Pemantauan Bab & Progres",
        desc: "Tandai bab silabus yang telah dipelajari melalui checklist bab untuk memperbarui progres belajar secara otomatis.",
      },
    ],
    tips: "Pilih mode Project jika ingin membagikan repositori source code dengan file README.md, dataset CSV, atau notebook.",
    importantNote: "Hanya pemilik materi dan pengelola sistem yang memiliki wewenang untuk mengubah atau menghapus materi.",
  },
  {
    id: "interaksi-diskusi",
    category: "interaksi",
    title: "2. Sistem Reaksi & Forum Diskusi Pembelajaran",
    subtitle: "Ulasan materi dan ruang diskusi interaktif antar anggota belajar dan pengajar.",
    badge: "Interaksi & Diskusi",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
    icon: MessageSquare,
    actionUrl: "/dashboard/modul",
    actionLabel: "Lihat Diskusi",
    steps: [
      {
        title: "Apresiasi Like dan Masukan",
        desc: "Tekan tombol apresiasi pada modul untuk memberikan respon balik terhadap kualitas bahan ajar.",
      },
      {
        title: "Panel Forum Diskusi",
        desc: "Buka panel Diskusi & Komentar di bagian bawah modul untuk membaca tanggapan atau memulai topik baru.",
      },
      {
        title: "Pengiriman Ulasan dan Pertanyaan",
        desc: "Tuliskan pertanyaan seputar materi. Sistem otomatis menyematkan lencana identitas pembuat materi atau anggota.",
      },
      {
        title: "Moderasi Komentar",
        desc: "Penulis komentar, pemilik materi, dan pengelola sistem memiliki opsi untuk menghapus komentar yang tidak relevan.",
      },
    ],
    tips: "Sampaikan pertanyaan secara spesifik dengan menyertakan nomor bab modul untuk mempermudah diskusi.",
    importantNote: "Seluruh kiriman dipindai oleh sistem penyaring etika akademik untuk menjaga ketertiban ruang belajar.",
  },
  {
    id: "ai-auto-sort",
    category: "ai-tools",
    title: "3. Asisten AI & Pengorganisir Silabus",
    subtitle: "Kecerdasan buatan untuk analisis bahan ajar, pembuatan ringkasan, dan penyusunan struktur bab perkuliahan.",
    badge: "Kecerdasan Buatan",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/25",
    icon: Cpu,
    actionUrl: "/dashboard/ai-tutor",
    actionLabel: "Buka Asisten AI",
    steps: [
      {
        title: "Penyortiran Otomatis Silabus",
        desc: "Gunakan fitur Smart Auto-Sorter untuk membaca teks Rencana Pembelajaran Semester (RPS) dan menyusun struktur modul secara otomatis.",
      },
      {
        title: "AI Tutor Berbasis Pengetahuan Modul (RAG)",
        desc: "Ajukan pertanyaan seputar materi perkuliahan pada menu AI Tutor. Asisten AI akan merujuk langsung ke catatan dan modul yang Anda miliki.",
      },
      {
        title: "Pembuatan Kuis Akademik Mandiri",
        desc: "Akses menu Kuis AI untuk menghasilkan latihan soal pilihan ganda interaktif lengkap dengan pembahasan jawaban.",
      },
    ],
    tips: "Unggah berkas tugas atau catatan kode Anda ke AI Tutor untuk mendapatkan analisis dan penjelasan baris per baris.",
  },
  {
    id: "tugas-dan-kelas",
    category: "tugas-kelas",
    title: "4. Manajemen Tugas, Ruang Kelas & Jadwal",
    subtitle: "Pusat pelacakan tenggat waktu akademik, ruang kelas kuliah, dan integrasi tatap muka daring.",
    badge: "Manajemen Waktu",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    icon: ClipboardList,
    actionUrl: "/dashboard/kelas",
    actionLabel: "Kelola Kelas",
    steps: [
      {
        title: "Ruang Kelas Terintegrasi",
        desc: "Tambahkan data mata kuliah, ruang perkuliahan, nama dosen pengampu, serta tautan konferensi Zoom atau Google Meet.",
      },
      {
        title: "Pelacakan Batas Waktu Tugas",
        desc: "Catat penugasan akademik lengkap dengan tingkat prioritas, lampiran referensi, dan hitung mundur tanggal tenggat waktu.",
      },
      {
        title: "Kalender dan Pengingat",
        desc: "Pantau agenda perkuliahan harian dan mingguan melalui tampilan kalender untuk menghindari keterlambatan penugasan.",
      },
    ],
    tips: "Hubungkan materi atau modul langsung ke ruang kelas agar anggota kelas dapat mengunduh materi kuliah dengan satu klik.",
  },
  {
    id: "keamanan-filter",
    category: "keamanan",
    title: "5. Keamanan Berkas & Standar Integritas Data",
    subtitle: "Perlindungan ganda terhadap berkas executable mencurigakan dan penegakan hak akses database.",
    badge: "Keamanan Sistem",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/25",
    icon: ShieldCheck,
    steps: [
      {
        title: "Inspeksi Binary Magic Bytes",
        desc: "Sistem membaca header berkas biner untuk mencegah file berbahaya (.exe, .bat, .dll, shell script) yang disamarkan dengan ekstensi dokumen palsu.",
      },
      {
        title: "Daftar Putih Format Akademik",
        desc: "Hanya dokumen bahan ajar yang diizinkan: Dokumen PDF/Office, Kode Sumber Pemrograman, Berkas Notebook Jupyter, Data Tabel, dan Gambar.",
      },
      {
        title: "Filter Konten Akademik",
        desc: "Pencegahan otomatis terhadap teks spam, promosi tidak sah, serta konten yang melanggar etika perkuliahan.",
      },
      {
        title: "Matriks Hak Akses Berjenjang",
        desc: "Penerapan Row Level Security (RLS) memastikan berkas privat hanya dapat dimodifikasi oleh pembuat atau pengelola sistem.",
      },
    ],
    importantNote: "Pastikan format berkas sesuai standar dokumen pembelajaran saat melakukan pengunggahan berkas ke sistem.",
  },
  {
    id: "statistik-belajar",
    category: "ai-tools",
    title: "6. Analisis Aktivitas & Pencapaian Belajar",
    subtitle: "Visualisasi jam belajar, pencapaian target materi, dan evaluasi konsistensi studi.",
    badge: "Statistik",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/25",
    icon: BarChart3,
    actionUrl: "/dashboard/statistik",
    actionLabel: "Lihat Statistik",
    steps: [
      {
        title: "Diagram Aktivitas Belajar",
        desc: "Lihat ringkasan estimasi jam belajar dalam bentuk grafik yang informatif dan jujur.",
      },
      {
        title: "Indikator Capaian Target",
        desc: "Pantau persentase penyelesaian modul, total tugas yang telah tuntas, dan bab yang berhasil diselesaikan.",
      },
      {
        title: "Pencapaian Konsistensi",
        desc: "Catat streak belajar harian seiring bertambahnya aktivitas belajar dan penyelesaian tugas.",
      },
    ],
    tips: "Pertahankan konsistensi belajar harian dengan menyelesaikan minimal satu bab modul atau tugas perkuliahan setiap hari.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Siapa saja yang memiliki wewenang untuk mengunggah dan mengedit berkas di dalam folder modul?",
    a: "Hanya pembuat modul bersangkutan dan pengelola yang memiliki wewenang mengunggah berkas, membuat folder, mengganti nama, atau menghapus berkas. Pengguna lain berada dalam mode baca (Read-Only) untuk melihat dan mengunduh berkas.",
  },
  {
    q: "Mengapa sistem menolak pengunggahan berkas tertentu?",
    a: "Sistem dilengkapi dengan Academic Content Filter dan Binary Magic Byte Scanner. Berkas akan ditolak apabila terdeteksi sebagai file eksekusi biner berbahaya (.exe, .bat, .dll), menggunakan manipulasi ekstensi ganda, atau mengandung konten yang tidak sesuai dengan peruntukan akademik.",
  },
  {
    q: "Bagaimana cara membaca pratinjau dokumen tanpa harus mengunduh?",
    a: "Buka modul yang diinginkan, masuk ke Module Drive, lalu klik pada nama berkas atau tombol pratinjau. Jendela pembaca berkas terintegrasi akan menampilkan dokumen PDF, source code pemrograman, data spreadsheet, atau gambar secara langsung.",
  },
  {
    q: "Bagaimana cara kerja sistem Reaksi dan Forum Diskusi?",
    a: "Setiap kartu modul dilengkapi tombol reaksi dan panel Diskusi & Komentar untuk bertukar tanya-jawab seputar materi pembelajaran.",
  },
  {
    q: "Bagaimana cara mengubah tema antarmuka dan latar belakang?",
    a: "Masuk ke menu Pengaturan di navigasi bilah sisi. Anda dapat mengatur mode gelap atau terang, menentukan aksen warna antarmuka, serta memilih varian latar belakang visual yang telah diakselerasi oleh GPU.",
  },
];

export default function PanduanAplikasiPage() {
  const [activeTab, setActiveTab] = useState<string>("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<Record<number, boolean>>({});
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("support@velqora.com");
    setCopiedEmail(true);
    toast.success("Alamat email dukungan berhasil disalin!");
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const toggleFaq = (idx: number) => {
    setExpandedFaq((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const filteredGuides = GUIDE_ITEMS.filter((item) => {
    const matchesTab = activeTab === "semua" || item.category === activeTab;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesTab;

    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.subtitle.toLowerCase().includes(query) ||
      item.steps.some(
        (s) =>
          s.title.toLowerCase().includes(query) || s.desc.toLowerCase().includes(query)
      ) ||
      (item.tips && item.tips.toLowerCase().includes(query));

    return matchesTab && matchesSearch;
  });

  const filteredFaqs = FAQ_ITEMS.filter((f) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return f.q.toLowerCase().includes(query) || f.a.toLowerCase().includes(query);
  });

  return (
    <div className="page-container space-y-6 sm:space-y-8 pb-12 animate-fade-in">
      {/* ─── 1. Header Section ─── */}
      <section className="space-y-4 pt-1">
        <PageHeader
          eyebrow="~/docs"
          technicalMark="< handbook // faqs />"
          title="Cara kerja platform"
          description="Petunjuk ringkas agar kamu bisa memaksimalkan semua fitur belajar."
          border={false}
        />

        {/* Search Bar Console */}
        <div className="relative z-10 max-w-2xl mx-auto px-1 pt-1">
          <div className="group relative rounded-2xl border border-border bg-surface p-2.5 sm:p-3.5 shadow-2xl space-y-2.5 transition-all duration-200 hover:border-brand-500/50 focus-within:border-brand-500/70 focus-within:ring-1 focus-within:ring-brand-500/30">
            <div className="flex items-center gap-2.5 px-2 py-1">
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-text-tertiary shrink-0" />
              <div className="w-full relative flex items-center min-w-0">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari panduan: upload berkas, reaksi like, asisten AI, hak akses..."
                  className="w-full bg-transparent text-xs sm:text-sm md:text-base text-text-primary placeholder:text-text-tertiary focus:outline-none font-medium truncate"
                />
                {!searchQuery && (
                  <span className="inline-block w-0.5 h-3.5 sm:h-4 bg-brand-400 ml-0.5 animate-pulse shrink-0" />
                )}
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-[11px] text-text-secondary hover:text-text-primary px-2 py-1 rounded-lg bg-surface-secondary hover:bg-surface-tertiary border border-border flex items-center gap-1 transition-colors shrink-0"
                  title="Hapus pencarian panduan"
                  aria-label="Hapus pencarian"
                >
                  <X className="w-3 h-3" />
                  <span className="font-medium text-[11px]">Reset</span>
                </button>
              )}
            </div>

            {/* Category Filter Pills inside Search Console */}
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 border-t border-border scrollbar-none touch-pan-x">
              {[
                { id: "semua", label: "Semua Panduan" },
                { id: "modul-drive", label: "Modul & Drive" },
                { id: "interaksi", label: "Diskusi & Reaksi" },
                { id: "tugas-kelas", label: "Kelas & Tugas" },
                { id: "ai-tools", label: "AI & Statistik" },
                { id: "keamanan", label: "Keamanan & Akses" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 min-h-[34px] rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 active:scale-95 flex items-center justify-center ${
                    activeTab === tab.id
                      ? "bg-brand-600 text-white shadow-sm"
                      : "bg-surface-secondary text-text-secondary hover:text-text-primary hover:bg-surface-tertiary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. Guide Cards ─── */}
      <div className="space-y-4">
        {filteredGuides.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-surface border border-border p-8 shadow-sm">
            <HelpCircle className="w-10 h-10 text-text-tertiary mx-auto mb-3" />
            <h3 className="text-sm font-bold text-text-primary">Panduan Tidak Ditemukan</h3>
            <p className="text-xs text-text-secondary mt-1">
              Tidak ada topik panduan yang sesuai dengan kata kunci pencarian Anda.
            </p>
          </div>
        ) : (
          filteredGuides.map((guide) => {
            const Icon = guide.icon;

            return (
              <Card
                key={guide.id}
                className="p-5 sm:p-6 rounded-2xl bg-surface border-border hover:border-brand-500/40 transition-all space-y-5 shadow-sm"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3.5 border-b border-border">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-bold text-text-primary">{guide.title}</h2>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-surface-secondary text-text-secondary border border-border">
                          {guide.badge}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {guide.subtitle}
                      </p>
                    </div>
                  </div>

                  {guide.actionUrl && (
                    <Link href={guide.actionUrl} className="shrink-0">
                      <Button size="sm" variant="outline" className="text-xs font-semibold gap-1.5 h-8 border-border">
                        <span>{guide.actionLabel || "Buka Halaman"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {guide.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-surface-secondary/70 border border-border/60 space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-text-primary">{step.title}</h4>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-relaxed pl-7">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Tips & Notes */}
                {(guide.tips || guide.importantNote) && (
                  <div className="space-y-2 pt-1">
                    {guide.tips && (
                      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-secondary border border-border text-xs text-text-secondary leading-relaxed">
                        <Sparkles className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-semibold text-text-primary">Saran Praktis: </strong>
                          {guide.tips}
                        </div>
                      </div>
                    )}

                    {guide.importantNote && (
                      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-secondary border border-border text-xs text-text-secondary leading-relaxed">
                        <ShieldAlert className="w-4 h-4 text-text-tertiary shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-semibold text-text-primary">Ketentuan Hak Akses: </strong>
                          {guide.importantNote}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* ─── 3. Role & Permissions Matrix Table ─── */}
      <div className="rounded-2xl bg-surface border border-border p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-bold text-text-primary">
              Matriks Hak Akses Pengguna
            </h3>
          </div>
          <p className="text-xs text-text-secondary">
            Panduan otorisasi hak akses untuk menjaga integritas dan keamanan bahan ajar.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-secondary border-b border-border text-text-tertiary font-mono">
                <th className="py-2.5 px-4 font-semibold">Tindakan / Fitur</th>
                <th className="py-2.5 px-4 font-semibold">Owner (Super Admin)</th>
                <th className="py-2.5 px-4 font-semibold">Pembuat Modul</th>
                <th className="py-2.5 px-4 font-semibold">Pengguna Umum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-text-secondary">
              <tr>
                <td className="py-2.5 px-4 font-medium text-text-primary">Melihat & Mengunduh Berkas Modul</td>
                <td className="py-2.5 px-4 text-emerald-400 font-semibold">Diizinkan</td>
                <td className="py-2.5 px-4 text-emerald-400 font-semibold">Diizinkan</td>
                <td className="py-2.5 px-4 text-emerald-400 font-semibold">Diizinkan</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-text-primary">Pratinjau Berkas Dokumen (PDF, Kode, Gambar)</td>
                <td className="py-2.5 px-4 text-emerald-400 font-semibold">Diizinkan</td>
                <td className="py-2.5 px-4 text-emerald-400 font-semibold">Diizinkan</td>
                <td className="py-2.5 px-4 text-emerald-400 font-semibold">Diizinkan</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-text-primary">Memberikan Reaksi Like & Dislike</td>
                <td className="py-2.5 px-4 text-emerald-400 font-semibold">Diizinkan</td>
                <td className="py-2.5 px-4 text-emerald-400 font-semibold">Diizinkan</td>
                <td className="py-2.5 px-4 text-emerald-400 font-semibold">Diizinkan</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-text-primary">Menulis Komentar Diskusi Akademik</td>
                <td className="py-2.5 px-4 text-emerald-400 font-semibold">Lencana Owner</td>
                <td className="py-2.5 px-4 text-emerald-400 font-semibold">Lencana Pembuat</td>
                <td className="py-2.5 px-4 text-emerald-400 font-semibold">Lencana Mahasiswa</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-text-primary">Unggah, Ubah Nama, & Hapus Berkas</td>
                <td className="py-2.5 px-4 text-emerald-400 font-semibold">Seluruh Folder</td>
                <td className="py-2.5 px-4 text-emerald-400 font-semibold">Folder Milik Sendiri</td>
                <td className="py-2.5 px-4 text-text-tertiary font-semibold">Hanya Baca</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-text-primary">Ubah Judul, Kategori & Bab Modul</td>
                <td className="py-2.5 px-4 text-emerald-400 font-semibold">Diizinkan</td>
                <td className="py-2.5 px-4 text-emerald-400 font-semibold">Modul Sendiri</td>
                <td className="py-2.5 px-4 text-text-tertiary font-semibold">Tidak Diizinkan</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-text-primary">Moderasi / Hapus Komentar Anggota Lain</td>
                <td className="py-2.5 px-4 text-emerald-400 font-semibold">Semua Komentar</td>
                <td className="py-2.5 px-4 text-emerald-400 font-semibold">Di Modul Sendiri</td>
                <td className="py-2.5 px-4 text-text-secondary">Komentar Sendiri</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 4. Frequently Asked Questions (FAQ) ─── */}
      <div className="rounded-2xl bg-surface border border-border p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-bold text-text-primary">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h3>
          </div>
          <p className="text-xs text-text-secondary">
            Penjelasan ringkas untuk menjawab pertanyaan umum pengguna sistem.
          </p>
        </div>

        <div className="space-y-2.5">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = expandedFaq[idx];

            return (
              <div
                key={idx}
                className="rounded-xl bg-surface-secondary/60 border border-border overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-3.5 text-left flex items-center justify-between gap-3 hover:bg-surface-tertiary transition-colors"
                >
                  <span className="text-xs font-bold text-text-primary">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-brand-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-text-tertiary shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-3.5 text-xs text-text-secondary leading-relaxed border-t border-border/60 pt-2.5 bg-surface/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── 5. Kritik dan Saran — Mobile-Optimized ─── */}
      <div className="rounded-2xl bg-surface border border-border p-4 sm:p-6 space-y-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0 mt-0.5 sm:mt-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-text-primary">
                  Kritik dan Saran
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-secondary text-text-secondary border border-border hidden sm:inline-block">
                  Pusat Masukan
                </span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed max-w-2xl">
                Kirimkan masukan, laporan kendala, kritik membangun, atau ide pengembangan fitur untuk membantu kami terus meningkatkan kualitas platform Velqora.
              </p>
            </div>
          </div>

          {/* Action Buttons: Responsive Grid for Mobile (Full Width) & Inline on Desktop */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto shrink-0 pt-1 sm:pt-0">
            <a
              href="mailto:support@velqora.com?subject=Kritik%20%26%20Saran%20Velqora&body=Halo%20Tim%20Velqora%2C%0A%0ASaya%20ingin%20menyampaikan%20masukan%20mengenai%3A%0A%0A%5BTuliskan%20masukan%2C%20saran%2C%20atau%20kendala%20Anda%20di%20sini%5D%0A%0ATerima%20kasih."
              className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 active:scale-[0.98] text-white shadow-md shadow-brand-500/20 transition-all touch-manipulation text-center w-full sm:w-auto"
            >
              <Mail className="w-4 h-4 shrink-0" />
              <span>Kirim via Email</span>
            </a>

            <a
              href="https://wa.me/6283162031942?text=Halo%20Admin%20Velqora%2C%20saya%20ingin%20menyampaikan%20kritik%20dan%20saran%20mengenai%20platform%3A%20"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl text-xs font-bold bg-surface-secondary hover:bg-surface-tertiary active:scale-[0.98] text-text-primary border border-border shadow-sm transition-all touch-manipulation text-center w-full sm:w-auto"
            >
              <MessageCircle className="w-4 h-4 shrink-0 text-[#25D366]" />
              <span>Kirim via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* ─── 6. Footer Navigation Links ─── */}
      <div className="rounded-2xl bg-surface border border-border p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-text-primary">Mulai Eksplorasi Materi</h4>
          <p className="text-xs text-text-secondary">
            Akses langsung ke koleksi modul pembelajaran atau kelola preferensi akun Anda.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link href="/dashboard/modul">
            <Button size="sm" className="text-xs font-semibold">
              Buka Modul
            </Button>
          </Link>
          <Link href="/dashboard/pengaturan">
            <Button variant="outline" size="sm" className="text-xs font-semibold border-border">
              Pengaturan Akun
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
