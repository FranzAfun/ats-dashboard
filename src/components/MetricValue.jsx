/**
 * A labelled measurement. A missing value (null) is shown as an em dash
 * with an "unavailable" text alternative — never as zero.
 */
function MetricValue({ label, value, unit, size = 'md', className = '' }) {
  const missing = value === null || value === undefined || value === ''
  const valueSize = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-base' : 'text-xl'

  return (
    <div className={`min-w-0 ${className}`}>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 flex items-baseline gap-1">
        {missing ? (
          <>
            <span className={`${valueSize} font-semibold text-subtle`} aria-hidden="true">
              —
            </span>
            <span className="sr-only">Unavailable</span>
          </>
        ) : (
          <>
            <span className={`${valueSize} font-semibold text-text tabular-nums`}>{value}</span>
            {unit && <span className="text-xs text-muted">{unit}</span>}
          </>
        )}
      </dd>
    </div>
  )
}

export default MetricValue
