# Tool Ids in Agent Prose Are Unchecked

```meta
date: 2026-09-14
related: [".devbook/arc42/08-crosscutting-concepts.md#tool-map"]
```

The checker compares an agent's `tools` list with `tools/tool-map.json`, but it never reads
the agent's body. A host-specific tool name in the prose passes the check. One is known
today: `plugins/csharp-coding/agents/coding.agent.md` names `web/fetch` as its fallback.

## Why it exists

```meta
```

The frontmatter can be parsed exactly, but the prose cannot. Telling a tool id apart from a
path or a URL in free text needs a heuristic. The rule is written for authors instead
(`AGENTS.md`: keep host-specific tool names out of skill and contract prose).

## Impact

```meta
```

- In Claude, an agent told to call `web/fetch` looks for a tool that does not exist. It then
  either improvises or reports itself blocked.
- The rule depends on reviewers catching it, and one instance has already landed.

## Remediation

```meta
```

- **Scan agent and skill bodies for the keys in `tool-map.json`,** outside code fences, and
  warn on each match. The map is the vocabulary, so there is no heuristic to maintain.
- **Rewrite the one known case** to describe the action ("fetch the page"). This pays the
  instance but not the gap.

None is chosen yet.
