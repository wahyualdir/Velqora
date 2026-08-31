"use client";

import React, { useEffect, useState, useMemo, useCallback, Suspense } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  AlertCircle,
  RefreshCw,
  UploadCloud,
  CalendarCheck,
  CalendarDays,
} from "lucide-react";
import { PageContainer } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ScheduleHeader } from "@/components/schedule/schedule-header";
import { ScheduleNavigation } from "@/components/schedule/schedule-navigation";
import { ScheduleListItem } from "@/components/schedule/schedule-list-item";
import { MobileScheduleAgenda } from "@/components/schedule/mobile-schedule-agenda";
import { SurfaceAdaptive } from "@/components/layout/surface-adaptive";
import { ScheduleFormModal } from "@/components/schedule/schedule-form-modal";
import { ScheduleImportModal } from "@/components/schedule/schedule-import-modal";
import { ScheduleGeneratorModal } from "@/components/schedule/schedule-generator-modal";
import { DailyPlanModal } from "@/components/schedule/daily-plan-modal";
import { WeeklyPlanModal } from "@/components/schedule/weekly-plan-modal";
import { SchedulePreferencesModal } from "@/components/schedule/schedule-preferences-modal";
import { WeeklyOptimizationModal } from "@/components/schedule/weekly-optimization-modal";
import { ScheduleControlCenter } from "@/components/schedule/schedule-control-center";
import { WhatIfModal } from "@/components/schedule/what-if-modal";
import { UserPatternCard } from "@/components/schedule/user-pattern-card";
import { SessionFeedbackModal } from "@/components/schedule/session-feedback-modal";
import { ScheduleIntelligenceSummary } from "@/components/schedule/schedule-intelligence-summary";
import { ScheduleImportHistoryModal } from "@/components/schedule/schedule-import-history-modal";
import { ClassroomSyncModal } from "@/components/tasks/classroom-sync-modal";
import { getActiveUserIdentifier } from "@/lib/bookmark-service";
import {
  getClassroomState,
  ClassroomSyncState,
} from "@/lib/classroom-sync";
import {
  getUserSchedules,
  createScheduleItemAction,
  updateScheduleItemAction,
  deleteScheduleItemAction,
  getScheduleIntelligenceContextAction,
  getWeeklyOptimizationProposalAction,
} from "@/actions/schedule-actions";
import { ScheduleIntelligenceContext, WeeklyOptimizationResult } from "@/lib/schedule-intelligence/types";
import { ScheduleItem, Task } from "@/types";
import { ScheduleImportHistoryItem } from "@/types/schedule";
import { toast } from "sonner";

function getScheduleStorageKey(): string {
  const user = getActiveUserIdentifier();
  return `velqora_jadwal_user_${user}`;
}

