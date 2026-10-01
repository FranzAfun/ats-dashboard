import DataState from '../components/DataState.jsx'
import PageHeader from '../components/PageHeader.jsx'
import RequireAction from '../components/access/RequireAction.jsx'
import SourceStatusPanel from '../features/dashboard/SourceStatusPanel.jsx'
import SystemOverviewPanel from '../features/dashboard/SystemOverviewPanel.jsx'
import ChangeSourceControl from '../features/hmi/ChangeSourceControl.jsx'
import InputCostControl from '../features/hmi/InputCostControl.jsx'
import NotLiveNotice from '../features/shared/NotLiveNotice.jsx'
import { useAccess } from '../hooks/useAccess.js'
import { useFreshness } from '../hooks/useFreshness.js'
import { useSystemStatus } from '../hooks/useTelemetry.js'
import { isMockData } from '../services/integration/adapter.js'

function HmiControls({ status }) {
  const { canPerform } = useAccess()
  const live = useFreshness(status.timestamp) === 'live'
  const canChangeSource = canPerform('hmi.changeSource')
  const canChangeCost = canPerform('hmi.changeCost')

  return (
    <div className="grid gap-4">
      <NotLiveNotice timestamp={status.timestamp} />
      <div className="grid gap-4 lg:grid-cols-2">
        <SystemOverviewPanel status={status} />
        <SourceStatusPanel status={status} />
      </div>
      {!canChangeSource && !canChangeCost && (
        <p className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted">
          Your account can view HMI status. No HMI actions are assigned to your account.
        </p>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        <RequireAction action="hmi.changeSource">
          <ChangeSourceControl status={status} live={live} />
        </RequireAction>
        <RequireAction action="hmi.changeCost">
          <InputCostControl live={live} />
        </RequireAction>
      </div>
    </div>
  )
}

function HmiPage() {
  const status = useSystemStatus()
  return (
    <>
      <PageHeader title="HMI Control" description="Authorized remote controls for the ATS." />
      {isMockData && (
        <p className="mb-4 rounded-md border border-info/60 bg-surface px-4 py-3 text-sm text-muted">
          <span className="font-semibold text-info">Mock commands.</span> Commands go to the mock adapter and
          never reach physical devices. The production command format is not confirmed.
        </p>
      )}
      <DataState state={status} orb="connecting" loadingMessage="Connecting to ATS…" errorTitle="HMI unavailable">
        {(data) => <HmiControls status={data} />}
      </DataState>
    </>
  )
}

export default HmiPage
