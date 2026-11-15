import type {
  NotebookCell,
  NotebookDocument,
  NotebookKernel,
  RichCellOutput,
} from "./types";

interface RawIpynbOutput {
  output_type: "stream" | "execute_result" | "display_data" | "error";
  name?: "stdout" | "stderr";
  text?: string | string[];
  data?: Record<string, string | string[]>;
  ename?: string;
  evalue?: string;
  traceback?: string[];
  metadata?: Record<string, unknown>;
  execution_count?: number | null;
}

interface RawIpynbCell {
  id?: string;
  cell_type: "code" | "markdown" | "raw";
  source: string | string[];
  metadata?: Record<string, unknown>;
  outputs?: RawIpynbOutput[];
  execution_count?: number | null;
}

interface RawIpynbDocument {
  nbformat: number;
  nbformat_minor: number;
  metadata?: Record<string, unknown>;
  cells: RawIpynbCell[];
}

function joinSource(src: string | string[] | undefined): string {
  if (!src) return "";
  return Array.isArray(src) ? src.join("") : String(src);
}

function splitSourceLines(src: string): string[] {
  if (!src) return [];
  const lines = src.split("\n");
  return lines.map((line, i) => (i < lines.length - 1 ? `${line}\n` : line));
}

function createId(prefix = "cell"): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function detectCellKernelFromSource(
  source: string,
  defaultKernel: NotebookKernel,
  metadata?: Record<string, unknown>
): NotebookKernel {
  const metaKernel = metadata?.velqora_kernel;
  if (
    metaKernel === "python" ||
    metaKernel === "sql" ||
    metaKernel === "javascript" ||
    metaKernel === "typescript"
  ) {
    return metaKernel;
  }
  if (/^\s*%%sql\b/i.test(source)) return "sql";
  if (/^\s*%%(?:javascript|js)\b/i.test(source)) return "javascript";
  if (/^\s*%%(?:typescript|ts)\b/i.test(source)) return "typescript";
  return defaultKernel;
}

