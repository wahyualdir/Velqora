export interface PreprocessedPythonCell {
  pythonCode: string;
  pipInstalls: string[];
  imports: string[];
  timingMode: "none" | "cell";
  captureOutput: boolean;
  writeFile?: {
    path: string;
    content: string;
    append: boolean;
  };
  magicRender?: {
    kind: "html" | "markdown" | "svg";
    content: string;
  };
  magicNotices: string[];
}

const PIP_FLAGS_WITH_VALUE = new Set([
  "-r",
  "--requirement",
  "-c",
  "--constraint",
  "-e",
  "--editable",
  "-t",
  "--target",
  "-i",
  "--index-url",
  "--extra-index-url",
  "-f",
  "--find-links",
  "--prefix",
  "--root",
  "--platform",
  "--python-version",
  "--implementation",
  "--abi",
]);

function splitShellTokens(input: string): string[] {
  const tokens: string[] = [];
  let cur = "";
  let quote: '"' | "'" | null = null;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quote) {
      if (ch === "\\" && i + 1 < input.length) {
        cur += input[++i];
      } else if (ch === quote) {
        quote = null;
      } else {
        cur += ch;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === "#") {
      break;
    }
    if (/\s/.test(ch)) {
      if (cur) {
        tokens.push(cur);
        cur = "";
      }
      continue;
    }
    cur += ch;
  }
  if (cur) tokens.push(cur);
  return tokens;
}

function parsePipInstallArgs(rawArgs: string): {
  packages: string[];
  skippedNotice?: string;
} {
  const tokens = splitShellTokens(rawArgs);
  const packages: string[] = [];
  let skippedReq = false;

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok === "install" && i === 0) continue;
    if (PIP_FLAGS_WITH_VALUE.has(tok)) {
      if (tok === "-r" || tok === "--requirement") skippedReq = true;
      i++;
      continue;
    }
    if (tok.startsWith("-")) continue;
    packages.push(tok);
  }

  return {
    packages,
    skippedNotice: skippedReq
      ? "Opsi `-r requirements` dilewati; paket lain tetap diproses."
      : undefined,
  };
}

function translateShellCommandLine(cmdLine: string, indent: string): string {
  const trimmed = cmdLine.trim();
  const tokens = splitShellTokens(trimmed);
  const cmd = tokens[0] || "";

  if (cmd === "ls" || cmd === "dir") {
    const target = tokens.find((t) => !t.startsWith("-") && t !== cmd) || ".";
    return `${indent}import os as __vos; print("  ".join(sorted(__vos.listdir(${JSON.stringify(target)}))))`;
  }
  if (cmd === "pwd") {
    return `${indent}import os as __vos; print(__vos.getcwd())`;
  }
  if (cmd === "mkdir") {
    const target = tokens.find((t) => !t.startsWith("-") && t !== cmd);
    if (target) {
      return `${indent}import os as __vos; __vos.makedirs(${JSON.stringify(target)}, exist_ok=True)`;
    }
  }
  if (cmd === "cat") {
    const target = tokens.find((t) => !t.startsWith("-") && t !== cmd);
    if (target) {
      return `${indent}print(open(${JSON.stringify(target)}, encoding="utf-8", errors="replace").read())`;
    }
  }
  if (cmd === "echo") {
    const rest = trimmed.replace(/^echo\s*/, "");
    return `${indent}print(${JSON.stringify(rest)})`;
  }

  return `${indent}print(${JSON.stringify(`[velqora] Perintah shell '${cmd || "!"}' tidak tersedia di WASM; dilewati.`)})`;
}

/**
 * Ekstrak daftar modul Python top-level yang di-import dengan aman,
 * termasuk multi-import (`import numpy as np, pandas as pd`) dan mengabaikan string/komentar.
 */
export function extractPythonImports(code: string): string[] {
  const cleaned = stripCommentsAndTripleQuotes(code);
  const pkgs = new Set<string>();

  for (const rawLine of cleaned.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const fromMatch = line.match(/^from\s+([A-Za-z_][A-Za-z0-9_]*)(?:\.[A-Za-z0-9_]+)*\s+import\b/);
    if (fromMatch) {
      pkgs.add(fromMatch[1]);
      continue;
    }

    const importMatch = line.match(/^import\s+(.+)$/);
    if (importMatch) {
      const parts = importMatch[1].split(",");
      for (const part of parts) {
        const modToken = part.trim().split(/\s+as\s+/)[0]?.trim();
        const root = modToken?.split(".")[0]?.trim();
        if (root && /^[A-Za-z_][A-Za-z0-9_]*$/.test(root)) {
          pkgs.add(root);
        }
      }
    }
  }

  return Array.from(pkgs);
}

