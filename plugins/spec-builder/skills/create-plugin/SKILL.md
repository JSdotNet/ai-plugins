---
name: create-plugin
description: 'Create or refine a plugin package for both hosts — the Copilot and Claude manifests, marketplace entry, and documentation — with valid component paths. Use when: adding a plugin, adding components to one, fixing its manifests, or bumping its version. DO NOT USE FOR: one agent or skill inside it (create-agent, create-skill).'
---

# Create Plugin Skill

## Inputs

- Plugin name, version, and scope.
- Required components (agents, skills, hooks, optional config).
- Packaging or install constraints.

## Workflow

1. Define plugin intent and boundaries.
2. Draft or update both manifests — `.github/plugin/plugin.json` and
   `.claude-plugin/plugin.json`, with the same name, version, and description — and confirm
   every component path maps to an existing folder.
3. Update the plugin `README.md` with install and reinstall guidance.
4. Verify metadata and scope consistency across the manifest, README, and components.
5. Prune against
   [spec-conciseness.md](../../resources/spec-conciseness.md):
   state each rule once and point at its owner from everywhere else.
6. Write the Claude hook twin when there is a `sessionStart` prompt, the marketplace entry,
   and the `copilot-plugins.md` row; set a changed plugin's version in all four places with
   `node tools/bump-version.mjs <plugin> [patch|minor|major]`; then run
   `node tools/check-assets.mjs` to confirm the plugin loads in both hosts.

## Output

- Updated plugin package metadata and Markdown documentation.
- Both manifests, the hooks, the marketplace entry, and the `copilot-plugins.md` row, at one version.

## References

- [create-plugin.md](../../resources/create-plugin.md)
- [Crosscutting Concepts](../../../../.devbook/arc42/08-crosscutting-concepts.md) — why
  both hosts' files are hand-authored and what the checker compares. It exists only in the
  marketplace's own repository; where it is absent, `create-plugin.md` above is the source.
