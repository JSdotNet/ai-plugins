---
name: howto
description: Rules for writing How-To guides — step-by-step, developer-focused procedural documentation.
---

# How-To Instructions

This contract governs How-To guides — local development setup, laptop setup, tooling
bootstrap, environment onboarding — for developers who need to complete a process step by
step. The shared procedure is [document-authoring.md](document-authoring.md).

## Structure

Use this section order when it improves clarity.

1. `# Title`
2. `## Overview` — short goal statement and target audience.
3. `## Prerequisites` — required accounts, access, software, and assumptions.
4. `## Steps` — numbered sequence with one action per step.
5. `## Validation` — checks that confirm the process worked.
6. `## Troubleshooting` — common issues and fixes, when there are any.
7. `## References` — official docs, scripts, or related internal guides, when there are any.

## Step Rules

- Word each step imperatively ("Install X", "Run Y", "Verify Z") and make it observable.
- State where to run a command: terminal, repository root, admin shell.
- Show the expected result after every critical step.
- Call out OS-specific differences only where they exist.
- State restart, reboot, or sign-out requirements explicitly.
- Put a warning before every destructive or privileged action.
- Link to official documentation for install and update steps.
- Keep the scope to the task; leave out unrelated background.

## Validation Rules

- Make `## Validation` concrete: command output, UI state, or service health.
- State an observable outcome, never "it should work".
- When verification is manual, state who verifies and where.
