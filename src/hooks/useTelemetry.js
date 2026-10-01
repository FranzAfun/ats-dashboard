import { useSyncExternalStore } from 'react'
import { alarmsResource } from '../services/alerts/alertsService.js'
import { controlStateResource } from '../services/commands/commandService.js'
import {
  connectionService,
  powerTelemetryResource,
  systemStatusResource,
} from '../services/telemetry/telemetryService.js'
import { useLiveResource } from './useLiveResource.js'

export const useSystemStatus = () => useLiveResource(systemStatusResource)
export const usePowerTelemetry = () => useLiveResource(powerTelemetryResource)
export const useAlarms = () => useLiveResource(alarmsResource)
export const useControlState = () => useLiveResource(controlStateResource)

export function useConnectionState() {
  return useSyncExternalStore(connectionService.subscribe, connectionService.getSnapshot)
}
