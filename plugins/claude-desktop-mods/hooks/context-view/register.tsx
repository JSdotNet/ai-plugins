// context-view: a pane showing what fills this session's context — the window, the
// instructions loaded, the Markdown read, and a devbook lens. Claude Code only; no
// dependency on devbook: the lens recognises its folders and meta fences by shape.

import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, SessionUsage } from 'claude-code'

import type { ContextViewInstruction, ContextViewMdRead, ContextViewRule } from '../../types'
import {
  addRead,
  chapterAddresses,
  devbookPlace,
  devbookRoot,
  estimateTokens,
  folderOf,
  formatTokens,
  hasMetaFence,
  isMarkdown,
  isMostOfFolder,
  markdownReadByShell,
  memoryImports,
  normalize,
  relativeTo,
  resolvePath,
  ruleGlobs,
  ruleMatches,
  statusText,
  stripLineNumbers,
} from './model'

type $ = EngineInterface

const PANE = 'context-view'
const MARKDOWN_LIMIT = 9500

const reads = atom({ plugin: 'claude-desktop-mods', key: 'contextReads' } as const, [])
const instructions = atom({ plugin: 'claude-desktop-mods', key: 'contextInstructions' } as const, [])
const rules = atom({ plugin: 'claude-desktop-mods', key: 'contextRules' } as const, [])
const peak = atom({ plugin: 'claude-desktop-mods', key: 'contextPeak' } as const, 0)
const byTool = atom({ plugin: 'claude-desktop-mods', key: 'contextByTool' } as const, {})
const warnings = atom({ plugin: 'claude-desktop-mods', key: 'contextWarnings' } as const, [])
const turnReads = atom({ plugin: 'claude-desktop-mods', key: 'contextTurnReads' } as const, {})
const folderSizes = atom({ plugin: 'claude-desktop-mods', key: 'contextFolderSizes' } as const, {})
const pendingSkills = atom({ plugin: 'claude-desktop-mods', key: 'contextPendingSkills' } as const, [])

const MEMORY_ROOTS = ['CLAUDE.md', '.claude/CLAUDE.md', 'CLAUDE.local.md']

const readText = async ($: $, path: string): Promise<string | undefined> => {
  try {
    return await $.fs.read(path)
  } catch {
    return undefined
  }
}

const listMarkdown = async ($: $, dir: string, depth = 0): Promise<string[]> => {
  if (depth > 6) return []
  let entries: Awaited<ReturnType<$['fs']['list']>> = []
  try {
    entries = await $.fs.list(dir)
  } catch {
    return []
  }
  const out: string[] = []
  for (const entry of entries) {
    const path = `${dir}/${entry.name}`
    if (entry.kind === 'dir' && entry.name !== '_meta' && entry.name !== 'node_modules')
      out.push(...(await listMarkdown($, path, depth + 1)))
    else if (entry.kind === 'file' && isMarkdown(entry.name)) out.push(path)
  }
  return out
}

/** Adds an instruction, or replaces the one of the same kind and name. */
const putInstruction = ($: $, entry: ContextViewInstruction) =>
  update($, instructions, list => [
    ...list.filter(i => !(i.kind === entry.kind && i.name === entry.name)),
    entry,
  ])

const blockText = (content: readonly { type: string; [k: string]: unknown }[]): string =>
  content
    .map(b => (b.type === 'text' && typeof b.text === 'string' ? b.text : ''))
    .filter(Boolean)
    .join('\n')

const warnOnce = ($: $, text: string) =>
  update($, warnings, list => (list.includes(text) ? list : [...list, text].slice(-50)))

