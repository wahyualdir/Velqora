"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Clock,
  CheckCircle2,
  Trash2,
  Calendar as CalendarIcon,
  ClipboardList,
  Bell,
  MapPin,
  RefreshCw,
  ExternalLink,
  BookOpen,
  Filter,
  Layers,
  AlertCircle,
  Sparkles,
  Search,
} from "lucide-react";
import { Card, Badge, Skeleton, EmptyState, ConfirmDialog } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { getTasks, updateTask, deleteTask } from "@/actions/study-actions";
import { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS } from "@/types";
import { formatDate, daysUntilDeadline } from "@/lib/utils";
import { GoogleClassroomIcon } from "@/components/ui/brand-logos";
import {
  ClassroomSyncState,
  connectGoogleClassroom,
  getClassroomState,
} from "@/lib/classroom-sync";
import { getActiveUserIdentifier } from "@/lib/bookmark-service";
import { toast } from "sonner";

function getScheduleStorageKey(): string {
  const user = getActiveUserIdentifier();
  return `velqora_jadwal_user_${user}`;
}

interface ReminderItem {
  id: string;
  title: string;
  subject: string;
  day: string;
  time: string;
  location: string;
  type: "jadwal" | "reminder" | "classroom";
  priority: "tinggi" | "sedang" | "rendah";
  isCompleted?: boolean;
  dueDate?: string;
  dueTime?: string;
  classroomUrl?: string;
  courseId?: string;
}

