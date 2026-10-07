// Claude-only function hooks for cross-repository handoffs: /handoff-to asks for a Markdown
// brief another repository's session can act on, and any reply holding one raises a band
// that copies it or shows it in a pane. Nothing is written to disk; the person decides where
// the brief goes.

import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, RenderSurface } from 'claude-code'

import { findBrief, handoffPrompt } from './handoff-brief'

const PANE = 'handoff'
const SHOWN_MAX = 9000

const brief = atom({ plugin: 'claude-desktop-mods', key: 'brief' } as const, null)
const isCopyRefused = atom({ plugin: 'claude-desktop-mods', key: 'isCopyRefused' } as const, false)

async function copy($: EngineInterface, surface: RenderSurface) {
  const current = await read($, brief)
  if (current === null) return
  const copied = await $.ui.copy({ text: current.text, surface })
  await update($, isCopyRefused, () => !copied.isCopied)
  if (copied.isCopied) {
    $.ui.toast('Handoff brief copied.')
  } else {
    await $.ui.open({ id: PANE, title: 'Handoff' })
  }
}

async function dismiss($: EngineInterface) {
  await update($, brief, () => null)
  await update($, isCopyRefused, () => false)
  await $.ui.close({ id: PANE })
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'handoff-to',
      description: 'Write a Markdown handoff brief for a change in another repository',
      argumentHint: '[repo and what to change]',
    })
    return next(e)
  })

  on('command.run', { command: 'handoff-to' }, async ($, e) => {
    const text = handoffPrompt(e.args ?? '')
    // A command.run hook holds the turn a submit would wait on: submit once it has returned.
    $.clock.after(0, () => void $.prompt.submit({ text, asUser: true }))
    return { text: 'Asking for a handoff brief.' }
  })

  on('turn.complete', async ($, e, next) => {
    const done = await next(e)
    const found = e.agentId === undefined ? findBrief(e.answer) : null
    if (found !== null) {
      await update($, brief, () => found)
      await update($, isCopyRefused, () => false)
    }
    return done
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const current = await read($, brief)
    if (e.props.hasSurvey || current === null) return next(e)
    const { Box, Button, Text } = $.ui.resolve(e)
    return (
      <Box>
        <Text bold wrap="truncate-end">
          Handoff for {current.target}: {current.title}{' '}
        </Text>
        <Button key="copy" label="Copy" variant="primary" onPress={press => void copy($, press.surface)} />
        <Button key="show" label="Show" onPress={() => void $.ui.open({ id: PANE, title: 'Handoff' })} />
        <Button key="dismiss" label="Dismiss" role="dismiss" onPress={() => void dismiss($)} />
      </Box>
    )
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Button, Markdown, Text } = $.ui.resolve(e)
    const current = await read($, brief)
    if (current === null) return <Text dimColor>No handoff brief.</Text>
    const isRefused = await read($, isCopyRefused)
    const shown =
      current.text.length > SHOWN_MAX ? `${current.text.slice(0, SHOWN_MAX)}\n\n…cut here; Copy takes it whole.` : current.text
    return (
      <Box flexDirection="column">
        <Box>
          <Button key="pane-copy" label="Copy" variant="primary" onPress={press => void copy($, press.surface)} />
          <Button key="pane-dismiss" label="Dismiss" onPress={() => void dismiss($)} />
        </Box>
        {isRefused && <Text bold>The clipboard did not take it: select and copy the text below.</Text>}
        {isRefused ? <Text>{current.text}</Text> : <Markdown key="brief" text={shown} />}
      </Box>
    )
  })
}
