import Panel from '../../components/Panel.jsx'
import { useAccess } from '../../hooks/useAccess.js'
import { useFreshness } from '../../hooks/useFreshness.js'
import { usePowerTelemetry } from '../../hooks/useTelemetry.js'
import { formatPower } from '../../utils/format.js'
import PowerFlowDiagram from './PowerFlowDiagram.jsx'

function powerLabel(watts) {
  const power = formatPower(watts)
  return power.value ? `${power.value} ${power.unit}` : undefined
}

/**
 * Adds the live power values (Power Monitoring data) to the diagram:
 * the active source's power on its flow path and the load power. Values
 * are only shown while the power telemetry itself is live.
 */
function DiagramWithLoad({ status, live }) {
  const telemetry = usePowerTelemetry()
  const data = telemetry.status === 'ready' ? telemetry.data : null
  const telemetryLive = useFreshness(data?.timestamp) === 'live'
  const valuesLive = live && telemetryLive && data !== null
  return (
    <PowerFlowDiagram
      status={status}
      live={live}
      loadPowerLabel={valuesLive ? powerLabel(data.load.power) : undefined}
      activePowerLabel={
        valuesLive && status.activeSource ? powerLabel(data.sources[status.activeSource]?.power) : undefined
      }
    />
  )
}

/**
 * The load power figure is Power Monitoring data, so it is only requested
 * and shown when that section is accessible.
 */
function PowerFlowPanel({ status }) {
  const { canViewSection } = useAccess()
  const live = useFreshness(status.timestamp) === 'live'

  return (
    <Panel
      title="Power flow"
      description="Energy path from the active source through the ATS to the load."
      bodyClassName="px-2 py-4 sm:p-4"
    >
      {canViewSection('power') ? (
        <DiagramWithLoad status={status} live={live} />
      ) : (
        <PowerFlowDiagram status={status} live={live} />
      )}
    </Panel>
  )
}

export default PowerFlowPanel
