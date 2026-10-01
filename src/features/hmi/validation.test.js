import { describe, expect, it } from 'vitest'
import { parseCostInput } from './validation.js'

describe('parseCostInput', () => {
  it('accepts positive numbers with up to two decimals', () => {
    expect(parseCostInput('85')).toEqual({ value: 85, error: null })
    expect(parseCostInput(' 12.50 ')).toEqual({ value: 12.5, error: null })
  })
  it('rejects empty, negative, zero, malformed and over-precise input', () => {
    for (const input of ['', '-5', '0', '0.00', 'abc', '1e3', '1.234', '1,5']) {
      expect(parseCostInput(input).error).not.toBeNull()
    }
  })
})
