import type { DagNodeInfo, NotebookCell, StaleStatus } from "./types";

const PYTHON_KEYWORDS = new Set([
  "False",
  "None",
  "True",
  "and",
  "as",
  "assert",
  "async",
  "await",
  "break",
  "class",
  "continue",
  "def",
  "del",
  "elif",
  "else",
  "except",
  "finally",
  "for",
  "from",
  "global",
  "if",
  "import",
  "in",
  "is",
  "lambda",
  "nonlocal",
  "not",
  "or",
  "pass",
  "raise",
  "return",
  "try",
  "while",
  "with",
  "yield",
  "print",
  "len",
  "range",
  "enumerate",
  "zip",
  "map",
  "filter",
  "sum",
  "min",
  "max",
  "abs",
  "round",
  "sorted",
  "list",
  "dict",
  "set",
  "tuple",
  "str",
  "int",
  "float",
  "bool",
  "type",
  "isinstance",
  "open",
  "Exception",
  "ValueError",
]);

const JS_KEYWORDS = new Set([
  "async",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "default",
  "delete",
  "do",
  "else",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "let",
  "new",
  "null",
  "return",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "undefined",
  "var",
  "void",
  "while",
  "console",
  "Math",
  "JSON",
  "Array",
  "Object",
  "String",
  "Number",
  "Boolean",
  "Date",
  "Promise",
  "Set",
  "Map",
  "display",
]);

const SQL_KEYWORDS = new Set([
  "SELECT",
  "FROM",
  "WHERE",
  "JOIN",
  "INNER",
  "LEFT",
  "RIGHT",
  "FULL",
  "ON",
  "AS",
  "AND",
  "OR",
  "NOT",
  "NULL",
  "IS",
  "IN",
  "GROUP",
  "BY",
  "HAVING",
  "ORDER",
  "ASC",
  "DESC",
  "LIMIT",
  "OFFSET",
  "CREATE",
  "TABLE",
  "IF",
  "EXISTS",
  "INSERT",
  "INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE",
  "DROP",
  "ALTER",
  "WITH",
  "COUNT",
  "SUM",
  "AVG",
  "MIN",
  "MAX",
  "DISTINCT",
  "CASE",
  "WHEN",
  "THEN",
  "ELSE",
  "END",
]);

