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

Generate a demo presentation for a Fincent sprint review based on the Fincent Review
PPTX template. The output is a structured Markdown document that mirrors every slide
in the template; it can be presented directly or used to fill in the PPTX.

This skill owns the presentation logic: turning sprint-review information into slide
content, ordering that content into the Fincent review structure, and preparing material
that can be written into the PPTX template.

## Template File

The PowerPoint template is located at:
`../../resources/fincent-review-template.pptx`

This skill does not build the `.pptx`; `automation-sprint-review` builds it from this
skill's Markdown, using the template as the base. The layouts each slide maps to are:

- `Logo foto` — cover slide (slide 1).
- `Title and Content 2` — title, demo divider, next, release, and info slides.
- `Onze cultuur` — content slides (tasks, bugs, and per-epic slides).

## Fincent Review PPTX slide structure

The deck follows this order. The per-epic slides repeat once per epic, so the slide count
varies with the sprint:

| # | Slide | Content |
|---|-------|---------|
| 1 | Blank / Opener | Visual only; no text content needed |
| 2 | Title | "Fincent Review \| Sprint [name] \| Team Fincent \| [dates]" |
| 3 | Implementatie wensen & taken | Completed implementation stories/tasks per epic |
| 4 | Bugs | Completed bugs this sprint |
| 5–N | Per-epic demo slides | One slide per epic containing demo items |
| N+1 | Demo divider | "Demo \| Team Fincent \| [date] \| [year] \| Release [release]" |
| N+2 | Next | Highlight of the next sprint |
| N+3 | Release | "Release [release] op [month] \| Acceptatie \| release stories" |
| N+4 | Sprint planning | Roadmap/planning: epics + themes for next sprint |
| N+5 | Informatie vanuit implementaties | Notes from implementations / infra |

Generate one Markdown section per slide, clearly labelled.

## Preferred input source

Use existing report artifacts only.

When this skill is invoked by `automation-sprint-review`, the caller should pass:

- one or more generated sprint reports
- the generated release report
- the resolved sprint names
- the resolved release name
- the team

Use those report artifacts as the **only source** for slide content.

If the required report artifacts are missing, stop and ask the caller or user to provide
them. Do not access Jira from this skill.

The reports carry no assignee, acceptance criteria, priority, next-sprint scope, or
implementation notes. Fill those from what the user supplies in the conversation; otherwise
mark them `[TODO]`.

## Data sources

### Primary source: sprint and release reports

When sprint and release report artifacts are provided, extract slide content from them:

- completed stories and bugs from the sprint report(s)
- epic grouping from the sprint report(s)
- release acceptance and in-scope release items from the release report
- cross-sprint themes, labels, and carry-over context when useful for presenter notes

## Presentation generation

### Slide 1 — Opener

> *(Blank slide — no content)*

---

### Slide 2 — Title

```
Fincent Review
Sprint [name]
Team Fincent     [start date] – [end date]
```

---

### Slide 3 — Implementatie wensen & taken

List all completed **feature** and **support** stories this sprint, grouped by epic:

**[Epic name]**
- FIN-xxx — [Summary] *(N pts)*
- FIN-yyy — [Summary] *(N pts)*

**[Epic name]**
- …

---

### Slide 4 — Bugs

List all completed **bug** stories this sprint:

| Key | Summary | Epic | Points |
|-----|---------|------|--------|
| FIN-xxx | … | … | N |

If no bugs were completed, write: *"Geen bugs afgerond deze sprint."*

---

### Slides 5–N — Per-Epic Demo Slides

Generate **one slide per epic** that has completed stories. Each slide header:

```
Sprint [name]    Team Fincent    [dates]
[Epic name]
```

Content: a bullet list of stories completed in this epic, suitable for a live demo walkthrough.
For each story include:
- Jira key
- Summary (short)
- Assignee (if relevant for demo handover; `[TODO]` unless the user supplied it)
- Any demo notes the user supplied for the story
- Any delivery context already captured in the sprint report narrative

---

### Slide N+1 — Demo Divider

```
Demo
Team Fincent
[sprint end date — day + month]
[year]
Release [release name]
```

---

### Slide N+2 — Next Sprint

Title: **Next**

Brief preview of the next sprint:
- Sprint name
- Key focus areas (top 3 epics or themes)
- Any notable upcoming features

Source: the next sprint's scope as the user supplies it; otherwise `[TODO]` per line.

---

### Slide N+3 — Release

```
Release [release] op [month]
Acceptatie    [acceptance test status]
release stories
```

List the stories in the release that are in scope for acceptance testing:

| Key | Summary | Status | Epic |
|-----|---------|--------|------|
| FIN-xxx | … | In Testing | … |

---

### Slide N+4 — Sprint Planning / Roadmap

```
Team Fincent     Sprint [next name]     [theme/color]
- Voorlopige planning
```

List planned epic themes and estimated story counts for the next sprint, as the user
supplies them; otherwise `[TODO]`:

| Epic / Theme | Stories planned | Points |
|-------------|----------------|--------|
| Zaaksysteem | N | N |
| Mijn Geldzaken | N | N |
| Huisstijl | N | N |
| Koppeling Xxllnc | N | N |
| Technical debt | N | N |

---

### Slide N+5 — Informatie vanuit implementaties

Free-text section for information received from running implementations / production:
- Any known issues reported post-release
- Performance observations
- Infrastructure updates

If no information is available, write: *"Geen bijzonderheden vanuit implementaties."*

---

## Output format

- Produce the full Markdown document with all slide sections in order.
- Each slide section uses a level-2 heading with its resolved number (`## Slide 7 — Demo`):
  number the slides consecutively once the per-epic slides are counted.
- After the slides, append a **Presenter Notes** section with talking points per slide.
- When called from `automation-sprint-review`, return the slide Markdown directly; that skill
  saves it and builds the `.pptx`.
- When run standalone, ask the user if they want to save the output as a `.md` file.

## Working rules

- Use Dutch language for story summaries and slide content (the template is Dutch).
- Abbreviate long summaries to ≤80 characters to fit a slide bullet.
- If a piece of data (e.g. release date, next sprint) is unknown, mark it `[TODO]`.
- Do not access or post anything to Jira.

## Tools used

- Provided sprint and release report artifacts — primary source for slide content.
