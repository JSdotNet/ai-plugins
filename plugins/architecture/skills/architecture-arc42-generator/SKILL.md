---
name: architecture-arc42-generator
description: 'Draft, update, or check arc42 sections 1-12, one chapter per section, consistent across scope, constraints, risks, and quality goals. Use when: writing or refreshing an arc42 section, or checking sections against each other. DO NOT USE FOR: a decision record (create-architectural-decision-record), a debt record (create-technical-debt-record), or a diagram on its own (the *-diagram-generator skills).'
---

# Architecture arc42 Generator

## Inputs

- The sections to draft, update, or check, and the detail level (LEAN, ESSENTIAL, THOROUGH).
- The facts each section's contract lists under Inputs; read the codebase and the existing
  chapters before asking for one.

## Workflow

1. Find the target folder: `.devbook/arc42/` when it exists, one `NN-name.md` chapter per
   section, and read that folder's rule; otherwise ask for a path.
2. Read [arc42-global.md](../../resources/arc42-global.md) and, per target section,
   `../../resources/arc42-section-NN.md`. Each section contract is the one source for that
   section's rules, inputs, and output template.
3. Draft or update each chapter from its template, marking every unconfirmed fact as an
   assumption and linking the decision record behind every choice.
4. Reconcile the touched chapters against the cross-section consistency list in
   arc42-global.md.
5. Report the changed chapters, the open assumptions, and any inconsistency left unresolved.
