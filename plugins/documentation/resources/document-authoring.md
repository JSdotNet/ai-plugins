---
name: document-authoring
description: The authoring procedure every documentation and profile create-* skill shares — inputs, gap markers, what may be published, format, and saving.
---

# Document authoring

Every `create-*` skill in this plugin runs this procedure. The skill names its type-specific
inputs, its default path, and its type contract; this file holds everything they share.

1. **Inputs.** Ask only for the skill's inputs the request has not already given, plus the
   output location, offering the skill's default path. Ask them in one message.
2. **Type contract.** Read the type contract the skill names before drafting, and follow its
   structure, section order, and section rules.
3. **Gaps.** Draft from what the person supplied and from sources they pointed at. Where a
   fact, metric, date, link, version, or decision is missing, write a `[TODO: <what is
   missing>]` marker in its place instead of a plausible value.
4. **What may be published.** Include only what the person approved as public. Leave out
   secrets, tokens, credentials, private endpoints, internal-only details, private contact
   details, compensation, and confidential client or roadmap information unless the person
   explicitly asks for that item to be published.
5. **Format.** Write lint-safe Markdown: ATX headings with one blank line before and after,
   one blank line between blocks, short paragraphs, numbered lists only where order matters,
   and commands, paths, environment variables, and file names in backticks.
6. **Save and report.** Save to the agreed path, creating the folder when it is missing.
   Report the path and every `[TODO: …]` marker left in the document.
