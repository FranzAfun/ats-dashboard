import { useFreshness } from '../hooks/useFreshness.js'
import { formatTime } from '../utils/format.js'
import StatusIndicator from './StatusIndicator.jsx'

const display = {
  live: { tone: 'ok', label: 'Live' },
  stale: { tone: 'warning', label: 'Stale' },
  disconnected: { tone: 'offline', label: 'Disconnected' },
  unknown: { tone: 'offline', label: 'No timestamp' },
}

/** Shows whether telemetry is live, stale or disconnected. */
function FreshnessBadge({ timestamp }) {
  const freshness = useFreshness(timestamp)
  const { tone, label } = display[freshness]
  const time = formatTime(timestamp)
  return (
    <span className="inline-flex items-center gap-2" title={time ? `Last update ${time}` : undefined}>
      <StatusIndicator tone={tone} label={label} />
      {time && freshness !== 'live' && <span className="text-xs text-subtle">at {time}</span>}
    </span>
  )
}

export default FreshnessBadge
