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
  createBlankNotebook,
  createStarterNotebook,
} from "../curriculum-converter";
import { transformJsTsCellCode } from "../jsts-preprocessor";
import { preprocessPythonCellSource } from "../python-preprocessor";
import {
  buildDatasetSnippets,
  getSafeSqlTableName,
  normalizeDatasetUrl,
  NOTEBOOK_SNIPPETS,
  SAMPLE_DATASETS,
} from "../sample-datasets";
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

test("Sample datasets, snippets, URL normalizer, and safe SQL table helpers work cleanly", () => {
  assert.equal(SAMPLE_DATASETS.length >= 4, true);
  for (const ds of SAMPLE_DATASETS) {
    const lines = ds.csvContent.trim().split(/\r?\n/);
    assert.equal(lines.length, ds.rows + 1, `${ds.filename} row count mismatch`);
    assert.equal(
      lines[0].split(",").length,
      ds.columns,
      `${ds.filename} column count mismatch`
    );
  }
  assert.equal(NOTEBOOK_SNIPPETS.length >= 5, true);

  assert.equal(getSafeSqlTableName("2026-penjualan data.csv"), "t_2026_penjualan_data");
  assert.equal(getSafeSqlTableName("iris_dataset.csv"), "iris_dataset");

  const gh = normalizeDatasetUrl(
    "https://github.com/mwaskom/seaborn-data/blob/master/iris.csv"
  );
  assert.equal(
    gh.fetchUrl,
    "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv"
  );
  assert.equal(gh.suggestedFileName, "iris.csv");

  const gsheet = normalizeDatasetUrl(
    "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/edit#gid=12345"
  );
  assert.equal(
    gsheet.fetchUrl,
    "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/export?format=csv&gid=12345"
  );
  assert.equal(gsheet.suggestedFileName, "gsheet_1BxiMVs0.csv");

  const snippets = buildDatasetSnippets({
    path: "/workspace/sample_data/nilai_akademik_mahasiswa.csv",
    name: "nilai_akademik_mahasiswa.csv",
    size: 1024,
    mimeType: "text/csv",
    updatedAt: new Date().toISOString(),
    origin: "dataset",
  });
  assert.ok(snippets.pandasRead.includes("pd.read_csv"));
  assert.ok(snippets.pandasPlot.includes("plt.show()"));
  assert.ok(snippets.pandasStats.includes("df.isna().sum()"));
  assert.ok(snippets.sqlQuery.includes("SELECT * FROM nilai_akademik_mahasiswa"));
});

test("Dashboard layout uses overflow-x-clip and full-height playground shell", () => {
  const layoutSrc = fs.readFileSync(
    path.join(process.cwd(), "src/app/dashboard/layout.tsx"),
    "utf8"
  );
  assert.ok(layoutSrc.includes("overflow-x-clip"));
  assert.ok(layoutSrc.includes('pathname.startsWith("/dashboard/playground")'));
});

test("createBlankNotebook produces clean coding-first cell without stacked banners or sliders", () => {
  const blank = createBlankNotebook("python");
  assert.equal(blank.cells.length, 1);
  assert.equal(blank.cells[0].type, "code");
  assert.equal(blank.cells[0].kernel, "python");
  assert.equal(blank.cells[0].source, "");
  assert.equal(blank.cells[0].source.includes("#@param"), false);
});

test("Colab Python preprocessor handles !pip, %matplotlib inline, %%time, %%writefile, and 1:1 line preservation", () => {
  const src = [
    "%matplotlib inline",
    "!pip install -q seaborn plotly>=5.0",
    "import numpy as np, pandas as pd",
    "from sklearn.metrics import accuracy_score",
    'doc = """',
    "import fake_not_installed",
    '!pip install should_be_ignored',
    '"""',
    "# import commented_pkg",
    "print(123)",
    "np.mean?",
  ].join("\n");

  const res = preprocessPythonCellSource(src);
  assert.deepEqual(res.pipInstalls, ["seaborn", "plotly>=5.0"]);
  assert.ok(res.imports.includes("numpy"));
  assert.ok(res.imports.includes("pandas"));
  assert.ok(res.imports.includes("sklearn"));
  assert.equal(res.imports.includes("fake_not_installed"), false);
  assert.equal(res.imports.includes("commented_pkg"), false);

  const outLines = res.pythonCode.split("\n");
  assert.equal(outLines.length, src.split("\n").length);
  assert.equal(outLines[outLines.length - 2], "print(123)");
  assert.equal(outLines[outLines.length - 1], "help(np.mean)");

  const timed = preprocessPythonCellSource("%%time\nx = sum(range(100))\nx");
  assert.equal(timed.timingMode, "cell");
  assert.equal(timed.pythonCode.split("\n").length, 3);

  const wf = preprocessPythonCellSource("%%writefile helper.py\ndef hi():\n    return 'ok'\n");
  assert.equal(wf.writeFile?.path, "/workspace/helper.py");
  assert.ok(wf.writeFile?.content.includes("def hi():"));
});

test("JS/TS notebook preprocessor runs const/let/functions/redeclarations across cells without ReferenceError", async () => {
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as new (
    ...args: string[]
  ) => (...vals: unknown[]) => Promise<unknown>;
  const scope: Record<string, unknown> = Object.create(null);

  // Cell 1: const inside same cell + implicit return expression
  const c1 = transformJsTsCellCode(
    "const x = 10;\nconst y = x + 5;\ny;",
    false,
    Object.keys(scope)
  );
  const r1 = await new AsyncFunction("__scope", c1.body)(scope);
  assert.equal(r1, 15);
  assert.equal(scope.x, 10);
  assert.equal(scope.y, 15);

  // Cell 2: function with inner const + access prior cell x
  const c2 = transformJsTsCellCode(
    "function kali(a, b) {\n  const res = a * b;\n  return res;\n}\nkali(x, 2);",
    false,
    Object.keys(scope)
  );
  const r2 = await new AsyncFunction("__scope", c2.body)(scope);
  assert.equal(r2, 20);
  assert.equal(typeof scope.kali, "function");

  // Cell 3: redeclare const x in new cell + TypeScript annotations
  const c3 = transformJsTsCellCode(
    "interface Item { id: number; }\nconst x: number = 99;\nconst item: Item = { id: x };\nitem.id;",
    true,
    Object.keys(scope)
  );
  const r3 = await new AsyncFunction("__scope", c3.body)(scope);
  assert.equal(r3, 99);
  assert.equal(scope.x, 99);
});
