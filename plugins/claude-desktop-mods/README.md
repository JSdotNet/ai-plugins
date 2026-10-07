# claude-desktop-mods

Claude Code mods: function hooks that run inside a Claude Code session, in the desktop app's
Code tab and in the terminal. They ship apart from [`claude-desktop`](../claude-desktop/README.md)
so each installs, and the hooks hot-reload, on their own.

Claude-only. Copilot has no function hooks; the root `hooks.json` is empty so Copilot never
falls back to `hooks/hooks.json`.

## Includes

### Cross-repository handoff

For the moment the work in this repository needs a change in another one. The session keeps
going; the other repository gets a brief it can act on without this conversation.

- `/handoff-to [repo and what to change]` asks for the brief as Markdown in the reply, fenced
  `~~~markdown`: the target, why, the change, the context the target cannot read quoted
  rather than linked, done-when, and open questions with their defaults, led by a
  `Title this session` line. With no argument the target and change are inferred from the
  session. Nothing is written to disk.
- Any reply holding such a brief — from the command, or from asking for one in your own
  words — raises a band above the prompt: "Handoff for <target>: <change>" with **Copy**,
  **Show**, and **Dismiss**. **Copy** puts the whole brief on the clipboard, to paste wherever
  you choose; **Show** opens it rendered in a pane, which falls back to plain text for
  copying when the clipboard does not take it.

| File | Holds |
| --- | --- |
| `hooks/hooks.json` | the one hooks module, `register.ts`, under `modules` |
| `hooks/register.ts` | registers both mods; only `on` crosses into each mod's file |
| `hooks/handoff.tsx` | the command, the band, and the pane |
| `hooks/handoff-brief.ts` | the prompt, and finding the brief in a reply |
| `types/index.d.ts` | the `$.state` values, named as `types` in the manifest |
| `tests/handoff.test.tsx` | the tests |

### Context view

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
| `hooks/context-view/register.tsx` | The hooks, the recorded state, and the pane's actions |
| `hooks/context-view/pane.tsx` | The overview and the two designed zoom pages, as element trees |
| `hooks/context-view/view.ts` | The text detail pages and the merged instruction list |
| `hooks/context-view/model.ts` | The pure logic: shell-read parsing, rule globs, `@` imports, the devbook lens |
| `tests/context-view*.test.ts` | The tests |

## Develop

```bash
claude plugin validate plugins/claude-desktop-mods
```

```bash
claude plugin test plugins/claude-desktop-mods
```

```bash
claude --plugin-dir plugins/claude-desktop-mods
```

## Known issue

Claude Code reserves plugin names that start with `claude-`, so `claude plugin validate`
reports this plugin's name as an error. Its modules and `$.state` contract validate clean under
any other name.

## Install

```bash
/plugin install claude-desktop-mods@jsdotnet-ai-plugins
```

## License

UNLICENSED

## Author

Job Schepers
