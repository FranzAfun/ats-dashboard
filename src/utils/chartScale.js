/** Rounds a maximum up to a clean axis value and returns evenly spaced ticks. */
export function niceTicks(max, count = 4) {
  if (!Number.isFinite(max) || max <= 0) return [0, 1]
  const rawStep = max / count
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const residual = rawStep / magnitude
  const step = (residual > 5 ? 10 : residual > 2 ? 5 : residual > 1 ? 2 : 1) * magnitude
  const top = Math.ceil(max / step) * step
  const ticks = []
  for (let value = 0; value <= top + step / 2; value += step) ticks.push(Math.round(value * 1e6) / 1e6)
  return ticks
}
