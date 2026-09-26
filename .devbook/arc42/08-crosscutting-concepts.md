# 08. Crosscutting Concepts

```meta
related: [".devbook/tech/hosts.md", ".devbook/arc42/adr/manifests.md"]
```

The concepts every plugin shares. Each one is checked by `node tools/check-assets.mjs`,
which reports, exits non-zero on any error, and writes nothing; `check-assets.yml` runs it on
every pull request.

## One File, Two Hosts

```meta
related: [".devbook/arc42/adr/manifests.md", ".devbook/arc42/adr/model-pins.md", ".devbook/tech/hosts.md#claude-code-plugin-api", ".devbook/tech/hosts.md#copilot-cli-plugin-api"]
```

There is one copy of every agent, skill, and contract, and no parallel Claude tree. It works
because both hosts ignore frontmatter keys they do not know, and both drop tool names they
cannot resolve, so one agent file carries both vocabularies. What genuinely differs — the
manifest and the hook shape — is one hand-authored file per host, checked against its twin.

| Path | Read by |
| --- | --- |
| `skills/<name>/SKILL.md`, `agents/<role>.agent.md` | both |
| `resources/`, `prompts/` | both, by explicit path reference |
| `.github/plugin/plugin.json`, root `hooks.json` | Copilot |
| `.claude-plugin/plugin.json`, `hooks/hooks.json` and its sidecar | Claude |
| `.claude-plugin/marketplace.json` | Claude |
| `AGENTS.md`, `.agents/rules/` and the two wrapper folders | both, see [Rule Layering](#rule-layering) |

An agent's frontmatter resolves per host like this:

| Field | Copilot | Claude Code | Here |
| --- | --- | --- | --- |
| `name` | optional | **required** | present |
| `description` | optional | **required** | present |
| `tools` | ignores unavailable ids | ignores unresolved names while one resolves | one union list — [Tool Map](#tool-map) |
| `agents` | delegation whitelist | ignored | kept, with `Agent(...)` in `tools` |
| `handoffs` | delegation buttons | ignored | kept; every target is also named in the body |
| `model` | Copilot ids | Claude aliases only | omitted — [the model-pins decision](adr/model-pins.md) |

The Claude manifest omits `skills` and `hooks`, because Claude scans `skills/` and loads
`hooks/hooks.json` by default and naming the standard hook file too fails the load with
`Duplicate hooks file detected`. It lists `agents` explicitly rather than naming a folder, and
carries `mcpServers` and `dependencies` unchanged — Claude resolves a `dependencies` entry
when the plugin is enabled, which is how a retired plugin pulls in its replacement; Copilot
ignores the key.

Differences that remain:

- **`handoffs` are invisible to Claude**, which delegates from the prose, so the checker
  fails when a declared target is never named in the body.
- **Internal agents are visible in Claude.** They are listed anyway, because they are live
  handoff targets.
- **`AskUserQuestion` is foreground-only**: an agent run in the background cannot prompt.
- **No host applies a glob from inside a plugin**, which is why a plugin ships contracts and
  no `instructions/` — [the plugin-contracts decision](adr/plugin-contracts.md).

### Host-only Plugins

```meta
```

`copilot-app` is built on the Copilot canvas extension API and `claude-desktop` on MCP Apps;
neither surface can be translated to the other, so each ships its own host's manifest only and
the checker knows both by name. "Claude-only" is intent, not enforcement: Copilot would load
`claude-desktop` from its Claude manifest if pointed at it, which is why its root `hooks.json`
is a guard saying so. The blocks are in [chapter 5](05-building-block-view.md#host-plugins).

## Tool Map

```meta
related: [".devbook/arc42/tdr/2-tool-ids-in-prose-unchecked.md"]
```

An agent's `tools` is one list: the Copilot tool ids the author chose, then the Claude names
`tools/tool-map.json` derives from them, then `Skill`, which Claude needs listed and Copilot
grants implicitly. Each host filters the list to what it knows.

```yaml
tools:
  - 'read/readFile'          # Copilot
  - 'terminal/runInTerminal'
  - 'Read'                   # Claude, derived
  - 'Bash'
  - 'Skill'
```

The map is hand-maintained and the checker is strict both ways: it fails on a Copilot id the
map does not know, on a Claude name the map does not derive, and on one it derives that is
missing. An empty mapping means the capability has no Claude equivalent (`vscode/memory`,
canvas tools), with the reason in the map.

An MCP tool id maps to its whole **server**, in both spellings — `mcp__plugin_<plugin>_<server>`
for a server a plugin provides, `mcp__<server>` for one registered in a repository's
`.mcp.json` — because `tools` is matched against exact runtime names and naming one form
silently costs every tool of that server. Granting the server also survives the server
renaming its tools, as Aspire's `get_*` did to `list_*`. The cost is granularity: an agent
meant to use a server read-only (`qa-monitor`) says so in its prose. The checker fails when an
agent names a server its plugin's Claude manifest does not declare.

Session-spawning and delegation ids map to `Agent` and `SendMessage`, and the checker fails a
specialist that carries one — [the flow-control decision](adr/flow-control.md).

## Rule Layering

```meta
related: [".devbook/arc42/adr/repository-rules.md", ".devbook/arc42/adr/plugin-contracts.md"]
```

Text reaches a session through exactly one of four layers, by who it serves and when it must
load:

| Layer | Holds | Loaded |
| --- | --- | --- |
| `AGENTS.md` | Standing rules for working in this repository | Every session; `CLAUDE.md` imports it, `.github/copilot-instructions.md` points at it |
| `.agents/rules/<topic>.md` | A rule for one kind of file, with `name`, `description`, `paths` | When a host reads a matching file, through `.claude/rules/<topic>.md` (`paths`) and `.github/instructions/<topic>.instructions.md` (`applyTo` = `paths.join(",")`) |
| `plugins/<name>/resources/<contract>.md` | Text a plugin's skill or agent needs, `name` and `description` only | When an asset references it by path |
| A plugin's `sessionStart` hook | The few rules that apply to every task the plugin serves | Every session the plugin is enabled in — [SessionStart Twin Hook](#sessionstart-twin-hook) |

The first two serve people working **in** this repository and never reach someone who
installed a plugin; the last two ship with the plugin. The checker fails on a wrapper whose
glob drifted, a rule with no wrapper, a wrapper with no rule, and a contract that carries
`applyTo` or `paths`. `devbook-*` rules are devbook's, installed verbatim; their globs live in
the Claude wrapper. The convention is `.agents/rules/README.md`.

## Version Agreement

```meta
related: [".devbook/arc42/adr/manifests.md"]
```

A plugin's version is written in four places, and all four must agree: both manifests, the
marketplace entry, and the plugin's row in `copilot-plugins.md`. A plugin change bumps it:

```bash
node tools/bump-version.mjs <plugin> [patch|minor|major]
```

writes all four, and the checker fails on any disagreement — and on a name or description
that differs between the two manifests. The nightly version-bump workflow runs the same script
for each changed plugin and then the checker.

## SessionStart Twin Hook

```meta
related: [".devbook/tech/hosts.md#claude-code-plugin-api"]
```

Most hook events carry over between the hosts with only the nesting and the event casing
changed, because both accept `type: "prompt"`. `sessionStart` does not: a prompt hook issues a
sub-prompt, and at session start Claude has no conversation to issue it into. Claude records
that as a non-blocking error, nothing surfaces, and the guidance is simply absent — which is
how every plugin here shipped a dead session-start hook until it was found.

So a Copilot `sessionStart` prompt has a hand-authored Claude twin:

| File | Contents |
| --- | --- |
| `hooks/session-start-context.md` | the prompt text, verbatim; several prompts join with a blank line |
| `hooks/emit-session-context.mjs` | reads the sidecar and prints it as `hookSpecificOutput.additionalContext` |
| `hooks/hooks.json` | a `command` hook running the emitter |

The checker fails on a Claude `SessionStart` hook of type `prompt` and on a sidecar that no
longer says what the Copilot prompts say. Dropping the last prompt drops the sidecar and the
emitter with it. Copilot could take the command hook too, but the prompt hook needs no Node,
so it keeps it; and Copilot fires prompt hooks only in new interactive sessions, so a `-p` run
does not test one. `sessionEnd` prompt hooks run in Claude's interactive REPL only.

Which file each host reads is load-bearing:

| File | Claude Code | Copilot CLI |
| --- | --- | --- |
| `plugins/<name>/hooks.json` | ignored | loaded |
| `plugins/<name>/hooks/hooks.json` | loaded | loaded **only when the root file is absent** |

Every plugin with a `hooks/` folder therefore keeps a root `hooks.json`, or Copilot would run
the Claude hooks — it parses their shape fine. The same split targets one host on purpose:
`claude-desktop`'s root file reaches Copilot only.
