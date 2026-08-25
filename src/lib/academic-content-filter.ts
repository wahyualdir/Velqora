/**
 * Advanced Academic Content Safety & Integrity Engine for StudyVault
 * Enterprise-grade multi-layer protection against:
 * 1. Disguised/Malicious executables (Magic Bytes signature check: MZ, ELF, Mach-O)
 * 2. Double extensions (e.g., file.pdf.exe) and RTL unicode disguises (\u202E)
 * 3. Non-academic & dangerous file extension blocking (Strict Whitelist)
 * 4. Toxic, NSFW, Profanity, Gambling (Judol), and Fraud keyword filtering
 * 5. Spam / Keyboard-smash / Gibberish detection
 * 6. File size limits & 0-byte corrupt file rejection
 */

// Strict Whitelist of Verified Academic File Extensions
export const ALLOWED_ACADEMIC_EXTENSIONS = new Set([
  // Documents & eBooks
  "pdf", "doc", "docx", "txt", "rtf", "odt", "md", "markdown", "tex",
  // Presentations & Slides
  "ppt", "pptx", "odp", "key",
  // Spreadsheets & Data
  "xls", "xlsx", "csv", "tsv", "ods", "parquet", "json", "xml", "yaml", "yml",
  // Programming, Code & Notebooks
  "ipynb", "py", "js", "jsx", "ts", "tsx", "c", "cpp", "h", "hpp", "cs",
  "java", "go", "rs", "php", "rb", "swift", "kt", "kts", "sql", "html", "htm",
  "css", "scss", "sass", "less", "r", "m", "dart", "lua", "asm", "vue", "svelte",
  // Archives (for multi-file assignments / lab packages)
  "zip", "rar", "7z", "tar", "gz",
  // Media & Diagrams
  "png", "jpg", "jpeg", "webp", "gif", "svg", "bmp"
]);

// Explicitly blocked hazardous extensions
export const DANGEROUS_EXTENSIONS = new Set([
  "exe", "bat", "cmd", "sh", "vbs", "vbe", "msi", "scr", "pif", "dll", "apk", "com",
  "dmg", "pkg", "iso", "bin", "sys", "torrent", "crx", "jar", "app", "action",
  "gadget", "wsf", "wsh", "ps1", "psm1", "reg", "drv", "ocx", "cpl", "lnk", "inf",
  "ins", "isp", "hta", "xpi", "deb", "rpm", "cab", "gadget", "application"
]);

// Comprehensive Prohibited, Vulgar, Gambling & Abuse Keyword Lexicon
const PROHIBITED_KEYWORDS = [
  // 1. Judi Online / Slot / Gambling (ID & EN)
  "slot gacor", "judi online", "zeus slot", "pragmatic play", "maxwin", "deposit pulsa",
  "agen bola", "togel", "casino online", "poker online", "sbobet", "link slot", "bandar judi",
  "gacor x500", "slot88", "slot777", "slot pulsa", "judol", "judi bola", "taruhan bola",
  "depo pulsa", "rtp slot", "jackpot slot", "situs judi", "link alternatif slot",
  
  // 2. Adult, NSFW, Pornography & Exploitation
  "bokep", "porn", "pornography", "nsfw", "xxx", "hentai", "video mesum", "jav", "porno",
  "sex video", "nude", "telanjang", "dewasa 18+", "18+ only", "onlyfans", "sange", "vcs",
  "open bo", "colmek", "masturbasi", "ngentot", "kontol", "memek", "tetek", "itil",
  
  // 3. Profanity & Severe Abusive Slang (Indonesian & English)
  "anjing lu", "babi lu", "bangsat", "bajingan", "pantek", "perek", "kampret",
  "fuck you", "motherfucker", "bitch", "asshole", "bastard", "cunt",
  
  // 4. Illegal Schemes, Fraud, Warez & Malware
  "hack akun", "hack wa", "cheat game", "cheat ff", "free robux", "free diamond ml",
  "carding", "doxing", "phishing", "trojan", "ransomware", "keylogger", "exploit kit",
  "obat kuat", "jual obat aborsi", "pinjol ilegal", "money game", "pengganda uang",
  "jual ginjal", "rekening bodong", "beli ijazah palsu",
  
  // 5. Spam & Deceptive Marketing
  "promo wa", "hubungi wa admin slot", "klik link ini untuk saldo gratis", "dapat uang instan"
];

