---
name: story-review-domain
description: >
  Review a Fincent user story from the Domain Architect perspective: ubiquitous language,
  bounded context ownership, aggregate alignment, domain events, and domain rules. Takes the
  story's PO review verdict as input. Use when: "domain review FIN-123", "does this story fit
  the domain model", "check the terms in this story". DO NOT USE FOR: a pull request's code
  (pr-review-domain), technical readiness (story-review-dev), or a batch (automation-story-review-domain).
---

# Story Review — Domain Architect

Second in [story-pipeline.md](../../resources/story-pipeline.md): check its input
precondition (the PO verdict) first, and label every finding with its verdict legend.

1. Load the story per [jira-discovery.md](../../resources/jira-discovery.md), and the
   ubiquitous language glossary and bounded context map — from what the user supplies, or
   the repository's `.devbook/domain/`. Judge from the story and those documents only;
   reading the codebase belongs to `story-review-dev`.
2. Fill the Domain Architect section of
   [story-review-checklist.md](../../resources/templates/story-review-checklist.md):
   - Check every business term against the glossary; name each non-standard or ambiguous
     term and its glossary replacement.
   - Name the one owning bounded context, or the contexts the story straddles and whether
     their integration contract is defined.
   - Confirm the affected aggregate from the model, or flag it as unknown; never assume it.
   - List the domain events produced or consumed, named in past tense business language
     (`PaymentInitiated`), with their consumers.
   - Name any new or changed business rule and confirm it belongs in the domain layer.
3. Give every ⚠️ and ❌ its correction.

## Output

- The checklist rows with labels and findings.
- **Corrected terms and names**: a `Story says | Use instead | Why` table covering terms,
  aggregate names, and event names; `None` when every term matches.
- The overall verdict — ✅ **Domain ready**, ⚠️ **Needs clarification**, or ❌ **Domain
  misalignment** — with rationale, prioritised corrections, and the next step: on ✅ or ⚠️,
  `story-review-dev`.
