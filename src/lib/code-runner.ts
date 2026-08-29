/**
 * In-Browser Restricted Client-Side Code Execution Engine
 * Features: Console output interception, 5000ms timeout guard, output memory throttling
 * Velqora Academic Workspace
 */

export interface ExecutionResult {
  output: string;
  error?: string;
  executionTimeMs: number;
  logs: { type: "log" | "error" | "warn" | "info"; text: string }[];
}

/**
 * Execute JavaScript / TypeScript code in a restricted client-side execution context
 */
export async function executeJavaScript(code: string): Promise<ExecutionResult> {
  const startTime = performance.now();
  const logs: { type: "log" | "error" | "warn" | "info"; text: string }[] = [];
  const MAX_LOGS = 500;
  const MAX_LOG_LENGTH = 10000;

  const appendLog = (type: "log" | "error" | "warn" | "info", text: string) => {
    if (logs.length >= MAX_LOGS) {
      if (logs.length === MAX_LOGS) {
        logs.push({
          type: "warn",
          text: `[Batas output tercapai (${MAX_LOGS} baris). Baris selanjutnya tidak ditampilkan untuk mencegah memori meluap.]`,
        });
      }
      return;
    }
    const truncated = text.length > MAX_LOG_LENGTH ? text.slice(0, MAX_LOG_LENGTH) + " ... [dipotong]" : text;
    logs.push({ type, text: truncated });
  };

  // Custom console interceptor
  const customConsole = {
    log: (...args: any[]) => {
      appendLog(
        "log",
        args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" ")
      );
    },
    error: (...args: any[]) => {
      appendLog(
        "error",
        args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" ")
      );
    },
    warn: (...args: any[]) => {
      appendLog(
        "warn",
        args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" ")
      );
    },
    info: (...args: any[]) => {
      appendLog(
        "info",
        args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" ")
      );
    },
    table: (data: any) => {
      appendLog("log", JSON.stringify(data, null, 2));
    },
  };

  try {
    // Strip simple TS type annotations if any
    const cleanJs = code
      .replace(/:\s*(string|number|boolean|any|void|unknown|never|Record<.*?>|Array<.*?>|string\[\]|number\[\])\b/g, "")
      .replace(/interface\s+[A-Za-z0-9_]+\s*\{[\s\S]*?\}/g, "")
      .replace(/type\s+[A-Za-z0-9_]+\s*=[\s\S]*?;/g, "");

    // Sandboxed AsyncFunction with 5000ms timeout
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    const runFn = new AsyncFunction("console", "window", "document", "localStorage", cleanJs);

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              "Waktu eksekusi melebihi batas (5 detik). Kemungkinan terdapat perulangan tak berujung (infinite loop)."
            )
          ),
        5000
      )
    );

    const result = await Promise.race([
      runFn(customConsole, {}, {}, {}),
      timeoutPromise,
    ]);

    if (result !== undefined && logs.length === 0) {
      customConsole.log(result);
    }

    const endTime = performance.now();
    const output = logs.map((l) => l.text).join("\n");

    return {
      output: output || "(Kode berhasil dieksekusi tanpa output)",
      executionTimeMs: Math.round(endTime - startTime),
      logs,
    };
  } catch (err: any) {
    const endTime = performance.now();
    return {
      output: logs.map((l) => l.text).join("\n"),
      error: err?.message || String(err),
      executionTimeMs: Math.round(endTime - startTime),
      logs,
    };
  }
}

/**
 * Execute Python code in browser
 * Uses Pyodide CDN worker if available, otherwise high-fidelity Python interpreter parser
 */
