# Model Pins

```meta
date: 2026-08-15
related: [".devbook/arc42/08-crosscutting-concepts.md#one-file-two-hosts"]
```

No agent pins a `model`. An agent that has a model preference records it in a `## Model`
section of its body, and each host applies its own default. `tools/check-assets.mjs` rejects
any `model` value that Claude would not load.

## Why

```meta
```

- Both hosts read the same `model` key, and neither accepts the other's model ids.
- Claude refuses to load an agent whose model it does not recognise, and it does not fall
  back. A pin that is valid for Copilot takes the agent down in Claude.
- Model choice depends on the person, their plan, and their host, not on the asset. The
  delivery engine resolves it from a personal override.

## Rejected

```meta
```

- **Pin Copilot model ids.** This broke every pinned agent in Claude.
- **Pin a model family or tier rather than a version id.** This was tried for the
  orchestrators. No family name is valid for both hosts.

## History

```meta
```

| Date | Change |
| --- | --- |
| 2026-08-15 | `f908206`: pins were removed from every agent when the plugins began loading in Claude Code, and the intent moved to a `## Model` body section. |
| 2026-08-06 | `c65757e`: pins were removed from the non-orchestrator agents. The orchestrators kept a family or tier instead of a version id. |
| 2026-04-15 | Agents pinned Copilot model ids in their frontmatter. |
