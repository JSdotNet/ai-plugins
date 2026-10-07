// Pure logic of the context view: no `$`, so the tests exercise it directly.

import type { ContextViewMdRead, ContextViewReadEvent, ContextViewRule } from '../../types'

export const DEVBOOK_FOLDERS = ['arc42', 'domain', 'tech', 'design', 'ai'] as const

/** Roughly four characters per token: the same rule of thumb /context uses for text it does not count. */
export const estimateTokens = (text: string | undefined): number =>
  text ? Math.ceil(text.length / 4) : 0

/** Forward slashes, no trailing slash, a lower-case drive letter. */
export const normalize = (p: string): string =>
  p.replace(/\\/g, '/').replace(/\/+$/, '').replace(/^([A-Z]):/, (_, d: string) => `${d.toLowerCase()}:`)

const isAbsolute = (p: string): boolean => /^([a-z]:)?\//i.test(p)

/** Resolves `p` against `base` and folds `.` and `..`. */
export const resolvePath = (base: string, p: string): string => {
  const joined = isAbsolute(normalize(p)) ? normalize(p) : `${normalize(base)}/${normalize(p)}`
  const out: string[] = []
  for (const part of joined.split('/')) {
    if (part === '.') continue
    if (part === '..' && out.length > 1) out.pop()
    else out.push(part)
  }
  return out.join('/')
}

/** The path relative to `cwd` when it lies under it, else the normalized absolute path. */
export const relativeTo = (cwd: string, p: string): string => {
  const root = normalize(cwd)
  const abs = resolvePath(root, p)
  const lowerRoot = root.toLowerCase()
  return abs.toLowerCase().startsWith(`${lowerRoot}/`) ? abs.slice(root.length + 1) : abs
}

export const folderOf = (rel: string): string => {
  const at = rel.lastIndexOf('/')
  return at < 0 ? '.' : rel.slice(0, at)
}

export const isMarkdown = (p: string): boolean => /\.(md|mdx|markdown)$/i.test(p)

/** Strips the Read tool's `   12\t` line-number prefixes so the estimate counts the file, not the gutter. */
export const stripLineNumbers = (text: string): string => text.replace(/^ *\d+\t/gm, '')

