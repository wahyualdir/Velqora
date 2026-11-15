import React, { Suspense } from "react";
import { CodeCatalogView } from "@/components/kode/code-catalog-view";
import { PageContainer } from "@/components/ui/section";

export default function KatalogKodePage() {
  return (
    <Suspense
      fallback={
        <PageContainer className="py-8 space-y-4">
          <div className="h-24 rounded-2xl border border-border bg-surface animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="h-20 rounded-xl border border-border bg-surface animate-pulse" />
            <div className="h-20 rounded-xl border border-border bg-surface animate-pulse" />
            <div className="h-20 rounded-xl border border-border bg-surface animate-pulse" />
            <div className="h-20 rounded-xl border border-border bg-surface animate-pulse" />
          </div>
          <div className="h-64 rounded-2xl border border-border bg-surface animate-pulse" />
        </PageContainer>
      }
    >
      <CodeCatalogView />
    </Suspense>
  );
}
