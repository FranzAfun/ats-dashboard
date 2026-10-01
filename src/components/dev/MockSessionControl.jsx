import { useSyncExternalStore } from 'react'
import { mockSession } from '../../services/auth/authService.js'
import Picker from '../Picker.jsx'

const subscribe = mockSession ? mockSession.subscribe : () => () => {}
const getCurrentUserId = mockSession ? mockSession.currentUserId : () => null

/**
 * Development control for switching the simulated signed-in user.
 * Rendered only when the mock adapter is active.
 */
function MockSessionControl() {
  const currentUserId = useSyncExternalStore(subscribe, getCurrentUserId)
  if (!mockSession) return null

  const options = mockSession.listUsers().map((user) => ({
    value: user.id,
    label: user.name,
    description: user.status !== 'active' ? `${user.role} · disabled` : user.role,
  }))

  return (
    <Picker
      label="Mock user"
      value={currentUserId}
      options={options}
      onChange={(userId) => mockSession.switchUser(userId)}
    />
  )
}

export default MockSessionControl
