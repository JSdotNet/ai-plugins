// The context-view pane as element trees, per the "Context View Redesign" canvas: a meter
// with a stacked category bar, a warning banner, foldable sections of focusable rows, and
// zoom pages with a breadcrumb back. Every row is a plain Button, so Tab and the arrows walk
// the rows and Enter zooms; drawn from Box, Text and Button, which every surface has.

import type { BoxProps, ButtonProps, ElementConstructor, TextProps } from 'claude-code'

import type { ContextViewMdRead } from '../../types'
import { devbookPlace, devbookRoot, formatTokens } from './model'
import { clip, detail, mergedInstructions } from './view'
import type { ViewData } from './view'

export type Els = {
  Box: ElementConstructor<BoxProps>
  Text: ElementConstructor<TextProps>
  Button: ElementConstructor<ButtonProps>
  Markdown?: ElementConstructor<{ key?: string; text: string }>
}

export type PaneData = ViewData & {
  turn: number
  folded: Readonly<Record<string, boolean>>
  folderSizes: Readonly<Record<string, number>>
  columns: number
}

export type Actions = {
  zoom: (value: string) => void
  back: () => void
  toggle: (section: string) => void
}

export const COLORS = {
  blue: '#7AA7FF',
  teal: '#4CC9B0',
  violet: '#B79CFF',
  amber: '#F0A848',
  pink: '#E7769A',
  light: '#C9CED8',
  track: '#3A3F4A',
} as const

const PALETTE = [COLORS.blue, COLORS.teal, COLORS.violet, COLORS.amber, COLORS.pink, COLORS.light]
const KIND_COLOR: Record<string, string> = {
  memory: COLORS.blue,
  rule: COLORS.teal,
  'output-style': COLORS.violet,
  hook: COLORS.pink,
  skill: COLORS.amber,
  agent: COLORS.light,
}
const KIND_LABEL: Record<string, string> = { 'output-style': 'style' }
const MAX_ROWS = 10

const sum = <T,>(list: readonly T[], f: (x: T) => number) => list.reduce((n, x) => n + f(x), 0)
const fit = (s: string, n: number) => (s.length <= n ? s.padEnd(n) : `${s.slice(0, Math.max(0, n - 1))}…`)

/** A share bar of `width` cells: filled in `color`, the rest a dim track. */
export const shareBar = (share: number, width: number): [string, string] => {
  const filled = Math.max(share > 0 ? 1 : 0, Math.min(width, Math.round(share * width)))
  return ['━'.repeat(filled), '─'.repeat(width - filled)]
}

const clock = (at: number, startedAt: number): string => {
  const s = Math.max(0, Math.round((at - startedAt) / 1000))
  return s < 60 ? `+${s}s` : s < 3600 ? `+${Math.floor(s / 60)}m${String(s % 60).padStart(2, '0')}s` : `+${Math.floor(s / 3600)}h${Math.floor((s % 3600) / 60)}m`
}

type Segment = { name: string; tokens: number; color: string }

/** The window's used categories, or tool results by tool where the engine gives no breakdown. */
export const segments = (d: ViewData): { items: Segment[]; isDerived: boolean } => {
  const categories = (d.usage?.context.breakdown?.categories ?? []).filter(c => c.kind === 'used' && c.tokens > 0)
  if (categories.length > 0)
    return { items: categories.map((c, i) => ({ name: c.name, tokens: c.tokens, color: PALETTE[i % PALETTE.length]! })), isDerived: false }
  const tools = Object.entries(d.byTool).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, 6)
  return { items: tools.map(([name, tokens], i) => ({ name: `${name} results`, tokens, color: PALETTE[i % PALETTE.length]! })), isDerived: true }
}

type Folder = { folder: string; root?: string; files: ContextViewMdRead[]; warned: boolean }

