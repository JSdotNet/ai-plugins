---
name: wip-stories
description: Where a user story goes in the .wip convention, and which standard governs its content.
---

# Story placement

- Path: `.wip/work/<module>/story-<short-title>.md` — one module depth, `<short-title>`
  lowercase kebab-case, in the same module folder as the related epic and bug files.
- Content: the story standard is `product-owner`'s — write the story with
  `product-owner:write-story`, which loads that plugin's `stories` contract.
- Without `product-owner`, keep this section order: `# Story: <short outcome title>`;
  `## Description`, opening `As a <persona>, I want <goal>, so that <benefit>.` and closing
  with what is out of scope, each uncertainty marked `⚠️` at the end of its line;
  `## Acceptance Criteria`, numbered and testable; `## Test Instructions` (optional);
  `## Jira Fields` with `Type: Story` and `Epic Link: [TODO]`.
- Apply [wip-confidence.md](wip-confidence.md) while writing it: it sits under `.wip/work/`.
