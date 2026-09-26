# Flow Control

```meta
date: 2026-09-14
related: [".devbook/arc42/03-context-and-scope.md", ".devbook/arc42/05-building-block-view.md"]
```

A specialist holds no flow control. It does not sequence stages, hold a gate, spawn a
session, or delegate. Sequencing, approval, and delegation belong to whatever consults it:
the delivery engine in `JSdotNet/ai-agent-stack` (`delivery`, `delivery-schedule`, `fleet`),
or a person. `tools/check-assets.mjs` fails on a specialist agent that carries a
session-spawning or delegation tool.

## Why

```meta
```

- A role that also sequences becomes a second orchestrator. A flow that consults it loses
  control of its own stages and gates, and two gates can claim the same approval.
- A specialist with no flow control is usable on its own. A person, a flow from any engine,
  or another host can consult it.
- The engine now lives in `ai-agent-stack` (its ADR 19: a role plugin holds no flow
  control). Keeping flow control here would split the engine across two marketplaces.

## Rejected

```meta
```

- **Session tools on every agent, with a propose-approve-switch handoff gate in each.**
  Every specialist could start sessions and hold approvals. In practice the gates
  duplicated the flow's own gate and fought it.
- **Keep an orchestrator agent and the `orch-*` flows here.** They moved to `ai-agent-stack`
  as `delivery`, `delivery-schedule`, and `fleet`. The host plugins kept only what is
  specific to a host.

## History

```meta
```

| Date | Change |
| --- | --- |
| 2026-09-14 | `93c2a6a`: the flow-free specialists were ported from `ai-agent-stack`. Session-spawning and delegation tools, handoff gates, and plan-with-checkpoints loops were removed, and the checker guards the tool list. |
| 2026-08-04 | `d057289`: orchestration tools were added to every agent's frontmatter, so any specialist could spawn and steer sessions. |
