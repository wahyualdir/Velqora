import React, { Suspense } from "react";
import { SubNavTabs } from "@/components/layout/sub-nav-tabs";
import { NotebookWorkbench } from "@/components/notebook/notebook-workbench";
import { PageContainer } from "@/components/ui/section";
import { getAcademicCurriculum } from "@/lib/curriculum/registry";
import type { ExerciseItem } from "@/lib/curriculum/types";
import {
  convertExerciseToNotebook,
  convertSectionToNotebook,
} from "@/lib/notebook/curriculum-converter";
import type { NotebookDocument } from "@/lib/notebook/types";

interface PlaygroundSearchParams {
  topic?: string;
  sub?: string;
  exercise?: string;
}

function resolveInitialNotebookFromCurriculum(
  params: PlaygroundSearchParams
): NotebookDocument | undefined {
  if (!params.topic) return undefined;
  const curriculum = getAcademicCurriculum(params.topic);
  if (!curriculum) return undefined;

  for (const ch of curriculum.chapters) {
    for (const sub of ch.subchapters) {
      const matchesSub =
        params.sub &&
        (sub.id === params.sub || sub.slug === params.sub);

      if (matchesSub) {
        if (params.exercise) {
          const allExercises: ExerciseItem[] = [
            ...(sub.structuredExercises || []),
            ...((sub.exercises || []).filter(
              (item): item is ExerciseItem =>
                typeof item === "object" && item !== null && "id" in item
            )),
          ];
          const foundEx = allExercises.find((e) => e.id === params.exercise);
          if (foundEx) {
            return convertExerciseToNotebook({
              exercise: foundEx,
              topicId: curriculum.id,
              sectionTitle: sub.title,
            });
          }
        }

        return convertSectionToNotebook({
          topicId: curriculum.id,
          chapterId: ch.id,
          subchapter: sub,
        });
      }
    }
  }

  return undefined;
}

export default async function PlaygroundPage({
  searchParams,
}: {
  searchParams: Promise<PlaygroundSearchParams>;
}) {
  const resolvedParams = await searchParams;
  const initialDocument = resolveInitialNotebookFromCurriculum(resolvedParams);

  return (
    <PageContainer className="space-y-4">
      <SubNavTabs category="tools" />

      <Suspense
        fallback={
          <div className="p-8 rounded-2xl border border-border bg-surface text-xs font-mono text-text-secondary">
            Mempersiapkan Velqora Lab Notebook (Python 3.12, SQLite WASM, JS/TS)...
          </div>
        }
      >
        <NotebookWorkbench initialDocument={initialDocument} />
      </Suspense>
    </PageContainer>
  );
}
