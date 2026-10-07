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
  on('clock.now', () => ({ value: 5_000 }))
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
    reads: () => (state.get('claude-desktop-mods.contextReads')?.value ?? []) as ContextViewMdRead[],
    warnings: () => (state.get('claude-desktop-mods.contextWarnings')?.value ?? []) as string[],
    instructions: () => (state.get('claude-desktop-mods.contextInstructions')?.value ?? []) as ContextViewInstruction[],
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
      plugin: 'claude-desktop-mods',
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

test('zooming into a line shows its detail, and Back returns to the overview', async ($, on) => {
  engine(on)
  await $.tool.call({ tool: 'Read', file_path: '/repo/.devbook/arc42/a.md' })
  await $.tool.call({ tool: 'Read', file_path: '/repo/.devbook/arc42/a.md', offset: 3, limit: 10 })

  const pane = {
    plugin: 'claude-desktop-mods',
    surface: 'terminal' as const,
    component: 'Pane' as const,
    requestId: 'context-view',
    props: { title: 'Context', isFocused: true, bodyColumns: 80, placement: 'dock' as const, scroll: { offset: 0, bodyRows: 40 }, view: {} },
  }
  const overview = await $.ui.mount(pane)
  await overview.select({ key: 'zoom', value: 'md:.devbook/arc42/a.md' })
  await overview.unmount()

  const zoomed = await $.ui.mount(pane)
  const page = await zoomed.find({ type: 'Markdown', key: 'detail' })
  expect(page?.text).toMatch(/2 reads/)
  expect(page?.text).toMatch(/lines 3–12/)
  expect(page?.text).toMatch(/#hooks/)
  expect(page?.text).toMatch(/Building blocks/)
  await zoomed.press({ key: 'back' })
  await zoomed.unmount()

  const back = await $.ui.mount(pane)
  expect(await back.find({ type: 'Markdown', key: 'detail' })).toBeUndefined()
  expect(await back.find({ type: 'Markdown', text: /Markdown read/ })).toBeDefined()
  await back.unmount()
})
