// Claude-only function hooks for telling parallel instances apart: a band above the prompt
// with the signed-in account and the weekly usage limit as a bar from green to red. The
// handoff band takes the slot while it holds a brief.

import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, SessionRateLimit } from 'claude-code'

import type { AccountIdentity, AccountWeek } from '../types'

const identity = atom({ plugin: 'claude-desktop-mods', key: 'accountIdentity' } as const, null)
const week = atom({ plugin: 'claude-desktop-mods', key: 'accountWeek' } as const, null)
const brief = atom({ plugin: 'claude-desktop-mods', key: 'brief' } as const, null)

// No reds, ambers or greens: those belong to the usage bar.
const PALETTE = ['#3b82f6', '#8b5cf6', '#06b6d4', '#6366f1', '#a855f7', '#0ea5e9']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function colorFor(email: string): string {
  let hash = 0
  for (const ch of email.toLowerCase()) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return PALETTE[hash % PALETTE.length] ?? '#3b82f6'
}

export function emailFromContext(text: string): string | undefined {
  return text.match(/[\w.+-]+@[\w-]+(\.[\w-]+)+/)?.[0]
}

export function weekFrom(limits: readonly SessionRateLimit[]): AccountWeek | null {
  const found = limits.find(l => l.kind === 'seven_day')
  return found ? { percentUsed: found.percentUsed, resetsAt: found.resetsAt } : null
}

/** Green at 0%, through yellow, to red at 100%. */
export function usageColor(percent: number): string {
  const t = Math.max(0, Math.min(1, percent / 100))
  const r = t < 0.5 ? Math.round(510 * t) : 255
  const g = t < 0.5 ? 200 : Math.round(200 * (2 - 2 * t))
  const hex = (n: number) => n.toString(16).padStart(2, '0')
  return `#${hex(r)}${hex(g)}00`
}

export function formatReset(iso: string | undefined): string {
  if (!iso) return ''
  const at = new Date(iso)
  if (Number.isNaN(at.getTime())) return ''
  const hh = String(at.getHours()).padStart(2, '0')
  const mm = String(at.getMinutes()).padStart(2, '0')
  return `resets ${DAYS[at.getDay()]} ${hh}:${mm}`
}

async function readConfigIdentity($: EngineInterface): Promise<AccountIdentity | null> {
  const dir = (await $.env.get('CLAUDE_CONFIG_DIR')) ?? (await $.env.get('USERPROFILE')) ?? (await $.env.get('HOME'))
  if (!dir) return null
  try {
    const config = JSON.parse(await $.fs.read(`${dir}/.claude.json`)) as { oauthAccount?: { emailAddress?: string } }
    const email = config.oauthAccount?.emailAddress
    return email ? { email } : null
  } catch {
    return null
  }
}

export const register: Register = (on, options) => {
  const label = typeof options.accountLabel === 'string' ? options.accountLabel.trim() : ''
  const custom =
    typeof options.accountColor === 'string' && /^#[0-9a-f]{6}$/i.test(options.accountColor) ? options.accountColor : ''

  // handoff.tsx owns the plugin's one unmatched session.start hook, so the band seeds itself
  // on its first draw: the config file's account and the usage the session already has.
  let isSeeded = false

  // The first message's context carries the account the session is signed in with:
  // the authoritative source, and the one that tells desktop instances apart.
  on('prompt.context', async ($, e, next) => {
    const block = e.blocks.find(b => b.name === 'userEmail')
    const email = block && emailFromContext(block.text)
    const current = await read($, identity)
    if (email && email !== current?.email) await update($, identity, () => ({ email }))
    return next(e)
  })

  on('session.measure', async ($, e, next) => {
    if (e.changed.includes('rateLimits')) {
      const reading = weekFrom(e.rateLimits)
      await update($, week, () => reading)
    }
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey || (await read($, brief)) !== null) return next(e)
    if (!isSeeded) {
      isSeeded = true
      const found = (await read($, identity)) ?? (await readConfigIdentity($))
      if (found) await update($, identity, () => found)
      const reading = weekFrom((await $.session.usage()).rateLimits)
      if (reading && (await read($, week)) === null) await update($, week, () => reading)
    }
    const current = await read($, identity)
    const used = await read($, week)
    if (!current && !label && !used) return next(e)
    const { Box, Text } = $.ui.resolve(e)
    const head = `● ${label || current?.email || ''}`
    const accent = custom || colorFor(current?.email ?? label)
    const detail = used ? `${Math.round(used.percentUsed)}% · ${formatReset(used.resetsAt)}` : 'Weekly · no reading yet'
    const percent = used ? Math.max(0, Math.min(100, used.percentUsed)) : 0
    // The layout sizes the bar, not a character count: each segment grows by its share
    // of the room left and clips an over-long run of blocks to its one row.
    const segment = (grow: number, color: string | undefined, dim: boolean) => (
      <Box flexGrow={grow} flexShrink={1} width={0} height={1} overflow="hidden">
        <Text color={color} dimColor={dim}>{(dim ? '░' : '█').repeat(400)}</Text>
      </Box>
    )
    return (
      <Box flexDirection="row" flexWrap="nowrap" height={1} gap={1}>
        <Box flexShrink={0}>
          <Text color={accent} bold wrap="truncate">{head}</Text>
        </Box>
        <Box flexGrow={1} flexShrink={1} width={0} height={1} flexDirection="row" overflow="hidden">
          {segment(percent, used ? usageColor(percent) : undefined, false)}
          {segment(100 - percent, undefined, true)}
        </Box>
        <Box flexShrink={0}>
          <Text dimColor wrap="truncate">{detail}</Text>
        </Box>
      </Box>
    )
  })
}
