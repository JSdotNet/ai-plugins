// Body budgets from resources/spec-conciseness.md: what counts as a budgeted asset, how its
// body is counted, and when it states why it exceeds the budget. Pure, so the hooks module
// and its tests share one copy. Counting matches tools/check-assets.mjs: non-blank lines
// after the frontmatter.

export type Asset = { kind: 'SKILL.md' | 'agent' | 'contract'; budget: number }

export type Measure = {
  lines: number
  budget: number
  isExempt: boolean
  level: 'ok' | 'near' | 'over'
}

const FRONTMATTER = /^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

// "Over the 60-line budget by design: ...", "exceeds its budget because ..."
const EXEMPTION = /\b(over|exceeds?|past|beyond)\s+(the|its|this)\s+(\d+-line\s+)?(body\s+)?budget\b/i

export function classify(filePath: string): Asset | null {
  const parts = filePath.replace(/\\/g, '/').split('/')
  const base = parts.at(-1) ?? ''
  const parent = parts.at(-2) ?? ''
  if (base === 'SKILL.md') return { kind: 'SKILL.md', budget: 40 }
  if (base.endsWith('.agent.md')) return { kind: 'agent', budget: 80 }
  if (base.endsWith('.md') && base !== 'README.md' && (parent === 'rules' || parent === 'resources')) {
    return { kind: 'contract', budget: 60 }
  }
  return null
}

function split(text: string): { fm: string | null; body: string } {
  const m = FRONTMATTER.exec(text)
  return m ? { fm: m[1] ?? '', body: m[2] ?? '' } : { fm: null, body: text }
}

// A resources/ file without name and description is a template or prompt fragment, not a
// contract, and carries no budget.
export function isBudgeted(asset: Asset, filePath: string, text: string): boolean {
  if (asset.kind !== 'contract') return true
  const parent = filePath.replace(/\\/g, '/').split('/').at(-2)
  if (parent !== 'resources') return true
  const { fm } = split(text)
  return fm !== null && /^name:/m.test(fm) && /^description:/m.test(fm)
}

export function measure(budget: number, text: string): Measure {
  const { body } = split(text)
  const lines = body.split(/\r?\n/).filter(l => l.trim() !== '').length
  const isExempt = lines > budget && EXEMPTION.test(body)
  const level = lines > budget ? 'over' : lines >= budget * 0.9 ? 'near' : 'ok'
  return { lines, budget, isExempt, level }
}

export function label(filePath: string, m: Measure): string {
  const base = filePath.replace(/\\/g, '/').split('/').at(-1) ?? filePath
  const text = `${base} ${m.lines}/${m.budget}`
  if (m.isExempt) return `${text} (exempt)`
  if (m.level === 'over') return `🔴 ${text}`
  if (m.level === 'near') return `🟡 ${text}`
  return text
}
