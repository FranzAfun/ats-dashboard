/**
 * Geometry of the power-flow diagram (viewBox units). Kept separate from
 * the component so the flow paths and label positions are testable.
 */
export const WIDTH = 324
export const HEIGHT = 300
export const NODE_W = 100
export const NODE_H = 56
export const SOURCE_Y = 12
export const ATS = { x: 112, y: 128, w: 100, h: 48 }
export const LOAD = { x: 102, y: 236, w: 120, h: 58 }

export const sourceX = (index) => 2 + index * (NODE_W + 10)

/** Cubic path from a source node (by index) into the top of the ATS. */
export function sourceFlow(index) {
  const p0 = { x: sourceX(index) + NODE_W / 2, y: SOURCE_Y + NODE_H }
  const p3 = { x: ATS.x + ATS.w / 2 + (index - 1) * 30, y: ATS.y }
  const p1 = { x: p0.x, y: p0.y + 40 }
  const p2 = { x: p3.x, y: p3.y - 40 }
  // Point on the curve at t = 0.5: (p0 + 3p1 + 3p2 + p3) / 8.
  const mid = {
    x: (p0.x + 3 * p1.x + 3 * p2.x + p3.x) / 8,
    y: (p0.y + 3 * p1.y + 3 * p2.y + p3.y) / 8,
  }
  return {
    d: `M${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`,
    mid,
  }
}

/** Approximate pill width for a value label at the diagram font size. */
export function labelWidth(text) {
  return Math.round(String(text).length * 8.2 + 18)
}