/** CLAUDE.md and the files its `@` imports pull in, recursively. */
const scanMemory = async ($: $, cwd: string) => {
  const seen = new Set<string>()
  const found: ContextViewInstruction[] = []
  const visit = async (abs: string, detail: string | undefined, depth: number) => {
    if (seen.has(abs.toLowerCase()) || depth > 5) return
    seen.add(abs.toLowerCase())
    const text = await readText($, abs)
    if (text === undefined) return
    const name = relativeTo(cwd, abs)
    found.push({ kind: 'memory', name, tokens: estimateTokens(text), detail })
    for (const imported of memoryImports(text, abs)) await visit(imported, `@ import of ${name}`, depth + 1)
  }
  for (const root of MEMORY_ROOTS) await visit(resolvePath(cwd, root), undefined, 0)
  return found
}

/** `.claude/rules/*.md`: path-scoped ones wait for a matching read; the rest load always. */
const scanRules = async ($: $, cwd: string) => {
  const scoped: ContextViewRule[] = []
  const always: ContextViewInstruction[] = []
  for (const abs of await listMarkdown($, `${normalize(cwd)}/.claude/rules`)) {
    const text = (await readText($, abs)) ?? ''
    const globs = ruleGlobs(text)
    const path = relativeTo(cwd, abs)
    if (globs.length > 0) scoped.push({ path, globs, tokens: estimateTokens(text) })
    else always.push({ kind: 'rule', name: path, tokens: estimateTokens(text), detail: 'loads always' })
  }
  return { scoped, always }
}

const refresh = async ($: $) => {
  let usage: SessionUsage | undefined
  try {
    usage = await $.session.usage()
  } catch {
    usage = undefined
  }
  const tokens = usage?.context.tokens
  if (tokens !== undefined) await update($, peak, p => Math.max(p, tokens))
  const list = await read($, reads)
  $.ui.status(statusText(usage?.context.percent, list.length))
}

/** Records any path read: fires the rules whose globs match it. */
const firePathRules = async ($: $, rel: string) => {
  const scoped = await read($, rules)
  const known = await read($, instructions)
  for (const rule of scoped) {
    if (!ruleMatches(rule, rel) || known.some(i => i.kind === 'rule' && i.name === rule.path)) continue
    await putInstruction($, { kind: 'rule', name: rule.path, tokens: rule.tokens, detail: `matched ${rel}` })
  }
}

const devbookLens = async ($: $, cwd: string, rel: string, hasMeta: boolean) => {
  const place = devbookPlace(rel, hasMeta)
  if (!place) return
  if (place.isMeta)
    await warnOnce($, `\`_meta/\` file read: \`${rel}\` — a derived index, not a chapter; load the chapter it points at`)
  const root = devbookRoot(rel, place.folder)
  if (!root || place.isMeta) return
  let size = (await read($, folderSizes))[root]
  if (size === undefined) {
    const counted = (await listMarkdown($, `${normalize(cwd)}/${root}`)).length
    await update($, folderSizes, sizes => ({ ...sizes, [root]: counted }))
    size = counted
  }
  const before = (await read($, turnReads))[root] ?? []
  if (before.includes(rel)) return
  const after = [...before, rel]
  await update($, turnReads, all => ({ ...all, [root]: after }))
  if (!isMostOfFolder(before.length, size) && isMostOfFolder(after.length, size))
    await warnOnce(
      $,
      `Most of \`${root}\` loaded in one turn (${after.length} of ${size} files) — devbook context is task-scoped: load the chapters the task names, never the folder whole`,
    )
}

const recordMarkdown = async ($: $, cwd: string, file: string, text: string, via: string) => {
  const rel = relativeTo(cwd, file)
  const body = stripLineNumbers(text)
  const hasMeta = hasMetaFence(body)
  const entry: Omit<ContextViewMdRead, 'count'> = {
    path: rel,
    folder: folderOf(rel),
    tokens: estimateTokens(body),
    hasMeta,
    chapters: hasMeta ? chapterAddresses(rel, body) : [],
    via,
  }
  await update($, reads, list => addRead(list, entry))
  await devbookLens($, cwd, rel, hasMeta)
}

