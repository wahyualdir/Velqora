"use client";

import React from "react";
import {
  Code,
  Brain,
  Cpu,
  Database,
  Globe,
  Server,
  Sparkles,
  BarChart3,
  Bot,
  MessageSquareCode,
  Eye,
  Mic,
  Gamepad2,
  Shield,
  Binary,
  Calculator,
} from "lucide-react";
import { TechIconKey, TechIconOption } from "./types";

export const TECH_ICONS: TechIconOption[] = [
  // Bahasa Pemrograman
  { key: "python", label: "Python", category: "Bahasa Pemrograman", color: "#3776AB" },
  { key: "javascript", label: "JavaScript", category: "Bahasa Pemrograman", color: "#F7DF1E" },
  { key: "typescript", label: "TypeScript", category: "Bahasa Pemrograman", color: "#3178C6" },
  { key: "cpp", label: "C++", category: "Bahasa Pemrograman", color: "#00599C" },
  { key: "csharp", label: "C#", category: "Bahasa Pemrograman", color: "#9B4993" },
  { key: "c", label: "C Language", category: "Bahasa Pemrograman", color: "#A8B9CC" },
  { key: "java", label: "Java", category: "Bahasa Pemrograman", color: "#ED8B00" },
  { key: "kotlin", label: "Kotlin", category: "Bahasa Pemrograman", color: "#7F52FF" },
  { key: "swift", label: "Swift", category: "Bahasa Pemrograman", color: "#F05138" },
  { key: "golang", label: "Go (Golang)", category: "Bahasa Pemrograman", color: "#00ADD8" },
  { key: "rust", label: "Rust", category: "Bahasa Pemrograman", color: "#DEA584" },
  { key: "php", label: "PHP", category: "Bahasa Pemrograman", color: "#777BB4" },
  { key: "ruby", label: "Ruby", category: "Bahasa Pemrograman", color: "#CC342D" },
  { key: "dart", label: "Dart", category: "Bahasa Pemrograman", color: "#0175C2" },
  { key: "html", label: "HTML5", category: "Bahasa Pemrograman", color: "#E34F26" },
  { key: "css", label: "CSS3", category: "Bahasa Pemrograman", color: "#1572B6" },
  { key: "sql", label: "SQL", category: "Bahasa Pemrograman", color: "#4479A1" },

  // Framework & Web
  { key: "react", label: "React / React Native", category: "Framework & Web", color: "#61DAFB" },
  { key: "nextjs", label: "Next.js", category: "Framework & Web", color: "#000000" },
  { key: "vue", label: "Vue.js", category: "Framework & Web", color: "#4FC08D" },
  { key: "angular", label: "Angular", category: "Framework & Web", color: "#DD0031" },
  { key: "svelte", label: "Svelte", category: "Framework & Web", color: "#FF3E00" },
  { key: "node", label: "Node.js / Express", category: "Framework & Web", color: "#339933" },
  { key: "laravel", label: "Laravel", category: "Framework & Web", color: "#FF2D20" },
  { key: "django", label: "Django", category: "Framework & Web", color: "#092E20" },
  { key: "spring", label: "Spring Boot", category: "Framework & Web", color: "#6DB33F" },
  { key: "flutter", label: "Flutter", category: "Framework & Web", color: "#02569B" },
  { key: "android", label: "Android", category: "Framework & Web", color: "#3DDC84" },
  { key: "apple", label: "iOS / Apple", category: "Framework & Web", color: "#A2AAAD" },

  // Database & Cloud
  { key: "mysql", label: "MySQL", category: "Database & Cloud", color: "#00758F" },
  { key: "postgresql", label: "PostgreSQL", category: "Database & Cloud", color: "#336791" },
  { key: "mongodb", label: "MongoDB", category: "Database & Cloud", color: "#47A248" },
  { key: "redis", label: "Redis", category: "Database & Cloud", color: "#DC382D" },
  { key: "sqlite", label: "SQLite", category: "Database & Cloud", color: "#003B57" },
  { key: "docker", label: "Docker", category: "Database & Cloud", color: "#2496ED" },
  { key: "kubernetes", label: "Kubernetes", category: "Database & Cloud", color: "#326CE5" },
  { key: "linux", label: "Linux", category: "Database & Cloud", color: "#FCC624" },
  { key: "git", label: "Git", category: "Database & Cloud", color: "#F05032" },
  { key: "github", label: "GitHub", category: "Database & Cloud", color: "#181717" },
  { key: "aws", label: "AWS Cloud", category: "Database & Cloud", color: "#FF9900" },
  { key: "gcp", label: "Google Cloud", category: "Database & Cloud", color: "#4285F4" },
  { key: "azure", label: "Microsoft Azure", category: "Database & Cloud", color: "#0089D6" },
  { key: "nginx", label: "Nginx", category: "Database & Cloud", color: "#009639" },

  // AI & Data Science
  { key: "machine_learning", label: "Machine Learning", category: "AI & Data Science", color: "#8B5CF6" },
  { key: "deep_learning", label: "Deep Learning", category: "AI & Data Science", color: "#EC4899" },
  { key: "generative_ai", label: "Generative AI / LLM / RAG", category: "AI & Data Science", color: "#F59E0B" },
  { key: "nlp", label: "NLP (Language Processing)", category: "AI & Data Science", color: "#10B981" },
  { key: "computer_vision", label: "Computer Vision", category: "AI & Data Science", color: "#3B82F6" },
  { key: "data_science", label: "Data Science & Analytics", category: "AI & Data Science", color: "#06B6D4" },
  { key: "algorithm", label: "Algoritma & Struktur Data", category: "AI & Data Science", color: "#6366F1" },
  { key: "security", label: "Cyber Security", category: "AI & Data Science", color: "#EF4444" },
  { key: "figma", label: "UI/UX & Figma", category: "AI & Data Science", color: "#F24E1E" },
  { key: "excel", label: "Excel Analytics", category: "AI & Data Science", color: "#107C41" },
  { key: "math", label: "Matematika & Statistika", category: "AI & Data Science", color: "#EAB308" },
  { key: "computer_systems", label: "Sistem Komputer & OS", category: "AI & Data Science", color: "#84CC16" },

  // Umum
  { key: "code", label: "Coding / Umum", category: "Umum", color: "#64748B" },
];

