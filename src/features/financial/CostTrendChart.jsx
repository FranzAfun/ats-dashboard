import { useState } from 'react'
import { sources } from '../../config/sources.config.js'
import { useElementWidth } from '../../hooks/useElementWidth.js'
import { niceTicks } from '../../utils/chartScale.js'
import { formatCurrency, formatNumber, formatPeriodLabel } from '../../utils/format.js'

const HEIGHT = 240
const MARGIN = { top: 12, right: 8, bottom: 28, left: 52 }
const MAX_BAR = 24
const GAP = 2

function columnPath(x, y, width, height, roundTop) {
  if (height <= 0) return ''
  const r = roundTop ? Math.min(4, width / 2, height) : 0
  return `M${x} ${y + height} V${y + r} Q${x} ${y} ${x + r} ${y} H${x + width - r} Q${x + width} ${y} ${x + width} ${y + r} V${y + height} Z`
}

/**
 * Stacked column chart of cost per period, by source. One value axis,
 * hairline gridlines, 2px surface gaps between segments, legend above,
 * hover/focus tooltip and a table alternative (rendered by the parent).
 */
function CostTrendChart({ trend }) {
  const [containerRef, width] = useElementWidth()
  const [active, setActive] = useState(null)

  const points = trend.total.map((point, index) => ({
    timestamp: point.timestamp,
    total: point.value,
    values: Object.fromEntries(sources.map((s) => [s.id, trend.bySource[s.id]?.[index]?.value ?? 0])),
  }))

  const ticks = niceTicks(Math.max(...points.map((p) => p.total)))
  const top = ticks[ticks.length - 1]
  const plotWidth = Math.max(0, width - MARGIN.left - MARGIN.right)
  const plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom
  const band = points.length ? plotWidth / points.length : 0
  const barWidth = Math.min(MAX_BAR, Math.max(4, band * 0.6))
  const y = (value) => MARGIN.top + plotHeight - (value / top) * plotHeight
  const labelEvery = Math.max(1, Math.ceil(points.length / Math.max(1, Math.floor(plotWidth / 56))))
  const activePoint = active === null ? null : points[active]

  return (
    <div className="min-w-0">
      <ul className="mb-3 flex flex-wrap gap-x-4 gap-y-1" aria-label="Legend">
        {sources.map((s) => (
          <li key={s.id} className="flex items-center gap-1.5 text-xs text-muted">
            <span aria-hidden="true" className="size-2.5 rounded-sm" style={{ background: `var(${s.colorVar})` }} />
            {s.label}
          </li>
        ))}
      </ul>

      <div ref={containerRef} className="relative w-full">
        {width > 0 && (
          <svg
            width={width}
            height={HEIGHT}
            role="img"
            aria-label={`Cost trend by source, ${points.length} periods. Use the table view for exact values.`}
            onPointerLeave={() => setActive(null)}
          >
            {ticks.map((tick) => (
              <g key={tick}>
                <line x1={MARGIN.left} x2={width - MARGIN.right} y1={y(tick)} y2={y(tick)} stroke="var(--color-border)" strokeWidth="1" />
                <text x={MARGIN.left - 8} y={y(tick)} dy="0.32em" textAnchor="end" fontSize="11" fill="var(--color-subtle)" className="tabular-nums">
                  {formatNumber(tick, 0)}
                </text>
              </g>
            ))}

            {points.map((point, index) => {
              const cx = MARGIN.left + band * index + band / 2
              const x = cx - barWidth / 2
              let cursor = point.total
              const stack = sources.map((s) => {
                const value = point.values[s.id]
                const yTop = y(cursor)
                const height = Math.max(0, y(cursor - value) - yTop)
                cursor -= value
                return { id: s.id, colorVar: s.colorVar, yTop, height }
              })
              const topIndex = 0
              return (
                <g key={point.timestamp}>
                  {stack.map((seg, i) => (
                    <path
                      key={seg.id}
                      d={columnPath(x, seg.yTop + (i === topIndex ? 0 : GAP), barWidth, seg.height - (i === topIndex ? 0 : GAP), i === topIndex)}
                      fill={`var(${seg.colorVar})`}
                      opacity={active === null || active === index ? 1 : 0.45}
                    />
                  ))}
                  <rect
                    x={MARGIN.left + band * index}
                    y={MARGIN.top}
                    width={band}
                    height={plotHeight}
                    fill="transparent"
                    tabIndex={0}
                    aria-label={`${formatPeriodLabel(point.timestamp, trend.period)}: total ${formatCurrency(point.total, trend.currency)}`}
                    onPointerEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    onBlur={() => setActive(null)}
                    className="outline-none focus-visible:stroke-accent focus-visible:stroke-2"
                  />
                  {index % labelEvery === 0 && (
                    <text x={cx} y={HEIGHT - 8} textAnchor="middle" fontSize="11" fill="var(--color-subtle)">
                      {formatPeriodLabel(point.timestamp, trend.period)}
                    </text>
                  )}
                </g>
              )
            })}
            <line
              x1={MARGIN.left}
              x2={width - MARGIN.right}
              y1={y(0)}
              y2={y(0)}
              stroke="var(--color-control)"
              strokeWidth="1"
            />
          </svg>
        )}

        {activePoint && (
          <div
            role="status"
            className="pointer-events-none absolute top-0 z-10 w-44 rounded-md border border-control bg-raised p-3 text-xs shadow-lg"
            style={{
              left: Math.min(
                Math.max(0, MARGIN.left + band * active + band / 2 - 88),
                Math.max(0, width - 176),
              ),
            }}
          >
            <p className="font-semibold text-text">{formatPeriodLabel(activePoint.timestamp, trend.period)}</p>
            <dl className="mt-1 grid gap-0.5">
              {sources.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-2">
                  <dt className="flex items-center gap-1.5 text-muted">
                    <span aria-hidden="true" className="size-2 rounded-sm" style={{ background: `var(${s.colorVar})` }} />
                    {s.label}
                  </dt>
                  <dd className="font-semibold text-text tabular-nums">{formatNumber(activePoint.values[s.id], 2)}</dd>
                </div>
              ))}
              <div className="mt-1 flex justify-between gap-2 border-t border-border pt-1">
                <dt className="text-muted">Total ({trend.currency})</dt>
                <dd className="font-semibold text-text tabular-nums">{formatNumber(activePoint.total, 2)}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  )
}

export default CostTrendChart
