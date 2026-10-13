---
name: feature-proposal
description: 'Write a scoped proposal for a new feature or improvement in a C# .NET codebase, then stop before implementation. Use when: the user asks to propose, scope, or size a new capability, enhancement, or change before it is built. DO NOT USE FOR: implementing it (tdd), recording an architectural decision (architecture:create-architectural-decision-record).'
---

# Feature Proposal

Create a clear, actionable proposal for a new feature or code improvement.

## Proposal Structure

Save the proposal where step 3 of the Workflow says.

```markdown
# Feature Proposal: <Feature Name>

## Summary

One-paragraph description of the feature and its purpose.

## Motivation

Why is this feature needed? What problem does it solve?

## Affected Areas

List the affected layers or modules:

- Domain: <yes/no — describe impact>
- Application: <yes/no — describe impact>
- Infrastructure: <yes/no — describe impact>
- API/UI: <yes/no — describe impact>
- Tests: <test changes needed>

## Proposed Approach

High-level technical approach. Include:

- New types, interfaces, or services.
- Changed public APIs.
- Dependencies (new NuGet packages, MCP services).

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Tests pass: `dotnet test`

## Effort Estimate

<Story points on the 1/2/3/5/8/13/21 scale, with one line of reasoning.>

## Assumptions and Open Questions

- Assumption 1
- Open question 1

## Out of Scope

What this proposal does NOT cover.
```

## Workflow

1. Understand the request and gather context.
2. Fill in the proposal template above. Size the effort with the repository's `estimate` skill
   when it has one; otherwise pick story points on the 1/2/3/5/8/13/21 scale yourself.
3. Save it under `.wip/proposals/`, named as the `wip-convention:wip-proposals` contract says
   (`proposal-<short-title>.md`); without the wip-convention plugin, name it `<feature-name>.md`.
4. Report the proposal path and stop. Implementing it is a separate request from whoever
   consulted you.
