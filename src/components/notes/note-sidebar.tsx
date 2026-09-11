"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Folder,
  FolderOpen,
  FileText,
  ChevronRight,
  ChevronDown,
  Search,
  Plus,
  Network,
  BookOpen,
  Sparkles,
  X,
} from "lucide-react";
import type { NoteTreeResult, CategoryTreeFolder } from "@/actions/study/notes";

interface NoteSidebarProps {
  tree: NoteTreeResult;
  activeSlug?: string;
  onNewNote?: (defaultCategory?: string) => void;
  className?: string;
}

export function NoteSidebar({
  tree,
  activeSlug,
  onNewNote,
  className = "",
}: NoteSidebarProps) {
  const [search, setSearch] = useState("");
  // Categories expanded by default
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    tree.categories.forEach((cat) => {
      // Expand category if active note is inside it
      const hasActive = cat.notes.some((n) => n.slug === activeSlug);
      initial[cat.id] = hasActive || true; // default expand for easy discovery
    });
    return initial;
  });

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Filter tree by search query
  const filteredTree = useMemo(() => {
    if (!search.trim()) return tree;

    const q = search.toLowerCase().trim();

    const filteredCategories: CategoryTreeFolder[] = tree.categories
      .map((cat) => {
        const matchingNotes = cat.notes.filter(
          (n) => n.title.toLowerCase().includes(q) || n.slug.toLowerCase().includes(q)
        );
        const catMatches = cat.name.toLowerCase().includes(q);

        return {
          ...cat,
          notes: catMatches ? cat.notes : matchingNotes,
        };
      })
      .filter((cat) => cat.notes.length > 0 || cat.name.toLowerCase().includes(q));

    const filteredRoots = tree.rootNotes.filter(
      (n) => n.title.toLowerCase().includes(q) || n.slug.toLowerCase().includes(q)
    );

    return {
      categories: filteredCategories,
      rootNotes: filteredRoots,
      totalNotes: tree.totalNotes,
    };
  }, [tree, search]);

  return (
    <aside
      className={`flex flex-col h-full bg-[#FFFFFF] dark:bg-[#18181B] border-r border-border select-none ${className}`}
    >
      {/* ─── 1. Vault Explorer Header ─── */}
      <div className="p-3 border-b border-border/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span className="font-mono font-bold text-xs uppercase tracking-wider text-text-primary">
              Vault Catatan
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-secondary text-text-tertiary border border-border">
              {tree.totalNotes}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Link
              href="/dashboard/catatan/graph"
              className="p-1.5 rounded hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              title="Buka Global Graph View"
              aria-label="Global Graph View"
            >
              <Network className="w-3.5 h-3.5" />
            </Link>

            {onNewNote && (
              <button
                type="button"
                onClick={() => onNewNote()}
                className="p-1.5 rounded hover:bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors cursor-pointer"
                title="Buat Catatan Baru"
                aria-label="Buat Catatan Baru"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 w-3.5 h-3.5 text-text-tertiary pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari di vault..."
            className="w-full pl-8 pr-7 py-1.5 bg-surface-secondary/60 hover:bg-surface-secondary focus:bg-surface border border-border/80 focus:border-brand-500 rounded text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:outline-hidden transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 p-0.5 text-text-tertiary hover:text-text-primary"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* ─── 2. Tree List (Scrollable) ─── */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-xs">
        {/* Category Folders */}
        {filteredTree.categories.map((cat) => {
          const isExpanded = Boolean(expandedCategories[cat.id]);
          const hasNotes = cat.notes.length > 0;

          return (
            <div key={cat.id} className="space-y-0.5">
              {/* Category Folder Header */}
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-surface-secondary text-text-secondary hover:text-text-primary text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 min-w-0 pr-1">
                  <span className="text-text-tertiary group-hover:text-text-primary">
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </span>
                  {isExpanded ? (
                    <FolderOpen
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: cat.color || "#C2553A" }}
                    />
                  ) : (
                    <Folder
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: cat.color || "#C2553A" }}
                    />
                  )}
                  <span className="font-semibold truncate text-[11px]">{cat.name}</span>
                </div>

                <span className="text-[10px] text-text-tertiary font-mono">
                  {cat.notes.length}
                </span>
              </button>

              {/* Child Notes */}
              {isExpanded && (
                <div className="pl-4 space-y-0.5 border-l border-border/40 ml-3.5">
                  {hasNotes ? (
                    cat.notes.map((note) => {
                      const isActive = note.slug === activeSlug;
                      return (
                        <Link
                          key={note.id}
                          href={`/dashboard/catatan/${note.slug}`}
                          className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-left transition-colors truncate cursor-pointer ${
                            isActive
                              ? "bg-brand-500/15 text-brand-600 dark:text-brand-400 font-bold border-l-2 border-brand-600"
                              : "text-text-secondary hover:bg-surface-secondary/70 hover:text-text-primary"
                          }`}
                          title={note.title}
                        >
                          <FileText className="w-3 h-3 shrink-0 opacity-70" />
                          <span className="truncate text-[11px]">{note.title}</span>
                        </Link>
                      );
                    })
                  ) : (
                    <p className="py-1 px-2 text-[10px] text-text-tertiary italic">
                      Belum ada catatan
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Uncategorized Root Notes */}
        {filteredTree.rootNotes.length > 0 && (
          <div className="pt-2 border-t border-border/50 space-y-0.5">
            <div className="px-2 py-1 text-[10px] font-bold text-text-tertiary uppercase">
              Catatan Lepas
            </div>
            {filteredTree.rootNotes.map((note) => {
              const isActive = note.slug === activeSlug;
              return (
                <Link
                  key={note.id}
                  href={`/dashboard/catatan/${note.slug}`}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-left transition-colors truncate cursor-pointer ${
                    isActive
                      ? "bg-brand-500/15 text-brand-600 dark:text-brand-400 font-bold border-l-2 border-brand-600"
                      : "text-text-secondary hover:bg-surface-secondary/70 hover:text-text-primary"
                  }`}
                  title={note.title}
                >
                  <FileText className="w-3 h-3 shrink-0 opacity-70" />
                  <span className="truncate text-[11px]">{note.title}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── 3. Quick Tips Footer ─── */}
      <div className="p-2.5 border-t border-border/80 bg-surface-secondary/30 text-[11px] font-mono text-text-tertiary flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-brand-500" />
          <span>Gunakan [[Link]]</span>
        </span>
        <kbd className="px-1.5 py-0.5 text-[10px] bg-surface rounded border border-border">
          Ctrl+K
        </kbd>
      </div>
    </aside>
  );
}