// Academic keywords indicators (Indonesian & English)
const ACADEMIC_INDICATORS = [
  // IT & Computer Science
  "algoritma", "pemrograman", "program", "coding", "code", "python", "javascript", "typescript",
  "nextjs", "react", "html", "css", "database", "basis data", "sql", "query", "machine learning",
  "deep learning", "kecerdasan buatan", "ai", "data science", "jaringan", "network", "cyber security",
  "keamanan siber", "cloud", "docker", "kubernetes", "git", "github", "oop", "struktur data",
  "frontend", "backend", "fullstack", "api", "mobile app", "flutter", "swift", "kotlin", "java",
  "c++", "golang", "rust", "computational", "operating system", "sistem operasi", "compiler",
  // Higher Education & Academic Disciplines
  "kuliah", "mahasiswa", "materi", "modul", "bab", "chapter", "silabus", "kurikulum", "tugas",
  "pertemuan", "dosen", "fakultas", "universitas", "institut", "akademik", "studi", "belajar",
  "tutorial", "panduan", "guide", "buku", "ebook", "referensi", "jurnal", "makalah", "paper",
  "penelitian", "kalkulus", "aljabar", "matematika", "fisika", "statistika", "probabilitas",
  "ekonomi", "akuntansi", "manajemen", "hukum", "psikologi", "biologi", "kimia", "rekayasa",
  "engineering", "arsitektur", "desain", "ui/ux", "analisis", "teori", "praktikum", "lab",
  "kuis", "ujian", "uts", "uas", "skripsi", "tugas akhir", "resume", "ringkasan", "slide", "presentasi"
];

export interface AcademicValidationResult {
  isValid: boolean;
  reason?: string;
  academicScore: number; // 0 to 100
  isGibberish?: boolean;
  hasProhibitedWords?: boolean;
  isBlockedExtension?: boolean;
  isExecutableSignature?: boolean;
}

/**
 * Check if text contains keyboard-smash gibberish
 */
function isGibberishText(text: string): boolean {
  if (!text || text.trim().length < 3) return false;
  const clean = text.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (clean.length === 0) return false;

  // 1. Repeating same character 5+ times (e.g. "aaaaaa", "111111")
  if (/(.)\1{4,}/.test(clean)) return true;

  // 2. Exact keyboard rows repeated
  const keyboardPatterns = [
    "asdfghjkl", "qwertyuiop", "zxcvbnm", "12345678", "qwerqwer", "asdfasdf",
    "poiuytrewq", "lkjhgfdsa", "mnbvcxz", "zxcvzxcv"
  ];
  for (const pattern of keyboardPatterns) {
    if (clean.includes(pattern)) return true;
  }

  // 3. For words without any vowels (except common acronyms/tech terms)
  const commonNoVowelTerms = new Set([
    "html", "css", "js", "ts", "sql", "php", "cpp", "pdf", "csv", "tsv", "svg", "png", "jpg",
    "xml", "json", "yml", "yaml", "md", "txt", "doc", "docx", "ppt", "pptx", "xls", "xlsx",
    "nlp", "api", "sdk", "cli", "ssh", "ssl", "tcp", "udp", "ip", "dns", "http", "https",
    "jwt", "dom", "ssr", "ssg", "csr", "rdbms", "orm", "crud", "npm", "pnpm", "npx", "yarn",
    "wasm", "cors", "grpc", "smtp", "mqtt", "rest", "ci/cd"
  ]);

  const words = text.toLowerCase().split(/\s+/);
  let gibberishWordCount = 0;

  for (const w of words) {
    const rawWord = w.replace(/[^a-z]/g, "");
    if (rawWord.length >= 6 && !/[aeiouy]/.test(rawWord) && !commonNoVowelTerms.has(rawWord)) {
      gibberishWordCount++;
    }
  }

  if (words.length > 0 && gibberishWordCount / words.length > 0.6) {
    return true;
  }

  return false;
}

/**
 * Validate plain text for academic compliance & safety
 */
