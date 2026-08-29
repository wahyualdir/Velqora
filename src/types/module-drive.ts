export type FileCategory =
  | "pdf"
  | "word"
  | "excel"
  | "presentation"
  | "jupyter"
  | "python"
  | "code"
  | "markdown"
  | "archive"
  | "image"
  | "audio"
  | "video"
  | "text"
  | "other";

export interface ModuleDriveFolder {
  id: string;
  name: string;
  parentId: string | null; // null = root
  color?: string; // Hex color or badge preset
  icon?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ModuleSection {
  id: string;
  title: string;
  orderIndex: number;
  isCompleted: boolean;
  description?: string;
}

export interface ModuleDriveFile {
  id: string;
  name: string;
  path?: string; // Relative path inside project (e.g. src/model.py, data/train.csv)
  folderId: string | null; // null = root of module drive
  storagePath: string;
  url: string;
  size: number;
  fileType: string;
  extension: string;
  category: FileCategory;
  description?: string;
  uploadedAt: string;
  textContent?: string; // Cached or small text for code / notebook preview
}

export interface ModuleComment {
  id: string;
  userId: string;
  authorName: string;
  authorEmail?: string;
  authorRole?: string;
  content: string;
  targetId: string; // "module" or specific fileId / folderId
  targetName?: string;
  createdAt: string;
}

export interface ModuleReaction {
  userId: string;
  userName?: string;
  type: "like" | "dislike";
  targetId: string; // "module" or specific fileId
  createdAt: string;
}

export interface ModuleDrivePayload {
  version: "2.0";
  kind?: "module" | "project";
  techStack?: string[];
  programmingLanguage?: string;
  framework?: string;
  projectType?: string;
  repositoryUrl?: string;
  demoUrl?: string;
  authorName?: string;
  coverUrl?: string;
  sections?: ModuleSection[];
  folders: ModuleDriveFolder[];
  files: ModuleDriveFile[];
  comments?: ModuleComment[];
  reactions?: ModuleReaction[];
  updatedAt: string;
}

/**
 * Determine file category and metadata based on filename extension
 */
export function getFileCategory(filename: string): {
  category: FileCategory;
  extension: string;
  label: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
} {
  const parts = filename.split(".");
  const ext = parts.length > 1 ? parts.pop()?.toLowerCase() || "" : "";
  const lowerName = filename.toLowerCase();

  // Special config / dependency files
  if (lowerName === "requirements.txt") {
    return {
      category: "python",
      extension: "txt",
      label: "Python Dependencies",
      color: "#387eb8",
      badgeBg: "bg-sky-500/15",
      badgeBorder: "border-sky-500/30",
      badgeText: "text-sky-400",
    };
  }
  if (lowerName === "package.json" || lowerName === "package-lock.json" || lowerName === "yarn.lock" || lowerName === "pnpm-lock.yaml") {
    return {
      category: "code",
      extension: "json",
      label: "Node.js Dependencies",
      color: "#8b5cf6",
      badgeBg: "bg-purple-500/15",
      badgeBorder: "border-purple-500/30",
      badgeText: "text-purple-400",
    };
  }
  if (lowerName === ".env" || lowerName === ".env.example" || lowerName === ".env.local" || lowerName.endsWith(".toml") || lowerName.endsWith(".ini")) {
    return {
      category: "code",
      extension: ext || "env",
      label: "Environment Config",
      color: "#f59e0b",
      badgeBg: "bg-amber-500/15",
      badgeBorder: "border-amber-500/30",
      badgeText: "text-amber-400",
    };
  }

  switch (ext) {
    case "pdf":
      return {
        category: "pdf",
        extension: "pdf",
        label: "PDF Document",
        color: "#ef4444",
        badgeBg: "bg-red-500/15",
        badgeBorder: "border-red-500/30",
        badgeText: "text-red-400",
      };
    case "docx":
    case "doc":
    case "rtf":
    case "odt":
    case "epub":
      return {
        category: "word",
        extension: ext,
        label: ext === "epub" ? "E-Book EPUB" : "Word Document",
        color: "#2563eb",
        badgeBg: "bg-blue-500/15",
        badgeBorder: "border-blue-500/30",
        badgeText: "text-blue-400",
      };
    case "xlsx":
    case "xls":
    case "csv":
    case "tsv":
    case "ods":
      return {
        category: "excel",
        extension: ext,
        label: ext === "csv" || ext === "tsv" ? "Dataset CSV/TSV" : "Spreadsheet Excel",
        color: "#10b981",
        badgeBg: "bg-emerald-500/15",
        badgeBorder: "border-emerald-500/30",
        badgeText: "text-emerald-400",
      };
    case "pptx":
    case "ppt":
    case "odp":
    case "key":
      return {
        category: "presentation",
        extension: ext,
        label: "PowerPoint Presentation",
        color: "#f97316",
        badgeBg: "bg-orange-500/15",
        badgeBorder: "border-orange-500/30",
        badgeText: "text-orange-400",
      };
    case "ipynb":
      return {
        category: "jupyter",
        extension: "ipynb",
        label: "Jupyter Notebook",
        color: "#f37626",
        badgeBg: "bg-amber-500/15",
        badgeBorder: "border-amber-500/30",
        badgeText: "text-amber-400",
      };
    case "py":
    case "pyw":
    case "pyx":
      return {
        category: "python",
        extension: ext,
        label: "Python Script",
        color: "#387eb8",
        badgeBg: "bg-sky-500/15",
        badgeBorder: "border-sky-500/30",
        badgeText: "text-sky-400",
      };
    case "js":
    case "mjs":
    case "cjs":
    case "jsx":
      return {
        category: "code",
        extension: ext,
        label: "JavaScript",
        color: "#f7df1e",
        badgeBg: "bg-yellow-500/15",
        badgeBorder: "border-yellow-500/30",
        badgeText: "text-yellow-400",
      };
    case "ts":
    case "tsx":
      return {
        category: "code",
        extension: ext,
        label: "TypeScript",
        color: "#3178c6",
        badgeBg: "bg-blue-500/15",
        badgeBorder: "border-blue-500/30",
        badgeText: "text-blue-400",
      };
    case "sql":
    case "prisma":
      return {
        category: "code",
        extension: ext,
        label: "SQL Database Query",
        color: "#0284c7",
        badgeBg: "bg-sky-500/15",
        badgeBorder: "border-sky-500/30",
        badgeText: "text-sky-400",
      };
    case "c":
    case "cpp":
    case "cc":
    case "cxx":
    case "h":
    case "hpp":
    case "java":
    case "kt":
    case "kts":
    case "cs":
    case "go":
    case "rs":
    case "php":
    case "rb":
    case "swift":
    case "dart":
    case "lua":
    case "html":
    case "css":
    case "scss":
    case "sass":
    case "less":
    case "json":
    case "sh":
    case "bash":
    case "bat":
    case "ps1":
    case "xml":
    case "yaml":
    case "yml":
    case "toml":
      return {
        category: "code",
        extension: ext,
        label: `Kode ${ext.toUpperCase()}`,
        color: "#8b5cf6",
        badgeBg: "bg-purple-500/15",
        badgeBorder: "border-purple-500/30",
        badgeText: "text-purple-400",
      };
    case "md":
    case "markdown":
    case "rst":
      return {
        category: "markdown",
        extension: ext,
        label: "Markdown Documentation",
        color: "#06b6d4",
        badgeBg: "bg-cyan-500/15",
        badgeBorder: "border-cyan-500/30",
        badgeText: "text-cyan-400",
      };
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
    case "bz2":
      return {
        category: "archive",
        extension: ext,
        label: "Arsip Kompresi",
        color: "#eab308",
        badgeBg: "bg-yellow-500/15",
        badgeBorder: "border-yellow-500/30",
        badgeText: "text-yellow-400",
      };
    case "png":
    case "jpg":
    case "jpeg":
    case "webp":
    case "svg":
    case "gif":
    case "bmp":
      return {
        category: "image",
        extension: ext,
        label: "Gambar",
        color: "#ec4899",
        badgeBg: "bg-pink-500/15",
        badgeBorder: "border-pink-500/30",
        badgeText: "text-pink-400",
      };
    case "txt":
    case "log":
      return {
        category: "text",
        extension: ext,
        label: "Dokumen Teks",
        color: "#94a3b8",
        badgeBg: "bg-slate-500/15",
        badgeBorder: "border-slate-500/30",
        badgeText: "text-slate-300",
      };
    default:
      return {
        category: "other",
        extension: ext || "file",
        label: ext ? `Berkas ${ext.toUpperCase()}` : "Berkas",
        color: "#64748b",
        badgeBg: "bg-slate-500/15",
        badgeBorder: "border-slate-500/30",
        badgeText: "text-slate-400",
      };
  }
}

export const DRIVE_MARKER_START = "<!-- VELQORA_MODULE_DRIVE_START -->";
export const DRIVE_MARKER_END = "<!-- VELQORA_MODULE_DRIVE_END -->";
const LEGACY_MARKERS_START = [
  "<!-- VELQORA_MODULE_DRIVE_START -->",
  "<!-- WAHYUSTUDY_MODULE_DRIVE_START -->",
  "<!-- STUDYVAULT_MODULE_DRIVE_START -->",
];
const LEGACY_MARKERS_END = [
  "<!-- VELQORA_MODULE_DRIVE_END -->",
  "<!-- WAHYUSTUDY_MODULE_DRIVE_END -->",
  "<!-- STUDYVAULT_MODULE_DRIVE_END -->",
];

export function extractModuleDriveFromNotes(notes?: string | null): {
  folders: ModuleDriveFolder[];
  files: ModuleDriveFile[];
  comments: ModuleComment[];
  reactions: ModuleReaction[];
  kind?: "module" | "project";
  techStack?: string[];
  programmingLanguage?: string;
  framework?: string;
  projectType?: string;
  repositoryUrl?: string;
  demoUrl?: string;
  authorName?: string;
  coverUrl?: string;
  sections?: ModuleSection[];
} {
  if (!notes) return { folders: [], files: [], comments: [], reactions: [] };

  try {
    const startTag = LEGACY_MARKERS_START.find((tag) => notes.includes(tag)) || null;
    const endTag = LEGACY_MARKERS_END.find((tag) => notes.includes(tag)) || null;

    if (startTag && endTag) {
      const startIndex = notes.indexOf(startTag) + startTag.length;
      const endIndex = notes.indexOf(endTag);
      const jsonStr = notes.slice(startIndex, endIndex).trim();
      const parsed = JSON.parse(jsonStr);
      if (parsed && Array.isArray(parsed.folders) && Array.isArray(parsed.files)) {
        return {
          folders: parsed.folders,
          files: parsed.files,
          comments: Array.isArray(parsed.comments) ? parsed.comments : [],
          reactions: Array.isArray(parsed.reactions) ? parsed.reactions : [],
          kind: parsed.kind || "module",
          techStack: Array.isArray(parsed.techStack) ? parsed.techStack : [],
          programmingLanguage: parsed.programmingLanguage,
          framework: parsed.framework,
          projectType: parsed.projectType,
          repositoryUrl: parsed.repositoryUrl,
          demoUrl: parsed.demoUrl,
          authorName: parsed.authorName,
          coverUrl: parsed.coverUrl,
          sections: Array.isArray(parsed.sections) ? parsed.sections : [],
        };
      }
    }
  } catch (e) {
    console.warn("Failed to parse module drive JSON:", e);
  }

  // Fallback: Check if there's a legacy single file attached in notes
  const legacyFileMatch = notes.match(/📎 \*\*Berkas Modul:\*\* \[(.*?)\]\((https?:\/\/[^\s\)]+)\)/);
  if (legacyFileMatch) {
    const rawName = legacyFileMatch[1];
    const url = legacyFileMatch[2];
    const cat = getFileCategory(rawName);
    return {
      folders: [],
      files: [
        {
          id: `legacy_${Date.now()}`,
          name: rawName,
          folderId: null,
          storagePath: "",
          url,
          size: 0,
          fileType: cat.label,
          extension: cat.extension,
          category: cat.category,
          uploadedAt: new Date().toISOString(),
        },
      ],
      comments: [],
      reactions: [],
      kind: "module",
    };
  }

