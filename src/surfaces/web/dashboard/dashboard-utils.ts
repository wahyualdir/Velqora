import type { ScheduleItem } from "@/types";

export interface DashboardStatsData {
  totalMateri: number;
  totalTugas: number;
  totalModul: number;
  totalFile: number;
  recentViews: any[];
  recentTasks: any[];
  recentModules: any[];
  todaySchedules: ScheduleItem[];
  upcomingSchedules: ScheduleItem[];
}

export type DashboardCategoryFilter =
  | "semua"
  | "modul"
  | "tugas"
  | "ujian"
  | "jadwal"
  | "statistik";

export interface AcademicPeriodInfo {
  badgeText: string;
  semesterLabel: string;
  shortPeriod: string;
}

const INDONESIAN_DAYS = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
] as const;

const INDONESIAN_MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

const INDONESIAN_MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
] as const;

export function getIndonesianDayName(date: Date = new Date()): string {
  return INDONESIAN_DAYS[date.getDay()] || "Senin";
}

export function getCurrentAcademicPeriod(date: Date = new Date()): AcademicPeriodInfo {
  const dayName = getIndonesianDayName(date);
  const dayNum = date.getDate();
  const monthIdx = date.getMonth();
  const year = date.getFullYear();

  return {
    badgeText: "Kurikulum AI & Data",
    semesterLabel: `${dayName}, ${dayNum} ${INDONESIAN_MONTHS[monthIdx]} ${year}`,
    shortPeriod: `${dayName}, ${dayNum} ${INDONESIAN_MONTHS_SHORT[monthIdx]}`,
  };
}

function parseMinutes(hhmm?: string | null): number | null {
  if (!hhmm) return null;
  const match = hhmm.trim().match(/^(\d{1,2})[:.](\d{2})/);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (Number.isNaN(h) || Number.isNaN(m) || h > 23 || m > 59) return null;
  return h * 60 + m;
}

export function getScheduleTimeRange(item: Partial<ScheduleItem>): string {
  if (item.start_time && item.end_time) {
    return `${item.start_time} - ${item.end_time} WIB`;
  }
  if (item.start_time) {
    return `${item.start_time} WIB`;
  }
  if (item.time && item.time !== "--:--") {
    return item.time.includes("WIB") ? item.time : `${item.time} WIB`;
  }
  return "Fleksibel";
}

export function isScheduleLiveNow(
  item: Partial<ScheduleItem>,
  nowDate: Date = new Date()
): boolean {
  if (item.day && item.day !== getIndonesianDayName(nowDate)) {
    return false;
  }

  let startMin = parseMinutes(item.start_time);
  let endMin = parseMinutes(item.end_time);

  if ((startMin === null || endMin === null) && item.time && item.time.includes("-")) {
    const [rawStart, rawEnd] = item.time.split("-");
    startMin = startMin ?? parseMinutes(rawStart);
    endMin = endMin ?? parseMinutes(rawEnd);
  }

  if (startMin === null || endMin === null) return false;
  const currentMin = nowDate.getHours() * 60 + nowDate.getMinutes();
  return currentMin >= startMin && currentMin <= endMin;
}

export interface TopicEmblem {
  code: string;
  label: string;
  sublabel: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  href: string;
}

const TOPIC_PRESETS: Array<{
  keywords: string[];
  code: string;
  label: string;
  sublabel: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}> = [
  {
    keywords: ["typescript", "ts"],
    code: "TS",
    label: "TYPESCRIPT",
    sublabel: "Type-Safe Engineering",
    bgClass: "bg-[#2B6CB0] dark:bg-[#1E4E8C]",
    textClass: "text-[#FFFFFF]",
    borderClass: "border-[#2B6CB0]/30 dark:border-[#60A5FA]/30",
  },
  {
    keywords: ["python", "pandas", "numpy", "pytorch", "py"],
    code: "PY",
    label: "PYTHON & DATA",
    sublabel: "Computational Computing",
    bgClass: "bg-[#B8562F] dark:bg-[#9E4220]",
    textClass: "text-[#FFFBF8]",
    borderClass: "border-[#C2553A]/35",
  },
  {
    keywords: ["sql", "database", "basis data", "postgres"],
    code: "SQL",
    label: "BASIS DATA",
    sublabel: "Relational & Query Engine",
    bgClass: "bg-[#2C5E4F] dark:bg-[#1F4A3D]",
    textClass: "text-[#FFFBF8]",
    borderClass: "border-[#2C5E4F]/35",
  },
  {
    keywords: ["javascript", "react", "next", "web", "frontend", "js"],
    code: "JS",
    label: "WEB MODERN",
    sublabel: "Frontend & Architecture",
    bgClass: "bg-[#1C1917] dark:bg-[#292524]",
    textClass: "text-[#F5E6D3]",
    borderClass: "border-[#C2553A]/35",
  },
  {
    keywords: ["ai", "machine learning", "deep learning", "nlp", "llm", "kecerdasan"],
    code: "AI",
    label: "KECERDASAN BUATAN",
    sublabel: "Applied ML & Intelligence",
    bgClass: "bg-[#C2553A] dark:bg-[#A34530]",
    textClass: "text-[#FFFBF8]",
    borderClass: "border-[#C2553A]/40",
  },
  {
    keywords: ["algoritma", "struktur data", "dsa", "rekursi", "graf"],
    code: "DSA",
    label: "ALGORITMA",
    sublabel: "Struktur Data & Logika",
    bgClass: "bg-[#3F3A36] dark:bg-[#24201D]",
    textClass: "text-[#FFFBF8]",
    borderClass: "border-[#524B42]/40",
  },
];

export function resolveActiveTopicEmblem(
  recentModules: any[],
  recentTasks: any[],
  recentViews: any[]
): TopicEmblem {
  const activeModule = recentModules?.[0];
  const activeTask = recentTasks?.[0];
  const activeView = recentViews?.[0]?.material;

  const titleCandidate =
    activeModule?.title ||
    activeTask?.subject ||
    activeTask?.title ||
    activeView?.title ||
    "";
  const categoryCandidate =
    activeModule?.category?.name || activeView?.category?.name || "";
  const combined = `${titleCandidate} ${categoryCandidate}`.toLowerCase();

  const href = activeModule
    ? `/dashboard/modul?module=${activeModule.id}`
    : activeView
    ? `/dashboard/materi/${activeView.id}`
    : "/dashboard/modul";

  for (const preset of TOPIC_PRESETS) {
    if (preset.keywords.some((kw) => combined.includes(kw))) {
      return {
        code: preset.code,
        label: preset.label,
        sublabel: categoryCandidate || preset.sublabel,
        bgClass: preset.bgClass,
        textClass: preset.textClass,
        borderClass: preset.borderClass,
        href,
      };
    }
  }

  // Fallback: generate clean 2-letter monogram from active topic or Velqora Studio
  const words = (categoryCandidate || titleCandidate || "Velqora")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const monogram =
    words.length >= 2
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : (words[0] || "VQ").slice(0, 2).toUpperCase();

  return {
    code: monogram,
    label: (categoryCandidate || "FOKUS BELAJAR").toUpperCase().slice(0, 22),
    sublabel: titleCandidate || "Workspace Belajar Velqora",
    bgClass: "bg-[#C2553A] dark:bg-[#A34530]",
    textClass: "text-[#FFFBF8]",
    borderClass: "border-[#C2553A]/35",
    href,
  };
}
