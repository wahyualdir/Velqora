"use client";

import React, { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { GraduationCap, AlertCircle, RefreshCw, Plus, KeyRound } from "lucide-react";
import { PageContainer } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { createClient } from "@/lib/supabase/client";
import { isAdminUser } from "@/lib/utils";
import {
  ClassItem,
  getLocalClasses,
  saveLocalClass,
  deleteLocalClass,
  getJoinedClassCodes,
} from "@/lib/class-service";
import { ClassHeader } from "@/components/classes/class-header";
import { ClassToolbar } from "@/components/classes/class-toolbar";
import { ClassListItem } from "@/components/classes/class-list-item";
import { CreateClassModal } from "@/components/classes/create-class-modal";
import { JoinClassModal } from "@/components/classes/join-class-modal";
import { toast } from "sonner";

function KelasContent() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [joinedCodes, setJoinedCodes] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [scopeFilter, setScopeFilter] = useState("all"); // 'all' | 'mine' | 'joined'

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Load Data
  const loadClassesData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      const email = data?.user?.email || "user@velqora.com";
      const nameFromEmail = email.split("@")[0];

      setUserEmail(email);
      setUserName(nameFromEmail);

      const isUserAdmin =
        (typeof window !== "undefined" &&
          localStorage.getItem("user_role") === "admin") ||
        (!!email && isAdminUser(email));
      setIsAdmin(isUserAdmin);

      const local = getLocalClasses();
      const joined = getJoinedClassCodes();

      setClasses(local);
      setJoinedCodes(joined);
    } catch (err) {
      console.error("Gagal memuat ruang kelas:", err);
      setError("Ruang kelas belum dapat dimuat. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClassesData();
  }, [loadClassesData]);

  // Handle Class Creation
  const handleClassCreated = (newClass: ClassItem) => {
    saveLocalClass(newClass);
    setClasses((prev) => [newClass, ...prev]);
  };

  // Handle Class Join
  const handleClassJoined = (code: string) => {
    setJoinedCodes((prev) => [...prev, code]);
  };

  // Handle Class Deletion
  const handleDeleteClass = (
    classId: string,
    className: string,
    teacherEmail: string
  ) => {
    const isOwner = teacherEmail === userEmail;
    deleteLocalClass(classId);
    setClasses((prev) => prev.filter((c) => c.id !== classId));

    if (isAdmin && !isOwner) {
      toast.success(
        `[Admin] Kelas "${className}" milik pengguna lain berhasil dihapus.`
      );
    } else {
      toast.success(`Kelas "${className}" berhasil dihapus.`);
    }
  };

  // Filtered Class List
  const filteredClasses = useMemo(() => {
    let list = [...classes];

    // 1. Search Query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.subject?.toLowerCase().includes(q) ||
          c.teacherName?.toLowerCase().includes(q) ||
          c.code?.toLowerCase().includes(q)
      );
    }

    // 2. Scope Filter
    if (scopeFilter === "mine") {
      list = list.filter((c) => c.teacherEmail === userEmail);
    } else if (scopeFilter === "joined") {
      list = list.filter(
        (c) =>
          c.teacherEmail !== userEmail &&
          joinedCodes.some(
            (code) => code.toLowerCase() === c.code.toLowerCase()
          )
      );
    }

    return list;
  }, [classes, search, scopeFilter, userEmail, joinedCodes]);

  const hasActiveFilters = Boolean(search || scopeFilter !== "all");

  const handleResetFilters = () => {
    setSearch("");
    setScopeFilter("all");
  };

  return (
    <PageContainer className="space-y-6 pb-14">
      {/* ─── 1. Header & Actions ─── */}
      <ClassHeader
        onCreateClass={() => setShowCreateModal(true)}
        onJoinClass={() => setShowJoinModal(true)}
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
            onClick={loadClassesData}
            className="text-xs gap-1.5 shrink-0 border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/15"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </Button>
        </div>
      )}

      {/* ─── 2. Search & Scope Toolbar ─── */}
      <ClassToolbar
        search={search}
        onSearchChange={setSearch}
        scopeFilter={scopeFilter}
        onScopeChange={setScopeFilter}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* ─── 3. Class Collection List ─── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1 text-xs text-text-tertiary font-mono">
          <span>
            Menampilkan {filteredClasses.length} dari {classes.length} ruang kelas
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
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
                <Skeleton className="h-6 w-1/2 rounded" />
                <Skeleton className="h-4 w-1/3 rounded" />
              </div>
            ))}
          </div>
        ) : classes.length === 0 ? (
          /* Empty Workspace */
          <EmptyState
            icon={<GraduationCap className="w-8 h-8" />}
            title="Belum ada kelas"
            description="Belum ada ruang kelas yang tersedia. Buat ruang kelas baru atau gabung menggunakan kode kelas dari dosen Anda."
            action={
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowJoinModal(true)}
                  className="gap-1.5 text-xs"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Gabung Kelas</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowCreateModal(true)}
                  className="gap-1.5 text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Buat Kelas Baru</span>
                </Button>
              </div>
            }
          />
        ) : filteredClasses.length === 0 ? (
          /* Empty Search / Filter */
          <EmptyState
            icon={<GraduationCap className="w-8 h-8" />}
            title="Kelas tidak ditemukan"
            description="Tidak ada ruang kelas yang sesuai dengan kata kunci atau filter pencarian Anda."
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
          /* List-First Class Rows */
          <div className="space-y-3">
            {filteredClasses.map((item) => (
              <ClassListItem
                key={item.id}
                item={item}
                userEmail={userEmail}
                isAdmin={isAdmin}
                onDelete={handleDeleteClass}
              />
            ))}
          </div>
        )}
      </section>

      {/* ─── Create Class Modal ─── */}
      <CreateClassModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        userEmail={userEmail}
        userName={userName}
        onCreated={handleClassCreated}
      />

      {/* ─── Join Class Modal ─── */}
      <JoinClassModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        classes={classes}
        joinedCodes={joinedCodes}
        userEmail={userEmail}
        onJoined={handleClassJoined}
      />
    </PageContainer>
  );
}

export default function RuangKelasPage() {
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
      <KelasContent />
    </Suspense>
  );
}
