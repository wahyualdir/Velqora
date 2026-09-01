"use client";

import React, { useEffect, useState, useMemo, useCallback, Suspense } from "react";
import Link from "next/link";
import { Plus, ClipboardList, AlertCircle, RefreshCw } from "lucide-react";
import { PageContainer } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { getTasks, updateTask, deleteTask } from "@/actions/study-actions";
import { daysUntilDeadline } from "@/lib/utils";
import { getClassroomState, ClassroomSyncState } from "@/lib/classroom-sync";
import { TaskHeader } from "@/components/tasks/task-header";
import { TaskOverview } from "@/components/tasks/task-overview";
import { TaskToolbar } from "@/components/tasks/task-toolbar";
import { DesktopTaskWorkspace } from "@/surfaces/web/tasks/desktop-task-workspace";
import { MobileTaskList } from "@/surfaces/app/tasks/mobile-task-list";
import { SurfaceAdaptive } from "@/components/layout/surface-adaptive";
import { EditTaskModal } from "@/components/tasks/edit-task-modal";
import { ClassroomSyncModal } from "@/components/tasks/classroom-sync-modal";
import { toast } from "sonner";

function TugasContent() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState("deadline_asc");

  // Modals
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [showClassroomModal, setShowClassroomModal] = useState(false);
  const [classroomState, setClassroomState] = useState<ClassroomSyncState>({
    isConnected: false,
    userEmail: "",
    lastSyncedAt: null,
    courses: [],
    assignments: [],
    autoSync: true,
  });

  // Load Classroom state on mount
  useEffect(() => {
    try {
      const state = getClassroomState();
      setClassroomState(state);
    } catch (e) {
      console.warn("Could not load classroom state:", e);
    }
  }, []);

  // Fetch Tasks from Database
  const loadTasksData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await getTasks();
      setTasks(list || []);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setError("Tugas belum dapat dimuat. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasksData();
  }, [loadTasksData]);

  // Handle Quick Status Update
  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    try {
      const target = tasks.find((t) => t.id === taskId);
      if (!target) return;

      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );

      await updateTask(taskId, {
        title: target.title,
        subject: target.subject || undefined,
        lecturer: target.lecturer || undefined,
        description: target.description || undefined,
        deadline: target.deadline || undefined,
        priority: target.priority as any,
        status: newStatus as any,
        external_url: target.external_url || undefined,
        notes: target.notes || undefined,
      });

      toast.success(
        newStatus === "selesai"
          ? "Tugas diselesaikan!"
          : newStatus === "sedang_dikerjakan"
          ? "Tugas sedang dikerjakan."
          : "Status tugas diperbarui."
      );
    } catch (err: any) {
      toast.error("Gagal mengubah status: " + (err.message || "Terjadi kesalahan."));
      loadTasksData(); // revert
    }
  };

  // Handle Delete
  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Tugas berhasil dihapus.");
    } catch (err: any) {
      toast.error("Gagal menghapus tugas: " + (err.message || "Terjadi kesalahan."));
    }
  };

  // Calculate Real Metric Counts
  const metrics = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((t) => t.status === "belum_dikerjakan").length;
    const inProgress = tasks.filter((t) => t.status === "sedang_dikerjakan").length;
    const completed = tasks.filter((t) => t.status === "selesai").length;
    const overdue = tasks.filter((t) => {
      if (t.status === "selesai" || !t.deadline) return false;
      const days = daysUntilDeadline(t.deadline);
      return days !== null && days < 0;
    }).length;

    return { total, pending, inProgress, completed, overdue };
  }, [tasks]);

  // Filter & Sort Logic
  const filteredTasks = useMemo(() => {
    let list = [...tasks];

    // 1. Search Query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.subject?.toLowerCase().includes(q) ||
          t.lecturer?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    // 2. Status Filter
    if (statusFilter === "terlambat") {
      list = list.filter((t) => {
        if (t.status === "selesai" || !t.deadline) return false;
        const days = daysUntilDeadline(t.deadline);
        return days !== null && days < 0;
      });
    } else if (statusFilter) {
      list = list.filter((t) => t.status === statusFilter);
    }

    // 3. Priority Filter
    if (priorityFilter) {
      list = list.filter((t) => t.priority === priorityFilter);
    }

    // 4. Sorting
    list.sort((a, b) => {
      if (sortBy === "deadline_desc") {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      }
      if (sortBy === "priority_desc") {
        const pOrder: { [k: string]: number } = { tinggi: 3, sedang: 2, rendah: 1 };
        return (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
      }
      if (sortBy === "title_asc") {
        return (a.title || "").localeCompare(b.title || "");
      }
      // default: deadline_asc
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });

    return list;
  }, [tasks, search, statusFilter, priorityFilter, sortBy]);

  const hasActiveFilters = Boolean(
    search || statusFilter || priorityFilter || sortBy !== "deadline_asc"
  );

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
    setSortBy("deadline_asc");
  };

  return (
    <PageContainer className="space-y-6 pb-14">
      {/* ─── 1. Header & Actions ─── */}
      <TaskHeader
        onOpenClassroom={() => setShowClassroomModal(true)}
        isClassroomConnected={classroomState.isConnected}
      />

      {/* ─── Error Alert ─── */}
      {error && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-center justify-between gap-3 text-xs sm:text-sm text-rose-600 dark:text-rose-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={loadTasksData}
            className="text-xs gap-1.5 shrink-0 border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/15"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </Button>
        </div>
      )}

      {/* ─── 2. Compact Overview Metrics ─── */}
      <TaskOverview
        total={metrics.total}
        pending={metrics.pending}
        inProgress={metrics.inProgress}
        completed={metrics.completed}
        overdue={metrics.overdue}
        activeStatusFilter={statusFilter}
        onSelectStatus={(st) =>
          setStatusFilter((prev) => (prev === st ? "" : st))
        }
      />

      {/* ─── 3. Search & Filter Toolbar ─── */}
      <TaskToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* ─── 4. Tasks List Area ─── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1 text-xs text-text-tertiary font-mono">
          <span>
            Menampilkan {filteredTasks.length} dari {tasks.length} tugas
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-xl border border-border bg-surface space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-4 w-20 rounded" />
                </div>
                <Skeleton className="h-6 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/3 rounded" />
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          /* Empty Workspace */
          <EmptyState
            icon={<ClipboardList className="w-8 h-8" />}
            title="Belum ada tugas"
            description="Tambahkan tugas perkuliahan atau proyek pertama Anda untuk mulai memantau batas waktu pengerjaan."
            action={
              <Link href="/dashboard/tugas/baru">
                <Button size="sm" className="gap-1.5 text-xs font-semibold">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Tugas Baru</span>
                </Button>
              </Link>
            }
          />
        ) : filteredTasks.length === 0 ? (
          /* Empty Search / Filter */
          <EmptyState
            icon={<ClipboardList className="w-8 h-8" />}
            title="Tugas tidak ditemukan"
            description="Coba gunakan kata kunci atau filter status yang berbeda."
            action={
              <Button
                size="sm"
                variant="outline"
                onClick={handleResetFilters}
                className="text-xs"
              >
                Reset filter
              </Button>
            }
          />
        ) : (
          <SurfaceAdaptive
            web={
              <DesktopTaskWorkspace
                tasks={filteredTasks}
                onUpdateStatus={handleUpdateStatus}
                onEdit={(item) => setEditingTask(item)}
                onDelete={handleDeleteTask}
              />
            }
            app={
              <MobileTaskList
                tasks={filteredTasks}
                onUpdateStatus={handleUpdateStatus}
                onEdit={(item) => setEditingTask(item)}
                onDelete={handleDeleteTask}
              />
            }
          />
        )}
      </section>

      {/* ─── Edit Task Modal ─── */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          isOpen={Boolean(editingTask)}
          onClose={() => setEditingTask(null)}
          onSaved={loadTasksData}
        />
      )}

      {/* ─── Google Classroom Sync Modal ─── */}
      {showClassroomModal && (
        <ClassroomSyncModal
          isOpen={showClassroomModal}
          onClose={() => setShowClassroomModal(false)}
          classroomState={classroomState}
          onConnected={(newState) => setClassroomState(newState)}
        />
      )}
    </PageContainer>
  );
}

export default function TugasPage() {
  return (
    <Suspense
      fallback={
        <PageContainer className="space-y-6 pb-14">
          <div className="h-8 w-48 bg-surface-secondary rounded-lg animate-pulse" />
          <div className="h-16 w-full bg-surface-secondary rounded-xl animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 w-full bg-surface rounded-xl border border-border animate-pulse"
              />
            ))}
          </div>
        </PageContainer>
      }
    >
      <TugasContent />
    </Suspense>
  );
}
