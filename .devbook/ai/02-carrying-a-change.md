# Carrying a Change

```meta
rating: adopted
type: stage
```

> This file records how a change gets from an idea to `main`: cut into a Backlog plan, run one item per worktree
> session, opened as a pull request under the organization account, and versioned.

## Backlog Plan Items

```meta
rating: adopted
type: workflow
stage: [specify, code]
depends-on: [".devbook/tech/tooling.md#backlog-tools-plugin"]
date: 2026-09-24
```

A change too big for one session is written as a Backlog import plan. Each item is pasted into
its own session. There, `run-plan-item` checks whether it has already landed before doing
anything.

- **Used for** — multi-step changes such as `ai-plugins-devbook-adoption`: each item names the
  items it comes after, and the session is titled with the plan name.
- **Adopted by** — the maintainer, for every multi-step change to this repository and the
  sibling repositories since the devbook migration plans of 2026-09-24.
- **Evidence** — the `ai-plugins-devbook-adoption` sessions for the specialist layout, the
  dashboard labels, the architecture records, the technology graph, and this chapter. A re-pasted
  item after a crash checked whether it had landed and redid nothing.
- **Limits** — a one-session change is asked for directly, with no plan.

## Estimate Procedure

```meta
rating: candidate
type: skill
stage: [specify]
related: [".devbook/ai/02-carrying-a-change.md#backlog-plan-items"]
date: 2026-09-28
```

The `estimate` skill sizes a plan entry or an issue in story points by comparing it with one
reference row per value in `.agents/skills/estimate.md`. Every row is a merged pull request
from this repository.

- **Used for** — giving a plan entry its `effort:` and naming the reference it was compared
  with.
- **Adopted by** — nobody yet. The skill was adopted in `0910a42` on 2026-09-26, but its table
  held the seed's web-application examples until 2026-09-28. The `ai-plugins-devbook-adoption`
  efforts were set without it.
- **Evidence** — none yet. A row is replaced when finished work shows its size was wrong.
- **Moves up when** — a plan is sized against the table.
- **Limits** — rows 1, 13, and 21 were sized after their pull requests merged, not before.

## Flow Skills

```meta
rating: trial
type: skill
stage: [specify, code, verify]
depends-on: [".devbook/tech/tooling.md#devbook-plugin"]
date: 2026-10-06
```

A change routes to the delivery flow named for what it changes: `flow-code` for anything outside
`.devbook/`, and `flow-spec` for a devbook folder. The flow runs it phase by phase to a pull
request behind a Personal Validation gate.

- **Used for** — the phase maps in `.devbook/config.json`, one per flow. Every phase not listed
  here runs on the session's model.
  - `devbook:validate` runs before `phase-update-base` in both flows.
  - `architecture:architect` takes scope, plan, and the `arc42/` and `tech/` drafting.
  - `documentation:documentation` takes the `ai/` drafting.
  - `devbook:verify-change` is `flow-code`'s spec check.
- **Adopted by** — nobody yet. The phase maps landed with the 1.19 update on 2026-10-06, and
  every change before it was carried by hand under `AGENTS.md`.
- **Evidence** — the pull request that wrote this chapter was the first change here carried by
  `flow-spec` end to end, reporting into the Backlog surface.
- **Moves up when** — `flow-code` has carried a change to a plugin the same way.
- **Limits** — the Personal Validation gate needs a person, so a scheduled routine never runs a
  flow.

## Worktree Sessions

```meta
rating: adopted
type: practice
stage: [code]
depends-on: [".devbook/tech/tooling.md#claude-code"]
date: 2026-08-15
```

Every agent session works in its own git worktree under `.claude/worktrees/` on a `claude/`
branch, so several run in parallel against one clone.

- **Used for** — isolating each session's commits until its pull request is opened.
- **Adopted by** — every Claude Code session here; eleven worktrees were open on 2026-09-26.
- **Evidence** — 50 of the repository's 146 pull requests came from `claude/` branches, the
  first on 2026-08-15.
- **Limits** — the git stash is shared across worktrees, so a session sets work aside with a
  commit, never a bare stash.

## pr-jsdotnet Skill

```meta
rating: adopted
type: skill
stage: [integrate]
depends-on: [".devbook/tech/tooling.md#github-cli"]
date: 2026-08-06
```

The project skill in `.github/skills/pr-jsdotnet/` opens every pull request through `gh` with
the JSdotNet account's credentials, for that command only. A merge to `main` is the release:
the marketplace installs from it.

- **Used for** — opening the pull request once the person asks; a session never pushes or
  opens one unasked.
- **Adopted by** — every pull request since 2026-08-06, as `AGENTS.md` requires in place of the
  host's built-in pull request tool.
- **Evidence** — "Add project-scoped pr-jsdotnet skill and auto-invoke instruction" (2026-08-06).
- **Limits** — the skill runs shell commands, so a specialist agent without a shell hands back
  to the default agent first.

## Nightly Version Bump

```meta
rating: hold
type: hook
stage: [integrate]
depends-on: [".devbook/tech/tooling.md#github-actions"]
date: 2026-09-26
```

`nightly-plugin-version-bump.yml` runs at 01:00 UTC to bump the version of every plugin that
changed without one — the backstop for an agent-authored change that left the bump out.

- **Used for** — nothing in practice. The workflow bumps each plugin whose `plugins/<name>/` tree
  changed after its last manifest version commit, on the branch
  `chore/nightly-plugin-version-bump`. The bump never lands, because GitHub refuses the pull
  request: this repository does not let Actions create one.
- **Adopted by** — nobody; the version is bumped in the session with `bump-version.mjs`, which
  `AGENTS.md` requires.
- **Evidence** — 18 runs from 2026-09-27 through 2026-10-14 failed on the pull request step. The
  runs since then succeeded with "No plugin changed since its last version bump", because
  sessions bumped those plugins themselves. No nightly bump pull request has ever been opened.
- **Limits** — no model runs in it; it is recorded here because it exists to backstop agent
  sessions. It returns to `adopted` once this repository lets Actions create a pull
  request.

## Scheduled Routines

```meta
rating: trial
type: workflow
stage: [operate]
depends-on: [".devbook/tech/tooling.md#claude-code", ".devbook/tech/hosts.md#claude-desktop"]
date: 2026-09-26
```

These are unattended agent routines from `delivery-schedule`, run on a cron as local scheduled tasks in
the Claude desktop app. Each run makes its own detached worktree off `origin/main` in the
`D:\Repos\Copilot` clone.

- **Used for** — seven routines against JSdotNet/ai-plugins.
  - Daily: devbook-validate.
  - Weekdays: merge-review.
  - Sunday, one per hour: tech-update, devbook-verify, prose-check, instruction-review, and
    weekly-update. These moved to Sunday on 2026-10-06 with `delivery-schedule` 1.18.0.
- **Adopted by** — the maintainer's desktop app. The seven were created on 2026-09-26 and are
  recorded under `components.schedule` in `.devbook/config.json`. The eleven JSdotNet/Backlog
  routines are unchanged.
- **Evidence** — the instruction-review routine opened #166 on 2026-10-01, and it was merged
  the same day: the first run that published something a person acted on.
- **Moves up when** — the other routines have done the same.
- **Limits** — the nightly version bump is a CI schedule, not an agent routine, and is recorded
  on its own. The routines run only while the desktop app is open on the maintainer's machine;
  one that comes due while it is closed runs on the next launch. They are not cloud routines
  because a cloud session needs a committed `.claude/settings.json` enabling the plugins, and
  this repository has none.
