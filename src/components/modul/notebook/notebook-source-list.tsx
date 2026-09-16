"use client";

import React from "react";
import { BookMarked, ExternalLink, ShieldCheck } from "lucide-react";
import { SourceReference, AcademicCitation } from "@/lib/curriculum/types";

interface NotebookSourceListProps {
  sources?: (SourceReference | AcademicCitation)[];
  className?: string;
}

export function NotebookSourceList({ sources, className = "" }: NotebookSourceListProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <footer
      aria-label="Referensi Akademik"
      className={`my-8 pt-6 border-t border-border/80 space-y-3 ${className}`}
    >
      <div className="flex items-center gap-2 text-xs font-semibold text-text-tertiary font-mono uppercase tracking-wider">
        <BookMarked className="w-3.5 h-3.5" />
        <span>Rujukan Akademik & Sumber Terverifikasi</span>
      </div>

      <div className="divide-y divide-border/60 text-xs">
        {sources.map((src, idx) => {
          const authors = Array.isArray(src.authors) ? src.authors.join(", ") : "Penulis Akademik";
          const title = src.title;
          const url = (src as any).url;
          const doi = (src as any).doi;
          const relevance = (src as any).relevanceNote || (src as any).relevance;

          return (
            <div key={idx} className="py-2.5 flex items-start justify-between gap-4">
              <div className="space-y-0.5 min-w-0">
                <div className="font-semibold text-text-primary text-[12.5px] leading-snug flex items-center gap-1.5 flex-wrap">
                  <span>{title}</span>
                  {(src as any).isPrimarySource && (
                    <span className="px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-mono font-medium">
                      Primary
                    </span>
                  )}
                </div>
                <div className="text-text-tertiary text-[11px] font-mono">
                  {authors} {(src as any).year ? `(${(src as any).year})` : ""}
                  {(src as any).publisherOrVenue ? ` — ${(src as any).publisherOrVenue}` : ""}
                </div>
                {relevance && (
                  <div className="text-text-secondary text-[11.5px] italic pt-0.5">
                    &ldquo;{relevance}&rdquo;
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-0.5">
                {doi && (
                  <span className="font-mono text-[10px] text-text-tertiary px-1.5 py-0.5 rounded border border-border bg-surface">
                    DOI: {doi}
                  </span>
                )}
                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 p-1 rounded hover:bg-surface text-text-tertiary hover:text-text-primary transition-colors"
                    title="Buka tautan rujukan eksternal"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </footer>
  );
}
