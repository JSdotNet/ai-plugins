import { describe, expect, mock, test } from 'claude-code/testing'
import type { On } from 'claude-code'

import { handoffDirOf, matchBrief, parseBrief, pickupText, pressureOf } from '../hooks/handoff-briefs'

const DIR = 'C:/Users/me/.claude/handoffs'
const OLD = '20261001-0900-parked-spike.md'
const NEW = '20261006-1430-dashboard-labels.md'

const brief = (objective: string, from: string, branch: string, reason: string, first = '') =>
  [
    `# Handoff — ${objective}`,
    '',
    '| | |',
    '| --- | --- |',
    '| Handed off | `2026-10-06T14:30Z` |',
    `| Reason | \`${reason}\` |`,
    `| From | \`${from}\` on branch \`${branch}\` |`,
    '| To | `same worktree` |',
    '',
    '## Objective',
    '',
    'Label the dashboard.',
    first,
  ].join('\n')

const NEW_TEXT = brief(
  'Dashboard labels',
  'D:\\Repos\\Copilot\\.claude\\worktrees\\labels-1',
  'claude/labels',
  'context pressure',
  [
    '',
    '## First Message',
    '',
    '```text',
    'Title this session `Dashboard labels`',
    '',
    'Continue work handed off from a previous session.',
    '```',
  ].join('\n'),
)
const OLD_TEXT = brief('Parked spike', '/home/me/repos/api', 'spike/x', 'parked')

function handoffStore(on: On, copied: string[], prompts: string[], percent?: number) {
  mock.env(on, { CLAUDE_HANDOFF_DIR: DIR })
  mock.store(on)
  const clock = mock.clock(on, { now: Date.UTC(2026, 9, 7, 14, 30) })
  on('ui.render', ($, e) => {
    const { Box } = $.ui.resolve(e)
    return <Box />
  })
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('command.register', ($, e) => ({ value: { command: e.name } }))
  on('ui.open', () => ({ value: { isPlaced: true as const } }))
  on('ui.toast', () => ({ value: undefined }))
  on('fs.exists', () => ({ value: true }))
  on('fs.list', () => ({
    value: [OLD, NEW, 'notes.txt'].map(name => ({ name, kind: 'file' as const, size: 1, mtimeMs: 0, isLink: false })),
  }))
  on('fs.read', ($, e) => ({ value: e.path.endsWith(NEW) ? NEW_TEXT : OLD_TEXT }))
  on('ui.copy', ($, e) => {
    copied.push(e.text)
    return { value: { isCopied: true as const } }
  })
  on('prompt.submit', ($, e) => {
    prompts.push(e.text)
    return { text: e.text }
  })
  on('session.usage', () => ({
    value: { startedAt: 0, rateLimits: [], context: { window: 200000, percent } },
  }))
  on('turn.complete', ($, e) => ({ text: e.answer }))
  return clock
}

const PANE = { component: 'Pane', requestId: 'handoffs' } as const
const paneProps = {
  title: 'Handoffs',
  isFocused: true,
  bodyColumns: 60,
  placement: 'dock' as const,
  scroll: { offset: 0, bodyRows: 40, contentRows: 40 },
  view: {},
}
const bandProps = (isWorking = false) => ({
  hasSurvey: false,
  isWorking,
  maxRows: 6,
  bodyColumns: 80,
  scroll: { offset: 0, bodyRows: 6, contentRows: 1 },
  view: {},
})

const typed = (command: string, args = '') => ({
  command,
  args,
  origin: { kind: 'composer' as const },
  presentation: { isFullscreen: true, columns: 160 },
})

const metaRows = async (ui: { findAll: (q: { type: string; text: RegExp }) => Promise<{ text: string }[]> }) =>
  (await ui.findAll({ type: 'Text', text: / ago · / })).map(row => row.text)

