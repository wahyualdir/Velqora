import React, { Suspense } from "react";
import { getNotebookByIdAction } from "@/actions/notebook/notebooks";
import { NotebookWorkbench } from "@/components/notebook/notebook-workbench";
import { PageContainer } from "@/components/ui/section";

export default async function PlaygroundNotebookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { notebook } = await getNotebookByIdAction(id);

  return (
    <PageContainer className="space-y-4">
      <Suspense
        fallback={
          <div className="p-8 rounded-2xl border border-border bg-surface text-xs font-mono text-text-secondary">
            Memuat Velqora Lab Notebook...
          </div>
        }
      >
        <NotebookWorkbench
          initialDocument={notebook ?? undefined}
          lookupId={id}
        />
      </Suspense>
    </PageContainer>
  );
}
