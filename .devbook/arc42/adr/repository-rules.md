# Repository Rules

```meta
date: 2026-09-14
related: [".devbook/arc42/08-crosscutting-concepts.md#rule-layering"]
```

A rule for one kind of file is authored once in `.agents/rules/<topic>.md`. It declares
`name`, `description`, and `paths`, and each host gets a wrapper that holds only the glob:
`.claude/rules/<topic>.md` for Claude and `.github/instructions/<topic>.instructions.md` for
Copilot. `AGENTS.md` is the root. `CLAUDE.md` imports it, and
`.github/copilot-instructions.md` points at it.

## Why

```meta
```

- Each host loads path-scoped rules only from its own folder, with its own glob key
  (`paths` or `applyTo`). A single file cannot serve both.
- A wrapper that holds only the glob cannot disagree with the rule. It has no rule text to
  drift, and its glob is `paths.join(",")`, which the checker compares.
- A third host adds a third wrapper, never a second copy of the rule.
- `JSdotNet/ai-agent-stack` holds its plugins to the same shape, and devbook installs its
  own rules into it (`devbook-*.md`).

## Rejected

```meta
```

- **One rule body per host.** This mirrored the Copilot instructions into `.claude/rules`,
  which gave every rule two copies that drifted independently.
- **A plugin-level `instructions/` folder.** Neither host applies a glob from inside a
  plugin. See [plugin-contracts.md](plugin-contracts.md).
- **A 200-line `.github/copilot/copilot-instructions.md`.** Only Copilot read it, and it
  mixed standing rules with path-scoped ones.

## History

```meta
```

| Date | Change |
| --- | --- |
| 2026-09-14 | `86b343d`: one rule in `.agents/rules/` with one glob-only wrapper per host, and `AGENTS.md` as the root. Drift became something the checker detects. |
| 2026-09-07 | `4fca57c`, `5cf565a`: the Copilot instructions were mirrored into `.claude/rules`, then given one shared host-neutral body, so Claude read the rules too. |
| 2026-04-15 | Rules were Copilot instructions under `.github/instructions/`, with `applyTo`. Only one host was targeted. |
