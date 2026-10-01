import Panel from '../../components/Panel.jsx'
import { useAccess } from '../../hooks/useAccess.js'
import { useFreshness } from '../../hooks/useFreshness.js'
import { usePowerTelemetry } from '../../hooks/useTelemetry.js'
import { formatPower } from '../../utils/format.js'
import PowerFlowDiagram from './PowerFlowDiagram.jsx'

function DiagramWithLoad({ status, live }) {
  const telemetry = usePowerTelemetry()
  const power = telemetry.status === 'ready' ? formatPower(telemetry.data.load.power) : null
  const label = power?.value ? `${power.value} ${power.unit}` : undefined
  return <PowerFlowDiagram status={status} live={live} loadPowerLabel={label} />
}

/**
 * The load power figure is Power Monitoring data, so it is only requested
 * and shown when that section is accessible.
 */
function PowerFlowPanel({ status }) {
  const { canViewSection } = useAccess()
  const live = useFreshness(status.timestamp) === 'live'

  return (
    <Panel title="Power flow" description="Energy path from the active source through the ATS to the load.">
      {canViewSection('power') ? (
        <DiagramWithLoad status={status} live={live} />
      ) : (
        <PowerFlowDiagram status={status} live={live} />
      )}
    </Panel>
  )
}

export default PowerFlowPanel
