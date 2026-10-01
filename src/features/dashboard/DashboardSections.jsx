import { Link } from 'react-router-dom'
import { useCallback } from 'react'
import DataState from '../../components/DataState.jsx'
import FreshnessBadge from '../../components/FreshnessBadge.jsx'
import MetricValue from '../../components/MetricValue.jsx'
import Panel from '../../components/Panel.jsx'
import RequireAction from '../../components/access/RequireAction.jsx'
import StatusIndicator from '../../components/StatusIndicator.jsx'
import { paths } from '../../config/paths.js'
import { useAsyncData } from '../../hooks/useAsyncData.js'
import { useAlarms, usePowerTelemetry } from '../../hooks/useTelemetry.js'
import { analyticsService } from '../../services/analytics/analyticsService.js'
import { formatCurrency, formatDateTime, formatNumber, formatPower } from '../../utils/format.js'
import SourceShareBar from '../shared/SourceShareBar.jsx'

const linkClass =
  'inline-flex min-h-11 items-center text-sm font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export function PowerSummarySection() {
  const telemetry = usePowerTelemetry()
  return (
    <Panel
      title="Load"
      meta={telemetry.data && <FreshnessBadge timestamp={telemetry.data.timestamp} />}
      actions={<Link to={paths.power} className={linkClass}>Power details</Link>}
    >
      <DataState state={telemetry} loadingMessage="Retrieving live telemetry…" orb="listening">
        {({ load }) => {
          const power = formatPower(load.power)
          return (
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <MetricValue label="Power" value={power.value} unit={power.unit} />
              <MetricValue label="Voltage" value={formatNumber(load.voltage, 1)} unit="V" />
              <MetricValue label="Current" value={formatNumber(load.current, 2)} unit="A" />
              <MetricValue label="Power factor" value={formatNumber(load.powerFactor, 2)} />
            </dl>
          )
        }}
      </DataState>
    </Panel>
  )
}

export function AlertsSummarySection() {
  const alarms = useAlarms()
  return (
    <Panel title="Active alarms" actions={<Link to={paths.alerts} className={linkClass}>All alerts</Link>}>
      <DataState state={alarms} loadingMessage="Loading alarms…" isEmpty={() => false}>
        {(list) => {
          const active = list.filter((a) => a.active)
          if (active.length === 0) {
            return <StatusIndicator tone="ok" label="No active alarms" />
          }
          return (
            <ul className="grid gap-2">
              {active.slice(0, 3).map((alarm) => (
                <li key={`${alarm.id}-${alarm.timestamp}`} className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <StatusIndicator
                    tone={alarm.severity === 'info' ? 'info' : alarm.severity}
                    label={`${alarm.title} (${alarm.severity})`}
                  />
                  <span className="text-xs text-subtle">{formatDateTime(alarm.timestamp)}</span>
                </li>
              ))}
              {active.length > 3 && <li className="text-xs text-muted">+{active.length - 3} more</li>}
            </ul>
          )
        }}
      </DataState>
    </Panel>
  )
}

export function FinancialSummarySection() {
  const loadToday = useCallback(
    () => Promise.all([analyticsService.getEnergyAndCost('daily'), analyticsService.getSourceUsage('daily')]),
    [],
  )
  const data = useAsyncData(loadToday, 'financial-summary')

  return (
    <Panel title="Today's energy cost" actions={<Link to={paths.financial} className={linkClass}>Financial analytics</Link>}>
      <DataState
        state={data}
        orb="solving"
        loadingMessage="Calculating analytics…"
        isEmpty={(value) => !value?.[0]?.sources?.length}
        emptyTitle="No financial data for today"
      >
        {([energy, usage]) => (
          <div className="grid gap-4">
            <dl className="grid grid-cols-2 gap-4">
              <MetricValue label="Cost" value={formatCurrency(energy.totalCost, energy.currency)} />
              <MetricValue label="Energy" value={formatNumber(energy.totalEnergy, 1)} unit="kWh" />
            </dl>
            {usage && <SourceShareBar usage={usage} label="Source usage today" />}
          </div>
        )}
      </DataState>
    </Panel>
  )
}

export function HmiEntrySection() {
  return (
    <Panel title="HMI remote control">
      <p className="text-sm text-muted">
        View the active source and the configured input cost/day.
      </p>
      <RequireAction action="hmi.changeSource">
        <p className="mt-1 text-sm text-muted">You can request a source change.</p>
      </RequireAction>
      <Link to={paths.hmi} className={`${linkClass} mt-2`}>Open HMI controls</Link>
    </Panel>
  )
}