function JadwalContent() {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [intelligenceContext, setIntelligenceContext] = useState<ScheduleIntelligenceContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedDay, setSelectedDay] = useState("Semua");
  const [selectedType, setSelectedType] = useState("");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [showDailyPlanModal, setShowDailyPlanModal] = useState(false);
  const [showWeeklyPlanModal, setShowWeeklyPlanModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showOptimizationModal, setShowOptimizationModal] = useState(false);
  const [showWhatIfModal, setShowWhatIfModal] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<WeeklyOptimizationResult | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [importHistory, setImportHistory] = useState<ScheduleImportHistoryItem[]>([]);
  const [showClassroomModal, setShowClassroomModal] = useState(false);
  const [feedbackSession, setFeedbackSession] = useState<ScheduleItem | null>(null);
  const [classroomState, setClassroomState] = useState<ClassroomSyncState>({
    isConnected: false,
    userEmail: "",
    lastSyncedAt: null,
    courses: [],
    assignments: [],
    autoSync: true,
  });

  const handleOpenOptimization = async () => {
    try {
      const res = await getWeeklyOptimizationProposalAction();
      if (res.success && res.result) {
        setOptimizationResult(res.result);
        setShowOptimizationModal(true);
      } else {
        toast.error(res.error || "Gagal memuat usulan optimasi mingguan.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat memuat optimasi.");
    }
  };

  // Load Schedule data & Intelligence Context from Database
  const loadScheduleData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Initial read from local cache for instantaneous rendering
      const key = getScheduleStorageKey();
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const cached = JSON.parse(raw);
          if (Array.isArray(cached) && cached.length > 0) {
            setScheduleItems(cached);
          }
        } catch {
          // ignore cache parse error
        }
      }

      // 2. Fetch official server-side schedules from Database with RLS
      const serverData = await getUserSchedules();

      if (serverData && serverData.length > 0) {
        setScheduleItems(serverData);
        localStorage.setItem(key, JSON.stringify(serverData));
      } else if (raw) {
        // keep local cache if server returned empty in offline scenario
        const cached = JSON.parse(raw);
        setScheduleItems(cached);
      } else {
        setScheduleItems([]);
      }

      // 3. Fetch Intelligence Context (Workload, Deadlines, Free slots)
      try {
        const intelRes = await getScheduleIntelligenceContextAction();
        if (intelRes.success && intelRes.context) {
          setIntelligenceContext(intelRes.context);
          setTasks(intelRes.context.tasks || []);
        }
      } catch (intelErr) {
        console.warn("Could not fetch intelligence context:", intelErr);
      }

      // 4. Load Import History
      try {
        const histRaw = localStorage.getItem("velqora_schedule_import_history");
        if (histRaw) {
          const parsedHist = JSON.parse(histRaw);
          if (Array.isArray(parsedHist)) {
            setImportHistory(parsedHist);
          }
        }
      } catch {
        // ignore history parse error
      }

      const clState = getClassroomState();
      setClassroomState(clState);
    } catch (err) {
      console.error("Failed to load schedule:", err);
      setError("Jadwal belum dapat disinkronisasi dari server. Menampilkan data lokal.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadScheduleData();
  }, [loadScheduleData]);

  // Persist schedule changes locally and in memory
  const persistSchedule = (items: ScheduleItem[]) => {
    setScheduleItems(items);
    try {
      const key = getScheduleStorageKey();
      localStorage.setItem(key, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save schedule to localStorage", e);
    }
  };

  // Add / Edit Item
  const handleSaveItem = async (item: ScheduleItem) => {
    if (editingItem) {
      const updated = scheduleItems.map((s) => (s.id === item.id ? item : s));
      persistSchedule(updated);
      updateScheduleItemAction(item.id, item).catch((e) =>
        console.error("Server update failed:", e)
      );
    } else {
      persistSchedule([item, ...scheduleItems]);
      createScheduleItemAction(item).catch((e) =>
        console.error("Server create failed:", e)
      );
    }
    setEditingItem(null);
    setShowAddModal(false);
    loadScheduleData();
  };

  // Callback on successful import or auto plan
  const handleImportSuccess = (imported: ScheduleItem[]) => {
    const combined = [...imported, ...scheduleItems];
    persistSchedule(combined);
    loadScheduleData();
  };

  // Clear import history
  const handleClearHistory = () => {
    try {
      localStorage.removeItem("velqora_schedule_import_history");
      setImportHistory([]);
      toast.success("Riwayat import berhasil dibersihkan.");
    } catch {
      // ignore
    }
  };

  // Delete Item
  const handleDeleteItem = async (id: string) => {
    const updated = scheduleItems.filter((s) => s.id !== id);
    persistSchedule(updated);
    toast.success("Jadwal berhasil dihapus.");
    deleteScheduleItemAction(id).catch((e) =>
      console.error("Server delete failed:", e)
    );
    loadScheduleData();
  };

  // Toggle Item Completion
  const handleToggleComplete = (id: string) => {
    const target = scheduleItems.find((s) => s.id === id);
    if (target) {
      const newStatus = !target.isCompleted;
      const updated = scheduleItems.map((s) =>
        s.id === id ? { ...s, isCompleted: newStatus, is_completed: newStatus } : s
      );
      persistSchedule(updated);
      updateScheduleItemAction(id, { ...target, isCompleted: newStatus }).catch((e) =>
        console.error("Server update toggle failed:", e)
      );
    }
  };

  // Filtered List
  const filteredItems = useMemo(() => {
    let list = [...scheduleItems];

    if (selectedDay !== "Semua") {
      list = list.filter((s) => s.day === selectedDay);
    }

    if (selectedType) {
      list = list.filter((s) => s.type === selectedType);
    }

    return list;
  }, [scheduleItems, selectedDay, selectedType]);

  return (
    <PageContainer className="space-y-6 pb-14">
      {/* ─── 1. Header & Actions ─── */}
      <ScheduleHeader
        onOpenAddModal={() => {
          setEditingItem(null);
          setShowAddModal(true);
        }}
        onOpenImportModal={() => setShowImportModal(true)}
        onOpenGeneratorModal={() => setShowGeneratorModal(true)}
        onOpenDailyPlan={() => setShowDailyPlanModal(true)}
        onOpenWeeklyPlan={() => setShowWeeklyPlanModal(true)}
        onOpenHistoryModal={() => setShowHistoryModal(true)}
        onOpenClassroom={() => setShowClassroomModal(true)}
        isClassroomConnected={classroomState.isConnected}
      />

      {/* ─── 2. Schedule Control Center (FASE 33) ─── */}
      <ScheduleControlCenter
        schedules={scheduleItems}
        tasks={tasks}
        onOpenPreferences={() => setShowPreferencesModal(true)}
        onOpenOptimization={handleOpenOptimization}
        onOpenWhatIf={() => setShowWhatIfModal(true)}
      />

      {/* ─── 3. Pola Jadwal Saya & Pembelajaran Nyata (FASE 34) ─── */}
      <UserPatternCard
        onOpenPreferences={() => setShowPreferencesModal(true)}
      />

      {/* ─── 4. Intelligence Summary & Workload Overview (FASE 30-32) ─── */}
      <ScheduleIntelligenceSummary
        context={intelligenceContext}
        selectedDay={selectedDay}
        onOpenDailyPlan={() => setShowDailyPlanModal(true)}
        onOpenWeeklyPlan={() => setShowWeeklyPlanModal(true)}
        onOpenPreferences={() => setShowPreferencesModal(true)}
        onOpenOptimization={handleOpenOptimization}
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
            onClick={loadScheduleData}
            className="text-xs gap-1.5 shrink-0 border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/15"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sinkronisasi Ulang</span>
          </Button>
        </div>
      )}

      {/* ─── 3. Day & Type Navigation ─── */}
      <ScheduleNavigation
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        selectedType={selectedType}
        onSelectType={setSelectedType}
      />

      {/* ─── 4. Schedule Content List ─── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1 text-xs text-text-tertiary font-mono">
          <span>
            Menampilkan {filteredItems.length} dari {scheduleItems.length} agenda perkuliahan
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-xl border border-border bg-surface space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-4 w-20 rounded" />
                </div>
                <Skeleton className="h-6 w-1/2 rounded" />
                <Skeleton className="h-4 w-1/3 rounded" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon={<CalendarIcon className="w-8 h-8" />}
            title="Belum ada agenda"
            description={
              selectedDay === "Semua"
                ? "Belum ada kegiatan yang dijadwalkan. Import berkas jadwal perkuliahan atau susun rencana belajar harian."
                : `Tidak ada jadwal kegiatan untuk hari ${selectedDay}.`
            }
            action={
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDailyPlanModal(true)}
                  className="gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 border-brand-500/30 hover:bg-brand-500/10"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Susun Hari Saya</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowWeeklyPlanModal(true)}
                  className="gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10"
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>Susun Minggu Saya</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowImportModal(true)}
                  className="gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/10"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Import Dokumen</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingItem(null);
                    setShowAddModal(true);
                  }}
                  className="gap-1.5 text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Tambah Manual</span>
                </Button>
              </div>
            }
          />
        ) : (
          <SurfaceAdaptive
            web={
              <div className="space-y-3">
                {filteredItems.map((item) => (
                  <ScheduleListItem
                    key={item.id}
                    item={item}
                    onToggleComplete={handleToggleComplete}
                    onEdit={(s) => {
                      setEditingItem(s);
                      setShowAddModal(true);
                    }}
                    onDelete={handleDeleteItem}
                  />
                ))}
              </div>
            }
            app={
              <MobileScheduleAgenda
                items={scheduleItems}
                onAdd={() => {
                  setEditingItem(null);
                  setShowAddModal(true);
                }}
                onEdit={(s) => {
                  setEditingItem(s);
                  setShowAddModal(true);
                }}
                onDelete={handleDeleteItem}
                onFeedback={(s) => setFeedbackSession(s)}
              />
            }
          />
        )}
      </section>

      {/* ─── Manual Add / Edit Schedule Modal ─── */}
      {showAddModal && (
        <ScheduleFormModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
          initialItem={editingItem}
          onSave={handleSaveItem}
        />
      )}

      {/* ─── Intelligent Schedule Import Modal ─── */}
      {showImportModal && (
        <ScheduleImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onSuccess={handleImportSuccess}
        />
      )}

      {/* ─── Daily Plan Modal ("Susun Hari Saya" FASE 30) ─── */}
      {showDailyPlanModal && (
        <DailyPlanModal
          isOpen={showDailyPlanModal}
          onClose={() => setShowDailyPlanModal(false)}
          tasks={tasks}
          onSuccess={handleImportSuccess}
        />
      )}

      {/* ─── Weekly Plan Modal ("Susun Minggu Saya" FASE 30) ─── */}
      {showWeeklyPlanModal && (
        <WeeklyPlanModal
          isOpen={showWeeklyPlanModal}
          onClose={() => setShowWeeklyPlanModal(false)}
          onSuccess={handleImportSuccess}
        />
      )}

      {/* ─── Schedule Preferences Modal (FASE 32) ─── */}
      {showPreferencesModal && (
        <SchedulePreferencesModal
          isOpen={showPreferencesModal}
          onClose={() => setShowPreferencesModal(false)}
          onSaved={() => {
            loadScheduleData();
          }}
        />
      )}

      {/* ─── Weekly Optimization Modal (FASE 32) ─── */}
      {showOptimizationModal && (
        <WeeklyOptimizationModal
          isOpen={showOptimizationModal}
          onClose={() => setShowOptimizationModal(false)}
          optimizationResult={optimizationResult}
          onSuccess={() => {
            loadScheduleData();
          }}
        />
      )}

      {/* ─── What-If Simulation Modal (FASE 33) ─── */}
      {showWhatIfModal && (
        <WhatIfModal
          isOpen={showWhatIfModal}
          onClose={() => setShowWhatIfModal(false)}
          schedules={scheduleItems}
        />
      )}

      {/* ─── Automatic Schedule Generator Modal ─── */}
      {showGeneratorModal && (
        <ScheduleGeneratorModal
          isOpen={showGeneratorModal}
          onClose={() => setShowGeneratorModal(false)}
          onSuccess={handleImportSuccess}
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

      {/* ─── Schedule Import History Modal ─── */}
      {showHistoryModal && (
        <ScheduleImportHistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          historyItems={importHistory}
          onClearHistory={handleClearHistory}
        />
      )}

      {/* ─── Session Feedback Modal (FASE 34) ─── */}
      {feedbackSession && (
        <SessionFeedbackModal
          isOpen={!!feedbackSession}
          onClose={() => setFeedbackSession(null)}
          session={feedbackSession}
          onSuccess={() => {
            loadScheduleData();
            toast.success("Hasil sesi berhasil dicatat!");
          }}
        />
      )}
    </PageContainer>
  );
}

export default function JadwalPage() {
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
      <JadwalContent />
    </Suspense>
  );
}
