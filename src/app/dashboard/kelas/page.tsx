"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  KeyRound,
  Copy,
  Check,
  BookOpen,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Search,
  School,
  UserCheck,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/client";
import { isAdminUser } from "@/lib/utils";
import {
  ClassItem,
  generateClassCode,
  getLocalClasses,
  saveLocalClass,
  deleteLocalClass,
  getJoinedClassCodes,
  addJoinedClassCode,
  getRandomBannerGradient,
} from "@/lib/class-service";

const DEMO_INITIAL_CLASSES: ClassItem[] = [];

export default function RuangKelasPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [joinedCodes, setJoinedCodes] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Form State - Create Class
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  // Form State - Join Class
  const [joinCodeInput, setJoinCodeInput] = useState("");

  // Load User & Classes
  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      const email = data?.user?.email || "user@velqora.com";
      const nameFromEmail = email.split("@")[0];

      setUserEmail(email);
      setUserName(nameFromEmail);

      const isUserAdmin =
        (typeof window !== "undefined" && localStorage.getItem("user_role") === "admin") ||
        (!!email && isAdminUser(email));
      setIsAdmin(isUserAdmin);

      const local = getLocalClasses();
      const joined = getJoinedClassCodes();

      setClasses(local);
      setJoinedCodes(joined);
    }

    loadData();
  }, []);

  const handleDeleteClass = (classId: string, className: string, teacherEmail: string) => {
    const isOwner = teacherEmail === userEmail;
    deleteLocalClass(classId);
    setClasses((prev) => prev.filter((c) => c.id !== classId));

    if (isAdmin && !isOwner) {
      toast.success(`[Admin Mode] Kelas "${className}" milik user lain berhasil dihapus.`);
    } else {
      toast.success(`Kelas "${className}" berhasil dihapus.`);
    }
  };

  // Generate code when opening create modal
  const handleOpenCreateModal = () => {
    setGeneratedCode(generateClassCode());
    setShowCreateModal(true);
  };

  const handleRegenerateCode = () => {
    setGeneratedCode(generateClassCode());
  };

  // Create Class Handler
  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subject) {
      toast.error("Nama kelas dan subjek wajib diisi!");
      return;
    }

    const newClass: ClassItem = {
      id: "class-" + Date.now(),
      name,
      subject,
      description: description || "Kelas pembelajaran Velqora",
      code: generatedCode || generateClassCode(),
      teacherName: userName || "Pengajar Velqora",
      teacherEmail: userEmail,
      createdAt: new Date().toISOString(),
      membersCount: 1,
      bannerColor: getRandomBannerGradient(),
    };

    saveLocalClass(newClass);
    setClasses((prev) => [newClass, ...prev]);
    toast.success(`Kelas "${name}" berhasil dibuat dengan Kode: ${newClass.code}`);

    // Reset
    setName("");
    setSubject("");
    setDescription("");
    setShowCreateModal(false);
  };

  // Join Class Handler
  const handleJoinClass = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = joinCodeInput.trim();

    if (!cleanCode) {
      toast.error("Masukkan kode kelas 6-digit!");
      return;
    }

    // Search class with exact code
    const targetClass = classes.find(
      (c) => c.code.toLowerCase() === cleanCode.toLowerCase()
    );

    if (!targetClass) {
      toast.error(`Kelas dengan kode "${cleanCode}" tidak ditemukan. Periksa kembali kode 6-digit (kapital/angka).`);
      return;
    }

    if (joinedCodes.includes(targetClass.code) || targetClass.teacherEmail === userEmail) {
      toast.info("Anda sudah menjadi anggota di kelas ini!");
      setShowJoinModal(false);
      setJoinCodeInput("");
      return;
    }

    addJoinedClassCode(targetClass.code);
    setJoinedCodes((prev) => [...prev, targetClass.code]);
    toast.success(`Berhasil bergabung ke kelas "${targetClass.name}"! 🎉`);

    setJoinCodeInput("");
    setShowJoinModal(false);
  };

  // Copy Code to Clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Kode kelas "${code}" disalin ke clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const [activeRoleFilter, setActiveRoleFilter] = useState<"all" | "teacher" | "student">("all");

  const filteredClasses = classes.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase());

    const isTeacher = c.teacherEmail === userEmail;
    const isStudent = joinedCodes.includes(c.code) || (!isTeacher && joinedCodes.includes(c.code));

    if (!matchesSearch) return false;
    if (activeRoleFilter === "teacher") return isTeacher;
    if (activeRoleFilter === "student") return isStudent;
    return true;
  });

  return (
    <div className="page-container space-y-6 sm:space-y-8 pb-12 animate-fade-in">
      
      {/* Header Banner */}
      <PageHeader
        eyebrow="~/classroom"
        technicalMark="< studio // cohort />"
        title="Ruang belajar bersama"
        description="Masuk ke kelas menggunakan kode akses atau buat ruang kelas untuk kelompokmu."
        actions={
          <>
            <button
              onClick={() => setShowJoinModal(true)}
              className="flex items-center gap-2 py-2 px-4 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold text-text-secondary hover:text-text-primary bg-surface-secondary hover:bg-surface-tertiary border border-border transition-all duration-150 active:scale-95 cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Gabung Kelas (Murid)</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 py-2 px-4 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-xs transition-all duration-150 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Kelas (Pengajar)</span>
            </button>
          </>
        }
      />

      {/* Role Selection Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-3 sm:p-4 rounded-2xl border border-border shadow-xs">
        {/* Role Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-surface-secondary border border-border gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveRoleFilter("all")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              activeRoleFilter === "all"
                ? "bg-brand-600 text-white shadow-xs"
                : "text-text-secondary hover:text-text-primary hover:bg-surface"
            }`}
          >
            <School className="w-4 h-4" />
            <span>Semua Peran</span>
          </button>

          <button
            onClick={() => setActiveRoleFilter("teacher")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              activeRoleFilter === "teacher"
                ? "bg-brand-600 text-white shadow-xs"
                : "text-text-secondary hover:text-text-primary hover:bg-surface"
            }`}
          >
            <UserCheck className="w-4 h-4 text-brand-300" />
            <span>Sebagai Pengajar</span>
          </button>

          <button
            onClick={() => setActiveRoleFilter("student")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              activeRoleFilter === "student"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-text-secondary hover:text-text-primary hover:bg-surface"
            }`}
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>Sebagai Murid</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-sm w-full flex items-center">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, subjek, atau kode..."
            className="w-full pl-10 pr-9 py-2 min-h-[38px] rounded-xl border border-border bg-surface-secondary text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 p-1 rounded-md text-text-tertiary hover:text-text-primary transition-colors"
              title="Hapus pencarian kelas"
              aria-label="Hapus pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Class Grid */}
      <div className="card-grid">
        {filteredClasses.length === 0 ? (
          <div className="col-span-full text-center py-12 border border-dashed border-border rounded-2xl bg-surface-secondary/50 space-y-3">
            <School className="w-10 h-10 text-text-tertiary mx-auto" />
            <div className="text-sm font-semibold text-text-secondary">Belum ada kelas</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Klik &quot;Buat Kelas Baru&quot; untuk membuat kelas baru, atau &quot;Gabung Kelas&quot; untuk memasukkan kode 6-digit.
            </p>
          </div>
        ) : (
          filteredClasses.map((item) => {
            const isOwner = item.teacherEmail === userEmail;
            const canDelete = isAdmin || isOwner;
            const isJoined = joinedCodes.includes(item.code);

            return (
              <div
                key={item.id}
                className="group relative rounded-xl border border-border bg-surface overflow-hidden hover:border-brand-500/40 transition-all duration-150 shadow-2xs flex flex-col justify-between"
              >
                {/* Class Card Banner */}
                <div className={`p-4 bg-gradient-to-r ${item.bannerColor} relative text-white space-y-1.5`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] uppercase font-semibold font-mono tracking-widest px-2 py-0.5 rounded bg-black/40 backdrop-blur-xs">
                      {item.subject}
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      {isOwner ? (
                        <span className="flex items-center gap-1 text-[9.5px] font-bold px-2 py-0.5 rounded bg-brand-500/30 border border-brand-300/40 text-white backdrop-blur-xs">
                          <UserCheck className="w-3 h-3" /> Pengajar
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[9.5px] font-bold px-2 py-0.5 rounded bg-amber-500/30 border border-amber-300/40 text-white backdrop-blur-xs">
                          <Users className="w-3 h-3" /> Murid
                        </span>
                      )}

                      {canDelete && (
                        <button
                          onClick={() => handleDeleteClass(item.id, item.name, item.teacherEmail)}
                          title={isAdmin && !isOwner ? "Admin: Hapus Kelas User Lain" : "Hapus Kelas Saya"}
                          className="p-1 rounded-md bg-rose-500/30 hover:bg-rose-500/50 border border-rose-400/40 text-white backdrop-blur-xs transition-all active:scale-95 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold tracking-tight leading-snug font-display drop-shadow-sm truncate">
                    {item.name}
                  </h3>

                  <p className="text-xs text-white/90 line-clamp-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Class Card Body */}
                <div className="p-3.5 sm:p-4 space-y-3 flex-1 flex flex-col justify-between">
                  
                  <div className="space-y-2.5">
                    {/* Teacher & Members */}
                    <div className="flex items-center justify-between text-xs text-text-tertiary">
                      <div className="flex items-center gap-2">
                        <div className="w-5.5 h-5.5 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-[10px] font-bold text-brand-400">
                          {item.teacherName.charAt(0)}
                        </div>
                        <span className="font-medium text-text-secondary text-xs">{item.teacherName}</span>
                      </div>

                      <div className="flex items-center gap-1 text-text-tertiary font-mono text-[11px]">
                        <Users className="w-3.5 h-3.5" />
                        <span>{item.membersCount} Siswa</span>
                      </div>
                    </div>

                    {/* Class Code Box */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-surface-secondary border border-border">
                      <div className="space-y-0.5">
                        <div className="text-[10px] text-text-tertiary font-mono uppercase">Kode Kelas</div>
                        <div className="text-xs font-mono font-bold text-brand-400 tracking-wider">
                          {item.code}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(item.code)}
                        className="px-2 py-1 rounded-md text-[11px] font-semibold text-text-secondary hover:text-text-primary bg-surface hover:bg-surface-tertiary border border-border transition-colors cursor-pointer flex items-center gap-1"
                      >
                        {copiedCode === item.code ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 text-[11px]">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-text-tertiary" />
                            <span className="text-[11px]">Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Open Class Link */}
                  <Link
                    href={`/dashboard/kelas/${item.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-text-primary bg-surface-secondary hover:bg-brand-600 hover:text-white transition-all duration-200 group/btn border border-border hover:border-brand-500"
                  >
                    <span>Buka Ruang Kelas</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Buat Kelas Baru */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-border bg-[#0c1220] p-6 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2 text-white font-semibold text-base">
                <School className="w-5 h-5 text-indigo-400" />
                <span>Buat Kelas Baru</span>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
              
              {/* Nama Kelas */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium text-xs">
                  Nama Kelas
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Pemrograman Web & Aplikasi"
                  required
                  className="w-full py-2.5 px-3 rounded-xl border border-border bg-white/[0.04] text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              {/* Subjek / Mata Kuliah */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium text-xs">
                  Subjek / Mata Kuliah
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Contoh: Teknik Informatika"
                  required
                  className="w-full py-2.5 px-3 rounded-xl border border-border bg-white/[0.04] text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              {/* Deskripsi */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium text-xs">
                  Deskripsi Singkat (Opsional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Penjelasan singkat mengenai kelas ini..."
                  rows={2}
                  className="w-full py-2.5 px-3 rounded-xl border border-border bg-white/[0.04] text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs resize-none"
                />
              </div>

              {/* Kode Random 6-Digit Preview */}
              <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-indigo-300">
                    Kode Akses Kelas (Random 6-Digit)
                  </span>
                  <button
                    type="button"
                    onClick={handleRegenerateCode}
                    className="text-[10px] text-indigo-400 hover:text-indigo-200 underline font-medium"
                  >
                    Acak Ulang
                  </button>
                </div>
                <div className="text-xl font-mono font-bold text-white tracking-widest text-center py-1">
                  {generatedCode}
                </div>
                <p className="text-[10px] text-slate-400 text-center">
                  Kode ini terdiri dari gabungan angka, huruf kecil, & huruf kapital.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="py-2.5 px-4 rounded-xl text-slate-400 hover:text-white font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Simpan & Buat Kelas
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal Gabung Kelas (6-Digit Code Input) */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-border bg-[#0c1220] p-6 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2 text-white font-semibold text-base">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <span>Gabung ke Kelas</span>
              </div>
              <button
                onClick={() => setShowJoinModal(false)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleJoinClass} className="space-y-4 text-xs">
              <p className="text-slate-400 leading-relaxed text-xs">
                Mintalah <strong>Kode Kelas 6-Digit</strong> dari pengajar/pembuat kelas, lalu masukkan di bawah ini:
              </p>

              {/* Input Kode 6-Digit */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium text-xs">
                  Kode Kelas (6-Digit)
                </label>
                <input
                  type="text"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value)}
                  placeholder="Contoh: K9x7B2"
                  maxLength={6}
                  required
                  className="w-full py-3 px-4 rounded-xl border border-amber-500/40 bg-white/[0.04] text-white font-mono text-center text-lg tracking-widest uppercase focus:outline-none focus:border-amber-400 placeholder:text-slate-600 placeholder:font-sans placeholder:text-xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="py-2.5 px-4 rounded-xl text-slate-400 hover:text-white font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl text-slate-900 bg-amber-400 hover:bg-amber-300 font-semibold shadow-lg shadow-amber-400/20"
                >
                  Gabung Sekarang
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