/** The agent definition the Agent tool runs, when this repository holds it. */
const agentBody = async ($: $, cwd: string, type: string): Promise<string | undefined> => {
  const [plugin, name] = type.includes(':') ? type.split(':', 2) : [undefined, type]
  const candidates = plugin
    ? [`plugins/${plugin}/agents/${name}.agent.md`, `plugins/${plugin}/agents/${name}.md`]
    : [`.claude/agents/${name}.md`, `.claude/agents/${name}.agent.md`]
  for (const candidate of candidates) {
    const text = await readText($, resolvePath(cwd, candidate))
    if (text !== undefined) return text
  }
  return undefined
}

const clip = (text: string): string =>
  text.length <= MARKDOWN_LIMIT ? text : `${text.slice(0, MARKDOWN_LIMIT).replace(/\n[^\n]*$/, '')}\n\n…`

const cell = (s: string) => s.replace(/\|/g, '\\|')

const windowSection = (usage: SessionUsage | undefined, top: number, tools: Record<string, number>): string => {
  const ctx = usage?.context
  const breakdown = ctx?.breakdown
  const limit = breakdown?.rawMaxTokens ?? ctx?.window
  const used = breakdown?.totalTokens ?? ctx?.tokens
  const pct = breakdown?.percentage ?? ctx?.percent
  const lines = ['### Context window', '']
  lines.push(
    used === undefined || limit === undefined
      ? `No response yet in this window${limit ? ` · limit ${formatTokens(limit)}` : ''} · peak ${formatTokens(top)}`
      : `**${formatTokens(used)} / ${formatTokens(limit)}** (${Math.round(pct ?? (used / limit) * 100)}%) · peak ${formatTokens(top)}`,
  )
  const categories = (breakdown?.categories ?? [])
    .filter(c => c.kind === 'used' && c.tokens > 0)
    .sort((a, b) => b.tokens - a.tokens)
    .slice(0, 6)
  if (categories.length > 0) {
    lines.push('', '| Category | Tokens |', '| --- | ---: |')
    for (const c of categories) lines.push(`| ${cell(c.name)} | ${formatTokens(c.tokens)} |`)
  } else {
    const derived = Object.entries(tools).sort((a, b) => b[1] - a[1]).slice(0, 6)
    if (derived.length > 0) {
      lines.push('', '| Tool results (derived) | ~Tokens |', '| --- | ---: |')
      for (const [tool, n] of derived) lines.push(`| ${cell(tool)} | ${formatTokens(n)} |`)
    }
  }
  return lines.join('\n')
}

const instructionsSection = (
  own: readonly ContextViewInstruction[],
  usage: SessionUsage | undefined,
  cwd: string,
): string => {
  const merged = [...own]
  for (const file of usage?.context.breakdown?.memoryFiles ?? []) {
    const name = relativeTo(cwd, file.path)
    const at = merged.findIndex(i => (i.kind === 'memory' || i.kind === 'rule') && i.name.toLowerCase() === name.toLowerCase())
    const prev = merged[at]
    if (prev) merged[at] = { ...prev, tokens: file.tokens }
    else merged.push({ kind: name.includes('/rules/') ? 'rule' : 'memory', name, tokens: file.tokens, detail: file.type })
  }
  const order = ['memory', 'rule', 'output-style', 'hook', 'skill', 'agent']
  merged.sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind) || b.tokens - a.tokens)
  const total = merged.reduce((n, i) => n + i.tokens, 0)
  const lines = ['### Instructions loaded', '', `${merged.length} sources · ~${formatTokens(total)} tokens`, '']
  if (merged.length === 0) return [...lines, '_None seen yet._'].join('\n')
  lines.push('| Kind | Source | ~Tokens | Why |', '| --- | --- | ---: | --- |')
  for (const i of merged)
    lines.push(`| ${i.kind} | \`${cell(i.name)}\` | ${formatTokens(i.tokens)} | ${cell(i.detail ?? '')} |`)
  return lines.join('\n')
}

