---
name: ux-global
description: Core UX design principles, usability heuristics, and accessibility rules for all design work.
---

# UX Global Instructions

This contract holds the UX principles, heuristics, and accessibility baseline every design
artifact of this plugin applies.

## Core Principles

1. **User-centred design.** Every design decision must serve the user's goals, context, and mental model. Start with user needs, not features.
2. **Clarity over cleverness.** Prefer obvious, conventional UI patterns over novel interactions unless novelty directly benefits usability.
3. **Consistent language and layout.** Use the same terminology, labels, icons, and layout patterns throughout a product. Inconsistency is a usability defect.
4. **Accessibility by default.** Design for WCAG 2.2 AA compliance as a baseline.
5. **Progressive disclosure.** Show only what is needed at each step. Reveal complexity on demand, not up front.
6. **Feedback and status.** Always give users clear, timely feedback about system status and the result of their actions.

## Usability Heuristics

Apply Nielsen's 10 usability heuristics in design reviews and during artifact creation.

## Accessibility Requirements

- All interactive elements must be keyboard-navigable.
- Text contrast ratio must meet WCAG 2.2 AA (4.5:1 for normal text, 3:1 for large text).
- Do not rely on colour alone to convey meaning.
- All images and icons must have descriptive alt text or accessible labels.
- Use semantic structure (headings, landmarks, lists) in any HTML or rendered output.
- Annotate wireframes with ARIA labels and keyboard focus order where meaningful.

## Platform Scope

Specify the target platform in every design artifact:

- **Web** — responsive layouts, desktop-first or mobile-first depending on user context
- **Mobile** — iOS and/or Android; touch targets ≥ 44 × 44 px
- **Desktop app** — native platform conventions and keyboard accessibility

## Quality Standards

- Every artifact names its target user, platform, and — for a wireframe — fidelity level;
  the fidelity levels are defined in [wireframe.md](wireframe.md).
- Each artifact type's own standard lives in its contract: [wireframe.md](wireframe.md),
  [design-guidelines.md](design-guidelines.md), and [user-flow.md](user-flow.md).
