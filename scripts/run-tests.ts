import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const testDirs = [
  path.join(__dirname, "../src/lib/schedule-import/__tests__"),
  path.join(__dirname, "../src/lib/schedule-generator/__tests__"),
  path.join(__dirname, "../src/lib/schedule/__tests__"),
  path.join(__dirname, "../src/lib/schedule-intelligence/__tests__"),
  path.join(__dirname, "../src/lib/schedule-orchestration/__tests__"),
  path.join(__dirname, "../src/lib/schedule-outcomes/__tests__"),
];

const testFiles: string[] = [];

testDirs.forEach((dir) => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".test.ts"));
    files.forEach((f) => testFiles.push(path.join(dir, f)));
  }
});

console.log(`\n========================================`);
console.log(`VELQORA SMART SCHEDULE ENGINE TEST SUITE`);
console.log(`========================================`);
console.log(`Discovered ${testFiles.length} test suites:`);
testFiles.forEach((f) => console.log(` • ${path.relative(process.cwd(), f)}`));
console.log(`----------------------------------------\n`);

let passedCount = 0;
let failedCount = 0;

for (const file of testFiles) {
  const relPath = path.relative(process.cwd(), file);
  try {
    console.log(`▶ Running Suite: ${relPath}`);
    execSync(`node --import tsx --test --test-force-exit "${file}"`, {
      stdio: "inherit",
    });
    console.log(`✔ Suite Passed: ${relPath}\n`);
    passedCount++;
  } catch (err: any) {
    console.error(`✖ Suite Failed: ${relPath}\n`);
    failedCount++;
  }
}

console.log(`========================================`);
console.log(`TEST SUMMARY: ${passedCount} suites passed, ${failedCount} suites failed.`);
console.log(`========================================\n`);

if (failedCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
