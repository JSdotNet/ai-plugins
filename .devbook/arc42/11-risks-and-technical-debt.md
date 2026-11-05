# 11. Risks and Technical Debt

```meta
related: [".devbook/arc42/tdr/README.md"]
```

Known debt is recorded one item per file in [tdr/](tdr/README.md), with a number and the
date it was logged.

## Risks

```meta
related: [".devbook/arc42/08-crosscutting-concepts.md#one-file-two-hosts"]
```

### A host changes its plugin contract

```meta
```

- **Why it matters:** One file serves both hosts only because each ignores what it does not
  know. If a host starts to reject unknown keys or tool names, or changes where it discovers
  hooks, assets break without warning. The dead `SessionStart` prompt hooks showed that a
  failure can be silent.
- **What limits it:** The checker encodes every difference found so far. No workflow runs
  `claude plugin validate`, and only the rule for a function-hook module asks for it:
  [claude plugin validate](../ai/03-checking.md#claude-plugin-validate).

### The tool map goes stale

```meta
```

- **Why it matters:** A host renames or adds a tool id. Agents then lose the capability in one
  host while the checker stays green.
- **What limits it:** The checker fails on an unmapped Copilot id, and MCP servers are granted
  whole so renamed tools keep working.
