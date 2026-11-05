# Checking an Asset

```meta
rating: trial
type: stage
```

> This file records how an agent-authored asset is shown to do what it says before it merges: the repository's
> own checker, the host's validator, and the devbook check.

## check-assets Gate

```meta
rating: adopted
type: guardrail
stage: [code, verify]
depends-on: [".devbook/tech/tooling.md#nodejs", ".devbook/tech/tooling.md#github-actions"]
date: 2026-09-14
```

`node tools/check-assets.mjs` fails on what a host would reject or what drifted between the two
hosts' files:

- versions that disagree;
- an agent a host cannot load;
- a tools list that does not match `tools/tool-map.json`;
- a flow-control tool on a specialist;
- a missing `SessionStart` twin;
- a rule wrapper that drifted.

It writes nothing.

- **Used for** — the session runs it before every commit, and `check-assets.yml` runs it on
  every pull request.
- **Adopted by** — every change since the generator was removed on 2026-09-14; `AGENTS.md`
  makes it the step before committing.
- **Evidence** — the check-assets runs on the pull requests of 2026-09-25 and 2026-09-26 all
  succeeded.
- **Limits** — it checks shape, not behaviour: an asset that loads and says the wrong thing
  passes. Body budgets are reported, never enforced.

## claude plugin validate

```meta
rating: candidate
type: practice
stage: [verify]
depends-on: [".devbook/tech/tooling.md#claude-code"]
date: 2026-09-26
```

`claude plugin validate --strict` runs over the marketplace and every plugin manifest, and
catches a manifest Claude Code would refuse to load.

- **Used for** — nothing routine in this repository. `.agents/rules/hooks.md` asks for it after a
  function-hook module changes, and the `claude-desktop-mods` and `spec-builder` READMEs list
  the command. The sibling `JSdotNet/devbook` repository runs it beside its own checks.
- **Adopted by** — nobody here; no workflow runs it.
- **Evidence** — none yet.
- **Moves up when** — it has run over this marketplace and its result has been compared with
  `check-assets.mjs`.
- **Limits** — Claude Code only; Copilot has no equivalent, which is why `check-assets.mjs`
  exists.

## Devbook Check

```meta
rating: trial
type: guardrail
stage: [code, verify]
depends-on: [".devbook/tech/tooling.md#devbook-plugin", ".devbook/tech/tooling.md#github-actions"]
date: 2026-09-26
```

`node .devbook/_tools/devbook-meta/build.mjs --check` validates every `meta` block and reference
in `.devbook/arc42/`, `.devbook/tech/`, and `.devbook/ai/`, and `devbook-meta.yml` runs it on a
devbook change.

- **Used for** — the chapters in this folder, `tech/`, and `arc42/`, written by agent sessions.
- **Adopted by** — the session that installed devbook here on 2026-09-26; since 2026-09-27
  `AGENTS.md` requires it beside `check-assets.mjs` before every commit.
- **Evidence** — it passed on the install.
- **Moves up when** — it has held a later chapter change to the schema.
- **Limits** — it checks the schema and the references, not whether a chapter is true.
