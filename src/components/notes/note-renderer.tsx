"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/ui/code-block";
import { slugify } from "@/lib/utils";
import type { NoteLinkItem } from "@/actions/study/notes";

interface NoteRendererProps {
  content: string;
  outgoingLinks?: NoteLinkItem[];
  onDanglingClick?: (rawTitle: string) => void;
  className?: string;
}

/**
 * Preprocesses markdown to convert [[Wiki-Link]] and #tag into special link tokens,
 * while safely preserving fenced code blocks and inline code spans.
 */
function preprocessObsidianMarkdown(
  raw: string,
  danglingSet: Set<string>,
  slugMap: Map<string, string>
): string {
  if (!raw) return "";

  // Resilience: normalize literal '\n' into actual newlines if string lacks actual line breaks (e.g. unescaped SQL seed)
  const normalizedRaw =
    !raw.includes("\n") && raw.includes("\\n")
      ? raw.replace(/\\n/g, "\n")
      : raw;

  // Split content by code fences (``` ... ```)
  const codeBlockRegex = /(```[\s\S]*?```|`[^`\n]+`)/g;
  const parts = normalizedRaw.split(codeBlockRegex);

  return parts
    .map((part, index) => {
      // If odd index, it was matched by codeBlockRegex -> do not touch
      if (index % 2 === 1) {
        return part;
      }

      let text = part;

      // 1. Transform [[Target Title]] or [[Target Title|Custom Alias]]
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

      // 2. Transform #tag (avoiding headers like # Heading)
      text = text.replace(/(^|[^\w#])#([a-zA-Z0-9_-]+)(?=[^\w#]|$)/g, (_, prefix, tag) => {
        return `${prefix}[#${tag}](taglink:${encodeURIComponent(tag.toLowerCase())})`;
      });

      return text;
    })
    .join("");
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
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom Code Block rendering using existing CodeBlock component
          code({ className: codeClass, children, ...props }) {
            const match = /language-(\w+)/.exec(codeClass || "");
            const codeString = String(children).replace(/\n$/, "");
            const isInline = !codeClass && !codeString.includes("\n");

            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded font-mono text-[12px] bg-surface-secondary text-brand-700 dark:text-brand-400 border border-border"
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
                className="my-3"
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

          // Typography Styling adhering to Velqora Academic Theme
          h1({ children }) {
            return (
              <h1 className="text-xl sm:text-2xl font-bold font-display text-text-primary mt-6 mb-3 tracking-tight border-b border-border/60 pb-2">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="text-lg sm:text-xl font-bold font-display text-text-primary mt-5 mb-2.5 tracking-tight">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-base sm:text-lg font-bold text-text-primary mt-4 mb-2">
                {children}
              </h3>
            );
          },
          p({ children }) {
            return (
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed my-2.5">
                {children}
              </p>
            );
          },
          ul({ children }) {
            return (
              <ul className="list-disc list-inside space-y-1 my-2.5 text-xs sm:text-sm text-text-secondary pl-1">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="list-decimal list-inside space-y-1 my-2.5 text-xs sm:text-sm text-text-secondary pl-1">
                {children}
              </ol>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-3 border-brand-500 bg-surface-secondary/40 pl-3.5 pr-2 py-1.5 my-3 italic text-xs sm:text-sm text-text-secondary">
                {children}
              </blockquote>
            );
          },
          hr() {
            return <hr className="border-border my-6" />;
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-3 border border-border">
                <table className="w-full text-xs text-left border-collapse">{children}</table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-surface-secondary border-b border-border font-mono">{children}</thead>;
          },
          th({ children }) {
            return <th className="p-2.5 text-text-primary font-bold">{children}</th>;
          },
          td({ children }) {
            return <td className="p-2.5 border-b border-border/50 text-text-secondary">{children}</td>;
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
