import Panel from '../../components/Panel.jsx'
import StatusIndicator from '../../components/StatusIndicator.jsx'
import { sources } from '../../config/sources.config.js'
import { describeSourceState } from '../shared/sourceState.js'

function SourceStatusPanel({ status }) {
  return (
    <Panel title="Source status">
      <ul className="grid gap-3 sm:grid-cols-3">
        {sources.map((source) => {
          const state = status.sourceStatus[source.id]
          const display = describeSourceState(state, status.ats.transitioning)
          const active = display.label === 'Active'
          return (
            <li
              key={source.id}
              className={`relative overflow-hidden rounded-md border bg-raised px-4 py-3 ${active ? 'border-control' : 'border-border'}`}
            >
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1" style={{ background: `var(${source.colorVar})` }} />
              <p className="text-sm font-semibold text-text">{source.longLabel}</p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <StatusIndicator tone={display.tone} label={display.label} />
                <span className="text-xs text-subtle">
                  {state?.available === null ? 'Availability unknown' : state?.available ? 'Available' : 'Not available'}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}

export default SourceStatusPanel
