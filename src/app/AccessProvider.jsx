import { useMemo, useSyncExternalStore } from 'react'
import { authService } from '../services/auth/authService.js'
import {
  canAccessPage,
  canPerform,
  canViewSection,
  hasFeature,
  hasPermission,
} from '../utils/access.js'
import { AccessContext } from './accessContext.js'

/**
 * Provides the current user's effective access and the centralized access
 * helpers. Components must use these helpers (via useAccess) instead of
 * checking permission strings themselves.
 */
function AccessProvider({ children }) {
  const session = useSyncExternalStore(authService.subscribe, authService.getSnapshot)

  const value = useMemo(() => {
    const access = session.access
    return {
      status: session.status,
      error: session.error,
      user: access?.user ?? null,
      access,
      canAccessPage: (pageId) => canAccessPage(access, pageId),
      canPerform: (actionId) => canPerform(access, actionId),
      canViewSection: (sectionId) => canViewSection(access, sectionId),
      hasFeature: (featureId) => hasFeature(access, featureId),
      hasPermission: (permission) => hasPermission(access, permission),
    }
  }, [session])

  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>
}

export default AccessProvider
