"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  Settings,
  Camera,
  Crown,
  Shield,
  Sparkles,
  Loader2,
  ChevronDown,
  Download,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKET } from "@/lib/constants";
import { isAdminUser, isOwnerUser } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { toast } from "sonner";

interface UserProfileMenuProps {
  variant?: "navbar" | "sidebar";
  onCloseParent?: () => void;
  isCollapsed?: boolean;
}

export function UserProfileMenu({ variant = "navbar", onCloseParent, isCollapsed = false }: UserProfileMenuProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // User Profile State
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Pengguna");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user profile & sync with Google metadata if available
  const loadUserData = async () => {
    try {
      const localRole = typeof window !== "undefined" ? localStorage.getItem("user_role") : null;
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        const email = (user.email || "").trim().toLowerCase();
        setUserEmail(email);

        const meta = user.user_metadata || {};
        const appMeta = user.app_metadata || {};

        // Automatic Google Profile Synchronization
        const isGoogle =
          appMeta.provider === "google" ||
          user.identities?.some((id) => id.provider === "google") ||
          false;
        setIsGoogleUser(isGoogle);

        const name =
          meta.full_name ||
          meta.name ||
          meta.custom_claims?.global_name ||
          (email ? email.split("@")[0] : "Pengguna");
        setUserName(name);

        const photo = meta.avatar_url || meta.picture || meta.avatar || null;
        setAvatarUrl(photo);

        if (isOwnerUser(email) || localRole === "owner") {
          setIsOwner(true);
          setIsAdmin(true);
        } else if (localRole === "admin" || isAdminUser(email)) {
          setIsAdmin(true);
        }
      }
    } catch (err) {
      console.error("Error loading user profile menu data:", err);
    }
  };

  useEffect(() => {
    loadUserData();

    const supabase = createClient();
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      loadUserData();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle direct profile photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Silakan pilih file gambar (JPG, PNG, atau WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 5MB.");
      return;
    }

    setUploadingPhoto(true);
    const toastId = toast.loading("Mengunggah foto profil...");

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `avatars/${userId}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(fileName);

      const newAvatarUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          avatar_url: newAvatarUrl,
          picture: newAvatarUrl,
        },
      });

      if (updateError) throw updateError;

      setAvatarUrl(newAvatarUrl);
      toast.success("Foto profil berhasil diperbarui!", { id: toastId });
    } catch (err: any) {
      console.error("Error uploading profile photo:", err);
      toast.error(err.message || "Gagal mengunggah foto profil", { id: toastId });
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleLogout = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("user_role");
      }
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success(t("logout") ? `${t("logout")} berhasil` : "Berhasil keluar dari akun");
      setIsOpen(false);
      if (onCloseParent) onCloseParent();
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      router.push("/login");
    }
  };

  const initialLetter = (userName || userEmail || "U").charAt(0).toUpperCase();

  // SIDEBAR VARIANT
  if (variant === "sidebar") {
    return (
      <div className="relative w-full" ref={menuRef}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePhotoUpload}
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
        />

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          title={isCollapsed ? userName : "Buka Menu Profil & Akun"}
          className={`w-full flex items-center ${isCollapsed ? "justify-center p-1.5" : "justify-between p-2.5"} rounded-xl border border-border/50 hover:border-border bg-surface-secondary/40 hover:bg-surface-secondary transition-all duration-150 group text-left focus:outline-none focus:ring-1 focus:ring-brand-500/30`}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center shadow-2xs">
                <div className="w-full h-full rounded-xl flex items-center justify-center text-text-primary font-bold text-sm overflow-hidden">
                  {uploadingPhoto ? (
                    <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
                  ) : avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={userName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{initialLetter}</span>
                  )}
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-surface" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[14px] font-semibold text-text-primary truncate">
                    {userName}
                  </span>
                  {isOwner ? (
                    <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : isAdmin ? (
                    <Shield className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                  ) : null}
                </div>
                <span className="text-[12px] text-text-tertiary truncate">
                  {isOwner ? "Owner" : isAdmin ? "Admin" : isGoogleUser ? "Akun Google" : "Pelajar"}
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <ChevronDown
              className={`w-4 h-4 text-text-tertiary transition-transform duration-200 shrink-0 ${
                isOpen ? "rotate-180 text-text-primary" : "group-hover:text-text-secondary"
              }`}
            />
          )}
        </button>

        {isOpen && (
          <div className="absolute left-0 bottom-full mb-2.5 w-72 sm:w-80 rounded-2xl bg-surface border border-border shadow-xl p-4 z-50 animate-fade-in space-y-4">
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-surface-secondary/70 border border-border/80">
              <div className="relative group/avatar shrink-0">
                <div className="w-13 h-13 rounded-xl border-2 border-brand-500/30 bg-surface flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-surface flex items-center justify-center text-text-primary font-bold text-base overflow-hidden">
                    {uploadingPhoto ? (
                      <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
                    ) : avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={userName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span>{initialLetter}</span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Unggah Foto Profil Baru"
                  disabled={uploadingPhoto}
                  className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white"
                >
                  <Camera className="w-5 h-5 text-white drop-shadow" />
                </button>
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white truncate">{userName}</span>
                  {isOwner ? (
                    <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : isAdmin ? (
                    <Shield className="w-3.5 h-3.5 text-[#2997ff] shrink-0" />
                  ) : null}
                </div>

                <span className="text-[11px] text-slate-400 font-mono truncate">{userEmail}</span>

                <div className="mt-1.5 flex items-center gap-1.5">
                  {isOwner ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      <Crown className="w-3 h-3" /> Owner
                    </span>
                  ) : isAdmin ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#0071e3]/15 text-[#2997ff] border border-[#0071e3]/30">
                      <Shield className="w-3 h-3" /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      <Sparkles className="w-3 h-3" /> Pelajar Aktif
                    </span>
                  )}

                  {isGoogleUser && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                      Google
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Menu Items */}
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-medium text-white hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.15] transition-all text-left"
              >
                <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </div>
                <span>{uploadingPhoto ? "Mengunggah..." : "Tambah / Ganti Foto Profil"}</span>
              </button>

              <Link
                href="/dashboard/pengaturan"
                onClick={() => {
                  setIsOpen(false);
                  if (onCloseParent) onCloseParent();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-medium text-white hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.15] transition-all"
              >
                <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                  <Settings className="w-3.5 h-3.5 text-white" />
                </div>
                <span>Pengaturan Akun & Profil</span>
              </Link>
            </div>

            {/* Divider & Logout Button */}
            <div className="border-t border-white/[0.08] pt-2">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 active:scale-[0.98] transition-all duration-200 shadow-sm"
              >
                <LogOut className="w-4 h-4 shrink-0 text-red-400" />
                <span>{t("logout") || "Keluar dari Akun"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // NAVBAR VARIANT (Default)
  return (
    <div className="relative inline-block" ref={menuRef}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
      />

      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Buka Menu Profil & Akun"
        className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-200 active:scale-95 group focus:outline-none"
      >
        <div className="relative shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-brand-500/30 bg-surface flex items-center justify-center overflow-hidden">
            <div className="w-full h-full rounded-full bg-surface flex items-center justify-center text-text-primary font-bold text-xs overflow-hidden">
              {uploadingPhoto ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-500" />
              ) : avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>{initialLetter}</span>
              )}
            </div>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-surface" />
        </div>

        <div className="hidden sm:flex flex-col text-left max-w-[120px]">
          <span className="text-xs font-semibold text-text-primary truncate group-hover:text-brand-500 transition-colors">
            {userName}
          </span>
          <span className="text-[10px] text-text-tertiary font-mono truncate">
            {isOwner ? "Owner" : isAdmin ? "Admin" : isGoogleUser ? "Google" : "Pelajar"}
          </span>
        </div>

        <ChevronDown
          className={`hidden sm:block w-3.5 h-3.5 text-text-tertiary transition-transform duration-200 ${
            isOpen ? "rotate-180 text-text-primary" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-72 sm:w-80 rounded-2xl bg-surface border border-border shadow-xl p-4 z-50 animate-fade-in space-y-4">
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-surface-secondary/70 border border-border/80">
            <div className="relative group/avatar shrink-0">
              <div className="w-13 h-13 rounded-xl border-2 border-brand-500/30 bg-surface flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-surface flex items-center justify-center text-text-primary font-bold text-base overflow-hidden">
                  {uploadingPhoto ? (
                    <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
                  ) : avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={userName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{initialLetter}</span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Unggah Foto Profil Baru"
                disabled={uploadingPhoto}
                className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white"
              >
                <Camera className="w-5 h-5 text-white drop-shadow" />
              </button>
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white truncate">{userName}</span>
                {isOwner ? (
                  <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                ) : isAdmin ? (
                  <Shield className="w-3.5 h-3.5 text-[#2997ff] shrink-0" />
                ) : null}
              </div>

              <span className="text-[11px] text-slate-400 font-mono truncate">{userEmail}</span>

              <div className="mt-1.5 flex items-center gap-1.5">
                {isOwner ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    <Crown className="w-3 h-3" /> Owner
                  </span>
                ) : isAdmin ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#0071e3]/15 text-[#2997ff] border border-[#0071e3]/30">
                    <Shield className="w-3 h-3" /> Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <Sparkles className="w-3 h-3" /> Pelajar Aktif
                  </span>
                )}

                {isGoogleUser && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                    Google Linked
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-medium text-white hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.15] transition-all text-left"
            >
              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                <Camera className="w-3.5 h-3.5 text-white" />
              </div>
              <span>{uploadingPhoto ? "Mengunggah..." : "Tambah / Ganti Foto Profil"}</span>
            </button>

            <Link
              href="/dashboard/pengaturan"
              onClick={() => {
                setIsOpen(false);
                if (onCloseParent) onCloseParent();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-medium text-white hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.15] transition-all"
            >
              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                <Settings className="w-3.5 h-3.5 text-white" />
              </div>
              <span>Pengaturan Akun & Profil</span>
            </Link>

            <Link
              href="/download"
              onClick={() => {
                setIsOpen(false);
                if (onCloseParent) onCloseParent();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-medium text-white hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.15] transition-all"
            >
              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                <Download className="w-3.5 h-3.5 text-brand-400" />
              </div>
              <span>Unduh / Pasang Aplikasi</span>
            </Link>
          </div>

          <div className="border-t border-white/[0.08] pt-2">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 active:scale-[0.98] transition-all duration-200 shadow-sm"
            >
              <LogOut className="w-4 h-4 shrink-0 text-red-400" />
              <span>{t("logout") || "Keluar dari Akun"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