function stripCommentsAndStrings(
  source: string,
  language: "python" | "sql" | "js"
): string {
  if (language === "python") {
    return source
      .replace(/'''[\s\S]*?'''|"""[\s\S]*?"""/g, " ")
      .replace(/(['"])(?:\\.|(?!\1)[^\\\n])*\1/g, " ")
      .replace(/#.*$/gm, "");
  }
  if (language === "sql") {
    return source
      .replace(/'(?:''|[^'])*'/g, " ")
      .replace(/--.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, " ");
  }
  return source
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\/\/.*$/gm, "")
    .replace(/(['"`])(?:\\.|(?!\1)[^\\])*\1/g, " ");
}

export function extractCellSymbols(cell: Pick<NotebookCell, "type" | "kernel" | "source">): {
  defines: string[];
  uses: string[];
} {
  if (cell.type !== "code" || !cell.source.trim()) {
    return { defines: [], uses: [] };
  }

  const defines = new Set<string>();
  const uses = new Set<string>();

  if (cell.kernel === "python") {
    const clean = stripCommentsAndStrings(cell.source, "python");
    const lines = clean.split(/\r?\n/);

    for (const line of lines) {
      // Only treat zero-indented (top-level) assignments / defs / classes / imports as cell exports
      const topAssign = line.match(
        /^([A-Za-z_][A-Za-z0-9_]*(?:\s*,\s*[A-Za-z_][A-Za-z0-9_]*)*)\s*(?::[^=]+)?=(?!=)/
      );
      if (topAssign) {
        topAssign[1].split(",").forEach((s) => {
          const id = s.trim();
          if (id && !PYTHON_KEYWORDS.has(id)) defines.add(id);
        });
      }

      const defMatch = line.match(/^(?:async\s+)?def\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/);
      if (defMatch) defines.add(defMatch[1]);

      const classMatch = line.match(/^class\s+([A-Za-z_][A-Za-z0-9_]*)\b/);
      if (classMatch) defines.add(classMatch[1]);

      const importAs = line.match(/^import\s+.+?\s+as\s+([A-Za-z_][A-Za-z0-9_]*)/);
      if (importAs) {
        defines.add(importAs[1]);
      } else {
        const simpleImport = line.match(/^import\s+([A-Za-z_][A-Za-z0-9_]*)/);
        if (simpleImport) defines.add(simpleImport[1]);
      }

      const fromImport = line.match(/^from\s+\S+\s+import\s+(.+)$/);
      if (fromImport) {
        fromImport[1].split(",").forEach((part) => {
          const asMatch = part.trim().match(/\s+as\s+([A-Za-z_][A-Za-z0-9_]*)$/);
          const sym = asMatch ? asMatch[1] : part.trim().split(/\s+/)[0];
          if (sym && sym !== "*" && !PYTHON_KEYWORDS.has(sym)) {
            defines.add(sym);
          }
        });
      }
    }

    // Collect referenced identifiers (excluding member attribute access after `.` and defs)
    const tokenRegex = /(^|[^.\w])([A-Za-z_][A-Za-z0-9_]*)/g;
    let m: RegExpExecArray | null;
    while ((m = tokenRegex.exec(clean)) !== null) {
      const sym = m[2];
      if (!PYTHON_KEYWORDS.has(sym) && !defines.has(sym)) {
        uses.add(sym);
      }
    }
  } else if (cell.kernel === "sql") {
    // Check cross-kernel sync directive `--@sync python:df` or `--@from df`
    const syncMatches = cell.source.matchAll(/--\s*@(?:sync|from)\s+(?:python:)?([A-Za-z_][A-Za-z0-9_]*)/gi);
    for (const sm of syncMatches) {
      uses.add(sm[1]);
    }

    const clean = stripCommentsAndStrings(cell.source, "sql");
    const createTable = clean.matchAll(/CREATE\s+(?:TEMP\s+|TEMPORARY\s+)?TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([A-Za-z_][A-Za-z0-9_]*)/gi);
    for (const ct of createTable) {
      defines.add(`sql:${ct[1].toLowerCase()}`);
    }

    const insertTable = clean.matchAll(/(?:INSERT\s+INTO|UPDATE|DELETE\s+FROM)\s+([A-Za-z_][A-Za-z0-9_]*)/gi);
    for (const it of insertTable) {
      defines.add(`sql:${it[1].toLowerCase()}`);
    }

    const fromJoin = clean.matchAll(/(?:FROM|JOIN)\s+([A-Za-z_][A-Za-z0-9_]*)/gi);
    for (const fj of fromJoin) {
      const tbl = fj[1].toLowerCase();
      if (!SQL_KEYWORDS.has(tbl.toUpperCase()) && !defines.has(`sql:${tbl}`)) {
        uses.add(`sql:${tbl}`);
        uses.add(fj[1]); // Also match Python DataFrame variable name if auto-bridged!
      }
    }
  } else {
    const clean = stripCommentsAndStrings(cell.source, "js");
    const declMatches = clean.matchAll(
      /(?:^|\n)\s*(?:export\s+)?(?:const|let|var|(?:async\s+)?function|class)\s+([A-Za-z_$][A-Za-z0-9_$]*)/g
    );
    for (const dm of declMatches) {
      defines.add(dm[1]);
    }

    const tokenRegex = /(^|[^.\w])([A-Za-z_$][A-Za-z0-9_$]*)/g;
    let m: RegExpExecArray | null;
    while ((m = tokenRegex.exec(clean)) !== null) {
      const sym = m[2];
      if (!JS_KEYWORDS.has(sym) && !defines.has(sym)) {
        uses.add(sym);
      }
    }
  }

  return {
    defines: Array.from(defines),
    uses: Array.from(uses),
  };
}

/**
 * Menganalisis grafik dependensi (DAG) antar sel pada satu notebook untuk mendeteksi
 * sel `stale` (dependensi di atas berubah/dieksekusi ulang) dan `out_of_order`.
 */
export function analyzeNotebookDag(
  cells: NotebookCell[],
  runningCellIds: Set<string> = new Set()
): DagNodeInfo[] {
  const symbolProviders = new Map<string, string[]>();

  const perCell = cells.map((cell, index) => {
    const { defines, uses } = extractCellSymbols(cell);
    return { cell, index, defines, uses };
  });

  // First pass: map symbol -> providing cells (ordered by index)
  for (const item of perCell) {
    for (const sym of item.defines) {
      const list = symbolProviders.get(sym) || [];
      list.push(item.cell.id);
      symbolProviders.set(sym, list);
    }
  }

  const upstreamMap = new Map<string, Set<string>>();
  const downstreamMap = new Map<string, Set<string>>();
  const cellIndexById = new Map<string, number>();

  for (const item of perCell) {
    upstreamMap.set(item.cell.id, new Set());
    downstreamMap.set(item.cell.id, new Set());
    cellIndexById.set(item.cell.id, item.index);
  }

  // Build DAG edges: use nearest preceding provider (or cross-kernel provider)
  for (const item of perCell) {
    if (item.cell.type !== "code") continue;
    for (const sym of item.uses) {
      const providers = symbolProviders.get(sym);
      if (!providers) continue;
      // Pick latest provider above this cell, or earliest provider if none above
      let bestProvider: string | undefined;
      for (const pid of providers) {
        if (pid === item.cell.id) continue;
        const pIdx = cellIndexById.get(pid) ?? -1;
        if (pIdx < item.index) {
          bestProvider = pid;
        }
      }
      if (bestProvider) {
        upstreamMap.get(item.cell.id)!.add(bestProvider);
        downstreamMap.get(bestProvider)!.add(item.cell.id);
      }
    }
  }

  const cellById = new Map(cells.map((c) => [c.id, c]));

  const nodes: DagNodeInfo[] = perCell.map(({ cell, index, defines, uses }) => {
    const upstreamCellIds = Array.from(upstreamMap.get(cell.id) || []);
    const downstreamCellIds = Array.from(downstreamMap.get(cell.id) || []);

    let status: StaleStatus = "idle";
    let staleReason: string | undefined;

    if (cell.type !== "code") {
      status = "idle";
    } else if (runningCellIds.has(cell.id)) {
      status = "running";
    } else if (cell.outputs.some((o) => o.kind === "error")) {
      status = "error";
    } else if (cell.lastExecutedAt === null) {
      status = "idle";
    } else if (cell.lastModifiedAt > cell.lastExecutedAt) {
      status = "stale";
      staleReason = "Kode sel diubah setelah eksekusi terakhir";
    } else {
      // Check upstream freshness
      const changedUpstream = upstreamCellIds.find((upId) => {
        const upCell = cellById.get(upId);
        if (!upCell) return false;
        if (upCell.lastExecutedAt === null) return true;
        return (
          upCell.lastExecutedAt > (cell.lastExecutedAt ?? 0) ||
          upCell.lastModifiedAt > upCell.lastExecutedAt
        );
      });

      if (changedUpstream) {
        const upIdx = (cellIndexById.get(changedUpstream) ?? 0) + 1;
        status = "stale";
        staleReason = `Sel [${upIdx}] (hulu) diperbarui atau dijalankan ulang`;
      } else {
        const outOfOrderUp = upstreamCellIds.find((upId) => {
          const upCell = cellById.get(upId);
          return (
            upCell &&
            upCell.executionOrder !== null &&
            cell.executionOrder !== null &&
            upCell.executionOrder > cell.executionOrder
          );
        });
        if (outOfOrderUp) {
          const upIdx = (cellIndexById.get(outOfOrderUp) ?? 0) + 1;
          status = "out_of_order";
          staleReason = `Sel [${upIdx}] dijalankan lebih akhir dari sel ini`;
        } else {
          status = "fresh";
        }
      }
    }

    return {
      cellId: cell.id,
      index,
      defines,
      uses,
      upstreamCellIds,
      downstreamCellIds,
      status,
      staleReason,
    };
  });

  // Propagate staleness transitively through already-executed downstream cells
  const nodeById = new Map(nodes.map((n) => [n.cellId, n]));
  let changed = true;
  while (changed) {
    changed = false;
    for (const node of nodes) {
      if (node.status !== "fresh" && node.status !== "out_of_order") continue;
      const staleUp = node.upstreamCellIds.find(
        (upId) => nodeById.get(upId)?.status === "stale"
      );
      if (staleUp) {
        const upIdx = (cellIndexById.get(staleUp) ?? 0) + 1;
        node.status = "stale";
        node.staleReason = `Bergantung pada Sel [${upIdx}] yang tidak sinkron (stale)`;
        changed = true;
      }
    }
  }

  return nodes;
}

/**
 * Mengembalikan urutan eksekusi topologis semua sel hilir (downstream) saat Reactive Mode aktif.
 */
export function getTopologicalDownstreamCellIds(
  cells: NotebookCell[],
  rootCellId: string
): string[] {
  const nodes = analyzeNotebookDag(cells);
  const nodeMap = new Map(nodes.map((n) => [n.cellId, n]));
  const root = nodeMap.get(rootCellId);
  if (!root) return [];

  const visited = new Set<string>();
  const reachable: string[] = [];

  const queue = [...root.downstreamCellIds];
  while (queue.length > 0) {
    const curId = queue.shift()!;
    if (visited.has(curId) || curId === rootCellId) continue;
    visited.add(curId);
    reachable.push(curId);
    const curNode = nodeMap.get(curId);
    if (curNode) {
      queue.push(...curNode.downstreamCellIds);
    }
  }

  // Sort deterministically by notebook document order to guarantee cycle-free sequential execution
  return reachable.sort((a, b) => {
    const idxA = nodeMap.get(a)?.index ?? 0;
    const idxB = nodeMap.get(b)?.index ?? 0;
    return idxA - idxB;
  });
}
