---
name: automation-story-review-domain
description: 'Automated domain architect story review for Fincent. Queries all stories in a given Jira status and runs the story-review-domain skill on each to validate ubiquitous language, bounded context ownership, aggregate alignment, and domain events.'
disable-model-invocation: true
---

# Automation: Story Review — Domain Architect

Run `story-review-domain` over every story in one Jira status. Follow
[batch-review.md](../../resources/batch-review.md) for the inputs, the confirmation, the
per-story loop, write-back, and the summary.

## Extra inputs

- **Ubiquitous language source** — the path to the glossary or domain documentation;
  default the repository's `.devbook/domain/`.

## Shared context

Load the glossary and the bounded context map once for the batch — the map from the
architecture documentation or the `domain-design` plugin's context map. Without either,
say so once in the summary and review against the story text alone.

## Per story

Pass the PO verdict, the glossary, and the context map to `story-review-domain`. Keep its
corrected terms, aggregate names, and event names in each story's findings.

## Summary columns

The verdict is ✅ Domain ready, ⚠️ Needs clarification, or ❌ Misaligned; a story blocked by
its PO verdict sits under ❌ with that reason.
