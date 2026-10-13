---
name: react-testing
description: 'Write React component and hook tests that assert user-visible behavior with accessible queries, using the test runner the repository already has. Use when: adding tests for new UI behavior, updating tests after a component or hook change, diagnosing a flaky frontend test. DO NOT USE FOR: browser end-to-end tests against a running app (qa:playwright-e2e-authoring).'
---

# React Component And Hook Testing

Test what a user can observe; a test on internal state or class names locks in the
implementation.

## Steps

1. Apply `frontend-stack-detect` for the runner, testing library, setup file, and non-watch
   test command. Open the nearest existing test for the same kind of unit and reuse its
   placement, naming, setup, and mocking; add no second runner or assertion style.
2. Stub at the network boundary the repository already stubs at, so no test makes a real
   network call, and reset handlers and shared clients between tests.
3. Query by role, label, and visible text. Use a test id only when no accessible query
   reaches the element, and state the reason beside it.
4. Per behavior, cover the happy path, one failure path, one edge case, and the loading,
   empty, and error branches of every asynchronous view. Await the library's async
   utilities; never a fixed delay.
5. Run the test command non-watch, scoped to the changed area first and then the full suite,
   then the typecheck command, and report both results.