export function validateAcademicText(text: string, title?: string): AcademicValidationResult {
  const combined = `${title || ""} ${text || ""}`.toLowerCase();

  // 1. Check for empty
  if (!combined.trim()) {
    return {
      isValid: false,
      reason: "Konten teks kosong dan belum memiliki informasi bahan ajar.",
      academicScore: 0,
    };
  }

  // 2. Check for prohibited / non-academic keywords (judol, porn, scam, etc.)
  for (const badWord of PROHIBITED_KEYWORDS) {
    if (combined.includes(badWord)) {
      return {
        isValid: false,
        reason: `Konten terdeteksi mengandung kata-kata yang melanggar norma/etika akademik ("${badWord}").`,
        academicScore: 0,
        hasProhibitedWords: true,
      };
    }
  }

  // 3. Check for keyboard smash / gibberish spam
  if (isGibberishText(combined)) {
    return {
      isValid: false,
      reason: "Teks terdeteksi sebagai karakter acak (spam/gibberish) dan tidak memiliki nilai bahan ajar akademik.",
      academicScore: 0,
      isGibberish: true,
    };
  }

  // 4. Calculate Academic Relevance Score
  let matchedIndicators = 0;
  for (const keyword of ACADEMIC_INDICATORS) {
    if (combined.includes(keyword)) {
      matchedIndicators++;
    }
  }

  // Code signatures check (e.g. function, class, import, def, etc.)
  const hasCodeSignatures = /import\s+|export\s+|function\s+|class\s+|def\s+|console\.log|SELECT\s+|FROM\s+|<html>|#include|package\s+|public\s+class/i.test(combined);
  if (hasCodeSignatures) {
    matchedIndicators += 3;
  }

  const academicScore = Math.min(100, Math.max(25, matchedIndicators * 18));

  return {
    isValid: true,
    academicScore,
  };
}

/**
 * Read the first few bytes (Magic Header) of a file to detect disguised binaries
 */
async function checkFileMagicBytes(file: File): Promise<{ isMaliciousBinary: boolean; signature?: string }> {
  try {
    const slice = file.slice(0, 16);
    const arrayBuffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    if (bytes.length < 2) return { isMaliciousBinary: false };

    // 1. Windows Executable / DLL / SYS (Starts with "MZ" -> 0x4D, 0x5A)
    if (bytes[0] === 0x4d && bytes[1] === 0x5a) {
      return { isMaliciousBinary: true, signature: "Windows Executable (MZ)" };
    }

    // 2. Linux ELF Executable (Starts with 0x7F 'E' 'L' 'F' -> 0x7F, 0x45, 0x4C, 0x46)
    if (bytes.length >= 4 && bytes[0] === 0x7f && bytes[1] === 0x45 && bytes[2] === 0x4c && bytes[3] === 0x46) {
      return { isMaliciousBinary: true, signature: "Linux ELF Binary" };
    }

    // 3. Mach-O macOS Binary (0xFE, 0xED, 0xFA, 0xCE or 0xCF, 0xFA, 0xED, 0xFE or 0xCA, 0xFE, 0xBA, 0xBE)
    if (bytes.length >= 4) {
      const isMachO =
        (bytes[0] === 0xfe && bytes[1] === 0xed && bytes[2] === 0xfa && bytes[3] === 0xce) ||
        (bytes[0] === 0xce && bytes[1] === 0xfa && bytes[2] === 0xed && bytes[3] === 0xfe) ||
        (bytes[0] === 0xcf && bytes[1] === 0xfa && bytes[2] === 0xed && bytes[3] === 0xfe);
      if (isMachO) {
        return { isMaliciousBinary: true, signature: "Mach-O Binary" };
      }
    }

    return { isMaliciousBinary: false };
  } catch (err) {
    console.warn("Could not inspect file magic bytes:", err);
    return { isMaliciousBinary: false };
  }
}

/**
 * Deep Multi-Stage Academic Safety & Integrity Validator for Files
 */