const READERS = /(^|[\s;|&(])(cat|head|tail|sed|awk|less|more|bat|type|gc|Get-Content|Select-String|nl)(\s|$)/i

/** The Markdown files a shell command reads: a reader verb, then `.md` operands that are no redirect target. */
export const markdownReadByShell = (command: string): string[] => {
  if (!READERS.test(command) || /\bsed\s+(-[a-z]*i|--in-place)/.test(command)) return []
  const tokens = command.match(/"[^"]*"|'[^']*'|[^\s;|&()]+/g) ?? []
  const files: string[] = []
  tokens.forEach((raw, i) => {
    const token = raw.replace(/^['"]|['"]$/g, '').replace(/^-Path[:=]?/i, '')
    const previous = tokens[i - 1] ?? ''
    if (!isMarkdown(token) || /^\d?>>?$/.test(previous) || /^>/.test(raw) || token.includes('*')) return
    if (!files.includes(token)) files.push(token)
  })
  return files
}

/** A minimal glob: `**`, `*`, `?` and `{a,b}`, matched against the whole relative path. */
export const globToRegExp = (glob: string): RegExp => {
  let out = ''
  for (let i = 0; i < glob.length; i++) {
    const c = glob.charAt(i)
    if (c === '*' && glob[i + 1] === '*') {
      const slash = glob[i + 2] === '/'
      out += slash ? '(?:.*/)?' : '.*'
      i += slash ? 2 : 1
    } else if (c === '*') out += '[^/]*'
    else if (c === '?') out += '[^/]'
    else if (c === '{') out += '(?:'
    else if (c === '}') out += ')'
    else if (c === ',') out += '|'
    else out += c.replace(/[.+^$()|[\]\\]/g, '\\$&')
  }
  return new RegExp(`^${out}$`, 'i')
}

/** The `paths:` (or `globs:`) of a rule file's frontmatter; empty when it has none and so loads always. */
export const ruleGlobs = (text: string): string[] => {
  const front = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)?.[1]
  if (!front) return []
  const lines = front.split(/\r?\n/)
  const at = lines.findIndex(l => /^(paths|globs):/.test(l))
  if (at < 0) return []
  const unquote = (s: string) => s.trim().replace(/^['"]|['"]$/g, '')
  const inline = (lines[at] ?? "").replace(/^(paths|globs):/, '').trim()
  if (inline.startsWith('[')) return inline.slice(1, -1).split(',').map(unquote).filter(Boolean)
  if (inline) return inline.split(',').map(unquote).filter(Boolean)
  const globs: string[] = []
  for (const line of lines.slice(at + 1)) {
    const item = /^\s*-\s*(.+)$/.exec(line)
    if (!item) break
    globs.push(unquote(item[1] ?? ""))
  }
  return globs
}

export const ruleMatches = (rule: ContextViewRule, rel: string): boolean =>
  rule.globs.some(g => globToRegExp(g).test(rel))

/** The `@` imports a memory file names, outside code fences, resolved against the file's folder. */
export const memoryImports = (text: string, fileAbs: string): string[] => {
  const prose = text.replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '')
  const found: string[] = []
  for (const m of prose.matchAll(/(?:^|\s)@([^\s@]+)/g)) {
    const target = (m[1] ?? "").replace(/[),.;:]+$/, '')
    if (!/[/.]/.test(target) || target.startsWith('~') || /^[\w.-]+@/.test(target)) continue
    const abs = resolvePath(folderOf(normalize(fileAbs)), target)
    if (!found.includes(abs)) found.push(abs)
  }
  return found
}

export const hasMetaFence = (text: string): boolean => /^ *```meta\s*$/m.test(text)

const slug = (heading: string): string =>
  heading.trim().toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s+/g, '-')

/** Chapter addresses as devbook writes them: the file, plus `#slug` for each heading that carries a meta fence. */
export const chapterAddresses = (rel: string, text: string): string[] => {
  const lines = stripLineNumbers(text).split(/\r?\n/)
  const out: string[] = []
  let heading: { level: number; text: string } | undefined
  for (const line of lines) {
    const h = /^(#{1,6})\s+(.+)$/.exec(line)
    if (h) heading = { level: (h[1] ?? "#").length, text: h[2] ?? "" }
    else if (/^ *```meta\s*$/.test(line))
      out.push(!heading || heading.level === 1 ? rel : `${rel}#${slug(heading.text)}`)
  }
  return [...new Set(out)]
}

export type DevbookPlace = { folder: string; isMeta: boolean }

/** Which devbook folder a read file belongs to, or undefined when it is none of devbook's. */
export const devbookPlace = (rel: string, hasMeta: boolean): DevbookPlace | undefined => {
  const parts = rel.split('/')
  const at = parts.indexOf('.devbook')
  const isMeta = parts.includes('_meta')
  if (at >= 0) {
    const folder = parts[at + 1] ?? ''
    return { folder: (DEVBOOK_FOLDERS as readonly string[]).includes(folder) ? folder : folder || '.devbook', isMeta }
  }
  if (!hasMeta && !isMeta) return undefined
  const known = parts.find(p => (DEVBOOK_FOLDERS as readonly string[]).includes(p))
  return { folder: known ?? 'other', isMeta }
}

/** The devbook folder's root relative to cwd, for counting how much of it there is. */
export const devbookRoot = (rel: string, folder: string): string | undefined => {
  const parts = rel.split('/')
  const at = parts.indexOf(folder)
  return at < 0 ? undefined : parts.slice(0, at + 1).join('/')
}

const MAX_EVENTS = 20
const MAX_OUTLINE = 40

/** The headings of a Markdown text, indented by level, outside code fences; capped. */
export const outlineOf = (text: string): string[] => {
  const out: string[] = []
  let isFenced = false
  for (const line of stripLineNumbers(text).split(/\r?\n/)) {
    if (/^ *```/.test(line)) isFenced = !isFenced
    const h = isFenced ? null : /^(#{1,6})\s+(.+?)\s*#*$/.exec(line)
    if (h) out.push(`${'  '.repeat((h[1] ?? '#').length - 1)}${h[2] ?? ''}`)
    if (out.length >= MAX_OUTLINE) break
  }
  return out
}

/** Appends to a capped history, newest last. */
export const pushEvent = <T>(events: readonly T[] | undefined, event: T): T[] =>
  [...(events ?? []), event].slice(-MAX_EVENTS)

/** Records one read: a new entry, or one more read of a known path. */
export const addRead = (
  reads: readonly ContextViewMdRead[],
  read: Omit<ContextViewMdRead, 'count' | 'events'>,
  event: ContextViewReadEvent,
): ContextViewMdRead[] => {
  const known = reads.find(r => r.path === read.path)
  if (!known) return [...reads, { ...read, count: 1, events: [event] }]
  return reads.map(r =>
    r === known
      ? {
          ...r,
          count: r.count + 1,
          tokens: r.tokens + read.tokens,
          hasMeta: r.hasMeta || read.hasMeta,
          chapters: [...new Set([...r.chapters, ...read.chapters])],
          outline: read.outline.length >= (r.outline?.length ?? 0) ? read.outline : r.outline,
          rules: [...new Set([...(r.rules ?? []), ...read.rules])],
          via: read.via,
          events: pushEvent(r.events, event),
        }
      : r,
  )
}

/** Whether a read of `count` of `total` files in one turn is "most of the folder". */
export const isMostOfFolder = (count: number, total: number): boolean =>
  total >= 3 && count >= 3 && count / total > 0.5

export const formatTokens = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n)

export const statusText = (percent: number | undefined, mdCount: number): string =>
  `ctx ${percent === undefined ? '–' : Math.round(percent)}% · ${mdCount} md`
