---
name: story-review-dev
description: >
  Review a Fincent user story for technical readiness before sprint refinement: architectural
  fit, hidden technical risks, enabler stories needed, security and compliance. Takes the
  story's PO and domain review verdicts as input. Use when: "dev review FIN-123", "is this
  story technically ready", "does this need an enabler". DO NOT USE FOR: a pull request
  (pr-review-architecture), domain modelling (story-review-domain), or a batch (automation-story-review-dev).
---

# Story Review — Dev (Architect)

## Input Expectations

- The user story to review (Jira key, link, or pasted content).
- The story's `story-review-po` verdict and `story-review-domain` verdict (each ✅ or ⚠️).
- Optional: architecture documentation or ADR links.
- Optional: existing enabler stories or spikes.

## Workflow

1. Load the story content. If only a Jira key is provided and a Jira retrieval skill is
   available, use it to fetch the story. Otherwise ask the user to paste the story text.
2. **Precondition**: both verdicts are ✅ or ⚠️. If either is missing, report which review the
   story has not had yet and stop. If either is ❌, stop and output:
   > ❌ **Not ready for dev review** — resolve the following issues first: {list blockers}.
3. Evaluate each Pre-Refinement criterion:

   ### Bounded Context Fit
   - Does the story belong to a single bounded context?
   - Are cross-context integrations explicitly defined with integration contracts?

   ### Technical Assumptions
   - Are there hidden assumptions about infrastructure, APIs, or external services?
   - Are non-functional requirements (performance, security, scalability) identified?

   ### Architecture Risk
   - Does the story require architectural decisions that are not yet made?
   - Are there risks that need a spike before delivery?

   ### Enabler Check
   - Does the story require infrastructure, platform, or foundational architecture work
     before it can be delivered by a feature team?
   - If yes: flag the need for an **Enabler Story** or **Enabler Feature** and describe
     the scope of the enabler.

   ### Security and Compliance
   - Are there security or regulatory implications (e.g., PSD2, GDPR, AML) that must
     be addressed before delivery?

4. Classify each criterion as ✅, ⚠️, or ❌.
5. Produce overall readiness classification:
   - ✅ **Architecturally ready** — no blockers; the story is ready for estimation.
   - ⚠️ **Conditionally ready** — ready for estimation with noted conditions or parallel enabler work.
   - ❌ **Not ready** — architectural gaps block delivery; resolve before estimation.
6. If an enabler is needed, draft a brief enabler story description with title, type, and scope.

## Output Expectations

- Overall architectural readiness classification with rationale.
- Enabler story draft (if applicable) with: title, enabler type, and acceptance scope.
- Prioritised list of architectural actions if the story is not ready.
- Clear next step: on ✅ or ⚠️ the story is ready for `story-point-estimation`; on ❌, the
  blockers to resolve.

## Quality Checks

- The review focuses on architecture and feasibility — do not rewrite business acceptance criteria.
- Enabler identification is always explicit; never assume the team will discover the need later.
- Security and compliance implications are never skipped for Fincent stories.

## References

- `../../resources/dor.md` — Fincent Definition of Ready
