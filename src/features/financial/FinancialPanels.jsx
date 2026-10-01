import { useState } from 'react'
import MetricValue from '../../components/MetricValue.jsx'
import Panel from '../../components/Panel.jsx'
import StatusIndicator from '../../components/StatusIndicator.jsx'
import { buttonClasses } from '../../components/buttonClasses.js'
import { sourceById, sources } from '../../config/sources.config.js'
import {
  formatCurrency,
  formatDateTime,
  formatDuration,
  formatNumber,
  formatPeriodLabel,
} from '../../utils/format.js'
import SourceShareBar from '../shared/SourceShareBar.jsx'
import CostTrendChart from './CostTrendChart.jsx'

const periodNames = { daily: 'today', monthly: 'this month', yearly: 'this year' }

export function FinancialSummary({ period, energy, status }) {
  const tariff = status?.tariff
  return (
    <dl className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-surface p-4 md:grid-cols-4">
      <MetricValue
        label="Active source"
        value={status ? (status.ats.transitioning ? 'Switching…' : sourceById[status.activeSource]?.label) : null}
      />
      <MetricValue
        label="Live tariff"
        value={tariff ? formatNumber(tariff.rate, 2) : null}
        unit={tariff ? `${tariff.currency}/${tariff.unit}` : undefined}
      />
      <MetricValue label={`Energy consumption, ${periodNames[period]}`} value={formatNumber(energy.totalEnergy, 1)} unit="kWh" />
      <MetricValue label={`Total cost, ${periodNames[period]}`} value={formatCurrency(energy.totalCost, energy.currency)} />
    </dl>
  )
}