const devbookFolders = (d: ViewData): Folder[] => {
  const map = new Map<string, ContextViewMdRead[]>()
  for (const r of d.reads) {
    const place = devbookPlace(r.path, r.hasMeta)
    if (place && !place.isMeta) map.set(place.folder, [...(map.get(place.folder) ?? []), r])
  }
  return [...map].sort((a, b) => a[0].localeCompare(b[0])).map(([folder, files]) => {
    const root = files[0] ? devbookRoot(files[0].path, folder) : undefined
    return { folder, root, files, warned: d.warnings.some(w => (root ? w.includes(`\`${root}\``) || w.includes(`${root}/`) : false)) }
  })
}

// ------------------------------------------------------------------ pieces

const Breadcrumb = (els: Els, a: Actions, trail: string[]) => {
  const { Box, Text, Button } = els
  return (
    <Box key="crumb" flexDirection="row" gap={1}>
      <Button key="back" plain hotkey="b" autoFocus onPress={() => a.back()}>
        ← CONTEXT
      </Button>
      <Text dimColor wrap="truncate-start">
        {trail.map(t => `› ${t}`).join(' ')}
      </Text>
    </Box>
  )
}

const SectionHeader = (els: Els, a: Actions, d: PaneData, id: string, title: string, count: string, total: string) => {
  const { Box, Text, Button } = els
  return (
    <Box key={`head-${id}`} flexDirection="row" justifyContent="space-between">
      <Box flexDirection="row" gap={1}>
        <Button key={`fold:${id}`} plain onPress={() => a.toggle(id)}>
          {`${d.folded[id] ? '▸' : '▾'} ${title}`}
        </Button>
        <Text dimColor>· {count}</Text>
      </Box>
      <Text dimColor>{total}</Text>
    </Box>
  )
}

const Row = (els: Els, a: Actions, o: { key: string; tag?: [string, string]; label: string; why?: string; share: number; tokens: string; badge?: string; indent?: number }) => {
  const { Box, Text, Button } = els
  const [filled, track] = shareBar(o.share, 10)
  return (
    <Box key={`row-${o.key}`} flexDirection="row" gap={1} paddingLeft={o.indent ?? 0}>
      {o.tag ? <Text color={o.tag[1]}>{fit(o.tag[0], 6)}</Text> : null}
      <Box flexDirection="row" flexGrow={1} flexShrink={1} gap={1} overflow="hidden">
        <Button key={`zoom:${o.key}`} plain onPress={() => a.zoom(o.key)}>
          {o.label}
        </Button>
        {o.badge ? <Text color={COLORS.amber}>{o.badge}</Text> : null}
        {o.why ? (
          <Text dimColor wrap="truncate-end">
            {o.why}
          </Text>
        ) : null}
      </Box>
      <Text>
        <Text color={o.tag?.[1] ?? COLORS.light}>{filled}</Text>
        <Text color={COLORS.track}>{track}</Text>
      </Text>
      <Text bold>{o.tokens.padStart(6)}</Text>
    </Box>
  )
}

// ------------------------------------------------------------------ overview

