/// <reference lib="webworker" />

import { preprocessPythonCellSource } from "../python-preprocessor";
import type { DataFramePayload, RichCellOutput, VariableSummary } from "../types";

// Next.js / Webpack worker strict-mode safety guard
(self as unknown as Record<string, unknown>)._N_E =
  (self as unknown as Record<string, unknown>)._N_E || {};

declare function importScripts(...urls: string[]): void;

const PYODIDE_VERSION = "v0.27.4";
const PYODIDE_INDEX_URLS = [
  `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`,
  `https://fastly.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`,
];

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
import os, sys, ast, io, json, base64, traceback, math, builtins, inspect, importlib, importlib.util

# Pastikan Matplotlib selalu memakai backend non-GUI AGG di Web Worker (cegah error document undefined)
os.environ["MPLBACKEND"] = "AGG"

os.makedirs("/workspace", exist_ok=True)
if os.getcwd() != "/workspace":
    os.chdir("/workspace")
if "/workspace" not in sys.path:
    sys.path.insert(0, "/workspace")

__velqora_outputs = []
__velqora_matplotlib_hooked = False
__velqora_hooking_mpl = False
__velqora_stdin_queue = []

class _VelqoraStream(io.TextIOBase):
    def __init__(self, stream_name, sink, max_chars=80000):
        self.stream_name = stream_name
        self.sink = sink
        self.max_chars = max_chars
        self.chars = 0

    def write(self, s):
        if not s:
            return 0
        text = str(s)
        if self.chars >= self.max_chars:
            return len(text)
        remaining = self.max_chars - self.chars
        chunk = text[:remaining]
        self.chars += len(chunk)
        if (
            self.sink
            and self.sink[-1].get("kind") == "stream"
            and self.sink[-1].get("name") == self.stream_name
        ):
            self.sink[-1]["text"] += chunk
        else:
            self.sink.append({
                "kind": "stream",
                "name": self.stream_name,
                "text": chunk,
            })
        return len(text)

    def flush(self):
        pass

    def isatty(self):
        return False

def _normalize_outputs(items):
    normalized = []
    for item in items:
        if item.get("kind") == "stream":
            txt = str(item.get("text", ""))
            if txt.endswith("\\n"):
                txt = txt[:-1]
            if not txt:
                continue
            normalized.append({**item, "text": txt})
        else:
            normalized.append(item)
    return normalized

class __VelqoraNeedInput(BaseException):
    def __init__(self, prompt_text=""):
        super().__init__(prompt_text)
        self.prompt_text = prompt_text

def __velqora_input(prompt=""):
    prompt_str = "" if prompt is None else str(prompt)
    if __velqora_stdin_queue:
        val = str(__velqora_stdin_queue.pop(0))
        sys.stdout.write(f"{prompt_str}{val}\\n")
        sys.stdout.flush()
        return val
    raise __VelqoraNeedInput(prompt_str)

builtins.input = __velqora_input

def __velqora_ensure_matplotlib_hook():
    global __velqora_matplotlib_hooked, __velqora_hooking_mpl
    if __velqora_matplotlib_hooked or __velqora_hooking_mpl:
        return
    if "matplotlib" not in sys.modules and "matplotlib.pyplot" not in sys.modules:
        return
    __velqora_hooking_mpl = True
    try:
        import matplotlib
        try:
            matplotlib.use("AGG", force=True)
        except Exception:
            pass
        if "matplotlib.pyplot" in sys.modules:
            import matplotlib.pyplot as plt
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
    finally:
        __velqora_hooking_mpl = False

_velqora_orig_import = builtins.__import__
def _velqora_import(name, globals=None, locals=None, fromlist=(), level=0):
    mod = _velqora_orig_import(name, globals, locals, fromlist, level)
    if not __velqora_matplotlib_hooked and not __velqora_hooking_mpl:
        if name == "matplotlib" or str(name).startswith("matplotlib.") or "matplotlib.pyplot" in sys.modules:
            __velqora_ensure_matplotlib_hook()
    return mod

builtins.__import__ = _velqora_import

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

