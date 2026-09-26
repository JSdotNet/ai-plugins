---
name: create-technical-debt-record
description: "Log a technical debt item as a numbered, dated record with its origin, impact, and remediation options, or mark one paid. Use when: a known shortcut in the system's structure needs capturing or tracking, or debt has been paid off. DO NOT USE FOR: a risk that is not a shortcut the team took (section 11), or a choice that was right (a decision record)."
---

# Create Technical Debt Record

Apply `resources/tdr-global.md` and `resources/prose.md`.

## Inputs

- The shortcut and where it lives.
- Why it was taken, what it costs, and the candidate fixes.

## Workflow

1. Find the records folder: `.devbook/arc42/tdr/` when it exists, and read that folder's rule;
   otherwise ask for a path.
2. Read the `tdr/` index. If a record already covers the item, update it instead of opening a
   second one.
3. New item: take the next number, create `tdr/<n>-<slug>.md` in the contract's shape, and
   set `date` to today.
4. Paid item: set `status: deprecated` and add `## Paid`.
5. Update the index line, creating the index with `index: root` if it is missing. Leave
   `11-risks-and-technical-debt.md` linking to the index.

## Output

The changed record and index, and one line naming the record number and what changed.
