# Body Budgets Reported, Not Enforced

```meta
date: 2026-09-14
related: [".devbook/arc42/01-introduction-and-goals.md#quality-goals"]
```

`AGENTS.md` sets a body budget for each kind of asset: 40 lines for a `SKILL.md`, 60 for a
rule or contract, 80 for an agent. `tools/check-assets.mjs` counts the lines against these
budgets, but an asset over its budget passes the check.

## Why it exists

```meta
```

The budgets arrived with the checker, when most assets were already longer than them.
Failing on the budgets from day one would have blocked every pull request until the whole
marketplace was rewritten. So the checker reports the counts, and `--budgets` lists the
assets over budget.

## Impact

```meta
```

- On 2026-09-26, 92 of 173 budgeted assets are over their budget. The largest is
  `product-owner.agent.md`, at 104 of 80 lines.
- Every load pays for the extra lines, in context and in rules that do not fire. That works
  against the *Cheap to load* quality goal.
- A report that nothing gates does not shrink. A new asset can be written over budget
  without anyone noticing.

## Remediation

```meta
```

- **Ratchet.** Record today's count per asset and fail when any count grows. New assets
  must fit their budget. The debt shrinks with each edit, and no rewrite is needed up front.
- **Fail outright, with a reason line.** An asset over budget states why in its own body,
  as `AGENTS.md` already allows. The checker accepts that line. This needs one sweep of 92
  files first.
- **Keep reporting.** This costs nothing, and the debt does not move.

None is chosen yet.
