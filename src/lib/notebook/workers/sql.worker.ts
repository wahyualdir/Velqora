/// <reference lib="webworker" />

(self as unknown as Record<string, unknown>)._N_E =
  (self as unknown as Record<string, unknown>)._N_E || {};

import type {
  DataFramePayload,
  RichCellOutput,
  SqlResultPayload,
  SqlTableMeta,
  VariableSummary,
} from "../types";

type SqlJsModule = typeof import("sql.js");
type SqlStatic = Awaited<ReturnType<SqlJsModule["default"]>>;
type SqlDatabase = InstanceType<SqlStatic["Database"]>;

let sqlStaticPromise: Promise<SqlStatic> | null = null;
let db: SqlDatabase | null = null;
let originBase = "";

async function ensureSqlStatic(): Promise<SqlStatic> {
  if (!sqlStaticPromise) {
    sqlStaticPromise = (async () => {
      const mod = await import("sql.js");
      const initSqlJs =
        (mod as unknown as { default?: SqlJsModule["default"] }).default ||
        (mod as unknown as SqlJsModule["default"]);
      const base =
        originBase ||
        (typeof self !== "undefined" && self.location?.origin
          ? self.location.origin
          : "");
      return initSqlJs({
        locateFile: (file: string) => `${base}/wasm/${file}`,
      });
    })();
  }
  return sqlStaticPromise;
}

async function ensureDb(initialBytes?: Uint8Array | null): Promise<SqlDatabase> {
  const SQL = await ensureSqlStatic();
  if (initialBytes && initialBytes.byteLength > 0) {
    if (db) db.close();
    db = new SQL.Database(initialBytes);
    db.run("PRAGMA foreign_keys = ON;");
    return db;
  }
  if (!db) {
    db = new SQL.Database();
    db.run("PRAGMA foreign_keys = ON;");
  }
  return db;
}

function collectTablesMeta(database: SqlDatabase): SqlTableMeta[] {
  const tables: SqlTableMeta[] = [];
  const res = database.exec(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"
  );
  if (res.length === 0) return tables;

  for (const row of res[0].values) {
    const name = String(row[0]);
    const info = database.exec(`PRAGMA table_info("${name.replace(/"/g, '""')}");`);
    const columns =
      info.length > 0
        ? info[0].values.map((colRow) => ({
            name: String(colRow[1]),
            type: String(colRow[2] || "TEXT"),
            pk: Number(colRow[5]) > 0,
          }))
        : [];
    let rowCount = 0;
    try {
      const cnt = database.exec(`SELECT COUNT(*) FROM "${name.replace(/"/g, '""')}";`);
      if (cnt.length > 0) {
        rowCount = Number(cnt[0].values[0][0] || 0);
      }
    } catch {
      rowCount = 0;
    }
    tables.push({ name, rowCount, columns });
  }
  return tables;
}

function tablesToVariables(tables: SqlTableMeta[]): VariableSummary[] {
  return tables.map((t) => ({
    name: t.name,
    kernel: "sql",
    type: "SQL Table",
    shape: `(${t.rowCount}, ${t.columns.length})`,
    preview: t.columns.map((c) => `${c.name}:${c.type}`).join(", "),
    isTabular: true,
    columns: t.columns.map((c) => c.name),
  }));
}

function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  let cur = "";
  let inSingle = false;
  let inDouble = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    const next = sql[i + 1];

    if (inLineComment) {
      if (ch === "\n") inLineComment = false;
      cur += ch;
      continue;
    }
    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        cur += "*/";
        i++;
        continue;
      }
      cur += ch;
      continue;
    }
    if (!inSingle && !inDouble) {
      if (ch === "-" && next === "-") {
        inLineComment = true;
        cur += "--";
        i++;
        continue;
      }
      if (ch === "/" && next === "*") {
        inBlockComment = true;
        cur += "/*";
        i++;
        continue;
      }
    }
    if (ch === "'" && !inDouble) {
      if (inSingle && next === "'") {
        cur += "''";
        i++;
        continue;
      }
      inSingle = !inSingle;
    } else if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
    }

    if (ch === ";" && !inSingle && !inDouble) {
      if (cur.trim()) statements.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) statements.push(cur.trim());
  return statements;
}

function detectStatementType(stmt: string): string {
  const cleaned = stmt.replace(/^(\s*--.*(\r?\n|$))+/g, "").trim();
  const firstWord = cleaned.split(/\s+/)[0]?.toUpperCase() || "SQL";
  return firstWord;
}

