"use client";

import React, { useState, useEffect } from "react";
import {
  Brain,
  Trash2,
  Plus,
  X,
  Shield,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  FolderKanban,
  GraduationCap,
  Sparkles,
  Sliders,
} from "lucide-react";
import {
  clearAllUserMemoriesAction,
  deleteUserMemoryAction,
  getUserMemoriesAction,
  saveUserMemoryAction,
  toggleUserMemoryEnabledAction,
} from "@/actions/ai-memory-actions";
import { MemoryCategory, MemoryItem, UserMemoryProfile } from "@/lib/ai/types";
import { toast } from "sonner";

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<MemoryCategory, { title: string; icon: any; color: string }> = {
  learning_preferences: { title: "Preferensi Belajar", icon: Sliders, color: "text-blue-500" },
  preferred_topics: { title: "Topik Favorit", icon: Sparkles, color: "text-purple-500" },
  skill_level: { title: "Tingkat Keahlian", icon: GraduationCap, color: "text-emerald-500" },
  communication_preferences: { title: "Gaya Komunikasi", icon: Sliders, color: "text-amber-500" },
  ongoing_projects: { title: "Proyek Berjalan", icon: FolderKanban, color: "text-indigo-500" },
  important_context: { title: "Konteks Penting", icon: Brain, color: "text-rose-500" },
};

