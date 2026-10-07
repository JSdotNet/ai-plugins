// Pure helpers for hooks/handoff.tsx: reading a session-handoff brief and matching a
// session's first message to it. The brief's shape is
// resources/session-handoff-template.md; where briefs live is
// skills/session-handoff/SKILL.md, step 4.

import type { HandoffBrief } from '../types'

export const AMBER = 75
export const RED = 85

export type Pressure = 'amber' | 'red'

/** The band's level for a context fill, or null below the amber threshold. */
export function pressureOf(percent: number | null): Pressure | null {
  if (percent === null) return null
  if (percent >= RED) return 'red'
  if (percent >= AMBER) return 'amber'
  return null
}

export type HandoffEnv = {
  handoffDir?: string
  configDir?: string
  userProfile?: string
  home?: string
}

/** The handoff store: CLAUDE_HANDOFF_DIR, else <CLAUDE_CONFIG_DIR or ~/.claude>/handoffs. */
export function handoffDirOf(env: HandoffEnv): string | null {
  if (env.handoffDir) return env.handoffDir
  if (env.configDir) return join(env.configDir, 'handoffs')
  const home = env.userProfile || env.home
  return home ? join(join(home, '.claude'), 'handoffs') : null
}

export function join(dir: string, name: string): string {
  const sep = dir.includes('\\') && !dir.includes('/') ? '\\' : '/'
  return dir.replace(/[\\/]+$/, '') + sep + name
}

/** `same-worktree` for no argument, else the argument as given. */
export function targetOf(args: string): string {
  const target = args.trim()
  return target === '' ? 'same-worktree' : target
}

export function handoffPrompt(target: string, percent: number | null): string {
  const pressure = percent === null ? '' : ` Context is at ${percent}%.`
  return `Run the claude-desktop:session-handoff skill with target \`${target}\`.${pressure}`
}

const strip = (cell: string) => cell.replace(/`/g, '').trim()

function rows(text: string): Map<string, string> {
  const found = new Map<string, string>()
  for (const line of text.split(/\r?\n/)) {
    const row = /^\|\s*([^|]+?)\s*\|\s*(.*?)\s*\|\s*$/.exec(line)
    if (row && row[1] && row[2] !== undefined) found.set(row[1].toLowerCase(), row[2])
  }
  return found
}

/** The folder name of a repository path; a Claude worktree counts as its repository. */
export function repoOf(path: string): string {
  const parts = path.split(/[\\/]+/).filter(Boolean)
  const claude = parts.lastIndexOf('.claude')
  if (claude > 0 && parts[claude + 1] === 'worktrees') return parts[claude - 1] ?? path
  return parts[parts.length - 1] ?? path
}

function firstMessageOf(text: string): string | null {
  const section = /^## First Message\s*$([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(text)
  const fence = section?.[1] && /^(`{3,})[^\n]*\n([\s\S]*?)\n\1\s*$/m.exec(section[1])
  return fence && fence[2] ? fence[2].trim() : null
}

const TITLE_LINE = /^Title this session\s+`([^`]+)`/m

/** The handed-off time: the file's UTC stamp, else the Handed off row, else the file time. */
function handedOffAtOf(file: string, cell: string | undefined, mtimeMs: number): number {
  const stamp = /^(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})/.exec(file)
  if (stamp) {
    const [, y, mo, d, h, mi] = stamp.map(Number) as number[]
    return Date.UTC(y!, mo! - 1, d!, h!, mi!)
  }
  const parsed = cell ? Date.parse(strip(cell)) : NaN
  return Number.isNaN(parsed) ? mtimeMs : parsed
}

export function parseBrief(
  path: string,
  file: string,
  text: string,
  mtimeMs: number,
  pickedUp: ReadonlySet<string>,
): HandoffBrief {
  const table = rows(text)
  const from = table.get('from') ?? ''
  const fromParts = /`([^`]+)`\s*on branch\s*`([^`]+)`/.exec(from)
  const firstMessage = firstMessageOf(text)
  return {
    path,
    file,
    title: /^#\s+Handoff\s*[—–-]\s*(.+)$/m.exec(text)?.[1]?.trim() ?? file.replace(/\.md$/, ''),
    sessionTitle: (firstMessage && TITLE_LINE.exec(firstMessage)?.[1]?.trim()) || null,
    repo: fromParts?.[1] ? repoOf(fromParts[1]) : strip(from) || 'unknown',
    branch: fromParts?.[2] ?? 'unknown',
    reason: strip(table.get('reason') ?? '') || 'no reason given',
    target: strip(table.get('to') ?? '') || 'unknown',
    handedOffAt: handedOffAtOf(file, table.get('handed off'), mtimeMs),
    firstMessage,
    isPickedUp: pickedUp.has(keyOf(path)),
  }
}

/** The first message to paste: the brief's own, else one that points at the brief. */
export function pickupText(brief: HandoffBrief): string {
  if (brief.firstMessage) return brief.firstMessage
  return [
    `Title this session \`${brief.title}\``,
    '',
    'Continue work handed off from a previous session.',
    '',
    `Handoff brief: ${brief.path}`,
    'Read it first, confirm the state still matches, then say how you intend to continue before changing anything.',
  ].join('\n')
}

/** A path as compared: forward slashes, lower case. */
export function keyOf(path: string): string {
  return path.replace(/\\/g, '/').toLowerCase()
}

/** The brief a session's first message picks up: by its path, or by its title line. */
export function matchBrief(text: string, briefs: readonly HandoffBrief[]): HandoffBrief | undefined {
  const said = keyOf(text)
  const byPath = briefs.find(brief => said.includes(keyOf(brief.path)))
  if (byPath) return byPath
  const title = TITLE_LINE.exec(text)?.[1]?.trim().toLowerCase()
  if (!title) return undefined
  return briefs.find(
    brief => brief.sessionTitle?.toLowerCase() === title || brief.title.toLowerCase() === title,
  )
}

export function ageOf(ms: number): string {
  const minutes = Math.max(0, Math.round(ms / 60000))
  if (minutes < 60) return `${minutes}m`
  const hours = Math.round(minutes / 60)
  return hours < 48 ? `${hours}h` : `${Math.round(hours / 24)}d`
}
