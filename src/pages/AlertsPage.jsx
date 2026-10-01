import { useState } from 'react'
import DataState from '../components/DataState.jsx'
import EmptyState from '../components/EmptyState.jsx'
import PageHeader from '../components/PageHeader.jsx'
import SegmentedControl from '../components/SegmentedControl.jsx'
import AlarmList from '../features/alerts/AlarmList.jsx'
import { sortAlarms } from '../features/alerts/alarmPresentation.js'
import { useAlarms } from '../hooks/useTelemetry.js'

const emptyMessages = {
  active: { title: 'No active alarms', message: 'The system currently reports no active alarm conditions.' },
  cleared: { title: 'No cleared alarms', message: 'No cleared alarms are available from the system.' },
  all: { title: 'No alarms', message: 'The system has not reported any alarms.' },
}

function AlertsPage() {
  const alarms = useAlarms()
  const [filter, setFilter] = useState('active')

  return (
    <>
      <PageHeader title="Alerts" description="Active alarms and alarm history reported by the ATS system." />
      <DataState state={alarms} loadingMessage="Loading alarms…" errorTitle="Alarms unavailable" isEmpty={() => false}>
        {(list) => {
          const counts = {
            active: list.filter((a) => a.active).length,
            cleared: list.filter((a) => !a.active).length,
            all: list.length,
          }
          const visible = sortAlarms(
            list.filter((a) => (filter === 'all' ? true : filter === 'active' ? a.active : !a.active)),
          )
          return (
            <div className="grid gap-4">
              <SegmentedControl
                label="Alarm filter"
                value={filter}
                onChange={setFilter}
                options={[
                  { value: 'active', label: 'Active', count: counts.active },
                  { value: 'cleared', label: 'Cleared', count: counts.cleared },
                  { value: 'all', label: 'All', count: counts.all },
                ]}
              />
              {visible.length > 0 ? (
                <AlarmList alarms={visible} />
              ) : (
                <EmptyState {...emptyMessages[filter]} />
              )}
              <p className="text-xs text-subtle">
                Alarm conditions, thresholds and severities are defined by the ATS system. The
                dashboard does not create its own alarm conditions.
              </p>
            </div>
          )
        }}
      </DataState>
    </>
  )
}

export default AlertsPage
