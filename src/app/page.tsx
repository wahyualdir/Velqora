import React from "react";
import { NavHeader } from "@/surfaces/web/landing/nav-header";
import { HeroSection } from "@/surfaces/web/landing/hero-section";
import { ProductDuality } from "@/surfaces/web/landing/product-duality";
import { FeatureShowcase } from "@/surfaces/web/landing/feature-showcase";
import { WorkflowNarrative } from "@/surfaces/web/landing/workflow-narrative";
import { ClosingCTA } from "@/surfaces/web/landing/closing-cta";
import { EditorialFooter } from "@/surfaces/web/landing/editorial-footer";

export const metadata = {
  title: "Velqora — Platform Belajar & Manajemen Kuliah Terpadu Mahasiswa",
  description:
    "Platform ruang kerja akademis untuk mahasiswa Indonesia. Manajemen jadwal kuliah bebas bentrok, modul belajar multi-format, pelacakan tugas, dan bimbingan AI Tutor kontekstual.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-brand-500/20 selection:text-brand-600 font-sans antialiased">
      <NavHeader />
      <main>
        <HeroSection />
        <ProductDuality />
        <FeatureShowcase />
        <WorkflowNarrative />
        <ClosingCTA />
      </main>
      <EditorialFooter />
    </div>
  );
}
