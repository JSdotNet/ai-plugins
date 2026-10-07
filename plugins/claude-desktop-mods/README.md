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
| `hooks/hooks.json` | the hooks module, under `modules` |
| `hooks/handoff.tsx` | the command, the band, and the pane |
| `hooks/handoff-brief.ts` | the prompt, and finding the brief in a reply |
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

## License

UNLICENSED

## Author

Job Schepers
