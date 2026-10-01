import { useConnectionState } from '../hooks/useTelemetry.js'
import StatusIndicator from './StatusIndicator.jsx'

const states = {
  connecting: { tone: 'info', label: 'Connecting' },
  connected: { tone: 'ok', label: 'Connected' },
  disconnected: { tone: 'offline', label: 'Disconnected' },
  error: { tone: 'critical', label: 'Integration error' },
}

/** System connection state (05_FRONTEND_ARCHITECTURE.md §29). */
function ConnectionStatus() {
  const connection = useConnectionState()
  const state = states[connection] ?? states.error
  return (
    <span role="status" aria-live="polite">
      <span className="sr-only">ATS integration: </span>
      <StatusIndicator tone={state.tone} label={state.label} />
    </span>
  )
}

export default ConnectionStatus
