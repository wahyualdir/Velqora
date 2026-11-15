/// <reference lib="webworker" />

import type {
  DataFramePayload,
  RichCellOutput,
  VariableSummary,
} from "../types";

// Persistent per-worker cell scope (isolated from DOM & main thread)
const cellScope: Record<string, unknown> = Object.create(null);
const vfsCache: Map<string, Uint8Array> = new Map();

function stripTypeScriptSyntax(code: string): string {
  return code
    .replace(/^\s*import\s+type\s+[\s\S]*?;?\s*$/gm, "")
    .replace(/\bexport\s+(?=const|let|var|function|class|async)/g, "")
    .replace(/\binterface\s+[A-Za-z0-9_]+(?:\s+extends\s+[^{]+)?\s*\{[\s\S]*?\}/g, "")
    .replace(/\btype\s+[A-Za-z0-9_]+\s*=[\s\S]*?;/g, "")
    .replace(
      /:\s*(string|number|boolean|any|void|unknown|never|object|Record<[^>\n]+>|Array<[^>\n]+>|Promise<[^>\n]+>|string\[\]|number\[\]|boolean\[\])(?=\s*[=),;\n])/g,
      ""
    )
    .replace(/\s+as\s+(?:const|[A-Za-z0-9_<>\[\]| ]+)/g, "");
}

function normalizeToDataFrame(
  data: unknown,
  variableName = "table"
): DataFramePayload | null {
  if (!Array.isArray(data) || data.length === 0) return null;
  if (typeof data[0] !== "object" || data[0] === null) return null;

  const colSet = new Set<string>();
  data.slice(0, 50).forEach((item) => {
    if (item && typeof item === "object") {
      Object.keys(item).forEach((k) => colSet.add(k));
    }
  });
  const colNames = Array.from(colSet);
  const rows = (data as Record<string, unknown>[]).slice(0, 500);

  return {
    variableName,
    columns: colNames.map((name) => {
      const vals = rows.map((r) => r[name]);
      const nonNull = vals.filter((v) => v !== null && v !== undefined);
      const isNum = nonNull.length > 0 && nonNull.every((v) => typeof v === "number");
      return {
        name,
        dtype: isNum ? "number" : typeof nonNull[0] === "boolean" ? "boolean" : "string",
        nullCount: vals.length - nonNull.length,
        uniqueCount: new Set(nonNull.map((v) => String(v))).size,
      };
    }),
    rows,
    totalRows: data.length,
    totalColumns: colNames.length,
    truncated: data.length > 500,
  };
}

function formatValuePreview(val: unknown): string {
  if (val === null) return "null";
  if (val === undefined) return "undefined";
  if (typeof val === "function") return `fn ${val.name || "(anonymous)"}()`;
  if (typeof val === "string") return val.length > 80 ? `${val.slice(0, 80)}…` : val;
  try {
    const s = JSON.stringify(val);
    return s.length > 90 ? `${s.slice(0, 90)}…` : s;
  } catch {
    return String(val);
  }
}

function collectVariables(): VariableSummary[] {
  return Object.entries(cellScope).map(([name, val]) => {
    const isArr = Array.isArray(val);
    return {
      name,
      kernel: "javascript",
      type: isArr ? `Array(${val.length})` : typeof val,
      shape: isArr ? `(${val.length},)` : undefined,
      preview: formatValuePreview(val),
      isTabular:
        isArr && val.length > 0 && typeof val[0] === "object" && val[0] !== null,
    };
  });
}

