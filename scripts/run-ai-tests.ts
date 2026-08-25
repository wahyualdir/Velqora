import { runAISubsystemTests } from "../src/lib/ai/__tests__/ai-engine.test";

async function main() {
  console.log("==================================================");
  console.log("RUNNING PRODUCTION AI SUBSYSTEM TEST SUITE (10 TESTS)");
  console.log("==================================================\n");

  const results = await runAISubsystemTests();

  for (const r of results.results) {
    const symbol = r.status === "PASS" ? "✅" : "❌";
    console.log(`${symbol} [${r.status}] ${r.test}`);
    if (r.details) {
      console.log(`   └─ Details: ${r.details}`);
    }
  }

  console.log("\n--------------------------------------------------");
  console.log(`TOTAL PASSED: ${results.passed} / ${results.passed + results.failed}`);
  console.log(`TOTAL FAILED: ${results.failed}`);
  console.log("==================================================");

  if (results.failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Test execution fatal error:", err);
  process.exit(1);
});
