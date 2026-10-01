import { useCallback, useState } from 'react'
import DataState from '../components/DataState.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Panel from '../components/Panel.jsx'
import SegmentedControl from '../components/SegmentedControl.jsx'
import RequireAction from '../components/access/RequireAction.jsx'
import { buttonClasses } from '../components/buttonClasses.js'
import {
  CostTrendPanel,
  FinancialSummary,
  PowerFactorPanel,
  SourceCostsPanel,
  SourceUsagePanel,
  TransitionMetricsContent,
} from '../features/financial/FinancialPanels.jsx'
import { useAsyncData } from '../hooks/useAsyncData.js'
import { useStableLoading } from '../hooks/useStableLoading.js'
import LoadingState from '../components/LoadingState.jsx'
import { useSystemStatus } from '../hooks/useTelemetry.js'
import { analyticsService } from '../services/analytics/analyticsService.js'
import { exportService } from '../services/export/exportService.js'
import { isMockData } from '../services/integration/adapter.js'

const periodOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
]

function FinancialPage() {
  const [period, setPeriod] = useState('daily')
  const status = useSystemStatus()

  const loadPeriod = useCallback(
    () =>
      Promise.all([
        analyticsService.getCostTrend(period),
        analyticsService.getSourceUsage(period),
        analyticsService.getEnergyAndCost(period),
        analyticsService.getPowerFactorLosses(period),
      ]).then(([trend, usage, energy, losses]) => ({ trend, usage, energy, losses })),
    [period],
  )
  const loadTransitions = useCallback(
    () =>
      Promise.all([analyticsService.getTransitionMetrics(), analyticsService.getTransitionEvents()]).then(
        ([metrics, events]) => ({ metrics, events }),
      ),
    [],
  )

  const periodData = useAsyncData(loadPeriod, `financial:${period}`, { keepPrevious: true, cache: true })
  const transitions = useAsyncData(loadTransitions, 'financial:transitions', { cache: true })
  const { showLoader: showUpdating } = useStableLoading(Boolean(periodData.refreshing))

  return (
    <>
      <PageHeader
        title="Financial Analytics"
        description="Source usage, energy consumption, costs, cost trends, power-factor losses, ATS transitions and data export."
      />
      {isMockData && (
        <p className="mb-4 rounded-md border border-info/60 bg-surface px-4 py-3 text-sm text-muted">
          <span className="font-semibold text-info">Demo calculations.</span> Financial values on this page
          come from the mock adapter. The production financial calculation rules, tariffs and
          historical storage are not confirmed yet.
        </p>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl label="Period" options={periodOptions} value={period} onChange={setPeriod} />
          {showUpdating && <LoadingState size="inline" orb="solving" message="Updating…" />}
        </div>
        <RequireAction action="financial.export">
          <button
            type="button"
            className={buttonClasses.secondary}
            disabled={periodData.status !== 'ready' || periodData.refreshing}
            onClick={() => exportService.exportFinancialPeriod({ period: periodData.data.trend.period, ...periodData.data })}
          >
            Export CSV
          </button>
        </RequireAction>
      </div>

      <div className="grid gap-4">
        <DataState
          state={periodData}
          orb="solving"
          loadingMessage="Calculating financial analytics…"
          errorTitle="Financial analytics unavailable"
          isEmpty={(data) => !data?.trend?.total?.length && !data?.energy?.sources?.length}
          emptyTitle="No financial data"
          emptyMessage="The system has not provided financial data for this period."
        >
          {(data) => (
            <div className="grid gap-4">
              <FinancialSummary
                period={data.trend.period}
                energy={data.energy}
                status={status.status === 'ready' ? status.data : null}
              />
              <CostTrendPanel trend={data.trend} />
              <div className="grid gap-4 lg:grid-cols-3">
                <SourceUsagePanel usage={data.usage} period={data.trend.period} />
                <SourceCostsPanel energy={data.energy} period={data.trend.period} />
                <PowerFactorPanel losses={data.losses} period={data.trend.period} />
              </div>
            </div>
          )}
        </DataState>

        {/* Section-level loading uses the compact loader; the page-level
            loader above remains the only full-size one. */}
        <Panel title="ATS transition metrics">
          <DataState
            state={transitions}
            compact
            orb="searching"
            loadingMessage="Loading transition metrics…"
            errorTitle="Transition metrics unavailable"
            isEmpty={() => false}
          >
            {(data) => <TransitionMetricsContent metrics={data.metrics} events={data.events} />}
          </DataState>
        </Panel>
      </div>
    </>
  )
}

export default FinancialPage
