import React, { Suspense } from "react";
import { getNotebookByIdAction } from "@/actions/notebook/notebooks";
import { NotebookWorkbench } from "@/components/notebook/notebook-workbench";

export default async function PlaygroundNotebookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { notebook } = await getNotebookByIdAction(id);

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-2.5">
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
    </div>
  );
}
