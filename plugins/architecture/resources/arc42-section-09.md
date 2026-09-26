---
name: arc42-section-09
description: What arc42 section 9 holds when decisions live in their own records — a pointer to the adr/ index, never the decisions themselves.
---

# arc42 Section 9: Architecture Decisions

Section 9 answers "why is the system built this way?" by pointing at the decision records.
The records are one per concern under `adr/` and own their content; `adr-global.md` defines
them.

## Content

- One or two sentences on what counts as a recorded decision in this system: a choice whose
  reversal costs a migration.
- A link to the `adr/` index. The index lists every concern with its standing choice.
- Nothing else. No decision log table, no restated choice, reason, status, or date — each of
  those lives in exactly one record, and a copy here goes stale.

When the section would need more than that, the missing content belongs in a record or in the
index: create or change it with the `create-architectural-decision-record` skill.

## Relationship to other sections

- Section 4 summarizes the few choices that shape the solution and links to their records.
- Sections 5 to 8 link to the record behind a choice they show.
- A choice that later proves costly becomes a debt record, linked from section 11.

## Output

````markdown
# 9. Architecture Decisions

```meta
```

Each decision whose reversal would cost a migration has one record per concern, stating the
standing choice, why it holds, what was rejected, and its history.

See [the decision records](adr/README.md).
````

## Validation

- [ ] The section links to the `adr/` index.
- [ ] No decision's choice, reason, status, or date appears in the section.
