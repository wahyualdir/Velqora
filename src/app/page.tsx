import React from "react";
import type { Metadata } from "next";
import { NavHeader } from "@/surfaces/web/landing/nav-header";
import { HeroSection } from "@/surfaces/web/landing/hero-section";
import { ProductDuality } from "@/surfaces/web/landing/product-duality";
import { FeatureShowcase } from "@/surfaces/web/landing/feature-showcase";
import { WorkflowNarrative } from "@/surfaces/web/landing/workflow-narrative";
import { ClosingCTA } from "@/surfaces/web/landing/closing-cta";
import { EditorialFooter } from "@/surfaces/web/landing/editorial-footer";

export const metadata: Metadata = {
  title: "Velqora — Workspace Akademis & Manajemen Kuliah Mahasiswa",
  description:
    "Susun jadwal kuliah tanpa bentrok, arsipkan modul dan slide dosen, lacak deadline tugas, serta pelajari konsep sulit bersama AI tutor kontekstual.",
  keywords: [
    "Velqora",
    "Jadwal Kuliah Mahasiswa",
    "Manajemen Kuliah",
    "AI Tutor Kampus",
    "Arsip Modul Kuliah",
    "Workspace Mahasiswa",
  ],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-brand-500/20 selection:text-brand-600 font-sans antialiased scroll-smooth">
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
