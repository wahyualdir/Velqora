import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getNoteBySlug,
  getNoteTree,
  getGraphData,
  getNotesByCategory,
  type NoteEntity,
} from "@/actions/study/notes";
import { CatatanSlugClient } from "./catatan-slug-client";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ fromCategory?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const data = await getNoteBySlug(decodedSlug);

  if (!data || !data.note) {
    return {
      title: "Catatan Tidak Ditemukan | Velqora",
    };
  }

  return {
    title: `${data.note.title} — Vault Catatan | Velqora`,
    description: data.note.content_markdown.slice(0, 150),
  };
}

export default async function NoteDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { fromCategory } = searchParams ? await searchParams : {};
  const decodedSlug = decodeURIComponent(slug);

  const [noteData, tree] = await Promise.all([
    getNoteBySlug(decodedSlug),
    getNoteTree(),
  ]);

  if (!noteData || !noteData.note) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center space-y-4 font-mono">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-lg font-bold text-text-primary">
            Catatan Tidak Ditemukan
          </h1>
          <p className="text-xs text-text-secondary max-w-md">
            Dokumen dengan slug &quot;{decodedSlug}&quot; belum terdaftar di kurikulum vault.
          </p>
        </div>
        <Link href="/dashboard/catatan">
          <Button size="sm" className="gap-1.5 text-xs font-mono">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Vault</span>
          </Button>
        </Link>
      </div>
    );
  }

  // Fetch 1-degree local graph
  const localGraph = await getGraphData({ noteId: noteData.note.id });

  // Sibling notes navigation (within the same category context)
  const categoryContext =
    fromCategory ||
    noteData.note.category_id ||
    (noteData.note.category
      ? noteData.note.category.id || noteData.note.category.name
      : "");
  let prevNote: NoteEntity | null = null;
  let nextNote: NoteEntity | null = null;
  let categoryName = noteData.note.category?.name || "";

  if (categoryContext) {
    try {
      const siblingNotes = await getNotesByCategory(categoryContext);
      if (siblingNotes.length > 0) {
        if (!categoryName && siblingNotes[0].category?.name) {
          categoryName = siblingNotes[0].category.name;
        }
        const currentIndex = siblingNotes.findIndex(
          (n) => n.id === noteData.note.id || n.slug === decodedSlug
        );
        if (currentIndex !== -1) {
          prevNote = currentIndex > 0 ? siblingNotes[currentIndex - 1] : null;
          nextNote =
            currentIndex < siblingNotes.length - 1
              ? siblingNotes[currentIndex + 1]
              : null;
        }
      }
    } catch {
      // Non-critical fallback
    }
  }

  return (
    <CatatanSlugClient
      note={noteData.note}
      tree={tree}
      outgoingLinks={noteData.outgoingLinks}
      backlinks={noteData.backlinks}
      tags={noteData.tags}
      localGraph={localGraph}
      fromCategory={fromCategory}
      categoryName={categoryName}
      prevNote={prevNote}
      nextNote={nextNote}
    />
  );
}
