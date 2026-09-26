---
name: create-architectural-decision-record
description: 'Record, change, or propose an architectural decision in its one record per concern, which always states the standing choice with its reasons, rejected alternatives, and history. Use when: a choice would cost a migration to reverse (storage, API style, hosting, a runtime, an aggregate boundary), an existing decision changes, or a change to one is proposed. DO NOT USE FOR: naming, folder layout, process, ownership, or how a document is written — those stay a sentence where they are stated.'
---

# Create Architectural Decision Record

Apply `resources/adr-global.md` and `resources/prose.md`.

## Inputs

- The concern and the choice: new, changed, or proposed.
- The reasons, the alternatives considered, and the date.

## Workflow

1. Test the choice against "What earns a record". If it does not earn one, say where the
   sentence belongs and stop.
2. Find the records folder: `.devbook/arc42/adr/` when it exists, and read that folder's rule;
   otherwise ask for a path.
3. Read the `adr/` index and find the record whose concern covers the choice.
4. Covered concern:
   - a decision — rewrite the standing choice, `## Why`, and `## Rejected`, and add a history
     row;
   - a proposal — set `status: proposed` and add `## Proposed`.
5. No record covers it: create `adr/<concern>.md` in the contract's shape, with its first
   history row.
6. Update the index line for the concern, creating the index with `index: root` if it is
   missing. Leave `09-architecture-decisions.md` linking to the index.

## Output

The changed record and index, and one line naming the concern and what changed.