async def __velqora_exec_cell(code_str, globals_dict, stdin_json="[]"):
    global __velqora_outputs, __velqora_stdin_queue
    __velqora_outputs = []
    __velqora_stdin_queue = [str(x) for x in json.loads(stdin_json)]

    _orig_stdout = sys.stdout
    _orig_stderr = sys.stderr
    sys.stdout = _VelqoraStream("stdout", __velqora_outputs)
    sys.stderr = _VelqoraStream("stderr", __velqora_outputs)

    try:
        importlib.invalidate_caches()
        tree = ast.parse(code_str, mode="exec")
        __velqora_ensure_matplotlib_hook()

        last_expr = None
        if tree.body and isinstance(tree.body[-1], ast.Expr):
            last_expr = ast.Expression(body=tree.body.pop().value)

        if tree.body:
            co = compile(tree, "<cell>", "exec", flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)
            res = eval(co, globals_dict, globals_dict)
            if inspect.isawaitable(res):
                await res

        __velqora_ensure_matplotlib_hook()

        if last_expr is not None:
            lco = compile(last_expr, "<cell>", "eval", flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)
            val = eval(lco, globals_dict, globals_dict)
            if inspect.isawaitable(val):
                val = await val
            __velqora_emit_object(val)

        if "matplotlib.pyplot" in sys.modules:
            __velqora_ensure_matplotlib_hook()
            import matplotlib.pyplot as plt
            if plt.get_fignums():
                plt.show()

        return json.dumps({
            "status": "ok",
            "outputs": _normalize_outputs(__velqora_outputs),
        }, default=str)
    except __VelqoraNeedInput as need_in:
        try:
            if "matplotlib.pyplot" in sys.modules:
                import matplotlib.pyplot as plt
                plt.close("all")
        except Exception:
            pass
        return json.dumps({"status": "need_input", "prompt": need_in.prompt_text})
    except BaseException as exc:
        if isinstance(exc, KeyboardInterrupt):
            raise
        tb_text = "".join(traceback.format_exception(type(exc), exc, exc.__traceback__))
        return json.dumps({
            "status": "error",
            "outputs": _normalize_outputs(__velqora_outputs),
            "traceback": tb_text,
        }, default=str)
    finally:
        sys.stdout = _orig_stdout
        sys.stderr = _orig_stderr

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
    ignore = {"os", "sys", "ast", "io", "json", "base64", "traceback", "math", "builtins", "inspect", "importlib", "display", "In", "Out", "get_ipython"}
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
  np: "numpy",
  pd: "pandas",
  Bio: "biopython",
  fitz: "pymupdf",
  dotenv: "python-dotenv",
  jwt: "pyjwt",
};

const NATIVE_HEAVY_ML = new Set(["torch", "tensorflow", "keras", "jax", "mxnet"]);

let pyodide: PyodideInstance | null = null;
let bootPromise: Promise<PyodideInstance> | null = null;
let micropipReady = false;
const installedPackages = new Set<string>();
const failedAutoInstall = new Set<string>();

interface StdinWaiter {
  resolve: (res: { value: string; cancelled: boolean }) => void;
}
const stdinWaiters = new Map<string, StdinWaiter>();

