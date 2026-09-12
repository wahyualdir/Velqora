"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Network,
  Plus,
  ArrowRight,
  Sparkles,
  FileText,
  Link2,
  Folder,
  Menu,
  X,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteSidebar } from "@/components/notes/note-sidebar";
import { NoteGraph } from "@/components/notes/note-graph";
import { NewNoteModal } from "@/components/notes/new-note-modal";
import { BulkImportModal } from "@/components/notes/bulk-import-modal";
import { createClient } from "@/lib/supabase/client";
import { isAdminUser } from "@/lib/utils";
import type { NoteTreeResult, NoteGraphData } from "@/actions/study/notes";

interface CatatanVaultLandingProps {
  tree: NoteTreeResult;
  graphData: NoteGraphData;
}

export function CatatanVaultLanding({ tree, graphData }: CatatanVaultLandingProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const localRole =
        typeof window !== "undefined" ? localStorage.getItem("user_role") : null;
      if (localRole === "admin" || localRole === "owner") {
        setCanEdit(true);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email && isAdminUser(data.user.email)) {
        setCanEdit(true);
      }
    }
    checkAuth();
  }, []);

  // Pick top connected notes for quick exploration
  const featuredNotes = [...graphData.nodes]
    .sort((a, b) => b.degree - a.degree)
    .slice(0, 6);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#FAF8F5] dark:bg-[#141416] overflow-hidden">
      {/* ─── 1. Left Sidebar (Vault Tree) ─── */}
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 h-full shrink-0">
        <NoteSidebar
          tree={tree}
          onNewNote={canEdit ? () => setNewModalOpen(true) : undefined}
          className="h-full"
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden bg-black/50 backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="w-80 max-w-[85vw] h-full bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-border flex items-center justify-between">
              <span className="font-mono font-bold text-xs uppercase text-text-primary">
                Navigasi Vault
              </span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-1 text-text-tertiary hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <NoteSidebar
              tree={tree}
              onNewNote={
                canEdit
                  ? () => {
                      setSidebarOpen(false);
                      setNewModalOpen(true);
                    }
                  : undefined
              }
              className="h-[calc(100%-49px)]"
            />
          </div>
        </div>
      )}

      {/* ─── 2. Center Content Area ─── */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Mobile Header Bar */}
        <div className="lg:hidden p-3 bg-surface border-b border-border flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 text-xs font-mono text-text-primary px-2.5 py-1.5 rounded-md border border-border hover:bg-surface-secondary"
          >
            <Menu className="w-3.5 h-3.5 text-brand-600" />
            <span>Jelajah Vault</span>
          </button>

          <Link href="/dashboard/catatan/graph">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs font-mono">
              <Network className="w-3.5 h-3.5" />
              <span>Grafik Global</span>
            </Button>
          </Link>
        </div>

        <div className="p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-8">
          {/* Welcome Banner */}
          <div className="p-6 sm:p-8 bg-surface dark:bg-[#18181B] border border-border shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 uppercase">
                    Velqora Knowledge Vault
                  </span>
                  <span className="text-[10px] font-mono text-text-tertiary">
                    Obsidian Architecture
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-text-primary tracking-tight">
                  Vault Catatan Kurikulum AI
                </h1>
                <p className="text-xs sm:text-sm text-text-secondary max-w-2xl leading-relaxed">
                  Basis pengetahuan kurikulum pembelajaran akademik dengan integrasi dokumen markdown,
                  tautan dua arah (<code className="text-brand-600 font-mono text-xs">[[Wiki-Link]]</code>),
                  pelacakan backlinks, dan visualisasi peta konsep interaktif.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {canEdit && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setImportModalOpen(true)}
                      className="gap-1.5 text-xs font-mono font-bold cursor-pointer hover:border-brand-500/50 hover:bg-brand-500/5"
                    >
                      <Upload className="w-4 h-4 text-brand-600" />
                      <span>Import Modul</span>
                    </Button>
                    <Button
                      onClick={() => setNewModalOpen(true)}
                      className="gap-1.5 text-xs font-mono font-bold bg-brand-600 hover:bg-brand-700 text-white cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Catatan Baru</span>
                    </Button>
                  </>
                )}
                <Link href="/dashboard/catatan/graph">
                  <Button variant="outline" className="gap-1.5 text-xs font-mono cursor-pointer">
                    <Network className="w-4 h-4" />
                    <span className="hidden sm:inline">Peta Graph</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border/60">
              <div className="p-3 bg-surface-secondary/40 border border-border/80">
                <div className="text-[11px] font-mono text-text-tertiary flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-brand-500" />
                  <span>Total Catatan</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-text-primary mt-1">
                  {tree.totalNotes}
                </div>
              </div>

              <div className="p-3 bg-surface-secondary/40 border border-border/80">
                <div className="text-[11px] font-mono text-text-tertiary flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-brand-500 rotate-45" />
                  <span>Koneksi Tautan</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-text-primary mt-1">
                  {graphData.edges.length}
                </div>
              </div>

              <div className="p-3 bg-surface-secondary/40 border border-border/80">
                <div className="text-[11px] font-mono text-text-tertiary flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-brand-500" />
                  <span>Kategori Rumpun</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-text-primary mt-1">
                  {tree.categories.length}
                </div>
              </div>

              <div className="p-3 bg-surface-secondary/40 border border-border/80">
                <div className="text-[11px] font-mono text-text-tertiary flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                  <span>Status Vault</span>
                </div>
                <div className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-2">
                  Tersinkronisasi ✓
                </div>
              </div>
            </div>
          </div>

          {/* Mini Global Graph Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <h2 className="font-mono font-bold text-xs uppercase tracking-wider text-text-primary">
                  Pratinjau Peta Hubungan Materi
                </h2>
              </div>
              <Link
                href="/dashboard/catatan/graph"
                className="text-xs font-mono text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                <span>Buka Layar Penuh</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <NoteGraph data={graphData} height={280} className="rounded-none shadow-xs" />
          </div>

          {/* Featured & Connected Notes Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <h2 className="font-mono font-bold text-xs uppercase tracking-wider text-text-primary">
                  Topik Materi Paling Sering Dirujuk
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {featuredNotes.map((note) => (
                <Link
                  key={note.id}
                  href={`/dashboard/catatan/${note.slug}`}
                  className="p-4 bg-surface dark:bg-[#18181B] border border-border hover:border-brand-500/60 transition-all group flex flex-col justify-between space-y-3 shadow-2xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-text-tertiary">
                      <span className="uppercase">{note.categoryName || "Kurikulum"}</span>
                      <span>{note.degree} tautan</span>
                    </div>
                    <h3 className="font-bold text-sm text-text-primary group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
                      {note.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-mono text-brand-600 dark:text-brand-400 opacity-80 group-hover:opacity-100">
                    <span>Pelajari Dokumen</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* New Note Modal */}
      <NewNoteModal
        isOpen={newModalOpen}
        onClose={() => setNewModalOpen(false)}
        categories={tree.categories}
      />

      {/* Bulk Import Modal */}
      <BulkImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
      />
    </div>
  );
}