function mapIpynbOutputToRich(out: RawIpynbOutput): RichCellOutput[] {
  const results: RichCellOutput[] = [];
  if (out.output_type === "stream") {
    results.push({
      kind: "stream",
      name: out.name === "stderr" ? "stderr" : "stdout",
      text: joinSource(out.text),
    });
    return results;
  }

  if (out.output_type === "error") {
    results.push({
      kind: "error",
      ename: out.ename || "Error",
      evalue: out.evalue || "Execution error",
      traceback: Array.isArray(out.traceback)
        ? out.traceback.map((l) => l.replace(/\u001b\[[0-9;]*m/g, ""))
        : [],
    });
    return results;
  }

  const data = out.data || {};
  const dfJson = data["application/vnd.velqora.dataframe+json"];
  if (dfJson) {
    try {
      const parsed = JSON.parse(joinSource(dfJson));
      results.push({ kind: "dataframe", data: parsed });
      return results;
    } catch {
      // Fallback below
    }
  }

  if (data["image/png"]) {
    results.push({
      kind: "image",
      mimeType: "image/png",
      data: joinSource(data["image/png"]).trim(),
    });
    return results;
  }

  if (data["image/svg+xml"]) {
    results.push({
      kind: "image",
      mimeType: "image/svg+xml",
      data: joinSource(data["image/svg+xml"]),
    });
    return results;
  }

  if (data["image/jpeg"]) {
    results.push({
      kind: "image",
      mimeType: "image/jpeg",
      data: joinSource(data["image/jpeg"]).trim(),
    });
    return results;
  }

  if (data["application/vnd.plotly.v1+json"]) {
    try {
      const spec = JSON.parse(joinSource(data["application/vnd.plotly.v1+json"]));
      results.push({ kind: "plotly", spec });
      return results;
    } catch {
      // Fallback below
    }
  }

  if (data["text/html"]) {
    results.push({
      kind: "html",
      html: joinSource(data["text/html"]),
    });
    return results;
  }

  if (data["text/markdown"]) {
    results.push({
      kind: "markdown",
      markdown: joinSource(data["text/markdown"]),
    });
    return results;
  }

  if (data["text/plain"]) {
    results.push({
      kind: "text",
      text: joinSource(data["text/plain"]),
    });
  }

  return results;
}

/**
 * Mengimpor JSON file `.ipynb` (Jupyter / Google Colab nbformat v4) menjadi `NotebookDocument`.
 */
export function parseIpynb(
  rawJson: string,
  fallbackTitle = "Notebook Impor (.ipynb)"
): NotebookDocument {
  const parsed = JSON.parse(rawJson) as Partial<RawIpynbDocument>;
  if (!parsed || !Array.isArray(parsed.cells)) {
    throw new Error("Format .ipynb tidak valid: array 'cells' tidak ditemukan.");
  }

  const meta = parsed.metadata || {};
  const kernelspecName = String(
    (meta.kernelspec as Record<string, unknown> | undefined)?.name || "python3"
  ).toLowerCase();
  const defaultKernel: NotebookKernel = kernelspecName.includes("sql")
    ? "sql"
    : kernelspecName.includes("typescript")
    ? "typescript"
    : kernelspecName.includes("javascript") || kernelspecName.includes("node")
    ? "javascript"
    : "python";

  const now = Date.now();
  const colabName =
    typeof (meta.colab as Record<string, unknown> | undefined)?.name === "string"
      ? String((meta.colab as Record<string, unknown>).name).replace(/\.ipynb$/i, "")
      : undefined;

  const cells: NotebookCell[] = parsed.cells.map((rawCell, index) => {
    const rawSource = joinSource(rawCell.source);
    const cellType = rawCell.cell_type === "markdown" ? "markdown" : "code";
    const kernel = detectCellKernelFromSource(
      rawSource,
      defaultKernel,
      rawCell.metadata
    );
    const cleanedSource = rawSource
      .replace(/^\s*%%(?:sql|javascript|js|typescript|ts|python)\s*\r?\n/i, "");

    const richOutputs: RichCellOutput[] = [];
    if (Array.isArray(rawCell.outputs)) {
      for (const o of rawCell.outputs) {
        richOutputs.push(...mapIpynbOutputToRich(o));
      }
    }

    const cellView = rawCell.metadata?.cellView;
    const formMode =
      cellView === "form"
        ? "form"
        : rawSource.includes("#@param")
        ? "both"
        : undefined;

    return {
      id: rawCell.id || createId(`c${index + 1}`),
      type: cellType,
      kernel,
      source: cleanedSource,
      outputs: richOutputs,
      executionCount:
        typeof rawCell.execution_count === "number"
          ? rawCell.execution_count
          : null,
      executionOrder:
        typeof rawCell.execution_count === "number"
          ? rawCell.execution_count
          : null,
      timingMs: null,
      lastModifiedAt: now,
      lastExecutedAt: null,
      collapsed: false,
      formMode,
    };
  });

  const nowIso = new Date().toISOString();
  return {
    id: createId("nb"),
    title: colabName || fallbackTitle,
    defaultKernel,
    runtimeMode: "wasm",
    reactiveMode: false,
    editorMode: "codemirror",
    cells:
      cells.length > 0
        ? cells
        : [
            {
              id: createId("c1"),
              type: "code",
              kernel: defaultKernel,
              source: "",
              outputs: [],
              executionCount: null,
              executionOrder: null,
              timingMs: null,
              lastModifiedAt: now,
              lastExecutedAt: null,
            },
          ],
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

function escapeHtml(str: unknown): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function mapRichOutputToIpynb(
  out: RichCellOutput,
  executionCount: number | null
): RawIpynbOutput | null {
  switch (out.kind) {
    case "stream":
      return {
        output_type: "stream",
        name: out.name,
        text: splitSourceLines(out.text),
      };
    case "error":
      return {
        output_type: "error",
        ename: out.ename,
        evalue: out.evalue,
        traceback: out.traceback,
      };
    case "image":
      return {
        output_type: "display_data",
        data: {
          [out.mimeType]: out.data,
        },
        metadata: {},
      };
    case "html":
      return {
        output_type: "display_data",
        data: {
          "text/html": splitSourceLines(out.html),
        },
        metadata: {},
      };
    case "markdown":
      return {
        output_type: "display_data",
        data: {
          "text/markdown": splitSourceLines(out.markdown),
        },
        metadata: {},
      };
    case "dataframe": {
      const cols = out.data.columns.map((c) => c.name);
      const htmlHead = cols.map((c) => `<th>${escapeHtml(c)}</th>`).join("");
      const htmlRows = out.data.rows
        .slice(0, 50)
        .map(
          (row) =>
            `<tr>${cols
              .map((c) => `<td>${escapeHtml(row[c])}</td>`)
              .join("")}</tr>`
        )
        .join("");
      const htmlTable = `<table border="1" class="dataframe"><thead><tr>${htmlHead}</tr></thead><tbody>${htmlRows}</tbody></table>`;
      return {
        output_type: "execute_result",
        execution_count: executionCount ?? 1,
        data: {
          "application/vnd.velqora.dataframe+json": JSON.stringify(out.data),
          "text/html": splitSourceLines(htmlTable),
          "text/plain": splitSourceLines(
            `DataFrame (${out.data.totalRows} rows x ${out.data.totalColumns} cols)`
          ),
        },
        metadata: {},
      };
    }
    case "sql_result": {
      const htmlHead = out.data.columns
        .map((c) => `<th>${escapeHtml(c)}</th>`)
        .join("");
      const htmlRows = out.data.rows
        .slice(0, 50)
        .map(
          (row) =>
            `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`
        )
        .join("");
      const htmlTable = `<table border="1" class="dataframe"><thead><tr>${htmlHead}</tr></thead><tbody>${htmlRows}</tbody></table>`;
      return {
        output_type: "execute_result",
        execution_count: executionCount ?? 1,
        data: {
          "text/html": splitSourceLines(htmlTable),
          "text/plain": splitSourceLines(
            `SQL Result: ${out.data.rowCount} rows (${out.data.executionMs.toFixed(1)} ms)`
          ),
        },
        metadata: {},
      };
    }
    case "plotly":
      return {
        output_type: "display_data",
        data: {
          "application/vnd.plotly.v1+json": JSON.stringify(out.spec),
        },
        metadata: {},
      };
    case "text":
      return {
        output_type: "execute_result",
        execution_count: executionCount ?? 1,
        data: {
          "text/plain": splitSourceLines(out.text),
        },
        metadata: {},
      };
    case "test_result":
      return {
        output_type: "stream",
        name: "stdout",
        text: splitSourceLines(
          `[Autograder] ${out.passed}/${out.total} test cases passed.\n`
        ),
      };
    default:
      return null;
  }
}

/**
 * Mengekspor `NotebookDocument` ke format JSON standar Jupyter/Google Colab (nbformat 4.5).
 */
export function serializeToIpynb(doc: NotebookDocument): string {
  const nbCells: RawIpynbCell[] = doc.cells.map((cell) => {
    if (cell.type === "markdown") {
      return {
        id: cell.id,
        cell_type: "markdown",
        metadata: {},
        source: splitSourceLines(cell.source),
      };
    }

    const sourceWithMagic =
      cell.kernel !== doc.defaultKernel && cell.kernel !== "python"
        ? `%%${cell.kernel}\n${cell.source}`
        : cell.source;

    const ipynbOutputs: RawIpynbOutput[] = cell.outputs
      .map((out) => mapRichOutputToIpynb(out, cell.executionCount))
      .filter((o): o is RawIpynbOutput => o !== null);

    return {
      id: cell.id,
      cell_type: "code",
      execution_count: cell.executionCount,
      metadata: {
        velqora_kernel: cell.kernel,
        ...(cell.formMode === "form" ? { cellView: "form" } : {}),
      },
      source: splitSourceLines(sourceWithMagic),
      outputs: ipynbOutputs,
    };
  });

  const payload: RawIpynbDocument = {
    nbformat: 4,
    nbformat_minor: 5,
    metadata: {
      colab: {
        name: `${doc.title || "velqora-notebook"}.ipynb`,
        provenance: [],
      },
      kernelspec: {
        display_name:
          doc.defaultKernel === "sql"
            ? "SQLite WASM"
            : doc.defaultKernel === "javascript"
            ? "JavaScript (Worker)"
            : doc.defaultKernel === "typescript"
            ? "TypeScript (Worker)"
            : "Python 3",
        name:
          doc.defaultKernel === "python"
            ? "python3"
            : doc.defaultKernel,
      },
      language_info: {
        name: doc.defaultKernel === "sql" ? "sql" : doc.defaultKernel,
      },
    },
    cells: nbCells,
  };

  return JSON.stringify(payload, null, 2);
}

/**
 * Mengekspor seluruh notebook menjadi satu dokumen Markdown rapi untuk Velqora Catatan Vault.
 */
export function serializeNotebookToMarkdown(doc: NotebookDocument): string {
  const parts: string[] = [`# ${doc.title}\n`];
  if (doc.description) {
    parts.push(`${doc.description}\n`);
  }

  doc.cells.forEach((cell, idx) => {
    if (cell.type === "markdown") {
      parts.push(cell.source.trim());
    } else {
      const lang = cell.kernel === "sql" ? "sql" : cell.kernel;
      parts.push(`### Sel [${idx + 1}] (${cell.kernel.toUpperCase()})`);
      parts.push(`\`\`\`${lang}\n${cell.source.trim()}\n\`\`\``);
      const textOuts = cell.outputs
        .map((o) => {
          if (o.kind === "stream") return o.text;
          if (o.kind === "text") return o.text;
          if (o.kind === "error") return `${o.ename}: ${o.evalue}`;
          if (o.kind === "dataframe") {
            return `DataFrame (${o.data.totalRows} baris x ${o.data.totalColumns} kolom)`;
          }
          if (o.kind === "sql_result") {
            return `SQL Result (${o.data.rowCount} baris)`;
          }
          return null;
        })
        .filter(Boolean);
      if (textOuts.length > 0) {
        parts.push(`> **Output:**\n> \`\`\`\n> ${textOuts.join("\n").replace(/\n/g, "\n> ")}\n> \`\`\``);
      }
    }
    parts.push("");
  });

  return parts.join("\n");
}
