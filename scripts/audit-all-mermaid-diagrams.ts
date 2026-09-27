// Mock DOM environment for Mermaid v12 in headless Node.js
const dom = {
  addEventListener: () => {},
  removeEventListener: () => {},
  matchMedia: () => ({ matches: false, addListener: () => {}, removeListener: () => {} }),
  location: { href: 'http://localhost:3000' },
  navigator: { userAgent: 'node' },
};
(globalThis as any).window = dom;
(globalThis as any).document = {
  createElement: () => ({ setAttribute: () => {}, appendChild: () => {}, style: {}, innerHTML: '' }),
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  body: { appendChild: () => {}, removeChild: () => {} }
};

import { machineLearningCurriculum } from "../src/lib/curriculum/topics/19-machine-learning";
import { sanitizeMermaidChart } from "../src/components/ui/mermaid-diagram";

async function auditMermaid() {
  const dp = await import("dompurify");
  const DOMPurify = (dp as any).default || dp;
  if (!DOMPurify.sanitize) {
    DOMPurify.sanitize = (s: any) => s;
  }
  (globalThis as any).DOMPurify = DOMPurify;

  const m = await import("mermaid");
  const mermaid = m.default;

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
  });

  const chapters = machineLearningCurriculum.chapters;
  console.log(`Starting Mermaid parsing audit for all ${chapters.length} chapters...`);

  let totalDiagrams = 0;
  let rawErrors = 0;
  let sanitizedErrors = 0;
  const rawFailureList: Array<{
    chapterIndex: number;
    subchapterId: string;
    subchapterTitle: string;
    error: string;
    chartSnippet: string;
  }> = [];
  const sanitizedFailureList: Array<{
    chapterIndex: number;
    subchapterId: string;
    subchapterTitle: string;
    error: string;
    chartSnippet: string;
  }> = [];

  for (const chapter of chapters) {
    for (const sub of chapter.subchapters) {
      const md = sub.content_markdown || "";
      const matches = md.matchAll(/```(?:mermaid|diagram)([\s\S]*?)```/g);

      for (const match of matches) {
        totalDiagrams++;
        const rawChart = match[1].trim();

        // 1. Test Raw
        try {
          await mermaid.parse(rawChart);
        } catch (err: any) {
          rawErrors++;
          rawFailureList.push({
            chapterIndex: chapter.orderIndex,
            subchapterId: sub.id,
            subchapterTitle: sub.title,
            error: err?.message || String(err),
            chartSnippet: rawChart.slice(0, 180),
          });
        }

        // 2. Test Sanitized
        const cleanChart = sanitizeMermaidChart(rawChart);
        try {
          await mermaid.parse(cleanChart);
        } catch (err: any) {
          sanitizedErrors++;
          sanitizedFailureList.push({
            chapterIndex: chapter.orderIndex,
            subchapterId: sub.id,
            subchapterTitle: sub.title,
            error: err?.message || String(err),
            chartSnippet: cleanChart.slice(0, 180),
          });
        }
      }
    }
  }

  console.log("\n=======================================================");
  console.log(`TOTAL MERMAID DIAGRAMS AUDITED: ${totalDiagrams}`);
  console.log(`RAW PARSE ERRORS (Source Code): ${rawErrors}`);
  console.log(`SANITIZED PARSE ERRORS (Runtime Sanitizer): ${sanitizedErrors}`);
  console.log("=======================================================\n");

  if (rawFailureList.length > 0) {
    console.log(`RAW FAILED DIAGRAMS (${rawFailureList.length}):`);
    for (const f of rawFailureList) {
      console.log(`\n[CH ${f.chapterIndex}] ${f.subchapterTitle} (${f.subchapterId})`);
      console.log(`  ERROR: ${f.error.split("\n")[0]}`);
      console.log(`  SNIPPET: ${f.chartSnippet.replace(/\n/g, " ")}`);
    }
  }

  if (sanitizedFailureList.length > 0) {
    console.log(`\n⚠️ SANITIZED FAILED DIAGRAMS (${sanitizedFailureList.length}):`);
    for (const f of sanitizedFailureList) {
      console.log(`\n[CH ${f.chapterIndex}] ${f.subchapterTitle} (${f.subchapterId})`);
      console.log(`  ERROR: ${f.error.split("\n")[0]}`);
      console.log(`  CLEAN SNIPPET: ${f.chartSnippet.replace(/\n/g, " ")}`);
    }
  }
}

auditMermaid().catch(console.error);
