import { describe, expect, test } from 'claude-code/testing'

import {
  addRead,
  chapterAddresses,
  devbookPlace,
  devbookRoot,
  globToRegExp,
  isMostOfFolder,
  markdownReadByShell,
  memoryImports,
  outlineOf,
  relativeTo,
  ruleGlobs,
  statusText,
  stripLineNumbers,
} from '../hooks/context-view/model'

describe('shell readers', () => {
  test('finds Markdown operands of reader verbs', () => {
    expect(markdownReadByShell('cat AGENTS.md')).toEqual(['AGENTS.md'])
    expect(markdownReadByShell('sed -n 1,40p "docs/a b.md" | head')).toEqual(['docs/a b.md'])
    expect(markdownReadByShell('Get-Content -Path README.md')).toEqual(['README.md'])
  })

  test('ignores writes, redirect targets and globs', () => {
    expect(markdownReadByShell('sed -i s/a/b/ notes.md')).toEqual([])
    expect(markdownReadByShell('cat a.txt > out.md')).toEqual([])
    expect(markdownReadByShell('cat docs/*.md')).toEqual([])
    expect(markdownReadByShell('git add README.md')).toEqual([])
  })
})

describe('paths', () => {
  test('relativeTo folds Windows spellings under cwd', () => {
    expect(relativeTo('D:\\Repos\\x', 'D:\\Repos\\x\\.devbook\\arc42\\a.md')).toBe('.devbook/arc42/a.md')
    expect(relativeTo('/r', 'docs/../README.md')).toBe('README.md')
    expect(relativeTo('/r', '/elsewhere/a.md')).toBe('/elsewhere/a.md')
  })

  test('strips the Read gutter', () => {
    expect(stripLineNumbers('     1\t# T\n     2\tbody')).toBe('# T\nbody')
  })
})

describe('rules', () => {
  test('reads paths from a list, inline, or none', () => {
    expect(ruleGlobs('---\npaths:\n  - "plugins/*/agents/**/*.agent.md"\n---\nbody')).toEqual([
      'plugins/*/agents/**/*.agent.md',
    ])
    expect(ruleGlobs('---\npaths: ["a/*.md", "b/**"]\n---')).toEqual(['a/*.md', 'b/**'])
    expect(ruleGlobs('# no frontmatter')).toEqual([])
  })

  test('globs match the whole relative path', () => {
    const re = globToRegExp('plugins/*/agents/**/*.agent.md')
    expect(re.test('plugins/qa/agents/qa.agent.md')).toBe(true)
    expect(re.test('plugins/qa/agents/sub/qa.agent.md')).toBe(true)
    expect(re.test('plugins/qa/skills/qa.agent.md')).toBe(false)
    expect(globToRegExp('**/*.{md,mdx}').test('README.mdx')).toBe(true)
  })
})

describe('memory imports', () => {
  test('resolves @ imports outside code and skips emails', () => {
    const text = '@AGENTS.md\n\nSee `@not/this.md` and mail a@b.com.\n```\n@nor/this.md\n```\n@docs/more.md'
    expect(memoryImports(text, '/r/CLAUDE.md')).toEqual(['/r/AGENTS.md', '/r/docs/more.md'])
  })
})

describe('devbook lens', () => {
  test('places files by folder and flags _meta', () => {
    expect(devbookPlace('.devbook/arc42/adr/x.md', true)).toEqual({ folder: 'arc42', isMeta: false })
    expect(devbookPlace('.devbook/_meta/index.md', false)).toEqual({ folder: '_meta', isMeta: true })
    expect(devbookPlace('docs/domain/orders.md', true)).toEqual({ folder: 'domain', isMeta: false })
    expect(devbookPlace('README.md', false)).toBeUndefined()
    expect(devbookRoot('.devbook/arc42/adr/x.md', 'arc42')).toBe('.devbook/arc42')
  })

  test('addresses chapters by heading slug', () => {
    const text = '# Title\n\n```meta\nrelated: []\n```\n\n## One File, Two Hosts\n\n```meta\nx: 1\n```\n'
    expect(chapterAddresses('.devbook/arc42/08.md', text)).toEqual([
      '.devbook/arc42/08.md',
      '.devbook/arc42/08.md#one-file-two-hosts',
    ])
  })

  test('most of a folder means over half of at least three', () => {
    expect(isMostOfFolder(2, 3)).toBe(false)
    expect(isMostOfFolder(3, 5)).toBe(true)
    expect(isMostOfFolder(3, 6)).toBe(false)
  })
})

test('addRead counts repeats, sums tokens and keeps each read', () => {
  const one = { path: 'a.md', folder: '.', tokens: 10, hasMeta: false, chapters: [], via: 'Read', outline: ['A'], rules: ['r1'] }
  const first = { at: 1, turn: 1, via: 'Read', tokens: 10 }
  const second = { at: 2, turn: 2, via: 'Bash', tokens: 5, range: 'lines 1–5' }
  const twice = addRead(addRead([], one, first), { ...one, tokens: 5, via: 'Bash', outline: [], rules: ['r2'] }, second)
  expect(twice).toEqual([
    { ...one, tokens: 15, count: 2, via: 'Bash', outline: ['A'], rules: ['r1', 'r2'], events: [first, second] },
  ])
})

test('outlineOf indents headings and skips code fences', () => {
  expect(outlineOf('# T\n\n```md\n# not a heading\n```\n## Sub ##\n### Deep')).toEqual(['T', '  Sub', '    Deep'])
})

test('status text', () => {
  expect(statusText(41.6, 3)).toBe('ctx 42% · 3 md')
  expect(statusText(undefined, 0)).toBe('ctx –% · 0 md')
})