function mountTabularObject(
  database: SqlDatabase,
  tableName: string,
  columns: string[],
  rows: Record<string, unknown>[] | unknown[][]
) {
  const safeTable = tableName.replace(/[^a-zA-Z0-9_]/g, "_").replace(/^(\d)/, "t_$1") || "dataset";
  const safeCols = columns.map(
    (c, idx) => c.replace(/[^a-zA-Z0-9_]/g, "_") || `col_${idx + 1}`
  );

  database.run(`DROP TABLE IF EXISTS "${safeTable}";`);

  const inferType = (colName: string, colIdx: number) => {
    let sawReal = false;
    let sawInt = false;
    for (let i = 0; i < Math.min(rows.length, 50); i++) {
      const r = rows[i];
      const val = Array.isArray(r) ? r[colIdx] : (r as Record<string, unknown>)[colName];
      if (val === null || val === undefined || val === "") continue;
      if (typeof val === "number") {
        if (Number.isInteger(val)) sawInt = true;
        else sawReal = true;
      } else {
        return "TEXT";
      }
    }
    if (sawReal) return "REAL";
    if (sawInt) return "INTEGER";
    return "TEXT";
  };

  const colDefs = safeCols
    .map((sc, idx) => `"${sc}" ${inferType(columns[idx], idx)}`)
    .join(", ");
  database.run(`CREATE TABLE "${safeTable}" (${colDefs});`);

  if (rows.length > 0) {
    const placeholders = safeCols.map(() => "?").join(", ");
    const stmt = database.prepare(
      `INSERT INTO "${safeTable}" (${safeCols.map((c) => `"${c}"`).join(", ")}) VALUES (${placeholders});`
    );
    database.run("BEGIN TRANSACTION;");
    try {
      for (const r of rows) {
        const values = columns.map((origCol, idx) => {
          const val = Array.isArray(r)
            ? r[idx]
            : (r as Record<string, unknown>)[origCol];
          if (val === undefined || val === null) return null;
          if (typeof val === "boolean") return val ? 1 : 0;
          if (typeof val === "object") return JSON.stringify(val);
          return val as string | number;
        });
        stmt.run(values);
      }
      database.run("COMMIT;");
    } catch (err) {
      database.run("ROLLBACK;");
      throw err;
    } finally {
      stmt.free();
    }
  }
}

self.onmessage = async (event: MessageEvent) => {
  const msg = event.data;
  if (!msg || typeof msg !== "object") return;

  if (msg.type === "init") {
    originBase = msg.origin || "";
    try {
      const database = await ensureDb(msg.dbBytes || null);
      const tables = collectTablesMeta(database);
      self.postMessage({
        type: "ready",
        tables,
        variables: tablesToVariables(tables),
      });
    } catch (err: any) {
      self.postMessage({
        type: "boot_error",
        error: err?.message || String(err),
      });
    }
    return;
  }

  if (msg.type === "mount_table") {
    try {
      const database = await ensureDb();
      mountTabularObject(database, msg.tableName, msg.columns, msg.rows);
      const tables = collectTablesMeta(database);
      self.postMessage({
        type: "table_mounted",
        requestId: msg.requestId,
        tableName: msg.tableName,
        tables,
        variables: tablesToVariables(tables),
        dbBytes: database.export(),
      });
    } catch (err: any) {
      self.postMessage({
        type: "mount_error",
        requestId: msg.requestId,
        error: err?.message || String(err),
      });
    }
    return;
  }

  if (msg.type === "reset") {
    if (db) {
      db.close();
      db = null;
    }
    const database = await ensureDb();
    const tables = collectTablesMeta(database);
    self.postMessage({
      type: "ready",
      tables,
      variables: tablesToVariables(tables),
    });
    return;
  }

  if (msg.type === "execute") {
    const start = performance.now();
    const outputs: RichCellOutput[] = [];
    let success = true;

    try {
      const database = await ensureDb();

      // Cross-Kernel DataFrame Bridge: mount synced Python DataFrames before running SQL
      if (msg.syncedDataFrames && typeof msg.syncedDataFrames === "object") {
        const entries = Object.entries(
          msg.syncedDataFrames as Record<string, DataFramePayload>
        );
        for (const [dfName, payload] of entries) {
          mountTabularObject(
            database,
            dfName,
            payload.columns.map((c) => c.name),
            payload.rows
          );
        }
      }

      const statements = splitSqlStatements(String(msg.code || ""));
      let mutated = false;

      for (const stmt of statements) {
        const stmtType = detectStatementType(stmt);
        const stmtStart = performance.now();
        const resultSets = database.exec(stmt);
        const stmtMs = performance.now() - stmtStart;

        if (["CREATE", "DROP", "ALTER", "INSERT", "UPDATE", "DELETE"].includes(stmtType)) {
          mutated = true;
        }

        if (resultSets.length > 0) {
          for (const set of resultSets) {
            const sqlRes: SqlResultPayload = {
              columns: set.columns,
              rows: set.values.slice(0, 1000),
              rowCount: set.values.length,
              changes: 0,
              statementType: stmtType,
              executionMs: Number(stmtMs.toFixed(2)),
            };
            outputs.push({ kind: "sql_result", data: sqlRes });
          }
        } else {
          const changes = database.getRowsModified();
          outputs.push({
            kind: "stream",
            name: "stdout",
            text:
              changes > 0
                ? `[${stmtType}] Berhasil (${changes} baris terpengaruh, ${stmtMs.toFixed(1)} ms)`
                : `[${stmtType}] Eksekusi selesai (${stmtMs.toFixed(1)} ms)`,
          });
        }
      }

      if (outputs.length === 0) {
        outputs.push({
          kind: "stream",
          name: "stdout",
          text: "(Tidak ada pernyataan SQL untuk dijalankan.)",
        });
      }

      const tables = collectTablesMeta(database);
      const end = performance.now();

      self.postMessage({
        type: "result",
        cellId: msg.cellId,
        requestId: msg.requestId,
        success,
        outputs,
        executionMs: Math.round(end - start),
        tables,
        variables: tablesToVariables(tables),
        dbBytes: mutated ? database.export() : undefined,
      });
    } catch (err: any) {
      success = false;
      const errMsg = err?.message || String(err);
      outputs.push({
        kind: "error",
        ename: "SQLiteError",
        evalue: errMsg,
        traceback: [errMsg],
      });
      const tables = db ? collectTablesMeta(db) : [];
      const end = performance.now();
      self.postMessage({
        type: "result",
        cellId: msg.cellId,
        requestId: msg.requestId,
        success,
        outputs,
        executionMs: Math.round(end - start),
        tables,
        variables: tablesToVariables(tables),
      });
    }
  }
};