export async function validateAcademicFile(file: File): Promise<AcademicValidationResult> {
  const fileName = file.name || "";

  // 1. Check for Unicode RTL Override disguise (\u202E) or Null Bytes
  if (/[\u202E\u202D\u202C\u0000]/.test(fileName)) {
    return {
      isValid: false,
      reason: `Nama berkas "${fileName}" terdeteksi menggunakan karakter tersembunyi/RTL disguise yang dilarang demi keamanan.`,
      academicScore: 0,
    };
  }

  // 2. Check for double extensions (e.g. file.pdf.exe or file.docx.bat)
  const parts = fileName.toLowerCase().split(".");
  if (parts.length > 2) {
    for (let i = 1; i < parts.length; i++) {
      const partExt = parts[i];
      if (DANGEROUS_EXTENSIONS.has(partExt)) {
        return {
          isValid: false,
          reason: `Berkas "${fileName}" terdeteksi memiliki ekstensi ganda berbahaya (.${partExt}) dan otomatis diblokir demi keamanan.`,
          academicScore: 0,
          isBlockedExtension: true,
        };
      }
    }
  }

  // 3. File extension whitelist check
  const mainExt = (parts.pop() || "").toLowerCase();
  if (DANGEROUS_EXTENSIONS.has(mainExt)) {
    return {
      isValid: false,
      reason: `Format berkas .${mainExt} merupakan jenis aplikasi eksekutabel/skrip sistem yang diblokir demi keamanan akademik.`,
      academicScore: 0,
      isBlockedExtension: true,
    };
  }

  if (!ALLOWED_ACADEMIC_EXTENSIONS.has(mainExt)) {
    return {
      isValid: false,
      reason: `Format berkas .${mainExt || "unknown"} tidak termasuk dalam standar bahan ajar akademik Velqora (PDF, Office, Coding, Dataset, Gambar, atau Arsip).`,
      academicScore: 0,
      isBlockedExtension: true,
    };
  }

  // 4. File size check (Must be > 0 bytes and <= 50MB)
  if (file.size === 0) {
    return {
      isValid: false,
      reason: `Berkas "${fileName}" berukuran 0 byte (kosong) dan tidak memiliki konten pembelajaran.`,
      academicScore: 0,
    };
  }

  if (file.size > 50 * 1024 * 1024) {
    return {
      isValid: false,
      reason: `Ukuran berkas "${fileName}" melebihi batas maksimum 50MB.`,
      academicScore: 0,
    };
  }

  // 5. Binary Magic Header Inspection (Catch disguised executables)
  const magicCheck = await checkFileMagicBytes(file);
  if (magicCheck.isMaliciousBinary) {
    return {
      isValid: false,
      reason: `Berkas "${fileName}" terdeteksi sebagai program eksekutabel biner (${magicCheck.signature}) yang disamarkan dan diblokir demi keamanan.`,
      academicScore: 0,
      isExecutableSignature: true,
    };
  }

  // 6. Filename safety & profanity check
  const filenameCheck = validateAcademicText(fileName);
  if (!filenameCheck.isValid) {
    return {
      isValid: false,
      reason: `Nama berkas "${fileName}" tidak sesuai dengan standar akademik: ${filenameCheck.reason}`,
      academicScore: 0,
      hasProhibitedWords: filenameCheck.hasProhibitedWords,
      isGibberish: filenameCheck.isGibberish,
    };
  }

  // 7. For text/code/data files < 3MB, inspect text sample for safety
  const previewableExtensions = new Set([
    "txt", "py", "ipynb", "js", "ts", "tsx", "jsx", "json", "csv", "tsv", "sql",
    "html", "htm", "css", "md", "c", "cpp", "java", "go", "rs", "php", "r", "m"
  ]);

  if (previewableExtensions.has(mainExt) && file.size < 3 * 1024 * 1024) {
    try {
      const textSample = await file.text();
      const contentCheck = validateAcademicText(textSample.slice(0, 15000), fileName);
      if (!contentCheck.isValid) {
        return {
          isValid: false,
          reason: `Isi berkas "${fileName}" terdeteksi tidak pantas / melanggar etika akademik: ${contentCheck.reason}`,
          academicScore: contentCheck.academicScore,
          hasProhibitedWords: contentCheck.hasProhibitedWords,
          isGibberish: contentCheck.isGibberish,
        };
      }
    } catch (e) {
      console.warn("Could not inspect file content text:", e);
    }
  }

  return {
    isValid: true,
    academicScore: Math.max(80, filenameCheck.academicScore),
  };
}

/**
 * Direct alias for upload validation in file dashboard
 */
export const validateFileForUpload = validateAcademicFile;

