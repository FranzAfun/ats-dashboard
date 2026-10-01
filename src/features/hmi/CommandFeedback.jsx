import LoadingState from '../../components/LoadingState.jsx'
import StatusIndicator from '../../components/StatusIndicator.jsx'
import { buttonClasses } from '../../components/buttonClasses.js'
import { formatTime } from '../../utils/format.js'

const finals = {
  applied: { tone: 'ok', label: 'Applied' },
  rejected: { tone: 'warning', label: 'Rejected' },
  failed: { tone: 'critical', label: 'Failed' },
}

/**
 * Command state feedback (FR-HMI-003/004). Success is only shown for an
 * "applied" response from the system.
 */
function CommandFeedback({ response, onDismiss }) {
  if (!response) return null

  if (!finals[response.status]) {
    return (
      <div aria-live="polite" className="rounded-md border border-border bg-raised px-3 py-2">
        <LoadingState
          size="inline"
          orb="working"
          message={response.status === 'accepted' ? 'Accepted — applying…' : 'Pending — waiting for the system…'}
        />
      </div>
    )
  }

  const final = finals[response.status]
  return (
    <div
      role={response.status === 'applied' ? 'status' : 'alert'}
      className={`rounded-md border border-border border-l-4 bg-raised px-3 py-2 ${
        response.status === 'applied' ? 'border-l-ok' : response.status === 'rejected' ? 'border-l-warning' : 'border-l-critical'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <StatusIndicator tone={final.tone} label={final.label} />
        <span className="text-xs text-subtle">{formatTime(response.timestamp)}</span>
      </div>
      <p className="mt-1 text-sm text-text">{response.message}</p>
      <button type="button" className={`${buttonClasses.secondary} mt-2`} onClick={onDismiss}>
        Dismiss
      </button>
    </div>
  )
}

export default CommandFeedback
