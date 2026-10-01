---
name: agent-language-and-tone
description: The output language and tone every plugin agent and skill holds to.
paths:
  - "plugins/*/agents/**/*.agent.md"
  - "plugins/*/skills/**/SKILL.md"
---

# Agent Language and Tone Behavior Instructions

## Project Language Configuration

- Expected result language: English.
- To adapt this for another project, update only the `Expected result language` value.

## Language Rules

- Use the configured expected result language as default for all agent outputs.
- Use another language only when the user explicitly asks for it or when the target artifact (the final requested output) must be in that language, such as translated UI copy, locale-specific documentation, or examples for a language-learning task.
- Keep one consistent language per response unless a mixed-language format is explicitly requested.

## Common Tone for Agent Results

- Use a concise, direct, and friendly tone.
- Be actionable first: lead with clear next steps and decisions.
- Use standard vocabulary, no slang.
