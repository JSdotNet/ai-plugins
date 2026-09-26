# 01. Introduction and Goals

```meta
status: draft
related: [".devbook/tech/technology-graph.md"]
```

`jsdotnet-ai-plugins` is a plugin marketplace: the specialist agents, skills, and contracts
that fill the roles a delivery flow consults — architecture, coding, QA, domain, UX,
documentation, product, security — plus two host plugins and the issue trackers. One folder
per plugin under `plugins/`, each installable on its own.

The delivery flows themselves are not built here. They ship as `delivery`,
`delivery-schedule`, `fleet`, and `devbook` in the `jsdotnet` marketplace
(`JSdotNet/ai-agent-stack`); a specialist here fills a role for that engine and holds no flow
control.

## Quality Goals

```meta
status: draft
```

| Goal | Means here |
| --- | --- |
| One file, two hosts | Every asset is hand-authored once and loads in both GitHub Copilot and Claude Code; `node tools/check-assets.mjs` fails when the two hosts' files disagree. |
| Installable on its own | A plugin carries everything it reads — contracts under `resources/`, referenced by path — and declares its dependencies. |
| Cheap to load | An asset is read on every load, so bodies stay inside their budgets and each rule is stated in exactly one file. |
| No flow control in a specialist | A specialist never sequences stages, holds gates, spawns sessions, or delegates. |
