export type NotebookKernel = "python" | "sql" | "javascript" | "typescript";

export type NotebookCellType = "code" | "markdown";

export type RuntimeMode = "wasm" | "remote_ws";

export type StaleStatus =
  | "fresh"
  | "stale"
  | "out_of_order"
  | "idle"
  | "running"
  | "error";

export type KernelBootState =
  | "idle"
  | "loading"
  | "ready"
  | "executing"
  | "installing_pkg"
  | "error"
  | "disconnected";

export type CellParamType =
  | "slider"
  | "number"
  | "integer"
  | "string"
  | "boolean"
  | "dropdown"
  | "date"
  | "raw";

export interface CellParamDef {
  name: string;
  label: string;
  type: CellParamType;
  value: string | number | boolean;
  lineIndex: number;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<string | number>;
  allowInput?: boolean;
}

export interface CellFormMeta {
  title?: string;
  description?: string;
  params: CellParamDef[];
}

export interface DataFrameColumnSummary {
  name: string;
  dtype: string;
  nullCount: number;
  uniqueCount: number;
  min?: number | string | null;
  max?: number | string | null;
  mean?: number | null;
  std?: number | null;
  histogram?: number[];
}

export interface DataFramePayload {
  variableName?: string;
  columns: DataFrameColumnSummary[];
  rows: Record<string, unknown>[];
  totalRows: number;
  totalColumns: number;
  truncated: boolean;
  memoryBytes?: number;
}

export interface SqlColumnMeta {
  name: string;
  type: string;
  pk?: boolean;
}

export interface SqlTableMeta {
  name: string;
  rowCount: number;
  columns: SqlColumnMeta[];
}

export interface SqlResultPayload {
  columns: string[];
  rows: unknown[][];
  rowCount: number;
  changes: number;
  statementType: string;
  executionMs: number;
  tablesSnapshot?: SqlTableMeta[];
}

export interface AutograderCaseResult {
  name: string;
  passed: boolean;
  message?: string;
}

export type RichCellOutput =
  | {
      kind: "stream";
      name: "stdout" | "stderr";
      text: string;
    }
  | {
      kind: "text";
      text: string;
      latex?: string;
    }
  | {
      kind: "image";
      mimeType: "image/png" | "image/svg+xml" | "image/jpeg";
      data: string;
      width?: number;
      height?: number;
      caption?: string;
    }
  | {
      kind: "html";
      html: string;
      height?: number;
    }
  | {
      kind: "markdown";
      markdown: string;
    }
  | {
      kind: "dataframe";
      data: DataFramePayload;
    }
  | {
      kind: "sql_result";
      data: SqlResultPayload;
    }
  | {
      kind: "plotly";
      spec: Record<string, unknown>;
    }
  | {
      kind: "error";
      ename: string;
      evalue: string;
      traceback: string[];
      lineNumber?: number;
    }
  | {
      kind: "test_result";
      passed: number;
      total: number;
      cases: AutograderCaseResult[];
    };

export interface VariableSummary {
  name: string;
  kernel: NotebookKernel;
  type: string;
  shape?: string;
  sizeBytes?: number;
  preview: string;
  isTabular?: boolean;
  columns?: string[];
}

export interface VfsFileEntry {
  path: string;
  name: string;
  size: number;
  mimeType: string;
  updatedAt: string;
  origin: "upload" | "kernel" | "dataset";
}

export interface NotebookCell {
  id: string;
  type: NotebookCellType;
  kernel: NotebookKernel;
  source: string;
  outputs: RichCellOutput[];
  executionCount: number | null;
  executionOrder: number | null;
  timingMs: number | null;
  memoryDeltaBytes?: number | null;
  lastModifiedAt: number;
  lastExecutedAt: number | null;
  collapsed?: boolean;
  outputCollapsed?: boolean;
  formMode?: "both" | "form" | "code";
  title?: string;
  testAssertions?: string;
  readOnly?: boolean;
}

export interface NotebookVersion {
  id: string;
  notebookId: string;
  label: string;
  cellsSnapshot: NotebookCell[];
  createdAt: string;
}

export interface NotebookDocument {
  id: string;
  title: string;
  description?: string;
  defaultKernel: NotebookKernel;
  runtimeMode: RuntimeMode;
  remoteUrl?: string;
  sourceTopicId?: string;
  sourceChapterId?: string;
  sourceSubchapterId?: string;
  sourceCodeId?: string;
  reactiveMode: boolean;
  editorMode: "codemirror" | "lite";
  cells: NotebookCell[];
  isPublic?: boolean;
  shareSlug?: string;
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DagNodeInfo {
  cellId: string;
  index: number;
  defines: string[];
  uses: string[];
  upstreamCellIds: string[];
  downstreamCellIds: string[];
  status: StaleStatus;
  staleReason?: string;
}

export interface KernelExecutionRequest {
  cellId: string;
  kernel: NotebookKernel;
  code: string;
  testAssertions?: string;
  reactiveVariables?: Record<string, unknown>;
  syncedDataFrames?: Record<string, DataFramePayload>;
  timeoutMs?: number;
}

export interface KernelExecutionResult {
  cellId: string;
  kernel: NotebookKernel;
  success: boolean;
  outputs: RichCellOutput[];
  executionMs: number;
  variables?: VariableSummary[];
  tables?: SqlTableMeta[];
  exportedDataFrames?: Record<string, DataFramePayload>;
  definedSymbols?: string[];
  usedSymbols?: string[];
  installedPackages?: string[];
  memoryDeltaBytes?: number;
}