function stripCommentsAndTripleQuotes(code: string): string {
  let out = "";
  let i = 0;
  let tripleQuote: '"""' | "'''" | null = null;
  let singleQuote: '"' | "'" | null = null;

  while (i < code.length) {
    const ch = code[i];
    const next3 = code.slice(i, i + 3);

    if (tripleQuote) {
      if (next3 === tripleQuote) {
        tripleQuote = null;
        out += "   ";
        i += 3;
      } else {
        out += ch === "\n" ? "\n" : " ";
        i++;
      }
      continue;
    }

    if (singleQuote) {
      if (ch === "\\" && i + 1 < code.length) {
        out += "  ";
        i += 2;
      } else if (ch === singleQuote || ch === "\n") {
        singleQuote = null;
        out += ch === "\n" ? "\n" : " ";
        i++;
      } else {
        out += " ";
        i++;
      }
      continue;
    }

    if (next3 === '"""' || next3 === "'''") {
      tripleQuote = next3;
      out += "   ";
      i += 3;
      continue;
    }

    if (ch === '"' || ch === "'") {
      singleQuote = ch;
      out += " ";
      i++;
      continue;
    }

    if (ch === "#") {
      while (i < code.length && code[i] !== "\n") {
        out += " ";
        i++;
      }
      continue;
    }

    out += ch;
    i++;
  }

  return out;
}

/**
 * Mengubah syntax notebook Google Colab/Jupyter (`!pip install`, `%matplotlib inline`,
 * `%%time`, `%%writefile`, `!ls`, `obj?`) menjadi Python murni siap eksekusi di Pyodide
 * sambil mempertahankan nomor baris 1-to-1 untuk traceback error yang akurat.
 */