  return { folders: [], files: [], comments: [], reactions: [], kind: "module" };
}

export function injectModuleDriveIntoNotes(
  existingNotes: string | null | undefined,
  folders: ModuleDriveFolder[],
  files: ModuleDriveFile[],
  comments?: ModuleComment[],
  reactions?: ModuleReaction[],
  extra?: {
    kind?: "module" | "project";
    techStack?: string[];
    programmingLanguage?: string;
    framework?: string;
    projectType?: string;
    repositoryUrl?: string;
    demoUrl?: string;
    authorName?: string;
    coverUrl?: string;
    sections?: ModuleSection[];
  }
): string {
  const cleanBaseNotes = (existingNotes || "")
    .replace(/<!-- (?:VELQORA|WAHYUSTUDY|STUDYVAULT)_MODULE_DRIVE_START -->[\s\S]*?<!-- (?:VELQORA|WAHYUSTUDY|STUDYVAULT)_MODULE_DRIVE_END -->/g, "")
    .trim();

  // Preserve existing comments and reactions if not explicitly overridden
  let targetComments = comments;
  let targetReactions = reactions;
  let targetKind = extra?.kind;
  let targetTechStack = extra?.techStack;
  let targetLang = extra?.programmingLanguage;
  let targetFramework = extra?.framework;
  let targetProjType = extra?.projectType;
  let targetRepoUrl = extra?.repositoryUrl;
  let targetDemoUrl = extra?.demoUrl;
  let targetAuthor = extra?.authorName;
  let targetCover = extra?.coverUrl;
  let targetSections = extra?.sections;

  const current = extractModuleDriveFromNotes(existingNotes);
  if (!targetComments) targetComments = current.comments;
  if (!targetReactions) targetReactions = current.reactions;
  if (!targetKind) targetKind = current.kind || "module";
  if (!targetTechStack) targetTechStack = current.techStack || [];
  if (!targetLang) targetLang = current.programmingLanguage;
  if (!targetFramework) targetFramework = current.framework;
  if (!targetProjType) targetProjType = current.projectType;
  if (!targetRepoUrl) targetRepoUrl = current.repositoryUrl;
  if (!targetDemoUrl) targetDemoUrl = current.demoUrl;
  if (!targetAuthor) targetAuthor = current.authorName;
  if (!targetCover) targetCover = current.coverUrl;
  if (!targetSections) targetSections = current.sections;

  const drivePayload: ModuleDrivePayload = {
    version: "2.0",
    kind: targetKind,
    techStack: targetTechStack,
    programmingLanguage: targetLang,
    framework: targetFramework,
    projectType: targetProjType,
    repositoryUrl: targetRepoUrl,
    demoUrl: targetDemoUrl,
    authorName: targetAuthor,
    coverUrl: targetCover,
    sections: targetSections,
    folders,
    files,
    comments: targetComments,
    reactions: targetReactions,
    updatedAt: new Date().toISOString(),
  };

  const driveBlock = `${DRIVE_MARKER_START}\n${JSON.stringify(drivePayload, null, 2)}\n${DRIVE_MARKER_END}`;

  return cleanBaseNotes ? `${cleanBaseNotes}\n\n${driveBlock}` : driveBlock;
}

