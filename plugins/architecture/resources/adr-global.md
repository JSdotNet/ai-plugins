---
name: adr-global
description: What a decision record holds, its one-file-per-concern shape, how a new decision or a proposal changes it, and the adr/ index.
---

# Decision Records

Prose follows `prose.md`. Where the repository has `.devbook/arc42/`, its folder rule governs
metadata and wins over this contract on any conflict.

## What earns a record

A decision record holds a choice whose reversal costs a migration — of code, of data, or of
the domain model's language: a storage engine, an API style, an integration protocol, a
hosting model, a runtime or framework, how packages are built, an aggregate or consistency
boundary. A choice reversible with a find-and-replace is not a record.

Naming, folder layout, process, ownership, and how a document is written are not records.
State the reason in a sentence in the rule, chapter, or bounded context that states the
choice, and open no record.

## One record per concern

- The file is the concern: `adr/<concern>.md`, a kebab-case slug with no number —
  `adr/storage.md`, `adr/api.md`. It always describes the standing choice.
- A new decision on a covered concern rewrites that record: the choice, `## Why`, and
  `## Rejected` are brought in line, and a row is added to `## History`. Open a new file only
  for a concern no record covers.
- Two concerns always decided together are one record; a record growing a second subject is
  two.
- A concern the system no longer has is marked `status: deprecated` and says what happened.
  Never delete a record.

## Shape, in this order

- The title, then the metadata block, then the standing choice in one or two sentences.
- `## Why` — the reasons that carry the choice today.
- `## Rejected` — each alternative considered and why it lost.
- `## History` — a table `| Date | Change |`, newest first, one row per decision: the date,
  what changed, and why in a clause. The bottom row is the concern's first choice. The
  record's `date` field carries the newest row's date.

Each `##` section carries its own metadata block when the folder rule asks for one.

## Proposals

A proposed change lives in the concern's record: set `status: proposed` and add a
`## Proposed` section stating the candidate choice against the standing one. Decided, fold it
into the choice and a history row and remove the section; declined, add a history row saying
so and remove the section. Never write a proposal as a separate document.

## The index

`adr/README.md` carries `index: root` in its metadata and lists every concern with its
standing choice in one line, linked. Update it in the same change as the record.
`09-architecture-decisions.md` links to the index and restates nothing.