export function CostTrendPanel({ trend }) {
  const [showTable, setShowTable] = useState(false)
  return (
    <Panel
      title="Cost trend"
      description={`Cost per ${trend.period === 'daily' ? 'day' : trend.period === 'monthly' ? 'month' : 'year'} by source (${trend.currency})`}
      actions={
        <button type="button" className={buttonClasses.secondary} onClick={() => setShowTable((v) => !v)} aria-pressed={showTable}>
          {showTable ? 'Show chart' : 'Show table'}
        </button>
      }
    >
      {trend.total.length === 0 ? (
        <p className="text-sm text-subtle">No cost history is available for this period.</p>
      ) : showTable ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <caption className="sr-only">Cost per period by source</caption>
            <thead className="text-xs text-muted">
              <tr className="border-b border-border">
                <th scope="col" className="py-2 pr-4 font-medium">Period</th>
                {sources.map((s) => (
                  <th key={s.id} scope="col" className="py-2 pr-4 text-right font-medium">{s.label}</th>
                ))}
                <th scope="col" className="py-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {trend.total.map((point, index) => (
                <tr key={point.timestamp} className="border-b border-border last:border-0">
                  <th scope="row" className="py-2 pr-4 font-normal text-muted">{formatPeriodLabel(point.timestamp, trend.period)}</th>
                  {sources.map((s) => (
                    <td key={s.id} className="py-2 pr-4 text-right text-text">{formatNumber(trend.bySource[s.id]?.[index]?.value, 2)}</td>
                  ))}
                  <td className="py-2 text-right font-semibold text-text">{formatNumber(point.value, 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <CostTrendChart trend={trend} />
      )}
    </Panel>
  )
}

export function SourceUsagePanel({ usage, period }) {
  return (
    <Panel title="Source usage" description={`Share of usage per source, ${periodNames[period]}`}>
      {usage ? <SourceShareBar usage={usage} /> : <p className="text-sm text-subtle">Source usage is not available.</p>}
    </Panel>
  )
}

export function SourceCostsPanel({ energy, period }) {
  return (
    <Panel title="Energy-source costs" description={`Energy and cost per source, ${periodNames[period]}`}>
      {energy.sources.length === 0 ? (
        <p className="text-sm text-subtle">Source cost data is not available.</p>
      ) : (
        <ul className="grid gap-3">
          {energy.sources.map((row) => {
            const source = sourceById[row.source]
            return (
              <li key={row.source} className="relative grid grid-cols-2 gap-2 overflow-hidden rounded-md border border-border bg-raised py-3 pr-3 pl-4">
                <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1" style={{ background: `var(${source?.colorVar})` }} />
                <p className="col-span-2 text-sm font-semibold text-text">{source?.longLabel ?? row.source}</p>
                <dl className="contents">
                  <MetricValue size="sm" label="Energy" value={formatNumber(row.energy, 1)} unit={row.energyUnit} />
                  <MetricValue size="sm" label="Cost" value={formatCurrency(row.cost, row.currency)} />
                </dl>
              </li>
            )
          })}
        </ul>
      )}
    </Panel>
  )
}

export function PowerFactorPanel({ losses, period }) {
  return (
    <Panel title="Power-factor losses" description={`Estimated financial impact, ${periodNames[period]}`}>
      {losses ? (
        <dl className="grid grid-cols-2 gap-4">
          <MetricValue label="Average power factor" value={formatNumber(losses.averagePowerFactor, 2)} />
          <MetricValue label="Target power factor" value={formatNumber(losses.targetPowerFactor, 2)} />
          <MetricValue className="col-span-2" size="lg" label="Estimated loss" value={formatCurrency(losses.estimatedLoss, losses.currency)} />
        </dl>
      ) : (
        <p className="text-sm text-subtle">Power-factor loss data is not available.</p>
      )}
    </Panel>
  )
}

export function TransitionMetricsPanel({ metrics, events }) {
  return (
    <Panel title="ATS transition metrics">
      {metrics ? (
        <div className="grid gap-4">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <MetricValue label="Total transitions" value={formatNumber(metrics.totalTransitions, 0)} />
            <MetricValue label="Last dead time" value={formatDuration(metrics.deadTimeMs)} />
            <MetricValue label="Last switch time" value={formatDuration(metrics.lastSwitchTimeMs)} />
            <div>
              <dt className="text-xs text-muted">Interlock</dt>
              <dd className="mt-1">
                {metrics.interlockViolation ? (
                  <StatusIndicator tone="critical" label="Violation" />
                ) : (
                  <StatusIndicator tone="ok" label="No violation" />
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Outage</dt>
              <dd className="mt-1">
                {metrics.prolongedOutage ? (
                  <StatusIndicator tone="critical" label="Prolonged outage" />
                ) : (
                  <StatusIndicator tone="ok" label="None" />
                )}
              </dd>
            </div>
          </dl>
          <TransitionEvents events={events} />
        </div>
      ) : (
        <p className="text-sm text-subtle">Transition metrics are not available.</p>
      )}
    </Panel>
  )
}

function TransitionEvents({ events }) {
  if (!events?.length) return <p className="text-sm text-subtle">No transition events recorded.</p>
  const recent = events.slice(0, 8)
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">Recent transitions</h3>
      <ul className="grid gap-2 md:hidden">
        {recent.map((e) => (
          <li key={e.timestamp} className="rounded-md border border-border bg-raised px-3 py-2 text-sm">
            <p className="font-medium text-text">
              {sourceById[e.from]?.label} → {sourceById[e.to]?.label}
            </p>
            <p className="text-xs text-subtle">{formatDateTime(e.timestamp)}</p>
            <p className="mt-1 text-xs text-muted">
              Dead time {formatDuration(e.deadTimeMs)} · Switch {formatDuration(e.switchTimeMs)} · {e.status}
            </p>
          </li>
        ))}
      </ul>
      <table className="hidden w-full text-left text-sm md:table">
        <caption className="sr-only">Recent ATS transitions</caption>
        <thead className="text-xs text-muted">
          <tr className="border-b border-border">
            <th scope="col" className="py-2 pr-4 font-medium">Time</th>
            <th scope="col" className="py-2 pr-4 font-medium">From</th>
            <th scope="col" className="py-2 pr-4 font-medium">To</th>
            <th scope="col" className="py-2 pr-4 text-right font-medium">Dead time</th>
            <th scope="col" className="py-2 pr-4 text-right font-medium">Switch time</th>
            <th scope="col" className="py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {recent.map((e) => (
            <tr key={e.timestamp} className="border-b border-border last:border-0">
              <td className="py-2 pr-4 text-muted">{formatDateTime(e.timestamp)}</td>
              <td className="py-2 pr-4 text-text">{sourceById[e.from]?.label}</td>
              <td className="py-2 pr-4 text-text">{sourceById[e.to]?.label}</td>
              <td className="py-2 pr-4 text-right text-text">{formatDuration(e.deadTimeMs)}</td>
              <td className="py-2 pr-4 text-right text-text">{formatDuration(e.switchTimeMs)}</td>
              <td className="py-2 text-muted capitalize">{e.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
