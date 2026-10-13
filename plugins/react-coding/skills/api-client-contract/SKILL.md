---
name: api-client-contract
description: 'Bind a React frontend to a .NET API with the API contract as the single source of truth for request, response, and error types. Use when: a screen consumes a new or changed endpoint, the UI calls the API through untyped or guessed shapes, a backend response changed and the UI must follow. DO NOT USE FOR: the component markup itself (react-component).'
---

# API Client From Contract

Types flow from the contract into the UI: a screen never invents a shape the API does not
promise, and the frontend never restates a shape the backend already publishes.

## Source of truth

Use the first source that exists, and record which one was used:

1. A generated client or generated types from the API's OpenAPI document.
2. The API's OpenAPI or Swagger document, when the repository has a generation step.
3. The `## API Contract` section of the specification or plan the caller hands over.
4. The .NET request, response, and problem-detail types in the API layer, read directly.

A component's existing local interface is never the source. When it disagrees with the
contract, the contract wins and the local type is corrected.

## Steps

1. Apply `frontend-stack-detect` for the data-fetching library, any generation step, and the
   typecheck command.
2. When the repository generates types, run its generator instead of hand-writing types, and
   report the command. Otherwise define the request, response, and error types once, in the
   module that owns the endpoint group, and export them.
3. Give each endpoint exactly one call site — one function, or one query and mutation pair —
   holding URL, method, headers, and status handling; components consume it through the
   data-fetching library's own patterns. Take the base URL, tenant, and token from
   configuration.
4. Model errors from the contract: each documented status code and the API's
   problem-details shape, not one generic catch.
5. Run the typecheck command and confirm the binding compiles with no `any`, unchecked cast,
   or non-null assertion silencing a mismatch.

## .NET mapping gotchas

- Read the API's JSON naming policy before naming fields; never assume camelCase.
- Optional only where the contract says nullable or optional; required stays required.
- Dates in the contract's wire format, converted at the edge.
- `decimal` money in the contract's precision, never through a lossy `number` intermediate.
- Enums as a union of the contract's literal values, not `string`.
- Paged results in the contract's envelope, with its total and cursor fields.
