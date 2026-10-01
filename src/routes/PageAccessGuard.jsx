import { Outlet, useMatches } from 'react-router-dom'
import { useAccess } from '../hooks/useAccess.js'
import AccessDeniedPage from '../pages/AccessDeniedPage.jsx'

/**
 * Protects routes that declare `handle.pageId`. Direct URL access to a
 * page the user cannot access renders the access-denied page instead of
 * the page, so no restricted page code or data request runs.
 */
function PageAccessGuard() {
  const matches = useMatches()
  const { canAccessPage } = useAccess()
  const pageId = matches.findLast((match) => match.handle?.pageId)?.handle.pageId

  if (pageId && !canAccessPage(pageId)) return <AccessDeniedPage />
  return <Outlet />
}

export default PageAccessGuard
