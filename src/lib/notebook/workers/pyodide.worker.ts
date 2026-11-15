/// <reference lib="webworker" />

import type { DataFramePayload, RichCellOutput, VariableSummary } from "../types";

const PYODIDE_VERSION = "v0.27.4";
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;

interface PyodideInstance {
  runPython: (code: string) => unknown;
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackagesFromImports: (code: string) => Promise<void>;
  loadPackage: (pkgs: string | string[]) => Promise<void>;
  pyimport: (name: string) => any;
  globals: any;
  FS: {
    mkdirTree: (path: string) => void;
    writeFile: (path: string, data: Uint8Array) => void;
    readFile: (path: string) => Uint8Array;
    readdir: (path: string) => string[];
    stat: (path: string) => { size: number; mode: number };
    isFile: (mode: number) => boolean;
  };
  setStdout: (opts: { batched: (msg: string) => void }) => void;
  setStderr: (opts: { batched: (msg: string) => void }) => void;
}

const VELQORA_PREAMBLE_PY = `
import os, sys, ast, io, json, base64, traceback, math

os.makedirs("/workspace", exist_ok=True)
if os.getcwd() != "/workspace":
    os.chdir("/workspace")

__velqora_outputs = []
__velqora_matplotlib_hooked = False

def __velqora_ensure_matplotlib_hook():
    global __velqora_matplotlib_hooked
    if "matplotlib" not in sys.modules:
        return
    try:
        import matplotlib
        matplotlib.use("AGG", force=True)
        import matplotlib.pyplot as plt
        if not __velqora_matplotlib_hooked:
            def _velqora_show(*args, **kwargs):
                for num in list(plt.get_fignums()):
                    fig = plt.figure(num)
                    buf = io.BytesIO()
                    fig.savefig(buf, format="png", dpi=144, bbox_inches="tight", facecolor="white")
                    buf.seek(0)
                    b64 = base64.b64encode(buf.read()).decode("ascii")
                    __velqora_outputs.append({
                        "kind": "image",
                        "mimeType": "image/png",
                        "data": b64,
                    })
                plt.close("all")
            plt.show = _velqora_show
            __velqora_matplotlib_hooked = True
    except Exception:
        pass

def _safe_json_scalar(val):
    if val is None:
        return None
    if isinstance(val, (bool, int)):
        return val
    if isinstance(val, float):
        if math.isnan(val) or math.isinf(val):
            return None
        return round(val, 6)
    return str(val)

def __velqora_serialize_dataframe(df, var_name="DataFrame"):
    total_rows, total_cols = int(df.shape[0]), int(df.shape[1])
    sample_df = df.head(500)
    col_summaries = []
    for col in df.columns:
        series = df[col]
        null_count = int(series.isna().sum())
        try:
            unique_count = int(series.nunique(dropna=True))
        except Exception:
            unique_count = 0
        summary = {
            "name": str(col),
            "dtype": str(series.dtype),
            "nullCount": null_count,
            "uniqueCount": unique_count,
        }
        try:
            if str(series.dtype).startswith(("int", "float", "Int", "Float")):
                clean_s = series.dropna()
                if len(clean_s) > 0:
                    summary["min"] = _safe_json_scalar(float(clean_s.min()))
                    summary["max"] = _safe_json_scalar(float(clean_s.max()))
                    summary["mean"] = _safe_json_scalar(float(clean_s.mean()))
                    summary["std"] = _safe_json_scalar(float(clean_s.std())) if len(clean_s) > 1 else 0.0
                    # 8-bin mini histogram
                    vals = [float(v) for v in clean_s.iloc[:2000].tolist() if math.isfinite(float(v))]
                    if vals:
                        vmin, vmax = min(vals), max(vals)
                        bins = [0] * 8
                        span = (vmax - vmin) or 1.0
                        for v in vals:
                            b = min(7, max(0, int(((v - vmin) / span) * 8)))
                            bins[b] += 1
                        summary["histogram"] = bins
        except Exception:
            pass
        col_summaries.append(summary)

    records = []
    col_names = [str(c) for c in sample_df.columns]
    for row_tuple in sample_df.itertuples(index=False, name=None):
        rec = {}
        for idx, cname in enumerate(col_names):
            rec[cname] = _safe_json_scalar(row_tuple[idx])
        records.append(rec)

    try:
        mem_bytes = int(df.memory_usage(deep=True).sum())
    except Exception:
        mem_bytes = 0

    return {
        "variableName": var_name,
        "columns": col_summaries,
        "rows": records,
        "totalRows": total_rows,
        "totalColumns": total_cols,
        "truncated": total_rows > 500,
        "memoryBytes": mem_bytes,
    }

def display(*objs):
    for obj in objs:
        __velqora_emit_object(obj)

def __velqora_emit_object(obj, var_name="result"):
    if obj is None:
        return
    cls_mod = getattr(type(obj), "__module__", "")
    cls_name = type(obj).__name__
    if "pandas" in cls_mod and cls_name == "DataFrame":
        __velqora_outputs.append({
            "kind": "dataframe",
            "data": __velqora_serialize_dataframe(obj, var_name),
        })
        return
    if "pandas" in cls_mod and cls_name == "Series":
        __velqora_outputs.append({
            "kind": "dataframe",
            "data": __velqora_serialize_dataframe(obj.to_frame(), var_name),
        })
        return
    if hasattr(obj, "to_plotly_json"):
        try:
            __velqora_outputs.append({
                "kind": "plotly",
                "spec": json.loads(json.dumps(obj.to_plotly_json(), default=str)),
            })
            return
        except Exception:
            pass
    if hasattr(obj, "_repr_svg_"):
        svg = obj._repr_svg_()
        if svg:
            __velqora_outputs.append({
                "kind": "image",
                "mimeType": "image/svg+xml",
                "data": svg,
            })
            return
    if hasattr(obj, "_repr_html_"):
        html = obj._repr_html_()
        if html:
            __velqora_outputs.append({"kind": "html", "html": html})
            return
    __velqora_outputs.append({"kind": "text", "text": repr(obj)})

def __velqora_exec_cell(code_str, globals_dict):
    global __velqora_outputs
    __velqora_outputs = []
    tree = ast.parse(code_str, mode="exec")
    __velqora_ensure_matplotlib_hook()

    last_expr = None
    if tree.body and isinstance(tree.body[-1], ast.Expr):
        last_expr = ast.Expression(body=tree.body.pop().value)

    if tree.body:
        exec(compile(tree, "<cell>", "exec"), globals_dict, globals_dict)

    __velqora_ensure_matplotlib_hook()

    if last_expr is not None:
        val = eval(compile(last_expr, "<cell>", "eval"), globals_dict, globals_dict)
        __velqora_emit_object(val)

    # Flush any unshown matplotlib figures created during execution
    if "matplotlib.pyplot" in sys.modules:
        import matplotlib.pyplot as plt
        if plt.get_fignums():
            plt.show()

    return json.dumps(__velqora_outputs, default=str)

def __velqora_run_assertions(assert_code, globals_dict):
    cases = []
    if not assert_code or not assert_code.strip():
        return json.dumps(cases)
    lines = [ln.strip() for ln in assert_code.splitlines() if ln.strip() and not ln.strip().startswith("#")]
    for idx, stmt in enumerate(lines):
        label = f"Test #{idx + 1}: {stmt[:60]}"
        try:
            exec(compile(stmt, "<autograder>", "exec"), globals_dict, globals_dict)
            cases.append({"name": label, "passed": True})
        except Exception as exc:
            cases.append({"name": label, "passed": False, "message": f"{type(exc).__name__}: {exc}"})
    return json.dumps(cases)

def __velqora_snapshot_vars(globals_dict):
    ignore = {"os", "sys", "ast", "io", "json", "base64", "traceback", "math", "display", "In", "Out", "get_ipython"}
    items = []
    exported_dfs = {}
    for k, v in list(globals_dict.items()):
        if k.startswith("_") or k in ignore:
            continue
        tname = type(v).__name__
        mod = getattr(type(v), "__module__", "")
        if tname == "module" or tname == "function":
            continue
        shape = None
        is_tabular = False
        cols = None
        if hasattr(v, "shape"):
            try:
                shape = str(tuple(int(d) for d in v.shape))
            except Exception:
                shape = None
        elif hasattr(v, "__len__"):
            try:
                shape = f"({len(v)},)"
            except Exception:
                shape = None

        if "pandas" in mod and tname == "DataFrame":
            is_tabular = True
            cols = [str(c) for c in v.columns]
            try:
                if int(v.shape[0]) <= 2000:
                    exported_dfs[k] = __velqora_serialize_dataframe(v, k)
            except Exception:
                pass

        try:
            size_bytes = sys.getsizeof(v)
        except Exception:
            size_bytes = 0

        try:
            rep = repr(v).replace("\\n", " ")
            preview = rep[:85] + ("…" if len(rep) > 85 else "")
        except Exception:
            preview = f"<{tname}>"

        items.append({
            "name": k,
            "kernel": "python",
            "type": tname,
            "shape": shape,
            "sizeBytes": int(size_bytes),
            "preview": preview,
            "isTabular": is_tabular,
            "columns": cols,
        })
    return json.dumps({"variables": items, "dataframes": exported_dfs}, default=str)
`;

