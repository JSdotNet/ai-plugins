---
name: react-component
description: 'Write or change a React component so it matches the patterns already in the repository — composition, typing, state placement, data fetching, and accessibility. Use when: implementing a UI change from a plan or specification, extending or restructuring a component, reviewing a component change for consistency. DO NOT USE FOR: the API binding (api-client-contract) or the tests (react-testing).'
---

# React Component Implementation

Match the repository before any general best practice: the nearest existing component of
the same kind — page, container, form, list, presentational — is the specification.

## Steps

1. Apply `frontend-stack-detect`, then open that nearest sibling and copy its file placement,
   naming, export style, prop typing, and test companion.
2. Bind data with `api-client-contract` before building the view, so props are typed from
   the contract; reuse contract types instead of restating fields.
3. Respect the project's TypeScript strictness; never relax `tsconfig`, and never use `any`,
   an unchecked cast, or a non-null assertion to make code compile.
4. Use the one styling mechanism already in use, with the project's design tokens for every
   color, spacing, and font value a token covers.
5. Give every asynchronous view explicit loading, empty, and error branches.
6. Run the detected typecheck, lint, tests for the changed area (`react-testing`), and
   production build, and report each result.
