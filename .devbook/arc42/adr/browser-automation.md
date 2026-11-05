# Browser Automation

```meta
date: 2026-10-28
related: [".devbook/arc42/building-blocks/qa.md", ".devbook/tech/shared.md#playwright-cli"]
```

The `qa` plugin drives the browser with the Playwright CLI, `playwright-cli`, run through the
shell. No plugin here declares a Playwright MCP server; the person installs the CLI, and a
skill checks `playwright-cli --version` and stops, naming the install command, when it does
not answer.

## Why

```meta
```

- The CLI records video and traces (`video-start`, `tracing-start`). The MCP server exposed
  neither, so a multi-step flow could only be a numbered screenshot sequence.
- The CLI writes snapshots to disk under `.playwright-cli/` and prints a path. The MCP server
  returned every accessibility snapshot into the agent's context, which a long QA session
  paid for on every step.
- A named session per run (`-s=<name>`) and the in-memory profile by default give the
  isolation `--isolated` bought the MCP server, without a server process per host session.
- The delivery engine's Verify phase in `JSdotNet/devbook` made the same move and blocks
  when the CLI does not answer, so the specialist and the engine name one tool.

## Rejected

```meta
```

- **Keep the MCP server as a fallback.** Two browser paths double every skill's steps and
  the agent's tool list, and a fallback that is rarely exercised drifts; the engine treats
  the MCP server as degraded, not as a substitute.
- **Install the CLI on first use.** A global npm install is the person's call; the skill
  names `npm install -g @playwright/cli@latest` instead.

## History

```meta
```

| Date | Change | Why |
| --- | --- | --- |
| 2026-10-28 | The `playwright` MCP server left both `qa` manifests and the repository's MCP configuration; the skills and the `qa` agent drive `playwright-cli` through the shell, and `mcp-tools.md` became `qa-tools.md`. | The CLI records video and traces and keeps snapshots on disk instead of in the agent's context. |
| 2026-10-26 | `c2c4e4e`: the MCP server started with `--isolated`. | Parallel sessions collided on one persistent profile's lock. |
| 2026-08-04 | `818e20b`: the `qa` plugin declared `@playwright/mcp` and its agents called the `browser_*` tools. | It was the browser tool both hosts could load from a plugin manifest. |
