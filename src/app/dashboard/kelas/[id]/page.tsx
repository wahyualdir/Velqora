"use client";

import { useState, useEffect, use } from "react";
import {
  Users,
  Copy,
  Check,
  ArrowLeft,
  MessageSquare,
  ClipboardList,
  FileText,
  Plus,
  Send,
  Download,
  CheckCircle2,
  Clock,
  UserCheck,
  Sparkles,
  AlertCircle,
  FolderOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { ClassItem, getLocalClasses, AnnouncementItem } from "@/lib/class-service";

interface ClassTask {
  id: string;
  title: string;
  dueDate: string;
  points: number;
  description: string;
  isCompleted: boolean;
}

interface ClassMaterial {
  id: string;
  title: string;
  type: string;
  size: string;
  url: string;
  createdAt: string;
}

export default function DetailRuangKelasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const classId = resolvedParams.id as string;

  const [classData, setClassData] = useState<ClassItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"stream" | "tugas" | "materi" | "members">("stream");

  // State for Class Assignments (persisted per class)
  const [classTasks, setClassTasks] = useState<ClassTask[]>([]);

  // State for New Task Form
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");

  // State for Class Materials (persisted per class)
  const [classMaterials, setClassMaterials] = useState<ClassMaterial[]>([]);

  // State for New Material Form
  const [newMatTitle, setNewMatTitle] = useState("");
  const [newMatType, setNewMatType] = useState("Dokumen PDF");

  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        const email = data?.user?.email || "";
        const nameFromEmail = email ? email.split("@")[0] : "Pengguna";

        setUserEmail(email);
        setUserName(nameFromEmail);

        const all = getLocalClasses();
        const found = all.find((c) => c.id === classId);

        if (found) {
          setClassData(found);
        }

        // Load tasks per class from localStorage
        if (typeof window !== "undefined") {
          const savedTasks = localStorage.getItem(`velqora_class_tasks_${classId}`);
          if (savedTasks) {
            try {
              setClassTasks(JSON.parse(savedTasks));
            } catch {
              setClassTasks([]);
            }
          }

          const savedMaterials = localStorage.getItem(`velqora_class_materials_${classId}`);
          if (savedMaterials) {
            try {
              setClassMaterials(JSON.parse(savedMaterials));
            } catch {
              setClassMaterials([]);
            }
          }

          const savedAnnouncements = localStorage.getItem(`velqora_class_announcements_${classId}`);
          if (savedAnnouncements) {
            try {
              setAnnouncements(JSON.parse(savedAnnouncements));
            } catch {
              setAnnouncements([]);
            }
          }
        }
      } catch (err) {
        console.error("Gagal memuat detail kelas:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [classId]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const task: ClassTask = {
      id: "task-" + Date.now(),
      title: newTaskTitle.trim(),
      dueDate: newTaskDueDate || new Date(Date.now() + 86400000 * 7).toISOString(),
      points: 100,
      description: newTaskDesc.trim() || "Kerjakan tugas ini sesuai dengan petunjuk yang diberikan.",
      isCompleted: false,
    };

    const updated = [task, ...classTasks];
    setClassTasks(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(`velqora_class_tasks_${classId}`, JSON.stringify(updated));
    }

    setNewTaskTitle("");
    setNewTaskDesc("");
    setNewTaskDueDate("");
    toast.success(`Tugas "${task.title}" berhasil ditambahkan ke kelas!`);
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatTitle.trim()) return;

    const mat: ClassMaterial = {
      id: "mat-" + Date.now(),
      title: newMatTitle.trim(),
      type: newMatType,
      size: "1.2 MB",
      url: "#",
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updated = [mat, ...classMaterials];
    setClassMaterials(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(`velqora_class_materials_${classId}`, JSON.stringify(updated));
    }

    setNewMatTitle("");
    toast.success(`Materi "${mat.title}" berhasil dibagikan!`);
  };

  const handleCopyCode = () => {
    if (!classData) return;
    navigator.clipboard.writeText(classData.code);
    setCopied(true);
    toast.success(`Kode kelas "${classData.code}" berhasil disalin!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;

    const item: AnnouncementItem = {
      id: "ann-" + Date.now(),
      classId,
      authorName: userName || "Pengguna Velqora",
      authorEmail: userEmail,
      content: newAnnouncement.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [item, ...announcements];
    setAnnouncements(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(`velqora_class_announcements_${classId}`, JSON.stringify(updated));
    }

    setNewAnnouncement("");
    toast.success("Pengumuman berhasil dipublikasikan di kelas!");
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
        <div className="h-6 w-36 bg-surface-secondary rounded-lg" />
        <div className="h-44 rounded-2xl bg-surface border border-border" />
        <div className="h-10 w-80 bg-surface-secondary rounded-lg" />
        <div className="h-64 rounded-2xl bg-surface border border-border" />
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-surface-secondary border border-border flex items-center justify-center text-text-tertiary mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-text-primary">Kelas Tidak Ditemukan</h2>
          <p className="text-xs text-text-secondary">
            Kelas dengan ID atau kode ini tidak ditemukan dalam akun Anda.
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/kelas")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-colors shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Ruang Kelas</span>
        </button>
      </div>
    );
  }

  const isTeacher = classData.teacherEmail === userEmail;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Back Button */}
      <button
        onClick={() => router.push("/dashboard/kelas")}
        className="flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Daftar Kelas</span>
      </button>

      {/* Classroom Hero Banner */}
      <div className={`rounded-2xl p-6 sm:p-8 bg-gradient-to-r ${classData.bannerColor || "from-brand-600 to-purple-600"} text-white shadow-sm relative overflow-hidden space-y-4`}>
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/30 backdrop-blur-md">
            {classData.subject}
          </span>

          {/* 6-Digit Class Code Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-xs">
            <span className="text-white/80 font-medium">Kode Kelas:</span>
            <span className="font-mono font-bold text-amber-300 text-sm tracking-wider">
              {classData.code}
            </span>
            <button
              onClick={handleCopyCode}
              title="Salin Kode"
              className="p-1 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-sm font-display">
            {classData.name}
          </h1>
          <p className="text-xs sm:text-sm text-white/90 max-w-2xl">
            {classData.description}
          </p>
        </div>

        <div className="pt-2 flex items-center gap-4 text-xs text-white/80">
          <div className="flex items-center gap-1.5 font-medium">
            <UserCheck className="w-4 h-4 text-amber-300" />
            <span>Pengajar: <strong>{classData.teacherName || "Pengajar Kelas"}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <Users className="w-4 h-4" />
            <span>{classData.membersCount || 1} Anggota Kelas</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab("stream")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === "stream"
              ? "bg-brand-600 text-white shadow-xs"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Pengumuman & Diskusi</span>
        </button>

        <button
          onClick={() => setActiveTab("tugas")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === "tugas"
              ? "bg-brand-600 text-white shadow-xs"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Tugas Kelas ({classTasks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("materi")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === "materi"
              ? "bg-brand-600 text-white shadow-xs"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Materi Pembelajaran ({classMaterials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("members")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === "members"
              ? "bg-brand-600 text-white shadow-xs"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Anggota Kelas</span>
        </button>
      </div>

      {/* Stream Tab */}
      {activeTab === "stream" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Post Announcement & Feed */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* Post Announcement Form */}
            <form onSubmit={handlePostAnnouncement} className="p-5 rounded-2xl border border-border bg-surface space-y-3 shadow-xs">
              <div className="text-xs font-semibold text-text-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <span>Bagikan Pengumuman atau Diskusi Kelas</span>
              </div>
              <textarea
                value={newAnnouncement}
                onChange={(e) => setNewAnnouncement(e.target.value)}
                placeholder="Tulis pengumuman, materi baru, atau pertanyaan untuk anggota kelas..."
                rows={3}
                className="w-full py-2.5 px-3 rounded-xl border border-border bg-surface-secondary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-500 text-xs resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newAnnouncement.trim()}
                  className="flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-xs disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publikasikan</span>
                </button>
              </div>
            </form>

            {/* Announcement List */}
            {announcements.length === 0 ? (
              <div className="p-8 rounded-2xl border border-border bg-surface text-center space-y-2">
                <MessageSquare className="w-8 h-8 text-text-tertiary mx-auto" />
                <h3 className="text-xs font-bold text-text-primary">Belum Ada Pengumuman</h3>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  Pengumuman dan diskusi dari pengajar atau anggota kelas akan muncul di sini.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-5 rounded-2xl border border-border bg-surface space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-brand-500/10 border border-brand-500/25 flex items-center justify-center text-xs font-bold text-brand-400">
                          {ann.authorName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-text-primary">{ann.authorName}</div>
                          <div className="text-[10px] text-text-tertiary font-mono">
                            {new Date(ann.createdAt).toLocaleString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-text-secondary leading-relaxed">
                      {ann.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Right Column: Class Code Share Card */}
          <div className="space-y-5">
            <div className="p-5 rounded-2xl border border-border bg-surface space-y-4 shadow-xs">
              <h3 className="text-xs font-semibold text-text-primary">
                Undang Siswa / Anggota
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Bagikan kode 6-digit berikut ke siswa agar dapat bergabung secara otomatis:
              </p>

              <div className="p-4 rounded-xl border border-brand-500/30 bg-brand-500/10 text-center space-y-1">
                <div className="text-[10px] text-brand-400 uppercase font-semibold">
                  Kode Kelas
                </div>
                <div className="text-2xl font-mono font-bold text-text-primary tracking-widest">
                  {classData.code}
                </div>
              </div>

              <button
                onClick={handleCopyCode}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-xs transition-all cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? "Tersalin!" : "Salin Kode Kelas"}</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Tugas Kelas Tab */}
      {activeTab === "tugas" && (
        <div className="space-y-6">
          {/* Add Task Form (For Teacher) */}
          {isTeacher && (
            <form onSubmit={handleAddTask} className="p-5 rounded-2xl border border-brand-500/30 bg-surface space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-400">
                <Plus className="w-4 h-4" />
                <span>Buat Tugas Baru untuk Siswa (Pengajar Mode)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Judul Tugas..."
                  required
                  className="py-2.5 px-3 rounded-xl border border-border bg-surface-secondary text-text-primary text-xs placeholder:text-text-tertiary focus:outline-none focus:border-brand-500"
                />
                <input
                  type="datetime-local"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="py-2.5 px-3 rounded-xl border border-border bg-surface-secondary text-text-primary text-xs focus:outline-none focus:border-brand-500"
                />
              </div>

              <textarea
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                placeholder="Petunjuk dan rincian pengerjaan tugas..."
                rows={2}
                className="w-full py-2.5 px-3 rounded-xl border border-border bg-surface-secondary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-500 text-xs resize-none"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Terbitkan Tugas</span>
                </button>
              </div>
            </form>
          )}

          {/* Tasks List */}
          {classTasks.length === 0 ? (
            <div className="p-8 rounded-2xl border border-border bg-surface text-center space-y-2">
              <ClipboardList className="w-8 h-8 text-text-tertiary mx-auto" />
              <h3 className="text-xs font-bold text-text-primary">Belum Ada Tugas di Kelas Ini</h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto">
                Tugas yang diterbitkan oleh pengajar akan muncul di daftar ini.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {classTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-5 rounded-2xl border border-border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-500/10 text-brand-400 border border-brand-500/25">
                        {t.points} Poin
                      </span>
                      {t.isCompleted ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Selesai
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Belum Dikumpulkan
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-text-primary font-display">{t.title}</h3>
                    <p className="text-xs text-text-secondary">{t.description}</p>
                  </div>

                  <div className="shrink-0 text-right space-y-2">
                    <div className="text-[10px] text-text-tertiary font-mono">
                      Tenggat: {new Date(t.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </div>

                    <button
                      onClick={() => {
                        const updated = classTasks.map((item) =>
                          item.id === t.id ? { ...item, isCompleted: !item.isCompleted } : item
                        );
                        setClassTasks(updated);
                        if (typeof window !== "undefined") {
                          localStorage.setItem(`velqora_class_tasks_${classId}`, JSON.stringify(updated));
                        }
                        toast.success(t.isCompleted ? "Status tugas diubah menjadi Belum Selesai" : "Tugas berhasil dikumpulkan!");
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        t.isCompleted
                          ? "bg-surface-secondary text-text-secondary hover:text-text-primary border border-border"
                          : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                      }`}
                    >
                      {t.isCompleted ? "Batalkan Pengumpulan" : "Kumpulkan Tugas"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Materi Pembelajaran Tab */}
      {activeTab === "materi" && (
        <div className="space-y-6">
          {/* Add Material Form (For Teacher) */}
          {isTeacher && (
            <form onSubmit={handleAddMaterial} className="p-5 rounded-2xl border border-brand-500/30 bg-surface space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-400">
                <Plus className="w-4 h-4" />
                <span>Bagikan Materi Pembelajaran Baru (Pengajar Mode)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newMatTitle}
                  onChange={(e) => setNewMatTitle(e.target.value)}
                  placeholder="Judul Materi / Modul..."
                  required
                  className="sm:col-span-2 py-2.5 px-3 rounded-xl border border-border bg-surface-secondary text-text-primary text-xs placeholder:text-text-tertiary focus:outline-none focus:border-brand-500"
                />
                <select
                  value={newMatType}
                  onChange={(e) => setNewMatType(e.target.value)}
                  className="py-2.5 px-3 rounded-xl border border-border bg-surface-secondary text-text-primary text-xs focus:outline-none focus:border-brand-500"
                >
                  <option value="Dokumen PDF">Dokumen PDF</option>
                  <option value="Code Reference">Code Reference</option>
                  <option value="Slide Presentasi">Slide Presentasi</option>
                  <option value="Video Pembelajaran">Video Pembelajaran</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Bagikan Materi</span>
                </button>
              </div>
            </form>
          )}

          {/* Materials List */}
          {classMaterials.length === 0 ? (
            <div className="p-8 rounded-2xl border border-border bg-surface text-center space-y-2">
              <FolderOpen className="w-8 h-8 text-text-tertiary mx-auto" />
              <h3 className="text-xs font-bold text-text-primary">Belum Ada Materi Pembelajaran</h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto">
                Bahan ajar, dokumen modul, dan slide dari pengajar akan ditampilkan di sini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {classMaterials.map((m) => (
                <div
                  key={m.id}
                  className="p-5 rounded-2xl border border-border bg-surface flex items-center justify-between gap-3 hover:border-brand-500/40 transition-all shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-text-primary line-clamp-1 font-display">{m.title}</h3>
                      <div className="text-[10px] text-text-tertiary mt-0.5 font-mono">
                        {m.type} • {m.size} • {m.createdAt}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toast.success(`Mengunduh materi "${m.title}"...`)}
                    className="p-2 rounded-xl bg-surface-secondary hover:bg-surface-tertiary text-text-secondary hover:text-text-primary transition-all shrink-0 cursor-pointer border border-border"
                    title="Unduh / Buka Materi"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Members Tab */}
      {activeTab === "members" && (
        <div className="p-6 rounded-2xl border border-border bg-surface space-y-6 shadow-xs">
          
          {/* Teacher Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-brand-400">
              Pengajar / Pembuat Kelas
            </h3>
            <div className="p-3.5 rounded-xl border border-border bg-surface-secondary flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-sm font-bold text-amber-400">
                {(classData.teacherName || "P").charAt(0)}
              </div>
              <div>
                <div className="text-xs font-semibold text-text-primary">{classData.teacherName || "Pengajar Kelas"}</div>
                <div className="text-[11px] text-text-tertiary">{classData.teacherEmail || userEmail}</div>
              </div>
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-text-secondary">
              Siswa Terdaftar ({classData.membersCount || 1})
            </h3>
            <div className="space-y-2">
              <div className="p-3.5 rounded-xl border border-border bg-surface-secondary flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-400">
                    {userName.charAt(0).toUpperCase() || "S"}
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary">{userName || "Siswa Pembelajar"}</div>
                    <div className="text-[10px] text-text-tertiary">Terdaftar via Kode {classData.code}</div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Aktif
                </span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
