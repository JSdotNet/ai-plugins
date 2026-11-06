# 01. Introduction and Goals

```meta
related: [".devbook/tech/technology-graph.md", ".devbook/arc42/03-context-and-scope.md"]
```

`jsdotnet-ai-plugins` is a plugin marketplace. Each plugin is one folder under `plugins/` and
installs on its own, in GitHub Copilot and in Claude Code alike. The marketplace holds:

- **Specialists:** agents, skills, and contracts that fill the roles a delivery flow consults.
  The roles are architecture, coding, QA, domain, UX, documentation, product, and security.
- **Host plugins:** three plugins, each built on one host.
- **Trackers:** the plugins for the issue trackers.

The delivery flows themselves are not built here. They ship as `delivery` and
`delivery-schedule` in the `jsdotnet-devbook` marketplace (`JSdotNet/devbook`), beside the
`devbook` folder convention. A specialist here fills a role for that engine, or for a person
working without it, and holds no flow control.

The marketplace serves the maintainer, who authors every asset, and whoever installs a plugin.
In practice both are the same maintainer across their own repositories.

## Quality Goals

```meta
related: [".devbook/arc42/adr/manifests.md", ".devbook/arc42/adr/flow-control.md", ".devbook/arc42/adr/model-pins.md"]
```

In priority order:

| Goal | Means here | See |
| --- | --- | --- |
| One file serves two hosts | One authored copy loads in both hosts; `check-assets.mjs` fails when their files disagree. | [08 — One File, Two Hosts](08-crosscutting-concepts.md#one-file-two-hosts) |
| A specialist holds no flow control | Any flow, or a person, can consult a specialist. | [the flow-control decision](adr/flow-control.md) |
| Installable on its own | A plugin carries everything it reads, contracts by path under `resources/`, and declares its dependencies. | |
| Cheap to load | Bodies stay inside their budgets, and each rule sits in exactly one file. | [TDR 1](tdr/1-body-budgets-reported.md) |

An asset is read on every load. Budgets are reported, not enforced.
