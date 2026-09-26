# Decision Records

```meta
index: root
related: [".devbook/arc42/09-architecture-decisions.md"]
```

One record per concern, each describing the choice that stands today and the history that
led to it.

| Concern | Standing choice |
| --- | --- |
| [Manifests](manifests.md) | Hand-authored for both hosts and checked by `tools/check-assets.mjs`; nothing is generated. |
| [Repository Rules](repository-rules.md) | One rule in `.agents/rules/`, one glob-only wrapper per host, and `AGENTS.md` as the root. |
| [Plugin Contracts](plugin-contracts.md) | `resources/` contracts referenced by path; no plugin ships an `instructions/` folder. |
| [Flow Control](flow-control.md) | A specialist holds none; sequencing, gates, and delegation belong to whatever consults it. |
| [Model Pins](model-pins.md) | No agent pins a `model`; a preference goes in a `## Model` body section. |
