---
name: domain-exploration
description: 'Discover domain events, commands, actors, subdomains, and ubiquitous language through guided Event Storming-style exploration. Use when: exploring a business domain, identifying its key concepts, or starting domain modelling from scratch. DO NOT USE FOR: fixing boundaries between known contexts (context-mapping) or designing aggregates (domain-model-design).'
---

# Domain Exploration

## Inputs

- Business requirements, user stories, or domain expert knowledge.
- Existing documentation, API specs, or code, when there is any.

## Workflow

1. Read [ddd-global.md](../../resources/ddd-global.md), and confirm the input sources with
   the user.
2. Discover the domain events first, then the commands, actors, policies, read models, and
   external systems behind them, in business language only.
3. Mark every area of uncertainty or conflict as a hot spot instead of deciding it, and list
   it with the open questions; a hot spot on a business rule becomes an invariant with
   `Enforced at: open` once the rule is modelled.
4. Group events and commands into candidate subdomains, classify each as core, supporting, or
   generic, and name the candidate bounded contexts.
5. Capture each term with its definition and context, and flag every term that means
   different things in different parts of the business.
6. Write per [domain-documentation-structure.md](../../resources/domain-documentation-structure.md).

## Output

- An initial `context-map.md` with the subdomain overview and the candidate bounded contexts
  with preliminary boundaries.
- Each term under `## Ubiquitous Language` in its candidate context's `domain.md`, or as the
  `aliases` of the chapter that models it.
- The open questions and hot spots that need a domain expert.
