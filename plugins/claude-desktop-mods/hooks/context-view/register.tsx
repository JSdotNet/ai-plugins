// context-view: a pane showing what fills this session's context — the window, the
// instructions loaded, the Markdown read, and a devbook lens — with a zoom into any line.
// Claude Code only; no dependency on devbook: the lens recognises its folders and meta
// fences by shape.

import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, SessionUsage } from 'claude-code'

import type {
  ContextViewInstruction,
  ContextViewInstructionEvent,
  ContextViewMdRead,
  ContextViewRule,
} from '../../types'
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
  outlineOf,
  pushEvent,
  relativeTo,
  resolvePath,
  ruleGlobs,
  ruleMatches,
  statusText,
  stripLineNumbers,
} from './model'
import { Overview, Zoom } from './pane'
import type { Actions, Els, PaneData } from './pane'

type $ = EngineInterface

const PANE = 'context-view'

const reads = atom({ plugin: 'claude-desktop-mods', key: 'contextReads' } as const, [])
const instructions = atom({ plugin: 'claude-desktop-mods', key: 'contextInstructions' } as const, [])
const rules = atom({ plugin: 'claude-desktop-mods', key: 'contextRules' } as const, [])
const peak = atom({ plugin: 'claude-desktop-mods', key: 'contextPeak' } as const, 0)
const byTool = atom({ plugin: 'claude-desktop-mods', key: 'contextByTool' } as const, {})
const warnings = atom({ plugin: 'claude-desktop-mods', key: 'contextWarnings' } as const, [])
const turnReads = atom({ plugin: 'claude-desktop-mods', key: 'contextTurnReads' } as const, {})
const folderSizes = atom({ plugin: 'claude-desktop-mods', key: 'contextFolderSizes' } as const, {})
const pendingSkills = atom({ plugin: 'claude-desktop-mods', key: 'contextPendingSkills' } as const, [])
const turn = atom({ plugin: 'claude-desktop-mods', key: 'contextTurn' } as const, 0)
const focus = atom({ plugin: 'claude-desktop-mods', key: 'contextFocus' } as const, '')
const folded = atom({ plugin: 'claude-desktop-mods', key: 'contextFolded' } as const, {})

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

/** A stamp for an event: now, and the turn it falls in. */
const stamp = async ($: $, note: string): Promise<ContextViewInstructionEvent> => ({
  at: await $.clock.now(),
  turn: await read($, turn),
  note,
})

