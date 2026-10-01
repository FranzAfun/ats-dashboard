import { useState, useSyncExternalStore } from 'react'
import { useElementWidth } from '../../hooks/useElementWidth.js'
import { powerHistory } from '../../services/telemetry/powerHistory.js'
import { niceTicks, splitAtGaps } from '../../utils/chartScale.js'
import { formatNumber, formatTime } from '../../utils/format.js'

const HEIGHT = 180
const MARGIN = { top: 10, right: 12, bottom: 26, left: 44 }

/**
 * Live trend of load power from samples received in this session.
 * Single series (no legend; the title names it), 2px line, hairline grid,
 * crosshair tooltip on hover/focus and a text summary.
 */
function LoadTrendChart() {
  const history = useSyncExternalStore(powerHistory.subscribe, powerHistory.getSnapshot)
  const [containerRef, width] = useElementWidth()
  const [active, setActive] = useState(null)

  const points = history.map((s) => ({ t: Date.parse(s.timestamp), value: s.value === null ? null : s.value / 1000 }))
  const values = points.filter((p) => p.value !== null).map((p) => p.value)

  if (values.length < 2) {
    return <p className="text-sm text-subtle">Collecting samples… The trend appears after a few telemetry updates.</p>
  }

  const ticks = niceTicks(Math.max(...values))
  const top = ticks[ticks.length - 1]
  const t0 = points[0].t
  const t1 = points[points.length - 1].t
  const plotW = Math.max(0, width - MARGIN.left - MARGIN.right)
  const plotH = HEIGHT - MARGIN.top - MARGIN.bottom
  const x = (t) => MARGIN.left + (t1 === t0 ? 0 : ((t - t0) / (t1 - t0)) * plotW)
  const y = (v) => MARGIN.top + plotH - (v / top) * plotH
  const latest = values[values.length - 1]
  const activePoint = active === null ? null : points[active]

  function locate(clientX, rect) {
    const relative = clientX - rect.left
    let best = 0
    points.forEach((p, i) => {
      if (Math.abs(x(p.t) - relative) < Math.abs(x(points[best].t) - relative)) best = i
    })
    setActive(best)
  }

  const summary = `Load power since ${formatTime(new Date(t0).toISOString())}: latest ${formatNumber(latest, 2)} kW, minimum ${formatNumber(Math.min(...values), 2)} kW, maximum ${formatNumber(Math.max(...values), 2)} kW.`

  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs text-muted">{summary}</p>
      <div ref={containerRef} className="relative w-full">
        {width > 0 && (
          <svg
            width={width}
            height={HEIGHT}
            role="img"
            aria-label={summary}
            tabIndex={0}
            className="outline-none focus-visible:outline-2 focus-visible:outline-accent"
            onPointerMove={(e) => locate(e.clientX, e.currentTarget.getBoundingClientRect())}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(points.length - 1)}
            onBlur={() => setActive(null)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') setActive((i) => Math.max(0, (i ?? points.length - 1) - 1))
              if (e.key === 'ArrowRight') setActive((i) => Math.min(points.length - 1, (i ?? 0) + 1))
            }}
          >
            {ticks.map((tick) => (
              <g key={tick}>
                <line x1={MARGIN.left} x2={width - MARGIN.right} y1={y(tick)} y2={y(tick)} stroke="var(--color-border)" strokeWidth="1" />
                <text x={MARGIN.left - 8} y={y(tick)} dy="0.32em" textAnchor="end" fontSize="11" fill="var(--color-subtle)">
                  {formatNumber(tick, tick < 10 ? 1 : 0)}
                </text>
              </g>
            ))}
            <text x={MARGIN.left} y={HEIGHT - 8} fontSize="11" fill="var(--color-subtle)">
              {formatTime(new Date(t0).toISOString())}
            </text>
            <text x={width - MARGIN.right} y={HEIGHT - 8} textAnchor="end" fontSize="11" fill="var(--color-subtle)">
              {formatTime(new Date(t1).toISOString())}
            </text>
            {splitAtGaps(points).map((segment) => (
              <polyline
                key={segment[0].t}
                points={segment.map((p) => `${x(p.t)},${y(p.value)}`).join(' ')}
                fill="none"
                stroke="var(--color-text)"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}
            {activePoint && (
              <g>
                <line x1={x(activePoint.t)} x2={x(activePoint.t)} y1={MARGIN.top} y2={MARGIN.top + plotH} stroke="var(--color-control)" strokeWidth="1" />
                {activePoint.value !== null && (
                  <circle cx={x(activePoint.t)} cy={y(activePoint.value)} r="4" fill="var(--color-text)" stroke="var(--color-surface)" strokeWidth="2" />
                )}
              </g>
            )}
          </svg>
        )}
        {activePoint && (
          <div
            role="status"
            className="pointer-events-none absolute z-10 rounded-md border border-control bg-raised px-3 py-2 text-xs shadow-lg"
            style={{
              left: Math.min(Math.max(0, x(activePoint.t) - 60), Math.max(0, width - 130)),
              // Keep the tooltip off the line so the hovered point stays visible.
              top:
                activePoint.value !== null && y(activePoint.value) < MARGIN.top + plotH / 2
                  ? MARGIN.top + plotH - 48
                  : MARGIN.top,
            }}
          >
            <p className="font-semibold text-text tabular-nums">
              {activePoint.value === null ? 'Unavailable' : `${formatNumber(activePoint.value, 2)} kW`}
            </p>
            <p className="text-muted">{formatTime(new Date(activePoint.t).toISOString())}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoadTrendChart
