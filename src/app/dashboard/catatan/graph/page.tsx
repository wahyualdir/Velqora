import React from "react";
import { Metadata } from "next";
import { getGraphData } from "@/actions/study/notes";
import { CatatanGraphClient } from "./catatan-graph-client";

export const metadata: Metadata = {
  title: "Peta Pengetahuan Kurikulum (Global Graph) | Velqora",
  description: "Visualisasi graph interaktif hubungan dan keterkaitan materi catatan kurikulum AI di Velqora.",
};

export default async function GraphPage() {
  const graphData = await getGraphData("global");
  return <CatatanGraphClient initialData={graphData} />;
}
