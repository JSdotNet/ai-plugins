# claude-desktop-mods

Claude Code mods: function hooks that run inside a Claude Code session, in the desktop app's
Code tab and in the terminal. They complement [`claude-desktop`](../claude-desktop/README.md)
and repeat none of its procedures, which is why they ship apart from it: a session can take
the skills without the hooks, and the hooks hot-reload on their own.

Claude-only. Copilot has no function hooks; the root `hooks.json` is empty so Copilot never
falls back to `hooks/hooks.json`.

## Includes

### Handoff

Around `claude-desktop`'s `session-handoff` skill, which stays the only place the handoff
procedure is written. Read-only towards repositories.

- `/handoff [same-worktree|new-worktree|<repo>]` submits a prompt that runs the skill with
  that target, `same-worktree` when none is given.
- A band above the prompt at 75% (amber) and 85% (red) context, "Context <n>% — hand off?",
  whose button runs `/handoff`. It hides below 75%, after a compaction, and after `/clear`.
- `/handoffs` opens a pane over the skill's handoff store (`CLAUDE_HANDOFF_DIR`, else
  `<CLAUDE_CONFIG_DIR or ~/.claude>/handoffs`), newest first: repo, branch, reason, age, and
  whether a session picked the brief up. **Open** shows the brief; **Pick up** copies its
  `## First Message`, or shows it for copying when the clipboard does not take it. A session
  whose first message names the brief's path or its `Title this session` line marks it picked
  up, in the plugin's own store.

| File | Holds |
| --- | --- |
| `hooks/hooks.json` | the hooks module, under `modules` |
| `hooks/handoff.tsx` | the commands, the band, and the pane |
| `hooks/handoff-briefs.ts` | parsing a brief and matching a first message to it |
| `types/index.d.ts` | the `$.state` values, named as `types` in the manifest |
| `tests/handoff.test.tsx` | the tests |

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

## Install

```bash
/plugin install claude-desktop-mods@jsdotnet-ai-plugins
```

It depends on `claude-desktop`, which brings the `session-handoff` skill.

## License

UNLICENSED

## Author

Job Schepers
