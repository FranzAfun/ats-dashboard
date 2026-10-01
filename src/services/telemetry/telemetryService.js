import { createLiveResource } from '../../lib/liveResource.js'
import { adapter } from '../integration/adapter.js'
import { validatePowerTelemetry, validateSystemStatus } from '../integration/contract.js'

/** Live system status: active source, source states, ATS state, tariff, temperature. */
export const systemStatusResource = createLiveResource(
  adapter.telemetry.subscribeSystemStatus,
  validateSystemStatus,
)

/** Live electrical telemetry for the three sources and the load. */
export const powerTelemetryResource = createLiveResource(
  adapter.telemetry.subscribePowerTelemetry,
  validatePowerTelemetry,
)

export const connectionService = {
  subscribe: adapter.connection.subscribe,
  getSnapshot: adapter.connection.get,
}
