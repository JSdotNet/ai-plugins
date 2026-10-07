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

const PANE = {
  plugin: 'claude-desktop-mods',
  component: 'Pane' as const,
  requestId: 'context-view',
  props: {
    title: 'Context',
    isFocused: true,
    bodyColumns: 80,
    placement: 'dock' as const,
    scroll: { offset: 0, bodyRows: 40 },
    view: {},
  },
}

/** Every Text and Button the drawing shows, joined: what a reader of the pane sees. */
const shown = async (ui: { findAll: (q: { type?: string }) => Promise<{ text: string }[]> }) =>
  [...(await ui.findAll({ type: 'Text' })), ...(await ui.findAll({ type: 'Button' }))].map(x => x.text).join('\n')

test('the overview draws the meter, sections and devbook folders on every surface', async ($, on) => {
  engine(on)
  for (const name of ['a', 'b', 'c']) await $.tool.call({ tool: 'Read', file_path: `/repo/.devbook/arc42/${name}.md` })

  for (const surface of ['terminal', 'desktop', 'vscode', 'mobile'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface })
    const text = await shown(ui)
    expect(text).toMatch(/50k/)
    expect(text).toMatch(/200k tokens/)
    expect(text).toMatch(/INSTRUCTIONS/)
    expect(text).toMatch(/MARKDOWN READ/)
    expect(text).toMatch(/DEVBOOK/)
    expect(text).toMatch(/devbook warning/)
    expect(await ui.find({ type: 'Button', key: 'zoom:md:.devbook/arc42/a.md' })).toBeDefined()
    await ui.unmount()
  }
})

test('a section heading folds its rows', async ($, on) => {
  engine(on)
  await $.tool.call({ tool: 'Read', file_path: '/repo/.devbook/arc42/a.md' })

  const open = await $.ui.mount({ ...PANE, surface: 'terminal' })
  await open.press({ key: 'fold:markdown' })
  await open.unmount()

  const shut = await $.ui.mount({ ...PANE, surface: 'terminal' })
  expect(await shut.find({ type: 'Button', key: 'zoom:md:.devbook/arc42/a.md' })).toBeUndefined()
  expect(await shut.find({ type: 'Button', key: 'fold:markdown' })).toBeDefined()
  await shut.unmount()
})

test('a row zooms into its file page, and Back returns to the overview', async ($, on) => {
  engine(on)
  await $.tool.call({ tool: 'Read', file_path: '/repo/.devbook/arc42/a.md' })
  await $.tool.call({ tool: 'Read', file_path: '/repo/.devbook/arc42/a.md', offset: 3, limit: 10 })

  const overview = await $.ui.mount({ ...PANE, surface: 'terminal' })
  await overview.press({ key: 'zoom:md:.devbook/arc42/a.md' })
  await overview.unmount()

  const zoomed = await $.ui.mount({ ...PANE, surface: 'terminal' })
  const page = await shown(zoomed)
  expect(page).toMatch(/← CONTEXT/)
  expect(page).toMatch(/tokens over 2 reads/)
  expect(page).toMatch(/lines 3–12/)
  expect(page).toMatch(/paid again/)
  expect(page).toMatch(/#hooks/)
  expect(page).toMatch(/Building blocks/)
  await zoomed.press({ key: 'back' })
  await zoomed.unmount()

  const back = await $.ui.mount({ ...PANE, surface: 'terminal' })
  expect(await shown(back)).toMatch(/MARKDOWN READ/)
  await back.unmount()
})

test('a devbook folder zooms into its coverage by turn', async ($, on) => {
  engine(on)
  for (const name of ['a', 'b', 'c']) await $.tool.call({ tool: 'Read', file_path: `/repo/.devbook/arc42/${name}.md` })

  const overview = await $.ui.mount({ ...PANE, surface: 'terminal' })
  await overview.press({ key: 'zoom:db:arc42' })
  await overview.unmount()

  const zoomed = await $.ui.mount({ ...PANE, surface: 'terminal' })
  const page = await shown(zoomed)
  expect(page).toMatch(/COVERAGE BY TURN/)
  expect(page).toMatch(/Most of .devbook\/arc42 loaded/)
  expect(page).toMatch(/CHAPTERS LOADED/)
  await zoomed.unmount()
})
