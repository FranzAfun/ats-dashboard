import { useAccess } from '../../hooks/useAccess.js'

/**
 * Renders a dashboard section only when the user has access to it.
 * Children are not mounted otherwise, so their data is never requested.
 */
function RequireSection({ section, children }) {
  const { canViewSection } = useAccess()
  return canViewSection(section) ? children : null
}

export default RequireSection
