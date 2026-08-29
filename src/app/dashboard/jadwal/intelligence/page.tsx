import React, { Suspense } from "react";
import { Metadata } from "next";
import { PageContainer } from "@/components/ui/section";
import { AcademicIntelligenceCenter } from "@/components/schedule/academic-intelligence-center";

export const metadata: Metadata = {
  title: "Academic Intelligence Center | Velqora",
  description:
    "Pusat observasi analitik kecerdasan jadwal, pemantauan beban belajar, deteksi risiko deadline, dan transparansi rekomendasi otomatis.",
};

export default function AcademicIntelligencePage() {
  return (
    <PageContainer>
      <Suspense
        fallback={
          <div className="space-y-6 animate-pulse p-4 sm:p-6 max-w-7xl mx-auto">
            <div className="h-8 w-64 bg-surface-secondary rounded-lg" />
            <div className="h-28 bg-surface-secondary rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-64 bg-surface-secondary rounded-2xl" />
              <div className="h-64 bg-surface-secondary rounded-2xl" />
              <div className="h-64 bg-surface-secondary rounded-2xl" />
            </div>
          </div>
        }
      >
        <AcademicIntelligenceCenter />
      </Suspense>
    </PageContainer>
  );
}
