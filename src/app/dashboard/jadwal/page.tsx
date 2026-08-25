"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

export default function JadwalRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/tugas?tab=jadwal");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex items-center gap-3 text-text-secondary text-sm">
        <RefreshCw className="w-5 h-5 animate-spin text-brand-500" />
        <span>Mengalihkan ke Tugas Pembelajaran...</span>
      </div>
    </div>
  );
}
