"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ShieldCheck, Crown, User, RefreshCw, CheckCircle2, UserCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableContainer,
  TableEmpty,
  TableLoading,
} from "@/components/ui/table";
import { PageContainer, PageSection } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
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
    <PageContainer className="max-w-5xl space-y-6 pb-12">
      {/* Header Banner */}
      <PageHeader
        eyebrow="Administrasi"
        title="Kelola Hak Akses Pengguna"
        description="Konfigurasi peran pengguna dan hak akses administratif sistem Velqora."
      />

      {/* Form Tambah/Jadikan Admin */}
      <PageSection>
        <Card className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              <h2 className="text-sm sm:text-base font-bold text-text-primary">Tetapkan Peran Administrator</h2>
            </div>
            <span className="text-xs text-text-tertiary font-mono">Hak Akses Instan</span>
          </div>

          <form onSubmit={handlePromoteByInput} className="flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-1 w-full">
              <Input
                label="Alamat Email Pengguna"
                placeholder="user@gmail.com"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                type="email"
                required
              />
            </div>
            <Button
              type="submit"
              loading={submitting}
              leftIcon={<UserCheck className="w-4 h-4" />}
            >
              Jadikan Admin
            </Button>
          </form>
        </Card>
      </PageSection>

      {/* Tabel & Daftar User Roles */}
      <PageSection>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-text-primary flex items-center gap-2 font-display">
                <Shield className="w-4 h-4 text-brand-500" /> Daftar Pengguna & Status Wewenang
              </h2>
              <p className="text-xs text-text-secondary">
                Total {users.length} akun terdaftar di sistem
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              loading={loading}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Segarkan
            </Button>
          </div>

          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pengguna / Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Tier AI</TableHead>
                  <TableHead>Status Akses</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableLoading colSpan={5} rows={4} />
                ) : users.length === 0 ? (
                  <TableEmpty colSpan={5} message="Belum ada data pengguna" />
                ) : (
                  users.map((u) => {
                    const isOwnerAccount = u.email.toLowerCase() === OWNER_EMAIL.toLowerCase();
                    const isAdminAccount = u.role === "admin";
                    const userTier = getUserTier(u.email);

                    return (
                      <TableRow key={u.email}>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 border ${
                                isOwnerAccount
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                  : isAdminAccount
                                  ? "bg-brand-500/10 text-brand-400 border-brand-500/30"
                                  : "bg-surface-tertiary text-text-secondary border-border"
                              }`}
                            >
                              {isOwnerAccount ? (
                                <Crown className="w-4 h-4 text-amber-400" />
                              ) : isAdminAccount ? (
                                <ShieldCheck className="w-4 h-4 text-brand-400" />
                              ) : (
                                <User className="w-4 h-4 text-text-tertiary" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="font-medium text-text-primary block truncate">{u.email}</span>
                              {isOwnerAccount && (
                                <span className="text-[11px] text-amber-400 font-mono">System Owner</span>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          {isOwnerAccount ? (
                            <Badge variant="warning" isMono size="sm">
                              <Crown className="w-3 h-3" /> OWNER
                            </Badge>
                          ) : isAdminAccount ? (
                            <Badge variant="brand" isMono size="sm">
                              <ShieldCheck className="w-3 h-3" /> ADMIN
                            </Badge>
                          ) : (
                            <Badge variant="neutral" isMono size="sm">
                              <User className="w-3 h-3" /> USER
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell>
                          {userTier === "premium" ? (
                            <Badge variant="warning" isMono size="sm">
                              <Sparkles className="w-3 h-3" /> PREMIUM
                            </Badge>
                          ) : (
                            <Badge variant="neutral" isMono size="sm">
                              FREE
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell>
                          {isOwnerAccount ? (
                            <span className="text-amber-400 text-xs font-medium">Akses Penuh Selamanya</span>
                          ) : isAdminAccount ? (
                            <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Admin Aktif
                            </span>
                          ) : (
                            <span className="text-text-tertiary text-xs">Pengguna Reguler</span>
                          )}
                        </TableCell>

                        <TableCell className="text-right">
                          {isOwnerAccount ? (
                            <span className="text-xs text-text-tertiary italic">Pemilik Sistem</span>
                          ) : (
                            <div className="flex items-center gap-2 justify-end">
                              <Button
                                size="sm"
                                variant={userTier === "premium" ? "ghost" : "outline"}
                                onClick={() => handleToggleTier(u.email)}
                              >
                                {userTier === "premium" ? "Free Tier" : "Upgrade Premium"}
                              </Button>
                              <Button
                                size="sm"
                                variant={isAdminAccount ? "destructive" : "primary"}
                                onClick={() => handleToggleRole(u.email, u.role)}
                              >
                                {isAdminAccount ? "Cabut Admin" : "Jadikan Admin"}
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </PageSection>
    </PageContainer>
  );
}
