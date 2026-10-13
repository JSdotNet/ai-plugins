import { expect, test } from 'claude-code/testing'

import { colorFor, emailFromContext, formatReset, usageColor, weekFrom } from '../hooks/account-bar'

test('reads the email from the userEmail context block', () => {
  expect(emailFromContext("The user's email address is job@example.com. Use it only to identify the user.")).toBe('job@example.com')
  expect(emailFromContext('no address here')).toBe(undefined)
})

test('gives each account a stable colour the bar never uses', () => {
  expect(colorFor('a@example.com')).toBe(colorFor('A@example.com'))
  for (const email of ['a@x.com', 'b@y.org', 'work@corp.com', 'job@outlook.com']) {
    expect(['#00c800', '#ffc800', '#ff0000']).not.toContain(colorFor(email))
  }
})

test('picks the seven-day window', () => {
  expect(weekFrom([{ kind: 'five_hour', percentUsed: 40 }, { kind: 'seven_day', percentUsed: 16, resetsAt: '2026-10-15T15:00:00Z' }]))
    .toEqual({ percentUsed: 16, resetsAt: '2026-10-15T15:00:00Z' })
  expect(weekFrom([{ kind: 'five_hour', percentUsed: 40 }])).toBe(null)
})

test('runs the bar from green through yellow to red', () => {
  expect(usageColor(0)).toBe('#00c800')
  expect(usageColor(50)).toBe('#ffc800')
  expect(usageColor(100)).toBe('#ff0000')
  expect(usageColor(150)).toBe('#ff0000')
})

test('formats the reset moment', () => {
  expect(formatReset(undefined)).toBe('')
  expect(formatReset('not a date')).toBe('')
  expect(formatReset('2026-10-15T15:00:00Z')).toMatch(/^resets (Sun|Mon|Tue|Wed|Thu|Fri|Sat) \d\d:\d\d$/)
})
