import fs from "fs";
import path from "path";

// Clean a chart that is serialized with \n and \" inside a TS JSON string
export function cleanSerializedMermaid(rawChart: string): string {
  // rawChart uses "\\n" for line breaks and '\"' for quotes
  const lines = rawChart.split("\\n");

  const cleanedLines = lines.map((line) => {
    let cleaned = line;

    // 0. Conditional probabilities inside parentheses: P(Y|X) -> P(Y given X)
    while (/\(([^)\\]*?)\|([^)\\]*?)\)/.test(cleaned)) {
      cleaned = cleaned.replace(/\(([^)\\]*?)\|([^)\\]*?)\)/g, "$1 given $2");
    }

    // 1. Double pipes ||...|| -> Norm(...)
    cleaned = cleaned.replace(/\|\|([^|\\]+?)\|\|/g, "Norm($1)");

    // 2. Absolute value single pipes |...| inside node labels
    cleaned = cleaned.replace(/(\[[^\]]*?)\s*\|([A-Za-z0-9_().\s\^*/+-]+?)\|\s*([^\]]*?\])/g, "$1 Abs($2) $3");
    cleaned = cleaned.replace(/(\{[^}]*?)\s*\|([A-Za-z0-9_().\s\^*/+-]+?)\|\s*([^}]*?\})/g, "$1 Abs($2) $3");
    cleaned = cleaned.replace(/(\([^)]*?)\s*\|([A-Za-z0-9_().\s\^*/+-]+?)\|\s*([^)]*?\))/g, "$1 Abs($2) $3");

    // Cauchy-Schwarz and <u, v>
    cleaned = cleaned.replace(/\|<([^>]+)>\|/g, "Abs(inner($1))");
    cleaned = cleaned.replace(/<([A-Za-z0-9_,\s]+)>/g, "($1)");

    // 3. Edge labels: wrap in escaped quotes \"...\" if not already wrapped
    cleaned = cleaned.replace(/(-->|-\.->|==>|---|--)\s*\|([^|\\]+)\|/g, (match, arrow, label) => {
      let trimmed = label.trim();

      // Check if already quoted with \"
      if (trimmed.startsWith('\\"') && trimmed.endsWith('\\"')) {
        let inside = trimmed.slice(2, -2);
        inside = inside.replace(/<=/g, "≤").replace(/>=/g, "≥");
        return `${arrow}|\\"${inside}\\"|`;
      }

      // Check if already quoted with "
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        let inside = trimmed.slice(1, -1);
        inside = inside.replace(/<=/g, "≤").replace(/>=/g, "≥");
        return `${arrow}|\\"${inside}\\"|`;
      }

      trimmed = trimmed.replace(/([A-Z])\|([A-Z])/g, "$1 given $2");
      trimmed = trimmed.replace(/\|/g, " / ");
      trimmed = trimmed.replace(/<=/g, "≤").replace(/>=/g, "≥");

      return `${arrow}|\\"${trimmed}\\"|`;
    });

    return cleaned;
  });

  return cleanedLines.join("\\n");
}

function runRemediation() {
  const dir = path.join(process.cwd(), "src/lib/curriculum/topics/machine-learning");
  const files = fs.readdirSync(dir).filter(f => f.startsWith("chunk") && f.endsWith(".ts"));

  console.log(`Found ${files.length} chunk files in ${dir}`);

  let totalDiagramsFound = 0;
  let totalDiagramsModified = 0;
  let totalFilesModified = 0;

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const content = fs.readFileSync(fullPath, "utf-8");

    let fileModified = false;
    const newContent = content.replace(/```(?:mermaid|diagram)([\s\S]*?)```/g, (match, chart) => {
      totalDiagramsFound++;
      const cleaned = cleanSerializedMermaid(chart);
      if (cleaned !== chart) {
        totalDiagramsModified++;
        fileModified = true;
        return `\`\`\`mermaid${cleaned}\`\`\``;
      }
      return match;
    });

    if (fileModified) {
      fs.writeFileSync(fullPath, newContent, "utf-8");
      totalFilesModified++;
      console.log(`  [REMEDIATED] ${file}`);
    }
  }

  console.log(`\n===========================================`);
  console.log(`TOTAL MERMAID DIAGRAMS INSPECTED: ${totalDiagramsFound}`);
  console.log(`TOTAL MERMAID DIAGRAMS REMEDIATED: ${totalDiagramsModified}`);
  console.log(`TOTAL FILES UPDATED:              ${totalFilesModified}`);
  console.log(`===========================================\n`);
}

runRemediation();
