"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { updateTask } from "@/actions/study-actions";
import { toast } from "sonner";

interface EditTaskModalProps {
  task: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function EditTaskModal({
  task,
  isOpen,
  onClose,
  onSaved,
}: EditTaskModalProps) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("sedang");
  const [status, setStatus] = useState("belum_dikerjakan");
  const [externalUrl, setExternalUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setSubject(task.subject || "");
      setLecturer(task.lecturer || "");
      setDescription(task.description || "");
      setDeadline(
        task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : ""
      );
      setPriority(task.priority || "sedang");
      setStatus(task.status || "belum_dikerjakan");
      setExternalUrl(task.external_url || "");
      setNotes(task.notes || "");
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Judul tugas wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      await updateTask(task.id, {
        title: title.trim(),
        subject: subject.trim() || undefined,
        lecturer: lecturer.trim() || undefined,
        description: description.trim() || undefined,
        deadline: deadline || undefined,
        priority: priority as any,
        status: status as any,
        external_url: externalUrl.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      toast.success("Tugas berhasil diperbarui.");
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error("Gagal memperbarui tugas: " + (err.message || "Terjadi kesalahan."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Tugas">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Judul Tugas *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Mata Kuliah"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Input
            label="Dosen Pengampu"
            value={lecturer}
            onChange={(e) => setLecturer(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Deadline"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <Select
            label="Prioritas"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={[
              { value: "rendah", label: "Rendah" },
              { value: "sedang", label: "Sedang" },
              { value: "tinggi", label: "Tinggi" },
            ]}
          />
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: "belum_dikerjakan", label: "Belum Mulai" },
              { value: "sedang_dikerjakan", label: "Sedang Dikerjakan" },
              { value: "selesai", label: "Selesai" },
            ]}
          />
        </div>

        <Textarea
          label="Deskripsi / Instruksi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <Input
          label="Link Pengumpulan / GitHub / Drive"
          value={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
        />

        <Textarea
          label="Catatan Tambahan"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" size="sm" loading={loading}>
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </Modal>
  );
}
