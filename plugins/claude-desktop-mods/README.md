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

**Layout.** The pane follows the "Context View Redesign" canvas: a meter with a stacked bar
of the window's categories, ticks for the peak and the auto-compaction point, and a legend;
an amber banner for devbook warnings; foldable **INSTRUCTIONS**, **MARKDOWN READ**, and
**DEVBOOK** sections whose rows carry a share bar; and a footer with the keys and the status
text. Every row is a button: Tab and the arrows move between rows, Enter on a row zooms, and
Enter on a section heading folds it. It draws only boxes, text, and buttons, so it works on
every surface.

**Zoom.** Zooming replaces the overview with that line's page; **← CONTEXT** (hotkey `b`)
returns. A Markdown file and a devbook folder get designed pages — four summary tiles, the
reads with a bar of the lines each covered, the rules fired, chapters, and outline; or the
folder's warnings, a file-by-turn coverage grid, and its chapter addresses. The other lines
show their detail as text:

| Line | Detail |
| --- | --- |
| A window category | What the engine itemizes in it: memory files, MCP tools by server, the skill listing, custom agents, or tool results by tool |
| A memory file | Its `@` imports, what imports it, and its outline |
| A rule | Its globs, every path that matched it and when, and its outline |
| A skill or agent | Each invocation, the tokens an agent returned, and the body's outline |
| A hook or the output style | Each row it added, or the system prompt sections it occupies |
| A Markdown file | Every read with its turn, tool, tokens, and line range, the rules it fired, its devbook chapters, and its outline |
| A devbook folder | Its warnings, the files read in each turn, and every chapter address |

The status line shows `ctx <n>% · <k> md`. Token costs are estimates at four characters a
token, except where the engine's breakdown counts a memory file itself. The lens recognises
devbook by shape and does not need devbook installed. Reads inside a subagent are listed and
marked, but stay out of the by-tool totals, since they never reach this session's window.

| File | Role |
| --- | --- |
| `hooks/hooks.json` | Names the hooks module under `modules` |
| `hooks/context-view/register.tsx` | The hooks, the recorded state, and the pane's actions |
| `hooks/context-view/pane.tsx` | The overview and the two designed zoom pages, as element trees |
| `hooks/context-view/view.ts` | The text detail pages and the merged instruction list |
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
