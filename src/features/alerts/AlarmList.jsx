import StatusIndicator from '../../components/StatusIndicator.jsx'
import { formatDateTime } from '../../utils/format.js'
import { severityLabel } from './alarmPresentation.js'

function AlarmList({ alarms }) {
  return (
    <ul className="grid gap-2">
      {alarms.map((alarm) => (
        <li
          key={`${alarm.id}-${alarm.timestamp}`}
          className={`rounded-md border bg-surface px-4 py-3 ${alarm.active ? 'border-control' : 'border-border'}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <StatusIndicator tone={alarm.severity} label={severityLabel[alarm.severity]} />
            <span className="text-xs text-subtle">{formatDateTime(alarm.timestamp)}</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-text">{alarm.title}</p>
          <p className="text-sm text-muted">{alarm.message}</p>
          <p className="mt-1 text-xs text-subtle">
            Status: <span className={alarm.active ? 'font-semibold text-text' : ''}>{alarm.active ? 'Active' : 'Cleared'}</span>
          </p>
        </li>
      ))}
    </ul>
  )
}

export default AlarmList
