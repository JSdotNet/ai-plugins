// What the context-view pane draws, as Markdown: the overview, the zoom picker's options,
// and one detail page per line. Pure, so the tests read it without a surface.

import type { SessionUsage } from 'claude-code'

import type { ContextViewInstruction, ContextViewMdRead, ContextViewRule } from '../../types'
import { devbookPlace, formatTokens, relativeTo } from './model'

export type ViewData = {
  usage: SessionUsage | undefined
  cwd: string
  reads: readonly ContextViewMdRead[]
  instructions: readonly ContextViewInstruction[]
  rules: readonly ContextViewRule[]
  warnings: readonly string[]
  peak: number
  byTool: Readonly<Record<string, number>>
  startedAt: number
}

export type ZoomOption = { value: string; label: string }

const MARKDOWN_LIMIT = 9500
const KIND_ORDER = ['memory', 'rule', 'output-style', 'hook', 'skill', 'agent']

export const clip = (text: string): string =>
  text.length <= MARKDOWN_LIMIT ? text : `${text.slice(0, MARKDOWN_LIMIT).replace(/\n[^\n]*$/, '')}\n\n…`

const cell = (s: string) => s.replace(/\|/g, '\\|')
const sum = <T>(list: readonly T[], f: (x: T) => number) => list.reduce((n, x) => n + f(x), 0)

const clock = (at: number, startedAt: number): string => {
  const s = Math.max(0, Math.round((at - startedAt) / 1000))
  return s < 60 ? `+${s}s` : s < 3600 ? `+${Math.floor(s / 60)}m${String(s % 60).padStart(2, '0')}s` : `+${Math.floor(s / 3600)}h${Math.floor((s % 3600) / 60)}m`
}

/** The session's instructions with the engine's own memory-file counts folded in. */
export const mergedInstructions = (d: ViewData): ContextViewInstruction[] => {
  const merged = [...d.instructions]
  for (const file of d.usage?.context.breakdown?.memoryFiles ?? []) {
    const name = relativeTo(d.cwd, file.path)
    const at = merged.findIndex(
      i => (i.kind === 'memory' || i.kind === 'rule') && i.name.toLowerCase() === name.toLowerCase(),
    )
    const prev = merged[at]
    if (prev) merged[at] = { ...prev, tokens: file.tokens }
    else merged.push({ kind: name.includes('/rules/') ? 'rule' : 'memory', name, tokens: file.tokens, detail: file.type })
  }
  return merged.sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind) || b.tokens - a.tokens)
}

const usedCategories = (d: ViewData) =>
  (d.usage?.context.breakdown?.categories ?? [])
    .filter(c => c.kind === 'used' && c.tokens > 0)
    .sort((a, b) => b.tokens - a.tokens)

const devbookFolders = (reads: readonly ContextViewMdRead[]) => {
  const folders = new Map<string, ContextViewMdRead[]>()
  for (const r of reads) {
    const place = devbookPlace(r.path, r.hasMeta)
    if (place) folders.set(place.folder, [...(folders.get(place.folder) ?? []), r])
  }
  return [...folders].sort((a, b) => a[0].localeCompare(b[0]))
}

// ---------------------------------------------------------------- overview

export const windowSection = (d: ViewData): string => {
  const ctx = d.usage?.context
  const breakdown = ctx?.breakdown
  const limit = breakdown?.rawMaxTokens ?? ctx?.window
  const used = breakdown?.totalTokens ?? ctx?.tokens
  const pct = breakdown?.percentage ?? ctx?.percent
  const lines = ['### Context window', '']
  lines.push(
    used === undefined || limit === undefined
      ? `No response yet in this window${limit ? ` · limit ${formatTokens(limit)}` : ''} · peak ${formatTokens(d.peak)}`
      : `**${formatTokens(used)} / ${formatTokens(limit)}** (${Math.round(pct ?? (used / limit) * 100)}%) · peak ${formatTokens(d.peak)}`,
  )
  const categories = usedCategories(d).slice(0, 6)
  if (categories.length > 0) {
    lines.push('', '| Category | Tokens |', '| --- | ---: |')
    for (const c of categories) lines.push(`| ${cell(c.name)} | ${formatTokens(c.tokens)} |`)
  } else {
    const derived = Object.entries(d.byTool).sort((a, b) => b[1] - a[1]).slice(0, 6)
    if (derived.length > 0) {
      lines.push('', '| Tool results (derived) | ~Tokens |', '| --- | ---: |')
      for (const [tool, n] of derived) lines.push(`| ${cell(tool)} | ${formatTokens(n)} |`)
    }
  }
  return lines.join('\n')
}

