---
name: demo-presentation
description: >
  Turn Fincent sprint and release reports into the slide-by-slide Markdown of the Fincent
  Review deck: title, stories and bugs per epic, per-epic demo slides, release, next sprint,
  and roadmap. Returns Markdown, never a .pptx. Use when: "demo slides for the sprint
  review", "prepare the Fincent Review", sprint and release reports exist. DO NOT USE FOR:
  producing the reports (sprint-report, release-report) or the full run with the .pptx
  build (automation-sprint-review).
---

# Demo Presentation

Turn the sprint and release reports into the slide-by-slide Markdown of the Fincent Review
deck. `automation-sprint-review` builds the `.pptx` from it on
`../../resources/fincent-review-template.pptx`; this skill returns Markdown only.

## Input

The generated sprint report or reports, the release report, the sprint names, the release
name, and the team. They are the only source: when a report is missing, stop and ask for it.
Read nothing from Jira and write nothing to it. The reports carry no assignee, acceptance
criteria, priority, next-sprint scope, or implementation notes; take those from what the user
supplies, and mark them `[TODO]` otherwise — as any other unknown value, such as a release
date.

## Slides, in this order

Write each slide's content per [demo-slides.md](../../resources/templates/demo-slides.md).

1. Opener — no text.
2. Title.
3. Implementatie wensen & taken — completed features and support stories, by epic.
4. Bugs — completed bugs.
5. One demo slide per epic with completed stories, so the slide count varies.
6. Demo divider, then Next, Release, Sprint planning, and Informatie vanuit implementaties.

Layouts in the template: `Logo foto` for the cover (slide 1); `Title and Content 2` for the
title, demo divider, next, release, and info slides; `Onze cultuur` for the tasks, bugs, and
per-epic slides.

## Rules

- Write slide content and story summaries in Dutch: the template is Dutch.
- Shorten each summary to at most 80 characters to fit a slide bullet.
- On an empty slide write its Dutch line: Bugs *"Geen bugs afgerond deze sprint."*,
  Informatie vanuit implementaties *"Geen bijzonderheden vanuit implementaties."*
- Head each slide with a level-2 heading and its resolved number (`## Slide 7 — Demo`),
  numbering consecutively once the epic slides are counted.
- After the slides, add **Presenter Notes** with talking points per slide.
- Called from `automation-sprint-review`, return the Markdown; run alone, ask whether to
  save it as a `.md` file.
