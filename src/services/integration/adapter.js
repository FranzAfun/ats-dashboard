import { dataSource, dataSourceConfigError } from '../../config/app.config.js'
import { createLiveAdapter } from './live/liveAdapter.js'
import { createMockAdapter } from './mock/mockAdapter.js'

/**
 * Integration adapter boundary.
 *
 *   Mock Adapter / Live Adapter
 *              ↓
 *     Application Services (src/services/*)
 *              ↓
 *            UI
 *
 * Both adapters implement the same interface. Data shapes are defined in
 * ./contract.js (04_DATA_CONTRACT.md).
 *
 * kind: "mock" | "live"
 * access:      getSession, subscribe, listUsers, listRoles, getFeatureFlags,
 *              getEffectiveAccess, updateUser, setFeatureFlag, setRolePermission
 * connection:  get(): "connecting"|"connected"|"disconnected"|"error",
 *              subscribe(listener)
 * telemetry:   subscribeSystemStatus(onData, onError) → unsubscribe
 *              subscribePowerTelemetry(onData, onError) → unsubscribe
 * alerts:      subscribeAlarms(onData, onError) → unsubscribe
 * hmi:         subscribeControlState(onData, onError) → unsubscribe
 * commands:    send(command, onUpdate) → Promise<final CommandResponse>
 * analytics:   getCostTrend(period), getSourceUsage(period),
 *              getEnergyAndCost(period), getPowerFactorLosses(period),
 *              getTransitionMetrics(), getTransitionEvents()
 * mockScenario: development scenario controls (mock only, otherwise null)
 *
 * UI code must not import adapters directly; it uses the services.
 */

if (dataSourceConfigError) {
  console.error(dataSourceConfigError)
}

export const adapter =
  dataSource === 'mock' ? createMockAdapter() : createLiveAdapter()

export const isMockData = adapter.kind === 'mock'
