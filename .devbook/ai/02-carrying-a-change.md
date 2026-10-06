# Carrying a Change

```meta
status: adopted
type: stage
```

> How a change gets from an idea to `main`: cut into a Backlog plan, run one item per worktree
> session, opened as a pull request under the organization account, and versioned.

## Backlog Plan Items

```meta
status: adopted
type: workflow
stage: [plan, code]
depends-on: [".devbook/tech/tooling.md#backlog-tools-plugin"]
date: 2026-09-24
```

A change too big for one session is written as a Backlog import plan, and each item is pasted
into its own session, where `backlog-run-plan-item` checks whether it has already landed
before doing anything.

- **Used for** — multi-step changes such as `ai-plugins-devbook-adoption`: each item names the
  items it comes after, and the session is titled with the plan name.
- **Adopted by** — the maintainer, for every multi-step change to this repository and the
  sibling repositories since the devbook migration plans of 2026-09-24.
- **Evidence** — the `ai-plugins-devbook-adoption` sessions for the specialist layout, the
  dashboard labels, the architecture records, the technology graph, and this chapter. A re-pasted
  item after a crash ran the landed-check and redid nothing.
- **Limits** — a one-session change is asked for directly, with no plan.

## Estimate Procedure

```meta
status: candidate
type: skill
stage: [plan]
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
- **Evidence** — none yet. It moves to `trial` once a plan is sized against the table, and a
  row is replaced when finished work shows its size was wrong.
- **Limits** — rows 1, 13, and 21 were sized after their pull requests merged, not before.

## Flow Skills

```meta
status: trial
type: skill
stage: [plan, code, test]
depends-on: [".devbook/tech/tooling.md#devbook-plugin"]
date: 2026-10-06
```

A change routes to the delivery flow named for what it changes — `flow-code` for anything
outside `.devbook/`, `flow-spec` for a devbook folder — which runs it phase by phase to a pull
request behind a Personal Validation gate.

- **Used for** — the phase maps in `.devbook/config.json`, one per flow: `devbook:validate`
  before `phase-update-base` in both, `architecture:architect` for scope, plan, and the `arc42/`
  and `tech/` drafting, `documentation:documentation` for the `ai/` drafting, and
  `devbook:verify-change` as `flow-code`'s spec check. Every other phase runs on the session's
  model.
- **Adopted by** — nobody yet. The phase maps landed with the 1.19 update on 2026-10-06, and
  every change before it was carried by hand under `AGENTS.md`.
- **Evidence** — the pull request that wrote this chapter was the first change here carried by
  `flow-spec` end to end, reporting into the Backlog surface. Promote to `adopted` once
  `flow-code` has carried a change to a plugin the same way.
- **Limits** — the Personal Validation gate needs a person, so a scheduled routine never runs a
  flow.

## Worktree Sessions

```meta
status: adopted
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
status: adopted
type: skill
stage: [release]
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
status: hold
type: hook
stage: [release]
depends-on: [".devbook/tech/tooling.md#github-actions"]
date: 2026-09-26
```

`nightly-plugin-version-bump.yml` runs at 01:00 UTC to bump the version of every plugin that
changed without one — the backstop for an agent-authored change that left the bump out.

- **Used for** — nothing in practice. On a schedule the workflow checks out `main` and diffs it
  against its own merge base with `main`, so the diff is always empty and it never bumps a
  plugin.
- **Adopted by** — nobody; the version is bumped in the session with `bump-version.mjs`, which
  `AGENTS.md` requires.
- **Evidence** — ten consecutive scheduled runs, 2026-09-17 through 2026-09-26, each succeeded
  with "No changed files detected"; no nightly bump pull request has ever been opened.
- **Limits** — no model runs in it; it is recorded here because it exists to backstop agent
  sessions. It returns to `adopted` once it diffs against the last release instead.

## Scheduled Routines

```meta
status: trial
type: workflow
stage: [operate, monitor]
depends-on: [".devbook/tech/tooling.md#claude-code", ".devbook/tech/hosts.md#claude-desktop"]
date: 2026-09-26
```

Unattended agent routines from `delivery-schedule`, run on a cron as local scheduled tasks in
the Claude desktop app. Each run makes its own detached worktree off `origin/main` in the
`D:\Repos\Copilot` clone.

- **Used for** — seven routines against JSdotNet/ai-plugins: devbook-validate (daily) and
  merge-review (weekdays), then on Sunday, one per hour, tech-update, devbook-verify,
  prose-check, instruction-review, and weekly-update. They moved to Sunday on 2026-10-06 with
  `delivery-schedule` 1.18.0.
- **Adopted by** — the maintainer's desktop app. The seven were created on 2026-09-26 and are
  recorded under `components.schedule` in `.devbook/config.json`. The eleven JSdotNet/Backlog
  routines are unchanged.
- **Evidence** — the instruction-review routine opened #166 on 2026-10-01, and it was merged
  the same day: the first run that published something a person acted on. Promotion to
  `adopted` needs the other routines to have done the same.
- **Limits** — the nightly version bump is a CI schedule, not an agent routine, and is recorded
  on its own. The routines run only while the desktop app is open on the maintainer's machine;
  one that comes due while it is closed runs on the next launch. They are not cloud routines
  because a cloud session needs a committed `.claude/settings.json` enabling the plugins, and
  this repository has none.
