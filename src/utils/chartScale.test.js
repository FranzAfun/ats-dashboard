import { describe, expect, it } from 'vitest'
import { niceTicks } from './chartScale.js'

describe('niceTicks', () => {
  it('produces clean ticks covering the maximum', () => {
    expect(niceTicks(267)).toEqual([0, 100, 200, 300])
    expect(niceTicks(7800)).toEqual([0, 2000, 4000, 6000, 8000])
  })
  it('handles empty data', () => {
    expect(niceTicks(0)).toEqual([0, 1])
  })
})
