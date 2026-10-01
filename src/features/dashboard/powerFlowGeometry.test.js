import { describe, expect, it } from 'vitest'
import { ATS, NODE_H, SOURCE_Y, WIDTH, labelWidth, sourceFlow } from './powerFlowGeometry.js'

describe('power-flow geometry', () => {
  it('places each flow label between its source and the ATS', () => {
    for (const index of [0, 1, 2]) {
      const { mid } = sourceFlow(index)
      expect(mid.y).toBeGreaterThan(SOURCE_Y + NODE_H)
      expect(mid.y).toBeLessThan(ATS.y)
    }
  })

  it('gives each source a distinct label position', () => {
    const xs = [0, 1, 2].map((i) => sourceFlow(i).mid.x)
    expect(new Set(xs).size).toBe(3)
    expect(xs[0]).toBeLessThan(xs[1])
    expect(xs[1]).toBeLessThan(xs[2])
  })

  it('keeps a typical value label inside the diagram', () => {
    const width = labelWidth('99.99 kW')
    for (const index of [0, 2]) {
      const { mid } = sourceFlow(index)
      expect(mid.x - width / 2).toBeGreaterThanOrEqual(0)
      expect(mid.x + width / 2).toBeLessThanOrEqual(WIDTH)
    }
  })
})
