---
name: todo-review
description: "Turn the TODO notes, open checklist items, and unresolved placeholders in any artifact — code, stories, documentation, architecture — into prioritized findings and next actions. Use when: reviewing TODOs, open checklist entries, backlog bullets, or placeholders left in a file or document set. DO NOT USE FOR: improvement ideas beyond what is written down (suggestion-review)."
---

# TODO Review Skill

The calling agent supplies the domain knowledge; this skill reviews the TODO notes, open
checklist items, and placeholders in a target — a file, folder, or document set — within any
timebox or focus the user gives.

Rewrite each entry as a clear review statement and return:

| TODO | Location | Why it exists | Risk if unresolved | Done when | Priority | Decision |
|---|---|---|---|---|---|---|
| <statement> | <file:line> | <reason> | <impact> | <completion criteria> | high / medium / low | resolve / defer — rationale / escalate as finding |

- Every entry gets a decision; none is left open.
- Each recommendation names the smallest practical next step.
- After the table, list assumptions and unknowns as open questions.
