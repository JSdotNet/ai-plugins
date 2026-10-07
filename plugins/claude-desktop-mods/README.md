# claude-desktop-mods

Claude Code function-hook mods: live panes and status line entries written as a hooks module
the engine loads in-process, rather than as command hooks or an MCP server. Its sibling
[`claude-desktop`](../claude-desktop/README.md) keeps the dashboard MCP server and the session
skills; this plugin holds only function hooks, so it can be installed without them.

Claude Code only. Function hooks have no Copilot counterpart; the root `hooks.json` reaches
Copilot alone and says the plugin is Claude-only.

## Includes

### context-view

`/context-view` opens a pane showing, for the current session:

1. **Context window** — used / limit, the peak, and the largest categories, from the engine's
   usage API; when it has no breakdown, tool-result tokens by tool.
2. **Instructions loaded** — `CLAUDE.md` and every file its `@` imports pull in,
   `.claude/rules/*.md` rules that fired because a read path matched their `paths`, skill
   bodies (Skill calls), agent bodies (Agent calls with `subagent_type`), the output style,
   and hook context such as `SessionStart`'s — each with an approximate token cost.
3. **Markdown read** — every `.md` file read through Read, or `cat`/`sed`/`head`/`Get-Content`
   through a shell, grouped by folder, with token cost and read count.
4. **Devbook lens**, only when a read file sits under `.devbook/` or carries a fenced `meta`
   block — grouped by folder (`arc42`, `domain`, `tech`, `design`, `ai`) and chapter address,
   with a warning when most of a folder loads in one turn and when a `_meta/` file is read.

**Zoom.** A **Zoom into…** picker at the top of the pane lists every line. Picking one
replaces the overview with that line's detail; **← Overview** (hotkey `b`) returns:

| Line | Detail |
| --- | --- |
| A window category | What the engine itemizes in it: memory files, MCP tools by server, the skill listing, custom agents, or tool results by tool |
| A memory file | Its `@` imports, what imports it, and its outline |
| A rule | Its globs, every path that matched it and when, and its outline |
| A skill or agent | Each invocation, the tokens an agent returned, and the body's outline |
| A hook or the output style | Each row it added, or the system prompt sections it occupies |
| A Markdown file | Every read with its turn, tool, tokens, and line range, the rules it fired, its devbook chapters, and its outline |
| A devbook folder | Its warnings, the files read in each turn, and every chapter address |

The picker needs a surface with a select element, so the mobile app shows the overview only.

The status line shows `ctx <n>% · <k> md`. Token costs are estimates at four characters a
token, except where the engine's breakdown counts a memory file itself. The lens recognises
devbook by shape and does not need devbook installed. Reads inside a subagent are listed and
marked, but stay out of the by-tool totals, since they never reach this session's window.

| File | Role |
| --- | --- |
| `hooks/hooks.json` | Names the hooks module under `modules` |
| `hooks/context-view/register.tsx` | The hooks and the pane |
| `hooks/context-view/view.ts` | The overview, the zoom picker's options, and each detail page, as Markdown |
| `hooks/context-view/model.ts` | The pure logic: shell-read parsing, rule globs, `@` imports, the devbook lens |
| `hooks/context-view/*.test.ts` | Tests for `claude plugin test plugins/claude-desktop-mods` |
| `types/index.d.ts` | The `$.state` contract the module keeps its data in |

## Install

```bash
/plugin marketplace add JSdotNet/ai-plugins
```

```bash
/plugin install claude-desktop-mods@jsdotnet-ai-plugins
```

To try a working copy without installing, start Claude Code with the folder:

```bash
claude --plugin-dir plugins/claude-desktop-mods
```

## Verify Installation

- `/context-view` opens the Context pane
- The status line shows `ctx <n>% · <k> md` after the first tool call

## Known Issue

Claude Code reserves plugin names that start with `claude-`, so
`claude plugin validate plugins/claude-desktop-mods` reports the name as an error. The hooks
module and its `$.state` contract validate clean under any other name.

## Uninstall

```bash
/plugin uninstall claude-desktop-mods@jsdotnet-ai-plugins
```

## License

MIT

## Author

Job Schepers
