---
name: feature-proposal
description: 'Write a scoped proposal for a new feature or improvement in a C# .NET codebase, then stop before implementation. Use when: the user asks to propose, scope, or size a new capability, enhancement, or change before it is built. DO NOT USE FOR: implementing it (tdd), recording an architectural decision (architecture:create-architectural-decision-record).'
---

# Feature Proposal

1. Read the code and context the request touches.
2. Fill every section of the template below. Size the effort with the repository's `estimate`
   skill when it has one; otherwise pick story points on the 1/2/3/5/8/13/21 scale yourself.
3. Save it under `.wip/proposals/`, named as the `wip-convention:wip-proposals` contract says
   (`proposal-<short-title>.md`); without the wip-convention plugin, name it `<feature-name>.md`.
4. Report the proposal path and stop. Implementing it is a separate request from whoever
   consulted you.

```markdown
# Feature Proposal: <Feature Name>
## Summary
<One paragraph: the feature and its purpose.>
## Motivation
<The problem it solves.>
## Affected Areas
- Domain / Application / Infrastructure / API-UI: <yes or no, and the impact, per layer>
- Tests: <the test changes needed>
## Proposed Approach
<New types, interfaces, or services; changed public APIs; new NuGet packages or MCP services.>
## Acceptance Criteria
- [ ] <criterion>
- [ ] Tests pass: `dotnet test`
## Effort Estimate
<Story points, with one line of reasoning.>
## Assumptions and Open Questions
- <assumption or question>
## Out of Scope
<What this proposal does not cover.>
```
