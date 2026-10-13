---
name: proposals
description: Rules for writing Proposals — structured suggestions for changes, features, or decisions with clear trade-offs and success criteria.
---

# Proposal Writing Instructions

This contract governs Proposals: a structured recommendation for a change, feature, or
decision, for the team members and decision makers who must approve it. The shared procedure
is [document-authoring.md](document-authoring.md).

## Naming

Name the file `proposal-<slug>.md`, `<slug>` the kebab-cased outcome title.

## Section Rules

Use [proposal-template.md](proposal-template.md), with every section in its order, on 1-2
pages.

- **Title** — concise and outcome-oriented.
- **Executive Summary** — at most 3 sentences: problem, recommendation, expected benefit.
- **Problem Statement** — the current pain, gap, or opportunity and its impact if
  unresolved, grounded in evidence. State it before any solution.
- **Proposed Solution** — the recommendation, explicit and actionable, led by outcomes;
  detail belongs in Implementation Approach.
- **Scope** — explicit `In scope` and `Out of scope` lists.
- **Trade-offs and Alternatives** — the table, with at least one alternative, why this
  proposal wins, and the honest downsides of the recommendation.
- **Implementation Approach** — key steps or phases at a high level; solution design only
  where the decision needs it.
- **Success Criteria** — measurable outcomes, leading indicators where relevant,
  `[TODO: metric]` where data is not yet available.
- **Risks and Dependencies** — top delivery and adoption risks, cross-team and external
  dependencies.
- **Next Steps** — exactly one path: approve and begin, refine with stakeholder input,
  request further analysis, or reject and document the reasoning.

Keep paragraphs to 2-3 sentences, use bullets for comparisons, and cut background that does
not influence the decision.
