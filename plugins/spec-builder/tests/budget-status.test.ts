import { describe, expect, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import type { On } from 'claude-code'

import { classify, label, measure } from '../hooks/budget'

const body = (n: number, extra = '') =>
  `---\nname: x\ndescription: y\n---\n\n${extra}${Array.from({ length: n }, (_, i) => `line ${i}`).join('\n\n')}\n`

// A disk in memory, the Write and Edit tools over it, and the status line and toasts captured.
// Beneath the plugins the test stands for the engine, whose answers to these nouns are
// `{ value }` or `{ deny }`.
function rig(on: On, files: Record<string, string>) {
  const seen = { status: [] as (string | undefined)[], toasts: [] as string[] }
  const at = (p: string) => p.replace(/\\/g, '/').replace(/^[A-Za-z]:/, '')
  for (const k of Object.keys(files)) files[at(k)] = files[k] as string
  on('fs.read', ($, e) => {
    const text = files[at(e.path)]
    return (text === undefined ? { deny: `ENOENT ${e.path}` } : { value: text }) as never
  })
  on('tool.call', ($, e) => {
    if (e.tool === 'Write') files[at(e.file_path)] = e.content
    if (e.tool === 'Edit') files[at(e.file_path)] = (files[at(e.file_path)] ?? '').replace(e.old_string, e.new_string)
    return { result: {} as never }
  })
  on('ui.status', ($, e) => {
    seen.status.push(e.text)
    return { value: undefined } as never
  })
  on('ui.toast', ($, e) => {
    seen.toasts.push(e.text)
    return { value: undefined } as never
  })
  return seen
}

const write = ($: Engine, file_path: string, content: string) =>
  $.tool.call({ tool: 'Write', file_path, content })

describe('classify', () => {
  test('budgets each asset kind and nothing else', () => {
    expect(classify('C:\\repo\\plugins\\a\\skills\\s\\SKILL.md')?.budget).toBe(40)
    expect(classify('/r/plugins/a/agents/qa.agent.md')?.budget).toBe(80)
    expect(classify('/r/plugins/a/resources/c.md')?.budget).toBe(60)
    expect(classify('/r/.agents/rules/hooks.md')?.budget).toBe(60)
    expect(classify('/r/.claude/rules/hooks.md')?.budget).toBe(60)
    expect(classify('/r/.agents/rules/README.md')).toBeNull()
    expect(classify('/r/README.md')).toBeNull()
    expect(classify('/r/src/app.ts')).toBeNull()
  })
})

describe('measure', () => {
  test('counts non-blank body lines and colours by distance to the budget', () => {
    expect(measure(40, body(35)).level).toBe('ok')
    expect(label('/s/SKILL.md', measure(40, body(37)))).toBe('🟡 SKILL.md 37/40')
    expect(label('/s/SKILL.md', measure(40, body(40)))).toBe('🟡 SKILL.md 40/40')
    expect(label('/s/SKILL.md', measure(40, body(41)))).toBe('🔴 SKILL.md 41/40')
  })
  test('a stated reason makes an over-budget file exempt', () => {
    const m = measure(60, body(64, 'Over the 60-line budget by design: reference.\n'))
    expect(label('/r/c.md', m)).toBe('c.md 65/60 (exempt)')
  })
})

describe('status line', () => {
  test('shows the edited asset against its budget', async ($, on) => {
    const seen = rig(on, {})
    await write($, '/r/skills/s/SKILL.md', body(20))
    expect(seen.status.at(-1)).toBe('SKILL.md 20/40')
  })

  test('clears when a non-asset file is edited', async ($, on) => {
    const seen = rig(on, { '/r/app.ts': 'a' })
    await write($, '/r/skills/s/SKILL.md', body(38))
    expect(seen.status.at(-1)).toBe('🟡 SKILL.md 38/40')
    await $.tool.call({ tool: 'Edit', file_path: '/r/app.ts', old_string: 'a', new_string: 'b' })
    expect(seen.status.at(-1)).toBeUndefined()
  })

  test('treats a resources/ file without name and description as a template', async ($, on) => {
    const seen = rig(on, {})
    await write($, '/r/resources/template.md', '# T\n\nbody\n')
    expect(seen.status.at(-1)).toBeUndefined()
  })
})

describe('toast', () => {
  test('fires once when a file first crosses its budget', async ($, on) => {
    const file = '/r/agents/qa.agent.md'
    const seen = rig(on, { [file]: body(80) })
    await write($, file, body(81))
    await write($, file, body(79))
    await write($, file, body(82))
    expect(seen.toasts.length).toBe(1)
    expect(seen.toasts[0]).toContain('qa.agent.md 81/80')
  })

  test('stays quiet for a file already over, or exempt', async ($, on) => {
    const seen = rig(on, { '/r/resources/old.md': body(70) })
    await write($, '/r/resources/old.md', body(71))
    await write($, '/r/resources/new.md', body(64, 'This contract exceeds its budget because it is reference.\n'))
    expect(seen.toasts.length).toBe(0)
    expect(seen.status.at(-1)).toBe('new.md 65/60 (exempt)')
  })
})
