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

## Input Expectations

- The user story to review (Jira key, link, or pasted content).
- The story's `story-review-po` verdict (✅ or ⚠️).
- Optional: domain model documentation or bounded context map.
- Optional: ubiquitous language glossary.

## Workflow

1. Load the story content. If only a Jira key is provided and a Jira retrieval skill is
   available, use it to fetch the story. Otherwise ask the user to paste the story text.
2. **Precondition**: the PO verdict is ✅ or ⚠️. If it is missing, report that the story
   has no PO verdict yet and stop. If it is ❌, stop and output:
   > ❌ **Not ready for domain review** — resolve the following PO issues first: {list blockers}.
3. Evaluate each Domain Architect criterion:

   ### Ubiquitous Language
   - Does the story use terms from the Fincent ubiquitous language glossary?
   - Are any non-standard or ambiguous terms used that could cause translation issues between
     business and engineering?

   ### Bounded Context Ownership
   - Which bounded context owns this story?
   - Is ownership unambiguous, or does the story straddle multiple contexts?
   - Is the integration contract between contexts defined if applicable?

   ### Aggregate and Entity Alignment
   - Which aggregate root is affected?
   - Does the story respect aggregate boundaries and invariants?
   - Are referenced entities within the aggregate's responsibility?

   ### Domain Events
   - Which domain events does this story produce or consume?
   - Are event names in past-tense ubiquitous language form (e.g., `PaymentInitiated`)?
   - Are event consumers identified?

   ### Domain Policies and Rules
   - Does the story introduce or modify a domain policy or business rule?
   - Is the rule modelled at the domain layer (not leaking into application or infrastructure)?

4. Classify each criterion as ✅, ⚠️, or ❌.
5. Produce overall domain readiness classification:
   - ✅ **Domain ready** — story is correctly modelled and can proceed.
   - ⚠️ **Needs clarification** — domain alignment issues require discussion before refinement.
   - ❌ **Domain misalignment** — the story contradicts domain model; must be reworked.
6. Provide concrete corrections for each ⚠️ or ❌ finding.

## Output Expectations

- Per-criterion domain finding with verdict ✅, ⚠️, or ❌.
- Overall domain readiness classification with rationale.
- Corrected ubiquitous language terms and aggregate/event names where applicable.
- Prioritised list of domain corrections if the story is not ready.
- Clear next step: on ✅ or ⚠️ the story is ready for `story-review-dev`; on ❌, the domain
  blockers to resolve.

## Quality Checks

- Every domain term in the story is verified against the ubiquitous language.
- Aggregate boundaries are never assumed — they are confirmed or flagged.
- Domain events are always in past tense and named in business language.
- Do not duplicate PO or architecture concerns — stay focused on domain correctness.
