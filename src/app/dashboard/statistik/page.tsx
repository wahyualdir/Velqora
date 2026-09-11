"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardAnalyticsTab } from "@/surfaces/web/dashboard/dashboard-analytics-tab";
import { PageContainer } from "@/components/ui/section";

export default function StatistikPage() {
  const router = useRouter();

  useEffect(() => {
    // Alihkan otomatis ke dashboard dengan tab statistik aktif
    router.replace("/dashboard?tab=statistik");
  }, [router]);

  return (
    <PageContainer className="p-4 sm:p-6 max-w-[1560px] mx-auto">
      <DashboardAnalyticsTab />
    </PageContainer>
  );
}
