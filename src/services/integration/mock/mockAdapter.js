import { createMockAccess } from './mockAccess.js'
import { createMockAnalytics } from './mockAnalytics.js'
import { createMockCommands } from './mockCommands.js'
import { createMockPlant } from './mockPlant.js'
import { mockScenarios, scenarioStore } from './mockScenario.js'

/**
 * Mock integration adapter for development and demonstration.
 * Implements the adapter interface documented in ../adapter.js using
 * clearly separated mock data from src/data/mock.
 */
export function createMockAdapter() {
  const access = createMockAccess()
  const plant = createMockPlant()

  return {
    kind: 'mock',
    access,
    connection: {
      get: plant.getConnection,
      subscribe: plant.subscribeConnection,
    },
    telemetry: {
      subscribeSystemStatus: (onData, onError) => plant.subscribe('status', onData, onError),
      subscribePowerTelemetry: (onData, onError) => plant.subscribe('power', onData, onError),
    },
    alerts: {
      subscribeAlarms: (onData, onError) => plant.subscribe('alarms', onData, onError),
    },
    hmi: {
      subscribeControlState: (onData, onError) => plant.subscribe('control', onData, onError),
    },
    commands: createMockCommands(plant, access.currentAccess),
    analytics: createMockAnalytics(plant),
    mockScenario: {
      list: mockScenarios,
      get: scenarioStore.get,
      set: scenarioStore.set,
      subscribe: scenarioStore.subscribe,
    },
  }
}
