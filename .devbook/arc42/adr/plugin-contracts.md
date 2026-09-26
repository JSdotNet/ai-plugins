# Plugin Contracts

```meta
date: 2026-09-14
related: [".devbook/arc42/08-crosscutting-concepts.md#rule-layering"]
```

A plugin ships no `instructions/` folder. It puts text that a skill or agent needs in a
contract at `resources/<name>.md`, with `name` and `description` and no glob. Every asset that
depends on a contract references it by relative path. Text that has to reach every session
goes in the plugin's `sessionStart` hook.

## Why

```meta
```

- Neither host applies a glob from inside a plugin. Neither manifest has an `instructions`
  or a rules key, and Claude does not load a plugin-root `CLAUDE.md`. An `applyTo` in a
  plugin is a key that no host reads.
- An explicit path reference loads the same file in both hosts. The dependency then shows
  in the asset that has it.
- With no glob, the contract has nothing that belongs to one host.

## Rejected

```meta
```

- **`instructions/*.instructions.md` with `applyTo`.** This was the shape for 65 files. It
  was one host's spelling on files that neither host read from that location.
- **Promote every contract into a `sessionStart` hook.** That would load every contract in
  every session. It is used for the few rules that apply to every task, not for reference
  text one skill needs.

## History

```meta
```

| Date | Change |
| --- | --- |
| 2026-09-14 | `abe54da`: every `instructions/` file became a `resources/` contract, referenced by path. The checker fails on a plugin that grows an `instructions/` folder. |
| 2026-04-15 | Plugins shipped `instructions/` files with `applyTo` globs, assuming Copilot applied them from the plugin. |
