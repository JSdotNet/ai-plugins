---
name: domain-exploration
description: 'Discover domain events, commands, actors, subdomains, and ubiquitous language through guided Event Storming-style exploration. Use when: exploring a business domain, identifying its key concepts, or starting domain modelling from scratch. DO NOT USE FOR: fixing boundaries between known contexts (context-mapping) or designing aggregates (domain-model-design).'
---

# Domain Exploration

Use this skill to start domain discovery for a new or existing project.

## Inputs

- Business requirements, user stories, or domain expert knowledge.
- Existing documentation, API specs, or codebase references (optional).

## Workflow

1. Apply `resources/ddd-global.md`.
2. Confirm input sources with the user (business docs, verbal requirements, existing systems).
3. Run **Big Picture** exploration:
   - Identify all significant domain events (past tense: `OrderPlaced`, `PaymentReceived`).
   - Arrange events chronologically by business process.
   - Mark pivotal events and hot spots (areas of uncertainty or conflict).
4. Run **Process Modelling**:
   - For each process, identify commands (what triggers the event), actors (who or what issues the command), and policies (automated rules: "whenever X happens, do Y").
   - Identify read models needed for decision-making.
   - Note external systems involved.
5. Run **Subdomain Discovery**:
   - Group related events and commands into candidate subdomains.
   - Classify each subdomain as core, supporting, or generic.
   - Identify initial bounded context candidates.
6. Build **Ubiquitous Language Glossary**:
   - For each discovered term, capture: name, definition, context, and related terms.
   - Flag terms that mean different things in different areas of the business.
7. Produce structured output following `resources/domain-documentation-structure.md`.

## Output

- Initial `context-map.md` with the subdomain overview.
- Each discovered term under `## Ubiquitous Language` in its candidate context's `domain.md`, or as the `aliases` of the chapter that models it.
- Candidate bounded contexts with preliminary boundaries.
- List of open questions and areas needing domain expert validation.

## Guiding Principles

- Events first: discover what happened before what triggered it.
- Business language only: no technical jargon during exploration.
- Embrace uncertainty: mark hot spots rather than forcing premature decisions.
- Iterate: revisit and refine as understanding deepens.
