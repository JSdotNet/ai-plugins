// Pure helpers for hooks/handoff.tsx: the prompt that asks for a cross-repository handoff
// brief, and finding that brief in a reply.

import type { HandoffBrief } from '../types'

/** The shape the reply is asked for; the band finds the brief by its fence and heading. */
export function handoffPrompt(args: string): string {
  const asked = args.trim()
  const target = asked
    ? `Target and change, as asked: ${asked}`
    : 'Infer the target repository and the change from this session; ask first if either is unclear.'
  return [
    'Write a cross-repository handoff: a self-contained Markdown brief a session in another repository can act on without this conversation.',
    target,
    '',
    'Reply with the brief as one block fenced by `~~~markdown` and `~~~`, in this shape:',
    '',
    'Title this session `<short title>`',
    '# Handoff — <the change, in a few words>',
    '**Target repository:** <name, path, or owner/repo> · **From:** <this repository and branch>',
    '## Why — what this work needs, and what waits or breaks without it',
    '## Change — what to change in the target repository, concretely',
    '## Context — quoted, never linked: the interfaces, payloads, errors, and decisions the target cannot read',
    '## Done when — acceptance criteria and how to verify them',
    '## Open questions — each with the default to take',
    '',
    'Write no file, change nothing, keep secrets out, and do nothing else in this turn.',
  ].join('\n')
}

const FENCE = /^(~{3,}|`{4,})markdown[^\n]*\n([\s\S]*?)\n\1[ \t]*$/gm

/** The last handoff brief in a reply: a markdown fence holding a `# Handoff` heading. */
export function findBrief(answer: string): HandoffBrief | null {
  let found: HandoffBrief | null = null
  for (const match of answer.matchAll(FENCE)) {
    const text = (match[2] ?? '').trim()
    const heading = /^#\s+Handoff\s*[—–-]\s*(.+)$/m.exec(text)
    if (!heading?.[1]) continue
    const target = /\*\*Target repository:\*\*\s*([^·\n]+)/.exec(text)?.[1]?.replace(/`/g, '').trim()
    found = { title: heading[1].trim(), target: target || 'another repository', text }
  }
  return found
}
