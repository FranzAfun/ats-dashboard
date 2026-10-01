import { describe, expect, it } from 'vitest'
import { niceTicks, splitAtGaps } from './chartScale.js'

describe('niceTicks', () => {
  it('produces clean ticks covering the maximum', () => {
    expect(niceTicks(267)).toEqual([0, 100, 200, 300])
    expect(niceTicks(7800)).toEqual([0, 2000, 4000, 6000, 8000])
  })
  it('handles empty data', () => {
    expect(niceTicks(0)).toEqual([0, 1])
  })
})

describe('splitAtGaps', () => {
  it('splits at missing values and never treats them as zero', () => {
    const v = (value) => ({ value })
    expect(splitAtGaps([v(1), v(2), v(null), v(3), v(null), v(null), v(4)])).toEqual([[v(1), v(2)], [v(3)], [v(4)]])
    expect(splitAtGaps([v(null)])).toEqual([])
  })
})