const ALIAS_TO_PIP: Record<string, string> = {
  sklearn: "scikit-learn",
  cv2: "opencv-python",
  PIL: "pillow",
  bs4: "beautifulsoup4",
  yaml: "pyyaml",
  sns: "seaborn",
  plt: "matplotlib",
};

let pyodide: PyodideInstance | null = null;
let bootPromise: Promise<PyodideInstance> | null = null;
let micropipReady = false;
const installedPackages = new Set<string>();

function extractTopImports(code: string): string[] {
  const pkgs = new Set<string>();
  const matches = code.matchAll(
    /^\s*(?:import|from)\s+([A-Za-z_][A-Za-z0-9_]*)/gm
  );
  for (const m of matches) {
    pkgs.add(m[1]);
  }
  return Array.from(pkgs);
}

async function ensurePyodide(): Promise<PyodideInstance> {
  if (pyodide) return pyodide;
  if (bootPromise) return bootPromise;

  bootPromise = (async () => {
    self.postMessage({ type: "status", state: "loading", detail: "Memuat runtime Python 3.12 WebAssembly..." });
    const pyodideMod = await import(
      /* webpackIgnore: true */ `${PYODIDE_INDEX_URL}pyodide.mjs`
    );
    const instance = (await pyodideMod.loadPyodide({
      indexURL: PYODIDE_INDEX_URL,
    })) as PyodideInstance;

    await instance.runPythonAsync(VELQORA_PREAMBLE_PY);
    pyodide = instance;
    self.postMessage({ type: "status", state: "ready", detail: "Python 3.12 WASM siap" });
    return instance;
  })().catch((err) => {
    bootPromise = null;
    self.postMessage({
      type: "status",
      state: "error",
      detail: err?.message || String(err),
    });
    throw err;
  });

  return bootPromise;
}

