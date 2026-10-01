import { createStore } from '../../../lib/store.js'

/**
 * Development scenarios used to exercise UI states in mock mode
 * (docs/SmokeTest.md). Not available with the live adapter.
 */
export const mockScenarios = [
  { id: 'normal', label: 'Normal operation' },
  { id: 'alarm', label: 'Active alarms' },
  { id: 'stale', label: 'Stale telemetry' },
  { id: 'disconnected', label: 'Disconnected' },
  { id: 'error', label: 'Integration error' },
  { id: 'empty', label: 'Missing / empty data' },
  { id: 'commandRejected', label: 'Commands rejected' },
  { id: 'commandFailed', label: 'Commands fail' },
]

export const scenarioStore = createStore('normal')
