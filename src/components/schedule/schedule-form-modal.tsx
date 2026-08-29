"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { DAYS } from "./schedule-navigation";
import { toast } from "sonner";

interface ScheduleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: any | null;
  onSave: (item: any) => void;
}

export function ScheduleFormModal({
  isOpen,
  onClose,
  initialItem,
  onSave,
}: ScheduleFormModalProps) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [day, setDay] = useState("Senin");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<"jadwal" | "reminder">("jadwal");
  const [priority, setPriority] = useState<"tinggi" | "sedang" | "rendah">(
    "sedang"
  );

  useEffect(() => {
    if (initialItem) {
      setTitle(initialItem.title || "");
      setSubject(initialItem.subject || "");
      setDay(initialItem.day || "Senin");
      setTime(initialItem.time || "");
      setLocation(initialItem.location || "");
      setType(initialItem.type || "jadwal");
      setPriority(initialItem.priority || "sedang");
    } else {
      setTitle("");
      setSubject("");
      setDay("Senin");
      setTime("");
      setLocation("");
      setType("jadwal");
      setPriority("sedang");
    }
  }, [initialItem, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Nama agenda / kegiatan wajib diisi.");
      return;
    }

    const payload = {
      id: initialItem?.id || `sched_${Date.now()}`,
      title: title.trim(),
      subject: subject.trim(),
      day,
      time: time.trim() || "--:--",
      location: location.trim(),
      type,
      priority,
      isCompleted: initialItem?.isCompleted || false,
    };

    onSave(payload);
    toast.success(
      initialItem ? "Agenda berhasil diperbarui." : "Jadwal berhasil ditambahkan!"
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialItem ? "Edit Agenda Akademik" : "Tambah Jadwal & Agenda"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nama Kegiatan / Sesi *"
          placeholder="Contoh: Kuliah Teori & Praktikum"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Mata Kuliah / Topik"
            placeholder="Contoh: Pemrograman Web Lanjut"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <Select
            label="Hari"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            options={DAYS.filter((d) => d !== "Semua").map((d) => ({
              value: d,
              label: d,
            }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Waktu / Jam"
            placeholder="08:00 - 10:30"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <Select
            label="Jenis Agenda"
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            options={[
              { value: "jadwal", label: "Jadwal Kuliah" },
              { value: "reminder", label: "Pengingat" },
            ]}
          />

          <Select
            label="Prioritas"
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            options={[
              { value: "rendah", label: "Rendah" },
              { value: "sedang", label: "Sedang" },
              { value: "tinggi", label: "Tinggi" },
            ]}
          />
        </div>

        <Input
          label="Lokasi Ruangan / Tautan Kelas Online"
          placeholder="Contoh: Gedung B Ruang 204 atau Zoom ID"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" size="sm">
            Simpan Jadwal
          </Button>
        </div>
      </form>
    </Modal>
  );
}
