import { expect, test } from 'claude-code/testing'
import type { On } from 'claude-code'

import type { ContextViewInstruction, ContextViewMdRead } from '../../types'

const CHAPTER = '# Building blocks\n\n```meta\nrelated: []\n```\n\n## Hooks\n\n```meta\nx: 1\n```\n'

/** Stands in for the engine beneath the plugin: a session at /repo with three arc42 chapters. */
const engine = (on: On, status: (string | undefined)[] = []) => {
  const state = new Map<string, { value: unknown; version: number }>()
  const id = (e: { plugin: string; key: string }) => `${e.plugin}.${e.key}`
  on('state.get', (_$, e) => ({ value: state.get(id(e)) ?? { value: undefined, version: 0 } }))
  on('state.set', (_$, e) => {
    const version = (state.get(id(e))?.version ?? 0) + 1
    state.set(id(e), { value: e.value, version })
    return { value: { isSet: true as const, version } }
  })
  on('session.cwd', () => ({ value: '/repo' }))
  on('session.usage', () => ({
    value: { startedAt: 0, context: { tokens: 50_000, window: 200_000, percent: 25 }, rateLimits: [] },
  }))
  on('fs.list', (_$, e) => ({
    value: String(e.path).replace(/\\/g, '/').endsWith('/.devbook/arc42')
      ? ['a.md', 'b.md', 'c.md'].map(name => ({ name, kind: 'file' as const, size: 1, mtimeMs: 0, isLink: false }))
      : [],
  }))
  on('fs.read', () => ({ deny: 'no such file' }))
  on('ui.status', (_$, e) => {
    status.push(e.text)
    return { value: undefined }
  })
  on('tool.call', { tool: 'Read' }, () => ({ result: {}, text: CHAPTER }))
  on('tool.call', { tool: 'Bash' }, () => ({ result: {}, text: '# Readme\nhello' }))
  on('tool.call', { tool: 'Agent' }, () => ({ result: {}, text: 'done' }))
  return {
    reads: () => (state.get('claude-desktop.contextReads')?.value ?? []) as ContextViewMdRead[],
    warnings: () => (state.get('claude-desktop.contextWarnings')?.value ?? []) as string[],
    instructions: () => (state.get('claude-desktop.contextInstructions')?.value ?? []) as ContextViewInstruction[],
  }
}

test('records Markdown reads from Read and from cat, and sets the status line', async ($, on) => {
  const status: (string | undefined)[] = []
  const held = engine(on, status)

  await $.tool.call({ tool: 'Read', file_path: '/repo/.devbook/arc42/a.md' })
  await $.tool.call({ tool: 'Read', file_path: '/repo/.devbook/arc42/a.md' })
  await $.tool.call({ tool: 'Bash', command: 'cat README.md' })

  const reads = held.reads()
  expect(reads.map(r => [r.path, r.count, r.via])).toEqual([
    ['.devbook/arc42/a.md', 2, 'Read'],
    ['README.md', 1, 'Bash'],
  ])
  expect(reads[0]?.chapters).toEqual(['.devbook/arc42/a.md', '.devbook/arc42/a.md#hooks'])
  expect(status.at(-1)).toBe('ctx 25% · 2 md')
})

test('warns when most of a devbook folder loads in one turn, and on a _meta read', async ($, on) => {
  const held = engine(on)

  for (const name of ['a', 'b', 'c']) await $.tool.call({ tool: 'Read', file_path: `/repo/.devbook/arc42/${name}.md` })
  await $.tool.call({ tool: 'Read', file_path: '/repo/.devbook/_meta/index.md' })

  const warnings = held.warnings()
  expect(warnings.some(w => w.startsWith('Most of `.devbook/arc42` loaded in one turn (3 of 3 files)'))).toBe(true)
  expect(warnings.some(w => w.includes('`_meta/` file read'))).toBe(true)
})

test('records an agent from an Agent call with subagent_type', async ($, on) => {
  const held = engine(on)

  await $.tool.call({ tool: 'Agent', description: 'x', prompt: 'y', subagent_type: 'qa:qa' })

  expect(held.instructions().find(i => i.kind === 'agent')?.name).toBe('qa:qa')
})

test('the pane draws every section on terminal and desktop', async ($, on) => {
  engine(on)
  await $.tool.call({ tool: 'Read', file_path: '/repo/.devbook/arc42/a.md' })

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({
      plugin: 'claude-desktop',
      surface,
      component: 'Pane',
      requestId: 'context-view',
      props: {
        title: 'Context',
        isFocused: false,
        bodyColumns: 80,
        placement: 'dock',
        scroll: { offset: 0, bodyRows: 40 },
        view: {},
      },
    })
    expect(await ui.find({ type: 'Markdown', text: /50k \/ 200k/ })).toBeDefined()
    expect(await ui.find({ type: 'Markdown', text: /Markdown read/ })).toBeDefined()
    expect(await ui.find({ type: 'Markdown', text: /Devbook lens/ })).toBeDefined()
    await ui.unmount()
  }
})
