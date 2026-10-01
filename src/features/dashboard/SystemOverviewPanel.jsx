import FreshnessBadge from '../../components/FreshnessBadge.jsx'
import Panel from '../../components/Panel.jsx'
import StatusIndicator from '../../components/StatusIndicator.jsx'
import { sourceById } from '../../config/sources.config.js'
import { formatDateTime } from '../../utils/format.js'

function SystemOverviewPanel({ status }) {
  const { activeSource, ats } = status
  const active = sourceById[activeSource]
  const last = ats.lastTransition

  return (
    <Panel title="System overview" meta={<FreshnessBadge timestamp={status.timestamp} />}>
      <dl className="grid gap-4">
        <div>
          <dt className="text-xs text-muted">Active source</dt>
          <dd className="mt-1 flex items-center gap-2">
            {active && (
              <span aria-hidden="true" className="h-6 w-1.5 rounded-full" style={{ background: `var(${active.colorVar})` }} />
            )}
            <span className="text-2xl font-semibold text-text">
              {ats.transitioning ? 'Switching…' : active?.longLabel ?? 'None'}
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">ATS state</dt>
          <dd className="mt-1">
            {ats.transitioning ? (
              <StatusIndicator tone="info" label="Transition in progress" />
            ) : (
              <StatusIndicator tone="ok" label="Stable" />
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Last transition</dt>
          <dd className="mt-1 text-sm text-text">
            {last ? (
              <>
                {sourceById[last.from]?.label ?? last.from} → {sourceById[last.to]?.label ?? last.to}
                <span className="block text-xs text-subtle">{formatDateTime(last.timestamp)}</span>
              </>
            ) : (
              <span className="text-subtle">No transition recorded</span>
            )}
          </dd>
        </div>
      </dl>
    </Panel>
  )
}

export default SystemOverviewPanel
