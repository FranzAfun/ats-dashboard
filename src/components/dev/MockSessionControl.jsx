import { useId, useSyncExternalStore } from 'react'
import { mockSession } from '../../services/auth/authService.js'

const subscribe = mockSession ? mockSession.subscribe : () => () => {}
const getCurrentUserId = mockSession ? mockSession.currentUserId : () => null

/**
 * Development control for switching the simulated signed-in user.
 * Rendered only when the mock adapter is active.
 */
function MockSessionControl() {
  const selectId = useId()
  const currentUserId = useSyncExternalStore(subscribe, getCurrentUserId)

  if (!mockSession) return null
  const users = mockSession.listUsers()

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={selectId} className="text-xs font-medium text-subtle">
        Mock user
      </label>
      <select
        id={selectId}
        value={currentUserId ?? ''}
        onChange={(event) => mockSession.switchUser(event.target.value)}
        className="min-h-11 w-full rounded-md border border-control bg-canvas px-2 text-sm text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
            {user.status !== 'active' ? ' (disabled)' : ''}
          </option>
        ))}
      </select>
    </div>
  )
}

export default MockSessionControl
