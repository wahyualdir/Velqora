"use client";

import React from "react";
import { User, Save, Loader2, Mail, GraduationCap } from "lucide-react";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileSettingsProps {
  fullName: string;
  onChangeFullName: (val: string) => void;
  bio: string;
  onChangeBio: (val: string) => void;
  institution: string;
  onChangeInstitution: (val: string) => void;
  avatarUrl: string;
  onChangeAvatarUrl: (val: string) => void;
  email: string;
  onSave: (e: React.FormEvent) => void;
  saving: boolean;
}

export function ProfileSettings({
  fullName,
  onChangeFullName,
  bio,
  onChangeBio,
  institution,
  onChangeInstitution,
  avatarUrl,
  onChangeAvatarUrl,
  email,
  onSave,
  saving,
}: ProfileSettingsProps) {
  return (
    <form onSubmit={onSave} className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-border pb-3 space-y-1">
        <h2 className="text-base sm:text-lg font-bold text-text-primary">
          Profil Pengguna
        </h2>
        <p className="text-xs text-text-secondary leading-relaxed">
          Informasi identitas akademik yang ditampilkan pada modul, catatan studi, dan ruang kelas Anda.
        </p>
      </div>

      {/* Profile Row: Avatar & Email */}
      <div className="space-y-4">
        {/* Email Address (Read-only identity) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            Alamat Email
          </label>
          <Input
            type="email"
            value={email || "Tidak ada email"}
            disabled
            className="bg-surface-secondary/70 text-text-tertiary font-mono text-xs cursor-not-allowed border-border"
          />
          <p className="text-[11px] text-text-tertiary">
            Alamat email terdaftar digunakan untuk autentikasi dan tidak dapat diubah langsung di sini.
          </p>
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            Nama Lengkap
          </label>
          <Input
            type="text"
            value={fullName}
            onChange={(e) => onChangeFullName(e.target.value)}
            placeholder="Masukkan nama lengkap Anda..."
            className="text-xs sm:text-sm"
            required
          />
        </div>

        {/* Institution / Campus */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5" />
            Institusi / Universitas
          </label>
          <Input
            type="text"
            value={institution}
            onChange={(e) => onChangeInstitution(e.target.value)}
            placeholder="Contoh: Universitas Gadjah Mada / Institut Teknologi Bandung"
            className="text-xs sm:text-sm"
          />
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-secondary">
            Bio Akademik
          </label>
          <Textarea
            value={bio}
            onChange={(e) => onChangeBio(e.target.value)}
            placeholder="Tulis ringkasan bidang studi, minat riset, atau fokus akademik Anda..."
            rows={3}
            className="text-xs sm:text-sm leading-relaxed"
          />
        </div>

        {/* Avatar URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-secondary">
            Tautan Foto Profil (URL)
          </label>
          <Input
            type="url"
            value={avatarUrl}
            onChange={(e) => onChangeAvatarUrl(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="text-xs sm:text-sm font-mono"
          />
        </div>
      </div>

      {/* Save Action */}
      <div className="pt-2 border-t border-border flex items-center justify-end">
        <Button
          type="submit"
          disabled={saving}
          className="gap-2 text-xs font-semibold px-5 min-h-[40px] cursor-pointer shadow-2xs"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Profil</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
