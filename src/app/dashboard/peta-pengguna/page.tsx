"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { MapPin, Users, Globe, Clock, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isAdminUser } from "@/lib/utils";
import { getVisitorLocations } from "@/lib/track-visit";
import { PageHeader } from "@/components/ui/page-header";
import { PageContainer, PageSection } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

/* Leaflet map loaded client-side only (no SSR) */
const MapView = dynamic(() => import("./map-view"), { ssr: false, loading: () => (
  <div className="w-full h-full flex items-center justify-center bg-surface rounded-xl">
    <div className="text-sm text-text-tertiary animate-pulse">Memuat peta...</div>
  </div>
)});

interface VisitRecord {
  id?: number;
  user_email: string;
  city: string;
  region: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
  ip: string;
  timezone: string;
  visited_at: string;
}

export default function PetaPenggunaPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth check — redirect non-admin
  useEffect(() => {
    async function check() {
      if (typeof window !== "undefined" && localStorage.getItem("user_role") === "admin") {
        setIsAdmin(true);
        setAuthChecked(true);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email && isAdminUser(data.user.email)) {
        setIsAdmin(true);
      } else {
        router.push("/dashboard");
      }
      setAuthChecked(true);
    }
    check();
  }, [router]);

  // Load visit data & setup real-time listener
  const fetchVisits = async () => {
    const data = await getVisitorLocations();
    setVisits(data as VisitRecord[]);
    setLoading(false);
  };

  useEffect(() => {
    if (!isAdmin) return;

    // Initial fetch
    fetchVisits();

    // 1. Supabase Realtime subscription
    const supabase = createClient();
    const channel = supabase
      .channel("realtime_user_visits")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "user_visits" },
        (payload) => {
          if (payload.new) {
            setVisits((prev) => [payload.new as VisitRecord, ...prev]);
          }
        }
      )
      .subscribe();

    // 2. Auto-polling interval (every 3 seconds for instant real-time sync)
    const interval = setInterval(() => {
      fetchVisits();
    }, 3000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [isAdmin]);

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-text-tertiary animate-pulse">Memverifikasi akses...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  // Stats
  const uniqueUsers = new Set(visits.map((v) => v.user_email)).size;
  const uniqueCities = new Set(visits.map((v) => v.city).filter(Boolean)).size;
  const uniqueCountries = new Set(visits.map((v) => v.country).filter(Boolean)).size;

  return (
    <PageContainer className="max-w-6xl space-y-6 pb-12">
      {/* Header */}
      <PageHeader
        eyebrow="Telemetri"
        title="Aktivitas Pengguna"
        description="Pantau persebaran lokasi dan data kunjungan pengguna secara langsung."
        badge={
          <Badge variant="success" dot size="sm">
            Live Sync
          </Badge>
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={fetchVisits}
            loading={loading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Sync Data
          </Button>
        }
      />

      {/* Stats row */}
      <PageSection>
        <div className="stats-grid">
          <div className="p-4 rounded-xl bg-surface border border-border flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400"><Users className="w-4 h-4" /></div>
            <div>
              <div className="text-lg font-bold text-text-primary">{uniqueUsers}</div>
              <div className="text-xs text-text-tertiary">Total Pengguna</div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-border flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><MapPin className="w-4 h-4" /></div>
            <div>
              <div className="text-lg font-bold text-text-primary">{uniqueCities}</div>
              <div className="text-xs text-text-tertiary">Kota Berbeda</div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-border flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400"><Globe className="w-4 h-4" /></div>
            <div>
              <div className="text-lg font-bold text-text-primary">{uniqueCountries}</div>
              <div className="text-xs text-text-tertiary">Negara</div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-border flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><Clock className="w-4 h-4" /></div>
            <div>
              <div className="text-lg font-bold text-text-primary">{visits.length}</div>
              <div className="text-xs text-text-tertiary">Total Kunjungan</div>
            </div>
          </div>
        </div>
      </PageSection>

      {/* Map */}
      <PageSection>
        <div className="rounded-xl border border-border overflow-hidden bg-surface" style={{ height: 420 }}>
          <MapView visits={visits} />
        </div>
      </PageSection>

      {/* Recent visitors table */}
      <PageSection>
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-text-primary font-display">Riwayat Kunjungan Terbaru</h2>
          
          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Kota</TableHead>
                  <TableHead>Negara</TableHead>
                  <TableHead>Waktu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableLoading colSpan={4} rows={4} />
                ) : visits.length === 0 ? (
                  <TableEmpty
                    colSpan={4}
                    message="Belum ada data kunjungan"
                    description="Data aktivitas kunjungan akan tercatat otomatis saat pengguna membuka dashboard."
                  />
                ) : (
                  visits.slice(0, 20).map((v, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{v.user_email}</TableCell>
                      <TableCell className="text-text-secondary">{v.city}, {v.region}</TableCell>
                      <TableCell className="text-text-secondary">{v.country}</TableCell>
                      <TableCell className="text-text-tertiary font-mono text-xs">
                        {new Date(v.visited_at).toLocaleString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </PageSection>
    </PageContainer>
  );
}
