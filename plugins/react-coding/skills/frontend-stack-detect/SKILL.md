---
name: frontend-stack-detect
description: 'Detect a repository frontend stack from its own files — package manager, React version, routing, state, data fetching, styling, test runner, and the exact build, typecheck, lint, and test commands. Use when: before the first frontend edit in a session, before any frontend validation command, a plan or issue names a library the repository may not use.'
---

# Frontend Stack Detection

Read the stack out of the repository; never assume a version, package manager, or command.
Every value names the file that proved it; anything unproven is an assumption.

## Where to read

1. The frontend root: the `package.json` declaring `react` (repository root, `src/Web/`,
   `web/`, `frontend/`, `client/`, `app/`, or a workspace member). Read its dependencies,
   `scripts`, `packageManager`, `workspaces`, and `type`.
2. The lockfile beside it; `tsconfig.json` and its base (strictness,
   `noUncheckedIndexedAccess`, aliases, JSX mode); the bundler, test runner, lint, and
   format configs, with the runner confirmed against an existing test.
3. Real usage in source, since a manifest dependency may be unused — including whether the
   project is on the React Compiler or legacy `memo` patterns.

## Rules

- The lockfile wins (`pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`, `bun.lock`), checked
  against `packageManager`. Never run a manager whose lockfile is absent; install frozen.
- A declared script beats a raw tool (`<manager> run <script>`). Without one, use the closest
  raw equivalent (`tsc --noEmit -p <tsconfig>`, the tool's own CLI) and mark it `fallback`.
  With neither, mark the gate `unavailable`: never invent a command or report it as passed.
- Run tests non-interactive and non-watch, so a gate cannot hang.
- In a monorepo, record whether each command runs from the workspace root with a filter or
  from the package folder, with the exact invocation.

## Output

```text
Frontend root: <path>                      (evidence: <file>)
Package manager: <name>                    (evidence: <lockfile>)
React: <version>, <Compiler | memo>        (evidence: package.json, <source file>)
Bundler/framework: <name>                  (evidence: <config file>)
Router / state / data / forms: <libs>      (evidence: <files>)
Components / styling / tokens: <approach>  (evidence: <files>)
Tests: <runner> + <library> + <e2e>        (evidence: <config>, <example test>)
TypeScript / lint / format: <notes>        (evidence: tsconfig.json, <configs>)
Commands (run from <location>):
  install / dev  <command> / <command>
  typecheck  <command>  [script | fallback | unavailable]
  lint       <command>  [script | fallback | unavailable]
  test       <command>  [script | fallback | unavailable]
  build      <command>  [script | fallback | unavailable]
  format     <command>  [script | fallback | unavailable]
Assumptions: <list, or "none">
```
