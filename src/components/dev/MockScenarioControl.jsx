import { useSyncExternalStore } from 'react'
import { mockScenarioControls } from '../../services/integration/mockControls.js'
import Picker from '../Picker.jsx'

const subscribe = mockScenarioControls ? mockScenarioControls.subscribe : () => () => {}
const getScenario = mockScenarioControls ? mockScenarioControls.get : () => null

/**
 * Development control for exercising data states (alarms, stale data,
 * disconnection, errors, missing data, command failures).
 */
function MockScenarioControl() {
  const scenario = useSyncExternalStore(subscribe, getScenario)
  if (!mockScenarioControls) return null

  return (
    <Picker
      label="Mock scenario"
      value={scenario}
      options={mockScenarioControls.list.map((item) => ({ value: item.id, label: item.label }))}
      onChange={(id) => mockScenarioControls.set(id)}
    />
  )
}

export default MockScenarioControl
