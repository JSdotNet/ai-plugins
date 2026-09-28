---
name: estimate
description: "Estimate units of work in story points off the 1/2/3/5/8/13/21 scale, sized against this repository's own reference examples. Use when: estimating, story points, sizing work, 'how big is this', giving a plan entry or an issue its effort, filling a chapter's effort:, or a caller needs points it can divide by a measured pace."
goal: "Return a story-point estimate off the 1/2/3/5/8/13/21 scale for each unit of work, sized against this repository's reference examples rather than in isolation, and name the reference each estimate was compared with."
---

# Estimate Work

Size each unit against finished work, never on its own.

Points size work — the amount, the uncertainty, the number of places touched — never time. A
caller divides them by a pace it measures, which only works while a 3 means the same thing in
every plan.

## Reference

One landed unit per value. Rows 2 to 8 are `ai-plugins-devbook-adoption` plan entries that
carried their `effort:` before they ran; rows 1, 13, and 21 were sized after they merged.

| Points | Reference | Why it is this size |
| --- | --- | --- |
| 1 | [#93](https://github.com/JSdotNet/ai-plugins/pull/93): the dashboard shows the model badge before the agent badge | One line moved in one plugin file, no decision, checked by reading the render |
| 2 | [#158](https://github.com/JSdotNet/ai-plugins/pull/158): validate the new chapters and fix what the checks report | Two checks run, four small findings fixed across three chapters, every fix known in kind |
| 3 | [#156](https://github.com/JSdotNet/ai-plugins/pull/156): point `AGENTS.md`, the README, and the rules index at the devbook | Four root documents rewritten against chapters that already existed, one decision on what each says |
| 5 | [#155](https://github.com/JSdotNet/ai-plugins/pull/155): building-block whiteboxes for `copilot-app`, `spec-builder`, and `qa` | Three new chapters, each read out of a plugin folder, plus the index and the chapter 5 links |
| 8 | [#154](https://github.com/JSdotNet/ai-plugins/pull/154): the arc42 core chapters and the decision records | Seven chapters, five decision records, three debt records, and references repointed across two plugins with their bumps |
| 13 | [#131](https://github.com/JSdotNet/ai-plugins/pull/131): deliver `SessionStart` guidance in Claude Code | A host behaviour found by diagnosis, a new twin-hook pattern, and the same change in every plugin that ships the hook |
| 21 | [#95](https://github.com/JSdotNet/ai-plugins/pull/95): load the plugins in Claude Code from a single source | A second host for the whole marketplace — manifests, agent frontmatter, hooks, a sync check, the docs — in one piece |

## Compare

1. Read the unit as it is written — its instructions, its scope, its criteria. Do not size
   what it might grow into.
2. Find the one reference closest in kind and reach. Size up when the unit touches more places
   or carries an unknown the reference did not; down when it touches fewer.
3. Stay on the scale. Never 4, never 40. Past 21, say the unit should be split and name the
   seams rather than returning a number.
4. When two units in one call look alike, give them the same value; when one clearly exceeds
   the other, they differ. The table decides, not the order they were asked in.

## Calibrate

When a finished unit's actual size clearly differs from its estimate — reviewers call a 3 an
8 — replace the row it was compared with by finished work that really is that size. Keep one
row per value, all of it landed work. Drift in the table is drift in every pace computed
from it.

## Return

Per unit: the points, the reference row it was compared with, and a one-line reason naming
what made it larger or smaller. A unit too vague to size is returned unsized with what is
missing, never guessed.
