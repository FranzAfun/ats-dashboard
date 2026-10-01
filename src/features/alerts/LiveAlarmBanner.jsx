import { Link, useLocation } from 'react-router-dom'
import StatusIndicator from '../../components/StatusIndicator.jsx'
import { paths } from '../../config/paths.js'
import { useAlarms } from '../../hooks/useTelemetry.js'
import { severityLabel, sortAlarms } from './alarmPresentation.js'

/**
 * Live alarm banner (FR-ALERT-001). Shown in the page flow above the
 * content so it never covers controls or telemetry. Part of the Alerts
 * feature, so it requires Alerts access.
 */
function LiveAlarmBanner() {
  const alarms = useAlarms()
  const { pathname } = useLocation()
  const active = alarms.status === 'ready' ? sortAlarms(alarms.data.filter((a) => a.active)) : []

  return (
    <div aria-live="polite">
      {active.length > 0 && (
        <div
          className={`mb-4 animate-enter rounded-md border border-l-4 bg-surface px-4 py-3 motion-reduce:animate-none ${
            active[0].severity === 'critical' ? 'border-border border-l-critical' : 'border-border border-l-warning'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <p className="text-sm font-semibold text-text">
              {active.length === 1 ? '1 active alarm' : `${active.length} active alarms`}
            </p>
            {pathname !== paths.alerts && (
              <Link
                to={paths.alerts}
                className="inline-flex min-h-11 items-center text-sm font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                View alerts
              </Link>
            )}
          </div>
          <ul className="mt-1 grid gap-1">
            {active.slice(0, 3).map((alarm) => (
              <li key={`${alarm.id}-${alarm.timestamp}`} className="flex flex-wrap items-center gap-x-2">
                <StatusIndicator tone={alarm.severity} label={severityLabel[alarm.severity]} />
                <span className="text-sm text-text">{alarm.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default LiveAlarmBanner
