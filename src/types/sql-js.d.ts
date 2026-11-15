declare module "sql.js" {
  export interface SqlJsQueryExecResult {
    columns: string[];
    values: Array<Array<number | string | Uint8Array | null>>;
  }

  export interface SqlJsDatabase {
    run(sql: string, params?: unknown): SqlJsDatabase;
    exec(sql: string, params?: unknown): SqlJsQueryExecResult[];
    getRowsModified(): number;
    close(): void;
  }

  export interface SqlJsStatic {
    Database: new (data?: ArrayLike<number> | Buffer | null) => SqlJsDatabase;
  }

  export interface SqlJsConfig {
    locateFile?: (url: string, scriptDirectory: string) => string;
  }

  export default function initSqlJs(config?: SqlJsConfig): Promise<SqlJsStatic>;
}
