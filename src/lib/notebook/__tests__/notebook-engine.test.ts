import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  analyzeNotebookDag,
  extractCellSymbols,
  getTopologicalDownstreamCellIds,
} from "../dag-analyzer";
import {
  parseIpynb,
  serializeNotebookToMarkdown,
  serializeToIpynb,
} from "../ipynb-codec";
import {
  extractCellFormMeta,
  updateCellParamValue,
} from "../param-parser";
import {
  convertCodeEntryToNotebook,
  convertSectionToNotebook,
  createStarterNotebook,
} from "../curriculum-converter";
import type { NotebookCell } from "../types";

function makeCodeCell(
  id: string,
  source: string,
  opts: Partial<NotebookCell> = {}
): NotebookCell {
  return {
    id,
    type: "code",
    kernel: "python",
    source,
    outputs: [],
    executionCount: null,
    executionOrder: null,
    timingMs: null,
    lastModifiedAt: 1000,
    lastExecutedAt: null,
    ...opts,
  };
}

test("Colab @param parser extracts sliders, dropdowns, booleans and patches literals cleanly", () => {
  const src = [
    "#@title Konfigurasi Pelatihan",
    "#@markdown Atur parameter model.",
    'lr = 0.01 #@param {type:"slider", min:0.001, max:0.1, step:0.001}',
    'optimizer = "adam" #@param ["sgd", "adam", "adamw"]',
    "use_gpu = True #@param {type:\"boolean\"}",
    'label = "Eksperimen 1" #@param {type:"string"}',
  ].join("\n");

  const meta = extractCellFormMeta(src);
  assert.equal(meta.title, "Konfigurasi Pelatihan");
  assert.equal(meta.description, "Atur parameter model.");
  assert.equal(meta.params.length, 4);
  assert.equal(meta.params[0].type, "slider");
  assert.equal(meta.params[0].value, 0.01);
  assert.equal(meta.params[1].type, "dropdown");
  assert.deepEqual(meta.params[1].options, ["sgd", "adam", "adamw"]);
  assert.equal(meta.params[2].type, "boolean");
  assert.equal(meta.params[2].value, true);

  const patchedBool = updateCellParamValue(src, meta.params[2], false, "python");
  assert.ok(patchedBool.includes("use_gpu = False #@param"));

  const patchedSlider = updateCellParamValue(
    patchedBool,
    meta.params[0],
    0.05,
    "python"
  );
  assert.ok(patchedSlider.includes("lr = 0.05 #@param"));
});

test("DAG analyzer detects upstream/downstream edges, stale cells, and topological reactive order", () => {
  const cells: NotebookCell[] = [
    makeCodeCell("c1", "import math\nx = 10", {
      executionCount: 1,
      executionOrder: 1,
      lastModifiedAt: 1000,
      lastExecutedAt: 3000, // Modified at 1000, re-executed AFTER downstream c2 (executed at 2000)
    }),
    makeCodeCell("c2", "y = x * 2\nprint(y)", {
      executionCount: 1,
      executionOrder: 0,
      lastModifiedAt: 1000,
      lastExecutedAt: 2000,
    }),
    makeCodeCell("c3", "z = y + 5", {
      executionCount: 2,
      executionOrder: 2,
      lastModifiedAt: 1000,
      lastExecutedAt: 2500,
    }),
  ];

  const symbolsC1 = extractCellSymbols(cells[0]);
  assert.ok(symbolsC1.defines.includes("x"));

  const nodes = analyzeNotebookDag(cells);
  assert.equal(nodes[0].status, "fresh");
  assert.deepEqual(nodes[0].downstreamCellIds, ["c2"]);
  assert.equal(nodes[1].status, "stale");
  assert.equal(nodes[2].status, "stale");

  const reactiveOrder = getTopologicalDownstreamCellIds(cells, "c1");
  assert.deepEqual(reactiveOrder, ["c2", "c3"]);
});

test("Jupyter .ipynb bidirectional codec preserves multi-kernel cells and markdown export", () => {
  const starter = createStarterNotebook("python");
  starter.cells.push(
    makeCodeCell("sql1", "SELECT 1 AS ok;", { kernel: "sql" })
  );

  const rawIpynb = serializeToIpynb(starter);
  const parsed = parseIpynb(rawIpynb);

  assert.equal(parsed.cells.length, starter.cells.length);
  const sqlCell = parsed.cells[parsed.cells.length - 1];
  assert.equal(sqlCell.kernel, "sql");
  assert.equal(sqlCell.source.trim(), "SELECT 1 AS ok;");

  const md = serializeNotebookToMarkdown(starter);
  assert.ok(md.includes("# Velqora Lab Notebook"));
  assert.ok(md.includes("```sql"));
});

test("Curriculum converter builds runnable notebook cells from subchapters and code entries", () => {
  const nb = convertSectionToNotebook({
    topicId: "python-dasar",
    subchapter: {
      id: "sub-1",
      title: "Variabel dan Tipe Data",
      description: "Dasar Python.",
      content_markdown: "Penjelasan dasar variabel.",
      codeSnippets: [
        { id: "s1", language: "python", code: "x = 42\nprint(x)" },
      ],
    },
  });
  assert.ok(nb.cells.length >= 2);
  assert.equal(nb.cells.some((c) => c.type === "code" && c.kernel === "python"), true);

  const codeNb = convertCodeEntryToNotebook({
    id: "code-1",
    rawId: "code-1",
    topicId: "sql-dasar",
    topicName: "SQL Dasar",
    topicColor: "#10B981",
    topicGroup: "data",
    curriculumId: "sql-dasar",
    curriculumTitle: "SQL Dasar",
    chapterId: "ch-1",
    chapterNumber: 1,
    chapterTitle: "Query Dasar",
    subchapterId: "sub-1",
    subchapterSlug: "select",
    subchapterTitle: "SELECT Statement",
    title: "Select Dasar",
    language: "sql",
    filename: "query.sql",
    code: "SELECT 1;",
    expectedOutput: "1",
    explanation: "Mengembalikan angka 1.",
    level: "pemula",
    sourceType: "implementation",
    theoryHref: "/dashboard/modul",
    playgroundHref: "/dashboard/playground?codeId=code-1",
  });
  assert.equal(codeNb.defaultKernel, "sql");
  assert.equal(codeNb.cells[1].kernel, "sql");
});

test("Tablet compact rail, responsive DocReader outline drawer, and mobile shortcuts are present", () => {
  const root = process.cwd();
  const sidebarSrc = fs.readFileSync(
    path.join(root, "src/components/layout/sidebar/sidebar.tsx"),
    "utf8"
  );
  const docReaderSrc = fs.readFileSync(
    path.join(root, "src/components/modul/doc-reader-layout.tsx"),
    "utf8"
  );
  const mobileDashSrc = fs.readFileSync(
    path.join(root, "src/surfaces/app/dashboard/mobile-dashboard-view.tsx"),
    "utf8"
  );

  assert.ok(sidebarSrc.includes('aria-label="Sidebar Tablet Rail"'));
  assert.ok(docReaderSrc.includes("xl:hidden flex justify-end"));
  assert.ok(mobileDashSrc.includes("/dashboard/playground"));
  assert.ok(mobileDashSrc.includes("auto-rows-fr"));
});
