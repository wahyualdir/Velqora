"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound } from "lucide-react";
import { ClassItem, addJoinedClassCode } from "@/lib/class-service";
import { toast } from "sonner";

interface JoinClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassItem[];
  joinedCodes: string[];
  userEmail: string;
  onJoined: (code: string) => void;
}

export function JoinClassModal({
  isOpen,
  onClose,
  classes,
  joinedCodes,
  userEmail,
  onJoined,
}: JoinClassModalProps) {
  const [joinCodeInput, setJoinCodeInput] = useState("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const code = joinCodeInput.trim();
    if (!code) {
      toast.error("Masukkan 6 digit kode kelas!");
      return;
    }

    if (code.length !== 6) {
      toast.error("Kode kelas harus terdiri dari 6 karakter!");
      return;
    }

    const targetClass = classes.find(
      (c) => c.code.toLowerCase() === code.toLowerCase()
    );

    if (targetClass && targetClass.teacherEmail === userEmail) {
      toast.info("Anda adalah pengajar / pembuat kelas ini.");
      onClose();
      return;
    }

    if (
      joinedCodes.some(
        (c) => c.toLowerCase() === code.toLowerCase()
      )
    ) {
      toast.info("Anda sudah bergabung di kelas ini.");
      onClose();
      return;
    }

    addJoinedClassCode(code);
    onJoined(code);

    if (targetClass) {
      toast.success(`Berhasil bergabung ke kelas "${targetClass.name}"!`);
    } else {
      toast.success(`Berhasil bergabung dengan kode kelas "${code}"!`);
    }

    setJoinCodeInput("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gabung ke Ruang Kelas">
      <form onSubmit={handleJoin} className="space-y-4">
        <div className="p-3 rounded-xl border border-brand-500/20 bg-brand-500/10 flex items-start gap-3">
          <KeyRound className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
          <p className="text-xs text-text-secondary leading-relaxed">
            Mintalah 6 digit kode kelas kepada dosen atau pengajar Anda, lalu masukkan pada formulir di bawah ini.
          </p>
        </div>

        <Input
          label="Kode Kelas (6 Karakter) *"
          placeholder="Contoh: K9x7B2"
          value={joinCodeInput}
          onChange={(e) => setJoinCodeInput(e.target.value)}
          maxLength={6}
          className="font-mono uppercase tracking-widest text-center text-base"
          required
        />

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" size="sm" className="font-semibold">
            Gabung Kelas
          </Button>
        </div>
      </form>
    </Modal>
  );
}
