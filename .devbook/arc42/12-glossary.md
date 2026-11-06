# 12. Glossary

```meta
```

| Term | Meaning here |
| --- | --- |
| Agent | An `agents/<role>.agent.md` file: a persona with a description and tool list, loaded by both hosts. |
| Contract | `plugins/<name>/resources/<name>.md`, with `name` and `description` and no glob. Assets load it by referencing its path. |
| Delivery engine | `delivery` and `delivery-schedule` in the `jsdotnet-devbook` marketplace, running the staged flows that consult a specialist. |
| devbook | The `.devbook/` folder convention and its check, from `JSdotNet/devbook`. |
| Flow control | Sequencing stages, holding a gate, spawning a session, or delegating. Specialists hold none. |
| Host | A program that loads a plugin: GitHub Copilot, or Claude Code with Claude Desktop. |
| Host plugin | A plugin built on one host's rendering surface, shipping only its manifest: `claude-desktop`, `claude-desktop-mods`, `copilot-app`. |
| Marketplace | `jsdotnet-ai-plugins`, the set of plugins listed in `.claude-plugin/marketplace.json`. Each plugin is installed from it separately. |
| Role | A seat a flow consults, such as `architecture` or `ux`. `phases` maps assign it an agent. |
| Rule | `.agents/rules/<topic>.md`, applied when a host reads a file that matches its `paths`. |
| Sidecar | `hooks/session-start-context.md`: the Copilot `sessionStart` prompt, word for word, which the Claude command hook prints. |
| Skill | A `skills/<name>/SKILL.md` procedure, invoked by name or matched from its description. |
| Specialist | A plugin that fills a role, holds no flow control, and can be used alone. |
| Tool map | `tools/tool-map.json`, which translates each Copilot tool id to the Claude names derived from it. |
| Tracker | A plugin that syncs work with an external issue system: `github`, `jira`. |
| Wrapper | A per-host file that carries only the glob of a rule: `.claude/rules/<topic>.md` or `.github/instructions/<topic>.instructions.md`. |
