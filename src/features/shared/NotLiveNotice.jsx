import { useFreshness } from '../../hooks/useFreshness.js'
import { formatTime } from '../../utils/format.js'
import StatusIndicator from '../../components/StatusIndicator.jsx'

const messages = {
  stale: 'Telemetry is stale. Values below may not reflect the current system state.',
  disconnected: 'The integration is disconnected. Values below are the last received and are not live.',
  unknown: 'Telemetry has no timestamp. Values below cannot be confirmed as live.',
}

/** Warns when telemetry on screen is not live (FR §13). */
function NotLiveNotice({ timestamp }) {
  const freshness = useFreshness(timestamp)
  if (freshness === 'live') return null
  const time = formatTime(timestamp)
  return (
    <div role="status" className="rounded-md border border-warning/60 bg-surface px-4 py-3 text-sm text-text">
      <StatusIndicator tone="warning" label={freshness === 'stale' ? 'Stale data' : 'Not live'} />
      <p className="mt-1 text-muted">
        {messages[freshness]}
        {time && ` Last update at ${time}.`}
      </p>
    </div>
  )
}

export default NotLiveNotice
