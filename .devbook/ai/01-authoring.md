# Authoring an Asset

```meta
rating: adopted
type: stage
```

> This file records how an agent, skill, contract, hook, or manifest gets written here. It uses the host that
> loads it, spec-builder's contracts, and the repository's rules, applied on the read.

## Authoring in the Loading Host

```meta
rating: adopted
type: practice
stage: [code]
depends-on: [".devbook/tech/tooling.md#claude-code", ".devbook/tech/tooling.md#github-copilot"]
date: 2026-08-15
```

An agent session running in a host that loads the asset writes it. One file serves both Claude
Code and GitHub Copilot, so there is no generator step.

- **Used for** — every plugin asset under `plugins/`: the agent drafts, the person reviews, and
  the asset is loaded from the same file by both hosts.
- **Adopted by** — the one maintainer, in every change since the dual-host single source landed
  on 2026-08-15; the generator was removed on 2026-09-14.
- **Evidence** — "Make Copilot plugins load in Claude Code from a single source" (2026-08-15) and
  "no generated sync layer — hand-author both manifests, check instead" (2026-09-14).
- **Limits** — a Copilot-only surface, such as the `copilot-app` canvases, is exercised in
  Copilot alone.

## spec-builder Create Skills

```meta
rating: trial
type: skill
stage: [code]
depends-on: [".devbook/tech/tooling.md#claude-code", ".devbook/tech/tooling.md#github-copilot"]
date: 2026-09-14
```

Each create skill reads its `plugins/spec-builder/resources/create-*.md` contract before writing.

- **Skills** — `create-agent`, `create-skill`, `create-instruction`, `create-plugin`, and
  `create-workflow`.
- **Used for** — drafting a new asset of a given type to the shape both hosts accept, within
  the body budgets in `spec-conciseness.md`.
- **Adopted by** — the contracts are read by path on every authoring change, as `AGENTS.md`
  requires. The skills themselves are invoked from Copilot sessions, and no Claude Code transcript
  records one.
- **Evidence** — the contracts moved to `resources/` on 2026-09-14.
- **Moves up when** — a recorded run of a create skill produces a merged asset.
- **Limits** — editing an existing asset goes straight to the file and its contract, not
  through a create skill.

## Path-scoped Rule Trio

```meta
rating: adopted
type: guardrail
stage: [code]
depends-on: [".devbook/tech/tooling.md#claude-code", ".devbook/tech/tooling.md#github-copilot"]
date: 2026-09-07
```

A rule is authored once in `.agents/rules/` and wrapped per host. The host applies it, unasked,
when a session reads a matching file.

- **Used for** — the eight topics in `.agents/rules/README.md`, from `agents` to `markdown`,
  and devbook's own rules for `.devbook/`.
- **Adopted by** — every session in this repository, in both hosts; the wrappers are committed,
  so every worktree carries them.
- **Evidence** — "move the shared rule bodies to .agents/rules/" (2026-09-07), and
  `check-assets.mjs` failing on a wrapper that drifted.
- **Limits** — a rule fires on a read, so a file authored from scratch may not trigger it; the
  README says to open a sibling first.
