"use client";

import React, { useState } from "react";
import { Boxes, Database, PackageCheck, Search, Sparkles } from "lucide-react";
import type { SqlTableMeta, VariableSummary } from "@/lib/notebook/types";

interface VariableInspectorPanelProps {
  variables: VariableSummary[];
  tables: SqlTableMeta[];
  installedPackages: string[];
  onInsertExpression?: (expr: string) => void;
}

export function VariableInspectorPanel({
  variables,
  tables,
  installedPackages,
  onInsertExpression,
}: VariableInspectorPanelProps) {
  const [filter, setFilter] = useState("");
  const q = filter.trim().toLowerCase();

  const filteredVars = variables.filter(
    (v) =>
      !q ||
      v.name.toLowerCase().includes(q) ||
      v.type.toLowerCase().includes(q)
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-text-tertiary absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Cari variabel atau tipe..."
          className="w-full min-h-[38px] pl-8 pr-3 py-1.5 rounded-xl border border-border bg-surface text-xs font-mono text-text-primary focus:outline-hidden focus:border-[#C2553A]"
        />
      </div>

      {/* Live Variables */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Boxes className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A]" />
            <span>Variabel Aktif ({filteredVars.length})</span>
          </span>
        </div>

        {filteredVars.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-text-tertiary font-mono">
            Jalankan sel Python, SQL, atau JS untuk melihat variabel di memori.
          </div>
        ) : (
          <div className="space-y-1.5">
            {filteredVars.map((v) => (
              <div
                key={`${v.kernel}:${v.name}`}
                className="p-2.5 rounded-xl border border-border bg-surface space-y-1 hover:border-[#C2553A]/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-mono font-bold text-text-primary truncate">
                      {v.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-surface-secondary text-[9.5px] font-mono text-text-tertiary uppercase">
                      {v.kernel}
                    </span>
                  </div>
                  <span className="text-[10.5px] font-mono text-[#C2553A] dark:text-[#D4664A] shrink-0">
                    {v.type}
                    {v.shape ? ` ${v.shape}` : ""}
                  </span>
                </div>

                <p className="text-[11px] font-mono text-text-secondary truncate">
                  {v.preview}
                </p>

                {v.isTabular && v.columns && v.columns.length > 0 && (
                  <p className="text-[10px] font-mono text-text-tertiary truncate">
                    Kolom: {v.columns.join(", ")}
                  </p>
                )}

                {onInsertExpression && (
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => onInsertExpression(v.name)}
                      className="px-2 py-0.5 rounded-md border border-border bg-surface-secondary/60 hover:bg-surface-secondary text-[10px] font-mono text-text-secondary hover:text-text-primary cursor-pointer"
                    >
                      + Sisipkan ke Sel
                    </button>
                    {v.isTabular && (
                      <button
                        type="button"
                        onClick={() =>
                          onInsertExpression(`SELECT * FROM ${v.name} LIMIT 20;`)
                        }
                        className="px-2 py-0.5 rounded-md border border-[#C2553A]/30 bg-[#C2553A]/10 text-[10px] font-mono text-[#C2553A] dark:text-[#D4664A] cursor-pointer"
                      >
                        Query via SQL
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SQL Tables */}
      {tables.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-text-secondary">
            <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Tabel SQLite Aktif ({tables.length})</span>
          </div>

          <div className="space-y-1.5">
            {tables.map((t) => (
              <div
                key={t.name}
                className="p-2.5 rounded-xl border border-border bg-surface space-y-1 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary">{t.name}</span>
                  <span className="text-[10.5px] text-text-tertiary">
                    {t.rowCount} baris
                  </span>
                </div>
                <p className="text-[10.5px] text-text-secondary truncate">
                  {t.columns.map((c) => `${c.name} (${c.type})`).join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Installed Packages */}
      {installedPackages.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-text-secondary">
            <PackageCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Paket Terpasang ({installedPackages.length})</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {installedPackages.slice(0, 24).map((pkg) => (
              <span
                key={pkg}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-border bg-surface text-[10px] font-mono text-text-secondary"
              >
                <Sparkles className="w-2.5 h-2.5 text-[#C2553A]" />
                {pkg}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
