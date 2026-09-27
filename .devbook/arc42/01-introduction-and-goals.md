# 01. Introduction and Goals

```meta
related: [".devbook/tech/technology-graph.md", ".devbook/arc42/03-context-and-scope.md"]
```

`jsdotnet-ai-plugins` is a plugin marketplace: the specialist agents, skills, and contracts
that fill the roles a delivery flow consults — architecture, coding, QA, domain, UX,
documentation, product, security — plus two host plugins and the issue trackers. One folder
per plugin under `plugins/`, each installable on its own, in GitHub Copilot and in Claude
Code alike.

The delivery flows themselves are not built here. They ship as `delivery`,
`delivery-schedule`, and `fleet` in the `jsdotnet` marketplace (`JSdotNet/ai-agent-stack`),
beside the `devbook` folder convention; a specialist here fills a role for that engine, or for
a person working without it, and holds no flow control.

The people it serves are the maintainer, who authors every asset, and whoever installs a
plugin — in practice the same maintainer across their own repositories.

## Quality Goals

```meta
related: [".devbook/arc42/adr/manifests.md", ".devbook/arc42/adr/flow-control.md", ".devbook/arc42/adr/model-pins.md"]
```

In priority order:

| Goal | Means here |
| --- | --- |
| One file serves two hosts | Every asset is authored once and loads in both GitHub Copilot and Claude Code; no host gets a copy of its own, and `node tools/check-assets.mjs` fails when the two hosts' files disagree. See [08 — One File, Two Hosts](08-crosscutting-concepts.md#one-file-two-hosts). |
| A specialist holds no flow control | A specialist never sequences stages, holds a gate, spawns a session, or delegates, so any flow — or a person — can consult it. See [the flow-control decision](adr/flow-control.md). |
| Installable on its own | A plugin carries everything it reads — contracts under `resources/`, referenced by path — and declares its dependencies. |
| Cheap to load | An asset is read on every load, so bodies stay inside their budgets and each rule is stated in exactly one file. Budgets are reported, not enforced: [TDR 1](tdr/1-body-budgets-reported.md). |
