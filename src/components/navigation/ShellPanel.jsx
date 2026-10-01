import { isMockData } from '../../services/integration/adapter.js'
import { useAccess } from '../../hooks/useAccess.js'
import MockDataBadge from '../dev/MockDataBadge.jsx'
import MockScenarioControl from '../dev/MockScenarioControl.jsx'
import MockSessionControl from '../dev/MockSessionControl.jsx'

/**
 * Footer of the sidebar/drawer: signed-in user and, in mock mode, the
 * development controls.
 */
function ShellPanel() {
  const { user } = useAccess()

  return (
    <div className="flex flex-col gap-3 border-t border-border p-4">
      {user && (
        <div className="text-sm">
          <p className="font-medium text-text">{user.name}</p>
          <p className="text-xs text-subtle capitalize">{user.role}</p>
        </div>
      )}
      {isMockData && (
        <div className="flex flex-col gap-3 rounded-md border border-border bg-canvas p-3">
          <MockDataBadge />
          <MockSessionControl />
          <MockScenarioControl />
        </div>
      )}
    </div>
  )
}

export default ShellPanel
