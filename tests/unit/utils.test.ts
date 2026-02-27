import { describe, it, expect } from 'vitest'
import { formatNumber, formatCurrency, formatPercent, slugToTitle, cn } from '@/lib/utils'

describe('formatNumber', () => {
  it('formats thousands with K suffix', () => {
    expect(formatNumber(1000)).toBe('1.0K')
    expect(formatNumber(1500)).toBe('1.5K')
    expect(formatNumber(10000)).toBe('10.0K')
  })

  it('formats millions with M suffix', () => {
    expect(formatNumber(1000000)).toBe('1.0M')
    expect(formatNumber(2500000)).toBe('2.5M')
  })

  it('formats small numbers without suffix', () => {
    expect(formatNumber(100)).toBe('100')
    expect(formatNumber(999)).toBe('999')
  })

  it('formats zero', () => {
    expect(formatNumber(0)).toBe('0')
  })
})

describe('formatCurrency', () => {
  it('formats USD by default', () => {
    expect(formatCurrency(100)).toBe('$100')
    expect(formatCurrency(1000)).toBe('$1,000')
  })

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0')
  })
})

describe('formatPercent', () => {
  it('formats positive percentages with + sign', () => {
    expect(formatPercent(10)).toBe('+10.0%')
    expect(formatPercent(5.5)).toBe('+5.5%')
  })

  it('formats negative percentages', () => {
    expect(formatPercent(-10)).toBe('-10.0%')
    expect(formatPercent(-5.5)).toBe('-5.5%')
  })

  it('formats zero', () => {
    expect(formatPercent(0)).toBe('+0.0%')
  })
})

describe('slugToTitle', () => {
  it('converts slug to title case', () => {
    expect(slugToTitle('hello-world')).toBe('Hello World')
    expect(slugToTitle('seo-overview')).toBe('Seo Overview')
  })

  it('handles single word', () => {
    expect(slugToTitle('dashboard')).toBe('Dashboard')
  })

  it('handles empty string', () => {
    expect(slugToTitle('')).toBe('')
  })
})

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('class1', 'class2')).toContain('class1')
    expect(cn('class1', 'class2')).toContain('class2')
  })

  it('handles conditional classes', () => {
    expect(cn('always', false && 'never')).toBe('always')
    expect(cn('always', true && 'sometimes')).toContain('sometimes')
  })

  it('handles undefined and null', () => {
    expect(cn('class1', undefined, null, 'class2')).toContain('class1')
    expect(cn('class1', undefined, null, 'class2')).toContain('class2')
  })
})