export function MemoryManagementModal({ isOpen, onClose }: MemoryModalProps) {
  const [profile, setProfile] = useState<UserMemoryProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isClearingAll, setIsClearingAll] = useState(false);

  // New Memory Input State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState<MemoryCategory>("ongoing_projects");
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await getUserMemoriesAction();
      setProfile(data);
    } catch {
      toast.error("Gagal memuat data memori AI");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleEnable = async () => {
    if (!profile) return;
    const nextState = !profile.isEnabled;
    setProfile({ ...profile, isEnabled: nextState });
    await toggleUserMemoryEnabledAction(nextState);
    toast.success(`Memori AI ${nextState ? "diaktifkan" : "dinonaktifkan"}`);
  };

  const handleDeleteItem = async (memoryId: string) => {
    setDeletingId(memoryId);
    try {
      const success = await deleteUserMemoryAction(memoryId);
      if (success) {
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                memories: prev.memories.filter((m) => m.id !== memoryId),
              }
            : null
        );
        toast.success("Item memori berhasil dihapus");
      }
    } catch {
      toast.error("Gagal menghapus item memori");
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus SELURUH memori AI? Tindakan ini tidak dapat dibatalkan.")) {
      return;
    }
    setIsClearingAll(true);
    try {
      await clearAllUserMemoriesAction();
      setProfile((prev) => (prev ? { ...prev, memories: [] } : null));
      toast.success("Semua memori AI berhasil dihapus bersih");
    } catch {
      toast.error("Gagal menghapus semua memori");
    } finally {
      setIsClearingAll(false);
    }
  };

  const handleSaveNewMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) {
      toast.error("Label dan isi memori wajib diisi");
      return;
    }
    setIsSaving(true);
    try {
      const saved = await saveUserMemoryAction(newCategory, newKey.trim(), newValue.trim());
      if (saved) {
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                memories: [...prev.memories, saved],
              }
            : null
        );
        setNewKey("");
        setNewValue("");
        setShowAddForm(false);
        toast.success("Memori baru berhasil disimpan");
      }
    } catch {
      toast.error("Gagal menyimpan memori baru");
    } finally {
      setIsSaving(false);
    }
  };

  const memories = profile?.memories || [];
  const groupedMemories: Record<string, MemoryItem[]> = {};

  for (const item of memories) {
    if (!groupedMemories[item.category]) {
      groupedMemories[item.category] = [];
    }
    groupedMemories[item.category].push(item);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                Pusat Memori & Konteks AI
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-surface border border-border text-text-secondary">
                  {memories.length} item
                </span>
              </h2>
              <p className="text-xs text-text-secondary">
                Kelola informasi jangka panjang yang diingat asisten untuk mempersonalisasi percakapan.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Controls Bar */}
        <div className="px-5 py-3 border-b border-border/70 flex flex-wrap items-center justify-between gap-3 bg-surface text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleEnable}
              className="flex items-center gap-2 font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              {profile?.isEnabled ? (
                <ToggleRight className="w-6 h-6 text-brand-500" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-text-tertiary" />
              )}
              <span>Status Memori: <strong>{profile?.isEnabled ? "Aktif" : "Nonaktif"}</strong></span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 rounded-lg bg-surface-secondary hover:bg-surface-tertiary border border-border text-text-primary font-medium flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Manual</span>
            </button>
            {memories.length > 0 && (
              <button
                disabled={isClearingAll}
                onClick={handleClearAll}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 font-medium flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Semua</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 sidebar-nav-scroll">
          {/* Add Form */}
          {showAddForm && (
            <form
              onSubmit={handleSaveNewMemory}
              className="p-4 rounded-xl border border-brand-500/30 bg-brand-500/5 space-y-3 animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-500 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Tambah Catatan Memori Baru
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-text-tertiary hover:text-text-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] text-text-secondary mb-1">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as MemoryCategory)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-text-primary text-xs"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([catKey, catVal]) => (
                      <option key={catKey} value={catKey}>
                        {catVal.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-text-secondary mb-1">Label / Kunci</label>
                  <input
                    type="text"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="misal: Proyek LMS, Bahasa Utama..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-text-primary text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-text-secondary mb-1">Isi Memori</label>
                <textarea
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Informasi penting yang ingin selalu diingat oleh AI..."
                  rows={2}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-text-primary text-xs"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1 rounded-lg text-xs text-text-secondary hover:bg-surface-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-3 py-1 rounded-lg text-xs bg-brand-600 hover:bg-brand-500 text-white font-medium shadow-xs"
                >
                  {isSaving ? "Menyimpan..." : "Simpan Memori"}
                </button>
              </div>
            </form>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-text-tertiary">
              <RefreshCw className="w-6 h-6 animate-spin text-brand-500" />
              <span className="text-xs">Memuat memori AI...</span>
            </div>
          ) : memories.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-surface-secondary border border-border flex items-center justify-center text-text-tertiary">
                <Brain className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-text-primary">Belum Ada Memori Tersimpan</h4>
              <p className="text-xs text-text-secondary max-w-sm">
                Asisten AI akan secara otomatis mengingat preferensi stabil atau proyek yang Anda sebutkan, atau Anda dapat menambahkannya secara manual.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedMemories).map(([catKey, items]) => {
                const meta = CATEGORY_LABELS[catKey as MemoryCategory] || {
                  title: catKey,
                  icon: Brain,
                  color: "text-brand-500",
                };
                const IconComponent = meta.icon;

                return (
                  <div key={catKey} className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-text-secondary">
                      <IconComponent className={`w-3.5 h-3.5 ${meta.color}`} />
                      <span>{meta.title}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl border border-border/80 bg-surface-secondary/40 hover:bg-surface-secondary hover:border-brand-500/30 transition-all flex items-start justify-between gap-3 group"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-text-primary">{item.key}</span>
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-surface border border-border text-text-tertiary">
                                {item.source === "auto_inferred" ? "Otomatis" : "Manual"}
                              </span>
                            </div>
                            <p className="text-xs text-text-secondary leading-relaxed">{item.value}</p>
                          </div>

                          <button
                            disabled={deletingId === item.id}
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 rounded-lg text-text-tertiary hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
                            title="Hapus memori ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Privacy Note */}
        <div className="p-3.5 border-t border-border bg-surface-secondary/50 flex items-center justify-between text-[11px] text-text-secondary">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Memori dienkripsi dan terisolasi secara privat khusus untuk akun Anda.</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-surface border border-border text-text-primary font-medium hover:bg-surface-secondary"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