async function installMissingPackages(instance: PyodideInstance, code: string) {
  const imports = extractTopImports(code);
  if (imports.length === 0) return;

  try {
    await instance.loadPackagesFromImports(code);
    imports.forEach((p) => installedPackages.add(p));
    return;
  } catch {
    // Some packages aren't built-in Pyodide wheels; fall back to micropip selectively
  }

  for (const rawPkg of imports) {
    const pipName = ALIAS_TO_PIP[rawPkg] || rawPkg;
    // Skip checking standard library heuristically by trying Python importlib check first
    const alreadyExists = await instance.runPythonAsync(`
import importlib.util
importlib.util.find_spec(${JSON.stringify(rawPkg)}) is not None
`);
    if (alreadyExists) continue;

    self.postMessage({
      type: "status",
      state: "installing_pkg",
      detail: `Menginstal paket ${pipName} via micropip...`,
    });

    if (!micropipReady) {
      await instance.loadPackage("micropip");
      micropipReady = true;
    }
    const micropip = instance.pyimport("micropip");
    await micropip.install(pipName);
    installedPackages.add(pipName);
  }
}

self.onmessage = async (event: MessageEvent) => {
  const msg = event.data;
  if (!msg || typeof msg !== "object") return;

  if (msg.type === "init") {
    try {
      await ensurePyodide();
      self.postMessage({ type: "ready" });
    } catch (err: any) {
      self.postMessage({
        type: "boot_error",
        error: err?.message || String(err),
      });
    }
    return;
  }

  if (msg.type === "sync_files" && Array.isArray(msg.files)) {
    try {
      const instance = await ensurePyodide();
      instance.FS.mkdirTree("/workspace");
      for (const f of msg.files) {
        const targetPath = String(f.path).startsWith("/workspace/")
          ? String(f.path)
          : `/workspace/${String(f.name)}`;
        instance.FS.writeFile(targetPath, new Uint8Array(f.bytes));
      }
      self.postMessage({ type: "files_synced" });
    } catch {
      // Ignore sync errors until first boot succeeds
    }
    return;
  }

  if (msg.type === "execute") {
    const start = performance.now();
    const outputs: RichCellOutput[] = [];
    const stdoutLines: string[] = [];
    const stderrLines: string[] = [];

    try {
      const instance = await ensurePyodide();

      // Sync latest uploaded workspace files if supplied inline
      if (Array.isArray(msg.files)) {
        instance.FS.mkdirTree("/workspace");
        for (const f of msg.files) {
          const targetPath = String(f.path).startsWith("/workspace/")
            ? String(f.path)
            : `/workspace/${String(f.name)}`;
          instance.FS.writeFile(targetPath, new Uint8Array(f.bytes));
        }
      }

      await installMissingPackages(instance, String(msg.code || ""));

      self.postMessage({
        type: "status",
        state: "executing",
        detail: "Menjalankan kode Python...",
      });

      const MAX_STREAM_LINES = 800;
      instance.setStdout({
        batched: (text: string) => {
          if (stdoutLines.length < MAX_STREAM_LINES) {
            stdoutLines.push(text);
          }
        },
      });
      instance.setStderr({
        batched: (text: string) => {
          if (stderrLines.length < MAX_STREAM_LINES) {
            stderrLines.push(text);
          }
        },
      });

      const escapedCode = JSON.stringify(String(msg.code || ""));
      const rawRichJson = (await instance.runPythonAsync(
        `__velqora_exec_cell(${escapedCode}, globals())`
      )) as string;

      if (stdoutLines.length > 0) {
        outputs.push({
          kind: "stream",
          name: "stdout",
          text: stdoutLines.join("\n"),
        });
      }
      if (stderrLines.length > 0) {
        outputs.push({
          kind: "stream",
          name: "stderr",
          text: stderrLines.join("\n"),
        });
      }

      if (rawRichJson) {
        const parsedRich = JSON.parse(rawRichJson) as RichCellOutput[];
        outputs.push(...parsedRich);
      }

      // Optional Autograder test assertions
      if (msg.testAssertions && String(msg.testAssertions).trim()) {
        const casesJson = (await instance.runPythonAsync(
          `__velqora_run_assertions(${JSON.stringify(String(msg.testAssertions))}, globals())`
        )) as string;
        const cases = JSON.parse(casesJson) as Array<{
          name: string;
          passed: boolean;
          message?: string;
        }>;
        outputs.push({
          kind: "test_result",
          passed: cases.filter((c) => c.passed).length,
          total: cases.length,
          cases,
        });
      }

      // Snapshot globals & DataFrames for Variable Inspector + SQL Cross-Kernel Bridge
      const snapJson = (await instance.runPythonAsync(
        `__velqora_snapshot_vars(globals())`
      )) as string;
      const snap = JSON.parse(snapJson) as {
        variables: VariableSummary[];
        dataframes: Record<string, DataFramePayload>;
      };

      // Collect any newly written files inside /workspace
      const writtenFiles: Array<{ name: string; path: string; bytes: Uint8Array }> = [];
      try {
        const names = instance.FS.readdir("/workspace");
        for (const name of names) {
          if (name === "." || name === "..") continue;
          const fullPath = `/workspace/${name}`;
          const st = instance.FS.stat(fullPath);
          if (instance.FS.isFile(st.mode) && st.size <= 10 * 1024 * 1024) {
            writtenFiles.push({
              name,
              path: fullPath,
              bytes: instance.FS.readFile(fullPath),
            });
          }
        }
      } catch {
        // Ignore VFS scan errors
      }

      if (outputs.length === 0) {
        outputs.push({
          kind: "stream",
          name: "stdout",
          text: "(Kode Python selesai dieksekusi tanpa output.)",
        });
      }

      self.postMessage({ type: "status", state: "ready", detail: "Python 3.12 WASM siap" });
      self.postMessage({
        type: "result",
        cellId: msg.cellId,
        requestId: msg.requestId,
        success: true,
        outputs,
        executionMs: Math.round(performance.now() - start),
        variables: snap.variables,
        exportedDataFrames: snap.dataframes,
        installedPackages: Array.from(installedPackages),
        writtenFiles,
      });
    } catch (err: any) {
      if (stdoutLines.length > 0) {
        outputs.push({
          kind: "stream",
          name: "stdout",
          text: stdoutLines.join("\n"),
        });
      }
      if (stderrLines.length > 0) {
        outputs.push({
          kind: "stream",
          name: "stderr",
          text: stderrLines.join("\n"),
        });
      }

      const rawErr = String(err?.message || err);
      const tbLines = rawErr.split("\n");
      const lastLine =
        tbLines
          .slice()
          .reverse()
          .find((l) => l.trim().length > 0) || rawErr;
      const lineMatch = rawErr.match(/File "<(?:cell|exec|unknown)>", line (\d+)/);
      const enameMatch = lastLine.match(/^([A-Za-z_][A-Za-z0-9_]*Error|Exception):/);

      outputs.push({
        kind: "error",
        ename: enameMatch ? enameMatch[1] : "PythonError",
        evalue: lastLine,
        traceback: tbLines,
        lineNumber: lineMatch ? Number(lineMatch[1]) : undefined,
      });

      self.postMessage({ type: "status", state: "ready", detail: "Python 3.12 WASM siap" });
      self.postMessage({
        type: "result",
        cellId: msg.cellId,
        requestId: msg.requestId,
        success: false,
        outputs,
        executionMs: Math.round(performance.now() - start),
      });
    }
  }
};
