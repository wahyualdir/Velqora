"use client";

import React from "react";
import Link from "next/link";
import {
  Link2,
  ArrowUpRight,
  Hash,
  ExternalLink,
} from "lucide-react";
import type { NoteBacklinkItem, NoteLinkItem } from "@/actions/study/notes";

interface NoteBacklinksPanelProps {
  backlinks: NoteBacklinkItem[];
  outgoingLinks: NoteLinkItem[];
  tags: string[];
  onDanglingClick?: (title: string) => void;
  className?: string;
}

export function NoteBacklinksPanel({
  backlinks,
  outgoingLinks,
  tags,
  onDanglingClick,
  className = "",
}: NoteBacklinksPanelProps) {
  return (
    <div className={`space-y-6 font-mono text-xs ${className}`}>
      {/* ─── 1. Backlinks Panel (Tertaut dari N Catatan) ─── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between border-b border-border/70 pb-2">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-text-primary text-[11px]">
            <Link2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 rotate-45" />
            <span>Tertaut Dari ({backlinks.length})</span>
          </div>
          <span className="text-[10px] text-text-tertiary">Backlinks</span>
        </div>

        {backlinks.length > 0 ? (
          <div className="space-y-2">
            {backlinks.map((b) => (
              <div
                key={b.id}
                className="p-2.5 rounded bg-surface dark:bg-[#18181B] border border-border hover:border-brand-500/50 transition-colors space-y-1.5 group"
              >
                <Link
                  href={`/dashboard/catatan/${b.source_slug}`}
                  className="flex items-center justify-between font-semibold text-text-primary group-hover:text-brand-600 dark:group-hover:text-brand-400 truncate"
                >
                  <span className="truncate">{b.source_title}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                {b.context_snippet && (
                  <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2 italic bg-surface-secondary/50 p-1.5 rounded border border-border/40">
                    &ldquo;{b.context_snippet}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-text-tertiary italic py-2">
            Belum ada catatan lain yang menautkan ke halaman ini.
          </p>
        )}
      </div>

      {/* ─── 2. Outgoing Links (Tautan Keluar) ─── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between border-b border-border/70 pb-2">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-text-primary text-[11px]">
            <ExternalLink className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Tautan Keluar ({outgoingLinks.length})</span>
          </div>
          <span className="text-[10px] text-text-tertiary">Outgoing</span>
        </div>

        {outgoingLinks.length > 0 ? (
          <div className="space-y-1.5">
            {outgoingLinks.map((link) => {
              if (link.is_dangling || !link.target_slug) {
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => onDanglingClick?.(link.target_title_raw)}
                    className="w-full text-left p-2 rounded bg-surface-secondary/40 border border-dashed border-text-tertiary/60 hover:border-brand-500 hover:text-brand-600 text-text-tertiary transition-colors flex items-center justify-between text-[11px] cursor-pointer"
                    title="Catatan belum ada (klik untuk buat)"
                  >
                    <span className="truncate italic">
                      [[{link.target_title_raw}]]
                    </span>
                    <span className="text-[10px] uppercase font-bold text-amber-500 shrink-0">
                      Dangling +
                    </span>
                  </button>
                );
              }

              return (
                <Link
                  key={link.id}
                  href={`/dashboard/catatan/${link.target_slug}`}
                  className="p-2 rounded bg-surface dark:bg-[#18181B] border border-border hover:border-brand-500/50 hover:text-brand-600 transition-colors flex items-center justify-between text-[11px] group"
                >
                  <span className="truncate text-text-primary group-hover:text-brand-600">
                    [[{link.target_title || link.target_title_raw}]]
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-text-tertiary group-hover:text-brand-500 shrink-0" />
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-[11px] text-text-tertiary italic py-2">
            Catatan ini tidak merujuk ke catatan lain.
          </p>
        )}
      </div>

      {/* ─── 3. Tags List ─── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between border-b border-border/70 pb-2">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-text-primary text-[11px]">
            <Hash className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Tag ({tags.length})</span>
          </div>
        </div>

        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/dashboard/catatan?tag=${encodeURIComponent(tag)}`}
                className="px-2 py-0.5 rounded bg-surface-secondary text-text-secondary border border-border hover:border-brand-500/50 hover:text-brand-600 text-[11px] transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-text-tertiary italic py-2">
            Belum ada tag pada catatan ini.
          </p>
        )}
      </div>
    </div>
  );
}
