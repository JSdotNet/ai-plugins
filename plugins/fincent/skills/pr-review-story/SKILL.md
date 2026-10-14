---
name: pr-review-story
description: >
  Verify that a pull request fully delivers its linked Fincent story: every acceptance
  criterion covered, no out-of-scope changes, and the PR traced back to the story. Use when:
  "does this PR deliver FIN-123", "check the PR against the story", before a merge decision,
  or when PR scope and story scope seem to differ. DO NOT USE FOR: code structure
  (pr-review-architecture), domain code (pr-review-domain), or answering remarks (pr-remarks-resolve).
---

# PR vs Story Review

Answer one question: does the PR deliver exactly what its `FIN` story describes — no less,
no more? Judge story-to-PR fit only; the architecture and domain reviews run separately.

1. Take the story key from the input, else from the PR title, description, or branch name.
   Load the story per [jira-discovery.md](../../resources/jira-discovery.md): summary,
   description, acceptance criteria (description, custom field, or attachment), type,
   epic, and points.
2. Load the PR diff, title, and description.
3. Map each acceptance criterion to evidence in the diff. When the story lists none, infer
   them from the description and mark each `(inferred)`.
4. List the changes unrelated to the story, each classed `Unrelated`, `Tech debt`, or
   `Intentional extra`, and flag `Unrelated` ones for a separate PR or story. Skip trivial
   formatting and import clean-ups unless the file is unrelated to the story altogether.

## Output

```markdown
## PR vs Story: FIN-xxx — {story title}

**PR**: #{n} — {PR title}
**Verdict**: ✅ Fully delivered | ⚠️ Partially delivered | ❌ Not delivered

### Acceptance Criteria Coverage
| # | Acceptance criterion | Covered | Evidence (file:line) |

### Out-of-Scope Changes
| File / area | Change | Classification |        (or "None detected.")

### Alignment Check
| Check | Result | Notes |
| PR title or description references the story key | ✅/❌ | |
| PR scope matches the story type | ✅/❌ | |
| Bug: reproduction steps addressed | ✅/❌/N/A | |
| Feature: happy path and edge cases present | ✅/⚠️/❌ | |
| UI: screenshots or test evidence attached | ✅/⚠️/❌/N/A | |

### Summary
{2–3 sentences: what the PR delivers, what is missing, the recommended action}
```

- **Covered**: ✅ clearly implemented, ⚠️ partial or not verifiable from code, ❌ no evidence.
- **Verdict**: ✅ every criterion covered and no concerning out-of-scope change. ⚠️ gaps
  remain; mergeable when a follow-up story exists or is created for each. ❌ a critical
  criterion is missing or the PR changes something else: do not merge, and list the gaps.