/**
 * File validation helpers for Module vs Project
 */
export const MODULE_ALLOWED_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "ppt",
  "pptx",
  "xls",
  "xlsx",
  "txt",
  "md",
  "markdown",
  "epub",
  "odt",
  "rtf",
  "ods",
  "odp",
];

export const PROJECT_ALLOWED_EXTENSIONS = [
  "py",
  "ipynb",
  "js",
  "mjs",
  "cjs",
  "ts",
  "tsx",
  "jsx",
  "java",
  "cpp",
  "c",
  "cs",
  "php",
  "html",
  "css",
  "scss",
  "sass",
  "json",
  "sql",
  "yaml",
  "yml",
  "md",
  "markdown",
  "csv",
  "tsv",
  "go",
  "rs",
  "kt",
  "swift",
  "dart",
  "rb",
  "sh",
  "bash",
  "bat",
  "ps1",
  "env",
  "toml",
  "txt",
  "zip",
  "png",
  "jpg",
  "jpeg",
];

export const PROJECT_DISALLOWED_EXTENSIONS_FOR_MODULE = [
  "py",
  "ipynb",
  "js",
  "ts",
  "tsx",
  "jsx",
  "java",
  "cpp",
  "c",
  "cs",
  "sql",
  "rs",
  "go",
  "php",
  "dart",
  "rb",
  "sh",
];

export function validateContentFile(
  filename: string,
  kind: "module" | "project"
): { isValid: boolean; reason?: string } {
  const parts = filename.split(".");
  const ext = parts.length > 1 ? parts.pop()?.toLowerCase() || "" : "";

  if (kind === "module") {
    if (PROJECT_DISALLOWED_EXTENSIONS_FOR_MODULE.includes(ext)) {
      return {
        isValid: false,
        reason: `Berkas kode ".${ext}" tidak diperbolehkan pada Modul Pembelajaran. Silakan buat sebagai "Project".`,
      };
    }
  }

  return { isValid: true };
}