const Meter = (els: Els, d: PaneData) => {
  const { Box, Text } = els
  const ctx = d.usage?.context
  const b = ctx?.breakdown
  const limit = b?.rawMaxTokens ?? ctx?.window ?? 0
  const used = b?.totalTokens ?? ctx?.tokens
  const pct = b?.percentage ?? ctx?.percent ?? (used !== undefined && limit ? (used / limit) * 100 : undefined)
  const compact = b?.autoCompactThreshold
  const width = Math.max(20, d.columns - 2)
  const { items, isDerived } = segments(d)
  const cells = (n: number) => (limit ? Math.round((n / limit) * width) : 0)
  const segs = items.map(s => ({ ...s, cells: Math.max(1, cells(s.tokens)) }))
  const usedCells = sum(segs, s => s.cells)
  const bufferCells = compact && limit ? Math.max(0, width - cells(compact)) : 0
  const freeCells = Math.max(0, width - usedCells - bufferCells)
  const ticks = Array.from({ length: width }, () => ' ')
  if (limit && d.peak) ticks[Math.min(width - 1, cells(d.peak))] = '▲'
  const compactAt = compact && limit ? Math.min(width - 1, cells(compact)) : undefined
  return (
    <Box key="meter" flexDirection="column">
      <Box flexDirection="row" justifyContent="space-between">
        <Text>
          <Text bold>{used === undefined ? '—' : formatTokens(used)}</Text>
          <Text dimColor> / {limit ? formatTokens(limit) : '?'} tokens</Text>
        </Text>
        <Text dimColor>
          <Text bold>{pct === undefined ? '–' : Math.round(pct)}%</Text> used · peak <Text bold>{formatTokens(d.peak)}</Text>
          {compact ? ' · compacts at ' : ''}
          {compact ? <Text bold color={COLORS.amber}>{formatTokens(compact)}</Text> : null}
        </Text>
      </Box>
      <Text>
        {segs.map(s => (
          <Text color={s.color}>{'█'.repeat(s.cells)}</Text>
        ))}
        <Text color={COLORS.track}>{'█'.repeat(freeCells)}</Text>
        <Text color={COLORS.track}>{'▒'.repeat(bufferCells)}</Text>
      </Text>
      <Text>
        <Text>{ticks.slice(0, compactAt ?? width).join('')}</Text>
        {compactAt !== undefined ? <Text color={COLORS.amber}>{`▲${ticks.slice(compactAt + 1).join('')}`}</Text> : null}
      </Text>
      <Box flexDirection="row" flexWrap="wrap" columnGap={2}>
        {segs.map(s => (
          <Box key={`legend-${s.name}`} flexDirection="row" gap={1} width={Math.max(18, Math.floor((d.columns - 4) / 3))}>
            <Text color={s.color}>■</Text>
            <Text dimColor wrap="truncate-end">
              {s.name}
            </Text>
            <Text bold>{formatTokens(s.tokens)}</Text>
          </Box>
        ))}
      </Box>
      {isDerived && segs.length > 0 ? <Text dimColor>Tool results by tool: the engine has not itemized this window yet.</Text> : null}
    </Box>
  )
}

