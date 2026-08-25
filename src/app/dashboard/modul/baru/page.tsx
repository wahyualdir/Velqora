"use client";

import { useSearchParams } from "next/navigation";
import { UnifiedContentForm } from "@/components/modul/unified-content-form";
import { Suspense } from "react";

function TambahModulDanProjectContent() {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const initialKind: "module" | "project" =
    modeParam === "project" ? "project" : "module";

  return <UnifiedContentForm initialKind={initialKind} isEditing={false} />;
}

export default function TambahModulDanProjectPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-text-tertiary">Memuat form...</div>}>
      <TambahModulDanProjectContent />
    </Suspense>
  );
}
