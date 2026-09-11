"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  ChevronRight,
  Network,
  Calendar,
  Folder,
  PanelRightClose,
  PanelRightOpen,
  X,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { NoteSidebar } from "@/components/notes/note-sidebar";
import { NoteEditor } from "@/components/notes/note-editor";
import { NoteBacklinksPanel } from "@/components/notes/note-backlinks-panel";
import { NoteGraph } from "@/components/notes/note-graph";
import { NewNoteModal } from "@/components/notes/new-note-modal";
import { updateNote } from "@/actions/study/notes";
import { formatDate } from "@/lib/utils";
import type {
  NoteEntity,
  NoteTreeResult,
  NoteLinkItem,
  NoteBacklinkItem,
  NoteGraphData,
} from "@/actions/study/notes";

interface CatatanSlugClientProps {
  note: NoteEntity;
  tree: NoteTreeResult;
  outgoingLinks: NoteLinkItem[];
  backlinks: NoteBacklinkItem[];
  tags: string[];
  localGraph: NoteGraphData;
}

export function CatatanSlugClient({
  note,
  tree,
  outgoingLinks,
  backlinks,
  tags,
  localGraph,
}: CatatanSlugClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  // Modal for new note / dangling link creation
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [danglingTarget, setDanglingTarget] = useState("");

  const handleSave = async (data: { title: string; content: string }) => {
    try {
      await updateNote(note.id, {
        title: data.title,
        content_markdown: data.content,
      });
      toast.success("Catatan berhasil disimpan!");
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan catatan.");
      throw err;
    }
  };

  const handleDanglingClick = (targetTitle: string) => {
    setDanglingTarget(targetTitle);
    setNewModalOpen(true);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#FAF8F5] dark:bg-[#141416] overflow-hidden">
      {/* ─── 1. Left Panel: Vault Sidebar Tree ─── */}
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 h-full shrink-0">
        <NoteSidebar
          tree={tree}
          activeSlug={note.slug}
          onNewNote={() => {
            setDanglingTarget("");
            setNewModalOpen(true);
          }}
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
                Vault Explorer
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
              activeSlug={note.slug}
              onNewNote={() => {
                setSidebarOpen(false);
                setDanglingTarget("");
                setNewModalOpen(true);
              }}
              className="h-[calc(100%-49px)]"
            />
          </div>
        </div>
      )}

      {/* ─── 2. Center Panel: Note Content & Editor ─── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden border-r border-border min-w-0">
        {/* Navigation & Metadata Header */}
        <header className="px-4 py-2 bg-surface dark:bg-[#18181B] border-b border-border flex items-center justify-between gap-2 shrink-0 select-none">
          <div className="flex items-center gap-2 min-w-0">
            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded lg:hidden text-text-secondary hover:text-text-primary border border-border"
              title="Buka Sidebar Vault"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-xs font-mono text-text-tertiary truncate">
              <Link
                href="/dashboard/catatan"
                className="hover:text-text-primary transition-colors flex items-center gap-1 shrink-0"
              >
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Vault</span>
              </Link>
              <ChevronRight className="w-3 h-3 shrink-0" />
              {note.category && (
                <>
                  <span className="text-text-secondary truncate hidden md:inline">
                    {note.category.name}
                  </span>
                  <ChevronRight className="w-3 h-3 shrink-0 hidden md:inline" />
                </>
              )}
              <span className="text-text-primary font-bold truncate">
                {note.title}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Global graph shortcut */}
            <Link
              href="/dashboard/catatan/graph"
              className="p-1.5 rounded hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              title="Buka Global Graph View"
            >
              <Network className="w-4 h-4" />
            </Link>

            {/* Right panel toggle */}
            <button
              type="button"
              onClick={() => setRightPanelOpen((prev) => !prev)}
              className="p-1.5 rounded hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              title={rightPanelOpen ? "Sembunyikan Panel Informasi" : "Tampilkan Panel Informasi"}
            >
              {rightPanelOpen ? (
                <PanelRightClose className="w-4 h-4" />
              ) : (
                <PanelRightOpen className="w-4 h-4" />
              )}
            </button>
          </div>
        </header>

        {/* Note Metadata Banner */}
        <div className="px-4 py-2 bg-surface-secondary/30 border-b border-border/60 text-[11px] font-mono text-text-secondary flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-3">
            {note.category && (
              <span
                className="px-2 py-0.5 rounded border flex items-center gap-1 font-bold"
                style={{
                  backgroundColor: `${note.category.color || "#C2553A"}15`,
                  borderColor: `${note.category.color || "#C2553A"}35`,
                  color: note.category.color || "#C2553A",
                }}
              >
                <Folder className="w-3 h-3" />
                <span>{note.category.name}</span>
              </span>
            )}

            <span className="flex items-center gap-1 text-text-tertiary">
              <Calendar className="w-3 h-3" />
              <span>Diperbarui {formatDate(note.updated_at)}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-text-tertiary">
            <span>{outgoingLinks.length} Tautan Keluar</span>
            <span>•</span>
            <span>{backlinks.length} Backlinks</span>
          </div>
        </div>

        {/* Note Editor / Preview Container */}
        <div className="flex-1 overflow-hidden">
          <NoteEditor
            initialTitle={note.title}
            initialContent={note.content_markdown}
            outgoingLinks={outgoingLinks}
            onSave={handleSave}
            onDanglingClick={handleDanglingClick}
          />
        </div>
      </main>

      {/* ─── 3. Right Panel: Local Graph, Backlinks, & Tags ─── */}
      {rightPanelOpen && (
        <aside className="w-80 h-full overflow-y-auto bg-[#FFFFFF] dark:bg-[#18181B] shrink-0 p-4 space-y-6 hidden xl:block select-none">
          {/* Local Graph Widget */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-border/70 pb-2">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-text-primary text-[11px] font-mono">
                <Network className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>Local Graph</span>
              </div>
              <span className="text-[10px] font-mono text-text-tertiary">r = 1</span>
            </div>

            <NoteGraph
              data={localGraph}
              height={200}
              isLocal
              activeSlug={note.slug}
              className="rounded-none shadow-2xs"
            />
          </div>

          {/* Backlinks & Outgoing Links Panel */}
          <NoteBacklinksPanel
            backlinks={backlinks}
            outgoingLinks={outgoingLinks}
            tags={tags}
            onDanglingClick={handleDanglingClick}
          />
        </aside>
      )}

      {/* Modal for creating new note (dangling link resolver) */}
      <NewNoteModal
        isOpen={newModalOpen}
        onClose={() => {
          setNewModalOpen(false);
          setDanglingTarget("");
        }}
        categories={tree.categories}
        defaultTitle={danglingTarget}
        defaultCategoryId={note.category_id}
      />
    </div>
  );
}
