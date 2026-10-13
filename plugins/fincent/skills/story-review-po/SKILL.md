---
name: story-review-po
description: >
  Review a Fincent user story from the Product Owner perspective against the Fincent Definition
  of Ready: format, title, scope, design images, and bug detail. The first review a story gets.
  Use when: "PO review FIN-123", "is this story well written", "check this story against the DOR",
  before refinement. DO NOT USE FOR: domain modelling (story-review-domain), technical
  readiness (story-review-dev), or a batch by Jira status (automation-story-review-po).
---

# Story Review — Product Owner

The first review in [story-pipeline.md](../../resources/story-pipeline.md); it has no
precondition. Label every finding with that file's verdict legend.

1. Load the story per [jira-discovery.md](../../resources/jira-discovery.md).
2. Determine its type — feature, bug, or support request — and whether it has a UI component.
3. Assess it against [dor.md](../../resources/dor.md), filling the Product Owner section of
   [story-review-checklist.md](../../resources/templates/story-review-checklist.md), plus its
   Bug section for a bug. Leave out what does not apply: Design for a story without UI, Bug
   for anything but a bug.
4. Apply the Fincent rulings:
   - A title with a `?` or question phrasing, or naming a person, is ❌.
   - A UI story without design images in the story itself fails Design, also when a Figma
     link is attached; the link is optional on top of the images.
   - "Refined by the team" and "team estimate present" are ⏭ *checked at sprint entry*:
     refinement and estimation follow this review.
   - A story clearly over the 12-hour limit is flagged for splitting.
5. Give every ⚠️ and ❌ a concrete improvement: the rewritten title, the missing link, the
   image to attach.

## Output

The filled checklist tables, then the overall verdict — ✅ **Ready**, ⚠️ **Needs
refinement**, or ❌ **Not ready** — with its rationale, the prioritised improvements, and the
next step: on ✅ or ⚠️, `story-review-domain`. Judge the DOR only; domain and technical
concerns belong to the later reviews.
