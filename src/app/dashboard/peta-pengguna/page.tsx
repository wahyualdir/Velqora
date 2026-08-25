"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { MapPin, Users, Globe, Clock, RefreshCw, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isAdminUser } from "@/lib/utils";
import { getVisitorLocations } from "@/lib/track-visit";
import { PageHeader } from "@/components/ui/page-header";

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
    <div className="max-w-[1200px] mx-auto space-y-5 sm:space-y-6 animate-fade-in pb-12">

      {/* Header */}
      <PageHeader
        eyebrow="~/telemetry"
        technicalMark="< geo-ip // sessions />"
        title="Aktivitas pengguna"
        description="Pantau persebaran lokasi dan data kunjungan pengguna secara langsung."
        badge={
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-semibold text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Sync</span>
          </div>
        }
        actions={
          <button
            onClick={fetchVisits}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-text-secondary bg-surface-secondary hover:bg-surface-tertiary border border-border transition-all disabled:opacity-50 shrink-0 h-9 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Data</span>
          </button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-surface border border-border flex items-center gap-3 shadow-xs">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400"><Users className="w-4 h-4" /></div>
          <div>
            <div className="text-lg font-bold text-text-primary">{uniqueUsers}</div>
            <div className="text-[11px] text-text-tertiary">Total Pengguna</div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-border flex items-center gap-3 shadow-xs">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><MapPin className="w-4 h-4" /></div>
          <div>
            <div className="text-lg font-bold text-text-primary">{uniqueCities}</div>
            <div className="text-[11px] text-text-tertiary">Kota Berbeda</div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-border flex items-center gap-3 shadow-xs">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400"><Globe className="w-4 h-4" /></div>
          <div>
            <div className="text-lg font-bold text-text-primary">{uniqueCountries}</div>
            <div className="text-[11px] text-text-tertiary">Negara</div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-border flex items-center gap-3 shadow-xs">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><Clock className="w-4 h-4" /></div>
          <div>
            <div className="text-lg font-bold text-text-primary">{visits.length}</div>
            <div className="text-[11px] text-text-tertiary">Total Kunjungan</div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-2xl border border-border overflow-hidden bg-surface" style={{ height: 420 }}>
        <MapView visits={visits} />
      </div>

      {/* Recent visitors table */}
      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-text-primary">Riwayat Kunjungan Terbaru</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider border-b border-border">
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Kota</th>
                <th className="px-5 py-3">Negara</th>
                <th className="px-5 py-3">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {visits.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-text-tertiary">
                    {loading ? "Memuat data..." : "Belum ada data kunjungan. Data akan muncul setelah tabel user_visits dibuat di Supabase."}
                  </td>
                </tr>
              ) : (
                visits.slice(0, 20).map((v, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-surface-secondary/50">
                    <td className="px-5 py-3 text-text-primary font-medium">{v.user_email}</td>
                    <td className="px-5 py-3 text-text-secondary">{v.city}, {v.region}</td>
                    <td className="px-5 py-3 text-text-secondary">{v.country}</td>
                    <td className="px-5 py-3 text-text-tertiary font-mono text-[10px]">
                      {new Date(v.visited_at).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
