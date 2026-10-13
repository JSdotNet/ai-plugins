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

Third in [story-pipeline.md](../../resources/story-pipeline.md): check its input
precondition (the PO and domain verdicts) first, and label every finding with its verdict
legend.

1. Load the story per [jira-discovery.md](../../resources/jira-discovery.md), the
   architecture documentation and ADRs (`.devbook/arc42/`, `.devbook/arc42/adr/`), any
   enabler stories or spikes the user names, and the code the story touches. Without
   architecture documentation, review on best-effort reasoning and name the missing context
   in each finding it affects.
2. Fill the Pre-Refinement (Architect) section of
   [story-review-checklist.md](../../resources/templates/story-review-checklist.md):
   - Bounded context fit, and an explicit integration contract for cross-context work.
   - Hidden assumptions about infrastructure, APIs, or external services, and the NFRs the
     story implies.
   - Architectural decisions not yet made, and risks that need a spike first.
   - Enabler check: infrastructure, platform, or foundational work a feature team cannot
     do inside the story.
   - PSD2, GDPR, and AML implications — checked on every story, also one that looks
     unrelated.
3. When an enabler is needed, say so explicitly and draft it: title, enabler type (Enabler
   Story or Enabler Feature), and acceptance scope.
4. Leave the business acceptance criteria as written; this review judges feasibility.

## Output

The checklist rows, the enabler draft when one is needed, then the overall verdict —
✅ **Architecturally ready**, ⚠️ **Conditionally ready** (with the conditions or the parallel
enabler work), or ❌ **Not ready** — with rationale, prioritised architectural actions, and
the next step: on ✅ or ⚠️, `story-point-estimation`.
