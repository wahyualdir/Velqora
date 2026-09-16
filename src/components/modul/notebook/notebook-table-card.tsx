"use client";

import React from "react";
import { Table as TableIcon } from "lucide-react";
import { NotebookTableUnit } from "@/lib/curriculum/types";
import { NoteRenderer } from "@/components/notes/note-renderer";

interface NotebookTableCardProps {
  unit: NotebookTableUnit;
}

export function NotebookTableCard({ unit }: NotebookTableCardProps) {
  if (unit.markdownFallback) {
    return (
      <div className="my-5 rounded-xl border border-border bg-surface dark:bg-[#121316] shadow-xs overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-surface-secondary/40">
          <TableIcon className="w-4 h-4 text-brand-500" />
          <h4 className="text-xs sm:text-sm font-semibold text-text-primary">
            {unit.caption}
          </h4>
        </div>
        <div className="p-4 overflow-x-auto text-xs sm:text-sm">
          <NoteRenderer content={unit.markdownFallback} />
        </div>
      </div>
    );
  }

  return (
    <div className="my-5 rounded-xl border border-border bg-surface dark:bg-[#121316] shadow-xs overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-surface-secondary/40">
        <TableIcon className="w-4 h-4 text-brand-500" />
        <h4 className="text-xs sm:text-sm font-semibold text-text-primary">
          {unit.caption}
        </h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-[13px]">
          <thead className="bg-surface-secondary/60 dark:bg-white/[0.03] text-text-tertiary font-mono text-[11px] uppercase tracking-wider">
            <tr>
              {unit.headers.map((h, idx) => (
                <th key={idx} className="py-2.5 px-3 border-b border-border font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-text-secondary">
            {unit.rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className={
                  rIdx % 2 === 0
                    ? "bg-transparent hover:bg-surface-secondary/30 transition-colors"
                    : "bg-surface-secondary/15 hover:bg-surface-secondary/30 transition-colors"
                }
              >
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="py-2.5 px-3">
                    {String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
