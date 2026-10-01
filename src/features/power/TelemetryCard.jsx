import MetricValue from '../../components/MetricValue.jsx'
import StatusIndicator from '../../components/StatusIndicator.jsx'
import { formatNumber, formatPower } from '../../utils/format.js'

/**
 * Electrical telemetry for one source or the load. Fields that are not
 * provided are shown as unavailable, never as zero.
 */
function TelemetryCard({ title, colorVar, telemetry, status, wide = false }) {
  const power = formatPower(telemetry.power)

  return (
    <section className="relative min-w-0 overflow-hidden rounded-lg border border-border bg-surface">
      {colorVar && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1" style={{ background: `var(${colorVar})` }} />}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-text">{title}</h2>
        {status && <StatusIndicator tone={status.tone} label={status.label} />}
      </div>
      <dl className={`grid grid-cols-2 gap-x-4 gap-y-4 p-4 sm:grid-cols-3 ${wide ? 'lg:grid-cols-6' : 'lg:grid-cols-2'}`}>
        <MetricValue label="Voltage" value={formatNumber(telemetry.voltage, 1)} unit="V" />
        <MetricValue label="Current" value={formatNumber(telemetry.current, 2)} unit="A" />
        <MetricValue label="Power" value={power.value} unit={power.unit} />
        <MetricValue label="Energy" value={formatNumber(telemetry.energy, 1)} unit="kWh" />
        <MetricValue label="Frequency" value={formatNumber(telemetry.frequency, 2)} unit="Hz" />
        <MetricValue label="Power factor" value={formatNumber(telemetry.powerFactor, 2)} />
      </dl>
    </section>
  )
}

export default TelemetryCard
