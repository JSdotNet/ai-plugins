---
name: tdr-global
description: What a technical debt record holds, how it is numbered and dated, its status, and the tdr/ index.
---

# Technical Debt Records

Prose follows `prose.md`. Where the repository has `.devbook/arc42/`, its folder rule governs
metadata and wins over this contract on any conflict.

## What earns a record

A debt record holds one known shortcut or compromise in the system's structure that costs
something until it is paid: slower change, a quality attribute below its goal, an operational
risk. A risk that is not a shortcut the team took belongs in `11-risks-and-technical-debt.md`,
not here. A choice that was right is a decision record (`adr-global.md`), not debt.

## One record per item, numbered and dated

- The file is `tdr/<n>-<slug>.md` — `tdr/7-no-retry-budget.md`. The number orders the folder;
  do not zero-pad it. Take the next number after the highest in the folder, and never reuse
  one.
- The metadata block carries `date`: the day the debt was logged. It never changes when the
  record is edited.
- Status uses the arc42 folder's vocabulary. Open debt is `active`, written by omitting the
  field. Paid-off debt is `status: deprecated`, and the record says when and how it was paid.
  Never delete a record.

## Shape, in this order

- The title, then the metadata block, then the debt in one or two sentences: what the shortcut
  is and where it lives.
- `## Why it exists` — the decision or pressure that created it, linked to its decision record
  where one exists.
- `## Impact` — what it costs today, per quality attribute, delivery, or operations it
  touches. Concrete and measurable where possible.
- `## Remediation` — each candidate fix with its trade-off, and the one chosen, if any.
- `## Paid` — only once deprecated: the date and the change that paid it.

Link the building blocks and chapters it affects through `related`; do not restate them.

## The index

`tdr/README.md` carries `index: root` in its metadata and lists every record by number with
the debt in one line, linked, open items first. Update it in the same change as the record.
`11-risks-and-technical-debt.md` links to the index for debt and restates nothing.
