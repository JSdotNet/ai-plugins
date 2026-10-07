// Claude-only function hooks around the session-handoff skill: the /handoff command, a
// context-pressure band above the prompt, and the /handoffs pane over the skill's handoff
// store. The procedure stays in skills/session-handoff/SKILL.md; this module only starts it
// and lists what it wrote. Read-only towards repositories: it reads the handoff store and
// keeps the picked-up marks in the plugin's own store.

import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, RenderSurface } from 'claude-code'

import type { HandoffBrief } from '../types'
import {
  ageOf,
  handoffDirOf,
  handoffPrompt,
  join,
  keyOf,
  matchBrief,
  parseBrief,
  pickupText,
  pressureOf,
  targetOf,
} from './handoff-briefs'

const PANE = 'handoffs'
const PICKED_UP = 'handoff.pickedUp'
const SHOWN_MAX = 9000

const briefs = atom({ plugin: 'claude-desktop', key: 'briefs' } as const, [])
const handoffDir = atom({ plugin: 'claude-desktop', key: 'handoffDir' } as const, '')
const contextPercent = atom({ plugin: 'claude-desktop', key: 'contextPercent' } as const, null)
const opened = atom({ plugin: 'claude-desktop', key: 'opened' } as const, null)
const pickup = atom({ plugin: 'claude-desktop', key: 'pickup' } as const, null)
const hasFirstPrompt = atom({ plugin: 'claude-desktop', key: 'hasFirstPrompt' } as const, false)

async function storeDir($: EngineInterface): Promise<string | null> {
  return handoffDirOf({
    handoffDir: await $.env.get('CLAUDE_HANDOFF_DIR'),
    configDir: await $.env.get('CLAUDE_CONFIG_DIR'),
    userProfile: await $.env.get('USERPROFILE'),
    home: await $.env.get('HOME'),
  })
}

async function pickedUpMarks($: EngineInterface): Promise<Record<string, number>> {
  const marks = await $.store.get(PICKED_UP)
  return marks && typeof marks === 'object' ? (marks as Record<string, number>) : {}
}

/** Reads every brief in the handoff store, newest first. */
async function loadBriefs($: EngineInterface): Promise<{ dir: string; list: HandoffBrief[] }> {
  const dir = await storeDir($)
  if (dir === null || !(await $.fs.exists(dir))) return { dir: dir ?? '', list: [] }
  const marks = new Set(Object.keys(await pickedUpMarks($)))
  const list: HandoffBrief[] = []
  for (const entry of await $.fs.list(dir)) {
    if (entry.kind !== 'file' || !entry.name.endsWith('.md')) continue
    const path = join(dir, entry.name)
    const text = await $.fs.read(path).catch(() => null)
    if (typeof text === 'string') list.push(parseBrief(path, entry.name, text, entry.mtimeMs, marks))
  }
  return { dir, list: list.sort((a, b) => b.handedOffAt - a.handedOffAt) }
}

async function refresh($: EngineInterface): Promise<void> {
  const { dir, list } = await loadBriefs($)
  await update($, handoffDir, () => dir)
  await update($, briefs, () => list)
}

async function refreshPercent($: EngineInterface): Promise<void> {
  const { context } = await $.session.usage()
  await update($, contextPercent, () => context.percent ?? null)
}

async function pickUp($: EngineInterface, brief: HandoffBrief, surface: RenderSurface) {
  const text = pickupText(brief)
  const copied = await $.ui.copy({ text, surface })
  if (copied.isCopied) {
    await update($, pickup, () => null)
    $.ui.toast('First message copied: paste it into a new session.')
  } else {
    await update($, pickup, () => ({ path: brief.path, text }))
  }
}

async function open($: EngineInterface, brief: HandoffBrief) {
  const text = await $.fs.read(brief.path).catch(() => 'The brief could not be read.')
  const shown = typeof text === 'string' ? text : 'The brief is not text.'
  await update($, opened, () => ({
    path: brief.path,
    text: shown.length > SHOWN_MAX ? `${shown.slice(0, SHOWN_MAX)}\n\n…cut; open ${brief.path} for the rest.` : shown,
  }))
}

