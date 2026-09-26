# Manifests

```meta
date: 2026-09-14
related: [".devbook/arc42/08-crosscutting-concepts.md#version-agreement", ".devbook/arc42/08-crosscutting-concepts.md#one-file-two-hosts"]
```

Every host-specific file is hand-authored: both plugin manifests, the marketplace entry, and
both hook files. `node tools/check-assets.mjs` checks that the two hosts' files agree and
writes nothing; nothing in the repository is generated.

## Why

```meta
```

- A generated file is a file nobody may edit. The Claude side then only changes by
  re-running the generator. A Claude-only key, or a Copilot-only plugin, has to be taught
  to the generator before it can exist.
- A checker can check everything a generator could produce. It fails the pull request that
  lets the two sides drift, so the agreement is kept without anyone owning the output.
- `tools/bump-version.mjs` writes one version into all four places. Keeping them in step
  never needed a generator.
- `JSdotNet/ai-agent-stack` works the same way (its ADR 4). A maintainer moving between the
  two repositories meets one convention.

## Rejected

```meta
```

- **Derive the Claude side from the Copilot side** (`scripts/Sync-ClaudePlugins.ps1`). It
  worked, but every Claude manifest, every `hooks/` file, and the marketplace became
  read-only output. The two host-only plugins needed special cases in the generator.
- **Check nothing and trust review.** Four copies of a version, and two hook files per
  plugin, drift without a gate. The dead `SessionStart` prompt hooks went unnoticed for the
  repository's whole history.

## History

```meta
```

| Date | Change |
| --- | --- |
| 2026-09-14 | `dda850e`: the generator was dropped. Both manifests, the marketplace, and the hooks are hand-authored, and `tools/check-assets.mjs` checks them. A generated file was one nobody could edit. |
| 2026-08-15 | `f908206`: the Copilot manifest and `hooks.json` were authored, and `Sync-ClaudePlugins.ps1` generated the Claude manifest, the Claude hooks, and the marketplace. This was the first time the plugins loaded in Claude Code. |
