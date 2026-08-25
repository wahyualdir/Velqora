"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ShieldCheck, Crown, User, Plus, RefreshCw, CheckCircle2, UserCheck, AlertCircle, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/client";
import { OWNER_EMAIL } from "@/lib/utils";
import { getAllUserRolesAction, updateUserRoleAction, UserRoleRecord } from "@/actions/role-actions";
import { getAllSubscriptionsAction, updateUserTierAction } from "@/actions/subscription-actions";
import type { SubscriptionTier, UserSubscription } from "@/actions/subscription-actions";
import { toast } from "sonner";

export default function KelolaRolePage() {
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [users, setUsers] = useState<UserRoleRecord[]>([]);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  // Form input to manually promote by email
  const [inputEmail, setInputEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Check auth - Only Owner allowed
  useEffect(() => {
    async function checkOwnerAuth() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      const userEmail = (data?.user?.email || "").trim().toLowerCase();
      const localRole = typeof window !== "undefined" ? localStorage.getItem("user_role") : null;

      if (userEmail === OWNER_EMAIL.toLowerCase() || localRole === "owner") {
        setIsOwner(true);
        setAuthChecked(true);
      } else {
        toast.error("Halaman ini hanya dapat diakses oleh System Owner.");
        router.push("/dashboard");
      }
    }
    checkOwnerAuth();
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [roleData, subData] = await Promise.all([
        getAllUserRolesAction(),
        getAllSubscriptionsAction().catch(() => [] as UserSubscription[]),
      ]);
      setUsers(roleData);
      setSubscriptions(subData);
    } catch (err: any) {
      toast.error(err.message || "Gagal memuat data role pengguna");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOwner) {
      loadData();
    }
  }, [isOwner]);

  const handlePromoteByInput = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailToPromote = inputEmail.trim().toLowerCase();
    if (!emailToPromote) {
      toast.error("Masukkan alamat email yang valid");
      return;
    }

    setSubmitting(true);
    try {
      await updateUserRoleAction(emailToPromote, "admin");
      toast.success(`Akun ${emailToPromote} berhasil diubah menjadi Administrator!`);
      setInputEmail("");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Gagal merubah role pengguna");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleRole = async (targetEmail: string, currentRole: string) => {
    const normalized = targetEmail.trim().toLowerCase();
    if (normalized === OWNER_EMAIL.toLowerCase()) {
      toast.error("Peran System Owner tidak dapat diubah!");
      return;
    }

    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await updateUserRoleAction(targetEmail, newRole);
      toast.success(
        newRole === "admin"
          ? `Akun ${targetEmail} berhasil dijadikan Administrator!`
          : `Peran ${targetEmail} dikembalikan menjadi User biasa.`
      );
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui wewenang");
    }
  };

  const getUserTier = (email: string): SubscriptionTier => {
    if (email.toLowerCase() === OWNER_EMAIL.toLowerCase()) return "premium";
    const sub = subscriptions.find((s) => s.email.toLowerCase() === email.toLowerCase());
    return (sub?.tier as SubscriptionTier) || "free";
  };

  const handleToggleTier = async (targetEmail: string) => {
    const normalized = targetEmail.trim().toLowerCase();
    const currentTier = getUserTier(normalized);
    const newTier: SubscriptionTier = currentTier === "premium" ? "free" : "premium";

    try {
      await updateUserTierAction(targetEmail, newTier);
      toast.success(
        newTier === "premium"
          ? `Akun ${targetEmail} berhasil di-upgrade ke Premium!`
          : `Akun ${targetEmail} dikembalikan ke Free.`
      );
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui tier");
    }
  };

  if (!authChecked || !isOwner) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
          <p className="text-sm text-text-secondary">Verifikasi hak akses Owner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto space-y-5 sm:space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <PageHeader
        eyebrow="~/access-control"
        technicalMark="< rbac // permissions />"
        title="Kelola hak akses sistem"
        description="Konfigurasi peran pengguna dan batas wewenang administratif."
      />

      {/* Form Tambah/Jadikan Admin */}
      <Card className="space-y-4 border-border">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            <h2 className="text-sm sm:text-base font-bold text-text-primary">Tetapkan Peran Administrator</h2>
          </div>
          <span className="text-xs text-text-tertiary font-mono">Hak Akses Instan</span>
        </div>

        <form onSubmit={handlePromoteByInput} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Masukkan email pengguna (contoh: user@gmail.com)"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              type="email"
              required
            />
          </div>
          <Button type="submit" loading={submitting} className="bg-brand-600 hover:bg-brand-500 text-white gap-2">
            <UserCheck className="w-4 h-4" /> Jadikan Admin
          </Button>
        </form>
      </Card>

      {/* Tabel & Daftar User Roles */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-500" /> Daftar Pengguna & Status Wewenang
            </h2>
            <p className="text-xs text-text-secondary">
              Total {users.length} pengguna terdaftar / terdeteksi di sistem
            </p>
          </div>

          <Button variant="ghost" size="sm" onClick={loadData} loading={loading} className="gap-1.5 text-xs">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-text-tertiary uppercase font-semibold">
                <th className="py-3 px-4">Pengguna / Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Tier AI</th>
                <th className="py-3 px-4">Status Akses</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {users.map((u) => {
                const isOwnerAccount = u.email.toLowerCase() === OWNER_EMAIL.toLowerCase();
                const isAdminAccount = u.role === "admin";
                const userTier = getUserTier(u.email);

                return (
                  <tr key={u.email} className="hover:bg-surface-secondary/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 ${
                            isOwnerAccount
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                              : isAdminAccount
                              ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/40"
                              : "bg-surface-tertiary text-text-secondary"
                          }`}
                        >
                          {isOwnerAccount ? <Crown className="w-4 h-4" /> : isAdminAccount ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>
                        <div>
                          <span className="font-semibold text-text-primary block truncate">{u.email}</span>
                          {isOwnerAccount && (
                            <span className="text-[10px] text-amber-400 font-mono">System Owner (Pemilik Utama)</span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {isOwnerAccount ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          <Crown className="w-3 h-3" /> OWNER
                        </span>
                      ) : isAdminAccount ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                          <ShieldCheck className="w-3 h-3" /> ADMIN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface-tertiary text-text-secondary border border-border">
                          <User className="w-3 h-3" /> USER
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {userTier === "premium" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          <Sparkles className="w-3 h-3" /> PREMIUM
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface-tertiary text-text-secondary border border-border">
                          <User className="w-3 h-3" /> FREE
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {isOwnerAccount ? (
                        <span className="text-amber-400 text-xs font-semibold">Akses Penuh Selamanya</span>
                      ) : isAdminAccount ? (
                        <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Akses Admin Aktif
                        </span>
                      ) : (
                        <span className="text-text-tertiary text-xs">Pengguna Biasa</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isOwnerAccount ? (
                        <span className="text-[11px] text-text-tertiary italic">Pemilik Sistem</span>
                      ) : (
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            size="sm"
                            variant={userTier === "premium" ? "outline" : "primary"}
                            onClick={() => handleToggleTier(u.email)}
                            className={
                              userTier === "premium"
                                ? "text-slate-400 border-slate-500/30 hover:bg-slate-500/10 text-xs"
                                : "bg-amber-600 hover:bg-amber-700 text-white text-xs"
                            }
                          >
                            {userTier === "premium" ? "Downgrade" : "Upgrade Premium"}
                          </Button>
                          <Button
                            size="sm"
                            variant={isAdminAccount ? "outline" : "primary"}
                            onClick={() => handleToggleRole(u.email, u.role)}
                            className={
                              isAdminAccount
                                ? "text-accent-red border-accent-red/30 hover:bg-accent-red/10 text-xs"
                                : "bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                            }
                          >
                            {isAdminAccount ? "Cabut Admin" : "Jadikan Admin"}
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
