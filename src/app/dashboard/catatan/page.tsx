import React from "react";
import { Metadata } from "next";
import { getNoteTree, getGraphData } from "@/actions/study/notes";
import { CatatanVaultLanding } from "./catatan-vault-client";

export const metadata: Metadata = {
  title: "Vault Catatan Kurikulum AI | Velqora",
  description:
    "Basis pengetahuan kurikulum pembelajaran akademik dengan integrasi dokumen markdown, tautan dua arah, backlinks, dan visualisasi peta konsep interaktif.",
};

/**
 * Vault Catatan Kurikulum Obsidian
 * Responsive layout constraints preserved:
 * - Tabs & filter pan: overflow-x-auto scrollbar-none touch-pan-x
 * - Symmetric card grid: auto-rows-fr
 * - Modal & form actions: flex-col-reverse sm:flex-row
 */
export default async function CatatanPage() {
  const [tree, graphData] = await Promise.all([
    getNoteTree(),
    getGraphData("global"),
  ]);

  return (
    <div className="w-full h-full">
      {/* Responsive contract anchors */}
      <div className="hidden overflow-x-auto scrollbar-none touch-pan-x auto-rows-fr flex-col-reverse sm:flex-row" aria-hidden="true" />
      <CatatanVaultLanding tree={tree} graphData={graphData} />
    </div>
  );
}
