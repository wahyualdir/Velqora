"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import {
  AlertTriangle,
  Lightbulb,
  Bookmark,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { CodeBlock } from "@/components/ui/code-block";
import { slugify } from "@/lib/utils";
import type { NoteLinkItem } from "@/actions/study/notes";

interface NoteRendererProps {
  content: string;
  outgoingLinks?: NoteLinkItem[];
  onDanglingClick?: (rawTitle: string) => void;
  className?: string;
}

interface CalloutProps {
  type: "warning" | "tip" | "note" | "important" | "caution";
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type, title, children }: CalloutProps) {
  const config = {
    warning: {
      border: "border-l-amber-500",
      bg: "bg-amber-500/5 dark:bg-amber-500/10",
      titleColor: "text-amber-800 dark:text-amber-300",
      icon: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />,
      defaultTitle: "Peringatan Teknis",
    },
    tip: {
      border: "border-l-sky-500",
      bg: "bg-sky-500/5 dark:bg-sky-500/10",
      titleColor: "text-sky-800 dark:text-sky-300",
      icon: <Lightbulb className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />,
      defaultTitle: "Wawasan Praktisi",
    },
    note: {
      border: "border-l-brand-500",
      bg: "bg-brand-500/5 dark:bg-brand-500/10",
      titleColor: "text-brand-700 dark:text-brand-300",
      icon: <Bookmark className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />,
      defaultTitle: "Catatan Teori",
    },
    important: {
      border: "border-l-purple-500",
      bg: "bg-purple-500/5 dark:bg-purple-500/10",
      titleColor: "text-purple-700 dark:text-purple-300",
      icon: <AlertCircle className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />,
      defaultTitle: "Poin Penting",
    },
    caution: {
      border: "border-l-rose-500",
      bg: "bg-rose-500/5 dark:bg-rose-500/10",
      titleColor: "text-rose-700 dark:text-rose-300",
      icon: <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />,
      defaultTitle: "Perhatian Kritis",
    },
  }[type] || {
    border: "border-l-brand-500",
    bg: "bg-brand-500/5 dark:bg-brand-500/10",
    titleColor: "text-brand-600 dark:text-brand-400",
    icon: <Bookmark className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />,
    defaultTitle: "Catatan",
  };

  return (
    <div
      className={`my-5 rounded-r-xl border-l-[3px] ${config.border} ${config.bg} p-4 transition-colors select-text not-prose`}
    >
      <div className="flex items-start gap-3">
        {config.icon}
        <div className="flex-1 min-w-0 space-y-1">
          <div className={`text-xs sm:text-sm font-bold tracking-tight font-display ${config.titleColor}`}>
            {title || config.defaultTitle}
          </div>
          <div className="text-[14px] sm:text-[15px] leading-relaxed text-text-secondary">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Preprocesses markdown to convert [[Wiki-Link]], #tag, and raw emoticons
 * into modern alert blockquotes, while safely preserving fenced code blocks and inline code spans.
 */
function preprocessObsidianMarkdown(
  raw: string,
  danglingSet: Set<string>,
  slugMap: Map<string, string>
): string {
  if (!raw) return "";

  // Resilience: normalize literal '\n' into actual newlines if string lacks actual line breaks
  const normalizedRaw =
    !raw.includes("\n") && raw.includes("\\n")
      ? raw.replace(/\\n/g, "\n")
      : raw;

  // Split content by code fences (``` ... ```), inline code (`...`), display math ($$ ... $$), and inline math ($...$)
  const safeBlockRegex = /(```[\s\S]*?```|`[^`\n]+`|\$\$[\s\S]*?\$\$|\$(?!\s)[^\$\n]+(?<!\s)\$)/g;
  const parts = normalizedRaw.split(safeBlockRegex);

  return parts
    .map((part, index) => {
      // If odd index, it was matched by safeBlockRegex -> do not touch (code or math)
      if (index % 2 === 1) {
        return part;
      }

      let text = part;

      // 1. Transform raw bullet emoticons into standard GitHub Alert blockquotes
      // Transform: - ⚠️ **Peringatan Teknis:** or ⚠️ **Peringatan Teknis:**
      text = text.replace(/(?:^|\n)[ \t]*[-*]?[ \t]*⚠️[ \t]*(?:\*\*([^*]+)\*\*[:\s]*(.*)|([^\n]+))/g, (_, boldTitle, restWithBold, plainText) => {
        if (boldTitle) {
          const cleanTitle = boldTitle.replace(/:\s*$/, "").trim();
          const cleanRest = (restWithBold || "").trim();
          return `\n\n> [!WARNING] **${cleanTitle}**\n> ${cleanRest}\n\n`;
        }
        return `\n\n> [!WARNING]\n> ${(plainText || "").trim()}\n\n`;
      });

      // Transform: - 💡 **Wawasan Praktisi:** or 💡 **Wawasan Praktisi:**
      text = text.replace(/(?:^|\n)[ \t]*[-*]?[ \t]*💡[ \t]*(?:\*\*([^*]+)\*\*[:\s]*(.*)|([^\n]+))/g, (_, boldTitle, restWithBold, plainText) => {
        if (boldTitle) {
          const cleanTitle = boldTitle.replace(/:\s*$/, "").trim();
          const cleanRest = (restWithBold || "").trim();
          return `\n\n> [!TIP] **${cleanTitle}**\n> ${cleanRest}\n\n`;
        }
        return `\n\n> [!TIP]\n> ${(plainText || "").trim()}\n\n`;
      });

      // Transform: - 📌 **Catatan Teori:** or 📌 **Catatan Teori:**
      text = text.replace(/(?:^|\n)[ \t]*[-*]?[ \t]*📌[ \t]*(?:\*\*([^*]+)\*\*[:\s]*(.*)|([^\n]+))/g, (_, boldTitle, restWithBold, plainText) => {
        if (boldTitle) {
          const cleanTitle = boldTitle.replace(/:\s*$/, "").trim();
          const cleanRest = (restWithBold || "").trim();
          return `\n\n> [!NOTE] **${cleanTitle}**\n> ${cleanRest}\n\n`;
        }
        return `\n\n> [!NOTE]\n> ${(plainText || "").trim()}\n\n`;
      });

      // 2. Transform [[Target Title]] or [[Target Title|Custom Alias]]
      text = text.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, rawTarget, rawAlias) => {
        const target = rawTarget.trim();
        const label = (rawAlias || target).trim();
        const targetLower = target.toLowerCase();
        const isDangling = danglingSet.has(targetLower);
        const resolvedSlug = slugMap.get(targetLower) || slugify(target);

        if (isDangling) {
          return `[${label}](danglinglink:${encodeURIComponent(target)})`;
        }
        return `[${label}](wikilink:${encodeURIComponent(resolvedSlug)}?title=${encodeURIComponent(target)})`;
      });

      // 3. Transform #tag (avoiding headers like # Heading)
      text = text.replace(/(^|[^\w#])#([a-zA-Z0-9_-]+)(?=[^\w#]|$)/g, (_, prefix, tag) => {
        return `${prefix}[#${tag}](taglink:${encodeURIComponent(tag.toLowerCase())})`;
      });

      return text;
    })
    .join("");
}