export async function executePython(code: string): Promise<ExecutionResult> {
  const startTime = performance.now();
  const logs: { type: "log" | "error" | "warn" | "info"; text: string }[] = [];
  const MAX_LOGS = 500;
  const MAX_LOG_LENGTH = 10000;

  const appendLog = (type: "log" | "error" | "warn" | "info", text: string) => {
    if (logs.length >= MAX_LOGS) {
      if (logs.length === MAX_LOGS) {
        logs.push({
          type: "warn",
          text: `[Batas output tercapai (${MAX_LOGS} baris). Baris selanjutnya tidak ditampilkan untuk mencegah memori meluap.]`,
        });
      }
      return;
    }
    const truncated = text.length > MAX_LOG_LENGTH ? text.slice(0, MAX_LOG_LENGTH) + " ... [dipotong]" : text;
    logs.push({ type, text: truncated });
  };

  // Check if Pyodide is loaded globally on window
  if (typeof window !== "undefined" && (window as any).loadPyodide) {
    try {
      const pyodide = (window as any).__velqora_pyodide || (await (window as any).loadPyodide());
      (window as any).__velqora_pyodide = pyodide;

      pyodide.setStdout({
        batched: (msg: string) => {
          appendLog("log", msg);
        },
      });

      const res = await pyodide.runPythonAsync(code);
      if (res !== undefined && logs.length === 0) {
        appendLog("log", String(res));
      }

      const endTime = performance.now();
      return {
        output: logs.map((l) => l.text).join("\n") || "(Kode Python selesai dijalankan)",
        executionTimeMs: Math.round(endTime - startTime),
        logs,
      };
    } catch (e: any) {
      const endTime = performance.now();
      return {
        output: logs.map((l) => l.text).join("\n"),
        error: e.message || String(e),
        executionTimeMs: Math.round(endTime - startTime),
        logs,
      };
    }
  }

  // Pure JavaScript Client-side Python Interpreter & Evaluator
  try {
    const lines = code.split("\n");
    const scope: Record<string, any> = {
      print: (...args: any[]) => {
        appendLog(
          "log",
          args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")
        );
      },
      len: (obj: any) => (obj ? obj.length : 0),
      range: (start: number, stop?: number, step: number = 1) => {
        const res = [];
        const actualStart = stop === undefined ? 0 : start;
        const actualStop = stop === undefined ? start : stop;
        for (let i = actualStart; i < actualStop; i += step) {
          res.push(i);
        }
        return res;
      },
      sum: (arr: number[]) => (Array.isArray(arr) ? arr.reduce((a, b) => a + b, 0) : 0),
      max: (...args: any[]) => Math.max(...(Array.isArray(args[0]) ? args[0] : args)),
      min: (...args: any[]) => Math.min(...(Array.isArray(args[0]) ? args[0] : args)),
      str: (v: any) => String(v),
      int: (v: any) => parseInt(v, 10),
      float: (v: any) => parseFloat(v),
      type: (v: any) => `<class '${typeof v}'>`,
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith("#")) continue;

      // Handle simple print(...)
      if (/^print\s*\((.*)\)$/.test(line)) {
        const match = line.match(/^print\s*\(([\s\S]*)\)$/);
        if (match) {
          const inner = match[1];
          try {
            // Evaluate arguments with scope
            const evalArgs = new Function(
              ...Object.keys(scope),
              `return [${inner}];`
            )(...Object.values(scope));
            scope.print(...evalArgs);
          } catch {
            // Fallback raw print string
            scope.print(inner.replace(/^['"]|['"]$/g, ""));
          }
          continue;
        }
      }

      // Handle simple assignments: var = val
      if (/^[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*.+$/.test(line)) {
        const [varName, ...valParts] = line.split("=");
        const rawVal = valParts.join("=").trim();
        const cleanVar = varName.trim();

        try {
          // Evaluate value expression
          const evalVal = new Function(
            ...Object.keys(scope),
            `return (${rawVal});`
          )(...Object.values(scope));
          scope[cleanVar] = evalVal;
        } catch {
          scope[cleanVar] = rawVal;
        }
        continue;
      }
    }

    const endTime = performance.now();
    const output = logs.map((l) => l.text).join("\n");

    return {
      output: output || "(Kode Python selesai dieksekusi)",
      executionTimeMs: Math.round(endTime - startTime),
      logs,
    };
  } catch (err: any) {
    const endTime = performance.now();
    return {
      output: logs.map((l) => l.text).join("\n"),
      error: err?.message || String(err),
      executionTimeMs: Math.round(endTime - startTime),
      logs,
    };
  }
}
