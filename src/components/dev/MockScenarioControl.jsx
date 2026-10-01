import { useId, useSyncExternalStore } from 'react'
import { mockScenarioControls } from '../../services/integration/mockControls.js'

const subscribe = mockScenarioControls ? mockScenarioControls.subscribe : () => () => {}
const getScenario = mockScenarioControls ? mockScenarioControls.get : () => null

/**
 * Development control for exercising data states (alarms, stale data,
 * disconnection, errors, missing data, command failures).
 */
function MockScenarioControl() {
  const selectId = useId()
  const scenario = useSyncExternalStore(subscribe, getScenario)
  if (!mockScenarioControls) return null

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={selectId} className="text-xs font-medium text-subtle">
        Mock scenario
      </label>
      <select
        id={selectId}
        value={scenario ?? ''}
        onChange={(event) => mockScenarioControls.set(event.target.value)}
        className="min-h-11 w-full rounded-md border border-control bg-canvas px-2 text-sm text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {mockScenarioControls.list.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default MockScenarioControl