export function preprocessPythonCellSource(
  rawCode: string
): PreprocessedPythonCell {
  const normalized = (rawCode || "").replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const pipInstalls: string[] = [];
  const magicNotices: string[] = [];
  let timingMode: "none" | "cell" = "none";
  let captureOutput = false;

  const firstNonEmptyIdx = lines.findIndex((l) => l.trim().length > 0);
  if (firstNonEmptyIdx !== -1) {
    const firstTrim = lines[firstNonEmptyIdx].trim();
    if (firstTrim.startsWith("%%writefile")) {
      const tokens = splitShellTokens(firstTrim.slice("%%writefile".length).trim());
      const append = tokens.includes("-a");
      const targetName = tokens.find((t) => t !== "-a") || "script.txt";
      const targetPath = targetName.startsWith("/")
        ? targetName
        : `/workspace/${targetName.replace(/^\.\//, "")}`;
      const body = lines.slice(firstNonEmptyIdx + 1).join("\n");
      return {
        pythonCode: "",
        pipInstalls: [],
        imports: [],
        timingMode: "none",
        captureOutput: false,
        writeFile: { path: targetPath, content: body, append },
        magicNotices: [`${append ? "Appending to" : "Writing"} ${targetPath}`],
      };
    }

    if (
      firstTrim === "%%html" ||
      firstTrim === "%%markdown" ||
      firstTrim === "%%md" ||
      firstTrim === "%%svg"
    ) {
      const kind =
        firstTrim === "%%html"
          ? "html"
          : firstTrim === "%%svg"
          ? "svg"
          : "markdown";
      return {
        pythonCode: "",
        pipInstalls: [],
        imports: [],
        timingMode: "none",
        captureOutput: false,
        magicRender: {
          kind,
          content: lines.slice(firstNonEmptyIdx + 1).join("\n"),
        },
        magicNotices: [],
      };
    }
  }

  let tripleQuote: '"""' | "'''" | null = null;
  const outputLines: string[] = [];

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const trimmed = line.trim();
    const indent = line.slice(0, line.length - line.trimStart().length);

    if (tripleQuote) {
      outputLines.push(line);
      let scan = 0;
      while (scan < line.length) {
        if (line[scan] === "\\") {
          scan += 2;
          continue;
        }
        if (line.slice(scan, scan + 3) === tripleQuote) {
          tripleQuote = null;
          scan += 3;
          break;
        }
        scan++;
      }
      continue;
    }

    if (idx === firstNonEmptyIdx && /^%%(?:time|timeit)\b/.test(trimmed)) {
      timingMode = "cell";
      outputLines.push(`${indent}# [velqora-magic] ${trimmed}`);
      continue;
    }

    if (idx === firstNonEmptyIdx && /^%%capture\b/.test(trimmed)) {
      captureOutput = true;
      outputLines.push(`${indent}# [velqora-magic] ${trimmed}`);
      continue;
    }

    if (
      idx === firstNonEmptyIdx &&
      /^%%(?:bash|sh|shell)\b/.test(trimmed)
    ) {
      outputLines.push(`${indent}# [velqora-magic] ${trimmed}`);
      for (let j = idx + 1; j < lines.length; j++) {
        const subLine = lines[j];
        const subTrim = subLine.trim();
        const subIndent = subLine.slice(
          0,
          subLine.length - subLine.trimStart().length
        );
        if (!subTrim || subTrim.startsWith("#")) {
          outputLines.push(subLine);
          continue;
        }
        if (/^pip3?\s+install\b/.test(subTrim)) {
          const parsed = parsePipInstallArgs(subTrim.replace(/^pip3?\s+/, ""));
          pipInstalls.push(...parsed.packages);
          if (parsed.skippedNotice) magicNotices.push(parsed.skippedNotice);
          outputLines.push(`${subIndent}# [velqora-pip] ${subTrim}`);
        } else {
          outputLines.push(translateShellCommandLine(subTrim, subIndent));
        }
      }
      break;
    }

    // Line magics (`!pip ...`, `%pip ...`, `%matplotlib ...`, shell bangs, `obj?`)
    if (/^(?:!|%)pip3?\s+install\b/.test(trimmed)) {
      const afterInstall = trimmed.replace(/^(?:!|%)pip3?\s+/, "");
      const parsed = parsePipInstallArgs(afterInstall);
      pipInstalls.push(...parsed.packages);
      if (parsed.skippedNotice) magicNotices.push(parsed.skippedNotice);
      outputLines.push(`${indent}# [velqora-pip] ${trimmed}`);
      continue;
    }

    if (
      /^%(?:matplotlib|config|load_ext|reload_ext|autoreload|aimport)\b/.test(
        trimmed
      )
    ) {
      outputLines.push(`${indent}# [velqora-magic] ${trimmed}`);
      continue;
    }

    if (/^%time(?:it)?\s+/.test(trimmed)) {
      timingMode = "cell";
      const stmt = trimmed.replace(/^%time(?:it)?\s+/, "");
      outputLines.push(`${indent}${stmt}`);
      continue;
    }

    if (trimmed.startsWith("!")) {
      outputLines.push(translateShellCommandLine(trimmed.slice(1), indent));
      continue;
    }

    // Jupyter help syntax: `np.mean?` or `?print`
    const suffixHelp = trimmed.match(/^([A-Za-z_][A-Za-z0-9_.]*)\?\??$/);
    if (suffixHelp) {
      outputLines.push(`${indent}help(${suffixHelp[1]})`);
      continue;
    }
    const prefixHelp = trimmed.match(/^\?\??([A-Za-z_][A-Za-z0-9_.]*)$/);
    if (prefixHelp) {
      outputLines.push(`${indent}help(${prefixHelp[1]})`);
      continue;
    }

    // Normal Python line: track opening/closing triple quotes accurately
    outputLines.push(line);
    let qSingle: '"' | "'" | null = null;
    for (let k = 0; k < line.length; k++) {
      const ch = line[k];
      if (tripleQuote) {
        if (line.slice(k, k + 3) === tripleQuote) {
          tripleQuote = null;
          k += 2;
        }
        continue;
      }
      if (qSingle) {
        if (ch === "\\") {
          k++;
        } else if (ch === qSingle) {
          qSingle = null;
        }
        continue;
      }
      if (ch === "#") break;
      const tri = line.slice(k, k + 3);
      if (tri === '"""' || tri === "'''") {
        tripleQuote = tri;
        k += 2;
        continue;
      }
      if (ch === '"' || ch === "'") {
        qSingle = ch;
      }
    }
  }

  const pythonCode = outputLines.join("\n");
  return {
    pythonCode,
    pipInstalls: Array.from(new Set(pipInstalls)),
    imports: extractPythonImports(pythonCode),
    timingMode,
    captureOutput,
    magicNotices,
  };
}
