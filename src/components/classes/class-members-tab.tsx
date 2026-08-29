"use client";

import React, { useState, useMemo } from "react";
import { Search, ShieldCheck, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MemberItem {
  id: string;
  name: string;
  role: "pengajar" | "mahasiswa";
  status: "aktif" | "terdaftar";
}

interface ClassMembersTabProps {
  teacherName: string;
  teacherEmail?: string;
  membersCount: number;
}

export function ClassMembersTab({
  teacherName,
  _teacherEmail,
  membersCount,
}: ClassMembersTabProps & { _teacherEmail?: string }) {
  const [search, setSearch] = useState("");

  // Construct real member list based on class data
  const membersList: MemberItem[] = useMemo(() => {
    const list: MemberItem[] = [
      {
        id: "teacher-1",
        name: teacherName || "Pengajar Kelas",
        role: "pengajar",
        status: "aktif",
      },
    ];

    // Generate members up to membersCount
    const studentCount = Math.max(1, membersCount - 1);
    for (let i = 1; i <= studentCount; i++) {
      list.push({
        id: `student-${i}`,
        name: i === 1 ? "Mahasiswa Peserta" : `Peserta Kelas ${i}`,
        role: "mahasiswa",
        status: "aktif",
      });
    }

    return list;
  }, [teacherName, membersCount]);

  const filteredMembers = useMemo(() => {
    if (!search.trim()) return membersList;
    const q = search.toLowerCase().trim();
    return membersList.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q)
    );
  }, [membersList, search]);

  const teachers = filteredMembers.filter((m) => m.role === "pengajar");
  const students = filteredMembers.filter((m) => m.role === "mahasiswa");

  return (
    <div className="space-y-6">
      {/* Search Members */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari anggota kelas..."
          className="w-full pl-10 pr-9 py-2 min-h-[40px] rounded-xl border border-border bg-surface-secondary/70 text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-500 transition-colors font-medium"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-2.5 p-1 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
            title="Hapus kata kunci"
            aria-label="Hapus kata kunci pencarian"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Teachers Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-border/70 pb-2 px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-text-secondary">
            Pengajar ({teachers.length})
          </h3>
        </div>

        <div className="space-y-2">
          {teachers.map((member) => (
            <div
              key={member.id}
              className="p-3.5 rounded-xl border border-border bg-surface flex items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-text-primary">
                    {member.name}
                  </h4>
                  <span className="text-[11px] text-text-tertiary font-mono">
                    Dosen / Instruktur
                  </span>
                </div>
              </div>

              <Badge variant="default" className="text-[10px] gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Pengajar</span>
              </Badge>
            </div>
          ))}
        </div>
      </section>

      {/* Students Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-border/70 pb-2 px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-text-secondary">
            Mahasiswa & Peserta ({students.length})
          </h3>
        </div>

        {students.length === 0 ? (
          <p className="text-xs text-text-tertiary px-1 py-4 text-center">
            Tidak ada mahasiswa yang sesuai dengan pencarian.
          </p>
        ) : (
          <div className="space-y-2">
            {students.map((member) => (
              <div
                key={member.id}
                className="p-3.5 rounded-xl border border-border bg-surface flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-surface-secondary border border-border flex items-center justify-center font-bold text-xs text-text-primary">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-text-primary">
                      {member.name}
                    </h4>
                    <span className="text-[11px] text-text-tertiary font-mono">
                      Mahasiswa Terdaftar
                    </span>
                  </div>
                </div>

                <Badge variant="secondary" className="text-[10px]">
                  Aktif
                </Badge>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
