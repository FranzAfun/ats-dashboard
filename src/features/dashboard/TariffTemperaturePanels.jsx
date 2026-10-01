import MetricValue from '../../components/MetricValue.jsx'
import Panel from '../../components/Panel.jsx'
import StatusIndicator from '../../components/StatusIndicator.jsx'
import { sourceById } from '../../config/sources.config.js'
import { formatNumber } from '../../utils/format.js'
import { describeTemperatureStatus } from '../shared/sourceState.js'

export function TariffPanel({ tariff }) {
  return (
    <Panel title="Live tariff">
      {tariff ? (
        <dl className="grid gap-2">
          <MetricValue
            size="lg"
            label={`Active source: ${sourceById[tariff.source]?.label ?? 'Unknown'}`}
            value={formatNumber(tariff.rate, 2)}
            unit={`${tariff.currency}/${tariff.unit}`}
          />
        </dl>
      ) : (
        <p className="text-sm text-subtle">Tariff data is not available.</p>
      )}
    </Panel>
  )
}

export function TemperaturePanel({ temperature }) {
  const status = describeTemperatureStatus(temperature?.status)
  return (
    <Panel title="Temperature">
      {temperature ? (
        <dl className="grid gap-2">
          <MetricValue size="lg" label="ATS temperature" value={formatNumber(temperature.value, 1)} unit={temperature.unit} />
          <div>
            <dt className="sr-only">Status</dt>
            <dd>
              <StatusIndicator tone={status.tone} label={status.label} />
            </dd>
          </div>
        </dl>
      ) : (
        <p className="text-sm text-subtle">Temperature data is not available.</p>
      )}
    </Panel>
  )
}
