"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Network,
  Search,
  Info,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteGraph } from "@/components/notes/note-graph";
import type { NoteGraphData } from "@/actions/study/notes";

interface CatatanGraphClientProps {
  initialData: NoteGraphData;
}

export function CatatanGraphClient({ initialData }: CatatanGraphClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories from nodes
  const categories = useMemo(() => {
    const map = new Map<string, { id: string; name: string; color: string }>();
    for (const node of initialData.nodes) {
      if (node.categoryId && node.categoryName) {
        map.set(node.categoryId, {
          id: node.categoryId,
          name: node.categoryName,
          color: node.categoryColor || "#C2553A",
        });
      }
    }
    return Array.from(map.values());
  }, [initialData.nodes]);

  // Filter graph data according to search and category filter
  const filteredData = useMemo(() => {
    let nodes = initialData.nodes;

    if (selectedCategory) {
      nodes = nodes.filter((n) => n.categoryId === selectedCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      nodes = nodes.filter(
        (n) => n.title.toLowerCase().includes(q) || n.slug.toLowerCase().includes(q)
      );
    }

    const filteredNodeIds = new Set(nodes.map((n) => n.id));
    const edges = initialData.edges.filter(
      (e) => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
    );

    return { nodes, edges };
  }, [initialData, search, selectedCategory]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#FAF8F5] dark:bg-[#141416] overflow-hidden select-none">
      {/* ─── 1. Top Control Bar ─── */}
      <header className="px-4 py-3 bg-surface dark:bg-[#18181B] border-b border-border flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/catatan">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs font-mono">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </Button>
          </Link>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <h1 className="font-mono font-bold text-sm text-text-primary tracking-tight">
                Peta Pengetahuan Kurikulum (Global Graph)
              </h1>
            </div>
            <p className="text-[11px] font-mono text-text-tertiary">
              {filteredData.nodes.length} Catatan • {filteredData.edges.length} Hubungan Link
            </p>
          </div>
        </div>

        {/* Search & Category Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Node */}
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 w-3.5 h-3.5 text-text-tertiary pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari node materi..."
              className="pl-8 pr-7 py-1.5 bg-surface-secondary/70 focus:bg-surface border border-border rounded text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:outline-hidden w-48 sm:w-64"
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

          {/* Category Filter Chips */}
          <div className="hidden md:flex items-center gap-1 overflow-x-auto max-w-md py-1">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`px-2 py-1 rounded text-[11px] font-mono font-semibold transition-colors cursor-pointer border ${
                selectedCategory === null
                  ? "bg-brand-600 text-white border-brand-600 shadow-xs"
                  : "bg-surface-secondary text-text-secondary border-border hover:text-text-primary"
              }`}
            >
              Semua
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                  className={`px-2 py-1 rounded text-[11px] font-mono font-semibold transition-colors cursor-pointer border flex items-center gap-1.5 ${
                    isSelected
                      ? "text-white shadow-xs"
                      : "bg-surface-secondary text-text-secondary border-border hover:text-text-primary"
                  }`}
                  style={{
                    backgroundColor: isSelected ? cat.color : undefined,
                    borderColor: isSelected ? cat.color : undefined,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ─── 2. Graph View (Full Height) ─── */}
      <main className="flex-1 relative overflow-hidden">
        <NoteGraph
          data={filteredData}
          height="100%"
          className="w-full h-full border-0"
        />

        {/* Graph Legend Floating Widget */}
        <div className="absolute top-4 left-4 p-3 rounded-lg bg-surface/90 backdrop-blur-xs border border-border text-xs font-mono shadow-md pointer-events-auto space-y-2 hidden sm:block max-w-xs">
          <div className="flex items-center gap-1.5 font-bold text-text-primary text-[11px] uppercase">
            <Info className="w-3.5 h-3.5 text-brand-500" />
            <span>Petunjuk Interaksi</span>
          </div>
          <ul className="text-[11px] text-text-secondary space-y-1">
            <li>• Klik node untuk membuka catatan terkait</li>
            <li>• Drag node untuk memanipulasi posisi physics</li>
            <li>• Scroll / pinch untuk zoom in dan zoom out</li>
            <li>• Ukuran node proporsional jumlah tautan</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
