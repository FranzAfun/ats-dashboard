import DataState from '../components/DataState.jsx'
import FreshnessBadge from '../components/FreshnessBadge.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { sources } from '../config/sources.config.js'
import TelemetryCard from '../features/power/TelemetryCard.jsx'
import NotLiveNotice from '../features/shared/NotLiveNotice.jsx'
import { describeSourceState } from '../features/shared/sourceState.js'
import { usePowerTelemetry, useSystemStatus } from '../hooks/useTelemetry.js'

function PowerPage() {
  const telemetry = usePowerTelemetry()
  const status = useSystemStatus()
  const sourceStatus = status.status === 'ready' ? status.data : null

  return (
    <>
      <PageHeader title="Power" description="Load, solar, grid and generator electrical telemetry." />
      <DataState
        state={telemetry}
        orb="listening"
        loadingMessage="Retrieving live telemetry…"
        errorTitle="Power telemetry unavailable"
      >
        {(data) => (
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
              <span>Telemetry</span>
              <FreshnessBadge timestamp={data.timestamp} />
            </div>
            <NotLiveNotice timestamp={data.timestamp} />
            <TelemetryCard title="Load" telemetry={data.load} wide />
            <div className="grid gap-4 lg:grid-cols-3">
              {sources.map((source) => (
                <TelemetryCard
                  key={source.id}
                  title={source.longLabel}
                  colorVar={source.colorVar}
                  telemetry={data.sources[source.id]}
                  status={
                    sourceStatus
                      ? describeSourceState(sourceStatus.sourceStatus[source.id], sourceStatus.ats.transitioning)
                      : null
                  }
                />
              ))}
            </div>
            <p className="text-xs text-subtle">
              Fields not provided by the system are shown as “—” (unavailable). The available
              fields per source depend on the confirmed integration contract.
            </p>
          </div>
        )}
      </DataState>
    </>
  )
}

export default PowerPage
