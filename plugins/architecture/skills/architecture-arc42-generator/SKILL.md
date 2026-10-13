---
name: architecture-arc42-generator
description: 'Draft, update, or check arc42 sections 1-12, one chapter per section, consistent across scope, constraints, risks, and quality goals. Use when: writing or refreshing an arc42 section, or checking sections against each other. DO NOT USE FOR: a decision record (create-architectural-decision-record), a debt record (create-technical-debt-record), or a diagram on its own (the *-diagram-generator skills).'
---

# Architecture arc42 Generator

## Scope

- Section-by-section drafting and refinement
- Context-driven clarification of missing facts
- Cross-section consistency checks
- Structured handoff-ready architecture output

## Workflow

1. Find the target folder: `.devbook/arc42/` when it exists, one `NN-name.md` chapter per
   section, and read that folder's rule; otherwise ask for a path.
2. Load `resources/arc42-global.md`.
3. For each target section, load `resources/arc42-section-XX.md`.
4. Use section prompts from `skills/architecture-arc42-generator/prompts/`.
5. Draft or update each section's chapter in the target folder with explicit assumptions and decision traceability.
6. Reconcile cross-section consistency for scope, constraints, risks, and quality goals.
7. Report the changed chapters and the open assumptions.

