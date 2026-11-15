import type { CellFormMeta, CellParamDef, CellParamType } from "./types";

const PARAM_LINE_REGEX =
  /^(\s*)([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+?)\s*(?:#|\/\/|--)\s*@param(?:\s+(.*))?$/;
const TITLE_REGEX = /^\s*(?:#|\/\/|--)\s*@title\s+(.+)$/;
const MARKDOWN_REGEX = /^\s*(?:#|\/\/|--)\s*@markdown\s+(.+)$/;

function unquoteString(raw: string): string {
  const trimmed = raw.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed
      .slice(1, -1)
      .replace(/\\n/g, "\n")
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'");
  }
  return trimmed;
}

function parseRawValue(
  raw: string,
  type: CellParamType
): string | number | boolean {
  const trimmed = raw.trim();
  if (type === "boolean") {
    return trimmed.toLowerCase() === "true";
  }
  if (type === "number" || type === "integer" || type === "slider") {
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : 0;
  }
  if (type === "string" || type === "date") {
    return unquoteString(trimmed);
  }
  if (type === "dropdown") {
    if (
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
      return unquoteString(trimmed);
    }
    const n = Number(trimmed);
    if (Number.isFinite(n) && trimmed !== "") return n;
    return trimmed;
  }
  return trimmed;
}

function parseParamSpec(
  specRaw: string | undefined,
  rawVal: string
): {
  type: CellParamType;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<string | number>;
  allowInput?: boolean;
} {
  const spec = (specRaw || "").trim();

  // Case 1: Dropdown array syntax -> ["adam", "sgd"] or [10, 20, 50] with optional {allow-input: true}
  if (spec.startsWith("[")) {
    const closeIdx = spec.lastIndexOf("]");
    const listPart = closeIdx >= 0 ? spec.slice(0, closeIdx + 1) : spec;
    const trailing = closeIdx >= 0 ? spec.slice(closeIdx + 1).trim() : "";

    let options: Array<string | number> = [];
    try {
      const normalized = listPart.replace(/'/g, '"');
      const parsed = JSON.parse(normalized);
      if (Array.isArray(parsed)) {
        options = parsed.filter(
          (v): v is string | number =>
            typeof v === "string" || typeof v === "number"
        );
      }
    } catch {
      options = [];
    }

    const allowInput = /allow-input\s*:\s*true/i.test(trailing);
    return { type: "dropdown", options, allowInput };
  }

  // Case 2: JSON-like object syntax -> {type:"slider", min:0, max:10, step:0.5}
  if (spec.startsWith("{")) {
    try {
      const normalized = spec
        .replace(/([{,]\s*)([A-Za-z0-9_-]+)\s*:/g, '$1"$2":')
        .replace(/'/g, '"');
      const parsed = JSON.parse(normalized) as Record<string, unknown>;
      const typeStr = String(parsed.type || "string").toLowerCase();
      let type: CellParamType = "string";
      if (
        typeStr === "slider" ||
        typeStr === "number" ||
        typeStr === "integer" ||
        typeStr === "string" ||
        typeStr === "boolean" ||
        typeStr === "date" ||
        typeStr === "raw"
      ) {
        type = typeStr;
      }

      return {
        type,
        min: typeof parsed.min === "number" ? parsed.min : undefined,
        max: typeof parsed.max === "number" ? parsed.max : undefined,
        step: typeof parsed.step === "number" ? parsed.step : undefined,
        allowInput:
          parsed["allow-input"] === true || parsed.allowInput === true,
      };
    } catch {
      // Fallback heuristic if malformed object literal
    }
  }

  // Case 3: Infer from initial literal value
  const trimmed = rawVal.trim();
  if (trimmed === "True" || trimmed === "False" || trimmed === "true" || trimmed === "false") {
    return { type: "boolean" };
  }
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return { type: trimmed.includes(".") ? "number" : "integer" };
  }
  return { type: "string" };
}

function formatReadableLabel(varName: string): string {
  return varName
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Mengekstrak metadata form bergaya Google Colab (#@title, #@markdown, #@param)
 * dari source kode sel tanpa mengubah eksekusi kode.
 */
export function extractCellFormMeta(source: string): CellFormMeta {
  const lines = source.split(/\r?\n/);
  let title: string | undefined;
  const markdownParts: string[] = [];
  const params: CellParamDef[] = [];

  lines.forEach((line, idx) => {
    const titleMatch = line.match(TITLE_REGEX);
    if (titleMatch && !title) {
      title = titleMatch[1].trim();
      return;
    }

    const mdMatch = line.match(MARKDOWN_REGEX);
    if (mdMatch) {
      markdownParts.push(mdMatch[1].trim());
      return;
    }

    const paramMatch = line.match(PARAM_LINE_REGEX);
    if (paramMatch) {
      const [, , varName, rawVal, specRaw] = paramMatch;
      const spec = parseParamSpec(specRaw, rawVal);
      const value = parseRawValue(rawVal, spec.type);

      params.push({
        name: varName,
        label: formatReadableLabel(varName),
        type: spec.type,
        value,
        lineIndex: idx,
        min: spec.min ?? (spec.type === "slider" ? 0 : undefined),
        max: spec.max ?? (spec.type === "slider" ? 100 : undefined),
        step: spec.step ?? (spec.type === "slider" ? 1 : undefined),
        options: spec.options,
        allowInput: spec.allowInput,
      });
    }
  });

  return {
    title,
    description:
      markdownParts.length > 0 ? markdownParts.join("\n") : undefined,
    params,
  };
}

/**
 * Mengganti literal nilai parameter pada baris tepat tanpa merusak komentar `#@param`
 * atau indentasi kode di sekitarnya.
 */
export function updateCellParamValue(
  source: string,
  param: CellParamDef,
  nextValue: string | number | boolean,
  kernelLanguage: "python" | "sql" | "javascript" | "typescript" = "python"
): string {
  const lines = source.split(/\r?\n/);
  const targetLine = lines[param.lineIndex];
  if (targetLine === undefined) return source;

  const match = targetLine.match(
    /^(\s*)([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+?)(\s*(?:#|\/\/|--)\s*@param.*)$/
  );
  if (!match || match[2] !== param.name) return source;

  const [, indent, varName, , commentSuffix] = match;
  let formattedLiteral: string;

  switch (param.type) {
    case "boolean": {
      const boolVal = Boolean(nextValue);
      formattedLiteral =
        kernelLanguage === "python"
          ? boolVal
            ? "True"
            : "False"
          : boolVal
          ? "true"
          : "false";
      break;
    }
    case "slider":
    case "number":
    case "integer": {
      const num = Number(nextValue);
      const safeNum = Number.isFinite(num)
        ? param.type === "integer"
          ? Math.round(num)
          : num
        : 0;
      formattedLiteral = String(safeNum);
      break;
    }
    case "dropdown": {
      if (typeof nextValue === "number" && Number.isFinite(nextValue)) {
        formattedLiteral = String(nextValue);
      } else {
        formattedLiteral = JSON.stringify(String(nextValue));
      }
      break;
    }
    case "raw": {
      formattedLiteral = String(nextValue);
      break;
    }
    case "date":
    case "string":
    default: {
      formattedLiteral = JSON.stringify(String(nextValue));
      break;
    }
  }

  lines[param.lineIndex] = `${indent}${varName} = ${formattedLiteral}${commentSuffix}`;
  return lines.join("\n");
}
