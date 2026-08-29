"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleClassroomIcon } from "@/components/ui/brand-logos";
import {
  ClassroomSyncState,
  connectGoogleClassroom,
} from "@/lib/classroom-sync";
import { toast } from "sonner";

interface ClassroomSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  classroomState: ClassroomSyncState;
  onConnected: (state: ClassroomSyncState) => void;
}

export function ClassroomSyncModal({
  isOpen,
  onClose,
  classroomState,
  onConnected,
}: ClassroomSyncModalProps) {
  const [connectEmail, setConnectEmail] = useState(
    classroomState.userEmail || ""
  );
  const [connectToken, setConnectToken] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectEmail.trim()) {
      toast.error("Email Google Classroom wajib diisi.");
      return;
    }

    setIsConnecting(true);
    try {
      const newState = await connectGoogleClassroom(
        connectEmail.trim(),
        connectToken.trim() || undefined
      );
      onConnected(newState);
      toast.success("Google Classroom berhasil dihubungkan!");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghubungkan Classroom.");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Integrasi Google Classroom"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-xl border border-brand-500/30 bg-brand-500/10">
          <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center shrink-0 shadow-2xs">
            <GoogleClassroomIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-text-primary">
              Sinkronkan Tugas & Deadline
            </h4>
            <p className="text-xs text-text-secondary">
              Impor tugas perkuliahan langsung dari Google Classroom ke Velqora.
            </p>
          </div>
        </div>

        <form onSubmit={handleConnect} className="space-y-3.5">
          <Input
            label="Email Google Suite / Kampus *"
            type="email"
            placeholder="mahasiswa@student.ac.id"
            value={connectEmail}
            onChange={(e) => setConnectEmail(e.target.value)}
            required
          />

          <Input
            label="Token / OAuth Client ID (Opsional)"
            placeholder="Biarkan kosong untuk mode simulasi"
            value={connectToken}
            onChange={(e) => setConnectToken(e.target.value)}
          />

          <p className="text-[11px] text-text-tertiary leading-relaxed">
            Data tugas yang disinkronkan akan disimpan secara lokal di ruang kerja Anda.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button type="submit" size="sm" loading={isConnecting}>
              Hubungkan Akun
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
