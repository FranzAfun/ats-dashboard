import DataState from '../components/DataState.jsx'
import PageHeader from '../components/PageHeader.jsx'
import RequireSection from '../components/access/RequireSection.jsx'
import {
  AlertsSummarySection,
  FinancialSummarySection,
  HmiEntrySection,
  PowerSummarySection,
} from '../features/dashboard/DashboardSections.jsx'
import PowerFlowPanel from '../features/dashboard/PowerFlowPanel.jsx'
import SourceStatusPanel from '../features/dashboard/SourceStatusPanel.jsx'
import SystemOverviewPanel from '../features/dashboard/SystemOverviewPanel.jsx'
import { TariffPanel, TemperaturePanel } from '../features/dashboard/TariffTemperaturePanels.jsx'
import NotLiveNotice from '../features/shared/NotLiveNotice.jsx'
import { useSystemStatus } from '../hooks/useTelemetry.js'

function DashboardPage() {
  const status = useSystemStatus()

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Operational overview of the ATS: active source, source status, tariff, temperature, power flow and alerts."
      />

      <div className="grid gap-4">
        <DataState
          state={status}
          orb="connecting"
          loadingMessage="Connecting to ATS…"
          errorTitle="System status unavailable"
        >
          {(data) => (
            <div className="grid gap-4">
              <NotLiveNotice timestamp={data.timestamp} />
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <PowerFlowPanel status={data} />
                </div>
                <div className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <SystemOverviewPanel status={data} />
                  <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2 lg:col-span-1 lg:grid-cols-1 xl:grid-cols-2">
                    <TariffPanel tariff={data.tariff} />
                    <TemperaturePanel temperature={data.temperature} />
                  </div>
                </div>
              </div>
              <SourceStatusPanel status={data} />
            </div>
          )}
        </DataState>

        <div className="grid gap-4 lg:grid-cols-2">
          <RequireSection section="power">
            <PowerSummarySection />
          </RequireSection>
          <RequireSection section="alerts">
            <AlertsSummarySection />
          </RequireSection>
          <RequireSection section="financial">
            <FinancialSummarySection />
          </RequireSection>
          <RequireSection section="hmi">
            <HmiEntrySection />
          </RequireSection>
        </div>
      </div>
    </>
  )
}

export default DashboardPage
