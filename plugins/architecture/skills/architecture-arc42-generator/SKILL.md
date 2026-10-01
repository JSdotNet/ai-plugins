---
name: architecture-arc42-generator
description: Interactive arc42 documentation generator for drafting, validating, and iterating sections using reusable prompt and instruction assets.
---

# Architecture arc42 Generator

## Scope

- Section-by-section drafting and refinement
- Context-driven clarification of missing facts
- Cross-section consistency checks
- Structured handoff-ready architecture output

## Workflow

1. Load `resources/arc42-global.md`.
2. For each target section, load `resources/arc42-section-XX.md`.
3. Use section prompts from `skills/architecture-arc42-generator/prompts/`.
4. Draft or update section content with explicit assumptions and decision traceability.
5. Reconcile cross-section consistency for scope, constraints, risks, and quality goals.
6. Produce review-ready Markdown output.

