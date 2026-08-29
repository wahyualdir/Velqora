"use client";

import React, { useState, useEffect, use, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, RefreshCw, GraduationCap } from "lucide-react";
import { PageContainer } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { createClient } from "@/lib/supabase/client";
import { isAdminUser } from "@/lib/utils";
import {
  ClassItem,
  getLocalClasses,
  deleteLocalClass,
  AnnouncementItem,
} from "@/lib/class-service";
import { getModules } from "@/actions/study-actions";
import { ClassDetailHeader } from "@/components/classes/class-detail-header";
import { ClassTabs, ClassTabKey } from "@/components/classes/class-tabs";
import { ClassOverviewTab } from "@/components/classes/class-overview-tab";
import { ClassMaterialsTab, ClassMaterial } from "@/components/classes/class-materials-tab";
import { ClassModulesTab } from "@/components/classes/class-modules-tab";
import { ClassTasksTab, ClassTask } from "@/components/classes/class-tasks-tab";
import { ClassMembersTab } from "@/components/classes/class-members-tab";
import { toast } from "sonner";

function DetailRuangKelasContent({ classId }: { classId: string }) {
  const router = useRouter();

  const [classData, setClassData] = useState<ClassItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Active Workspace Tab
  const [activeTab, setActiveTab] = useState<ClassTabKey>("stream");

  // Tab Data States
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [materials, setMaterials] = useState<ClassMaterial[]>([]);
  const [tasks, setTasks] = useState<ClassTask[]>([]);
  const [modules, setModules] = useState<any[]>([]);

  // Load Data
  const loadClassDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      const email = data?.user?.email || "";
      const nameFromEmail = email ? email.split("@")[0] : "Pengguna";

      setUserEmail(email);
      setUserName(nameFromEmail);

      const isUserAdmin =
        (typeof window !== "undefined" &&
          localStorage.getItem("user_role") === "admin") ||
        (!!email && isAdminUser(email));
      setIsAdmin(isUserAdmin);

      const all = getLocalClasses();
      const found = all.find((c) => c.id === classId);

      if (found) {
        setClassData(found);
      } else {
        // Fallback default class data if opened via direct link
        setClassData({
          id: classId,
          name: "Ruang Kelas Perkuliahan",
          subject: "Mata Kuliah Terdaftar",
          description: "Ruang kolaborasi akademik untuk materi, diskusi, dan tugas kelas.",
          code: classId.slice(0, 6).toUpperCase(),
          teacherName: "Pengajar",
          teacherEmail: "teacher@velqora.com",
          createdAt: new Date().toISOString(),
          membersCount: 24,
          bannerColor: "from-blue-600 via-cyan-600 to-teal-500",
        });
      }

      // Load persisted announcements
      if (typeof window !== "undefined") {
        const savedAnn = localStorage.getItem(`velqora_class_announcements_${classId}`);
        if (savedAnn) {
          try {
            setAnnouncements(JSON.parse(savedAnn));
          } catch {
            setAnnouncements([]);
          }
        }

        const savedMat = localStorage.getItem(`velqora_class_materials_${classId}`);
        if (savedMat) {
          try {
            setMaterials(JSON.parse(savedMat));
          } catch {
            setMaterials([]);
          }
        }

        const savedTasks = localStorage.getItem(`velqora_class_tasks_${classId}`);
        if (savedTasks) {
          try {
            setTasks(JSON.parse(savedTasks));
          } catch {
            setTasks([]);
          }
        }
      }

      // Load related modules from database
      try {
        const dbModules = await getModules();
        setModules(dbModules || []);
      } catch (e) {
        console.warn("Could not fetch related modules:", e);
      }
    } catch (err) {
      console.error("Gagal memuat detail kelas:", err);
      setError("Data kelas belum dapat dimuat. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    loadClassDetail();
  }, [loadClassDetail]);

  // Persist Announcement
  const handlePostAnnouncement = (content: string) => {
    const newAnn: AnnouncementItem = {
      id: "ann-" + Date.now(),
      classId,
      authorName: userName || "Pengguna",
      authorEmail: userEmail || "user@velqora.com",
      content,
      createdAt: new Date().toISOString(),
    };

    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `velqora_class_announcements_${classId}`,
        JSON.stringify(updated)
      );
    }
  };

  const handleDeleteAnnouncement = (id: string) => {
    const updated = announcements.filter((a) => a.id !== id);
    setAnnouncements(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `velqora_class_announcements_${classId}`,
        JSON.stringify(updated)
      );
    }
  };

  // Persist Material
  const handleAddMaterial = (mat: ClassMaterial) => {
    const updated = [mat, ...materials];
    setMaterials(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `velqora_class_materials_${classId}`,
        JSON.stringify(updated)
      );
    }
  };

  const handleDeleteMaterial = (id: string) => {
    const updated = materials.filter((m) => m.id !== id);
    setMaterials(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `velqora_class_materials_${classId}`,
        JSON.stringify(updated)
      );
    }
  };

  // Persist Task
  const handleAddTask = (task: ClassTask) => {
    const updated = [task, ...tasks];
    setTasks(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `velqora_class_tasks_${classId}`,
        JSON.stringify(updated)
      );
    }
  };

  const handleToggleTask = (id: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    );
    setTasks(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `velqora_class_tasks_${classId}`,
        JSON.stringify(updated)
      );
    }
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `velqora_class_tasks_${classId}`,
        JSON.stringify(updated)
      );
    }
  };

  // Delete Class
  const handleDeleteClass = () => {
    deleteLocalClass(classId);
    toast.success("Ruang kelas berhasil dihapus.");
    router.push("/dashboard/kelas");
  };

  const canManage = Boolean(
    classData && (classData.teacherEmail === userEmail || isAdmin)
  );

  return (
    <PageContainer className="space-y-6 pb-14">
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
            onClick={loadClassDetail}
            className="text-xs gap-1.5 shrink-0 border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/15"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </Button>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-6 w-36 rounded" />
          <Skeleton className="h-10 w-3/4 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
          <div className="h-12 w-full bg-surface rounded-xl border border-border mt-4" />
          <div className="h-48 w-full bg-surface rounded-xl border border-border" />
        </div>
      ) : !classData ? (
        <EmptyState
          icon={<GraduationCap className="w-8 h-8" />}
          title="Kelas tidak ditemukan"
          description="Ruang kelas yang Anda tuju tidak ditemukan atau telah dihapus."
          action={
            <Link href="/dashboard/kelas">
              <Button size="sm" className="gap-1.5 text-xs font-semibold">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Daftar Kelas</span>
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          {/* ─── 1. Class Header ─── */}
          <ClassDetailHeader
            classData={classData}
            userEmail={userEmail}
            isAdmin={isAdmin}
            onDeleteClass={handleDeleteClass}
          />

          {/* ─── 2. Workspace Navigation Tabs ─── */}
          <ClassTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={{
              announcements: announcements.length,
              materials: materials.length,
              modules: modules.length,
              tasks: tasks.length,
              members: classData.membersCount || 1,
            }}
          />

          {/* ─── 3. Active Tab Content Area ─── */}
          <div className="pt-2">
            {activeTab === "stream" && (
              <ClassOverviewTab
                classId={classId}
                announcements={announcements}
                userName={userName}
                userEmail={userEmail}
                isAdmin={isAdmin}
                onPostAnnouncement={handlePostAnnouncement}
                onDeleteAnnouncement={handleDeleteAnnouncement}
              />
            )}

            {activeTab === "materi" && (
              <ClassMaterialsTab
                materials={materials}
                canManage={canManage}
                onAddMaterial={handleAddMaterial}
                onDeleteMaterial={handleDeleteMaterial}
              />
            )}

            {activeTab === "modul" && (
              <ClassModulesTab
                modules={modules}
                subject={classData.subject}
              />
            )}

            {activeTab === "tugas" && (
              <ClassTasksTab
                tasks={tasks}
                canManage={canManage}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
              />
            )}

            {activeTab === "members" && (
              <ClassMembersTab
                teacherName={classData.teacherName}
                teacherEmail={classData.teacherEmail}
                membersCount={classData.membersCount || 1}
              />
            )}
          </div>
        </>
      )}
    </PageContainer>
  );
}

export default function DetailRuangKelasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const classId = resolvedParams.id;

  return (
    <Suspense
      fallback={
        <PageContainer className="space-y-6 pb-14">
          <div className="h-6 w-36 bg-surface-secondary rounded-lg animate-pulse" />
          <div className="h-10 w-3/4 bg-surface-secondary rounded-xl animate-pulse" />
          <div className="h-12 w-full bg-surface rounded-xl border border-border animate-pulse" />
          <div className="h-48 w-full bg-surface rounded-xl border border-border animate-pulse" />
        </PageContainer>
      }
    >
      <DetailRuangKelasContent classId={classId} />
    </Suspense>
  );
}
