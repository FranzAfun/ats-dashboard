import StatusIndicator from '../../components/StatusIndicator.jsx'
import { useConnectionState } from '../../hooks/useTelemetry.js'

/**
 * Warns that information on screen may be out of date because the
 * integration is not connected. For data without a per-item timestamp.
 */
function ConnectionNotice({ subject = 'Information' }) {
  const connection = useConnectionState()
  if (connection === 'connected' || connection === 'connecting') return null
  return (
    <div role="status" className="rounded-md border border-warning/60 bg-surface px-4 py-3 text-sm">
      <StatusIndicator tone="warning" label="Not live" />
      <p className="mt-1 text-muted">
        The ATS integration is {connection === 'error' ? 'reporting an error' : 'disconnected'}. {subject} below may
        be out of date.
      </p>
    </div>
  )
}

export default ConnectionNotice