const DAYS = ["Semua", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

function TugasPageContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "jadwal" ? "jadwal" : searchParams.get("tab") === "reminder" ? "reminder" : "tugas";

  // Active Workspace Tab
  const [activeTab, setActiveTab] = useState<"tugas" | "jadwal" | "reminder">(initialTab);

  // ─── 1. Tasks Management State ───
  const [tasks, setTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ─── 2. Schedule & Reminder State ───
  const [scheduleItems, setScheduleItems] = useState<ReminderItem[]>([]);
  const [selectedDay, setSelectedDay] = useState("Semua");
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [showConnectClassroomModal, setShowConnectClassroomModal] = useState(false);
  const [isSyncingClassroom, setIsSyncingClassroom] = useState(false);

  // Schedule Modal Form
  const [schedTitle, setSchedTitle] = useState("");
  const [schedSubject, setSchedSubject] = useState("");
  const [schedDay, setSchedDay] = useState("Senin");
  const [schedTime, setSchedTime] = useState("");
  const [schedLocation, setSchedLocation] = useState("");
  const [schedType, setSchedType] = useState<"jadwal" | "reminder">("jadwal");
  const [schedPriority, setSchedPriority] = useState<"tinggi" | "sedang" | "rendah">("sedang");

  // Classroom State
  const [classroomState, setClassroomState] = useState<ClassroomSyncState>({
    isConnected: false,
    userEmail: "",
    lastSyncedAt: null,
    courses: [],
    assignments: [],
    autoSync: true,
  });
  const [connectEmail, setConnectEmail] = useState("");
  const [connectToken, setConnectToken] = useState("");

  // Load Tasks from Database
  async function loadTasks() {
    setLoadingTasks(true);
    try {
      const list = await getTasks(search, statusFilter, priorityFilter);
      setTasks(list);
    } catch (err) {
      console.error("Failed to load tasks", err);
    } finally {
      setLoadingTasks(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, [search, statusFilter, priorityFilter]);

  // Load Schedule & Classroom
  const syncClassroomStateToItems = (gcState: ClassroomSyncState, initialList: ReminderItem[]) => {
    if (gcState.isConnected && gcState.assignments.length > 0) {
      const gcItems: ReminderItem[] = gcState.assignments.map((a) => {
        const targetDate = new Date(`${a.dueDate}T${a.dueTime}:00`);
        const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        const dayName = dayNames[targetDate.getDay()] || "Senin";

        return {
          id: a.id,
          title: a.title,
          subject: a.courseName,
          day: dayName,
          time: a.dueTime ? `Batas ${a.dueTime}` : "23:59",
          location: "Google Classroom",
          type: "classroom",
          priority: "tinggi",
          isCompleted: a.isCompleted || false,
          dueDate: a.dueDate,
          dueTime: a.dueTime,
          classroomUrl: a.alternateLink,
          courseId: a.courseId,
        };
      });

      const manualItems = initialList.filter((i) => i.type !== "classroom");
      const merged = [...gcItems, ...manualItems];
      setScheduleItems(merged);
      if (typeof window !== "undefined") {
        localStorage.setItem(getScheduleStorageKey(), JSON.stringify(merged));
      }
    } else {
      const manualItems = initialList.filter((i) => i.type !== "classroom");
      setScheduleItems(manualItems);
      if (typeof window !== "undefined") {
        localStorage.setItem(getScheduleStorageKey(), JSON.stringify(manualItems));
      }
    }
  };

  useEffect(() => {
    const gcState = getClassroomState();
    setClassroomState(gcState);

    const key = getScheduleStorageKey();
    const saved = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    let initialList: ReminderItem[] = [];

    if (saved) {
      try {
        initialList = JSON.parse(saved);
      } catch {
        initialList = [];
      }
    }

    syncClassroomStateToItems(gcState, initialList);
  }, []);

  const saveScheduleItems = (newItems: ReminderItem[]) => {
    setScheduleItems(newItems);
    if (typeof window !== "undefined") {
      localStorage.setItem(getScheduleStorageKey(), JSON.stringify(newItems));
    }
  };

  // Task Status Toggle
  const handleStatusChange = async (task: any, newStatus: string) => {
    try {
      await updateTask(task.id, {
        title: task.title,
        subject: task.subject,
        lecturer: task.lecturer,
        description: task.description,
        deadline: task.deadline,
        priority: task.priority,
        status: newStatus as any,
        external_url: task.external_url,
        notes: task.notes,
      });
      toast.success("Status tugas diperbarui");
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui status");
    }
  };

  // Task Delete
  const handleDeleteTask = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteTask(deleteId);
      toast.success("Tugas berhasil dihapus");
      setTasks(tasks.filter((t) => t.id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus tugas");
    } finally {
      setDeleting(false);
    }
  };

  // Add Manual Schedule
  const handleAddScheduleItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedTitle.trim()) {
      toast.error("Judul agenda wajib diisi");
      return;
    }

    const newItem: ReminderItem = {
      id: Date.now().toString(),
      title: schedTitle.trim(),
      subject: schedSubject.trim() || "Umum",
      day: schedDay,
      time: schedTime.trim() || "Fleksibel",
      location: schedLocation.trim() || "Kampus",
      type: schedType,
      priority: schedPriority,
      isCompleted: false,
    };

    const updated = [newItem, ...scheduleItems];
    saveScheduleItems(updated);
    toast.success(`${schedType === "jadwal" ? "Jadwal" : "Pengingat"} berhasil ditambahkan!`);

    setSchedTitle("");
    setSchedSubject("");
    setSchedTime("");
    setSchedLocation("");
    setShowAddScheduleModal(false);
  };

  // Toggle Schedule Item Done
  const handleToggleScheduleDone = (id: string) => {
    const updated = scheduleItems.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    saveScheduleItems(updated);
  };

  // Delete Schedule Item
  const handleDeleteScheduleItem = (id: string) => {
    const updated = scheduleItems.filter((i) => i.id !== id);
    saveScheduleItems(updated);
    toast.success("Agenda berhasil dihapus");
  };

  // Classroom Connect Handler
  const handleConfirmConnectClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncingClassroom(true);
    setShowConnectClassroomModal(false);

    try {
      const newState = await connectGoogleClassroom(connectEmail, connectToken);
      setClassroomState(newState);

      const key = getScheduleStorageKey();
      const saved = localStorage.getItem(key);
      let currentItems: ReminderItem[] = [];
      if (saved) {
        try {
          currentItems = JSON.parse(saved);
        } catch {
          currentItems = [];
        }
      }

      syncClassroomStateToItems(newState, currentItems);
      toast.success(`Google Classroom berhasil terhubung (${newState.courses.length} Kelas, ${newState.assignments.length} Tugas)`);
    } catch {
      toast.error("Gagal menghubungkan Google Classroom.");
    } finally {
      setIsSyncingClassroom(false);
    }
  };

  // Filtered Schedules
  const filteredScheduleList = useMemo(() => {
    return scheduleItems.filter((item) => {
      if (selectedDay !== "Semua" && item.day !== selectedDay) return false;
      return true;
    });
  }, [scheduleItems, selectedDay]);

  const classroomAssignmentsCount = classroomState.assignments.length;
  const pendingTasksCount = tasks.filter((t) => t.status !== "selesai").length;

  return (
    <div className="page-container space-y-6 sm:space-y-8 pb-12 animate-fade-in">
      {/* ─── 1. Header Workspace ─── */}
      <PageHeader
        eyebrow="~/tasks & timeline"
        technicalMark="< backlog // queue />"
        title="Apa yang perlu diselesaikan?"
        description="Pantau tugas aktif dan prioritaskan mana yang harus selesai lebih dulu."
        badge={
          pendingTasksCount > 0 ? (
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">
              {pendingTasksCount} Tugas Menunggu
            </span>
          ) : undefined
        }
        actions={
          <>
            <Link href="/dashboard/tugas/baru">
              <Button className="gap-2 text-xs sm:text-sm min-h-[40px] font-semibold shadow-xs">
                <Plus className="w-4 h-4" /> Tambah Tugas
              </Button>
            </Link>

            <Button
              variant="outline"
              onClick={() => setShowAddScheduleModal(true)}
              className="gap-2 text-xs sm:text-sm min-h-[40px]"
            >
              <CalendarIcon className="w-4 h-4 text-brand-400" /> Tambah Jadwal
            </Button>
          </>
        }
      />

      {/* ─── 2. Tab Navigation Switcher ─── */}
      <div className="flex items-center gap-2 border-b border-border pb-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("tugas")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeTab === "tugas"
              ? "bg-brand-600 text-white shadow-sm shadow-brand-500/20"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Daftar Tugas ({tasks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("jadwal")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeTab === "jadwal"
              ? "bg-brand-600 text-white shadow-sm shadow-brand-500/20"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          <span>Jadwal Perkuliahan ({scheduleItems.filter((i) => i.type === "jadwal").length})</span>
        </button>

        <button
          onClick={() => setActiveTab("reminder")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeTab === "reminder"
              ? "bg-brand-600 text-white shadow-sm shadow-brand-500/20"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Pengingat & Agenda ({classroomAssignmentsCount + scheduleItems.filter((i) => i.type === "reminder").length})</span>
        </button>
      </div>

      {/* ─── TAB 1: DAFTAR TUGAS ─── */}
      {activeTab === "tugas" && (
        <div className="space-y-6 animate-fade-in">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-surface p-4 sm:p-5 rounded-2xl border border-border shadow-xs">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <Input
                placeholder="Cari judul tugas, mata kuliah, dosen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
                className="pl-9 text-xs"
              />
            </div>

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              placeholder="Semua Status Pengerjaan"
              options={Object.entries(TASK_STATUS_LABELS).map(([k, v]) => ({
                value: k,
                label: v,
              }))}
            />

            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              placeholder="Semua Tingkat Prioritas"
              options={Object.entries(TASK_PRIORITY_LABELS).map(([k, v]) => ({
                value: k,
                label: v,
              }))}
            />
          </div>

          {/* Tasks Grid */}
          {loadingTasks ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <Skeleton className="h-44 rounded-2xl" />
              <Skeleton className="h-44 rounded-2xl" />
              <Skeleton className="h-44 rounded-2xl" />
            </div>
          ) : tasks.length === 0 ? (
            <EmptyState
              icon={<CheckCircle2 className="w-10 h-10 text-brand-400" />}
              title="Tidak ada tugas perkuliahan"
              description="Semua tugas sudah terselesaikan atau belum ada tugas yang dicatat di sistem."
              action={
                <Link href="/dashboard/tugas/baru">
                  <Button size="sm" className="gap-1.5 text-xs">
                    <Plus className="w-3.5 h-3.5" /> Buat Tugas Baru
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="card-grid">
              {tasks.map((task) => {
                const daysLeft = task.deadline ? daysUntilDeadline(task.deadline) : null;
                const isUrgent = daysLeft !== null && daysLeft <= 2 && task.status !== "selesai";

                return (
                  <Card
                    key={task.id}
                    className={`p-4 sm:p-4.5 lg:p-5 rounded-xl bg-surface transition-all flex flex-col justify-between space-y-3 shadow-2xs ${
                      isUrgent
                        ? "border-red-500/50 bg-red-500/[0.03]"
                        : "border-border hover:border-brand-500/40 hover:bg-surface-secondary/60"
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0">
                      {/* Priority tag & status */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-text-secondary truncate">
                          {task.subject || "Tugas Kuliah"}
                        </span>
                        <Badge
                          variant={
                            task.priority === "tinggi"
                              ? "danger"
                              : task.priority === "sedang"
                              ? "warning"
                              : "default"
                          }
                          size="sm"
                        >
                          {task.priority}
                        </Badge>
                      </div>

                      {/* Item Title */}
                      <h3 className="text-xs sm:text-sm font-bold text-text-primary leading-snug truncate font-display tracking-tight">
                        {task.title}
                      </h3>

                      {/* Description */}
                      {task.description && (
                        <p className="text-[11.5px] text-text-secondary line-clamp-1 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Lecturer */}
                      {task.lecturer && (
                        <div className="text-[10px] text-text-tertiary truncate">
                          Dosen: <span className="text-text-secondary">{task.lecturer}</span>
                        </div>
                      )}
                    </div>

                    {/* Deadline Visual Indicator */}
                    {task.deadline && (
                      <div
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10.5px] font-medium border ${
                          task.status === "selesai"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : daysLeft !== null && daysLeft <= 1
                            ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                            : daysLeft !== null && daysLeft <= 3
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            : "bg-surface-secondary text-text-secondary border-border"
                        }`}
                      >
                        <Clock className="w-3 h-3 shrink-0" />
                        <span className="truncate">{formatDate(task.deadline)}</span>
                        {task.status !== "selesai" && daysLeft !== null && (
                          <span className="ml-auto font-bold font-mono text-[10px] shrink-0">
                            {daysLeft < 0 ? "Lewat" : daysLeft === 0 ? "Hari ini" : `${daysLeft} hari`}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Status Select & Actions */}
                    <div className="pt-2.5 border-t border-border/50 flex items-center justify-between gap-2">
                      <Select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task, e.target.value)}
                        options={[
                          { value: "belum_dikerjakan", label: "Belum Dikerjakan" },
                          { value: "sedang_dikerjakan", label: "Sedang Dikerjakan" },
                          { value: "selesai", label: "Selesai" },
                        ]}
                        className="text-xs py-1 w-auto"
                      />

                      <button
                        onClick={() => setDeleteId(task.id)}
                        className="p-1 rounded-md text-text-tertiary hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Hapus tugas"
                        aria-label="Hapus tugas"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: JADWAL PERKULIAHAN ─── */}
      {activeTab === "jadwal" && (
        <div className="space-y-4 animate-fade-in">
          {/* Day Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  selectedDay === day
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-surface hover:bg-surface-secondary text-text-secondary border border-border"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {filteredScheduleList.filter((i) => i.type === "jadwal").length === 0 ? (
            <EmptyState
              icon={<CalendarIcon className="w-12 h-12 text-brand-400" />}
              title={`Tidak ada jadwal perkuliahan (${selectedDay})`}
              description="Tambahkan jadwal mata kuliah mingguan Anda agar tidak tertinggal materi dan kelas."
              action={
                <Button onClick={() => setShowAddScheduleModal(true)} className="gap-2">
                  <Plus className="w-4 h-4" /> Tambah Jadwal Baru
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredScheduleList
                .filter((i) => i.type === "jadwal")
                .map((item) => (
                  <Card
                    key={item.id}
                    className={`space-y-3 border transition-all ${
                      item.isCompleted ? "opacity-60 bg-surface/40" : "bg-surface"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-400">
                          {item.day}
                        </span>
                        <h4 className={`text-sm font-bold text-text-primary ${item.isCompleted ? "line-through" : ""}`}>
                          {item.title}
                        </h4>
                        <p className="text-xs text-text-secondary">{item.subject}</p>
                      </div>

                      <Badge variant={item.priority === "tinggi" ? "danger" : "default"}>
                        {item.priority}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-text-tertiary pt-1 border-t border-border">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-brand-400" />
                        <span>{item.time}</span>
                      </div>
                      {item.location && (
                        <div className="flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <span className="truncate">{item.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => handleToggleScheduleDone(item.id)}
                        className={`text-xs font-semibold flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                          item.isCompleted
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-surface-secondary text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{item.isCompleted ? "Hadir / Selesai" : "Tandai Hadir"}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteScheduleItem(item.id)}
                        className="p-1.5 rounded text-text-tertiary hover:text-red-400 hover:bg-surface-secondary transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 3: PENGINGAT & GOOGLE CLASSROOM ─── */}
      {activeTab === "reminder" && (
        <div className="space-y-6 animate-fade-in">
          {/* Google Classroom Connection Banner */}
          <div className="p-5 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <GoogleClassroomIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                  <span>Google Classroom Sync</span>
                  {classroomState.isConnected ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Terhubung
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-500/15 text-text-tertiary border border-border">
                      Belum Terhubung
                    </span>
                  )}
                </h3>
                <p className="text-xs text-text-secondary">
                  {classroomState.isConnected
                    ? `Sinkronisasi ${classroomState.courses.length} kelas & ${classroomState.assignments.length} tugas Google Classroom.`
                    : "Hubungkan akun Google Classroom untuk mengimpor tugas dan jadwal deadline otomatis."}
                </p>
              </div>
            </div>

            <Button
              variant={classroomState.isConnected ? "outline" : "primary"}
              onClick={() => setShowConnectClassroomModal(true)}
              loading={isSyncingClassroom}
              className="text-xs h-9 gap-2 shrink-0 w-full sm:w-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{classroomState.isConnected ? "Kelola Akun" : "Hubungkan Classroom"}</span>
            </Button>
          </div>

          {/* Reminders & Classroom Tasks List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-400" />
              Daftar Pengingat & Tugas Classroom
            </h3>

            {scheduleItems.filter((i) => i.type === "reminder" || i.type === "classroom").length === 0 ? (
              <EmptyState
                icon={<Bell className="w-12 h-12 text-brand-400" />}
                title="Tidak ada pengingat aktif"
                description="Tambahkan pengingat mandiri atau sinkronkan tugas Google Classroom Anda."
                action={
                  <Button onClick={() => setShowAddScheduleModal(true)} className="gap-2">
                    <Plus className="w-4 h-4" /> Tambah Pengingat
                  </Button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {scheduleItems
                  .filter((i) => i.type === "reminder" || i.type === "classroom")
                  .map((item) => (
                    <Card key={item.id} className="space-y-3 border border-border bg-surface">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            {item.type === "classroom" && (
                              <GoogleClassroomIcon className="w-3.5 h-3.5 shrink-0" />
                            )}
                            <span className="text-[10px] font-mono uppercase text-brand-400 truncate">
                              {item.subject}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-text-primary truncate">{item.title}</h4>
                        </div>
                        <Badge variant="warning">{item.time}</Badge>
                      </div>

                      {item.classroomUrl && (
                        <a
                          href={item.classroomUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-brand-400 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> Buka di Classroom
                        </a>
                      )}

                      <div className="pt-2 border-t border-border flex items-center justify-between">
                        <span className="text-[11px] text-text-tertiary">
                          {item.dueDate ? `Tenggat: ${item.dueDate}` : item.day}
                        </span>
                        <button
                          onClick={() => handleDeleteScheduleItem(item.id)}
                          className="p-1 text-text-tertiary hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── MODAL 1: TAMBAH JADWAL / PENGINGAT ─── */}
      {showAddScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 space-y-4 shadow-2xl animate-scale-up">
            <h3 className="text-base font-bold text-text-primary">Tambah Agenda & Pengingat</h3>

            <form onSubmit={handleAddScheduleItem} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  Jenis Agenda:
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSchedType("jadwal")}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold border ${
                      schedType === "jadwal"
                        ? "bg-brand-600 text-white border-brand-500"
                        : "bg-surface-secondary border-border text-text-secondary"
                    }`}
                  >
                    Jadwal Kuliah
                  </button>
                  <button
                    type="button"
                    onClick={() => setSchedType("reminder")}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold border ${
                      schedType === "reminder"
                        ? "bg-brand-600 text-white border-brand-500"
                        : "bg-surface-secondary border-border text-text-secondary"
                    }`}
                  >
                    Pengingat / Catatan
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  Judul Agenda / Mata Kuliah:
                </label>
                <Input
                  required
                  placeholder="Contoh: Pemrograman Web & Basis Data"
                  value={schedTitle}
                  onChange={(e) => setSchedTitle(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1">
                    Hari:
                  </label>
                  <Select
                    value={schedDay}
                    onChange={(e) => setSchedDay(e.target.value)}
                    options={DAYS.filter((d) => d !== "Semua").map((d) => ({
                      value: d,
                      label: d,
                    }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1">
                    Jam / Waktu:
                  </label>
                  <Input
                    placeholder="Contoh: 08:00 - 10:30"
                    value={schedTime}
                    onChange={(e) => setSchedTime(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  Ruangan / Lokasi (Opsional):
                </label>
                <Input
                  placeholder="Contoh: Lab Komputer 3 / Gedung B"
                  value={schedLocation}
                  onChange={(e) => setSchedLocation(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddScheduleModal(false)}
                >
                  Batal
                </Button>
                <Button type="submit">Simpan Agenda</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: CONNECT GOOGLE CLASSROOM ─── */}
      {showConnectClassroomModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 space-y-4 shadow-2xl animate-scale-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <GoogleClassroomIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">Hubungkan Google Classroom</h3>
                <p className="text-xs text-text-secondary">Sinkronkan tugas & materi perkuliahan</p>
              </div>
            </div>

            <form onSubmit={handleConfirmConnectClassroom} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  Email Akun Google / Mahasiswa:
                </label>
                <Input
                  type="email"
                  required
                  placeholder="contoh: mahasiswa@student.ac.id"
                  value={connectEmail}
                  onChange={(e) => setConnectEmail(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  OAuth Token / Kunci Akses (Opsional):
                </label>
                <Input
                  type="password"
                  placeholder="Biarkan kosong untuk mode demonstrasi instan"
                  value={connectToken}
                  onChange={(e) => setConnectToken(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowConnectClassroomModal(false)}
                >
                  Tutup
                </Button>
                <Button type="submit">Hubungkan Sekarang</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: DELETE CONFIRMATION ─── */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteTask}
        loading={deleting}
        title="Hapus Tugas Ini?"
        message="Tugas yang dihapus tidak dapat dikembalikan ke sistem."
      />
    </div>
  );
}

export default function TugasPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <span>Memuat Manajemen Tugas & Jadwal...</span>
          </div>
        </div>
      }
    >
      <TugasPageContent />
    </Suspense>
  );
}