export const instructionsSection = (d: ViewData): string => {
  const merged = mergedInstructions(d)
  const lines = ['### Instructions loaded', '', `${merged.length} sources · ~${formatTokens(sum(merged, i => i.tokens))} tokens`, '']
  if (merged.length === 0) return [...lines, '_None seen yet._'].join('\n')
  lines.push('| Kind | Source | ~Tokens | Why |', '| --- | --- | ---: | --- |')
  for (const i of merged)
    lines.push(`| ${i.kind} | \`${cell(i.name)}\` | ${formatTokens(i.tokens)} | ${cell(i.detail ?? '')} |`)
  return lines.join('\n')
}

export const markdownSection = (d: ViewData): string => {
  const lines = ['### Markdown read', '', `${d.reads.length} files · ~${formatTokens(sum(d.reads, r => r.tokens))} tokens`, '']
  if (d.reads.length === 0) return [...lines, '_No Markdown read yet._'].join('\n')
  const folders = new Map<string, ContextViewMdRead[]>()
  for (const r of d.reads) folders.set(r.folder, [...(folders.get(r.folder) ?? []), r])
  const sorted = [...folders].sort((a, b) => sum(b[1], r => r.tokens) - sum(a[1], r => r.tokens))
  for (const [folder, files] of sorted) {
    lines.push(`**\`${folder}/\`** · ~${formatTokens(sum(files, r => r.tokens))}`)
    for (const r of [...files].sort((a, b) => b.tokens - a.tokens))
      lines.push(
        `- \`${r.path.slice(folder === '.' ? 0 : folder.length + 1)}\` · ~${formatTokens(r.tokens)}${r.count > 1 ? ` · read ${r.count}×` : ''}`,
      )
    lines.push('')
  }
  return lines.join('\n')
}

export const devbookSection = (d: ViewData): string | undefined => {
  const folders = devbookFolders(d.reads)
  if (folders.length === 0 && d.warnings.length === 0) return undefined
  const lines = ['### Devbook lens', '']
  for (const note of d.warnings) lines.push(`> ⚠ ${note}`, '>')
  if (d.warnings.length > 0) lines.push('')
  for (const [folder, files] of folders) {
    lines.push(`**${folder}** · ${files.length} files · ~${formatTokens(sum(files, r => r.tokens))}`)
    for (const r of files) {
      const chapters = r.chapters.filter(c => c.includes('#')).map(c => c.slice(c.indexOf('#')))
      lines.push(`- \`${r.path}\`${chapters.length > 0 ? ` — ${chapters.join(', ')}` : ''}`)
    }
    lines.push('')
  }
  return lines.join('\n')
}

export const overview = (d: ViewData): string[] => {
  const devbook = devbookSection(d)
  return [windowSection(d), instructionsSection(d), markdownSection(d), ...(devbook ? [devbook] : [])]
}

// ---------------------------------------------------------------- zoom

/** Every line the pane can zoom into, in the overview's order. */
export const zoomOptions = (d: ViewData): ZoomOption[] => {
  const options: ZoomOption[] = []
  const categories = usedCategories(d)
  for (const c of categories) options.push({ value: `cat:${c.name}`, label: `window · ${c.name} (${formatTokens(c.tokens)})` })
  if (categories.length === 0)
    for (const [tool, n] of Object.entries(d.byTool).sort((a, b) => b[1] - a[1]))
      options.push({ value: `tool:${tool}`, label: `window · ${tool} results (~${formatTokens(n)})` })
  for (const i of mergedInstructions(d))
    options.push({ value: `in:${i.kind}:${i.name}`, label: `${i.kind} · ${i.name} (~${formatTokens(i.tokens)})` })
  for (const r of [...d.reads].sort((a, b) => b.tokens - a.tokens))
    options.push({ value: `md:${r.path}`, label: `md · ${r.path} (~${formatTokens(r.tokens)}${r.count > 1 ? `, ${r.count}×` : ''})` })
  for (const [folder, files] of devbookFolders(d.reads))
    options.push({ value: `db:${folder}`, label: `devbook · ${folder} (${files.length} files)` })
  return options.slice(0, 300)
}

const outlineBlock = (outline: readonly string[] | undefined): string[] =>
  outline && outline.length > 0 ? ['', '**Outline**', '', '```', ...outline, '```'] : []