function rewriteTopLevelDecls(code: string): string {
  // Hoist top-level `const`/`let`/`var`/`function`/`class` bindings onto `globalScope`
  return code
    .replace(
      /^([ \t]*)(?:const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=/gm,
      "$1__scope.$2 ="
    )
    .replace(
      /^([ \t]*)(async\s+)?function\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/gm,
      "$1__scope.$3 = $2function $3("
    )
    .replace(
      /^([ \t]*)class\s+([A-Za-z_$][A-Za-z0-9_$]*)/gm,
      "$1__scope.$2 = class $2"
    );
}

self.onmessage = async (event: MessageEvent) => {
  const msg = event.data;
  if (!msg || typeof msg !== "object") return;

  if (msg.type === "init") {
    self.postMessage({ type: "ready", variables: collectVariables() });
    return;
  }

  if (msg.type === "sync_files" && Array.isArray(msg.files)) {
    vfsCache.clear();
    for (const f of msg.files) {
      vfsCache.set(f.path, new Uint8Array(f.bytes));
    }
    self.postMessage({ type: "files_synced" });
    return;
  }

  if (msg.type === "reset") {
    Object.keys(cellScope).forEach((k) => delete cellScope[k]);
    self.postMessage({ type: "ready", variables: [] });
    return;
  }

  if (msg.type === "execute") {
    const start = performance.now();
    const outputs: RichCellOutput[] = [];
    let streamBuffer = "";
    let lineCount = 0;
    const MAX_LINES = 800;

    const pushLog = (text: string) => {
      if (lineCount >= MAX_LINES) return;
      lineCount++;
      streamBuffer += (streamBuffer ? "\n" : "") + text;
    };

    const customConsole = {
      log: (...args: unknown[]) =>
        pushLog(
          args
            .map((a) =>
              typeof a === "object" && a !== null
                ? JSON.stringify(a, null, 2)
                : String(a)
            )
            .join(" ")
        ),
      info: (...args: unknown[]) => customConsole.log(...args),
      warn: (...args: unknown[]) =>
        outputs.push({
          kind: "stream",
          name: "stderr",
          text: args.map(String).join(" ") + "\n",
        }),
      error: (...args: unknown[]) =>
        outputs.push({
          kind: "stream",
          name: "stderr",
          text: args.map(String).join(" ") + "\n",
        }),
      table: (data: unknown) => {
        const df = normalizeToDataFrame(data, "console.table");
        if (df) {
          outputs.push({ kind: "dataframe", data: df });
        } else {
          customConsole.log(data);
        }
      },
    };

    const display = {
      html: (html: string) => outputs.push({ kind: "html", html: String(html) }),
      markdown: (markdown: string) =>
        outputs.push({ kind: "markdown", markdown: String(markdown) }),
      svg: (svg: string) =>
        outputs.push({
          kind: "image",
          mimeType: "image/svg+xml",
          data: String(svg),
        }),
      table: (data: unknown, name = "data") => {
        const df = normalizeToDataFrame(data, name);
        if (df) outputs.push({ kind: "dataframe", data: df });
      },
      json: (obj: unknown) => customConsole.log(obj),
    };

    const workspace = {
      list: () => Array.from(vfsCache.keys()),
      readText: (path: string) => {
        const key = path.startsWith("/workspace/")
          ? path
          : `/workspace/${path.replace(/^\/+/, "")}`;
        const bytes = vfsCache.get(key);
        return bytes ? new TextDecoder().decode(bytes) : null;
      },
      readJson: (path: string) => {
        const txt = workspace.readText(path);
        return txt ? JSON.parse(txt) : null;
      },
    };

    try {
      const isTs = msg.kernel === "typescript";
      const rawCode = isTs ? stripTypeScriptSyntax(String(msg.code || "")) : String(msg.code || "");
      const rewritten = rewriteTopLevelDecls(rawCode);

      // Expose persistent scope vars via `with (__scope)` wrapper safely
      const scopeKeys = Object.keys(cellScope);
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
      const fnBody = `
        const { ${scopeKeys.join(", ")} } = __scope;
        ${rewritten}
      `;
      const runner = new AsyncFunction(
        "console",
        "display",
        "workspace",
        "__scope",
        fnBody
      );

      const ret = await runner(customConsole, display, workspace, cellScope);

      if (streamBuffer) {
        outputs.unshift({
          kind: "stream",
          name: "stdout",
          text: streamBuffer,
        });
      }

      if (ret !== undefined) {
        const maybeDf = normalizeToDataFrame(ret);
        if (maybeDf) {
          outputs.push({ kind: "dataframe", data: maybeDf });
        } else {
          outputs.push({
            kind: "text",
            text:
              typeof ret === "object"
                ? JSON.stringify(ret, null, 2)
                : String(ret),
          });
        }
      }

      if (outputs.length === 0) {
        outputs.push({
          kind: "stream",
          name: "stdout",
          text: "(Kode berhasil dieksekusi tanpa output)",
        });
      }

      const end = performance.now();
      self.postMessage({
        type: "result",
        cellId: msg.cellId,
        requestId: msg.requestId,
        success: true,
        outputs,
        executionMs: Math.round(end - start),
        variables: collectVariables(),
      });
    } catch (err: any) {
      if (streamBuffer) {
        outputs.unshift({
          kind: "stream",
          name: "stdout",
          text: streamBuffer,
        });
      }
      const stack = String(err?.stack || err?.message || err)
        .split("\n")
        .slice(0, 8);
      outputs.push({
        kind: "error",
        ename: err?.name || "RuntimeError",
        evalue: err?.message || String(err),
        traceback: stack,
      });
      const end = performance.now();
      self.postMessage({
        type: "result",
        cellId: msg.cellId,
        requestId: msg.requestId,
        success: false,
        outputs,
        executionMs: Math.round(end - start),
        variables: collectVariables(),
      });
    }
  }
};