const Banner = (els: Els, a: Actions, d: PaneData, folders: Folder[]) => {
  const { Box, Text, Button } = els
  if (d.warnings.length === 0) return null
  const first = d.warnings[d.warnings.length - 1] ?? ''
  const target = folders.find(f => f.warned) ?? folders[0]
  return (
    <Box key="banner" flexDirection="row" gap={1} borderStyle="round" borderColor={COLORS.amber} paddingX={1}>
      <Text bold color={COLORS.amber}>
        !
      </Text>
      <Box flexDirection="column" flexGrow={1} flexShrink={1}>
        <Text bold color={COLORS.amber}>
          {d.warnings.length} devbook warning{d.warnings.length > 1 ? 's' : ''}
        </Text>
        <Text dimColor wrap="truncate-end">
          {first.replace(/`/g, '')}
        </Text>
      </Box>
      {target ? (
        <Button key="banner-view" plain onPress={() => a.zoom(`db:${target.folder}`)}>
          ⏎ view
        </Button>
      ) : null}
    </Box>
  )
}

const Instructions = (els: Els, a: Actions, d: PaneData) => {
  const { Box, Text, Button } = els
  const list = mergedInstructions(d)
  const max = Math.max(1, ...list.map(i => i.tokens))
  const isAll = d.folded['instructions-all'] === true
  const shown = isAll ? list : list.slice(0, MAX_ROWS)
  const hidden = list.slice(shown.length)
  return (
    <Box key="instructions" flexDirection="column">
      {SectionHeader(els, a, d, 'instructions', 'INSTRUCTIONS', `${list.length} sources`, `~${formatTokens(sum(list, i => i.tokens))}`)}
      {d.folded.instructions ? null : (
        <Box flexDirection="column">
          {list.length === 0 ? <Text dimColor>None seen yet.</Text> : null}
          {shown.map(i =>
            Row(els, a, {
              key: `in:${i.kind}:${i.name}`,
              tag: [KIND_LABEL[i.kind] ?? i.kind, KIND_COLOR[i.kind] ?? COLORS.light],
              label: i.name,
              why: i.detail,
              share: i.tokens / max,
              tokens: formatTokens(i.tokens),
            }),
          )}
          {hidden.length > 0 || isAll ? (
            <Button key="instructions-more" plain dimColor onPress={() => a.toggle('instructions-all')}>
              {isAll ? '− show fewer' : `+ ${hidden.length} more · ~${formatTokens(sum(hidden, i => i.tokens))}`}
            </Button>
          ) : null}
        </Box>
      )}
    </Box>
  )
}

const MarkdownRead = (els: Els, a: Actions, d: PaneData) => {
  const { Box, Text } = els
  const folders = new Map<string, ContextViewMdRead[]>()
  for (const r of d.reads) folders.set(r.folder, [...(folders.get(r.folder) ?? []), r])
  const sorted = [...folders].sort((x, y) => sum(y[1], r => r.tokens) - sum(x[1], r => r.tokens))
  const max = Math.max(1, ...d.reads.map(r => r.tokens))
  return (
    <Box key="markdown" flexDirection="column">
      {SectionHeader(els, a, d, 'markdown', 'MARKDOWN READ', `${d.reads.length} files`, `~${formatTokens(sum(d.reads, r => r.tokens))}`)}
      {d.folded.markdown ? null : (
        <Box flexDirection="column">
          {d.reads.length === 0 ? <Text dimColor>No Markdown read yet.</Text> : null}
          {sorted.map(([folder, files]) => (
            <Box key={`folder-${folder}`} flexDirection="column">
              <Box flexDirection="row" justifyContent="space-between">
                <Text dimColor>{`▾ ${folder === '.' ? './' : `${folder}/`}`}</Text>
                <Text dimColor>{formatTokens(sum(files, r => r.tokens))}</Text>
              </Box>
              {[...files]
                .sort((x, y) => y.tokens - x.tokens)
                .map(r =>
                  Row(els, a, {
                    key: `md:${r.path}`,
                    label: folder === '.' ? r.path : r.path.slice(folder.length + 1),
                    ...(r.count > 1 ? { badge: `×${r.count}` } : {}),
                    share: r.tokens / max,
                    tokens: formatTokens(r.tokens),
                    indent: 2,
                  }),
                )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

const Devbook = (els: Els, a: Actions, d: PaneData, folders: Folder[]) => {
  const { Box, Text, Button } = els
  if (folders.length === 0) return null
  const all = folders.flatMap(f => f.files)
  return (
    <Box key="devbook" flexDirection="column">
      {SectionHeader(els, a, d, 'devbook', 'DEVBOOK', `${folders.length} folder${folders.length > 1 ? 's' : ''}`, `~${formatTokens(sum(all, r => r.tokens))}`)}
      {d.folded.devbook ? null : (
        <Box flexDirection="row" flexWrap="wrap" gap={1}>
          {folders.map(f => {
            const size = Math.max(f.files.length, (f.root ? d.folderSizes[f.root] : undefined) ?? f.files.length)
            const chapters = new Set(f.files.flatMap(r => r.chapters)).size
            return (
              <Box
                key={`db-${f.folder}`}
                flexDirection="column"
                borderStyle="round"
                borderColor={f.warned ? COLORS.amber : COLORS.track}
                paddingX={1}
                flexGrow={1}
                minWidth={28}
              >
                <Box flexDirection="row" justifyContent="space-between" gap={1}>
                  <Button key={`zoom:db:${f.folder}`} plain onPress={() => a.zoom(`db:${f.folder}`)}>
                    {f.folder}
                  </Button>
                  <Text color={f.warned ? COLORS.amber : undefined} dimColor={!f.warned}>
                    {`${f.files.length} of ${size}${f.warned ? ' · whole folder' : ` · ${chapters} chapters`}`}
                  </Text>
                </Box>
                <Text>
                  <Text color={f.warned ? COLORS.amber : COLORS.light}>{'■'.repeat(f.files.length)}</Text>
                  <Text color={COLORS.track}>{'□'.repeat(Math.min(60, size - f.files.length))}</Text>
                </Text>
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

const Footer = (els: Els, d: PaneData, keys: string) => {
  const { Box, Text } = els
  const pct = d.usage?.context.percent
  return (
    <Box key="footer" flexDirection="row" justifyContent="space-between">
      <Text dimColor>{keys}</Text>
      <Text dimColor>{`ctx ${pct === undefined ? '–' : Math.round(pct)}% · ${d.reads.length} md`}</Text>
    </Box>
  )
}

export const Overview = (els: Els, a: Actions, d: PaneData) => {
  const { Box, Text } = els
  const folders = devbookFolders(d)
  const model = d.usage?.context.breakdown?.model
  return (
    <Box flexDirection="column" gap={1}>
      <Box key="title" flexDirection="row" gap={1}>
        <Text bold>CONTEXT</Text>
        <Text dimColor>{[model, d.turn ? `turn ${d.turn}` : undefined].filter(Boolean).join(' · ')}</Text>
      </Box>
      {Meter(els, d)}
      {Banner(els, a, d, folders)}
      {Instructions(els, a, d)}
      {MarkdownRead(els, a, d)}
      {Devbook(els, a, d, folders)}
      {Footer(els, d, 'tab ↑↓ move · ⏎ zoom · ⏎ on a heading folds')}
    </Box>
  )
}

// ------------------------------------------------------------------ zoom pages

const Tile = (els: Els, label: string, value: string, isWarn = false) => {
  const { Box, Text } = els
  return (
    <Box key={`tile-${label}`} flexDirection="column" borderStyle="round" borderColor={isWarn ? COLORS.amber : COLORS.track} paddingX={1} flexGrow={1}>
      <Text dimColor>{label}</Text>
      <Text bold color={isWarn ? COLORS.amber : undefined}>
        {value}
      </Text>
    </Box>
  )
}

const ColumnHead = (els: Els, title: string, hint?: string) => {
  const { Box, Text } = els
  return (
    <Box key={`colhead-${title}`} flexDirection="row" justifyContent="space-between">
      <Text bold>{title}</Text>
      {hint ? <Text dimColor>{hint}</Text> : null}
    </Box>
  )
}

const Outline = (els: Els, outline: readonly string[] | undefined) => {
  const { Box, Text } = els
  if (!outline || outline.length === 0) return null
  return (
    <Box key="outline" flexDirection="column">
      {ColumnHead(els, 'OUTLINE', 'the headings the model now holds')}
      {outline.map((line, i) => {
        const depth = (line.length - line.trimStart().length) / 2
        return (
          <Text key={`o-${i}`}>
            <Text dimColor>{`${'  '.repeat(depth)}${'#'.repeat(depth + 1)} `}</Text>
            <Text dimColor={depth > 1}>{line.trim()}</Text>
          </Text>
        )
      })}
    </Box>
  )
}

const MdPage = (els: Els, a: Actions, d: PaneData, path: string) => {
  const { Box, Text } = els
  const r = d.reads.find(x => x.path === path)
  if (!r) return undefined
  const events = r.events ?? []
  const first = events[0]?.tokens ?? r.tokens
  const repeated = Math.max(0, r.tokens - first)
  const limit = d.usage?.context.breakdown?.rawMaxTokens ?? d.usage?.context.window
  const total = sum(d.reads, x => x.tokens)
  const lines = Math.max(1, ...events.map(e => (e.from ?? 1) - 1 + (e.lines ?? 0)))
  const name = r.path.split('/').pop() ?? r.path
  const place = devbookPlace(r.path, r.hasMeta)
  const W = 24
  return (
    <Box flexDirection="column" gap={1}>
      {Breadcrumb(els, a, ['Markdown read', r.path])}
      <Box key="title" flexDirection="row" justifyContent="space-between">
        <Box flexDirection="column">
          <Text bold>{name}</Text>
          <Text dimColor>{[`${r.folder}/`, place ? 'devbook chapter file' : undefined, r.hasMeta ? 'carries meta fences' : undefined].filter(Boolean).join(' · ')}</Text>
        </Box>
        <Box flexDirection="column" alignItems="flex-end">
          <Text bold>~{formatTokens(r.tokens)}</Text>
          <Text dimColor>{`tokens over ${r.count} read${r.count > 1 ? 's' : ''}`}</Text>
        </Box>
      </Box>
      <Box key="tiles" flexDirection="row" gap={1}>
        {Tile(els, 'share of window', limit ? `${((r.tokens / limit) * 100).toFixed(1)}%` : '–')}
        {Tile(els, 'of Markdown read', total ? `${Math.round((r.tokens / total) * 100)}%` : '–')}
        {Tile(els, 'read again', repeated > 0 ? `+${formatTokens(repeated)} paid again` : 'no', repeated > 0)}
        {Tile(els, 'rules fired', String(r.rules?.length ?? 0))}
      </Box>
      <Box key="reads" flexDirection="column">
        {ColumnHead(els, 'READS', 'when · turn · via · lines covered')}
        {events.map((e, i) => {
          const from = e.from ?? 1
          const start = Math.round(((from - 1) / lines) * W)
          const span = Math.max(1, Math.round(((e.lines ?? lines) / lines) * W))
          return (
            <Box key={`read-${i}`} flexDirection="row" gap={1}>
              <Text dimColor>{fit(clock(e.at, d.startedAt), 8)}</Text>
              <Text>{fit(`turn ${e.turn}`, 8)}</Text>
              <Text color={COLORS.teal}>{fit(e.via, 10)}</Text>
              <Text>
                <Text color={COLORS.track}>{'─'.repeat(start)}</Text>
                <Text color={COLORS.light}>{'━'.repeat(Math.min(span, W - start))}</Text>
                <Text color={COLORS.track}>{'─'.repeat(Math.max(0, W - start - span))}</Text>
              </Text>
              <Text dimColor>{e.range ?? 'whole file'}</Text>
              <Box flexGrow={1} />
              <Text bold>{formatTokens(e.tokens).padStart(6)}</Text>
            </Box>
          )
        })}
      </Box>
      <Box key="cols" flexDirection="row" gap={3}>
        <Box flexDirection="column" width="50%">
          {ColumnHead(els, 'RULES THIS READ FIRED')}
          {(r.rules ?? []).length === 0 ? <Text dimColor>none</Text> : null}
          {(r.rules ?? []).map(rule => (
            <Text key={`rule-${rule}`} wrap="truncate-end">
              <Text color={COLORS.teal}>rule </Text>
              {rule.split('/').pop()}
            </Text>
          ))}
        </Box>
        <Box flexDirection="column" width="50%">
          {ColumnHead(els, 'CHAPTERS')}
          {r.chapters.filter(c => c.includes('#')).length === 0 ? <Text dimColor>{r.hasMeta ? 'the file itself' : 'not a devbook chapter'}</Text> : null}
          {r.chapters
            .filter(c => c.includes('#'))
            .map(c => (
              <Text key={`ch-${c}`} wrap="truncate-end">
                {c.slice(c.indexOf('#'))}
              </Text>
            ))}
        </Box>
      </Box>
      {Outline(els, r.outline)}
      {Footer(els, d, 'b back · tab ↑↓ move')}
    </Box>
  )
}

const DevbookPage = (els: Els, a: Actions, d: PaneData, folder: string) => {
  const { Box, Text, Button } = els
  const f = devbookFolders(d).find(x => x.folder === folder)
  if (!f) return undefined
  const metaReads = d.reads.filter(r => devbookPlace(r.path, r.hasMeta)?.isMeta && f.root && r.path.startsWith(`${f.root}/`))
  const rows = [...f.files, ...metaReads]
  const notes = d.warnings.filter(w => (f.root ? w.includes(f.root) : false))
  const last = Math.max(d.turn, ...rows.flatMap(r => (r.events ?? []).map(e => e.turn)))
  const first = Math.max(1, last - 11)
  const turns = Array.from({ length: Math.max(1, last - first + 1) }, (_, i) => first + i)
  const nameWidth = Math.min(28, Math.max(8, ...rows.map(r => r.path.length - (f.root?.length ?? 0))))
  return (
    <Box flexDirection="column" gap={1}>
      {Breadcrumb(els, a, ['Devbook', f.root ?? folder])}
      <Box key="title" flexDirection="row" justifyContent="space-between">
        <Box flexDirection="column">
          <Text bold>{folder}</Text>
          <Text dimColor>{`${f.files.length} chapter file${f.files.length > 1 ? 's' : ''} read${metaReads.length ? ` · ${metaReads.length} derived index` : ''}`}</Text>
        </Box>
        <Box flexDirection="column" alignItems="flex-end">
          <Text bold>~{formatTokens(sum(rows, r => r.tokens))}</Text>
          <Text dimColor>tokens loaded</Text>
        </Box>
      </Box>
      {notes.map((w, i) => (
        <Box key={`warn-${i}`} borderStyle="round" borderColor={COLORS.amber} paddingX={1}>
          <Text color={COLORS.amber}>{w.replace(/`/g, '')}</Text>
        </Box>
      ))}
      <Box key="coverage" flexDirection="column">
        {ColumnHead(els, 'COVERAGE BY TURN', '■ read that turn')}
        <Text dimColor>{`${' '.repeat(nameWidth)} ${turns.map(t => String(t).padStart(3)).join('')}`}</Text>
        {rows.map(r => {
          const hit = new Set((r.events ?? []).map(e => e.turn))
          const isMeta = devbookPlace(r.path, r.hasMeta)?.isMeta === true
          return (
            <Text key={`cov-${r.path}`}>
              <Text color={isMeta ? COLORS.amber : undefined}>{fit(r.path.slice((f.root?.length ?? -1) + 1), nameWidth)} </Text>
              {turns.map(t => (
                <Text color={hit.has(t) ? (isMeta || f.warned ? COLORS.amber : COLORS.light) : COLORS.track}>{hit.has(t) ? '  ■' : '  ·'}</Text>
              ))}
            </Text>
          )
        })}
      </Box>
      <Box key="chapters" flexDirection="column">
        {ColumnHead(els, 'CHAPTERS LOADED', `${new Set(f.files.flatMap(r => r.chapters)).size} addresses`)}
        {f.files.map(r => (
          <Box key={`file-${r.path}`} flexDirection="column">
            <Box flexDirection="row" justifyContent="space-between">
              <Button key={`zoom:md:${r.path}`} plain onPress={() => a.zoom(`md:${r.path}`)}>
                {r.path.slice((f.root?.length ?? -1) + 1)}
              </Button>
              <Text dimColor>{`${formatTokens(r.tokens)}${r.count > 1 ? ` ×${r.count}` : ''}`}</Text>
            </Box>
            <Text dimColor wrap="wrap">
              {r.chapters
                .filter(c => c.includes('#'))
                .map(c => c.slice(c.indexOf('#')))
                .join('  ')}
            </Text>
          </Box>
        ))}
      </Box>
      {Footer(els, d, 'b back · tab ↑↓ move · ⏎ zoom a file')}
    </Box>
  )
}

/** A zoom page: the designed pages for a file and a devbook folder, the Markdown detail for the rest. */
export const Zoom = (els: Els, a: Actions, d: PaneData, focus: string) => {
  const { Box } = els
  const at = focus.indexOf(':')
  const kind = focus.slice(0, at)
  const rest = focus.slice(at + 1)
  if (kind === 'md') return MdPage(els, a, d, rest)
  if (kind === 'db') return DevbookPage(els, a, d, rest)
  const page = detail(d, focus)
  if (page === undefined || !els.Markdown) return undefined
  const { Markdown } = els
  const trail = kind === 'in' ? ['Instructions', rest.slice(rest.indexOf(':') + 1)] : ['Context window', rest]
  return (
    <Box flexDirection="column" gap={1}>
      {Breadcrumb(els, a, trail)}
      <Markdown key="detail" text={clip(page)} />
      {Footer(els, d, 'b back')}
    </Box>
  )
}