async function ensurePyodide(): Promise<PyodideInstance> {
  if (pyodide) return pyodide;
  if (bootPromise) return bootPromise;

  bootPromise = (async () => {
    self.postMessage({
      type: "status",
      state: "loading",
      detail: "Memuat runtime Python 3.12 WebAssembly...",
    });

    let lastErr: unknown = null;
    for (const indexUrl of PYODIDE_INDEX_URLS) {
      // Strategi 1: ESM dynamic import
      try {
        const pyodideMod = await import(
          /* webpackIgnore: true */ `${indexUrl}pyodide.mjs`
        );
        const instance = (await pyodideMod.loadPyodide({
          indexURL: indexUrl,
        })) as PyodideInstance;
        await instance.runPythonAsync(VELQORA_PREAMBLE_PY);
        pyodide = instance;
        self.postMessage({
          type: "status",
          state: "ready",
          detail: "Python 3.12 WASM siap",
        });
        return instance;
      } catch (esmErr) {
        lastErr = esmErr;
      }

      // Strategi 2: Classic Worker importScripts fallback
      if (typeof importScripts === "function") {
        try {
          importScripts(`${indexUrl}pyodide.js`);
          const loader = (self as unknown as { loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInstance> }).loadPyodide;
          if (loader) {
            const instance = await loader({ indexURL: indexUrl });
            await instance.runPythonAsync(VELQORA_PREAMBLE_PY);
            pyodide = instance;
            self.postMessage({
              type: "status",
              state: "ready",
              detail: "Python 3.12 WASM siap",
            });
            return instance;
          }
        } catch (classicErr) {
          lastErr = classicErr;
        }
      }
    }

    throw lastErr instanceof Error
      ? lastErr
      : new Error(String(lastErr || "Gagal mengunduh runtime Pyodide dari CDN."));
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

async function ensureMicropip(instance: PyodideInstance) {
  if (!micropipReady) {
    await instance.loadPackage("micropip");
    micropipReady = true;
  }
  return instance.pyimport("micropip");
}

async function installMissingPackages(
  instance: PyodideInstance,
  pipInstalls: string[],
  imports: string[],
  pythonCode: string,
  warningLines: string[]
) {
  // 1. Proses `!pip install` / `%pip install` eksplisit terlebih dahulu
  for (const pkgSpec of pipInstalls) {
    const baseName = pkgSpec.split(/[<>=!~;\[]/)[0].trim();
    if (!baseName) continue;
    if (NATIVE_HEAVY_ML.has(baseName.toLowerCase())) {
      warningLines.push(
        `[pip] "${baseName}" memerlukan GPU/Native runtime (tidak tersedia di browser WASM; gunakan GPU Bridge di menu Runtime jika perlu).`
      );
      continue;
    }

    try {
      self.postMessage({
        type: "status",
        state: "installing_pkg",
        detail: `pip install ${pkgSpec}...`,
      });
      const micropip = await ensureMicropip(instance);
      await micropip.install(pkgSpec);
      installedPackages.add(baseName);
    } catch (err: any) {
      warningLines.push(
        `[pip] Gagal memasang ${pkgSpec}: ${err?.message || String(err)}`
      );
    }
  }

  if (imports.length === 0) return;

  // 2. Muat wheel built-in Pyodide (numpy, pandas, matplotlib, scikit-learn, scipy, dll.)
  if (pythonCode.trim()) {
    try {
      self.postMessage({
        type: "status",
        state: "installing_pkg",
        detail: "Memeriksa dependensi paket Python...",
      });
      await instance.loadPackagesFromImports(pythonCode);
      for (const imp of imports) {
        const exists = await instance.runPythonAsync(
          `import importlib.util; importlib.util.find_spec(${JSON.stringify(imp)}) is not None`
        );
        if (exists) installedPackages.add(imp);
      }
    } catch {
      // Paket non-Pyodide akan ditangani micropip di bawah
    }
  }

  // 3. JANGAN return dini — cek setiap import lewat find_spec lalu install via micropip bila perlu!
  for (const rawPkg of imports) {
    if (failedAutoInstall.has(rawPkg)) continue;

    const alreadyExists = await instance
      .runPythonAsync(
        `import importlib, importlib.util; importlib.invalidate_caches(); importlib.util.find_spec(${JSON.stringify(rawPkg)}) is not None`
      )
      .catch(() => false);
    if (alreadyExists) continue;

    if (NATIVE_HEAVY_ML.has(rawPkg.toLowerCase())) {
      failedAutoInstall.add(rawPkg);
      continue;
    }

    const pipName = ALIAS_TO_PIP[rawPkg] || rawPkg;
    self.postMessage({
      type: "status",
      state: "installing_pkg",
      detail: `Menginstal ${pipName} otomatis...`,
    });

    try {
      const micropip = await ensureMicropip(instance);
      await micropip.install(pipName);
      installedPackages.add(pipName);

      if (pipName === "requests") {
        try {
          await micropip.install("pyodide-http");
          await instance.runPythonAsync(
            `import pyodide_http; pyodide_http.patch_all()`
          );
        } catch {
          // Optional HTTP patch
        }
      }
    } catch {
      // Biarkan Python mengeksekusi sel (penting jika kode pakai try/except ImportError atau error native)
      failedAutoInstall.add(rawPkg);
    }
  }
}

function formatCleanPythonError(rawErr: string): {
  ename: string;
  evalue: string;
  traceback: string[];
  lineNumber?: number;
} {
  const allLines = rawErr.split("\n");
  const cellStartIdx = allLines.findIndex((l) =>
    /File "<(?:cell|unknown)>"/.test(l)
  );
  const slicedLines =
    cellStartIdx > 0
      ? ["Traceback (most recent call last):", ...allLines.slice(cellStartIdx)]
      : allLines;

  // Filter frame internal __velqora_exec_cell jika masih terselip
  const cleanedLines = slicedLines.filter(
    (l, i, arr) =>
      !l.includes("__velqora_exec_cell") &&
      !(i > 0 && arr[i - 1]?.includes("__velqora_exec_cell"))
  );

  const tbLines = cleanedLines.length > 0 ? cleanedLines : allLines;
  const lastLine =
    tbLines
      .slice()
      .reverse()
      .find((l) => l.trim().length > 0) || rawErr;

  const userFrames = tbLines.join("\n");
  const lineMatch = userFrames.match(
    /File "<(?:cell|unknown|exec)>", line (\d+)/
  );
  const enameMatch = lastLine.match(
    /^([A-Za-z_][A-Za-z0-9_]*(?:Error|Exception|Warning|Interrupt)):/
  );

  return {
    ename: enameMatch ? enameMatch[1] : "PythonError",
    evalue: lastLine,
    traceback: tbLines,
    lineNumber: lineMatch ? Number(lineMatch[1]) : undefined,
  };
}

async function handleExecute(msg: any) {
  const start = performance.now();
  const outputs: RichCellOutput[] = [];
  const stdoutLines: string[] = [];
  const stderrLines: string[] = [];

  try {
    const instance = await ensurePyodide();

    // Sync workspace uploaded files
    if (Array.isArray(msg.files)) {
      instance.FS.mkdirTree("/workspace");
      for (const f of msg.files) {
        const targetPath = String(f.path).startsWith("/workspace/")
          ? String(f.path)
          : `/workspace/${String(f.name)}`;
        instance.FS.writeFile(targetPath, new Uint8Array(f.bytes));
      }
    }

    const prep = preprocessPythonCellSource(String(msg.code || ""));

    // Handle %%writefile cell magic
    if (prep.writeFile) {
      const parentDir = prep.writeFile.path.slice(
        0,
        prep.writeFile.path.lastIndexOf("/")
      );
      if (parentDir) instance.FS.mkdirTree(parentDir);
      let finalContent = prep.writeFile.content;
      if (prep.writeFile.append) {
        try {
          const prevBytes = instance.FS.readFile(prep.writeFile.path);
          finalContent = new TextDecoder().decode(prevBytes) + finalContent;
        } catch {
          // New file
        }
      }
      instance.FS.writeFile(
        prep.writeFile.path,
        new TextEncoder().encode(finalContent)
      );
      outputs.push({
        kind: "stream",
        name: "stdout",
        text: prep.magicNotices.join("\n"),
      });
    } else if (prep.magicRender) {
      // Handle %%html / %%markdown / %%svg
      if (prep.magicRender.kind === "html") {
        outputs.push({ kind: "html", html: prep.magicRender.content });
      } else if (prep.magicRender.kind === "svg") {
        outputs.push({
          kind: "image",
          mimeType: "image/svg+xml",
          data: prep.magicRender.content,
        });
      } else {
        outputs.push({ kind: "markdown", markdown: prep.magicRender.content });
      }
    } else {
      await installMissingPackages(
        instance,
        prep.pipInstalls,
        prep.imports,
        prep.pythonCode,
        stderrLines
      );

      for (const notice of prep.magicNotices) {
        stdoutLines.push(notice);
      }

      self.postMessage({
        type: "status",
        state: "executing",
        detail: "Menjalankan kode Python...",
      });

      const stdinInputs: string[] = Array.isArray(msg.stdinInputs)
        ? msg.stdinInputs.map(String)
        : [];
      let loopGuard = 0;
      let cellOutputs: RichCellOutput[] = [];
      let cellRuntimeError: string | null = null;

      while (loopGuard < 20) {
        loopGuard++;
        const escapedCode = JSON.stringify(prep.pythonCode);
        const escapedStdin = JSON.stringify(JSON.stringify(stdinInputs));
        const rawJson = (await instance.runPythonAsync(
          `await __velqora_exec_cell(${escapedCode}, globals(), ${escapedStdin})`
        )) as string;

        const parsed = JSON.parse(rawJson) as
          | { status: "ok"; outputs: RichCellOutput[] }
          | { status: "need_input"; prompt: string }
          | { status: "error"; outputs: RichCellOutput[]; traceback: string };

        if (parsed.status === "need_input") {
          self.postMessage({
            type: "need_input",
            requestId: msg.requestId,
            cellId: msg.cellId,
            prompt: parsed.prompt || "Masukkan nilai input:",
          });

          const reply = await new Promise<{ value: string; cancelled: boolean }>(
            (resolve) => {
              stdinWaiters.set(msg.requestId, { resolve });
            }
          );

          if (reply.cancelled) {
            throw new Error("KeyboardInterrupt: Input dibatalkan oleh pengguna.");
          }

          stdinInputs.push(reply.value);
          continue;
        }

        if (parsed.status === "error") {
          cellOutputs = parsed.outputs || [];
          cellRuntimeError = parsed.traceback || "PythonError";
          break;
        }

        cellOutputs = parsed.outputs || [];
        break;
      }

      if (prep.timingMode === "cell") {
        stdoutLines.push(
          `Wall time: ${(performance.now() - start).toFixed(1)} ms`
        );
      }

      if (!prep.captureOutput) {
        if (stderrLines.length > 0) {
          outputs.push({
            kind: "stream",
            name: "stderr",
            text: stderrLines.join("\n"),
          });
        }
        // Pertahankan urutan kronologis murni dari _VelqoraStream + display() + plt.show() + last_expr
        outputs.push(...cellOutputs);
        if (stdoutLines.length > 0) {
          outputs.push({
            kind: "stream",
            name: "stdout",
            text: stdoutLines.join("\n"),
          });
        }
      }

      if (cellRuntimeError) {
        const cleaned = formatCleanPythonError(cellRuntimeError);
        outputs.push({
          kind: "error",
          ename: cleaned.ename,
          evalue: cleaned.evalue,
          traceback: cleaned.traceback,
          lineNumber: cleaned.lineNumber,
        });
        self.postMessage({
          type: "status",
          state: "ready",
          detail: "Python 3.12 WASM siap",
        });
        self.postMessage({
          type: "result",
          cellId: msg.cellId,
          requestId: msg.requestId,
          success: false,
          outputs,
          executionMs: Math.round(performance.now() - start),
        });
        return;
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
    }

    // Snapshot globals & DataFrames for Variable Inspector + SQL Bridge
    const snapJson = (await instance.runPythonAsync(
      `__velqora_snapshot_vars(globals())`
    )) as string;
    const snap = JSON.parse(snapJson) as {
      variables: VariableSummary[];
      dataframes: Record<string, DataFramePayload>;
    };

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

    self.postMessage({
      type: "status",
      state: "ready",
      detail: "Python 3.12 WASM siap",
    });
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
    const cleaned = formatCleanPythonError(rawErr);

    outputs.push({
      kind: "error",
      ename: cleaned.ename,
      evalue: cleaned.evalue,
      traceback: cleaned.traceback,
      lineNumber: cleaned.lineNumber,
    });

    self.postMessage({
      type: "status",
      state: "ready",
      detail: "Python 3.12 WASM siap",
    });
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

self.onmessage = (event: MessageEvent) => {
  const msg = event.data;
  if (!msg || typeof msg !== "object") return;

  if (msg.type === "stdin_reply" && msg.requestId) {
    const waiter = stdinWaiters.get(msg.requestId);
    if (waiter) {
      stdinWaiters.delete(msg.requestId);
      waiter.resolve({
        value: String(msg.value ?? ""),
        cancelled: Boolean(msg.cancelled),
      });
    }
    return;
  }

  if (msg.type === "init") {
    void (async () => {
      try {
        await ensurePyodide();
        self.postMessage({ type: "ready" });
      } catch (err: any) {
        self.postMessage({
          type: "boot_error",
          error: err?.message || String(err),
        });
      }
    })();
    return;
  }

  if (msg.type === "sync_files" && Array.isArray(msg.files)) {
    void (async () => {
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
    })();
    return;
  }

  if (msg.type === "execute") {
    void handleExecute(msg);
  }
};
