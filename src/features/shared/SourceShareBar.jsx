import { sources } from '../../config/sources.config.js'
import { formatPercent } from '../../utils/format.js'

/**
 * Horizontal part-to-whole bar for the three sources with a labelled
 * legend (identity is never color-only). Values are percentages.
 */
function SourceShareBar({ usage, label = 'Source usage' }) {
  const items = sources.map((s) => ({ ...s, value: usage?.[s.id] ?? null }))
  const known = items.filter((i) => typeof i.value === 'number' && i.value > 0)

  return (
    <figure className="min-w-0">
      <figcaption className="sr-only">{label}</figcaption>
      <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-sm bg-canvas" aria-hidden="true">
        {known.map((item) => (
          <span
            key={item.id}
            className="h-full first:rounded-l-sm last:rounded-r-sm"
            style={{ width: `${item.value}%`, background: `var(${item.colorVar})` }}
            title={`${item.label}: ${formatPercent(item.value)}`}
          />
        ))}
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-2">
        {items.map((item) => (
          <div key={item.id} className="min-w-0">
            <dt className="flex items-center gap-1.5 text-xs text-muted">
              <span aria-hidden="true" className="size-2 shrink-0 rounded-sm" style={{ background: `var(${item.colorVar})` }} />
              <span className="truncate">{item.label}</span>
            </dt>
            <dd className="text-sm font-semibold text-text tabular-nums">
              {formatPercent(item.value) ?? <span className="text-subtle">—</span>}
            </dd>
          </div>
        ))}
      </dl>
    </figure>
  )
}

export default SourceShareBar
