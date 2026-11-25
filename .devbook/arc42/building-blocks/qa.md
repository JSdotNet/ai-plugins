# qa

```meta
c4: [marketplace.qa]
code: [plugins/qa]
related: [".devbook/arc42/05-building-block-view.md#specialists", ".devbook/tech/shared.md#aspire-cli", ".devbook/tech/shared.md#aspire-mcp-server", ".devbook/tech/shared.md#playwright-cli", ".devbook/arc42/adr/flow-control.md", ".devbook/arc42/adr/browser-automation.md"]
```

`qa` is the runtime validation specialist, and the exemplar for the specialists. It shows the
shape they share:

- A role filled by an agent.
- Skills that carry the procedure.
- The CLIs it runs through the shell, and an MCP server it declares as a fallback.
- No flow control.

**Owns**

- Starting an application through Aspire.
- Driving browser scenarios through the Playwright CLI.
- Watching Aspire logs and traces for the whole session.
- Returning a report whose every pass and fail carries an evidence path.

A person invokes it, or a caller runs it as a QA delegate. Without a user turn it returns a
decision to its caller rather than asking. It names where an out-of-scope finding belongs and
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
| `qa-monitor` | A second `qa` persona: watches a running application's logs and traces, returns a monitoring summary |

`qa-monitor` correlates its findings to scenario checkpoints.

The caller settles monitoring ownership before `qa` starts. When the caller owns it, the caller
runs `qa-monitor` and merges its summary. Otherwise `qa` monitors inline, which is the default.

### Skills

```meta
```

- `aspire-run`
- `aspire-log-monitor`
- `playwright-validation`
- `feature-test-from-issue`
- `deployed-environment-validation`
- `playwright-e2e-authoring`

### Contracts

```meta
```

The skills and agents read two `resources/` contracts by path:

- **`qa-evidence.md`:** the evidence policy every validation follows.
- **`qa-tools.md`:**
  - which `aspire` commands read health, logs, traces, and browser logs;
  - which MCP tool answers each on a host without a shell, in the plugin-namespaced or the bare spelling;
  - which `playwright-cli` commands a skill runs;
  - what each tool does not expose.

### Tools

```meta
```

| Tool | Reached as | Used for |
| --- | --- | --- |
| Aspire CLI | `aspire`, through the shell | Start and stop; `describe` for health and endpoints; `logs` for console and `<frontend>-browser-logs`; `otel logs` and `otel traces` |
| `aspire` MCP server | `aspire agent mcp` | The same reads on a host without a shell |
| Playwright CLI | `playwright-cli`, through the shell | Navigation, input, snapshots, screenshots, video, traces |

- **Aspire CLI:** The person installs it, 17 or later. The skills defer to the `aspire` skill
  that `aspire agent init --skills aspire` installs for every command they do not use.
- **Aspire server:** The fallback only. Both manifests declare it under `mcpServers`, and the
  agents grant it in the plugin-namespaced and the bare spelling. See
  [Tool Map](../08-crosscutting-concepts.md#tool-map).
- **Playwright CLI:** The person installs it. A skill checks `playwright-cli --version` first
  and stops when it does not answer. See [Browser Automation](../adr/browser-automation.md).

### Hooks

```meta
```

A `sessionStart` prompt holds the evidence rule, and its Claude twin sits under `hooks/`. The
rule asks for:

- Aspire for every run.
- Monitoring for the whole session, through the Aspire CLI, and the MCP server only without a shell.
- An evidence path on every browser finding.
- A shallower depth recorded as such.

## Structure

```meta
```

![The qa agents and the skills they run](c4:qa-structure)

A local run goes `aspire-run` → monitoring → `playwright-validation`.

- **Deployed environment:** `deployed-environment-validation` replaces `aspire-run`.
- **Input is an issue:** `feature-test-from-issue` derives the scenarios first.
- **Scenario passed:** `playwright-e2e-authoring` turns it into a committed test file, following
  the repository's existing Playwright conventions.

## Dependencies

```meta
```

| Depends on | Mechanism |
| --- | --- |
| Aspire CLI | Starts the application, reads its health, logs, and traces, and serves the fallback `aspire` MCP server |
| Playwright CLI | Installed by the person (`npm install -g @playwright/cli@latest`), run through the shell |
| `csharp-coding` | Named, not called: `coding` agent for a runtime bug, `sre` skill for repeated log errors |

| Depended on by | Mechanism |
| --- | --- |
| A delivery flow's validation stage | Invokes `qa` as a delegate with resolved run context and QA depth; owns the user turn |
| `react-coding` | Its `frontend` agent names `qa` for runtime validation |
| `claude-desktop`, `copilot-app` dashboards | Render a `qa` stage's per-scenario results and serve its evidence paths from the caller's worktree |
