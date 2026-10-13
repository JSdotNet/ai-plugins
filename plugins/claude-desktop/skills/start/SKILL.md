---
name: start
description: "Start this repository's application the way the repository says to, then open it. Use when: starting or running the app locally, 'start the app', 'run it and open it', or resuming work on a branch."
---

# Start the Application

Start the app from the repository's own startup instruction, then open it. Usually that is
`aspire run` plus a browser on the front end.

## Find the Instruction

The first source that answers wins; say which one was used.

1. `.claude/start.md` — the startup instruction, shaped like
   [claude-start-template.md](../../resources/claude-start-template.md).
2. `.claude/orch-context.md` — `## How to Run`, `## Base URLs`, `## Healthy Startup`.
3. The repository's getting-started docs — `README.md`, `CONTRIBUTING.md`,
   `.github/instructions/`.
4. Inference — an `*.AppHost` project means `aspire run`; otherwise `package.json` scripts,
   `compose.yaml`, `.claude/launch.json`. Say that this was a guess.

`**Runnable application:** none` in `.claude/orch-context.md` means there is nothing to
start. Say so and stop.

## Run It

1. Check whether it already runs — worktrees share ports. Reuse a running instance and say
   so; restart one only after saying you will.
2. Run the declared command in the background. When it fails, report the failure and keep to
   the declared command rather than trying another.
3. Wait for the declared readiness signal, or `list_resources` on the Aspire MCP server when
   there is an AppHost. Stop waiting on a fatal error or after two minutes of silence.
4. Open the URL from `## Open`, else the front end from `## Base URLs`, else the one the
   startup output printed — in the inline browser pane (`preview_start`), else as a plain
   URL. Re-read the port on every start; it changes.
5. Follow `## Sign In` and `## Go To` when present; `## Go To` lands on the area the branch
   changes (match `git diff --name-only` against its entries). For a credential, open the page,
   name where the credential lives, and let the user sign in — typing passwords, tokens, and
   keys is theirs.
6. Propose destructive setup (database drop, volume prune, `git clean`) for the user to run;
   starting runs none of it.

Report in a couple of lines: instruction source, command, health, open URL. Leave the app
running. Offer once to write `.claude/start.md` when the start was inferred.
