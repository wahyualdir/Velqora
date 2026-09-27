import { machineLearningCurriculum } from "../src/lib/curriculum/topics/19-machine-learning";

async function runAudit() {
  console.log("===============================================================================");
  console.log("   VELQORA MACHINE LEARNING MODULE: INTEGRITY & SYNTAX AUDIT (BAB 01 - 32)   ");
  console.log("===============================================================================\n");

  const chapters = machineLearningCurriculum.chapters;
  console.log(`Total Chapters Loaded: ${chapters.length}`);

  let totalSubchapters = 0;
  let totalMermaidDiagrams = 0;
  let totalCodeBlocks = 0;
  let totalFormulas = 0;
  let totalCalloutBlocks = 0;
  let rawEmoticonViolations: { chapter: string; sub: string; line: string }[] = [];
  let mermaidSyntaxWarnings: { chapter: string; sub: string; reason: string; snippet: string }[] = [];
  let unclosedMathErrors: { chapter: string; sub: string; line: string }[] = [];
  let subchaptersWithout3Code: { chapter: string; sub: string; count: number }[] = [];

  for (const ch of chapters) {
    for (const sub of ch.subchapters) {
      totalSubchapters++;
      const md = sub.content_markdown || "";

      // 1. Check for raw OS emoticons that might have leaked outside transformed callouts
      const lines = md.split("\n");
      for (const line of lines) {
        if (/[⚠️💡📌]/.test(line)) {
          // Check if it fits the standard pattern: (?:[-*]?\s*)?[⚠️💡📌]\s*\*\*...
          const isValidAlert = /^[ \t]*[-*]?[ \t]*[⚠️💡📌][ \t]*\*\*[^*]+\*\*/.test(line);
          if (!isValidAlert) {
            rawEmoticonViolations.push({
              chapter: ch.title,
              sub: sub.title,
              line: line.trim().slice(0, 80),
            });
          } else {
            totalCalloutBlocks++;
          }
        }
      }

      // 2. Check KaTeX display & inline math
      const displayMathMatches = md.match(/\$\$[\s\S]*?\$\$/g);
      if (displayMathMatches) {
        totalFormulas += displayMathMatches.length;
      }
      const rawDollarDoubleCount = (md.match(/\$\$/g) || []).length;
      if (rawDollarDoubleCount % 2 !== 0) {
        unclosedMathErrors.push({
          chapter: ch.title,
          sub: sub.title,
          line: `Odd count of '$$' delimiters (${rawDollarDoubleCount})`,
        });
      }

      // 3. Check code blocks: Scratch, SOTA, Diagnostics
      const codeFenceMatches = md.match(/```(?:python|py)[\s\S]*?```/g) || [];
      totalCodeBlocks += codeFenceMatches.length;

      if (codeFenceMatches.length < 3) {
        subchaptersWithout3Code.push({
          chapter: ch.title,
          sub: sub.title,
          count: codeFenceMatches.length,
        });
      }

      // 4. Check Mermaid blocks
      const mermaidMatches = md.match(/```(?:mermaid|diagram)([\s\S]*?)```/g);
      if (mermaidMatches) {
        for (const mBlock of mermaidMatches) {
          totalMermaidDiagrams++;
          const code = mBlock.replace(/```(?:mermaid|diagram)/, "").replace(/```$/, "").trim();

          // Basic syntax validation
          const validHeaders = ["graph", "flowchart", "sequenceDiagram", "classDiagram", "stateDiagram", "erDiagram", "gantt", "pie", "gitGraph", "mindmap", "timeline"];
          const startsValid = validHeaders.some((h) => code.startsWith(h));
          if (!startsValid) {
            mermaidSyntaxWarnings.push({
              chapter: ch.title,
              sub: sub.title,
              reason: "Diagram header does not match standard mermaid diagram type",
              snippet: code.slice(0, 60),
            });
          }

          // Bracket balancing check
          const openSquare = (code.match(/\[/g) || []).length;
          const closeSquare = (code.match(/\]/g) || []).length;
          if (openSquare !== closeSquare) {
            mermaidSyntaxWarnings.push({
              chapter: ch.title,
              sub: sub.title,
              reason: `Unbalanced square brackets in diagram: [${openSquare}] vs [${closeSquare}]`,
              snippet: code.slice(0, 60),
            });
          }
        }
      }
    }
  }

  console.log("-------------------------------------------------------------------------------");
  console.log(`Subchapters Audited:       ${totalSubchapters}`);
  console.log(`Formulas (KaTeX $$):       ${totalFormulas}`);
  console.log(`Python Code Blocks:        ${totalCodeBlocks} (Avg ${(totalCodeBlocks / totalSubchapters).toFixed(1)} per subbab)`);
  console.log(`Mermaid Diagram Blocks:    ${totalMermaidDiagrams}`);
  console.log(`Callouts Formatted:        ${totalCalloutBlocks}`);
  console.log("-------------------------------------------------------------------------------");
  console.log(`Raw Emoticon Violations:   ${rawEmoticonViolations.length}`);
  console.log(`Unclosed Math ($$) Errors: ${unclosedMathErrors.length}`);
  console.log(`Mermaid Syntax Warnings:   ${mermaidSyntaxWarnings.length}`);
  console.log(`Subchapters with < 3 Code: ${subchaptersWithout3Code.length}`);

  if (rawEmoticonViolations.length > 0) {
    console.log("\n[!] RAW EMOJI LEAKS:");
    rawEmoticonViolations.slice(0, 5).forEach((e) => console.log(`- ${e.chapter} -> ${e.sub}: ${e.line}`));
  }

  if (mermaidSyntaxWarnings.length > 0) {
    console.log("\n[!] MERMAID SYNTAX WARNINGS:");
    mermaidSyntaxWarnings.forEach((w) => console.log(`- ${w.chapter} -> ${w.sub}: ${w.reason} (${w.snippet})`));
  }

  if (unclosedMathErrors.length > 0) {
    console.log("\n[!] UNCLOSED MATH ERRORS:");
    unclosedMathErrors.forEach((e) => console.log(`- ${e.chapter} -> ${e.sub}: ${e.line}`));
  }

  console.log("\n-------------------------------------------------------------------------------");
  console.log("TESTING HTTP ENDPOINT: http://localhost:3000/dashboard/modul/kategori/machine-learning");
  console.log("-------------------------------------------------------------------------------");
  try {
    const res = await fetch("http://localhost:3000/dashboard/modul/kategori/machine-learning");
    console.log(`HTTP Status: ${res.status} ${res.statusText}`);
    const html = await res.text();
    console.log(`HTML Response Length: ${html.length} bytes`);
    console.log(`Contains 'Machine Learning': ${html.includes("Machine Learning")}`);
    console.log(`Contains 'Velqora': ${html.includes("Velqora")}`);
  } catch (err: any) {
    console.error("HTTP Fetch Error:", err.message);
  }

  console.log("\n>>> AUDIT SCRIPT COMPLETED! <<<");
}

runAudit().catch(console.error);
