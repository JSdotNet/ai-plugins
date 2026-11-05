// Unit check for tool categorization: a shell call running the Playwright CLI counts as QA,
// every other shell call stays Shell, and Aspire MCP tools stay QA.
//
// Covers both copies of categorizeTool — this server's and the copilot-app extension's —
// because the two are kept in step by hand.
import { categorizeTool as claudeCategorize } from "../insight.mjs";
import { categorizeTool as copilotCategorize } from "../../../../copilot-app/extensions/orch-dashboard/insight.mjs";

const QA = "QA (Playwright/Aspire)";

let failures = 0;
function check(label, actual, expected) {
    const ok = actual === expected;
    if (!ok) failures++;
    console.log(`${ok ? "PASS" : "FAIL"}  ${label}${ok ? "" : `\n        expected: ${expected}\n        actual:   ${actual}`}`);
}

for (const [host, categorizeTool] of [["claude-desktop", claudeCategorize], ["copilot-app", copilotCategorize]]) {
    check(`${host}: playwright-cli screenshot`, categorizeTool("Bash", { command: "playwright-cli screenshot --filename=a.png" }), QA);
    check(`${host}: npx @playwright/cli`, categorizeTool("PowerShell", { command: "npx -y @playwright/cli open http://localhost" }), QA);
    check(`${host}: chained after cd`, categorizeTool("bash", { command: "cd app && playwright-cli -s=qa snapshot" }), QA);
    check(`${host}: npx playwright test stays Shell`, categorizeTool("Bash", { command: "npx playwright test" }), "Shell");
    check(`${host}: no input stays Shell`, categorizeTool("Bash"), "Shell");
    check(`${host}: Aspire MCP tool stays QA`, categorizeTool("mcp__plugin_qa_aspire__list_traces"), QA);
}

if (failures) {
    console.log(`\n${failures} failure(s)`);
    process.exit(1);
}
console.log("\nall passed");