const markdownSection = (list: readonly ContextViewMdRead[]): string => {
  const total = list.reduce((n, r) => n + r.tokens, 0)
  const lines = ['### Markdown read', '', `${list.length} files · ~${formatTokens(total)} tokens`, '']
  if (list.length === 0) return [...lines, '_No Markdown read yet._'].join('\n')
  const folders = new Map<string, ContextViewMdRead[]>()
  for (const r of list) folders.set(r.folder, [...(folders.get(r.folder) ?? []), r])
  const sorted = [...folders].sort(
    (a, b) => b[1].reduce((n, r) => n + r.tokens, 0) - a[1].reduce((n, r) => n + r.tokens, 0),
  )
  for (const [folder, files] of sorted) {
    lines.push(`**\`${folder}/\`** · ~${formatTokens(files.reduce((n, r) => n + r.tokens, 0))}`)
    for (const r of [...files].sort((a, b) => b.tokens - a.tokens))
      lines.push(`- \`${r.path.slice(folder === '.' ? 0 : folder.length + 1)}\` · ~${formatTokens(r.tokens)}${r.count > 1 ? ` · read ${r.count}×` : ''}`)
    lines.push('')
  }
  return lines.join('\n')
}

const devbookSection = (list: readonly ContextViewMdRead[], notes: readonly string[]): string | undefined => {
  const placed = list
    .map(r => ({ r, place: devbookPlace(r.path, r.hasMeta) }))
    .filter((x): x is { r: ContextViewMdRead; place: NonNullable<typeof x.place> } => x.place !== undefined)
  if (placed.length === 0 && notes.length === 0) return undefined
  const lines = ['### Devbook lens', '']
  for (const note of notes) lines.push(`> ⚠ ${note}`, '>')
  if (notes.length > 0) lines.push('')
  const folders = new Map<string, typeof placed>()
  for (const x of placed) folders.set(x.place.folder, [...(folders.get(x.place.folder) ?? []), x])
  for (const [folder, files] of [...folders].sort()) {
    lines.push(`**${folder}** · ${files.length} files · ~${formatTokens(files.reduce((n, x) => n + x.r.tokens, 0))}`)
    for (const { r } of files) {
      const chapters = r.chapters.filter(c => c.includes('#')).map(c => c.slice(c.indexOf('#')))
      lines.push(`- \`${r.path}\`${chapters.length > 0 ? ` — ${chapters.join(', ')}` : ''}`)
    }
    lines.push('')
  }
  return lines.join('\n')
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'context-view',
      description: 'Show what fills this session\'s context: window, instructions, Markdown read, devbook lens',
    })
    const cwd = e.cwd
    const memory = await scanMemory($, cwd)
    const { scoped, always } = await scanRules($, cwd)
    await update($, rules, () => scoped)
    await update($, instructions, list => {
      const fresh = [...memory, ...always]
      const kept = list.filter(i => !fresh.some(f => f.kind === i.kind && f.name === i.name))
      return [...fresh, ...kept]
    })
    await refresh($)
    return next(e)
  })

  on('command.run', { command: 'context-view' }, async $ => {
    await $.ui.open({ id: PANE, title: 'Context' })
    return { text: 'Context view opened.' }
  })

  on('turn.start', async ($, e, next) => {
    await update($, turnReads, () => ({}))
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    const done = await next(e)
    await refresh($)
    return done
  })

  on('tool.call', async ($, e, next) => {
    const ran = await next(e)
    if (ran.deny !== undefined) return ran
    const cwd = await $.session.cwd()
    const text = ran.text ?? ''
    const tool = String(e.tool)
    const via = e.agentId ? `${tool} · subagent` : tool
    if (!e.agentId) {
      const tokens = estimateTokens(text)
      await update($, byTool, all => ({ ...all, [tool]: (all[tool] ?? 0) + tokens }))
    }

    if (e.tool === 'Read' && !ran.isError) {
      const rel = relativeTo(cwd, e.file_path)
      await firePathRules($, rel)
      if (isMarkdown(e.file_path)) await recordMarkdown($, cwd, e.file_path, text, via)
    } else if ((tool === 'Bash' || tool === 'PowerShell') && !ran.isError) {
      const command = (e as { command?: unknown }).command
      const files = typeof command === 'string' ? markdownReadByShell(command) : []
      for (const file of files) {
        await firePathRules($, relativeTo(cwd, file))
        await recordMarkdown($, cwd, file, files.length === 1 ? text : text.slice(0, text.length / files.length), via)
      }
    } else if (e.tool === 'Skill' && !e.agentId) {
      await update($, pendingSkills, list => [...list, e.skill])
    } else if (e.tool === 'Agent' && e.subagent_type) {
      const body = await agentBody($, cwd, e.subagent_type)
      await putInstruction($, {
        kind: 'agent',
        name: e.subagent_type,
        tokens: estimateTokens(body),
        detail: `${body === undefined ? 'body not in this repository; ' : ''}runs in the subagent's context, ~${formatTokens(estimateTokens(text))} returned`,
      })
    }

    await refresh($)
    return ran
  })

  on('session.append', async ($, e, next) => {
    const stored = await next(e)
    if (e.agentId) return stored
    const text = blockText(e.message.content)
    if (!text) return stored
    const origin = e.origin
    if (e.door === 'hook-context' || origin.kind === 'hook') {
      const event = origin.kind === 'hook' ? origin.event : 'hook'
      const known = (await read($, instructions)).find(i => i.kind === 'hook' && i.name === `${event} hook`)
      await putInstruction($, {
        kind: 'hook',
        name: `${event} hook`,
        tokens: (known?.tokens ?? 0) + estimateTokens(text),
        detail: 'additional context',
      })
    } else if (origin.kind === 'tool' && origin.tool === 'Skill' && e.door !== 'tool-result') {
      const [skill, ...rest] = await read($, pendingSkills)
      await update($, pendingSkills, () => rest)
      if (skill) await putInstruction($, { kind: 'skill', name: skill, tokens: estimateTokens(text), detail: 'Skill tool' })
    } else if (e.message.name === 'nested_memory') {
      const path = /Contents of (.+?)(?: \(|:\s*\n)/.exec(text)?.[1]
      if (path) {
        const name = relativeTo(await $.session.cwd(), path)
        const kind = name.includes('.claude/rules/') ? 'rule' : 'memory'
        await putInstruction($, { kind, name, tokens: estimateTokens(text), detail: 'loaded on a read' })
      }
    }
    return stored
  })

  on('prompt.compose', async ($, e, next) => {
    const composed = await next(e)
    const style = e.outputStyle
    if (!style) return composed
    const sections = composed.sections.filter(s => /style/i.test(s.id))
    const tokens = sections.reduce((n, s) => n + estimateTokens(s.text), 0)
    const known = (await read($, instructions)).find(i => i.kind === 'output-style')
    if (known?.name !== style.name || known.tokens !== tokens) {
      await update($, instructions, list => [
        ...list.filter(i => i.kind !== 'output-style'),
        {
          kind: 'output-style' as const,
          name: style.name,
          tokens,
          detail: sections.length > 0 ? 'system prompt section' : 'section not identified',
        },
      ])
    }
    return composed
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Markdown } = $.ui.resolve(e)
    let usage: SessionUsage | undefined
    try {
      usage = await $.session.usage({ breakdown: 'summary', columns: e.props.bodyColumns })
    } catch {
      usage = undefined
    }
    const cwd = await $.session.cwd()
    const list = await read($, reads)
    const devbook = devbookSection(list, await read($, warnings))
    const sections = [
      windowSection(usage, await read($, peak), await read($, byTool)),
      instructionsSection(await read($, instructions), usage, cwd),
      markdownSection(list),
      ...(devbook ? [devbook] : []),
    ]
    return (
      <Box flexDirection="column" gap={1}>
        {sections.map((text, i) => (
          <Markdown key={`section-${i}`} text={clip(text)} />
        ))}
      </Box>
    )
  })
}