const mdDetail = (d: ViewData, path: string): string => {
  const r = d.reads.find(x => x.path === path)
  if (!r) return `_\`${path}\` is no longer recorded._`
  const place = devbookPlace(r.path, r.hasMeta)
  const lines = [
    `### \`${r.path}\``,
    '',
    `~${formatTokens(r.tokens)} tokens over ${r.count} read${r.count > 1 ? 's' : ''} · last via ${r.via}${r.hasMeta ? ' · carries `meta` fences' : ''}`,
  ]
  if (r.count > 1) lines.push('', `Read ${r.count}×: every read after the first adds its tokens again unless the earlier result was cleared.`)
  lines.push('', '| When | Turn | Via | ~Tokens | Range |', '| --- | ---: | --- | ---: | --- |')
  for (const e of r.events ?? [])
    lines.push(`| ${clock(e.at, d.startedAt)} | ${e.turn} | ${cell(e.via)} | ${formatTokens(e.tokens)} | ${e.range ?? 'whole file'} |`)
  if (r.rules?.length) lines.push('', '**Rules this read fired**', '', ...r.rules.map(x => `- \`${x}\``))
  if (place) {
    lines.push('', `**Devbook** · folder \`${place.folder}\`${place.isMeta ? ' · a `_meta/` index' : ''}`)
    if (r.chapters.length > 0) lines.push('', ...r.chapters.map(c => `- \`${c}\``))
  }
  lines.push(...outlineBlock(r.outline))
  return lines.join('\n')
}

const instructionDetail = (d: ViewData, kind: string, name: string): string => {
  const i = mergedInstructions(d).find(x => x.kind === kind && x.name === name)
  if (!i) return `_\`${name}\` is no longer recorded._`
  const lines = [`### ${i.kind} · \`${i.name}\``, '', `~${formatTokens(i.tokens)} tokens${i.detail ? ` · ${i.detail}` : ''}`]
  const rule = d.rules.find(x => x.path === i.name)
  if (i.kind === 'memory' && i.refs?.length) lines.push('', '**`@` imports**', '', ...i.refs.map(x => `- \`${x}\``))
  if (i.kind === 'memory') {
    const importedBy = d.instructions.filter(x => x.kind === 'memory' && x.refs?.includes(i.name)).map(x => x.name)
    if (importedBy.length > 0) lines.push('', `Imported by ${importedBy.map(x => `\`${x}\``).join(', ')}.`)
  }
  if (i.kind === 'rule' && rule) lines.push('', '**Globs**', '', ...rule.globs.map(g => `- \`${g}\``))
  if (i.kind === 'rule' && !rule && i.detail === 'loads always') lines.push('', 'No `paths:` frontmatter, so it loads in every session.')
  if (i.kind === 'output-style' && i.refs?.length) lines.push('', `System prompt sections: ${i.refs.map(x => `\`${x}\``).join(', ')}`)
  if (i.events?.length) {
    const headings: Record<string, string> = { rule: 'Paths that matched', agent: 'Calls', skill: 'Invocations', hook: 'Rows', memory: 'Loads' }
    const heading = headings[i.kind] ?? 'Events'
    lines.push('', `**${heading}**`, '', '| When | Turn | What |', '| --- | ---: | --- |')
    for (const e of i.events) lines.push(`| ${clock(e.at, d.startedAt)} | ${e.turn} | ${cell(e.note)} |`)
  }
  lines.push(...outlineBlock(i.outline ?? rule?.outline))
  return lines.join('\n')
}

const categoryDetail = (d: ViewData, name: string): string => {
  const b = d.usage?.context.breakdown
  const c = b?.categories.find(x => x.name === name)
  if (!b || !c) return `_No breakdown for \`${name}\` right now._`
  const lines = [`### ${c.name}`, '', `${formatTokens(c.tokens)} tokens · ${Math.round((c.tokens / b.rawMaxTokens) * 100)}% of the window`]
  const n = name.toLowerCase()
  if (n.includes('memory')) {
    lines.push('', '| File | Loaded from | Tokens |', '| --- | --- | ---: |')
    for (const f of [...b.memoryFiles].sort((x, y) => y.tokens - x.tokens))
      lines.push(`| \`${cell(relativeTo(d.cwd, f.path))}\` | ${f.type} | ${formatTokens(f.tokens)} |`)
  } else if (n.includes('mcp')) {
    const servers = new Map<string, typeof b.mcpTools>()
    for (const t of b.mcpTools) servers.set(t.serverName, [...(servers.get(t.serverName) ?? []), t])
    lines.push('', '| Server | Tools | Loaded | Tokens |', '| --- | ---: | ---: | ---: |')
    for (const [server, tools] of [...servers].sort((x, y) => sum(y[1], t => t.tokens) - sum(x[1], t => t.tokens)))
      lines.push(`| ${cell(server)} | ${tools.length} | ${tools.filter(t => t.isLoaded).length} | ${formatTokens(sum(tools, t => t.tokens))} |`)
  } else if (n.includes('skill') && b.skills) {
    lines.push('', `${b.skills.includedSkills} of ${b.skills.totalSkills} skills listed`, '', '| Skill | Source | Tokens |', '| --- | --- | ---: |')
    for (const s of [...b.skills.skillFrontmatter].sort((x, y) => y.tokens - x.tokens).slice(0, 60))
      lines.push(`| ${cell(s.name)} | ${s.pluginName ?? s.source} | ${formatTokens(s.tokens)} |`)
  } else if (n.includes('agent')) {
    lines.push('', '| Agent | Source | Tokens |', '| --- | --- | ---: |')
    for (const a of [...b.agents].sort((x, y) => y.tokens - x.tokens)) lines.push(`| ${cell(a.agentType)} | ${a.source} | ${formatTokens(a.tokens)} |`)
  } else if (n.includes('message')) {
    lines.push('', 'Tool results that went into the messages, by tool (approximate):', '', '| Tool | ~Tokens |', '| --- | ---: |')
    for (const [tool, t] of Object.entries(d.byTool).sort((x, y) => y[1] - x[1])) lines.push(`| ${cell(tool)} | ${formatTokens(t)} |`)
  } else lines.push('', '_The engine itemizes nothing further for this category._')
  if (b.autoCompactThreshold) lines.push('', `Auto-compaction at ${formatTokens(b.autoCompactThreshold)} tokens.`)
  return lines.join('\n')
}

