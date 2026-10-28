# qa

```meta
related: [".devbook/arc42/05-building-block-view.md#specialists", ".devbook/tech/shared.md#aspire-mcp-server", ".devbook/tech/shared.md#playwright-cli", ".devbook/arc42/adr/flow-control.md", ".devbook/arc42/adr/browser-automation.md"]
```

The runtime validation specialist, and the exemplar for the specialists: a role filled by an
agent, skills that carry the procedure, an MCP server the plugin declares itself, and no flow
control. It starts an application through Aspire, drives browser scenarios through the
Playwright CLI,
watches Aspire logs and traces for the whole session, and returns a report whose every
pass and fail carries an evidence path.

It runs invoked by a person or as a caller's QA delegate. Without a user turn it returns a
decision to its caller rather than asking; it names where an out-of-scope finding belongs and
never hands it off.

## Interfaces

```meta
```

### Agents

```meta
```

| Agent | Role |
| --- | --- |
| `qa` | Runs the application or targets a deployed one, validates scenarios, writes the report under `.wip/qa/<feature>/` |
| `qa-monitor` | A persona split of `qa`: watches logs and traces of an application already running, correlates findings to scenario checkpoints, returns a monitoring summary |

The caller settles monitoring ownership before `qa` starts: caller-owned means the caller runs
`qa-monitor` and merges its summary; otherwise `qa` monitors inline, and that is the default.

### Skills

```meta
```

`aspire-run`, `aspire-log-monitor`, `playwright-validation`, `feature-test-from-issue`,
`deployed-environment-validation`, and `playwright-e2e-authoring`.

### Contracts

```meta
```

Two `resources/` contracts the skills and agents read by path: `qa-evidence.md`, the evidence
policy every validation follows, and `qa-tools.md`, how a bare Aspire tool name resolves to
the plugin-namespaced or the bare server spelling, which `playwright-cli` commands a skill
runs, and what each tool does not expose.

### Tools

```meta
```

| Tool | Reached as | Used for |
| --- | --- | --- |
| `aspire` MCP server | `aspire agent mcp` | Resources, console and structured logs, traces, resource commands |
| Playwright CLI | `playwright-cli`, through the shell | Navigation, input, snapshots, screenshots, video, traces |

The Aspire server is declared under `mcpServers` in both manifests, and the agents grant it
in the plugin-namespaced and the bare spelling —
[Tool Map](../08-crosscutting-concepts.md#tool-map). The Playwright CLI is the person's to
install; a skill checks `playwright-cli --version` first and stops when it does not answer —
[Browser Automation](../adr/browser-automation.md).

### Hooks

```meta
```

A `sessionStart` prompt holding the evidence rule — Aspire for every run, monitoring for the
whole session, an evidence path on every browser finding, a shallower depth recorded as
such — and its Claude twin under `hooks/`.

## Structure

```meta
```

```mermaid
flowchart LR
    qa[qa agent] --> run[aspire-run]
    qa --> deployed[deployed-environment-validation]
    qa --> fromIssue[feature-test-from-issue]
    qa --> validate[playwright-validation]
    qa --> author[playwright-e2e-authoring]
    qa --> monitor[aspire-log-monitor]
    qaMonitor[qa-monitor agent] --> monitor
    run --> aspire[(aspire MCP)]
    monitor --> aspire
    validate --> playwright[[playwright-cli]]
    deployed --> validate
    fromIssue --> run
    fromIssue --> validate
    author -. codifies a passed scenario of .-> validate
```

A local run goes `aspire-run`, then monitoring, then `playwright-validation`;
`deployed-environment-validation` replaces `aspire-run` for an environment already deployed,
and `feature-test-from-issue` derives the scenarios first when the input is an issue.
`playwright-e2e-authoring` turns a scenario that passed into a committed test file, following
the repository's existing Playwright conventions.

## Dependencies

```meta
```

| Depends on | Mechanism |
| --- | --- |
| Aspire CLI | Starts the application and serves the `aspire` MCP server |
| Playwright CLI | Installed by the person (`npm install -g @playwright/cli@latest`), run through the shell |
| `csharp-coding` | Named, not called: the `coding` agent for a runtime bug, the `sre` skill for repeated log errors |

| Depended on by | Mechanism |
| --- | --- |
| A delivery flow's validation stage | Invokes the `qa` agent as a delegate, passes the resolved run context and QA depth, and owns the user turn |
| `react-coding` | Its `frontend` agent names `qa` for runtime validation |
| `claude-desktop`, `copilot-app` dashboards | Render a `qa` stage's per-scenario results and serve its evidence paths from the caller's worktree |
