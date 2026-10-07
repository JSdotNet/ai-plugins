// Claude-only function hooks: after every Write or Edit, pin the edited asset's body-line
// count against its budget in the status line, and toast once when a file first crosses it.
// The budgets and the exemption are resources/spec-conciseness.md's; budget.ts holds the logic.
import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { SpecBuilderToasted } from '../types'
import { classify, isBudgeted, label, measure } from './budget'

const toasted = atom({ plugin: 'spec-builder', key: 'toasted' } as const, [] as SpecBuilderToasted)

async function readText($: EngineInterface, path: string): Promise<string | null> {
  try {
    const text = await $.fs.read(path)
    return typeof text === 'string' ? text : null
  } catch {
    return null
  }
}

export const register: Register = on => {
  on('tool.call', { tool: ['Write', 'Edit'] }, async ($, e, next) => {
    const path = e.file_path
    const asset = classify(path)
    if (asset === null) {
      const ran = await next(e)
      $.ui.status(undefined)
      return ran
    }

    const before = await readText($, path)
    const ran = await next(e)
    if (ran.deny !== undefined || ran.isError === true) return ran

    const after = await readText($, path)
    if (after === null || !isBudgeted(asset, path, after)) {
      $.ui.status(undefined)
      return ran
    }

    const now = measure(asset.budget, after)
    $.ui.status(label(path, now))

    const wasOver = before !== null && measure(asset.budget, before).level === 'over'
    if (now.level === 'over' && !now.isExempt && !wasOver) {
      const key = path.replace(/\\/g, '/')
      if (!(await read($, toasted)).includes(key)) {
        await update($, toasted, list => [...(list ?? []), key])
        $.ui.toast(
          `${label(path, now)}: over its ${now.budget}-line body budget. Trim it, move reference behind a pointer, or state why in the file.`,
        )
      }
    }
    return ran
  })
}
