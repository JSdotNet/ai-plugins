---
name: create-proposal
description: 'Create a structured proposal for a change, feature, or decision, with problem statement, recommendation, trade-offs, and success criteria. Use when: proposing a change or feature for stakeholders to approve, or framing the options for a decision. DO NOT USE FOR: an architectural decision (architecture:create-architectural-decision-record) or an early idea (create-idea).'
---

# Create Proposal

Write a proposal that frames a decision so stakeholders can say yes, no, or refine with
confidence: problem, recommendation, trade-offs, scope, and measurable success.

When the decision is architectural — structure, technology, or a cross-cutting concern the
architecture records hold — name `architecture:create-architectural-decision-record` instead
and stop; when the `architecture` plugin is absent, say an ADR is the right artifact.

Before drafting, read [document-authoring.md](../../resources/document-authoring.md) and run
its procedure with:

- **Inputs:** the topic (the change, feature, or decision), the problem driving it, the
  recommendation, the audience (the decision makers), and the alternatives considered.
- **Type contract:** [proposals.md](../../resources/proposals.md).
- **Default path:** `documents/proposals/`, the file named per proposals.md.

Deliver one Markdown Proposal ready for stakeholder review.
