import { adapter } from './adapter.js'

/** Development scenario controls; null when the live adapter is used. */
export const mockScenarioControls = adapter.mockScenario ?? null