export function renderTechSvgIcon(
  key: string,
  size: number,
  className: string
): React.ReactNode {
  const resolvedKey = key.toLowerCase().trim();
  switch (resolvedKey) {
      // 1. PYTHON
      case "python":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path
              d="M11.9 2c-4.4 0-4.2 1.9-4.2 1.9l.01 2h4.3v.6H5.9S2 4.1 2 8.6c0 4.5 3.5 4.4 3.5 4.4h2.1v-2.9s-.1-3.5 3.4-3.5h3.4V4.5S14.9 2 11.9 2zm-2.3 1.3a.7.7 0 1 1 0 1.4.7.7 0 0 1 0-1.4z"
              fill="#3776AB"
            />
            <path
              d="M12.1 22c4.4 0 4.2-1.9 4.2-1.9l-.01-2h-4.3v-.6h6.1s3.9.5 3.9-4.1c0-4.5-3.5-4.4-3.5-4.4h-2.1v2.9s.1 3.5-3.4 3.5H9.6v2.1s-.5 2.5 2.5 2.5zm2.3-1.3a.7.7 0 1 1 0-1.4.7.7 0 0 1 0 1.4z"
              fill="#FFD43B"
            />
          </svg>
        );

      // 2. JAVASCRIPT
      case "javascript":
      case "js":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <rect width="24" height="24" rx="4" fill="#F7DF1E" />
            <path
              d="M12.4 18.2c.4.7 1.1 1.2 2.1 1.2 1.2 0 2-.6 2-2.1v-7.2h2.5v7.3c0 2.8-1.7 4.1-4.4 4.1-2.3 0-3.7-1.2-4.4-2.6l2.2-1.3zm-6.2 0c.4.7 1.2 1.2 2.2 1.2 1.2 0 1.9-.5 1.9-1.4 0-1-.8-1.4-2.2-2l-.8-.3c-2.3-1-3.3-2.2-3.3-4.5 0-2.6 2-4.4 5.1-4.4 2.3 0 3.8.8 4.7 2.4l-2.1 1.3c-.4-.8-1.1-1.2-2.3-1.2-1.1 0-1.7.5-1.7 1.2 0 .8.6 1.2 2 1.8l.8.3c2.6 1.1 3.7 2.3 3.7 4.7 0 2.8-2.2 4.5-5.6 4.5-2.8 0-4.4-1.2-5.2-2.6l2.3-1.3z"
              fill="#000000"
            />
          </svg>
        );

      // 3. TYPESCRIPT
      case "typescript":
      case "ts":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <rect width="24" height="24" rx="4" fill="#3178C6" />
            <path
              d="M13 10.3h-3.3v7.7H7.3v-7.7H4V8h9v2.3zm2.5 7.3c.4.7 1.2 1.2 2.2 1.2 1.2 0 1.9-.5 1.9-1.4 0-1-.8-1.4-2.2-2l-.8-.3c-2.3-1-3.3-2.2-3.3-4.5 0-2.6 2-4.4 5.1-4.4 2.3 0 3.8.8 4.7 2.4l-2.1 1.3c-.4-.8-1.1-1.2-2.3-1.2-1.1 0-1.7.5-1.7 1.2 0 .8.6 1.2 2 1.8l.8.3c2.6 1.1 3.7 2.3 3.7 4.7 0 2.8-2.2 4.5-5.6 4.5-2.8 0-4.4-1.2-5.2-2.6l2.3-1.3z"
              fill="#FFFFFF"
            />
          </svg>
        );

      // 4. C++
      case "cpp":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M12 2L2.5 7.5v11L12 24l9.5-5.5v-11L12 2zm0 2.3l7.5 4.3v8.8L12 21.7 4.5 17.4V8.6L12 4.3z" fill="#00599C" />
            <path d="M12 8.5a4.5 4.5 0 00-4 4.5 4.5 4.5 0 004 4.5 4.4 4.4 0 003.5-1.7l-1.6-1.2a2.5 2.5 0 01-1.9.9 2.5 2.5 0 01-2.5-2.5 2.5 2.5 0 012.5-2.5c.8 0 1.5.3 1.9.9l1.6-1.2A4.4 4.4 0 0012 8.5z" fill="#00599C" />
            <path d="M15.5 11.5h1.2v-1.2h.8v1.2h1.2v.8h-1.2v1.2h-.8v-1.2h-1.2v-.8zM18.8 13.5H20v-1.2h.8v1.2H22v.8h-1.2v1.2h-.8v-1.2h-1.2v-.8z" fill="#00599C" />
          </svg>
        );

      // 5. C#
      case "csharp":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M12 2L2.5 7.5v11L12 24l9.5-5.5v-11L12 2z" fill="#9B4993" />
            <path d="M10.5 8.5a4.5 4.5 0 00-4 4.5 4.5 4.5 0 004 4.5 4.4 4.4 0 003.5-1.7l-1.6-1.2a2.5 2.5 0 01-1.9.9 2.5 2.5 0 01-2.5-2.5 2.5 2.5 0 012.5-2.5c.8 0 1.5.3 1.9.9l1.6-1.2a4.4 4.4 0 00-3.5-1.7z" fill="#FFFFFF" />
            <path d="M17 11h-1v-1.5h-.8V11h-1v-1.5h-.8V11H12.5v.8h.9v1.5h-.9v.8h.9V15.5h.8V14.1h1v1.4h.8V14.1H17v-.8h-.8v-1.5H17V11zm-1.8 2.3h-1v-1.5h1v1.5z" fill="#FFFFFF" />
          </svg>
        );

      // 6. C
      case "c":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M12 2L2.5 7.5v11L12 24l9.5-5.5v-11L12 2z" fill="#659AD2" />
            <path d="M13.5 7.5a5.5 5.5 0 00-5 5.5 5.5 5.5 0 005 5.5 5.4 5.4 0 004.5-2.3l-2-1.5a3 3 0 01-2.5 1.3 3 3 0 01-3-3 3 3 0 013-3c1.1 0 2 .5 2.5 1.3l2-1.5A5.4 5.4 0 0013.5 7.5z" fill="#FFFFFF" />
          </svg>
        );

      // 7. JAVA
      case "java":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path
              d="M8.85 18.56s-.92.53.65.71c1.9.22 3.2.2 5.57-.25 0 0 .61.39 1.55.7-2.73.85-7.85.73-9.67-.37 0 0-.58-.46.97-.8h-.07z"
              fill="#ED8B00"
            />
            <path
              d="M7.82 15.66s-1.08.67.46.88c2.05.27 4.43.34 7.64-.33 0 0 .44.42 1.24.63-3.48 1-9.48.88-11.46-.46 0 0-.66-.58 2.12-.72z"
              fill="#5382A1"
            />
            <path
              d="M12.98 11.23c.86 1.06.24 2.17-1.26 3.2-2.6 1.8-6.2.96-6.2.96s1.43-.47 2.66-.96c1.56-.62 2.83-1.42 2.5-2.32-.4-1.09-2.27-1.63-2.27-1.63s1.87.04 3.1 1.7z"
              fill="#E76F00"
            />
            <path
              d="M15.42 13.92c.87.8 2.01 1.48 2.01 1.48s-.87.42-2.13.75c-2.02.51-4.48.77-7.55.49 0 0 1.3-.37 2.77-.76 3.33-.88 4.15-1.52 4.9-1.96z"
              fill="#5382A1"
            />
          </svg>
        );

      // 8. KOTLIN
      case "kotlin":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M22 2H2v20h20L12 12l10-10z" fill="#7F52FF" />
            <path d="M2 22l10-10L2 2v20z" fill="#C711E1" />
            <path d="M22 22H2l10-10 10 10z" fill="#E4485D" />
          </svg>
        );

      // 9. SWIFT
      case "swift":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <rect width="24" height="24" rx="5" fill="#F05138" />
            <path
              d="M19 18.5C14.5 19 8.5 16 5 11.5c3.5 1.5 7.5.5 10-1.5-2.5-.5-4.5-2-5.5-4 4 1 7.5 3 9.5 6.5-1.5 1.5-1.5 3.5 0 6z"
              fill="#FFFFFF"
            />
          </svg>
        );

      // 10. GO (GOLANG) — Official Cyan Speed Monogram
      case "golang":
      case "go":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path
              d="M3 10.5h4.5a1.8 1.8 0 0 1 1.8 1.8v.2a1.8 1.8 0 0 1-1.8 1.8H3a1.8 1.8 0 0 1-1.8-1.8v-.2A1.8 1.8 0 0 1 3 10.5zm0-3h7a1.8 1.8 0 0 1 1.8 1.8v.2a1.8 1.8 0 0 1-1.8 1.8H3a1.8 1.8 0 0 1-1.8-1.8v-.2A1.8 1.8 0 0 1 3 7.5zm2.5 6h2.5a1.8 1.8 0 0 1 1.8 1.8v.2a1.8 1.8 0 0 1-1.8 1.8H5.5a1.8 1.8 0 0 1-1.8-1.8v-.2a1.8 1.8 0 0 1 1.8-1.8zm14.3-5.2c-2.3 0-4.1 1.6-4.5 3.7h9c-.1-2.1-2-3.7-4.5-3.7zm-5.5 5.5c.3 2.4 2.2 4 4.7 4 1.7 0 3.1-.7 3.9-1.9l.7.5c-1 1.5-2.7 2.4-4.7 2.4-3.4 0-5.9-2.5-5.9-6 0-3.4 2.6-6 6-6 3.7 0 5.9 2.8 5.6 7h-10.3z"
              fill="#00ADD8"
            />
          </svg>
        );

      // 11. RUST — Official 5-Hole Cog Gear & R
      case "rust":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <circle cx="12" cy="12" r="10" stroke="#DEA584" strokeWidth="1.2" fill="none" />
            <circle cx="12" cy="12" r="7.5" stroke="#DEA584" strokeWidth="0.8" fill="none" strokeDasharray="1 1" />
            <path
              d="M9 7h4c1.8 0 3.2.9 3.2 2.7s-1.4 2.7-3.2 2.7H11v4.6H9V7zm2 3.6h2c.8 0 1.4-.4 1.4-1s-.6-1-1.4-1H11v2zm3 2.8l2.5 3.6h-2.2L12 13.4h2z"
              fill="#DEA584"
            />
          </svg>
        );

      // 12. PHP
      case "php":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <ellipse cx="12" cy="12" rx="11" ry="7.5" fill="#777BB4" />
            <path d="M6 10.5h2.5a1.5 1.5 0 011.5 1.5 1.5 1.5 0 01-1.5 1.5H7v2H6v-5zm1 2h1.5a.5.5 0 00.5-.5.5.5 0 00-.5-.5H7v1zm4-2h1v2h2v-2h1v5h-1v-2h-2v2h-1v-5zm6 0h2.5a1.5 1.5 0 011.5 1.5 1.5 1.5 0 01-1.5 1.5H18v2h-1v-5zm1 2h1.5a.5.5 0 00.5-.5.5.5 0 00-.5-.5H18v1z" fill="#FFFFFF" />
          </svg>
        );

      // 13. RUBY
      case "ruby":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M6.5 3.5L17.5 3.5L22 9L12 21.5L2 9L6.5 3.5z" fill="#CC342D" />
            <path d="M6.5 3.5L12 9L17.5 3.5M2 9L12 9L22 9M12 9L12 21.5" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
          </svg>
        );

      // 14. DART
      case "dart":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M3.5 13.5L13.5 3.5H20.5l-7 7L20.5 17.5l-3 3H7.5L3.5 16.5v-3z" fill="#0175C2" />
            <path d="M13.5 3.5L3.5 13.5 7.5 20.5 17.5 10.5 13.5 3.5z" fill="#00B4AB" />
          </svg>
        );

      // 15. HTML5
      case "html":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M4 3h16l-1.5 17L12 22l-6.5-2L4 3z" fill="#E34F26" />
            <path d="M12 4.5v15.8l5.2-1.6 1.2-14.2H12z" fill="#EF652A" />
            <path
              d="M7.5 7.5h9l-.3 3H12v2.5h3.9l-.4 4.5-3.5 1v.1l3.5-1 .6-7.1H7.8l-.3-3z"
              fill="#FFFFFF"
            />
          </svg>
        );

      // 16. CSS3
      case "css":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M4 3h16l-1.5 17L12 22l-6.5-2L4 3z" fill="#1572B6" />
            <path d="M12 4.5v15.8l5.2-1.6 1.2-14.2H12z" fill="#33A9DC" />
            <path
              d="M7.5 7.5h9l-.3 3H12v2.5h3.9l-.4 4.5-3.5 1-3.5-1-.2-2.5h2.5l.1 1.2 1.1.3 1.1-.3.1-1.5H7.7l-.2-3z"
              fill="#FFFFFF"
            />
          </svg>
        );

      // 17. REACT
      case "react":
        return (
          <svg width={size} height={size} viewBox="-11.5 -10.23 23 20.46" fill="none" className={className}>
            <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
            <g stroke="#61DAFB" strokeWidth="1.1" fill="none">
              <ellipse rx="11" ry="4.2" />
              <ellipse rx="11" ry="4.2" transform="rotate(60)" />
              <ellipse rx="11" ry="4.2" transform="rotate(120)" />
            </g>
          </svg>
        );

      // 18. NEXT.JS — Official Monogram N
      case "nextjs":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <circle cx="12" cy="12" r="11" fill="#000000" stroke="#333333" strokeWidth="0.8" />
            <path d="M19.9 20.9L10.9 9.3H8.8v7.4h1.8v-4.9l7.9 10.3c.5-.2 1-.5 1.4-.8z" fill="#FFFFFF" />
            <rect fill="#FFFFFF" height="7.4" width="1.8" x="15.4" y="9.3" />
          </svg>
        );

      // 19. VUE
      case "vue":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M2 3h4l6 10L18 3h4L12 21 2 3z" fill="#4FC08D" />
            <path d="M6 3h3.5L12 7.5 14.5 3H18L12 13 6 3z" fill="#35495E" />
          </svg>
        );

      // 20. ANGULAR
      case "angular":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M12 2L2.5 5.5l1.5 12L12 22l8-4.5 1.5-12L12 2z" fill="#DD0031" />
            <path d="M12 4.5l6 12.5h-2.2l-1.2-3H9.4l-1.2 3H6L12 4.5zm-1.8 7.5h3.6L12 7.5l-1.8 4.5z" fill="#FFFFFF" />
          </svg>
        );

      // 21. SVELTE
      case "svelte":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M18.8 4.8C16.9 2.6 13.8 2 11.2 3.1L5.8 5.6C4.4 6.3 3.3 7.6 3.1 9.1c-.2 1.6.4 3.1 1.6 4.1l1.5 1.2-2.3 1.1c-1.4.7-2.3 2-2.5 3.5-.2 1.6.4 3.1 1.6 4.1 1.9 1.6 4.5 1.9 6.7 1l5.4-2.5c1.4-.7 2.4-2 2.6-3.5.2-1.6-.4-3.1-1.6-4.1l-1.5-1.2 2.3-1.1c1.4-.7 2.3-2 2.5-3.5.2-1.5-.4-3-1.6-4z" fill="#FF3E00" />
          </svg>
        );

      // 22. NODE.JS
      case "node":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M12 2l8.5 5v10L12 22l-8.5-5V7L12 2z" fill="#339933" />
            <path d="M12 5.5l5.5 3.2v6.4L12 18.5l-5.5-3.4V8.7L12 5.5z" fill="#222222" />
            <path d="M12 8.5l3 1.7v3.5L12 15.5l-3-1.8v-3.5l3-1.7z" fill="#83CD29" />
          </svg>
        );

      // 23. LARAVEL
      case "laravel":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M19.5 6.5l-6-3.5a2 2 0 00-2 0l-6 3.5a2 2 0 00-1 1.7v7a2 2 0 001 1.7l6 3.5a2 2 0 002 0l6-3.5a2 2 0 001-1.7v-7a2 2 0 00-1-1.7zm-7.5-1.4l4.5 2.6-4.5 2.6-4.5-2.6 4.5-2.6zm-5.5 4.3l4.5 2.6v5.2l-4.5-2.6v-5.2zm11 5.2l-4.5 2.6v-5.2l4.5-2.6v5.2z" fill="#FF2D20" />
          </svg>
        );

      // 24. DJANGO
      case "django":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <rect width="24" height="24" rx="4" fill="#092E20" />
            <path d="M12.5 6.5v11h-2v-4.5a3 3 0 01-2.5 1.5c-2.2 0-3.5-1.8-3.5-4s1.3-4 3.5-4a3 3 0 012.5 1.5v-1.5h2zm-2 4.5a2 2 0 10-4 0 2 2 0 004 0zm8-1v2h-2.5a1.5 1.5 0 00-1.5 1.5v3c0 2-1.5 3-3.5 3h-1.5v-2h1.5c1 0 1.5-.5 1.5-1.5V10h4.5z" fill="#44B78B" />
          </svg>
        );

      // 25. SPRING BOOT
      case "spring":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <circle cx="12" cy="12" r="10" fill="#6DB33F" />
            <path d="M8.5 15.5c4 2.5 8-1 9-6-3.5-.5-7 1.5-9 6z" fill="#FFFFFF" />
          </svg>
        );

      // 26. FLUTTER
      case "flutter":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M13.5 2L3 12.5l3.5 3.5L20.5 2h-7z" fill="#42A5F5" />
            <path d="M13.5 12l-5 5 3.5 3.5 5-5-3.5-3.5z" fill="#0D47A1" />
            <path d="M12 20.5l3.5 3.5H22l-6.5-6.5-3.5 3z" fill="#42A5F5" />
          </svg>
        );

      // 27. ANDROID
      case "android":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M6 18c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9H6v9zm6-14C8.7 4 6 6.7 6 10h12c0-3.3-2.7-6-6-6zM4 9h1v8H4zm15 0h1v8h-1z" fill="#3DDC84" />
            <circle cx="9" cy="7.5" r="0.8" fill="#FFFFFF" />
            <circle cx="15" cy="7.5" r="0.8" fill="#FFFFFF" />
          </svg>
        );

      // 28. APPLE / IOS
      case "apple":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M18.7 19.5c-.8 1.2-1.7 2.4-3 2.4-1.3 0-1.8-.8-3.3-.8s-2 .8-3.3.8c-1.3 0-2.3-1.2-3.1-2.4C4.3 17 3.5 13.5 4.8 11.2c.7-1.2 1.9-2 3.2-2 1.3 0 2.2.8 3 .8.8 0 2-.8 3.4-.8 1.1 0 2.2.5 2.9 1.4-2.5 1.5-2.1 4.9.4 6-1.5 2.1-2.5 4.9-5 4.9zM15 6.5c.6-.8 1-1.9.9-3-.9.1-2 .6-2.6 1.4-.6.7-1 1.8-.9 2.9 1.1.1 2-.5 2.6-1.3z" fill="#A2AAAD" />
          </svg>
        );

      // 29. MYSQL
      case "mysql":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.5 14.5c-1.2 1-3 1.5-4.5 1.5-3.5 0-6-2.5-6-6s2.5-6 6-6c2 0 3.8.8 5 2.2l-1.8 1.8c-.8-.9-2-1.5-3.2-1.5-2 0-3.5 1.5-3.5 3.5s1.5 3.5 3.5 3.5c1.2 0 2.2-.4 3-1.1v-1.4h-3v-2.2h5.5v5.6z" fill="#00758F" />
          </svg>
        );

      // 30. POSTGRESQL — Official Slonik Elephant
      case "postgresql":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <circle cx="12" cy="12" r="10" fill="#336791" />
            <path
              d="M12 5.5c-2.8 0-4.5 1.7-5 3.8-.8.3-1.5.8-1.9 1.6-.9 1.5-.7 3.8.1 5.5.4.7.9 1.3 1.5 1.7.3-.5.6-1.2 1.1-1.8.5-.6 1-1.2 1.6-1.7.7-.7 1.5-1.4 2.3-2 .7-.6 1.4-1 2-1.4.6-.4 1.1-.7 1.4-.8.4-.2.6-.2.6-.2s-.1-.2-.4-.4c-.3-.3-.7-.6-1.2-1-.6-.3-1.3-.7-2.1-1-.9-.3-1.9-.5-3-.5zm3.7 4.4c-.7.4-1.5.9-2.2 1.4-.8.6-1.6 1.2-2.3 2-.6.5-1.1 1.1-1.6 1.7-.5.6-.9 1.3-1.2 1.8.8.5 1.7.7 2.8.7.3 0 .6 0 .8-.1.2-.5.5-1.1.8-1.7.3-.7.8-1.5 1.3-2.2.5-.8 1.1-1.5 1.7-2.1.6-.6 1.1-1.1 1.6-1.5.1-.1.3-.2.3-.2s-.2 0-.4 0c-.5 0-1 .1-1.6.2z"
              fill="#FFFFFF"
            />
          </svg>
        );

      // 31. MONGODB — Official Leaf
      case "mongodb":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M12 2C8 7 6 12 7 17c1 4 4 5 5 5s4-1 5-5c1-5-1-10-5-15z" fill="#47A248" />
            <path d="M12 2v20c1 0 4-1 5-5 1-5-1-10-5-15z" fill="#13AA52" />
          </svg>
        );

      // 32. REDIS
      case "redis":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M12 2L2 7l10 5 10-5-10-5zm0 6.5L4.5 5 12 1.5 19.5 5 12 8.5zM2 12l10 5 10-5v3l-10 5-10-5v-3zm0 5l10 5 10-5v3l-10 5-10-5v-3z" fill="#DC382D" />
          </svg>
        );

      // 33. SQLITE
      case "sqlite":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M4 17l6 5 10-15-4-3-8 9-2-2-2 6z" fill="#003B57" />
            <path d="M10 22l10-15-4-3-8 9 2 9z" fill="#00ADD8" />
          </svg>
        );

      // 34. DOCKER — Official Whale & Container Grid
      case "docker":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path
              d="M23 11.5c-.4-.3-1.1-.5-2-.5-.6 0-1.2.2-1.8.4-.4-.9-1.2-1.6-2.1-1.9-.5-.2-1-.2-1.5-.2 0 .4.2.8.4 1.1.3.4.7.6 1.2.7l.2.1c.5.1 1.1.3 1.5.7.3.3.6.8.6 1.3H1.2v.6c.2 2.4 1.4 4.5 3.2 5.9 1.8 1.3 4.4 2 7.1 2 8 0 13.5-4.5 14.3-9.9.5-.1.9-.4 1.3-.8l.2-.2c.2-.3.3-.4 0-.6l-.5-.3z"
              fill="#2496ED"
            />
            <g fill="#2496ED">
              <rect x="4.8" y="9.2" width="2.4" height="2.4" rx="0.3" />
              <rect x="7.9" y="9.2" width="2.4" height="2.4" rx="0.3" />
              <rect x="11" y="9.2" width="2.4" height="2.4" rx="0.3" />
              <rect x="14.1" y="9.2" width="2.4" height="2.4" rx="0.3" />
              <rect x="7.9" y="6.3" width="2.4" height="2.4" rx="0.3" />
              <rect x="11" y="6.3" width="2.4" height="2.4" rx="0.3" />
              <rect x="14.1" y="6.3" width="2.4" height="2.4" rx="0.3" />
              <rect x="11" y="3.4" width="2.4" height="2.4" rx="0.3" />
            </g>
          </svg>
        );

      // 35. KUBERNETES — Official 7-Spoke Helm
      case "kubernetes":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <circle cx="12" cy="12" r="10" fill="#326CE5" />
            <path
              d="M12 5.5l1.6 2.8 3.2-.8-.2 3.3 2.9 1.5-2 2.6 1.7 2.8-3.1.9-.9 3.1-2.9-1.5-2.6 2-1.1-3.1-3.1-.4.9-3.2-2.4-2.2 2.7-1.9-.3-3.2 3.2-.4 1.3-2.9 2.6 1.6z"
              fill="#FFFFFF"
            />
            <circle cx="12" cy="12" r="2.8" fill="#326CE5" />
          </svg>
        );

      // 36. LINUX — Official Tux Penguin Silhouette
      case "linux":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M12 2c-3 0-4.7 2.2-4.7 5.2 0 1.5.4 3 .4 4.5-1.5 1.5-3 3.7-3 6.3 0 3.3 2.2 5.2 4.5 5.2.4.6 1.1 1.1 2.8 1.1s2.4-.5 2.8-1.1c2.2 0 4.5-1.9 4.5-5.2 0-2.6-1.5-4.8-3-6.3 0-1.5.4-3 .4-4.5C16.7 4.2 15 2 12 2z" fill="#222222" />
            <path d="M12 10.2c-2.6 0-3.7 3-3.7 6.7 0 3.3 1.5 5.2 3.7 5.2s3.7-1.9 3.7-5.2c0-3.7-1.1-6.7-3.7-6.7z" fill="#FFFFFF" />
            <circle cx="10.5" cy="6.5" r="0.7" fill="#FFFFFF" />
            <circle cx="13.5" cy="6.5" r="0.7" fill="#FFFFFF" />
            <circle cx="10.7" cy="6.5" r="0.4" fill="#000000" />
            <circle cx="13.3" cy="6.5" r="0.4" fill="#000000" />
            <path d="M10.9 7.6h2.2l-1.1 1.9-1.1-1.9z" fill="#FFA500" />
            <path d="M7.1 22.5c-1.5 0-3 .7-2.2 1.9 1.5.7 2.6 0 4.1-.7l-1.9-1.2zm9.8 0c1.5 0 3 .7 2.2 1.9-1.5.7-2.6 0-4.1-.7l1.9-1.2z" fill="#FFA500" />
          </svg>
        );

      // 37. GIT — Official Diamond Commit Graph
      case "git":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M23.5 11l-10.5-10.5c-.6-.6-1.6-.6-2.2 0L8.7 2.6l2.8 2.8c.6-.2 1.4-.1 1.9.4.5.5.7 1.3.5 1.9l2.7 2.7c.6-.2 1.4-.1 1.9.4.7.7.7 1.9 0 2.6-.7.7-1.9.7-2.6 0-.5-.5-.7-1.3-.4-2L12.8 8.7v6.6c.2.1.4.3.5.4.7.7.7 1.9 0 2.6-.7.7-1.9.7-2.6 0-.7-.7-.7-1.9 0-2.6.2-.2.4-.3.6-.4V8.5c-.2-.1-.4-.3-.6-.4-.5-.5-.7-1.3-.5-2L7.6 3.7.5 10.8c-.6.6-.6 1.6 0 2.2l10.5 10.5c.6.6 1.6.6 2.2 0l10.5-10.5c.4-.4.4-1.4-.2-2z" fill="#F05032" />
          </svg>
        );

      // 38. GITHUB — Official Invertocat Silhouette
      case "github":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <rect width="24" height="24" rx="5" fill="#181717" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 3C7.03 3 3 7.04 3 12.02c0 3.98 2.58 7.36 6.16 8.55.45.08.61-.2.61-.43v-1.53c-2.5.54-3.03-1.21-3.03-1.21-.41-1.04-1-1.32-1-1.32-.82-.56.06-.55.06-.55.9.06 1.38.93 1.38.93.8 1.38 2.11.98 2.62.75.08-.58.31-.98.57-1.2-2-.23-4.1-1-4.1-4.46 0-.98.35-1.79.93-2.42-.1-.23-.4-1.14.09-2.38 0 0 .76-.24 2.48.92a8.6 8.6 0 0 1 4.52 0c1.72-1.17 2.47-.92 2.47-.92.49 1.24.18 2.15.09 2.38.58.63.92 1.44.92 2.42 0 3.47-2.1 4.23-4.11 4.45.32.28.61.83.61 1.67v2.48c0 .24.16.52.62.43 3.58-1.2 6.15-4.57 6.15-8.55C21 7.04 16.97 3 12 3z"
              fill="#FFFFFF"
            />
          </svg>
        );

      // 39. AWS
      case "aws":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <rect width="24" height="24" rx="4" fill="#232F3E" />
            <path d="M6 10h1.5l1.5 4.5 1.5-4.5H12l-2.2 6H8.2L6 10zm7 3.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5v2.5H17v-2.5c0-.8-.5-1.2-1.2-1.2s-1.3.4-1.3 1.2v2.5h-1.5v-2.5zm-8 4.5c4 2.5 9 2.5 13 0l.5.8c-4.5 3-10 3-14.5 0l1-.8z" fill="#FF9900" />
          </svg>
        );

      // 40. GOOGLE CLOUD (GCP)
      case "gcp":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M19.3 10.5C18.7 7.4 16 5 12.8 5 10.4 5 8.3 6.3 7.3 8.3 4.3 8.8 2 11.4 2 14.5 2 18 4.8 20.8 8.3 20.8h10.4c3 0 5.3-2.4 5.3-5.3 0-2.6-1.8-4.7-4.7-5z" fill="#4285F4" />
            <path d="M12.8 5c1.6 0 3.1.6 4.2 1.7l-2.3 2.3c-.5-.5-1.2-.8-1.9-.8-1.4 0-2.6 1-2.9 2.3H7.3C8.3 6.3 10.4 5 12.8 5z" fill="#EA4335" />
            <path d="M7.3 8.3c-.2.7-.3 1.4-.3 2.2 0 .8.1 1.5.3 2.2h2.6c-.3-.7-.4-1.4-.4-2.2 0-.8.1-1.5.4-2.2H7.3z" fill="#FBBC05" />
            <path d="M9.9 12.7c.3 1.3 1.5 2.3 2.9 2.3 1.1 0 2-.6 2.5-1.4l2.2 1.4C16.3 16.5 14.7 17.5 12.8 17.5c-2.4 0-4.5-1.3-5.5-3.3l2.6-1.5z" fill="#34A853" />
          </svg>
        );

      // 41. AZURE
      case "azure":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M13.2 2.5l-6.8 12.8 4.6 6.2 9.5-2.2-7.3-16.8zm.5 13.5l-4-4.5 5.5-7.5 5 12.8-6.5-.8z" fill="#0089D6" />
          </svg>
        );

      // 42. FIGMA
      case "figma":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M8 2h4v5H8a2.5 2.5 0 010-5z" fill="#F24E1E" />
            <path d="M12 2h4a2.5 2.5 0 010 5h-4V2z" fill="#FF7262" />
            <path d="M8 7h4v5H8a2.5 2.5 0 010-5z" fill="#A259FF" />
            <circle cx="14.5" cy="9.5" r="2.5" fill="#1ABCFE" />
            <path d="M8 12h4v4.5a2.5 2.5 0 01-5 0V12h1z" fill="#0ACF83" />
          </svg>
        );

      // 43. EXCEL
      case "excel":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <rect width="24" height="24" rx="4" fill="#107C41" />
            <path d="M14 6h6v12h-6V6zm-8 3l3.5 3-3.5 3h2l2.5-2.2 2.5 2.2h2l-3.5-3 3.5-3h-2l-2.5 2.2L8 9H6z" fill="#FFFFFF" />
          </svg>
        );

      // 44. NGINX
      case "nginx":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M12 2L2 7.5v9L12 22l10-5.5v-9L12 2zm6 13.5l-5-7.5v7.5h-2V8h2l5 7.5V8h2v7.5z" fill="#009639" />
          </svg>
        );

      // AI & DATA & DOMAIN ICONS
      case "machine_learning":
        return <Brain className={`${className} text-purple-400`} size={size} />;

      case "deep_learning":
        return <Cpu className={`${className} text-pink-400`} size={size} />;

      case "nlp":
        return <MessageSquareCode className={`${className} text-emerald-400`} size={size} />;

      case "computer_vision":
        return <Eye className={`${className} text-blue-400`} size={size} />;

      case "generative_ai":
        return <Sparkles className={`${className} text-amber-400`} size={size} />;

      case "speech":
        return <Mic className={`${className} text-indigo-400`} size={size} />;

      case "robotics":
        return <Bot className={`${className} text-red-400`} size={size} />;

      case "reinforcement":
        return <Gamepad2 className={`${className} text-purple-400`} size={size} />;

      case "data_science":
      case "data_analytics":
        return <BarChart3 className={`${className} text-cyan-400`} size={size} />;

      case "algorithm":
        return <Binary className={`${className} text-indigo-400`} size={size} />;

      case "security":
        return <Shield className={`${className} text-red-500`} size={size} />;

      case "math":
        return <Calculator className={`${className} text-yellow-400`} size={size} />;

      case "computer_systems":
        return <Server className={`${className} text-lime-400`} size={size} />;

      case "web_dev":
        return <Globe className={`${className} text-blue-400`} size={size} />;

      case "database":
      case "sql":
        return <Database className={`${className} text-amber-400`} size={size} />;

      default:
        return <Code className={`${className} text-text-secondary`} size={size} />;
    }
}
