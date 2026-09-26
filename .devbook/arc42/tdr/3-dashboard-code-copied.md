# Dashboard Code Copied Between Host Plugins

```meta
date: 2026-09-26
related: [".devbook/arc42/05-building-block-view.md#host-plugins"]
```

The run dashboard is implemented twice, once in each host plugin:
`plugins/claude-desktop/mcp/orch-dashboard/` and
`plugins/copilot-app/extensions/orch-dashboard/`. Four modules started as copies of each
other: `render.mjs`, `report.mjs`, `store.mjs`, and `insight.mjs`. No check keeps them equal.

## Why it exists

```meta
```

The Claude port was built by copying the Copilot canvas, because a canvas cannot be
translated to MCP Apps. Each plugin installs on its own, and neither host can load a module
from another plugin. That made copying the quickest way to ship.

## Impact

```meta
```

- The copies have already drifted. On 2026-09-26 only `report.mjs` is byte-identical.
  `render.mjs` differs in 21 lines, `store.mjs` in 8, and `insight.mjs` in 147. The old
  compatibility guide called the first two byte-identical.
- A fix to the dashboard's rendering or reporting has to be made twice. Nothing tells the
  author when one copy is missed.

## Remediation

```meta
```

- **Check the copies:** fail `check-assets` when the named shared modules differ, and allow
  differences only in a marked host section.
- **One source, copied at build:** keep the modules in one place and copy them into each
  plugin before packing. This brings back a generator for these files, against
  [the manifests decision](../adr/manifests.md).
- **Accept divergence:** state that the two dashboards are independent, and stop calling
  them shared.

None is chosen yet.
