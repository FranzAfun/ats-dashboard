import { describe, expect, it } from 'vitest'
import { formatCurrency, formatDuration, formatNumber, formatPower } from './format.js'

describe('format', () => {
  it('returns null for missing values instead of zero', () => {
    expect(formatNumber(null)).toBeNull()
    expect(formatNumber(undefined)).toBeNull()
    expect(formatCurrency(null)).toBeNull()
    expect(formatPower(null).value).toBeNull()
  })
  it('formats real zero as zero', () => {
    expect(formatNumber(0, 0)).toBe('0')
  })
  it('switches power to kW from 1000 W', () => {
    expect(formatPower(950)).toEqual({ value: '950', unit: 'W' })
    expect(formatPower(2949.1)).toEqual({ value: '2.95', unit: 'kW' })
  })
  it('formats durations', () => {
    expect(formatDuration(820)).toBe('820 ms')
    expect(formatDuration(1450)).toBe('1.45 s')
  })
})
