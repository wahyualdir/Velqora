const JS_RESERVED = new Set([
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "enum",
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
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "yield",
  "await",
  "async",
  "implements",
  "interface",
  "package",
  "private",
  "protected",
  "public",
  "static",
]);

function stripTopLevelTsInterfacesAndTypes(code: string): string {
  // Remove top-level `interface Name ... { ... }` cleanly supporting nested braces
  const res = code
    .replace(/^\s*import\s+type\s+[\s\S]*?;?\s*$/gm, "")
    .replace(/\bexport\s+(?=const|let|var|function|class|async)/g, "");

  let out = "";
  let i = 0;
  let quote: '"' | "'" | "`" | null = null;
  let braceDepth = 0;

  while (i < res.length) {
    const ch = res[i];
    const next = res[i + 1];

    if (quote) {
      out += ch;
      if (ch === "\\" && i + 1 < res.length) {
        out += res[++i];
      } else if (ch === quote) {
        quote = null;
      }
      i++;
      continue;
    }

    if (ch === "/" && next === "/") {
      while (i < res.length && res[i] !== "\n") {
        out += res[i++];
      }
      continue;
    }
    if (ch === "/" && next === "*") {
      while (i < res.length && !(res[i] === "*" && res[i + 1] === "/")) {
        out += res[i++];
      }
      if (i < res.length) {
        out += "*/";
        i += 2;
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      out += ch;
      i++;
      continue;
    }

    if (braceDepth === 0) {
      const slice = res.slice(i);
      const ifaceMatch = slice.match(
        /^(?:export\s+)?interface\s+[A-Za-z_$][A-Za-z0-9_$]*(?:<[^>{]*>)?(?:\s+extends\s+[^{]+)?\s*\{/
      );
      if (ifaceMatch && (i === 0 || /[\s;{}]/.test(res[i - 1]))) {
        i += ifaceMatch[0].length;
        let depth = 1;
        while (i < res.length && depth > 0) {
          if (res[i] === "{") depth++;
          else if (res[i] === "}") depth--;
          i++;
        }
        continue;
      }

      const typeAliasMatch = slice.match(
        /^(?:export\s+)?type\s+[A-Za-z_$][A-Za-z0-9_$]*(?:<[^>=]*>)?\s*=\s*[^;\n]+;?/
      );
      if (typeAliasMatch && (i === 0 || /[\s;{}]/.test(res[i - 1]))) {
        i += typeAliasMatch[0].length;
        continue;
      }
    }

    if (ch === "{") braceDepth++;
    else if (ch === "}") braceDepth = Math.max(0, braceDepth - 1);

    out += ch;
    i++;
  }

  // Strip common inline TypeScript type annotations outside strings safely enough for notebook scripts
  out = out
    .replace(
      /:\s*(?:readonly\s+)?(?:string|number|boolean|any|void|unknown|never|object|Record<[^>\n]+>|Array<[^>\n]+>|Promise<[^>\n]+>|Set<[^>\n]+>|Map<[^>\n]+>|Partial<[^>\n]+>|[A-Za-z_$][A-Za-z0-9_$]*(?:\[\])?)(?=\s*[=),;\n{])/g,
      (full, offset, src) => {
        // Avoid stripping ternary `cond ? a : number` or object literal `{ key: value }` checks:
        // Only strip when preceded by identifier/closing paren (parameter, variable decl, or function return type)
        const before = src.slice(Math.max(0, offset - 40), offset);
        if (/\)\s*$/.test(before)) return "";
        if (/(?:const|let|var|[(,])\s*[A-Za-z_$][A-Za-z0-9_$]*\??\s*$/.test(before)) {
          return "";
        }
        return full;
      }
    )
    .replace(/\s+as\s+(?:const|unknown|any|string|number|boolean|[A-Za-z_$][A-Za-z0-9_$]*(?:\[\])?)/g, "");

  return out;
}

function extractIdentifiersFromBindingPattern(pattern: string): string[] {
  const names: string[] = [];
  let cleaned = pattern.replace(/'[^']*'|"[^"]*"/g, "");
  // In object destructuring `{ a: localA, b = 1 }`, remove `a:` key prefixes before scanning identifiers
  cleaned = cleaned.replace(/([A-Za-z_$][A-Za-z0-9_$]*)\s*:/g, "");
  const matches = cleaned.matchAll(/\b([A-Za-z_$][A-Za-z0-9_$]*)\b/g);
  for (const m of matches) {
    const id = m[1];
    if (!JS_RESERVED.has(id)) {
      names.push(id);
    }
  }
  return names;
}

function isKeywordAtBoundary(src: string, index: number): boolean {
  if (index === 0) return true;
  return !/[A-Za-z0-9_$.]/.test(src[index - 1]);
}

export interface JsTsTransformResult {
  body: string;
  declaredNames: string[];
}

/**
 * Mengubah kode JavaScript/TypeScript sel notebook agar:
 * 1. `const`/`let` di scope terdalam fungsi/blok TETAP aman tidak tersentuh.
 * 2. `const`/`let` di top-level (depth 0) diubah ke `var` sehingga variabel bisa diakses di sel sama
 *    MAUPUN dideklarasikan ulang tanpa `SyntaxError: already been declared`.
 * 3. Semua variabel/fungsi/kelas top-level disinkronkan ke `__scope` di blok `finally`.
 * 4. Ekspresi terakhir tanpa `return` otomatis dikembalikan agar tampil seperti REPL/Colab.
 */
export function transformJsTsCellCode(
  rawCode: string,
  isTypeScript: boolean,
  existingScopeKeys: string[]
): JsTsTransformResult {
  const baseCode = isTypeScript
    ? stripTopLevelTsInterfacesAndTypes(rawCode)
    : rawCode;

  let transformed = "";
  const declared = new Set<string>();

  let i = 0;
  let quote: '"' | "'" | "`" | null = null;
  let depth = 0; // combined { [ ( nesting depth
  let lastTopStmtStart = 0;
  const topStatements: Array<{ start: number; end: number; text: string }> = [];

  while (i < baseCode.length) {
    const ch = baseCode[i];
    const next = baseCode[i + 1];

    if (quote) {
      transformed += ch;
      if (ch === "\\" && i + 1 < baseCode.length) {
        transformed += baseCode[++i];
      } else if (ch === quote) {
        quote = null;
      }
      i++;
      continue;
    }

    if (ch === "/" && next === "/") {
      while (i < baseCode.length && baseCode[i] !== "\n") {
        transformed += baseCode[i++];
      }
      continue;
    }
    if (ch === "/" && next === "*") {
      while (i < baseCode.length && !(baseCode[i] === "*" && baseCode[i + 1] === "/")) {
        transformed += baseCode[i++];
      }
      if (i < baseCode.length) {
        transformed += "*/";
        i += 2;
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      transformed += ch;
      i++;
      continue;
    }

    // Only examine declarations at top-level (depth === 0)
    if (depth === 0 && isKeywordAtBoundary(baseCode, i)) {
      const slice = baseCode.slice(i);

      const declMatch = slice.match(/^(const|let|var)(?=\s)/);
      if (declMatch) {
        const kwLen = declMatch[1].length;
        // Look ahead to find LHS binding pattern up to `=` / `;` / `\n`
        let look = kwLen;
        let patDepth = 0;
        let lhs = "";
        while (i + look < baseCode.length) {
          const c = baseCode[i + look];
          if (c === "{" || c === "[" || c === "(") patDepth++;
          else if (c === "}" || c === "]" || c === ")") patDepth = Math.max(0, patDepth - 1);
          if (patDepth === 0 && (c === "=" || c === ";" || c === "\n")) {
            break;
          }
          lhs += c;
          look++;
        }
        extractIdentifiersFromBindingPattern(lhs).forEach((name) =>
          declared.add(name)
        );
        // Rewrite top-level `const`/`let` to `var` so re-running or redefining works cleanly
        transformed += "var";
        i += kwLen;
        continue;
      }

      const fnMatch = slice.match(/^(async\s+)?function\s+([A-Za-z_$][A-Za-z0-9_$]*)/);
      if (fnMatch) {
        declared.add(fnMatch[2]);
      }

      const classMatch = slice.match(/^class\s+([A-Za-z_$][A-Za-z0-9_$]*)/);
      if (classMatch) {
        declared.add(classMatch[1]);
      }
    }

    if (ch === "{" || ch === "[" || ch === "(") {
      depth++;
    } else if (ch === "}" || ch === "]" || ch === ")") {
      depth = Math.max(0, depth - 1);
    }

    transformed += ch;

    if (depth === 0 && ch === ";") {
      const stmt = transformed.slice(lastTopStmtStart, transformed.length).trim();
      if (stmt) {
        topStatements.push({
          start: lastTopStmtStart,
          end: transformed.length,
          text: stmt,
        });
      }
      lastTopStmtStart = transformed.length;
    } else if (depth === 0 && ch === "}") {
      const stmtSoFar = transformed.slice(lastTopStmtStart, transformed.length).trim();
      const restTrimmed = baseCode.slice(i + 1).trimStart();
      if (
        /^(?:(?:async\s+)?function\b|class\b|for\b|while\b)/.test(stmtSoFar) &&
        !restTrimmed.startsWith(";")
      ) {
        topStatements.push({
          start: lastTopStmtStart,
          end: transformed.length,
          text: stmtSoFar,
        });
        lastTopStmtStart = transformed.length;
      } else if (
        /^(?:if|try|else)\b/.test(stmtSoFar) &&
        !/^(?:;|else\b|catch\b|finally\b)/.test(restTrimmed)
      ) {
        topStatements.push({
          start: lastTopStmtStart,
          end: transformed.length,
          text: stmtSoFar,
        });
        lastTopStmtStart = transformed.length;
      }
    } else if (depth === 0 && ch === "\n") {
      const rawChunk = transformed.slice(lastTopStmtStart, transformed.length);
      const trimmedRaw = rawChunk.trim();
      const noCommentEnd = rawChunk
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/[^\n]*/g, "")
        .trim();
      const isLineEnded =
        noCommentEnd.length > 0 &&
        !/(?:=|\+|-|\*|\/|%|\*\*|&&|\|\||\?\?|,|\.|\?|:|=>|\(|\[|\{|\b(?:return|throw|await|typeof|void|delete|new|case|yield))$/.test(
          noCommentEnd
        );

      if (isLineEnded) {
        const restAfterNewline = baseCode
          .slice(i + 1)
          .replace(/^(?:\s|\/\/[^\n]*|\/\*[\s\S]*?\*\/)+/, "");
        const nextContinues =
          restAfterNewline.length === 0 ||
          /^(?:;|\.|\[|\(|&&|\|\||\?\?|\?|:|\+|-|\*|\/|%|\b(?:else|catch|finally|instanceof|in)\b)/.test(
            restAfterNewline
          );
        if (!nextContinues && trimmedRaw) {
          topStatements.push({
            start: lastTopStmtStart,
            end: transformed.length,
            text: trimmedRaw,
          });
          lastTopStmtStart = transformed.length;
        }
      }
    }

    i++;
  }

  const tail = transformed.slice(lastTopStmtStart).trim();
  if (tail) {
    topStatements.push({
      start: lastTopStmtStart,
      end: transformed.length,
      text: tail,
    });
  }

  // Detect if the last top-level statement is an implicit returnable expression
  let finalCode = transformed;
  const lastStmt = topStatements[topStatements.length - 1];
  if (lastStmt) {
    const noComments = lastStmt.text
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/[^\n]*/g, "")
      .trim();
    const t = noComments.replace(/;+$/, "").trim();
    const isNonExprStatement =
      !t ||
      /^(?:var|let|const|function|async\s+function|class|if|for|while|do|switch|try|throw|return|break|continue|import|export)\b/.test(
        t
      ) ||
      (t.startsWith("{") && !t.startsWith("({"));
    // Avoid wrapping multi-line ASI blocks without explicit `;` separators
    const hasInnerNewlineStmt = /\n\s*(?:var|let|const|function|class|if|for|while|return)\b/.test(t);
    if (t.length > 0 && !isNonExprStatement && !hasInnerNewlineStmt) {
      finalCode =
        transformed.slice(0, lastStmt.start) +
        `\n__velqoraRet = (${t});\n` +
        transformed.slice(lastStmt.end);
    }
  }

  const validExistingKeys = existingScopeKeys.filter(
    (k) => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) && !JS_RESERVED.has(k)
  );

  const scopeRestore =
    validExistingKeys.length > 0
      ? `var { ${validExistingKeys.join(", ")} } = __scope;\n`
      : "";

  const declaredArr = Array.from(declared);
  const scopePersist = declaredArr
    .map(
      (name) =>
        `if (typeof ${name} !== "undefined") { __scope[${JSON.stringify(name)}] = ${name}; }`
    )
    .join("\n    ");

  const body = `
    ${scopeRestore}let __velqoraRet = undefined;
    try {
      ${finalCode}
    } finally {
      ${scopePersist}
    }
    return __velqoraRet;
  `;

  return {
    body,
    declaredNames: declaredArr,
  };
}
