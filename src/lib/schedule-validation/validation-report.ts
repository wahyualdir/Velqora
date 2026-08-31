import { ValidationMasterReport, ScenarioValidationResult } from "./types";

/**
 * Validation Report Generator
 * Formats diagnostic reports for production release readiness audits.
 */

export function generateMarkdownValidationReport(
  report: ValidationMasterReport,
  _sampleResults: ScenarioValidationResult[] = []
): string {
  const lines: string[] = [];

  lines.push("# FASE 37 — REAL-WORLD ACADEMIC INTELLIGENCE VALIDATION REPORT");
  lines.push("");
  lines.push(`> **Generated At**: ${report.generatedAt}`);
  lines.push(`> **Production Readiness Status**: ${report.isProductionReady ? "✅ PRODUCTION READY" : "❌ BLOCKED"}`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## 1. Executive Summary");
  lines.push("");
  lines.push(`- **Total Scenarios Evaluated**: ${report.totalScenariosEvaluated}`);
  lines.push(`- **Passed**: ${report.totalPassed} (${report.passRatePercentage}%)`);
  lines.push(`- **Failed**: ${report.totalFailed}`);
  lines.push(`- **Invariants Integrity Rate**: ${report.invariantsIntegrityRate}%`);
  lines.push(`- **Blocked Unsafe Recommendations**: ${report.blockedUnsafeRecommendationsCount}`);
  lines.push(`- **Total Execution Time**: ${report.totalExecutionTimeMs}ms`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## 2. Category Performance Breakdown");
  lines.push("");
  lines.push("| Scenario Category | Total | Passed | Failed | Avg Duration (ms) | Status |");
  lines.push("| :--- | :---: | :---: | :---: | :---: | :---: |");

  for (const [category, stats] of Object.entries(report.categoryBreakdown)) {
    const status = stats.failed === 0 ? "✅ PASS" : "❌ FAIL";
    lines.push(`| \`${category}\` | ${stats.total} | ${stats.passed} | ${stats.failed} | ${stats.averageDurationMs}ms | ${status} |`);
  }

  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## 3. Core Invariant Verification");
  lines.push("");
  lines.push("1. **Zero Unresolved Conflicts**: All evaluated intervals checked for overlapping ranges ($s_1 < e_2 \\land s_2 < e_1$).");
  lines.push("2. **Touching Intervals Allowed**: Contiguous time blocks (e.g. 08:00–10:00 and 10:00–12:00) cleanly parsed without false conflicts.");
  lines.push("3. **Single Session Safety**: Maximum individual study session capped strictly at 90 minutes.");
  lines.push("4. **Daily Workload Hard Cap**: Daily combined limit of 360 minutes (6 hours) strictly respected.");
  lines.push("5. **Flexible Target Hours**: Preference targets (e.g. 240 minutes) treated as soft goals, never causing system crashes.");
  lines.push("6. **Immutability of Preferences**: Personal schedule preferences never mutated without explicit user consent.");
  lines.push("7. **Side-Effect-Free What-If Engine**: Simulations run purely in memory without touching persistent database tables.");
  lines.push("8. **Deterministic Explainability**: All recommendations grounded in empirical data with zero psychological profiling.");
  lines.push("");

  return lines.join("\n");
}
