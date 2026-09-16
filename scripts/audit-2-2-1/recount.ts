import { ALL_ACADEMIC_CURRICULA } from "../../src/lib/curriculum/registry";
import * as fs from "fs";
import * as path from "path";

interface TopicRecount {
  id: string;
  name: string;
  chaptersCount: number;
  subchaptersCount: number;
  subSubchaptersCount: number;
  codeBlocksCount: number;
  exercisesCount: number;
  projectsCount: number;
  datasetsCount: number;
  referencesCount: number;
  linksCount: number;
  formulasCount: number;
  nonEmptyUnitsCount: number;
  emptyUnitsCount: number;
}

async function runRecount() {
  console.log("=== STARTING ACTUAL STRUCTURAL RECOUNT ===");
  const curricula = ALL_ACADEMIC_CURRICULA;
  console.log(`Loaded ${curricula.length} curricula from registry.`);

  const topicResults: TopicRecount[] = [];

  let grandTotalChapters = 0;
  let grandTotalSubchapters = 0;
  let grandTotalSubSubchapters = 0;
  let grandTotalCodeBlocks = 0;
  let grandTotalExercises = 0;
  let grandTotalProjects = 0;
  let grandTotalDatasets = 0;
  let grandTotalReferences = 0;
  let grandTotalLinks = 0;
  let grandTotalFormulas = 0;
  let grandTotalNonEmptyUnits = 0;
  let grandTotalEmptyUnits = 0;

  for (const topic of curricula) {
    let tChapters = topic.chapters?.length || 0;
    let tSubchapters = 0;
    let tSubSubchapters = 0;
    let tCodeBlocks = 0;
    let tExercises = 0;
    let tProjects = 0;
    let tDatasets = 0;
    let tReferences = 0;
    let tLinks = 0;
    let tFormulas = 0;
    let tNonEmptyUnits = 0;
    let tEmptyUnits = 0;

    // Collect topic-level references and datasets
    if (topic.primaryReferences) {
      tReferences += topic.primaryReferences.length;
      tLinks += topic.primaryReferences.filter((r) => r.url && r.url.trim() !== "").length;
    }
    if (topic.datasets) {
      tDatasets += topic.datasets.length;
    }
    if (topic.capstoneProject) {
      tProjects++;
    }

    // Examine each chapter
    for (const ch of topic.chapters || []) {
      if (ch.exercises) {
        tExercises += ch.exercises.length;
      }
      if (ch.miniProject) {
        tProjects++;
      }
      if (ch.dataset) {
        tDatasets++;
      }
      if ((ch as any).references) {
        tReferences += (ch as any).references.length;
        tLinks += (ch as any).references.filter((r: any) => r.url && r.url.trim() !== "").length;
      }

      if (ch.subchapters) {
        tSubchapters += ch.subchapters.length;

        for (const sub of ch.subchapters) {
          // Check code in subchapter
          if (sub.codeExamples) {
            tCodeBlocks += sub.codeExamples.filter((c) => c.code && c.code.trim().length > 0).length;
          }
          if (sub.exercises) {
            tExercises += sub.exercises.length;
          }
          if (sub.dataset) {
            tDatasets++;
          }
          if (sub.references) {
            tReferences += sub.references.length;
            tLinks += sub.references.filter((r) => r.url && r.url.trim() !== "").length;
          }

          // Formulas in subchapter content
          const subContent = sub.content_markdown || "";
          const subMath = subContent.match(/\$\$[\s\S]*?\$\$|\$[^\$]+?\$/g);
          if (subMath) {
            tFormulas += subMath.length;
          }

          // Check sub-subchapters / units
          const units = sub.subSubchapters || [];
          tSubSubchapters += units.length;

          for (const u of units) {
            const content = (u.content_markdown || "").trim();
            if (content.length > 0) {
              tNonEmptyUnits++;
            } else {
              tEmptyUnits++;
            }

            // Check formulas in unit content
            const mathMatches = content.match(/\$\$[\s\S]*?\$\$|\$[^\$]+?\$/g);
            if (mathMatches) {
              tFormulas += mathMatches.length;
            }

            // Check code examples in units
            if (u.codeExamples) {
              tCodeBlocks += u.codeExamples.filter((c) => c.code && c.code.trim().length > 0).length;
            }

            // Check references embedded in units
            if (u.references && u.references.length > 0) {
              tReferences += u.references.length;
              tLinks += u.references.filter((r) => r.url && r.url.trim() !== "").length;
            }
          }
        }
      }
    }

    grandTotalChapters += tChapters;
    grandTotalSubchapters += tSubchapters;
    grandTotalSubSubchapters += tSubSubchapters;
    grandTotalCodeBlocks += tCodeBlocks;
    grandTotalExercises += tExercises;
    grandTotalProjects += tProjects;
    grandTotalDatasets += tDatasets;
    grandTotalReferences += tReferences;
    grandTotalLinks += tLinks;
    grandTotalFormulas += tFormulas;
    grandTotalNonEmptyUnits += tNonEmptyUnits;
    grandTotalEmptyUnits += tEmptyUnits;

    topicResults.push({
      id: topic.id,
      name: topic.name,
      chaptersCount: tChapters,
      subchaptersCount: tSubchapters,
      subSubchaptersCount: tSubSubchapters,
      codeBlocksCount: tCodeBlocks,
      exercisesCount: tExercises,
      projectsCount: tProjects,
      datasetsCount: tDatasets,
      referencesCount: tReferences,
      linksCount: tLinks,
      formulasCount: tFormulas,
      nonEmptyUnitsCount: tNonEmptyUnits,
      emptyUnitsCount: tEmptyUnits,
    });
  }

  const recountData = {
    summary: {
      topicsCount: curricula.length,
      chaptersCount: grandTotalChapters,
      subchaptersCount: grandTotalSubchapters,
      subSubchaptersCount: grandTotalSubSubchapters,
      codeBlocksCount: grandTotalCodeBlocks,
      exercisesCount: grandTotalExercises,
      projectsCount: grandTotalProjects,
      datasetsCount: grandTotalDatasets,
      referencesCount: grandTotalReferences,
      linksCount: grandTotalLinks,
      formulasCount: grandTotalFormulas,
      nonEmptyUnitsCount: grandTotalNonEmptyUnits,
      emptyUnitsCount: grandTotalEmptyUnits,
    },
    topics: topicResults,
  };

  const outputPath = path.resolve("scripts/audit-2-2-1/recount-output.json");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(recountData, null, 2), "utf-8");

  console.log("Recount completed. Summary:");
  console.log(JSON.stringify(recountData.summary, null, 2));
}

runRecount().catch((err) => {
  console.error("Recount error:", err);
  process.exit(1);
});