const toolDetail = (d: ViewData, tool: string): string => {
  const files = d.reads.filter(r => (r.events ?? []).some(e => e.via.startsWith(tool)))
  const lines = [`### ${tool} results`, '', `~${formatTokens(d.byTool[tool] ?? 0)} tokens returned to this session (approximate)`]
  if (files.length > 0) {
    lines.push('', '**Markdown it read**', '')
    for (const r of files.sort((a, b) => b.tokens - a.tokens)) lines.push(`- \`${r.path}\` · ~${formatTokens(r.tokens)}`)
  }
  return lines.join('\n')
}

const devbookDetail = (d: ViewData, folder: string): string => {
  const files = devbookFolders(d.reads).find(([f]) => f === folder)?.[1] ?? []
  const lines = [`### Devbook · ${folder}`, '', `${files.length} files · ~${formatTokens(sum(files, r => r.tokens))} tokens`]
  const notes = d.warnings.filter(w => w.includes(`/${folder}`))
  if (notes.length > 0) lines.push('', ...notes.map(w => `> ⚠ ${w}`))
  const byTurn = new Map<number, string[]>()
  for (const r of files) for (const e of r.events ?? []) byTurn.set(e.turn, [...new Set([...(byTurn.get(e.turn) ?? []), r.path])])
  if (byTurn.size > 0) {
    lines.push('', '| Turn | Files read |', '| ---: | --- |')
    for (const [turn, paths] of [...byTurn].sort((a, b) => a[0] - b[0])) lines.push(`| ${turn} | ${paths.map(p => `\`${p.split('/').pop()}\``).join(', ')} |`)
  }
  lines.push('', '**Chapters**', '')
  for (const r of files) lines.push(`- \`${r.path}\``, ...r.chapters.filter(c => c.includes('#')).map(c => `  - \`${c.slice(c.indexOf('#'))}\``))
  return lines.join('\n')
}

/** The detail page for one zoom value, or undefined when the value names nothing known. */
export const detail = (d: ViewData, focus: string): string | undefined => {
  const at = focus.indexOf(':')
  const kind = focus.slice(0, at)
  const rest = focus.slice(at + 1)
  if (kind === 'md') return mdDetail(d, rest)
  if (kind === 'cat') return categoryDetail(d, rest)
  if (kind === 'tool') return toolDetail(d, rest)
  if (kind === 'db') return devbookDetail(d, rest)
  if (kind === 'in') {
    const split = rest.indexOf(':')
    return instructionDetail(d, rest.slice(0, split), rest.slice(split + 1))
  }
  return undefined
}
