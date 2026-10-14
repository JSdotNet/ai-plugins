---
name: session-handoff
description: "Package the current session's state into a self-contained brief another session can pick up — a fresh session on the same worktree, a new worktree, or a different repository — then hand back the ready-to-run first message and stop. Use when: context is running out, the 75%/85% context warning fires, handing work to a fresh session, continuing the work in another repo, or parking work to resume later."
---

# Session Handoff

Target `same-worktree` (default), `new-worktree`, or another repository, with a one-line
reason. Run at the 85% context warning; at 75% persist decisions and start nothing heavy.
Keep working, saying why, when the run is one short stage from `finish_run`, the user is at
the Personal Validation gate, or nothing durable exists yet.

## Guardrails

- **Never start the next session yourself, and never spawn an agent to run the handoff.** A
  handed-off session must be able to ask what is ambiguous, hold the Personal Validation
  gate, and own its dashboard run — none of which a sub-agent can do.
- Leave the stage in flight `in_progress`: a resumed run skips every stage marked `done`.
- Commit the work in progress, or describe in the brief what is uncommitted and why.
- Keep tokens, connection strings, and `.env` contents out of the brief; name the file that
  holds them. No brief written, no handoff claimed.

## Procedure

1. **Capture** state from git, not memory, and all the brief template asks for; the origin
   issue goes on as the next session's `githubIssue`.
2. **Resolve the target.** New worktree: name its base branch; uncommitted changes stay here.
   Another repository: check its absolute path exists (else give the clone command), make
   every path absolute, quote what it cannot read, and list what does not travel — branch,
   worktree, uncommitted diff, running app, and the run.
3. **Write the brief** per [session-handoff-template.md](../../resources/session-handoff-template.md)
   to `<dir>/<yyyyMMdd-HHmm UTC>-<slug>.md`, `<dir>` being the first that applies:

   | `<dir>` | When |
   | --- | --- |
   | `$CLAUDE_HANDOFF_DIR`, else `$CLAUDE_CONFIG_DIR/handoffs` | that variable is set |
   | `%USERPROFILE%\.claude\handoffs` or `~/.claude/handoffs` | otherwise |
   | `.wip/handoffs/` (`handoff-<slug>.md`, per `wip-convention:wip-align` when installed) | instead, when the user wants it shared or committed — same repository only |

4. **Mark the run**, when this session reports one to `orch-dashboard`. Same repository:
   `set_run_context` with `changeKind` (plus `approval` and the user's wording when Personal
   Validation decided), then `handoff: true` and a `handoffNote` of finished, unfinished,
   paths, and the resume invocation — without the marker `start_run` refuses to reattach and
   the next session opens a duplicate. Cross-repository: `finish_run` naming where it stopped
   and the brief; the target opens its own run.
5. **Emit the block** per [session-handoff-message.md](../../resources/session-handoff-message.md),
   a ~40-character session title, and where to launch it (worktree, new worktree from the
   base branch, or the other repository's absolute path as the session folder).
6. **Deliver or stop.** When a session for the target already runs here and the host exposes
   session messaging, offer to send the block there: name the session, wait for the user's
   yes, fall back to paste on failure. Then report brief path, target, run marker
   (`handed off`, `finished`, `none`), and what was left out, and stop.
