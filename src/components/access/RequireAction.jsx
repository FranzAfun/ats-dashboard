import { useAccess } from '../../hooks/useAccess.js'

/** Renders children only when the current user may perform the action. */
function RequireAction({ action, children }) {
  const { canPerform } = useAccess()
  return canPerform(action) ? children : null
}

export default RequireAction
