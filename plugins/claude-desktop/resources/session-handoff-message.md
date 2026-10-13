<!--
The paste-ready first message a handoff ends with. Emitted verbatim by the
`session-handoff` skill; it carries the essentials inline and points at the brief for the
rest, so it still works if the brief moves or the paste is trimmed.
Read by: ../skills/session-handoff/SKILL.md
-->

# Session handoff message

```text
Continue work handed off from a previous session.

Handoff brief: <absolute path to the brief>
Read it first — it holds the full state, decisions, and verification steps.

Objective: <one or two sentences, in the user's framing>
Repository: <absolute path>   Branch: <branch>   Worktree: <path>
Origin: <issue URL, or "ad-hoc request">

State right now:
- <what is done, concretely>
- <what is uncommitted, or "working tree clean">

Next steps:
1. <first concrete step>
2. <second>

Open questions:
- <question> — default if unanswered: <default>

Verify with:
<the build/test/run commands, and their last known result>

Start by reading the brief and confirming the state still matches, then say how you intend
to continue before changing anything.
```

Keep the last line by default: the new session cannot see the old conversation, so a
confirmation pass is cheap insurance against a stale brief. Drop it only when the user wants
the next session to continue without one.