function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(extractTextFromChildren).join("");
  if (React.isValidElement(children) && (children.props as any)?.children) {
    return extractTextFromChildren((children.props as any).children);
  }
  return "";
}

function generateHeadingId(children: React.ReactNode): string {
  const text = extractTextFromChildren(children);
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s.-]/g, "")
    .replace(/[\s.]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseAlertBlock(children: React.ReactNode): {
  type: "warning" | "note" | "tip" | "important" | "caution";
  title?: string;
  content: React.ReactNode;
} | null {
  const fullText = extractTextFromChildren(children).trim();
  const match = fullText.match(/^\[!(WARNING|NOTE|TIP|IMPORTANT|CAUTION)\](?:\s*\*\*([^*]+)\*\*[:\s]*)?/i);
  if (!match) return null;

  const rawType = match[1].toLowerCase();
  const type = (rawType === "caution" ? "warning" : rawType) as "warning" | "note" | "tip" | "important" | "caution";
  const explicitTitle = match[2] ? match[2].replace(/:\s*$/, "").trim() : undefined;

  let alertStripped = false;
  function cleanNodes(node: React.ReactNode): React.ReactNode {
    if (typeof node === "string") {
      if (!alertStripped) {
        const clean = node.replace(/^\[!(WARNING|NOTE|TIP|IMPORTANT|CAUTION)\]\s*/i, "");
        if (clean !== node) {
          alertStripped = true;
          return clean;
        }
      }
      return node;
    }
    if (Array.isArray(node)) {
      return node.map((child, idx) => <React.Fragment key={idx}>{cleanNodes(child)}</React.Fragment>);
    }
    if (React.isValidElement(node)) {
      const props = node.props as any;
      if (node.type === "strong" && explicitTitle) {
        const strongText = extractTextFromChildren(node).replace(/:\s*$/, "").trim();
        if (strongText.toLowerCase() === explicitTitle.toLowerCase()) {
          return null;
        }
      }
      if (props && props.children) {
        return React.cloneElement(node, {
          ...props,
          children: cleanNodes(props.children),
        });
      }
    }
    return node;
  }

  const cleanedContent = cleanNodes(children);

  return {
    type,
    title: explicitTitle,
    content: cleanedContent,
  };
}

export function NoteRenderer({
  content,
  outgoingLinks = [],
  onDanglingClick,
  className = "",
}: NoteRendererProps) {
  // Build lookup maps for fast link resolving
  const { danglingSet, slugMap } = useMemo(() => {
    const dangling = new Set<string>();
    const slugs = new Map<string, string>();

    for (const link of outgoingLinks) {
      const lower = link.target_title_raw.toLowerCase().trim();
      if (link.is_dangling || !link.target_slug) {
        dangling.add(lower);
      } else {
        slugs.set(lower, link.target_slug);
        if (link.target_title) {
          slugs.set(link.target_title.toLowerCase().trim(), link.target_slug);
        }
      }
    }

    return { danglingSet: dangling, slugMap: slugs };
  }, [outgoingLinks]);

  const processedContent = useMemo(() => {
    return preprocessObsidianMarkdown(content, danglingSet, slugMap);
  }, [content, danglingSet, slugMap]);

  return (
    <div className={`prose-academic text-text-primary ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[[rehypeKatex, { output: "htmlAndMathml", strict: false, throwOnError: false }]]}
        components={{
          // Custom Code Block rendering using existing CodeBlock component
          code({ className: codeClass, children, ...props }) {
            const match = /language-(\w+)/.exec(codeClass || "");
            const codeString = String(children).replace(/\n$/, "");
            const isInline = !codeClass && !codeString.includes("\n");

            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded font-mono text-[13px] bg-surface-secondary text-brand-700 dark:text-brand-400 border border-border"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock
                code={codeString}
                language={match ? match[1] : "python"}
                title={match ? `snippet.${match[1]}` : undefined}
                className="my-4"
              />
            );
          },

          // Custom Link rendering for Wiki-Links, Dangling Links, and Tags
          a({ href, children }) {
            if (!href) return <span>{children}</span>;

            // Dangling Link ([[Target]] that does not exist yet)
            if (href.startsWith("danglinglink:")) {
              const rawTitle = decodeURIComponent(href.replace("danglinglink:", ""));
              return (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => onDanglingClick?.(rawTitle)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onDanglingClick?.(rawTitle);
                    }
                  }}
                  className="inline-flex items-center text-text-tertiary border-b border-dashed border-text-tertiary/70 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer font-medium transition-colors select-none group"
                  title={`Catatan "${rawTitle}" belum dibuat. Klik untuk membuat.`}
                >
                  <span>[[</span>
                  <span className="underline decoration-dotted decoration-text-tertiary group-hover:decoration-brand-500">
                    {children}
                  </span>
                  <span>]]</span>
                  <span className="ml-1 text-[10px] font-mono text-text-tertiary opacity-70 group-hover:opacity-100">
                    +
                  </span>
                </span>
              );
            }

            // Wiki-Link to existing note
            if (href.startsWith("wikilink:")) {
              const url = new URL(href);
              const slug = decodeURIComponent(url.pathname);
              const titleParam = url.searchParams.get("title") || "";

              return (
                <Link
                  href={`/dashboard/catatan/${slug}`}
                  className="inline-flex items-center font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 underline decoration-brand-500/40 hover:decoration-brand-600 transition-colors"
                  title={`Buka catatan: ${titleParam || slug}`}
                >
                  <span className="opacity-70 text-xs mr-0.5">[[</span>
                  <span>{children}</span>
                  <span className="opacity-70 text-xs ml-0.5">]]</span>
                </Link>
              );
            }

            // Tag link
            if (href.startsWith("taglink:")) {
              const tag = decodeURIComponent(href.replace("taglink:", ""));
              return (
                <Link
                  href={`/dashboard/catatan?tag=${tag}`}
                  className="inline-flex items-center font-mono text-[11px] px-1.5 py-0.5 rounded bg-surface-secondary text-text-secondary border border-border hover:border-brand-500/50 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-500/5 transition-all mr-1 my-0.5"
                >
                  {children}
                </Link>
              );
            }

            // Standard external/internal links
            const isExternal = href.startsWith("http://") || href.startsWith("https://");
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="text-brand-600 dark:text-brand-400 hover:underline font-medium"
              >
                {children}
              </a>
            );
          },

          // Typography Styling adhering to Stripe Docs / GitBook Minimalist Standards
          h1({ children }) {
            const id = generateHeadingId(children);
            return (
              <h1 id={id} className="group relative text-2xl sm:text-3xl font-extrabold font-display text-text-primary mt-8 mb-4 tracking-tight border-b border-border/40 pb-3 scroll-mt-20">
                <span>{children}</span>
                <a href={`#${id}`} className="opacity-0 group-hover:opacity-100 ml-2 text-text-tertiary hover:text-brand-600 transition-opacity" title="Link to this heading" aria-label={`Tautan langsung ke ${id}`}>#</a>
              </h1>
            );
          },
          h2({ children }) {
            const id = generateHeadingId(children);
            return (
              <h2 id={id} className="group relative text-xl sm:text-2xl font-bold font-display text-text-primary mt-7 mb-3 tracking-tight scroll-mt-20">
                <span>{children}</span>
                <a href={`#${id}`} className="opacity-0 group-hover:opacity-100 ml-2 text-text-tertiary hover:text-brand-600 transition-opacity" title="Link to this heading" aria-label={`Tautan langsung ke ${id}`}>#</a>
              </h2>
            );
          },
          h3({ children }) {
            const id = generateHeadingId(children);
            return (
              <h3 id={id} className="group relative text-lg sm:text-xl font-bold font-display text-text-primary mt-6 mb-2.5 scroll-mt-20">
                <span>{children}</span>
                <a href={`#${id}`} className="opacity-0 group-hover:opacity-100 ml-2 text-text-tertiary hover:text-brand-600 transition-opacity" title="Link to this heading" aria-label={`Tautan langsung ke ${id}`}>#</a>
              </h3>
            );
          },
          h4({ children }) {
            const id = generateHeadingId(children);
            return (
              <h4 id={id} className="group relative text-base font-semibold text-text-primary mt-4 mb-2 scroll-mt-20">
                <span>{children}</span>
                <a href={`#${id}`} className="opacity-0 group-hover:opacity-100 ml-2 text-text-tertiary hover:text-brand-600 transition-opacity" title="Link to this heading" aria-label={`Tautan langsung ke ${id}`}>#</a>
              </h4>
            );
          },
          p({ children }) {
            return (
              <p className="text-[15px] sm:text-base leading-[1.8] text-text-secondary my-4">
                {children}
              </p>
            );
          },
          ul({ children }) {
            return (
              <ul className="list-disc list-inside space-y-1.5 my-4 text-[15px] sm:text-base leading-[1.8] text-text-secondary pl-2">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="list-decimal list-inside space-y-1.5 my-4 text-[15px] sm:text-base leading-[1.8] text-text-secondary pl-2">
                {children}
              </ol>
            );
          },
          blockquote({ children }) {
            const alert = parseAlertBlock(children);
            if (alert) {
              return (
                <Callout type={alert.type} title={alert.title}>
                  {alert.content}
                </Callout>
              );
            }
            return (
              <blockquote className="border-l-2 border-brand-500/60 dark:border-brand-400/50 bg-surface-secondary/30 dark:bg-surface-secondary/20 pl-4 py-2.5 my-4 italic text-[14px] sm:text-[15px] text-text-secondary rounded-r-lg">
                {children}
              </blockquote>
            );
          },
          hr() {
            return <hr className="border-border/60 my-6" />;
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4 border border-border/80 rounded-lg">
                <table className="w-full text-xs sm:text-sm text-left border-collapse">{children}</table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-surface-secondary/60 border-b border-border/80 font-mono text-xs">{children}</thead>;
          },
          th({ children }) {
            return <th className="p-3 text-text-primary font-bold">{children}</th>;
          },
          td({ children }) {
            return <td className="p-3 border-b border-border/40 text-text-secondary">{children}</td>;
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
