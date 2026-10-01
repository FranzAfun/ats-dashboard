import { useContext } from 'react'
import { AccessContext } from '../app/accessContext.js'

/**
 * Centralized access helpers:
 *   canAccessPage(pageId), canPerform(actionId), canViewSection(sectionId),
 *   hasFeature(featureId), hasPermission(permission)
 */
export function useAccess() {
  const context = useContext(AccessContext)
  if (!context) throw new Error('useAccess must be used inside AccessProvider')
  return context
}
