import { describe, expect, mock, test } from 'claude-code/testing'
import type { On } from 'claude-code'

import { findBrief, handoffPrompt } from '../hooks/handoff-brief'

const BRIEF = [
  'Title this session `Expose run labels`',
  '# Handoff — Expose run labels on the runs API',
  '**Target repository:** `JSdotNet/ai-agent-stack` · **From:** Copilot on claude/labels',
  '## Change',
  '```bash',
  'npm test',
  '```',
].join('\n')

const ANSWER = `Here is the brief.\n\n~~~markdown\n${BRIEF}\n~~~\n\nPaste it into a session there.`

function host(on: On, copied: string[], prompts: string[], isCopied = true) {
  mock.store(on)
  const clock = mock.clock(on, { now: 0 })
  on('ui.render', ($, e) => {
    const { Box } = $.ui.resolve(e)
    return <Box />
  })
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('command.register', ($, e) => ({ value: { command: e.name } }))
  on('ui.open', () => ({ value: { isPlaced: true as const } }))
  on('ui.close', () => ({ value: undefined }))
  on('ui.toast', () => ({ value: undefined }))
  on('ui.copy', ($, e) => {
    copied.push(e.text)
    return { value: isCopied ? { isCopied: true as const } : { isCopied: false as const, reason: 'no-clipboard' as const } }
  })
  on('prompt.submit', ($, e) => {
    prompts.push(e.text)
    return { text: e.text }
  })
  on('turn.complete', ($, e) => ({ text: e.answer }))
  return clock
}

const typed = (command: string, args = '') => ({
  command,
  args,
  origin: { kind: 'composer' as const },
  presentation: { isFullscreen: true, columns: 160 },
})
const turn = (answer: string, agentId?: string) => ({
  answer,
  agentId,
  durationMs: 1,
  isAborted: false,
  turnId: 't1',
  reason: 'answer' as const,
})
const scroll = { offset: 0, bodyRows: 40, contentRows: 1 }
const band = { component: 'AbovePrompt', props: { hasSurvey: false, isWorking: false, maxRows: 6, bodyColumns: 100, scroll, view: {} } } as const
const pane = { component: 'Pane', requestId: 'handoff', props: { title: 'Handoff', isFocused: true, bodyColumns: 80, placement: 'dock' as const, scroll, view: {} } } as const
const start = { cwd: '.', surface: 'terminal' as const, isInteractive: true }

describe('helpers', () => {
  test('the prompt carries the target as asked, or asks to infer it', () => {
    expect(handoffPrompt(' api: expose run labels ')).toContain('Target and change, as asked: api: expose run labels')
    expect(handoffPrompt('')).toContain('Infer the target repository')
    expect(handoffPrompt('')).toContain('~~~markdown')
  })

  test('a brief is the last markdown fence holding a Handoff heading', () => {
    expect(findBrief(ANSWER)).toEqual({
      title: 'Expose run labels on the runs API',
      target: 'JSdotNet/ai-agent-stack',
      text: BRIEF,
    })
    expect(findBrief('~~~markdown\n# Notes\n~~~')).toBe(null)
    expect(findBrief('No brief here.')).toBe(null)
  })
})

test('/handoff-to submits the brief prompt once the command returns', async ($, on) => {
  const prompts: string[] = []
  const clock = host(on, [], prompts)
  await $.session.start(start)
  await $.command.run(typed('handoff-to', 'ai-agent-stack: expose run labels'))
  await clock.advance(1)
  expect(prompts[0]).toContain('Target and change, as asked: ai-agent-stack: expose run labels')
})

test('a reply with a brief raises the band; Copy copies it, Dismiss clears it', async ($, on) => {
  const copied: string[] = []
  host(on, copied, [])
  await $.session.start(start)
  await $.turn.complete(turn(ANSWER))
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ plugin: 'claude-desktop-mods', surface, ...band })
    expect((await ui.find({ type: 'Text', text: /Handoff for/ }))?.text).toContain(
      'Handoff for JSdotNet/ai-agent-stack: Expose run labels on the runs API',
    )
    await ui.press({ key: 'copy' })
    await ui.unmount()
  }
  expect(copied).toEqual([BRIEF, BRIEF])
  const ui = await $.ui.mount({ plugin: 'claude-desktop-mods', surface: 'terminal', ...band })
  await ui.press({ key: 'dismiss' })
  expect(await ui.find({ type: 'Text', text: /Handoff for/ })).toBe(undefined)
})

test('a reply without a brief, or a subagent reply, raises nothing', async ($, on) => {
  host(on, [], [])
  await $.session.start(start)
  await $.turn.complete(turn('Done.'))
  await $.turn.complete(turn(ANSWER, 'agent-1'))
  const ui = await $.ui.mount({ plugin: 'claude-desktop-mods', surface: 'terminal', ...band })
  expect(await ui.find({ type: 'Text', text: /Handoff for/ })).toBe(undefined)
})

test('the pane renders the brief, and shows it as text when the clipboard refuses', async ($, on) => {
  const copied: string[] = []
  host(on, copied, [], false)
  await $.session.start(start)
  await $.turn.complete(turn(ANSWER))
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ plugin: 'claude-desktop-mods', surface, ...pane })
    expect((await ui.find({ key: 'brief' }))?.text).toContain('# Handoff — Expose run labels')
    await ui.unmount()
  }
  const ui = await $.ui.mount({ plugin: 'claude-desktop-mods', surface: 'terminal', ...pane })
  await ui.press({ key: 'pane-copy' })
  expect(copied).toEqual([BRIEF])
  expect(await ui.find({ type: 'Text', text: /did not take it/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /npm test/ })).toBeDefined()
})
