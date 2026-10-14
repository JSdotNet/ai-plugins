---
name: ux-design-review
description: 'Review UI screens or components against the project design guidelines and usability heuristics, producing a severity-rated findings report. Use when: reviewing a wireframe, mockup, or live screen for UX quality, auditing a page against the design system, checking accessibility or contrast, or finding usability issues before development or release. DO NOT USE FOR: writing the guidelines (ux-design-guidelines).'
---

# UX Design Review

Evaluate screens, components, or flows against the project design guidelines and usability
heuristics, and report severity-rated findings with actionable recommendations.

## Inputs

Ask only for what the request has not given:

- **Artifact**: a screen file (SVG, image), a Markdown description, or a URL, and its
  **platform**: web, mobile, or desktop.
- **Design guidelines path**, when the project has one.
- **Scope**: a full review, or one concern (accessibility, visual consistency, flow clarity).
- **Output location**: default `docs/design/reviews/`. Write the review there or to the path
  the person gives; a review is a deliverable, and the design devbook folder holds guidelines
  only.

## Steps

1. When the `impeccable` plugin is installed, run its `impeccable:impeccable` skill first and
   fold its UI-craft guidance into the findings; when it is absent, continue without it.
2. Read the artifact, the project guidelines when they exist,
   [ux-global.md](../../resources/ux-global.md), and
   [design-principles.md](../../resources/design/design-principles.md).
3. Evaluate with Nielsen's 10 usability heuristics as the primary lens, WCAG 2.2 AA as the
   accessibility baseline, and the project's tokens, grid, and component states for
   consistency. Check that the user goal reads at first glance, the primary action stands
   out, and error and empty states exist.
4. Rate each finding:

   | Severity | Definition |
   |---|---|
   | **Critical** | Blocks the user from completing their task |
   | **Major** | Significantly degrades usability or accessibility |
   | **Minor** | Reduces polish or convenience without blocking task completion |
   | **Suggestion** | Potential improvement that is not a defect |

5. Write the report in the shape of [ux-review-report.md](../../resources/ux-review-report.md),
   save it, and summarise the finding counts by severity.