const turn = { answer: 'ok', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' as const }

describe('helpers', () => {
  test('pressure bands at 75 and 85', () => {
    expect(pressureOf(null)).toBe(null)
    expect(pressureOf(74)).toBe(null)
    expect(pressureOf(75)).toBe('amber')
    expect(pressureOf(85)).toBe('red')
  })

  test('the store honours CLAUDE_HANDOFF_DIR, then CLAUDE_CONFIG_DIR, then the home folder', () => {
    expect(handoffDirOf({ handoffDir: 'X:/h', configDir: 'C:/c' })).toBe('X:/h')
    expect(handoffDirOf({ configDir: 'C:\\cfg' })).toBe('C:\\cfg\\handoffs')
    expect(handoffDirOf({ home: '/home/me' })).toBe('/home/me/.claude/handoffs')
    expect(handoffDirOf({})).toBe(null)
  })

  test('a brief reads repo, branch, reason and its first message', () => {
    const parsed = parseBrief(`${DIR}/${NEW}`, NEW, NEW_TEXT, 0, new Set())
    expect(parsed).toMatchObject({
      title: 'Dashboard labels',
      sessionTitle: 'Dashboard labels',
      repo: 'Copilot',
      branch: 'claude/labels',
      reason: 'context pressure',
      handedOffAt: Date.UTC(2026, 9, 6, 14, 30),
      isPickedUp: false,
    })
    expect(pickupText(parsed)).toContain('Continue work handed off')
  })

  test('a brief without a first message falls back to one naming its path', () => {
    const parsed = parseBrief(`${DIR}/${OLD}`, OLD, OLD_TEXT, 0, new Set())
    expect(parsed.repo).toBe('api')
    expect(pickupText(parsed)).toContain(`Handoff brief: ${DIR}/${OLD}`)
  })

  test('a first message matches by brief path or by title line', () => {
    const list = [
      parseBrief(`${DIR}/${NEW}`, NEW, NEW_TEXT, 0, new Set()),
      parseBrief(`${DIR}/${OLD}`, OLD, OLD_TEXT, 0, new Set()),
    ]
    expect(matchBrief('Handoff brief: C:\\Users\\me\\.claude\\handoffs\\' + OLD, list)?.file).toBe(OLD)
    expect(matchBrief('Title this session `Dashboard labels`\n\nGo.', list)?.file).toBe(NEW)
    expect(matchBrief('Just a question.', list)).toBe(undefined)
  })
})

test('/handoff submits a prompt invoking the skill with its target', async ($, on) => {
  const prompts: string[] = []
  const clock = handoffStore(on, [], prompts)
  await $.session.start({ cwd: '.', surface: 'terminal', isInteractive: true })
  await $.command.run(typed('handoff', ''))
  await $.command.run(typed('handoff', 'new-worktree'))
  await $.command.run(typed('handoff', 'JSdotNet/ai-agent-stack'))
  await clock.advance(1)
  expect(prompts).toEqual([
    'Run the claude-desktop:session-handoff skill with target `same-worktree`.',
    'Run the claude-desktop:session-handoff skill with target `new-worktree`.',
    'Run the claude-desktop:session-handoff skill with target `JSdotNet/ai-agent-stack`.',
  ])
})

for (const [percent, color] of [[80, 'yellow'], [90, 'red']] as const) {
  test(`the band shows at ${percent}% and its button runs /handoff`, async ($, on) => {
    const prompts: string[] = []
    const clock = handoffStore(on, [], prompts, percent)
    await $.session.start({ cwd: '.', surface: 'terminal', isInteractive: true })
    await $.turn.complete(turn)
    for (const surface of ['terminal', 'desktop'] as const) {
      const ui = await $.ui.mount({ plugin: 'claude-desktop-mods', surface, component: 'AbovePrompt', props: bandProps() })
      const text = await ui.find({ type: 'Text', text: /hand off\?/ })
      expect(text?.text).toContain(`Context ${percent}% — hand off?`)
      expect(text?.props.color).toBe(color)
      await ui.press({ key: 'handoff' })
      await ui.unmount()
    }
    await clock.advance(1)
    expect(prompts[0]).toBe(
      `Run the claude-desktop:session-handoff skill with target \`same-worktree\`. Context is at ${percent}%.`,
    )
  })
}

test('the band hides below 75%', async ($, on) => {
  handoffStore(on, [], [], 60)
  await $.session.start({ cwd: '.', surface: 'terminal', isInteractive: true })
  await $.turn.complete(turn)
  const ui = await $.ui.mount({ plugin: 'claude-desktop-mods', surface: 'terminal', component: 'AbovePrompt', props: bandProps() })
  expect(await ui.find({ type: 'Text', text: /hand off\?/ })).toBe(undefined)
})

test('/handoffs lists briefs newest first, opens one and picks one up', async ($, on) => {
  const copied: string[] = []
  handoffStore(on, copied, [])
  await $.session.start({ cwd: '.', surface: 'terminal', isInteractive: true })
  await $.command.run(typed('handoffs'))
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ plugin: 'claude-desktop-mods', surface, ...PANE, props: paneProps })
    const rows = await metaRows(ui)
    expect(rows[0]).toBe('Copilot · claude/labels · 24h ago · not picked up')
    expect(rows[1]).toBe('api · spike/x · 6d ago · not picked up')
    await ui.press({ key: 'pickup:0' })
    await ui.press({ key: 'open:1' })
    expect((await ui.find({ key: 'brief' }))?.text).toContain('# Handoff — Parked spike')
    await ui.press({ key: 'back' })
    await ui.unmount()
  }
  expect(copied[0]).toBe('Title this session `Dashboard labels`\n\nContinue work handed off from a previous session.')
})

test('a session whose first message carries a brief marks it picked up', async ($, on) => {
  handoffStore(on, [], [])
  await $.session.start({ cwd: '.', surface: 'terminal', isInteractive: true })
  await $.prompt.submit({
    text: 'Title this session `Dashboard labels`\n\nContinue work.',
    origin: { kind: 'composer' },
    wait: false,
  })
  await $.command.run(typed('handoffs'))
  const ui = await $.ui.mount({ plugin: 'claude-desktop-mods', surface: 'terminal', ...PANE, props: paneProps })
  const rows = await metaRows(ui)
  expect(rows[0]).toEndWith(' ago · picked up')
  expect(rows[1]).toEndWith(' ago · not picked up')
})
