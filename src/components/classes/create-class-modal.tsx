"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { RefreshCw, Copy, Check } from "lucide-react";
import {
  generateClassCode,
  ClassItem,
  getRandomBannerGradient,
} from "@/lib/class-service";
import { toast } from "sonner";

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userName: string;
  onCreated: (newClass: ClassItem) => void;
}

export function CreateClassModal({
  isOpen,
  onClose,
  userEmail,
  userName,
  onCreated,
}: CreateClassModalProps) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setSubject("");
      setDescription("");
      setGeneratedCode(generateClassCode());
      setCopied(false);
    }
  }, [isOpen]);

  const handleRegenerateCode = () => {
    setGeneratedCode(generateClassCode());
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success("Kode kelas disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !subject.trim()) {
      toast.error("Nama kelas dan mata kuliah wajib diisi!");
      return;
    }

    const newClass: ClassItem = {
      id: "class-" + Date.now(),
      name: name.trim(),
      subject: subject.trim(),
      description: description.trim(),
      code: generatedCode || generateClassCode(),
      teacherName: userName || "Pengajar",
      teacherEmail: userEmail || "user@velqora.com",
      createdAt: new Date().toISOString(),
      membersCount: 1,
      bannerColor: getRandomBannerGradient(),
    };

    onCreated(newClass);
    toast.success(`Ruang kelas "${newClass.name}" berhasil dibuat!`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Buat Ruang Kelas Baru">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nama Kelas *"
          placeholder="Contoh: TI-3A Pemrograman Web Lanjut"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Mata Kuliah / Subjek *"
          placeholder="Contoh: Pemrograman Web & Aplikasi Cloud"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />

        <Textarea
          label="Deskripsi / Info Kelas (Opsional)"
          placeholder="Deskripsi singkat mengenai aturan perkuliahan, jadwal, atau silabus kelas..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        {/* Generated 6-digit Code Box */}
        <div className="p-3 rounded-xl border border-border bg-surface-secondary space-y-1.5">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span className="font-medium">Kode Akses Kelas (6 Karakter)</span>
            <button
              type="button"
              onClick={handleRegenerateCode}
              className="inline-flex items-center gap-1 text-[11px] text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Acak Ulang</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-surface border border-border">
            <span className="font-mono text-base font-bold tracking-widest text-text-primary pl-2">
              {generatedCode}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopyCode}
              className="gap-1 text-xs text-text-secondary hover:text-text-primary"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? "Tersalin" : "Salin"}</span>
            </Button>
          </div>
          <p className="text-[11px] text-text-tertiary">
            Bagikan kode ini kepada mahasiswa untuk bergabung ke ruang kelas Anda.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" size="sm" className="font-semibold">
            Buat Kelas
          </Button>
        </div>
      </form>
    </Modal>
  );
}