/** What /handoff does: submit the prompt that runs the session-handoff skill. */
async function handOff($: EngineInterface, args: string): Promise<string> {
  const target = targetOf(args)
  const text = handoffPrompt(target, await read($, contextPercent))
  // The command or press holds the turn a submit would wait on: submit once it has returned.
  $.clock.after(0, () => void $.prompt.submit({ text, asUser: true }))
  return `Handing off to ${target}.`
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'handoff',
      description: 'Hand this session off with the session-handoff skill',
      argumentHint: '[same-worktree|new-worktree|<repo>]',
    })
    await $.command.register({
      name: 'handoffs',
      description: 'List the handoff briefs and pick one up',
    })
    return next(e)
  })

  on('command.run', { command: 'handoff' }, async ($, e) => ({ text: await handOff($, e.args ?? '') }))

  on('command.run', { command: 'handoffs' }, async $ => {
    await refresh($)
    await $.ui.open({ id: PANE, title: 'Handoffs' })
    return { text: 'Handoffs pane opened.' }
  })

  on('turn.complete', async ($, e, next) => {
    const done = await next(e)
    if (e.agentId === undefined) await refreshPercent($).catch(() => undefined)
    return done
  })

  on('session.compact', async ($, e, next) => {
    const done = await next(e)
    await refreshPercent($).catch(() => undefined)
    return done
  })

  on('session.end', async ($, e, next) => {
    if (e.reason === 'clear') {
      await update($, contextPercent, () => null)
      await update($, hasFirstPrompt, () => false)
    }
    return next(e)
  })

  on('prompt.submit', async ($, e, next) => {
    if (e.origin?.kind !== 'plugin' && !(await read($, hasFirstPrompt))) {
      await update($, hasFirstPrompt, () => true)
      try {
        const brief = matchBrief(e.text, (await loadBriefs($)).list)
        if (brief) {
          const marks = await pickedUpMarks($)
          await $.store.set(PICKED_UP, { ...marks, [keyOf(brief.path)]: await $.clock.now() })
          await update($, briefs, list =>
            list.map(one => (one.path === brief.path ? { ...one, isPickedUp: true } : one)),
          )
        }
      } catch {
        // A missing or unreadable store leaves the brief unmarked; the prompt goes on.
      }
    }
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const percent = await read($, contextPercent)
    const level = pressureOf(percent)
    if (e.props.hasSurvey || level === null) return next(e)
    const { Box, Button, Text } = $.ui.resolve(e)
    return (
      <Box>
        <Text bold color={level === 'red' ? 'red' : 'yellow'}>
          Context {percent}% — hand off?{' '}
        </Text>
        <Button
          key="handoff"
          label="/handoff"
          variant={level === 'red' ? 'primary' : 'secondary'}
          onPress={() => void handOff($, '')}
        />
      </Box>
    )
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Button, Markdown, Text } = $.ui.resolve(e)
    const shown = await read($, opened)
    if (shown !== null) {
      return (
        <Box flexDirection="column">
          <Box>
            <Button key="back" label="Back" onPress={() => void update($, opened, () => null)} />
            <Text dimColor wrap="truncate-start"> {shown.path}</Text>
          </Box>
          <Markdown key="brief" text={shown.text} />
        </Box>
      )
    }

    const list = await read($, briefs)
    const dir = await read($, handoffDir)
    const copy = await read($, pickup)
    const now = await $.clock.now()
    return (
      <Box flexDirection="column">
        <Box>
          <Button key="refresh" label="Refresh" onPress={() => void refresh($)} />
          <Text dimColor wrap="truncate-start"> {dir || 'no handoff store'}</Text>
        </Box>
        {copy !== null && (
          <Box flexDirection="column">
            <Text bold>The clipboard did not take it: copy this first message.</Text>
            <Text>{copy.text}</Text>
            <Button key="pickup-done" label="Done" onPress={() => void update($, pickup, () => null)} />
          </Box>
        )}
        {list.length === 0 && <Text dimColor>No handoff briefs.</Text>}
        {list.map((brief, i) => (
          <Box key={`brief:${i}`} flexDirection="column">
            <Text bold wrap="truncate-end">{brief.title}</Text>
            <Text dimColor wrap="truncate-end">
              {brief.repo} · {brief.branch} · {ageOf(now - brief.handedOffAt)} ago ·{' '}
              {brief.isPickedUp ? 'picked up' : 'not picked up'}
            </Text>
            <Text dimColor wrap="truncate-end">{brief.reason}</Text>
            <Box>
              <Button key={`open:${i}`} label="Open" onPress={() => void open($, brief)} />
              <Button
                key={`pickup:${i}`}
                label="Pick up"
                variant="primary"
                onPress={press => void pickUp($, brief, press.surface)}
              />
            </Box>
          </Box>
        ))}
      </Box>
    )
  })
}