/** Adds an instruction, or merges into the one of the same kind and name, keeping its history. */
const putInstruction = ($: $, entry: ContextViewInstruction, event?: ContextViewInstructionEvent) =>
  update($, instructions, list => {
    const known = list.find(i => i.kind === entry.kind && i.name === entry.name)
    const merged: ContextViewInstruction = {
      ...known,
      ...entry,
      outline: entry.outline ?? known?.outline,
      refs: entry.refs ?? known?.refs,
      events: event ? pushEvent(known?.events, event) : known?.events,
    }
    return [...list.filter(i => i !== known), merged]
  })

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
  const visit = async (abs: string, why: string | undefined, depth: number) => {
    if (seen.has(abs.toLowerCase()) || depth > 5) return
    seen.add(abs.toLowerCase())
    const text = await readText($, abs)
    if (text === undefined) return
    const name = relativeTo(cwd, abs)
    const imports = memoryImports(text, abs)
    found.push({
      kind: 'memory',
      name,
      tokens: estimateTokens(text),
      detail: why,
      outline: outlineOf(text),
      refs: imports.map(i => relativeTo(cwd, i)),
    })
    for (const imported of imports) await visit(imported, `@ import of ${name}`, depth + 1)
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
    const outline = outlineOf(text)
    if (globs.length > 0) scoped.push({ path, globs, tokens: estimateTokens(text), outline })
    else always.push({ kind: 'rule', name: path, tokens: estimateTokens(text), detail: 'loads always', outline })
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

/** Fires the rules whose globs match a read path; returns the ones that matched. */
const firePathRules = async ($: $, rel: string): Promise<string[]> => {
  const matched: string[] = []
  for (const rule of await read($, rules)) {
    if (!ruleMatches(rule, rel)) continue
    matched.push(rule.path)
    const known = (await read($, instructions)).find(i => i.kind === 'rule' && i.name === rule.path)
    await putInstruction(
      $,
      { kind: 'rule', name: rule.path, tokens: rule.tokens, detail: known?.detail ?? `matched ${rel}`, refs: rule.globs },
      await stamp($, rel),
    )
  }
  return matched
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

const recordMarkdown = async (
  $: $,
  cwd: string,
  file: string,
  text: string,
  via: string,
  fired: string[],
  range?: string,
  from?: number,
) => {
  const rel = relativeTo(cwd, file)
  const body = stripLineNumbers(text)
  const hasMeta = hasMetaFence(body)
  const tokens = estimateTokens(body)
  const entry: Omit<ContextViewMdRead, 'count' | 'events'> = {
    path: rel,
    folder: folderOf(rel),
    tokens,
    hasMeta,
    chapters: hasMeta ? chapterAddresses(rel, body) : [],
    via,
    outline: outlineOf(body),
    rules: fired,
  }
  const lines = body.split('\n').length
  const event = { at: await $.clock.now(), turn: await read($, turn), via, tokens, lines, ...(range ? { range } : {}), ...(from ? { from } : {}) }
  await update($, reads, list => addRead(list, entry, event))
  await devbookLens($, cwd, rel, hasMeta)
}

/** The agent definition the Agent tool runs, when this repository holds it. */
const agentBody = async ($: $, cwd: string, type: string): Promise<{ path: string; text: string } | undefined> => {
  const [plugin, name] = type.includes(':') ? type.split(':', 2) : [undefined, type]
  const candidates = plugin
    ? [`plugins/${plugin}/agents/${name}.agent.md`, `plugins/${plugin}/agents/${name}.md`]
    : [`.claude/agents/${name}.md`, `.claude/agents/${name}.agent.md`]
  for (const candidate of candidates) {
    const text = await readText($, resolvePath(cwd, candidate))
    if (text !== undefined) return { path: candidate, text }
  }
  return undefined
}

const readRange = (offset: unknown, limit: unknown): string | undefined => {
  if (typeof offset !== 'number' && typeof limit !== 'number') return undefined
  const from = typeof offset === 'number' ? offset : 1
  return typeof limit === 'number' ? `lines ${from}–${from + limit - 1}` : `from line ${from}`
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
    for (const entry of [...memory, ...always]) await putInstruction($, entry)
    await refresh($)
    return next(e)
  })

  on('command.run', { command: 'context-view' }, async $ => {
    await $.ui.open({ id: PANE, title: 'Context' })
    return { text: 'Context view opened.' }
  })

  on('turn.start', async ($, e, next) => {
    await update($, turnReads, () => ({}))
    await update($, turn, n => n + 1)
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
      const fired = await firePathRules($, relativeTo(cwd, e.file_path))
      if (isMarkdown(e.file_path))
        await recordMarkdown($, cwd, e.file_path, text, via, fired, readRange(e.offset, e.limit), typeof e.offset === 'number' ? e.offset : undefined)
    } else if ((tool === 'Bash' || tool === 'PowerShell') && !ran.isError) {
      const command = (e as { command?: unknown }).command
      const files = typeof command === 'string' ? markdownReadByShell(command) : []
      for (const file of files) {
        const fired = await firePathRules($, relativeTo(cwd, file))
        await recordMarkdown($, cwd, file, files.length === 1 ? text : text.slice(0, text.length / files.length), via, fired)
      }
    } else if (e.tool === 'Skill' && !e.agentId) {
      await update($, pendingSkills, list => [...list, e.skill])
    } else if (e.tool === 'Agent' && e.subagent_type) {
      const body = await agentBody($, cwd, e.subagent_type)
      const returned = estimateTokens(text)
      await putInstruction(
        $,
        {
          kind: 'agent',
          name: e.subagent_type,
          tokens: estimateTokens(body?.text),
          detail: `${body ? body.path : 'body not in this repository'}; runs in the subagent's context`,
          ...(body ? { outline: outlineOf(body.text) } : {}),
        },
        await stamp($, `${e.description} — ~${formatTokens(returned)} returned`),
      )
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
      const name = `${event} hook`
      const known = (await read($, instructions)).find(i => i.kind === 'hook' && i.name === name)
      const tokens = estimateTokens(text)
      await putInstruction(
        $,
        { kind: 'hook', name, tokens: (known?.tokens ?? 0) + tokens, detail: 'additional context', outline: outlineOf(text) },
        await stamp($, `${formatTokens(tokens)} tokens: ${text.slice(0, 80).replace(/\s+/g, ' ')}…`),
      )
    } else if (origin.kind === 'tool' && origin.tool === 'Skill' && e.door !== 'tool-result') {
      const [skill, ...rest] = await read($, pendingSkills)
      await update($, pendingSkills, () => rest)
      if (skill) {
        const tokens = estimateTokens(text)
        await putInstruction(
          $,
          { kind: 'skill', name: skill, tokens, detail: 'Skill tool', outline: outlineOf(text) },
          await stamp($, `body loaded, ~${formatTokens(tokens)} tokens`),
        )
      }
    } else if (e.message.name === 'nested_memory') {
      const path = /Contents of (.+?)(?: \(|:\s*\n)/.exec(text)?.[1]
      if (path) {
        const name = relativeTo(await $.session.cwd(), path)
        const kind = name.includes('.claude/rules/') ? 'rule' : 'memory'
        await putInstruction(
          $,
          { kind, name, tokens: estimateTokens(text), detail: 'loaded on a read', outline: outlineOf(text) },
          await stamp($, 'loaded by the engine on a read'),
        )
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
          refs: sections.map(s => s.id),
          outline: outlineOf(sections.map(s => s.text).join('\n')),
        },
      ])
    }
    return composed
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text, Button, Markdown } = $.ui.resolve(e)
    const els: Els = { Box, Text, Button, Markdown }
    let usage: SessionUsage | undefined
    try {
      usage = await $.session.usage({ breakdown: 'summary', columns: e.props.bodyColumns })
    } catch {
      usage = undefined
    }
    const data: PaneData = {
      usage,
      cwd: await $.session.cwd(),
      reads: await read($, reads),
      instructions: await read($, instructions),
      rules: await read($, rules),
      warnings: await read($, warnings),
      peak: await read($, peak),
      byTool: await read($, byTool),
      startedAt: usage?.startedAt ?? 0,
      turn: await read($, turn),
      folded: await read($, folded),
      folderSizes: await read($, folderSizes),
      columns: e.props.bodyColumns,
    }
    const actions: Actions = {
      zoom: value => void update($, focus, () => value),
      back: () => void update($, focus, () => ''),
      toggle: section => void update($, folded, all => ({ ...all, [section]: !all[section] })),
    }
    const zoomed = await read($, focus)
    return (zoomed ? Zoom(els, actions, data, zoomed) : undefined) ?? Overview(els, actions, data)
  })
}
